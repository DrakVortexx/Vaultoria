-- Players table
CREATE TABLE IF NOT EXISTS players (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  cash DECIMAL(20, 2) DEFAULT 100.00,
  protection_level INTEGER DEFAULT 1,
  clicker_level INTEGER DEFAULT 1,
  generator_level INTEGER DEFAULT 0,
  generator_active BOOLEAN DEFAULT false,
  last_breach TIMESTAMP,
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
  ('Basic Scanner', 1, 50.00, 20.00),
  ('Network Sniffer', 2, 150.00, 35.00),
  ('Packet Injector', 3, 400.00, 50.00),
  ('Zero-Day Exploit', 4, 1000.00, 70.00),
  ('Quantum Decryptor', 5, 2500.00, 90.00)
ON CONFLICT DO NOTHING;

-- Upgrade costs table
CREATE TABLE IF NOT EXISTS upgrades (
  id SERIAL PRIMARY KEY,
  upgrade_type VARCHAR(50) NOT NULL,
  level INTEGER NOT NULL,
  cost DECIMAL(20, 2) NOT NULL,
  description TEXT
);

-- Insert default upgrades
INSERT INTO upgrades (upgrade_type, level, cost, description) VALUES
  ('clicker', 1, 0, 'Basic manual clicker'),
  ('clicker', 2, 100, 'Unlocks Rare item drops'),
  ('clicker', 3, 500, 'Unlocks Epic item drops'),
  ('clicker', 4, 2000, 'Unlocks Legendary item drops'),
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
