/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import {
  EuiButton,
  EuiPanel,
  EuiSpacer,
  EuiIcon,
  EuiText
} from '@elastic/eui';

export class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { openAddVertexPanel, addIfVertex, configurePipelineInfo, savePipeline, pipeline } = this.props;

    const top = Math.max(80 - this.state.windowScrollY, 10) || 10;
    const menuStyle = {
      position: "fixed",
      right: 10,
      top,
      backgroundColor: '#F5F5F5'
    };

    const buttonStyle = {
      width: "100%",
      backgroundColor: "#FFFFFF"
    };

    let pipelineConfigurationErrorMessage = null;
    if (!pipeline.isConfigured) {
      pipelineConfigurationErrorMessage = (
        <span>
          This pipeline isn&apos;t fully configured yet.
          Follow the <EuiIcon type="alert" size="m" color="danger" /> icons on your pipeline.
        </span>
      );
    } else if (pipeline.vertices.length > 0 && pipeline.vertices.filter(vertex => vertex.type === 'input').length === 0) {
      pipelineConfigurationErrorMessage = (
        <span>This pipeline has no inputs. Add one by clicking the &ldquo;add input plugin&rdquo; button above.</span>
      );
    } else if (pipeline.vertices.length > 0 && !pipeline.id) {
      pipelineConfigurationErrorMessage = (
        <span>This pipeline has no ID. Set one by clicking the &ldquo;basic info and settings&rdquo; button above.</span>
      );
    }

    const pipelineConfigurationError = pipelineConfigurationErrorMessage
      ? (
        <React.Fragment>
          <EuiSpacer size="xs" />
          <EuiText
            style={{ maxWidth: 170 }}
            color="danger"
          >
            { pipelineConfigurationErrorMessage }
          </EuiText>
        </React.Fragment>
      )
      : null;

    return (
      <EuiPanel
        grow={false}
        style={menuStyle}
      >
        <EuiButton
          iconType="logstashInput"
          size="s"
          onClick={() => openAddVertexPanel('input')}
          style={buttonStyle}
        >
          add input plugin
        </EuiButton>
        <EuiSpacer size="s" />
        <EuiButton
          iconType="logstashFilter"
          size="s"
          onClick={() => openAddVertexPanel('filter')}
          style={buttonStyle}
        >
          add filter plugin
        </EuiButton>
        <EuiSpacer size="s" />
        <EuiButton
          iconType="logstashOutput"
          size="s"
          onClick={() => openAddVertexPanel('output')}
          style={buttonStyle}
        >
          add output plugin
        </EuiButton>
        <EuiSpacer size="s" />
        <EuiButton
          iconType="logstashIf"
          size="s"
          onClick={addIfVertex}
          style={buttonStyle}
        >
          add if statement
        </EuiButton>
        <EuiSpacer size="l" />
        <EuiButton
          size="s"
          onClick={configurePipelineInfo}
          style={buttonStyle}
        >
          basic info and settings
        </EuiButton>
        <EuiSpacer size="l" />
        <EuiButton
          onClick={savePipeline}
          size="s"
          fill
          style={{ width: "100%" }}
          isDisabled={pipeline.vertices.length === 0 || !!pipelineConfigurationError}
        >
          save and deploy
        </EuiButton>
        { pipelineConfigurationError }
      </EuiPanel>
    );
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateVerticalScroll);
    window.addEventListener('scroll', this.updateVerticalScroll);
    this.updateVerticalScroll();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateVerticalScroll);
    window.removeEventListener('scroll', this.updateVerticalScroll);
  }

  updateVerticalScroll = () => {
    this.setState({ windowScrollY: window.scrollY });
  }
}
