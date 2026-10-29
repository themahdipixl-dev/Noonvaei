// Baker patrolling between stops inside the bakery.
// One shared value (time in seconds) drives position, direction and frame.
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
import Svg, { Defs, RadialGradient, Stop, Ellipse } from 'react-native-svg';
import { ENV, BAKER_WALK_SHEET as SHEET } from '../scene/environmentAssets';
import { WALKER, ART, LOT_SIZE } from './worldConfig';

// index order: 0 = sw, 1 = se, 2 = ne, 3 = nw
const DIRS = ['sw', 'se', 'ne', 'nw'];
// frame where the legs are together (idle pose) for each direction
const IDLE = [7, 3, 7, 6];

const moveDir = (dx, dy) => {
  const sx = dx - dy;
  const sy = dx + dy;
  return sy >= 0 ? (sx < 0 ? 0 : 1) : sx > 0 ? 2 : 3;
};

// row: [t0, dur, x0, y0, dx, dy, dir, kind(0 walk / 1 wait), segStride, len]
function buildTimeline(stops, toGrid, speed, stride) {
  const n = stops.length;
  if (n < 2) return { table: [], total: 0, points: [] };
  const points = stops.map((s) => toGrid(s.p[0], s.p[1]));
  const table = [];
  let t = 0;
  let lastDir = moveDir(points[0][0] - points[n - 1][0], points[0][1] - points[n - 1][1]);

  for (let i = 0; i < n; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[(i + 1) % n];
    const stop = stops[i];

    if (stop.wait > 0) {
      const f = stop.face ? DIRS.indexOf(stop.face) : -1;
      table.push([t, stop.wait, x0, y0, 0, 0, f >= 0 ? f : lastDir, 1, 1, 1]);
      t += stop.wait;
    }

    const dx = x1 - x0;
    const dy = y1 - y0;
    const len = Math.hypot(dx, dy);
    if (len > 0) {
      const dir = moveDir(dx, dy);
      // whole number of 8-frame cycles per leg, so the walk ends on the idle pose
      const cycles = Math.max(1, Math.round(len / (stride * SHEET.frames)));
      const segStride = len / (cycles * SHEET.frames);
      const dur = len / speed;
      table.push([t, dur, x0, y0, dx, dy, dir, 0, segStride, len]);
      lastDir = dir;
      t += dur;
    }
  }
  return { table, total: t, points };
}

const sample = (table, t) => {
  'worklet';
  let seg = table[table.length - 1];
  for (let i = 0; i < table.length; i++) {
    if (t < table[i][0] + table[i][1]) {
      seg = table[i];
      break;
    }
  }
  const dir = seg[6];
  if (seg[7] === 1) {
    return { gx: seg[2], gy: seg[3], dir, frame: IDLE[dir] };
  }
  const local = Math.min(Math.max(t - seg[0], 0), seg[1]);
  const k = local / seg[1];
  const step = Math.floor((k * seg[9]) / seg[8] + 1e-6);
  return {
    gx: seg[2] + seg[4] * k,
    gy: seg[3] + seg[5] * k,
    dir,
    frame: (IDLE[dir] + step) % SHEET.frames,
  };
};

// Soft elliptical ground shadow centered on the feet point.
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

function DirLayer({ index, dirKey, time, table, scale }) {
  const cw = SHEET.cellW * scale;
  const ch = SHEET.cellH * scale;
  const feet = SHEET.feetY * scale;

  const wrap = useAnimatedStyle(() => ({
    opacity: sample(table, time.value).dir === index ? 1 : 0,
  }));
  const strip = useAnimatedStyle(() => ({
    transform: [{ translateX: -sample(table, time.value).frame * cw }],
  }));

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

function BakerWalker({ tileW, ratio, originX, originY, lot }) {
  const { charH, speed, stride, stops, dirScale, shadow, debug } = WALKER;
  const tileH = tileW * ratio;

  const { table, total, points } = useMemo(() => {
    // bakery_front.webp fraction -> grid coordinates (same math Bakery.js uses)
    const S = (LOT_SIZE * tileW) / ART.bakery.floorW;
    const toGrid = (nx, ny) => {
      const dx = (nx - ART.bakery.anchor.x) * S;
      const dy = (ny - ART.bakery.anchor.y) * S;
      const u = dx / tileW + dy / tileH;
      const v = dy / tileH - dx / tileW;
      return [lot.x + LOT_SIZE / 2 + u, lot.y + LOT_SIZE / 2 + v];
    };
    return buildTimeline(stops, toGrid, speed, stride);
  }, [stops, tileW, tileH, lot.x, lot.y, speed, stride]);

  const time = useSharedValue(0);

  useEffect(() => {
    if (total <= 0) return undefined;
    time.value = 0;
    time.value = withRepeat(
      withTiming(total, { duration: total * 1000, easing: Easing.linear }),
      -1,
      false
    );
    return () => cancelAnimation(time);
  }, [total, time]);

  const baseScale = charH / SHEET.refH;

  const body = useAnimatedStyle(() => {
    const p = sample(table, time.value);
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
        <Shadow charH={charH} ratio={ratio} cfg={shadow} />
        {DIRS.map((d, i) => (
          <DirLayer
            key={d}
            index={i}
            dirKey={d}
            time={time}
            table={table}
            scale={baseScale * ((dirScale && dirScale[d]) || 1)}
          />
        ))}
      </Animated.View>
      {debug &&
        points.map((g, i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: originX + ((g[0] - g[1]) * tileW) / 2 - 4,
              top: originY + ((g[0] + g[1]) * tileH) / 2 - 4,
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: 'red',
            }}
          />
        ))}
    </View>
  );
}

export default React.memo(BakerWalker);
