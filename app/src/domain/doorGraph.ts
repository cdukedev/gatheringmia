/**
 * Door-fact confidence decay.
 *
 * Two layers, and they never share a table (see services/seed/door_fact_taxonomy.md):
 *   - door layer:   keyed to the PROPERTY. no PHI. poolable, licensable.
 *   - person layer: keyed to the CLIENT. PHI. per-agency, destroyed on contract exit.
 *
 * This module handles the door layer only. The person layer is deliberately absent from
 * the demo because the demo carries no real people.
 */

export type DoorFactType =
  | 'gate_code'
  | 'callbox_sequence'
  | 'which_door'
  | 'entrance_not_obvious'
  | 'unit_numbering'
  | 'steps_count'
  | 'ramp_present'
  | 'elevator_present'
  | 'elevator_freight_only'
  | 'parking_constraint'
  | 'dog_on_property'
  | 'mailbox_blocks_access'
  | 'other_freetext';

/** Half-lives grouped by what actually changes them. Concrete steps do not move. */
export const HALF_LIFE_DAYS: Record<DoorFactType, number> = {
  gate_code: 120,
  callbox_sequence: 90,
  which_door: 365,
  entrance_not_obvious: 365,
  unit_numbering: 365,
  steps_count: 3650,
  ramp_present: 3650,
  elevator_present: 730,
  elevator_freight_only: 730,
  parking_constraint: 180,
  dog_on_property: 180,
  mailbox_blocks_access: 365,
  other_freetext: 90,
};

/** Below this, the driver is asked to reconfirm at arrival. */
export const RECONFIRM_THRESHOLD = 0.6;

/** At most this many facts are surfaced at a stop. A driver holding a box has no patience. */
export const MAX_FACTS_AT_ARRIVAL = 3;

export interface DoorFact {
  id: string;
  addressKey: string;          // the PROPERTY. never a person.
  type: DoorFactType;
  value: string;
  lastConfirmedAt: number;     // epoch ms
  invalidatedAt?: number;      // event-driven invalidation overrides age
}

const DAY_MS = 86_400_000;

/**
 * Confidence in [0,1]. Exponential for ranking; the UI renders a binary at the threshold
 * because a driver does not need a probability.
 *
 * Event-driven invalidation is not a decay adjustment, it is a hard zero. A failed
 * delivery or a contradicting observation means the fact is wrong NOW, regardless of how
 * recently it was confirmed. Age is the fallback signal, not the primary one.
 */
export function confidence(fact: DoorFact, now: number = Date.now()): number {
  if (fact.invalidatedAt != null && fact.invalidatedAt >= fact.lastConfirmedAt) return 0;
  const ageDays = Math.max(0, (now - fact.lastConfirmedAt) / DAY_MS);
  const halfLife = HALF_LIFE_DAYS[fact.type] ?? 90;
  return Math.pow(0.5, ageDays / halfLife);
}

export function needsReconfirm(fact: DoorFact, now: number = Date.now()): boolean {
  return confidence(fact, now) < RECONFIRM_THRESHOLD;
}

/**
 * Which facts to surface at arrival.
 *
 * Lowest confidence first, NOT most consequential first. Consequence is a judgement the
 * system cannot make reliably; staleness is arithmetic. A gate code unconfirmed for 200
 * days is worth asking about; a ramp that has been there a decade is not.
 */
export function factsToConfirm(
  facts: DoorFact[],
  now: number = Date.now(),
  limit: number = MAX_FACTS_AT_ARRIVAL,
): DoorFact[] {
  return facts
    .filter((f) => needsReconfirm(f, now))
    .sort((a, b) => confidence(a, now) - confidence(b, now))
    .slice(0, limit);
}

/** Facts that are current enough to just show, no question asked. */
export function factsToDisplay(facts: DoorFact[], now: number = Date.now()): DoorFact[] {
  return facts.filter((f) => !needsReconfirm(f, now));
}

export function confirmFact(fact: DoorFact, now: number = Date.now()): DoorFact {
  return { ...fact, lastConfirmedAt: now, invalidatedAt: undefined };
}

export function invalidateFact(fact: DoorFact, now: number = Date.now()): DoorFact {
  return { ...fact, invalidatedAt: now };
}
