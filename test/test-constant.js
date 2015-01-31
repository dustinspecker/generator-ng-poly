/*global describe, before, it */
'use strict';
var assert = require('yeoman-generator').assert
  , helpers = require('yeoman-generator').test
  , join = require('path').join;

describe('Constant generator', function () {
  before(function (done) {
    helpers
      .run(join(__dirname, '../app'))
      .withPrompts({
        appName: 'temp-constant',
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

  describe('with JS app, and JS test', function () {
    before(function (done) {
      helpers
        .run(join(__dirname, '../constant'), {
          tmpdir: false
        })
        .withArguments(['test'])
        .withPrompt({
          module: 'home/'
        })
        .on('end', done);
    });

    it('should create constant files', function () {
      assert.file([
        'app/home/test-constant.js',
        'app/home/test-constant_test.js'
      ]);
    });

  });

  describe('with TypeScript app, and TypeScript test', function () {
    before(function (done) {
      helpers
        .run(join(__dirname, '../constant'), {
          tmpdir: false
        })
        .withArguments(['test1'])
        .withPrompt({
          module: 'app'
        })
        .withOptions({
          markup: 'jade',
          'app-script': 'ts',
          'test-script': 'ts'
        })
        .on('end', done);
    });

    it('should create constant files', function () {
      assert.file([
        'app/test1-constant.ts',
        'app/test1-constant_test.ts'
      ]);
    });
  });

  describe('with Coffee app, and Coffee test', function () {
    before(function (done) {
      helpers
        .run(join(__dirname, '../constant'), {
          tmpdir: false
        })
        .withArguments(['test1'])
        .withPrompt({
          module: 'app'
        })
        .withOptions({
          markup: 'jade',
          'app-script': 'coffee',
          'test-script': 'coffee'
        })
        .on('end', done);
    });

    it('should create constant files', function () {
      assert.file([
        'app/test1-constant.coffee',
        'app/test1-constant_test.coffee'
      ]);
    });
  });

});
