// WEBP environment images hosted in the Assets repo (themahdipixl-dev/Assets).
import { Image } from 'react-native';

const BASE =
  'https://raw.githubusercontent.com/themahdipixl-dev/Assets/main/assets/environment/';
const f = (name) => ({ uri: BASE + name });

// Walking baker sprite sheets (8 frames each, one sheet per direction).
// Bump WALK_VER when you re-upload the files (raw.githubusercontent caches for ~5 min).
const CHAR_BASE =
  'https://raw.githubusercontent.com/themahdipixl-dev/Assets/main/assets/characters/baker/';
const WALK_VER = '?v=3';
const w = (name) => ({ uri: CHAR_BASE + name + WALK_VER });

// All 4 sheets share the same layout: 8 cells of cellW x cellH,
// feet point = (cellW / 2, feetY), character height inside a cell = refH.
export const BAKER_WALK_SHEET = {
  frames: 8,
  cellW: 196,
  cellH: 314,
  feetY: 296,
  refH: 288,
};

export const BAKER_WALK = {
  sw: w('baker_walk_sw.webp'),
  se: w('baker_walk_se.webp'),
  ne: w('baker_walk_ne.webp'),
  nw: w('baker_walk_nw.webp'),
};

// Baker camera views.
export const BAKER_VIEWS = [
  f('baker_view1.webp'),
  f('baker_view2.webp'),
  f('baker_view3.webp'),
  f('baker_view4.webp'),
];

// Vehicles: assets/vehicles/<id>/<id>_<dir>.webp  (dir = sw | se | ne | nw)
// Bump VEHICLE_VER when you re-upload the files.
const VEHICLE_BASE =
  'https://raw.githubusercontent.com/themahdipixl-dev/Assets/main/assets/vehicles/';
const VEHICLE_VER = '?v=2';
const vehicleViews = (id) => {
  const out = {};
  ['sw', 'se', 'ne', 'nw'].forEach((d) => {
    out[d] = { uri: `${VEHICLE_BASE}${id}/${id}_${d}.webp${VEHICLE_VER}` };
  });
  return out;
};

export const VEHICLES = {
  peugeot_pars: vehicleViews('peugeot_pars'),
  // next car: samand: vehicleViews('samand'),
};

// Rim image (square, transparent corners): assets/vehicles/<id>/<id>_rim.webp
export const VEHICLE_RIMS = {
  peugeot_pars: {
    1: { uri: `${VEHICLE_BASE}peugeot_pars/peugeot_pars_rim_1.webp${VEHICLE_VER}` },
    2: { uri: `${VEHICLE_BASE}peugeot_pars/peugeot_pars_rim_2.webp${VEHICLE_VER}` },
  },
};

// Lavash bread stages (1 -> 5).
export const LAVASH = [
  f('bakery_bread_1.webp'),
  f('bakery_bread_2.webp'),
  f('bakery_bread_3.webp'),
  f('bakery_bread_4.webp'),
  f('bakery_bread_5.webp'),
];

export const ENV = {
  bakeryFront: f('bakery_front.webp'),
  bakeryBelt: f('bakery_belt.webp'),
  bakeryCutter: f('bakery_cutter.webp'),
  bakerViews: BAKER_VIEWS,
  bakerWalk: BAKER_WALK,
  vehicles: VEHICLES,
  vehicleRims: VEHICLE_RIMS,
  lavash: LAVASH,
};

// Preload everything so images don't pop in during gameplay.
export function preloadEnvironment() {
  const all = [
    ...BAKER_VIEWS,
    ...LAVASH,
    ...Object.values(BAKER_WALK),
    ...Object.values(VEHICLES).flatMap((v) => Object.values(v)),
    ...Object.values(VEHICLE_RIMS),
    ENV.bakeryFront,
    ENV.bakeryBelt,
    ENV.bakeryCutter,
  ];
  return Promise.all(all.map((s) => Image.prefetch(s.uri).catch(() => false)));
}
