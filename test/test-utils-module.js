/* global describe, beforeEach, it */
'use strict';
import {expect} from 'chai';
import {expectRequire} from 'a';
import {join} from 'path';
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
      const modules = await utilsProxy.extractModuleNames('app');

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
      const modules = await utilsProxy.extractModuleNames('dog');

      expect(modules).to.eql(['dog', null]);
    });
  });

  describe('findModuleFile', () => {
    const pathExistsStub = sinon.stub();
    let utilsProxy;

    beforeEach(() => {
      pathExistsStub.withArgs('app-module.coffee').returns(Promise.resolve(false));
      pathExistsStub.withArgs('app-module.es6').returns(Promise.resolve(false));
      pathExistsStub.withArgs('app-module.js').returns(Promise.resolve(false));
      pathExistsStub.withArgs('app-module.ts').returns(Promise.resolve(true));

      utilsProxy = proxyquire('../generators/utils/module', {
        'path-exists': pathExistsStub
      });
    });

    it('should return correct module file', async () => {
      const moduleFile = await utilsProxy.findModuleFile('app');

      expect(moduleFile).to.eql('app-module.ts');
      expect(pathExistsStub.withArgs('app-module.coffee').calledOnce).to.eql(true);
      expect(pathExistsStub.withArgs('app-module.es6').calledOnce).to.eql(true);
      expect(pathExistsStub.withArgs('app-module.js').calledOnce).to.eql(true);
      expect(pathExistsStub.withArgs('app-module.ts').calledOnce).to.eql(true);
    });

    it('should print deprecation warning for older file names', async () => {
      pathExistsStub.withArgs('app-module.ts').returns(Promise.resolve(false));
      pathExistsStub.withArgs('app.coffee').returns(Promise.resolve(true));

      sinon.spy(console, 'log');

      const moduleFile = await utilsProxy.findModuleFile('app');

      expect(moduleFile).to.eql('app.coffee');
      expect(console.log.calledOnce).to.eql(true);

      console.log.restore();
    });
  });

  describe('findRouteFile', () => {
    const pathExistsStub = sinon.stub();
    let utilsProxy;

    beforeEach(() => {
      pathExistsStub.withArgs('app-routes.coffee').returns(Promise.resolve(false));
      pathExistsStub.withArgs('app-routes.es6').returns(Promise.resolve(false));
      pathExistsStub.withArgs('app-routes.js').returns(Promise.resolve(false));
      pathExistsStub.withArgs('app-routes.ts').returns(Promise.resolve(true));

      utilsProxy = proxyquire('../generators/utils/module', {
        'path-exists': pathExistsStub
      });
    });

    it('should return correct route file', async () => {
      const routesFile = await utilsProxy.findRoutesFile('app');

      expect(routesFile).to.eql('app-routes.ts');
      expect(pathExistsStub.withArgs('app-routes.coffee').calledOnce).to.eql(true);
      expect(pathExistsStub.withArgs('app-routes.es6').calledOnce).to.eql(true);
      expect(pathExistsStub.withArgs('app-routes.js').calledOnce).to.eql(true);
      expect(pathExistsStub.withArgs('app-routes.ts').calledOnce).to.eql(true);
    });

    it('should print deprecation warning for older file names', async () => {
      pathExistsStub.withArgs('app-routes.ts').returns(Promise.resolve(false));
      pathExistsStub.withArgs('app-module.coffee').returns(Promise.resolve(true));

      sinon.spy(console, 'log');

      const routesFile = await utilsProxy.findRoutesFile('app');

      expect(routesFile).to.eql('app-module.coffee');
      expect(console.log.calledOnce).to.eql(true);

      console.log.restore();
    });
  });

  describe('getAppName', () => {
    let appUtilsStub, fsStub, getYoRcPathStub, utilsProxy;

    beforeEach(() => {
      appUtilsStub = {
        getAppDir() {
          return Promise.resolve('app');
        },
        getFileFromRoot: sinon.stub().returns(Promise.resolve({name: 'test'}))
      };

      fsStub = {
        readFile(fileName, cb) {
          cb(null, 'angular.module(\'awesomeName\', [])');
        }
      };

      getYoRcPathStub = {
        dir: sinon.stub().returns(Promise.resolve('awesome-project'))
      };

      // proxy utils
      utilsProxy = proxyquire('../generators/utils/module', {
        './app': appUtilsStub,
        fs: fsStub,
        'get-yo-rc-path': getYoRcPathStub
      });

      utilsProxy.findModuleFile = sinon.stub().returns(Promise.resolve('app-module.js'));
    });

    it('should return app name', async () => {
      expectRequire('awesome-project/build.config.js').return({appDir: 'app'});
      const appName = await utilsProxy.getAppName();
      expect(appName).to.eql('awesomeName');
    });
  });

  describe('moduleFilter', () => {
    let utilsProxy;

    beforeEach(() => {
      const appUtilsStub = {
        getAppDir() {
          return Promise.resolve('app');
        }
      };

      const pathStub = {
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
      const files = [
        'test/test-module.html',
        'test1/test1-module.css',
        'test2/test2-module.js',
        'test3/test3-module.coffee',
        'test4/test4-module.es6',
        'test5/test5-module.ts'
      ];

      const expectedModules = [
        {name: 'test2', value: 'test2'},
        {name: 'test3', value: 'test3'},
        {name: 'test4', value: 'test4'},
        {name: 'test5', value: 'test5'}
      ];

      const modules = await utilsProxy.moduleFilter(files);

      expect(modules).to.eql(expectedModules);
    });

    it('should check for x-module name only on child directory', async () => {
      const files = [
        join('test', 'test-module.js'),
        join('abc', 'abc-module.js'),
        join('nested', 'nest', 'nest-module.js')
      ];

      const expectedModules = [
        {name: 'test', value: 'test'},
        {name: 'abc', value: 'abc'},
        {name: join('nested', 'nest'), value: join('nested', 'nest')}
      ];

      const modules = await utilsProxy.moduleFilter(files);

      expect(modules).to.eql(expectedModules);
    });

    it('should remove duplicate directores', async () => {
      const files = [
        'test1/test1-modulde.js',
        'test1/test1-module.ts',
        'test2/test2-module.js'
      ];

      const expectedModules = [
        {name: 'test1', value: 'test1'},
        {name: 'test2', value: 'test2'}
      ];

      const modules = await utilsProxy.moduleFilter(files);

      expect(modules).to.eql(expectedModules);
    });

    it('should only list directories that have a `directory`-module.{coffee,es6,js,ts} file', async () => {
      const files = [
        'coffee-test/coffee-test-module.coffee',
        'es6-test/es6-test-module.es6',
        'js-test/js-test-module.js',
        'ts-test/ts-test-module.js',
        'components/gold-element/gold-element.js'
      ];

      const expectedModules = [
        {name: 'coffee-test', value: 'coffee-test'},
        {name: 'es6-test', value: 'es6-test'},
        {name: 'js-test', value: 'js-test'},
        {name: 'ts-test', value: 'ts-test'}
      ];

      const modules = await utilsProxy.moduleFilter(files);

      expect(modules).to.eql(expectedModules);
    });

    it('should strip Windows app path in value', async () => {
      const files = ['app\\test\\test-module.js']
        , expectedModules = [{name: 'app\\test', value: 'test'}];

      const appUtilsStub = {
        getAppDir() {
          return Promise.resolve('app');
        }
      };

      const pathStub = {
        sep: '\\',
        basename() {
          return 'test-module.js';
        },
        dirname() {
          return 'app\\test';
        }
      };

      const windowsUtilsProxy = proxyquire('../generators/utils/module', {
        './app': appUtilsStub,
        path: pathStub
      });

      const modules = await windowsUtilsProxy.moduleFilter(files);

      expect(modules).to.eql(expectedModules);
    });

    it('should strip Unix app path in value', async () => {
      const files = ['app/test/test-module.js']
        , expectedModules = [{name: 'app/test', value: 'test'}];

      const appUtilsStub = {
        getAppDir() {
          return Promise.resolve('app');
        }
      };

      const pathStub = {
        sep: '/',
        basename() {
          return 'test-module';
        },
        dirname() {
          return 'app/test';
        }
      };

      const unixUtilsProxy = proxyquire('../generators/utils/module', {
        './app': appUtilsStub,
        path: pathStub
      });

      const modules = await unixUtilsProxy.moduleFilter(files);

      expect(modules).to.eql(expectedModules);
    });
  });

  describe('normalizeModulePath', () => {
    let utilsProxy;

    beforeEach(() => {
      const appUtilsStub = {
        getAppDir() {
          return Promise.resolve('app');
        }
      };

      const pathStub = {
        sep: '.'
      };

      utilsProxy = proxyquire('../generators/utils/module', {
        './app': appUtilsStub,
        path: pathStub
      });
    });

    it('should return empty string if module path is app path', async () => {
      const normalizeModulePath = await utilsProxy.normalizeModulePath('app');

      expect(normalizeModulePath).to.eql('');
    });

    it('should replace \\ and / with path.sep', async () => {
      const normalizeModulePath = await utilsProxy.normalizeModulePath('awesome\\cake/icing');

      expect(normalizeModulePath).to.eql('awesome.cake.icing');
    });

    it('should replace camelCased and CamelCase paths with hyphen-case', async () => {
      const normalizeModulePath = await utilsProxy.normalizeModulePath('awesomeCake/IsThe/best-cake');

      expect(normalizeModulePath).to.eql('awesome-cake.is-the.best-cake');
    });
  });
});
