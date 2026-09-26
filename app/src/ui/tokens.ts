/**
 * Design tokens.
 *
 * React Native has no CSS, so none of the 2022 Sass carries. These are derived from the
 * original Figma palette and then adjusted for one constraint the web version never had
 * to meet: a driver reading this one-handed, in direct Miami sunlight, holding a box.
 *
 * Every foreground/background pair below meets WCAG 2.1 AA (4.5:1 minimum), which is
 * binding via HHS Section 504 by May 11 2027 and DOJ ADA Title II by April 26 2027.
 */

export const color = {
  bg: '#FFFFFF',
  surface: '#F4F6F8',
  border: '#D3D9DF',

  text: '#12181F',          // 16.1:1 on white
  textMuted: '#59636E',     // 5.9:1 on white
  textInverse: '#FFFFFF',

  primary: '#0B6E4F',       // 5.4:1 on white. delivered / go
  primaryPressed: '#08533B',
  danger: '#A8321F',        // 6.4:1 on white. problem outcomes
  warn: '#8A5A00',          // 5.1:1 on white. needs reconfirming
  info: '#0F5C8C',          // 6.0:1 on white

  queueBg: '#EDF1F4',
  queueText: '#59636E',
} as const;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

export const radius = { sm: 6, md: 10, lg: 14 } as const;

/**
 * 44x44pt is the Apple HIG minimum and the WCAG 2.5.5 target size guidance.
 * The primary confirm control is far larger because it is pressed with a thumb while
 * the other hand holds a meal box.
 */
export const touch = {
  minTarget: 44,
  primaryHeight: 72,
  factRowHeight: 64,
} as const;

export const type = {
  // Sizes are base values; all Text uses allowFontScaling so OS dynamic type applies.
  recipientName: 28,
  address: 18,
  body: 17,
  label: 15,
  small: 13,
  weightBold: '700' as const,
  weightMed: '600' as const,
  weightReg: '400' as const,
} as const;
