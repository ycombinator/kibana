/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { ELASTIC_WEBSITE_URL, DOC_LINK_VERSION } from 'ui/documentation_links';

const lsBase = `${ELASTIC_WEBSITE_URL}guide/en/logstash/${DOC_LINK_VERSION}/`;

export function makePluginDocumentationLink(pluginType, pluginName, shouldIncludeOptions = false) {
  const baseUrl = `${lsBase}plugins-${pluginType.toLowerCase()}s-${pluginName.toLowerCase()}.html`;
  return shouldIncludeOptions
    ? `${baseUrl}#plugins-${pluginType.toLowerCase()}s-${pluginName.toLowerCase()}-options`
    : baseUrl;
}
