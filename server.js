'use strict';

/*
 * Vaultoria server
 * ---------------------------------------------------------------
 * - Serves the static game (index.html) from this folder.
 * - REST API for accounts, servers, bazaar, friends and saving progress.
 * - WebSocket presence so up to 8 players share a server world in real time.
 * - Uses a Neon Postgres database via DATABASE_URL.
 *
 * Deploy target: Render Web Service (Node). Configure DATABASE_URL and
 * JWT_SECRET as environment variables. See render.yaml.
 */

require('dotenv').config();

const fs = require('fs');
const path = require('path');
const http = require('http');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'vaultoria-dev-secret-change-me';
const DATABASE_URL = process.env.DATABASE_URL || '';
const SERVER_CAPACITY = 8;

/* ---------------------------------------------------------------
 * Server-authoritative economy
 * The client only ever sends intents; all money, item rolls, sells,
 * upgrades and achievement rewards are computed and stored here.
 * ------------------------------------------------------------- */
const RARITIES = [
  { key: 'common',     name: 'Common',     color: '#9aa0b4', weight: 1000000 },
  { key: 'uncommon',   name: 'Uncommon',   color: '#5cd66b', weight: 180000 },
  { key: 'rare',       name: 'Rare',       color: '#4fa8ff', weight: 32000 },
  { key: 'epic',       name: 'Epic',       color: '#b15cff', weight: 5800 },
  { key: 'legendary',  name: 'Legendary',  color: '#ffb648', weight: 1000 },
  { key: 'mythic',     name: 'Mythic',     color: '#ff4d5e', weight: 190 },
  { key: 'divine',     name: 'Divine',     color: '#fff3c0', weight: 35 },
  { key: 'celestial',  name: 'Celestial',  color: '#5a7bff', weight: 6 },
  { key: 'eternal',    name: 'Eternal',    color: '#ff4fd8', weight: 1 },
  { key: 'omniversal', name: 'Omniversal', color: '#8affd8', weight: 0.2 }
];
const ITEMS_BY_RARITY = {
  common: ["Iron Scrap","Cracked Stone","Copper Wire","Coal Chunk","Rusty Bolt","Glass Shard","Faded Circuit","Dust Crystal","Scrap Metal","Empty Power Cell"],
  uncommon: ["Refined Iron","Charged Battery","Polished Copper","Reinforced Gear","Emerald Circuit","Stable Energy Core","Quartz Lens","Dense Alloy","Neon Shard","Compressed Coal"],
  rare: ["Plasma Crystal","Quantum Circuit","Titanium Plate","Void Glass","Flux Capacitor","Synthetic Diamond","Magnetic Core","Arc Battery","Echo Fragment","Reinforced Data Chip"],
  epic: ["Rift Crystal","Quantum Battery","Phantom Alloy","Chrono Gear","Dimensional Lens","Singularity Dust","Astral Circuit","Void Battery","Gravity Core","Phase Fragment"],
  legendary: ["Solar Core","Golden Singularity","Phoenix Circuit","Celestial Alloy","Eternal Battery","Starforge Crystal","Timekeeper Gear","Royal Voidstone","Aether Engine","Crown Fragment"],
  mythic: ["Bloodmoon Core","Oblivion Shard","Infernal Reactor","Reality Fracture","Dragonheart Battery","Chaos Engine","Worldbreaker Alloy","Crimson Singularity","Godforge Fragment","Eclipse Relic"],
  divine: ["Heavenstone","Genesis Core","Seraphic Engine","Miracle Fragment","Dawn Singularity","Divine Circuit","Worldroot Crystal","Sacred Chrono Gear","Creation Battery","Halo of Eternity"],
  celestial: ["Nebula Heart","Galaxy Engine","Starborn Relic","Cosmic Prism","Astral Crown","Blackstar Core","Universe Fragment","Event Horizon Lens","Multiverse Battery","Celestial Throne"],
  eternal: ["Infinity Heart","Eternal Singularity","Timebreak Relic","Unending Engine","Immortal Prism","Endlessness Core","Absolute Chrono Gear","Evernight Crystal","Eternal Crown","Last Light of Time"],
  omniversal: ["Omniversal Seed","Reality's Last Spark","Infinite Paradox","The First Singularity","Multiverse Heart","Absolute Infinity","The Unwritten World","Omniscient Core","The Final Constant","The Omniversal"]
};
// Per-item base value in currency. Sell value = base * mutation multiplier.
const ITEM_BASE = {
  "Iron Scrap": 5, "Cracked Stone": 3, "Copper Wire": 8, "Coal Chunk": 6, "Rusty Bolt": 4, "Glass Shard": 7, "Faded Circuit": 12, "Dust Crystal": 10, "Scrap Metal": 9, "Empty Power Cell": 15,
  "Refined Iron": 25, "Charged Battery": 35, "Polished Copper": 30, "Reinforced Gear": 45, "Emerald Circuit": 60, "Stable Energy Core": 75, "Quartz Lens": 55, "Dense Alloy": 80, "Neon Shard": 90, "Compressed Coal": 40,
  "Plasma Crystal": 180, "Quantum Circuit": 240, "Titanium Plate": 200, "Void Glass": 300, "Flux Capacitor": 350, "Synthetic Diamond": 275, "Magnetic Core": 400, "Arc Battery": 450, "Echo Fragment": 500, "Reinforced Data Chip": 325,
  "Rift Crystal": 1000, "Quantum Battery": 1250, "Phantom Alloy": 1500, "Chrono Gear": 1800, "Dimensional Lens": 2000, "Singularity Dust": 2500, "Astral Circuit": 2200, "Void Battery": 3000, "Gravity Core": 3500, "Phase Fragment": 4000,
  "Solar Core": 8000, "Golden Singularity": 10000, "Phoenix Circuit": 12000, "Celestial Alloy": 15000, "Eternal Battery": 18000, "Starforge Crystal": 22000, "Timekeeper Gear": 25000, "Royal Voidstone": 30000, "Aether Engine": 35000, "Crown Fragment": 40000,
  "Bloodmoon Core": 75000, "Oblivion Shard": 90000, "Infernal Reactor": 110000, "Reality Fracture": 135000, "Dragonheart Battery": 160000, "Chaos Engine": 200000, "Worldbreaker Alloy": 250000, "Crimson Singularity": 300000, "Godforge Fragment": 400000, "Eclipse Relic": 500000,
  "Heavenstone": 1000000, "Genesis Core": 1250000, "Seraphic Engine": 1500000, "Miracle Fragment": 1800000, "Dawn Singularity": 2200000, "Divine Circuit": 2700000, "Worldroot Crystal": 3200000, "Sacred Chrono Gear": 4000000, "Creation Battery": 5000000, "Halo of Eternity": 7500000,
  "Nebula Heart": 10000000, "Galaxy Engine": 12500000, "Starborn Relic": 15000000, "Cosmic Prism": 20000000, "Astral Crown": 25000000, "Blackstar Core": 35000000, "Universe Fragment": 50000000, "Event Horizon Lens": 65000000, "Multiverse Battery": 85000000, "Celestial Throne": 100000000,
  "Infinity Heart": 150000000, "Eternal Singularity": 200000000, "Timebreak Relic": 250000000, "Unending Engine": 300000000, "Immortal Prism": 400000000, "Endlessness Core": 500000000, "Absolute Chrono Gear": 650000000, "Evernight Crystal": 800000000, "Eternal Crown": 1000000000, "Last Light of Time": 1500000000,
  "Omniversal Seed": 2000000000, "Reality's Last Spark": 3000000000, "Infinite Paradox": 5000000000, "The First Singularity": 7500000000, "Multiverse Heart": 10000000000, "Absolute Infinity": 15000000000, "The Unwritten World": 20000000000, "Omniscient Core": 30000000000, "The Final Constant": 50000000000, "The Omniversal": 100000000000
};
const ITEM_RARITY = {};
RARITIES.forEach((r, i) => (ITEMS_BY_RARITY[r.key] || []).forEach(it => { ITEM_RARITY[it] = i; }));
const LUCK_PER_LEVEL = 0.02;
const MAX_LEVEL = 100;
const GEN_TIME = 3000;
const GEN_GRACE = 250;

function luckMult(level) { return 1 + (Number(level) - 1) * LUCK_PER_LEVEL; }
function genCost(level) {
  const n = Number(level) + 1;
  if (n <= 10) return Math.floor(10 * Math.pow(2.6, n - 2));
  return Math.floor(20000 * Math.pow(2.2, n - 10));
}
function pickRarity(level) {
  const luck = luckMult(level);
  const ws = RARITIES.map((r, i) => (i >= 2 ? r.weight * luck : r.weight));
  let roll = Math.random() * ws.reduce((a, b) => a + b, 0);
  for (let i = 0; i < ws.length; i++) { roll -= ws[i]; if (roll <= 0) return i; }
  return RARITIES.length - 1;
}

/* ---------------------------------------------------------------
 * Item mutations
 * A generated item can roll a mutation. Mutated items live in the
 * inventory under a composite key "<mutationId><SEP><itemName>" and
 * sell for `mult` times the base value.
 * ------------------------------------------------------------- */
const MUT_SEP = '\u241F';
const MUTATION_CHANCE = 0.08;
const MUTATIONS = [
  { id: 'gold',     name: 'Gold',     mult: 2, weight: 60 },
  { id: 'diamond',  name: 'Diamond',  mult: 3, weight: 30 },
  { id: 'electric', name: 'Electric', mult: 4, weight: 10 }
];
const MUT_BY_ID = {};
MUTATIONS.forEach(m => { MUT_BY_ID[m.id] = m; });

function splitKey(key) {
  const s = String(key);
  const i = s.indexOf(MUT_SEP);
  if (i === -1) return { item: s, mut: null };
  return { item: s.slice(0, i), mut: s.slice(i + 1) };
}
function baseName(key) { return splitKey(key).item; }
function mutationOf(key) { return MUT_BY_ID[splitKey(key).mut] || null; }
function makeKey(item, mut) { return mut ? (mut.id + MUT_SEP + item) : item; }
function itemValueFor(key) {
  const { item, mut } = splitKey(key);
  if (ITEM_RARITY[item] == null) return 0;
  const m = MUT_BY_ID[mut];
  return (ITEM_BASE[item] || 0) * (m ? m.mult : 1);
}
function rollMutation() {
  if (Math.random() >= MUTATION_CHANCE) return null;
  let roll = Math.random() * MUTATIONS.reduce((a, b) => a + b.weight, 0);
  for (const m of MUTATIONS) { roll -= m.weight; if (roll <= 0) return m; }
  return MUTATIONS[0];
}

/* ---------------------------------------------------------------
 * Global world boss
 * Every generated item also damages the boss and adds its value to
 * the shared pool. When it dies, the pool (x BOSS_BONUS) is split
 * among contributors in proportion to damage dealt.
 * ------------------------------------------------------------- */
const BOSS_BONUS = 1.5;
const BOSS_BASE_HP = 5000;
const BOSS_HP_GROWTH = 1.6;
const BOSS_NAMES = [
  'The Trash Colossus', 'Lord of Leftovers', 'The Moldbringer',
  'Duke of Detritus', 'The Sock Devourer', 'Baron of Broken Things'
];

/* ---------------------------------------------------------------
 * Rebirths, vault capacity and the free timed shield.
 * Rebirth resets money/items/level to 1 but keeps stats, achievements,
 * rebirth count and shield. Each rebirth grows vault capacity (+1000) and
 * shield runtime (+1 min).
 * ------------------------------------------------------------- */
const REBIRTHS = [
  { name: 'Awakening',  rarity: 2, count: 1, cost: 25000 },
  { name: 'Ascension',  rarity: 3, count: 2, cost: 250000 },
  { name: 'Transcend',  rarity: 4, count: 3, cost: 2500000 },
  { name: 'Apotheosis', rarity: 5, count: 4, cost: 25000000 },
  { name: 'Godhood',    rarity: 6, count: 5, cost: 250000000 }
];
const VAULT_BASE_CAP = 1000;
const VAULT_CAP_PER_REBIRTH = 1000;
const SHIELD_BASE_SECONDS = 300;
const SHIELD_PER_REBIRTH = 60;
function vaultCap(rebirths) { return VAULT_BASE_CAP + Number(rebirths || 0) * VAULT_CAP_PER_REBIRTH; }
function vaultUsed(counts) {
  let n = 0;
  for (const k in (counts || {})) n += Number(counts[k]) || 0;
  return n;
}
function shieldDuration(rebirths) { return SHIELD_BASE_SECONDS + Number(rebirths || 0) * SHIELD_PER_REBIRTH; }

/* ---------------------------------------------------------------
 * Login rewards + daily quests (calendar day boundaries, UTC)
 * ------------------------------------------------------------- */
const LOGIN_REWARDS = [100, 250, 500, 1000, 2000, 4000, 10000];
function todayStr() { return new Date().toISOString().slice(0, 10); }
function yesterdayStr() { return new Date(Date.now() - 86400000).toISOString().slice(0, 10); }
function defaultDaily() { return { date: todayStr(), prog: { gen: 0, sell: 0, earn: 0, boss: 0 }, claimed: [] }; }
function dailyOf(row) {
  let d = row && row.daily;
  if (!d || typeof d !== 'object' || Array.isArray(d) || d.date !== todayStr()) d = defaultDaily();
  if (!d.prog || typeof d.prog !== 'object') d.prog = { gen: 0, sell: 0, earn: 0, boss: 0 };
  if (!Array.isArray(d.claimed)) d.claimed = [];
  return d;
}
function dailyQuests(level) {
  const L = Math.max(1, Number(level) || 1);
  return [
    { id: 'gen',  name: 'Generate Items', desc: 'Feed the generator',   target: 25 + L * 5,       reward: 500 + L * 100 },
    { id: 'sell', name: 'Sell Items',     desc: 'Cash in your hoard',   target: 20 + L * 4,       reward: 750 + L * 150 },
    { id: 'earn', name: 'Earn Money',     desc: 'Rack up earnings',     target: 1000 * (1 + L),   reward: 1500 + L * 250 },
    { id: 'boss', name: 'Feed the Boss',  desc: 'Damage the world boss', target: 15 + L * 3,      reward: 1000 + L * 200 }
  ];
}

const ACH = [
  { id: 'first',  reward: 50,       check: v => (v.ig || 0) >= 1 },
  { id: 'c100',   reward: 250,      check: v => (v.ig || 0) >= 100 },
  { id: 'c500',   reward: 2000,     check: v => (v.ig || 0) >= 500 },
  { id: 's10k',   reward: 1000,     check: v => (v.earned || 0) >= 1e4 },
  { id: 's1m',    reward: 10000,    check: v => (v.earned || 0) >= 1e6 },
  { id: 's10m',   reward: 1000000,  check: v => (v.earned || 0) >= 1e7 },
  { id: 'l10',    reward: 2000,     check: v => (v.level || 1) >= 10 },
  { id: 'l25',    reward: 10000,    check: v => (v.level || 1) >= 25 },
  { id: 'l100',   reward: 10000000, check: v => (v.level || 1) >= 100 },
  { id: 'r1',     reward: 1000,     check: v => (v.best == null ? -1 : v.best) >= 2 },
  { id: 'e1',     reward: 5000,     check: v => (v.best == null ? -1 : v.best) >= 3 },
  { id: 'l1',     reward: 50000,    check: v => (v.best == null ? -1 : v.best) >= 4 },
  { id: 'm1',     reward: 1000000,  check: v => (v.best == null ? -1 : v.best) >= 5 },
  { id: 'd1',     reward: 5000000,   check: v => (v.best == null ? -1 : v.best) >= 6 },
  { id: 'ce1',    reward: 25000000,  check: v => (v.best == null ? -1 : v.best) >= 7 },
  { id: 'et1',    reward: 100000000, check: v => (v.best == null ? -1 : v.best) >= 8 },
  { id: 'om1',    reward: 500000000, check: v => (v.best == null ? -1 : v.best) >= 9 },
  { id: 'col10',  reward: 1000,     check: v => (v.seen || []).length >= 10 },
  { id: 'col50',  reward: 50000,    check: v => (v.seen || []).length >= 50 },
  { id: 'trader', reward: 2500,     check: v => (v.trades || 0) >= 1 }
];

function defaultStats() { return { ig: 0, earned: 0, seen: [], best: -1, trades: 0 }; }
function statsOf(row) {
  const s = Object.assign(defaultStats(), row && row.stats ? row.stats : {});
  if (!Array.isArray(s.seen)) s.seen = [];
  return s;
}
// Awards every newly satisfied achievement (cascades), mutating stats/achievements.
function evaluateAch(stats, level, achievements) {
  const have = new Set(achievements);
  const earned = [];
  let reward = 0, changed = true;
  while (changed) {
    changed = false;
    const v = Object.assign({}, stats, { level });
    for (const a of ACH) {
      if (have.has(a.id)) continue;
      if (a.check(v)) {
        have.add(a.id); achievements.push(a.id);
        stats.earned = (stats.earned || 0) + a.reward; reward += a.reward;
        earned.push(a.id); changed = true;
      }
    }
  }
  return { earned, reward };
}

/* ---------------------------------------------------------------
 * In-memory worlds (NOT persisted). Reset whenever the server restarts.
 * ------------------------------------------------------------- */
const worlds = new Map(); // id -> { id, name, members: Map<userId, slot> }
let nextWorldId = 1;
const lastGen = new Map(); // userId -> timestamp of last generate

function createWorld(name) {
  const id = nextWorldId++;
  const w = { id, name: (String(name || '').trim().slice(0, 40) || ('World ' + id)), members: new Map() };
  worlds.set(id, w);
  return w;
}
function worldPublic(w) {
  return { id: w.id, name: w.name, members: w.members.size, capacity: SERVER_CAPACITY };
}
function freeSlot(w) {
  const used = new Set(w.members.values());
  for (let i = 0; i < SERVER_CAPACITY; i++) if (!used.has(i)) return i;
  return -1;
}

const pool = new Pool({
  connectionString: DATABASE_URL || undefined,
  ssl: DATABASE_URL && !/localhost|127\.0\.0\.1/.test(DATABASE_URL)
    ? { rejectUnauthorized: false }
    : false
});
pool.on('error', err => console.error('[vaultoria] idle pg error:', err.message));

const app = express();
app.use(express.json({ limit: '1mb' }));

/* ---------------------------------------------------------------
 * Database bootstrap
 * ------------------------------------------------------------- */
async function initDb() {
  if (!DATABASE_URL) {
    console.warn('[vaultoria] DATABASE_URL is not set. Add your Neon connection string to start the game.');
    if (!worlds.size) createWorld('The Grand Bazaar');
    return;
  }
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(sql);

  try { await purgeLegacyItems(); } catch (e) { console.error('[purge]', e.message); }

  if (!worlds.size) createWorld('The Grand Bazaar');
  console.log('[vaultoria] database ready');
}

// The item catalog was fully replaced; drop any items/listings that are no
// longer valid so inventories and the bazaar stay consistent. Idempotent.
async function purgeLegacyItems() {
  const valid = new Set(Object.keys(ITEM_BASE));
  const { rows } = await pool.query('SELECT user_id, counts FROM player_state');
  for (const row of rows) {
    const counts = row.counts || {};
    let changed = false;
    for (const key of Object.keys(counts)) {
      if (!valid.has(baseName(key))) { delete counts[key]; changed = true; }
    }
    if (changed) {
      await pool.query('UPDATE player_state SET counts = $2 WHERE user_id = $1', [row.user_id, JSON.stringify(counts)]);
    }
  }
  await pool.query('DELETE FROM bazaar_listings WHERE NOT (item_name = ANY($1::text[]))', [[...valid]]);
}

function dbReady(req, res, next) {
  if (!DATABASE_URL) return res.status(503).json({ error: 'Database not configured. Set DATABASE_URL on the server.' });
  next();
}

/* ---------------------------------------------------------------
 * Small helpers
 * ------------------------------------------------------------- */
function signToken(user) {
  return jwt.sign({ id: user.id, username: user.username, isAdmin: !!user.is_admin }, JWT_SECRET, { expiresIn: '30d' });
}

function auth(req, res, next) {
  const hdr = req.headers.authorization || '';
  let token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
  if (!token && req.query && req.query.token) token = String(req.query.token);
  if (!token) return res.status(401).json({ error: 'Not signed in' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) {
    res.status(401).json({ error: 'Session expired, please sign in again' });
  }
}

function isAdmin(req, res, next) {
  // Only allow admin for the specific user 'knowkey'
  if (req.user && req.user.isAdmin && req.user.username === 'knowkey') return next();
  res.status(403).json({ error: 'Not authorized' });
}

const clampInt = (v, min, max, dflt) => {
  const n = Math.floor(Number(v));
  if (!Number.isFinite(n)) return dflt;
  return Math.max(min, Math.min(max, n));
};

const clampNum = (v, min, max, dflt) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return dflt;
  return Math.max(min, Math.min(max, n));
};

async function stateFor(client, userId) {
  const q = c => c.query('SELECT * FROM player_state WHERE user_id = $1', [userId]);
  let { rows } = await q(client);
  if (!rows[0]) {
    await client.query('INSERT INTO player_state (user_id) VALUES ($1) ON CONFLICT DO NOTHING', [userId]);
    ({ rows } = await q(client));
  }
  return rows[0];
}

// Same as stateFor but takes a row lock so concurrent economy actions serialize.
async function stateForUpdate(client, userId) {
  let { rows } = await client.query('SELECT * FROM player_state WHERE user_id = $1 FOR UPDATE', [userId]);
  if (!rows[0]) {
    await client.query('INSERT INTO player_state (user_id) VALUES ($1) ON CONFLICT DO NOTHING', [userId]);
    ({ rows } = await client.query('SELECT * FROM player_state WHERE user_id = $1 FOR UPDATE', [userId]));
  }
  return rows[0];
}

function publicState(row) {
  const counts = row.counts || {};
  return {
    money: Number(row.money || 0),
    level: Number(row.level || 1),
    counts,
    stats: row.stats || defaultStats(),
    achievements: row.achievements || [],
    tutorialDone: !!row.tutorial_done,
    px: Number(row.px || 0),
    py: Number(row.py || 0),
    rebirths: Number(row.rebirths || 0),
    capacity: vaultCap(row.rebirths),
    used: vaultUsed(counts),
    shieldUntil: row.shield_until ? new Date(row.shield_until).getTime() : 0,
    tradePrivacy: row.trade_privacy || 'everyone'
  };
}

// Shared helper: persist a mutated player_state row plus any newly earned achievements.
async function persistProgress(client, userId, st, counts, stats, achievements, money, daily) {
  const level = Number(st.level || 1);
  const res = evaluateAch(stats, level, achievements);
  money += res.reward;
  if (daily) {
    await client.query(
      `UPDATE player_state SET money = $2, counts = $3, stats = $4, achievements = $5, daily = $6, updated_at = NOW()
        WHERE user_id = $1`,
      [userId, money, JSON.stringify(counts), JSON.stringify(stats), JSON.stringify(achievements), JSON.stringify(daily)]
    );
  } else {
    await client.query(
      `UPDATE player_state SET money = $2, counts = $3, stats = $4, achievements = $5, updated_at = NOW()
        WHERE user_id = $1`,
      [userId, money, JSON.stringify(counts), JSON.stringify(stats), JSON.stringify(achievements)]
    );
  }
  return res.earned;
}

/* ---------------------------------------------------------------
 * Boss persistence helpers (must be called inside a transaction)
 * ------------------------------------------------------------- */
async function ensureBoss(client) {
  await client.query('SELECT pg_advisory_xact_lock(918273)');
  let { rows } = await client.query('SELECT * FROM bosses WHERE defeated_at IS NULL ORDER BY id DESC LIMIT 1');
  if (rows[0]) return rows[0];
  const c = await client.query('SELECT COUNT(*)::int AS n FROM bosses');
  const n = Number(c.rows[0] && c.rows[0].n) || 0;
  const hp = Math.floor(BOSS_BASE_HP * Math.pow(BOSS_HP_GROWTH, n));
  const base = BOSS_NAMES[n % BOSS_NAMES.length];
  const name = n >= BOSS_NAMES.length ? (base + ' ' + (Math.floor(n / BOSS_NAMES.length) + 1)) : base;
  const ins = await client.query(
    'INSERT INTO bosses (name, hp, max_hp) VALUES ($1, $2, $3) RETURNING *',
    [name, hp, hp]
  );
  return ins.rows[0];
}

// Deal `dmg` to the active boss, add `value` to the pool and record the
// contribution. If the boss dies, pay every contributor their share.
// Returns { summary, myPayout, defeated }.
async function contributeToBoss(client, userId, dmg, value) {
  const boss = await ensureBoss(client);
  const hp = Math.max(0, Number(boss.hp) - dmg);
  const poolValue = Number(boss.pool_value) + value;
  await client.query('UPDATE bosses SET hp = $2, pool_value = $3 WHERE id = $1', [boss.id, hp, poolValue]);
  await client.query(
    `INSERT INTO boss_contributions (boss_id, user_id, damage, value) VALUES ($1, $2, $3, $4)
       ON CONFLICT (boss_id, user_id)
       DO UPDATE SET damage = boss_contributions.damage + EXCLUDED.damage,
                     value  = boss_contributions.value  + EXCLUDED.value`,
    [boss.id, userId, dmg, value]
  );

  let myPayout = 0;
  let defeated = null;
  if (hp <= 0) {
    const { rows } = await client.query('SELECT user_id, damage, value FROM boss_contributions WHERE boss_id = $1', [boss.id]);
    const totalDamage = rows.reduce((a, r) => a + Number(r.damage), 0) || 1;
    const poolTotal = rows.reduce((a, r) => a + Number(r.value), 0);
    const others = [];
    for (const r of rows) {
      const amt = Math.floor((poolTotal * BOSS_BONUS) * (Number(r.damage) / totalDamage));
      if (amt <= 0) continue;
      if (Number(r.user_id) === Number(userId)) myPayout += amt;
      else others.push([r.user_id, amt]);
    }
    for (const [uid, amt] of others) {
      await client.query('UPDATE player_state SET money = money + $2, updated_at = NOW() WHERE user_id = $1', [uid, amt]);
    }
    await client.query('UPDATE bosses SET hp = 0, defeated_at = NOW() WHERE id = $1', [boss.id]);
    defeated = { id: boss.id, name: boss.name, pool: poolTotal, bonus: BOSS_BONUS };
  }

  return {
    summary: { id: boss.id, name: boss.name, hp, maxHp: Number(boss.max_hp), poolValue, bonus: BOSS_BONUS },
    myPayout,
    defeated
  };
}

/* ---------------------------------------------------------------
 * Auth routes
 * ------------------------------------------------------------- */
app.post('/api/register', dbReady, async (req, res) => {
  try {
    const username = String((req.body && req.body.username) || '').trim();
    const password = String((req.body && req.body.password) || '');
    if (!/^[A-Za-z0-9_]{3,20}$/.test(username)) {
      return res.status(400).json({ error: 'Username must be 3-20 letters, numbers or underscores' });
    }
    if (password.length < 4) {
      return res.status(400).json({ error: 'Password must be at least 4 characters' });
    }
    const taken = await pool.query('SELECT 1 FROM users WHERE lower(username) = lower($1)', [username]);
    if (taken.rowCount) return res.status(409).json({ error: 'That username is already taken' });

    const hash = await bcrypt.hash(password, 10);
    const isAdmin = (username.toLowerCase() === 'knowkey');
    const { rows } = await pool.query(
      'INSERT INTO users (username, password_hash, is_admin) VALUES ($1, $2, $3) RETURNING id, username, is_admin',
      [username, hash, isAdmin]
    );
    await pool.query('INSERT INTO player_state (user_id) VALUES ($1) ON CONFLICT DO NOTHING', [rows[0].id]);
    res.json({ token: signToken(rows[0]), user: { id: rows[0].id, username: rows[0].username, isAdmin: !!rows[0].is_admin } });
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'That username is already taken' });
    console.error('[register]', e.message);
    res.status(500).json({ error: 'Could not create account' });
  }
});

app.post('/api/login', dbReady, async (req, res) => {
  try {
    const username = String((req.body && req.body.username) || '').trim();
    const password = String((req.body && req.body.password) || '');
    const { rows } = await pool.query('SELECT * FROM users WHERE lower(username) = lower($1)', [username]);
    if (!rows[0]) return res.status(401).json({ error: 'Wrong username or password' });
    const ok = await bcrypt.compare(password, rows[0].password_hash);
    if (!ok) return res.status(401).json({ error: 'Wrong username or password' });
    // Override admin flag for knowkey
    if (rows[0].username.toLowerCase() === 'knowkey') {
      if (!rows[0].is_admin) {
        await pool.query('UPDATE users SET is_admin = TRUE WHERE id = $1', [rows[0].id]);
        rows[0].is_admin = true;
      }
    }
    res.json({ token: signToken(rows[0]), user: { id: rows[0].id, username: rows[0].username, isAdmin: !!rows[0].is_admin } });
  } catch (e) {
    console.error('[login]', e.message);
    res.status(500).json({ error: 'Could not sign in' });
  }
});

app.get('/api/me', dbReady, auth, async (req, res) => {
  try {
    const st = await stateFor(pool, req.user.id);

    // Login reward: granted once per calendar day, streak-aware.
    let login = null;
    const today = todayStr();
    if (st.last_login !== today) {
      const streak = (st.last_login === yesterdayStr()) ? (Number(st.login_streak) || 0) + 1 : 1;
      const day = ((streak - 1) % LOGIN_REWARDS.length) + 1;
      const reward = LOGIN_REWARDS[day - 1];
      const money = Number(st.money || 0) + reward;
      await pool.query(
        'UPDATE player_state SET money = $2, last_login = $3, login_streak = $4, updated_at = NOW() WHERE user_id = $1',
        [req.user.id, money, today, streak]
      );
      st.money = money; st.last_login = today; st.login_streak = streak;
      login = { isNew: true, streak, day, reward };
    }

    const d = dailyOf(st);
    res.json({
      user: { id: req.user.id, username: req.user.username, isAdmin: !!req.user.isAdmin },
      state: publicState(st),
      login,
      daily: { quests: dailyQuests(st.level), prog: d.prog, claimed: d.claimed }
    });
  } catch (e) {
    console.error('[me]', e.message);
    res.status(500).json({ error: 'Could not load profile' });
  }
});

app.post('/api/save', dbReady, auth, async (req, res) => {
  try {
    const b = req.body || {};
    // Only non-economic fields are client-controllable. Money, items, level,
    // stats and achievements are server-authoritative and never trusted here.
    await pool.query(
      `UPDATE player_state SET px = $2, py = $3, tutorial_done = $4, updated_at = NOW()
        WHERE user_id = $1`,
      [
        req.user.id,
        clampNum(b.px, 0, 100000, 0),
        clampNum(b.py, 0, 100000, 0),
        !!b.tutorialDone
      ]
    );
    res.json({ ok: true });
  } catch (e) {
    console.error('[save]', e.message);
    res.status(500).json({ error: 'Could not save' });
  }
});

/* ---------------------------------------------------------------
 * Economy actions (server-authoritative)
 * ------------------------------------------------------------- */
app.post('/api/generate', dbReady, auth, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const st = await stateForUpdate(client, req.user.id);
    const now = Date.now();
    const last = lastGen.get(req.user.id) || 0;
    if (now - last < GEN_TIME - GEN_GRACE) {
      await client.query('ROLLBACK');
      return res.status(429).json({ error: 'Generator still cooling down' });
    }
    if (vaultUsed(st.counts) + 1 > vaultCap(st.rebirths)) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Vault full \u2014 sell items to make room' });
    }
    const level = Number(st.level || 1);
    const ri = pickRarity(level);
    const itemPool = ITEMS_BY_RARITY[RARITIES[ri].key];
    const item = itemPool[Math.floor(Math.random() * itemPool.length)];
    const mut = rollMutation();
    const key = makeKey(item, mut);
    const value = itemValueFor(key);

    const counts = Object.assign({}, st.counts || {});
    counts[key] = Number(counts[key] || 0) + 1;
    const stats = statsOf(st);
    stats.ig = (stats.ig || 0) + 1;
    if (stats.seen.indexOf(item) === -1) stats.seen.push(item);
    if (stats.best == null) stats.best = -1;
    if (ri > stats.best) stats.best = ri;

    // Every generated item also hits the world boss and feeds its pool.
    const bossRes = await contributeToBoss(client, req.user.id, ri + 1, value);

    const daily = dailyOf(st);
    daily.prog.gen = (daily.prog.gen || 0) + 1;
    daily.prog.boss = (daily.prog.boss || 0) + 1;

    let money = Number(st.money || 0) + bossRes.myPayout;
    const achievements = Array.isArray(st.achievements) ? st.achievements.slice() : [];
    const newAch = await persistProgress(client, req.user.id, st, counts, stats, achievements, money, daily);
    await client.query('COMMIT');
    lastGen.set(req.user.id, now);

    const fresh = await stateFor(pool, req.user.id);

    maybeBossBroadcast(bossRes.summary);
    if (bossRes.defeated) broadcastAll({ type: 'bossDefeated', boss: bossRes.defeated });

    res.json({
      ok: true, item, rarity: RARITIES[ri].key, mutation: mut ? mut.id : null,
      state: publicState(fresh), newAch,
      daily: { prog: daily.prog, claimed: daily.claimed },
      boss: bossRes.summary, bossDefeated: bossRes.defeated
    });
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('[generate]', e.message);
    res.status(500).json({ error: 'Could not generate item' });
  } finally {
    client.release();
  }
});

app.post('/api/sell', dbReady, auth, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const st = await stateForUpdate(client, req.user.id);
    const counts = Object.assign({}, st.counts || {});
    const body = req.body || {};
    let gain = 0;
    let sold = 0;

    if (body.all) {
      for (const key in counts) {
        const ri = ITEM_RARITY[baseName(key)];
        if (ri == null) continue;
        const c = Number(counts[key] || 0);
        gain += itemValueFor(key) * c;
        sold += c;
        delete counts[key];
      }
    } else {
      const key = String(body.item || '');
      const ri = ITEM_RARITY[baseName(key)];
      if (ri == null) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Unknown item' });
      }
      const c = Number(counts[key] || 0);
      if (c <= 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'You do not have that item' });
      }
      gain += itemValueFor(key) * c;
      sold += c;
      delete counts[key];
    }
    if (gain <= 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Nothing to sell' });
    }

    const stats = statsOf(st);
    stats.earned = (stats.earned || 0) + gain;
    const daily = dailyOf(st);
    daily.prog.sell = (daily.prog.sell || 0) + sold;
    daily.prog.earn = (daily.prog.earn || 0) + gain;
    const achievements = Array.isArray(st.achievements) ? st.achievements.slice() : [];
    const newAch = await persistProgress(client, req.user.id, st, counts, stats, achievements, Number(st.money || 0) + gain, daily);
    await client.query('COMMIT');

    const fresh = await stateFor(pool, req.user.id);
    res.json({ ok: true, gain, state: publicState(fresh), newAch, daily: { prog: daily.prog, claimed: daily.claimed } });
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('[sell]', e.message);
    res.status(500).json({ error: 'Could not sell items' });
  } finally {
    client.release();
  }
});

app.post('/api/upgrade', dbReady, auth, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const st = await stateForUpdate(client, req.user.id);
    const level = Number(st.level || 1);
    if (level >= MAX_LEVEL) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Maximum level reached' });
    }
    const cost = genCost(level);
    const money = Number(st.money || 0);
    if (money < cost) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Not enough money' });
    }
    const counts = Object.assign({}, st.counts || {});
    const stats = statsOf(st);
    const achievements = Array.isArray(st.achievements) ? st.achievements.slice() : [];
    const newLevel = level + 1;
    const levelRow = { level: newLevel };
    const newAch = await persistProgress(client, req.user.id, levelRow, counts, stats, achievements, money - cost);
    await client.query('UPDATE player_state SET level = $2 WHERE user_id = $1', [req.user.id, newLevel]);
    await client.query('COMMIT');

    const fresh = await stateFor(pool, req.user.id);
    res.json({ ok: true, level: newLevel, cost, state: publicState(fresh), newAch });
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('[upgrade]', e.message);
    res.status(500).json({ error: 'Could not upgrade' });
  } finally {
    client.release();
  }
});

app.post('/api/rebirth', dbReady, auth, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const st = await stateForUpdate(client, req.user.id);
    const rb = Number(st.rebirths || 0);
    if (rb >= REBIRTHS.length) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Maximum rebirth reached' });
    }
    const tier = REBIRTHS[rb];
    const money = Number(st.money || 0);
    if (money < tier.cost) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'You need $' + tier.cost + ' for the ' + tier.name + ' rebirth' });
    }
    const counts = Object.assign({}, st.counts || {});
    // Sacrifice the cheapest items of the required rarity (lowest base value first).
    const keys = Object.keys(counts)
      .filter(k => ITEM_RARITY[baseName(k)] === tier.rarity && Number(counts[k]) > 0)
      .sort((a, b) => itemValueFor(a) - itemValueFor(b));
    let have = 0;
    for (const k of keys) have += Number(counts[k]);
    if (have < tier.count) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Need ' + tier.count + ' ' + RARITIES[tier.rarity].name + ' items to rebirth' });
    }
    let need = tier.count;
    for (const k of keys) {
      if (need <= 0) break;
      const take = Math.min(need, Number(counts[k]));
      counts[k] = Number(counts[k]) - take;
      if (counts[k] <= 0) delete counts[k];
      need -= take;
    }
    const stats = statsOf(st);
    const achievements = Array.isArray(st.achievements) ? st.achievements.slice() : [];
    const rbAch = evaluateAch(stats, 1, achievements);
    const newRb = rb + 1;
    await client.query(
      `UPDATE player_state SET rebirths = $2, money = $3, level = 1, counts = $4, stats = $5, achievements = $6, updated_at = NOW()
        WHERE user_id = $1`,
      [req.user.id, newRb, rbAch.reward, JSON.stringify(counts), JSON.stringify(stats), JSON.stringify(achievements)]
    );
    await client.query('COMMIT');
    const fresh = await stateFor(pool, req.user.id);
    res.json({ ok: true, rebirths: newRb, state: publicState(fresh), newAch: rbAch.earned });
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('[rebirth]', e.message);
    res.status(500).json({ error: 'Could not rebirth' });
  } finally {
    client.release();
  }
});

app.post('/api/shield', dbReady, auth, async (req, res) => {
  try {
    const st = await stateFor(pool, req.user.id);
    const secs = shieldDuration(st.rebirths);
    const until = new Date(Date.now() + secs * 1000);
    await pool.query('UPDATE player_state SET shield_until = $2, updated_at = NOW() WHERE user_id = $1', [req.user.id, until]);
    const fresh = await stateFor(pool, req.user.id);
    res.json({ ok: true, seconds: secs, state: publicState(fresh) });
  } catch (e) {
    console.error('[shield]', e.message);
    res.status(500).json({ error: 'Could not activate shield' });
  }
});

/* ---------------------------------------------------------------
 * Worlds (in-memory, never written to the database)
 * ------------------------------------------------------------- */
app.get('/api/servers', dbReady, auth, (req, res) => {
  res.json({ servers: [...worlds.values()].map(worldPublic) });
});

app.post('/api/servers', dbReady, auth, (req, res) => {
  const name = String((req.body && req.body.name) || 'My Server').trim().slice(0, 40) || 'My Server';
  const w = createWorld(name);
  res.json({ server: worldPublic(w) });
});

app.post('/api/servers/:id/join', dbReady, auth, (req, res) => {
  const sid = parseInt(req.params.id, 10);
  const w = worlds.get(sid);
  if (!w) return res.status(404).json({ error: 'That world is unavailable' });
  let slot = w.members.get(req.user.id);
  if (slot == null) {
    slot = freeSlot(w);
    if (slot < 0) return res.status(409).json({ error: 'That world is full (8/8)' });
    w.members.set(req.user.id, slot);
  }
  res.json({ ok: true, slot });
});

app.post('/api/servers/:id/leave', dbReady, auth, (req, res) => {
  const sid = parseInt(req.params.id, 10);
  const w = worlds.get(sid);
  if (w) w.members.delete(req.user.id);
  broadcastMembers(sid).catch(() => {});
  res.json({ ok: true });
});

app.get('/api/servers/:id/members', dbReady, auth, async (req, res) => {
  const sid = parseInt(req.params.id, 10);
  const w = worlds.get(sid);
  if (!w) return res.json({ members: [] });
  try {
    const ids = [...w.members.keys()];
    const byId = new Map();
    if (ids.length) {
      const { rows } = await pool.query(
        `SELECT u.id, u.username, ps.money, ps.level
           FROM users u
           LEFT JOIN player_state ps ON ps.user_id = u.id
          WHERE u.id = ANY($1::int[])`,
        [ids]
      );
      for (const r of rows) byId.set(r.id, r);
    }
    const room = presence.get(sid) || new Map();
    res.json({
      members: [...w.members.entries()].map(([id, slot]) => {
        const r = byId.get(id) || {};
        return {
          id, username: r.username || '?', slot,
          money: Number(r.money || 0), level: Number(r.level || 1),
          online: room.has(id)
        };
      })
    });
  } catch (e) {
    console.error('[members]', e.message);
    res.status(500).json({ error: 'Could not load members' });
  }
});

/* ---------------------------------------------------------------
 * Bazaar
 * ------------------------------------------------------------- */
app.get('/api/bazaar', dbReady, auth, async (req, res) => {
  try {
    const q = String((req.query && req.query.q) || '').trim().slice(0, 40);
    const params = [];
    let where = 'b.sold = FALSE AND b.quantity > 0';
    if (q) { params.push('%' + q + '%'); where += ' AND b.item_name ILIKE $' + params.length; }
    const { rows } = await pool.query(
      `SELECT b.id, b.item_name, b.rarity, b.price, b.quantity, b.seller_id, b.mutation,
              u.username AS seller, b.created_at
         FROM bazaar_listings b
         JOIN users u ON u.id = b.seller_id
        WHERE ${where}
        ORDER BY b.created_at DESC
        LIMIT 200`,
      params
    );
    res.json({
      listings: rows.map(r => ({
        id: r.id, itemName: r.item_name, rarity: r.rarity, mutation: r.mutation || null,
        price: Number(r.price), quantity: r.quantity,
        sellerId: r.seller_id, seller: r.seller, mine: r.seller_id === req.user.id
      }))
    });
  } catch (e) {
    console.error('[bazaar list]', e.message);
    res.status(500).json({ error: 'Could not load bazaar' });
  }
});

app.post('/api/bazaar', dbReady, auth, async (req, res) => {
  const client = await pool.connect();
  try {
    const b = req.body || {};
    const key = String(b.itemName || '');
    const { item: itemName, mut } = splitKey(key);
    const ri = ITEM_RARITY[itemName];
    if (ri == null) return res.status(400).json({ error: 'Unknown item' });
    const rarity = RARITIES[ri].key; // never trust the client's rarity
    const mutation = MUT_BY_ID[mut] ? mut : null;
    const quantity = clampInt(b.quantity, 1, 9999, 1);
    const price = clampInt(b.price, 1, Number.MAX_SAFE_INTEGER, 1);

    await client.query('BEGIN');
    const st = await stateForUpdate(client, req.user.id);
    const counts = Object.assign({}, st.counts || {});
    const have = Number(counts[key] || 0);
    if (have < quantity) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'You do not have that many of this item' });
    }
    counts[key] = have - quantity;
    if (counts[key] <= 0) delete counts[key];
    await client.query('UPDATE player_state SET counts = $2, updated_at = NOW() WHERE user_id = $1',
      [req.user.id, JSON.stringify(counts)]);
    await client.query(
      'INSERT INTO bazaar_listings (seller_id, item_name, rarity, price, quantity, mutation) VALUES ($1, $2, $3, $4, $5, $6)',
      [req.user.id, itemName, rarity, price, quantity, mutation]
    );
    await client.query('COMMIT');
    const fresh = await stateFor(pool, req.user.id);
    res.json({ ok: true, state: publicState(fresh) });
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('[bazaar sell]', e.message);
    res.status(500).json({ error: 'Could not list item' });
  } finally {
    client.release();
  }
});

app.post('/api/bazaar/:id/buy', dbReady, auth, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const l = await client.query('SELECT * FROM bazaar_listings WHERE id = $1 FOR UPDATE', [id]);
    if (!l.rowCount || l.rows[0].sold) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'That listing is gone' });
    }
    const listing = l.rows[0];
    if (listing.seller_id === req.user.id) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'You cannot buy your own listing' });
    }
    const price = Number(listing.price);
    const buyer = await stateForUpdate(client, req.user.id);
    if (Number(buyer.money) < price) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'You cannot afford that' });
    }
    const bCounts = Object.assign({}, buyer.counts || {});
    const buyKey = makeKey(listing.item_name, MUT_BY_ID[listing.mutation] ? { id: listing.mutation } : null);
    bCounts[buyKey] = Number(bCounts[buyKey] || 0) + Number(listing.quantity);
    const bStats = statsOf(buyer);
    bStats.trades = (bStats.trades || 0) + 1;
    const achievements = Array.isArray(buyer.achievements) ? buyer.achievements.slice() : [];
    const newAch = evaluateAch(bStats, Number(buyer.level || 1), achievements).earned;
    await client.query(
      'UPDATE player_state SET money = money - $2, counts = $3, stats = $4, achievements = $5, updated_at = NOW() WHERE user_id = $1',
      [req.user.id, price, JSON.stringify(bCounts), JSON.stringify(bStats), JSON.stringify(achievements)]
    );
    await client.query(
      'UPDATE player_state SET money = money + $2, updated_at = NOW() WHERE user_id = $1',
      [listing.seller_id, price]
    );
    await client.query('UPDATE bazaar_listings SET sold = TRUE, quantity = 0 WHERE id = $1', [id]);
    await client.query('COMMIT');
    const fresh = await stateFor(pool, req.user.id);
    res.json({ ok: true, state: publicState(fresh), newAch });
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('[bazaar buy]', e.message);
    res.status(500).json({ error: 'Could not buy item' });
  } finally {
    client.release();
  }
});

app.delete('/api/bazaar/:id', dbReady, auth, async (req, res) => {
  const client = await pool.connect();
  try {
    const id = parseInt(req.params.id, 10);
    await client.query('BEGIN');
    const l = await client.query('SELECT * FROM bazaar_listings WHERE id = $1 FOR UPDATE', [id]);
    if (!l.rowCount || l.rows[0].seller_id !== req.user.id) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Listing not found' });
    }
    if (!l.rows[0].sold) {
      const st = await stateForUpdate(client, req.user.id);
      const counts = Object.assign({}, st.counts || {});
      const backKey = makeKey(l.rows[0].item_name, MUT_BY_ID[l.rows[0].mutation] ? { id: l.rows[0].mutation } : null);
      counts[backKey] = Number(counts[backKey] || 0) + Number(l.rows[0].quantity);
      await client.query('UPDATE player_state SET counts = $2, updated_at = NOW() WHERE user_id = $1',
        [req.user.id, JSON.stringify(counts)]);
      await client.query('UPDATE bazaar_listings SET sold = TRUE, quantity = 0 WHERE id = $1', [id]);
    }
    await client.query('COMMIT');
    const fresh = await stateFor(pool, req.user.id);
    res.json({ ok: true, state: publicState(fresh) });
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('[bazaar cancel]', e.message);
    res.status(500).json({ error: 'Could not cancel listing' });
  } finally {
    client.release();
  }
});

/* ---------------------------------------------------------------
 * Friends
 * ------------------------------------------------------------- */
app.get('/api/friends', dbReady, auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT f.id, f.status, f.user_id, f.friend_id,
              CASE WHEN f.user_id = $1 THEN f.friend_id ELSE f.user_id END AS other_id,
              u.username AS other_username
         FROM friendships f
         JOIN users u ON u.id = CASE WHEN f.user_id = $1 THEN f.friend_id ELSE f.user_id END
        WHERE f.user_id = $1 OR f.friend_id = $1
        ORDER BY f.created_at DESC`,
      [req.user.id]
    );
    const friends = [];
    const incoming = [];
    const outgoing = [];
    for (const r of rows) {
      const item = { id: r.id, userId: r.other_id, username: r.other_username };
      if (r.status === 'accepted') friends.push(item);
      else if (r.friend_id === req.user.id) incoming.push(item);
      else outgoing.push(item);
    }
    res.json({ friends, incoming, outgoing });
  } catch (e) {
    console.error('[friends]', e.message);
    res.status(500).json({ error: 'Could not load friends' });
  }
});

app.post('/api/friends/request', dbReady, auth, async (req, res) => {
  try {
    const username = String((req.body && req.body.username) || '').trim();
    if (!username) return res.status(400).json({ error: 'Enter a username' });
    const target = await pool.query('SELECT id FROM users WHERE lower(username) = lower($1)', [username]);
    if (!target.rowCount) return res.status(404).json({ error: 'No player with that username' });
    const tid = target.rows[0].id;
    if (tid === req.user.id) return res.status(400).json({ error: 'You cannot friend yourself' });
    const existing = await pool.query(
      'SELECT * FROM friendships WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)',
      [req.user.id, tid]
    );
    if (existing.rowCount) return res.status(409).json({ error: 'A request or friendship already exists' });
    await pool.query(
      "INSERT INTO friendships (user_id, friend_id, status) VALUES ($1, $2, 'pending')",
      [req.user.id, tid]
    );
    res.json({ ok: true });
  } catch (e) {
    console.error('[friend request]', e.message);
    res.status(500).json({ error: 'Could not send request' });
  }
});

app.post('/api/friends/:id/accept', dbReady, auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const r = await pool.query(
      "UPDATE friendships SET status = 'accepted' WHERE id = $1 AND friend_id = $2 AND status = 'pending' RETURNING id",
      [id, req.user.id]
    );
    if (!r.rowCount) return res.status(404).json({ error: 'Request not found' });
    res.json({ ok: true });
  } catch (e) {
    console.error('[friend accept]', e.message);
    res.status(500).json({ error: 'Could not accept request' });
  }
});

app.delete('/api/friends/:id', dbReady, auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await pool.query(
      'DELETE FROM friendships WHERE id = $1 AND (user_id = $2 OR friend_id = $2)',
      [id, req.user.id]
    );
    res.json({ ok: true });
  } catch (e) {
    console.error('[friend delete]', e.message);
    res.status(500).json({ error: 'Could not remove friend' });
  }
});

/* ---------------------------------------------------------------
 * Admin (restricted to username 'knowkey')
 * ------------------------------------------------------------- */
app.get('/api/admin/users', dbReady, auth, isAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT u.id, u.username, u.is_admin, ps.money, ps.level, ps.tutorial_done, ps.updated_at
         FROM users u
         LEFT JOIN player_state ps ON ps.user_id = u.id
        ORDER BY u.id ASC
        LIMIT 200`
    );
    res.json({ users: rows.map(r => ({
      id: r.id, username: r.username, isAdmin: !!r.is_admin,
      money: Number(r.money || 0), level: Number(r.level || 1),
      tutorialDone: !!r.tutorial_done, updatedAt: r.updated_at
    })) });
  } catch (e) {
    console.error('[admin users]', e.message);
    res.status(500).json({ error: 'Could not load users' });
  }
});

app.post('/api/admin/set-money', dbReady, auth, isAdmin, async (req, res) => {
  const username = String((req.body && req.body.username) || '').trim();
  const amount = clampInt(req.body && req.body.amount, -1000000000000, 1000000000000, 0);
  if (!username) return res.status(400).json({ error: 'Username required' });
  const client = await pool.connect();
  try {
    const u = await client.query('SELECT id FROM users WHERE lower(username) = lower($1)', [username]);
    if (!u.rowCount) { client.release(); return res.status(404).json({ error: 'User not found' }); }
    const id = u.rows[0].id;
    await client.query('BEGIN');
    const st = await stateForUpdate(client, id);
    const money = Number(st.money || 0) + amount;
    await client.query('UPDATE player_state SET money = $2, updated_at = NOW() WHERE user_id = $1', [id, money]);
    await client.query('COMMIT');
    client.release();
    res.json({ ok: true, money });
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    client.release();
    console.error('[admin set-money]', e.message);
    res.status(500).json({ error: 'Could not set money' });
  }
});

app.post('/api/admin/set-level', dbReady, auth, isAdmin, async (req, res) => {
  const username = String((req.body && req.body.username) || '').trim();
  let level = clampInt(req.body && req.body.level, 1, MAX_LEVEL, 1);
  if (!username) return res.status(400).json({ error: 'Username required' });
  const client = await pool.connect();
  try {
    const u = await client.query('SELECT id FROM users WHERE lower(username) = lower($1)', [username]);
    if (!u.rowCount) { client.release(); return res.status(404).json({ error: 'User not found' }); }
    const id = u.rows[0].id;
    await client.query('BEGIN');
    await client.query('UPDATE player_state SET level = $2, updated_at = NOW() WHERE user_id = $1', [id, level]);
    await client.query('COMMIT');
    client.release();
    res.json({ ok: true, level });
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    client.release();
    console.error('[admin set-level]', e.message);
    res.status(500).json({ error: 'Could not set level' });
  }
});

app.post('/api/admin/clear-items', dbReady, auth, isAdmin, async (req, res) => {
  const username = String((req.body && req.body.username) || '').trim();
  if (!username) return res.status(400).json({ error: 'Username required' });
  const client = await pool.connect();
  try {
    const u = await client.query('SELECT id FROM users WHERE lower(username) = lower($1)', [username]);
    if (!u.rowCount) { client.release(); return res.status(404).json({ error: 'User not found' }); }
    const id = u.rows[0].id;
    await client.query('BEGIN');
    await client.query('UPDATE player_state SET counts = $2, updated_at = NOW() WHERE user_id = $1', [id, JSON.stringify({})]);
    await client.query('COMMIT');
    client.release();
    res.json({ ok: true });
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    client.release();
    console.error('[admin clear-items]', e.message);
    res.status(500).json({ error: 'Could not clear items' });
  }
});

app.post('/api/admin/reset-progress', dbReady, auth, isAdmin, async (req, res) => {
  const username = String((req.body && req.body.username) || '').trim();
  if (!username) return res.status(400).json({ error: 'Username required' });
  const client = await pool.connect();
  try {
    const u = await client.query('SELECT id FROM users WHERE lower(username) = lower($1)', [username]);
    if (!u.rowCount) { client.release(); return res.status(404).json({ error: 'User not found' }); }
    const id = u.rows[0].id;
    await client.query('BEGIN');
    await client.query('UPDATE player_state SET money = 0, level = 1, counts = $2, stats = $3, achievements = $4, tutorial_done = FALSE, updated_at = NOW() WHERE user_id = $1',
      [id, JSON.stringify({}), JSON.stringify(defaultStats()), JSON.stringify([])]);
    await client.query('COMMIT');
    client.release();
    res.json({ ok: true });
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    client.release();
    console.error('[admin reset]', e.message);
    res.status(500).json({ error: 'Could not reset progress' });
  }
});
app.get('/api/leaderboard', dbReady, auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT u.id, u.username, ps.money, ps.level
         FROM users u
         JOIN player_state ps ON ps.user_id = u.id
        ORDER BY ps.money DESC
        LIMIT 100`
    );
    res.json({
      leaders: rows.map((r, i) => ({
        rank: i + 1, id: r.id, username: r.username,
        money: Number(r.money || 0), level: Number(r.level || 1),
        me: r.id === req.user.id
      }))
    });
  } catch (e) {
    console.error('[leaderboard]', e.message);
    res.status(500).json({ error: 'Could not load leaderboard' });
  }
});

/* ---------------------------------------------------------------
 * Daily quests
 * ------------------------------------------------------------- */
app.get('/api/daily', dbReady, auth, async (req, res) => {
  try {
    const st = await stateFor(pool, req.user.id);
    const d = dailyOf(st);
    res.json({ quests: dailyQuests(st.level), prog: d.prog, claimed: d.claimed });
  } catch (e) {
    console.error('[daily]', e.message);
    res.status(500).json({ error: 'Could not load quests' });
  }
});

app.post('/api/daily/claim', dbReady, auth, async (req, res) => {
  const id = String((req.body && req.body.id) || '');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const st = await stateForUpdate(client, req.user.id);
    const d = dailyOf(st);
    const q = dailyQuests(st.level).find(x => x.id === id);
    if (!q) { await client.query('ROLLBACK'); return res.status(400).json({ error: 'Unknown quest' }); }
    if (d.claimed.indexOf(id) !== -1) { await client.query('ROLLBACK'); return res.status(400).json({ error: 'Already claimed' }); }
    if (Number(d.prog[id] || 0) < q.target) { await client.query('ROLLBACK'); return res.status(400).json({ error: 'Quest not complete' }); }
    d.claimed.push(id);
    const money = Number(st.money || 0) + q.reward;
    await client.query(
      'UPDATE player_state SET money = $2, daily = $3, updated_at = NOW() WHERE user_id = $1',
      [req.user.id, money, JSON.stringify(d)]
    );
    await client.query('COMMIT');
    const fresh = await stateFor(pool, req.user.id);
    res.json({ ok: true, reward: q.reward, state: publicState(fresh), daily: { quests: dailyQuests(st.level), prog: d.prog, claimed: d.claimed } });
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('[daily claim]', e.message);
    res.status(500).json({ error: 'Could not claim reward' });
  } finally {
    client.release();
  }
});

/* ---------------------------------------------------------------
 * World boss
 * ------------------------------------------------------------- */
app.get('/api/boss', dbReady, auth, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const boss = await ensureBoss(client);
    const { rows } = await client.query(
      `SELECT c.user_id, u.username, c.damage, c.value
         FROM boss_contributions c
         JOIN users u ON u.id = c.user_id
        WHERE c.boss_id = $1
        ORDER BY c.damage DESC
        LIMIT 50`,
      [boss.id]
    );
    await client.query('COMMIT');
    const totalDamage = rows.reduce((a, r) => a + Number(r.damage), 0) || 0;
    const poolTotal = rows.reduce((a, r) => a + Number(r.value), 0);
    let you = null;
    const contributions = rows.map(r => {
      const share = totalDamage ? Number(r.damage) / totalDamage : 0;
      const payout = Math.floor(poolTotal * BOSS_BONUS * share);
      if (Number(r.user_id) === Number(req.user.id)) {
        you = { damage: Number(r.damage), value: Number(r.value), share, payout };
      }
      return { username: r.username, damage: Number(r.damage), value: Number(r.value), share, payout };
    });
    res.json({
      boss: { id: boss.id, name: boss.name, hp: Number(boss.hp), maxHp: Number(boss.max_hp), poolValue: Number(boss.pool_value), bonus: BOSS_BONUS },
      contributions, you, totalDamage
    });
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('[boss]', e.message);
    res.status(500).json({ error: 'Could not load boss' });
  } finally {
    client.release();
  }
});

/* ---------------------------------------------------------------
 * Static hosting + health
 * ------------------------------------------------------------- */
app.get('/healthz', (req, res) => res.json({ ok: true, db: !!DATABASE_URL }));
const INDEX_HTML = path.join(__dirname, 'index.html');
app.get('/', (req, res) => res.sendFile(INDEX_HTML));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not found' });
  res.sendFile(INDEX_HTML);
});

/* ---------------------------------------------------------------
 * WebSocket presence
 * ------------------------------------------------------------- */
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });
const presence = new Map(); // serverId -> Map<userId, {ws, x, y, zone}>

function roomOf(serverId) {
  if (!presence.has(serverId)) presence.set(serverId, new Map());
  return presence.get(serverId);
}

function broadcast(serverId, obj, exceptId) {
  const room = presence.get(serverId);
  if (!room) return;
  const data = JSON.stringify(obj);
  for (const [uid, entry] of room) {
    if (exceptId && uid === exceptId) continue;
    if (entry.ws && entry.ws.readyState === 1) entry.ws.send(data);
  }
}

// Send a message to every connected socket (used for the global boss).
function broadcastAll(obj) {
  const data = JSON.stringify(obj);
  wss.clients.forEach(c => { if (c.readyState === 1) c.send(data); });
}

// Throttle live boss HP updates so a busy server doesn't flood clients.
let lastBossBcast = 0;
function maybeBossBroadcast(boss) {
  const now = Date.now();
  if (now - lastBossBcast < 1500) return;
  lastBossBcast = now;
  broadcastAll({ type: 'boss', boss });
}

async function broadcastMembers(serverId) {
  if (!DATABASE_URL) { broadcast(serverId, { type: 'members', members: [] }); return; }
  const w = worlds.get(serverId);
  const room = presence.get(serverId) || new Map();
  if (!w) { broadcast(serverId, { type: 'members', members: [] }); return; }
  try {
    const ids = [...w.members.keys()];
    const byId = new Map();
    if (ids.length) {
      const { rows } = await pool.query(
        `SELECT u.id, u.username, ps.money, ps.level
           FROM users u
           LEFT JOIN player_state ps ON ps.user_id = u.id
          WHERE u.id = ANY($1::int[])`,
        [ids]
      );
      for (const r of rows) byId.set(r.id, r);
    }
    broadcast(serverId, {
      type: 'members',
      members: [...w.members.entries()].map(([id, slot]) => {
        const r = byId.get(id) || {};
        const c = room.get(id);
        return {
          id,
          username: r.username || '?',
          slot,
          money: Number(r.money || 0),
          level: Number(r.level || 1),
          online: !!c,
          x: c ? c.x : null,
          y: c ? c.y : null,
          zone: c ? c.zone : 'world'
        };
      })
    });
  } catch (e) {
    console.error('[broadcastMembers]', e.message);
  }
}

wss.on('connection', (ws, req) => {
  let user;
  try {
    const url = new URL(req.url, 'http://localhost');
    user = jwt.verify(url.searchParams.get('token') || '', JWT_SECRET);
  } catch (e) {
    ws.close(4001, 'bad token');
    return;
  }

  ws.userId = user.id;
  ws.serverId = null;
  ws.isAlive = true;

  ws.on('pong', () => { ws.isAlive = true; });

  ws.on('message', async raw => {
    let msg;
    try { msg = JSON.parse(raw); } catch (e) { return; }

    if (msg.type === 'join') {
      const sid = parseInt(msg.serverId, 10);
      if (!Number.isFinite(sid)) return;
      const w = worlds.get(sid);
      if (!w || !w.members.has(user.id)) {
        ws.send(JSON.stringify({ type: 'error', error: 'You are not a member of that world' }));
        return;
      }
      if (ws.serverId && ws.serverId !== sid) {
        const old = presence.get(ws.serverId);
        if (old) old.delete(user.id);
      }
      ws.serverId = sid;
      ws.slot = w.members.get(user.id);
      const room = roomOf(sid);
      room.set(user.id, { ws, x: Number(msg.x) || 0, y: Number(msg.y) || 0, zone: 'world' });
      await broadcastMembers(sid);
      return;
    }

    if (!ws.serverId) return;

    if (msg.type === 'move') {
      const entry = presence.get(ws.serverId)?.get(user.id);
      if (entry) {
        entry.x = Number(msg.x) || 0;
        entry.y = Number(msg.y) || 0;
        entry.zone = typeof msg.zone === 'string' ? msg.zone.slice(0, 12) : 'world';
      }
      broadcast(ws.serverId, {
        type: 'move', id: user.id, x: Number(msg.x) || 0, y: Number(msg.y) || 0,
        zone: typeof msg.zone === 'string' ? msg.zone : 'world',
        moving: !!msg.moving,
        facing: msg.facing || { x: 1, y: 0 }
      }, user.id);
      return;
    }

    if (msg.type === 'say') {
      const text = String(msg.text || '').trim().slice(0, 140);
      if (!text) return;
      broadcast(ws.serverId, { type: 'say', id: user.id, name: user.username, text });
    }
  });

  ws.on('close', () => {
    if (ws.serverId) {
      const room = presence.get(ws.serverId);
      if (room) room.delete(user.id);
      broadcastMembers(ws.serverId).catch(() => {});
    }
  });
});

// Drop dead sockets.
setInterval(() => {
  wss.clients.forEach(ws => {
    if (ws.isAlive === false) return ws.terminate();
    ws.isAlive = false;
    try { ws.ping(); } catch (e) {}
  });
}, 30000);

/* ---------------------------------------------------------------
 * Boot
 * ------------------------------------------------------------- */
initDb()
  .then(() => {
    server.listen(PORT, () => console.log('[vaultoria] listening on port ' + PORT));
  })
  .catch(err => {
    console.error('[vaultoria] failed to init DB:', err.message);
    server.listen(PORT, () => console.log('[vaultoria] listening on port ' + PORT + ' (database unavailable)'));
  });

process.on('SIGTERM', () => { server.close(() => process.exit(0)); });
