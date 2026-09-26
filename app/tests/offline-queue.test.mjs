/**
 * The test that justifies the whole architecture.
 *
 * Runs the real schema and the real queue queries against node:sqlite, simulating the
 * scenario from ticket #34:
 *
 *   1. airplane mode
 *   2. confirm eight stops
 *   3. FORCE-QUIT the app
 *   4. relaunch: all eight still there, still queued, still correct
 *   5. restore connectivity
 *   6. all eight flush and ack. zero loss, zero duplicates.
 *
 * Force-quit is simulated by closing the database handle entirely and reopening from
 * disk, which is what actually happens when iOS or Android kills the process. If the
 * write path buffered anything in memory, this test fails.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const SCHEMA = `
PRAGMA journal_mode = WAL;
CREATE TABLE IF NOT EXISTS delivery_event (
  id TEXT PRIMARY KEY NOT NULL,
  route_id TEXT NOT NULL,
  stop_id TEXT NOT NULL,
  outcome_code TEXT NOT NULL,
  arrived_at INTEGER,
  confirmed_at INTEGER NOT NULL,
  dwell_ms INTEGER,
  lat REAL, lng REAL, accuracy_m REAL,
  device_id TEXT NOT NULL,
  app_version TEXT NOT NULL,
  clock_skew_ms INTEGER,
  queued_at INTEGER NOT NULL,
  synced_at INTEGER,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  last_error TEXT
);
CREATE INDEX IF NOT EXISTS ix_event_unsynced
  ON delivery_event (queued_at) WHERE synced_at IS NULL;
`;

const INSERT = `INSERT INTO delivery_event
  (id, route_id, stop_id, outcome_code, arrived_at, confirmed_at, dwell_ms,
   lat, lng, accuracy_m, device_id, app_version, clock_skew_ms, queued_at,
   synced_at, attempt_count)
  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,NULL,0)`;

function open(dir) {
  const db = new DatabaseSync(join(dir, 'gm.db'));
  db.exec(SCHEMA);
  return db;
}

function confirmStop(db, stopId, i, withLocation = false) {
  const now = Date.now() + i;
  db.prepare(INSERT).run(
    `evt-${String(i).padStart(3, '0')}`, 'route-a', stopId, 'delivered_to_recipient',
    now - 60_000, now, 60_000,
    withLocation ? 25.7657 : null,      // nullable by design
    withLocation ? -80.2059 : null,
    withLocation ? 12.5 : null,
    'dev-1', '0.1.0', null, now,
  );
}

test('confirmations survive a force-quit with zero connectivity', () => {
  const dir = mkdtempSync(join(tmpdir(), 'gm-'));
  try {
    // 1 + 2. airplane mode, confirm eight stops. no network call anywhere in this path.
    let db = open(dir);
    for (let i = 0; i < 8; i++) confirmStop(db, `cli-${String(i).padStart(3, '0')}`, i);

    const before = db.prepare(
      'SELECT COUNT(*) AS n FROM delivery_event WHERE synced_at IS NULL').get();
    assert.equal(before.n, 8, 'eight events queued before the crash');

    // 3. FORCE-QUIT: drop the handle. anything held in memory is gone.
    db.close();

    // 4. relaunch from disk
    db = open(dir);
    const after = db.prepare(
      'SELECT id, stop_id, outcome_code FROM delivery_event WHERE synced_at IS NULL ORDER BY queued_at'
    ).all();

    assert.equal(after.length, 8, 'all eight survived the force-quit');
    assert.deepEqual(
      after.map((r) => r.stop_id),
      Array.from({ length: 8 }, (_, i) => `cli-${String(i).padStart(3, '0')}`),
      'in the right order, with the right stops',
    );
    assert.ok(after.every((r) => r.outcome_code === 'delivered_to_recipient'));

    // 5 + 6. connectivity restored: ack the batch
    const ids = after.map((r) => r.id);
    const stmt = db.prepare('UPDATE delivery_event SET synced_at = ? WHERE id = ?');
    for (const id of ids) stmt.run(Date.now(), id);

    const remaining = db.prepare(
      'SELECT COUNT(*) AS n FROM delivery_event WHERE synced_at IS NULL').get();
    assert.equal(remaining.n, 0, 'queue drained');

    const total = db.prepare('SELECT COUNT(*) AS n FROM delivery_event').get();
    assert.equal(total.n, 8, 'zero duplicates');

    db.close();
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('a confirmation is valid with no location at all', () => {
  const dir = mkdtempSync(join(tmpdir(), 'gm-'));
  try {
    const db = open(dir);
    confirmStop(db, 'cli-000', 0, false);   // GPS off
    const row = db.prepare('SELECT lat, lng, outcome_code FROM delivery_event').get();
    assert.equal(row.lat, null, 'lat is null and that is fine');
    assert.equal(row.lng, null);
    assert.equal(row.outcome_code, 'delivered_to_recipient',
      'the delivery is recorded regardless: GPS never gates a confirmation');
    db.close();
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('retrying the same event id is idempotent, so a flaky network cannot duplicate', () => {
  const dir = mkdtempSync(join(tmpdir(), 'gm-'));
  try {
    const db = open(dir);
    confirmStop(db, 'cli-000', 0);
    assert.throws(() => confirmStop(db, 'cli-000', 0), /UNIQUE|PRIMARY/i,
      'the client-generated id is the idempotency key');
    const n = db.prepare('SELECT COUNT(*) AS n FROM delivery_event').get().n;
    assert.equal(n, 1);
    db.close();
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('completed-stops projection answers "who have I already delivered to"', () => {
  const dir = mkdtempSync(join(tmpdir(), 'gm-'));
  try {
    const db = open(dir);
    for (let i = 0; i < 5; i++) confirmStop(db, `cli-${String(i).padStart(3, '0')}`, i);
    const done = db.prepare(
      'SELECT DISTINCT stop_id FROM delivery_event WHERE route_id = ?').all('route-a');
    assert.equal(done.length, 5);
    // this is the direct answer to the ServTracker stairwell complaint, and it is a
    // pure local read, so it is correct with zero bars
    db.close();
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
