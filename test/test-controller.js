/*global describe, before, it */
'use strict';
var assert = require('yeoman-generator').assert
  , helpers = require('yeoman-generator').test
  , join = require('path').join;

describe('Controller generator', function () {
  before(function (done) {
    helpers
      .run(join(__dirname, '../generator/app'))
      .withPrompts({
        appName: 'temp-controller',
        markup: 'html',
        appScript: 'js',
        classes: false,
        controllerAs: false,
        testScript: 'js',
        testDir: 'app',
        style: 'less',
        bower: []
      })
      .withGenerators([
        join(__dirname, '../generator/module'),
        join(__dirname, '../generator/route'),
        join(__dirname, '../generator/controller'),
        join(__dirname, '../generator/view')
      ])
      .on('end', done);
  });

  describe('with JS app and JS test with module-type', function () {
    before(function (done) {
      helpers
        .run(join(__dirname, '../generator/controller'), {
          tmpdir: false
        })
        .withArguments(['test'])
        .withOptions({
          structure: 'module-type',
          module: 'home'
        })
        .on('end', done);
    });

    it('should create controller files', function () {
      assert.file([
        'app/home/controllers/test-controller.js',
        'app/home/controllers/test-controller_test.js'
      ]);
    });
  });

  describe('with Coffee app and Coffee test', function () {
    before(function (done) {
      helpers
        .run(join(__dirname, '../generator/controller'), {
          tmpdir: false
        })
        .withArguments(['test1'])
        .withOptions({
          module: 'home',
          'app-script': 'coffee',
          'test-script': 'coffee'
        })
        .on('end', done);
    });

    it('should create controller files', function () {
      assert.file([
        'app/home/test1-controller.coffee',
        'app/home/test1-controller_test.coffee'
      ]);
    });
  });

  describe('with Coffee app and Coffee test', function () {
    before(function (done) {
      helpers
        .run(join(__dirname, '../generator/controller'), {
          tmpdir: false
        })
        .withArguments(['test1'])
        .withOptions({
          module: 'home',
          'app-script': 'coffee',
          'test-script': 'coffee'
        })
        .on('end', done);
    });

    it('should create controller files', function () {
      assert.file([
        'app/home/test1-controller.coffee',
        'app/home/test1-controller_test.coffee'
      ]);
    });
  });

  describe('with TypeScript app, and TypeScript test', function () {
    before(function (done) {
      helpers
        .run(join(__dirname, '../generator/controller'), {
          tmpdir: false
        })
        .withArguments(['test1'])
        .withOptions({
          module: 'home',
          'app-script': 'ts',
          'test-script': 'ts'
        })
        .on('end', done);
    });

    it('should create controller files', function () {
      assert.file([
        'app/home/test1-controller.ts',
        'app/home/test1-controller_test.ts'
      ]);
    });
  });

  describe('with ES6 app, and ES6 test', function () {
    before(function (done) {
      helpers
        .run(join(__dirname, '../generator/controller'), {
          tmpdir: false
        })
        .withArguments(['test1'])
        .withOptions({
          module: 'home',
          'app-script': 'es6',
          'test-script': 'es6'
        })
        .on('end', done);
    });

    it('should create controller files', function () {
      assert.file([
        'app/home/test1-controller.es6',
        'app/home/test1-controller_test.es6'
      ]);
    });
  });
});
