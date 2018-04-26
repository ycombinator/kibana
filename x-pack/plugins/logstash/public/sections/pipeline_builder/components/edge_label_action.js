/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import {
  EuiFlexItem,
  EuiFlexGroup,
  EuiText
} from '@elastic/eui';
import { RemoveButton } from './remove_button';
import {
  VERTEX_WIDTH_PX,
  VERTEX_HEIGHT_PX
} from './constants';

export class EdgeLabelAction extends React.Component {
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

  hideActions = () => {
    this.setState({
      showActions: false
    });
  }

  render() {
    const { edge, remove, edgeStartedFrom, isMoveInProgress } = this.props;
    const { fromVertex, toVertex, label: labelText } = edge;
    const isRemovable = !(edge.fromVertex.type === 'input' && edge.toVertex.type === 'queue');

    if (!isRemovable && !labelText) {
      return null;
    }

    const showActions = this.state.showActions && !edgeStartedFrom && !isMoveInProgress;

    const startX = fromVertex.position.x + (VERTEX_WIDTH_PX / 2);
    const startY = fromVertex.position.y + (VERTEX_HEIGHT_PX / 2);

    const endX = toVertex.position.x + (VERTEX_WIDTH_PX / 2);
    const endY = toVertex.position.y + (VERTEX_HEIGHT_PX / 2);

    const width = labelText ? 90 : 40;
    const height = 32;
    const containerTop = startY;
    const containerWidth = width / 2;
    const containerLeft = startX - (containerWidth / 2);

    const containerStyle = {
      position: 'absolute',
      top: containerTop,
      left: containerLeft,
      width: containerWidth,
      height: Math.hypot((endX - startX), (endY - startY)),
      transformOrigin: `top 0`,
      transform: `rotate(${-Math.atan2((endX - startX), (endY - startY))}rad)`
    };

    const containerDiv = (
      <div
        style={containerStyle}
        onMouseEnter={this.showActions}
        onMouseLeave={this.hideActions}
      />
    );

    if (!labelText && !showActions) {
      return containerDiv;
    }

    const label = labelText
      ? (
        <EuiFlexItem
          grow={false}
          style={{ userSelect: 'none' }}
        >
          <EuiText
            size="xs"
            color="secondary"
          >
            { labelText }
          </EuiText>
        </EuiFlexItem>
      )
      : null;

    const removeButton = isRemovable
      ? (
        <EuiFlexItem
          grow={false}
        >
          {
            showActions
              ? (
                <RemoveButton
                  objectToRemove={edge}
                  remove={remove}
                />
              )
              : null
          }
        </EuiFlexItem>
      )
      : null;
    const actions = removeButton;

    const top = ((startY + endY) / 2) - (height / 2);
    const left = ((startX + endX) / 2) - (width / 2);

    const style = {
      position: 'absolute',
      top,
      left,
      width,
      height,
      backgroundColor: '#d9d9d9'
    };

    return (
      <React.Fragment>
        { containerDiv }
        <EuiFlexGroup
          alignItems="center"
          justifyContent="center"
          gutterSize="xs"
          style={style}
          onMouseEnter={this.showActions}
          onMouseLeave={this.hideActions}
        >
          { label }
          { actions }
        </EuiFlexGroup>
      </React.Fragment>
    );
  }
}
