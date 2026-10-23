// Cartoon vector icons for the bottom tab bar (react-native-svg, no image assets).
// Palette: wheat-yellow + turquoise accents, cream highlights, navy ink outline.
import React from 'react';
import Svg, { Path, Rect, Circle, Polygon, G, Ellipse } from 'react-native-svg';
import { COLORS } from './theme';

const { ink: INK, cream: CREAM, wheat: WHEAT, wheatDark: WHEAT_DK, teal: TEAL, tealDark: TEAL_DK } = COLORS;

// Shop: little market stall with a striped awning.
const Shop = () => {
  const colors = [WHEAT, TEAL, WHEAT, TEAL];
  return (
    <>
      <Rect x={12} y={28} width={40} height={29} rx={4} fill={CREAM} stroke={INK} strokeWidth={3} />
      <Rect x={15} y={36} width={8} height={9} rx={2} fill={WHEAT} stroke={INK} strokeWidth={2.5} />
      <Rect x={41} y={36} width={8} height={9} rx={2} fill={WHEAT} stroke={INK} strokeWidth={2.5} />
      <Rect x={26} y={38} width={12} height={19} rx={3} fill={TEAL} stroke={INK} strokeWidth={3} />
      {colors.map((c, i) => (
        <Circle key={`s${i}`} cx={14 + 12 * i} cy={26} r={6} fill={c} stroke={INK} strokeWidth={2.5} />
      ))}
      {colors.map((c, i) => (
        <Polygon
          key={`p${i}`}
          points={`${14 + 9 * i},9 ${23 + 9 * i},9 ${20 + 12 * i},26 ${8 + 12 * i},26`}
          fill={c} stroke={INK} strokeWidth={2.5} strokeLinejoin="round"
        />
      ))}
    </>
  );
};

// Cards: a turquoise back card + a cream front card carrying a wheat ear.
const Cards = () => {
  const grains = [
    [34.3, 27, -30], [41.7, 27, 30],
    [34.3, 34, -30], [41.7, 34, 30],
    [34.3, 41, -30], [41.7, 41, 30],
  ];
  return (
    <>
      <G rotation={-14} origin="28, 34">
        <Rect x={10} y={12} width={30} height={42} rx={6} fill={TEAL} stroke={INK} strokeWidth={3} />
        <Polygon points="25,26 31,34 25,42 19,34" fill={WHEAT} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
      </G>
      <G rotation={11} origin="38, 32">
        <Rect x={24} y={8} width={28} height={42} rx={6} fill={CREAM} stroke={INK} strokeWidth={3} />
        <Path d="M38 20 L38 46" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
        <Ellipse cx={38} cy={18} rx={3} ry={4.5} fill={WHEAT} stroke={INK} strokeWidth={2} />
        {grains.map(([cx, cy, rot]) => (
          <Ellipse
            key={`${cx}-${cy}`} cx={cx} cy={cy} rx={3.2} ry={5}
            rotation={rot} origin={`${cx}, ${cy}`}
            fill={WHEAT} stroke={INK} strokeWidth={2}
          />
        ))}
      </G>
    </>
  );
};

// Home: cozy cottage with turquoise roof and wheat door.
const Home = () => (
  <>
    <Rect x={41} y={13} width={8} height={17} rx={2} fill={WHEAT} stroke={INK} strokeWidth={2.5} />
    <Rect x={13} y={30} width={38} height={27} rx={5} fill={CREAM} stroke={INK} strokeWidth={3} />
    <Path d="M6 35 L32 11 L58 35" stroke={INK} strokeWidth={11} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M6 35 L32 11 L58 35" stroke={TEAL} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <Rect x={17} y={37} width={8} height={8} rx={2} fill={TEAL} stroke={INK} strokeWidth={2.5} />
    <Rect x={39} y={37} width={8} height={8} rx={2} fill={TEAL} stroke={INK} strokeWidth={2.5} />
    <Rect x={26} y={38} width={12} height={19} rx={3} fill={WHEAT} stroke={INK} strokeWidth={3} />
    <Circle cx={34.5} cy={48} r={1.6} fill={INK} />
  </>
);

// Upgrade: chunky wheat arrow on a turquoise base, with a sparkle.
const Upgrade = () => (
  <>
    <Polygon
      points="32,6 54,28 42,28 42,44 22,44 22,28 10,28"
      fill={WHEAT} stroke={INK} strokeWidth={3} strokeLinejoin="round"
    />
    <Path d="M18 27 L30 15" stroke={CREAM} strokeWidth={3} strokeLinecap="round" />
    <Rect x={14} y={49} width={36} height={9} rx={4.5} fill={TEAL} stroke={INK} strokeWidth={3} />
    <Polygon
      points="53,4 55,9 60,11 55,13 53,18 51,13 46,11 51,9"
      fill={TEAL} stroke={INK} strokeWidth={2} strokeLinejoin="round"
    />
  </>
);

// Minigames: a cartoon game controller.
const Minigames = () => (
  <>
    <Path
      d="M18 14 H46 C54 14 60 20 61 28 L62 42 C62.5 50 58 54 52 54 C47 54 45 50 42 46 H22 C19 50 17 54 12 54 C6 54 1.5 50 2 42 L3 28 C4 20 10 14 18 14 Z"
      fill={TEAL} stroke={INK} strokeWidth={3} strokeLinejoin="round"
    />
    <Path d="M14 22 H20 V28 H26 V34 H20 V40 H14 V34 H8 V28 H14 Z" fill={CREAM} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
    <Circle cx={45} cy={27} r={4.5} fill={WHEAT} stroke={INK} strokeWidth={2.5} />
    <Circle cx={53} cy={35} r={4.5} fill={WHEAT} stroke={INK} strokeWidth={2.5} />
    <Path d="M20 16 L36 16" stroke={CREAM} strokeWidth={2.5} strokeLinecap="round" opacity={0.7} />
  </>
);

const ICONS = { shop: Shop, cards: Cards, home: Home, upgrade: Upgrade, minigames: Minigames };

export function TabIcon({ name, size = 40 }) {
  const Icon = ICONS[name];
  if (!Icon) return null;
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Icon />
    </Svg>
  );
}
