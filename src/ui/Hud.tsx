import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UPGRADES } from '../game/config';
import { incomePerSecond } from '../game/engine';
import { formatNumber } from '../game/format';
import { useGame } from '../game/useGame';
import { UpgradeButton } from './UpgradeButton';

export function Hud() {
  const insets = useSafeAreaInsets();
  const coins = useGame((s) => s.game.coins);
  const ips = useGame((s) => incomePerSecond(s.game));

  return (
    <View
      style={[styles.root, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12 }]}
      pointerEvents="box-none" // let touches pass through to the 3D canvas
    >
      <View style={styles.topBar}>
        <Text style={styles.coins}>{formatNumber(coins)} تومان</Text>
        <Text style={styles.ips}>{formatNumber(ips)} تومان در ثانیه</Text>
      </View>

      <View style={styles.bottomBar}>
        {UPGRADES.map((def) => (
          <UpgradeButton key={def.id} def={def} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between', paddingHorizontal: 16 },
  topBar: {
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,248,235,0.92)',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  coins: { fontSize: 28, fontWeight: '800', color: '#5b3210' },
  ips: { fontSize: 14, color: '#8a4b14', marginTop: 2 },
  bottomBar: { gap: 10 },
});
