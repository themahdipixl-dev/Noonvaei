import React, { useRef } from 'react';
import { Animated, Pressable, Text, StyleSheet } from 'react-native';
import { STRINGS } from '../config/strings';
import { formatNumber } from './format';

export default function UpgradeButton({ cost, canAfford, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const to = (v) => Animated.spring(scale, { toValue: v, useNativeDriver: true, speed: 40 }).start();

  return (
    <Animated.View style={[styles.wrap, { transform: [{ scale }] }]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => to(0.95)}
        onPressOut={() => to(1)}
        disabled={!canAfford}
        style={[styles.btn, !canAfford && styles.btnOff]}
      >
        <Text style={styles.title}>{STRINGS.upgrade}</Text>
        <Text style={styles.cost}>{STRINGS.cost}: {formatNumber(cost)} 🪙</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', bottom: 16, left: 24, right: 24 },
  btn: {
    backgroundColor: '#d9822b',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 5,
    borderBottomColor: '#9c5614',
    elevation: 4,
  },
  btnOff: { backgroundColor: '#b9a88f', borderBottomColor: '#8f806a' },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  cost: { color: '#fff4e0', fontSize: 13, marginTop: 2 },
});
