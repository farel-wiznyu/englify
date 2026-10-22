import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import * as Speech from 'expo-speech';

import type { VocabItem } from '@/data/types';

let current: AudioPlayer | null = null;
let modeReady = false;

async function ensureMode() {
  if (modeReady) return;
  try {
    await setAudioModeAsync({ playsInSilentMode: true });
  } catch {
    // non-fatal: playback still works with defaults
  }
  modeReady = true;
}

function stopCurrent() {
  Speech.stop();
  if (current) {
    try {
      current.release();
    } catch {
      // already released
    }
    current = null;
  }
}

/** Plays a bundled/remote clip if available, otherwise falls back to on-device TTS. */
export async function playText(text: string, audioUrl?: string, rate = 0.8): Promise<void> {
  stopCurrent();
  await ensureMode();
  if (audioUrl) {
    try {
      const player = createAudioPlayer({ uri: audioUrl });
      current = player;
      player.play();
      return;
    } catch {
      // fall through to TTS
    }
  }
  Speech.speak(text, { language: 'en-US', rate });
}

export const playWord = (item: Pick<VocabItem, 'word' | 'audioUrl'>) =>
  playText(item.word, item.audioUrl);

/** Indonesian instruction for non-readers. */
export function speakIndonesian(text: string) {
  stopCurrent();
  Speech.speak(text, { language: 'id-ID', rate: 0.9 });
}

export const stopAudio = stopCurrent;
