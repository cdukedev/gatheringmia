/**
 * Wellness concern flow.
 *
 * THE LEGAL POINT, and it is not negotiable:
 *
 * Under Fla. Stat. 415.1034 EVERY PERSON in Florida is a mandatory reporter of suspected
 * abuse, neglect, or exploitation of a vulnerable adult. Failure to report is a second
 * degree misdemeanour. The duty attaches to the human observer and is PERSONAL AND
 * NON-DELEGABLE.
 *
 * Therefore this screen:
 *   - surfaces the Florida Abuse Hotline number
 *   - states plainly that the VOLUNTEER, personally, must make the report
 *   - records that the prompt was shown and what was selected
 *   - routes an internal alert to the partner agency
 *
 * and NEVER:
 *   - states or implies that the app reports on the volunteer's behalf
 *   - offers a "submit report" button
 *   - pre-fills an abuse hotline packet
 *
 * The divergence flagged the one-tap prefilled report as a trap: it invites false-report
 * exposure and creates a monitoring expectation that cannot be staffed nights and
 * weekends. What survives is the observation capture, which is the part an Area Agency on
 * Aging and a health plan will actually pay for.
 */

import React, { useState } from 'react';
import { View, Text, Pressable, Linking, StyleSheet } from 'react-native';
import { color, space, radius, touch, type as t } from './tokens';

export const FL_ABUSE_HOTLINE = '1-800-96-ABUSE';
export const FL_ABUSE_HOTLINE_TEL = '18009622873';

/** Structured, low-effort observations. Free text is available but never required. */
export const OBSERVATIONS = [
  { id: 'no_answer_unusual',  en: 'No answer, and that is unusual',   es: 'No respondio, y eso es raro' },
  { id: 'mail_piled_up',      en: 'Mail or papers piled up',          es: 'Correo acumulado' },
  { id: 'no_ac_in_heat',      en: 'No air conditioning in the heat',  es: 'Sin aire acondicionado' },
  { id: 'seemed_unsteady',    en: 'Seemed unsteady or confused',      es: 'Parecia inestable o confundido' },
  { id: 'out_of_medication',  en: 'Said they ran out of medication',  es: 'Dijo que se quedo sin medicamentos' },
  { id: 'home_condition',     en: 'Condition of the home concerned me', es: 'El estado de la casa me preocupo' },
  { id: 'other_person_there', en: 'Someone else there concerned me',  es: 'Otra persona alli me preocupo' },
] as const;

export interface ConcernSheetProps {
  lang?: 'en' | 'es';
  onSubmit: (observationIds: string[], acknowledgedDuty: boolean) => void;
  onCancel: () => void;
}

export function ConcernSheet({ lang = 'en', onSubmit, onCancel }: ConcernSheetProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [ack, setAck] = useState(false);
  const es = lang === 'es';

  const toggle = (id: string) =>
    setSelected((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <View style={s.root}>
      <Text style={s.title} accessibilityRole="header" allowFontScaling>
        {es ? 'Que noto?' : 'What did you notice?'}
      </Text>

      {OBSERVATIONS.map((o) => {
        const on = selected.includes(o.id);
        return (
          <Pressable
            key={o.id}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: on }}
            onPress={() => toggle(o.id)}
            style={[s.obs, on && s.obsOn]}
          >
            <Text style={[s.obsText, on && s.obsTextOn]} allowFontScaling>
              {es ? o.es : o.en}
            </Text>
          </Pressable>
        );
      })}

      {/* the duty notice. deliberately unmissable, deliberately not a form. */}
      <View style={s.duty}>
        <Text style={s.dutyTitle} allowFontScaling>
          {es ? 'Importante' : 'Important'}
        </Text>
        <Text style={s.dutyBody} allowFontScaling>
          {es
            ? 'En Florida, usted personalmente debe reportar sospechas de abuso, negligencia o explotacion de un adulto vulnerable. Esta aplicacion no puede hacer el reporte por usted.'
            : 'In Florida, you personally must report suspected abuse, neglect, or exploitation of a vulnerable adult. This app cannot make that report for you.'}
        </Text>
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={`${es ? 'Llamar' : 'Call'} ${FL_ABUSE_HOTLINE}`}
          onPress={() => Linking.openURL(`tel:${FL_ABUSE_HOTLINE_TEL}`)}
          style={s.hotline}
        >
          <Text style={s.hotlineText} allowFontScaling>
            {es ? 'Llamar' : 'Call'} {FL_ABUSE_HOTLINE}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: ack }}
          onPress={() => setAck((v) => !v)}
          style={s.ackRow}
        >
          <View style={[s.ackBox, ack && s.ackBoxOn]} />
          <Text style={s.ackText} allowFontScaling>
            {es ? 'Entiendo que el reporte es mi responsabilidad'
                : 'I understand reporting is my responsibility'}
          </Text>
        </Pressable>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => onSubmit(selected, ack)}
        disabled={selected.length === 0}
        style={[s.send, selected.length === 0 && s.sendOff]}
      >
        <Text style={s.sendText} allowFontScaling>
          {es ? 'Avisar a la agencia' : 'Tell the agency'}
        </Text>
      </Pressable>

      <Pressable accessibilityRole="button" onPress={onCancel} style={s.cancel}>
        <Text style={s.cancelText} allowFontScaling>{es ? 'Cancelar' : 'Cancel'}</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  root: { padding: space.lg, backgroundColor: color.bg, gap: space.sm },
  title: { fontSize: 22, fontWeight: t.weightBold, color: color.text, marginBottom: space.sm },
  obs: {
    minHeight: touch.minTarget + 8, borderRadius: radius.sm, borderWidth: 1,
    borderColor: color.border, justifyContent: 'center', paddingHorizontal: space.md,
  },
  obsOn: { backgroundColor: color.info, borderColor: color.info },
  obsText: { fontSize: t.body, color: color.text },
  obsTextOn: { color: color.textInverse, fontWeight: t.weightMed },

  duty: {
    marginTop: space.lg, padding: space.md, borderRadius: radius.md,
    borderWidth: 2, borderColor: color.danger, gap: space.sm,
  },
  dutyTitle: { fontSize: t.label, fontWeight: t.weightBold, color: color.danger },
  dutyBody: { fontSize: t.body, color: color.text, lineHeight: 24 },
  hotline: {
    minHeight: touch.minTarget, borderRadius: radius.sm, backgroundColor: color.danger,
    alignItems: 'center', justifyContent: 'center',
  },
  hotlineText: { fontSize: t.body, fontWeight: t.weightBold, color: color.textInverse },
  ackRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm, minHeight: touch.minTarget },
  ackBox: {
    width: 24, height: 24, borderRadius: radius.sm, borderWidth: 2, borderColor: color.text,
  },
  ackBoxOn: { backgroundColor: color.text },
  ackText: { flex: 1, fontSize: t.label, color: color.text },

  send: {
    marginTop: space.lg, height: touch.primaryHeight - 12, borderRadius: radius.lg,
    backgroundColor: color.info, alignItems: 'center', justifyContent: 'center',
  },
  sendOff: { opacity: 0.4 },
  sendText: { fontSize: 20, fontWeight: t.weightBold, color: color.textInverse },
  cancel: { minHeight: touch.minTarget, alignItems: 'center', justifyContent: 'center' },
  cancelText: { fontSize: t.body, color: color.textMuted },
});
