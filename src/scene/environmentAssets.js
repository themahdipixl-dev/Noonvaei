// WEBP environment images hosted in the Assets repo (themahdipixl-dev/Assets).
import { Image } from 'react-native';

const BASE =
  'https://raw.githubusercontent.com/themahdipixl-dev/Assets/main/assets/environment/';
const f = (name) => ({ uri: BASE + name });

// Walking baker sprite sheets (8 frames each, one sheet per direction).
// Bump WALK_VER when you re-upload the files (raw.githubusercontent caches for ~5 min).
const CHAR_BASE =
  'https://raw.githubusercontent.com/themahdipixl-dev/Assets/main/assets/characters/baker/';
const WALK_VER = '?v=2';
const w = (name) => ({ uri: CHAR_BASE + name + WALK_VER });

// Original (untouched) sheets: 8 equal cells each. feetY = typical foot line (px in the sheet).
export const BAKER_WALK_SHEETS = {
  sw: { w: 2400, h: 578, cellW: 300, feetY: 556 },
  se: { w: 2704, h: 647, cellW: 338, feetY: 631 },
  ne: { w: 2632, h: 534, cellW: 329, feetY: 508 },
  nw: { w: 2832, h: 634, cellW: 354, feetY: 605 },
};
export const BAKER_WALK_FRAMES = 8;
export const BAKER_WALK_REF_H = 560; // approx character height in the original sheets (px)

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
  ];
  return Promise.all(all.map((s) => Image.prefetch(s.uri).catch(() => false)));
}
