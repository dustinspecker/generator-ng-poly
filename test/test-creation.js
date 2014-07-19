/*global describe, beforeEach, it */
'use strict';
var join = require('path').join
  , assert = require('yeoman-generator').assert
  , helpers = require('yeoman-generator').test;

describe('ng-poly generator', function () {

  // prompts to provide to ng-poly:app
  var prompts = [
  {
    'appName': 'temp',
    'markup': 'html',
    'appScript': 'js',
    'testScript': 'js',
    'style': 'less'
  },
  {
    'appName': 'temp',
    'markup': 'jade',
    'appScript': 'js',
    'testScript': 'coffee',
    'style': 'less'
  }];  

  function testGenerator(genName, deps, expectedFiles, mockPrompts) {
    describe(genName + ' generator', function () {
      beforeEach(function (done) {
        this.app = helpers.createGenerator('ng-poly:' + genName, deps, genName + '-test');
        if(mockPrompts) {
          helpers.mockPrompt(this.app, mockPrompts);
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
        'src/home/HomeCtrl.' + config.appScript,
        'src/home/HomeCtrl_test.' + config.testScript,
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
        'src/test/constantTestConstant.' + config.appScript,
        'src/test/constantTestConstant_test.' + config.testScript
      ), {
        module: 'test'
      });

      testGenerator('controller', ['../../controller'], expected.concat(
        'src/test/ControllerTestCtrl.' + config.appScript,
        'src/test/ControllerTestCtrl_test.' + config.testScript
      ), {
        module: 'test'
      });
      
      testGenerator('directive', ['../../directive'], expected.concat(
        'src/test/directiveTestDirective.' + config.markup,
        'src/test/directiveTestDirective.' + config.appScript,
        'src/test/directiveTestDirective_test.' + config.testScript
      ), {
        module: 'test'
      });

      testGenerator('element', ['../../element'], expected.concat(
        'src/components/element-test/element-test.' + config.style,
        'src/components/element-test/element-test.' + config.markup,
        'src/components/element-test/element-test.' + config.appScript
      ));

      testGenerator('factory', ['../../factory'], expected.concat(
        'src/test/factoryTestFactory.' + config.appScript,
        'src/test/factoryTestFactory_test.' + config.testScript
      ), {
        module: 'test'
      });

      testGenerator('filter', ['../../filter'], expected.concat(
        'src/test/filterTestFilter.' + config.appScript,
        'src/test/filterTestFilter_test.' + config.testScript
      ), {
        module: 'test'
      });

      testGenerator('module', ['../../module', '../../controller', '../../view'], expected.concat(
        'src/test/module-test.' + config.appScript,
        'src/test/ModuleTestCtrl.' + config.appScript,
        'src/test/ModuleTestCtrl_test.' + config.testScript,
        'src/test/moduleTest.tpl.' + config.markup
      ), {
        module: 'test'
      });

      testGenerator('provider', ['../../provider'], expected.concat(
        'src/test/providerTestProvider.' + config.appScript,
        'src/test/providerTestProvider_test.' + config.testScript
      ), {
        module: 'test'
      });

      testGenerator('route', ['../../route', '../../controller', '../../view'], (
        'src/home/routeTest.tpl.' + config.markup,
        'src/home/RouteTestCtrl.' + config.appScript,
        'src/home/RouteTestCtrl_test.' + config.testScript
      ), {
        'module': 'home',
        'url': 'value'
      });

      testGenerator('service', ['../../service'], expected.concat(
        'src/test/serviceTestService.' + config.appScript,
        'src/test/serviceTestService_test.' + config.testScript
      ), {
        module: 'test'
      });

      testGenerator('value', ['../../value'], expected.concat(
        'src/test/valueTestValue.' + config.appScript,
        'src/test/valueTestValue_test.' + config.testScript
      ), {
        module: 'test'
      });

      testGenerator('view', ['../../view'], expected.concat(
        'src/test/viewTest.tpl.' + config.markup
      ), {
        module: 'test'
      });

    });
  });
});