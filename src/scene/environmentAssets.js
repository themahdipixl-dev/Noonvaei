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
  f('Lavash1.webp'),
  f('Lavash2.webp'),
  f('Lavash3.webp'),
  f('Lavash4.webp'),
  f('Lavash5.webp'),
];

export const ENV = {
  bakeryFront: f('bakery_front.webp'),
  bakeryBelt: f('bakery_belt.webp'),
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
  ];
  return Promise.all(all.map((s) => Image.prefetch(s.uri).catch(() => false)));
}
