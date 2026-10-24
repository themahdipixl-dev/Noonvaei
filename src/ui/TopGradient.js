// Short, smooth black -> transparent gradient at the very top of the screen.
// Replaces the phone's status bar (which is hidden) so the top edge doesn't look bare.
// Uses react-native-svg (already installed), so no new dependency is needed.
// The fade follows a smoothstep curve (many stops) so there is no visible hard band.
import React from 'react';
import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

const HEIGHT = 64;

export default function TopGradient({ height = HEIGHT }) {
  return (
    <View
      pointerEvents="none"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, height }}
    >
      <Svg width="100%" height="100%">
        <Defs>
          <LinearGradient id="topFade" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0.0" stopColor="#000000" stopOpacity="1.0" />
            <Stop offset="0.0625" stopColor="#000000" stopOpacity="0.989" />
            <Stop offset="0.125" stopColor="#000000" stopOpacity="0.957" />
            <Stop offset="0.1875" stopColor="#000000" stopOpacity="0.908" />
            <Stop offset="0.25" stopColor="#000000" stopOpacity="0.844" />
            <Stop offset="0.3125" stopColor="#000000" stopOpacity="0.768" />
            <Stop offset="0.375" stopColor="#000000" stopOpacity="0.684" />
            <Stop offset="0.4375" stopColor="#000000" stopOpacity="0.593" />
            <Stop offset="0.5" stopColor="#000000" stopOpacity="0.5" />
            <Stop offset="0.5625" stopColor="#000000" stopOpacity="0.407" />
            <Stop offset="0.625" stopColor="#000000" stopOpacity="0.316" />
            <Stop offset="0.6875" stopColor="#000000" stopOpacity="0.232" />
            <Stop offset="0.75" stopColor="#000000" stopOpacity="0.156" />
            <Stop offset="0.8125" stopColor="#000000" stopOpacity="0.092" />
            <Stop offset="0.875" stopColor="#000000" stopOpacity="0.043" />
            <Stop offset="0.9375" stopColor="#000000" stopOpacity="0.011" />
            <Stop offset="1.0" stopColor="#000000" stopOpacity="0.0" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#topFade)" />
      </Svg>
    </View>
  );
}
