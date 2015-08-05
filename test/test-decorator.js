/* global describe, before, it */
'use strict';
import {assert, test as helpers} from 'yeoman-generator';
import {join} from 'path';

describe('Decorator generator', () => {
  before(done => {
    helpers
      .run(join(__dirname, '../generators/app'))
      .withPrompts({
        appName: 'temp-decorator',
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

  describe('with JS app and test', () => {
    before(done => {
      helpers
        .run(join(__dirname, '../generators/decorator'), {
          tmpdir: false
        })
        .withArguments(['test'])
        .withOptions({
          module: 'home'
        })
        .on('end', done);
    });

    it('should create decorator files', () => {
      assert.file([
        'app/home/test-decorator.js',
        'app/home/test-decorator_test.js'
      ]);
    });
  });

  describe('with Coffee app and test', () => {
    before(done => {
      helpers
        .run(join(__dirname, '../generators/decorator'), {
          tmpdir: false
        })
        .withArguments(['$urlRouterProvider'])
        .withOptions({
          module: 'home',
          structure: 'module-type',
          appScript: 'coffee',
          testScript: 'coffee'
        })
        .on('end', done);
    });

    it('should create decorator files with stripped $', () => {
      assert.file([
        'app/home/decorators/url-router-provider-decorator.coffee',
        'app/home/decorators/url-router-provider-decorator_test.coffee'
      ]);
    });
  });

  describe('with ES2105 app and test', () => {
    before(done => {
      helpers
        .run(join(__dirname, '../generators/decorator'), {
          tmpdir: false
        })
        .withArguments(['test'])
        .withOptions({
          module: 'home',
          appScript: 'es6',
          testScript: 'es6'
        })
        .on('end', done);
    });

    it('should create decorator files', () => {
      assert.file([
        'app/home/test-decorator.es6',
        'app/home/test-decorator_test.es6'
      ]);
    });
  });

  describe('with TypeScript app and test', () => {
    before(done => {
      helpers
        .run(join(__dirname, '../generators/decorator'), {
          tmpdir: false
        })
        .withArguments(['test'])
        .withOptions({
          module: 'home',
          appScript: 'ts',
          testScript: 'ts'
        })
        .on('end', done);
    });

    it('should create decorator files', () => {
      assert.file([
        'app/home/test-decorator.ts',
        'app/home/test-decorator_test.ts'
      ]);
    });
  });
});
