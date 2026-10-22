import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Rect, Circle, Ellipse } from 'react-native-svg';

export const BAKER_W = 44;
export const BAKER_H = 64;

// Vector "shater" with a gentle idle bob. (px, py) = feet position on screen.
export default function Baker({ px, py }) {
  const bob = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: -3, duration: 450, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0, duration: 450, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [bob]);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: px - BAKER_W / 2,
        top: py - BAKER_H + 4,
        transform: [{ translateY: bob }],
      }}
    >
      <Svg width={BAKER_W} height={BAKER_H} viewBox="0 0 44 64">
        <Ellipse cx="22" cy="60" rx="15" ry="4" fill="rgba(0,0,0,0.25)" />
        <Rect x="13" y="44" width="7" height="15" rx="2" fill="#3b3b4f" />
        <Rect x="24" y="44" width="7" height="15" rx="2" fill="#3b3b4f" />
        <Rect x="4" y="28" width="8" height="17" rx="4" fill="#f2ede2" />
        <Rect x="32" y="28" width="8" height="17" rx="4" fill="#f2ede2" />
        <Rect x="10" y="24" width="24" height="24" rx="8" fill="#f7f3ea" />
        <Rect x="10" y="38" width="24" height="5" fill="#b0503a" />
        <Circle cx="22" cy="16" r="9" fill="#e0b48a" />
        <Rect x="16" y="19" width="12" height="3" rx="1.5" fill="#4a3426" />
        <Circle cx="18.5" cy="15" r="1.2" fill="#2a1a10" />
        <Circle cx="25.5" cy="15" r="1.2" fill="#2a1a10" />
        <Rect x="12" y="4" width="20" height="8" rx="4" fill="#f7f3ea" />
        <Rect x="12" y="9" width="20" height="3" fill="#c7bfae" />
      </Svg>
    </Animated.View>
  );
}
