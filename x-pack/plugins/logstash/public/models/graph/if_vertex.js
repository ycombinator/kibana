/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import uuid from 'uuid';
import { Vertex } from ".";

export class IfVertex extends Vertex {
  constructor(position) {
    const settings = [
      { name: 'id', value: uuid.v4(), isEditable: false },
      { name: 'condition', value: '' }
    ];
    super('if', 'if', settings, position);
  }

  get subTitle() {
    return this.settings.find(setting => setting.name === 'condition').value;
  }
}
