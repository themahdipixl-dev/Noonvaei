// Bottom tab bar: shop | cards | home | upgrade | minigames.
// The active tab is drawn as a raised yellow button (like "home" in the design).
import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { STRINGS } from '../config/strings';
import { TabIcon } from './TabIcons';

// Visual order, left -> right (kept fixed regardless of text direction).
export const TAB_ORDER = ['shop', 'cards', 'home', 'upgrade', 'minigames'];

const BAR_CONTENT_H = 86;
const BAR_PAD_BOTTOM = Platform.OS === 'ios' ? 18 : 0;
// Other overlays (upgrade panel, map controls...) use this to stay above the bar.
export const BOTTOM_BAR_HEIGHT = BAR_CONTENT_H + BAR_PAD_BOTTOM;

export default function BottomBar({ active, onChange }) {
  return (
    <View style={styles.bar}>
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
    backgroundColor: '#7a4a2b', borderTopWidth: 4, borderTopColor: '#1d2a4d',
  },
  row: { flex: 1, flexDirection: 'row', direction: 'ltr', alignItems: 'center', paddingHorizontal: 6 },
  slot: { flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center' },
  item: { alignItems: 'center', justifyContent: 'center', paddingVertical: 4 },
  itemOn: {
    width: '112%', height: 76, borderRadius: 22,
    backgroundColor: '#fcc72d', borderWidth: 3, borderColor: '#1d2a4d',
    borderBottomWidth: 6, elevation: 4,
  },
  itemPressed: { transform: [{ scale: 0.94 }] },
  label: { fontSize: 13, fontWeight: 'bold', marginTop: 2 },
  labelOn: { color: '#3b2208' },
  labelOff: {
    color: '#ffffff',
    textShadowColor: 'rgba(29,42,77,0.9)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2,
  },
});
