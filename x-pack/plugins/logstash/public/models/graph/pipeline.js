/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { QueueVertex } from './queue_vertex';
import { Edge } from './edge';

const maxReducer = (maxSoFar, value) => Math.max(maxSoFar, value);

export class Pipeline {
  constructor() {
    this.vertices = [];
    this.edges = [];
    this.settings = {};
  }

  get queueVertex() {
    return this.vertices.find(vertex => vertex.type === 'queue');
  }

  addVertex = (vertex) => {
    if (vertex.type === 'input') {
      return this.addInputVertex(vertex);
    } else {
      return this.addProcessorVertex(vertex);
    }
  }

  addInputVertex = (inputVertex) => {
    inputVertex.position = this.getNextInputPosition();
    this.vertices.push(inputVertex);

    // If there is no queue vertex, add one
    const queueVertex = this.queueVertex || this.addQueueVertex();

    // Make edge from new input vertex to queue vertex
    this.edges.push(new Edge(inputVertex, queueVertex));
  }

  addProcessorVertex = (processorVertex) => {
    processorVertex.position = this.getNextProcessorPosition();
    this.vertices.push(processorVertex);
  }

  addQueueVertex = () => {
    const queueVertex = new QueueVertex(this.getQueuePosition());
    this.vertices.push(queueVertex);
    return queueVertex;
  }

  addEdge(fromVertex, toVertex, label) {
    const edge = new Edge(fromVertex, toVertex, label);
    this.edges.push(edge);
  }

  getMaxInputPosition = () => {
    const inputVertices = this.vertices
      .filter(vertex => vertex.type === 'input');

    const maxX = inputVertices
      .map(vertex => vertex.position.x)
      .reduce(maxReducer, -1);
    const maxY = inputVertices
      .map(vertex => vertex.position.y)
      .reduce(maxReducer, -1);

    return {
      x: maxX,
      y: maxY
    };
  }

  getNextInputPosition = () => {
    const maxInputPosition = this.getMaxInputPosition();
    const nextX = maxInputPosition.x === -1 ? 0 : maxInputPosition.x + 320;
    const nextY = maxInputPosition.y === -1 ? 0 : maxInputPosition.y;

    return {
      x: nextX,
      y: nextY
    };
  }

  getQueuePosition = () => {
    const maxInputPosition = this.getMaxInputPosition();
    return {
      x: 0,
      y: maxInputPosition.y + 100
    };
  }

  removeVertex = (vertex) => {
    this.vertices = this.vertices.filter(v => v !== vertex);
    this.edges = this.edges.filter(edge => edge.fromVertex !== vertex && edge.toVertex !== vertex);


    // Remove queue vertex if last input vertex was just removed
    const inputVertices = this.vertices.filter(v => v.type === 'input');
    if (inputVertices.length === 0) {
      const queueVertex = this.queueVertex;

      this.vertices = this.vertices.filter(v => v !== this.queueVertex);
      this.edges = this.edges.filter(edge => edge.fromVertex !== queueVertex && edge.toVertex !== queueVertex);
    }
  }

  removeEdge = (edge) => {
    this.edges = this.edges.filter(e => e !== edge);
    edge.fromVertex.removeOutgoingEdge(edge);
    edge.toVertex.removeIncomingEdge(edge);
  }

  getMaxProcessorPosition = () => {
    const nonInputVertices = this.vertices
      .filter(vertex => vertex.type !== 'input');

    const maxX = nonInputVertices
      .map(vertex => vertex.position.x)
      .reduce(maxReducer, -1);
    const maxY = nonInputVertices
      .map(vertex => vertex.position.y)
      .reduce(maxReducer, -1);

    return {
      x: maxX,
      y: maxY
    };
  }

  getNextProcessorPosition = () => {
    const maxPosition = this.getMaxProcessorPosition();
    if (maxPosition.y === -1) {
      // No other vertices exist
      return {
        x: maxPosition.x,
        y: 200
      };
    }

    return {
      x: maxPosition.x,
      y: maxPosition.y + 100
    };
  }

  updateSettings = (newSettings) => {
    this.settings = newSettings;

    const queueType = this.settings['queue.type'];
    if (queueType) {
      this.queueVertex.setQueueType(queueType);
    }
  }

  updateId = (newId) => {
    this.id = newId;
  }

  updateDescription = (newDescription) => {
    this.description = newDescription;
  }

  get isConfigured() {
    const areAllVerticesConfigured = this.vertices.reduce((isConfiguredSoFar, vertex) => isConfiguredSoFar && vertex.isConfigured, true);
    return areAllVerticesConfigured;
  }

  toJSON = () => {
    return {
      id: this.id,
      description: this.description,
      pipeline: {
        vertices: this.vertices.map(vertex => vertex.toJSON()),
        edges: this.edges.map(edge => edge.toJSON())
      },
      settings: this.settings
    };
  }
}
