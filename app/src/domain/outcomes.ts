/**
 * The nine delivery outcome codes.
 *
 * Deliberately not a binary. The 2022 build had no drop-off confirmation at all, and
 * the whole reimbursement and wellness story depends on knowing WHY a delivery did not
 * happen, not just that it did not.
 */

export const OUTCOME_CODES = [
  'delivered_to_recipient',
  'delivered_to_caregiver',
  'left_per_instruction',
  'no_answer',
  'refused',
  'address_not_found',
  'client_moved',
  'unsafe_to_approach',
  'could_not_access_building',
] as const;

export type OutcomeCode = (typeof OUTCOME_CODES)[number];

/** Outcomes that count as a delivered unit of service. */
export const SUCCESS_OUTCOMES: readonly OutcomeCode[] = [
  'delivered_to_recipient',
  'delivered_to_caregiver',
  'left_per_instruction',
];

/**
 * Outcomes that contradict the agency's system of record and therefore belong in the
 * "your file is wrong" reconciliation stream (PRD FR-3.8). Agencies are monitored on
 * client-record accuracy, so these arrive free as exhaust and are directly valuable.
 */
export const RECONCILIATION_OUTCOMES: readonly OutcomeCode[] = [
  'address_not_found',
  'client_moved',
];

export const OUTCOME_LABELS: Record<OutcomeCode, { en: string; es: string }> = {
  delivered_to_recipient:    { en: 'Delivered',                es: 'Entregado' },
  delivered_to_caregiver:    { en: 'Left with caregiver',      es: 'Entregado al cuidador' },
  left_per_instruction:      { en: 'Left per instructions',    es: 'Dejado segun instrucciones' },
  no_answer:                 { en: 'No answer',                es: 'Nadie respondio' },
  refused:                   { en: 'Refused',                  es: 'Rechazado' },
  address_not_found:         { en: 'Address not found',        es: 'Direccion no encontrada' },
  client_moved:              { en: 'Client moved',             es: 'El cliente se mudo' },
  unsafe_to_approach:        { en: 'Unsafe to approach',       es: 'No es seguro acercarse' },
  could_not_access_building: { en: 'Could not get in',         es: 'No pude entrar' },
};

export function isSuccess(code: OutcomeCode): boolean {
  return SUCCESS_OUTCOMES.includes(code);
}

export function needsReconciliation(code: OutcomeCode): boolean {
  return RECONCILIATION_OUTCOMES.includes(code);
}
