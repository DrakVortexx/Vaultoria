-- ============================================================
-- Vaultoria database migration (PostgreSQL / Neon)
-- Brings an EXISTING database up to the current schema WITHOUT
-- dropping any data. Idempotent: safe to re-run.
--
-- Reference: schema.sql (auto-applied by server.js on boot).
-- This file is the manual one-click version — it extends schema.sql
-- with the data migrations that server.js performs in JS:
--   * backfill stats."trades"
--   * purge legacy item keys / bazaar listings from the old catalog
--
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
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Latest shape of player_state. Tables created by an older schema are
-- upgraded column-by-column in section 2 below.
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

-- Persistent world rooms + membership (survive server restarts).
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

-- ------------------------------------------------------------
-- 2. Columns that may be missing on older tables
--    (ADD COLUMN IF NOT EXISTS fills existing rows with the default)
-- ------------------------------------------------------------
ALTER TABLE users            ADD COLUMN IF NOT EXISTS is_admin      BOOLEAN     NOT NULL DEFAULT FALSE;

ALTER TABLE player_state     ADD COLUMN IF NOT EXISTS money         BIGINT      NOT NULL DEFAULT 0;
ALTER TABLE player_state     ADD COLUMN IF NOT EXISTS level         INTEGER     NOT NULL DEFAULT 1;
ALTER TABLE player_state     ADD COLUMN IF NOT EXISTS counts        JSONB       NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE player_state     ADD COLUMN IF NOT EXISTS stats         JSONB       NOT NULL DEFAULT '{"ig":0,"earned":0,"seen":[],"best":-1,"trades":0}'::jsonb;
ALTER TABLE player_state     ADD COLUMN IF NOT EXISTS achievements  JSONB       NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE player_state     ADD COLUMN IF NOT EXISTS tutorial_done BOOLEAN     NOT NULL DEFAULT FALSE;
ALTER TABLE player_state     ADD COLUMN IF NOT EXISTS px            REAL        NOT NULL DEFAULT 0;
ALTER TABLE player_state     ADD COLUMN IF NOT EXISTS py            REAL        NOT NULL DEFAULT 0;
ALTER TABLE player_state     ADD COLUMN IF NOT EXISTS updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE player_state     ADD COLUMN IF NOT EXISTS last_login    TEXT;
ALTER TABLE player_state     ADD COLUMN IF NOT EXISTS login_streak  INTEGER     NOT NULL DEFAULT 0;
ALTER TABLE player_state     ADD COLUMN IF NOT EXISTS daily         JSONB       NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE player_state     ADD COLUMN IF NOT EXISTS rebirths      INTEGER     NOT NULL DEFAULT 0;
ALTER TABLE player_state     ADD COLUMN IF NOT EXISTS shield_until  TIMESTAMPTZ;
ALTER TABLE player_state     ADD COLUMN IF NOT EXISTS trade_privacy TEXT        NOT NULL DEFAULT 'everyone';
ALTER TABLE player_state     ADD COLUMN IF NOT EXISTS last_wheel    BIGINT      NOT NULL DEFAULT 0;
ALTER TABLE player_state     ADD COLUMN IF NOT EXISTS breaches      INTEGER     NOT NULL DEFAULT 0;

ALTER TABLE users            ADD COLUMN IF NOT EXISTS banned_until  TIMESTAMPTZ;
ALTER TABLE users            ADD COLUMN IF NOT EXISTS muted_until   TIMESTAMPTZ;

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

-- 4a. Give every existing player_state.stats the "trades" key used by the
--     trading system (new rows already get it from the column default).
UPDATE player_state
   SET stats = coalesce(stats, '{}'::jsonb)
             || jsonb_build_object('trades', coalesce(NULLIF(stats ->> 'trades', ''), '0')::int)
 WHERE stats IS NULL OR NOT stats ? 'trades';

-- 4b. Legacy catalog purge. The item catalog was fully replaced; strip any
--     inventory / listing keys that no longer exist. Mutated items use the
--     composite key "<mutationId>.<itemName>" (removed below) so the check is
--     against the base item name after the separator.
--     The whitelist below MUST match ITEMS_BY_RARITY / ITEM_BASE in server.js.
CREATE TEMP TABLE IF NOT EXISTS _valid_catalog (name TEXT PRIMARY KEY);
TRUNCATE _valid_catalog;
INSERT INTO _valid_catalog (name) VALUES 'Iron Scrap','Cracked Stone','Copper Wire','Coal Chunk','Rusty Bolt';
INSERT INTO _valid_catalog (name) VALUES 'Glass Shard','Faded Circuit','Dust Crystal','Scrap Metal','Empty Power Cell';
INSERT INTO _valid_catalog (name) VALUES 'Refined Iron','Charged Battery','Polished Copper','Reinforced Gear','Emerald Circuit';
INSERT INTO _valid_catalog (name) VALUES 'Stable Energy Core','Quartz Lens','Dense Alloy','Neon Shard','Compressed Coal';
INSERT INTO _valid_catalog (name) VALUES 'Plasma Crystal','Quantum Circuit','Titanium Plate','Void Glass','Flux Capacitor';
INSERT INTO _valid_catalog (name) VALUES 'Synthetic Diamond','Magnetic Core','Arc Battery','Echo Fragment','Reinforced Data Chip';
INSERT INTO _valid_catalog (name) VALUES 'Rift Crystal','Quantum Battery','Phantom Alloy','Chrono Gear','Dimensional Lens';
INSERT INTO _valid_catalog (name) VALUES 'Singularity Dust','Astral Circuit','Void Battery','Gravity Core','Phase Fragment';
INSERT INTO _valid_catalog (name) VALUES 'Solar Core','Golden Singularity','Phoenix Circuit','Celestial Alloy','Eternal Battery';
INSERT INTO _valid_catalog (name) VALUES 'Starforge Crystal','Timekeeper Gear','Royal Voidstone','Aether Engine','Crown Fragment';
INSERT INTO _valid_catalog (name) VALUES 'Bloodmoon Core','Oblivion Shard','Infernal Reactor','Reality Fracture','Dragonheart Battery';
INSERT INTO _valid_catalog (name) VALUES 'Chaos Engine','Worldbreaker Alloy','Crimson Singularity','Godforge Fragment','Eclipse Relic';
INSERT INTO _valid_catalog (name) VALUES 'Heavenstone','Genesis Core','Seraphic Engine','Miracle Fragment','Dawn Singularity';
INSERT INTO _valid_catalog (name) VALUES 'Divine Circuit','Worldroot Crystal','Sacred Chrono Gear','Creation Battery','Halo of Eternity';
INSERT INTO _valid_catalog (name) VALUES 'Nebula Heart','Galaxy Engine','Starborn Relic','Cosmic Prism','Astral Crown';
INSERT INTO _valid_catalog (name) VALUES 'Blackstar Core','Universe Fragment','Event Horizon Lens','Multiverse Battery','Celestial Throne';
INSERT INTO _valid_catalog (name) VALUES 'Infinity Heart','Eternal Singularity','Timebreak Relic','Unending Engine','Immortal Prism';
INSERT INTO _valid_catalog (name) VALUES 'Endlessness Core','Absolute Chrono Gear','Evernight Crystal','Eternal Crown','Last Light of Time';
INSERT INTO _valid_catalog (name) VALUES 'Omniversal Seed','Reality''s Last Spark','Infinite Paradox','The First Singularity','Multiverse Heart';
INSERT INTO _valid_catalog (name) VALUES 'Absolute Infinity','The Unwritten World','Omniscient Core','The Final Constant','The Omniversal';

-- 4c. Remove legacy keys from inventories (mutation prefix stripped first).
DO $$
DECLARE
  r record;
  k text;
  n jsonb;
  base text;
BEGIN
  FOR r IN SELECT user_id, counts FROM player_state LOOP
    IF r.counts IS NULL OR jsonb_typeof(r.counts) <> 'object' THEN
      CONTINUE;
    END IF;
    n := '{}'::jsonb;
    FOR k IN SELECT jsonb_object_keys(r.counts) LOOP
      base := split_part(k, chr(8479), 2); -- strip "<mutationId>." prefix
      IF EXISTS (SELECT 1 FROM _valid_catalog v WHERE v.name = base) THEN
        n := n || jsonb_build_object(k, r.counts -> k);
      END IF;
    END LOOP;
    IF n IS DISTINCT FROM r.counts THEN
      UPDATE player_state SET counts = n WHERE user_id = r.user_id;
    END IF;
  END LOOP;
END $$;

-- 4d. Remove bazaar listings that reference retired catalog items.
DELETE FROM bazaar_listings
 WHERE item_name <> ALL (SELECT name FROM _valid_catalog);

DROP TABLE _valid_catalog;

COMMIT;

-- ============================================================
-- Done. The database is now up to date with schema.sql.
-- ============================================================