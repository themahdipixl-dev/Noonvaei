// Small scenery pieces: trees, buildings, roads, roundabout, locked lots.
import React from 'react';
import { Polygon, Ellipse, Circle, Rect, G, Path, Polyline, Text as SvgText } from 'react-native-svg';
import IsoBox from './../scene/IsoBox';
import { boxColors, pts } from '../scene/iso';
import { LOT_SIZE, seasonLabel } from './worldConfig';
import { FONTS } from '../ui/Fonts';

export function Tree({ project, tileW, x, y, k = 1 }) {
  const s = (tileW / 96) * k;
  const b = project(x, y, 0);
  return (
    <G>
      <Ellipse cx={b.x} cy={b.y} rx={18 * s} ry={8 * s} fill="rgba(0,0,0,0.16)" />
      <Rect x={b.x - 3.5 * s} y={b.y - 26 * s} width={7 * s} height={26 * s} fill="#7a4a24" />
      <Circle cx={b.x} cy={b.y - 42 * s} r={21 * s} fill="#4f9a3c" />
      <Circle cx={b.x - 12 * s} cy={b.y - 32 * s} r={15 * s} fill="#5fb04a" />
      <Circle cx={b.x + 13 * s} cy={b.y - 33 * s} r={14 * s} fill="#5fb04a" />
      <Circle cx={b.x - 5 * s} cy={b.y - 50 * s} r={9 * s} fill="#86c95f" />
    </G>
  );
}

export function Block({ project, b }) {
  const colors = boxColors(b.color);
  const wins = [];
  const floors = Math.max(1, Math.floor((b.h - 16) / 22));
  for (let f = 0; f < floors; f++) {
    const z0 = 10 + f * 22, z1 = z0 + 12;
    for (let c = 0; c < 2; c++) {
      const u0 = b.x + b.w * (0.15 + c * 0.45), u1 = u0 + b.w * 0.25;
      wins.push(
        <Polygon key={`l${f}${c}`} fill="#8fc3da"
          points={pts([project(u0, b.y + b.d, z0), project(u1, b.y + b.d, z0), project(u1, b.y + b.d, z1), project(u0, b.y + b.d, z1)])} />
      );
      const v0 = b.y + b.d * (0.15 + c * 0.45), v1 = v0 + b.d * 0.25;
      wins.push(
        <Polygon key={`r${f}${c}`} fill="#5f93ab"
          points={pts([project(b.x + b.w, v0, z0), project(b.x + b.w, v1, z0), project(b.x + b.w, v1, z1), project(b.x + b.w, v0, z1)])} />
      );
    }
  }
  const sh = project(b.x + b.w / 2 + 0.3, b.y + b.d / 2 + 0.3, 0);
  return (
    <G>
      <IsoBox project={project} x={b.x} y={b.y} w={b.w} d={b.d} z={0} h={b.h} colors={colors} />
      {wins}
      <IsoBox project={project} x={b.x - 0.08} y={b.y - 0.08} w={b.w + 0.16} d={b.d + 0.16} z={b.h} h={6} colors={boxColors(b.roof)} />
    </G>
  );
}

const quad = (project, x0, y0, x1, y1, fill, z = 0) => (
  <Polygon
    points={pts([project(x0, y0, z), project(x1, y0, z), project(x1, y1, z), project(x0, y1, z)])}
    fill={fill}
  />
);

const isoEllipse = (project, tileW, cx, cy, r, fill, z = 0, key) => {
  const p = project(cx, cy, z);
  return <Ellipse key={key} cx={p.x} cy={p.y} rx={0.707 * r * tileW} ry={0.354 * r * tileW} fill={fill} />;
};

export function Roads({ project, tileW, grid }) {
  const N = grid;
  const a = project(0, 9.8), b = project(N, 9.8), c = project(9.8, 0), d = project(9.8, N);
  const dash = [10 * (tileW / 96), 10 * (tileW / 96)];
  return (
    <G>
      {quad(project, 0, 8.7, N, 10.9, '#d8cdb8')}
      {quad(project, 8.7, 0, 10.9, N, '#d8cdb8')}
      {quad(project, 0, 9, N, 10.6, '#5b5f6b')}
      {quad(project, 9, 0, 10.6, N, '#5b5f6b')}
      <Polyline points={`${a.x},${a.y} ${b.x},${b.y}`} stroke="#f5d76e" strokeWidth={2} strokeDasharray={dash} />
      <Polyline points={`${c.x},${c.y} ${d.x},${d.y}`} stroke="#f5d76e" strokeWidth={2} strokeDasharray={dash} />
      {isoEllipse(project, tileW, 9.8, 9.8, 1.5, '#d8cdb8', 0, 'r1')}
      {isoEllipse(project, tileW, 9.8, 9.8, 1.25, '#5b5f6b', 0, 'r2')}
      {isoEllipse(project, tileW, 9.8, 9.8, 0.8, '#8cc25f', 0, 'r3')}
      {isoEllipse(project, tileW, 9.8, 9.8, 0.45, '#cfd8dc', 4, 'r4')}
      {isoEllipse(project, tileW, 9.8, 9.8, 0.36, '#6cc3e0', 6, 'r5')}
    </G>
  );
}

export function LockedLot({ project, tileW, lot, id }) {
  const s = tileW / 96;
  const c = project(lot.x + LOT_SIZE / 2, lot.y + LOT_SIZE / 2, 0);
  const corners = [
    project(lot.x, lot.y), project(lot.x + LOT_SIZE, lot.y),
    project(lot.x + LOT_SIZE, lot.y + LOT_SIZE), project(lot.x, lot.y + LOT_SIZE),
  ];
  return (
    <G>
      <Polygon points={pts(corners)} fill="rgba(255,255,255,0.28)" stroke="#fff8e1" strokeWidth={3 * s}
        strokeDasharray={[14 * s, 8 * s]} />
      <Ellipse cx={c.x} cy={c.y + 4 * s} rx={26 * s} ry={9 * s} fill="rgba(0,0,0,0.15)" />
      <Path
        d={`M ${c.x - 8 * s} ${c.y - 20 * s} v ${-9 * s} a ${8 * s} ${8 * s} 0 0 1 ${16 * s} 0 v ${9 * s}`}
        stroke="#7a3b0c" strokeWidth={4 * s} fill="none"
      />
      <Rect x={c.x - 14 * s} y={c.y - 22 * s} width={28 * s} height={22 * s} rx={5 * s} fill="#e0a02a" stroke="#7a3b0c" strokeWidth={2.5 * s} />
      <Circle cx={c.x} cy={c.y - 12 * s} r={3.2 * s} fill="#7a3b0c" />
      <SvgText x={c.x} y={c.y + 26 * s} fontSize={18 * s} fontFamily={FONTS.bold} fill="#5a3a1a" textAnchor="middle">
        {seasonLabel(id)}
      </SvgText>
    </G>
  );
}
