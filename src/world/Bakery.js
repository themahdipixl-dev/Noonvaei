// Season bakery drawn with plain RN <Image> layers (remote WEBP from the Assets repo).
// Cropped layers: offsets are in pixels of a shared 2048x2048 reference canvas
// (same canvas as bakery_front.webp, which is NOT cropped).
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { ENV } from '../scene/environmentAssets';
import { LOT_SIZE, ART } from './worldConfig';

const REF = 2048;
const box = (up, down, left, right) => ({ up, down, left, right });

const BOX = {
  belt: box(916, 930, 931, 771),
  cutter: box(869, 973, 973, 924),
  lavash: [
    box(909, 1050, 922, 973),
    box(987, 972, 1056, 837),
    box(1091, 861, 1221, 669),
    box(1089, 855, 547, 1339),
    box(1137, 805, 632, 1252),
  ],
};

// All 4 baker views are cropped to the same rectangle.
 const BAKER = box(1024, 802, 927, 1024);

export default function Bakery({ project, tileW, gx, gy }) {
  const c = project(gx + LOT_SIZE / 2, gy + LOT_SIZE / 2, 0);
  const S = (LOT_SIZE * tileW) / ART.bakery.floorW;
  const x = c.x - ART.bakery.anchor.x * S;
  const y = c.y - ART.bakery.anchor.y * S;
  const k = S / REF;

  const layer = (left, top, size) => ({ position: 'absolute', left, top, width: size, height: size });
  const cropped = (b) => ({
    position: 'absolute',
    left: x + b.left * k,
    top: y + b.up * k,
    width: (REF - b.left - b.right) * k,
    height: (REF - b.up - b.down) * k,
  });

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Image source={ENV.bakeryFront} style={layer(x, y, S)} resizeMode="stretch" />
      <Image source={ENV.bakeryBelt} style={cropped(BOX.belt)} resizeMode="stretch" />
      <Image source={ENV.lavash[0]} style={cropped(BOX.lavash[0])} resizeMode="stretch" />
      <Image source={ENV.bakeryCutter} style={cropped(BOX.cutter)} resizeMode="stretch" />
    </View>
  );
}
