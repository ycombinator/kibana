/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import {
  EuiPage,
  EuiPageBody
} from '@elastic/eui';
import { AddVertexPanel } from './add_vertex_panel';
import { ConfigurePanel } from './configure_panel';
import { Vertex } from './vertex';
import {
  Vertex as VertexModel,
  IfVertex as IfVertexModel,
  QueueVertex as QueueVertexModel,
} from '../../../models/graph';
import { EdgeGroup } from './edge_group';
import { EdgeLabelActionGroup } from './edge_label_action_group';
import { Menu } from './menu';
import {
  VERTEX_WIDTH_PX,
  VERTEX_HEIGHT_PX
} from './constants';
import { ConfigureVertexForm } from './configure_vertex_form';
import { ConfigureQueueVertexForm } from './configure_queue_vertex_form';
import { ConfigurePipelineInfoForm } from './configure_pipeline_info_form';
import { makePluginDocumentationLink } from '../../../lib/documentation_links';
import { IntroText } from './intro_text';

export class PipelineBuilder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      window: {},
      loggyHasBeenSeen: false
    };
    this.requestAnimationFrameTimeout = undefined;
  }

  openAddVertexPanel = (type) => {
    this.setState({
      addVertex: { type }
    });
  }

  closeAddVertexPanel = () => {
    this.setState({
      addVertex: undefined
    });
  }

  loggyHasBeenSeen = () => {
    this.setState({
      loggyHasBeenSeen: true
    });
  }

  onVertexSelect = (archetype) => {
    const vertex = VertexModel.fromArchetype(archetype);
    this.props.pipeline.addVertex(vertex);
    this.closeAddVertexPanel();
    this.loggyHasBeenSeen();
  }

  addIfVertex = () => {
    const vertex = new IfVertexModel();
    this.props.pipeline.addVertex(vertex);
    this.closeAddVertexPanel();
    this.loggyHasBeenSeen();
  }

  configurePipelineInfo = () => {
    this.setState({
      configurePipelineInfo: true
    });
  }

  closeConfigurePanel = () => {
    this.setState({
      configureVertex: undefined,
      configurePipelineInfo: undefined
    });
  }

  configureVertex = (vertex) => {
    this.setState({
      configureVertex: vertex
    });
  }

  removeVertex = (vertex) => {
    this.setState({
      removingVertex: true
    });
    this.props.pipeline.removeVertex(vertex);
    this.setState({
      removingVertex: false
    });
  }

  getPossibleStartedEdgeEndVertices = (fromVertex) => {
    return this.props.pipeline.vertices
      .filter(vertex => vertex.canReceiveEdgeFrom(fromVertex));
  }

  vertexHasTargetVertices = (fromVertex) => {
    const possibleEndVertices = this.getPossibleStartedEdgeEndVertices(fromVertex);
    return possibleEndVertices.length > 0;
  }

  startEdgeFrom = (fromVertex, edgeLabel) => {
    this.setState({
      edgeStartedFrom: fromVertex,
      edgeLabel: edgeLabel
    });
  }

  endEdgeTo = (toVertex) => {
    const fromVertex = this.state.edgeStartedFrom;
    const edgeLabel = this.state.edgeLabel;
    this.props.pipeline.addEdge(fromVertex, toVertex, edgeLabel);
    this.setState({
      edgeStartedFrom: undefined,
      edgeLabel: undefined
    });
  }

  abandonEdge = () => {
    this.setState({
      edgeStartedFrom: undefined,
      edgeLabel: undefined
    });
  }

  startVertexMove = (vertex, cursorClientX, cursorClientY) => {
    this.setState({
      vertexMove: {
        vertex,
        startX: cursorClientX,
        startY: cursorClientY
      }
    });
  }

  onCursorMove = (e, cursorClientX, cursorClientY) => {
    const vertexMove = { ...this.state.vertexMove };

    const vertexBeingMoved = vertexMove.vertex;
    vertexBeingMoved.position.x += cursorClientX - this.state.vertexMove.startX;
    vertexBeingMoved.position.y += cursorClientY - this.state.vertexMove.startY;

    if (vertexBeingMoved.position.x < 0) {
      vertexBeingMoved.position.x = 0;
      return this.endVertexMove();
    }

    if (vertexBeingMoved.position.y < 0) {
      vertexBeingMoved.position.y = 0;
      return this.endVertexMove();
    }

    if (vertexBeingMoved.position.x + VERTEX_WIDTH_PX > this.canvasWidth) {
      vertexBeingMoved.position.x = this.canvasWidth - VERTEX_WIDTH_PX;
      return this.endVertexMove();
    }

    if (vertexBeingMoved.position.y + VERTEX_HEIGHT_PX > this.canvasHeight) {
      vertexBeingMoved.position.y = this.canvasHeight - VERTEX_HEIGHT_PX;
      return this.endVertexMove();
    }

    vertexMove.startX = cursorClientX;
    vertexMove.startY = cursorClientY;

    if (this.requestAnimationFrameTimeout) {
      window.cancelAnimationFrame(this.requestAnimationFrameTimeout);
    }

    this.requestAnimationFrameTimeout = window.requestAnimationFrame(() => this.setState({ vertexMove }));
  }

  endVertexMove = () => {
    this.setState({
      vertexMove: undefined
    });
  }

  getMoveProgress = () => {
    return !!this.state.vertexMove;
  }

  removeEdge = (edge) => {
    this.setState({
      removingEdge: true
    });
    this.props.pipeline.removeEdge(edge);
    this.setState({
      removingEdge: false
    });
  }

  savePipeline = () => {
    console.log(JSON.stringify(this.props.pipeline.toJSON(), null, 2));
  }

  render() {
    const { pipeline } = this.props;

    const introText = pipeline.vertices.length === 0 && !this.state.loggyHasBeenSeen ? <IntroText /> : null;

    const addVertexPanel = this.state.addVertex
      ? (
        <AddVertexPanel
          type={this.state.addVertex.type}
          pluginLibrary={this.props.pluginLibrary}
          onClose={this.closeAddVertexPanel}
          onSelect={this.onVertexSelect}
        />
      )
      : null;

    const configureVertexForm = this.state.configureVertex instanceof QueueVertexModel
      ? (
        <ConfigureQueueVertexForm
          pipeline={pipeline}
          onClose={this.closeConfigurePanel}
        />
      )
      : (
        <ConfigureVertexForm
          vertex={this.state.configureVertex}
          onClose={this.closeConfigurePanel}
        />
      );

    let configureVertexDocumentation = null;
    if (this.state.configureVertex) {
      if (!(this.state.configureVertex instanceof QueueVertexModel) && !(this.state.configureVertex instanceof IfVertexModel)) {
        configureVertexDocumentation = {
          link: makePluginDocumentationLink(this.state.configureVertex.type, this.state.configureVertex.name, true),
          label: 'Plugin settings documentation'
        };
      }
    }

    const configurePipelineInfoForm = (
      <ConfigurePipelineInfoForm
        pipeline={this.props.pipeline}
        onClose={this.closeConfigurePanel}
      />);

    const configureVertexPanel = !this.state.configureVertex
      ? null
      : (
        <ConfigurePanel
          onClose={this.closeConfigurePanel}
          formComponent={configureVertexForm}
          title={this.state.configureVertex.name}
          documentation={configureVertexDocumentation}
        />
      );

    const configurePipelineInfoPanel = !this.state.configurePipelineInfo
      ? null
      : (
        <ConfigurePanel
          onClose={this.closeConfigurePanel}
          formComponent={configurePipelineInfoForm}
          title="basic info and settings"
        />
      );

    // TODO: move filter logic into Pipeline class as part of getter
    const inputsAndProcessors = pipeline.vertices
      .filter(vertex => vertex.type !== 'queue')
      .map(vertex => (
        <Vertex
          key={vertex.id}
          vertex={vertex}
          configure={this.configureVertex}
          remove={this.removeVertex}
          hasTargetVertices={this.vertexHasTargetVertices(vertex)}
          startEdgeFrom={this.startEdgeFrom}
          edgeStartedFrom={this.state.edgeStartedFrom}
          endEdgeTo={this.endEdgeTo}
          startMove={this.startVertexMove}
          moveProgress={this.getMoveProgress()}
        />
      ));

    // TODO: move find logic into Pipeline class as part of getter
    const queueVertex = pipeline.vertices
      .find(vertex => vertex.type === 'queue');
    const queue = queueVertex
      ? (
        <Vertex
          vertex={queueVertex}
          configure={this.configureVertex}
          hasTargetVertices={this.vertexHasTargetVertices(queueVertex)}
          startEdgeFrom={this.startEdgeFrom}
          edgeStartedFrom={this.state.edgeStartedFrom}
          startMove={this.startVertexMove}
          moveProgress={this.getMoveProgress()}
        />
      )
      : null;

    this.canvasHeight = Math.max(this.state.window.height, pipeline.getNextProcessorPosition().y);
    this.canvasWidth = this.state.window.width - 300;

    const style = {
      position: 'relative'
    };

    if (this.canvasHeight && this.canvasWidth) {
      style.height = this.canvasHeight;
      style.width = this.canvasWidth;
    }

    let moveTargetProps = null;
    if (!!this.getMoveProgress()) {
      style.cursor = 'move';
      moveTargetProps = {
        onMouseUp: this.endVertexMove,
        onMouseMove: (e) => this.onCursorMove(e, e.clientX, e.clientY)
      };
    }

    const edgeAbandonProps = this.state.edgeStartedFrom
      ? {
        onClick: this.abandonEdge
      }
      : null;

    return (
      <div>
        { addVertexPanel }
        { configureVertexPanel }
        { configurePipelineInfoPanel }
        <EuiPage style={{ backgroundColor: '#d9d9d9' }}>
          <EuiPageBody>
            <div
              style={style}
              {...moveTargetProps}
              {...edgeAbandonProps}
            >
              <EdgeGroup
                pipeline={pipeline}
                width={this.canvasWidth}
                height={this.canvasHeight}
              />
              <EdgeLabelActionGroup
                pipeline={pipeline}
                removeEdge={this.removeEdge}
                edgeStartedFrom={this.state.edgeStartedFrom}
                isMoveInProgress={!!this.getMoveProgress()}
              />
              { inputsAndProcessors }
              { queue }
            </div>
            <div>
              <Menu
                openAddVertexPanel={this.openAddVertexPanel}
                addIfVertex={this.addIfVertex}
                configurePipelineInfo={this.configurePipelineInfo}
                savePipeline={this.savePipeline}
                pipeline={pipeline}
              />
              { introText }
            </div>
          </EuiPageBody>
        </EuiPage>
      </div>
    );
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateWindowSize);
    this.updateWindowSize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowSize);
  }

  updateWindowSize = () => {
    this.setState({
      window: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });
  }
}
