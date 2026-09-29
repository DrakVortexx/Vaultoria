const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const bcrypt = require('bcrypt');
const pool = require('./db');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const itemRarities = {
  common: ['Floppy Disk', 'Cassette Tape', 'VHS Tape', 'Game Cartridge'],
  rare: ['SSD Drive', 'Graphics Card', 'RAM Stick', 'Motherboard'],
  epic: ['Quantum Processor', 'Neural Chip', 'Holographic Display', 'Fusion Battery'],
  legendary: ['AI Core', 'Time Crystal', 'Antimatter Drive', 'Reality Anchor']
};

const getItemByRarity = (rarity) => {
  const items = itemRarities[rarity] || itemRarities.common;
  return items[Math.floor(Math.random() * items.length)];
};

const generateItem = (clickerLevel) => {
  const rand = Math.random();
  if (clickerLevel >= 4 && rand < 0.05) return { name: getItemByRarity('legendary'), rarity: 'legendary' };
  if (clickerLevel >= 3 && rand < 0.15) return { name: getItemByRarity('epic'), rarity: 'epic' };
  if (clickerLevel >= 2 && rand < 0.35) return { name: getItemByRarity('rare'), rarity: 'rare' };
  return { name: getItemByRarity('common'), rarity: 'common' };
};

const getGeneratorItem = (generatorLevel) => {
  if (generatorLevel === 0) return { name: 'Broken Cable', rarity: 'junk' };
  if (generatorLevel === 1) return { name: getItemByRarity('common'), rarity: 'common' };
  if (generatorLevel === 2) return { name: getItemByRarity('rare'), rarity: 'rare' };
  if (generatorLevel === 3) return { name: getItemByRarity('epic'), rarity: 'epic' };
  return { name: getItemByRarity('legendary'), rarity: 'legendary' };
};

app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      'INSERT INTO players (username, password_hash) VALUES ($1, $2) RETURNING id, username, cash, protection_level, clicker_level, generator_level, generator_active',
      [username, passwordHash]
    );
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      res.status(400).json({ error: 'Username already exists' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    
    const result = await pool.query('SELECT * FROM players WHERE username = $1', [username]);
    const player = result.rows[0];
    
    if (!player) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, player.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Return player data without password hash
    const { password_hash, ...playerData } = player;
    res.json(playerData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/player/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, cash, protection_level, clicker_level, generator_level, generator_active FROM players WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/click', async (req, res) => {
  try {
    const { player_id } = req.body;
    const playerResult = await pool.query('SELECT * FROM players WHERE id = $1', [player_id]);
    const player = playerResult.rows[0];
    
    const item = generateItem(player.clicker_level);
    
    await pool.query(
      'INSERT INTO inventory (player_id, item_name, item_rarity, quantity) VALUES ($1, $2, $3, 1) ON CONFLICT DO NOTHING',
      [player_id, item.name, item.rarity]
    );
    
    const existingItem = await pool.query(
      'SELECT * FROM inventory WHERE player_id = $1 AND item_name = $2',
      [player_id, item.name]
    );
    
    if (existingItem.rows.length > 0) {
      await pool.query(
        'UPDATE inventory SET quantity = quantity + 1 WHERE id = $1',
        [existingItem.rows[0].id]
      );
    }
    
    res.json({ item, success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/inventory/:player_id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM inventory WHERE player_id = $1', [req.params.player_id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/sell', async (req, res) => {
  try {
    const { player_id, item_id, quantity } = req.body;
    
    const inventoryResult = await pool.query('SELECT * FROM inventory WHERE id = $1', [item_id]);
    const item = inventoryResult.rows[0];
    
    if (!item || item.player_id !== parseInt(player_id)) {
      return res.status(400).json({ error: 'Invalid item' });
    }
    
    if (item.quantity < quantity) {
      return res.status(400).json({ error: 'Not enough items' });
    }
    
    const rarityPrices = { junk: 0.10, common: 0.50, rare: 5.00, epic: 25.00, legendary: 100.00 };
    const price = rarityPrices[item.item_rarity] || 0.50;
    const total = price * quantity;
    
    await pool.query('UPDATE players SET cash = cash + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [total, player_id]);
    
    if (item.quantity === quantity) {
      await pool.query('DELETE FROM inventory WHERE id = $1', [item_id]);
    } else {
      await pool.query('UPDATE inventory SET quantity = quantity - $1 WHERE id = $2', [quantity, item_id]);
    }
    
    const playerResult = await pool.query('SELECT * FROM players WHERE id = $1', [player_id]);
    res.json({ success: true, newCash: playerResult.rows[0].cash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/bazaar/list', async (req, res) => {
  try {
    const { player_id, item_id, quantity, price } = req.body;
    
    const inventoryResult = await pool.query('SELECT * FROM inventory WHERE id = $1', [item_id]);
    const item = inventoryResult.rows[0];
    
    if (!item || item.player_id !== parseInt(player_id)) {
      return res.status(400).json({ error: 'Invalid item' });
    }
    
    if (item.quantity < quantity) {
      return res.status(400).json({ error: 'Not enough items' });
    }
    
    await pool.query(
      'INSERT INTO bazaar_listings (player_id, item_name, item_rarity, quantity, price) VALUES ($1, $2, $3, $4, $5)',
      [player_id, item.item_name, item.item_rarity, quantity, price]
    );
    
    if (item.quantity === quantity) {
      await pool.query('DELETE FROM inventory WHERE id = $1', [item_id]);
    } else {
      await pool.query('UPDATE inventory SET quantity = quantity - $1 WHERE id = $2', [quantity, item_id]);
    }
    
    io.emit('bazaarUpdate');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/bazaar', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT bl.*, p.username 
      FROM bazaar_listings bl 
      JOIN players p ON bl.player_id = p.id 
      ORDER BY bl.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/bazaar/buy', async (req, res) => {
  try {
    const { player_id, listing_id, quantity } = req.body;
    
    const listingResult = await pool.query('SELECT * FROM bazaar_listings WHERE id = $1', [listing_id]);
    const listing = listingResult.rows[0];
    
    if (!listing) {
      return res.status(400).json({ error: 'Listing not found' });
    }
    
    if (listing.player_id === parseInt(player_id)) {
      return res.status(400).json({ error: 'Cannot buy your own listing' });
    }
    
    if (listing.quantity < quantity) {
      return res.status(400).json({ error: 'Not enough items in listing' });
    }
    
    const totalCost = listing.price * quantity;
    
    const buyerResult = await pool.query('SELECT * FROM players WHERE id = $1', [player_id]);
    const buyer = buyerResult.rows[0];
    
    if (buyer.cash < totalCost) {
      return res.status(400).json({ error: 'Not enough cash' });
    }
    
    await pool.query('UPDATE players SET cash = cash - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [totalCost, player_id]);
    await pool.query('UPDATE players SET cash = cash + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [totalCost, listing.player_id]);
    
    const existingInventory = await pool.query(
      'SELECT * FROM inventory WHERE player_id = $1 AND item_name = $2',
      [player_id, listing.item_name]
    );
    
    if (existingInventory.rows.length > 0) {
      await pool.query(
        'UPDATE inventory SET quantity = quantity + $1 WHERE id = $2',
        [quantity, existingInventory.rows[0].id]
      );
    } else {
      await pool.query(
        'INSERT INTO inventory (player_id, item_name, item_rarity, quantity) VALUES ($1, $2, $3, $4)',
        [player_id, listing.item_name, listing.item_rarity, quantity]
      );
    }
    
    if (listing.quantity === quantity) {
      await pool.query('DELETE FROM bazaar_listings WHERE id = $1', [listing_id]);
    } else {
      await pool.query('UPDATE bazaar_listings SET quantity = quantity - $1 WHERE id = $2', [quantity, listing_id]);
    }
    
    io.emit('bazaarUpdate');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/upgrades', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM upgrades ORDER BY upgrade_type, level');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/upgrade', async (req, res) => {
  try {
    const { player_id, upgrade_type, level } = req.body;
    
    const upgradeResult = await pool.query(
      'SELECT * FROM upgrades WHERE upgrade_type = $1 AND level = $2',
      [upgrade_type, level]
    );
    const upgrade = upgradeResult.rows[0];
    
    if (!upgrade) {
      return res.status(400).json({ error: 'Invalid upgrade' });
    }
    
    const playerResult = await pool.query('SELECT * FROM players WHERE id = $1', [player_id]);
    const player = playerResult.rows[0];
    
    if (player.cash < upgrade.cost) {
      return res.status(400).json({ error: 'Not enough cash' });
    }
    
    await pool.query('UPDATE players SET cash = cash - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [upgrade.cost, player_id]);
    
    if (upgrade_type === 'clicker') {
      await pool.query('UPDATE players SET clicker_level = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [level, player_id]);
    } else if (upgrade_type === 'generator') {
      await pool.query('UPDATE players SET generator_level = $1, generator_active = true, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [level, player_id]);
    } else if (upgrade_type === 'protection') {
      await pool.query('UPDATE players SET protection_level = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [level, player_id]);
    }
    
    const updatedPlayer = await pool.query('SELECT * FROM players WHERE id = $1', [player_id]);
    res.json({ success: true, player: updatedPlayer.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/breach-tools', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM breach_tools ORDER BY level');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/breach', async (req, res) => {
  try {
    const { attacker_id, target_id, tool_level } = req.body;
    
    const attackerResult = await pool.query('SELECT * FROM players WHERE id = $1', [attacker_id]);
    const attacker = attackerResult.rows[0];
    
    const targetResult = await pool.query('SELECT * FROM players WHERE id = $1', [target_id]);
    const target = targetResult.rows[0];
    
    if (target.cash < 100) {
      return res.status(400).json({ error: 'Target has insufficient funds to breach' });
    }
    
    const toolResult = await pool.query('SELECT * FROM breach_tools WHERE level = $1', [tool_level]);
    const tool = toolResult.rows[0];
    
    if (attacker.cash < tool.price) {
      return res.status(400).json({ error: 'Not enough cash to purchase breach tool' });
    }
    
    await pool.query('UPDATE players SET cash = cash - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [tool.price, attacker_id]);
    
    const success = tool_level > target.protection_level;
    
    if (success) {
      const stealPercentage = 0.10 + (tool_level * 0.05);
      const stolenAmount = target.cash * stealPercentage;
      
      await pool.query('UPDATE players SET cash = cash - $1, last_breach = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [stolenAmount, target_id]);
      await pool.query('UPDATE players SET cash = cash + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [stolenAmount, attacker_id]);
      
      io.emit('playerUpdate', { player_id: target_id });
      io.emit('playerUpdate', { player_id: attacker_id });
      
      res.json({ success: true, stolenAmount, message: `Successfully breached ${target.username} and stole $${stolenAmount.toFixed(2)}` });
    } else {
      // Breach failed - attacker spent money but didn't succeed
      await pool.query('UPDATE players SET updated_at = CURRENT_TIMESTAMP WHERE id = $1', [attacker_id]);
      res.json({ success: false, message: `Breach failed! ${target.username}'s protection was too strong.` });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, cash, protection_level FROM players ORDER BY cash DESC LIMIT 20');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/players', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, cash, protection_level FROM players WHERE cash >= 100 ORDER BY cash DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);
  
  socket.on('join', async (username) => {
    socket.username = username;
    socket.join(username);
    
    const result = await pool.query('SELECT * FROM players WHERE username = $1', [username]);
    if (result.rows.length > 0) {
      socket.playerId = result.rows[0].id;
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
  });
});

const generatorInterval = setInterval(async () => {
  try {
    const result = await pool.query('SELECT * FROM players WHERE generator_active = true');
    
    for (const player of result.rows) {
      if (player.generator_level > 0) {
        const item = getGeneratorItem(player.generator_level);
        
        const existingItem = await pool.query(
          'SELECT * FROM inventory WHERE player_id = $1 AND item_name = $2',
          [player.id, item.name]
        );
        
        if (existingItem.rows.length > 0) {
          await pool.query(
            'UPDATE inventory SET quantity = quantity + 1 WHERE id = $1',
            [existingItem.rows[0].id]
          );
        } else {
          await pool.query(
            'INSERT INTO inventory (player_id, item_name, item_rarity, quantity) VALUES ($1, $2, $3, 1)',
            [player.id, item.name, item.rarity]
          );
        }
        
        io.to(player.username).emit('generatorItem', { item });
      }
    }
  } catch (err) {
    console.error('Generator error:', err);
  }
}, 5000);

server.listen(PORT, () => {
  console.log(`Vaultoria server running on port ${PORT}`);
});
