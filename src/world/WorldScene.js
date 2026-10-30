// Ground is one SVG; the bakery is RN <Image> layers on top of it.
import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import { makeProjector, pts } from '../scene/iso';
import Bakery from './Bakery';
import BakerWalker from './BakerWalker';
import CarDriver from './CarDriver';
import { WORLD, GROUND_COLOR, CENTER_LOT } from './worldConfig';

function WorldScene({ width, height }) {
  const { grid, tileW, padTop, ratio } = WORLD;
  const project = useMemo(
    () => makeProjector(tileW, width / 2, padTop, ratio),
    [tileW, width, padTop, ratio]
  );

  const ground = useMemo(
    () => pts([project(0, 0), project(grid, 0), project(grid, grid), project(0, grid)]),
    [project, grid]
  );

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Polygon points={ground} fill={GROUND_COLOR} />
      </Svg>
      <Bakery project={project} tileW={tileW} gx={CENTER_LOT.x} gy={CENTER_LOT.y} />
      <BakerWalker tileW={tileW} ratio={ratio} originX={width / 2} originY={padTop} lot={CENTER_LOT} />
      <CarDriver tileW={tileW} ratio={ratio} originX={width / 2} originY={padTop} />
    </View>
  );
}

export default React.memo(WorldScene);
