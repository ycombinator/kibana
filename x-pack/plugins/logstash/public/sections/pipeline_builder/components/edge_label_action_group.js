/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import { EdgeLabelAction } from './edge_label_action';

export function EdgeLabelActionGroup({ pipeline, removeEdge, edgeStartedFrom, isMoveInProgress }) {
  const edgeLabelActions = pipeline.edges.map(edge => (
    <EdgeLabelAction
      key={`${edge.fromVertex.id}_${edge.toVertex.id}`}
      edge={edge}
      remove={removeEdge}
      edgeStartedFrom={edgeStartedFrom}
      isMoveInProgress={isMoveInProgress}
    />
  ));

  return (
    <div>
      { edgeLabelActions }
    </div>
  );
}
