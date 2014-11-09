/*global describe, before, it */
'use strict';
var assert = require('yeoman-generator').assert
  , helpers = require('yeoman-generator').test
  , join = require('path').join
  , os = require('os');

describe('Route generator', function () {
  before(function (done) {
    helpers.run(join(__dirname, '../app'))
      .inDir(join(os.tmpDir(), 'temp-route'))
      .withOptions({
        'skip-install': true
      })
      .withPrompts({
        appName: 'temp-route',
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

  describe('with HTML markup, Less style, JS app, JS test, and skipController', function () {
    before(function (done) {
      helpers.run(join(__dirname, '../route'))
        .withArguments(['test'])
        .withOptions({
          module: 'home',
          'skip-controller': true,
          'template-url': 'value',
          url: 'value'
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

  describe('with Jade markup, CSS style, Coffee app, and Coffee test', function () {
    before(function (done) {
      helpers.run(join(__dirname, '../route'))
        .withArguments(['test1'])
        .withOptions({
          module: 'home',
          'template-url': 'value',
          url: 'value',

          markup: 'jade',
          style: 'css',
          'app-script': 'coffee',
          'test-script': 'coffee'
        })
        .on('end', done);
    });

    it('should create route files', function () {
      assert.file([
        'app/home/test1-controller.coffee',
        'app/home/test1-controller_test.coffee',
        'app/home/test1.tpl.jade',
        'app/home/test1.css',
        'e2e/test1/test1.po.coffee',
        'e2e/test1/test1_test.coffee'
      ]);
    });

  });

  describe('with HAML markup, SCSS style, JS app, and JS test', function () {
    before(function (done) {
      helpers.run(join(__dirname, '../route'))
        .withArguments(['test'])
        .withOptions({
          module: 'home',
          'template-url': 'value',
          url: 'value',

          markup: 'haml',
          style: 'scss'
        })
        .on('end', done);
    });

    it('should create route files', function () {
      assert.file([
        'app/home/test-controller.js',
        'app/home/test-controller_test.js',
        'app/home/test.tpl.haml',
        'app/home/test.scss',
        'e2e/test/test.po.js',
        'e2e/test/test_test.js'
      ]);
    });

  });

  describe('with HTML markup, Stylus style, JS app, and JS test', function () {
    before(function (done) {
      helpers.run(join(__dirname, '../route'))
        .withArguments(['test'])
        .withOptions({
          module: 'home',
          'template-url': 'value',
          url: 'value',

          style: 'styl'
        })
        .on('end', done);
    });

    it('should create route files', function () {
      assert.file([
        'app/home/test-controller.js',
        'app/home/test-controller_test.js',
        'app/home/test.tpl.html',
        'app/home/test.styl',
        'e2e/test/test.po.js',
        'e2e/test/test_test.js'
      ]);
    });

  });

  describe('with Jade markup, CSS style, TypeScript app, and TypeScript test', function () {
    before(function (done) {
      helpers.run(join(__dirname, '../route'))
        .withArguments(['test2'])
        .withOptions({
          module: 'home',
          'template-url': 'value',
          url: 'value',

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
        'e2e/test2/test2.po.ts',
        'e2e/test2/test2_test.ts'
      ]);
    });

  });


});
