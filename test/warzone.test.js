'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const w = require('../warzone');

test('arena rules are fixed and finite', () => {
  assert.strictEqual(w.MAX_HP, 100);
  assert.strictEqual(w.ATTACK_DAMAGE, 10);
  assert.strictEqual(w.ATTACK_COOLDOWN_MS, 600);
  assert.strictEqual(w.TICK_MS, 50);
  assert.strictEqual(w.RECONNECT_GRACE_MS, 10000);
  assert.ok(w.ARENA_W > w.ARENA_H);
  assert.ok(w.MAX_HP % w.ATTACK_DAMAGE === 0);
});

test('money wagers use the allowed range', () => {
  assert.deepStrictEqual(w.normalizeWager({ type: 'money', amount: 5000 }, {}, () => true),
    { ok: true, wager: { type: 'money', amount: 5000 } });
  assert.strictEqual(w.normalizeWager({ type: 'money', amount: 999 }, {}, () => true).ok, false);
  assert.strictEqual(w.normalizeWager({ type: 'money', amount: 1e15 }, {}, () => true).ok, false);
  assert.strictEqual(w.normalizeWager({ type: 'money', amount: 'abc' }, {}, () => true).ok, false);
  assert.deepStrictEqual(w.normalizeWager(null, {}, () => true), { ok: true, wager: { type: 'none' } });
});

test('item wagers require ownership and a known item key', () => {
  const counts = { 'common:Iron Scrap': 7 };
  assert.deepStrictEqual(w.normalizeWager({ type: 'item', key: 'common:Iron Scrap', qty: 3 }, counts, () => true),
    { ok: true, wager: { type: 'item', key: 'common:Iron Scrap', qty: 3 } });
  assert.strictEqual(w.normalizeWager({ type: 'item', key: 'common:Iron Scrap', qty: 9 }, counts, () => true).ok, false);
  assert.strictEqual(w.normalizeWager({ type: 'item', key: 'fake:Thing', qty: 1 }, counts, () => true).ok, false);
  assert.strictEqual(w.normalizeWager({ type: 'item', key: 'common:Iron Scrap', qty: 0 }, counts, () => true).ok, false);
  assert.strictEqual(w.normalizeWager({ type: 'other' }, counts, () => true).ok, false);
});

test('wager application debits and credits item stacks', () => {
  const counts = { 'rare:Plasma Crystal': 5, 'common:Iron Scrap': 1 };
  const wager = { type: 'item', key: 'rare:Plasma Crystal', qty: 5 };
  w.applyWagerToCounts(counts, wager, -1);
  assert.strictEqual(counts['rare:Plasma Crystal'], undefined);
  w.applyWagerToCounts(counts, wager, 1);
  assert.strictEqual(counts['rare:Plasma Crystal'], 5);
  assert.strictEqual(w.moneyOf({ type: 'money', amount: 2500 }), 2500);
  assert.strictEqual(w.moneyOf(wager), 0);
});

test('movement stays inside the arena and diagonals are normalized', () => {
  const p = w.stepPosition({ x: 0, y: 0 }, 1, 1, 0.25);
  assert.ok(Math.abs(p.x - w.MOVE_SPEED * 0.25 / Math.SQRT2) < 1e-9);
  assert.ok(Math.abs(p.y - w.MOVE_SPEED * 0.25 / Math.SQRT2) < 1e-9);
  const corner = w.stepPosition({ x: w.ARENA_W, y: w.ARENA_H }, 5, 5, 1);
  assert.strictEqual(corner.x, w.ARENA_W - w.FIGHTER_W);
  assert.strictEqual(corner.y, w.ARENA_H - w.FIGHTER_H);
  assert.deepStrictEqual(w.stepPosition({ x: 10, y: 10 }, NaN, null, 1), { x: 10, y: 10 });
});

test('facing comes from movement input and hit tests respect it', () => {
  const fallback = { x: 0, y: 1 };
  assert.deepStrictEqual(w.facingFromInput(0, 0, fallback), fallback);
  const facing = w.facingFromInput(1, 0, fallback);
  assert.ok(Math.abs(facing.x - 1) < 1e-9);
  const attacker = { x: 100, y: 100, facing };
  assert.strictEqual(w.inAttackRange(attacker, { x: 140, y: 100 }), true);
  assert.strictEqual(w.inAttackRange(attacker, { x: 60, y: 100 }), false);
  assert.strictEqual(w.inAttackRange(attacker, { x: 300, y: 100 }), false);
});

test('attack cooldown and fight timeout decisions', () => {
  assert.strictEqual(w.canAttack(1000, 0), true);
  assert.strictEqual(w.canAttack(1000, 500), false);
  assert.strictEqual(w.canAttack(1100, 500), true);
  assert.strictEqual(w.decideTimeout(60, 30), 'a');
  assert.strictEqual(w.decideTimeout(30, 60), 'b');
  assert.strictEqual(w.decideTimeout(50, 50), 'draw');
});

test('server delegates warzone rules to the shared module', () => {
  const root = path.join(__dirname, '..');
  const server = fs.readFileSync(path.join(root, 'server.js'), 'utf8');
  const client = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.match(server, /require\('\.\/warzone'\)/);
  assert.match(server, /warzone\.normalizeWager\(/);
  assert.match(server, /warzone\.applyWagerToCounts\(/);
  assert.match(server, /warzone\.stepPosition\(/);
  assert.match(client, /warzoneStart/);
  assert.doesNotMatch(client, /\bATTACK_COOLDOWN_MS\b/);
});
