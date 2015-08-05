/* global describe, before, it */
'use strict';
import {assert, test as helpers} from 'yeoman-generator';
import {join} from 'path';

describe('Service generator', () => {
  before(done => {
    helpers
      .run(join(__dirname, '../generators/app'))
      .withPrompts({
        appName: 'temp-service',
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
        .run(join(__dirname, '../generators/service'), {
          tmpdir: false
        })
        .withArguments(['test'])
        .withOptions({
          structure: 'module-type',
          module: 'home'
        })
        .on('end', done);
    });

    it('should create service files', () => {
      assert.file([
        'app/home/services/test-service.js',
        'app/home/services/test-service_test.js'
      ]);
    });
  });

  describe('with Coffee app and Coffee test', () => {
    before(done => {
      helpers
        .run(join(__dirname, '../generators/service'), {
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

    it('should create service files', () => {
      assert.file([
        'app/home/test1-service.coffee',
        'app/home/test1-service_test.coffee'
      ]);
    });
  });

  describe('with TypeScript app and TypeScript test', () => {
    before(done => {
      helpers
        .run(join(__dirname, '../generators/service'), {
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

    it('should create service files', () => {
      assert.file([
        'app/home/test2-service.ts',
        'app/home/test2-service_test.ts'
      ]);
    });
  });
});
