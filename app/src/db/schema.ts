/**
 * Local SQLite schema.
 *
 * The event log is APPEND ONLY and is the source of truth on device. The UI reads
 * projections of it. Nothing mutates history.
 *
 * Two schema decisions here are load-bearing and are not stylistic:
 *
 *   1. `lat`, `lng`, `accuracy_m` are NULLABLE.
 *      This is the schema-level enforcement of "confirmation never requires GPS".
 *      If location could not be null, some future code path would block on acquiring a
 *      fix, and the app would reproduce the exact ServTracker complaint we exist to beat:
 *      "it would be nice to not have to have GPS on just to mark a meal as delivered".
 *
 *   2. `clock_skew_ms` records (server_time - device_time) observed at last sync.
 *      Device clocks drift and users change them. Recording the skew lets a server
 *      reconstruct a defensible ordering later without trusting the device clock outright.
 *      Costs one integer; buys the ability to answer "when did this actually happen".
 */

export const SCHEMA_VERSION = 1;

export const MIGRATIONS: string[] = [
  // v1
  `
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS delivery_event (
    id              TEXT PRIMARY KEY NOT NULL,
    route_id        TEXT NOT NULL,
    stop_id         TEXT NOT NULL,
    outcome_code    TEXT NOT NULL,
    arrived_at      INTEGER,
    confirmed_at    INTEGER NOT NULL,
    dwell_ms        INTEGER,
    lat             REAL,
    lng             REAL,
    accuracy_m      REAL,
    device_id       TEXT NOT NULL,
    app_version     TEXT NOT NULL,
    clock_skew_ms   INTEGER,
    queued_at       INTEGER NOT NULL,
    synced_at       INTEGER,
    attempt_count   INTEGER NOT NULL DEFAULT 0,
    last_error      TEXT
  );

  CREATE INDEX IF NOT EXISTS ix_event_unsynced
    ON delivery_event (queued_at) WHERE synced_at IS NULL;

  CREATE INDEX IF NOT EXISTS ix_event_route ON delivery_event (route_id, stop_id);

  -- door layer only. keyed to the PROPERTY, never the person. contains no PHI.
  CREATE TABLE IF NOT EXISTS door_fact (
    id                TEXT PRIMARY KEY NOT NULL,
    address_key       TEXT NOT NULL,
    type              TEXT NOT NULL,
    value             TEXT NOT NULL,
    last_confirmed_at INTEGER NOT NULL,
    invalidated_at    INTEGER,
    dirty             INTEGER NOT NULL DEFAULT 0
  );

  CREATE INDEX IF NOT EXISTS ix_fact_address ON door_fact (address_key);

  -- cached route, so a route is fully usable with zero connectivity for its duration
  CREATE TABLE IF NOT EXISTS cached_route (
    route_id     TEXT PRIMARY KEY NOT NULL,
    payload_json TEXT NOT NULL,
    fetched_at   INTEGER NOT NULL
  );
  `,
];
