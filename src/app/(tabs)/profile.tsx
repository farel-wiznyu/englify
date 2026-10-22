import { router } from 'expo-router';
import { View } from 'react-native';

import { Avatar } from '@/components/Avatar';
import { AppText, Button, Card, Screen } from '@/components/ui';
import { useAppStore } from '@/store/useAppStore';

export default function Profile() {
  const child = useAppStore((s) => s.child);

  return (
    <Screen tone="blue">
      <AppText variant="title">Profilku</AppText>
      <Card tone="purple" style={{ alignItems: 'center', gap: 6 }}>
        <Avatar value={child?.avatar} size={130} />
        <AppText variant="title">{child?.nickname}</AppText>
        <AppText variant="caption">Usia {child?.ageGroup === '7_10' ? '7–10' : '4–6'} tahun</AppText>
      </Card>

      <View style={{ gap: 8, marginTop: 8 }}>
        <AppText variant="caption">Khusus orang tua/wali</AppText>
        <Button label="🔒 Area Orang Tua" kind="secondary" onPress={() => router.push('/parent-gate')} />
      </View>
    </Screen>
  );
}
