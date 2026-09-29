require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { body, validationResult } = require('express-validator');
const pool = require('./db');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Security middleware
app.use(helmet());
app.use(express.json());
app.use(express.static('public'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: 'Too many authentication attempts, please try again later.'
});

app.use('/api/', limiter);
app.use('/api/register', authLimiter);
app.use('/api/login', authLimiter);

// Password strength validation
const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!hasUpperCase) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!hasLowerCase) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!hasNumbers) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  if (!hasSpecialChar) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }

  return { valid: true };
};

// JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

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

app.post('/api/register', [
  body('username').trim().isLength({ min: 3, max: 20 }).withMessage('Username must be 3-20 characters'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { username, password } = req.body;

    // Additional password strength validation
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.message });
    }

    // Sanitize username
    const sanitizedUsername = username.trim().replace(/[<>]/g, '');

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO players (username, password_hash) VALUES ($1, $2) RETURNING id, username, cash, protection_level, clicker_level, autoclicker_level, autoclicker_active, generator_level, generator_active, xp, level, daily_streak',
      [sanitizedUsername, passwordHash]
    );

    // Generate JWT token
    const token = jwt.sign(
      { id: result.rows[0].id, username: result.rows[0].username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ ...result.rows[0], token });
  } catch (err) {
    if (err.code === '23505') {
      res.status(400).json({ error: 'Username already exists' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

app.post('/api/login', [
  body('username').trim().notEmpty().withMessage('Username required'),
  body('password').notEmpty().withMessage('Password required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { username, password } = req.body;

    const result = await pool.query('SELECT * FROM players WHERE username = $1', [username.trim()]);
    const player = result.rows[0];

    if (!player) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, player.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: player.id, username: player.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return player data without password hash
    const { password_hash, ...playerData } = player;
    res.json({ ...playerData, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/player/:id', authenticateToken, async (req, res) => {
  try {
    // Only allow users to access their own data
    if (req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await pool.query(
      'SELECT id, username, cash, protection_level, clicker_level, autoclicker_level, autoclicker_active, generator_level, generator_active, xp, level, daily_streak FROM players WHERE id = $1',
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

app.post('/api/click', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { player_id } = req.body;

    // Verify user can only click for themselves
    if (req.user.id !== parseInt(player_id)) {
      await client.query('ROLLBACK');
      return res.status(403).json({ error: 'Access denied' });
    }

    const playerResult = await client.query('SELECT * FROM players WHERE id = $1', [player_id]);
    const player = playerResult.rows[0];

    const item = generateItem(player.clicker_level);

    await client.query(
      'INSERT INTO inventory (player_id, item_name, item_rarity, quantity) VALUES ($1, $2, $3, 1) ON CONFLICT DO NOTHING',
      [player_id, item.name, item.rarity]
    );

    const existingItem = await client.query(
      'SELECT * FROM inventory WHERE player_id = $1 AND item_name = $2',
      [player_id, item.name]
    );

    if (existingItem.rows.length > 0) {
      await client.query(
        'UPDATE inventory SET quantity = quantity + 1 WHERE id = $1',
        [existingItem.rows[0].id]
      );
    }

    // Update player stats and add XP
    const xpGained = 1;
    const newXp = player.xp + xpGained;
    const newLevel = Math.floor(newXp / 100) + 1;

    await client.query(
      'UPDATE players SET total_clicks = total_clicks + 1, total_items_obtained = total_items_obtained + 1, xp = $1, level = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      [newXp, newLevel, player_id]
    );

    await client.query('COMMIT');

    // Check for achievements
    checkAchievements(player_id, pool);

    res.json({ item, success: true, xpGained, newLevel, levelUp: newLevel > player.level });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

app.get('/api/inventory/:player_id', authenticateToken, async (req, res) => {
  try {
    // Only allow users to access their own inventory
    if (req.user.id !== parseInt(req.params.player_id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await pool.query('SELECT * FROM inventory WHERE player_id = $1', [req.params.player_id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Removed direct selling - players must use bazaar to sell items

// Achievement checking function
async function checkAchievements(playerId, db) {
  try {
    const playerResult = await db.query('SELECT * FROM players WHERE id = $1', [playerId]);
    const player = playerResult.rows[0];

    const achievements = await db.query('SELECT * FROM achievements');
    const unlockedAchievements = await db.query(
      'SELECT achievement_id FROM player_achievements WHERE player_id = $1',
      [playerId]
    );
    const unlockedIds = new Set(unlockedAchievements.rows.map(a => a.achievement_id));

    for (const achievement of achievements.rows) {
      if (unlockedIds.has(achievement.id)) continue;

      let requirementMet = false;
      switch (achievement.requirement_type) {
        case 'clicks':
          requirementMet = player.total_clicks >= achievement.requirement_value;
          break;
        case 'items_obtained':
          requirementMet = player.total_items_obtained >= achievement.requirement_value;
          break;
        case 'bazaar_sales':
          requirementMet = player.bazaar_sales >= achievement.requirement_value;
          break;
        case 'bazaar_purchases':
          requirementMet = player.bazaar_purchases >= achievement.requirement_value;
          break;
        case 'breaches':
          requirementMet = player.successful_breaches >= achievement.requirement_value;
          break;
        case 'daily_streak':
          requirementMet = player.daily_streak >= achievement.requirement_value;
          break;
        case 'level':
          requirementMet = player.level >= achievement.requirement_value;
          break;
      }

      if (requirementMet) {
        await db.query(
          'INSERT INTO player_achievements (player_id, achievement_id) VALUES ($1, $2)',
          [playerId, achievement.id]
        );
        await db.query(
          'UPDATE players SET xp = xp + $1, cash = cash + $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
          [achievement.reward_xp, achievement.reward_cash, playerId]
        );

        // Emit achievement notification
        io.to(player.username).emit('achievementUnlocked', {
          name: achievement.name,
          description: achievement.description,
          reward_xp: achievement.reward_xp,
          reward_cash: achievement.reward_cash
        });
      }
    }
  } catch (err) {
    console.error('Error checking achievements:', err);
  }
}

app.post('/api/bazaar/list', authenticateToken, [
  body('player_id').isInt().withMessage('Invalid player ID'),
  body('item_id').isInt().withMessage('Invalid item ID'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('price').isFloat({ min: 0.01 }).withMessage('Price must be at least 0.01')
], async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { player_id, item_id, quantity, price } = req.body;

    // Verify user can only list their own items
    if (req.user.id !== parseInt(player_id)) {
      await client.query('ROLLBACK');
      return res.status(403).json({ error: 'Access denied' });
    }

    const inventoryResult = await client.query('SELECT * FROM inventory WHERE id = $1', [item_id]);
    const item = inventoryResult.rows[0];

    if (!item || item.player_id !== parseInt(player_id)) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Invalid item' });
    }

    if (item.quantity < quantity) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Not enough items' });
    }

    await client.query(
      'INSERT INTO bazaar_listings (player_id, item_name, item_rarity, quantity, price) VALUES ($1, $2, $3, $4, $5)',
      [player_id, item.item_name, item.item_rarity, quantity, price]
    );

    if (item.quantity === quantity) {
      await client.query('DELETE FROM inventory WHERE id = $1', [item_id]);
    } else {
      await client.query('UPDATE inventory SET quantity = quantity - $1 WHERE id = $2', [quantity, item_id]);
    }

    // Update player stats
    await client.query(
      'UPDATE players SET bazaar_sales = bazaar_sales + 1, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [player_id]
    );

    await client.query('COMMIT');

    // Check for achievements
    checkAchievements(player_id, pool);

    io.emit('bazaarUpdate');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
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

app.post('/api/bazaar/buy', authenticateToken, [
  body('player_id').isInt().withMessage('Invalid player ID'),
  body('listing_id').isInt().withMessage('Invalid listing ID'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
], async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { player_id, listing_id, quantity } = req.body;

    // Verify user can only buy for themselves
    if (req.user.id !== parseInt(player_id)) {
      await client.query('ROLLBACK');
      return res.status(403).json({ error: 'Access denied' });
    }

    const listingResult = await client.query('SELECT * FROM bazaar_listings WHERE id = $1', [listing_id]);
    const listing = listingResult.rows[0];

    if (!listing) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Listing not found' });
    }

    if (listing.player_id === parseInt(player_id)) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Cannot buy your own listing' });
    }

    if (listing.quantity < quantity) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Not enough items in listing' });
    }

    const totalCost = listing.price * quantity;

    const buyerResult = await client.query('SELECT * FROM players WHERE id = $1', [player_id]);
    const buyer = buyerResult.rows[0];

    if (buyer.cash < totalCost) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Not enough cash' });
    }

    await client.query('UPDATE players SET cash = cash - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [totalCost, player_id]);
    await client.query('UPDATE players SET cash = cash + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [totalCost, listing.player_id]);

    const existingInventory = await client.query(
      'SELECT * FROM inventory WHERE player_id = $1 AND item_name = $2',
      [player_id, listing.item_name]
    );

    if (existingInventory.rows.length > 0) {
      await client.query(
        'UPDATE inventory SET quantity = quantity + $1 WHERE id = $2',
        [quantity, existingInventory.rows[0].id]
      );
    } else {
      await client.query(
        'INSERT INTO inventory (player_id, item_name, item_rarity, quantity) VALUES ($1, $2, $3, $4)',
        [player_id, listing.item_name, listing.item_rarity, quantity]
      );
    }

    if (listing.quantity === quantity) {
      await client.query('DELETE FROM bazaar_listings WHERE id = $1', [listing_id]);
    } else {
      await client.query('UPDATE bazaar_listings SET quantity = quantity - $1 WHERE id = $2', [quantity, listing_id]);
    }

    // Update player stats
    await client.query(
      'UPDATE players SET bazaar_purchases = bazaar_purchases + 1, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [player_id]
    );

    await client.query('COMMIT');

    // Check for achievements
    checkAchievements(player_id, pool);

    io.emit('bazaarUpdate');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
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

app.post('/api/upgrade', authenticateToken, [
  body('player_id').isInt().withMessage('Invalid player ID'),
  body('upgrade_type').isIn(['clicker', 'generator', 'protection']).withMessage('Invalid upgrade type'),
  body('level').isInt({ min: 1 }).withMessage('Invalid level')
], async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { player_id, upgrade_type, level } = req.body;

    // Verify user can only upgrade themselves
    if (req.user.id !== parseInt(player_id)) {
      await client.query('ROLLBACK');
      return res.status(403).json({ error: 'Access denied' });
    }

    const upgradeResult = await client.query(
      'SELECT * FROM upgrades WHERE upgrade_type = $1 AND level = $2',
      [upgrade_type, level]
    );
    const upgrade = upgradeResult.rows[0];

    if (!upgrade) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Invalid upgrade' });
    }

    const playerResult = await client.query('SELECT * FROM players WHERE id = $1', [player_id]);
    const player = playerResult.rows[0];

    if (player.cash < upgrade.cost) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Not enough cash' });
    }

    await client.query('UPDATE players SET cash = cash - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [upgrade.cost, player_id]);

    if (upgrade_type === 'clicker') {
      await client.query('UPDATE players SET clicker_level = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [level, player_id]);
    } else if (upgrade_type === 'autoclicker') {
      await client.query('UPDATE players SET autoclicker_level = $1, autoclicker_active = true, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [level, player_id]);

      // Start autoclicker for this player (will be handled on socket join)
    } else if (upgrade_type === 'generator') {
      await client.query('UPDATE players SET generator_level = $1, generator_active = true, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [level, player_id]);
    } else if (upgrade_type === 'protection') {
      await client.query('UPDATE players SET protection_level = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [level, player_id]);
    }

    const updatedPlayer = await client.query('SELECT * FROM players WHERE id = $1', [player_id]);
    await client.query('COMMIT');
    res.json({ success: true, player: updatedPlayer.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
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

app.post('/api/breach', authenticateToken, [
  body('attacker_id').isInt().withMessage('Invalid attacker ID'),
  body('target_id').isInt().withMessage('Invalid target ID'),
  body('tool_level').isInt({ min: 1, max: 5 }).withMessage('Invalid tool level')
], async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { attacker_id, target_id, tool_level } = req.body;

    // Verify user can only breach as themselves
    if (req.user.id !== parseInt(attacker_id)) {
      await client.query('ROLLBACK');
      return res.status(403).json({ error: 'Access denied' });
    }

    const attackerResult = await client.query('SELECT * FROM players WHERE id = $1', [attacker_id]);
    const attacker = attackerResult.rows[0];

    const targetResult = await client.query('SELECT * FROM players WHERE id = $1', [target_id]);
    const target = targetResult.rows[0];

    if (!target) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Target not found' });
    }

    if (target.cash < 100) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Target has insufficient funds to breach' });
    }

    const toolResult = await client.query('SELECT * FROM breach_tools WHERE level = $1', [tool_level]);
    const tool = toolResult.rows[0];

    if (!tool) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Invalid tool level' });
    }

    if (attacker.cash < tool.price) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Not enough cash to purchase breach tool' });
    }

    await client.query('UPDATE players SET cash = cash - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [tool.price, attacker_id]);

    const success = tool_level > target.protection_level;

    if (success) {
      const stealPercentage = 0.10 + (tool_level * 0.05);
      const stolenAmount = target.cash * stealPercentage;

      await client.query('UPDATE players SET cash = cash - $1, last_breach = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [stolenAmount, target_id]);
      await client.query('UPDATE players SET cash = cash + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [stolenAmount, attacker_id]);

      await client.query('COMMIT');

      // Update attacker stats
      await pool.query(
        'UPDATE players SET successful_breaches = successful_breaches + 1, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
        [attacker_id]
      );

      // Check for achievements
      checkAchievements(attacker_id, pool);

      io.emit('playerUpdate', { player_id: target_id });
      io.emit('playerUpdate', { player_id: attacker_id });

      res.json({ success: true, stolenAmount, message: `Successfully breached ${target.username} and stole $${stolenAmount.toFixed(2)}` });
    } else {
      // Breach failed - attacker spent money but didn't succeed
      await client.query('COMMIT');
      res.json({ success: false, message: `Breach failed! ${target.username}'s protection was too strong.` });
    }
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, cash, level FROM players ORDER BY cash DESC LIMIT 20');
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

      // Start autoclicker if active
      if (result.rows[0].autoclicker_active && result.rows[0].autoclicker_level > 0) {
        startAutoclicker(result.rows[0].id, username, result.rows[0].autoclicker_level);
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);

    // Clear autoclicker interval for this player
    if (socket.playerId && autoclickerIntervals.has(socket.playerId)) {
      clearInterval(autoclickerIntervals.get(socket.playerId));
      autoclickerIntervals.delete(socket.playerId);
    }
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

        await pool.query(
          'UPDATE players SET total_items_obtained = total_items_obtained + 1, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
          [player.id]
        );

        io.to(player.username).emit('generatorItem', { item });
      }
    }
  } catch (err) {
    console.error('Generator error:', err);
  }
}, 5000);

// Autoclicker interval
const autoclickerIntervals = new Map();

function startAutoclicker(playerId, username, level) {
  // Clear existing interval if any
  if (autoclickerIntervals.has(playerId)) {
    clearInterval(autoclickerIntervals.get(playerId));
  }

  // Set interval based on level
  const intervals = {
    1: 10000, // 10 seconds
    2: 5000,  // 5 seconds
    3: 3000,  // 3 seconds
    4: 1000   // 1 second
  };

  const intervalTime = intervals[level] || 10000;

  const intervalId = setInterval(async () => {
    try {
      const playerResult = await pool.query('SELECT * FROM players WHERE id = $1', [playerId]);
      const player = playerResult.rows[0];

      if (!player || !player.autoclicker_active) {
        clearInterval(intervalId);
        autoclickerIntervals.delete(playerId);
        return;
      }

      const item = generateItem(player.clicker_level);

      await pool.query(
        'INSERT INTO inventory (player_id, item_name, item_rarity, quantity) VALUES ($1, $2, $3, 1) ON CONFLICT DO NOTHING',
        [playerId, item.name, item.rarity]
      );

      const existingItem = await pool.query(
        'SELECT * FROM inventory WHERE player_id = $1 AND item_name = $2',
        [playerId, item.name]
      );

      if (existingItem.rows.length > 0) {
        await pool.query(
          'UPDATE inventory SET quantity = quantity + 1 WHERE id = $1',
          [existingItem.rows[0].id]
        );
      }

      // Update player stats and add XP
      const xpGained = 1;
      const newXp = player.xp + xpGained;
      const newLevel = Math.floor(newXp / 100) + 1;

      await pool.query(
        'UPDATE players SET total_clicks = total_clicks + 1, total_items_obtained = total_items_obtained + 1, xp = $1, level = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
        [newXp, newLevel, playerId]
      );

      io.to(username).emit('autoclickerItem', { item, xpGained, newLevel, levelUp: newLevel > player.level });
    } catch (err) {
      console.error('Autoclicker error:', err);
    }
  }, intervalTime);

  autoclickerIntervals.set(playerId, intervalId);
}

// Daily rewards endpoint
app.post('/api/daily-reward', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const player_id = req.user.id;

    const playerResult = await client.query('SELECT * FROM players WHERE id = $1', [player_id]);
    const player = playerResult.rows[0];

    const now = new Date();
    const lastReward = player.last_daily_reward ? new Date(player.last_daily_reward) : null;

    // Calculate streak bonus
    let streak = player.daily_streak + 1;

    // Check if reward can be claimed (must be at least 24 hours since last reward)
    if (lastReward) {
      const hoursSinceLastReward = (now - lastReward) / (1000 * 60 * 60);
      if (hoursSinceLastReward < 24) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Daily reward already claimed. Come back tomorrow!' });
      }
      // Reset streak if more than 48 hours have passed
      if (hoursSinceLastReward > 48) {
        streak = 1;
      }
    }
    let bonusMultiplier = 1 + (streak * 0.1); // 10% bonus per streak day
    if (bonusMultiplier > 3) bonusMultiplier = 3; // Cap at 3x

    const baseReward = 50.00;
    const finalReward = baseReward * bonusMultiplier;
    const xpReward = 25 * streak;

    // Update player
    await client.query(
      'UPDATE players SET cash = cash + $1, xp = xp + $2, daily_streak = $3, last_daily_reward = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $4',
      [finalReward, xpReward, streak, player_id]
    );

    await client.query('COMMIT');

    // Check for achievements (use pool since client will be released)
    setTimeout(() => checkAchievements(player_id, pool), 0);

    res.json({
      success: true,
      reward: finalReward,
      xpReward,
      streak,
      message: `Daily reward claimed! $${finalReward.toFixed(2)} + ${xpReward} XP (Streak: ${streak}x)`
    });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// Achievements endpoint
app.get('/api/achievements', authenticateToken, async (req, res) => {
  try {
    const player_id = req.user.id;

    const allAchievements = await pool.query('SELECT * FROM achievements ORDER BY requirement_type, requirement_value');
    const unlockedAchievements = await pool.query(
      'SELECT achievement_id FROM player_achievements WHERE player_id = $1',
      [player_id]
    );
    const unlockedIds = new Set(unlockedAchievements.rows.map(a => a.achievement_id));

    const achievements = allAchievements.rows.map(achievement => ({
      ...achievement,
      unlocked: unlockedIds.has(achievement.id)
    }));

    res.json(achievements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

server.listen(PORT, () => {
  console.log(`Vaultoria server running on port ${PORT}`);
});
