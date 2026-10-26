// Season bakery, drawn from the WEBP art in the Assets repo (see src/scene/environmentAssets.js).
// Layers (all share the same canvas, so no per-layer offsets are needed):
//   bakery_front -> bakery_belt -> Lavash1 (static for now) -> baker_view1 (static, scaled down).
import React from 'react';
import { Image as SvgImage } from 'react-native-svg';
import { ENV } from '../scene/environmentAssets';
import { LOT_SIZE, ART } from './worldConfig';

export default function Bakery({ project, tileW, gx, gy }) {
  // Centre of the lot's floor on screen.
  const c = project(gx + LOT_SIZE / 2, gy + LOT_SIZE / 2, 0);

  // Square canvas size so the art's floor diamond fills exactly LOT_SIZE x LOT_SIZE tiles.
  const S = (LOT_SIZE * tileW) / ART.bakery.floorW;
  const x = c.x - ART.bakery.anchor.x * S;
  const y = c.y - ART.bakery.anchor.y * S;

  // Baker: smaller canvas, "feet" point placed at ART.baker.at (fractions of the bakery canvas).
  const B = S * ART.baker.scale;
  const bx = x + ART.baker.at.x * S - ART.baker.feet.x * B;
  const by = y + ART.baker.at.y * S - ART.baker.feet.y * B;

  return (
    <>
      <SvgImage href={ENV.bakeryFront} x={x} y={y} width={S} height={S} preserveAspectRatio="xMidYMid meet" />
      <SvgImage href={ENV.bakeryBelt} x={x} y={y} width={S} height={S} preserveAspectRatio="xMidYMid meet" />
      <SvgImage href={ENV.lavash[0]} x={x} y={y} width={S} height={S} preserveAspectRatio="xMidYMid meet" />
      <SvgImage href={ENV.bakerViews[0]} x={bx} y={by} width={B} height={B} preserveAspectRatio="xMidYMid meet" />
    </>
  );
}
