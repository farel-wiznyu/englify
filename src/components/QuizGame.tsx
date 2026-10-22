import { randomUUID } from 'expo-crypto';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';

import { GameResultView } from '@/components/GameResult';
import { VocabArt } from '@/components/VocabArt';
import { AppText, Art, AudioButton, Button, Card, PressableScale, Screen } from '@/components/ui';
import { Colors, Outline, Radius } from '@/constants/theme';
import type { GameType, VocabItem } from '@/data/types';
import { useSessionTimer } from '@/hooks/useSessionTimer';
import { playWord, stopAudio } from '@/lib/audio';
import { buildQuestions, poolFor } from '@/lib/gameLogic';
import { enterUp, usePulse, useShake } from '@/lib/motion';
import { starsFor } from '@/lib/progress';
import { useAppStore } from '@/store/useAppStore';

const QUESTIONS = 8;

type TileState = 'idle' | 'correct' | 'wrong' | 'reveal';

const tileBg: Record<TileState, string> = {
  idle: Colors.white,
  correct: Colors.successBg,
  reveal: Colors.successBg,
  wrong: Colors.pink,
};

/** One answer option. Bounces when right (or revealed), shakes when wrong. */
const OptionTile = memo(function OptionTile({
  option,
  state,
  onChoose,
}: {
  option: VocabItem;
  state: TileState;
  onChoose: (id: string) => void;
}) {
  const bump = usePulse(1.1);
  const shake = useShake();
  const { trigger: bumpNow } = bump;
  const { trigger: shakeNow } = shake;

  useEffect(() => {
    if (state === 'correct' || state === 'reveal') bumpNow();
    else if (state === 'wrong') shakeNow();
  }, [state, bumpNow, shakeNow]);

  return (
    <Animated.View style={[{ flexBasis: '47%', flexGrow: 1 }, shake.style]}>
      <Animated.View style={bump.style}>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={`Pilihan ${option.emoji}`}
          pressedScale={0.94}
          onPress={() => onChoose(option.id)}
          style={{
            ...Outline,
            borderBottomWidth: 5,
            minHeight: 120,
            borderRadius: Radius.lg,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: tileBg[state],
          }}>
          <VocabArt item={option} size={96} />
          {state !== 'idle' && (
            <AppText variant="label">
              {state === 'wrong' ? '✗ ' : '✓ '}
              {option.word}
            </AppText>
          )}
        </PressableScale>
      </Animated.View>
    </Animated.View>
  );
});

interface Props {
  mode: Extract<GameType, 'match' | 'listen'>;
  categoryId: string;
}

/** "match": see the word, pick the picture. "listen": hear the word, pick the picture. */
export function QuizGame({ mode, categoryId }: Props) {
  const ageGroup = useAppStore((s) => s.child?.ageGroup ?? '4_6');
  const recordAnswer = useAppStore((s) => s.recordAnswer);
  const addGameResult = useAppStore((s) => s.addGameResult);

  const [round, setRound] = useState(0);
  const questions = useMemo(
    () => buildQuestions(poolFor(categoryId), QUESTIONS, ageGroup),
    // `round` re-rolls the question set on "Main lagi".
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [categoryId, ageGroup, round],
  );
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const advance = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useSessionTimer();

  const q = questions[index];

  useEffect(() => {
    if (mode === 'listen' && q && !finished) playWord(q.target);
    return () => stopAudio();
  }, [mode, q, finished]);

  useEffect(() => () => clearTimeout(advance.current), []);

  if (finished || !q) {
    const stars = starsFor(score, questions.length);
    return (
      <GameResultView
        stars={stars}
        headline={stars === 3 ? 'Luar biasa!' : stars === 2 ? 'Bagus sekali!' : 'Terus semangat!'}
        detail={`Benar ${score} dari ${questions.length}`}
        onReplay={() => {
          setRound((r) => r + 1);
          setIndex(0);
          setScore(0);
          setPicked(null);
          setFinished(false);
        }}
      />
    );
  }

  function choose(id: string) {
    if (picked) return;
    const correct = id === q.target.id;
    setPicked(id);
    recordAnswer(q.target.id, correct);
    Haptics.notificationAsync(
      correct ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning,
    ).catch(() => {});
    const newScore = score + (correct ? 1 : 0);
    if (correct) setScore(newScore);
    advance.current = setTimeout(() => {
      setPicked(null);
      if (index === questions.length - 1) {
        addGameResult({
          id: randomUUID(),
          gameType: mode,
          categoryId,
          score: newScore,
          total: questions.length,
          stars: starsFor(newScore, questions.length),
          completedAt: new Date().toISOString(),
        });
        setFinished(true);
      } else {
        setIndex(index + 1);
      }
    }, 900);
  }

  const stateOf = (o: VocabItem): TileState => {
    if (!picked) return 'idle';
    if (o.id === q.target.id) return picked === q.target.id ? 'correct' : 'reveal';
    return o.id === picked ? 'wrong' : 'idle';
  };

  return (
    <Screen tone="blue">
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Button label="← Keluar" kind="secondary" onPress={() => router.back()} style={{ minHeight: 48, paddingHorizontal: 16 }} />
        <AppText variant="label">{index + 1} / {questions.length}</AppText>
      </View>

      <Animated.View key={`${round}-${index}`} entering={enterUp(0)}>
        <Card tone="purple" style={{ alignItems: 'center', gap: 10 }}>
          <AppText variant="caption">
            {mode === 'match' ? 'Pilih gambar yang cocok' : 'Dengarkan, lalu pilih gambarnya'}
          </AppText>
          {mode === 'match' ? (
            <AppText variant="hero">{q.target.word}</AppText>
          ) : (
            <AppText style={{ fontSize: 40, lineHeight: 48 }}>👂</AppText>
          )}
          <AudioButton onPress={() => playWord(q.target)} />
        </Card>
      </Animated.View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {q.options.map((o) => (
          <OptionTile key={`${round}-${index}-${o.id}`} option={o} state={stateOf(o)} onChoose={choose} />
        ))}
      </View>
      {picked && (
        <Animated.View
          entering={enterUp(0)}
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Art
            name={picked === q.target.id ? 'mascot-cheer' : 'mascot-think'}
            fallback={picked === q.target.id ? '🎉' : '🤔'}
            size={72}
          />
          <AppText style={{ flexShrink: 1 }}>
            {picked === q.target.id ? 'Benar! Hebat!' : `Hampir! Jawabannya "${q.target.word}"`}
          </AppText>
        </Animated.View>
      )}
    </Screen>
  );
}
