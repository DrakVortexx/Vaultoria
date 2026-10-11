-- ============================================================
-- Vaultoria database schema (PostgreSQL / Neon)
-- Run automatically by server.js on boot. Safe to re-run.
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(20) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- One row of persistent game progress per player.
CREATE TABLE IF NOT EXISTS player_state (
  user_id       INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  money         BIGINT      NOT NULL DEFAULT 0,
  level         INTEGER     NOT NULL DEFAULT 1,
  counts        JSONB       NOT NULL DEFAULT '{}'::jsonb,
  stats         JSONB       NOT NULL DEFAULT '{"ig":0,"earned":0,"seen":[],"best":-1}'::jsonb,
  achievements  JSONB       NOT NULL DEFAULT '[]'::jsonb,
  tutorial_done BOOLEAN     NOT NULL DEFAULT FALSE,
  px            REAL        NOT NULL DEFAULT 0,
  py            REAL        NOT NULL DEFAULT 0,
  server_id     INTEGER,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS servers (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(40) NOT NULL,
  is_open    BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8 slots per server. A player's slot determines which vault is theirs.
CREATE TABLE IF NOT EXISTS server_members (
  id        SERIAL PRIMARY KEY,
  server_id INTEGER NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  user_id   INTEGER NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
  slot      INTEGER NOT NULL,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (server_id, user_id),
  UNIQUE (server_id, slot)
);

CREATE TABLE IF NOT EXISTS bazaar_listings (
  id         SERIAL PRIMARY KEY,
  seller_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_name  TEXT    NOT NULL,
  rarity     TEXT    NOT NULL,
  price      BIGINT  NOT NULL,
  quantity   INTEGER NOT NULL DEFAULT 1,
  sold       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS friendships (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  friend_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status     TEXT    NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, friend_id)
);

CREATE INDEX IF NOT EXISTS idx_members_server   ON server_members (server_id);
CREATE INDEX IF NOT EXISTS idx_bazaar_active     ON bazaar_listings (sold, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_friendships_user  ON friendships (user_id);
CREATE INDEX IF NOT EXISTS idx_friendships_friend ON friendships (friend_id);
