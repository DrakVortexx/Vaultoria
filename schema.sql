-- Players table
CREATE TABLE IF NOT EXISTS players (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  cash DECIMAL(20, 2) DEFAULT 100.00,
  protection_level INTEGER DEFAULT 1,
  clicker_level INTEGER DEFAULT 1,
  autoclicker_level INTEGER DEFAULT 0,
  autoclicker_active BOOLEAN DEFAULT false,
  generator_level INTEGER DEFAULT 0,
  generator_active BOOLEAN DEFAULT false,
  last_breach TIMESTAMP,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  daily_streak INTEGER DEFAULT 0,
  last_daily_reward TIMESTAMP,
  total_clicks INTEGER DEFAULT 0,
  total_items_obtained INTEGER DEFAULT 0,
  bazaar_sales INTEGER DEFAULT 0,
  bazaar_purchases INTEGER DEFAULT 0,
  successful_breaches INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
  item_name VARCHAR(100) NOT NULL,
  item_rarity VARCHAR(20) NOT NULL,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bazaar listings table
CREATE TABLE IF NOT EXISTS bazaar_listings (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
  item_name VARCHAR(100) NOT NULL,
  item_rarity VARCHAR(20) NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(20, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Breach tools table (shop items)
CREATE TABLE IF NOT EXISTS breach_tools (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  level INTEGER NOT NULL,
  price DECIMAL(20, 2) NOT NULL,
  success_rate DECIMAL(5, 2) NOT NULL
);

-- Insert default breach tools
INSERT INTO breach_tools (name, level, price, success_rate) VALUES
  ('Basic Scanner', 1, 500.00, 20.00),
  ('Network Sniffer', 2, 1500.00, 35.00),
  ('Packet Injector', 3, 4000.00, 50.00),
  ('Zero-Day Exploit', 4, 10000.00, 70.00),
  ('Quantum Decryptor', 5, 25000.00, 90.00)
ON CONFLICT DO NOTHING;

-- Upgrade costs table
CREATE TABLE IF NOT EXISTS upgrades (
  id SERIAL PRIMARY KEY,
  upgrade_type VARCHAR(50) NOT NULL,
  level INTEGER NOT NULL,
  cost DECIMAL(20, 2) NOT NULL,
  description TEXT
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  requirement_type VARCHAR(50) NOT NULL,
  requirement_value INTEGER NOT NULL,
  reward_xp INTEGER NOT NULL,
  reward_cash DECIMAL(20, 2) NOT NULL
);

-- Player achievements table
CREATE TABLE IF NOT EXISTS player_achievements (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
  achievement_id INTEGER REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(player_id, achievement_id)
);

-- Insert default achievements
INSERT INTO achievements (name, description, requirement_type, requirement_value, reward_xp, reward_cash) VALUES
  ('First Steps', 'Click for the first time', 'clicks', 1, 10, 5.00),
  ('Clicker Novice', 'Click 100 times', 'clicks', 100, 50, 25.00),
  ('Clicker Expert', 'Click 1000 times', 'clicks', 1000, 200, 100.00),
  ('Clicker Master', 'Click 10000 times', 'clicks', 10000, 1000, 500.00),
  ('First Item', 'Obtain your first item', 'items_obtained', 1, 10, 5.00),
  ('Collector', 'Obtain 100 items', 'items_obtained', 100, 100, 50.00),
  ('Hoarding', 'Obtain 1000 items', 'items_obtained', 1000, 500, 250.00),
  ('First Sale', 'Sell your first item on bazaar', 'bazaar_sales', 1, 20, 10.00),
  ('Merchant', 'Sell 10 items on bazaar', 'bazaar_sales', 10, 100, 50.00),
  ('Tycoon', 'Sell 100 items on bazaar', 'bazaar_sales', 100, 500, 250.00),
  ('First Purchase', 'Buy your first item from bazaar', 'bazaar_purchases', 1, 20, 10.00),
  ('Shopaholic', 'Buy 10 items from bazaar', 'bazaar_purchases', 10, 100, 50.00),
  ('First Breach', 'Successfully breach another player', 'breaches', 1, 50, 25.00),
  ('Hacker', 'Breach 10 players', 'breaches', 10, 250, 125.00),
  ('Daily Streak 3', 'Login for 3 consecutive days', 'daily_streak', 3, 100, 50.00),
  ('Daily Streak 7', 'Login for 7 consecutive days', 'daily_streak', 7, 300, 150.00),
  ('Daily Streak 30', 'Login for 30 consecutive days', 'daily_streak', 30, 1500, 750.00),
  ('Level 5', 'Reach level 5', 'level', 5, 200, 100.00),
  ('Level 10', 'Reach level 10', 'level', 10, 500, 250.00),
  ('Level 25', 'Reach level 25', 'level', 25, 2000, 1000.00)
ON CONFLICT DO NOTHING;

-- Insert default upgrades
INSERT INTO upgrades (upgrade_type, level, cost, description) VALUES
  ('clicker', 1, 0, 'Basic manual clicker'),
  ('clicker', 2, 100, 'Unlocks Rare item drops'),
  ('clicker', 3, 500, 'Unlocks Epic item drops'),
  ('clicker', 4, 2000, 'Unlocks Legendary item drops'),
  ('autoclicker', 1, 500, 'Auto-clicks every 10 seconds'),
  ('autoclicker', 2, 1500, 'Auto-clicks every 5 seconds'),
  ('autoclicker', 3, 4000, 'Auto-clicks every 3 seconds'),
  ('autoclicker', 4, 10000, 'Auto-clicks every 1 second'),
  ('generator', 1, 200, 'Basic auto-generator (produces junk)'),
  ('generator', 2, 500, 'Improved generator (produces common items)'),
  ('generator', 3, 1500, 'Advanced generator (produces rare items)'),
  ('generator', 4, 5000, 'Elite generator (produces epic items)'),
  ('protection', 1, 0, 'Basic firewall'),
  ('protection', 2, 300, 'Advanced firewall'),
  ('protection', 3, 1000, 'Military-grade encryption'),
  ('protection', 4, 3000, 'Quantum encryption'),
  ('protection', 5, 10000, 'Neural network defense')
ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_inventory_player ON inventory(player_id);
CREATE INDEX IF NOT EXISTS idx_bazaar_player ON bazaar_listings(player_id);
CREATE INDEX IF NOT EXISTS idx_bazaar_item ON bazaar_listings(item_name);
