/*global describe, before, it */
'use strict';
var assert = require('yeoman-generator').assert
  , helpers = require('yeoman-generator').test
  , join = require('path').join;

describe('Element generator', function () {
  before(function (done) {
    helpers
      .run(join(__dirname, '../generator/app'))
      .withPrompts({
        appName: 'temp-element',
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

  describe('with HTML markup, JS app, and LESS style', function () {
    before(function (done) {
      helpers
        .run(join(__dirname, '../generator/element'), {
          tmpdir: false
        })
        .withArguments(['test-element'])
        .on('end', done);
    });

    it('should create element files', function () {
      assert.file([
        'app/components/test-element/test-element.js',
        'app/components/test-element/test-element.html',
        'app/components/test-element/test-element.less'
      ]);
    });
  });

  describe('with Jade markup, Coffee app, and CSS style', function () {
    before(function (done) {
      helpers
        .run(join(__dirname, '../generator/element'), {
          tmpdir: false
        })
        .withArguments(['test1-element'])
        .withOptions({
          markup: 'jade',
          'app-script': 'coffee',
          style: 'css'
        })
        .on('end', done);
    });

    it('should create element files', function () {
      assert.file([
        'app/components/test1-element/test1-element.coffee',
        'app/components/test1-element/test1-element.jade',
        'app/components/test1-element/test1-element.css'
      ]);
    });
  });

  describe('with HAML markup, ES6 app, and SCSS style', function () {
    before(function (done) {
      helpers
        .run(join(__dirname, '../generator/element'), {
          tmpdir: false
        })
        .withArguments(['test2-element'])
        .withOptions({
          markup: 'haml',
          style: 'scss',
          'app-script': 'es6'
        })
        .on('end', done);
    });

    it('should create element files', function () {
      assert.file([
        'app/components/test2-element/test2-element.es6',
        'app/components/test2-element/test2-element.haml',
        'app/components/test2-element/test2-element.scss'
      ]);
    });
  });

  describe('with HTML markup, JS app, and Stylus style', function () {
    before(function (done) {
      helpers
        .run(join(__dirname, '../generator/element'), {
          tmpdir: false
        })
        .withArguments(['test3-element'])
        .withOptions({
          style: 'styl'
        })
        .on('end', done);
    });

    it('should create element files', function () {
      assert.file([
        'app/components/test3-element/test3-element.js',
        'app/components/test3-element/test3-element.html',
        'app/components/test3-element/test3-element.styl'
      ]);
    });
  });

  describe('with Jade markup, TypeScript app, and CSS style', function () {
    before(function (done) {
      helpers
        .run(join(__dirname, '../generator/element'), {
          tmpdir: false
        })
        .withArguments(['test4-element'])
        .withOptions({
          markup: 'jade',
          'app-script': 'ts',
          style: 'css'
        })
        .on('end', done);
    });

    it('should create element files', function () {
      assert.file([
        'app/components/test4-element/test4-element.js',
        'app/components/test4-element/test4-element.jade',
        'app/components/test4-element/test4-element.css'
      ]);
    });
  });
});
