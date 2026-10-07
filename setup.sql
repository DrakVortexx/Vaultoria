-- Vaultoria persistent data schema for PostgreSQL / Neon.
-- server.js also creates these tables automatically at startup.

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
