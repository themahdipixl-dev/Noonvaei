// Cartoon bottom tab bar (shop | cards | home | upgrade | minigames).
// Brown wooden bar with a navy top line; the active tab is a raised yellow button.
// Bottom safe-area aware: content never sits on the very edge of the screen.
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { STRINGS } from '../config/strings';
import { TabIcon } from './Icons';
import { COLORS } from './theme';

// Visual order, left -> right (kept fixed regardless of text direction).
export const TAB_ORDER = ['shop', 'cards', 'home', 'upgrade', 'minigames'];

const BAR_CONTENT_H = 88;
const EXTRA_BOTTOM = 12;   // extra breathing room under the labels
const MIN_INSET = 8;       // used when the device reports no bottom inset (e.g. hidden Android nav bar)

export const getBottomPad = (insetBottom) => Math.max(insetBottom || 0, MIN_INSET) + EXTRA_BOTTOM;

// Other overlays (upgrade panel, map controls...) use this to stay above the bar.
export function useBottomBarHeight() {
  const insets = useSafeAreaInsets();
  return BAR_CONTENT_H + getBottomPad(insets.bottom);
}

const BAR_BG = '#8A4E27';
const BAR_HIGHLIGHT = '#A8642F';
const ACTIVE_BG = '#FFC93C';
const ACTIVE_TOP = '#FFE07A';
const ACTIVE_BOTTOM = '#D99A12';

export default function BottomBar({ active, onChange }) {
  const insets = useSafeAreaInsets();
  const padBottom = getBottomPad(insets.bottom);

  return (
    <View style={[styles.bar, { height: BAR_CONTENT_H + padBottom, paddingBottom: padBottom }]}>
      <View style={styles.highlight} />
      <View style={styles.row}>
        {TAB_ORDER.map((key) => {
          const on = key === active;
          return (
            <Pressable key={key} onPress={() => onChange(key)} style={styles.slot}>
              {({ pressed }) => (
                <View style={[styles.item, on && styles.itemOn, pressed && styles.itemPressed]}>
                  {on && <View style={styles.shine} />}
                  <TabIcon name={key} size={on ? 46 : 36} />
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
    backgroundColor: BAR_BG,
    borderTopWidth: 4, borderTopColor: COLORS.ink,
    elevation: 10,
  },
  highlight: { height: 3, backgroundColor: BAR_HIGHLIGHT },
  row: { flex: 1, flexDirection: 'row', direction: 'ltr', alignItems: 'center', paddingHorizontal: 4 },
  slot: { flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center' },
  item: { alignItems: 'center', justifyContent: 'center', paddingVertical: 4 },
  itemOn: {
    width: '112%', height: 78, borderRadius: 20, overflow: 'hidden',
    backgroundColor: ACTIVE_BG, borderWidth: 3, borderColor: COLORS.ink,
    borderBottomWidth: 6, borderBottomColor: COLORS.ink, elevation: 4,
  },
  shine: {
    position: 'absolute', top: 0, left: 0, right: 0, height: '45%',
    backgroundColor: ACTIVE_TOP, opacity: 0.55,
  },
  itemPressed: { transform: [{ scale: 0.94 }] },
  label: { fontSize: 12.5, fontWeight: 'bold', marginTop: 2 },
  labelOn: { color: COLORS.ink },
  labelOff: { color: '#FFFFFF' },
});
