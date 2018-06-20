/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import {
  EuiFormRow,
  EuiCodeEditor
} from '@elastic/eui';
import { EDITOR } from '../../../../../common/constants';
import { GrokMode } from '../../../../lib/ace';

export function PatternInput({ value, onChange }) {
  return (
    <EuiFormRow
      label="Grok Pattern"
      fullWidth
    >
      <EuiCodeEditor
        width="100%"
        height="51px"
        value={value}
        onChange={onChange}
        mode={new GrokMode()}
        setOptions={{
          highlightActiveLine: false,
          highlightGutterLine: false,
          minLines: EDITOR.PATTERN_MIN_LINES,
          maxLines: EDITOR.PATTERN_MAX_LINES,
        }}
        data-test-subj="acePatternInput"
      />
    </EuiFormRow>
  );
}
