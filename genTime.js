'use strict';

/*
 * Generator cooldown, in milliseconds, based on permanent rebirth count.
 *
 *   0 rebirths -> 7000ms
 *   1 rebirth  -> 6000ms
 *   2 rebirths -> 5000ms
 *   3 rebirths -> 4000ms
 *   4 rebirths -> 3000ms
 *   5 rebirths -> 2000ms
 *   6+         -> 2000ms (floor)
 *
 * The server is authoritative: it enforces this before accepting a roll,
 * and it sends the value to the client so the countdown uses one formula.
 */

const GEN_BASE_TIME_MS = 7000;
const GEN_TIME_PER_REBIRTH_MS = 1000;
const GEN_MIN_TIME_MS = 2000;

function genTimeMs(rebirths) {
  const rb = Math.max(0, Math.floor(Number(rebirths) || 0));
  return Math.max(GEN_MIN_TIME_MS, GEN_BASE_TIME_MS - rb * GEN_TIME_PER_REBIRTH_MS);
}

module.exports = {
  GEN_BASE_TIME_MS,
  GEN_TIME_PER_REBIRTH_MS,
  GEN_MIN_TIME_MS,
  genTimeMs
};
