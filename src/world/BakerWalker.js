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
import Svg, { Defs, RadialGradient, Stop, Ellipse } from 'react-native-svg'; // NEW
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

// NEW: soft elliptical ground shadow centered on the feet point.
const Shadow = React.memo(function Shadow({ charH, ratio, cfg }) {
  if (!cfg) return null;
  const w = charH * cfg.width;
  const h = w * ratio;
  return (
    <Svg
      width={w}
      height={h}
      style={{
        position: 'absolute',
        left: -w / 2 + (cfg.offsetX || 0),
        top: -h / 2 + (cfg.offsetY || 0),
      }}
    >
      <Defs>
        <RadialGradient id="walkerShadow" cx="50%" cy="50%" rx="50%" ry="50%">
          <Stop offset="0" stopColor="#000" stopOpacity={cfg.opacity} />
          <Stop offset="0.6" stopColor="#000" stopOpacity={cfg.opacity * 0.55} />
          <Stop offset="1" stopColor="#000" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Ellipse cx={w / 2} cy={h / 2} rx={w / 2} ry={h / 2} fill="url(#walkerShadow)" />
    </Svg>
  );
});

// One layer per direction. The feet point of every cell sits exactly on the
// walker's ground point, so all directions share the same size and baseline.
function DirLayer({ index, dirKey, dist, table, stride, scale }) {
  const cw = SHEET.cellW * scale;
  const ch = SHEET.cellH * scale;
  const feet = SHEET.feetY * scale;

  const wrap = useAnimatedStyle(() => ({
    opacity: sample(table, dist.value).dir === index ? 1 : 0,
  }));
  const strip = useAnimatedStyle(() => {
    const frame = Math.floor(dist.value / stride) % SHEET.frames;
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
        style={[{ width: cw * SHEET.frames, height: ch }, strip]}
      />
    </Animated.View>
  );
}

function BakerWalker({ tileW, ratio, originX, originY }) {
  const { charH, speed, stride, path, dirScale, shadow } = WALKER; // NEW: shadow
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

  const baseScale = charH / SHEET.refH;
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
        {/* NEW: shadow must come BEFORE the character layers so it is drawn underneath */}
        <Shadow charH={charH} ratio={ratio} cfg={shadow} />
        {DIRS.map((d, i) => (
          <DirLayer
            key={d}
            index={i}
            dirKey={d}
            dist={dist}
            table={table}
            stride={stride}
            scale={baseScale * ((dirScale && dirScale[d]) || 1)}
          />
        ))}
      </Animated.View>
    </View>
  );
}

export default React.memo(BakerWalker);
