'use strict';

/*
 * Vaultoria server
 * ---------------------------------------------------------------
 * - Serves the static game (index.html) from this folder.
 * - REST API for accounts, servers, bazaar, friends and saving progress.
 * - WebSocket presence so up to 8 players share a server world in real time.
 * - Uses a Neon Postgres database via DATABASE_URL.
 *
 * Deploy target: Render Web Service (Node). See render.yaml / .env.example.
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
  { key: 'common',    name: 'Common',    base: 4,      weight: 1000 },
  { key: 'uncommon',  name: 'Uncommon',  base: 15,     weight: 300 },
  { key: 'rare',      name: 'Rare',      base: 80,     weight: 80 },
  { key: 'epic',      name: 'Epic',      base: 600,    weight: 20 },
  { key: 'legendary', name: 'Legendary', base: 7000,   weight: 5 },
  { key: 'mythic',    name: 'Mythic',    base: 100000, weight: 1 }
];
const ITEMS_BY_RARITY = {
  common: ["Rotten Tomato","Floppy Disk","Used Toenail","Wet Sock","Broken Umbrella","Expired Yogurt","Chewed Pencil","Soggy Cardboard","Cracked Mug","Dull Scissors","Moldy Bread","Bent Paperclip","Dead Battery","Torn Sponge","Singed Hairball","Sticky Penny","Smashed Earwig","Empty Lighter","Rusty Nail","Clipped Nail","Dried Gum","Tangled Earbuds","Leaky Pen","Stale Chip","Wilted Lettuce","Balding Mop","Chipped Plate","Frayed Shoelace"],
  uncommon: ["Damp Towel","Half a Sticker","Bent Key","Chipped DVD","Loose Button","Stale Tuna Sandwich","Questionable Sock","Slightly Used Diaper","Warped Record","Freeze-Dried Banana"],
  rare: ["Vintage Floppy Disk","Collectible Pringle","Autographed Sock","Antique Dust","Shiny Hubcap","First Edition Napkin","Haunted Sock","Limited Soggy Cardboard"],
  epic: ["Golden Banana Peel","Cursed Toenail Clipper","Mystic Mayo Jar","Sentient Mold","Royal Cheese Rind","Enchanted Plastic Fork"],
  legendary: ["The Holy Toaster","Certified Mold Cheese","Singularity Bell","Pope's Old Lighter","Relic VHS Tape","Demon Coffee Mug"],
  mythic: ["The Vaultoria Crown","Egg of Nefarious","Sacred Trash King","Index of All Items"]
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

  if (!worlds.size) createWorld('The Grand Bazaar');
  console.log('[vaultoria] database ready');
}

function dbReady(req, res, next) {
  if (!DATABASE_URL) return res.status(503).json({ error: 'Database not configured. Set DATABASE_URL on the server.' });
  next();
}

/* ---------------------------------------------------------------
 * Small helpers
 * ------------------------------------------------------------- */
function signToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '30d' });
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
  return {
    money: Number(row.money || 0),
    level: Number(row.level || 1),
    counts: row.counts || {},
    stats: row.stats || defaultStats(),
    achievements: row.achievements || [],
    tutorialDone: !!row.tutorial_done,
    px: Number(row.px || 0),
    py: Number(row.py || 0)
  };
}

// Shared helper: persist a mutated player_state row plus any newly earned achievements.
async function persistProgress(client, userId, st, counts, stats, achievements, money) {
  const level = Number(st.level || 1);
  const res = evaluateAch(stats, level, achievements);
  money += res.reward;
  await client.query(
    `UPDATE player_state SET money = $2, counts = $3, stats = $4, achievements = $5, updated_at = NOW()
      WHERE user_id = $1`,
    [userId, money, JSON.stringify(counts), JSON.stringify(stats), JSON.stringify(achievements)]
  );
  return res.earned;
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
    const { rows } = await pool.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username',
      [username, hash]
    );
    await pool.query('INSERT INTO player_state (user_id) VALUES ($1) ON CONFLICT DO NOTHING', [rows[0].id]);
    res.json({ token: signToken(rows[0]), user: { id: rows[0].id, username: rows[0].username } });
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
    res.json({ token: signToken(rows[0]), user: { id: rows[0].id, username: rows[0].username } });
  } catch (e) {
    console.error('[login]', e.message);
    res.status(500).json({ error: 'Could not sign in' });
  }
});

app.get('/api/me', dbReady, auth, async (req, res) => {
  try {
    const state = await stateFor(pool, req.user.id);
    res.json({ user: { id: req.user.id, username: req.user.username }, state: publicState(state) });
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
    const level = Number(st.level || 1);
    const ri = pickRarity(level);
    const pool = ITEMS_BY_RARITY[RARITIES[ri].key];
    const item = pool[Math.floor(Math.random() * pool.length)];

    const counts = Object.assign({}, st.counts || {});
    counts[item] = Number(counts[item] || 0) + 1;
    const stats = statsOf(st);
    stats.ig = (stats.ig || 0) + 1;
    if (stats.seen.indexOf(item) === -1) stats.seen.push(item);
    if (stats.best == null) stats.best = -1;
    if (ri > stats.best) stats.best = ri;

    const achievements = Array.isArray(st.achievements) ? st.achievements.slice() : [];
    const newAch = await persistProgress(client, req.user.id, st, counts, stats, achievements, Number(st.money || 0));
    await client.query('COMMIT');
    lastGen.set(req.user.id, now);

    const fresh = await stateFor(pool, req.user.id);
    res.json({ ok: true, item, rarity: RARITIES[ri].key, state: publicState(fresh), newAch });
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

    if (body.all) {
      for (const it in counts) {
        const ri = ITEM_RARITY[it];
        if (ri == null) continue;
        gain += RARITIES[ri].base * Number(counts[it] || 0);
        delete counts[it];
      }
    } else {
      const it = String(body.item || '');
      const ri = ITEM_RARITY[it];
      if (ri == null) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Unknown item' });
      }
      const c = Number(counts[it] || 0);
      if (c <= 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'You do not have that item' });
      }
      gain += RARITIES[ri].base * c;
      delete counts[it];
    }
    if (gain <= 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Nothing to sell' });
    }

    const stats = statsOf(st);
    stats.earned = (stats.earned || 0) + gain;
    const achievements = Array.isArray(st.achievements) ? st.achievements.slice() : [];
    const newAch = await persistProgress(client, req.user.id, st, counts, stats, achievements, Number(st.money || 0) + gain);
    await client.query('COMMIT');

    const fresh = await stateFor(pool, req.user.id);
    res.json({ ok: true, gain, state: publicState(fresh), newAch });
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
    const { rows } = await pool.query(
      `SELECT b.id, b.item_name, b.rarity, b.price, b.quantity, b.seller_id,
              u.username AS seller, b.created_at
         FROM bazaar_listings b
         JOIN users u ON u.id = b.seller_id
        WHERE b.sold = FALSE AND b.quantity > 0
        ORDER BY b.created_at DESC
        LIMIT 200`
    );
    res.json({
      listings: rows.map(r => ({
        id: r.id, itemName: r.item_name, rarity: r.rarity,
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
    const itemName = String(b.itemName || '');
    const ri = ITEM_RARITY[itemName];
    if (ri == null) return res.status(400).json({ error: 'Unknown item' });
    const rarity = RARITIES[ri].key; // never trust the client's rarity
    const quantity = clampInt(b.quantity, 1, 9999, 1);
    const price = clampInt(b.price, 1, Number.MAX_SAFE_INTEGER, 1);

    await client.query('BEGIN');
    const st = await stateForUpdate(client, req.user.id);
    const counts = Object.assign({}, st.counts || {});
    const have = Number(counts[itemName] || 0);
    if (have < quantity) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'You do not have that many of this item' });
    }
    counts[itemName] = have - quantity;
    if (counts[itemName] <= 0) delete counts[itemName];
    await client.query('UPDATE player_state SET counts = $2, updated_at = NOW() WHERE user_id = $1',
      [req.user.id, JSON.stringify(counts)]);
    await client.query(
      'INSERT INTO bazaar_listings (seller_id, item_name, rarity, price, quantity) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, itemName, rarity, price, quantity]
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
    bCounts[listing.item_name] = Number(bCounts[listing.item_name] || 0) + Number(listing.quantity);
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
      counts[l.rows[0].item_name] = Number(counts[l.rows[0].item_name] || 0) + Number(l.rows[0].quantity);
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
 * Leaderboard
 * ------------------------------------------------------------- */
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
