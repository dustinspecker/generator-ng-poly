/*global describe, before, it */
'use strict';
var assert = require('yeoman-generator').assert
  , helpers = require('yeoman-generator').test
  , join = require('path').join;

describe('Route generator', function () {
  before(function (done) {
    helpers
      .run(join(__dirname, '../generator/app'))
      .withPrompts({
        appName: 'temp-route',
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

  describe('with HTML markup, Less style, JS app, JS test, and skipController', function () {
    before(function (done) {
      helpers
        .run(join(__dirname, '../generator/route'), {
          tmpdir: false
        })
        .withArguments(['test'])
        .withOptions({
          module: 'home',
          'skip-controller': true
        })
        .on('end', done);
    });

    it('should create route files', function () {
      assert.file([
        'app/home/test.tpl.html',
        'app/home/test.less',
        'e2e/test/test.po.js',
        'e2e/test/test_test.js'
      ]);
    });

    it('should not create controller files', function () {
      assert.noFile([
        'app/home/test-controller.js',
        'app/home/test-controller_test.js'
      ]);
    });
  });

  describe('with Jade markup, CSS style, Coffee app, and Coffee test with module-type', function () {
    before(function (done) {
      helpers
        .run(join(__dirname, '../generator/route'), {
          tmpdir: false
        })
        .withArguments(['test1'])
        .withOptions({
          structure: 'module-type',
          module: 'home',
          markup: 'jade',
          style: 'css',
          'app-script': 'coffee',
          'test-script': 'coffee'
        })
        .on('end', done);
    });

    it('should create route files', function () {
      assert.file([
        'app/home/controllers/test1-controller.coffee',
        'app/home/controllers/test1-controller_test.coffee',
        'app/home/views/test1.tpl.jade',
        'app/home/views/test1.css',
        'e2e/test1/test1.po.coffee',
        'e2e/test1/test1_test.coffee'
      ]);
    });
  });

  describe('with HAML markup, SCSS style, JS app, and JS test', function () {
    before(function (done) {
      helpers
        .run(join(__dirname, '../generator/route'), {
          tmpdir: false
        })
        .withArguments(['test.child'])
        .withOptions({
          module: 'home',
          markup: 'haml',
          style: 'scss'
        })
        .on('end', done);
    });

    it('should create route files', function () {
      assert.file([
        'app/home/test-child-controller.js',
        'app/home/test-child-controller_test.js',
        'app/home/test-child.tpl.haml',
        'app/home/test-child.scss',
        'e2e/test-child/test-child.po.js',
        'e2e/test-child/test-child_test.js'
      ]);
    });
  });

  describe('with HTML markup, Stylus style, JS app, and JS test', function () {
    before(function (done) {
      helpers
        .run(join(__dirname, '../generator/route'), {
          tmpdir: false
        })
        .withArguments(['test'])
        .withOptions({
          module: 'app',
          style: 'styl'
        })
        .on('end', done);
    });

    it('should create route files', function () {
      assert.file([
        'app/test-controller.js',
        'app/test-controller_test.js',
        'app/test.tpl.html',
        'app/test.styl',
        'e2e/test/test.po.js',
        'e2e/test/test_test.js'
      ]);
    });
  });

  describe('with Jade markup, CSS style, TypeScript app, and TypeScript test', function () {
    before(function (done) {
      helpers
        .run(join(__dirname, '../generator/route'), {
          tmpdir: false
        })
        .withArguments(['test2'])
        .withOptions({
          module: 'home',
          markup: 'jade',
          style: 'css',
          'app-script': 'ts',
          'test-script': 'ts'
        })
        .on('end', done);
    });

    it('should create route files', function () {
      assert.file([
        'app/home/test2-controller.ts',
        'app/home/test2-controller_test.ts',
        'app/home/test2.tpl.jade',
        'app/home/test2.css',
        'e2e/test2/test2.po.js',
        'e2e/test2/test2_test.js'
      ]);
    });
  });
});
