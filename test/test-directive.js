/*global describe, before, it */
'use strict';
var assert = require('yeoman-generator').assert
  , helpers = require('yeoman-generator').test
  , join = require('path').join;

describe('Directive generator', function () {
  before(function (done) {
    helpers
      .run(join(__dirname, '../generator/app'))
      .withPrompts({
        appName: 'temp-directive',
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

  describe('with HTML markup, JS app, and JS test with module-type', function () {
    before(function (done) {
      helpers
        .run(join(__dirname, '../generator/directive'), {
          tmpdir: false
        })
        .withArguments(['test'])
        .withOptions({
          structure: 'module-type',
          module: 'home'
        })
        .on('end', done);
    });

    it('should create directive files', function () {
      assert.file([
        'app/home/directives/test-directive.js',
        'app/home/directives/test-directive.tpl.html',
        'app/home/directives/test-directive_test.js'
      ]);
    });
  });

  describe('with Jade markup, Coffee app, and Coffee test', function () {
    before(function (done) {
      helpers
        .run(join(__dirname, '../generator/directive'), {
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

  describe('with Jade markup, TypeScript app, and TypeScript test using module-type', function () {
    before(function (done) {
      helpers
        .run(join(__dirname, '../generator/directive'), {
          tmpdir: false
        })
        .withArguments(['test3'])
        .withOptions({
          structure: 'module-type',
          module: 'home',
          markup: 'jade',
          'app-script': 'ts',
          'test-script': 'ts'
        })
        .on('end', done);
    });

    it('should create directive files', function () {
      assert.file([
        'app/home/directives/test3-directive.ts',
        'app/home/directives/test3-directive.tpl.jade',
        'app/home/directives/test3-directive_test.ts'
      ]);
    });
  });

  describe('with HAML markup, ES6 app, and ES6 test', function () {
    before(function (done) {
      helpers
        .run(join(__dirname, '../generator/directive'), {
          tmpdir: false
        })
        .withArguments(['test2'])
        .withOptions({
          module: 'home',
          markup: 'haml',
          'app-script': 'es6',
          'test-script': 'es6'
        })
        .on('end', done);
    });

    it('should create directive files', function () {
      assert.file([
        'app/home/test2-directive.es6',
        'app/home/test2-directive.tpl.haml',
        'app/home/test2-directive_test.es6'
      ]);
    });
  });
});
