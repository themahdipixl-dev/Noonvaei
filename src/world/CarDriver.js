// One car driving a looped route with a simple driver model:
// accelerates from rest, cruises, slows for corners, stops at (virtual) red lights.
// Wheels (rims) rotate with the distance travelled and are drawn as iso ellipses.
import React, { useMemo } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useFrameCallback,
} from 'react-native-reanimated';
import Svg, { Polygon } from 'react-native-svg';
import { ENV } from '../scene/environmentAssets';
import { DIRS, buildPath, buildLights, pathAt, stepCar } from './carPhysics';

// Rim: دایره‌ی چرخان که با scaleX فشرده و با rotate کج می‌شه تا بیضیِ چرخ sprite بشه.
// d = قطر بزرگ بیضی (کسری از عرض عکس)، k = نسبت قطر کوچک/بزرگ، rot = کج‌شدن به درجه
const Rim = React.memo(function Rim({ rim, w, h, f, angle, source, scale, k0, rot0, debug }) {
  const major = rim.d * w * scale;
  const k = rim.k ?? k0;
  const rot = rim.rot ?? rot0;
  const sign = f[0] >= 0 ? 1 : -1; // جهت چرخش به سمت حرکت
  const spin = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sign * angle.value}deg` }],
  }));
  return (
    <View
      style={{
        position: 'absolute',
        left: rim.x * w - major / 2,
        top: rim.y * h - major / 2,
        width: major,
        height: major,
        transform: [{ rotate: `${rot}deg` }, { scaleX: k }],
        borderWidth: debug ? 1 : 0,
        borderColor: 'red',
        borderRadius: major / 2,
      }}
    >
      <Animated.View
        style={[{ width: major, height: major, borderRadius: major / 2, overflow: 'hidden' }, spin]}
      >
        <Image source={source} resizeMode="stretch" fadeDuration={0} style={{ width: major, height: major }} />
      </Animated.View>
    </View>
  );
});

function CarLayer({ car, index, dirKey, dirV, angle, f, ratio }) {
  const { width, anchorY, aspect, scale, offset, rims, rimScale = 1, rimK = 0.72, rimRot, debug } = car;
  const w = width * (scale[dirKey] || 1);
  const h = w / (aspect[dirKey] || 1.45);
  const [ox, oy] = offset[dirKey] || [0, 0];
  const rimSource = ENV.vehicleRims && ENV.vehicleRims[car.id];
  const rot0 = (rimRot && rimRot[dirKey]) ?? 0;

  const op = useAnimatedStyle(() => ({ opacity: dirV.value === index ? 1 : 0 }));

  return (
    <Animated.View
      style={[
        { position: 'absolute', left: -w / 2 + ox, top: -h * anchorY + oy, width: w, height: h },
        op,
      ]}
    >
      <Image
        source={ENV.vehicles[car.id][dirKey]}
        resizeMode="stretch"
        fadeDuration={0}
        style={{ width: w, height: h }}
      />
      {rimSource &&
        ((rims && rims[dirKey]) || []).map((r, i) => (
          <Rim
            key={i}
            rim={r}
            w={w}
            h={h}
            f={f}
            angle={angle}
            source={rimSource}
            scale={rimScale}
            k0={rimK}
            rot0={rot0}
            debug={debug}
          />
        ))}
    </Animated.View>
  );
}

// Ground shadow: an ellipse drawn on the iso ground plane (3 soft rings).
const Shadow = React.memo(function Shadow({ cfg, tileW, ratio, alongX, parity, dirV }) {
  const g = useMemo(() => {
    const tileH = tileW * ratio;
    const a = cfg.length / 2;
    const b = cfg.width / 2;
    const rx = alongX ? a : b;
    const ry = alongX ? b : a;
    let maxX = 0;
    let maxY = 0;
    const rings = [1, 0.78, 0.56].map((k) => {
      const pts = [];
      for (let i = 0; i < 28; i++) {
        const th = (i / 28) * Math.PI * 2;
        const ux = Math.cos(th) * rx * k;
        const uy = Math.sin(th) * ry * k;
        const sx = ((ux - uy) * tileW) / 2;
        const sy = ((ux + uy) * tileH) / 2;
        pts.push([sx, sy]);
        maxX = Math.max(maxX, Math.abs(sx));
        maxY = Math.max(maxY, Math.abs(sy));
      }
      return pts;
    });
    const W = Math.ceil(maxX) + 2;
    const H = Math.ceil(maxY) + 2;
    return {
      W,
      H,
      rings: rings.map((pts) => pts.map(([x, y]) => `${x + W},${y + H}`).join(' ')),
    };
  }, [cfg.length, cfg.width, tileW, ratio, alongX]);

  const op = useAnimatedStyle(() => ({ opacity: dirV.value % 2 === parity ? 1 : 0 }));

  return (
    <Animated.View
      style={[
        { position: 'absolute', left: -g.W + (cfg.dx || 0), top: -g.H + (cfg.dy || 0) },
        op,
      ]}
    >
      <Svg width={g.W * 2} height={g.H * 2}>
        {g.rings.map((p, i) => (
          <Polygon key={i} points={p} fill="#000" fillOpacity={cfg.opacity * 0.5} />
        ))}
      </Svg>
    </Animated.View>
  );
});

function CarDriver({ car, tileW, ratio, originX, originY }) {
  const { drive, route, lights, shadow, wheelCirc, startAt = 0 } = car;
  const tileH = tileW * ratio;

  const R = useMemo(() => {
    const path = buildPath(route, drive.cornerRadius, 0.05, 0.4);
    if (!path) return null;
    return {
      ...path,
      lights: buildLights(lights, path, drive.halfLength),
      drive,
    };
  }, [route, lights, drive]);

  // forward direction of each sprite on screen (unit vector)
  const FWD = useMemo(() => {
    const n = Math.hypot(0.5, ratio / 2);
    const fx = 0.5 / n;
    const fy = ratio / 2 / n;
    return { sw: [-fx, fy], se: [fx, fy], ne: [fx, -fy], nw: [-fx, -fy] };
  }, [ratio]);

  const init = R ? pathAt(R, startAt * R.L) : [0, 0, 0];
  const sS = useSharedValue(R ? startAt * R.L : 0);
  const vS = useSharedValue(0);
  const aS = useSharedValue(0);
  const clock = useSharedValue(0);
  const gx = useSharedValue(init[0]);
  const gy = useSharedValue(init[1]);
  const dirV = useSharedValue(init[2]);
  const ang = useSharedValue(0);

  useFrameCallback((info) => {
    'worklet';
    if (!R) return;
    const dt = Math.min((info.timeSincePreviousFrame || 0) / 1000, 0.05);
    if (dt <= 0) return;
    clock.value += dt;
    const r = stepCar(sS.value, vS.value, aS.value, clock.value, dt, R);
    sS.value = r[0];
    vS.value = r[1];
    aS.value = r[2];
    const p = pathAt(R, r[0]);
    gx.value = p[0];
    gy.value = p[1];
    dirV.value = p[2];
    ang.value = ((r[0] / wheelCirc) * 360) % 360;
  });

  const body = useAnimatedStyle(() => {
    // tiny road vibration, only while moving
    const bob = Math.sin(sS.value * 10) * 0.35 * Math.min(vS.value / drive.cruise, 1);
    return {
      transform: [
        { translateX: originX + ((gx.value - gy.value) * tileW) / 2 },
        { translateY: originY + ((gx.value + gy.value) * tileH) / 2 + bob },
      ],
    };
  });

  if (!R) return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Animated.View style={[{ position: 'absolute', left: 0, top: 0, width: 0, height: 0 }, body]}>
        <Shadow cfg={shadow} tileW={tileW} ratio={ratio} alongX={false} parity={0} dirV={dirV} />
        <Shadow cfg={shadow} tileW={tileW} ratio={ratio} alongX parity={1} dirV={dirV} />
        {DIRS.map((d, i) => (
          <CarLayer
            key={d}
            car={car}
            index={i}
            dirKey={d}
            dirV={dirV}
            angle={ang}
            f={FWD[d]}
            ratio={ratio}
          />
        ))}
      </Animated.View>
    </View>
  );
}

export default React.memo(CarDriver);
