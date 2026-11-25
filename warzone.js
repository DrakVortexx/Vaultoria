'use strict';

const ARENA_W = 960;
const ARENA_H = 600;
const FIGHTER_W = 40;
const FIGHTER_H = 58;
const MAX_HP = 100;
const ATTACK_DAMAGE = 10;
const ATTACK_COOLDOWN_MS = 600;
const ATTACK_REACH = 56;
const MOVE_SPEED = 200;
const TICK_MS = 50;
const INPUT_MIN_GAP_MS = 40;
const FIGHT_TIMEOUT_MS = 120000;
const RECONNECT_GRACE_MS = 10000;
const LOBBY_TIMEOUT_MS = 90000;
const CHALLENGE_TTL_MS = 60000;
const MIN_MONEY_WAGER = 1000;
const MAX_MONEY_WAGER = 1000000000000;
const MAX_ITEM_QTY = 12;

function clampInt(value, min, max, fallback) {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function normalizeWager(raw, counts, itemExists) {
  const w = raw && typeof raw === 'object' ? raw : { type: 'none' };
  if (w.type === 'none' || w.type === null || w.type === undefined) return { ok: true, wager: { type: 'none' } };
  if (w.type === 'money') {
    const amount = Math.floor(Number(w.amount));
    if (!Number.isFinite(amount) || amount < MIN_MONEY_WAGER || amount > MAX_MONEY_WAGER) {
      return { ok: false, error: 'Invalid money wager' };
    }
    return { ok: true, wager: { type: 'money', amount } };
  }
  if (w.type === 'item') {
    const key = typeof w.key === 'string' ? w.key : '';
    const qty = Math.floor(Number(w.qty));
    if (!key || !Number.isFinite(qty) || qty < 1 || qty > MAX_ITEM_QTY || !itemExists(key)) {
      return { ok: false, error: 'Invalid wager item' };
    }
    if ((Number((counts || {})[key]) || 0) < qty) return { ok: false, error: 'You do not own that item' };
    return { ok: true, wager: { type: 'item', key, qty } };
  }
  return { ok: false, error: 'Invalid wager type' };
}

function moneyOf(wager) {
  return wager && wager.type === 'money' ? wager.amount : 0;
}

function applyWagerToCounts(counts, wager, sign) {
  if (!wager || wager.type !== 'item') return counts;
  const next = counts && typeof counts === 'object' ? counts : {};
  const key = wager.key;
  const qty = clampInt(wager.qty, 1, MAX_ITEM_QTY, 1);
  const total = (Number(next[key]) || 0) + sign * qty;
  if (total > 0) next[key] = total;
  else delete next[key];
  return next;
}

function clampAxis(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(-1, n));
}

function stepPosition(pos, ix, iy, dtSec) {
  let x = clampAxis(ix);
  let y = clampAxis(iy);
  const mag = Math.hypot(x, y);
  if (mag > 1) { x /= mag; y /= mag; }
  const dt = Math.min(0.25, Math.max(0, Number(dtSec) || 0));
  return {
    x: Math.min(ARENA_W - FIGHTER_W, Math.max(0, Number(pos.x) + x * MOVE_SPEED * dt)),
    y: Math.min(ARENA_H - FIGHTER_H, Math.max(0, Number(pos.y) + y * MOVE_SPEED * dt))
  };
}

function facingFromInput(ix, iy, fallback) {
  let x = clampAxis(ix);
  let y = clampAxis(iy);
  const mag = Math.hypot(x, y);
  if (mag < 0.01) return fallback && Number.isFinite(fallback.x) && Number.isFinite(fallback.y)
    ? { x: fallback.x, y: fallback.y }
    : { x: 0, y: 1 };
  return { x: x / mag, y: y / mag };
}

function inAttackRange(attacker, target) {
  const acx = Number(attacker.x) + FIGHTER_W / 2;
  const acy = Number(attacker.y) + FIGHTER_H / 2;
  const tcx = Number(target.x) + FIGHTER_W / 2;
  const tcy = Number(target.y) + FIGHTER_H / 2;
  const dx = tcx - acx;
  const dy = tcy - acy;
  const dist = Math.hypot(dx, dy);
  if (dist > ATTACK_REACH || dist < 0.001) return false;
  const fx = Number(attacker.facing && attacker.facing.x);
  const fy = Number(attacker.facing && attacker.facing.y);
  if (!Number.isFinite(fx) || !Number.isFinite(fy)) return true;
  return (dx / dist) * fx + (dy / dist) * fy > 0;
}

function canAttack(now, lastAttackAt) {
  return Number(now) - Number(lastAttackAt || 0) >= ATTACK_COOLDOWN_MS;
}

function decideTimeout(hpA, hpB) {
  if (Number(hpA) > Number(hpB)) return 'a';
  if (Number(hpB) > Number(hpA)) return 'b';
  return 'draw';
}

module.exports = {
  ARENA_W,
  ARENA_H,
  FIGHTER_W,
  FIGHTER_H,
  MAX_HP,
  ATTACK_DAMAGE,
  ATTACK_COOLDOWN_MS,
  ATTACK_REACH,
  MOVE_SPEED,
  TICK_MS,
  INPUT_MIN_GAP_MS,
  FIGHT_TIMEOUT_MS,
  RECONNECT_GRACE_MS,
  LOBBY_TIMEOUT_MS,
  CHALLENGE_TTL_MS,
  MIN_MONEY_WAGER,
  MAX_MONEY_WAGER,
  MAX_ITEM_QTY,
  clampInt,
  normalizeWager,
  moneyOf,
  applyWagerToCounts,
  stepPosition,
  facingFromInput,
  inAttackRange,
  canAttack,
  decideTimeout
};
