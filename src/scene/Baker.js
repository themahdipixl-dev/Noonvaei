import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Circle, Ellipse } from 'react-native-svg';
import IsoBox from './IsoBox';
import { makeProjector, boxColors } from './iso';

// 2.5D baker built from isometric boxes (local grid, feet near svg (40,96)).
const W = 80, H = 100;
const P = makeProjector(64, 40, 80);
const C = {
  pants: boxColors('#3d3d58'),
  shirt: boxColors('#f7f3ea'),
  sleeve: boxColors('#ece5d6'),
  apron: boxColors('#c0503a'),
  skin: boxColors('#e0b48a'),
  hat: boxColors('#fbf8f0'),
  band: boxColors('#d9cfb8'),
};

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

  const hc = P(0.5, 0.5, 52);
  const box = (key, x, y, w, d, z, h, colors) => (
    <IsoBox key={key} project={P} x={x} y={y} w={w} d={d} z={z} h={h} colors={colors} />
  );
  const sh = P(0.5, 0.55, 0);

  return (
    <Animated.View
      pointerEvents="none"
      style={{ position: 'absolute', left: px - W / 2, top: py - 96, transform: [{ translateY: bob }] }}
    >
      <Svg width={W} height={H}>
        <Defs>
          <RadialGradient id="head" cx="35%" cy="30%" r="75%">
            <Stop offset="0" stopColor="#f6d4ab" />
            <Stop offset="1" stopColor="#b57d55" />
          </RadialGradient>
        </Defs>
        <Ellipse cx={sh.x} cy={sh.y} rx="24" ry="8" fill="rgba(0,0,0,0.25)" />
        {box('l1', 0.2, 0.35, 0.26, 0.3, 0, 16, C.pants)}
        {box('l2', 0.54, 0.35, 0.26, 0.3, 0, 16, C.pants)}
        {box('a1', -0.05, 0.35, 0.2, 0.26, 24, 18, C.sleeve)}
        {box('h1', -0.05, 0.35, 0.2, 0.26, 18, 6, C.skin)}
        {box('t', 0.15, 0.25, 0.7, 0.5, 16, 26, C.shirt)}
        {box('ap', 0.22, 0.75, 0.56, 0.03, 16, 20, C.apron)}
        {box('a2', 0.85, 0.35, 0.2, 0.26, 24, 18, C.sleeve)}
        {box('h2', 0.85, 0.35, 0.2, 0.26, 18, 6, C.skin)}
        <Circle cx={hc.x} cy={hc.y} r="11" fill="url(#head)" />
        <Circle cx={hc.x - 5} cy={hc.y + 1} r="1.5" fill="#2a1a10" />
        <Circle cx={hc.x + 1.5} cy={hc.y + 3} r="1.5" fill="#2a1a10" />
        <Ellipse cx={hc.x - 2} cy={hc.y + 7} rx="5.5" ry="1.8" fill="#3a2618" />
        {box('hb', 0.28, 0.28, 0.44, 0.44, 57, 3, C.band)}
        {box('hat', 0.3, 0.3, 0.4, 0.4, 60, 8, C.hat)}
      </Svg>
    </Animated.View>
  );
}
