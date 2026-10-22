import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import IsoBox from './IsoBox';
import { pts, boxColors } from './iso';
import { PALETTE } from './palette';

export const TANOOR = { x: 1.4, y: 1.2, w: 1.3, d: 1.3, h: 54 };

function geometry(project) {
  const { x, y, w, d, h } = TANOOR;
  const face = (u, v) => project(x + u * w, y + d, v * h); // point on the left face
  const rect = (u1, v1, u2, v2) => [face(u1, v1), face(u2, v1), face(u2, v2), face(u1, v2)];
  const top = (u1, v1, u2, v2) => [
    project(x + u1 * w, y + v1 * d, h),
    project(x + u2 * w, y + v1 * d, h),
    project(x + u2 * w, y + v2 * d, h),
    project(x + u1 * w, y + v2 * d, h),
  ];
  return {
    mouth: rect(0.22, 0.1, 0.78, 0.5),
    flame: rect(0.32, 0.14, 0.68, 0.38),
    rim: top(0.15, 0.15, 0.85, 0.85),
    hole: top(0.28, 0.28, 0.72, 0.72),
    holeGlow: top(0.36, 0.36, 0.64, 0.64),
  };
}

export function Tanoor({ project }) {
  const g = geometry(project);
  const { x, y, w, d, h } = TANOOR;
  const shadow = [
    project(x - 0.1, y + 0.1), project(x + w + 0.35, y + 0.1),
    project(x + w + 0.35, y + d + 0.45), project(x - 0.1, y + d + 0.45),
  ];
  return (
    <>
      <Polygon points={pts(shadow)} fill="rgba(0,0,0,0.18)" />
      <IsoBox project={project} x={x} y={y} w={w} d={d} h={h} colors={boxColors(PALETTE.clay)} />
      <Polygon points={pts(g.rim)} fill={PALETTE.brick} />
      <Polygon points={pts(g.hole)} fill={PALETTE.mouth} />
      <Polygon points={pts(g.mouth)} fill={PALETTE.mouth} />
    </>
  );
}

// Animated flicker overlay drawn above the static tanoor.
export function TanoorFire({ project, width, height }) {
  const g = geometry(project);
  const op = useRef(new Animated.Value(0.7)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(op, { toValue: 1, duration: 280, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(op, { toValue: 0.55, duration: 380, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(op, { toValue: 0.9, duration: 220, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [op]);

  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: op }]}>
      <Svg width={width} height={height}>
        <Polygon points={pts(g.flame)} fill={PALETTE.fire1} />
        <Polygon points={pts(g.holeGlow)} fill={PALETTE.fire2} />
      </Svg>
    </Animated.View>
  );
}
