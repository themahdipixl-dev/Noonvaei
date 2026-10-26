// Season bakery drawn with plain RN <Image> layers (remote WEBP from the Assets repo).
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { ENV } from '../scene/environmentAssets';
import { LOT_SIZE, ART } from './worldConfig';

export default function Bakery({ project, tileW, gx, gy }) {
  const c = project(gx + LOT_SIZE / 2, gy + LOT_SIZE / 2, 0);
  const S = (LOT_SIZE * tileW) / ART.bakery.floorW;
  const x = c.x - ART.bakery.anchor.x * S;
  const y = c.y - ART.bakery.anchor.y * S;

  const B = S * ART.baker.scale;
  const bx = x + ART.baker.at.x * S - ART.baker.feet.x * B;
  const by = y + ART.baker.at.y * S - ART.baker.feet.y * B;

  const layer = (left, top, size) => ({ position: 'absolute', left, top, width: size, height: size });

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Image source={ENV.bakeryFront} style={layer(x, y, S)} resizeMode="contain" />
      <Image source={ENV.bakeryBelt} style={layer(x, y, S)} resizeMode="contain" />
      <Image source={ENV.lavash[0]} style={layer(x, y, S)} resizeMode="contain" />
      <Image source={ENV.bakerViews[0]} style={layer(bx, by, B)} resizeMode="contain" />
    </View>
  );
}
