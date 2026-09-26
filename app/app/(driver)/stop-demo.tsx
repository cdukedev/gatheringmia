/**
 * Demo harness for the stop screen, wired to the real event log.
 *
 * Uses seeded door facts from services/seed. Every person here is fictional; see the
 * generator's assertions.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { Modal } from 'react-native';
import { StopScreen } from '../../src/ui/StopScreen';
import { ConcernSheet } from '../../src/ui/ConcernSheet';
import { recordDelivery, pendingCount } from '../../src/db/eventLog';
import { flushInBackground } from '../../src/sync/flush';
import type { DoorFact } from '../../src/domain/doorGraph';
import type { OutcomeCode } from '../../src/domain/outcomes';

const DAY = 86_400_000;
const SYNC_ENDPOINT = 'https://example.invalid/v1/events'; // demo: intentionally unreachable

const DEMO_FACTS: DoorFact[] = [
  { id: 'f1', addressKey: '300 sw 22nd rd', type: 'gate_code',
    value: 'Gate code 4412, keypad is on the left post',
    lastConfirmedAt: Date.now() - 200 * DAY },
  { id: 'f2', addressKey: '300 sw 22nd rd', type: 'which_door',
    value: 'Use the pedestrian gate, not the vehicle gate',
    lastConfirmedAt: Date.now() - 3 * DAY },
  { id: 'f3', addressKey: '300 sw 22nd rd', type: 'callbox_sequence',
    value: 'Callbox: dial 214 then press CALL, not #',
    lastConfirmedAt: Date.now() - 140 * DAY },
];

export default function StopDemo() {
  const db = useSQLiteContext();
  const [pending, setPending] = useState(0);
  const [concern, setConcern] = useState(false);
  const [arrivedAt] = useState(() => Date.now());

  const refresh = useCallback(() => {
    pendingCount(db).then(setPending).catch(() => {});
  }, [db]);

  useEffect(refresh, [refresh]);

  const onConfirm = useCallback((outcome: OutcomeCode) => {
    // ONE local write. Never awaits the network. Never awaits a location fix.
    void recordDelivery(db, {
      routeId: 'route-a',
      stopId: 'cli-000',            // opaque id. no name, address, or phone.
      outcomeCode: outcome,
      arrivedAt,
      dwellMs: Date.now() - arrivedAt,
      location: null,               // demo: proves GPS is not required
      deviceId: 'demo-device',
      appVersion: '0.1.0',
    }).then(() => {
      refresh();
      flushInBackground(db, SYNC_ENDPOINT);
    });
  }, [db, arrivedAt, refresh]);

  return (
    <>
      <StopScreen
        displayName="Ana Restrepo"
        address="300 SW 22nd Rd, Miami, FL"
        facts={DEMO_FACTS}
        pendingSyncCount={pending}
        onConfirm={onConfirm}
        onRaiseConcern={() => setConcern(true)}
      />
      <Modal visible={concern} animationType="slide" onRequestClose={() => setConcern(false)}>
        <ConcernSheet onSubmit={() => setConcern(false)} onCancel={() => setConcern(false)} />
      </Modal>
    </>
  );
}
