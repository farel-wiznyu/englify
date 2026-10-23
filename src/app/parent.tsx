import { router } from 'expo-router';
import { Alert, Pressable, View } from 'react-native';

import { AppText, Button, Card, Screen } from '@/components/ui';
import { Colors, Outline, Radius } from '@/constants/theme';
import { categories, getItem } from '@/data/content';
import type { ChildProfile } from '@/data/types';
import { useStats } from '@/hooks/useStats';
import { UpdateInfo } from '@/components/UpdateInfo';
import { deleteAllRemoteData, flushNow, resetAllRemoteProgress } from '@/hooks/useSync';
import { useAppAuth } from '@/lib/auth';
import { useAppStore } from '@/store/useAppStore';
import { useSyncStatus, type SyncState } from '@/store/useSyncStatus';

const goals: ChildProfile['dailyGoalMinutes'][] = [5, 10, 15];

const syncLabel: Record<SyncState, string> = {
  off: 'Sinkronisasi nonaktif',
  idle: 'Menunggu sinkronisasi',
  syncing: 'Menyinkronkan...',
  synced: '✓ Tersinkron ke server',
  error: 'Sinkronisasi gagal, akan dicoba lagi',
};

export default function ParentArea() {
  const child = useAppStore((s) => s.child);
  const games = useAppStore((s) => s.games);
  const updateGoal = useAppStore((s) => s.updateGoal);
  const resetChildData = useAppStore((s) => s.resetChildData);
  const setChild = useAppStore((s) => s.setChild);
  const stats = useStats();
  const clearAll = useAppStore((s) => s.clearAll);
  const sync = useSyncStatus();
  const { devMode, signOut, deleteClerkUser } = useAppAuth();

  const strongest = [...stats.perCategory.entries()].sort((a, b) => b[1].mastered - a[1].mastered)[0];
  const strongestCat = strongest && strongest[1].mastered > 0 ? categories.find((c) => c.id === strongest[0]) : null;

  return (
    <Screen>
      <Button label="← Tutup" kind="secondary" onPress={() => router.back()} style={{ alignSelf: 'flex-start', minHeight: 48 }} />
      <AppText variant="title">Area Orang Tua</AppText>
      <AppText variant="caption">Ringkasan belajar {child?.nickname}</AppText>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        <Card tone="blue" style={{ flexBasis: '47%', flexGrow: 1 }}>
          <AppText variant="title">{stats.learned}</AppText>
          <AppText variant="caption">kata dipelajari</AppText>
        </Card>
        <Card tone="yellow" style={{ flexBasis: '47%', flexGrow: 1 }}>
          <AppText variant="title">{stats.mastered}</AppText>
          <AppText variant="caption">kata dikuasai</AppText>
        </Card>
        <Card tone="purple" style={{ flexBasis: '47%', flexGrow: 1 }}>
          <AppText variant="title">{stats.lessonsDone}/{stats.lessonsTotal}</AppText>
          <AppText variant="caption">lesson selesai</AppText>
        </Card>
        <Card tone="pink" style={{ flexBasis: '47%', flexGrow: 1 }}>
          <AppText variant="title">{stats.todayMinutes} mnt</AppText>
          <AppText variant="caption">belajar hari ini</AppText>
        </Card>
      </View>

      <Card tone="white" style={{ gap: 8 }}>
        <AppText variant="heading">Perlu dilatih lagi</AppText>
        {stats.needsReview.length === 0 ? (
          <AppText variant="caption">Belum ada kata yang perlu diulang.</AppText>
        ) : (
          <AppText>{stats.needsReview.map((id) => getItem(id)?.word).filter(Boolean).join(', ')}</AppText>
        )}
        {strongestCat && (
          <AppText variant="caption">Tema terkuat: {strongestCat.emoji} {strongestCat.name}</AppText>
        )}
      </Card>

      <Card tone="white" style={{ gap: 8 }}>
        <AppText variant="heading">Riwayat game</AppText>
        {games.length === 0 ? (
          <AppText variant="caption">Belum ada game yang dimainkan.</AppText>
        ) : (
          games.slice(0, 5).map((g) => (
            <AppText key={g.id} variant="caption">
              {new Date(g.completedAt).toLocaleDateString('id-ID')} · {g.gameType} · skor {g.score}/{g.total} · {'⭐'.repeat(g.stars)}
            </AppText>
          ))
        )}
      </Card>

      <Card tone="white" style={{ gap: 12 }}>
        <AppText variant="heading">Target harian</AppText>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {goals.map((g) => (
            <Pressable
              key={g}
              accessibilityRole="radio"
              accessibilityState={{ selected: child?.dailyGoalMinutes === g }}
              onPress={() => updateGoal(g)}
              style={{
                ...Outline,
                flex: 1,
                minHeight: 52,
                borderRadius: Radius.md,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: child?.dailyGoalMinutes === g ? Colors.yellow : Colors.white,
              }}>
              <AppText variant="label">{g} mnt</AppText>
            </Pressable>
          ))}
        </View>
      </Card>

      <View style={{ gap: 12 }}>
        <Button
          label="Ubah profil anak"
          kind="secondary"
          onPress={() => {
            setChild(null);
            router.replace('/');
          }}
        />
        <Button
          label="Hapus progres belajar"
          kind="secondary"
          onPress={() =>
            Alert.alert('Hapus progres?', 'Semua progres belajar anak di perangkat ini akan dihapus.', [
              { text: 'Batal', style: 'cancel' },
              {
                text: 'Hapus',
                style: 'destructive',
                onPress: async () => {
                  try {
                    await resetAllRemoteProgress();
                  } catch {
                    Alert.alert('Belum tersinkron', 'Progres di server belum terhapus. Periksa koneksi lalu coba lagi.');
                    return;
                  }
                  resetChildData();
                },
              },
            ])
          }
        />
        {!devMode && (
          <>
            <Button
              label="Keluar akun"
              onPress={async () => {
                await flushNow();
                await signOut();
                clearAll();
                router.replace('/');
              }}
            />
            <Button
              label="Hapus akun & semua data"
              kind="secondary"
              onPress={() =>
                Alert.alert(
                  'Hapus akun?',
                  'Akun, profil anak, dan seluruh progres akan dihapus permanen dan tidak bisa dikembalikan.',
                  [
                    { text: 'Batal', style: 'cancel' },
                    {
                      text: 'Hapus permanen',
                      style: 'destructive',
                      onPress: async () => {
                        try {
                          await deleteAllRemoteData();
                          await deleteClerkUser();
                        } catch {
                          Alert.alert('Gagal menghapus', 'Periksa koneksi lalu coba lagi.');
                          return;
                        }
                        clearAll();
                        router.replace('/');
                      },
                    },
                  ],
                )
              }
            />
            <AppText variant="caption" center color={sync.state === 'error' ? Colors.danger : Colors.inkSoft}>
              {syncLabel[sync.state]}
              {sync.state === 'error' && sync.message ? ` (${sync.message})` : ''}
            </AppText>
          </>
        )}
      </View>

      <UpdateInfo />
      <AppText variant="caption" center>
        Privacy Policy · Terms (tautan akan ditambahkan sebelum rilis)
      </AppText>
    </Screen>
  );
}
