/* global describe, before, it */
'use strict';
import {assert, test as helpers} from 'yeoman-generator';
import {join} from 'path';

describe('Constant generator', () => {
  before(done => {
    helpers
      .run(join(__dirname, '../generators/app'))
      .withPrompts({
        appName: 'temp-constant',
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
        .run(join(__dirname, '../generators/constant'), {
          tmpdir: false
        })
        .withArguments(['test'])
        .withOptions({
          structure: 'module-type'
        })
        .withPrompts({
          module: 'home/'
        })
        .on('end', done);
    });

    it('should create constant files', () => {
      assert.file([
        'app/home/constants/test-constant.js',
        'app/home/constants/test-constant_test.js'
      ]);
    });
  });

  describe('with TypeScript app and TypeScript test', () => {
    before(done => {
      helpers
        .run(join(__dirname, '../generators/constant'), {
          tmpdir: false
        })
        .withArguments(['test1'])
        .withPrompts({
          module: 'app'
        })
        .withOptions({
          'app-script': 'ts',
          'test-script': 'ts'
        })
        .on('end', done);
    });

    it('should create constant files', () => {
      assert.file([
        'app/test1-constant.ts',
        'app/test1-constant_test.ts'
      ]);
    });
  });

  describe('with Coffee app and Coffee test', () => {
    before(done => {
      helpers
        .run(join(__dirname, '../generators/constant'), {
          tmpdir: false
        })
        .withArguments(['test2'])
        .withPrompts({
          module: 'app'
        })
        .withOptions({
          'app-script': 'coffee',
          'test-script': 'coffee'
        })
        .on('end', done);
    });

    it('should create constant files', () => {
      assert.file([
        'app/test2-constant.coffee',
        'app/test2-constant_test.coffee'
      ]);
    });
  });

  describe('with ES6 app and ES6 test', () => {
    before(done => {
      helpers
        .run(join(__dirname, '../generators/constant'), {
          tmpdir: false
        })
        .withArguments(['test3'])
        .withOptions({
          'app-script': 'es6',
          'test-script': 'es6'
        })
        .on('end', done);
    });

    it('should create constant files', () => {
      assert.file([
        'app/test3-constant.es6',
        'app/test3-constant_test.es6'
      ]);
    });
  });
});
