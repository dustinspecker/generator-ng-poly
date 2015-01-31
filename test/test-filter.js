/*global describe, before, it */
'use strict';
var assert = require('yeoman-generator').assert
  , helpers = require('yeoman-generator').test
  , join = require('path').join;

describe('Filter generator', function () {
  before(function (done) {
    helpers
      .run(join(__dirname, '../app'))
      .withPrompts({
        appName: 'temp-filter',
        markup: 'html',
        appScript: 'js',
        controllerAs: false,
        passFunc: true,
        namedFunc: true,
        testScript: 'js',
        testDir: 'app',
        style: 'less',
        bower: []
      })
      .withGenerators([
        join(__dirname, '../module'),
        join(__dirname, '../route'),
        join(__dirname, '../controller'),
        join(__dirname, '../view')
      ])
      .on('end', done);
  });

  describe('with JS app and JS test', function () {
    before(function (done) {
      helpers
        .run(join(__dirname, '../filter'), {
          tmpdir: false
        })
        .withArguments(['test'])
        .withOptions({
          module: 'home'
        })
        .on('end', done);
    });

    it('should create filter files', function () {
      assert.file([
        'app/home/test-filter.js',
        'app/home/test-filter_test.js'
      ]);
    });

  });

  describe('with Coffee app and Coffee test', function () {
    before(function (done) {
      helpers
        .run(join(__dirname, '../filter'), {
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

    it('should create filter files', function () {
      assert.file([
        'app/home/test1-filter.coffee',
        'app/home/test1-filter_test.coffee'
      ]);
    });

  });

  describe('with TypeScript app and TypeScript test', function () {
    before(function (done) {
      helpers.run(join(__dirname, '../filter'), {
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

    it('should create filter files', function () {
      assert.file([
        'app/home/test2-filter.ts',
        'app/home/test2-filter_test.ts'
      ]);
    });

  });

});
