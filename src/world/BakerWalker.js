// Baker walking along a grid path. Everything runs on the UI thread:
// one shared value (distance walked) drives position, direction and frame.
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
import { ENV, BAKER_WALK_SHEET as SHEET } from '../scene/environmentAssets';
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
    // grid -> screen direction
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

function DirLayer({ index, source, dist, table, stride, fw, fh }) {
  const clip = useAnimatedStyle(() => ({
    opacity: sample(table, dist.value).dir === index ? 1 : 0,
  }));
  const strip = useAnimatedStyle(() => {
    const frame = Math.floor(dist.value / stride) % SHEET.frames;
    return { transform: [{ translateX: -frame * fw }] };
  });

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { overflow: 'hidden' }, clip]}>
      <Animated.Image
        source={source}
        resizeMode="stretch"
        fadeDuration={0}
        style={[{ width: fw * SHEET.frames, height: fh }, strip]}
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

  const s = charH / SHEET.charH;
  const fw = SHEET.cellW * s;
  const fh = SHEET.cellH * s;
  const tileH = tileW * ratio;

  const body = useAnimatedStyle(() => {
    const p = sample(table, dist.value);
    const sx = originX + ((p.gx - p.gy) * tileW) / 2;
    const sy = originY + ((p.gx + p.gy) * tileH) / 2;
    return {
      transform: [
        { translateX: sx - SHEET.feetX * s },
        { translateY: sy - SHEET.feetY * s },
      ],
    };
  });

  if (total <= 0) return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Animated.View style={[{ position: 'absolute', left: 0, top: 0, width: fw, height: fh }, body]}>
        {DIRS.map((d, i) => (
          <DirLayer
            key={d}
            index={i}
            source={ENV.bakerWalk[d]}
            dist={dist}
            table={table}
            stride={stride}
            fw={fw}
            fh={fh}
          />
        ))}
      </Animated.View>
    </View>
  );
}

export default React.memo(BakerWalker);
