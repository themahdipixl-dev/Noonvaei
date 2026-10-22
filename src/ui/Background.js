import React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Defs, LinearGradient, RadialGradient, Stop, Rect, Circle, Polygon } from 'react-native-svg';

// Warm sky gradient, glowing sun and a turquoise Persian-tile strip at the bottom.
export default function Background() {
  const { width, height } = useWindowDimensions();
  const S = 30;
  const n = Math.ceil(width / S) + 1;
  const y = height - S - 6;
  const tiles = [];
  for (let i = 0; i < n; i++) {
    const cx = i * S;
    const dark = i % 2 === 0;
    tiles.push(
      <React.Fragment key={i}>
        <Polygon points={`${cx},${y} ${cx + S / 2},${y + S / 2} ${cx},${y + S} ${cx - S / 2},${y + S / 2}`}
          fill={dark ? '#1d8b8b' : '#f7e7c3'} />
        <Polygon points={`${cx},${y + 8} ${cx + 7},${y + S / 2} ${cx},${y + S - 8} ${cx - 7},${y + S / 2}`}
          fill={dark ? '#f0b93a' : '#1d8b8b'} />
      </React.Fragment>
    );
  }
  return (
    <Svg style={StyleSheet.absoluteFill} width={width} height={height} pointerEvents="none">
      <Defs>
        <LinearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#ffeec4" />
          <Stop offset="0.6" stopColor="#f6c987" />
          <Stop offset="1" stopColor="#e39a4f" />
        </LinearGradient>
        <RadialGradient id="sun" cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor="#fff9dc" stopOpacity="0.95" />
          <Stop offset="1" stopColor="#ffe9a0" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Rect width={width} height={height} fill="url(#bg)" />
      <Circle cx={width * 0.82} cy={110} r={120} fill="url(#sun)" />
      <Rect x="0" y={y - 4} width={width} height={S + 12} fill="#14605f" />
      {tiles}
    </Svg>
  );
}
