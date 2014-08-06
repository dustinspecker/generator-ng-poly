/*global describe, beforeEach, it */
'use strict';
var join = require('path').join
  , assert = require('yeoman-generator').assert
  , helpers = require('yeoman-generator').test
  , sinon = require('sinon');

describe('ng-poly generator', function () {

  // separate from other tests because it creates a child directory
  // which messes up generator dependencies
  describe('appName different than current directory', function () {
    // expected files from ng-poly:app
    var expected = [
      'e2e/home/home.po.js',
      'e2e/home/home_test.js',
      'app/home/home.tpl.html',
      'app/home/home.less',
      'app/home/home-controller.js',
      'app/home/home-controller_test.js',
      'app/app.js',
      'app/index.html',
      '.editorconfig',
      '.jshintrc',
      '.yo-rc.json',
      'bower.json',
      'Gulpfile.js',
      'karma.config.js',
      'package.json',
      'protractor.config.js'
    ];

    beforeEach(function (done) {
      helpers.testDirectory(join(__dirname, 'temp'), function (err) {
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

        helpers.mockPrompt(this.app, {
          'appName': 'testName',
          'markup': 'html',
          'appScript': 'js',
          'controllerAs': false,
          'passFunc': true,
          'namedFunc': true,
          'testScript': 'js',
          'testDir': 'app',
          'style': 'less',
          'bower': []
        });

        this.app.options['skip-install'] = false; // done to cover installDependencies() branch
        this.app.installDependencies = sinon.spy(); // enables counting the number of function calls
        this.app.run([], function () {
          done();
        });

      }.bind(this));
    });

    it('should create expected files', function () {
      assert.file(expected);
    });

    it('should call installDependencies once', function () {
      assert(this.app.installDependencies.calledOnce);
    });
  });

  // prompts to provide to ng-poly:app
  var prompts = [
  {
    'appName': 'temp',
    'markup': 'html',
    'appScript': 'js',
    'controllerAs': false,
    'passFunc': true,
    'namedFunc': true,
    'testScript': 'js',
    'testDir': 'app',
    'style': 'less',
    'bower': []
  },
  {
    'appName': 'temp',
    'markup': 'jade',
    'appScript': 'js',
    'controllerAs': true,
    'passFunc': true,
    'namedFunc': true,
    'testScript': 'coffee',
    'testDir': 'test',
    'style': 'styl',
    'bower': []
  }];

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

        // cover module scenario with / at end of name
        // on the second prompt (uses Jade)
        if (expectedFiles[2].indexOf('.jade') > -1) {
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
        'app/home/home.tpl.' + config.markup,
        'app/home/home.' + config.style,
        'app/home/home-controller.' + config.appScript,
        config.testDir + '/home/home-controller_test.' + config.testScript,
        'app/app.' + config.appScript,
        'app/index.' + config.markup,
        '.editorconfig',
        '.jshintrc',
        '.yo-rc.json',
        'bower.json',
        'Gulpfile.js',
        'karma.config.js',
        'package.json',
        'protractor.config.js'
      ];

      beforeEach(function (done) {
        helpers.testDirectory(join(__dirname, 'temp'), function (err) {
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

      testGenerator('constant', ['../../constant'], expected.concat(
        'app/home/constant-test-constant.' + config.appScript,
        config.testDir + '/home/constant-test-constant_test.' + config.testScript
      ), {
        module: 'home'
      });

      testGenerator('controller', ['../../controller'], expected.concat(
        'app/home/controller-test-controller.' + config.appScript,
        config.testDir + '/home/controller-test-controller_test.' + config.testScript
      ), {
        module: 'home'
      });

      testGenerator('directive', ['../../directive'], expected.concat(
        'app/home/directive-test-directive.tpl.' + config.markup,
        'app/home/directive-test-directive.' + config.appScript,
        config.testDir + '/home/directive-test-directive_test.' + config.testScript
      ), {
        module: 'home'
      });

      testGenerator('element', ['../../element'], expected.concat(
        'app/components/element-test/element-test.' + config.style,
        'app/components/element-test/element-test.' + config.markup,
        'app/components/element-test/element-test.' + config.appScript
      ));

      testGenerator('factory', ['../../factory'], expected.concat(
        'app/home/factory-test-factory.' + config.appScript,
        config.testDir + '/home/factory-test-factory_test.' + config.testScript
      ), {
        module: 'home'
      });

      testGenerator('filter', ['../../filter'], expected.concat(
        'app/home/filter-test-filter.' + config.appScript,
        config.testDir + '/home/filter-test-filter_test.' + config.testScript
      ), {
        module: 'home'
      });

      testGenerator('module', ['../../module', '../../route', '../../controller', '../../view'], expected.concat(
        'app/module-test/module-test.' + config.appScript,
        'app/module-test/module-test-controller.' + config.appScript,
        config.testDir + '/module-test/module-test-controller_test.' + config.testScript,
        'app/module-test/module-test.tpl.' + config.markup,
        'app/module-test/module-test.' + config.style
      ));

      testGenerator('provider', ['../../provider'], expected.concat(
        'app/home/provider-test-provider.' + config.appScript,
        config.testDir + '/home/provider-test-provider_test.' + config.testScript
      ), {
        module: 'home'
      });

      testGenerator('route', ['../../route', '../../controller', '../../view'], (
        'app/home/route-test.tpl.' + config.markup,
        'app/home/route-test-controller.' + config.appScript,
        config.testDir + '/home/route-test-controller_test.' + config.testScript
      ), {
        'module': 'home',
        'template-url': 'value',
        'url': 'value'
      });

      testGenerator('service', ['../../service'], expected.concat(
        'app/home/service-test-service.' + config.appScript,
        config.testDir + '/home/service-test-service_test.' + config.testScript
      ), {
        module: 'home'
      });

      testGenerator('value', ['../../value'], expected.concat(
        'app/home/value-test-value.' + config.appScript,
        config.testDir + '/home/value-test-value_test.' + config.testScript
      ), {
        module: 'home'
      });

      testGenerator('view', ['../../view'], expected.concat(
        'app/home/view-test.tpl.' + config.markup,
        'app/home/view-test.' + config.style
      ), {
        module: 'home'
      });

    });
  });
});
