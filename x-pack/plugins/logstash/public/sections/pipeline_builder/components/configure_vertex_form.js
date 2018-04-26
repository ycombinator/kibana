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
  EuiFieldPassword,
  EuiSelect,
  EuiSwitch,
  EuiButton
} from '@elastic/eui';

export class ConfigureVertexForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: props.vertex.settings.filter(setting => !setting.hasOwnProperty('isEditable') || setting.isEditable !== false)
    };
  }

  saveSettings = () => {
    const { vertex, onClose } = this.props;

    vertex.updateSettings(this.state.settings);
    onClose();
  }

  updateSetting = (name, value) => {
    const settings = this.state.settings;
    settings.find(setting => setting.name === name).value = value;
    this.setState({
      settings
    });
  }

  render() {
    const settings = this.state.settings;

    const fields = settings.map(setting => {
      let field;
      switch (setting.type) {
        case 'string':
        default:
          if (setting.oneOf) {
            field = (
              <EuiSelect
                name={setting.name}
                options={setting.oneOf.map(option => ({ value: option, text: option }))}
                value={setting.value || setting.defaultValue}
                onChange={(e) => this.updateSetting(setting.name, e.currentTarget.value)}
              />
            );
          } else {
            field = (
              <EuiFieldText
                name={setting.name}
                value={setting.value || setting.defaultValue}
                onChange={(e) => this.updateSetting(setting.name, e.currentTarget.value)}
              />
            );
          }
          break;

        case 'password':
          field = (
            <EuiFieldPassword
              name={setting.name}
              value={setting.value || setting.defaultValue}
              onChange={(e) => this.updateSetting(setting.name, e.currentTarget.value)}
            />
          );
          break;

        case 'number':
          field = (
            <EuiFieldNumber
              name={setting.name}
              value={setting.value || setting.defaultValue}
              onChange={(e) => this.updateSetting(setting.name, Number.parseFloat(e.currentTarget.value))}
            />
          );
          break;

        case 'boolean':
          field = (
            <EuiSwitch
              name={setting.name}
              checked={setting.value || setting.defaultValue}
              onChange={(e) => this.updateSetting(setting.name, e.currentTarget.checked)}
            />
          );
          break;
      }

      return (
        <EuiFormRow
          key={setting.name}
          label={setting.name}
          error={[ `${setting.name} is required` ]}
          isInvalid={!!setting.isRequired && !setting.value}
        >
          { field }
        </EuiFormRow>
      );
    });

    return (
      <EuiForm>
        { fields }
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
