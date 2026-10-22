import React, { useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Polygon, Ellipse } from 'react-native-svg';
import { makeProjector, pts, boxColors } from './iso';
import IsoBox from './IsoBox';
import { Tanoor, TanoorFire } from './Tanoor';
import Baker from './Baker';
import { Steam, FloatCoins } from './Effects';
import { TANOOR } from './Tanoor';
import { formatRate } from '../ui/format';
import { PALETTE } from './palette';

const GRID = 5;
const SLAB = 14;
const TABLE = { x: 3.2, y: 0.5, w: 1.4, d: 0.9, h: 24 };

export default function Scene({ level, income, children }) {
  const { width } = useWindowDimensions();
  const height = 340;
  const tileW = Math.min(72, width / 5.6);
  const project = useMemo(() => makeProjector(tileW, width / 2, 80), [tileW, width]);

  const tiles = [];
  for (let i = 0; i < GRID; i++) {
    for (let j = 0; j < GRID; j++) {
      tiles.push(
        <Polygon
          key={`${i}-${j}`}
          points={pts([project(i, j), project(i + 1, j), project(i + 1, j + 1), project(i, j + 1)])}
          fill={(i + j) % 2 ? PALETTE.tileA : PALETTE.tileB}
          stroke={PALETTE.tileStroke}
          strokeWidth={1}
        />
      );
    }
  }

  // Loaves on the table: one more per level (max 6)
  const loaves = [];
  const count = Math.min(level, 6);
  for (let i = 0; i < count; i++) {
    const gx = TABLE.x + TABLE.w * (0.2 + 0.3 * (i % 3));
    const gy = TABLE.y + TABLE.d * (0.3 + 0.4 * Math.floor(i / 3));
    const p = project(gx, gy, TABLE.h);
    loaves.push(
      <React.Fragment key={i}>
        <Ellipse cx={p.x} cy={p.y - 1} rx={tileW * 0.13} ry={tileW * 0.06} fill={PALETTE.breadDark} />
        <Ellipse cx={p.x} cy={p.y - 3} rx={tileW * 0.13} ry={tileW * 0.055} fill={PALETTE.bread} />
      </React.Fragment>
    );
  }

  const bakerPos = project(1.0, 3.0, 0);
  const tp = project(TANOOR.x + TANOOR.w / 2, TANOOR.y + TANOOR.d / 2, TANOOR.h);

  return (
    <View style={[styles.wrap, { height }]}>
      <Svg width={width} height={height}>
        <IsoBox project={project} x={0} y={0} w={GRID} d={GRID} z={-SLAB} h={SLAB} colors={boxColors(PALETTE.slab)} />
        {tiles}
        <Tanoor project={project} />
        <IsoBox
          project={project}
          x={TABLE.x} y={TABLE.y} w={TABLE.w} d={TABLE.d} h={TABLE.h}
          colors={boxColors(PALETTE.wood)}
        />
        {loaves}
      </Svg>
      <TanoorFire project={project} width={width} height={height} />
      <Baker px={bakerPos.x} py={bakerPos.y} />
      <Steam x={tp.x} y={tp.y - 14} />
      <FloatCoins x={tp.x} y={tp.y - 40} text={'+' + formatRate(income)} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', marginTop: 8 },
});
