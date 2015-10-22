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
          return Promise.resolve('app');
        },
        getFileFromRoot: sinon.stub().returns(Promise.resolve({name: 'test'}))
      };

      // proxy utils
      utilsProxy = proxyquire('../generators/utils/module', {
        './app': appUtilsStub
      });
    });

    it('should return app name when using app', async () => {
      let modules = await utilsProxy.extractModuleNames('app');

      expect(modules).to.eql(['test', null]);
      expect(appUtilsStub.getFileFromRoot.calledWith('package.json')).to.eql(true);
    });

    it('should extract modules with slashes in path', async () => {
      let modules = await utilsProxy.extractModuleNames('test\\parent\\child');

      expect(modules).to.eql(['child', 'parent']);

      modules = await utilsProxy.extractModuleNames('test/parent/child');
      expect(modules).to.eql(['child', 'parent']);
    });

    it('should return module without slashes in path', async () => {
      let modules = await utilsProxy.extractModuleNames('dog');

      expect(modules).to.eql(['dog', null]);
    });
  });

  describe('findModuleFile', () => {
    it('should return correct module file', async () => {
      let fsStub, moduleFile, utilsProxy;

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

      moduleFile = await utilsProxy.findModuleFile('app');

      expect(moduleFile).to.eql('app-module.ts');
      expect(fsStub.existsSync.withArgs('app-module.coffee').calledOnce).to.eql(true);
      expect(fsStub.existsSync.withArgs('app-module.es6').calledOnce).to.eql(true);
      expect(fsStub.existsSync.withArgs('app-module.js').calledOnce).to.eql(true);
      expect(fsStub.existsSync.withArgs('app-module.ts').calledOnce).to.eql(true);
    });
  });

  describe('findRouteFile', () => {
    it('should return correct route file', async () => {
      let fsStub, routesFile, utilsProxy;

      fsStub = {
        existsSync: sinon.stub()
      };

      fsStub.existsSync.withArgs('app-routes.coffee').returns(false);
      fsStub.existsSync.withArgs('app-routes.es6').returns(false);
      fsStub.existsSync.withArgs('app-routes.js').returns(false);
      fsStub.existsSync.withArgs('app-routes.ts').returns(true);

      utilsProxy = proxyquire('../generators/utils/module', {
        fs: fsStub
      });

      routesFile = await utilsProxy.findRoutesFile('app');

      expect(routesFile).to.eql('app-routes.ts');
      expect(fsStub.existsSync.withArgs('app-routes.coffee').calledOnce).to.eql(true);
      expect(fsStub.existsSync.withArgs('app-routes.es6').calledOnce).to.eql(true);
      expect(fsStub.existsSync.withArgs('app-routes.js').calledOnce).to.eql(true);
      expect(fsStub.existsSync.withArgs('app-routes.ts').calledOnce).to.eql(true);
    });
  });

  describe('moduleFilter', () => {
    let utilsProxy;

    beforeEach(() => {
      let appUtilsStub, pathStub;

      appUtilsStub = {
        getAppDir() {
          return Promise.resolve('app');
        }
      };

      pathStub = {
        join() {
          return 'package.json';
        }
      };

      // proxy utils
      utilsProxy = proxyquire('../generators/utils/module', {
        './app': appUtilsStub,
        path: pathStub
      });

      expectRequire('package.json').return({name: 'test'});
    });

    it('should filter non-script files', async () => {
      let expectedModules, files, modules;

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

      modules = await utilsProxy.moduleFilter(files);

      expect(modules).to.eql(expectedModules);
    });

    it('should check for x-module name only on child directory', async () => {
      let expectedModules, files, modules;

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

      modules = await utilsProxy.moduleFilter(files);

      expect(modules).to.eql(expectedModules);
    });

    it('should remove duplicate directores', async () => {
      let expectedModules, files, modules;

      files = [
        'test1/test1-modulde.js',
        'test1/test1-module.ts',
        'test2/test2-module.js'
      ];

      expectedModules = [
        {name: 'test1', value: 'test1'},
        {name: 'test2', value: 'test2'}
      ];

      modules = await utilsProxy.moduleFilter(files);

      expect(modules).to.eql(expectedModules);
    });

    it('should only list directories that have a `directory`-module.{coffee,es6,js,ts} file', async () => {
      let expectedModules, files, modules;

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

      modules = await utilsProxy.moduleFilter(files);

      expect(modules).to.eql(expectedModules);
    });

    it('should strip Windows app path in value', async () => {
      const files = ['app\\test\\test-module.js']
        , expectedModules = [{name: 'app\\test', value: 'test'}];

      let appUtilsStub, modules, pathStub, windowsUtilsProxy;

      appUtilsStub = {
        getAppDir() {
          return Promise.resolve('app');
        }
      };

      pathStub = {
        sep: '\\',
        basename() {
          return 'test-module.js';
        },
        dirname() {
          return 'app\\test';
        }
      };

      windowsUtilsProxy = proxyquire('../generators/utils/module', {
        './app': appUtilsStub,
        path: pathStub
      });

      modules = await windowsUtilsProxy.moduleFilter(files);

      expect(modules).to.eql(expectedModules);
    });

    it('should strip Unix app path in value', async () => {
      const files = ['app/test/test-module.js']
        , expectedModules = [{name: 'app/test', value: 'test'}];

      let appUtilsStub, pathStub, modules, unixUtilsProxy;

      appUtilsStub = {
        getAppDir() {
          return Promise.resolve('app');
        }
      };

      pathStub = {
        sep: '/',
        basename() {
          return 'test-module';
        },
        dirname() {
          return 'app/test';
        }
      };

      unixUtilsProxy = proxyquire('../generators/utils/module', {
        './app': appUtilsStub,
        path: pathStub
      });

      modules = await unixUtilsProxy.moduleFilter(files);

      expect(modules).to.eql(expectedModules);
    });
  });

  describe('normalizeModulePath', () => {
    let utilsProxy;

    beforeEach(() => {
      let appUtilsStub, pathStub;

      appUtilsStub = {
        getAppDir() {
          return Promise.resolve('app');
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

    it('should return empty string if module path is app path', async () => {
      let normalizeModulePath = await utilsProxy.normalizeModulePath('app');

      expect(normalizeModulePath).to.eql('');
    });

    it('should replace \\ and / with path.sep', async () => {
      let normalizeModulePath = await utilsProxy.normalizeModulePath('awesome\\cake/icing');

      expect(normalizeModulePath).to.eql('awesome.cake.icing');
    });

    it('should replace camelCased and CamelCase paths with hyphen-case', async () => {
      let normalizeModulePath = await utilsProxy.normalizeModulePath('awesomeCake/IsThe/best-cake');

      expect(normalizeModulePath).to.eql('awesome-cake.is-the.best-cake');
    });
  });
});
