// Locked-lot marker (padlock + season label). The old SVG trees / buildings / roads were removed.
import React from 'react';
import { Polygon, Ellipse, Circle, Rect, G, Path, Text as SvgText } from 'react-native-svg';
import { pts } from '../scene/iso';
import { LOT_SIZE, seasonLabel } from './worldConfig';
import { FONTS } from '../ui/Fonts';

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
