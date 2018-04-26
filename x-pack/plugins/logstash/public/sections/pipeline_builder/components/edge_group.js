/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import { Edge } from './edge';

export function EdgeGroup({ pipeline, width, height }) {
  if (!width || !height) {
    return null;
  }

  const edges = pipeline.edges.map(edge => (
    <Edge
      key={`${edge.fromVertex.id}_${edge.toVertex.id}`}
      edge={edge}
    />
  ));

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
    >
      <defs>
        <marker
          id="arrowhead"
          markerHeight="8"
          markerWidth="8"
          stroke="#666666"
          orient="auto"
          refX="8"
          refY="4"
          fill="#666666"
        >
          <path d="M 0,0 L 8,4 L 0,8 L 0,0" />
        </marker>
      </defs>
      { edges }
    </svg>
  );
}
