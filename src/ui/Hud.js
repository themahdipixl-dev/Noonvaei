import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { STRINGS } from '../config/strings';
import { formatNumber, formatRate, toFa } from './format';

const Chip = ({ children, warn }) => (
  <View style={[styles.chip, warn && styles.chipWarn]}><Text style={styles.chipText}>{children}</Text></View>
);

// bottleneck: key of the weakest section (vitrin / pishkhan / tanoor)
export default function Hud({ money, income, level, bottleneck }) {
  const weak = STRINGS.sections[bottleneck];
  return (
    <View style={styles.wrap}>
      <View style={styles.sign}>
        <Text style={styles.signText}>🍞  {STRINGS.title}  🍞</Text>
      </View>
      <View style={styles.pill}>
        <Text style={styles.coin}>🪙</Text>
        <Text style={styles.money}>{formatNumber(money)}</Text>
      </View>
      <View style={styles.row}>
        <Chip>⚡ {formatRate(income)} / ثانیه</Chip>
        <Chip>🏠 {STRINGS.level} {toFa(level)}</Chip>
        {weak && <Chip warn>⚠️ {STRINGS.bottleneck}: {weak.name}</Chip>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingTop: 10 },
  sign: {
    backgroundColor: '#1d8b8b', borderColor: '#f7e7c3', borderWidth: 3, borderRadius: 16,
    borderBottomWidth: 6, borderBottomColor: '#14605f', paddingHorizontal: 26, paddingVertical: 6, elevation: 4,
  },
  signText: { color: '#fff7dd', fontSize: 20, fontWeight: 'bold' },
  pill: {
    flexDirection: 'row', alignItems: 'center', marginTop: 12, backgroundColor: '#fff3d1',
    borderColor: '#e0a02a', borderWidth: 3, borderBottomWidth: 6, borderBottomColor: '#b57a14',
    borderRadius: 34, paddingHorizontal: 22, paddingVertical: 4, elevation: 3,
  },
  coin: { fontSize: 28, marginRight: 8 },
  money: { fontSize: 34, fontWeight: 'bold', color: '#7a3b0c' },
  row: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 10 },
  chip: { backgroundColor: 'rgba(255,255,255,0.65)', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 5, margin: 3 },
  chipWarn: { backgroundColor: 'rgba(255,214,204,0.85)' },
  chipText: { fontSize: 13, color: '#6b3f1d', fontWeight: '600' },
});
