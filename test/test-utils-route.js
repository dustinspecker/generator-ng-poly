/*global describe, beforeEach, after, it */
'use strict';
var assert = require('assert')
  , fs = require('fs')
  , path = require('path')
  , routeUtils = require('../utils/route')

  , newState = {
    name: 'test',
    module:'home',
    url: '/test',
    lowerCamel: 'test',
    hyphenName: 'test',
    ctrlName: 'TestCtrl',
    templateUrl: 'home/test.tpl.html'
  };

describe('Route Utils', function () {
  describe('CoffeeScript addRoute using UI Router', function () {
    describe('child state', function () {
      var config
        , fileContents;

      beforeEach(function () {
        config = {
          appScript: 'coffee',
          controllerAs: false,
          passFunc: false,
          ngRoute: false
        };
        newState.name = 'test.test';
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-has-state.coffee'), 'utf8');
      });

      after(function () {
        newState.name = 'test';
      });

      it('should add child state', function () {
        assert(/.state \'test.test\',[\n\r]*        url: \'\/test\'[\n\r]*        templateUrl: \'home\/test.tpl.html\'[\n\r]*        controller: \'TestCtrl\'[\n\r]/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });
    });

    describe('controllerAs', function () {
      var config
        , fileContents;

      beforeEach(function () {
        config = {
          appScript: 'coffee',
          controllerAs: false,
          passFunc: false,
          ngRoute: false
        };
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-has-state.coffee'), 'utf8');
      });

      it('should add new state without controllerAs', function () {
        assert(/.state \'test\',[\n\r]*        url: \'\/test\'[\n\r]*        templateUrl: \'home\/test.tpl.html\'[\n\r]*        controller: \'TestCtrl\'[\n\r]/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });

      it('should add new state with controllerAs', function () {
        config.controllerAs = true;
        assert(/.state \'test\',[\n\r]*        url: \'\/test\'[\n\r]*        templateUrl: \'home\/test.tpl.html\'[\n\r]*        controller: \'TestCtrl\'[\n\r]*        controllerAs: \'test\'[\n\r]/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });

      it('should only have 1 $stateProvider param', function () {
        assert(routeUtils.addRoute(fileContents, newState, config).match(/\(.*\$stateProvider.*\)/).length === 1);
      });
    });

    describe('skipController', function () {
      var config
        , fileContents;

      beforeEach(function () {
        config = {
          appScript: 'coffee',
          skipController: true,
          passFunc: false,
          ngRoute: false
        };
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-has-state.coffee'), 'utf-8');
      });

      it('should add state without controller', function () {
        assert(/.state \'test\',[\n\r]*        url: \'\/test\'[\n\r]*        templateUrl: \'home\/test.tpl.html\'[\n\r]/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });
    });

    describe('no state defined', function () {
      describe('defined inline config function', function () {
        var config
          , fileContents;

        beforeEach(function () {
          config = {
            appScript: 'coffee',
            controllerAs: false,
            passFunc: true,
            ngRoute: false
          };
          fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-no-state.coffee'), 'utf8');
        });

        it('should add ui.router as dependency', function () {
          assert(/.module \'[^$]*\', \[[^$]*\'ui.router\'[^$]*\]/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });

        it('should add $stateProvider as param', function () {
          assert(/config \(\$stateProvider\) ->/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });

        it('should add state', function () {
          assert(/\$stateProvider[\n\r]*      .state \'test\',[\n\r]*        url: \'\/test\'[\n\r]*        templateUrl: \'home\/test.tpl.html\'[\n\r]*        controller: \'TestCtrl\'[\n\r]/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });
      });
    });

    describe('adding provider param', function () {
      var config;

      beforeEach(function () {
        config = {
          appScript: 'coffee',
          controllerAs: false,
          passFunc: true,
          ngRoute: false
        };
      });

      it('should add param to empty config ()', function () {
        var filePath = path.join(__dirname, 'fixtures', 'app-no-state-empty-config.coffee')
          , fileContents = fs.readFileSync(filePath, 'utf8');
        assert(/config \(\$stateProvider\) ->/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });

      it('should add param to existing config', function () {
        var filePath = path.join(__dirname, 'fixtures', 'app-no-state-existing-config.coffee')
          , fileContents = fs.readFileSync(filePath, 'utf8');
        assert(/config \([^$]*, \$stateProvider\) ->/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });
    });
  });

  describe('CoffeeScript addRoute using ngRoute', function () {
    describe('controller As', function () {
      var config
        , fileContents;

      beforeEach(function () {
        config = {
          appScript: 'coffee',
          controllerAs: false,
          passFunc: true,
          ngRoute: true
        };
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-has-when.coffee'), 'utf8');
      });

      it('should add new when without controllerAs', function () {
        assert(/.when \'\/test\',[\n\r]*        templateUrl: \'home\/test.tpl.html\'[\n\r]*        controller: \'TestCtrl\'[\n\r]/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });

      it('should add new when with controllerAs', function () {
        config.controllerAs = true;
        assert(/.when \'\/test\',[\n\r]*        templateUrl: \'home\/test.tpl.html\'[\n\r]*        controller: \'TestCtrl\'[\n\r]*        controllerAs: \'test\'[\n\r]/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });

      it('should only have 1 $routeProvider param', function () {
        assert(routeUtils.addRoute(fileContents, newState, config).match(/\(.*\$routeProvider.*\)/).length === 1);
      });
    });

    describe('no state defined', function () {
      describe('defined inline config function', function () {
        var config
          , fileContents;

        beforeEach(function () {
          config = {
            appScript: 'coffee',
            controllerAs: false,
            passFunc: false,
            ngRoute: true
          };
          fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-no-state.coffee'), 'utf8');
        });

        it('should add ngRoute as depdendency', function () {
          assert(/.module \'[^$]*\', \[[^$]*\'ngRoute\'[^$]*\]/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });

        it('should add $routeProvider as param', function () {
          assert(/.config \(\$routeProvider\) ->/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });

        it('should add when with controllerAs', function () {
          config.controllerAs = true;
          assert(/\$routeProvider[\n\r]*      .when \'\/test\',[\n\r]*        templateUrl: \'home\/test.tpl.html\'[\n\r]*        controller: \'TestCtrl\'[\n\r]*        controllerAs: \'test\'[\n\r]/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });
      });
    });
  });

  describe('JavaScript addRoute using UI Router', function () {
    describe('child state', function () {
      var config
        , fileContents;

      beforeEach(function () {
        config = {
          appScript: 'js',
          controllerAs: false,
          passFunc: false,
          ngRoute: false
        };
        newState.name = 'test.test';
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-has-state.js'), 'utf8');
      });

      after(function () {
        newState.name = 'test';
      });

      it('should add child state', function () {
        assert(/.state\(\'test.test\', {[\n\r]*        url: \'\/test\',[\n\r]*        templateUrl: \'home\/test.tpl.html\',[\n\r]*        controller: \'TestCtrl\'[^$]*}\)/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });
    });

    describe('controllerAs', function () {
      var config
        , fileContents;

      beforeEach(function () {
        config = {
          appScript: 'js',
          controllerAs: false,
          passFunc: false,
          ngRoute: false
        };
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-has-state.js'), 'utf8');
      });

      it('should add new state without controllerAs', function () {
        assert(/.state\(\'test\', {[\n\r]*        url: \'\/test\',[\n\r]*        templateUrl: \'home\/test.tpl.html\',[\n\r]*        controller: \'TestCtrl\'[^$]*}\)/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });

      it('should add new state with controllerAs', function () {
        config.controllerAs = true;
        assert(/.state\(\'test\', {[\n\r]*        url: \'\/test\',[\n\r]*        templateUrl: \'home\/test.tpl.html\',[\n\r]*        controller: \'TestCtrl\',[\n\r]*        controllerAs: \'test\'[^$]*}\)/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });

      it('should only have 1 $stateProvider param', function () {
        assert(routeUtils.addRoute(fileContents, newState, config).match(/function.*\(.*\$stateProvider.*\)/).length === 1);
      });
    });

    describe('skipController', function () {
      var config
        , fileContents;

      beforeEach(function () {
        config = {
          appScript: 'js',
          skipController: true,
          passFunc: false,
          ngRoute: false
        };
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-has-state.js'), 'utf8');
      });

      it('should add state without contorller', function () {
        assert(/.state\(\'test\', {[\n\r]*        url: \'\/test\',[\n\r]*        templateUrl: \'home\/test.tpl.html\'[\n\r][^$]*}\)/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });
    });

    describe('no state defined', function () {
      describe('passed config function', function () {
        var config
          , fileContents;

        beforeEach(function () {
          config = {
            appScript: 'js',
            controllerAs: false,
            passFunc: true,
            ngRoute: false
          };
          fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-passed-no-state.js'), 'utf8');
        });

        it('should add ui.router as dependency', function () {
          assert(/.module\(\'[^$]*\', \[[^$]*\'ui.router\'[^$]*\]\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });

        it('should add $stateProvider as param', function () {
          assert(/config\(.*, \$stateProvider.*\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });

        it('should add state', function () {
          assert(/\$stateProvider[\n\r]*      .state\(\'test\', {[\n\r]*        url: \'\/test\',[\n\r]*        templateUrl: \'home\/test.tpl.html\',[\n\r]*        controller: \'TestCtrl\'[^$]*}\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });
      });

      describe('defined inline config function', function () {
        var config
          , fileContents;

        beforeEach(function () {
          config = {
            appScript: 'js',
            controllerAs: false,
            passFunc: false,
            ngRoute: false
          };
          fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-inline-no-state.js'), 'utf8');
        });

        it('should add ui.router as depdendency', function () {
          assert(/.module\(\'[^$]*\', \[[^$]*\'ui.router\'[^$]*\]\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });

        it('should add $stateProvider as param', function () {
          assert(/.config\(function[^$]*\(\$stateProvider\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });

        it('should add state with controllerAs', function () {
          config.controllerAs = true;
          assert(/\$stateProvider[\n\r]*      .state\(\'test\', {[\n\r]*        url: \'\/test\',[\n\r]*        templateUrl: \'home\/test.tpl.html\',[\n\r]*        controller: \'TestCtrl\',[\n\r]*        controllerAs: \'test\'[^$]*}\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });
      });

    });
  });

  describe('JavaScript addRoute using ngRoute', function () {
    describe('controller As', function () {
      var config
        , fileContents;

      beforeEach(function () {
        config = {
          appScript: 'js',
          controllerAs: false,
          passFunc: true,
          ngRoute: true
        };
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-passed-has-when.js'), 'utf8');
      });

      it('should add new when without controllerAs', function () {
        assert(/.when\(\'\/test\', {[\n\r]*        templateUrl: \'home\/test.tpl.html\',[\n\r]*        controller: \'TestCtrl\'[^$]*}\)/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });

      it('should add new when with controllerAs', function () {
        config.controllerAs = true;
        assert(/.when\(\'\/test\', {[\n\r]*        templateUrl: \'home\/test.tpl.html\',[\n\r]*        controller: \'TestCtrl\',[\n\r]*        controllerAs: \'test\'[^$]*}\)/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });

      it('should only have 1 $routeProvider param', function () {
        assert(routeUtils.addRoute(fileContents, newState, config).match(/function.*\(.*\$routeProvider.*\)/).length === 1);
      });
    });

    describe('skipController', function () {
      var config
        , fileContents;

      beforeEach(function () {
        config = {
          appScript: 'js',
          skipController: true,
          passFunc: true,
          ngRoute: true
        };
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-passed-has-when.js'), 'utf8');
      });

      it('should add route without controller', function () {
        assert(/.when\(\'\/test\', {[\n\r]*        templateUrl: \'home\/test.tpl.html\'[\n\r][^$]*}\)/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });
    });

    describe('no state defined', function () {
      describe('passed config function', function () {
        var config
          , fileContents;

        beforeEach(function () {
          config = {
            appScript: 'js',
            controllerAs: false,
            passFunc: true,
            ngRoute: true
          };
          fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-passed-no-state.js'), 'utf8');
        });

        it('should add ngRoute as dependency', function () {
          assert(/.module\(\'[^$]*\', \[[^$]*\'ngRoute\'[^$]*\]\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });

        it('should add $routeProvider as param', function () {
          assert(/config\(.*, \$routeProvider.*\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });

        it('should add when', function () {
          assert(/\$routeProvider[\n\r]*      .when\(\'\/test\', {[\n\r]*        templateUrl: \'home\/test.tpl.html\',[\n\r]*        controller: \'TestCtrl\'[^$]*}\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });
      });

      describe('defined inline config function', function () {
        var config
          , fileContents;

        beforeEach(function () {
          config = {
            appScript: 'js',
            controllerAs: false,
            passFunc: false,
            ngRoute: true
          };
          fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-inline-no-state.js'), 'utf8');
        });

        it('should add ngRoute as depdendency', function () {
          assert(/.module\(\'[^$]*\', \[[^$]*\'ngRoute\'[^$]*\]\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });

        it('should add $routeProvider as param', function () {
          assert(/.config\(function[^$]*\(\$routeProvider\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });

        it('should add when with controllerAs', function () {
          config.controllerAs = true;
          assert(/\$routeProvider[\n\r]*      .when\(\'\/test\', {[\n\r]*        templateUrl: \'home\/test.tpl.html\',[\n\r]*        controller: \'TestCtrl\',[\n\r]*        controllerAs: \'test\'[^$]*}\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });
      });
    });
  });

  describe('TypeScript addRoute using UI Router', function () {
    describe('controllerAs', function () {
      var config
        , fileContents;

      beforeEach(function () {
        config = {
          appScript: 'ts',
          controllerAs: false,
          passFunc: false,
          ngRoute: false
        };
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-has-state.ts'), 'utf8');
      });

      it('should add new state without controllerAs', function () {
        assert(/.state\(\'test\', {[\n\r]*        url: \'\/test\',[\n\r]*        templateUrl: \'home\/test.tpl.html\',[\n\r]*        controller: \'TestCtrl\'[^$]*}\)/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });

      it('should add new state with controllerAs', function () {
        config.controllerAs = true;
        assert(/.state\(\'test\', {[\n\r]*        url: \'\/test\',[\n\r]*        templateUrl: \'home\/test.tpl.html\',[\n\r]*        controller: \'TestCtrl\',[\n\r]*        controllerAs: \'test\'[^$]*}\)/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });

      it('should only have 1 $stateProvider param', function () {
        assert(routeUtils.addRoute(fileContents, newState, config).match(/function.*\(.*\$stateProvider: ng.ui.IStateProvider.*\)/).length === 1);
      });
    });

    describe('skipController', function () {
      var config
        , fileContents;

      beforeEach(function () {
        config = {
          appScript: 'ts',
          skipController: true,
          passFunc: false,
          ngRoute: false
        };
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-has-state.ts'), 'utf8');
      });

      it('should add state without controller', function () {
        assert(/.state\(\'test\', {[\n\r]*        url: \'\/test\',[\n\r]*        templateUrl: \'home\/test.tpl.html\'[\n\r][^$]*}\)/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });
    });

    describe('no state defined', function () {
      describe('passed config function', function () {
        var config
          , fileContents;

        beforeEach(function () {
          config = {
            appScript: 'ts',
            controllerAs: false,
            passFunc: true,
            ngRoute: false
          };
          fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-passed-no-state.ts'), 'utf8');
        });

        it('should add ui.router as dependency', function () {
          assert(/.module\(\'[^$]*\', \[[^$]*\'ui.router\'[^$]*\]\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });

        it('should add $stateProvider as param', function () {
          assert(/config\(.*, \$stateProvider: ng.ui.IStateProvider.*\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });

        it('should add state', function () {
          assert(/\$stateProvider[\n\r]*    .state\(\'test\', {[\n\r]*      url: \'\/test\',[\n\r]*      templateUrl: \'home\/test.tpl.html\',[\n\r]*      controller: \'TestCtrl\'[^$]*}\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });
      });

      describe('defined inline config function', function () {
        var config
          , fileContents;

        beforeEach(function () {
          config = {
            appScript: 'ts',
            controllerAs: false,
            passFunc: false,
            ngRoute: false
          };
          fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-inline-no-state.ts'), 'utf8');
        });

        it('should add ui.router as depdendency', function () {
          assert(/.module\(\'[^$]*\', \[[^$]*\'ui.router\'[^$]*\]\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });

        it('should add $stateProvider as param', function () {
          assert(/.config\(function[^$]*\(\$stateProvider: ng.ui.IStateProvider\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });

        it('should add state with controllerAs', function () {
          config.controllerAs = true;
          assert(/\$stateProvider[\n\r]*      .state\(\'test\', {[\n\r]*        url: \'\/test\',[\n\r]*        templateUrl: \'home\/test.tpl.html\',[\n\r]*        controller: \'TestCtrl\',[\n\r]*        controllerAs: \'test\'[^$]*}\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });
      });

    });
  });

  describe('TypeScript addRoute using ngRoute', function () {
    describe('controller As', function () {
      var config
        , fileContents;

      beforeEach(function () {
        config = {
          appScript: 'ts',
          controllerAs: false,
          passFunc: true,
          ngRoute: true
        };
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-passed-has-when.ts'), 'utf8');
      });

      it('should add new when without controllerAs', function () {
        assert(/.when\(\'\/test\', {[\n\r]*      templateUrl: \'home\/test.tpl.html\',[\n\r]*      controller: \'TestCtrl\'[^$]*}\)/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });

      it('should add new when with controllerAs', function () {
        config.controllerAs = true;
        assert(/.when\(\'\/test\', {[\n\r]*      templateUrl: \'home\/test.tpl.html\',[\n\r]*      controller: \'TestCtrl\',[\n\r]*      controllerAs: \'test\'[^$]*}\)/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });

      it('should only have 1 $routeProvider param', function () {
        assert(routeUtils.addRoute(fileContents, newState, config).match(/function.*\(.*\$routeProvider.*\)/).length === 1);
      });
    });

    describe('skipController', function () {
      var config
        , fileContents;

      beforeEach(function () {
        config = {
          appScript: 'ts',
          skipController: true,
          passFunc: true,
          ngRoute: true
        };
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-passed-has-when.ts'), 'utf8');
      });

      it('should add route without controller', function () {
        assert(/.when\(\'\/test\', {[\n\r]*      templateUrl: \'home\/test.tpl.html\'[\n\r][^$]*}\)/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });
    });

    describe('no state defined', function () {
      describe('passed config function', function () {
        var config
          , fileContents;

        beforeEach(function () {
          config = {
            appScript: 'js',
            controllerAs: false,
            passFunc: true,
            ngRoute: true
          };
          fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-passed-no-state.ts'), 'utf8');
        });

        it('should add ngRoute as dependency', function () {
          assert(/.module\(\'[^$]*\', \[[^$]*\'ngRoute\'[^$]*\]\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });

        it('should add $routeProvider as param', function () {
          assert(/config\(.*, \$routeProvider.*\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });

        it('should add when', function () {
          assert(/\$routeProvider[\n\r]*    .when\(\'\/test\', {[\n\r]*      templateUrl: \'home\/test.tpl.html\',[\n\r]*      controller: \'TestCtrl\'[^$]*}\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });
      });

      describe('defined inline config function', function () {
        var config
          , fileContents;

        beforeEach(function () {
          config = {
            appScript: 'js',
            controllerAs: false,
            passFunc: false,
            ngRoute: true
          };
          fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-inline-no-state.ts'), 'utf8');
        });

        it('should add ngRoute as depdendency', function () {
          assert(/.module\(\'[^$]*\', \[[^$]*\'ngRoute\'[^$]*\]\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });

        it('should add $routeProvider as param', function () {
          assert(/.config\(function[^$]*\(\$routeProvider\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });

        it('should add when with controllerAs', function () {
          config.controllerAs = true;
          assert(/\$routeProvider[\n\r]*      .when\(\'\/test\', {[\n\r]*        templateUrl: \'home\/test.tpl.html\',[\n\r]*        controller: \'TestCtrl\',[\n\r]*        controllerAs: \'test\'[^$]*}\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });
      });
    });
  });

});
