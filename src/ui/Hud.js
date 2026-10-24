// Top HUD (cartoon style): level badge + segmented bar, money, gems, settings,
// rate tab under money, daily mission, season pass and the "cities" button.
// All rows are forced LTR so the layout matches the design regardless of text direction.
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { STRINGS } from '../config/strings';
import { formatGrouped, formatRate, toFa } from './format';
import { Icon } from './Icons';

const NAVY = '#1B2A5C';
const NAVY_DARK = '#0F1A3F';
const BLUE = '#4067E8';
const BLUE_DARK = '#2646AE';
const RED = '#EF5D47';
const RED_DARK = '#B93A28';
const GREEN = '#3DBE5F';
const GREEN_DARK = '#228A40';
const GREEN_TEXT = '#8CF29A';
const SEGMENTS = 5;

// TODO: replace with real values once gems / missions / season pass exist in game state.
const PLACEHOLDER = { gems: 350, missionProgress: 0.35, seasonProgress: 0.2 };

const Press = ({ onPress, style, children }) => (
  <Pressable onPress={onPress} style={({ pressed }) => [style, pressed && styles.pressed]}>
    {children}
  </Pressable>
);

const Bar = ({ value }) => (
  <View style={styles.track}>
    <View style={[styles.fill, { width: `${Math.round(value * 100)}%` }]} />
  </View>
);

// Currency pill: [icon]  amount  [+]
const CurrencyPill = ({ icon, text, onPlus, style }) => (
  <View style={[styles.panel, styles.currency, style]}>
    <Icon name={icon} size={30} />
    <Text style={styles.currencyText} numberOfLines={1} adjustsFontSizeToFit>{text}</Text>
    <Press onPress={onPlus}>
      <Icon name="plus" size={28} />
    </Press>
  </View>
);

export default function Hud({
  money, income, level, gems = PLACEHOLDER.gems,
  onSettings, onAddMoney, onAddGems, onMission, onSeasonPass, onCities,
}) {
  const filled = ((Math.max(1, level) - 1) % SEGMENTS) + 1;

  return (
    <View style={styles.wrap} pointerEvents="box-none">
      {/* Row 1 */}
      <View style={styles.row} pointerEvents="box-none">
        {/* Level badge + segmented bar */}
        <View style={styles.levelBox}>
          <View style={[styles.panel, styles.segments]}>
            {Array.from({ length: SEGMENTS }).map((_, i) => (
              <View key={i} style={[styles.seg, i < filled && styles.segOn]} />
            ))}
          </View>
          <View style={styles.starWrap}>
            <Icon name="star" size={52} />
            <Text style={styles.starText}>{toFa(level)}</Text>
          </View>
        </View>

        {/* Money + rate tab */}
        <View style={styles.moneyBox}>
          <CurrencyPill icon="money" text={formatGrouped(money)} onPlus={onAddMoney} />
          <View style={styles.rateTab} pointerEvents="none">
            <Text style={styles.rateText}>{formatRate(income)} {STRINGS.perSecShort}</Text>
          </View>
        </View>

        {/* Gems */}
        <CurrencyPill icon="diamond" text={toFa(gems)} onPlus={onAddGems} style={styles.gems} />

        {/* Settings */}
        <Press onPress={onSettings} style={[styles.panel, styles.settings]}>
          <Icon name="gear" size={26} />
        </Press>
      </View>

      {/* Row 2: daily mission (left) / season pass (right) */}
      <View style={[styles.row, styles.row2]} pointerEvents="box-none">
        <Press onPress={onMission} style={[styles.bigBtn, styles.blue]}>
          <Icon name="clipboard" size={32} />
          <View style={styles.bigBtnBody}>
            <Text style={styles.bigBtnText} numberOfLines={1}>{STRINGS.dailyMission}</Text>
            <Bar value={PLACEHOLDER.missionProgress} />
          </View>
        </Press>
        <Press onPress={onSeasonPass} style={[styles.bigBtn, styles.red]}>
          <Icon name="crown" size={32} />
          <View style={styles.bigBtnBody}>
            <Text style={styles.bigBtnText} numberOfLines={1}>{STRINGS.seasonPass}</Text>
            <Bar value={PLACEHOLDER.seasonProgress} />
          </View>
        </Press>
      </View>

      {/* Row 3: cities */}
      <View style={[styles.row, styles.row3]} pointerEvents="box-none">
        <Press onPress={onCities} style={styles.cities}>
          <Icon name="buildings" size={38} />
          <Text style={styles.citiesText}>{STRINGS.cities}</Text>
        </Press>
      </View>
    </View>
  );
}

const panelBase = {
  backgroundColor: NAVY,
  borderRadius: 14,
  borderBottomWidth: 4,
  borderBottomColor: NAVY_DARK,
  elevation: 4,
};

const styles = StyleSheet.create({
  wrap: { paddingTop: 12, paddingHorizontal: 10 },
  row: { flexDirection: 'row', direction: 'ltr', alignItems: 'center' },
  row2: { marginTop: 28, justifyContent: 'space-between' },
  row3: { marginTop: 10 },
  pressed: { transform: [{ scale: 0.95 }] },
  panel: panelBase,

  // Level
  levelBox: { flex: 1.15, height: 46, justifyContent: 'center' },
  segments: {
    height: 40, marginLeft: 22, paddingLeft: 34, paddingRight: 8,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  seg: { width: 22, height: 26, borderRadius: 6, backgroundColor: '#2D3E78' },
  segOn: { backgroundColor: '#4CD964' },
  starWrap: { position: 'absolute', left: 0, top: -3, width: 52, height: 52, alignItems: 'center', justifyContent: 'center' },
  starText: { position: 'absolute', fontSize: 20, fontWeight: '900', color: NAVY },

  // Currencies
  moneyBox: { flex: 1.35, marginLeft: 6 },
  gems: { flex: 1.05, marginLeft: 6 },
  currency: {
    flexDirection: 'row', alignItems: 'center', height: 46, paddingHorizontal: 8,
  },
  currencyText: { flex: 1, color: '#fff', fontSize: 18, fontWeight: '900', textAlign: 'center', marginHorizontal: 4 },
  rateTab: {
    position: 'absolute', top: 44, alignSelf: 'center',
    backgroundColor: NAVY, borderBottomLeftRadius: 12, borderBottomRightRadius: 12,
    paddingHorizontal: 14, paddingVertical: 3, borderBottomWidth: 3, borderBottomColor: NAVY_DARK,
  },
  rateText: { color: GREEN_TEXT, fontSize: 13, fontWeight: '800' },

  // Settings
  settings: { width: 40, height: 46, marginLeft: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: BLUE, borderBottomColor: BLUE_DARK },

  // Big buttons
  bigBtn: {
    width: '47.5%', height: 50, borderRadius: 16, borderBottomWidth: 5, flexDirection: 'row', direction: 'ltr',
    alignItems: 'center', paddingHorizontal: 10, elevation: 4,
  },
  blue: { backgroundColor: BLUE, borderBottomColor: BLUE_DARK },
  red: { backgroundColor: RED, borderBottomColor: RED_DARK },
  bigBtnBody: { flex: 1, marginLeft: 8 },
  bigBtnText: { color: '#fff', fontSize: 14, fontWeight: '900', textAlign: 'right', writingDirection: 'rtl', marginBottom: 3 },
  track: { height: 9, borderRadius: 5, backgroundColor: NAVY, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 5, backgroundColor: '#4CD964' },

  // Cities
  cities: {
    width: 60, height: 60, borderRadius: 16, borderBottomWidth: 5, backgroundColor: GREEN, borderBottomColor: GREEN_DARK,
    alignItems: 'center', justifyContent: 'center', elevation: 4,
  },
  citiesText: { color: '#fff', fontSize: 11, fontWeight: '900', marginTop: 1 },
});
