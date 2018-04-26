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
} from '@elastic/eui';

const defaultSettings = {
  'pipeline.workers': undefined,
  'pipeline.batch.size': 125,
  'pipeline.batch.delay': 50
};

export class ConfigurePipelineInfoForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.pipeline.id,
      description: props.pipeline.description,
      settings: { ...defaultSettings, ...props.pipeline.settings }
    };
  }

  saveInfo = () => {
    const { pipeline, onClose } = this.props;

    pipeline.updateId(this.state.id);
    pipeline.updateDescription(this.state.description);
    pipeline.updateSettings(this.state.settings);
    onClose();
  };

  updateId = (id) => {
    this.setState({
      id
    });
  }

  updateDescription = (description) => {
    this.setState({
      description
    });
  }

  updateSetting = (name, value) => {
    const settings = this.state.settings;
    settings[name] = value;
    this.setState({
      settings
    });
  };

  render() {
    const { id, description, settings } = this.state;

    return (
      <EuiForm>
        <EuiFormRow
          label="Pipeline ID"
        >
          <EuiFieldText
            name="id"
            value={id}
            onChange={(e) => this.updateId(e.currentTarget.value)}
          />
        </EuiFormRow>

        <EuiFormRow
          label="Description"
        >
          <EuiFieldText
            name="description"
            value={description}
            onChange={(e) => this.updateDescription(e.currentTarget.value)}
          />
        </EuiFormRow>

        <EuiFormRow
          label="Pipeline workers"
        >
          <EuiFieldNumber
            name="pipeline.workers"
            value={settings['pipeline.workers']}
            onChange={(e) => this.updateSetting('pipeline.workers', parseInt(e.currentTarget.value))}
          />
        </EuiFormRow>

        <EuiFormRow
          label="Pipeline batch size"
        >
          <EuiFieldNumber
            name="pipeline.batch.size"
            value={settings['pipeline.batch.size']}
            onChange={(e) => this.updateSetting('pipeline.batch.size', parseInt(e.currentTarget.value))}
          />
        </EuiFormRow>

        <EuiFormRow
          label="Pipeline batch delay"
        >
          <EuiFieldNumber
            name="pipeline.batch.delay"
            value={settings['pipeline.batch.delay']}
            onChange={(e) => this.updateSetting('pipeline.batch.delay', parseInt(e.currentTarget.value))}
          />
        </EuiFormRow>

        <EuiButton
          type="submit"
          fill
          onClick={this.saveInfo}
        >
          Save
        </EuiButton>
      </EuiForm>
    );
  }
}
