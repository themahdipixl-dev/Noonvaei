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

// ماشین‌های در حال حرکت. هر ماشین یک id دارد که با اسم پوشه‌ی عکس‌ها
// و کلید VEHICLES در environmentAssets.js یکی است.
const DEFAULT_CAR = {
  width: 110,          // عرض ماشین به px
  anchorY: 0.6,        // نقطه‌ی تماس با زمین: کسری از ارتفاع عکس (بالا=0، پایین=1)
  aspect: { sw: 1.43, se: 1.43, ne: 1.5, nw: 1.5 },          // عرض/ارتفاع هر عکس
  scale: { sw: 1, se: 1, ne: 1, nw: 1 },                      // تنظیم اندازه‌ی هر جهت
  offset: { sw: [0, 0], se: [0, 0], ne: [0, 0], nw: [0, 0] }, // جابه‌جایی [x, y] به px
  startAt: 0,          // شروع از کسری از مسیر (0 تا 1)
  route: [[4, 4], [15, 4], [15, 15], [4, 15]], // مختصات گرید؛ آخر خودکار به اول وصل می‌شه

  // راننده (واحد: tile و ثانیه)
  drive: {
    cruise: 2.2,        // سرعت معمول شهری
    accel: 1.1,         // شتاب
    brake: 1.4,         // ترمز معمولی (نرم)
    brakeMax: 3.2,      // ترمز اضطراری
    jerk: 2.4,          // هرچی کمتر، تغییر شتاب نرم‌تر
    cornerSpeed: 1.2,   // سرعت تو پیچ
    cornerRadius: 1.5,  // شعاع پیچ (tile)
    startDelay: 1.5,    // ثانیه‌ی ایستا در شروع
    reaction: 0.8,      // تأخیر راننده بعد از سبز شدن
    margin: 0.2,        // فاصله‌ی توقف تا خط
    halfLength: 0.85,   // نصف طول ماشین (برای توقف پشت خط)
  },

  // چراغ‌های فرضی (فعلاً فقط منطقشان هست و چیزی رسم نمی‌شه)
  // at: نقطه‌ی روی مسیر | offset: شروع چرخه (ثانیه)
  lights: [
    { at: [12, 4], cycle: { green: 8, yellow: 2.2, red: 8 }, offset: 4.8 },
    // { at: [15, 10], cycle: { green: 8, yellow: 2.2, red: 8 }, offset: 0 },
  ],

  // سایه روی زمین (طول و عرض به tile)
  shadow: { length: 1.9, width: 0.85, opacity: 0.3, dx: 3, dy: 2 },

  // رینگ‌ها: x,y = مرکز رینگ (کسری از عرض/ارتفاع عکس)، d = قطر دایره (کسری از عرض عکس)
  wheelCirc: 0.735,    // مسافت (tile) برای یک دور کامل چرخ
  rimScale: 1,
  debug: false,        // true = دور هر رینگ خط قرمز می‌کشه برای تنظیم
  rims: {
    sw: [{ x: 0.437, y: 0.895, d: 0.09 }, { x: 0.867, y: 0.54, d: 0.08 }],
    se: [{ x: 0.567, y: 0.9, d: 0.09 }, { x: 0.13, y: 0.543, d: 0.08 }],
    ne: [{ x: 0.455, y: 0.87, d: 0.09 }, { x: 0.895, y: 0.47, d: 0.08 }],
    nw: [{ x: 0.55, y: 0.875, d: 0.09 }, { x: 0.108, y: 0.468, d: 0.08 }],
  },
};

export const CARS = [
  { ...DEFAULT_CAR, id: 'peugeot_pars' },
];

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
