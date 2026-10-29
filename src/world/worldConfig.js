import { toFa } from '../ui/format';

export const WORLD = {
  grid: 20,
  tileW: 96,
  ratio: 0.577,   // tileH / tileW  ← با تصویر webp هماهنگ کن (پایین رو بخون)
  padX: 140,
  padTop: 200,
  padBottom: 100,
};

export const GROUND_COLOR = '#f3e6c8';
export const WORLD_BG = '#ecdcb8';

export const LOT_SIZE = 5;
export const LEVELS_PER_SEASON = 10;

// تنها مغازه: وسط زمین
export const CENTER_LOT = {
  x: (WORLD.grid - LOT_SIZE) / 2,
  y: (WORLD.grid - LOT_SIZE) / 2,
};

export const ART = {
  bakery: {
    floorW: 0.84,
    anchor: { x: 0.507, y: 0.54 },
  },
  baker: {
    scale: 0.28,                  // قبلاً 0.36 — کوچیک‌تر شد
    feet: { x: 0.51, y: 0.70 },
    at: { x: 0.6, y: 0.68 },
  },
};

// کاراکتر نانوای در حال راه رفتن
export const WALKER = {
  charH: 64,     // ارتفاع کاراکتر روی نقشه (px)
  speed: 0.6,    // خانه بر ثانیه (قبلاً 1.2)
  stride: 0.06,  // هر چند خانه یک فریم عوض بشه؛ سرعت فریم = speed / stride = 10 فریم بر ثانیه
  path: [
    [13.5, 8],
    [13.5, 13.5],
    [8, 13.5],
    [13.5, 13.5],
    [13.5, 8],
  ],
};

// همه فصل‌ها روی همون مغازه‌ی وسط هستن
export const SEASONS = [
  { id: 1, title: 'نان تازه', sub: 'سنگک',   lot: CENTER_LOT },
  { id: 2, title: 'نان داغ',  sub: 'بربری',  lot: CENTER_LOT },
  { id: 3, title: 'نان لواش', sub: 'لواش',   lot: CENTER_LOT },
  { id: 4, title: 'تافتون',   sub: 'تافتون', lot: CENTER_LOT },
];

export const seasonLabel = (id) => `فصل ${toFa(id)}`;

export function currentSeasonIndex(level) {
  const i = Math.floor((Math.max(1, level) - 1) / LEVELS_PER_SEASON);
  return Math.min(i, SEASONS.length - 1);
}
