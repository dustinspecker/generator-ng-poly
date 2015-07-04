/*global describe, it */
'use strict';
import assert from 'assert';
import {expectRequire} from 'a';
import proxyquire from 'proxyquire';

describe('App Utils', () => {
  describe('getAppDir', () => {
    it('should return app dir', () => {
      // mock out path to avoid needing to use file system to find package.json
      const pathStub = {
          join() {
            return 'build.config.js';
          }
        }
        // proxy utils
        , utilsProxy = proxyquire('../generator/utils/app', {path: pathStub});

      expectRequire('build.config.js').return({appDir: 'app'});

      assert(utilsProxy.getAppDir('test') === 'app');
    });
  });
});
