// Generates English pronunciation audio once with Google Cloud Text-to-Speech and uploads it to
// the public `vocab-audio` Supabase Storage bucket. Safe to re-run: existing files are skipped.
//
//   node --env-file=scripts/.env scripts/generate-audio.mjs [--force]
//
// scripts/.env (never committed, never bundled into the app):
//   GOOGLE_TTS_API_KEY=...
//   SUPABASE_URL=https://xxxx.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY=...
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const { GOOGLE_TTS_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
if (!GOOGLE_TTS_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing GOOGLE_TTS_API_KEY, SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (see scripts/.env.example).');
  process.exit(1);
}

const force = process.argv.includes('--force');
const BUCKET = 'vocab-audio';
const VOICE = { languageCode: 'en-US', name: 'en-US-Neural2-F' };
const manifestUrl = new URL('../src/data/audio-manifest.json', import.meta.url);
const manifest = existsSync(manifestUrl) ? JSON.parse(readFileSync(manifestUrl, 'utf8')) : {};
const data = JSON.parse(readFileSync(new URL('../src/data/vocabulary.json', import.meta.url), 'utf8'));

const publicUrl = (path) => `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;

async function synthesize(text) {
  const res = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_TTS_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: { text },
      voice: VOICE,
      audioConfig: { audioEncoding: 'MP3', speakingRate: 0.85, sampleRateHertz: 24000 },
    }),
  });
  if (!res.ok) throw new Error(`TTS ${res.status}: ${await res.text()}`);
  const { audioContent } = await res.json();
  return Buffer.from(audioContent, 'base64');
}

async function upload(path, bytes) {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      'Content-Type': 'audio/mpeg',
      'x-upsert': 'true',
    },
    body: bytes,
  });
  if (!res.ok) throw new Error(`Upload ${res.status}: ${await res.text()}`);
}

let made = 0;
for (const item of data.items) {
  if (manifest[item.id] && !force) continue;
  const path = `words/${item.id}.mp3`;
  try {
    await upload(path, await synthesize(item.word));
    manifest[item.id] = publicUrl(path);
    made += 1;
    console.log(`ok  ${item.word}`);
  } catch (err) {
    console.error(`FAIL ${item.word}: ${err.message}`);
  }
  writeFileSync(manifestUrl, JSON.stringify(manifest, null, 2));
}
console.log(`Done. Generated ${made}, total ${Object.keys(manifest).length}/${data.items.length}.`);
