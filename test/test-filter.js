/*global describe, before, it */
'use strict';
import {assert, test as helpers} from 'yeoman-generator';
import {join} from 'path';

describe('Filter generator', () => {
  before((done) => {
    helpers
      .run(join(__dirname, '../generator/app'))
      .withPrompts({
        appName: 'temp-filter',
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

  describe('with JS app and JS test with module-type', () => {
    before((done) => {
      helpers
        .run(join(__dirname, '../generator/filter'), {
          tmpdir: false
        })
        .withArguments(['test'])
        .withOptions({
          structure: 'module-type',
          module: 'home'
        })
        .on('end', done);
    });

    it('should create filter files', () => {
      assert.file([
        'app/home/filters/test-filter.js',
        'app/home/filters/test-filter_test.js'
      ]);
    });
  });

  describe('with Coffee app and Coffee test', () => {
    before((done) => {
      helpers
        .run(join(__dirname, '../generator/filter'), {
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

    it('should create filter files', () => {
      assert.file([
        'app/home/test1-filter.coffee',
        'app/home/test1-filter_test.coffee'
      ]);
    });
  });

  describe('with TypeScript app and TypeScript test', () => {
    before((done) => {
      helpers.run(join(__dirname, '../generator/filter'), {
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

    it('should create filter files', () => {
      assert.file([
        'app/home/test2-filter.ts',
        'app/home/test2-filter_test.ts'
      ]);
    });
  });

  describe('with ES6 app and ES6 test', () => {
    before((done) => {
      helpers.run(join(__dirname, '../generator/filter'), {
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

    it('should create filter files', () => {
      assert.file([
        'app/home/test2-filter.es6',
        'app/home/test2-filter_test.es6'
      ]);
    });
  });
});
