/** Notion-inspired palette — warm neutrals + muted block accents */
export const theme = {
  bg: '#F7F6F3',
  surface: '#FFFFFF',
  surfaceHover: '#F1F1EF',
  surfaceInset: '#FBFBFA',
  border: '#E9E9E7',
  borderStrong: '#DFDFDD',
  text: '#37352F',
  textSecondary: '#787774',
  textMuted: '#9B9A97',
  textFaint: '#C3C2BF',
  ai: '#9065B0',
  aiSoft: '#F6F3FA',
  primary: '#37352F',
  primarySoft: '#EDECE9',
  shadowSm: '0 1px 2px rgba(15, 15, 15, 0.04)',
  shadowMd: '0 4px 12px rgba(15, 15, 15, 0.06)',
  shadowLg: '0 8px 24px rgba(15, 15, 15, 0.08)',
  radiusCard: '12px',
  radiusPill: '9999px',
} as const;

export const agentAccents = {
  product: { accent: '#9065B0', bg: '#F6F3FA', shadow: 'rgba(144,101,176,0.15)' },
  engineering: { accent: '#448361', bg: '#EDF3EC', shadow: 'rgba(68,131,97,0.15)' },
  market: { accent: '#D9730D', bg: '#FAEBDD', shadow: 'rgba(217,115,13,0.15)' },
  sales: { accent: '#337EA9', bg: '#E7F3F8', shadow: 'rgba(51,126,169,0.15)' },
} as const;
