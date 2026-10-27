// WEBP environment images hosted in the Assets repo (themahdipixl-dev/Assets).
import { Image } from 'react-native';

const BASE =
  'https://raw.githubusercontent.com/themahdipixl-dev/Assets/main/assets/environment/';
const f = (name) => ({ uri: BASE + name });

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
  lavash: LAVASH,
};

// Preload everything so images don't pop in during gameplay.
export function preloadEnvironment() {
  const all = [
    ...BAKER_VIEWS,
    ...LAVASH,
    ENV.bakeryFront,
    ENV.bakeryBelt,
    ENV.bakeryCutter,
  ];
  return Promise.all(all.map((s) => Image.prefetch(s.uri).catch(() => false)));
}
