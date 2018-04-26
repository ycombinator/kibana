/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import {
  VERTEX_WIDTH_PX,
  VERTEX_HEIGHT_PX,
  VERTEX_BORDER_WIDTH_PX
} from './constants';

export function Edge({ edge }) {
  const { fromVertex, toVertex } = edge;

  const startX = fromVertex.position.x + (VERTEX_WIDTH_PX / 2);
  const startY = fromVertex.position.y + (VERTEX_HEIGHT_PX / 2);

  const endX = toVertex.position.x + (VERTEX_WIDTH_PX / 2);
  const endY = toVertex.position.y + (VERTEX_HEIGHT_PX / 2);

  const height = (endY - startY);
  const width = (endX - startX);

  let midX;
  let midY;

  const vertexHeightSansBorders = VERTEX_HEIGHT_PX - 2 * VERTEX_BORDER_WIDTH_PX;
  const vertexWidthSansBorders  = VERTEX_WIDTH_PX - 2 * VERTEX_BORDER_WIDTH_PX;

  if ((height / Math.abs(width)) > (vertexHeightSansBorders / vertexWidthSansBorders)) {
    // Entering from top
    const xOffset = (vertexHeightSansBorders / 2) * width / height;
    midX = endX - xOffset;
    midY = endY - (vertexHeightSansBorders / 2);
  } else if ((-height / Math.abs(width)) > (vertexHeightSansBorders / vertexWidthSansBorders)) {
    // Entering from bottom
    const xOffset = (vertexHeightSansBorders / 2) * width / height;
    midX = endX + xOffset;
    midY = endY + (vertexHeightSansBorders / 2);
  } else if (width > 0) {
    // Entering from the left
    const yOffset = (vertexWidthSansBorders / 2) * height / width;
    midX = endX - (vertexWidthSansBorders / 2);
    midY = endY - yOffset;
  } else {
    // Entering from the right
    const yOffset = (vertexWidthSansBorders / 2) * height / width;
    midX = endX + (vertexWidthSansBorders / 2);
    midY = endY + yOffset;
  }

  const d = `M ${startX} ${startY}`
    + ` L ${midX} ${midY}`
    + ` L ${endX} ${endY}`;

  return (
    <path
      d={d}
      stroke="#666666"
      markerMid="url(#arrowhead)"
    />
  );
}
