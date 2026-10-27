// Pan + pinch-zoom camera. Gestures and transform run on the UI thread (no JS per frame).
import { useRef, useMemo, useCallback } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

export const MIN_SCALE = 0.45;
export const MAX_SCALE = 2.6;

const clampN = (v, a, b) => {
  'worklet';
  return Math.min(b, Math.max(a, v));
};
const limit = (n, scale, content, view) => {
  'worklet';
  const m = Math.max(0, (content * scale - view) / 2);
  return Math.min(m, Math.max(-m, n));
};

export function useWorldCamera({ contentW, contentH, focus, initialScale = 1 }) {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const s = useSharedValue(initialScale);
  const vw = useSharedValue(0);
  const vh = useSharedValue(0);
  // gesture start snapshots
  const px = useSharedValue(0);
  const py = useSharedValue(0);
  const bs = useSharedValue(1);
  const bx = useSharedValue(0);
  const by = useSharedValue(0);
  const fx = useSharedValue(0);
  const fy = useSharedValue(0);
  const locked = useSharedValue(false);
  const ready = useRef(false);

  const gesture = useMemo(() => {
    const place = (nx, ny, ns) => {
      'worklet';
      x.value = limit(nx, ns, contentW, vw.value);
      y.value = limit(ny, ns, contentH, vh.value);
      s.value = ns;
    };

    const pan = Gesture.Pan()
      .maxPointers(1)
      .onStart(() => {
        px.value = x.value;
        py.value = y.value;
      })
      .onUpdate((e) => {
        place(px.value + e.translationX, py.value + e.translationY, s.value);
      });

    const pinch = Gesture.Pinch()
      .onTouchesUp(() => {
    // first finger lifted: stop applying focal changes (it jumps to the remaining finger)
      locked.value = true;
      })
      .onStart((e) => {
      locked.value = false;
        bs.value = s.value;
        bx.value = x.value;
        by.value = y.value;
        fx.value = e.focalX - vw.value / 2;
        fy.value = e.focalY - vh.value / 2;
      })
      .onUpdate((e) => {
      if (locked.value) return;
      const ns = clampN(bs.value * e.scale, MIN_SCALE, MAX_SCALE);
      const mx = e.focalX - vw.value / 2;
      const my = e.focalY - vh.value / 2;
      const dx = (fx.value - bx.value) / bs.value;
      const dy = (fy.value - by.value) / bs.value;
      place(mx - ns * dx, my - ns * dy, ns);
      });

    return Gesture.Simultaneous(pan, pinch);
  }, [contentW, contentH, x, y, s, vw, vh, px, py, bs, bx, by, fx, fy, locked]);

  const onLayout = useCallback(
    (e) => {
      const { width, height } = e.nativeEvent.layout;
      vw.value = width;
      vh.value = height;
      if (!ready.current) {
        ready.current = true;
        s.value = initialScale;
        x.value = limit(-initialScale * focus.dx, initialScale, contentW, width);
        y.value = limit(-initialScale * focus.dy, initialScale, contentH, height);
      } else {
        x.value = limit(x.value, s.value, contentW, width);
        y.value = limit(y.value, s.value, contentH, height);
      }
    },
    [vw, vh, s, x, y, contentW, contentH, focus.dx, focus.dy, initialScale]
  );

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }, { scale: s.value }],
  }));

  return { gesture, onLayout, style };
}
