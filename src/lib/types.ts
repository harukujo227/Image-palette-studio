export type Hex = `#${string}`;

export type RGB = { r: number; g: number; b: number };

export type ThemeMode = 'light' | 'dark';

export interface ThemeTokens {
  background: string;
  surface: string;
  text: string;
  muted: string;
  primary: string;
  secondary: string;
  accent: string;
  border: string;
}

export interface SavedPalette {
  id: string;
  name: string;
  colors: string[];
  createdAt: number;
}

export type ContrastLabel = 'Strong' | 'Good' | 'Low';
