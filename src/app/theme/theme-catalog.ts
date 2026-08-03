export type ThemeName = 'solaris' | 'abyss' | 'neon' | 'meadow' | 'candy' | 'paper';

export interface ThemeInfo {
  name: ThemeName;
  label: string;
  blurb: string;
}

export const THEMES: ThemeInfo[] = [
  {
    name: 'solaris',
    label: 'Solaris',
    blurb: 'Warm sunrise coral on sand — bold and energetic.',
  },
  {
    name: 'abyss',
    label: 'Abyss',
    blurb: 'Deep blacks with electric violet accents — dark focus.',
  },
  {
    name: 'neon',
    label: 'Neon',
    blurb: 'Near-black base with cyan and magenta — nightclub glow.',
  },
  {
    name: 'meadow',
    label: 'Meadow',
    blurb: 'Fresh greens on earthy cream — calm and natural.',
  },
  {
    name: 'candy',
    label: 'Candy',
    blurb: 'Pastel pinks and lavender — playful and sweet.',
  },
  {
    name: 'paper',
    label: 'Paper',
    blurb: 'Clean white with warm grey ink — the quiet default.',
  },
];

const THEME_NAMES = new Set<ThemeName>(THEMES.map((theme) => theme.name));

export function resolveTheme(value: unknown): ThemeName {
  return typeof value === 'string' && THEME_NAMES.has(value as ThemeName)
    ? (value as ThemeName)
    : 'paper';
}