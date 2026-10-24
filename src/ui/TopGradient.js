// Short black -> transparent gradient at the very top of the screen.
// Replaces the phone's status bar (which is hidden) so the top edge doesn't look bare.
// Uses react-native-svg (already installed), so no new dependency is needed.
import React from 'react';
import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

const HEIGHT = 22; // very short

export default function TopGradient({ height = HEIGHT }) {
  return (
    <View
      pointerEvents="none"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, height }}
    >
      <Svg width="100%" height="100%">
        <Defs>
          <LinearGradient id="topFade" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#000000" stopOpacity="1" />
            <Stop offset="0.45" stopColor="#000000" stopOpacity="0.85" />
            <Stop offset="1" stopColor="#000000" stopOpacity="0" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#topFade)" />
      </Svg>
    </View>
  );
}
