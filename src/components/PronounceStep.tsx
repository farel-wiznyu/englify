import {
  RecordingPresets,
  createAudioPlayer,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
} from 'expo-audio';
import { useState } from 'react';
import { View } from 'react-native';

import { VocabArt } from '@/components/VocabArt';
import { AppText, Art, AudioButton, Button, Card } from '@/components/ui';
import { Colors } from '@/constants/theme';
import type { VocabItem } from '@/data/types';
import { playWord } from '@/lib/audio';

type Phase = 'idle' | 'recording' | 'recorded' | 'denied';

interface Props {
  item: VocabItem;
  onDone: (selfRated: 'good' | 'again') => void;
}

/**
 * Honest pronunciation practice: no automatic scoring. The child listens, records,
 * plays their own voice back and rates themselves. The recording never leaves the device.
 */
export function PronounceStep({ item, onDone }: Props) {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [phase, setPhase] = useState<Phase>('idle');

  async function start() {
    const perm = await requestRecordingPermissionsAsync();
    if (!perm.granted) {
      setPhase('denied');
      return;
    }
    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    await recorder.prepareToRecordAsync();
    recorder.record();
    setPhase('recording');
  }

  async function stop() {
    await recorder.stop();
    await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
    setPhase('recorded');
  }

  function playBack() {
    if (!recorder.uri) return;
    const p = createAudioPlayer({ uri: recorder.uri });
    p.play();
  }

  return (
    <View style={{ gap: 16 }}>
      <View style={{ alignItems: 'center' }}>
        {phase === 'denied' ? (
          <Art name="state-mic" fallback="🎤" size={110} />
        ) : phase === 'recording' ? (
          <Art name="mascot-speak" fallback="🦉" size={110} />
        ) : (
          <Art name="mascot-listen" fallback="🦉" size={110} />
        )}
      </View>
      <Card tone="white" style={{ alignItems: 'center', gap: 8 }}>
        <VocabArt item={item} size={140} />
        <AppText variant="hero">{item.word}</AppText>
        <AudioButton onPress={() => playWord(item)} />
      </Card>

      {phase === 'denied' && (
        <Card tone="pink">
          <AppText>Mikrofon belum diizinkan. Minta orang tua mengaktifkannya di Pengaturan, atau lewati latihan ini.</AppText>
        </Card>
      )}

      {(phase === 'idle' || phase === 'denied') && (
        <Button label="🎤 Ucapkan" onPress={start} />
      )}
      {phase === 'recording' && (
        <>
          <AppText center color={Colors.danger}>Merekam... ucapkan "{item.word}"</AppText>
          <Button label="⏹ Selesai" onPress={stop} />
        </>
      )}
      {phase === 'recorded' && (
        <>
          <Button label="▶ Dengar suaraku" kind="yellow" onPress={playBack} />
          <AppText center>Apakah suaramu mirip contoh?</AppText>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Button style={{ flex: 1 }} label="Coba lagi" kind="secondary" onPress={() => setPhase('idle')} />
            <Button style={{ flex: 1 }} label="Mirip! 👍" onPress={() => onDone('good')} />
          </View>
        </>
      )}
      <Button label="Lewati" kind="secondary" onPress={() => onDone('again')} />
    </View>
  );
}
