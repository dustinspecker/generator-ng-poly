/* global describe, before, it */
'use strict';
import {assert, test as helpers} from 'yeoman-generator';
import {join} from 'path';

describe('Directive generator', () => {
  before((done) => {
    helpers
      .run(join(__dirname, '../generators/app'))
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
        join(__dirname, '../generators/module'),
        join(__dirname, '../generators/route'),
        join(__dirname, '../generators/controller'),
        join(__dirname, '../generators/view')
      ])
      .on('end', done);
  });

  describe('with HTML markup, JS app, and JS test with module-type', () => {
    before((done) => {
      helpers
        .run(join(__dirname, '../generators/directive'), {
          tmpdir: false
        })
        .withArguments(['test'])
        .withOptions({
          structure: 'module-type',
          module: 'home'
        })
        .on('end', done);
    });

    it('should create directive files', () => {
      assert.file([
        'app/home/directives/test-directive.js',
        'app/home/directives/test-directive.tpl.html',
        'app/home/directives/test-directive_test.js'
      ]);
    });
  });

  describe('with Jade markup, Coffee app, and Coffee test', () => {
    before((done) => {
      helpers
        .run(join(__dirname, '../generators/directive'), {
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

    it('should create directive files', () => {
      assert.file([
        'app/home/test1-directive.coffee',
        'app/home/test1-directive.tpl.jade',
        'app/home/test1-directive_test.coffee'
      ]);
    });
  });

  describe('with Jade markup, TypeScript app, and TypeScript test using module-type', () => {
    before((done) => {
      helpers
        .run(join(__dirname, '../generators/directive'), {
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

    it('should create directive files', () => {
      assert.file([
        'app/home/directives/test3-directive.ts',
        'app/home/directives/test3-directive.tpl.jade',
        'app/home/directives/test3-directive_test.ts'
      ]);
    });
  });

  describe('with HAML markup, ES6 app, and ES6 test', () => {
    before((done) => {
      helpers
        .run(join(__dirname, '../generators/directive'), {
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

    it('should create directive files', () => {
      assert.file([
        'app/home/test2-directive.es6',
        'app/home/test2-directive.tpl.haml',
        'app/home/test2-directive_test.es6'
      ]);
    });
  });
});
