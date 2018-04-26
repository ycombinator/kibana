/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import {
  EuiForm,
  EuiFormRow,
  EuiFieldText,
  EuiFieldNumber,
  EuiButton,
  EuiRadioGroup
} from '@elastic/eui';

const defaultSettings = {
  'queue.type': 'memory',
  'queue.checkpoint.writes': 1024,
  'queue.max_bytes': '1gb'
};

export class ConfigureQueueVertexForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: { ...defaultSettings, ...props.pipeline.settings }
    };
  }

  saveSettings = () => {
    const { pipeline, onClose } = this.props;

    pipeline.updateSettings(this.state.settings);
    onClose();
  };

  updateSetting = (name, value) => {
    const settings = this.state.settings;
    settings[name] = value;
    this.setState({
      settings
    });
  };

  render() {
    const settings = this.state.settings;

    const queueTypes = [
      {
        id: 'memory',
        label: 'Memory'
      },
      {
        id: 'persistent',
        label: 'Persistent'
      }
    ];

    return (
      <EuiForm>
        <EuiFormRow
          label="Type"
        >
          <EuiRadioGroup
            options={queueTypes}
            idSelected={settings['queue.type']}
            onChange={(queueTypeId) => this.updateSetting('queue.type', queueTypeId)}
          />
        </EuiFormRow>

        <EuiFormRow
          label="Checkpoint writes"
        >
          <EuiFieldNumber
            name="queue.checkpoint.writes"
            value={settings['queue.checkpoint.writes']}
            onChange={(e) => this.updateSetting('queue.checkpoint.writes', parseInt(e.currentTarget.value))}
          />
        </EuiFormRow>

        <EuiFormRow
          label="Max. bytes"
        >
          <EuiFieldText
            name="queue.max_bytes"
            value={settings['queue.max_bytes']}
            onChange={(e) => this.updateSetting('queue.max_bytes', e.currentTarget.value)}
          />
        </EuiFormRow>

        <EuiButton
          type="submit"
          fill
          onClick={this.saveSettings}
        >
          Save
        </EuiButton>
      </EuiForm>
    );
  }
}
