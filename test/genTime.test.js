'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const genTime = require('../genTime');

test('rebirth schedule is 7s down to 2s, one second per rebirth', () => {
  assert.strictEqual(genTime.genTimeMs(0), 7000);
  assert.strictEqual(genTime.genTimeMs(1), 6000);
  assert.strictEqual(genTime.genTimeMs(2), 5000);
  assert.strictEqual(genTime.genTimeMs(3), 4000);
  assert.strictEqual(genTime.genTimeMs(4), 3000);
  assert.strictEqual(genTime.genTimeMs(5), 2000);
});

test('cooldown floors at 2 seconds beyond the current max rebirth', () => {
  assert.strictEqual(genTime.genTimeMs(6), 2000);
  assert.strictEqual(genTime.genTimeMs(50), 2000);
});

test('invalid / negative rebirth counts behave like zero rebirths', () => {
  assert.strictEqual(genTime.genTimeMs(-1), 7000);
  assert.strictEqual(genTime.genTimeMs(NaN), 7000);
  assert.strictEqual(genTime.genTimeMs(undefined), 7000);
  assert.strictEqual(genTime.genTimeMs(null), 7000);
  assert.strictEqual(genTime.genTimeMs('3'), 4000);
});

test('cooldown is monotonic and never below the floor', () => {
  let last = Infinity;
  for (let rb = 0; rb <= 20; rb++) {
    const ms = genTime.genTimeMs(rb);
    assert.ok(ms <= last, 'must not increase at rebirth ' + rb);
    assert.ok(ms >= genTime.GEN_MIN_TIME_MS, 'must respect floor at rebirth ' + rb);
    last = ms;
  }
});

test('server and client share the server-computed cooldown', () => {
  const root = path.join(__dirname, '..');
  const server = fs.readFileSync(path.join(root, 'server.js'), 'utf8');
  const client = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

  assert.match(server, /require\('\.\/genTime'\)/);
  assert.match(server, /genTime\.genTimeMs\(st\.rebirths\)/);
  assert.match(server, /genTime:\s*genTime\.genTimeMs\(row\.rebirths\)/);
  assert.match(client, /state\.genTime/);
  assert.doesNotMatch(client, /\bGEN_TIME\b/);
});
