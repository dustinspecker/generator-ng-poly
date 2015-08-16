/* global describe, it */
'use strict';
import {expect} from 'chai';
import {expectRequire} from 'a';
import proxyquire from 'proxyquire';

describe('App Utils', () => {
  describe('getAppDir', () => {
    it('should return app dir', () => {
      let pathStub, utilsProxy;

      pathStub = {
        join() {
          return 'build.config.js';
        }
      };

      // mock out path to avoid needing to use file system to find build.config.json
      utilsProxy = proxyquire('../generators/utils/app', {path: pathStub});

      expectRequire('build.config.js').return({appDir: 'app'});

      expect(utilsProxy.getAppDir('test')).to.eql('app');
    });
  });
});
