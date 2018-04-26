/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import {
  EuiIcon
} from '@elastic/eui';

export function RemoveButton({ objectToRemove, remove }) {
  if (!remove) {
    return null;
  }

  return (
    <EuiIcon
      type="trash"
      onClick={() => remove(objectToRemove)}
      size="s"
      color="subdued"
      style={{ cursor: "pointer" }}
    />
  );
}
