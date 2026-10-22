// The whole city as one SVG. Rendered once (memoized) – panning/zooming is done by
// transforming the parent view, so the SVG never re-renders while the camera moves.
import React, { useMemo } from 'react';
import Svg, { Polygon } from 'react-native-svg';
import { makeProjector, pts, boxColors } from '../scene/iso';
import IsoBox from '../scene/IsoBox';
import Bakery from './Bakery';
import { Tree, Block, Roads, LockedLot } from './Props';
import { WORLD, SEASONS, TREES, BLOCKS, LOT_SIZE } from './worldConfig';

function WorldScene({ width, height, unlocked }) {
  const { grid, tileW, padTop } = WORLD;
  const project = useMemo(() => makeProjector(tileW, width / 2, padTop), [tileW, width, padTop]);

  const tiles = useMemo(() => {
    const out = [];
    for (let i = 0; i < grid; i++) {
      for (let j = 0; j < grid; j++) {
        out.push(
          <Polygon
            key={`${i}-${j}`}
            points={pts([project(i, j), project(i + 1, j), project(i + 1, j + 1), project(i, j + 1)])}
            fill={(i + j) % 2 ? '#9dca6d' : '#93c263'}
          />
        );
      }
    }
    return out;
  }, [project, grid]);

  const props = [];
  TREES.forEach(([x, y], i) =>
    props.push({ depth: x + y, node: <Tree key={`t${i}`} project={project} tileW={tileW} x={x} y={y} k={0.9 + ((i * 37) % 5) / 20} /> })
  );
  BLOCKS.forEach((b, i) =>
    props.push({ depth: b.x + b.y + (b.w + b.d) / 2, node: <Block key={`b${i}`} project={project} b={b} /> })
  );
  SEASONS.forEach((se, i) => {
    if (i < unlocked) {
      props.push({
        depth: se.lot.x + se.lot.y + LOT_SIZE,
        node: <Bakery key={`s${se.id}`} project={project} tileW={tileW} gx={se.lot.x} gy={se.lot.y} mirror={se.mirror} season={se} />,
      });
    }
  });
  props.sort((a, b) => a.depth - b.depth);

  return (
    <Svg width={width} height={height}>
      <IsoBox project={project} x={0} y={0} w={grid} d={grid} z={-26} h={26} colors={boxColors('#a9783f')} />
      {tiles}
      <Roads project={project} tileW={tileW} grid={grid} />
      {SEASONS.map((se, i) =>
        i >= unlocked ? <LockedLot key={`l${se.id}`} project={project} tileW={tileW} lot={se.lot} id={se.id} /> : null
      )}
      {props.map((p) => p.node)}
    </Svg>
  );
}

export default React.memo(WorldScene);
