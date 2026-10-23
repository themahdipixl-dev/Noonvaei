// Four upgrade cards (one per bakery section), shown above the bottom bar on the "upgrade" tab.
import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { STRINGS } from '../config/strings';
import { SECTION_KEYS } from '../config/balance';
import { formatNumber, toFa } from './format';

export default function UpgradePanel({ levels, costs, money, bottleneck, onUpgrade, bottom = 12 }) {
  return (
    <View style={[styles.wrap, { bottom }]} pointerEvents="box-none">
      {SECTION_KEYS.map((key) => {
        const meta = STRINGS.sections[key];
        const canAfford = money >= costs[key];
        const isBottleneck = key === bottleneck;
        return (
          <Pressable
            key={key}
            onPress={() => onUpgrade(key)}
            disabled={!canAfford}
            style={({ pressed }) => [
              styles.card,
              isBottleneck && styles.cardBottleneck,
              !canAfford && styles.cardOff,
              pressed && styles.cardPressed,
            ]}
          >
            {isBottleneck && <Text style={styles.warn}>⚠️</Text>}
            <Text style={styles.icon}>{meta.icon}</Text>
            <Text style={styles.name} numberOfLines={1}>{meta.name}</Text>
            <Text style={styles.level}>{STRINGS.sectionLevel} {toFa(levels[key])}</Text>
            <View style={[styles.cost, !canAfford && styles.costOff]}>
              <Text style={styles.costText} numberOfLines={1}>🪙 {formatNumber(costs[key])}</Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 8, right: 8, flexDirection: 'row' },
  card: {
    flex: 1, marginHorizontal: 3, alignItems: 'center', paddingVertical: 5, paddingHorizontal: 2,
    backgroundColor: '#e8892a', borderRadius: 16, borderWidth: 2, borderColor: '#fff0cc',
    borderBottomWidth: 5, borderBottomColor: '#a65a12', elevation: 5,
  },
  cardBottleneck: { borderColor: '#ff5a4d' },
  cardOff: { backgroundColor: '#bfae92', borderBottomColor: '#8f806a' },
  cardPressed: { transform: [{ scale: 0.95 }] },
  warn: { position: 'absolute', top: -9, right: -4, fontSize: 16 },
  icon: { fontSize: 20 },
  name: { color: '#fff', fontSize: 12, fontWeight: 'bold', marginTop: 1 },
  level: { color: '#ffeccb', fontSize: 11, marginBottom: 3 },
  cost: { backgroundColor: '#7a3b0c', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 3 },
  costOff: { backgroundColor: '#6b5a44' },
  costText: { color: '#ffe9a8', fontWeight: 'bold', fontSize: 12 },
});
