// Full-screen pannable / zoomable world. Drop-in replacement for <Scene/>.
// (Zoom / recenter buttons were removed: zoom is done by pinch gesture only.)
import React, { useMemo } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
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
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { ...StyleSheet.absoluteFillObject, backgroundColor: '#b9d98f', overflow: 'hidden' },
});
