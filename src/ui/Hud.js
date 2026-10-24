// Top HUD (cartoon style): level badge + flat progress bar, money, gems, rate tab under money,
// daily mission, season pass, settings (under season pass) and the "cities" button.
//
// Layout is placed with absolute coordinates taken from the design (780px wide) and scaled to the
// screen width, so proportions always match the design.
// Every button is: one outer stroke around [face + bottom lip]. The face has no stroke of its own,
// and the lip has exactly the same width as the face.
import React from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import { STRINGS } from '../config/strings';
import { formatGrouped, formatRate, toFa } from './format';
import { Icon } from './Icons';
import { FONTS } from './Fonts';

const DESIGN_W = 780;
const DESIGN_H = 352;
const MAX_SCALE = 0.7;
const SW = 3; // stroke width (design px) - lower it to get thinner outlines
const LIP = 8; // height of the 3D lip under the face (design px)

const INK = '#0E1740';
const NAVY = '#1F2E6C';
const NAVY_LIP = '#101A46';
const BLUE = '#4E76E7';
const BLUE_LIP = '#2A439B';
const RED = '#EF7358';
const RED_LIP = '#B7402E';
const GREEN = '#40BF65';
const GREEN_LIP = '#1F7A3A';
const MINT = '#7DFF9A';
const TRACK = '#16215A';
const FILL = '#5EE27A';

// The level bar looks like one smooth bar, but internally it is made of 10 hidden steps:
// each level inside the current "page" of 10 levels fills one tenth of the bar.
const LEVEL_STEPS = 10;
const TOP_H = 58; // height of the level / money / gems pills (design px)

// TODO: replace with real values once gems / missions / season pass exist in game state.
const PLACEHOLDER = { gems: 350, missionProgress: 0.4, seasonProgress: 0.25 };

// Button = outer container (stroke + lip colour) -> face. x/y/w/h describe the FACE in design px.
const Btn = ({
  s, x, y, w, h, r = 18, color, lipColor, lip = LIP, glow = 0.35, onPress, children,
}) => {
  const outer = {
    position: 'absolute',
    left: (x - SW) * s,
    top: (y - SW) * s,
    width: (w + SW * 2) * s,
    height: (h + lip + SW * 2) * s,
    borderWidth: SW * s,
    borderColor: INK,
    borderRadius: (r + SW) * s,
    backgroundColor: lipColor,
    overflow: 'hidden',
  };
  const face = (
    <View style={{ width: w * s, height: h * s, borderRadius: r * s, backgroundColor: color }}>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
          borderRadius: r * s, borderWidth: 0, borderTopWidth: 3 * s,
          borderColor: 'transparent', borderTopColor: `rgba(255,255,255,${glow})`,
        }}
      />
      {children}
    </View>
  );
  if (!onPress) return <View style={outer}>{face}</View>;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [outer, pressed && { transform: [{ translateY: 5 * s }] }]}
    >
      {face}
    </Pressable>
  );
};

// Each weight is its own font family, so there is no fontWeight here (it breaks on Android).
const T = ({ s, left, top, w, h, size, align = 'center', color = '#fff', children, ...rest }) => (
  <Text
    numberOfLines={1}
    {...rest}
    style={{
      position: 'absolute',
      left: left * s,
      top: top * s,
      width: w * s,
      height: h * s,
      lineHeight: h * s,
      fontSize: size * s,
      fontFamily: FONTS.bold,
      color,
      textAlign: align,
      textAlignVertical: 'center',
      includeFontPadding: false,
      writingDirection: align === 'right' ? 'rtl' : 'ltr',
      textShadowColor: 'rgba(10,20,60,0.35)',
      textShadowOffset: { width: 0, height: 3 * s },
      textShadowRadius: 0,
    }}
  >
    {children}
  </Text>
);

// Progress bar: fills from the left, like the design.
const Bar = ({ s, left, top, w, h = 24, value }) => (
  <View
    style={{
      position: 'absolute', left: left * s, top: top * s, width: w * s, height: h * s,
      borderRadius: (h / 2) * s, backgroundColor: TRACK, borderWidth: SW * s, borderColor: INK,
      overflow: 'hidden',
    }}
  >
    <View style={{ width: `${Math.round(Math.min(1, Math.max(0, value)) * 100)}%`, height: '100%', backgroundColor: FILL }} />
  </View>
);

// The "+" icon inside a currency pill.
const PlusBtn = ({ s, left, top = 5, size = 48, onPress }) => (
  <Pressable
    onPress={onPress}
    hitSlop={8 * s}
    style={({ pressed }) => [
      { position: 'absolute', left: left * s, top: top * s },
      pressed && { transform: [{ scale: 0.9 }] },
    ]}
  >
    <Icon name="plus" size={size * s} />
  </Pressable>
);

const abs = (s, left, top, size) => ({ position: 'absolute', left: left * s, top: top * s, width: size * s, height: size * s });

export default function Hud({
  money, income, level, gems = PLACEHOLDER.gems,
  onSettings, onAddMoney, onAddGems, onMission, onSeasonPass, onCities,
}) {
  const { width } = useWindowDimensions();
  const s = Math.min(width / DESIGN_W, MAX_SCALE);
  // Everything (levels, upgrades...) still works on the real level; only the visual bar is stepped.
  const filledSteps = ((Math.max(1, level) - 1) % LEVEL_STEPS) + 1;
  const levelProgress = filledSteps / LEVEL_STEPS;

  return (
    <View
      pointerEvents="box-none"
      style={{ width: DESIGN_W * s, height: DESIGN_H * s, alignSelf: 'center' }}
    >
      {/* Rate tab (sits behind the money pill, centered on the full screen width) */}
      <Btn s={s} x={311} y={60} w={158} h={62} r={18} color={NAVY} lipColor={NAVY_LIP} lip={6} glow={0}>
        <T s={s} left={0} top={12} w={158} h={40} size={23} color={MINT}>
          {formatRate(income)} {STRINGS.perSecShort}
        </T>
      </Btn>

      {/* Level: flat thick bar. Rectangle's left edge lines up with mission / cities (x=20).
          Star badge is drawn on top at the end. */}
      <Btn s={s} x={20} y={12} w={266} h={TOP_H} r={16} color={NAVY} lipColor={NAVY_LIP} glow={0.12}>
        <Bar s={s} left={82} top={12} w={168} h={34} value={levelProgress} />
      </Btn>

      {/* Money (longer, shifted right) */}
      <Btn s={s} x={300} y={12} w={236} h={TOP_H} r={16} color={NAVY} lipColor={NAVY_LIP} glow={0.12}>
        <Icon name="money" size={48 * s} style={abs(s, 7, 5, 48)} />
        <T s={s} left={42} top={12} w={135} h={34} size={25} adjustsFontSizeToFit>{formatGrouped(money)}</T>
        <PlusBtn s={s} left={186} onPress={onAddMoney} />
      </Btn>

      {/* Gems (longer, at the right edge) */}
      <Btn s={s} x={552} y={12} w={213} h={TOP_H} r={16} color={NAVY} lipColor={NAVY_LIP} glow={0.12}>
        <Icon name="diamond" size={48 * s} style={abs(s, 7, 5, 48)} />
        <T s={s} left={42} top={12} w={112} h={34} size={25} adjustsFontSizeToFit>{toFa(gems)}</T>
        <PlusBtn s={s} left={163} onPress={onAddGems} />
      </Btn>

      {/* Season pass (right) */}
      <Btn s={s} x={500} y={104} w={265} h={92} r={20} color={RED} lipColor={RED_LIP} onPress={onSeasonPass}>
        <Icon name="crown" size={70 * s} style={abs(s, 15, 10, 70)} />
        <T s={s} left={80} top={10} w={135} h={44} size={24} align="right">{STRINGS.seasonPass}</T>
        <Bar s={s} left={92} top={56} w={150} h={26} value={PLACEHOLDER.seasonProgress} />
      </Btn>

      {/* Settings (under the season pass, right-aligned with it) */}
      <Btn s={s} x={695} y={220} w={70} h={70} color={BLUE} lipColor={BLUE_LIP} onPress={onSettings}>
        <Icon name="gear" size={55 * s} style={abs(s, 7, 8, 55)} />
      </Btn>

      {/* Daily mission (left) */}
      <Btn s={s} x={20} y={104} w={265} h={92} r={20} color={BLUE} lipColor={BLUE_LIP} onPress={onMission}>
        <Icon name="clipboard" size={70 * s} style={abs(s, 15, 13, 70)} />
        <T s={s} left={82} top={10} w={155} h={44} size={24} align="right">{STRINGS.dailyMission}</T>
        <Bar s={s} left={92} top={56} w={150} h={26} value={PLACEHOLDER.missionProgress} />
      </Btn>

      {/* Cities */}
      <Btn s={s} x={20} y={220} w={120} h={114} r={20} color={GREEN} lipColor={GREEN_LIP} onPress={onCities}>
        <Icon name="buildings" size={90 * s} style={abs(s, 20, 8, 90)} />
        <T s={s} left={0} top={77} w={120} h={30} size={23}>{STRINGS.cities}</T>
      </Btn>

      {/* Level star badge, on top of the level rectangle */}
      <View pointerEvents="none" style={abs(s, 2, 2, 86)}>
        <Icon name="star" size={86 * s} />
        <Text
          style={{
            position: 'absolute', left: 0, top: 0, width: 76 * s, height: 76 * s, lineHeight: 76 * s,
            fontSize: 30 * s, fontFamily: FONTS.title, color: '#2B2000', textAlign: 'center',
            textAlignVertical: 'center', includeFontPadding: false,
          }}
        >
          {toFa(level)}
        </Text>
      </View>
    </View>
  );
}
