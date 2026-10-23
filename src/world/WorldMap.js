// Full-screen pannable / zoomable world. Drop-in replacement for <Scene/>.
import React, { useMemo } from 'react';
import { View, Text, Pressable, Animated, StyleSheet } from 'react-native';
import { makeProjector } from '../scene/iso';
import WorldScene from './WorldScene';
import { useWorldCamera } from './useWorldCamera';
import { WORLD, SEASONS, LOT_SIZE, currentSeasonIndex } from './worldConfig';

export default function WorldMap({ level }) {
  const { grid, tileW, padX, padTop, padBottom } = WORLD;
  const W = grid * tileW + padX * 2;
  const H = (grid * tileW) / 2 + padTop + padBottom;
  const seasonIdx = currentSeasonIndex(level);

  // Camera focus = current season bakery (offset from content center)
  const focus = useMemo(() => {
    const lot = SEASONS[seasonIdx].lot;
    const p = makeProjector(tileW, W / 2, padTop)(lot.x + LOT_SIZE / 2, lot.y + LOT_SIZE / 2, 40);
    return { dx: p.x - W / 2, dy: p.y - H / 2 };
  }, [seasonIdx, tileW, W, H, padTop]);

  const cam = useWorldCamera({ contentW: W, contentH: H, focus, initialScale: 1 });

  return (
    <View ref={cam.viewRef} onLayout={cam.onLayout} style={styles.fill} {...cam.panHandlers}>
      <Animated.View
        style={{
          position: 'absolute', width: W, height: H, left: '50%', top: '50%',
          marginLeft: -W / 2, marginTop: -H / 2,
          transform: [{ translateX: cam.x }, { translateY: cam.y }, { scale: cam.s }],
        }}
      >
        <WorldScene width={W} height={H} unlocked={seasonIdx + 1} />
      </Animated.View>

      <View style={styles.controls} pointerEvents="box-none">
        <Btn label="+" onPress={() => cam.zoomBy(1.3)} />
        <Btn label="−" onPress={() => cam.zoomBy(1 / 1.3)} />
        <Btn label="◎" onPress={cam.recenter} />
      </View>
    </View>
  );
}

const Btn = ({ label, onPress }) => (
  <Pressable onPress={onPress} style={styles.btn}>
    <Text style={styles.btnText}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  fill: { ...StyleSheet.absoluteFillObject, backgroundColor: '#b9d98f', overflow: 'hidden' },
  // kept above the bottom tab bar (~86-104dp tall)
  controls: { position: 'absolute', right: 12, bottom: 120 },
  btn: {
    width: 44, height: 44, borderRadius: 14, marginTop: 8, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#1f2a44', borderWidth: 2, borderColor: '#4b5a85', borderBottomWidth: 4,
  },
  btnText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
});
