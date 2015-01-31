/*global describe, before, it */
'use strict';
var assert = require('yeoman-generator').assert
  , helpers = require('yeoman-generator').test
  , join = require('path').join;

describe('Directive generator', function () {
  before(function (done) {
    helpers
      .run(join(__dirname, '../app'))
      .withPrompts({
        appName: 'temp-directive',
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

  describe('with HTML markup, JS app, and JS test', function () {
    before(function (done) {
      helpers
        .run(join(__dirname, '../directive'), {
          tmpdir: false
        })
        .withArguments(['test'])
        .withOptions({
          module: 'home'
        })
        .on('end', done);
    });

    it('should create directive files', function () {
      assert.file([
        'app/home/test-directive.js',
        'app/home/test-directive.tpl.html',
        'app/home/test-directive_test.js'
      ]);
    });

  });

  describe('with Jade markup, Coffee app, and Coffee test', function () {
    before(function (done) {
      helpers
        .run(join(__dirname, '../directive'), {
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

    it('should create directive files', function () {
      assert.file([
        'app/home/test1-directive.coffee',
        'app/home/test1-directive.tpl.jade',
        'app/home/test1-directive_test.coffee'
      ]);
    });

  });

  describe('with Jade markup, TypeScript app, and TypeScript test', function () {
    before(function (done) {
      helpers
        .run(join(__dirname, '../directive'), {
          tmpdir: false
        })
        .withArguments(['test3'])
        .withOptions({
          module: 'home',
          markup: 'jade',
          'app-script': 'ts',
          'test-script': 'ts'
        })
        .on('end', done);
    });

    it('should create directive files', function () {
      assert.file([
        'app/home/test3-directive.ts',
        'app/home/test3-directive.tpl.jade',
        'app/home/test3-directive_test.ts'
      ]);
    });

  });

  describe('with HAML markup, JS app, and JS test', function () {
    before(function (done) {
      helpers
        .run(join(__dirname, '../directive'), {
          tmpdir: false
        })
        .withArguments(['test2'])
        .withOptions({
          module: 'home',
          markup: 'haml'
        })
        .on('end', done);
    });

    it('should create directive files', function () {
      assert.file([
        'app/home/test2-directive.js',
        'app/home/test2-directive.tpl.haml',
        'app/home/test2-directive_test.js'
      ]);
    });

  });

});
