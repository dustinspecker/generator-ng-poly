/*global describe, before, beforeEach, it */
'use strict';
var join = require('path').join
  , assert = require('yeoman-generator').assert
  , helpers = require('yeoman-generator').test;

describe('ng-poly generator', function () {
  // prompts to provide to ng-poly:app
  var prompts = [
    {
      appName: 'temp1',
      appDir: 'app',
      markup: 'html',
      appScript: 'js',
      controllerAs: false,
      passFunc: true,
      namedFunc: true,
      testScript: 'js',
      unitTestDir: 'test',
      style: 'less',
      bower: []
    },
    {
      appName: 'temp2',
      appDir: 'app',
      markup: 'jade',
      appScript: 'coffee',
      controllerAs: true,
      passFunc: true,
      namedFunc: true,
      testScript: 'coffee',
      unitTestDir: 'app',
      style: 'styl',
      bower: []
    },
    {
      appName: 'temp3',
      appDir: 'front/',
      markup: 'haml',
      appScript: 'js',
      controllerAs: true,
      passFunc: true,
      namedFunc: true,
      testScript: 'coffee',
      unitTestDir: 'front/',
      style: 'scss',
      bower: []
    },
    {
      appName: 'temp4',
      appDir: 'app',
      markup: 'haml',
      appScript: 'js',
      controllerAs: true,
      passFunc: true,
      namedFunc: true,
      testScript: 'coffee',
      unitTestDir: 'test',
      style: 'css',
      bower: []
    }
  ];

  function testGenerator(genName, deps, expectedFiles, mockPrompts) {
    describe(genName + ' generator with args and prompts', function () {
      beforeEach(function (done) {
        this.app = helpers.createGenerator('ng-poly:' + genName, deps, genName + '-test');
        if (mockPrompts) {
          helpers.mockPrompt(this.app, mockPrompts);
        }
        done();
      });

      it('should create expected files', function (done) {
        this.app.run([], function () {
          assert.file(expectedFiles);
          done();
        });
      });
    });

    describe(genName + ' generator with args and options', function () {
      beforeEach(function (done) {

        // cover module and view scenario with / at end of name
        // on the second prompt (uses Jade)
        if (expectedFiles[3].indexOf('.jade') > -1) {
          this.app = helpers.createGenerator('ng-poly:' + genName, deps, genName + '-test/', mockPrompts);
        } else {
          this.app = helpers.createGenerator('ng-poly:' + genName, deps, genName + '-test', mockPrompts);
        }

        done();
      });

      it('creates expected files', function (done) {
        this.app.run([], function () {
          assert.file(expectedFiles);
          done();
        });
      });
    });
  }

  prompts.forEach(function (config) {
    describe(JSON.stringify(config), function () {

      // expected files from ng-poly:app
      var expected = [
        'e2e/home/home.po.' + config.testScript,
        'e2e/home/home_test.' + config.testScript,
        join(config.appDir, '/home/home.' + config.appScript),
        join(config.appDir, '/home/home.tpl.' + config.markup),
        join(config.appDir, '/home/home.' + config.style),
        join(config.appDir, '/home/home-controller.' + config.appScript),
        join(config.unitTestDir, '/home/home-controller_test.' + config.testScript),
        join(config.appDir, '/app.' + config.appScript),
        join(config.appDir, '/index.' + config.markup),
        '.bowerrc',
        '.editorconfig',
        '.jscsrc',
        '.jshintrc',
        '.yo-rc.json',
        'bower.json',
        'Gulpfile.js',
        'karma.config.js',
        'package.json',
        'protractor.config.js',
        'README.md'
      ];

      before(function (done) {
        helpers.testDirectory(join(__dirname, config.appName), function (err) {
          if (err) {
            done(err);
          }

          this.app = helpers.createGenerator('ng-poly:app', [
            '../../app',
            '../../module',
            '../../route',
            '../../controller',
            '../../view'
          ]);

          helpers.mockPrompt(this.app, config);

          this.app.options['skip-install'] = true;
          this.app.run([], function () {
            done();
          });

        }.bind(this));
      });

      it('creates expected files', function (done) {
        assert.file(expected);
        done();
      });

      // module name has trailing slash to test trailing slash in genBase
      testGenerator('constant', ['../../constant'], expected.concat(
        join(config.appDir, '/home/constant-test-constant.' + config.appScript),
        join(config.unitTestDir, '/home/constant-test-constant_test.' + config.testScript)
      ), {
        module: 'home/'
      });

      // module is root module
      testGenerator('controller', ['../../controller'], expected.concat(
        join(config.appDir, '/controller-test-controller.' + config.appScript),
        join(config.unitTestDir, '/controller-test-controller_test.' + config.testScript)
      ), {
        module: config.appDir + ''
      });

      testGenerator('directive', ['../../directive'], expected.concat(
        join(config.appDir, '/home/directive-test-directive.tpl.' + config.markup),
        join(config.appDir, '/home/directive-test-directive.' + config.appScript),
        join(config.unitTestDir, '/home/directive-test-directive_test.' + config.testScript)
      ), {
        module: 'home'
      });

      testGenerator('element', ['../../element'], expected.concat(
        join(config.appDir, '/components/element-test/element-test.' + config.style),
        join(config.appDir, '/components/element-test/element-test.' + config.markup),
        join(config.appDir, '/components/element-test/element-test.' + config.appScript)
      ));

      testGenerator('factory', ['../../factory'], expected.concat(
        join(config.appDir, '/home/factory-test-factory.' + config.appScript),
        join(config.unitTestDir, '/home/factory-test-factory_test.' + config.testScript)
      ), {
        module: 'home'
      });

      testGenerator('filter', ['../../filter'], expected.concat(
        join(config.appDir, '/home/filter-test-filter.' + config.appScript),
        join(config.unitTestDir, '/home/filter-test-filter_test.' + config.testScript)
      ), {
        module: 'home'
      });

      testGenerator('provider', ['../../provider'], expected.concat(
        join(config.appDir, '/home/provider-test-provider.' + config.appScript),
        join(config.unitTestDir, '/home/provider-test-provider_test.' + config.testScript)
      ), {
        module: 'home'
      });

      testGenerator('route', ['../../route', '../../controller', '../../view'], (
        join(config.appDir, '/home/route-test.tpl.' + config.markup),
        join(config.appDir, '/home/route-test-controller.' + config.appScript),
        join(config.unitTestDir, '/home/route-test-controller_test.' + config.testScript)
      ), {
        module: 'home',
        'template-url': 'value',
        url: 'value'
      });

      testGenerator('service', ['../../service'], expected.concat(
        join(config.appDir, '/home/service-test-service.' + config.appScript),
        join(config.unitTestDir, '/home/service-test-service_test.' + config.testScript)
      ), {
        module: 'home'
      });

      testGenerator('value', ['../../value'], expected.concat(
        join(config.appDir, '/home/value-test-value.' + config.appScript),
        join(config.unitTestDir, '/home/value-test-value_test.' + config.testScript)
      ), {
        module: 'home'
      });

      testGenerator('view', ['../../view'], expected.concat(
        join(config.appDir, '/home/view-test.tpl.' + config.markup),
        join(config.appDir, '/home/view-test.' + config.style)
      ), {
        module: 'home'
      });

    });
  });
});
