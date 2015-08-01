/* global describe, beforeEach, after, it */
'use strict';
import assert from 'assert';
import fs from 'fs';
import path from 'path';
import routeUtils from '../generators/utils/route';

let newState = {
  name: 'test',
  module: 'home',
  url: '/test',
  lowerCamel: 'test',
  hyphenName: 'test',
  ctrlName: 'TestCtrl',
  templateUrl: 'home/test.tpl.html'
};

describe('Route Utils', () => {
  describe('CoffeeScript addRoute using UI Router', () => {
    describe('child state', () => {
      let config
        , fileContents;

      beforeEach(() => {
        config = {
          appScript: 'coffee',
          controllerAs: false,
          ngRoute: false
        };
        newState.name = 'test.test';
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-has-state.coffee'), 'utf8');
      });

      after(() => {
        newState.name = 'test';
      });

      it('should add child state', () => {
        assert(/.state 'test.test',[\n\r]* {8}url: '\/test'[\n\r]* {8}templateUrl: 'home\/test.tpl.html'[\n\r]* {8}controller: 'TestCtrl'[\n\r]/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });
    });

    describe('controllerAs', () => {
      let config
        , fileContents;

      beforeEach(() => {
        config = {
          appScript: 'coffee',
          controllerAs: false,
          ngRoute: false
        };
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-has-state.coffee'), 'utf8');
      });

      it('should add new state without controllerAs', () => {
        assert(/.state 'test',[\n\r]* {8}url: '\/test'[\n\r]* {8}templateUrl: 'home\/test.tpl.html'[\n\r]* {8}controller: 'TestCtrl'[\n\r]/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });

      it('should add new state with controllerAs', () => {
        config.controllerAs = true;
        assert(/.state 'test',[\n\r]* {8}url: '\/test'[\n\r]* {8}templateUrl: 'home\/test.tpl.html'[\n\r]* {8}controller: 'TestCtrl'[\n\r]* {8}controllerAs: 'test'[\n\r]/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });

      it('should only have 1 $stateProvider param', () => {
        assert(routeUtils.addRoute(fileContents, newState, config).match(/\(.*\$stateProvider.*\)/).length === 1);
      });
    });

    describe('skipController', () => {
      let config
        , fileContents;

      beforeEach(() => {
        config = {
          appScript: 'coffee',
          skipController: true,
          ngRoute: false
        };
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-has-state.coffee'), 'utf-8');
      });

      it('should add state without controller', () => {
        assert(/.state 'test',[\n\r]* {8}url: '\/test'[\n\r]* {8}templateUrl: 'home\/test.tpl.html'[\n\r]/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });
    });

    describe('no state defined', () => {
      describe('defined inline config function', () => {
        let config
          , fileContents;

        beforeEach(() => {
          config = {
            appScript: 'coffee',
            controllerAs: false,
            ngRoute: false
          };
          fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-no-state.coffee'), 'utf8');
        });

        it('should add $stateProvider as param', () => {
          assert(/config \(\$stateProvider\) ->/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });

        it('should add state', () => {
          assert(/\$stateProvider[\n\r]* {6}.state 'test',[\n\r]* {8}url: '\/test'[\n\r]* {8}templateUrl: 'home\/test.tpl.html'[\n\r]* {8}controller: 'TestCtrl'[\n\r]/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });
      });
    });

    describe('adding provider param', () => {
      let config;

      beforeEach(() => {
        config = {
          appScript: 'coffee',
          controllerAs: false,
          ngRoute: false
        };
      });

      it('should add param to empty config ()', () => {
        const filePath = path.join(__dirname, 'fixtures', 'app-no-state-empty-config.coffee')
          , fileContents = fs.readFileSync(filePath, 'utf8');
        assert(/config \(\$stateProvider\) ->/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });

      it('should add param to existing config', () => {
        const filePath = path.join(__dirname, 'fixtures', 'app-no-state-existing-config.coffee')
          , fileContents = fs.readFileSync(filePath, 'utf8');
        assert(/config \([^$]*, \$stateProvider\) ->/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });
    });
  });

  describe('CoffeeScript addRoute using ngRoute', () => {
    describe('controller As', () => {
      let config
        , fileContents;

      beforeEach(() => {
        config = {
          appScript: 'coffee',
          controllerAs: false,
          ngRoute: true
        };
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-has-when.coffee'), 'utf8');
      });

      it('should add new when without controllerAs', () => {
        assert(/.when '\/test',[\n\r]* {8}templateUrl: 'home\/test.tpl.html'[\n\r]* {8}controller: 'TestCtrl'[\n\r]/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });

      it('should add new when with controllerAs', () => {
        config.controllerAs = true;
        assert(/.when '\/test',[\n\r]* {8}templateUrl: 'home\/test.tpl.html'[\n\r]* {8}controller: 'TestCtrl'[\n\r]* {8}controllerAs: 'test'[\n\r]/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });

      it('should only have 1 $routeProvider param', () => {
        assert(routeUtils.addRoute(fileContents, newState, config).match(/\(.*\$routeProvider.*\)/).length === 1);
      });
    });

    describe('no state defined', () => {
      describe('defined inline config function', () => {
        let config
          , fileContents;

        beforeEach(() => {
          config = {
            appScript: 'coffee',
            controllerAs: false,
            ngRoute: true
          };
          fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-no-state.coffee'), 'utf8');
        });

        it('should add $routeProvider as param', () => {
          assert(/.config \(\$routeProvider\) ->/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });

        it('should add when with controllerAs', () => {
          config.controllerAs = true;
          assert(/\$routeProvider[\n\r]* {6}.when '\/test',[\n\r]* {8}templateUrl: 'home\/test.tpl.html'[\n\r]* {8}controller: 'TestCtrl'[\n\r]* {8}controllerAs: 'test'[\n\r]/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });
      });
    });
  });

  describe('JavaScript addRoute using UI Router', () => {
    describe('child state', () => {
      let config
        , fileContents;

      beforeEach(() => {
        config = {
          appScript: 'js',
          controllerAs: false,
          ngRoute: false
        };
        newState.name = 'test.test';
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-has-state.js'), 'utf8');
      });

      after(() => {
        newState.name = 'test';
      });

      it('should add child state', () => {
        assert(/\}\)[\n\r]* {6}.state\('test.test', {[\n\r]* {8}url: '\/test',[\n\r]* {8}templateUrl: 'home\/test.tpl.html',[\n\r]* {8}controller: 'TestCtrl'[\n\r]* {6}\}\);/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });
    });

    describe('controllerAs', () => {
      let config
        , fileContents;

      beforeEach(() => {
        config = {
          appScript: 'js',
          controllerAs: false,
          ngRoute: false
        };
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-has-state.js'), 'utf8');
      });

      it('should add new state without controllerAs', () => {
        assert(/\}\)[\n\r]* {6}.state\('test', {[\n\r]* {8}url: '\/test',[\n\r]* {8}templateUrl: 'home\/test.tpl.html',[\n\r]* {8}controller: 'TestCtrl'[\n\r]* {6}\}\);/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });

      it('should add new state with controllerAs', () => {
        config.controllerAs = true;
        assert(/\}\)[\n\r]* {6}.state\('test', {[\n\r]* {8}url: '\/test',[\n\r]* {8}templateUrl: 'home\/test.tpl.html',[\n\r]* {8}controller: 'TestCtrl',[\n\r]* {8}controllerAs: 'test'[\n\r]* {6}\}\);/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });

      it('should only have 1 $stateProvider param', () => {
        assert(routeUtils.addRoute(fileContents, newState, config).match(/function.*\(.*\$stateProvider.*\)/).length === 1);
      });
    });

    describe('skipController', () => {
      let config
        , fileContents;

      beforeEach(() => {
        config = {
          appScript: 'js',
          skipController: true,
          ngRoute: false
        };
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-has-state.js'), 'utf8');
      });

      it('should add state without contorller', () => {
        assert(/\}\)[\n\r]* {6}.state\('test', {[\n\r]* {8}url: '\/test',[\n\r]* {8}templateUrl: 'home\/test.tpl.html'[\n\r]* {6}\}\);/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });
    });

    describe('no state defined', () => {
      describe('passed config function', () => {
        let config
          , fileContents;

        beforeEach(() => {
          config = {
            appScript: 'js',
            controllerAs: false,
            ngRoute: false
          };
          fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-passed-no-state.js'), 'utf8');
        });

        it('should add $stateProvider as param', () => {
          assert(/config\(.*, \$stateProvider.*\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });

        it('should add state', () => {
          assert(/\$stateProvider[\n\r]* {6}.state\('test', {[\n\r]* {8}url: '\/test',[\n\r]* {8}templateUrl: 'home\/test.tpl.html',[\n\r]* {8}controller: 'TestCtrl'[\n\r]* {6}\}\);/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });
      });
    });
  });

  describe('JavaScript addRoute using ngRoute', () => {
    describe('controller As', () => {
      let config
        , fileContents;

      beforeEach(() => {
        config = {
          appScript: 'js',
          controllerAs: false,
          ngRoute: true
        };
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-passed-has-when.js'), 'utf8');
      });

      it('should add new when without controllerAs', () => {
        assert(/\}\)[\n\r]* {6}.when\('\/test', {[\n\r]* {8}templateUrl: 'home\/test.tpl.html',[\n\r]* {8}controller: 'TestCtrl'[\n\r]* {6}\}\);/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });

      it('should add new when with controllerAs', () => {
        config.controllerAs = true;
        assert(/\}\)[\n\r]* {6}.when\('\/test', {[\n\r]* {8}templateUrl: 'home\/test.tpl.html',[\n\r]* {8}controller: 'TestCtrl',[\n\r]* {8}controllerAs: 'test'[\n\r]* {6}\}\);/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });

      it('should only have 1 $routeProvider param', () => {
        assert(routeUtils.addRoute(fileContents, newState, config).match(/function.*\(.*\$routeProvider.*\)/).length === 1);
      });
    });

    describe('skipController', () => {
      let config
        , fileContents;

      beforeEach(() => {
        config = {
          appScript: 'js',
          skipController: true,
          ngRoute: true
        };
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-passed-has-when.js'), 'utf8');
      });

      it('should add route without controller', () => {
        assert(/.when\('\/test', {[\n\r]* {8}templateUrl: 'home\/test.tpl.html'[\n\r][^$]*}\)/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });
    });

    describe('no state defined', () => {
      describe('passed config function', () => {
        let config
          , fileContents;

        beforeEach(() => {
          config = {
            appScript: 'js',
            controllerAs: false,
            ngRoute: true
          };
          fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-passed-no-state.js'), 'utf8');
        });

        it('should add $routeProvider as param', () => {
          assert(/config\(.*, \$routeProvider.*\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });

        it('should add when', () => {
          assert(/\$routeProvider[\n\r]* {6}.when\('\/test', {[\n\r]* {8}templateUrl: 'home\/test.tpl.html',[\n\r]* {8}controller: 'TestCtrl'[^$]*}\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });
      });
    });
  });

  describe('ES6 addRoute using UI Router', () => {
    describe('child state', () => {
      let config
        , fileContents;

      beforeEach(() => {
        config = {
          appScript: 'es6',
          controllerAs: false,
          ngRoute: false
        };
        newState.name = 'test.test';
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-has-state.es6'), 'utf8');
      });

      after(() => {
        newState.name = 'test';
      });

      it('should add child state', () => {
        assert(/\}\)[\n\r]* {6}.state\('test.test', {[\n\r]* {8}url: '\/test',[\n\r]* {8}templateUrl: 'home\/test.tpl.html',[\n\r]* {8}controller: 'TestCtrl'[\n\r]* {6}\}\);/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });
    });

    describe('controllerAs', () => {
      let config
        , fileContents;

      beforeEach(() => {
        config = {
          appScript: 'es6',
          controllerAs: false,
          ngRoute: false
        };
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-has-state.es6'), 'utf8');
      });

      it('should add new state without controllerAs', () => {
        assert(/.state\('test', {[\n\r]* {8}url: '\/test',[\n\r]* {8}templateUrl: 'home\/test.tpl.html',[\n\r]* {8}controller: 'TestCtrl'[^$]*}\)/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });

      it('should add new state with controllerAs', () => {
        config.controllerAs = true;
        assert(/.state\('test', {[\n\r]* {8}url: '\/test',[\n\r]* {8}templateUrl: 'home\/test.tpl.html',[\n\r]* {8}controller: 'TestCtrl',[\n\r]* {8}controllerAs: 'test'[^$]*}\)/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });

      it('should only have 1 $stateProvider param', () => {
        assert(routeUtils.addRoute(fileContents, newState, config).match(/function.*\(.*\$stateProvider.*\)/).length === 1);
      });
    });

    describe('skipController', () => {
      let config
        , fileContents;

      beforeEach(() => {
        config = {
          appScript: 'es6',
          skipController: true,
          ngRoute: false
        };
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-has-state.es6'), 'utf8');
      });

      it('should add state without contorller', () => {
        assert(/.state\('test', {[\n\r]* {8}url: '\/test',[\n\r]* {8}templateUrl: 'home\/test.tpl.html'[\n\r][^$]*}\)/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });
    });

    describe('no state defined', () => {
      describe('passed config function', () => {
        let config
          , fileContents;

        beforeEach(() => {
          config = {
            appScript: 'es6',
            controllerAs: false,
            ngRoute: false
          };
          fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-passed-no-state.es6'), 'utf8');
        });

        it('should add $stateProvider as param', () => {
          assert(/config\(.*, \$stateProvider.*\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });

        it('should add state', () => {
          assert(/\$stateProvider[\n\r]* {6}.state\('test', {[\n\r]* {8}url: '\/test',[\n\r]* {8}templateUrl: 'home\/test.tpl.html',[\n\r]* {8}controller: 'TestCtrl'[^$]*}\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });
      });
    });
  });

  describe('ES6 addRoute using ngRoute', () => {
    describe('controller As', () => {
      let config
        , fileContents;

      beforeEach(() => {
        config = {
          appScript: 'es6',
          controllerAs: false,
          ngRoute: true
        };
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-passed-has-when.es6'), 'utf8');
      });

      it('should add new when without controllerAs', () => {
        assert(/.when\('\/test', {[\n\r]* {8}templateUrl: 'home\/test.tpl.html',[\n\r]* {8}controller: 'TestCtrl'[^$]*}\)/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });

      it('should add new when with controllerAs', () => {
        config.controllerAs = true;
        assert(/.when\('\/test', {[\n\r]* {8}templateUrl: 'home\/test.tpl.html',[\n\r]* {8}controller: 'TestCtrl',[\n\r]* {8}controllerAs: 'test'[^$]*}\)/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });

      it('should only have 1 $routeProvider param', () => {
        assert(routeUtils.addRoute(fileContents, newState, config).match(/function.*\(.*\$routeProvider.*\)/).length === 1);
      });
    });

    describe('skipController', () => {
      let config
        , fileContents;

      beforeEach(() => {
        config = {
          appScript: 'es6',
          skipController: true,
          ngRoute: true
        };
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-passed-has-when.es6'), 'utf8');
      });

      it('should add route without controller', () => {
        assert(/.when\('\/test', {[\n\r]* {8}templateUrl: 'home\/test.tpl.html'[\n\r][^$]*}\)/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });
    });

    describe('no state defined', () => {
      describe('passed config function', () => {
        let config
          , fileContents;

        beforeEach(() => {
          config = {
            appScript: 'es6',
            controllerAs: false,
            ngRoute: true
          };
          fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-passed-no-state.es6'), 'utf8');
        });

        it('should add $routeProvider as param', () => {
          assert(/config\(.*, \$routeProvider.*\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });

        it('should add when', () => {
          assert(/\$routeProvider[\n\r]* {6}.when\('\/test', {[\n\r]* {8}templateUrl: 'home\/test.tpl.html',[\n\r]* {8}controller: 'TestCtrl'[^$]*}\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });
      });
    });
  });

  describe('TypeScript addRoute using UI Router', () => {
    describe('controllerAs', () => {
      let config
        , fileContents;

      beforeEach(() => {
        config = {
          appScript: 'ts',
          controllerAs: false,
          ngRoute: false
        };
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-has-state.ts'), 'utf8');
      });

      it('should add new state without controllerAs', () => {
        assert(/.state\('test', {[\n\r]* {6}url: '\/test',[\n\r]* {6}templateUrl: 'home\/test.tpl.html',[\n\r]* {6}controller: 'TestCtrl'[^$]*}\)/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });

      it('should add new state with controllerAs', () => {
        config.controllerAs = true;
        assert(/.state\('test', {[\n\r]* {6}url: '\/test',[\n\r]* {6}templateUrl: 'home\/test.tpl.html',[\n\r]* {6}controller: 'TestCtrl',[\n\r]* {6}controllerAs: 'test'[^$]*}\)/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });

      it('should only have 1 $stateProvider param', () => {
        assert(routeUtils.addRoute(fileContents, newState, config).match(/function.*\(.*\$stateProvider: ng.ui.IStateProvider.*\)/).length === 1);
      });
    });

    describe('skipController', () => {
      let config
        , fileContents;

      beforeEach(() => {
        config = {
          appScript: 'ts',
          skipController: true,
          ngRoute: false
        };
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-has-state.ts'), 'utf8');
      });

      it('should add state without controller', () => {
        assert(/.state\('test', {[\n\r]* {6}url: '\/test',[\n\r]* {6}templateUrl: 'home\/test.tpl.html'[\n\r][^$]*}\)/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });
    });

    describe('no state defined', () => {
      describe('passed config function', () => {
        let config
          , fileContents;

        beforeEach(() => {
          config = {
            appScript: 'ts',
            controllerAs: false,
            ngRoute: false
          };
          fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-passed-no-state.ts'), 'utf8');
        });

        it('should add $stateProvider as param', () => {
          assert(/config\(.*, \$stateProvider: ng.ui.IStateProvider.*\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });

        it('should add state', () => {
          assert(/\$stateProvider[\n\r]* {4}.state\('test', {[\n\r]* {6}url: '\/test',[\n\r]* {6}templateUrl: 'home\/test.tpl.html',[\n\r]* {6}controller: 'TestCtrl'[^$]*}\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });
      });
    });
  });

  describe('TypeScript addRoute using ngRoute', () => {
    describe('controller As', () => {
      let config
        , fileContents;

      beforeEach(() => {
        config = {
          appScript: 'ts',
          controllerAs: false,
          passFunc: true,
          ngRoute: true
        };
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-passed-has-when.ts'), 'utf8');
      });

      it('should add new when without controllerAs', () => {
        assert(/.when\('\/test', {[\n\r]* {6}templateUrl: 'home\/test.tpl.html',[\n\r]* {6}controller: 'TestCtrl'[^$]*}\)/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });

      it('should add new when with controllerAs', () => {
        config.controllerAs = true;
        assert(/.when\('\/test', {[\n\r]* {6}templateUrl: 'home\/test.tpl.html',[\n\r]* {6}controller: 'TestCtrl',[\n\r]* {6}controllerAs: 'test'[^$]*}\)/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });

      it('should only have 1 $routeProvider param', () => {
        assert(routeUtils.addRoute(fileContents, newState, config).match(/function.*\(.*\$routeProvider.*\)/).length === 1);
      });
    });

    describe('skipController', () => {
      let config
        , fileContents;

      beforeEach(() => {
        config = {
          appScript: 'ts',
          skipController: true,
          passFunc: true,
          ngRoute: true
        };
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-passed-has-when.ts'), 'utf8');
      });

      it('should add route without controller', () => {
        assert(/.when\('\/test', {[\n\r]* {6}templateUrl: 'home\/test.tpl.html'[\n\r][^$]*}\)/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });
    });

    describe('no state defined', () => {
      describe('passed config function', () => {
        let config
          , fileContents;

        beforeEach(() => {
          config = {
            appScript: 'ts',
            controllerAs: false,
            ngRoute: true
          };
          fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-passed-no-state.ts'), 'utf8');
        });

        it('should add $routeProvider as param', () => {
          assert(/config\(.*, \$routeProvider.*\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });

        it('should add when', () => {
          assert(/\$routeProvider[\n\r]* {4}.when\('\/test', {[\n\r]* {6}templateUrl: 'home\/test.tpl.html',[\n\r]* {6}controller: 'TestCtrl'[^$]*}\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });
      });
    });
  });
});
