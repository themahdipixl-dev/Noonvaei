import React from 'react';
import { Polygon } from 'react-native-svg';
import { pts } from './iso';

// Box with 3 visible faces. Footprint (x,y,w,d) in grid units, z/h in px.
export default function IsoBox({ project, x, y, w = 1, d = 1, z = 0, h, colors }) {
  const T0 = project(x, y, z + h);
  const T1 = project(x + w, y, z + h);
  const T2 = project(x + w, y + d, z + h);
  const T3 = project(x, y + d, z + h);
  const B1 = project(x + w, y, z);
  const B2 = project(x + w, y + d, z);
  const B3 = project(x, y + d, z);
  return (
    <>
      <Polygon points={pts([T3, T2, B2, B3])} fill={colors.left} />
      <Polygon points={pts([T2, T1, B1, B2])} fill={colors.right} />
      <Polygon points={pts([T0, T1, T2, T3])} fill={colors.top} />
    </>
  );
}
