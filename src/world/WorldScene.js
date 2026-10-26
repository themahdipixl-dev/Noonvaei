// The whole city as one SVG. Rendered once (memoized) – panning/zooming is done by
// transforming the parent view, so the SVG never re-renders while the camera moves.
import React, { useMemo } from 'react';
import Svg, { Polygon } from 'react-native-svg';
import { makeProjector, pts } from '../scene/iso';
import Bakery from './Bakery';
import { LockedLot } from './Props';
import { WORLD, SEASONS, LOT_SIZE, GROUND_COLOR } from './worldConfig';

function WorldScene({ width, height, unlocked }) {
  const { grid, tileW, padTop } = WORLD;
  const project = useMemo(() => makeProjector(tileW, width / 2, padTop), [tileW, width, padTop]);

  // One flat cream SVG ground for the whole environment.
  const ground = useMemo(
    () => pts([project(0, 0), project(grid, 0), project(grid, grid), project(0, grid)]),
    [project, grid]
  );

  // Back-to-front order so nearer bakeries overlap farther ones.
  const bakeries = SEASONS
    .map((se, i) => ({ se, i }))
    .filter(({ i }) => i < unlocked)
    .sort((a, b) => a.se.lot.x + a.se.lot.y - (b.se.lot.x + b.se.lot.y));

  return (
    <Svg width={width} height={height}>
      <Polygon points={ground} fill={GROUND_COLOR} />
      {SEASONS.map((se, i) =>
        i >= unlocked ? <LockedLot key={`l${se.id}`} project={project} tileW={tileW} lot={se.lot} id={se.id} /> : null
      )}
      {bakeries.map(({ se }) => (
        <Bakery key={`s${se.id}`} project={project} tileW={tileW} gx={se.lot.x} gy={se.lot.y} />
      ))}
    </Svg>
  );
}

export default React.memo(WorldScene);
