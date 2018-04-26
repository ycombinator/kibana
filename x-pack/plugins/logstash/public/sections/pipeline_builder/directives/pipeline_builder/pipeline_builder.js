/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import { render } from 'react-dom';
import { uiModules } from 'ui/modules';
import { PipelineBuilder } from '../../components/pipeline_builder';

const app = uiModules.get('xpack/logstash');

app.directive('pipelineBuilder', () => {
  return {
    restrict: 'E',
    scope: {
      pipeline: '=',
      pluginLibrary: '='
    },
    link: function (scope, $el) {
      scope.$watchGroup(['pipeline', 'pluginLibrary'], ([pipeline, pluginLibrary]) => {
        const pipelineBuilder = (
          <PipelineBuilder
            pipeline={pipeline}
            pluginLibrary={pluginLibrary}
          />
        );
        render(pipelineBuilder, $el[0]);
      });
    }
  };
});
