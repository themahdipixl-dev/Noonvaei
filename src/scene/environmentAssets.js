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

// Car views (static image per direction).
const CAR_BASE =
  'https://raw.githubusercontent.com/themahdipixl-dev/Assets/main/assets/vehicles/car/';
const CAR_VER = '?v=1';
const c = (name) => ({ uri: CAR_BASE + name + CAR_VER });

export const CAR_VIEWS = {
  sw: c('car_sw.webp'),
  se: c('car_se.webp'),
  ne: c('car_ne.webp'),
  nw: c('car_nw.webp'),
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
  car: CAR_VIEWS,
  lavash: LAVASH,
};

// Preload everything so images don't pop in during gameplay.
export function preloadEnvironment() {
  const all = [
    ...BAKER_VIEWS,
    ...LAVASH,
    ...Object.values(BAKER_WALK),
    ENV.bakeryFront,
    ENV.bakeryBelt,
    ENV.bakeryCutter,
    ...Object.values(CAR_VIEWS),
  ];
  return Promise.all(all.map((s) => Image.prefetch(s.uri).catch(() => false)));
}
