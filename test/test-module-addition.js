/*global describe, before, it */
'use strict';
var join = require('path').join
  , assert = require('yeoman-generator').assert
  , helpers = require('yeoman-generator').test;

describe('module generator', function () {

  // generate default app
  before(function (done) {
    helpers.testDirectory(join(__dirname, 'module-temp'), function (err) {
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
        appName: 'module-temp',
        markup: 'html',
        appScript: 'js',
        controllerAs: false,
        passFunc: true,
        namedFunc: true,
        testScript: 'js',
        testDir: 'app',
        style: 'less',
        bower: []
      });

      this.app.options['skip-install'] = true;
      this.app.run([], function () {
        done();
      });

    }.bind(this));
  });

  describe('adding a new empty module', function () {
    before(function (done) {
      this.app = helpers.createGenerator('ng-poly:module', [
        '../../module',
        '../../route',
        '../../controller',
        '../../view'
      ], 'testGroup');
      this.app.options.empty = true;
      this.app.run([], function () {
        done();
      });
    });

    it('should not create a controller and view', function (done) {
      this.app.run([], function () {
        assert.noFile([
          'app/test-group/test-group-controller.js',
          'app/test-group/test-group-controller_test.js',
          'app/test-group/test-group.tpl.html',
          'e2e/test-group/test-group.po.js',
          'e2e/test-group/test-group_test.js'
        ]);
        done();
      });
    });
  });

  // trailing slash to test trailing slash removal
  describe('adding a new module', function () {
    before(function (done) {
      this.app = helpers.createGenerator('ng-poly:module', [
        '../../module',
        '../../route',
        '../../controller',
        '../../view'
      ], 'test/');

      this.app.run([], function () {
        done();
      });
    });

    it('should add comma to ui.router in app/app.js', function () {
      assert.fileContent('app/app.js', /    \'ui.router\',/);
    });

    it('should add test to app/app.js deps', function () {
      assert.fileContent('app/app.js', /    \'test\'/);
    });
  });

  describe('adding a deep level module', function () {
    before(function (done) {
      this.app = helpers.createGenerator('ng-poly:module', [
        '../../module',
        '../../route',
        '../../controller',
        '../../view'
      ], 'home/door');

      this.app.options['app-script'] = 'coffee';
      this.app.run([], function () {
        done();
      });
    });

    describe('adding a deeper level module', function () {
      before(function (done) {
        this.app = helpers.createGenerator('ng-poly:module', [
          '../../module',
          '../../route',
          '../../controller',
          '../../view'
        ], 'home/door/handle');

        this.app.run([], function () {
          done();
        });
      });

      it('should add door.handle to app/home/door.coffee', function () {
        assert.fileContent('app/home/door/door.coffee', /    \'door.handle\'/);
      });
    });

    it('should add comma to ui.router in app/home/home.js deps', function () {
      assert.fileContent('app/home/home.js', /    \'ui.router\',/);
    });

    it('should add home.door to app/home/home.js deps', function () {
      assert.fileContent('app/home/home.js', /    \'home.door\'/);
    });

    it('should name module in app/home/door/door.coffee home.door', function () {
      assert.fileContent('app/home/door/door.coffee', /angular[^$]*.module[^$]*\'home.door\'/);
    });
  });

});
