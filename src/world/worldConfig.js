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

export const GROUND_COLOR = '#f3e6c8'; // cream ground of the whole environment
export const WORLD_BG = '#ecdcb8';     // slightly darker cream behind the ground

export const LOT_SIZE = 5;          // each bakery plaza is 5x5 tiles
export const LEVELS_PER_SEASON = 10; // TODO: tie to real season completion later

// Placement of the WEBP art. All numbers are FRACTIONS of the (square) image canvas, so they
// keep working whatever the pixel size of the exported images is. Tweak here if it looks off.
export const ART = {
  bakery: {
    floorW: 0.84,                 // width of the floor diamond / canvas width
    anchor: { x: 0.507, y: 0.54 } // floor centre inside the canvas
  },
  baker: {
    scale: 0.36,                  // baker canvas size / bakery canvas size
    feet: { x: 0.51, y: 0.70 },   // where the feet are inside the baker canvas
    at: { x: 0.6, y: 0.68 },      // where the feet stand inside the bakery canvas
  },
};

// mirror / awning / title are no longer used for drawing (the art is fixed WEBP) but kept
// so the rest of the game (season names etc.) keeps working.
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
