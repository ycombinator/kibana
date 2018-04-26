/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import {
  EuiPortal,
  EuiFlyout,
  EuiFlyoutHeader,
  EuiTitle,
  EuiFlyoutBody,
  EuiLink,
  EuiSpacer
} from '@elastic/eui';

export function ConfigurePanel({ onClose, formComponent, title, documentation }) {
  const documentationLink = documentation
    ? (
      <React.Fragment>
        <EuiSpacer size="xs" />
        <EuiLink
          href={documentation.link}
          target="_blank"
        >
          { documentation.label }
        </EuiLink>
      </React.Fragment>
    )
    : null;

  return (
    <EuiPortal>
      <EuiFlyout
        onClose={onClose}
        size="s"
        ownFocus
      >
        <EuiFlyoutHeader>
          <EuiTitle>
            <h2>Configure { title }</h2>
          </EuiTitle>
          { documentationLink }
        </EuiFlyoutHeader>
        <EuiFlyoutBody>
          { formComponent }
        </EuiFlyoutBody>
      </EuiFlyout>
    </EuiPortal>
  );
}
