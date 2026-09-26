/**
 * Door-fact decay, tested against the real TypeScript module via type stripping.
 *
 * The behaviour under test is the thing that stops the access graph rotting silently the
 * way a one-time CSV import does. If decay is wrong, the graph is a stale laminated card
 * with a database behind it.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

const {
  confidence, needsReconfirm, factsToConfirm, factsToDisplay,
  confirmFact, invalidateFact, HALF_LIFE_DAYS, RECONFIRM_THRESHOLD, MAX_FACTS_AT_ARRIVAL,
} = await import('../src/domain/doorGraph.ts');

const DAY = 86_400_000;
const NOW = 1_756_000_000_000;

const fact = (over = {}) => ({
  id: 'f', addressKey: '300 sw 22nd rd', type: 'gate_code',
  value: 'Gate code 4412', lastConfirmedAt: NOW, ...over,
});

test('confidence halves at exactly one half-life', () => {
  const f = fact({ lastConfirmedAt: NOW - HALF_LIFE_DAYS.gate_code * DAY });
  assert.ok(Math.abs(confidence(f, NOW) - 0.5) < 1e-9);
});

test('a freshly confirmed fact is fully trusted', () => {
  assert.equal(confidence(fact(), NOW), 1);
  assert.equal(needsReconfirm(fact(), NOW), false);
});

test('structural facts effectively never decay, codes do', () => {
  const oneYear = NOW - 365 * DAY;
  const steps = fact({ type: 'steps_count', lastConfirmedAt: oneYear });
  const code = fact({ type: 'gate_code', lastConfirmedAt: oneYear });

  assert.ok(confidence(steps, NOW) > 0.9,
    'four concrete steps do not move, so a year old is still trustworthy');
  assert.ok(confidence(code, NOW) < 0.2,
    'a year-old gate code is not trustworthy');
  assert.equal(needsReconfirm(steps, NOW), false);
  assert.equal(needsReconfirm(code, NOW), true);
});

test('event-driven invalidation overrides age completely', () => {
  // confirmed 10 minutes ago, so age says trust it
  const f = fact({ lastConfirmedAt: NOW - 600_000 });
  assert.ok(confidence(f, NOW) > 0.99);

  // but a failed delivery just contradicted it
  const dead = invalidateFact(f, NOW);
  assert.equal(confidence(dead, NOW), 0,
    'a contradicting observation means WRONG NOW, regardless of recency');
  assert.equal(needsReconfirm(dead, NOW), true);
});

test('reconfirming clears an invalidation', () => {
  const dead = invalidateFact(fact({ lastConfirmedAt: NOW - 300 * DAY }), NOW);
  assert.equal(confidence(dead, NOW), 0);
  const alive = confirmFact(dead, NOW);
  assert.equal(confidence(alive, NOW), 1);
});

test('at most three facts are surfaced, lowest confidence first', () => {
  const facts = [
    fact({ id: 'a', type: 'gate_code', lastConfirmedAt: NOW - 100 * DAY }),  // ~0.56
    fact({ id: 'b', type: 'gate_code', lastConfirmedAt: NOW - 400 * DAY }),  // ~0.10
    fact({ id: 'c', type: 'callbox_sequence', lastConfirmedAt: NOW - 200 * DAY }), // ~0.21
    fact({ id: 'd', type: 'gate_code', lastConfirmedAt: NOW - 300 * DAY }),  // ~0.18
    fact({ id: 'e', type: 'steps_count', lastConfirmedAt: NOW - 900 * DAY }), // ~0.84, current
  ];
  const ask = factsToConfirm(facts, NOW);

  assert.equal(ask.length, MAX_FACTS_AT_ARRIVAL, 'never more than three');
  assert.deepEqual(ask.map((f) => f.id), ['b', 'd', 'c'],
    'strictly ascending confidence: staleness is arithmetic, consequence is a guess');
  assert.ok(ask.every((f) => confidence(f, NOW) < RECONFIRM_THRESHOLD));
});

test('current facts are shown, not asked', () => {
  const facts = [
    fact({ id: 'stale', lastConfirmedAt: NOW - 400 * DAY }),
    fact({ id: 'fresh', lastConfirmedAt: NOW - 1 * DAY }),
  ];
  assert.deepEqual(factsToDisplay(facts, NOW).map((f) => f.id), ['fresh']);
  assert.deepEqual(factsToConfirm(facts, NOW).map((f) => f.id), ['stale']);
});

test('the seeded demo data lands 3 of 13 below threshold, as designed', () => {
  // mirrors services/seed/generate_seed.py so the demo shows real decay, not theory
  const ages = [200, 3, 140, 3, 18, 140, 45, 80, 400, 18, 45, 80, 3];
  const types = ['gate_code', 'which_door', 'callbox_sequence', 'elevator_present',
    'unit_numbering', 'entrance_not_obvious', 'parking_constraint', 'steps_count',
    'dog_on_property', 'elevator_freight_only', 'callbox_sequence',
    'mailbox_blocks_access', 'ramp_present'];
  const facts = ages.map((a, i) =>
    fact({ id: `s${i}`, type: types[i], lastConfirmedAt: NOW - a * DAY }));
  const below = facts.filter((f) => needsReconfirm(f, NOW)).length;
  assert.ok(below >= 2 && below <= 5,
    `expected a handful below threshold for a legible demo, got ${below}`);
});
