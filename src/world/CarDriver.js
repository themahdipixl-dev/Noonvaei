// One car driving a looped route. Static image per direction (sw / se / ne / nw).
// Usage: <CarDriver car={CARS[0]} ... />  (car = entry of CARS in worldConfig)
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
import { ENV } from '../scene/environmentAssets';

// index order: 0 = sw, 1 = se, 2 = ne, 3 = nw
const DIRS = ['sw', 'se', 'ne', 'nw'];

const moveDir = (dx, dy) => {
  const sx = dx - dy;
  const sy = dx + dy;
  return sy >= 0 ? (sx < 0 ? 0 : 1) : sx > 0 ? 2 : 3;
};

// row: [t0, dur, x0, y0, dx, dy, dir]
function buildRoute(points, speed) {
  const n = points.length;
  if (n < 2) return { table: [], total: 0 };
  const table = [];
  let t = 0;
  for (let i = 0; i < n; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[(i + 1) % n];
    const dx = x1 - x0;
    const dy = y1 - y0;
    const len = Math.hypot(dx, dy);
    if (len <= 0) continue;
    const dur = len / speed;
    table.push([t, dur, x0, y0, dx, dy, moveDir(dx, dy)]);
    t += dur;
  }
  return { table, total: t };
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
  const k = Math.min(Math.max((t - seg[0]) / seg[1], 0), 1);
  return { gx: seg[2] + seg[4] * k, gy: seg[3] + seg[5] * k, dir: seg[6] };
};

function CarLayer({ car, index, dirKey, time, table }) {
  const { width, anchorY, aspect, scale, offset } = car;
  const w = width * (scale[dirKey] || 1);
  const h = w / (aspect[dirKey] || 1.45);
  const [ox, oy] = offset[dirKey] || [0, 0];

  const op = useAnimatedStyle(() => ({
    opacity: sample(table, time.value).dir === index ? 1 : 0,
  }));

  return (
    <Animated.Image
      source={ENV.vehicles[car.id][dirKey]}
      resizeMode="stretch"
      fadeDuration={0}
      style={[
        { position: 'absolute', left: -w / 2 + ox, top: -h * anchorY + oy, width: w, height: h },
        op,
      ]}
    />
  );
}

function CarDriver({ car, tileW, ratio, originX, originY }) {
  const { width, speed, route, shadow, startAt = 0 } = car;
  const tileH = tileW * ratio;
  const { table, total } = useMemo(() => buildRoute(route, speed), [route, speed]);
  const time = useSharedValue(0);

  useEffect(() => {
    if (total <= 0) return undefined;
    const start = total * startAt;
    time.value = start;
    // first run finishes the current lap, then loops from 0
    time.value = withTiming(
      total,
      { duration: (total - start) * 1000, easing: Easing.linear },
      (done) => {
        'worklet';
        if (done) {
          time.value = 0;
          time.value = withRepeat(
            withTiming(total, { duration: total * 1000, easing: Easing.linear }),
            -1,
            false
          );
        }
      }
    );
    return () => cancelAnimation(time);
  }, [total, startAt, time]);

  const body = useAnimatedStyle(() => {
    const p = sample(table, time.value);
    return {
      transform: [
        { translateX: originX + ((p.gx - p.gy) * tileW) / 2 },
        { translateY: originY + ((p.gx + p.gy) * tileH) / 2 + Math.sin(time.value * 14) * 0.5 },
      ],
    };
  });

  if (total <= 0) return null;

  const sw = width * shadow.width;
  const sh = sw * ratio;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Animated.View style={[{ position: 'absolute', left: 0, top: 0, width: 0, height: 0 }, body]}>
        <View
          style={{
            position: 'absolute',
            left: -sw / 2,
            top: -sh / 2 + shadow.offsetY,
            width: sw,
            height: sh,
            borderRadius: sw / 2,
            backgroundColor: `rgba(0,0,0,${shadow.opacity})`,
          }}
        />
        {DIRS.map((d, i) => (
          <CarLayer key={d} car={car} index={i} dirKey={d} time={time} table={table} />
        ))}
      </Animated.View>
    </View>
  );
}

export default React.memo(CarDriver);
