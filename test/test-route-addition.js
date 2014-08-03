/*global describe, beforeEach, it */
'use strict';
var assert = require('assert')
  , fs = require('fs')
  , path = require('path')
  , utils = require('../utils');

describe('addRoute', function () {
  var newState = {
    module:'home',
    url: '/test',
    lowerCamel: 'test',
    hyphenName: 'test',
    ctrlName: 'TestCtrl'
  };

  describe('controllerAs', function () {
    it('should add new state without controllerAS', function () {
      var fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-has-state.js'), 'utf8');
      assert(/.state\(\'test\', {[^$]*url: \'\/test\'.[^$]*templateUrl: \'home\/test.tpl.html\',[^$]*controller: \'TestCtrl\'[^$]*}\)/
        .test(utils.addRoute(fileContents, newState, false, false)));
    });

    it('should add new state with controllerAS', function () {
      var fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-has-state.js'), 'utf8');
      assert(/.state\(\'test\', {[^$]*url: \'\/test\',[^$]*templateUrl: \'home\/test.tpl.html\',[^$]*controller: \'TestCtrl as test\'[^$]*}\)/
        .test(utils.addRoute(fileContents, newState, true, false)));
    });
  });

  describe('no state defined', function () {
    describe('passed config function', function () {
      var fileContents;
      beforeEach(function () {
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-passed-no-state.js'), 'utf8');
      });

      it('should add ui.router as dependency', function () {
        assert(/.module\(\'[^$]*\', \[[^$]*\'ui.router\'[^$]*\]\)/
          .test(utils.addRoute(fileContents, newState, false, true)));
      });

      it('should add $stateProvider as param', function () {
        assert(/config\(\$stateProvider\)/
          .test(utils.addRoute(fileContents, newState, false, true)));
      });

      it('should add state', function () {
        assert(/\$stateProvider[^$]*.state\(\'test\', {[^$]*url: \'\/test\'.[^$]*templateUrl: \'home\/test.tpl.html\',[^$]*controller: \'TestCtrl\'[^$]*}\)/
          .test(utils.addRoute(fileContents, newState, false, true)));
      });
    });

    describe('defined inline config function', function () {
      var fileContents;
      beforeEach(function () {
        fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'app-inline-no-state.js'), 'utf8');
      });

      it('should add ui.router as depdendency', function () {
        assert(/.module\(\'[^$]*\', \[[^$]*\'ui.router\'[^$]*\]\)/
          .test(utils.addRoute(fileContents, newState, false, false)));
      });

      it('should add $stateProvider as param', function () {
        assert(/.config\(function[^$]*\(\$stateProvider\)/
          .test(utils.addRoute(fileContents, newState, false, false)));
      });

      it('should add state', function () {
        assert(/\$stateProvider[^$]*.state\(\'test\', {[^$]*url: \'\/test\'.[^$]*templateUrl: \'home\/test.tpl.html\',[^$]*controller: \'TestCtrl as test\'[^$]*}\)/
          .test(utils.addRoute(fileContents, newState, true, false)));
      });
    });

  });

});