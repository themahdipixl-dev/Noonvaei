// Static configuration of the big world map + seasons.
// Each season (chapter) owns one bakery lot. Finishing a season unlocks the next lot.
import { toFa } from '../ui/format';

export const WORLD = {
  grid: 20,        // world is grid x grid tiles
  tileW: 96,       // px width of one iso tile at scale 1
  padX: 140,
  padTop: 200,
  padBottom: 100,
};

export const LOT_SIZE = 5;          // each bakery plaza is 5x5 tiles
export const LEVELS_PER_SEASON = 10; // TODO: tie to real season completion later

// mirror: true => bakery is flipped horizontally compared to the reference art.
export const SEASONS = [
  { id: 1, title: 'نان تازه', sub: 'سنگک',  lot: { x: 3,  y: 12 }, mirror: true, awning: ['#d9534f', '#f6e7c1'] },
  { id: 2, title: 'نان داغ',  sub: 'بربری', lot: { x: 12, y: 3  }, mirror: true, awning: ['#1d8b8b', '#f6e7c1'] },
  { id: 3, title: 'نان لواش', sub: 'لواش',  lot: { x: 3,  y: 3  }, mirror: true, awning: ['#e8892a', '#fff3d1'] },
  { id: 4, title: 'تافتون',   sub: 'تافتون', lot: { x: 12, y: 12 }, mirror: true, awning: ['#7b4bb7', '#f6e7c1'] },
];

export const seasonLabel = (id) => `فصل ${toFa(id)}`;

export function currentSeasonIndex(level) {
  const i = Math.floor((Math.max(1, level) - 1) / LEVELS_PER_SEASON);
  return Math.min(i, SEASONS.length - 1);
}

// Scenery (grid coords)
export const TREES = [
  [0.8, 1], [0.8, 5], [0.8, 14], [0.8, 18], [19.2, 2], [19.2, 6], [19.2, 14], [19.2, 18],
  [2, 0.8], [6, 0.8], [13, 0.8], [17, 0.8], [2, 19.2], [6, 19.2], [13, 19.2], [17, 19.2],
  [8.3, 5], [8.3, 14], [11.3, 6], [11.3, 15], [5.5, 8.3], [15, 8.3], [5.5, 11.3], [15, 11.3],
  [10, 1.5], [10, 18.5], [1.5, 10], [18.5, 10],
];

// Other places in the city: apartments, cafe, shops
export const BLOCKS = [
  { x: 17.4, y: 12.4, w: 2, d: 2, h: 46, color: '#e7b48a', roof: '#c9553d', name: 'cafe' },
  { x: 17.4, y: 15.6, w: 2, d: 2, h: 80, color: '#d9c6a3', roof: '#8a6a4a', name: 'apt' },
  { x: 0.4,  y: 6.2,  w: 2, d: 2, h: 68, color: '#c8a98a', roof: '#8a4a25', name: 'apt' },
  { x: 0.4,  y: 12.6, w: 2, d: 2.2, h: 52, color: '#e2cfa8', roof: '#a9783f', name: 'shop' },
  { x: 13.2, y: 0.4,  w: 2, d: 2, h: 58, color: '#d8b4a0', roof: '#7a4a3a', name: 'shop' },
  { x: 17.4, y: 3.2,  w: 2, d: 2, h: 74, color: '#cdbb9a', roof: '#5d6b7a', name: 'apt' },
];
