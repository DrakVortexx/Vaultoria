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
    return;
  }
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(sql);

  const { rows } = await pool.query('SELECT COUNT(*)::int AS c FROM servers');
  if (rows[0].c === 0) {
    await pool.query('INSERT INTO servers (name, is_open) VALUES ($1, TRUE)', ['The Grand Bazaar']);
  }
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

async function stateFor(client, userId) {
  const q = c => c.query('SELECT * FROM player_state WHERE user_id = $1', [userId]);
  let { rows } = await q(client);
  if (!rows[0]) {
    await client.query('INSERT INTO player_state (user_id) VALUES ($1) ON CONFLICT DO NOTHING', [userId]);
    ({ rows } = await q(client));
  }
  return rows[0];
}

function publicState(row) {
  return {
    money: Number(row.money || 0),
    level: Number(row.level || 1),
    counts: row.counts || {},
    stats: row.stats || { ig: 0, earned: 0, seen: [], best: -1 },
    achievements: row.achievements || [],
    tutorialDone: !!row.tutorial_done,
    px: Number(row.px || 0),
    py: Number(row.py || 0),
    serverId: row.server_id || null
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
    const { rows } = await pool.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username',
      [username, hash]
    );
    await pool.query('INSERT INTO player_state (user_id) VALUES ($1) ON CONFLICT DO NOTHING', [rows[0].id]);
    res.json({ token: signToken(rows[0]), user: { id: rows[0].id, username: rows[0].username } });
  } catch (e) {
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
    await pool.query(
      `UPDATE player_state SET
         money = $2, level = $3, counts = $4, stats = $5, achievements = $6,
         tutorial_done = $7, px = $8, py = $9, updated_at = NOW()
       WHERE user_id = $1`,
      [
        req.user.id,
        clampInt(b.money, 0, Number.MAX_SAFE_INTEGER, 0),
        clampInt(b.level, 1, 100, 1),
        JSON.stringify(b.counts || {}),
        JSON.stringify(b.stats || {}),
        JSON.stringify(Array.isArray(b.achievements) ? b.achievements : []),
        !!b.tutorialDone,
        Number(b.px) || 0,
        Number(b.py) || 0
      ]
    );
    res.json({ ok: true });
  } catch (e) {
    console.error('[save]', e.message);
    res.status(500).json({ error: 'Could not save' });
  }
});

/* ---------------------------------------------------------------
 * Servers
 * ------------------------------------------------------------- */
app.get('/api/servers', dbReady, auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT s.id, s.name, s.is_open, s.created_at,
              (SELECT COUNT(*)::int FROM server_members m WHERE m.server_id = s.id) AS members
         FROM servers s
        WHERE s.is_open = TRUE
        ORDER BY s.id ASC`
    );
    res.json({
      servers: rows.map(r => ({
        id: r.id, name: r.name, isOpen: r.is_open,
        members: r.members, capacity: SERVER_CAPACITY
      }))
    });
  } catch (e) {
    console.error('[servers]', e.message);
    res.status(500).json({ error: 'Could not load servers' });
  }
});

app.post('/api/servers', dbReady, auth, async (req, res) => {
  try {
    const name = String((req.body && req.body.name) || 'My Server').trim().slice(0, 40) || 'My Server';
    const { rows } = await pool.query(
      'INSERT INTO servers (name, is_open) VALUES ($1, TRUE) RETURNING id, name',
      [name]
    );
    res.json({ server: { id: rows[0].id, name: rows[0].name, members: 0, capacity: SERVER_CAPACITY } });
  } catch (e) {
    console.error('[create server]', e.message);
    res.status(500).json({ error: 'Could not create server' });
  }
});

app.post('/api/servers/:id/join', dbReady, auth, async (req, res) => {
  const sid = parseInt(req.params.id, 10);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const srv = await client.query('SELECT * FROM servers WHERE id = $1 AND is_open = TRUE', [sid]);
    if (!srv.rowCount) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'That server is unavailable' });
    }
    const existing = await client.query(
      'SELECT slot FROM server_members WHERE server_id = $1 AND user_id = $2',
      [sid, req.user.id]
    );
    if (existing.rowCount) {
      await client.query('COMMIT');
      return res.json({ ok: true, slot: existing.rows[0].slot });
    }
    const used = await client.query('SELECT slot FROM server_members WHERE server_id = $1', [sid]);
    const usedSet = new Set(used.rows.map(r => r.slot));
    let slot = -1;
    for (let i = 0; i < SERVER_CAPACITY; i++) {
      if (!usedSet.has(i)) { slot = i; break; }
    }
    if (slot < 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'That server is full (8/8)' });
    }
    await client.query(
      'INSERT INTO server_members (server_id, user_id, slot) VALUES ($1, $2, $3)',
      [sid, req.user.id, slot]
    );
    await client.query('UPDATE player_state SET server_id = $2 WHERE user_id = $1', [req.user.id, sid]);
    await client.query('COMMIT');
    res.json({ ok: true, slot });
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('[join]', e.message);
    res.status(500).json({ error: 'Could not join server' });
  } finally {
    client.release();
  }
});

app.post('/api/servers/:id/leave', dbReady, auth, async (req, res) => {
  const sid = parseInt(req.params.id, 10);
  try {
    await pool.query('DELETE FROM server_members WHERE server_id = $1 AND user_id = $2', [sid, req.user.id]);
    await pool.query('UPDATE player_state SET server_id = NULL WHERE user_id = $1 AND server_id = $2', [req.user.id, sid]);
    broadcastMembers(sid).catch(() => {});
    res.json({ ok: true });
  } catch (e) {
    console.error('[leave]', e.message);
    res.status(500).json({ error: 'Could not leave server' });
  }
});

app.get('/api/servers/:id/members', dbReady, auth, async (req, res) => {
  try {
    const sid = parseInt(req.params.id, 10);
    const { rows } = await pool.query(
      `SELECT m.slot, m.user_id, u.username, ps.money, ps.level
         FROM server_members m
         JOIN users u ON u.id = m.user_id
         LEFT JOIN player_state ps ON ps.user_id = m.user_id
        WHERE m.server_id = $1
        ORDER BY m.slot ASC`,
      [sid]
    );
    const room = presence.get(sid) || new Map();
    res.json({
      members: rows.map(r => ({
        id: r.user_id, username: r.username, slot: r.slot,
        money: Number(r.money || 0), level: Number(r.level || 1),
        online: room.has(r.user_id)
      }))
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
    const itemName = String(b.itemName || '').slice(0, 80);
    const rarity = String(b.rarity || 'common').slice(0, 20);
    const quantity = clampInt(b.quantity, 1, 9999, 1);
    const price = clampInt(b.price, 1, Number.MAX_SAFE_INTEGER, 1);
    if (!itemName) return res.status(400).json({ error: 'Pick an item to sell' });

    await client.query('BEGIN');
    const st = await stateFor(client, req.user.id);
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
    const buyer = await stateFor(client, req.user.id);
    if (Number(buyer.money) < price) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'You cannot afford that' });
    }
    const bCounts = Object.assign({}, buyer.counts || {});
    bCounts[listing.item_name] = Number(bCounts[listing.item_name] || 0) + Number(listing.quantity);
    await client.query(
      'UPDATE player_state SET money = money - $2, counts = $3, updated_at = NOW() WHERE user_id = $1',
      [req.user.id, price, JSON.stringify(bCounts)]
    );
    await client.query(
      'UPDATE player_state SET money = money + $2, updated_at = NOW() WHERE user_id = $1',
      [listing.seller_id, price]
    );
    await client.query('UPDATE bazaar_listings SET sold = TRUE, quantity = 0 WHERE id = $1', [id]);
    await client.query('COMMIT');
    const fresh = await stateFor(pool, req.user.id);
    res.json({ ok: true, state: publicState(fresh) });
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
      const st = await stateFor(client, req.user.id);
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
app.use(express.static(__dirname, { extensions: ['html'] }));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

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
  if (!DATABASE_URL) return;
  try {
    const { rows } = await pool.query(
      `SELECT m.slot, m.user_id, u.username, ps.money, ps.level
         FROM server_members m
         JOIN users u ON u.id = m.user_id
         LEFT JOIN player_state ps ON ps.user_id = m.user_id
        WHERE m.server_id = $1
        ORDER BY m.slot ASC`,
      [serverId]
    );
    const room = presence.get(serverId) || new Map();
    broadcast(serverId, {
      type: 'members',
      members: rows.map(r => {
        const c = room.get(r.user_id);
        return {
          id: r.user_id,
          username: r.username,
          slot: r.slot,
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
      try {
        const m = await pool.query('SELECT slot FROM server_members WHERE server_id = $1 AND user_id = $2', [sid, user.id]);
        if (!m.rowCount) { ws.send(JSON.stringify({ type: 'error', error: 'You are not a member of that server' })); return; }
        if (ws.serverId && ws.serverId !== sid) {
          const old = presence.get(ws.serverId);
          if (old) old.delete(user.id);
        }
        ws.serverId = sid;
        ws.slot = m.rows[0].slot;
        const room = roomOf(sid);
        room.set(user.id, { ws, x: Number(msg.x) || 0, y: Number(msg.y) || 0, zone: 'world' });
        await broadcastMembers(sid);
      } catch (e) {
        console.error('[ws join]', e.message);
      }
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
