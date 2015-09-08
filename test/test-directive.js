/* global describe, before, it */
'use strict';
import {assert, test as helpers} from 'yeoman-generator';
import {join} from 'path';

describe('Directive generator', () => {
  describe('with templateUrl', () => {
    before(done => {
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
      before(done => {
        helpers
          .run(join(__dirname, '../generators/directive'), {
            tmpdir: false
          })
          .withArguments(['test-with-url'])
          .withOptions({
            structure: 'module-type',
            module: 'home'
          })
          .on('end', done);
      });

      it('should create directive files', () => {
        assert.file([
          'app/home/directives/test-with-url-directive.js',
          'app/home/directives/test-with-url-directive.tpl.html',
          'app/home/directives/test-with-url-directive_test.js'
        ]);
      });

      it('should use templateUrl in script file', () => {
        assert.fileContent('app/home/directives/test-with-url-directive.js', 'templateUrl:');
      });

      it('should inject template module in spec', () => {
        assert.fileContent('app/home/directives/test-with-url-directive_test.js',
          `beforeEach(module('home', 'home/directives/test-with-url-directive.tpl.html'));`);
      });
    });

    describe('with Jade markup, Coffee app, and Coffee test', () => {
      before(done => {
        helpers
          .run(join(__dirname, '../generators/directive'), {
            tmpdir: false
          })
          .withArguments(['test1-with-url'])
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
          'app/home/test1-with-url-directive.coffee',
          'app/home/test1-with-url-directive.tpl.jade',
          'app/home/test1-with-url-directive_test.coffee'
        ]);
      });

      it('should use templateUrl in script file', () => {
        assert.fileContent('app/home/test1-with-url-directive.coffee', 'templateUrl:');
      });

      it('should inject template module in spec', () => {
        assert.fileContent('app/home/test1-with-url-directive_test.coffee',
          `beforeEach module('home', 'home/test1-with-url-directive.tpl.html')`);
      });
    });

    describe('with Jade markup, TypeScript app, and TypeScript test using module-type', () => {
      before(done => {
        helpers
          .run(join(__dirname, '../generators/directive'), {
            tmpdir: false
          })
          .withArguments(['test3-with-url'])
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
          'app/home/directives/test3-with-url-directive.ts',
          'app/home/directives/test3-with-url-directive.tpl.jade',
          'app/home/directives/test3-with-url-directive_test.ts'
        ]);
      });

      it('should use templateUrl in script file', () => {
        assert.fileContent('app/home/directives/test3-with-url-directive.ts', 'templateUrl:');
      });

      it('should inject template module in spec', () => {
        assert.fileContent('app/home/directives/test3-with-url-directive_test.ts',
          `beforeEach(angular.mock.module('home', 'home/directives/test3-with-url-directive.tpl.html'));`);
      });
    });

    describe('with HAML markup, ES6 app, and ES6 test', () => {
      before(done => {
        helpers
          .run(join(__dirname, '../generators/directive'), {
            tmpdir: false
          })
          .withArguments(['test2-with-url'])
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
          'app/home/test2-with-url-directive.es6',
          'app/home/test2-with-url-directive.tpl.haml',
          'app/home/test2-with-url-directive_test.es6'
        ]);
      });

      it('should use templateUrl in script file', () => {
        assert.fileContent('app/home/test2-with-url-directive.es6', 'templateUrl:');
      });

      it('should inject template module in spec', () => {
        assert.fileContent('app/home/test2-with-url-directive_test.es6',
          `beforeEach(module('home', 'home/test2-with-url-directive.tpl.html'));`);
      });
    });
  });

  describe('with template', () => {
    before(done => {
      helpers
        .run(join(__dirname, '../generators/app'))
        .withPrompts({
          appName: 'temp-directive',
          markup: 'html',
          appScript: 'js',
          controllerAs: false,
          directiveTemplateUrl: false,
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
      before(done => {
        helpers
          .run(join(__dirname, '../generators/directive'), {
            tmpdir: false
          })
          .withArguments(['test-with-inline'])
          .withOptions({
            structure: 'module-type',
            module: 'home'
          })
          .on('end', done);
      });

      it('should create directive files', () => {
        assert.file([
          'app/home/directives/test-with-inline-directive.js',
          'app/home/directives/test-with-inline-directive_test.js'
        ]);
      });

      it('should not create HTML file', () => {
        assert.noFile('app/home/directives/test-with-inline-directive.tpl.html');
      });

      it('should use template in script file', () => {
        assert.fileContent('app/home/directives/test-with-inline-directive.js',
          `template: '<div>{{testWithInline.name}}</div>',`);
      });

      it('should not inject template module', () => {
        assert.fileContent('app/home/directives/test-with-inline-directive_test.js',
          `beforeEach(module('home'));`);
      });
    });

    describe('with Jade markup, Coffee app, and Coffee test', () => {
      before(done => {
        helpers
          .run(join(__dirname, '../generators/directive'), {
            tmpdir: false
          })
          .withArguments(['test1-with-inline'])
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
          'app/home/test1-with-inline-directive.coffee',
          'app/home/test1-with-inline-directive_test.coffee'
        ]);
      });

      it('should not create Jade file', () => {
        assert.noFile('app/home/test1-with-inline-directive.tpl.jade');
      });

      it('should use template in script file', () => {
        assert.fileContent('app/home/test1-with-inline-directive.coffee',
          `template: '<div>{{test1WithInline.name}}</div>'`);
      });

      it('should not inject template module', () => {
        assert.fileContent('app/home/test1-with-inline-directive_test.coffee',
          `beforeEach module('home')`);
      });
    });

    describe('with Jade markup, TypeScript app, and TypeScript test using module-type', () => {
      before(done => {
        helpers
          .run(join(__dirname, '../generators/directive'), {
            tmpdir: false
          })
          .withArguments(['test3-with-inline'])
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
          'app/home/directives/test3-with-inline-directive.ts',
          'app/home/directives/test3-with-inline-directive_test.ts'
        ]);
      });

      it('should not create Jade file', () => {
        assert.noFile('app/home/directives/test3-with-inline-directive.tpl.jade');
      });

      it('should use template in script file', () => {
        assert.fileContent('app/home/directives/test3-with-inline-directive.ts',
          `template: '<div>{{test3WithInline.name}}</div>',`);
      });

      it('should not inject template module', () => {
        assert.fileContent('app/home/directives/test3-with-inline-directive_test.ts',
          `beforeEach(angular.mock.module('home'));`);
      });
    });

    describe('with HAML markup, ES6 app, and ES6 test', () => {
      before(done => {
        helpers
          .run(join(__dirname, '../generators/directive'), {
            tmpdir: false
          })
          .withArguments(['test2-with-inline'])
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
          'app/home/test2-with-inline-directive.es6',
          'app/home/test2-with-inline-directive_test.es6'
        ]);
      });

      it('should not create HAML file', () => {
        assert.noFile('app/home/test2-with-inline-directive.tpl.haml');
      });

      it('should use template in script file', () => {
        assert.fileContent('app/home/test2-with-inline-directive.es6',
          `template: '<div>{{test2WithInline.name}}</div>',`);
      });

      it('should not inject template module', () => {
        assert.fileContent('app/home/test2-with-inline-directive_test.es6',
          `beforeEach(module('home'));`);
      });
    });
  });
});
