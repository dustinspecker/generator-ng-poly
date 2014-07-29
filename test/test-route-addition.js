/*global describe, beforeEach, it */
'use strict';
var join = require('path').join
  , assert = require('yeoman-generator').assert
  , helpers = require('yeoman-generator').test;

describe('route generator', function () {

  describe('adding a new route without Controller As', function () {
    // generate default app
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
          'appName': 'temp',
          'markup': 'html',
          'appScript': 'js',
          'controllerAs': false,
          'passFunc': true,
          'namedFunc': true,
          'testScript': 'js',
          'testDir': 'src',
          'style': 'less'
        });

        this.app.options['skip-install'] = true;
        this.app.run([], function () {
          done();
        });

      }.bind(this));
    });

    it('should add test state and url to src/home/home.js', function (done) {
      this.app = helpers.createGenerator('ng-poly:route', [
        '../../route',
        '../../controller',
        '../../view'
      ], 'test');

      helpers.mockPrompt(this.app, {
        module: 'home',
        url: '/test'
      });

      this.app.run([], function () {
        assert.fileContent('src/home/home.js', /.state\(\'test\', {[^$]*url: \'\/test\'.[^$]*templateUrl: \'home\/test.tpl.html\',[^$]*controller: \'TestCtrl\'[^$]*}\)/);
        done();
      });
    });
  });

  describe('adding a new route with Controller As', function () {
    // generate default app
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
          'appName': 'temp',
          'markup': 'html',
          'appScript': 'js',
          'controllerAs': true,
          'passFunc': false,
          'namedFunc': true,
          'testScript': 'js',
          'testDir': 'src',
          'style': 'less'
        });

        this.app.options['skip-install'] = true;
        this.app.run([], function () {
          done();
        });

      }.bind(this));
    });

    it('should add test state and url to src/home/home.js', function (done) {
      this.app = helpers.createGenerator('ng-poly:route', [
        '../../route',
        '../../controller',
        '../../view'
      ], 'test');

      helpers.mockPrompt(this.app, {
        module: 'home',
        url: '/test'
      });

      this.app.run([], function () {
        assert.fileContent('src/home/home.js', /.state\(\'test\', {[^$]*url: \'\/test\'.[^$]*templateUrl: \'home\/test.tpl.html\',[^$]*controller: \'TestCtrl as test\'[^$]*}\)/);
        done();
      });
    });
  });

});