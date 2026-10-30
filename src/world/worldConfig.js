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
  charH: 56,     // همون مقدار فعلی خودت
  speed: 0.6,
  stride: 0.06,
  dirScale: { sw: 1, se: 1, ne: 1, nw: 1 },
    // نمای ایستا (baker_view1..4) موقع مکث
  idleScale: { sw: 1, se: 1, ne: 1, nw: 1 }, // قد نمای ایستا نسبت به قد کاراکتر در حال راه رفتن
  idleOffset: { sw: [0, 0], se: [0, 0], ne: [0, 0], nw: [0, 0] }, // جابه‌جایی [x, y] به px
  shadow: {
    width: 0.62,
    opacity: 0.38,
    offsetX: 0,
    offsetY: -1,
  },
  debug: false, // true = نقطه‌های توقف رو با دایره‌ی قرمز نشون می‌ده
  // نقطه‌ها به مختصات عکس bakery_front.webp هستن (کسری از عرض و ارتفاع، بین 0 و 1).
  // بعد از آخرین نقطه، خودکار به اولی برمی‌گرده.
  // wait: مکث به ثانیه | face: جهت نگاه موقع مکث ('sw' | 'se' | 'ne' | 'nw')
  stops: [
    { p: [0.586, 0.606], wait: 4, face: 'ne' }, // کنار میز توری جلوی تسمه
    { p: [0.476, 0.668], wait: 4, face: 'nw' }, // کنار میز توری دم ورودی
  ],
};

// ماشین در حال حرکت دور مغازه
export const CAR = {
  width: 110,          // عرض ماشین به px (بزرگ/کوچیکش کن)
  anchorY: 0.6,        // نقطه‌ی تماس با زمین: کسری از ارتفاع عکس (بالا=0، پایین=1)
  speed: 1.4,          // خونه (tile) در ثانیه
  aspect: { sw: 1.43, se: 1.43, ne: 1.5, nw: 1.5 }, // عرض/ارتفاع هر عکس
  scale: { sw: 1, se: 1, ne: 1, nw: 1 },            // تنظیم اندازه‌ی هر جهت
  offset: { sw: [0, 0], se: [0, 0], ne: [0, 0], nw: [0, 0] }, // جابه‌جایی [x, y] به px
  shadow: { width: 0.8, opacity: 0.22, offsetY: 0 },
  // مسیر به مختصات گرید (۰ تا ۲۰). آخرین نقطه خودکار به اولی وصل می‌شه.
  route: [[4, 4], [15, 4], [15, 15], [4, 15]],
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
