// Generates public/favicon.svg, favicon.png, apple-touch-icon.png, and og-image.png.
// Run with: node scripts/generate-icons.mjs  (re-run after changing the name below)
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const NAME = 'Arefin Mahmood';
const LINE = 'Computer engineering · embedded systems · robotics · prototyping';

const mark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#0b0f14"/>
  <rect x="14" y="14" width="36" height="36" rx="6" fill="none" stroke="#8bd5ff" stroke-width="5"/>
  <rect x="25" y="25" width="14" height="14" rx="2" fill="#8bd5ff"/>
</svg>`;

// Three isometric plates, echoing the hero diagram.
const plate = (y, stroke) =>
  `<polygon points="${[
    [900, y],
    [1090, y + 110],
    [960, y + 185],
    [770, y + 75],
  ]
    .map((p) => p.join(','))
    .join(' ')}" fill="#121a24" stroke="${stroke}" stroke-width="2"/>`;

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="g" cx="0.8" cy="0.2" r="0.7">
      <stop offset="0" stop-color="#8bd5ff" stop-opacity="0.12"/>
      <stop offset="1" stop-color="#0b0f14" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#0b0f14"/>
  <rect width="1200" height="630" fill="url(#g)"/>
  ${plate(330, '#3a4b60')}
  ${plate(215, '#3a4b60')}
  ${plate(100, '#8bd5ff')}
  <path d="M905,175 L905,290 L960,322 L960,437" fill="none" stroke="#8bd5ff" stroke-width="3" stroke-dasharray="4 6"/>
  <text x="80" y="250" font-family="IBM Plex Mono, Consolas, monospace" font-size="24" letter-spacing="3" fill="#8bd5ff">PORTFOLIO</text>
  <text x="80" y="335" font-family="Space Grotesk, Segoe UI, Arial, sans-serif" font-size="78" font-weight="700" fill="#f2f5f8">${NAME}</text>
  <text x="80" y="395" font-family="Space Grotesk, Segoe UI, Arial, sans-serif" font-size="27" fill="#a5b2c1">${LINE}</text>
</svg>`;

await writeFile('public/favicon.svg', mark);
await sharp(Buffer.from(mark)).resize(32, 32).png().toFile('public/favicon.png');
await sharp(Buffer.from(mark)).resize(180, 180).png().toFile('public/apple-touch-icon.png');
await sharp(Buffer.from(og)).png({ compressionLevel: 9 }).toFile('public/og-image.png');
console.log('icons written');
