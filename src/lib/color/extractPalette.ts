import { hexToRgb, rgbToHex, rgbToHsl } from './contrast';

const TARGET_SIZE = 144;
const COLOR_COUNT_MIN = 6;
const COLOR_COUNT_MAX = 8;

interface Bucket {
  r: number;
  g: number;
  b: number;
  count: number;
}

function quantize(v: number, step: number): number {
  return Math.round(v / step) * step;
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not load image'));
    img.src = src;
  });
}

function drawToCanvas(img: HTMLImageElement): ImageData | null {
  const scale = Math.min(1, TARGET_SIZE / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(1, Math.round(img.naturalWidth * scale));
  const h = Math.max(1, Math.round(img.naturalHeight * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0, w, h);
  try {
    return ctx.getImageData(0, 0, w, h);
  } catch {
    return null;
  }
}

function collectBuckets(data: ImageData, step: number): Map<string, Bucket> {
  const buckets = new Map<string, Bucket>();
  const px = data.data;
  for (let i = 0; i < px.length; i += 4) {
    const a = px[i + 3];
    if (a < 200) continue;
    const r = px[i];
    const g = px[i + 1];
    const b = px[i + 2];
    const qr = quantize(r, step);
    const qg = quantize(g, step);
    const qb = quantize(b, step);
    const key = `${qr},${qg},${qb}`;
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.r += r;
      bucket.g += g;
      bucket.b += b;
      bucket.count += 1;
    } else {
      buckets.set(key, { r, g, b, count: 1 });
    }
  }
  return buckets;
}

function bucketToHex(b: Bucket): string {
  return rgbToHex({ r: b.r / b.count, g: b.g / b.count, b: b.b / b.count });
}

function colorDistance(a: string, b: string): number {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return Math.sqrt((A.r - B.r) ** 2 + (A.g - B.g) ** 2 + (A.b - B.b) ** 2);
}

function score(hex: string, count: number): number {
  const { s, l } = rgbToHsl(hexToRgb(hex));
  // prefer non-grey, non-extreme colors but keep popular ones
  const lightnessPenalty = l < 0.06 || l > 0.96 ? 0.35 : 1;
  const saturationBoost = 0.4 + s * 1.2;
  return count * lightnessPenalty * saturationBoost;
}

function pickDistinct(candidates: { hex: string; weight: number }[], minDistance: number, max: number): string[] {
  const sorted = [...candidates].sort((a, b) => b.weight - a.weight);
  const chosen: string[] = [];
  for (const c of sorted) {
    if (chosen.every((x) => colorDistance(x, c.hex) > minDistance)) {
      chosen.push(c.hex);
      if (chosen.length >= max) break;
    }
  }
  return chosen;
}

export const DEFAULT_PALETTE: string[] = [
  '#0b0f1a',
  '#1b2440',
  '#5b6bff',
  '#7ac4ff',
  '#ff7ab6',
  '#ffd166',
  '#f6f7fb',
  '#22d3a4'
];

export async function extractPaletteFromUrl(url: string): Promise<string[]> {
  try {
    const img = await loadImage(url);
    return extractPaletteFromImage(img);
  } catch {
    return DEFAULT_PALETTE.slice(0, 8);
  }
}

export function extractPaletteFromImage(img: HTMLImageElement): string[] {
  const data = drawToCanvas(img);
  if (!data) return DEFAULT_PALETTE.slice(0, 8);

  const buckets = collectBuckets(data, 24);
  if (buckets.size === 0) return DEFAULT_PALETTE.slice(0, 8);

  const candidates = Array.from(buckets.values()).map((b) => {
    const hex = bucketToHex(b);
    return { hex, weight: score(hex, b.count) };
  });

  // try with a generous distance first, relax if not enough colors
  let result = pickDistinct(candidates, 60, COLOR_COUNT_MAX);
  if (result.length < COLOR_COUNT_MIN) result = pickDistinct(candidates, 40, COLOR_COUNT_MAX);
  if (result.length < COLOR_COUNT_MIN) result = pickDistinct(candidates, 24, COLOR_COUNT_MAX);
  if (result.length < COLOR_COUNT_MIN) return DEFAULT_PALETTE.slice(0, COLOR_COUNT_MAX);

  return sortByHue(result);
}

function sortByHue(colors: string[]): string[] {
  return [...colors].sort((a, b) => {
    const A = rgbToHsl(hexToRgb(a));
    const B = rgbToHsl(hexToRgb(b));
    return A.h - B.h;
  });
}
