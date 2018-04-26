/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { Vertex } from "./vertex";

export class QueueVertex extends Vertex {
  constructor(position) {
    const settings = [
      { name: 'id', value: '__QUEUE__', isEditable: false }
    ];
    super('queue', 'queue', settings, position);

    this.queueType = 'memory';
  }

  setQueueType(queueType) {
    this.queueType = queueType;
  }

  get subTitle() {
    return this.queueType;
  }
}
