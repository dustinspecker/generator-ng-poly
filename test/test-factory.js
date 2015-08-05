/* global describe, before, it */
'use strict';
import {assert, test as helpers} from 'yeoman-generator';
import {join} from 'path';

describe('Factory generator', () => {
  before(done => {
    helpers
      .run(join(__dirname, '../generators/app'))
      .withPrompts({
        appName: 'temp-factory',
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
        .run(join(__dirname, '../generators/factory'), {
          tmpdir: false
        })
        .withArguments(['test'])
        .withOptions({
          structure: 'module-type',
          module: 'home'
        })
        .on('end', done);
    });

    it('should create factory files', () => {
      assert.file([
        'app/home/factories/test-factory.js',
        'app/home/factories/test-factory_test.js'
      ]);
    });
  });

  describe('with Coffee app and Coffee test', () => {
    before(done => {
      helpers
        .run(join(__dirname, '../generators/factory'), {
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

    it('should create factory files', () => {
      assert.file([
        'app/home/test1-factory.coffee',
        'app/home/test1-factory_test.coffee'
      ]);
    });
  });

  describe('with TypeScript app and TypeScript test', () => {
    before(done => {
      helpers.run(join(__dirname, '../generators/factory'), {
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

    it('should create factory files', () => {
      assert.file([
        'app/home/test2-factory.ts',
        'app/home/test2-factory_test.ts'
      ]);
    });
  });

  describe('with ES6 app and ES6 test', () => {
    before(done => {
      helpers.run(join(__dirname, '../generators/factory'), {
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

    it('should create factory files', () => {
      assert.file([
        'app/home/test2-factory.es6',
        'app/home/test2-factory_test.es6'
      ]);
    });
  });
});
