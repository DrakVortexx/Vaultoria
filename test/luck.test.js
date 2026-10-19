'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const luck = require('../luck');

const DIVINE = 6, CELESTIAL = 7, ETERNAL = 8, OMNIVERSAL = 9;
const TOL = 1e-12;

function close(actual, expected, tol = TOL, msg) {
  assert.ok(Math.abs(actual - expected) <= tol,
    (msg || '') + ' expected ' + expected + ' got ' + actual);
}

test('level 100 hits the exact specified individual probabilities', () => {
  const p = luck.rarityProbabilities(100, 0);
  close(p[DIVINE], 0.01, 1e-15, 'Divine');
  close(p[CELESTIAL], 0.001, 1e-15, 'Celestial');
  close(p[ETERNAL], 0.0001, 1e-15, 'Eternal');
  close(p[OMNIVERSAL], 0.00001, 1e-15, 'Omniversal');
});

test('all level-100 probabilities sum to 1 and are ordered by rarity', () => {
  const p = luck.rarityProbabilities(100, 0);
  close(p.reduce((a, b) => a + b, 0), 1, 1e-12, 'sum');
  for (let i = 0; i < p.length - 1; i++) {
    assert.ok(p[i] > p[i + 1], 'rarity ' + i + ' must be more common than ' + (i + 1));
  }
  assert.ok(p.every(x => x > 0), 'no rarity may be impossible');
});

test('lower tiers form the documented geometric ladder around the fixed top tiers', () => {
  const p = luck.rarityProbabilities(100, 0);
  for (let i = 0; i < luck.LOWER_TIER_COUNT - 1; i++) {
    close(p[i + 1] / p[i], luck.LOWER_TIER_RATIO, 1e-12, 'ratio ' + i);
  }
  const top = p[DIVINE] + p[CELESTIAL] + p[ETERNAL] + p[OMNIVERSAL];
  close(top, 0.01111, 1e-12, 'specified top tiers total');
});

test('level-based luck is linear, bounded and reaches +49% at level 100', () => {
  close(luck.levelLuckBonus(1), 0, 1e-15, 'level 1');
  close(luck.levelLuckBonus(100), 0.49, 1e-15, 'level 100');
  close(luck.levelLuckBonus(50), 0.49 * 49 / 99, 1e-15, 'level 50');
  // Out-of-range levels are clamped rather than producing invalid bonuses.
  close(luck.levelLuckBonus(0), 0, 1e-15, 'level 0 clamp');
  close(luck.levelLuckBonus(-50), 0, 1e-15, 'negative clamp');
  close(luck.levelLuckBonus(9999), 0.49, 1e-15, 'over max clamp');
  let last = -Infinity;
  for (let lv = 0; lv <= 100; lv++) {
    const b = luck.levelLuckBonus(lv);
    assert.ok(b >= 0 && b <= 0.49, 'bonus in range at level ' + lv);
    assert.ok(b >= last, 'bonus monotonic at level ' + lv);
    last = b;
  }
});

test('luck multiplier combines permanent and temporary sources additively', () => {
  close(luck.luckMultiplier(1, 0), 1, 1e-15);
  close(luck.luckMultiplier(100, 0), 1.49, 1e-15);
  close(luck.luckMultiplier(100, 0.25), 1.74, 1e-15);
  // Expired/missing/negative boosts are ignored.
  close(luck.luckMultiplier(100, -0.5), 1.49, 1e-15);
  close(luck.luckMultiplier(100, NaN), 1.49, 1e-15);
});

test('every level produces a valid, smooth, correctly-ordered distribution', () => {
  let prev = null;
  for (let lv = 0; lv <= 100; lv++) {
    const p = luck.rarityProbabilities(lv, 0);
    close(p.reduce((a, b) => a + b, 0), 1, 1e-12, 'sum at level ' + lv);
    assert.ok(p.every(x => x > 0 && x < 1), 'valid probabilities at level ' + lv);
    for (let i = 0; i < p.length - 1; i++) {
      assert.ok(p[i] >= p[i + 1], 'ordering at level ' + lv + ' index ' + i);
    }
    if (prev) {
      let maxStep = 0;
      for (let i = 0; i < p.length; i++) maxStep = Math.max(maxStep, Math.abs(p[i] - prev[i]));
      assert.ok(maxStep < 0.01, 'no discontinuity at level ' + lv + ' (step ' + maxStep + ')');
    }
    prev = p;
  }
});

test('higher levels never make rarer top tiers less likely', () => {
  for (let i = DIVINE; i <= OMNIVERSAL; i++) {
    let last = -Infinity;
    for (let lv = 1; lv <= 100; lv++) {
      const p = luck.rarityProbabilities(lv, 0)[i];
      assert.ok(p >= last, 'rarity ' + i + ' monotonic at level ' + lv);
      last = p;
    }
  }
});

test('temporary luck raises top-tier odds without breaking normalization', () => {
  const base = luck.rarityProbabilities(100, 0);
  const boosted = luck.rarityProbabilities(100, 0.25);
  close(boosted.reduce((a, b) => a + b, 0), 1, 1e-12, 'sum');
  for (let i = DIVINE; i <= OMNIVERSAL; i++) {
    assert.ok(boosted[i] > base[i], 'rarity ' + i + ' should improve with temp luck');
  }
  assert.ok(boosted[0] < base[0], 'common share should shrink with temp luck');
  // A zero bonus is a true no-op, so expired boosts cannot leak in.
  const zero = luck.rarityProbabilities(100, 0);
  for (let i = 0; i < base.length; i++) close(zero[i], base[i], 1e-15, 'zero boost ' + i);
});

test('pickRarityIndex follows the probability CDF', () => {
  const p = luck.rarityProbabilities(100, 0);
  assert.strictEqual(luck.pickRarityIndex(100, 0, () => 0), 0);
  assert.strictEqual(luck.pickRarityIndex(100, 0, () => 0.999999999), p.length - 1);
  // A value inside the second tier's cumulative band selects the second tier.
  assert.strictEqual(luck.pickRarityIndex(100, 0, () => 0.5), 1);
});

test('large simulation matches Divine/Celestial odds (rare tiers tested mathematically)', () => {
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const rng = mulberry32(123456789);
  const N = 500000;
  const counts = new Array(luck.TARGET_PROBABILITIES_LEVEL_100.length).fill(0);
  for (let i = 0; i < N; i++) counts[luck.pickRarityIndex(100, 0, rng)]++;
  close(counts[DIVINE] / N, 0.01, 0.0015, 'simulated Divine');
  close(counts[CELESTIAL] / N, 0.001, 0.0006, 'simulated Celestial');
  assert.strictEqual(counts.reduce((a, b) => a + b, 0), N);
  // Omniversal is intentionally NOT asserted from simulation: at
  // p = 0.00001 only ~5 hits are expected in 500k draws.
});

test('server and client use only the central formula (no competing luck code)', () => {
  const root = path.join(__dirname, '..');
  const server = fs.readFileSync(path.join(root, 'server.js'), 'utf8');
  const client = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

  assert.match(server, /require\('\.\/luck'\)/);
  assert.strictEqual((server.match(/luck\.pickRarityIndex\(/g) || []).length, 2,
    'both server roll sites must call the central picker');
  assert.doesNotMatch(server, /function\s+pickRarity\s*\(/);
  assert.doesNotMatch(server, /luckMult|commonScale|LUCK_PER_LEVEL|RARE_PLUS_BOOST/);

  assert.doesNotMatch(client, /Legendary\+\s*luck/i);
  assert.doesNotMatch(client, /legendaryLuck|luckMult|rarityWeights/);
  assert.doesNotMatch(client, /function\s+pickRarity\s*\(/);
});
