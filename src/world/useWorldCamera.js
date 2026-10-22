// Pan + pinch-zoom camera using only built-in React Native APIs (no extra deps).
// Math: content is centered in the viewport; a content point at offset d from the
// content center ends up at viewportCenter + t + s * d.
import { useRef, useMemo, useCallback } from 'react';
import { Animated, PanResponder } from 'react-native';

export const MIN_SCALE = 0.45;
export const MAX_SCALE = 2.6;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

export function useWorldCamera({ contentW, contentH, focus, initialScale = 1 }) {
  const x = useRef(new Animated.Value(0)).current;
  const y = useRef(new Animated.Value(0)).current;
  const s = useRef(new Animated.Value(initialScale)).current;
  const viewRef = useRef(null);
  const cam = useRef({
    x: 0, y: 0, s: initialScale, vw: 0, vh: 0, ox: 0, oy: 0, mode: null, base: null, ready: false,
  }).current;
  const dims = useRef({ contentW, contentH, focus });
  dims.current = { contentW, contentH, focus };

  const commit = useCallback(() => {
    const { contentW: cw, contentH: ch } = dims.current;
    const mx = Math.max(0, (cw * cam.s - cam.vw) / 2);
    const my = Math.max(0, (ch * cam.s - cam.vh) / 2);
    cam.x = clamp(cam.x, -mx, mx);
    cam.y = clamp(cam.y, -my, my);
    x.setValue(cam.x);
    y.setValue(cam.y);
    s.setValue(cam.s);
  }, [cam, x, y, s]);

  const focusOn = useCallback((fx, fy, scale) => {
    cam.s = clamp(scale, MIN_SCALE, MAX_SCALE);
    cam.x = -cam.s * fx;
    cam.y = -cam.s * fy;
    commit();
  }, [cam, commit]);

  const measure = useCallback(() => {
    if (viewRef.current && viewRef.current.measureInWindow) {
      viewRef.current.measureInWindow((px, py) => { cam.ox = px; cam.oy = py; });
    }
  }, [cam]);

  const onLayout = useCallback((e) => {
    cam.vw = e.nativeEvent.layout.width;
    cam.vh = e.nativeEvent.layout.height;
    measure();
    if (!cam.ready) {
      cam.ready = true;
      const f = dims.current.focus;
      focusOn(f.dx, f.dy, initialScale);
    } else {
      commit();
    }
  }, [cam, measure, focusOn, commit, initialScale]);

  const zoomBy = useCallback((factor) => {
    const ns = clamp(cam.s * factor, MIN_SCALE, MAX_SCALE);
    const r = ns / cam.s;
    cam.x *= r;
    cam.y *= r;
    cam.s = ns;
    commit();
  }, [cam, commit]);

  const recenter = useCallback(() => {
    const f = dims.current.focus;
    focusOn(f.dx, f.dy, 1);
  }, [focusOn]);

  const panHandlers = useMemo(() => {
    const end = () => { cam.mode = null; };
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => { cam.mode = null; measure(); },
      onPanResponderMove: (e) => {
        const t = e.nativeEvent.touches;
        if (t.length >= 2) {
          const a = t[0], b = t[1];
          const dist = Math.hypot(a.pageX - b.pageX, a.pageY - b.pageY) || 1;
          const mx = (a.pageX + b.pageX) / 2 - cam.ox - cam.vw / 2;
          const my = (a.pageY + b.pageY) / 2 - cam.oy - cam.vh / 2;
          if (cam.mode !== 'pinch') {
            cam.mode = 'pinch';
            cam.base = { dist, mx, my, x: cam.x, y: cam.y, s: cam.s };
            return;
          }
          const b0 = cam.base;
          const ns = clamp((b0.s * dist) / b0.dist, MIN_SCALE, MAX_SCALE);
          const dx = (b0.mx - b0.x) / b0.s;
          const dy = (b0.my - b0.y) / b0.s;
          cam.s = ns;
          cam.x = mx - ns * dx;
          cam.y = my - ns * dy;
        } else if (t.length === 1) {
          const a = t[0];
          if (cam.mode !== 'pan') {
            cam.mode = 'pan';
            cam.base = { px: a.pageX, py: a.pageY, x: cam.x, y: cam.y };
            return;
          }
          cam.x = cam.base.x + (a.pageX - cam.base.px);
          cam.y = cam.base.y + (a.pageY - cam.base.py);
        }
        commit();
      },
      onPanResponderRelease: end,
      onPanResponderTerminate: end,
    }).panHandlers;
  }, [cam, commit, measure]);

  return { viewRef, onLayout, panHandlers, x, y, s, zoomBy, recenter };
}
