// Small placeholder card for tabs that are not built yet (shop / cards / minigames).
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { STRINGS } from '../config/strings';
import { FONTS } from './Fonts';

export default function ComingSoon({ title, bottom }) {
  return (
    <View style={[styles.wrap, { bottom }]} pointerEvents="none">
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>{STRINGS.comingSoon}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  card: {
    backgroundColor: '#fff3d1', borderColor: '#1d2a4d', borderWidth: 3, borderBottomWidth: 6,
    borderRadius: 20, paddingHorizontal: 28, paddingVertical: 10, alignItems: 'center', elevation: 4,
  },
  title: { fontFamily: FONTS.title, fontSize: 20, color: '#7a3b0c' },
  sub: { fontFamily: FONTS.regular, fontSize: 13, color: '#6b3f1d', marginTop: 2 },
});
