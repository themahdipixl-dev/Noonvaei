import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { STRINGS } from '../config/strings';
import { formatNumber, formatRate, toFa } from './format';

export default function Hud({ money, income, level }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{STRINGS.money}</Text>
      <Text style={styles.money}>{formatNumber(money)} 🪙</Text>
      <View style={styles.row}>
        <Text style={styles.sub}>{STRINGS.perSec}: {formatRate(income)}</Text>
        <Text style={styles.sub}>{STRINGS.level}: {toFa(level)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 20, paddingVertical: 10, alignItems: 'center' },
  label: { fontSize: 13, color: '#8a5a2b' },
  money: { fontSize: 36, fontWeight: 'bold', color: '#5a2e0e' },
  row: { flexDirection: 'row', gap: 18, marginTop: 4 },
  sub: { fontSize: 13, color: '#6b3f1d' },
});
