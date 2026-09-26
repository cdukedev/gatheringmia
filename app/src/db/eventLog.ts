/**
 * Append-only delivery event log.
 *
 * THE HARD REQUIREMENT: a confirmation completes in under one second with zero
 * connectivity, and never requires GPS.
 *
 * That is guaranteed by construction here, not by optimisation:
 *   - the write path is ONE synchronous local INSERT
 *   - the UI never awaits the network
 *   - the sync attempt is fired and forgotten, never awaited by the caller
 *   - location is optional and is read from a cache, never awaited
 *
 * Three documented ServTracker Mobile Meals failures this is designed to beat:
 *   "marking a meal as delivered often seems to take quite a long time"
 *   "it would be nice to not have to have GPS on just to mark a meal as delivered"
 *   "the checks don't work all the time ... trying to remember who you already delivered to"
 */

import type { SQLiteDatabase } from 'expo-sqlite';
import type { OutcomeCode } from '../domain/outcomes';

export interface RecordDeliveryInput {
  routeId: string;
  stopId: string;               // opaque server-issued id. NEVER a name or address.
  outcomeCode: OutcomeCode;
  arrivedAt?: number;
  dwellMs?: number;
  /** Optional. Enriches the record; never gates it. */
  location?: { lat: number; lng: number; accuracyM?: number } | null;
  deviceId: string;
  appVersion: string;
  clockSkewMs?: number;
}

export interface DeliveryEventRow {
  id: string;
  route_id: string;
  stop_id: string;
  outcome_code: OutcomeCode;
  confirmed_at: number;
  queued_at: number;
  synced_at: number | null;
  attempt_count: number;
}

/** uuid v7-ish: time-ordered, so the log sorts naturally and ids do not collide. */
export function newEventId(now: number = Date.now()): string {
  const ts = now.toString(16).padStart(12, '0');
  const rand = Array.from({ length: 20 }, () =>
    Math.floor(Math.random() * 16).toString(16)).join('');
  return `${ts.slice(0, 8)}-${ts.slice(8, 12)}-7${rand.slice(0, 3)}-${rand.slice(3, 7)}-${rand.slice(7, 19)}`;
}

/**
 * Write a confirmation. Synchronous local write, returns immediately.
 *
 * Deliberately NOT async beyond the SQLite call: nothing in this function may await a
 * network request, a location fix, or a permission prompt.
 */
export async function recordDelivery(
  db: SQLiteDatabase,
  input: RecordDeliveryInput,
  now: number = Date.now(),
): Promise<string> {
  const id = newEventId(now);
  await db.runAsync(
    `INSERT INTO delivery_event
       (id, route_id, stop_id, outcome_code, arrived_at, confirmed_at, dwell_ms,
        lat, lng, accuracy_m, device_id, app_version, clock_skew_ms, queued_at,
        synced_at, attempt_count)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,NULL,0)`,
    id,
    input.routeId,
    input.stopId,
    input.outcomeCode,
    input.arrivedAt ?? null,
    now,
    input.dwellMs ?? null,
    input.location?.lat ?? null,      // nullable by design. GPS never gates a confirmation.
    input.location?.lng ?? null,
    input.location?.accuracyM ?? null,
    input.deviceId,
    input.appVersion,
    input.clockSkewMs ?? null,
    now,
  );
  return id;
}

/** Everything still waiting to reach the server, oldest first. */
export async function pendingEvents(
  db: SQLiteDatabase,
  limit = 100,
): Promise<DeliveryEventRow[]> {
  return db.getAllAsync<DeliveryEventRow>(
    `SELECT id, route_id, stop_id, outcome_code, confirmed_at, queued_at,
            synced_at, attempt_count
       FROM delivery_event
      WHERE synced_at IS NULL
      ORDER BY queued_at ASC
      LIMIT ?`,
    limit,
  );
}

/** Queue depth. Shown to the driver as a quiet count so they can trust the system. */
export async function pendingCount(db: SQLiteDatabase): Promise<number> {
  const row = await db.getFirstAsync<{ n: number }>(
    `SELECT COUNT(*) AS n FROM delivery_event WHERE synced_at IS NULL`,
  );
  return row?.n ?? 0;
}

export async function markSynced(
  db: SQLiteDatabase,
  ids: string[],
  now: number = Date.now(),
): Promise<void> {
  if (ids.length === 0) return;
  const placeholders = ids.map(() => '?').join(',');
  await db.runAsync(
    `UPDATE delivery_event SET synced_at = ? WHERE id IN (${placeholders})`,
    now,
    ...ids,
  );
}

export async function markAttemptFailed(
  db: SQLiteDatabase,
  ids: string[],
  error: string,
): Promise<void> {
  if (ids.length === 0) return;
  const placeholders = ids.map(() => '?').join(',');
  await db.runAsync(
    `UPDATE delivery_event
        SET attempt_count = attempt_count + 1, last_error = ?
      WHERE id IN (${placeholders})`,
    error.slice(0, 500),
    ...ids,
  );
}

/**
 * Projection: which stops on this route are already done.
 *
 * This is the direct answer to the ServTracker complaint about "running up and down a
 * building and trying to remember who you already delivered to". It reads from the local
 * log, so it is correct with zero connectivity and survives a force-quit.
 */
export async function completedStopIds(
  db: SQLiteDatabase,
  routeId: string,
): Promise<Set<string>> {
  const rows = await db.getAllAsync<{ stop_id: string }>(
    `SELECT DISTINCT stop_id FROM delivery_event WHERE route_id = ?`,
    routeId,
  );
  return new Set(rows.map((r) => r.stop_id));
}
