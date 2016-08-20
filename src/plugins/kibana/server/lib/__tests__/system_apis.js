import expect from 'expect.js';
import { set } from 'lodash';
import { systemApiPreResponseHandler, getSystemApiConfig, isSystemApiRequest } from '../system_apis';

describe('system_apis', () => {
  describe('#systemApiPreResponseHandler', () => {
    describe('when the route is tagged as a system API', () => {
      let mockRequest;
      let mockReply;
      beforeEach(() => {
        mockRequest = {};
        set(mockRequest, 'route.settings.tags', [ 'system-api' ]);

        mockReply = {};
        set(mockReply, 'continue', () => {});
      });

      it ('returns the correct HTTP response header', () => {
        systemApiPreResponseHandler(mockRequest, mockReply);
        expect(mockRequest.response.headers).to.have.property('kbn-system-api');
        expect(mockRequest.response.headers['kbn-system-api']).to.be(true);
      });
    });
  });

  describe('getSystemApiConfig', () => {
    it ('returns the correct HAPI config', () => {
      expect(getSystemApiConfig()).to.eql({ tags: [ 'system-api' ]});
    });
  });

  describe('isSystemApiRequest', () => {
    let mockRequest;
    describe('when it is a system API request', () => {
      beforeEach(() => {
        mockRequest = {};
        set(mockRequest, 'route.settings.tags', [ 'system-api' ]);
      });

      it ('returns true', () => {
        expect(isSystemApiRequest(mockRequest)).to.be(true);
      });
    });

    describe('when it is NOT a system API request', () => {
      beforeEach(() => {
        mockRequest = {};
        set(mockRequest, 'route.settings.tags', undefined);
      });

      it ('returns false', () => {
        expect(isSystemApiRequest(mockRequest)).to.be(false);
      });
    });
  });
});
