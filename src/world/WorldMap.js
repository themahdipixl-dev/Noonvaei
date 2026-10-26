// Full-screen pannable / zoomable world. Drop-in replacement for <Scene/>.
// (Zoom / recenter buttons were removed: zoom is done by pinch gesture only.)
import React, { useMemo, useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { makeProjector } from '../scene/iso';
import { preloadEnvironment } from '../scene/environmentAssets';
import WorldScene from './WorldScene';
import { useWorldCamera } from './useWorldCamera';
import { WORLD, SEASONS, LOT_SIZE, WORLD_BG, currentSeasonIndex } from './worldConfig';

export default function WorldMap({ level }) {
  const { grid, tileW, padX, padTop, padBottom } = WORLD;
  const W = grid * tileW + padX * 2;
  const H = (grid * tileW) / 2 + padTop + padBottom;
  const seasonIdx = currentSeasonIndex(level);

  // Start downloading the WEBP art right away so it doesn't pop in.
  useEffect(() => {
    preloadEnvironment();
  }, []);

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
  fill: { ...StyleSheet.absoluteFillObject, backgroundColor: WORLD_BG, overflow: 'hidden' },
});
