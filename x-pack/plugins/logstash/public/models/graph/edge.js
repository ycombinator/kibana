/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

export class Edge {
  constructor(fromVertex, toVertex, label) {
    this.fromVertex = fromVertex;
    this.toVertex = toVertex;
    this.label = label;

    fromVertex.outgoingEdges.push(this);
    toVertex.incomingEdges.push(this);
  }

  toJSON = () => {
    return {
      from: this.fromVertex.id,
      to: this.toVertex.id,
      label: this.label
    };
  }

}
