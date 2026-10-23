// Cartoon bottom tab bar: shop | cards | home | upgrade | minigames.
// Cream bar with chunky ink outline + wheat stripe; the active tab is a raised
// navy "button" with a wheat rim so the wheat/turquoise icons pop.
import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { STRINGS } from '../config/strings';
import { TabIcon } from './TabIcons';
import { COLORS } from './theme';

// Visual order, left -> right (kept fixed regardless of text direction).
export const TAB_ORDER = ['shop', 'cards', 'home', 'upgrade', 'minigames'];

const BAR_CONTENT_H = 90;
const BAR_PAD_BOTTOM = Platform.OS === 'ios' ? 18 : 0;
// Other overlays (upgrade panel, map controls...) use this to stay above the bar.
export const BOTTOM_BAR_HEIGHT = BAR_CONTENT_H + BAR_PAD_BOTTOM;

export default function BottomBar({ active, onChange }) {
  return (
    <View style={styles.bar}>
      <View style={styles.stripe} />
      <View style={styles.row}>
        {TAB_ORDER.map((key) => {
          const on = key === active;
          return (
            <Pressable key={key} onPress={() => onChange(key)} style={styles.slot}>
              {({ pressed }) => (
                <View style={[styles.item, on && styles.itemOn, pressed && styles.itemPressed]}>
                  <TabIcon name={key} size={on ? 46 : 40} />
                  <Text style={[styles.label, on ? styles.labelOn : styles.labelOff]} numberOfLines={1}>
                    {STRINGS.tabs[key]}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    height: BOTTOM_BAR_HEIGHT, paddingBottom: BAR_PAD_BOTTOM,
    backgroundColor: COLORS.cream,
    borderTopWidth: 4, borderLeftWidth: 4, borderRightWidth: 4, borderColor: COLORS.ink,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    elevation: 10,
  },
  stripe: {
    height: 8, backgroundColor: COLORS.wheat,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    borderBottomWidth: 3, borderBottomColor: COLORS.ink,
  },
  row: { flex: 1, flexDirection: 'row', direction: 'ltr', alignItems: 'center', paddingHorizontal: 4 },
  slot: { flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center' },
  item: { alignItems: 'center', justifyContent: 'center', paddingVertical: 4 },
  itemOn: {
    width: '112%', height: 74, borderRadius: 22,
    backgroundColor: COLORS.ink, borderWidth: 3, borderColor: COLORS.wheat,
    borderBottomWidth: 6, borderBottomColor: COLORS.wheatDark, elevation: 4,
  },
  itemPressed: { transform: [{ scale: 0.94 }] },
  label: { fontSize: 12.5, fontWeight: 'bold', marginTop: 2 },
  labelOn: { color: COLORS.wheat },
  labelOff: { color: COLORS.ink },
});
