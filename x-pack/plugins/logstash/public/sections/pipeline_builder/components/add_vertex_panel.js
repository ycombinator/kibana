/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import { capitalize } from 'lodash';
import {
  EuiPortal,
  EuiFlyout,
  EuiFlyoutHeader,
  EuiTitle,
  EuiFlyoutBody,
  EuiForm,
  EuiFormRow,
  EuiFieldSearch,
  EuiDescriptionList,
  EuiDescriptionListTitle,
  EuiDescriptionListDescription,
  EuiButtonEmpty,
  EuiLink,
  EuiSpacer
} from '@elastic/eui';
import { makePluginDocumentationLink } from '../../../lib/documentation_links';

export class AddVertexPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      pluginLibrary: this.props.pluginLibrary.filter(plugin => plugin.type === this.props.type)
    };
  }

  filterPluginLibrary = (query) => {
    this.setState({ query });
  }

  normalizeDescription = (description) => {
    return capitalize(description.trim()) + (description.endsWith('.') ? '' : '.') + ' ';
  }

  render() {
    const { type, onClose, onSelect } = this.props;

    const query = this.state.query.toLowerCase();
    const plugins = this.state.pluginLibrary
      .filter(plugin => plugin.name.includes(query) || plugin.description.toLowerCase().includes(query))
      .map(plugin => (
        <React.Fragment key={plugin.name}>
          <EuiDescriptionListTitle>
            <EuiButtonEmpty
              size="xs"
              flush="left"
              onClick={() => onSelect({ type, name: plugin.name, settings: plugin.settings })}
            >
              { plugin.name }
            </EuiButtonEmpty>
          </EuiDescriptionListTitle>
          <EuiDescriptionListDescription>
            { this.normalizeDescription(plugin.description) }
            <EuiLink
              href={makePluginDocumentationLink(type, plugin.name)}
              target="_blank"
              color="secondary"
            >
              Learn more
            </EuiLink>
            .
          </EuiDescriptionListDescription>
        </React.Fragment>
      ));

    return (
      <EuiPortal>
        <EuiFlyout
          onClose={onClose}
          size="s"
          ownFocus
        >
          <EuiFlyoutHeader>
            <EuiTitle>
              <h2>Add new { type }</h2>
            </EuiTitle>
            <EuiSpacer />
            <EuiForm>
              <EuiFormRow>
                <EuiFieldSearch
                  placeholder="Search..."
                  value={this.state.query}
                  onChange={(e) => this.filterPluginLibrary(e.currentTarget.value)}
                />
              </EuiFormRow>
            </EuiForm>
          </EuiFlyoutHeader>
          <EuiFlyoutBody>
            <EuiDescriptionList>
              { plugins }
            </EuiDescriptionList>
          </EuiFlyoutBody>
        </EuiFlyout>
      </EuiPortal>
    );
  }
}
