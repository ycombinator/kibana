import { set } from 'lodash';

export function isSystemApiRequest(request) {
  const routeTags = request.route.settings.tags || [];
  return routeTags.includes('system-api');
}

export function systemApiPreResponseHandler(request, reply) {
  // If this is a system API call, add a header to indicate this so client-side
  // code may treat it appropriately
  if (isSystemApiRequest(request)) {
    set(request, [ 'response', 'headers', 'kbn-system-api' ], true);
  }
  return reply.continue();
}

export function getSystemApiConfig() {
  return {
    tags: [ 'system-api' ]
  };
}
