// Route geometry + a small driver model. Functions marked 'worklet' run on the UI thread.
export const DIRS = ['sw', 'se', 'ne', 'nw'];

export const moveDir = (dx, dy) => {
  const sx = dx - dy;
  const sy = dx + dy;
  return sy >= 0 ? (sx < 0 ? 0 : 1) : sx > 0 ? 2 : 3;
};

const mod = (a, n) => {
  'worklet';
  return ((a % n) + n) % n;
};

// Closed route with rounded corners, resampled every `step` tiles.
export function buildPath(points, radius = 1.3, step = 0.05, zonePad = 0.4) {
  const n = points.length;
  if (n < 3) return null;
  const BEZ = 20;
  const raw = [];
  const arcs = [];
  for (let i = 0; i < n; i++) {
    const p0 = points[(i + n - 1) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const l01 = Math.hypot(p0[0] - p1[0], p0[1] - p1[1]);
    const l12 = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
    const r = Math.min(radius, l01 / 2, l12 / 2);
    const ax = p1[0] + ((p0[0] - p1[0]) * r) / l01;
    const ay = p1[1] + ((p0[1] - p1[1]) * r) / l01;
    const bx = p1[0] + ((p2[0] - p1[0]) * r) / l12;
    const by = p1[1] + ((p2[1] - p1[1]) * r) / l12;
    const first = raw.length;
    for (let k = 0; k <= BEZ; k++) {
      const t = k / BEZ;
      const u = 1 - t;
      raw.push([
        u * u * ax + 2 * u * t * p1[0] + t * t * bx,
        u * u * ay + 2 * u * t * p1[1] + t * t * by,
      ]);
    }
    arcs.push([first, raw.length - 1, r]);
  }

  const m = raw.length;
  const cum = [0];
  for (let i = 1; i < m; i++) {
    cum.push(cum[i - 1] + Math.hypot(raw[i][0] - raw[i - 1][0], raw[i][1] - raw[i - 1][1]));
  }
  const L = cum[m - 1] + Math.hypot(raw[0][0] - raw[m - 1][0], raw[0][1] - raw[m - 1][1]);
  cum.push(L);

  // s = 0 is the end of the first corner (middle of a straight)
  const sOff = cum[arcs[0][1]];
  const N = Math.max(8, Math.round(L / step));
  const ds = L / N;
  const X = [];
  const Y = [];
  let seg = 0;
  for (let i = 0; i < N; i++) {
    const s = mod(sOff + i * ds, L);
    if (i === 0 || s < cum[seg]) seg = 0;
    while (seg < m - 1 && cum[seg + 1] <= s) seg++;
    const a = raw[seg];
    const b = raw[(seg + 1) % m];
    const len = cum[seg + 1] - cum[seg] || 1;
    const k = (s - cum[seg]) / len;
    X.push(a[0] + (b[0] - a[0]) * k);
    Y.push(a[1] + (b[1] - a[1]) * k);
  }
  const D = [];
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N;
    D.push(moveDir(X[j] - X[i], Y[j] - Y[i]));
  }

  // corner zones: [start, length]
  const zones = [];
  arcs.forEach(([a0, a1, r]) => {
    if (r <= 0.01) return;
    const arcLen = cum[a1] - cum[a0];
    zones.push([mod(cum[a0] - sOff - zonePad, L), arcLen + zonePad * 2]);
  });

  return { L, N, ds, X, Y, D, zones };
}

// light row: [sStop, green, yellow, red, offset]
export function buildLights(lights = [], path, halfLength = 0.85) {
  return lights.map((l) => {
    let best = 0;
    let bd = Infinity;
    for (let i = 0; i < path.N; i++) {
      const d = Math.hypot(path.X[i] - l.at[0], path.Y[i] - l.at[1]);
      if (d < bd) {
        bd = d;
        best = i;
      }
    }
    const c = l.cycle || {};
    return [
      mod(best * path.ds - halfLength, path.L),
      c.green ?? 8,
      c.yellow ?? 2.2,
      c.red ?? 8,
      l.offset || 0,
    ];
  });
}

// returns [state, secondsSinceGreen]  (0 green, 1 yellow, 2 red)
export function lightState(l, t) {
  'worklet';
  const pos = mod(t + l[4], l[1] + l[2] + l[3]);
  if (pos < l[1]) return [0, pos];
  if (pos < l[1] + l[2]) return [1, 0];
  return [2, 0];
}

// returns [gx, gy, dir]
export function pathAt(R, s) {
  'worklet';
  const f = mod(s, R.L) / R.ds;
  const fl = Math.floor(f);
  const i = fl % R.N;
  const j = (i + 1) % R.N;
  const k = f - fl;
  return [R.X[i] + (R.X[j] - R.X[i]) * k, R.Y[i] + (R.Y[j] - R.Y[i]) * k, R.D[i]];
}

// One physics step. returns [s, v, a]
export function stepCar(s, v, a, t, dt, R) {
  'worklet';
  const c = R.drive;
  const L = R.L;
  const p = mod(s, L);
  const plan = c.brake; // شتاب منفی نرم برای برنامه‌ریزی توقف
  let vLimit = c.cruise;
  let hold = false;

  // پیچ‌ها: قبل از پیچ به cornerSpeed برسد
  for (let i = 0; i < R.zones.length; i++) {
    const z = R.zones[i];
    const rel = mod(p - z[0], L);
    if (rel <= z[1]) {
      vLimit = Math.min(vLimit, c.cornerSpeed);
    } else {
      const d = L - rel;
      vLimit = Math.min(
        vLimit,
        Math.sqrt(c.cornerSpeed * c.cornerSpeed + 2 * plan * d)
      );
    }
  }

  // چراغ‌ها: توقف کامل پشت خط، ماندن تا سبز + زمان واکنش
  for (let i = 0; i < R.lights.length; i++) {
    const l = R.lights[i];
    const st = lightState(l, t);
    const d = mod(l[0] - p, L);
    if (d > L - 0.4) {
      if (st[0] !== 0 && v < 0.25) hold = true; // کمی رد شده و هنوز قرمزه
      continue;
    }
    let stop = st[0] !== 0 || (st[1] < c.reaction && v < 0.1);
    // زرد و خیلی نزدیک: رد می‌شه
    if (stop && st[0] === 1 && v > 0.4 && (v * v) / (2 * c.brakeMax) > d - c.margin) {
      stop = false;
    }
    if (!stop) continue;
    const dEff = d - c.margin;
    if (dEff <= 0.01 || (v < 0.08 && dEff < 0.45)) hold = true;
    vLimit = Math.min(vLimit, Math.sqrt(2 * plan * Math.max(dEff, 0)));
  }

  let vTarget = vLimit;
  if (hold || t < c.startDelay) vTarget = 0;

  const gain = c.gain || 4;
  let aDes = gain * (vTarget - v);
  aDes = Math.max(-c.brakeMax, Math.min(c.accel, aDes));

  const dj = c.jerk * dt;
  let na = a + Math.max(-dj, Math.min(dj, aDes - a));
  let nv = v + na * dt;
  if (nv < 0) {
    nv = 0;
    na = 0;
  }
  if (hold && nv < 0.05) {
    nv = 0;
    na = 0;
  }
  return [s + ((v + nv) / 2) * dt, nv, na];
}
