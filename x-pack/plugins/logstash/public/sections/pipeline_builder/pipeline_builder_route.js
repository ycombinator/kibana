/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import routes from 'ui/routes';
import template from './pipeline_builder_route.html';
import './directives/pipeline_builder';
import {
  Pipeline,
  // Vertex,
  // Edge
} from '../../models/graph';
import pluginLibrary from '../../data/plugin_library';

const initialPipeline = new Pipeline();
initialPipeline.vertices = [
  // new Vertex('input', 'stdin', [ { name: 'id', type: 'string', value: 'my_command_line_input' }]),
  // new Vertex('filter', 'grok', [ { name: 'id', type: 'string', value: 'apache_log_parser' }]),
  // new Vertex('output', 'elasticsearch', [ { name: 'id', type: 'string', value: 'my_dev_cluster' }]),
];
initialPipeline.edges = [
  // new Edge(initialPipeline.vertices[0], initialPipeline.vertices[1]),
  // new Edge(initialPipeline.vertices[1], initialPipeline.vertices[2]),
];

routes
  .when('/management/logstash/pipelines/pipeline-builder', {
    template,
    controller: class PipelineBuilderRouteController {
      constructor($injector) {
        const $route = $injector.get('$route');
        this.pluginLibrary = $route.current.locals.pluginLibrary;
        this.pipeline = initialPipeline;
      }
    },
    controllerAs: 'pipelineBuilderRoute',
    resolve: {
      pluginLibrary: () => pluginLibrary.plugins
    }
  });
