import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, View, StyleSheet } from 'react-native';
import { STRINGS } from '../config/strings';
import { formatNumber, toFa } from './format';

export default function UpgradeButton({ level, cost, canAfford, onPress }) {
  const press = useRef(new Animated.Value(1)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!canAfford) { pulse.setValue(1); return undefined; }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.04, duration: 600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [canAfford, pulse]);

  const to = (v) => Animated.spring(press, { toValue: v, useNativeDriver: true, speed: 40 }).start();

  return (
    <Animated.View style={[styles.wrap, { transform: [{ scale: Animated.multiply(press, pulse) }] }]}>
      <Pressable
        onPress={onPress} onPressIn={() => to(0.94)} onPressOut={() => to(1)} disabled={!canAfford}
        style={[styles.btn, !canAfford && styles.off]}
      >
        <View style={styles.shine} />
        <View style={styles.icon}><Text style={styles.iconText}>🔥</Text></View>
        <View style={styles.mid}>
          <Text style={styles.title}>{STRINGS.upgrade}</Text>
          <Text style={styles.sub}>{STRINGS.level} {toFa(level)} ← {toFa(level + 1)}</Text>
        </View>
        <View style={[styles.cost, !canAfford && styles.costOff]}>
          <Text style={styles.costText}>🪙 {formatNumber(cost)}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', bottom: 12, left: 16, right: 16 },
  btn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#e8892a', borderRadius: 22, overflow: 'hidden',
    borderWidth: 3, borderColor: '#fff0cc', borderBottomWidth: 7, borderBottomColor: '#a65a12',
    paddingVertical: 10, paddingHorizontal: 12, elevation: 6,
  },
  off: { backgroundColor: '#bfae92', borderBottomColor: '#8f806a' },
  shine: { position: 'absolute', top: 0, left: 0, right: 0, height: '45%', backgroundColor: 'rgba(255,255,255,0.2)' },
  icon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff3d1', alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 24 },
  mid: { flex: 1, marginHorizontal: 12 },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  sub: { color: '#ffeccb', fontSize: 12, marginTop: 1 },
  cost: { backgroundColor: '#7a3b0c', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 6 },
  costOff: { backgroundColor: '#6b5a44' },
  costText: { color: '#ffe9a8', fontWeight: 'bold', fontSize: 15 },
});
