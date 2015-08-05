/* global describe, before, it */
'use strict';
import {assert, test as helpers} from 'yeoman-generator';
import {join} from 'path';

describe('Element generator', () => {
  before(done => {
    helpers
      .run(join(__dirname, '../generators/app'))
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
        join(__dirname, '../generators/module'),
        join(__dirname, '../generators/route'),
        join(__dirname, '../generators/controller'),
        join(__dirname, '../generators/view')
      ])
      .on('end', done);
  });

  describe('with HTML markup, JS app, and LESS style', () => {
    before(done => {
      helpers
        .run(join(__dirname, '../generators/element'), {
          tmpdir: false
        })
        .withArguments(['test-element'])
        .on('end', done);
    });

    it('should create element files', () => {
      assert.file([
        'app/components/test-element/test-element.js',
        'app/components/test-element/test-element.html',
        'app/components/test-element/test-element.less'
      ]);
    });
  });

  describe('with Jade markup, Coffee app, and CSS style', () => {
    before(done => {
      helpers
        .run(join(__dirname, '../generators/element'), {
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

    it('should create element files', () => {
      assert.file([
        'app/components/test1-element/test1-element.coffee',
        'app/components/test1-element/test1-element.jade',
        'app/components/test1-element/test1-element.css'
      ]);
    });
  });

  describe('with HAML markup, ES6 app, and SCSS style', () => {
    before(done => {
      helpers
        .run(join(__dirname, '../generators/element'), {
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

    it('should create element files', () => {
      assert.file([
        'app/components/test2-element/test2-element.es6',
        'app/components/test2-element/test2-element.haml',
        'app/components/test2-element/test2-element.scss'
      ]);
    });
  });

  describe('with HTML markup, JS app, and Stylus style', () => {
    before(done => {
      helpers
        .run(join(__dirname, '../generators/element'), {
          tmpdir: false
        })
        .withArguments(['test3-element'])
        .withOptions({
          style: 'styl'
        })
        .on('end', done);
    });

    it('should create element files', () => {
      assert.file([
        'app/components/test3-element/test3-element.js',
        'app/components/test3-element/test3-element.html',
        'app/components/test3-element/test3-element.styl'
      ]);
    });
  });

  describe('with Jade markup, TypeScript app, and CSS style', () => {
    before(done => {
      helpers
        .run(join(__dirname, '../generators/element'), {
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

    it('should create element files', () => {
      assert.file([
        'app/components/test4-element/test4-element.js',
        'app/components/test4-element/test4-element.jade',
        'app/components/test4-element/test4-element.css'
      ]);
    });
  });
});
