/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import {
  capitalize,
  isFunction,
  noop
} from 'lodash';
import {
  EuiPanel,
  EuiIcon,
  EuiFlexGroup,
  EuiFlexItem,
  EuiLink,
  EuiText,
  EuiTextColor,
  EuiIconTip
} from '@elastic/eui';
import { RemoveButton } from './remove_button';
import {
  VERTEX_WIDTH_PX,
  VERTEX_HEIGHT_PX,
  VERTEX_BORDER_WIDTH_PX
} from './constants';

export class Vertex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showActions: false
    };
  }

  showActions = () => {
    this.setState({
      showActions: true
    });
  }

  hideActions = (cb) => {
    cb = isFunction(cb) ? cb : noop;
    this.setState({
      showActions: false
    }, cb);
  }

  canStartEdge = () => {
    const { vertex, startEdgeFrom, edgeStartedFrom, hasTargetVertices } = this.props;
    return vertex.type !== 'input' && vertex.type !== 'output'
      && !edgeStartedFrom && startEdgeFrom
      && hasTargetVertices
      && this.state.showActions;
  }

  canEndStartedEdge = () => {
    const { vertex, edgeStartedFrom, endEdgeTo } = this.props;
    return edgeStartedFrom && endEdgeTo
      && vertex.canReceiveEdgeFrom(edgeStartedFrom);
  }

  startEdge = (edgeStartLabel) => {
    this.hideActions(() => this.props.startEdgeFrom(this.props.vertex, edgeStartLabel));
  }

  getSecondaryInfo = () => {
    return this.props.vertex.getSecondaryInfo ? this.props.vertex.getSecondaryInfo() : null;
  }

  getIconColor = (type) => {
    if (type === 'input') {
      return '#3185FC'; // euiColorVis1
    } else if (type === 'output') {
      return '#DB1374'; // euiColorVis2
    } else if (type === 'if') {
      return '#490092'; // euiColorVis3
    } else if (type === 'queue') {
      return '#FEB6DB'; // euiColorVis4
    } else if (type === 'filter') {
      return '#BFA180'; // euiColorVis6
    }
  }

  render() {
    const { vertex, configure, remove, edgeStartedFrom, endEdgeTo, startMove, moveProgress } = this.props;
    const iconType = `logstash${capitalize(vertex.type)}`;
    const icon = (
      <EuiIcon
        type={iconType}
        color={this.getIconColor(vertex.type)}
        size="m"
      />
    );

    const configureButton = (
      <EuiFlexItem grow={false}>
        <EuiIcon
          type="gear"
          onClick={() => configure(vertex)}
          size="s"
          color="subdued"
          style={{ cursor: "pointer" }}
        />
      </EuiFlexItem>
    );

    const removeButton = (
      <EuiFlexItem grow={false}>
        <RemoveButton
          objectToRemove={vertex}
          remove={remove}
        />
      </EuiFlexItem>
    );

    const edgeStartLabel = vertex.type === 'if' ? 'false' : undefined;
    const edgeStartButton = !moveProgress && this.canStartEdge()
      ? (
        <EuiFlexItem
          grow={false}
          style={{
            backgroundColor: '#d9d9d9',
            userSelect: 'none'
          }}
        >
          <EuiLink onClick={() => this.startEdge(edgeStartLabel)}>
            <EuiText size="xs">connect {edgeStartLabel} to...</EuiText>
          </EuiLink>
        </EuiFlexItem>
      )
      : null;

    const trueEdgeStartLabel = vertex.type === 'if' ? 'true' : undefined;
    const trueEdgeStartButton = !moveProgress && this.canStartEdge() && vertex.type === 'if'
      ? (
        <EuiFlexItem
          grow={false}
          style={{
            backgroundColor: '#d9d9d9',
            userSelect: 'none'
          }}
        >
          <EuiLink onClick={() => this.startEdge(trueEdgeStartLabel)}>
            <EuiText size="xs">connect true to...</EuiText>
          </EuiLink>
        </EuiFlexItem>
      )
      : null;

    const moveIcon = (
      <EuiFlexItem grow={false}>
        <EuiIcon
          type="grab"
          color="subdued"
          aria-label="Move"
          style={{ cursor: "move" }}
          size="s"
          onMouseDown={(e) => startMove(vertex, e.clientX, e.clientY)}
        />
      </EuiFlexItem>
    );

    const actions = !edgeStartedFrom && !moveProgress && this.state.showActions
      ? (
        <EuiFlexGroup
          gutterSize="xs"
          alignItems="center"
          justifyContent="flexEnd"
        >
          { configureButton }
          { removeButton }
        </EuiFlexGroup>
      )
      : null;

    const style = {
      width: VERTEX_WIDTH_PX,
      height: VERTEX_HEIGHT_PX,
      left: vertex.position.x,
      top: vertex.position.y,
      position: 'absolute',
      border: `${VERTEX_BORDER_WIDTH_PX}px solid rgba(0,0,0,0)`
    };

    if (this.canEndStartedEdge()) {
      style.border = `${VERTEX_BORDER_WIDTH_PX}px #0079A5 dotted`;
      style.cursor = 'pointer';
    }

    const notConfiguredTooltipMessage = (
      <EuiText color="ghost">
        This plugin isn&apos;t fully configured yet. Click
        &nbsp;<EuiIcon type="gear" size="s" color="subdued" />&nbsp;
         to finish configuring this plugin.
      </EuiText>
    );

    const notConfiguredIconStyle = {
      position: "absolute",
      right: -8,
      top: -8
    };
    const notConfiguredIcon = vertex.isConfigured
      ? null
      : (
        <div
          style={notConfiguredIconStyle}
        >
          <EuiIconTip
            position="right"
            content={notConfiguredTooltipMessage}
            color="danger"
            type="alert"
            aria-label="Warning"
          />
        </div>
      );

    const subTitleText = vertex.subTitle
      ? (
        <EuiTextColor
          color="secondary"
        >
          &nbsp;
          { vertex.subTitle }
        </EuiTextColor>
      )
      : null;

    return (
      <div
        style={style}
        onMouseEnter={this.showActions}
        onMouseLeave={this.hideActions}
        onClick={() => this.canEndStartedEdge() ? endEdgeTo(vertex) : null}
      >
        <EuiPanel
          paddingSize="s"
          grow={false}
        >
          <EuiFlexGroup
            gutterSize="m"
            alignItems="center"
          >
            <EuiFlexItem grow={false}>{ moveIcon }</EuiFlexItem>
            <EuiFlexItem grow={false}>{ icon }</EuiFlexItem>
            <EuiFlexItem
              grow={false}
              style={{ maxWidth: 125 }}
            >
              <EuiText
                size="xs"
                style={{ userSelect: 'none' }}
              >
                { vertex.name }
                { subTitleText }
              </EuiText>
            </EuiFlexItem>
            <EuiFlexItem>
              { actions }
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiPanel>
        <EuiFlexGroup
          alignItems="center"
          justifyContent="center"
        >
          { trueEdgeStartButton }
          { edgeStartButton }
          { notConfiguredIcon }
        </EuiFlexGroup>
      </div>
    );
  }
}
