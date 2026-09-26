/**
 * The stop screen.
 *
 * This is the one screen that carries the product. Every behaviour below traces to a
 * documented incumbent failure rather than to taste:
 *
 *   "marking a meal as delivered often seems to take quite a long time"
 *      -> confirm() does ONE local INSERT and returns. Never awaits the network.
 *
 *   "it would be nice to not have to have GPS on just to mark a meal as delivered"
 *      -> location is read from a cache if present and is otherwise null. Never awaited,
 *         never required, never blocks the button.
 *
 *   "the checks don't work all the time and it is frustrating when running up and down a
 *    building and trying to remember who you already delivered to"
 *      -> completion state is a projection of the local append-only log, so it survives
 *         force-quit, backgrounding, and a 12-storey stairwell with no signal.
 *
 * Layout, top to bottom, per ticket #32:
 *   1. recipient name and unit, large
 *   2. up to three decayed door facts as full-width yes/no taps (target <5s median)
 *   3. large primary Delivered button
 *   4. secondary outcome selector for the other eight codes
 *   5. always-present wellness concern entry point
 */

import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View, Text, Pressable, ScrollView, StyleSheet, AccessibilityInfo,
} from 'react-native';
import { color, space, radius, touch, type as t } from './tokens';
import {
  type DoorFact, factsToConfirm, factsToDisplay, confidence,
} from '../domain/doorGraph';
import { OUTCOME_LABELS, type OutcomeCode } from '../domain/outcomes';

export interface StopScreenProps {
  displayName: string;
  unitLabel?: string;
  address: string;
  facts: DoorFact[];
  pendingSyncCount: number;
  lang?: 'en' | 'es';
  /** Must return fast. Implementation writes to SQLite and fires sync in the background. */
  onConfirm: (outcome: OutcomeCode, factAnswers: Record<string, boolean>) => void;
  onRaiseConcern: () => void;
  now?: number;
}

const COPY = {
  en: {
    stillTrue: 'Still true?',
    yes: 'Yes',
    no: 'No',
    delivered: 'Delivered',
    somethingElse: 'Something else happened',
    concern: 'Raise a concern about this person',
    waiting: (n: number) => `${n} waiting to sync`,
    saved: 'Saved on this device',
  },
  es: {
    stillTrue: 'Sigue siendo cierto?',
    yes: 'Si',
    no: 'No',
    delivered: 'Entregado',
    somethingElse: 'Paso algo distinto',
    concern: 'Reportar una preocupacion',
    waiting: (n: number) => `${n} esperando sincronizar`,
    saved: 'Guardado en este telefono',
  },
} as const;

export function StopScreen(props: StopScreenProps) {
  const {
    displayName, unitLabel, address, facts, pendingSyncCount,
    lang = 'en', onConfirm, onRaiseConcern, now = Date.now(),
  } = props;

  const c = COPY[lang];
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [showOther, setShowOther] = useState(false);
  const confirmedRef = useRef(false);

  const toConfirm = useMemo(() => factsToConfirm(facts, now), [facts, now]);
  const toDisplay = useMemo(() => factsToDisplay(facts, now), [facts, now]);

  const answerFact = useCallback((id: string, value: boolean) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }, []);

  /**
   * Single-shot guard. A double tap on a 72pt button with cold hands is likely, and a
   * duplicate delivery event is worse than a missed tap. The log is append-only, so the
   * guard lives here rather than being a database constraint.
   */
  const confirm = useCallback((outcome: OutcomeCode) => {
    if (confirmedRef.current) return;
    confirmedRef.current = true;
    onConfirm(outcome, answers);
    AccessibilityInfo.announceForAccessibility?.(c.saved);
  }, [answers, onConfirm, c.saved]);

  return (
    <View style={s.root}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        {/* 1. who and where */}
        <Text style={s.name} allowFontScaling accessibilityRole="header">
          {displayName}{unitLabel ? ` ${unitLabel}` : ''}
        </Text>
        <Text style={s.address} allowFontScaling>{address}</Text>

        {/* current facts: shown, not asked */}
        {toDisplay.length > 0 && (
          <View style={s.knownBlock}>
            {toDisplay.map((f) => (
              <Text key={f.id} style={s.knownFact} allowFontScaling>{f.value}</Text>
            ))}
          </View>
        )}

        {/* 2. decayed facts: at most three, lowest confidence first */}
        {toConfirm.map((f) => {
          const answered = answers[f.id];
          return (
            <View key={f.id} style={s.factRow}>
              <Text style={s.factLabel} allowFontScaling>{f.value}</Text>
              <Text style={s.factMeta} allowFontScaling>
                {c.stillTrue} {`(${Math.round(confidence(f, now) * 100)}%)`}
              </Text>
              <View style={s.factButtons}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: answered === true }}
                  accessibilityLabel={`${c.yes}: ${f.value}`}
                  onPress={() => answerFact(f.id, true)}
                  style={[s.factBtn, answered === true && s.factBtnOnYes]}
                >
                  <Text style={[s.factBtnText, answered === true && s.factBtnTextOn]}
                        allowFontScaling>{c.yes}</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: answered === false }}
                  accessibilityLabel={`${c.no}: ${f.value}`}
                  onPress={() => answerFact(f.id, false)}
                  style={[s.factBtn, answered === false && s.factBtnOnNo]}
                >
                  <Text style={[s.factBtnText, answered === false && s.factBtnTextOn]}
                        allowFontScaling>{c.no}</Text>
                </Pressable>
              </View>
            </View>
          );
        })}

        {/* 4. the other eight outcomes, behind one tap so the happy path stays clean */}
        {showOther && (
          <View style={s.otherBlock}>
            {(Object.keys(OUTCOME_LABELS) as OutcomeCode[])
              .filter((k) => k !== 'delivered_to_recipient')
              .map((k) => (
                <Pressable
                  key={k}
                  accessibilityRole="button"
                  onPress={() => confirm(k)}
                  style={s.otherBtn}
                >
                  <Text style={s.otherBtnText} allowFontScaling>
                    {OUTCOME_LABELS[k][lang]}
                  </Text>
                </Pressable>
              ))}
          </View>
        )}
      </ScrollView>

      {/* 3. the primary action, pinned so it never scrolls away */}
      <View style={s.footer}>
        {pendingSyncCount > 0 && (
          <Text style={s.queue} allowFontScaling accessibilityLiveRegion="polite">
            {c.waiting(pendingSyncCount)}
          </Text>
        )}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={c.delivered}
          onPress={() => confirm('delivered_to_recipient')}
          style={({ pressed }) => [s.primary, pressed && s.primaryPressed]}
        >
          <Text style={s.primaryText} allowFontScaling>{c.delivered}</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => setShowOther((v) => !v)}
          style={s.secondary}
        >
          <Text style={s.secondaryText} allowFontScaling>{c.somethingElse}</Text>
        </Pressable>

        {/* 5. always present. never implies the app reports on the volunteer's behalf. */}
        <Pressable
          accessibilityRole="button"
          onPress={onRaiseConcern}
          style={s.concern}
          hitSlop={8}
        >
          <Text style={s.concernText} allowFontScaling>{c.concern}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
  scroll: { padding: space.lg, paddingBottom: space.xxl },
  name: { fontSize: t.recipientName, fontWeight: t.weightBold, color: color.text },
  address: { fontSize: t.address, color: color.textMuted, marginTop: space.xs },

  knownBlock: {
    marginTop: space.lg, padding: space.md,
    backgroundColor: color.surface, borderRadius: radius.md,
  },
  knownFact: { fontSize: t.body, color: color.text, marginVertical: space.xs / 2 },

  factRow: {
    marginTop: space.lg, padding: space.md,
    borderWidth: 2, borderColor: color.warn, borderRadius: radius.md,
  },
  factLabel: { fontSize: t.body, fontWeight: t.weightMed, color: color.text },
  factMeta: { fontSize: t.small, color: color.warn, marginTop: space.xs },
  factButtons: { flexDirection: 'row', gap: space.md, marginTop: space.md },
  factBtn: {
    flex: 1, minHeight: touch.minTarget, borderRadius: radius.sm,
    borderWidth: 1, borderColor: color.border,
    alignItems: 'center', justifyContent: 'center',
  },
  factBtnOnYes: { backgroundColor: color.primary, borderColor: color.primary },
  factBtnOnNo: { backgroundColor: color.danger, borderColor: color.danger },
  factBtnText: { fontSize: t.body, fontWeight: t.weightMed, color: color.text },
  factBtnTextOn: { color: color.textInverse },

  otherBlock: { marginTop: space.lg, gap: space.sm },
  otherBtn: {
    minHeight: touch.minTarget + 8, borderRadius: radius.sm,
    borderWidth: 1, borderColor: color.border,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.md,
  },
  otherBtnText: { fontSize: t.body, color: color.text },

  footer: {
    padding: space.lg, borderTopWidth: 1, borderTopColor: color.border,
    backgroundColor: color.bg, gap: space.sm,
  },
  queue: {
    fontSize: t.small, color: color.queueText, textAlign: 'center',
    backgroundColor: color.queueBg, paddingVertical: space.xs, borderRadius: radius.sm,
  },
  primary: {
    height: touch.primaryHeight, borderRadius: radius.lg,
    backgroundColor: color.primary, alignItems: 'center', justifyContent: 'center',
  },
  primaryPressed: { backgroundColor: color.primaryPressed },
  primaryText: {
    fontSize: 24, fontWeight: t.weightBold, color: color.textInverse,
  },
  secondary: {
    minHeight: touch.minTarget, alignItems: 'center', justifyContent: 'center',
  },
  secondaryText: { fontSize: t.body, color: color.info, fontWeight: t.weightMed },
  concern: { minHeight: touch.minTarget, alignItems: 'center', justifyContent: 'center' },
  concernText: { fontSize: t.label, color: color.textMuted },
});
