const express = require('express');
const http = require('http');
const crypto = require('crypto');
const { Pool } = require('pg');
const { Server } = require('socket.io');

const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
if (!databaseUrl) throw new Error('Set DATABASE_URL (or NEON_DATABASE_URL) to your Neon connection string.');
const pool = new Pool({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;
const MAP = { width: 1200, height: 760 };

app.get('/', (_req, res) => res.sendFile(__dirname + '/index.html'));
app.use(express.static(__dirname));

const accounts = new Map();
const tokens = new Map();
const rooms = new Map();
const marketListings = new Map();
const buyOrders = new Map();
const players = new Map();
let nextRoom = 1;
let persistQueue = Promise.resolve();

async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS vaultoria_accounts (
      username_key TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      salt TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      profile JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS vaultoria_sessions (
      token_hash TEXT PRIMARY KEY,
      username_key TEXT NOT NULL REFERENCES vaultoria_accounts(username_key) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS vaultoria_market_listings (
      id TEXT PRIMARY KEY,
      listing JSONB NOT NULL
    );
    CREATE TABLE IF NOT EXISTS vaultoria_buy_orders (
      id TEXT PRIMARY KEY,
      order_data JSONB NOT NULL
    );
  `);
  const [accountRows, listingRows, orderRows] = await Promise.all([
    pool.query('SELECT username_key, username, salt, password_hash, profile FROM vaultoria_accounts'),
    pool.query('SELECT listing FROM vaultoria_market_listings'),
    pool.query('SELECT order_data FROM vaultoria_buy_orders')
  ]);
  for (const row of accountRows.rows) {
    accounts.set(row.username_key, { username: row.username, salt: row.salt, passwordHash: row.password_hash, profile: row.profile });
  }
  for (const row of listingRows.rows) marketListings.set(row.listing.id, row.listing);
  for (const row of orderRows.rows) buyOrders.set(row.order_data.id, row.order_data);
}

function persistState() {
  const accountRows = [...accounts.entries()].map(([key, account]) => ({ key, ...account }));
  const sessionRows = [...tokens.entries()].map(([token, key]) => ({ hash: crypto.createHash('sha256').update(token).digest('hex'), key }));
  const listingRows = [...marketListings.values()];
  const orderRows = [...buyOrders.values()];
  persistQueue = persistQueue.then(async () => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const account of accountRows) {
        await client.query(
          `INSERT INTO vaultoria_accounts (username_key, username, salt, password_hash, profile)
           VALUES ($1, $2, $3, $4, $5::jsonb)
           ON CONFLICT (username_key) DO UPDATE SET username = EXCLUDED.username, salt = EXCLUDED.salt,
             password_hash = EXCLUDED.password_hash, profile = EXCLUDED.profile`,
          [account.key, account.username, account.salt, account.passwordHash, JSON.stringify(account.profile)]
        );
      }
      await client.query('DELETE FROM vaultoria_sessions');
      for (const session of sessionRows) {
        await client.query('INSERT INTO vaultoria_sessions (token_hash, username_key) VALUES ($1, $2)', [session.hash, session.key]);
      }
      await client.query('DELETE FROM vaultoria_market_listings');
      for (const listing of listingRows) {
        await client.query('INSERT INTO vaultoria_market_listings (id, listing) VALUES ($1, $2::jsonb)', [listing.id, JSON.stringify(listing)]);
      }
      await client.query('DELETE FROM vaultoria_buy_orders');
      for (const order of orderRows) {
        await client.query('INSERT INTO vaultoria_buy_orders (id, order_data) VALUES ($1, $2::jsonb)', [order.id, JSON.stringify(order)]);
      }
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Could not persist game state:', error.message);
    } finally {
      client.release();
    }
  }).catch(error => console.error('Database persistence failed:', error.message));
  return persistQueue;
}

const TIERS = [
  { name: 'Common', chance: 55, score: 1 },
  { name: 'Uncommon', chance: 23, score: 2 },
  { name: 'Rare', chance: 11, score: 4 },
  { name: 'Epic', chance: 5, score: 8 },
  { name: 'Legendary', chance: 2.8, score: 15 },
  { name: 'Mythic', chance: 1.5, score: 28 },
  { name: 'Divine', chance: 0.8, score: 50 },
  { name: 'Celestial', chance: 0.45, score: 90 },
  { name: 'Eternal', chance: 0.25, score: 160 },
  { name: 'Omniversal', chance: 0.2, score: 300 }
];
const ITEMS = {
  Common: ['Common Scrap', 'Copper Shard', 'Dusty Relic'],
  Uncommon: ['Uncommon Core', 'Charged Coil', 'Verdant Sigil'],
  Rare: ['Aether Lens', 'Prism Fang', 'Runic Engine'],
  Epic: ['Void Catalyst', 'Stormheart', 'Echo Matrix'],
  Legendary: ['Solar Crown', 'Dragon Circuit', 'Starforged Gear'],
  Mythic: ['Abyssal Crown', 'Phoenix Reactor', 'Worldbreaker'],
  Divine: ['Divine Keystone', 'Godspark Engine'],
  Celestial: ['Celestial Prism', 'Astral Singularity'],
  Eternal: ['Eternal Reactor', 'Timeless Core'],
  Omniversal: ['Omniversal Heart', 'Origin Engine']
};
const PORTALS = [
  { x: 80, y: 80 }, { x: 600, y: 55 }, { x: 1120, y: 80 }, { x: 1120, y: 380 },
  { x: 1120, y: 680 }, { x: 600, y: 705 }, { x: 80, y: 680 }, { x: 80, y: 380 }
];
const EVENTS = [
  { name: 'Quiet Markets', type: 'calm', description: 'The Bazaar is steady. Generator costs are normal.' },
  { name: 'Economic Shock', type: 'shock', description: 'Generator prices are 20% higher while the shock lasts.' },
  { name: 'Crafting Holiday', type: 'crafting', description: 'Crafting uses one fewer Common Scrap.' },
  { name: 'Generator Surge', type: 'surge', description: 'Generators cost 20% less during the surge.' }
];
let activeEvent = { ...EVENTS[0], endsAt: Date.now() + 60000 };
let nextEventAt = Date.now() + 60000;

function freshProfile() {
  return {
    cash: 500, vaultLevel: 1, security: 1, ascensions: 0, cache: 0,
    inventory: [], kills: 0, deaths: 0, x: 80, y: 80, lastSeen: Date.now(),
    offlineHours: 2
  };
}
function hashPassword(password, salt) {
  return new Promise((resolve, reject) => crypto.scrypt(password, salt, 64, (err, key) => err ? reject(err) : resolve(key.toString('hex'))));
}
function cleanUsername(value) {
  return typeof value === 'string' ? value.trim().replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 18) : '';
}
function safeProfile(profile) {
  return {
    cash: profile.cash, vaultLevel: profile.vaultLevel, security: profile.security,
    ascensions: profile.ascensions, cache: profile.cache, inventory: profile.inventory,
    kills: profile.kills, deaths: profile.deaths, offlineHours: profile.offlineHours
  };
}
function playerBySocket(socket) {
  return players.get(socket.data.username);
}
function makeItem(tierName, itemName) {
  return { id: crypto.randomUUID(), tier: tierName, name: itemName || ITEMS[tierName][0] };
}
function addItem(profile, item) { profile.inventory.push(item); }
function takeItem(profile, itemId) {
  const index = profile.inventory.findIndex(item => item.id === itemId);
  return index < 0 ? null : profile.inventory.splice(index, 1)[0];
}
function tierScore(item) {
  return (TIERS.find(tier => tier.name === item.tier) || TIERS[0]).score;
}
function chooseTier(profile) {
  const boost = Math.min(20, (profile.vaultLevel - 1) * 0.15 + profile.ascensions * 2);
  const weights = TIERS.map((tier, index) => tier.chance * (index === 0 ? 1 : 1 + boost * index / 25));
  let roll = Math.random() * weights.reduce((sum, value) => sum + value, 0);
  for (let index = 0; index < TIERS.length; index++) {
    roll -= weights[index];
    if (roll <= 0) return TIERS[index];
  }
  return TIERS[0];
}
function roomFor(username) {
  for (const [id, members] of rooms) {
    if (members.size < 8) return id;
  }
  const id = `room-${nextRoom++}`;
  rooms.set(id, new Set());
  return id;
}
function portalFor(username) {
  const online = [...players.values()].filter(player => player.username !== username);
  const slot = online.length % PORTALS.length;
  return PORTALS[slot];
}
function isInWarzone(x, y) {
  return Math.abs(x - MAP.width / 2) / 245 + Math.abs(y - MAP.height / 2) / 165 < 1;
}
function playerState(player) {
  const profile = accounts.get(player.username).profile;
  const inWarzone = isInWarzone(profile.x, profile.y);
  return {
    username: player.username, x: profile.x, y: profile.y,
    inWarzone, safe: !inWarzone, vaultLevel: profile.vaultLevel
  };
}
function publicMarket() {
  return {
    listings: [...marketListings.values()].map(listing => ({ ...listing })),
    orders: [...buyOrders.values()].map(order => ({ ...order }))
  };
}
function sendState(player) {
  const account = accounts.get(player.username);
  if (!account || !player.socketId) return;
  const roomPlayers = [...players.values()]
    .filter(other => other.room === player.room)
    .map(playerState);
  io.to(player.socketId).emit('game:state', {
    profile: safeProfile(account.profile), players: roomPlayers,
    room: player.room, market: publicMarket(), event: activeEvent,
    portals: PORTALS, map: MAP
  });
}
function notifyMarket() { io.emit('market:update', publicMarket()); }
function sendNotice(username, text, kind = 'info') {
  const player = players.get(username);
  if (player?.socketId) io.to(player.socketId).emit('notice', { text, kind });
}
function awardOfflineCache(account) {
  const profile = account.profile;
  const elapsed = Math.max(0, Date.now() - profile.lastSeen);
  const capMs = (2 + profile.offlineHours) * 60 * 60 * 1000;
  const minutes = Math.min(elapsed, capMs) / 60000;
  const earned = Math.floor(minutes * (profile.vaultLevel * 2 + profile.security * 3));
  profile.cash += earned;
  profile.cache = earned;
  return earned;
}
function attachPlayer(socket, account, token) {
  const old = players.get(account.username);
  if (old && old.socketId !== socket.id) {
    rooms.get(old.room)?.delete(account.username);
    players.delete(account.username);
    const oldSocket = io.sockets.sockets.get(old.socketId);
    if (oldSocket) oldSocket.disconnect(true);
  }
  const room = roomFor(account.username);
  if (!rooms.has(room)) rooms.set(room, new Set());
  rooms.get(room).add(account.username);
  const portal = portalFor(account.username);
  account.profile.x = portal.x;
  account.profile.y = portal.y;
  account.profile.lastSeen = Date.now();
  const player = { username: account.username, socketId: socket.id, room, keys: {}, facing: { x: 0, y: 1 }, lastAttack: 0 };
  players.set(account.username, player);
  socket.data.username = account.username;
  socket.join(room);
  socket.emit('auth:success', { token, username: account.username, offlineCache: account.profile.cache });
  socket.emit('game:state', {
    profile: safeProfile(account.profile), players: [...players.values()].filter(other => other.room === room).map(playerState),
    room, market: publicMarket(), event: activeEvent, portals: PORTALS, map: MAP
  });
  io.to(room).emit('world:players', [...players.values()].filter(other => other.room === room).map(playerState));
}
function findOrderMatch(item, price) {
  return [...buyOrders.values()]
    .filter(order => order.itemName === item.name && order.remaining > 0 && order.price >= price)
    .sort((a, b) => b.price - a.price)[0];
}
function settleListing(seller, item, price) {
  const order = findOrderMatch(item, price);
  if (!order) return false;
  const buyer = accounts.get(order.username);
  if (!buyer) return false;
  buyer.profile.cash += order.price - price;
  addItem(buyer.profile, item);
  accounts.get(seller).profile.cash += price;
  order.remaining -= 1;
  if (order.remaining <= 0) buyOrders.delete(order.id);
  sendNotice(seller, `${item.name} sold to a Bazaar buy order for ${price} credits.`, 'success');
  sendNotice(order.username, `Your buy order acquired ${item.name}.`, 'success');
  return true;
}

io.on('connection', socket => {
  socket.on('auth:register', async (payload = {}, reply = () => {}) => {
    const username = cleanUsername(payload.username);
    const password = typeof payload.password === 'string' ? payload.password : '';
    const key = username.toLowerCase();
    if (username.length < 3 || password.length < 6) return reply({ ok: false, message: 'Use a username with 3+ characters and a password with 6+.' });
    if (accounts.has(key)) return reply({ ok: false, message: 'That username is already taken.' });
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = await hashPassword(password, salt);
    accounts.set(key, { username, salt, passwordHash, profile: freshProfile() });
    const token = crypto.randomBytes(32).toString('hex');
    tokens.set(token, key);
    await persistState();
    reply({ ok: true });
    attachPlayer(socket, accounts.get(key), token);
  });
  socket.on('auth:login', async (payload = {}, reply = () => {}) => {
    const username = cleanUsername(payload.username);
    const account = accounts.get(username.toLowerCase());
    if (!account || typeof payload.password !== 'string') return reply({ ok: false, message: 'Invalid username or password.' });
    const check = await hashPassword(payload.password, account.salt);
    if (check !== account.passwordHash) return reply({ ok: false, message: 'Invalid username or password.' });
    const earned = awardOfflineCache(account);
    const token = crypto.randomBytes(32).toString('hex');
    tokens.set(token, username.toLowerCase());
    await persistState();
    reply({ ok: true });
    attachPlayer(socket, account, token);
    if (earned) sendNotice(account.username, `Welcome back! Your offline cache added ${earned} credits.`, 'success');
  });
  socket.on('auth:resume', async (payload = {}) => {
    const token = typeof payload.token === 'string' ? payload.token : '';
    let key = tokens.get(token);
    if (!key && token) {
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      const result = await pool.query('SELECT username_key FROM vaultoria_sessions WHERE token_hash = $1', [tokenHash]);
      key = result.rows[0]?.username_key;
      if (key) tokens.set(token, key);
    }
    const account = key && accounts.get(key);
    if (!account) return socket.emit('auth:error', { message: 'Your session expired. Please log in again.' });
    const earned = awardOfflineCache(account);
    attachPlayer(socket, account, token);
    if (earned) sendNotice(account.username, `Offline production added ${earned} credits.`, 'success');
    persistState();
  });
  socket.on('move', (keys = {}) => {
    const player = playerBySocket(socket);
    if (!player) return;
    player.keys = {
      up: Boolean(keys.up), down: Boolean(keys.down), left: Boolean(keys.left), right: Boolean(keys.right)
    };
  });
  socket.on('combat:attack', () => {
    const player = playerBySocket(socket);
    if (!player) return;
    const now = Date.now();
    if (now - player.lastAttack < 800) return;
    player.lastAttack = now;
    const attacker = accounts.get(player.username);
    if (!isInWarzone(attacker.profile.x, attacker.profile.y)) return sendNotice(player.username, 'Enter the Warzone to attack.', 'error');
    const target = [...players.values()].filter(other => other.username !== player.username && other.room === player.room)
      .map(other => ({ player: other, profile: accounts.get(other.username).profile }))
      .filter(entry => isInWarzone(entry.profile.x, entry.profile.y))
      .map(entry => {
        const dx = entry.profile.x - attacker.profile.x;
        const dy = entry.profile.y - attacker.profile.y;
        const distance = Math.hypot(dx, dy);
        const alignment = distance ? (dx * player.facing.x + dy * player.facing.y) / distance : 0;
        return { ...entry, distance, alignment };
      })
      .filter(entry => entry.distance <= 125 && entry.alignment >= 0.25)
      .sort((a, b) => a.distance - b.distance)[0];
    if (!target) return sendNotice(player.username, 'No opponent is close enough. Get within 125 pixels.', 'error');
    const stolen = target.profile.inventory.length ? takeItem(target.profile, target.profile.inventory[Math.floor(Math.random() * target.profile.inventory.length)].id) : null;
    if (stolen) addItem(attacker.profile, stolen);
    const cashLoot = Math.floor(target.profile.cash * 0.1);
    target.profile.cash -= cashLoot;
    attacker.profile.cash += cashLoot;
    target.profile.deaths += 1;
    attacker.profile.kills += 1;
    const portal = portalFor(target.player.username);
    target.profile.x = portal.x;
    target.profile.y = portal.y;
    sendNotice(player.username, `You defeated ${target.player.username} and claimed ${cashLoot} credits${stolen ? ` plus ${stolen.name}` : ''}!`, 'success');
    sendNotice(target.player.username, `You were defeated in the Warzone. Lost ${cashLoot} credits${stolen ? ` and ${stolen.name}` : ''}.`, 'error');
    io.to(player.room).emit('world:players', [...players.values()].filter(other => other.room === player.room).map(playerState));
    sendState(player);
    sendState(target.player);
  });
  socket.on('vault:generate', () => {
    const player = playerBySocket(socket);
    if (!player) return;
    const profile = accounts.get(player.username).profile;
    let cost = 30 + profile.vaultLevel * 12;
    if (activeEvent.type === 'surge') cost = Math.floor(cost * 0.8);
    if (activeEvent.type === 'shock') cost = Math.ceil(cost * 1.2);
    if (profile.cash < cost) return sendNotice(player.username, `You need ${cost} credits to activate the generator.`, 'error');
    profile.cash -= cost;
    const tier = chooseTier(profile);
    const item = makeItem(tier.name, ITEMS[tier.name][Math.floor(Math.random() * ITEMS[tier.name].length)]);
    addItem(profile, item);
    sendNotice(player.username, `Generator produced ${item.name} (${item.tier})!`, 'success');
    sendState(player);
  });
  socket.on('vault:upgrade', () => {
    const player = playerBySocket(socket);
    if (!player) return;
    const profile = accounts.get(player.username).profile;
    const cost = profile.vaultLevel * 250;
    if (profile.vaultLevel >= 10) return sendNotice(player.username, 'Vault level is capped. Ascend to progress further.', 'error');
    if (profile.cash < cost) return sendNotice(player.username, `Upgrade costs ${cost} credits.`, 'error');
    profile.cash -= cost;
    profile.vaultLevel += 1;
    profile.security += 1;
    profile.offlineHours = Math.min(24, profile.offlineHours + 0.5);
    sendNotice(player.username, `Vault upgraded to level ${profile.vaultLevel}.`, 'success');
    sendState(player);
  });
  socket.on('vault:ascend', () => {
    const player = playerBySocket(socket);
    if (!player) return;
    const profile = accounts.get(player.username).profile;
    if (profile.vaultLevel < 10) return sendNotice(player.username, 'Reach vault level 10 before ascending.', 'error');
    if (profile.cash < 5000) return sendNotice(player.username, 'Ascension requires 5,000 credits.', 'error');
    profile.cash -= 5000;
    profile.vaultLevel = 1;
    profile.ascensions += 1;
    profile.security += 5;
    sendNotice(player.username, `Ascension ${profile.ascensions} complete! Security and generator luck increased.`, 'success');
    sendState(player);
  });
  socket.on('market:list', (payload = {}) => {
    const player = playerBySocket(socket);
    const price = Math.floor(Number(payload.price));
    if (!player || !Number.isSafeInteger(price) || price < 1 || price > 100000000) return;
    const profile = accounts.get(player.username).profile;
    const item = takeItem(profile, payload.itemId);
    if (!item) return sendNotice(player.username, 'That item is not in your inventory.', 'error');
    if (settleListing(player.username, item, price)) {
      notifyMarket();
      sendState(player);
      return;
    }
    const listing = { id: crypto.randomUUID(), username: player.username, item, price };
    marketListings.set(listing.id, listing);
    notifyMarket();
    sendState(player);
  });
  socket.on('market:buy', (payload = {}) => {
    const player = playerBySocket(socket);
    const listing = marketListings.get(payload.id);
    if (!player || !listing || listing.username === player.username) return;
    const buyer = accounts.get(player.username).profile;
    if (buyer.cash < listing.price) return sendNotice(player.username, 'Not enough credits for this listing.', 'error');
    buyer.cash -= listing.price;
    accounts.get(listing.username).profile.cash += listing.price;
    addItem(buyer, listing.item);
    marketListings.delete(listing.id);
    sendNotice(listing.username, `${listing.item.name} sold for ${listing.price} credits.`, 'success');
    notifyMarket();
    sendState(player);
    const seller = players.get(listing.username);
    if (seller) sendState(seller);
  });
  socket.on('market:order', (payload = {}) => {
    const player = playerBySocket(socket);
    const itemName = typeof payload.itemName === 'string' ? payload.itemName : '';
    const quantity = Math.floor(Number(payload.quantity));
    const price = Math.floor(Number(payload.price));
    if (!player || !Object.values(ITEMS).flat().includes(itemName) || !Number.isSafeInteger(quantity) || quantity < 1 || quantity > 20 || !Number.isSafeInteger(price) || price < 1) return;
    const profile = accounts.get(player.username).profile;
    const total = quantity * price;
    if (profile.cash < total) return sendNotice(player.username, `Buy order needs ${total} credits in escrow.`, 'error');
    profile.cash -= total;
    const order = { id: crypto.randomUUID(), username: player.username, itemName, quantity, remaining: quantity, price };
    buyOrders.set(order.id, order);
    for (const listing of [...marketListings.values()]) {
      if (order.remaining <= 0) break;
      if (listing.item.name === itemName && listing.price <= price && listing.username !== player.username) {
        const seller = accounts.get(listing.username);
        seller.profile.cash += listing.price;
        addItem(profile, listing.item);
        profile.cash += price - listing.price;
        order.remaining -= 1;
        marketListings.delete(listing.id);
        sendNotice(listing.username, `${itemName} sold for ${listing.price} credits.`, 'success');
      }
    }
    if (order.remaining <= 0) buyOrders.delete(order.id);
    else profile.cash += order.remaining * price;
    notifyMarket();
    sendState(player);
  });
  socket.on('market:cancel-order', (payload = {}) => {
    const player = playerBySocket(socket);
    const order = buyOrders.get(payload.id);
    if (!player || !order || order.username !== player.username) return;
    accounts.get(player.username).profile.cash += order.remaining * order.price;
    buyOrders.delete(order.id);
    notifyMarket();
    sendState(player);
  });
  socket.on('market:cancel-listing', (payload = {}) => {
    const player = playerBySocket(socket);
    const listing = marketListings.get(payload.id);
    if (!player || !listing || listing.username !== player.username) return;
    addItem(accounts.get(player.username).profile, listing.item);
    marketListings.delete(listing.id);
    notifyMarket();
    sendState(player);
  });
  socket.on('shop:breach-key', () => {
    const player = playerBySocket(socket);
    if (!player) return;
    const profile = accounts.get(player.username).profile;
    if (profile.cash < 250) return sendNotice(player.username, 'A Breach Key costs 250 credits.', 'error');
    profile.cash -= 250;
    addItem(profile, makeItem('Common', 'Breach Key'));
    sendNotice(player.username, 'Breach Key purchased. Use it from your inventory.', 'success');
    sendState(player);
  });
  socket.on('breach:launch', (payload = {}) => {
    const player = playerBySocket(socket);
    if (!player) return;
    const profile = accounts.get(player.username).profile;
    const key = profile.inventory.find(item => item.name === 'Breach Key');
    if (!key) return sendNotice(player.username, 'You need a Breach Key from the system shop.', 'error');
    const targets = [...players.values()].filter(other => other.username !== player.username && other.socketId);
    if (!targets.length) return sendNotice(player.username, 'No online vaults are available to breach.', 'error');
    takeItem(profile, key.id);
    const target = targets[Math.floor(Math.random() * targets.length)];
    const defender = accounts.get(target.username).profile;
    const offense = Math.max(1, ...profile.inventory.map(tierScore));
    const defense = defender.security * 2 + defender.vaultLevel + 2;
    const successChance = Math.max(0.1, Math.min(0.85, 0.55 + offense * 0.012 - defense * 0.025));
    if (Math.random() < successChance) {
      const amount = Math.min(defender.cash, Math.max(10, Math.floor(defender.cash * (0.08 + Math.random() * 0.17))));
      defender.cash -= amount;
      profile.cash += amount;
      sendNotice(player.username, `Breach successful! Your crew recovered ${amount} credits. Target identity protected.`, 'success');
      sendNotice(target.username, 'Vault breach detected! Security protocols contained the intrusion, but some credits were lost.', 'error');
    } else {
      sendNotice(player.username, 'The breach failed. Your key was consumed, but the target remains anonymous.', 'error');
      sendNotice(target.username, 'A breach attempt on your vault was repelled.', 'success');
    }
    sendState(player);
    sendState(target);
  });
  socket.on('craft:reactor', () => {
    const player = playerBySocket(socket);
    if (!player) return;
    const profile = accounts.get(player.username).profile;
    const scrapNeeded = activeEvent.type === 'crafting' ? 2 : 3;
    const scrap = profile.inventory.filter(item => item.name === 'Common Scrap').slice(0, scrapNeeded);
    const cores = profile.inventory.filter(item => item.name === 'Uncommon Core').slice(0, 2);
    if (scrap.length < scrapNeeded || cores.length < 2) return sendNotice(player.username, `Recipe: ${scrapNeeded} Common Scrap + 2 Uncommon Core.`, 'error');
    [...scrap, ...cores].forEach(item => takeItem(profile, item.id));
    addItem(profile, makeItem('Eternal', 'Eternal Reactor'));
    sendNotice(player.username, 'Crafted an Eternal Reactor!', 'success');
    sendState(player);
  });
  socket.on('leaderboard:get', () => {
    const leaders = [...accounts.values()].map(account => ({
      username: account.username, vaultLevel: account.profile.vaultLevel,
      ascensions: account.profile.ascensions, kills: account.profile.kills, cash: account.profile.cash
    })).sort((a, b) => b.ascensions - a.ascensions || b.vaultLevel - a.vaultLevel || b.kills - a.kills).slice(0, 20);
    socket.emit('leaderboard:data', leaders);
  });
  socket.on('disconnect', () => {
    const player = playerBySocket(socket);
    if (!player || player.socketId !== socket.id) return;
    const account = accounts.get(player.username);
    if (account) account.profile.lastSeen = Date.now();
    players.delete(player.username);
    rooms.get(player.room)?.delete(player.username);
    if (rooms.get(player.room)?.size === 0) rooms.delete(player.room);
    io.to(player.room).emit('world:players', [...players.values()].filter(other => other.room === player.room).map(playerState));
    persistState();
  });
});

setInterval(() => {
  const delta = 0.05;
  for (const player of players.values()) {
    const profile = accounts.get(player.username)?.profile;
    if (!profile) continue;
    let dx = Number(player.keys.right) - Number(player.keys.left);
    let dy = Number(player.keys.down) - Number(player.keys.up);
    if (dx && dy) { dx *= Math.SQRT1_2; dy *= Math.SQRT1_2; }
    if (dx || dy) player.facing = { x: dx, y: dy };
    profile.x = Math.max(20, Math.min(MAP.width - 20, profile.x + dx * 230 * delta));
    profile.y = Math.max(20, Math.min(MAP.height - 20, profile.y + dy * 230 * delta));
  }
  if (Date.now() >= nextEventAt) {
    activeEvent = { ...EVENTS[Math.floor(Math.random() * EVENTS.length)], endsAt: Date.now() + 5 * 60 * 1000 };
    nextEventAt = activeEvent.endsAt;
    io.emit('event:update', activeEvent);
  }
  for (const room of rooms.keys()) {
    const state = [...players.values()].filter(player => player.room === room).map(playerState);
    io.to(room).emit('world:players', state);
  }
}, 50);

initializeDatabase().then(() => {
  setInterval(persistState, 1000);
  server.listen(PORT, () => console.log(`Vaultoria server listening on ${PORT}`));
}).catch(error => {
  console.error('Could not initialize Neon database:', error);
  process.exit(1);
});
