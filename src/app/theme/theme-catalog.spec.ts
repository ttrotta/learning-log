import { describe, expect, it } from 'vitest';
import { THEMES, resolveTheme } from './theme-catalog';

describe('theme-catalog', () => {
  describe('THEMES', () => {
    it('defines exactly the 6 curated themes with distinct names', () => {
      expect(THEMES).toHaveLength(6);
      expect(THEMES.map((theme) => theme.name)).toEqual([
        'solaris',
        'abyss',
        'neon',
        'meadow',
        'candy',
        'paper',
      ]);
    });

    it('gives every theme a label and blurb for the gallery', () => {
      THEMES.forEach((theme) => {
        expect(theme.label.length).toBeGreaterThan(0);
        expect(theme.blurb.length).toBeGreaterThan(0);
      });
    });
  });

  describe('resolveTheme', () => {
    it('returns the theme for a recognized value', () => {
      expect(resolveTheme('solaris')).toBe('solaris');
      expect(resolveTheme('neon')).toBe('neon');
      expect(resolveTheme('paper')).toBe('paper');
    });

    it('falls back to paper for missing values', () => {
      expect(resolveTheme(undefined)).toBe('paper');
      expect(resolveTheme('')).toBe('paper');
    });

    it('falls back to paper for unknown or malformed values', () => {
      expect(resolveTheme('unknown')).toBe('paper');
      expect(resolveTheme('rainbow')).toBe('paper');
      expect(resolveTheme(42)).toBe('paper');
      expect(resolveTheme(null)).toBe('paper');
    });
  });
});