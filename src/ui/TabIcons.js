// Vector icons for the bottom tab bar (drawn with react-native-svg, no image assets needed).
import React from 'react';
import Svg, { Path, Rect, Circle, Polygon, G } from 'react-native-svg';

const INK = '#1d2a4d'; // dark navy outline used across the whole UI

const star = (cx, cy, ro, ri) =>
  Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 === 0 ? ro : ri;
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
  }).join(' ');

const Shop = () => (
  <>
    <Path d="M23 24 C23 10 41 10 41 24" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
    <Rect x={10} y={22} width={44} height={34} rx={8} fill="#F2474C" stroke={INK} strokeWidth={3} />
    <Polygon points={star(32, 39, 10, 4.5)} fill="#FFD43B" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
  </>
);

const Cards = () => (
  <>
    <G rotation={-16} origin="28, 34">
      <Rect x={12} y={12} width={30} height={42} rx={6} fill="#3B6FE0" stroke={INK} strokeWidth={3} />
    </G>
    <G rotation={12} origin="38, 32">
      <Rect x={24} y={10} width={28} height={40} rx={6} fill="#FFFDF5" stroke={INK} strokeWidth={3} />
      <Polygon points={star(38, 30, 9, 4)} fill="#FFD43B" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
    </G>
  </>
);

const Home = () => (
  <>
    <Rect x={13} y={30} width={38} height={27} rx={5} fill="#FFFDF5" stroke={INK} strokeWidth={3} />
    <Path d="M6 35 L32 11 L58 35" stroke={INK} strokeWidth={11} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M6 35 L32 11 L58 35" stroke="#F2474C" strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <Rect x={17} y={37} width={8} height={9} rx={2} fill={INK} />
    <Rect x={39} y={37} width={8} height={9} rx={2} fill={INK} />
    <Rect x={26} y={38} width={12} height={19} rx={3} fill="#8A5A3A" stroke={INK} strokeWidth={3} />
  </>
);

const Upgrade = () => (
  <>
    <Polygon
      points="32,5 54,29 42,29 42,45 22,45 22,29 10,29"
      fill="#63E04F" stroke={INK} strokeWidth={3} strokeLinejoin="round"
    />
    <Path d="M24 26 L32 14" stroke="#C9F7BC" strokeWidth={3} strokeLinecap="round" />
    <Rect x={15} y={49} width={34} height={8} rx={4} fill="#FFFDF5" stroke={INK} strokeWidth={3} />
  </>
);

const Minigames = () => (
  <G rotation={10} origin="32, 32">
    <Rect x={9} y={9} width={46} height={46} rx={11} fill="#7B4DE0" stroke={INK} strokeWidth={3} />
    {[[22, 22], [42, 22], [32, 32], [22, 42], [42, 42]].map(([x, y]) => (
      <Circle key={`${x}-${y}`} cx={x} cy={y} r={4.5} fill="#FFFFFF" />
    ))}
  </G>
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
