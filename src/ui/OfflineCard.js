import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { STRINGS } from '../config/strings';
import { formatNumber, toFa } from './format';
import { FONTS } from './Fonts';

function formatDuration(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return h > 0
    ? `${toFa(h)} ${STRINGS.hours} و ${toFa(m)} ${STRINGS.minutes}`
    : `${toFa(Math.max(1, m))} ${STRINGS.minutes}`;
}

export default function OfflineCard({ report, onClose }) {
  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={styles.title}>{STRINGS.welcomeBack}</Text>
        <Text style={styles.text}>{STRINGS.offlineEarned}</Text>
        <Text style={styles.amount}>{formatNumber(report.amount)} 🪙</Text>
        <Text style={styles.text}>{STRINGS.away}: {formatDuration(report.seconds)}</Text>
        <Pressable style={styles.btn} onPress={onClose}>
          <Text style={styles.btnText}>{STRINGS.ok}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  card: { backgroundColor: '#fff8e8', borderRadius: 20, padding: 22, alignItems: 'center', width: '100%' },
  title: { fontFamily: FONTS.title, fontSize: 24, color: '#5a2e0e', marginBottom: 8 },
  text: { fontFamily: FONTS.regular, fontSize: 14, color: '#6b3f1d', textAlign: 'center' },
  amount: { fontFamily: FONTS.title, fontSize: 34, color: '#c26a10', marginVertical: 8 },
  btn: { marginTop: 14, backgroundColor: '#d9822b', borderRadius: 12, paddingHorizontal: 36, paddingVertical: 10 },
  btnText: { fontFamily: FONTS.bold, color: '#fff', fontSize: 16 },
});
