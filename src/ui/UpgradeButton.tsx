import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { UpgradeDef } from '../game/config';
import { upgradeCost } from '../game/engine';
import { formatNumber } from '../game/format';
import { gameActions } from '../game/store';
import { useGame } from '../game/useGame';

export function UpgradeButton({ def }: { def: UpgradeDef }) {
  const level = useGame((s) => s.game.levels[def.id]);
  const affordable = useGame((s) => s.game.coins >= upgradeCost(def.id, s.game.levels[def.id]));
  const cost = upgradeCost(def.id, level);

  return (
    <Pressable
      onPress={() => gameActions.buyUpgrade(def.id)}
      style={({ pressed }) => [styles.btn, !affordable && styles.disabled, pressed && styles.pressed]}
    >
      <View style={styles.info}>
        <Text style={styles.title}>
          ارتقای {def.name} (سطح {level})
        </Text>
        <Text style={styles.desc}>
          {def.description} · +{def.incomePerLevel} در ثانیه
        </Text>
      </View>
      <Text style={styles.cost}>{formatNumber(cost)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e07b1f',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  disabled: { backgroundColor: '#b9a48a' },
  pressed: { transform: [{ scale: 0.98 }] },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: '700', color: '#fff' },
  desc: { fontSize: 12, color: '#fff3e0', marginTop: 2 },
  cost: { fontSize: 18, fontWeight: '800', color: '#fff', marginStart: 12 },
});
