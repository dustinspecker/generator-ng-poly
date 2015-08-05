/* global describe, before, it */
'use strict';
import {assert, test as helpers} from 'yeoman-generator';
import {join} from 'path';

describe('Value generator', () => {
  before(done => {
    helpers
      .run(join(__dirname, '../generators/app'))
      .withPrompts({
        appName: 'temp-value',
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

  describe('with JS app and JS test with module-type', () => {
    before(done => {
      helpers
        .run(join(__dirname, '../generators/value'), {
          tmpdir: false
        })
        .withArguments(['test'])
        .withOptions({
          structure: 'module-type',
          module: 'home'
        })
        .on('end', done);
    });

    it('should create value files', () => {
      assert.file([
        'app/home/values/test-value.js',
        'app/home/values/test-value_test.js'
      ]);
    });
  });

  describe('with Coffee app and Coffee test', () => {
    before(done => {
      helpers
        .run(join(__dirname, '../generators/value'), {
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

    it('should create value files', () => {
      assert.file([
        'app/home/test1-value.coffee',
        'app/home/test1-value_test.coffee'
      ]);
    });
  });

  describe('with TypeScript app and TypeScript test', () => {
    before(done => {
      helpers
        .run(join(__dirname, '../generators/value'), {
          tmpdir: false
        })
        .withArguments(['test2'])
        .withOptions({
          module: 'home',
          markup: 'jade',
          'app-script': 'ts',
          'test-script': 'ts'
        })
        .on('end', done);
    });

    it('should create value files', () => {
      assert.file([
        'app/home/test2-value.ts',
        'app/home/test2-value_test.ts'
      ]);
    });
  });

  describe('with ES6 app and ES6 test', () => {
    before(done => {
      helpers
        .run(join(__dirname, '../generators/value'), {
          tmpdir: false
        })
        .withArguments(['test2'])
        .withOptions({
          module: 'home',
          markup: 'jade',
          'app-script': 'es6',
          'test-script': 'es6'
        })
        .on('end', done);
    });

    it('should create value files', () => {
      assert.file([
        'app/home/test2-value.es6',
        'app/home/test2-value_test.es6'
      ]);
    });
  });
});
