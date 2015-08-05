/* global describe, before, it */
'use strict';
import {assert, test as helpers} from 'yeoman-generator';
import {join} from 'path';

describe('Route generator', () => {
  describe('with HTML markup, Less style, JS app, JS test, and skipController', () => {
    before(done => {
      helpers
        .run(join(__dirname, '../generators/app'))
        .withPrompts({
          appName: 'temp-route',
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
        .on('end', () => {
          helpers
            .run(join(__dirname, '../generators/route'), {
              tmpdir: false
            })
            .withArguments(['test'])
            .withOptions({
              module: 'home',
              'skip-controller': true
            })
            .on('end', done);
        });
    });

    it('should create route files', () => {
      assert.file([
        'app/home/test.tpl.html',
        'app/home/test.less',
        'e2e/test/test.po.js',
        'e2e/test/test_test.js'
      ]);
    });

    it('should not create controller files', () => {
      assert.noFile([
        'app/home/test-controller.js',
        'app/home/test-controller_test.js'
      ]);
    });
  });

  describe('with Jade markup, CSS style, Coffee app, and Coffee test with module-type', () => {
    before(done => {
      helpers
        .run(join(__dirname, '../generators/app'))
        .withPrompts({
          appName: 'temp-route',
          markup: 'jade',
          appScript: 'coffee',
          controllerAs: false,
          testScript: 'coffee',
          testDir: 'app',
          style: 'css',
          bower: []
        })
        .withGenerators([
          join(__dirname, '../generators/module'),
          join(__dirname, '../generators/route'),
          join(__dirname, '../generators/controller'),
          join(__dirname, '../generators/view')
        ])
        .on('end', () => {
          helpers
            .run(join(__dirname, '../generators/route'), {
              tmpdir: false
            })
            .withArguments(['test1'])
            .withOptions({
              structure: 'module-type',
              module: 'home',
              markup: 'jade',
              style: 'css',
              'app-script': 'coffee',
              'test-script': 'coffee'
            })
            .on('end', done);
        });
    });

    it('should create route files', () => {
      assert.file([
        'app/home/controllers/test1-controller.coffee',
        'app/home/controllers/test1-controller_test.coffee',
        'app/home/views/test1.tpl.jade',
        'app/home/views/test1.css',
        'e2e/test1/test1.po.coffee',
        'e2e/test1/test1_test.coffee'
      ]);
    });
  });

  describe('with HAML markup, SCSS style, ES6 app, and ES6 test', () => {
    before(done => {
      helpers
        .run(join(__dirname, '../generators/app'))
        .withPrompts({
          appName: 'temp-route',
          markup: 'haml',
          appScript: 'es6',
          controllerAs: false,
          testScript: 'es6',
          testDir: 'app',
          style: 'scss',
          bower: []
        })
        .withGenerators([
          join(__dirname, '../generators/module'),
          join(__dirname, '../generators/route'),
          join(__dirname, '../generators/controller'),
          join(__dirname, '../generators/view')
        ])
        .on('end', () => {
          helpers
            .run(join(__dirname, '../generators/route'), {
              tmpdir: false
            })
            .withArguments(['test.child'])
            .withOptions({
              module: 'home',
              markup: 'haml',
              style: 'scss'
            })
            .on('end', done);
        });
    });

    it('should create route files', () => {
      assert.file([
        'app/home/test-child-controller.es6',
        'app/home/test-child-controller_test.es6',
        'app/home/test-child.tpl.haml',
        'app/home/test-child.scss',
        'e2e/test-child/test-child.po.es6',
        'e2e/test-child/test-child_test.es6'
      ]);
    });
  });

  describe('with HTML markup, Stylus style, JS app, and JS test', () => {
    before(done => {
      helpers
        .run(join(__dirname, '../generators/app'))
        .withPrompts({
          appName: 'temp-route',
          markup: 'html',
          appScript: 'js',
          controllerAs: false,
          testScript: 'js',
          testDir: 'app',
          style: 'styl',
          bower: []
        })
        .withGenerators([
          join(__dirname, '../generators/module'),
          join(__dirname, '../generators/route'),
          join(__dirname, '../generators/controller'),
          join(__dirname, '../generators/view')
        ])
        .on('end', () => {
          helpers
            .run(join(__dirname, '../generators/route'), {
              tmpdir: false
            })
            .withArguments(['test'])
            .withOptions({
              module: 'app',
              style: 'styl'
            })
            .on('end', done);
        });
    });

    it('should create route files', () => {
      assert.file([
        'app/test-controller.js',
        'app/test-controller_test.js',
        'app/test.tpl.html',
        'app/test.styl',
        'e2e/test/test.po.js',
        'e2e/test/test_test.js'
      ]);
    });
  });

  describe('with Jade markup, CSS style, TypeScript app, and TypeScript test', () => {
    before(done => {
      helpers
        .run(join(__dirname, '../generators/app'))
        .withPrompts({
          appName: 'temp-route',
          markup: 'jade',
          appScript: 'ts',
          controllerAs: false,
          testScript: 'ts',
          testDir: 'app',
          style: 'css',
          bower: []
        })
        .withGenerators([
          join(__dirname, '../generators/module'),
          join(__dirname, '../generators/route'),
          join(__dirname, '../generators/controller'),
          join(__dirname, '../generators/view')
        ])
        .on('end', () => {
          helpers
            .run(join(__dirname, '../generators/route'), {
              tmpdir: false
            })
            .withArguments(['test2'])
            .withOptions({
              module: 'home',
              markup: 'jade',
              style: 'css',
              'app-script': 'ts',
              'test-script': 'ts'
            })
            .on('end', done);
        });
    });

    it('should create route files', () => {
      assert.file([
        'app/home/test2-controller.ts',
        'app/home/test2-controller_test.ts',
        'app/home/test2.tpl.jade',
        'app/home/test2.css',
        'e2e/test2/test2.po.js',
        'e2e/test2/test2_test.js'
      ]);
    });
  });
});
