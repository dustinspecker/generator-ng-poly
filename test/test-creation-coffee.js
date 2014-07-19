/*global describe, beforeEach, it */
'use strict';
var path = require('path')
  , helpers = require('yeoman-generator').test;

describe('ng-poly generator CoffeeScript', function () {
  var expected = [
    // add files you expect to exist here.
    'src/markup/index.html',
    'src/markup/views/main.html',
    'src/js/app.js',
    'src/js/controllers/MainCtrl.js',
    'src/less/includes/variables.less',
    'src/less/style.less',
    'tests/unit/controllers/MainCtrl.spec.coffee',
    '.editorconfig',
    '.jshintrc',
    '.yo-rc.json',
    'bower.json',
    'Gulpfile.js',
    'package.json'
  ];

  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        done(err);
      }

      this.app = helpers.createGenerator('ng-poly:app', [
        '../../app',
        '../../controller',
        '../../view'
      ]);

      helpers.mockPrompt(this.app, {
        'appName': true,
        'markup': 'html',
        'appScript': 'js',
        'testScript': 'coffee',
        'style': 'less'
      });

      this.app.options['skip-install'] = true;
      this.app.run([], function () {
        done();
      });

    }.bind(this));
  });

  it('creates expected files', function (done) {
    helpers.assertFile(expected);
    done();
  });

  describe('constant generator', function () {
    beforeEach(function (done) {
      this.app = helpers.createGenerator('ng-poly:constant', ['../../constant'], 'constant-test');
      done();
    });

    it('creates expected files', function (done) {
      this.app.run([], function () {
        this.app = helpers.createGenerator('ng-poly:constant', ['../../constant'], 'constant-test');
        helpers.assertFile(expected.concat(
          'src/js/constants/constantTest.js',
          'tests/unit/constants/constantTest.spec.coffee'
        ));
        done();
      }.bind(this));
    });
  });

  describe('controller generator', function () {
    beforeEach(function (done) {
      this.app = helpers.createGenerator('ng-poly:controller', ['../../controller'], 'controller-test');
      done();
    });

    it('creates expected files', function (done) {
      this.app.run([], function () {
        helpers.assertFile(expected.concat(
          'src/js/controllers/ControllerTestCtrl.js',
          'tests/unit/controllers/ControllerTestCtrl.spec.coffee'
        ));
        done();
      }.bind(done));
    });
  });

  describe('directive generator', function () {
    beforeEach(function (done) {
      this.app = helpers.createGenerator('ng-poly:directive', ['../../directive'], 'directive-test');
      done();
    });

    it('creates expected files', function (done) {
      this.app.run([], function () {
        helpers.assertFile(expected.concat(
          'src/markup/templates/directiveTest.html',
          'src/js/directives/directiveTest.js',
          'tests/unit/directives/directiveTest.spec.coffee'
        ));
        done();
      });
    });
  });

  describe('element generator', function () {
    beforeEach(function (done) {
      this.app = helpers.createGenerator('ng-poly:element', ['../../element'], 'element-test');
      done();
    });

    it('creates expected files', function (done) {
      this.app.run([], function () {
        helpers.assertFile(expected.concat(
          'src/components/element-test/element-test.less',
          'src/components/element-test/element-test.html',
          'src/components/element-test/element-test.js'
        ));
        done();
      });
    });
  });

  describe('factory generator', function () {
    beforeEach(function (done) {
      this.app = helpers.createGenerator('ng-poly:factory', ['../../factory'], 'factory-test');
      done();
    });

    it('creates expected files', function (done) {
      this.app.run([], function () {
        helpers.assertFile(expected.concat(
          'src/js/factories/factoryTest.js',
          'tests/unit/factories/factoryTest.spec.coffee'
        ));
        done();
      });
    });
  });

  describe('filter generator', function () {
    beforeEach(function (done) {
      this.app = helpers.createGenerator('ng-poly:filter', ['../../filter'], 'filter-test');
      done();
    });

    it('creates expected files', function (done) {
      this.app.run([], function () {
        helpers.assertFile(expected.concat(
          'src/js/filters/filterTest.js',
          'tests/unit/filters/filterTest.spec.coffee'
        ));
        done();
      });
    });
  });

  describe('provider generator', function () {
    beforeEach(function (done) {
      this.app = helpers.createGenerator('ng-poly:provider', ['../../provider'], 'provider-test');
      done();
    });

    it('creates expected files', function (done) {
      var expected = [
        'src/js/providers/providerTest.js',
        'tests/unit/providers/providerTest.spec.coffee'
      ];

      this.app.run([], function () {
        helpers.assertFile(expected);
        done();
      });
    });
  });

  describe('route generator', function () {
    beforeEach(function (done) {
      this.app = helpers.createGenerator('ng-poly:route', ['../../route', '../../controller', '../../view'], 'route-test');
      helpers.mockPrompt(this.app, {
        'url': 'value'
      });
      done();
    });

    it('creates expected files', function (done) {
      var expected = [
        'src/markup/views/routeTest.html',
        'src/js/controllers/RouteTestCtrl.js',
        'src/js/app.js',
        'tests/unit/controllers/RouteTestCtrl.spec.coffee'
      ];

      this.app.run([], function () {
        helpers.assertFile(expected);
        done();
      });
      
    });
  });

  describe('service generator', function () {
    beforeEach(function (done) {
      this.app = helpers.createGenerator('ng-poly:service', ['../../service'], 'service-test');
      done();
    });

    it('creates expected files', function (done) {
      var expected = [
        'src/js/services/serviceTest.js',
        'tests/unit/services/serviceTest.spec.coffee'
      ];

      this.app.run([], function () {
        helpers.assertFile(expected);
        done();
      });
    });
  });

  describe('value generator', function () {
    beforeEach(function (done) {
      this.app = helpers.createGenerator('ng-poly:value', ['../../value'], 'value-test');
      done();
    });

    it('creates expected files', function (done) {
      var expected = [
        'src/js/values/valueTest.js',
        'tests/unit/values/valueTest.spec.coffee'
      ];

      this.app.run([], function () {
        helpers.assertFile(expected);
        done();
      });
    });
  });

  describe('view generator', function () {
    beforeEach(function (done) {
      this.app = helpers.createGenerator('ng-poly:view', ['../../view'], 'view-test');
      done();
    });

    it('creates expected files', function (done) {
      var expected = [
        'src/markup/views/viewTest.html'
      ];

      this.app.run([], function () {
        helpers.assertFile(expected);
        done();
      });
    });
  });

});
