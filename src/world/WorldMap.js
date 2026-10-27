// Full-screen pannable / zoomable world. Drop-in replacement for <Scene/>.
// (Zoom / recenter buttons were removed: zoom is done by pinch gesture only.)
import React, { useMemo, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';

export default function WorldMap({ level }) {
  const { grid, tileW, padX, padTop, padBottom, ratio } = WORLD;
  const W = grid * tileW + padX * 2;
  const H = grid * tileW * ratio + padTop + padBottom;
  const seasonIdx = currentSeasonIndex(level);

  // Start downloading the WEBP art right away so it doesn't pop in.
  useEffect(() => {
    preloadEnvironment();
  }, []);

  // Camera focus = current season bakery (offset from content center)
 const focus = useMemo(() => {
  const lot = SEASONS[seasonIdx].lot;
  const p = makeProjector(tileW, W / 2, padTop, ratio)(lot.x + LOT_SIZE / 2, lot.y + LOT_SIZE / 2, 40);
  return { dx: p.x - W / 2, dy: p.y - H / 2 };
 }, [seasonIdx, tileW, W, H, padTop, ratio]);

  const cam = useWorldCamera({ contentW: W, contentH: H, focus, initialScale: 1 });

  return (
  <GestureDetector gesture={cam.gesture}>
    <View collapsable={false} onLayout={cam.onLayout} style={styles.fill}>
      <Animated.View
        style={[
          {
            position: 'absolute', width: W, height: H, left: '50%', top: '50%',
            marginLeft: -W / 2, marginTop: -H / 2,
          },
          cam.style,
        ]}
      >
        <WorldScene width={W} height={H} />
      </Animated.View>
    </View>
  </GestureDetector>
 );
}

const styles = StyleSheet.create({
  fill: { ...StyleSheet.absoluteFillObject, backgroundColor: WORLD_BG, overflow: 'hidden' },
});
