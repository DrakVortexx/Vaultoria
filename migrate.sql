-- ============================================================
-- Vaultoria database migration (PostgreSQL / Neon)
-- Brings an EXISTING database up to the current schema WITHOUT
-- dropping any data. Idempotent: safe to re-run.
--
-- Reference: schema.sql (auto-applied by server.js on boot).
-- This file is the manual one-click version.
-- Run from the command line:
--   psql "$DATABASE_URL" -f migrate.sql
-- or paste the whole file into the Neon SQL editor.
-- ============================================================

BEGIN;

-- ------------------------------------------------------------
-- 1. Tables that must exist (no-ops if already present)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(20) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_admin      BOOLEAN     NOT NULL DEFAULT FALSE,
  banned_until  TIMESTAMPTZ,
  muted_until   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS player_state (
  user_id       INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  money         BIGINT      NOT NULL DEFAULT 0,
  level         INTEGER     NOT NULL DEFAULT 1,
  counts        JSONB       NOT NULL DEFAULT '{}'::jsonb,
  stats         JSONB       NOT NULL DEFAULT '{"ig":0,"earned":0,"seen":[],"best":-1,"trades":0}'::jsonb,
  achievements  JSONB       NOT NULL DEFAULT '[]'::jsonb,
  tutorial_done BOOLEAN     NOT NULL DEFAULT FALSE,
  px            REAL        NOT NULL DEFAULT 0,
  py            REAL        NOT NULL DEFAULT 0,
  last_login    TEXT,
  login_streak  INTEGER     NOT NULL DEFAULT 0,
  daily         JSONB       NOT NULL DEFAULT '{}'::jsonb,
  rebirths      INTEGER     NOT NULL DEFAULT 0,
  shield_until  TIMESTAMPTZ,
  trade_privacy TEXT        NOT NULL DEFAULT 'everyone',
  last_wheel    BIGINT      NOT NULL DEFAULT 0,
  breaches      INTEGER     NOT NULL DEFAULT 0,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bazaar_listings (
  id         SERIAL PRIMARY KEY,
  seller_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_name  TEXT    NOT NULL,
  rarity     TEXT    NOT NULL,
  price      BIGINT  NOT NULL,
  quantity   INTEGER NOT NULL DEFAULT 1,
  mutation   TEXT,
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

CREATE TABLE IF NOT EXISTS worlds (
  id         INTEGER PRIMARY KEY,
  name       TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS world_members (
  world_id INTEGER NOT NULL REFERENCES worlds(id) ON DELETE CASCADE,
  user_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  slot     INTEGER NOT NULL,
  PRIMARY KEY (world_id, user_id)
);

CREATE TABLE IF NOT EXISTS bosses (
  id          SERIAL PRIMARY KEY,
  name        TEXT        NOT NULL,
  hp          BIGINT      NOT NULL,
  max_hp      BIGINT      NOT NULL,
  pool_value  BIGINT      NOT NULL DEFAULT 0,
  started_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  defeated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS boss_contributions (
  boss_id  INTEGER NOT NULL REFERENCES bosses(id) ON DELETE CASCADE,
  user_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  damage   BIGINT  NOT NULL DEFAULT 0,
  value    BIGINT  NOT NULL DEFAULT 0,
  PRIMARY KEY (boss_id, user_id)
);

-- ------------------------------------------------------------
-- 2. Columns that may be missing on older tables
-- ------------------------------------------------------------
ALTER TABLE users            ADD COLUMN IF NOT EXISTS is_admin      BOOLEAN     NOT NULL DEFAULT FALSE;
ALTER TABLE users            ADD COLUMN IF NOT EXISTS banned_until  TIMESTAMPTZ;
ALTER TABLE users            ADD COLUMN IF NOT EXISTS muted_until   TIMESTAMPTZ;

ALTER TABLE player_state     ADD COLUMN IF NOT EXISTS money         BIGINT      NOT NULL DEFAULT 0;
ALTER TABLE player_state     ADD COLUMN IF NOT EXISTS level         INTEGER     NOT NULL DEFAULT 1;
ALTER TABLE player_state     ADD COLUMN IF NOT EXISTS counts        JSONB       NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE player_state     ADD COLUMN IF NOT EXISTS stats         JSONB       NOT NULL DEFAULT '{"ig":0,"earned":0,"seen":[],"best":-1,"trades":0}'::jsonb;
ALTER TABLE player_state     ADD COLUMN IF NOT EXISTS achievements  JSONB       NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE player_state     ADD COLUMN IF NOT EXISTS tutorial_done BOOLEAN     NOT NULL DEFAULT FALSE;
ALTER TABLE player_state     ADD COLUMN IF NOT EXISTS px            REAL        NOT NULL DEFAULT 0;
ALTER TABLE player_state     ADD COLUMN IF NOT EXISTS py            REAL        NOT NULL DEFAULT 0;
ALTER TABLE player_state     ADD COLUMN IF NOT EXISTS last_login    TEXT;
ALTER TABLE player_state     ADD COLUMN IF NOT EXISTS login_streak  INTEGER     NOT NULL DEFAULT 0;
ALTER TABLE player_state     ADD COLUMN IF NOT EXISTS daily         JSONB       NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE player_state     ADD COLUMN IF NOT EXISTS rebirths      INTEGER     NOT NULL DEFAULT 0;
ALTER TABLE player_state     ADD COLUMN IF NOT EXISTS shield_until  TIMESTAMPTZ;
ALTER TABLE player_state     ADD COLUMN IF NOT EXISTS trade_privacy TEXT        NOT NULL DEFAULT 'everyone';
ALTER TABLE player_state     ADD COLUMN IF NOT EXISTS last_wheel    BIGINT      NOT NULL DEFAULT 0;
ALTER TABLE player_state     ADD COLUMN IF NOT EXISTS breaches      INTEGER     NOT NULL DEFAULT 0;
ALTER TABLE player_state     ADD COLUMN IF NOT EXISTS updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER TABLE bazaar_listings  ADD COLUMN IF NOT EXISTS quantity      INTEGER     NOT NULL DEFAULT 1;
ALTER TABLE bazaar_listings  ADD COLUMN IF NOT EXISTS mutation      TEXT;
ALTER TABLE bazaar_listings  ADD COLUMN IF NOT EXISTS sold          BOOLEAN     NOT NULL DEFAULT FALSE;

-- ------------------------------------------------------------
-- 3. Indexes
-- ------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_bazaar_active      ON bazaar_listings (sold, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_friendships_user   ON friendships (user_id);
CREATE INDEX IF NOT EXISTS idx_friendships_friend ON friendships (friend_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username_lower ON users (lower(username));
CREATE INDEX IF NOT EXISTS idx_boss_active        ON bosses (defeated_at);

-- ------------------------------------------------------------
-- 4. Data migrations (safe, idempotent)
-- ------------------------------------------------------------
UPDATE player_state
   SET stats = coalesce(stats, '{}'::jsonb)
             || jsonb_build_object('trades', coalesce(NULLIF(stats ->> 'trades', ''), '0')::int)
 WHERE stats IS NULL OR NOT stats ? 'trades';

-- Ensure daily exists with proper structure
UPDATE player_state
   SET daily = coalesce(daily, '{}'::jsonb)
 WHERE daily IS NULL OR jsonb_typeof(daily) <> 'object';

COMMIT;