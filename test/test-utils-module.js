/* global describe, beforeEach, it */
'use strict';
import {expect} from 'chai';
import {expectRequire} from 'a';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

describe('Module Utils', () => {
  describe('extractModuleNames', () => {
    let utilsProxy;

    beforeEach(() => {
      // mock out path to avoid needing to use file system to find package.json
      let appUtilsStub, findUpStub, pathStub;

      appUtilsStub = {
        getFileFromRoot() {
          return {name: 'test'};
        },
        getYoPath() {
          return 'app/root';
        }
      };

      findUpStub = {
        sync(yoPath) {
          if (yoPath === '.yo-rc.json') {
            return 'app/root/.yo-rc.json';
          }
        }
      };

      pathStub = {
        join(appRoot, pkgPath) {
          if (appRoot === 'app/root' && pkgPath === 'package.json') {
            return 'app/root/package.json';
          }
        }
      };

      // proxy utils
      utilsProxy = proxyquire('../generators/utils/module', {
        './app': appUtilsStub,
        'find-up': findUpStub,
        path: pathStub
      });

      expectRequire('app/root/package.json').return({name: 'test'});
    });

    it('should return app name when using app', () => {
      expect(utilsProxy.extractModuleNames('app')).to.eql(['test', null]);
    });

    it('should extract modules with slashes in path', () => {
      expect(utilsProxy.extractModuleNames('test\\parent\\child')).to.eql(['child', 'parent']);
      expect(utilsProxy.extractModuleNames('test/parent/child')).to.eql(['child', 'parent']);
    });

    it('should return module without slashes in path', () => {
      expect(utilsProxy.extractModuleNames('test')).to.eql(['test', null]);
    });
  });

  describe('moduleExists', () => {
    let appUtilsStub, fsStub, utilsProxy;

    beforeEach(() => {
      appUtilsStub = {
        getYoPath: sinon.stub().returns('legit-project'),
        getAppDir: sinon.stub().returns('bro')
      };

      fsStub = {
        existsSync: sinon.stub().returns('yes')
      };

      utilsProxy = proxyquire('../generators/utils/module', {
        './app': appUtilsStub,
        fs: fsStub
      });

      utilsProxy.normalizeModulePath = function () {
        return 'yep';
      };
    });

    it('should return true when module is appDir', () => {
      expect(utilsProxy.moduleExists('bro')).to.eql(true);
      expect(appUtilsStub.getAppDir.calledOnce).to.eql(true);
    });

    it('should call fs.existsSync', () => {
      expect(utilsProxy.moduleExists('dude')).to.eql('yes');
      expect(fsStub.existsSync.calledWith('legit-project/bro/yep')).to.eql(true);
    });
  });

  describe('moduleFilter', () => {
    let utilsProxy;

    beforeEach(() => {
      // mock out path to avoid needing to use file system to find package.json
      let pathStub;

      pathStub = {
        join() {
          return 'package.json';
        }
      };

      // proxy utils
      utilsProxy = proxyquire('../generators/utils/module', {path: pathStub});

      expectRequire('package.json').return({name: 'test'});

      // mock function to prevent looking for build.config.js
      utilsProxy.getAppDir = function getAppDir() {
        return 'app';
      };
    });

    it('should filter non-script files', () => {
      let expectedModules, files;

      files = [
        'test/test-module.html',
        'test1/test1-module.css',
        'test2/test2-module.js',
        'test3/test3-module.coffee',
        'test4/test4-module.es6',
        'test5/test5-module.ts'
      ];

      expectedModules = [
        {name: 'test2', value: 'test2'},
        {name: 'test3', value: 'test3'},
        {name: 'test4', value: 'test4'},
        {name: 'test5', value: 'test5'}
      ];

      expect(utilsProxy.moduleFilter(files)).to.eql(expectedModules);
    });

    it('should check for x-module name only on child directory', () => {
      let expectedModules, files;

      files = [
        'test/test-module.js',
        'abc/abc-module.js',
        'nested/nest/nest-module.js'
      ];

      expectedModules = [
        {name: 'test', value: 'test'},
        {name: 'abc', value: 'abc'},
        {name: 'nested/nest', value: 'nested/nest'}
      ];

      expect(utilsProxy.moduleFilter(files)).to.eql(expectedModules);
    });

    it('should remove duplicate directores', () => {
      let expectedModules, files;

      files = [
        'test1/test1-modulde.js',
        'test1/test1-module.ts',
        'test2/test2-module.js'
      ];

      expectedModules = [
        {name: 'test1', value: 'test1'},
        {name: 'test2', value: 'test2'}
      ];

      expect(utilsProxy.moduleFilter(files)).to.eql(expectedModules);
    });

    it('should only list directories that have a `directory`-module.{coffee,es6,js,ts} file', () => {
      let expectedModules, files;

      files = [
        'coffee-test/coffee-test-module.coffee',
        'es6-test/es6-test-module.es6',
        'js-test/js-test-module.js',
        'ts-test/ts-test-module.js',
        'components/gold-element/gold-element.js'
      ];

      expectedModules = [
        {name: 'coffee-test', value: 'coffee-test'},
        {name: 'es6-test', value: 'es6-test'},
        {name: 'js-test', value: 'js-test'},
        {name: 'ts-test', value: 'ts-test'}
      ];

      expect(utilsProxy.moduleFilter(files)).to.eql(expectedModules);
    });

    it('should strip Windows app path in value', () => {
      const files = ['app\\test\\test-module.js']
        , expectedModules = [{name: 'app\\test', value: 'test'}];

      let pathStub, windowsUtilsProxy;

      pathStub = {
        sep: '\\',
        basename() {
          return 'test-module.js';
        },
        dirname() {
          return 'app\\test';
        }
      };

      windowsUtilsProxy = proxyquire('../generators/utils/module', {path: pathStub});
      windowsUtilsProxy.getAppDir = () => {
        return 'app';
      };

      expect(windowsUtilsProxy.moduleFilter(files)).to.eql(expectedModules);
    });

    it('should strip Unix app path in value', () => {
      const files = ['app/test/test-module.js']
        , expectedModules = [{name: 'app/test', value: 'test'}];

      let pathStub, windowsUtilsProxy;

      pathStub = {
        sep: '/',
        basename() {
          return 'test-module';
        },
        dirname() {
          return 'app/test';
        }
      };

      windowsUtilsProxy = proxyquire('../generators/utils/module', {path: pathStub});
      windowsUtilsProxy.getAppDir = () => {
        return 'app';
      };

      expect(windowsUtilsProxy.moduleFilter(files)).to.eql(expectedModules);
    });
  });
});
