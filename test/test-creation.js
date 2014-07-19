/*global describe, beforeEach, it */
'use strict';
var join = require('path').join
  , assert = require('yeoman-generator').assert
  , helpers = require('yeoman-generator').test;

describe('ng-poly generator', function () {

  // prompts to provide to ng-poly:app
  var prompts = [
  {
    'appName': true,
    'markup': 'html',
    'appScript': 'js',
    'testScript': 'js',
    'style': 'less'
  },
  {
    'appName': true,
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
        'src/markup/index.' + config.markup,
        'src/markup/views/main.' + config.markup,
        'src/js/app.' + config.appScript,
        'src/js/controllers/MainCtrl.' + config.appScript,
        'src/less/includes/variables.' + config.style,
        'src/less/style.' + config.style,
        'tests/unit/controllers/MainCtrl.spec.' + config.testScript,
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
        'src/js/constants/constantTest.' + config.appScript,
        'tests/unit/constants/constantTest.spec.' + config.testScript
      ));

      testGenerator('controller', ['../../controller'], expected.concat(
        'src/js/controllers/ControllerTestCtrl.' + config.appScript,
        'tests/unit/controllers/ControllerTestCtrl.spec.' + config.testScript
      ));

      testGenerator('directive', ['../../directive'], expected.concat(
        'src/markup/templates/directiveTest.' + config.markup,
        'src/js/directives/directiveTest.' + config.appScript,
        'tests/unit/directives/directiveTest.spec.' + config.testScript
      ));

      testGenerator('element', ['../../element'], expected.concat(
        'src/components/element-test/element-test.' + config.style,
        'src/components/element-test/element-test.' + config.markup,
        'src/components/element-test/element-test.' + config.appScript
      ));

      testGenerator('factory', ['../../factory'], expected.concat(
        'src/js/factories/factoryTest.' + config.appScript,
        'tests/unit/factories/factoryTest.spec.' + config.testScript
      ));

      testGenerator('filter', ['../../filter'], expected.concat(
        'src/js/filters/filterTest.' + config.appScript,
        'tests/unit/filters/filterTest.spec.' + config.testScript
      ));

      testGenerator('provider', ['../../provider'], expected.concat(
        'src/js/providers/providerTest.' + config.appScript,
        'tests/unit/providers/providerTest.spec.' + config.testScript
      ));

      testGenerator('route', ['../../route', '../../controller', '../../view'], (
        'src/markup/views/routeTest.' + config.markup,
        'src/js/controllers/RouteTestCtrl.' + config.appScript,
        'tests/unit/controllers/RouteTestCtrl.spec.' + config.testScript
      ), {
        'url': 'value'
      });

      testGenerator('service', ['../../service'], expected.concat(
        'src/js/services/serviceTest.' + config.appScript,
        'tests/unit/services/serviceTest.spec.' + config.testScript
      ));

      testGenerator('value', ['../../value'], expected.concat(
        'src/js/values/valueTest.' + config.appScript,
        'tests/unit/values/valueTest.spec.' + config.testScript
      ));

      testGenerator('view', ['../../view'], expected.concat(
        'src/markup/views/viewTest.' + config.markup
      ));

    });
  });
});