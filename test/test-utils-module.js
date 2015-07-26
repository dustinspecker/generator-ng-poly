/*global describe, beforeEach, it, xit */
'use strict';
import assert from 'assert';
import {expect} from 'chai';
import {expectRequire} from 'a';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

describe('Module Utils', () => {
  describe('extractModuleNames', () => {
    let utilsProxy;

    beforeEach(() => {
      // mock out path to avoid needing to use file system to find package.json
      const pathStub = {
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

    it('should return app name when using app', () => {
      assert(JSON.stringify(utilsProxy.extractModuleNames('app')) === JSON.stringify(['test', null]));
    });

    it('should extract modules with slashes in path', () => {
      assert(JSON.stringify(utilsProxy.extractModuleNames('test/parent/child')) === JSON.stringify(['child', 'parent']));
    });

    it('should return module without slashes in path', () => {
      assert(JSON.stringify(utilsProxy.extractModuleNames('test')) === JSON.stringify(['test', null]));
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
      utilsProxy = proxyquire('../generators/utils/module', {path: pathStub});

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
      utilsProxy = proxyquire('../generators/utils/module', {fs: fsStub, path: pathStub});
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

  describe('moduleFilter', () => {
    let utilsProxy;

    beforeEach(() => {
      // mock out path to avoid needing to use file system to find package.json
      const pathStub = {
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
      const files = [
          'test/a.html',
          'test1/b.css',
          'test2/c.js',
          'test3/d.coffee',
          'test4/e.es6',
          'test5/f.ts'
        ]
        , expectedModules = [
          {name: 'test2', value: 'test2'},
          {name: 'test3', value: 'test3'},
          {name: 'test4', value: 'test4'},
          {name: 'test5', value: 'test5'}
        ];
      expect(utilsProxy.moduleFilter(files)).to.eql(expectedModules);
    });

    it('should remove the filenames and only return the directories', () => {
      const files = [
          'test/test.js',
          'abc/bar.js',
          'nested/nest/nest.js'
        ]
        , expectedModules = [
          {name: 'test', value: 'test'},
          {name: 'abc', value: 'abc'},
          {name: 'nested/nest', value: 'nested/nest'}
        ];
      expect(utilsProxy.moduleFilter(files)).to.eql(expectedModules);
    });

    it('should remove duplicate directores', () => {
      const files = [
          'test1/test.js',
          'test1/test1.js',
          'test2/test.js'
        ]
        , expectedModules = [
          {name: 'test1', value: 'test1'},
          {name: 'test2', value: 'test2'}
        ];
      expect(utilsProxy.moduleFilter(files)).to.eql(expectedModules);
    });

    it('should ignore components directory if opts.polymer is true', () => {
      const files = [
          'test1/test.js',
          'test2/test.js',
          'components/test2.js'
        ]
        , expectedModules = [
          {name: 'test1', value: 'test1'},
          {name: 'test2', value: 'test2'}
        ];
      expect(utilsProxy.moduleFilter(files)).to.eql(expectedModules);
    });

    xit('should not ignore components directory if opts.polymer is false', () => {
      const files = [
          'test1/test.js',
          'test2/test.js',
          'components/test2.js'
        ]
        , expectedModules = [
          {name: 'test1', value: 'test1'},
          {name: 'test2', value: 'test2'},
          {name: 'components', value: 'components'}
        ];
      expect(utilsProxy.moduleFilter(files)).to.eql(expectedModules);
    });

    it('should ignore Angular type directories if module-type structure', () => {
      const files = [
          'constants/test.js',
          'controllers/test.js',
          'decorators/test.js',
          'directives/test.js',
          'factories/test.js',
          'filters/test.js',
          'services/test.js',
          'providers/test.js',
          'values/test.js',
          'views/test.js'
        ]
        , expectedModules = [];
      expect(utilsProxy.moduleFilter(files, {type: true})).to.eql(expectedModules);
    });

    it('should not ignore Angular type directories if module-only structure', () => {
      const files = [
          'constants/test.js',
          'controllers/test.js',
          'decorators/test.js',
          'directives/test.js',
          'factories/test.js',
          'filters/test.js',
          'providers/test.js',
          'services/test.js',
          'values/test.js',
          'views/test.js'
        ]
        , expectedModules = [
          {name: 'constants', value: 'constants'},
          {name: 'controllers', value: 'controllers'},
          {name: 'decorators', value: 'decorators'},
          {name: 'directives', value: 'directives'},
          {name: 'factories', value: 'factories'},
          {name: 'filters', value: 'filters'},
          {name: 'providers', value: 'providers'},
          {name: 'services', value: 'services'},
          {name: 'values', value: 'values'},
          {name: 'views', value: 'views'}
        ];
      expect(utilsProxy.moduleFilter(files)).to.eql(expectedModules);
    });

    it('should strip Windows app path in value', () => {
      const files = ['app\\test\\test1.js']
        , expectedModules = [{name: 'app\\test', value: 'test'}]
        , pathStub = {
            dirname() {
              return 'app\\test';
            }
          };

      let windowsUtilsProxy = proxyquire('../generators/utils/module', {path: pathStub});
      windowsUtilsProxy.getAppDir = () => {
        return 'app';
      };
      expect(windowsUtilsProxy.moduleFilter(files)).to.eql(expectedModules);
    });

    it('should strip Unix app path in value', () => {
      const files = ['app/test/test1.js']
        , expectedModules = [{name: 'app/test', value: 'test'}]
        , pathStub = {
            dirname() {
              return 'app/test';
            }
          };

      let windowsUtilsProxy = proxyquire('../generators/utils/module', {path: pathStub});
      windowsUtilsProxy.getAppDir = () => {
        return 'app';
      };
      expect(windowsUtilsProxy.moduleFilter(files)).to.eql(expectedModules);
    });
  });
});
