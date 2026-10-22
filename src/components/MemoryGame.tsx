import { randomUUID } from 'expo-crypto';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';

import { FlipCard } from '@/components/FlipCard';
import { GameResultView } from '@/components/GameResult';
import { VocabArt } from '@/components/VocabArt';
import { AppText, Button, Screen } from '@/components/ui';
import { useSessionTimer } from '@/hooks/useSessionTimer';
import { artSource } from '@/lib/art';
import { playWord, stopAudio } from '@/lib/audio';
import { buildMemoryDeck, poolFor } from '@/lib/gameLogic';
import { starsFor } from '@/lib/progress';
import { useAppStore } from '@/store/useAppStore';

const PAIRS = 6;
const cardBack = artSource('memory-card-back');

export function MemoryGame({ categoryId }: { categoryId: string }) {
  const recordAnswer = useAppStore((s) => s.recordAnswer);
  const addGameResult = useAppStore((s) => s.addGameResult);

  const [round, setRound] = useState(0);
  const deck = useMemo(
    () => buildMemoryDeck(poolFor(categoryId), PAIRS),
    // `round` re-deals the deck on "Main lagi".
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [categoryId, round],
  );
  const [open, setOpen] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const done = useRef(false);
  const settle = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pairs = deck.length / 2;

  useSessionTimer();
  useEffect(
    () => () => {
      stopAudio();
      clearTimeout(settle.current);
    },
    [],
  );

  const finished = matched.length === deck.length && deck.length > 0;

  useEffect(() => {
    if (!finished || done.current) return;
    done.current = true;
    const total = Math.max(moves, pairs);
    addGameResult({
      id: randomUUID(),
      gameType: 'memory',
      categoryId,
      score: pairs,
      total,
      stars: starsFor(pairs, total),
      completedAt: new Date().toISOString(),
    });
  }, [finished, addGameResult, categoryId, moves, pairs]);

  function flip(key: string) {
    if (locked || open.includes(key) || matched.includes(key)) return;
    const card = deck.find((c) => c.key === key)!;
    if (card.kind === 'word') playWord(card.item);
    const next = [...open, key];
    setOpen(next);
    if (next.length < 2) return;

    setMoves((m) => m + 1);
    const [a, b] = next.map((k) => deck.find((c) => c.key === k)!);
    const isMatch = a.vocabId === b.vocabId;
    recordAnswer(a.vocabId, isMatch);
    if (!isMatch) recordAnswer(b.vocabId, false);
    setLocked(true);
    settle.current = setTimeout(
      () => {
        if (isMatch) {
          setMatched((m) => [...m, a.key, b.key]);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        }
        setOpen([]);
        setLocked(false);
      },
      isMatch ? 500 : 1000,
    );
  }

  if (finished) {
    const stars = starsFor(pairs, Math.max(moves, pairs));
    return (
      <GameResultView
        stars={stars}
        headline="Semua pasangan ketemu!"
        detail={`Kamu butuh ${moves} langkah.`}
        onReplay={() => {
          done.current = false;
          setRound((r) => r + 1);
          setOpen([]);
          setMatched([]);
          setMoves(0);
        }}
      />
    );
  }

  return (
    <Screen tone="blue">
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Button label="← Keluar" kind="secondary" onPress={() => router.back()} style={{ minHeight: 48, paddingHorizontal: 16 }} />
        <AppText variant="label">Langkah: {moves}</AppText>
      </View>
      <AppText variant="caption" center>Cari pasangan kata dan gambarnya</AppText>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {deck.map((c) => {
          const isMatched = matched.includes(c.key);
          const faceUp = isMatched || open.includes(c.key);
          return (
            <FlipCard
              key={`${round}-${c.key}`}
              faceUp={faceUp}
              matched={isMatched}
              label={faceUp ? (c.kind === 'word' ? c.item.word : c.item.emoji) : 'Kartu tertutup'}
              onPress={() => flip(c.key)}
              bare={!!cardBack}
              cover={
                cardBack ? (
                  <Image source={cardBack} contentFit="contain" accessible={false} style={{ width: '100%', height: '100%' }} />
                ) : (
                  <AppText style={{ fontSize: 36, lineHeight: 46 }}>❓</AppText>
                )
              }>
              {c.kind === 'word' ? (
                <AppText variant="heading" center>{c.item.word}</AppText>
              ) : (
                <VocabArt item={c.item} size={78} />
              )}
            </FlipCard>
          );
        })}
      </View>
    </Screen>
  );
}
