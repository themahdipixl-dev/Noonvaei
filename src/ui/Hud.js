// Top HUD (cartoon style): level badge + segmented bar, money, gems, settings,
// rate tab under money, daily mission, season pass and the "cities" button.
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

const DESIGN_W = 780;
const DESIGN_H = 400;
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
const SEG_OFF = '#34457F';
const SEG_OFF_EDGE = '#1A2660';
const SEG_ON = '#50D36F';
const SEG_ON_EDGE = '#23863E';
const SEGMENTS = 5;

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
      fontWeight: '900',
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
const Bar = ({ s, left, top, w, value }) => (
  <View
    style={{
      position: 'absolute', left: left * s, top: top * s, width: w * s, height: 14 * s,
      borderRadius: 8 * s, backgroundColor: TRACK, borderWidth: SW * s, borderColor: INK,
      overflow: 'hidden',
    }}
  >
    <View style={{ width: `${Math.round(Math.min(1, Math.max(0, value)) * 100)}%`, height: '100%', backgroundColor: FILL }} />
  </View>
);

// The "+" icon inside a currency pill.
const PlusBtn = ({ s, left, onPress }) => (
  <Pressable
    onPress={onPress}
    hitSlop={8 * s}
    style={({ pressed }) => [
      { position: 'absolute', left: left * s, top: 8 * s },
      pressed && { transform: [{ scale: 0.9 }] },
    ]}
  >
    <Icon name="plus" size={55 * s} />
  </Pressable>
);

const abs = (s, left, top, size) => ({ position: 'absolute', left: left * s, top: top * s, width: size * s, height: size * s });

export default function Hud({
  money, income, level, gems = PLACEHOLDER.gems,
  onSettings, onAddMoney, onAddGems, onMission, onSeasonPass, onCities,
}) {
  const { width } = useWindowDimensions();
  const s = Math.min(width / DESIGN_W, MAX_SCALE);
  const filled = ((Math.max(1, level) - 1) % SEGMENTS) + 1;

  return (
    <View
      pointerEvents="box-none"
      style={{ width: DESIGN_W * s, height: DESIGN_H * s, alignSelf: 'center' }}
    >
      {/* Rate tab (sits behind the money pill) */}
      <Btn s={s} x={315} y={88} w={158} h={62} r={18} color={NAVY} lipColor={NAVY_LIP} lip={6} glow={0}>
        <T s={s} left={0} top={12} w={158} h={40} size={23} color={MINT}>
          {formatRate(income)} {STRINGS.perSecShort}
        </T>
      </Btn>

      {/* Level: segmented bar (star badge is drawn on top at the end) */}
      <Btn s={s} x={45} y={28} w={233} h={70} color={NAVY} lipColor={NAVY_LIP} glow={0.12}>
        {Array.from({ length: SEGMENTS }).map((_, i) => {
          const on = i < filled;
          return (
            <View
              key={i}
              style={{
                position: 'absolute', left: (67 + i * 31) * s, top: 19 * s, width: 26 * s, height: 32 * s,
                borderRadius: 6 * s, borderWidth: 2 * s,
                backgroundColor: on ? SEG_ON : SEG_OFF, borderColor: on ? SEG_ON_EDGE : SEG_OFF_EDGE,
              }}
            />
          );
        })}
      </Btn>

      {/* Settings */}
      <Btn s={s} x={695} y={28} w={70} h={70} color={BLUE} lipColor={BLUE_LIP} onPress={onSettings}>
        <Icon name="gear" size={55 * s} style={abs(s, 7, 8, 55)} />
      </Btn>

      {/* Gems */}
      <Btn s={s} x={510} y={28} w={172} h={70} color={NAVY} lipColor={NAVY_LIP} glow={0.12}>
        <Icon name="diamond" size={55 * s} style={abs(s, 7, 8, 55)} />
        <T s={s} left={42} top={12} w={100} h={40} size={27} adjustsFontSizeToFit>{toFa(gems)}</T>
        <PlusBtn s={s} left={121} onPress={onAddGems} />
      </Btn>

      {/* Money */}
      <Btn s={s} x={290} y={28} w={208} h={70} color={NAVY} lipColor={NAVY_LIP} glow={0.12}>
        <Icon name="money" size={55 * s} style={abs(s, 7, 8, 55)} />
        <T s={s} left={42} top={12} w={130} h={40} size={27} adjustsFontSizeToFit>{formatGrouped(money)}</T>
        <PlusBtn s={s} left={156} onPress={onAddMoney} />
      </Btn>

      {/* Season pass (right) */}
      <Btn s={s} x={490} y={152} w={275} h={92} r={20} color={RED} lipColor={RED_LIP} onPress={onSeasonPass}>
        <Icon name="crown" size={70 * s} style={abs(s, 15, 10, 70)} />
        <T s={s} left={80} top={12} w={135} h={44} size={24} align="right">{STRINGS.seasonPass}</T>
        <Bar s={s} left={87} top={60} w={171} value={PLACEHOLDER.seasonProgress} />
      </Btn>

      {/* Daily mission (left) */}
      <Btn s={s} x={20} y={152} w={275} h={92} r={20} color={BLUE} lipColor={BLUE_LIP} onPress={onMission}>
        <Icon name="clipboard" size={70 * s} style={abs(s, 15, 13, 70)} />
        <T s={s} left={82} top={12} w={155} h={44} size={24} align="right">{STRINGS.dailyMission}</T>
        <Bar s={s} left={87} top={60} w={171} value={PLACEHOLDER.missionProgress} />
      </Btn>

      {/* Cities */}
      <Btn s={s} x={20} y={268} w={120} h={114} r={20} color={GREEN} lipColor={GREEN_LIP} onPress={onCities}>
        <Icon name="buildings" size={90 * s} style={abs(s, 20, 8, 90)} />
        <T s={s} left={0} top={77} w={120} h={30} size={23}>{STRINGS.cities}</T>
      </Btn>

      {/* Level star badge, on top of everything */}
      <View pointerEvents="none" style={abs(s, 16, 20, 100)}>
        <Icon name="star" size={100 * s} />
        <Text
          style={{
            position: 'absolute', left: 0, top: 0, width: 88 * s, height: 88 * s, lineHeight: 88 * s,
            fontSize: 34 * s, fontWeight: '900', color: '#2B2000', textAlign: 'center',
            textAlignVertical: 'center', includeFontPadding: false,
          }}
        >
          {toFa(level)}
        </Text>
      </View>
    </View>
  );
}
