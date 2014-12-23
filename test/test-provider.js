/*global describe, before, it */
'use strict';
var assert = require('yeoman-generator').assert
  , helpers = require('yeoman-generator').test
  , join = require('path').join;

describe('Provider generator', function () {
  before(function (done) {
    helpers
      .run(join(__dirname, '../app'), {
        tmpdir: false
      })
      .withOptions({
        'skip-install': true
      })
      .withPrompts({
        appName: 'temp-provider',
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
        .run(join(__dirname, '../provider'), {
          tmpdir: false
        })
        .withArguments(['test'])
        .withOptions({
          module: 'home'
        })
        .on('end', done);
    });

    it('should create provider files', function () {
      assert.file([
        'app/home/test-provider.js',
        'app/home/test-provider_test.js'
      ]);
    });

  });

  describe('with Coffee app and Coffee test', function () {
    before(function (done) {
      helpers
        .run(join(__dirname, '../provider'), {
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

});
