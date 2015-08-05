/* global describe, before, it */
'use strict';
import {assert, test as helpers} from 'yeoman-generator';
import {join} from 'path';

describe('Controller generator', () => {
  before(done => {
    helpers
      .run(join(__dirname, '../generators/app'))
      .withPrompts({
        appName: 'temp-controller',
        markup: 'html',
        appScript: 'js',
        classes: false,
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
        .run(join(__dirname, '../generators/controller'), {
          tmpdir: false
        })
        .withArguments(['test'])
        .withOptions({
          structure: 'module-type',
          module: 'home'
        })
        .on('end', done);
    });

    it('should create controller files', () => {
      assert.file([
        'app/home/controllers/test-controller.js',
        'app/home/controllers/test-controller_test.js'
      ]);
    });
  });

  describe('with Coffee app and Coffee test', () => {
    before(done => {
      helpers
        .run(join(__dirname, '../generators/controller'), {
          tmpdir: false
        })
        .withArguments(['test1'])
        .withOptions({
          module: 'home',
          'app-script': 'coffee',
          'test-script': 'coffee'
        })
        .on('end', done);
    });

    it('should create controller files', () => {
      assert.file([
        'app/home/test1-controller.coffee',
        'app/home/test1-controller_test.coffee'
      ]);
    });
  });

  describe('with Coffee app and Coffee test', () => {
    before(done => {
      helpers
        .run(join(__dirname, '../generators/controller'), {
          tmpdir: false
        })
        .withArguments(['test1'])
        .withOptions({
          module: 'home',
          'app-script': 'coffee',
          'test-script': 'coffee'
        })
        .on('end', done);
    });

    it('should create controller files', () => {
      assert.file([
        'app/home/test1-controller.coffee',
        'app/home/test1-controller_test.coffee'
      ]);
    });
  });

  describe('with TypeScript app, and TypeScript test', () => {
    before(done => {
      helpers
        .run(join(__dirname, '../generators/controller'), {
          tmpdir: false
        })
        .withArguments(['test1'])
        .withOptions({
          module: 'home',
          'app-script': 'ts',
          'test-script': 'ts'
        })
        .on('end', done);
    });

    it('should create controller files', () => {
      assert.file([
        'app/home/test1-controller.ts',
        'app/home/test1-controller_test.ts'
      ]);
    });
  });

  describe('with ES6 app, and ES6 test', () => {
    before(done => {
      helpers
        .run(join(__dirname, '../generators/controller'), {
          tmpdir: false
        })
        .withArguments(['test1'])
        .withOptions({
          module: 'home',
          'app-script': 'es6',
          'test-script': 'es6'
        })
        .on('end', done);
    });

    it('should create controller files', () => {
      assert.file([
        'app/home/test1-controller.es6',
        'app/home/test1-controller_test.es6'
      ]);
    });
  });
});
