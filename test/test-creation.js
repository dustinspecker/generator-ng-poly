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
        'src/home/constantTestConstant.' + config.appScript,
        'src/home/constantTestConstant_test.' + config.testScript
      ), {
        module: 'home'
      });

      testGenerator('controller', ['../../controller'], expected.concat(
        'src/home/ControllerTestCtrl.' + config.appScript,
        'src/home/ControllerTestCtrl_test.' + config.testScript
      ), {
        module: 'home'
      });
      
      testGenerator('directive', ['../../directive'], expected.concat(
        'src/home/directiveTestDirective.' + config.markup,
        'src/home/directiveTestDirective.' + config.appScript,
        'src/home/directiveTestDirective_test.' + config.testScript
      ), {
        module: 'home'
      });

      testGenerator('element', ['../../element'], expected.concat(
        'src/components/element-test/element-test.' + config.style,
        'src/components/element-test/element-test.' + config.markup,
        'src/components/element-test/element-test.' + config.appScript
      ));

      testGenerator('factory', ['../../factory'], expected.concat(
        'src/home/factoryTestFactory.' + config.appScript,
        'src/home/factoryTestFactory_test.' + config.testScript
      ), {
        module: 'home'
      });

      testGenerator('filter', ['../../filter'], expected.concat(
        'src/home/filterTestFilter.' + config.appScript,
        'src/home/filterTestFilter_test.' + config.testScript
      ), {
        module: 'home'
      });

      testGenerator('module', ['../../module', '../../controller', '../../view'], expected.concat(
        'src/module-test/module-test.' + config.appScript,
        'src/module-test/ModuleTestCtrl.' + config.appScript,
        'src/module-test/ModuleTestCtrl_test.' + config.testScript,
        'src/module-test/moduleTest.tpl.' + config.markup
      ));

      testGenerator('provider', ['../../provider'], expected.concat(
        'src/home/providerTestProvider.' + config.appScript,
        'src/home/providerTestProvider_test.' + config.testScript
      ), {
        module: 'home'
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
        'src/home/serviceTestService.' + config.appScript,
        'src/home/serviceTestService_test.' + config.testScript
      ), {
        module: 'home'
      });

      testGenerator('value', ['../../value'], expected.concat(
        'src/home/valueTestValue.' + config.appScript,
        'src/home/valueTestValue_test.' + config.testScript
      ), {
        module: 'home'
      });

      testGenerator('view', ['../../view'], expected.concat(
        'src/home/viewTest.tpl.' + config.markup
      ), {
        module: 'home'
      });

    });
  });
});