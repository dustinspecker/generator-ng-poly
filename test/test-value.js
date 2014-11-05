/*global describe, before, it */
'use strict';
var assert = require('yeoman-generator').assert
  , helpers = require('yeoman-generator').test
  , join = require('path').join
  , os = require('os');

describe('Value generator', function () {
  before(function (done) {
    helpers.run(join(__dirname, '../app'))
      .inDir(join(os.tmpDir(), 'temp-value'))
      .withOptions({
        'skip-install': true
      })
      .withPrompts({
        appName: 'temp-value',
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
      helpers.run(join(__dirname, '../value'))
        .withArguments(['test'])
        .withOptions({
          module: 'home'
        })
        .on('end', done);
    });

    it('should create value files', function () {
      assert.file([
        'app/home/test-value.js',
        'app/home/test-value_test.js'
      ]);
    });

  });

  describe('with Coffee app and Coffee test', function () {
    before(function (done) {
      helpers.run(join(__dirname, '../value'))
        .withArguments(['test1'])
        .withOptions({
          module: 'home',
          markup: 'jade',
          'app-script': 'coffee',
          'test-script': 'coffee'
        })
        .on('end', done);
    });

    it('should create value files', function () {
      assert.file([
        'app/home/test1-value.coffee',
        'app/home/test1-value_test.coffee'
      ]);
    });

  });

  describe('with TypeScript app and TypeScript test', function () {
    before(function (done) {
      helpers.run(join(__dirname, '../value'))
        .withArguments(['test2'])
        .withOptions({
          module: 'home',
          markup: 'jade',
          'app-script': 'ts',
          'test-script': 'ts'
        })
        .on('end', done);
    });

    it('should create value files', function () {
      assert.file([
        'app/home/test2-value.ts',
        'app/home/test2-value_test.ts'
      ]);
    });

  });

});
