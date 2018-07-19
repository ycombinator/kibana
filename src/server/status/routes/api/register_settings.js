/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { wrapAuthConfig } from '../../wrap_auth_config';

const stubResponse = JSON.parse(`{
  "cluster_uuid":"u5ii0pnQRka_P0gimfmthg",
  "settings":{
    "xpack":{
      "default_admin_email":"jane@doe.com"
    },
    "kibana":{
      "uuid":"5b2de169-2785-441b-ae8c-186a1936b17d",
      "name":"Janes-MBP-2",
      "index":".kibana",
      "host":"localhost",
      "transport_address":"localhost:5601",
      "version":"7.0.0-alpha1",
      "snapshot":false,
      "status":"green"
    }
  }
}`);

export function registerSettingsApi(kbnServer, server, config) {
  const wrapAuth = wrapAuthConfig(config.get('status.allowAnonymous'));
  server.route(
    wrapAuth({
      method: 'GET',
      path: '/api/settings',
      config: {
        tags: ['api'],
      },
      async handler(req, reply) {
        reply(stubResponse);
      },
    })
  );
}
