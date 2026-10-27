// Isometric helpers. Grid (x, y) -> screen (px). z is height in px.
// ratio = tileH / tileW (2:1 game iso = 0.5, true isometric = 0.577)
export function makeProjector(tileW, originX, originY, ratio = 0.5) {
  const tileH = tileW * ratio;
  return (x, y, z = 0) => ({
    x: originX + ((x - y) * tileW) / 2,
    y: originY + ((x + y) * tileH) / 2 - z,
  });
}

export const pts = (arr) => arr.map((p) => `${p.x},${p.y}`).join(' ');

export function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v) => Math.max(0, Math.min(255, Math.round(v * f)));
  const r = c((n >> 16) & 255), g = c((n >> 8) & 255), b = c((n >> 0) & 255);
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

// Light comes from the top-left: left face lit, right face darker.
export function boxColors(base) {
  return { top: shade(base, 1.15), left: shade(base, 0.9), right: shade(base, 0.68) };
}
