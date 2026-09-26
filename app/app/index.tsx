import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { color, space, radius, touch, type as t } from '../src/ui/tokens';

export default function Home() {
  const router = useRouter();
  return (
    <View style={s.root}>
      <Text style={s.h1}>GatheringMIA</Text>
      <Text style={s.sub}>Little Havana demo route, 12 stops</Text>
      <Pressable style={s.go} onPress={() => router.push('/(driver)/stop-demo')}>
        <Text style={s.goText}>Start route</Text>
      </Pressable>
    </View>
  );
}
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg, padding: space.xl, justifyContent: 'center' },
  h1: { fontSize: 34, fontWeight: t.weightBold, color: color.text },
  sub: { fontSize: t.body, color: color.textMuted, marginTop: space.sm, marginBottom: space.xl },
  go: { height: touch.primaryHeight, borderRadius: radius.lg, backgroundColor: color.primary,
        alignItems: 'center', justifyContent: 'center' },
  goText: { fontSize: 24, fontWeight: t.weightBold, color: color.textInverse },
});
