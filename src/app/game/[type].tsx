import { useLocalSearchParams } from 'expo-router';

import { MemoryGame } from '@/components/MemoryGame';
import { QuizGame } from '@/components/QuizGame';

export default function GameRoute() {
  const { type, category } = useLocalSearchParams<{ type: string; category?: string }>();
  const categoryId = category ?? 'all';

  if (type === 'memory') return <MemoryGame categoryId={categoryId} />;
  return <QuizGame mode={type === 'listen' ? 'listen' : 'match'} categoryId={categoryId} />;
}
