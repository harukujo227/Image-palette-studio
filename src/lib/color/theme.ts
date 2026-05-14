import { adjustLightness, bestTextOn, contrastRatio, hexToRgb, mix, rgbToHsl } from './contrast';
import type { ThemeMode, ThemeTokens } from '$lib/types';

interface ColorInfo {
  hex: string;
  h: number;
  s: number;
  l: number;
}

function info(hex: string): ColorInfo {
  const { h, s, l } = rgbToHsl(hexToRgb(hex));
  return { hex, h, s, l };
}

function pickMost<T>(arr: T[], score: (v: T) => number): T {
  let best = arr[0];
  let bestScore = score(best);
  for (let i = 1; i < arr.length; i++) {
    const sc = score(arr[i]);
    if (sc > bestScore) {
      bestScore = sc;
      best = arr[i];
    }
  }
  return best;
}

function hueDistance(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

export function generateTheme(palette: string[], mode: ThemeMode): ThemeTokens {
  if (palette.length === 0) palette = ['#5b6bff'];
  const colors = palette.map(info);

  const isDark = mode === 'dark';

  // Pick a primary: most saturated, mid-lightness color
  const primary = pickMost(colors, (c) => c.s * (1 - Math.abs(c.l - 0.5) * 1.4)).hex;
  const primaryInfo = info(primary);

  // Accent: most saturated color with hue distant from primary
  const accent = pickMost(colors, (c) =>
    c.s * 0.6 + hueDistance(c.h, primaryInfo.h) / 180
  ).hex;

  // Secondary: another saturated color, distant from both
  const accentInfo = info(accent);
  const secondary = pickMost(colors, (c) =>
    c.s * 0.4 +
    (hueDistance(c.h, primaryInfo.h) + hueDistance(c.h, accentInfo.h)) / 360 -
    (c.hex === primary || c.hex === accent ? 1 : 0)
  ).hex;

  // Tune primary lightness for contrast in chosen mode
  const tunedPrimary = adjustLightness(primary, isDark ? 0.62 : 0.5);
  const tunedAccent = adjustLightness(accent, isDark ? 0.68 : 0.55);
  const tunedSecondary = adjustLightness(secondary, isDark ? 0.7 : 0.55);

  // Build background tinted by the dominant hue but kept near neutral
  const background = isDark
    ? mix('#0b0d12', adjustLightness(primary, 0.08), 0.35)
    : mix('#ffffff', adjustLightness(primary, 0.92), 0.5);
  const surface = isDark
    ? mix(background, '#ffffff', 0.06)
    : mix(background, '#ffffff', 0.6);
  const border = isDark
    ? mix(background, '#ffffff', 0.12)
    : mix(background, '#000000', 0.08);

  const text = bestTextOn(background, isDark ? ['#f6f7fb', '#0b0d12'] : ['#0b0d12', '#f6f7fb']);
  const muted = isDark
    ? mix(text, background, 0.45)
    : mix(text, background, 0.45);

  // Adjust primary if it can't reach reasonable contrast
  let finalPrimary = tunedPrimary;
  if (contrastRatio(finalPrimary, background) < 2.2) {
    finalPrimary = adjustLightness(finalPrimary, isDark ? 0.72 : 0.42);
  }
  let finalAccent = tunedAccent;
  if (contrastRatio(finalAccent, background) < 2.2) {
    finalAccent = adjustLightness(finalAccent, isDark ? 0.78 : 0.48);
  }

  return {
    background,
    surface,
    text,
    muted,
    primary: finalPrimary,
    secondary: tunedSecondary,
    accent: finalAccent,
    border
  };
}

export function themeToCss(theme: ThemeTokens): string {
  return `:root {
  --color-background: ${theme.background};
  --color-surface: ${theme.surface};
  --color-text: ${theme.text};
  --color-muted: ${theme.muted};
  --color-primary: ${theme.primary};
  --color-secondary: ${theme.secondary};
  --color-accent: ${theme.accent};
  --color-border: ${theme.border};
}`;
}
