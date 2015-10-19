/* global describe, beforeEach, it */
'use strict';
import {expect} from 'chai';
import {expectRequire} from 'a';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

describe('Module Utils', () => {
  describe('extractModuleNames', () => {
    let appUtilsStub, utilsProxy;

    beforeEach(() => {
      appUtilsStub = {
        getAppDir() {
          return 'app';
        },
        getFileFromRoot: sinon.stub().returns({name: 'test'})
      };

      // proxy utils
      utilsProxy = proxyquire('../generators/utils/module', {
        './app': appUtilsStub
      });
    });

    it('should return app name when using app', () => {
      expect(utilsProxy.extractModuleNames('app')).to.eql(['test', null]);
      expect(appUtilsStub.getFileFromRoot.calledWith('package.json')).to.eql(true);
    });

    it('should extract modules with slashes in path', () => {
      expect(utilsProxy.extractModuleNames('test\\parent\\child')).to.eql(['child', 'parent']);
      expect(utilsProxy.extractModuleNames('test/parent/child')).to.eql(['child', 'parent']);
    });

    it('should return module without slashes in path', () => {
      expect(utilsProxy.extractModuleNames('dog')).to.eql(['dog', null]);
    });
  });

  describe('findModuleFile', () => {
    it('should return correct module file', () => {
      let fsStub, utilsProxy;

      fsStub = {
        existsSync: sinon.stub()
      };

      fsStub.existsSync.withArgs('app-module.coffee').returns(false);
      fsStub.existsSync.withArgs('app-module.es6').returns(false);
      fsStub.existsSync.withArgs('app-module.js').returns(false);
      fsStub.existsSync.withArgs('app-module.ts').returns(true);

      utilsProxy = proxyquire('../generators/utils/module', {
        fs: fsStub
      });

      expect(utilsProxy.findModuleFile('app')).to.eql('app-module.ts');
      expect(fsStub.existsSync.withArgs('app-module.coffee').calledOnce).to.eql(true);
      expect(fsStub.existsSync.withArgs('app-module.es6').calledOnce).to.eql(true);
      expect(fsStub.existsSync.withArgs('app-module.js').calledOnce).to.eql(true);
      expect(fsStub.existsSync.withArgs('app-module.ts').calledOnce).to.eql(true);
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

  describe('normalizeModulePath', () => {
    let utilsProxy;

    beforeEach(() => {
      let appUtilsStub, pathStub;

      appUtilsStub = {
        getAppDir() {
          return 'app';
        }
      };

      pathStub = {
        sep: '.'
      };

      utilsProxy = proxyquire('../generators/utils/module', {
        './app': appUtilsStub,
        path: pathStub
      });
    });

    it('should return empty string if module path is app path', () => {
      expect(utilsProxy.normalizeModulePath('app')).to.eql('');
    });

    it('should replace \\ and / with path.sep', () => {
      expect(utilsProxy.normalizeModulePath('awesome\\cake/icing')).to.eql('awesome.cake.icing');
    });

    it('should replace camelCased and CamelCase paths with hyphen-case', () => {
      expect(utilsProxy.normalizeModulePath('awesomeCake/IsThe/best-cake')).to.eql('awesome-cake.is-the.best-cake');
    });
  });
});
