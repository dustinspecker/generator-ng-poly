/*global describe, beforeEach, it */
'use strict';
import assert from 'assert';
import {expectRequire} from 'a';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import utils from '../generator/utils/module';

describe('Module Utils', () => {
  describe('extractModuleNames', () => {
    it('should return app name when using app', () => {
      // mock out path to avoid needing to use file system to find package.json
      const pathStub = {
          join() {
            return 'package.json';
          }
        }
        // proxy utils
        , utilsProxy = proxyquire('../generator/utils/module', {path: pathStub});

      expectRequire('package.json').return({name: 'test'});

      // mock function to prevent looking for build.config.js
      utilsProxy.getAppDir = function getAppDir() {
        return 'app';
      };

      assert(JSON.stringify(utilsProxy.extractModuleNames('app')) === JSON.stringify(['test', null]));
    });

    it('should extract modules with slashes in path', () => {
      assert(JSON.stringify(utils.extractModuleNames('test/parent/child')) === JSON.stringify(['child', 'parent']));
    });

    it('should return module without slashes in path', () => {
      assert(JSON.stringify(utils.extractModuleNames('test')) === JSON.stringify(['test', null]));
    });
  });

  describe('moduleExists', () => {
    let pathStub, utilsProxy;

    beforeEach(() => {
      pathStub = {
        dirname() {
          return '.yo-rc.json';
        },
        join() {
          return 'app/home';
        }
      };
      utilsProxy = proxyquire('../generator/utils/module', {path: pathStub});

      utilsProxy.getAppDir = function getAppDir() {
        return 'app';
      };
    });

    it('should return true when module is appDir', () => {
      assert(utilsProxy.moduleExists('app') === true);
    });

    it('should call fs.exstsSync', () => {
      const fsStub = {
        existsSync: sinon.stub().returns(true)
      };
      utilsProxy = proxyquire('../generator/utils/module', {fs: fsStub, path: pathStub});
      utilsProxy.getAppDir = function getAppDir() {
        return 'app';
      };
      utilsProxy.normalizeModulePath = function normalizeModulePath() {
        return 'app/home';
      };
      utilsProxy.moduleExists('app/home');
      assert(fsStub.existsSync.callCount === 1);
    });
  });
});
