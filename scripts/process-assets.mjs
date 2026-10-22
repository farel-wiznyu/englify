// Turns the raw ChatGPT illustrations into app-ready assets and regenerates the image registry.
//
//   node scripts/process-assets.mjs <folder-with-raw-pngs> [--map scripts/asset-map.json]
//
// Without --map, every target is looked up by file name anywhere under the folder
// (e.g. animals-cat.png). With --map, each target takes the source file the map names.
// Output: assets/art, assets/vocab, assets/images (app icons) and src/lib/art.generated.ts.
//
// Processing: magenta (#FF00FF) backgrounds are keyed out, vocabulary pictures are trimmed and
// centred at a uniform size, everything is downscaled and palette-compressed.
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const args = process.argv.slice(2);
if (!args[0]) {
  console.error('Usage: node scripts/process-assets.mjs <folder> [--map file.json]');
  process.exit(1);
}
const srcRoot = resolve(args[0]);
const mapIdx = args.indexOf('--map');
const map = mapIdx >= 0 ? JSON.parse(readFileSync(resolve(args[mapIdx + 1]), 'utf8')) : null;

const vocab = JSON.parse(readFileSync(join(ROOT, 'src/data/vocabulary.json'), 'utf8'));
const TARGETS = [
  ...[
    'mascot-happy', 'mascot-cheer', 'mascot-think', 'mascot-listen', 'mascot-speak', 'signin-scene',
    'ollie-base', 'onboard-vocab', 'onboard-speak', 'onboard-games', 'state-offline', 'state-mic',
    'state-empty', 'trophy', 'balloon', 'medal', 'game-match', 'game-listen', 'game-memory',
    'memory-card-back',
  ].map((n) => `art/${n}`),
  ...['icon', 'android-icon-foreground', 'android-icon-monochrome', 'splash-icon'].map((n) => `icon/${n}`),
  ...['bear', 'cat', 'dog', 'fox', 'lion', 'panda'].map((n) => `avatar/avatar-${n}`),
  ...['crown', 'fire', 'heart', 'lightning', 'star', 'trophy'].map((n) => `badge/badge-${n}`),
  ...vocab.items.map((v) => `vocab/${v.id}`),
];

const OUT = {
  art: join(ROOT, 'assets/art'),
  vocab: join(ROOT, 'assets/vocab'),
  icon: join(ROOT, 'assets/images'),
  avatar: join(ROOT, 'assets/avatars'),
  badge: join(ROOT, 'assets/badges'),
};

/** Output pixel size for `art/` files that are used small (default 768). */
const ART_SIZE = { 'game-match': 512, 'game-listen': 512, 'game-memory': 512, 'memory-card-back': 512, medal: 512 };
Object.values(OUT).forEach((d) => mkdirSync(d, { recursive: true }));

const walk = (d) =>
  readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)],
  );
const byName = new Map();
if (!map) for (const f of walk(srcRoot)) if (f.endsWith('.png')) byName.set(basename(f, '.png'), f);

/** Removes a flat #FF00FF background left by the image generator (colour-key with edge decontamination). */
function keyMagenta(data) {
  const isKeyed = data[0] > 200 && data[1] < 90 && data[2] > 200 && data[3] === 255;
  if (!isKeyed) return false;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r < 150 || b < 150 || g > 120) continue;
    const t = Math.min(1, Math.max(0, (Math.min(r, b) - g - 80) / 120));
    if (t === 0) continue;
    if (t >= 0.98) {
      data[i + 3] = 0;
      continue;
    }
    const k = 1 - t;
    data[i] = Math.max(0, Math.min(255, (r - 255 * t) / k));
    data[i + 1] = Math.max(0, Math.min(255, g / k));
    data[i + 2] = Math.max(0, Math.min(255, (b - 255 * t) / k));
    data[i + 3] = Math.round(data[i + 3] * k);
  }
  return true;
}

function bbox({ data, width, height }) {
  let x0 = width;
  let y0 = height;
  let x1 = -1;
  let y1 = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 16) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  return x1 < 0 ? null : { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };
}

const PNG = { palette: true, quality: 92, effort: 10, compressionLevel: 9 };

/** Trim to the drawn pixels, fit inside `box`, centre on a transparent `canvas` square. */
async function fitCentered(raw, box, canvas) {
  const b = bbox(raw);
  const trimmed = await sharp(raw.data, { raw: { width: raw.width, height: raw.height, channels: 4 } })
    .extract(b)
    .resize(box, box, { fit: 'inside' })
    .png()
    .toBuffer();
  return sharp({ create: { width: canvas, height: canvas, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: trimmed, gravity: 'center' }])
    .png(PNG)
    .toBuffer();
}

async function render(kind, target, srcPath) {
  const { data, info } = await sharp(srcPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const keyed = keyMagenta(data);
  const raw = { data, width: info.width, height: info.height };
  const name = target.split('/')[1];

  if (kind === 'vocab') return { buf: await fitCentered(raw, 472, 512), keyed };
  if (kind === 'avatar') return { buf: await fitCentered(raw, 350, 384), keyed };
  if (kind === 'badge') return { buf: await fitCentered(raw, 236, 256), keyed };
  if (kind === 'icon') {
    if (name === 'icon') {
      const buf = await sharp(srcPath).resize(1024, 1024).removeAlpha().png(PNG).toBuffer();
      return { buf, keyed };
    }
    const box = name === 'splash-icon' ? 900 : 660; // adaptive icons keep art inside the ~66% safe zone
    return { buf: await fitCentered(raw, box, 1024), keyed };
  }
  const px = ART_SIZE[name] ?? 768;
  const buf = await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .resize(px, px, { fit: 'inside' })
    .png(PNG)
    .toBuffer();
  return { buf, keyed };
}

const sources = map
  ? Object.entries(map).filter(([k]) => !k.startsWith('_')).map(([t, rel]) => [t, join(srcRoot, rel)])
  : TARGETS.map((t) => [t, byName.get(t.split('/')[1])]).filter(([, p]) => p);

let done = 0;
let totalKB = 0;
for (const [target, srcPath] of sources) {
  const [kind, name] = target.split('/');
  if (!OUT[kind]) {
    console.warn(`skip unknown target ${target}`);
    continue;
  }
  if (!existsSync(srcPath)) {
    console.warn(`MISSING source for ${target}: ${srcPath}`);
    continue;
  }
  const { buf, keyed } = await render(kind, target, srcPath);
  writeFileSync(join(OUT[kind], `${name}.png`), buf);
  done += 1;
  totalKB += buf.length / 1024;
  console.log(`${target.padEnd(30)} <- ${basename(srcPath).padEnd(28)} ${(buf.length / 1024).toFixed(0).padStart(4)} KB${keyed ? '  (magenta removed)' : ''}`);
}

// Registry: only files that exist, so missing pictures fall back to emoji in the app.
const list = (dir) =>
  readdirSync(dir).filter((f) => f.endsWith('.png')).map((f) => basename(f, '.png')).sort();
const entries = (folder, names) =>
  names.map((n) => `  '${n}': require('../../assets/${folder}/${n}.png'),`).join('\n');

writeFileSync(
  join(ROOT, 'src/lib/art.generated.ts'),
  `// Generated by scripts/process-assets.mjs. Do not edit by hand.
import type { ImageSource } from 'expo-image';

export const artSources: Record<string, ImageSource> = {
${entries('art', list(OUT.art))}
};

export const vocabSources: Record<string, ImageSource> = {
${entries('vocab', list(OUT.vocab))}
};

export const avatarSources: Record<string, ImageSource> = {
${entries('avatars', list(OUT.avatar))}
};

export const badgeSources: Record<string, ImageSource> = {
${entries('badges', list(OUT.badge))}
};
`,
);

const missing = vocab.items.map((v) => v.id).filter((id) => !existsSync(join(OUT.vocab, `${id}.png`)));
console.log(`\nProcessed ${done} files, ${totalKB.toFixed(0)} KB total.`);
console.log(`Vocabulary pictures: ${vocab.items.length - missing.length}/${vocab.items.length}`);
if (missing.length) console.log(`Still missing: ${missing.join(', ')}`);
console.log(`Registry written: src/lib/art.generated.ts (${statSync(join(ROOT, 'src/lib/art.generated.ts')).size} bytes)`);
