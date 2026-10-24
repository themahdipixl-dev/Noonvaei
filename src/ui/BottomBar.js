// Cartoon bottom tab bar (shop | cards | home | upgrade | minigames).
// Dark chocolate bar, five sections split by full-height divider lines.
// The selected section gets a bigger icon and pushes the dividers apart.
// Bottom safe-area aware: content never sits on the very edge of the screen.
import React from 'react';
import { View, Text, Pressable, StyleSheet, LayoutAnimation } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { STRINGS } from '../config/strings';
import { TabIcon } from './Icons';

// Visual order, left -> right (kept fixed regardless of text direction).
export const TAB_ORDER = ['shop', 'cards', 'home', 'upgrade', 'minigames'];

const BAR_CONTENT_H = 62;
const EXTRA_BOTTOM = 4;    // extra breathing room under the labels
const MIN_INSET = 6;       // used when the device reports no bottom inset (e.g. hidden Android nav bar)

const ICON_BOX = 40;       // fixed icon area so labels never jump
const ICON_OFF = 28;
const ICON_ON = 40;

export const getBottomPad = (insetBottom) => Math.max(insetBottom || 0, MIN_INSET) + EXTRA_BOTTOM;

// Other overlays (upgrade panel, map controls...) use this to stay above the bar.
export function useBottomBarHeight() {
  const insets = useSafeAreaInsets();
  return BAR_CONTENT_H + getBottomPad(insets.bottom);
}

const BAR_BG = '#3A2214';
const LINE = '#1A0E07';
const HIGHLIGHT = '#5E3A20';
const LABEL = '#F6DCB4';

export default function BottomBar({ active, onChange }) {
  const insets = useSafeAreaInsets();
  const padBottom = getBottomPad(insets.bottom);

  const select = (key) => {
    if (key === active) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    onChange(key);
  };

  return (
    <View style={[styles.bar, { height: BAR_CONTENT_H + padBottom, paddingBottom: padBottom }]}>
      <View style={styles.highlight} />
      <View style={styles.row}>
        {TAB_ORDER.map((key, index) => {
          const on = key === active;
          return (
            <Pressable
              key={key}
              onPress={() => select(key)}
              style={[styles.slot, on && styles.slotOn, index > 0 && styles.divider]}
            >
              {({ pressed }) => (
                <>
                  {index > 0 && <View style={styles.dividerLight} />}
                  <View style={[styles.iconBox, pressed && styles.pressed]}>
                    <TabIcon name={key} size={on ? ICON_ON : ICON_OFF} />
                  </View>
                  <Text style={styles.label} numberOfLines={1}>
                    {STRINGS.tabs[key]}
                  </Text>
                </>
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
    borderTopWidth: 2, borderTopColor: LINE,
    elevation: 10,
  },
  highlight: { height: 2, backgroundColor: HIGHLIGHT },
  row: { flex: 1, flexDirection: 'row', direction: 'ltr', alignItems: 'stretch' },
  slot: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  slotOn: { flex: 1.7 },
  divider: { borderLeftWidth: 2, borderLeftColor: LINE },
  dividerLight: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 1, backgroundColor: HIGHLIGHT },
  iconBox: { height: ICON_BOX, alignItems: 'center', justifyContent: 'center' },
  pressed: { transform: [{ scale: 0.9 }] },
  label: { fontSize: 11.5, fontWeight: 'bold', color: LABEL, marginTop: 1 },
});
