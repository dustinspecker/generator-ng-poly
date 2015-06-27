/*global describe, before, it */
'use strict';
var assert = require('yeoman-generator').assert
  , helpers = require('yeoman-generator').test
  , join = require('path').join;

describe('Provider generator', function () {
  before(function (done) {
    helpers
      .run(join(__dirname, '../generator/app'))
      .withPrompts({
        appName: 'temp-provider',
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

  describe('with JS app and JS test with module-type', function () {
    before(function (done) {
      helpers
        .run(join(__dirname, '../generator/provider'), {
          tmpdir: false
        })
        .withArguments(['test'])
        .withOptions({
          structure: 'module-type',
          module: 'home'
        })
        .on('end', done);
    });

    it('should create provider files', function () {
      assert.file([
        'app/home/providers/test-provider.js',
        'app/home/providers/test-provider_test.js'
      ]);
    });
  });

  describe('with Coffee app and Coffee test', function () {
    before(function (done) {
      helpers
        .run(join(__dirname, '../generator/provider'), {
          tmpdir: false
        })
        .withArguments(['test1'])
        .withOptions({
          module: 'home',
          markup: 'jade',
          'app-script': 'coffee',
          'test-script': 'coffee'
        })
        .on('end', done);
    });

    it('should create provider files', function () {
      assert.file([
        'app/home/test1-provider.coffee',
        'app/home/test1-provider_test.coffee'
      ]);
    });
  });

  describe('with TypeScript app and TypeScript test', function () {
    before(function (done) {
      helpers
        .run(join(__dirname, '../generator/provider'), {
          tmpdir: false
        })
        .withArguments(['test2'])
        .withOptions({
          module: 'home',
          markup: 'jade',
          'app-script': 'ts',
          'test-script': 'ts'
        })
        .on('end', done);
    });

    it('should create provider files', function () {
      assert.file([
        'app/home/test2-provider.ts',
        'app/home/test2-provider_test.ts'
      ]);
    });
  });
});
