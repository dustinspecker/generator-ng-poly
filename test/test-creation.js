/*global describe, beforeEach, it */
'use strict';
var path = require('path')
  , helpers = require('yeoman-generator').test;

describe('ng-poly generator', function () {
  var app;
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      app = helpers.createGenerator('ng-poly:app', [
        '../../app',
        '../../controller',
        '../../view'
      ]);

      helpers.mockPrompt(app, {
        'appName': true
      });

      app.options['skip-install'] = true;
      app.run([], function () {
        done();
      });

    });
  });

  it('creates expected files', function (done) {
    var expected = [
      // add files you expect to exist here.
      'src/jade/index.jade',
      'src/jade/views/main.jade',
      'src/js/app.js',
      'src/js/controllers/MainCtrl.js',
      'src/less/includes/variables.less',
      'src/less/style.less',
      'tests/unit/controllers/MainCtrl.spec.js',
      '.editorconfig',
      '.jshintrc',
      '.yo-rc.json',
      'bower.json',
      'Gulpfile.js',
      'package.json'
    ];

    helpers.assertFile(expected);
    done();
  });

  describe('constant generator', function () {
    beforeEach(function (done) {
      app = helpers.createGenerator('ng-poly:constant', ['../../constant'], 'constant-test');
      done();
    });

    it('creates expected files', function (done) {
      var expected = [
        'src/js/constants/constantTest.js',
        'tests/unit/constants/constantTest.spec.js'
      ];

      app.run([], function () {
        app = helpers.createGenerator('ng-poly:constant', ['../../constant'], 'constant-test');
        helpers.assertFile(expected);
        done();
      });
    });
  });

  describe('controller generator', function () {
    beforeEach(function (done) {
      app = helpers.createGenerator('ng-poly:controller', ['../../controller'], 'controller-test');
      done();
    });

    it('creates expected files', function (done) {
      var expected = [
        'src/js/controllers/ControllerTestCtrl.js',
        'tests/unit/controllers/ControllerTestCtrl.spec.js'
      ];

      app.run([], function () {
        helpers.assertFile(expected);
        done();
      });
    });
  });

  describe('directive generator', function () {
    beforeEach(function (done) {
      app = helpers.createGenerator('ng-poly:directive', ['../../directive'], 'directive-test');
      done();
    });

    it('creates expected files', function (done) {
      var expected = [
        'src/js/directives/directiveTest.js',
        'tests/unit/directives/directiveTest.spec.js'
      ];

      app.run([], function () {
        helpers.assertFile(expected);
        done();
      });
    });
  });

  describe('element generator', function () {
    beforeEach(function (done) {
      app = helpers.createGenerator('ng-poly:element', ['../../element'], 'element-test');
      done();
    });

    it('creates expected files', function (done) {
      var expected = [
        'src/components/element-test/element-test.less',
        'src/components/element-test/element-test.jade',
        'src/components/element-test/element-test.js'
      ];

      app.run([], function () {
        helpers.assertFile(expected);
        done();
      });
    });
  });

  describe('factory generator', function () {
    beforeEach(function (done) {
      app = helpers.createGenerator('ng-poly:factory', ['../../factory'], 'factory-test');
      done();
    });

    it('creates expected files', function (done) {
      var expected = [
        'src/js/factories/factoryTest.js',
        'tests/unit/factories/factoryTest.spec.js'
      ];

      app.run([], function () {
        helpers.assertFile(expected);
        done();
      });
    });
  });

  describe('filter generator', function () {
    beforeEach(function (done) {
      app = helpers.createGenerator('ng-poly:filter', ['../../filter'], 'filter-test');
      done();
    });

    it('creates expected files', function (done) {
      var expected = [
        'src/js/filters/filterTest.js',
        'tests/unit/filters/filterTest.spec.js'
      ];

      app.run([], function () {
        helpers.assertFile(expected);
        done();
      });
    });
  });

  describe('provider generator', function () {
    beforeEach(function (done) {
      app = helpers.createGenerator('ng-poly:provider', ['../../provider'], 'provider-test');
      done();
    });

    it('creates expected files', function (done) {
      var expected = [
        'src/js/providers/providerTest.js',
        'tests/unit/providers/providerTest.spec.js'
      ];

      app.run([], function () {
        helpers.assertFile(expected);
        done();
      });
    });
  });

  describe('route generator', function () {
    beforeEach(function (done) {
      app = helpers.createGenerator('ng-poly:route', ['../../route', '../../controller', '../../view'], 'route-test');
      helpers.mockPrompt(app, {
        'url': 'value'
      });
      done();
    });

    it('creates expected files', function (done) {
      var expected = [
        'src/jade/views/routeTest.jade',
        'src/js/controllers/RouteTestCtrl.js',
        'src/js/app.js',
        'tests/unit/controllers/RouteTestCtrl.spec.js'
      ];

      app.run([], function () {
        helpers.assertFile(expected);
        done();
      })
      
    });
  });

  describe('service generator', function () {
    beforeEach(function (done) {
      app = helpers.createGenerator('ng-poly:service', ['../../service'], 'service-test');
      done();
    });

    it('creates expected files', function (done) {
      var expected = [
        'src/js/services/serviceTest.js',
        'tests/unit/services/serviceTest.spec.js'
      ];

      app.run([], function () {
        helpers.assertFile(expected);
        done();
      });
    });
  });

  describe('value generator', function () {
    beforeEach(function (done) {
      app = helpers.createGenerator('ng-poly:value', ['../../value'], 'value-test');
      done();
    });

    it('creates expected files', function (done) {
      var expected = [
        'src/js/values/valueTest.js',
        'tests/unit/values/valueTest.spec.js'
      ];

      app.run([], function () {
        helpers.assertFile(expected);
        done();
      });
    });
  });

  describe('view generator', function () {
    beforeEach(function (done) {
      app = helpers.createGenerator('ng-poly:view', ['../../view'], 'view-test');
      done();
    });

    it('creates expected files', function (done) {
      var expected = [
        'src/jade/views/viewTest.jade'
      ];

      app.run([], function () {
        helpers.assertFile(expected);
        done();
      });
    });
  });

});
