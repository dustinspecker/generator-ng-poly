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
      'src/home/home.tpl.html',
      'src/home/home.less',
      'src/home/home-controller.js',
      'src/home/home-controller_test.js',
      'src/app.js',
      'src/index.html',
      '.editorconfig',
      '.jshintrc',
      '.yo-rc.json',
      'bower.json',
      'Gulpfile.js',
      'package.json'
    ];

    beforeEach(function (done) {
      helpers.testDirectory(join(__dirname, 'temp'), function (err) {
        if (err) {
          done(err);
        }

        this.app = helpers.createGenerator('ng-poly:app', [
          '../../app',
          '../../controller',
          '../../module',
          '../../view'
        ]);

        helpers.mockPrompt(this.app, {
          'appName': 'testName',
          'markup': 'html',
          'appScript': 'js',
          'controllerAs': false,
          'namedFunc': true,
          'testScript': 'js',
          'testDir': 'src',
          'style': 'less'
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
    'namedFunc': true,
    'testScript': 'js',
    'testDir': 'src',
    'style': 'less'
  },
  {
    'appName': 'temp',
    'markup': 'jade',
    'appScript': 'js',
    'controllerAs': true,
    'namedFunc': true,
    'testScript': 'coffee',
    'testDir': 'test',
    'style': 'less'
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
        if (expectedFiles[0].indexOf('.jade') > -1) {
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
        'src/home/home.tpl.' + config.markup,
        'src/home/home.' + config.style,
        'src/home/home-controller.' + config.appScript,
        config.testDir + '/home/home-controller_test.' + config.testScript,
        'src/app.' + config.appScript,
        'src/index.' + config.markup,
        '.editorconfig',
        '.jshintrc',
        '.yo-rc.json',
        'bower.json',
        'Gulpfile.js',
        'package.json'
      ];

      beforeEach(function (done) {
        helpers.testDirectory(join(__dirname, 'temp'), function (err) {
          if (err) {
            done(err);
          }

          this.app = helpers.createGenerator('ng-poly:app', [
            '../../app',
            '../../controller',
            '../../module',
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
        'src/home/constant-test-constant.' + config.appScript,
        config.testDir + '/home/constant-test-constant_test.' + config.testScript
      ), {
        module: 'home'
      });

      testGenerator('controller', ['../../controller'], expected.concat(
        'src/home/controller-test-controller.' + config.appScript,
        config.testDir + '/home/controller-test-controller_test.' + config.testScript
      ), {
        module: 'home'
      });
      
      testGenerator('directive', ['../../directive'], expected.concat(
        'src/home/directive-test-directive.tpl.' + config.markup,
        'src/home/directive-test-directive.' + config.appScript,
        config.testDir + '/home/directive-test-directive_test.' + config.testScript
      ), {
        module: 'home'
      });

      testGenerator('element', ['../../element'], expected.concat(
        'src/components/element-test/element-test.' + config.style,
        'src/components/element-test/element-test.' + config.markup,
        'src/components/element-test/element-test.' + config.appScript
      ));

      testGenerator('factory', ['../../factory'], expected.concat(
        'src/home/factory-test-factory.' + config.appScript,
        config.testDir + '/home/factory-test-factory_test.' + config.testScript
      ), {
        module: 'home'
      });

      testGenerator('filter', ['../../filter'], expected.concat(
        'src/home/filter-test-filter.' + config.appScript,
        config.testDir + '/home/filter-test-filter_test.' + config.testScript
      ), {
        module: 'home'
      });

      testGenerator('module', ['../../module', '../../controller', '../../view'], expected.concat(
        'src/module-test/module-test.' + config.appScript,
        'src/module-test/module-test-controller.' + config.appScript,
        config.testDir + '/module-test/module-test-controller_test.' + config.testScript,
        'src/module-test/module-test.tpl.' + config.markup
      ));

      testGenerator('provider', ['../../provider'], expected.concat(
        'src/home/provider-test-provider.' + config.appScript,
        config.testDir + '/home/provider-test-provider_test.' + config.testScript
      ), {
        module: 'home'
      });

      testGenerator('route', ['../../route', '../../controller', '../../view'], (
        'src/home/route-test.tpl.' + config.markup,
        'src/home/route-test-controller.' + config.appScript,
        config.testDir + '/home/route-test-controller_test.' + config.testScript
      ), {
        'module': 'home',
        'url': 'value'
      });

      testGenerator('service', ['../../service'], expected.concat(
        'src/home/service-test-service.' + config.appScript,
        config.testDir + '/home/service-test-service_test.' + config.testScript
      ), {
        module: 'home'
      });

      testGenerator('value', ['../../value'], expected.concat(
        'src/home/value-test-value.' + config.appScript,
        config.testDir + '/home/value-test-value_test.' + config.testScript
      ), {
        module: 'home'
      });

      testGenerator('view', ['../../view'], expected.concat(
        'src/home/view-test.tpl.' + config.markup
      ), {
        module: 'home'
      });

    });
  });
});