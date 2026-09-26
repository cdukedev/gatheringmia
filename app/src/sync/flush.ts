/**
 * Outbound sync.
 *
 * Three triggers, in priority order (see ticket #29):
 *   1. immediate attempt on write, fire-and-forget, NEVER awaited by the UI
 *   2. on connectivity regain and on app foreground  <- these carry the real load
 *   3. expo-background-task as the backstop, for a route the driver finished and
 *      never reopened. Android enforces a 15-minute floor, so it is too slow to be
 *      primary but it is what rescues an abandoned queue.
 *
 * Idempotency: the server keys on the client-generated event id, so retries are safe
 * by construction. This is why ids are generated on device and not by the server.
 */

import type { SQLiteDatabase } from 'expo-sqlite';
import { pendingEvents, markSynced, markAttemptFailed } from '../db/eventLog';

const BATCH = 50;
const MAX_ATTEMPTS = 12;

export interface FlushResult {
  attempted: number;
  synced: number;
  failed: number;
  skipped: number;
  error?: string;
}

let inFlight = false;

/**
 * Push queued events. Safe to call often and concurrently; overlapping calls no-op.
 * Never throws: a failed flush is a normal condition, not an error state.
 */
export async function flush(
  db: SQLiteDatabase,
  endpoint: string,
  authToken?: string,
): Promise<FlushResult> {
  if (inFlight) return { attempted: 0, synced: 0, failed: 0, skipped: 0 };
  inFlight = true;
  try {
    const rows = await pendingEvents(db, BATCH);
    if (rows.length === 0) return { attempted: 0, synced: 0, failed: 0, skipped: 0 };

    // Do not hammer forever. A permanently failing event should not block the queue,
    // so it is skipped after MAX_ATTEMPTS and surfaced to the coordinator instead.
    const live = rows.filter((r) => r.attempt_count < MAX_ATTEMPTS);
    const skipped = rows.length - live.length;
    if (live.length === 0) {
      return { attempted: 0, synced: 0, failed: 0, skipped };
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          ...(authToken ? { authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({ events: live }),
      });

      if (!res.ok) {
        await markAttemptFailed(db, live.map((r) => r.id), `HTTP ${res.status}`);
        return { attempted: live.length, synced: 0, failed: live.length, skipped,
                 error: `HTTP ${res.status}` };
      }

      // Server acks per event id so a partial batch still makes progress.
      const body = (await res.json()) as { acked?: string[] };
      const acked = body.acked ?? live.map((r) => r.id);
      await markSynced(db, acked);

      const failedIds = live.map((r) => r.id).filter((id) => !acked.includes(id));
      await markAttemptFailed(db, failedIds, 'not acked');

      return { attempted: live.length, synced: acked.length, failed: failedIds.length, skipped };
    } catch (e) {
      // Offline is the expected case, not an exception. Bump attempts and move on.
      const msg = e instanceof Error ? e.message : String(e);
      await markAttemptFailed(db, live.map((r) => r.id), msg);
      return { attempted: live.length, synced: 0, failed: live.length, skipped, error: msg };
    }
  } finally {
    inFlight = false;
  }
}

/** Fire-and-forget. Called on the write path; the caller must never await this. */
export function flushInBackground(
  db: SQLiteDatabase,
  endpoint: string,
  authToken?: string,
): void {
  void flush(db, endpoint, authToken).catch(() => {
    /* swallowed on purpose: a failed background flush is not a user-facing event */
  });
}
