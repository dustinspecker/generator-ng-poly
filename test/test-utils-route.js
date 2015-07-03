/*global describe, beforeEach, after, it */
'use strict';
var assert = require('assert')
  , fs = require('fs')
  , path = require('path')
  , routeUtils = require('../generator/utils/route')

  , newState = {
    name: 'test',
    module: 'home',
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
          ngRoute: false
        };
        newState.name = 'test.test';
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-has-state.coffee'), 'utf8');
      });

      after(function () {
        newState.name = 'test';
      });

      it('should add child state', function () {
        assert(/.state \'test.test\',[\n\r]* {8}url: \'\/test\'[\n\r]* {8}templateUrl: \'home\/test.tpl.html\'[\n\r]* {8}controller: \'TestCtrl\'[\n\r]/
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
          ngRoute: false
        };
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-has-state.coffee'), 'utf8');
      });

      it('should add new state without controllerAs', function () {
        assert(/.state \'test\',[\n\r]* {8}url: \'\/test\'[\n\r]* {8}templateUrl: \'home\/test.tpl.html\'[\n\r]* {8}controller: \'TestCtrl\'[\n\r]/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });

      it('should add new state with controllerAs', function () {
        config.controllerAs = true;
        assert(/.state \'test\',[\n\r]* {8}url: \'\/test\'[\n\r]* {8}templateUrl: \'home\/test.tpl.html\'[\n\r]* {8}controller: \'TestCtrl\'[\n\r]* {8}controllerAs: \'test\'[\n\r]/
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
          ngRoute: false
        };
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-has-state.coffee'), 'utf-8');
      });

      it('should add state without controller', function () {
        assert(/.state \'test\',[\n\r]* {8}url: \'\/test\'[\n\r]* {8}templateUrl: \'home\/test.tpl.html\'[\n\r]/
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
            ngRoute: false
          };
          fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-no-state.coffee'), 'utf8');
        });

        it('should add $stateProvider as param', function () {
          assert(/config \(\$stateProvider\) ->/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });

        it('should add state', function () {
          assert(/\$stateProvider[\n\r]* {6}.state \'test\',[\n\r]* {8}url: \'\/test\'[\n\r]* {8}templateUrl: \'home\/test.tpl.html\'[\n\r]* {8}controller: \'TestCtrl\'[\n\r]/
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
          ngRoute: true
        };
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-has-when.coffee'), 'utf8');
      });

      it('should add new when without controllerAs', function () {
        assert(/.when \'\/test\',[\n\r]* {8}templateUrl: \'home\/test.tpl.html\'[\n\r]* {8}controller: \'TestCtrl\'[\n\r]/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });

      it('should add new when with controllerAs', function () {
        config.controllerAs = true;
        assert(/.when \'\/test\',[\n\r]* {8}templateUrl: \'home\/test.tpl.html\'[\n\r]* {8}controller: \'TestCtrl\'[\n\r]* {8}controllerAs: \'test\'[\n\r]/
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
            ngRoute: true
          };
          fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-no-state.coffee'), 'utf8');
        });

        it('should add $routeProvider as param', function () {
          assert(/.config \(\$routeProvider\) ->/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });

        it('should add when with controllerAs', function () {
          config.controllerAs = true;
          assert(/\$routeProvider[\n\r]* {6}.when \'\/test\',[\n\r]* {8}templateUrl: \'home\/test.tpl.html\'[\n\r]* {8}controller: \'TestCtrl\'[\n\r]* {8}controllerAs: \'test\'[\n\r]/
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
          ngRoute: false
        };
        newState.name = 'test.test';
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-has-state.js'), 'utf8');
      });

      after(function () {
        newState.name = 'test';
      });

      it('should add child state', function () {
        assert(/\}\)[\n\r]* {6}.state\(\'test.test\', {[\n\r]* {8}url: \'\/test\',[\n\r]* {8}templateUrl: \'home\/test.tpl.html\',[\n\r]* {8}controller: \'TestCtrl\'[\n\r]* {6}\}\);/
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
          ngRoute: false
        };
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-has-state.js'), 'utf8');
      });

      it('should add new state without controllerAs', function () {
        assert(/\}\)[\n\r]* {6}.state\(\'test\', {[\n\r]* {8}url: \'\/test\',[\n\r]* {8}templateUrl: \'home\/test.tpl.html\',[\n\r]* {8}controller: \'TestCtrl\'[\n\r]* {6}\}\);/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });

      it('should add new state with controllerAs', function () {
        config.controllerAs = true;
        assert(/\}\)[\n\r]* {6}.state\(\'test\', {[\n\r]* {8}url: \'\/test\',[\n\r]* {8}templateUrl: \'home\/test.tpl.html\',[\n\r]* {8}controller: \'TestCtrl\',[\n\r]* {8}controllerAs: \'test\'[\n\r]* {6}\}\);/
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
          ngRoute: false
        };
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-has-state.js'), 'utf8');
      });

      it('should add state without contorller', function () {
        assert(/\}\)[\n\r]* {6}.state\(\'test\', {[\n\r]* {8}url: \'\/test\',[\n\r]* {8}templateUrl: \'home\/test.tpl.html\'[\n\r]* {6}\}\);/
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
            ngRoute: false
          };
          fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-passed-no-state.js'), 'utf8');
        });

        it('should add $stateProvider as param', function () {
          assert(/config\(.*, \$stateProvider.*\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });

        it('should add state', function () {
          assert(/\$stateProvider[\n\r]* {6}.state\(\'test\', {[\n\r]* {8}url: \'\/test\',[\n\r]* {8}templateUrl: \'home\/test.tpl.html\',[\n\r]* {8}controller: \'TestCtrl\'[\n\r]* {6}\}\);/
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
          ngRoute: true
        };
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-passed-has-when.js'), 'utf8');
      });

      it('should add new when without controllerAs', function () {
        assert(/\}\)[\n\r]* {6}.when\(\'\/test\', {[\n\r]* {8}templateUrl: \'home\/test.tpl.html\',[\n\r]* {8}controller: \'TestCtrl\'[\n\r]* {6}\}\);/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });

      it('should add new when with controllerAs', function () {
        config.controllerAs = true;
        assert(/\}\)[\n\r]* {6}.when\(\'\/test\', {[\n\r]* {8}templateUrl: \'home\/test.tpl.html\',[\n\r]* {8}controller: \'TestCtrl\',[\n\r]* {8}controllerAs: \'test\'[\n\r]* {6}\}\);/
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
          ngRoute: true
        };
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-passed-has-when.js'), 'utf8');
      });

      it('should add route without controller', function () {
        assert(/.when\(\'\/test\', {[\n\r]* {8}templateUrl: \'home\/test.tpl.html\'[\n\r][^$]*}\)/
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
            ngRoute: true
          };
          fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-passed-no-state.js'), 'utf8');
        });

        it('should add $routeProvider as param', function () {
          assert(/config\(.*, \$routeProvider.*\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });

        it('should add when', function () {
          assert(/\$routeProvider[\n\r]* {6}.when\(\'\/test\', {[\n\r]* {8}templateUrl: \'home\/test.tpl.html\',[\n\r]* {8}controller: \'TestCtrl\'[^$]*}\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });
      });
    });
  });

  describe('ES6 addRoute using UI Router', function () {
    describe('child state', function () {
      var config
        , fileContents;

      beforeEach(function () {
        config = {
          appScript: 'es6',
          controllerAs: false,
          ngRoute: false
        };
        newState.name = 'test.test';
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-has-state.es6'), 'utf8');
      });

      after(function () {
        newState.name = 'test';
      });

      it('should add child state', function () {
        assert(/\}\)[\n\r]* {6}.state\(\'test.test\', {[\n\r]* {8}url: \'\/test\',[\n\r]* {8}templateUrl: \'home\/test.tpl.html\',[\n\r]* {8}controller: \'TestCtrl\'[\n\r]* {6}\}\);/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });
    });

    describe('controllerAs', function () {
      var config
        , fileContents;

      beforeEach(function () {
        config = {
          appScript: 'es6',
          controllerAs: false,
          ngRoute: false
        };
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-has-state.es6'), 'utf8');
      });

      it('should add new state without controllerAs', function () {
        assert(/.state\(\'test\', {[\n\r]* {8}url: \'\/test\',[\n\r]* {8}templateUrl: \'home\/test.tpl.html\',[\n\r]* {8}controller: \'TestCtrl\'[^$]*}\)/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });

      it('should add new state with controllerAs', function () {
        config.controllerAs = true;
        assert(/.state\(\'test\', {[\n\r]* {8}url: \'\/test\',[\n\r]* {8}templateUrl: \'home\/test.tpl.html\',[\n\r]* {8}controller: \'TestCtrl\',[\n\r]* {8}controllerAs: \'test\'[^$]*}\)/
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
          appScript: 'es6',
          skipController: true,
          ngRoute: false
        };
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-has-state.es6'), 'utf8');
      });

      it('should add state without contorller', function () {
        assert(/.state\(\'test\', {[\n\r]* {8}url: \'\/test\',[\n\r]* {8}templateUrl: \'home\/test.tpl.html\'[\n\r][^$]*}\)/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });
    });

    describe('no state defined', function () {
      describe('passed config function', function () {
        var config
          , fileContents;

        beforeEach(function () {
          config = {
            appScript: 'es6',
            controllerAs: false,
            ngRoute: false
          };
          fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-passed-no-state.es6'), 'utf8');
        });

        it('should add $stateProvider as param', function () {
          assert(/config\(.*, \$stateProvider.*\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });

        it('should add state', function () {
          assert(/\$stateProvider[\n\r]* {6}.state\(\'test\', {[\n\r]* {8}url: \'\/test\',[\n\r]* {8}templateUrl: \'home\/test.tpl.html\',[\n\r]* {8}controller: \'TestCtrl\'[^$]*}\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });
      });
    });
  });

  describe('ES6 addRoute using ngRoute', function () {
    describe('controller As', function () {
      var config
        , fileContents;

      beforeEach(function () {
        config = {
          appScript: 'es6',
          controllerAs: false,
          ngRoute: true
        };
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-passed-has-when.es6'), 'utf8');
      });

      it('should add new when without controllerAs', function () {
        assert(/.when\(\'\/test\', {[\n\r]* {8}templateUrl: \'home\/test.tpl.html\',[\n\r]* {8}controller: \'TestCtrl\'[^$]*}\)/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });

      it('should add new when with controllerAs', function () {
        config.controllerAs = true;
        assert(/.when\(\'\/test\', {[\n\r]* {8}templateUrl: \'home\/test.tpl.html\',[\n\r]* {8}controller: \'TestCtrl\',[\n\r]* {8}controllerAs: \'test\'[^$]*}\)/
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
          appScript: 'es6',
          skipController: true,
          ngRoute: true
        };
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-passed-has-when.es6'), 'utf8');
      });

      it('should add route without controller', function () {
        assert(/.when\(\'\/test\', {[\n\r]* {8}templateUrl: \'home\/test.tpl.html\'[\n\r][^$]*}\)/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });
    });

    describe('no state defined', function () {
      describe('passed config function', function () {
        var config
          , fileContents;

        beforeEach(function () {
          config = {
            appScript: 'es6',
            controllerAs: false,
            ngRoute: true
          };
          fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-passed-no-state.es6'), 'utf8');
        });

        it('should add $routeProvider as param', function () {
          assert(/config\(.*, \$routeProvider.*\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });

        it('should add when', function () {
          assert(/\$routeProvider[\n\r]* {6}.when\(\'\/test\', {[\n\r]* {8}templateUrl: \'home\/test.tpl.html\',[\n\r]* {8}controller: \'TestCtrl\'[^$]*}\)/
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
          ngRoute: false
        };
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-has-state.ts'), 'utf8');
      });

      it('should add new state without controllerAs', function () {
        assert(/.state\(\'test\', {[\n\r]* {6}url: \'\/test\',[\n\r]* {6}templateUrl: \'home\/test.tpl.html\',[\n\r]* {6}controller: \'TestCtrl\'[^$]*}\)/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });

      it('should add new state with controllerAs', function () {
        config.controllerAs = true;
        assert(/.state\(\'test\', {[\n\r]* {6}url: \'\/test\',[\n\r]* {6}templateUrl: \'home\/test.tpl.html\',[\n\r]* {6}controller: \'TestCtrl\',[\n\r]* {6}controllerAs: \'test\'[^$]*}\)/
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
          ngRoute: false
        };
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-has-state.ts'), 'utf8');
      });

      it('should add state without controller', function () {
        assert(/.state\(\'test\', {[\n\r]* {6}url: \'\/test\',[\n\r]* {6}templateUrl: \'home\/test.tpl.html\'[\n\r][^$]*}\)/
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
            ngRoute: false
          };
          fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-passed-no-state.ts'), 'utf8');
        });

        it('should add $stateProvider as param', function () {
          assert(/config\(.*, \$stateProvider: ng.ui.IStateProvider.*\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });

        it('should add state', function () {
          assert(/\$stateProvider[\n\r]* {4}.state\(\'test\', {[\n\r]* {6}url: \'\/test\',[\n\r]* {6}templateUrl: \'home\/test.tpl.html\',[\n\r]* {6}controller: \'TestCtrl\'[^$]*}\)/
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
        assert(/.when\(\'\/test\', {[\n\r]* {6}templateUrl: \'home\/test.tpl.html\',[\n\r]* {6}controller: \'TestCtrl\'[^$]*}\)/
          .test(routeUtils.addRoute(fileContents, newState, config)));
      });

      it('should add new when with controllerAs', function () {
        config.controllerAs = true;
        assert(/.when\(\'\/test\', {[\n\r]* {6}templateUrl: \'home\/test.tpl.html\',[\n\r]* {6}controller: \'TestCtrl\',[\n\r]* {6}controllerAs: \'test\'[^$]*}\)/
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
        assert(/.when\(\'\/test\', {[\n\r]* {6}templateUrl: \'home\/test.tpl.html\'[\n\r][^$]*}\)/
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
            ngRoute: true
          };
          fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-passed-no-state.ts'), 'utf8');
        });

        it('should add $routeProvider as param', function () {
          assert(/config\(.*, \$routeProvider.*\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });

        it('should add when', function () {
          assert(/\$routeProvider[\n\r]* {4}.when\(\'\/test\', {[\n\r]* {6}templateUrl: \'home\/test.tpl.html\',[\n\r]* {6}controller: \'TestCtrl\'[^$]*}\)/
            .test(routeUtils.addRoute(fileContents, newState, config)));
        });
      });
    });
  });
});
