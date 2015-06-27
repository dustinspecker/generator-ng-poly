/*global describe, before, it*/
'use strict';
var assert = require('yeoman-generator').assert
  , helpers = require('yeoman-generator').test
  , join = require('path').join;

describe('Decorator generator', function () {
  before(function (done) {
    helpers
      .run(join(__dirname, '../generator/app'))
      .withPrompts({
        appName: 'temp-decorator',
        markup: 'html',
        appScript: 'js',
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

  describe('with JS app and test', function () {
    before(function (done) {
      helpers
        .run(join(__dirname, '../generator/decorator'), {
          tmpdir: false
        })
        .withArguments(['test'])
        .withOptions({
          module: 'home'
        })
        .on('end', done);
    });

    it('should create decorator files', function () {
      assert.file([
        'app/home/test-decorator.js',
        'app/home/test-decorator_test.js'
      ]);
    });
  });

  describe('with Coffee app and test', function () {
    before(function (done) {
      helpers
        .run(join(__dirname, '../generator/decorator'), {
          tmpdir: false
        })
        .withArguments(['$urlRouterProvider'])
        .withOptions({
          module: 'home',
          structure: 'module-type',
          appScript: 'coffee',
          testScript: 'coffee'
        })
        .on('end', done);
    });

    it('should create decorator files with stripped $', function () {
      assert.file([
        'app/home/decorators/url-router-provider-decorator.coffee',
        'app/home/decorators/url-router-provider-decorator_test.coffee'
      ]);
    });
  });

  describe('with ES2105 app and test', function () {
    before(function (done) {
      helpers
        .run(join(__dirname, '../generator/decorator'), {
          tmpdir: false
        })
        .withArguments(['test'])
        .withOptions({
          module: 'home',
          appScript: 'es6',
          testScript: 'es6'
        })
        .on('end', done);
    });

    it('should create decorator files', function () {
      assert.file([
        'app/home/test-decorator.es6',
        'app/home/test-decorator_test.es6'
      ]);
    });
  });

  describe('with TypeScript app and test', function () {
    before(function (done) {
      helpers
        .run(join(__dirname, '../generator/decorator'), {
          tmpdir: false
        })
        .withArguments(['test'])
        .withOptions({
          module: 'home',
          appScript: 'ts',
          testScript: 'ts'
        })
        .on('end', done);
    });

    it('should create decorator files', function () {
      assert.file([
        'app/home/test-decorator.ts',
        'app/home/test-decorator_test.ts'
      ]);
    });
  });
});
