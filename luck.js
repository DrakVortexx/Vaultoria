'use strict';

/*
 * Vaultoria - central luck & rarity mathematics
 * ===============================================================
 * This is the ONLY place that decides how luck maps to rarity odds.
 * Both the server generator and the Electric Wheel call pickRarityIndex().
 *
 * What "+49% Luck" means
 * ---------------------------------------------------------------
 * The generator's displayed luck is a *multiplier*, not a number of
 * percentage points added to a drop chance:
 *
 *   levelLuckBonus(level) = 0.49 * (level - 1) / 99     (levels 1..100)
 *   L(level, temp)        = 1 + levelLuckBonus(level) + temp
 *
 *   Level 1   -> L = 1.00  (displayed +0%)
 *   Level 100 -> L = 1.49  (displayed +49%)
 *
 * Rarity i has a fixed base weight and is scaled by L^i before the
 * weights are normalized. Common (i = 0) is the baseline and is never
 * scaled; each rarer tier benefits more from luck. This keeps the curve
 * smooth, monotonic and bounded, and avoids multiplying every rarity by
 * the same factor (which would leave relative odds unchanged).
 *
 * Level-100 calibration
 * ---------------------------------------------------------------
 * The specified level-100 targets (Divine 1%, Celestial 0.1%,
 * Eternal 0.01%, Omniversal 0.001%) are individual probabilities. The
 * six lower tiers fill the remaining 98.889% with a geometric ladder
 * (each tier is 75% as likely as the one before it).
 *
 * BASE_WEIGHTS are then derived as target_i / 1.49^i, so at level 100
 * with no temporary bonus the normalized weights reproduce the target
 * table exactly. No magic tuning is applied at roll time.
 *
 * Temporary luck
 * ---------------------------------------------------------------
 * There is currently no temporary luck source in the game, so gameplay
 * always passes 0. The parameter exists (and is tested) so future boosts
 * share this one formula instead of growing a second system. Negative,
 * NaN or missing bonuses are treated as 0, so a stale/expired boost can
 * never leak into a roll.
 */

const MAX_LEVEL = 100;
const LUCK_BONUS_AT_MAX_LEVEL = 0.49;
const LEVEL_100_LUCK_MULTIPLIER = 1 + LUCK_BONUS_AT_MAX_LEVEL; // 1.49

// Divine, Celestial, Eternal, Omniversal (individual, not cumulative).
const SPECIFIED_LEVEL_100 = [0.01, 0.001, 0.0001, 0.00001];

// Common..Mythic: geometric ladder filling whatever the top tiers leave.
const LOWER_TIER_COUNT = 6;
const LOWER_TIER_RATIO = 0.75;
const lowerTotal = 1 - SPECIFIED_LEVEL_100.reduce((a, b) => a + b, 0);
const lowerSum = (1 - Math.pow(LOWER_TIER_RATIO, LOWER_TIER_COUNT)) / (1 - LOWER_TIER_RATIO);
const lowerTop = lowerTotal / lowerSum;
const lowerTiers = [];
for (let i = 0, p = lowerTop; i < LOWER_TIER_COUNT; i++, p *= LOWER_TIER_RATIO) {
  lowerTiers.push(p);
}
const TARGET_PROBABILITIES_LEVEL_100 = lowerTiers.concat(SPECIFIED_LEVEL_100);

// Exponent applied to luck for each rarity. 0 = common (unaffected).
const RARITY_SENSITIVITY = TARGET_PROBABILITIES_LEVEL_100.map((_, i) => i);

// base_i * 1.49^i == target_i, so level 100 reproduces the table exactly.
const BASE_WEIGHTS = TARGET_PROBABILITIES_LEVEL_100.map(
  (p, i) => p / Math.pow(LEVEL_100_LUCK_MULTIPLIER, RARITY_SENSITIVITY[i])
);

function clampLevel(level) {
  const n = Number(level);
  if (!Number.isFinite(n)) return 1;
  return Math.max(1, Math.min(MAX_LEVEL, n));
}

function levelLuckBonus(level) {
  return LUCK_BONUS_AT_MAX_LEVEL * (clampLevel(level) - 1) / (MAX_LEVEL - 1);
}

function luckMultiplier(level, tempLuckBonus = 0) {
  const temp = Number(tempLuckBonus);
  const extra = Number.isFinite(temp) && temp > 0 ? temp : 0;
  return 1 + levelLuckBonus(level) + extra;
}

function rarityWeights(level, tempLuckBonus = 0) {
  const L = luckMultiplier(level, tempLuckBonus);
  return BASE_WEIGHTS.map((w, i) => w * Math.pow(L, RARITY_SENSITIVITY[i]));
}

function rarityProbabilities(level, tempLuckBonus = 0) {
  const weights = rarityWeights(level, tempLuckBonus);
  const total = weights.reduce((a, b) => a + b, 0);
  return weights.map(w => w / total);
}

/*
 * Single authoritative rarity roll. Returns the rarity index.
 * `rng` is injectable for deterministic tests; gameplay uses Math.random.
 */
function pickRarityIndex(level, tempLuckBonus = 0, rng = Math.random) {
  const probs = rarityProbabilities(level, tempLuckBonus);
  let roll = rng();
  for (let i = 0; i < probs.length; i++) {
    roll -= probs[i];
    if (roll < 0) return i;
  }
  return probs.length - 1;
}

module.exports = {
  MAX_LEVEL,
  LUCK_BONUS_AT_MAX_LEVEL,
  LEVEL_100_LUCK_MULTIPLIER,
  SPECIFIED_LEVEL_100,
  LOWER_TIER_COUNT,
  LOWER_TIER_RATIO,
  TARGET_PROBABILITIES_LEVEL_100,
  RARITY_SENSITIVITY,
  BASE_WEIGHTS,
  clampLevel,
  levelLuckBonus,
  luckMultiplier,
  rarityWeights,
  rarityProbabilities,
  pickRarityIndex
};
