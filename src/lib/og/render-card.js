// Branded 1200x630 Open Graph card, rendered with @napi-rs/canvas (Skia + HarfBuzz shaping).
// Why not next/og (Satori): Satori does not do complex-script shaping, so Tamil vowel signs (ெ ே ை ொ ோ ௌ)
// come out reordered/missing. Verified visually; this renderer shapes Tamil correctly. Node runtime only.
import fs from 'node:fs';
import path from 'node:path';
import { createCanvas, GlobalFonts } from '@napi-rs/canvas';
import { OG_SIZE, fitTitle } from './layout.js';
export { cardVersion } from './card-version.js';

const FONT_DIR = path.join(process.cwd(), 'src', 'lib', 'og', 'fonts');
const FONTS = [
  ['NotoSans-Latin-Regular.ttf', 'OGLatin'],
  ['NotoSans-Latin-Bold.ttf', 'OGLatin'],
  ['NotoSansTamil-Regular.ttf', 'OGTamil'],
  ['NotoSansTamil-Bold.ttf', 'OGTamil'],
];
let fontsReady = false;
function ensureFonts() {
  if (fontsReady) return;
  for (const [file, family] of FONTS) {
    if (!GlobalFonts.registerFromPath(path.join(FONT_DIR, file), family)) {
      throw new Error(`OG font failed to load: ${file}`);
    }
  }
  fontsReady = true;
}

const STACK = 'OGLatin, OGTamil';
const C = { bg: '#FCF6F5', ink: '#141414', muted: '#5b5654', accent: '#0369a1', rule: '#e4d9d6' };

const CATEGORY_LABEL = {
  poem: 'POEM', 'short story': 'SHORT STORY', 'short writings': 'SHORT WRITING', letter: 'LETTER', joke: 'JOKE',
};

/** @returns {Buffer} PNG, 1200x630. Same input -> same bytes. */
export function renderCard({ title, category, host = 'ajithkumarr.com' }) {
  ensureFonts();
  const { width, height } = OG_SIZE;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'alphabetic';

  ctx.fillStyle = C.bg; ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = C.accent; ctx.fillRect(0, 0, 18, height);

  const padX = 90;
  const maxWidth = width - padX * 2;

  ctx.fillStyle = C.accent;
  ctx.font = `700 26px ${STACK}`;
  if ('letterSpacing' in ctx) ctx.letterSpacing = '4px';
  ctx.fillText(CATEGORY_LABEL[category] || 'WRITING', padX, 100);
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';

  const measure = (text, px) => { ctx.font = `700 ${px}px ${STACK}`; return ctx.measureText(text).width; };
  const { fontPx, lines } = fitTitle(title, measure, { maxWidth, maxLines: 3 });
  const lineHeight = Math.round(fontPx * 1.38); // Tamil needs generous leading for stacked marks
  const blockHeight = lineHeight * lines.length;
  const top = 150, bottom = 470;
  let y = top + Math.max(0, (bottom - top - blockHeight) / 2) + fontPx;
  ctx.fillStyle = C.ink; ctx.font = `700 ${fontPx}px ${STACK}`;
  for (const line of lines) { ctx.fillText(line, padX, y); y += lineHeight; }

  ctx.fillStyle = C.rule; ctx.fillRect(padX, 520, maxWidth, 2);
  ctx.fillStyle = C.ink; ctx.font = `700 36px ${STACK}`;
  ctx.fillText('அஜித்குமார்  ·  Ajithkumar R', padX, 580);
  ctx.fillStyle = C.muted; ctx.font = `400 28px ${STACK}`;
  ctx.textAlign = 'right';
  ctx.fillText(host, width - padX, 580);
  ctx.textAlign = 'left';

  return canvas.toBuffer('image/png');
}
