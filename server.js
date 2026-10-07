const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/vaultoria'
});

app.use(express.json());
app.use(express.static('.'));

// Initialize database
app.post('/api/init', async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        x_position INTEGER DEFAULT 100,
        y_position INTEGER DEFAULT 100,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    res.json({ message: 'Database initialized' });
  } catch (error) {
    res.status(500).json({ message: 'Database error' });
  }
});

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2)',
      [username, hashedPassword]
    );

    res.json({ message: 'User registered successfully' });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Username already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, username: user.username, x: user.x_position, y: user.y_position });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update position
app.post('/api/position', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const { x, y } = req.body;

    await pool.query(
      'UPDATE users SET x_position = $1, y_position = $2 WHERE id = $3',
      [x, y, decoded.userId]
    );

    res.json({ message: 'Position updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT username, x_position, y_position FROM users');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
