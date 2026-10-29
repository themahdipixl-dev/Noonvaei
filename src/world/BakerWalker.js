// Baker walking along a grid path. Everything runs on the UI thread:
// one shared value (distance walked) drives position, direction and frame.
// Sheets are used exactly as drawn (no per-frame resize / re-alignment).
import React, { useMemo, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import {
  ENV,
  BAKER_WALK_SHEETS,
  BAKER_WALK_FRAMES,
  BAKER_WALK_REF_H,
} from '../scene/environmentAssets';
import { WALKER } from './worldConfig';

// index order must match the `dir` value computed in buildPath
const DIRS = ['sw', 'se', 'ne', 'nw'];

// segment row: [start, len, x0, y0, dx, dy, dir]
function buildPath(points) {
  const table = [];
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const dx = x1 - x0;
    const dy = y1 - y0;
    const len = Math.hypot(dx, dy);
    if (len === 0) continue;
    const sx = dx - dy;
    const sy = dx + dy;
    const dir = sy >= 0 ? (sx < 0 ? 0 : 1) : sx > 0 ? 2 : 3;
    table.push([total, len, x0, y0, dx, dy, dir]);
    total += len;
  }
  return { table, total };
}

const sample = (table, d) => {
  'worklet';
  let seg = table[table.length - 1];
  for (let i = 0; i < table.length; i++) {
    if (d < table[i][0] + table[i][1]) {
      seg = table[i];
      break;
    }
  }
  const k = Math.min(1, Math.max(0, (d - seg[0]) / seg[1]));
  return { gx: seg[2] + seg[4] * k, gy: seg[3] + seg[5] * k, dir: seg[6] };
};

// One layer per direction. Positioned so that the cell's bottom-center sits on the
// walker's ground point (cell offset is kept as drawn in the original sheet).
function DirLayer({ index, dirKey, dist, table, stride, scale }) {
  const sheet = BAKER_WALK_SHEETS[dirKey];
  const cw = sheet.cellW * scale;
  const ch = sheet.h * scale;
  const feet = sheet.feetY * scale;

  const wrap = useAnimatedStyle(() => ({
    opacity: sample(table, dist.value).dir === index ? 1 : 0,
  }));
  const strip = useAnimatedStyle(() => {
    const frame = Math.floor(dist.value / stride) % BAKER_WALK_FRAMES;
    return { transform: [{ translateX: -frame * cw }] };
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: -cw / 2,
          top: -feet,
          width: cw,
          height: ch,
          overflow: 'hidden',
        },
        wrap,
      ]}
    >
      <Animated.Image
        source={ENV.bakerWalk[dirKey]}
        resizeMode="stretch"
        fadeDuration={0}
        style={[{ width: cw * BAKER_WALK_FRAMES, height: ch }, strip]}
      />
    </Animated.View>
  );
}

function BakerWalker({ tileW, ratio, originX, originY }) {
  const { charH, speed, stride, path } = WALKER;
  const { table, total } = useMemo(() => buildPath(path), [path]);
  const dist = useSharedValue(0);

  useEffect(() => {
    if (total <= 0) return undefined;
    dist.value = 0;
    dist.value = withRepeat(
      withTiming(total, { duration: (total / speed) * 1000, easing: Easing.linear }),
      -1,
      false
    );
    return () => cancelAnimation(dist);
  }, [total, speed, dist]);

  const scale = charH / BAKER_WALK_REF_H;
  const tileH = tileW * ratio;

  const body = useAnimatedStyle(() => {
    const p = sample(table, dist.value);
    return {
      transform: [
        { translateX: originX + ((p.gx - p.gy) * tileW) / 2 },
        { translateY: originY + ((p.gx + p.gy) * tileH) / 2 },
      ],
    };
  });

  if (total <= 0) return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Animated.View style={[{ position: 'absolute', left: 0, top: 0, width: 0, height: 0 }, body]}>
        {DIRS.map((d, i) => (
          <DirLayer
            key={d}
            index={i}
            dirKey={d}
            dist={dist}
            table={table}
            stride={stride}
            scale={scale}
          />
        ))}
      </Animated.View>
    </View>
  );
}

export default React.memo(BakerWalker);
