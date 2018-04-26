/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import uuid from 'uuid';

// Assumption: currentSettings is a superset of newSettings
function mergeSettings(currentSettings = [], newSettings = []) {
  return currentSettings.map(currentSetting => {
    const name = currentSetting.name;
    const newSetting = newSettings.find(setting => setting.name === name);
    if (newSetting) {
      currentSetting.value = newSetting.value;
    }
    return currentSetting;
  });
}
export class Vertex {
  constructor(type, name, settings, position) {
    this.type = type; // input, filter, output, if, queue
    this.name = name; // stdin, elasticsearch, etc.
    this.settings = settings;
    this.position = position; // { x, y } of center
    this.incomingEdges = [];
    this.outgoingEdges = [];
  }

  setPosition = (newPosition) => {
    this.position = newPosition;
  }

  updateSettings = (newSettings) => {
    this.settings = mergeSettings(this.settings, newSettings);
  }

  hasEdgeFrom = (anotherVertex) => {
    return this.incomingEdges.find(e => e.fromVertex === anotherVertex);
  }

  removeIncomingEdge = (edge) => {
    this.incomingEdges = this.incomingEdges.filter(e => e !== edge);
  }

  removeOutgoingEdge = (edge) => {
    this.outgoingEdges = this.outgoingEdges.filter(e => e !== edge);
  }

  canReceiveEdgeFrom = (vertex) => {
    return this.type !== 'input'
      && this.type !== 'queue'
      && this !== vertex
      && !this.hasEdgeFrom(vertex);
  }

  get id() {
    return this.settings.find(setting => setting.name === 'id').value;
  }

  get isConfigured() {
    return this.settings.reduce((isConfiguredSoFar, setting) => isConfiguredSoFar && (!setting.isRequired || !!setting.value), true);
  }

  toJSON = () => {
    const settings = this.settings
      .filter(setting => !!setting.value)
      .map(setting => ({ name: setting.name, value: setting.value }));

    return {
      type: this.type,
      name: this.name,
      settings,
      position: this.position
    };
  }

  static fromArchetype({ type, name, settings }) {
    const mySettings = settings.map(setting => ({ ...setting }));
    mySettings.find(setting => setting.name === 'id').value = uuid.v4();
    return new Vertex(type, name, mySettings);
  }
}
