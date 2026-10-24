// Season bakery. Drawn in LOCAL coords (0..5 tiles). `mirror` swaps x<->y which is an
// exact horizontal flip in isometric projection, so the building is the mirror image
// of the reference art. Light direction is preserved by swapping left/right shades.
import React from 'react';
import { Polygon, Ellipse, Circle, Rect, G, Text as SvgText } from 'react-native-svg';
import IsoBox from '../scene/IsoBox';
import { boxColors, shade, pts } from '../scene/iso';
import { PALETTE } from '../scene/palette';
import { FONTS } from '../ui/Fonts';

const Z = 7; // top of plaza slab

export default function Bakery({ project, tileW, gx, gy, mirror, season }) {
  const s = tileW / 96;
  const P = (x, y, z = 0) =>
    mirror ? project(gx + y, gy + x, z) : project(gx + x, gy + y, z);
  const C = (hex) => {
    const c = boxColors(hex);
    return mirror ? { top: c.top, left: c.right, right: c.left } : c;
  };
  // flat quad on a plane y = const (the front-left facing plane)
  const qy = (x0, x1, y, z0, z1) => pts([P(x0, y, z0), P(x1, y, z0), P(x1, y, z1), P(x0, y, z1)]);

  const [awA, awB] = season.awning;
  const angle = mirror ? -26.57 : 26.57;
  const sc = P(2.5, 3.62, 93);
  const bread = (x, y, z, k = 1) => {
    const p = P(x, y, z);
    return (
      <G key={`${x}-${y}-${z}`}>
        <Ellipse cx={p.x} cy={p.y} rx={tileW * 0.09 * k} ry={tileW * 0.04 * k} fill={PALETTE.breadDark} />
        <Ellipse cx={p.x} cy={p.y - 2 * s} rx={tileW * 0.09 * k} ry={tileW * 0.037 * k} fill={PALETTE.bread} />
      </G>
    );
  };
  const Person = ({ x, y, shirt, hat }) => {
    const b = P(x, y, Z);
    return (
      <G>
        <Ellipse cx={b.x} cy={b.y} rx={9 * s} ry={4 * s} fill="rgba(0,0,0,0.18)" />
        <Rect x={b.x - 4 * s} y={b.y - 14 * s} width={8 * s} height={14 * s} fill="#2f3a52" />
        <Rect x={b.x - 6 * s} y={b.y - 31 * s} width={12 * s} height={18 * s} rx={4 * s} fill={shirt} />
        <Circle cx={b.x} cy={b.y - 36 * s} r={5.5 * s} fill="#e2b48c" />
        {hat && <Rect x={b.x - 6 * s} y={b.y - 46 * s} width={12 * s} height={7 * s} rx={3 * s} fill="#fff" />}
      </G>
    );
  };

  const stripes = [];
  for (let i = 0; i < 8; i++) {
    const x0 = 0.5 + i * 0.5, x1 = x0 + 0.5;
    const col = i % 2 ? awB : awA;
    stripes.push(
      <G key={i}>
        <Polygon
          points={pts([P(x0, 3.6, 68), P(x1, 3.6, 68), P(x1, 4.9, 51), P(x0, 4.9, 51)])}
          fill={shade(col, 1.0)}
        />
        <Polygon points={qy(x0, x1, 4.9, 44, 51)} fill={shade(col, 0.8)} />
      </G>
    );
  }

  return (
    <G>
      {/* plaza + interior floor */}
      <IsoBox project={P} x={0} y={0} w={5} d={5} z={0} h={Z} colors={C('#cdb79a')} />
      <IsoBox project={P} x={0.5} y={0.5} w={4} d={4} z={Z} h={1} colors={C('#b98f5c')} />

      {/* back + side walls */}
      <IsoBox project={P} x={0.5} y={0.5} w={4} d={0.3} z={Z + 1} h={64} colors={C(PALETTE.brick)} />
      <IsoBox project={P} x={0.5} y={0.8} w={0.3} d={3.7} z={Z + 1} h={64} colors={C('#9a5a30')} />

      {/* chimney + oven */}
      <IsoBox project={P} x={3.0} y={0.9} w={0.5} d={0.5} z={Z + 30} h={46} colors={C('#7d726a')} />
      <IsoBox project={P} x={2.6} y={0.8} w={1.6} d={1.2} z={Z + 1} h={36} colors={C('#9a9288')} />
      <Polygon points={qy(3.0, 3.8, 2.0, Z + 8, Z + 30)} fill={PALETTE.mouth} />
      <Polygon
        points={pts([P(3.15, 2.0, Z + 9), P(3.65, 2.0, Z + 9), P(3.6, 2.0, Z + 18), P(3.4, 2.0, Z + 27), P(3.22, 2.0, Z + 18)])}
        fill={PALETTE.fire1}
      />
      <Polygon
        points={pts([P(3.3, 2.0, Z + 9), P(3.5, 2.0, Z + 9), P(3.46, 2.0, Z + 15), P(3.4, 2.0, Z + 20), P(3.33, 2.0, Z + 15)])}
        fill={PALETTE.fire2}
      />

      {/* bread rack on the side wall */}
      <IsoBox project={P} x={0.8} y={0.9} w={0.9} d={1.1} z={Z + 1} h={46} colors={C('#6b4420')} />
      {[14, 26, 38].map((z) => bread(1.05, 2.0, Z + z, 0.9))}
      {[14, 26, 38].map((z) => bread(1.45, 2.0, Z + z, 0.9))}

      {/* dough table */}
      <IsoBox project={P} x={1.1} y={2.5} w={1.5} d={0.9} z={Z + 1} h={20} colors={C(PALETTE.wood)} />
      {bread(1.5, 2.9, Z + 22, 0.8)}
      {bread(1.95, 2.95, Z + 22, 0.8)}
      {bread(2.3, 2.85, Z + 22, 0.8)}

      {/* display counter */}
      <IsoBox project={P} x={3.1} y={3.1} w={1.4} d={0.9} z={Z + 1} h={18} colors={C('#a9783f')} />
      {bread(3.45, 3.5, Z + 20)}
      {bread(3.85, 3.55, Z + 20)}
      {bread(4.2, 3.5, Z + 20)}

      {/* people */}
      <Person x={1.9} y={2.1} shirt="#4d8fd6" hat />
      <Person x={3.4} y={2.55} shirt="#e9eef5" hat />
      <Person x={2.4} y={4.8} shirt="#2f7d4a" />

      {/* front posts + striped awning */}
      <IsoBox project={P} x={0.5} y={4.7} w={0.18} d={0.18} z={Z + 1} h={44} colors={C('#6b4420')} />
      <IsoBox project={P} x={4.32} y={4.7} w={0.18} d={0.18} z={Z + 1} h={44} colors={C('#6b4420')} />
      {stripes}

      {/* sign board */}
      <Polygon points={qy(0.7, 4.3, 3.62, 70, 116)} fill="#6b3f1d" stroke="#3d2410" strokeWidth={3 * s} />
      <Polygon points={qy(0.85, 4.15, 3.62, 74, 112)} fill="#7f4c24" />
      {bread(2.5, 3.62, 123, 1.5)}
      <G transform={`translate(${sc.x} ${sc.y}) rotate(${angle})`}>
        <SvgText x={0} y={4 * s} fontSize={30 * s} fontFamily={FONTS.title} fill="#fff3d1" textAnchor="middle">
          {season.title}
        </SvgText>
        <SvgText x={0} y={22 * s} fontSize={14 * s} fontFamily={FONTS.regular} fill="#f1cf8c" textAnchor="middle">
          {season.sub}
        </SvgText>
      </G>
    </G>
  );
}
