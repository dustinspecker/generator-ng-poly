/*global describe, before, it */
'use strict';
var assert = require('yeoman-generator').assert
  , helpers = require('yeoman-generator').test
  , path = require('path');

describe('Module generator', function () {
  // generate default app
  // appName different than directory for code coverage
  // stub installDependencies for code coverage
  before(function (done) {
    helpers
      .run(path.join(__dirname, '../app'))
      .withPrompts({
        appName: 'temp-module',
        markup: 'html',
        appScript: 'js',
        controllerAs: false,
        testScript: 'js',
        testDir: 'app',
        style: 'less',
        bower: []
      })
      .withGenerators([
        path.join(__dirname, '../module'),
        path.join(__dirname, '../route'),
        path.join(__dirname, '../controller'),
        path.join(__dirname, '../view')
      ])
      .on('end', done);
  });

  describe('adding a new empty module', function () {
    before(function (done) {
      helpers
        .run(path.join(__dirname, '../module'), {
          tmpdir: false
        })
        .withArguments(['testGroup'])
        .withOptions({
          empty: true
        })
        .withGenerators([
          path.join(__dirname, '../route'),
          path.join(__dirname, '../controller'),
          path.join(__dirname, '../view')
        ])
        .on('end', done);
    });

    it('should not create a controller and view', function () {
      assert.noFile([
        'app/test-group/test-group-routes.js',
        'app/test-group/test-group-controller.js',
        'app/test-group/test-group-controller_test.js',
        'app/test-group/test-group.tpl.html',
        'e2e/test-group/test-group.po.js',
        'e2e/test-group/test-group_test.js'
      ]);
    });
  });

  describe('adding a new CoffeeScript module', function () {
    before(function (done) {
      helpers
        .run(path.join(__dirname, '../module'), {
          tmpdir: false
        })
        .withArguments(['test-coffee/'])
        .withOptions({
          'app-script': 'coffee'
        })
        .withGenerators([
          path.join(__dirname, '../route'),
          path.join(__dirname, '../controller'),
          path.join(__dirname, '../view')
        ])
        .on('end', done);
    });

    it('should add test files', function () {
      assert.file([
        'app/test-coffee/test-coffee-module.coffee',
        'app/test-coffee/test-coffee-routes.coffee',
        'app/test-coffee/test-coffee.less',
        'app/test-coffee/test-coffee.tpl.html',
        'app/test-coffee/test-coffee-controller.coffee',
        'app/test-coffee/test-coffee-controller_test.js'
      ]);
    });

    it('should add comma to ui.router in app/app-module.js', function () {
      assert.fileContent('app/app-module.js', / {4}\'ui.router\',/);
    });

    it('should add testCoffee to app/app-module.js deps', function () {
      assert.fileContent('app/app-module.js', / {4}\'testCoffee\'/);
    });
  });

  describe('adding a new ES2105 module', function () {
    before(function (done) {
      helpers
        .run(path.join(__dirname, '../module'), {
          tmpdir: false
        })
        .withArguments(['test-es6/'])
        .withOptions({
          'app-script': 'es6'
        })
        .withGenerators([
          path.join(__dirname, '../route'),
          path.join(__dirname, '../controller'),
          path.join(__dirname, '../view')
        ])
        .on('end', done);
    });

    it('should add test files', function () {
      assert.file([
        'app/test-es6/test-es6-module.es6',
        'app/test-es6/test-es6-routes.es6',
        'app/test-es6/test-es6.less',
        'app/test-es6/test-es6.tpl.html',
        'app/test-es6/test-es6-controller.es6',
        'app/test-es6/test-es6-controller_test.js'
      ]);
    });

    it('should add comma to ui.router in app/app-module.js', function () {
      assert.fileContent('app/app-module.js', / {4}\'ui.router\',/);
    });

    it('should add testEs6 to app/app-module.js deps', function () {
      assert.fileContent('app/app-module.js', / {4}\'testEs6\'/);
    });
  });

  // trailing slash to test trailing slash removal
  describe('adding a new JS module', function () {
    before(function (done) {
      helpers
        .run(path.join(__dirname, '../module'), {
          tmpdir: false
        })
        .withArguments(['test-js/'])
        .withGenerators([
          path.join(__dirname, '../route'),
          path.join(__dirname, '../controller'),
          path.join(__dirname, '../view')
        ])
        .on('end', done);
    });

    it('should add test files', function () {
      assert.file([
        'app/test-js/test-js-module.js',
        'app/test-js/test-js-routes.js',
        'app/test-js/test-js.less',
        'app/test-js/test-js.tpl.html',
        'app/test-js/test-js-controller.js',
        'app/test-js/test-js-controller_test.js'
      ]);
    });

    it('should add comma to ui.router in app/app-module.js', function () {
      assert.fileContent('app/app-module.js', / {4}\'ui.router\',/);
    });

    it('should add testJs to app/app-module.js deps', function () {
      assert.fileContent('app/app-module.js', / {4}\'testJs\'/);
    });
  });

  describe('adding a new TS module', function () {
    before(function (done) {
      helpers
        .run(path.join(__dirname, '../module'), {
          tmpdir: false
        })
        .withArguments(['test-ts/'])
        .withOptions({
          'app-script': 'ts'
        })
        .withGenerators([
          path.join(__dirname, '../route'),
          path.join(__dirname, '../controller'),
          path.join(__dirname, '../view')
        ])
        .on('end', done);
    });

    it('should add test files', function () {
      assert.file([
        'app/test-ts/test-ts-module.ts',
        'app/test-ts/test-ts-routes.ts',
        'app/test-ts/test-ts.less',
        'app/test-ts/test-ts.tpl.html',
        'app/test-ts/test-ts-controller.ts',
        'app/test-ts/test-ts-controller_test.js'
      ]);
    });

    it('should add comma to ui.router in app/app-module.js', function () {
      assert.fileContent('app/app-module.js', / {4}\'ui.router\',/);
    });

    it('should add testTs to app/app-module.js deps', function () {
      assert.fileContent('app/app-module.js', / {4}\'testTs\'/);
    });
  });

  describe('adding a deep level camelCase module', function () {
    before(function (done) {
      helpers
        .run(path.join(__dirname, '../module'), {
          tmpdir: false
        })
        .withArguments(['home/myDoor'])
        .withOptions({
          'app-script': 'coffee'
        })
        .withGenerators([
          path.join(__dirname, '../route'),
          path.join(__dirname, '../controller'),
          path.join(__dirname, '../view')
        ])
        .on('end', done);
    });

    describe('adding a deeper level module', function () {
      before(function (done) {
        helpers
          .run(path.join(__dirname, '../module'), {
            tmpdir: false
          })
          .withArguments(['home/myDoor/handle'])
          .withGenerators([
            path.join(__dirname, '../route'),
            path.join(__dirname, '../controller'),
            path.join(__dirname, '../view')
          ])
          .on('end', done);
      });

      it('should add door.handle to app/home/my-door-module.coffee', function () {
        assert.fileContent('app/home/my-door/my-door-module.coffee', / {4}\'myDoor.handle\'/);
      });

      it('should name module in app/home/my-door/my-door-module.coffee home.myDoor', function () {
        assert.fileContent('app/home/my-door/my-door-module.coffee', /angular[^$]*.module[^$]*\'home.myDoor\'/);
      });
    });

    it('should add comma to ui.router in app/home/home-module.js deps', function () {
      assert.fileContent('app/home/home-module.js', / {4}\'ui.router\',/);
    });

    it('should add home.door to app/home/home-module.js deps', function () {
      assert.fileContent('app/home/home-module.js', / {4}\'home.myDoor\'/);
    });
  });

  describe('adding a deep level hyphenated module', function () {
    before(function (done) {
      helpers
      .run(path.join(__dirname, '../module'), {
        tmpdir: false
      })
      .withArguments(['home/my-module'])
      .withGenerators([
        path.join(__dirname, '../route'),
        path.join(__dirname, '../controller'),
        path.join(__dirname, '../view')
      ])
      .on('end', done);
    });

    it('should create home.myModule in app/home/my-module/my-module-module.js', function () {
      assert.fileContent('app/home/my-module/my-module-module.js', /angular[^$]*.module[^$]*\'home.myModule\'/);
    });

    it('should add home.myModule in app/home/home-module.js', function () {
      assert.fileContent('app/home/home-module.js', / {4}\'home.myModule\'/);
    });

    it('should add myModule state to app/home/my-module/my-module-routes.js', function () {
      assert.fileContent('app/home/my-module/my-module-routes.js', /[.]state\(\'myModule\', /);
    });
  });

  describe('adding a deep level Typescript module', function () {
    before(function (done) {
      helpers
        .run(path.join(__dirname, '../module'), {
          tmpdir: false
        })
        .withArguments(['home/myHouse'])
        .withOptions({
          'app-script': 'ts'
        })
        .withGenerators([
          path.join(__dirname, '../route'),
          path.join(__dirname, '../controller'),
          path.join(__dirname, '../view')
        ])
        .on('end', done);
    });

    it('should add comma to ui.router in app/home/home-module.js deps', function () {
      assert.fileContent('app/home/home-module.js', / {4}\'ui.router\',/);
    });

    it('should add home.myHouse to app/home/home-module.js deps', function () {
      assert.fileContent('app/home/home-module.js', / {4}\'home.myHouse\'/);
    });

    describe('adding a deeper level module', function () {
      before(function (done) {
        helpers
        .run(path.join(__dirname, '../module'), {
          tmpdir: false
        })
        .withArguments(['home/myHouse/handle'])
        .withOptions({
          'app-script': 'ts'
        })
        .withGenerators([
          path.join(__dirname, '../route'),
          path.join(__dirname, '../controller'),
          path.join(__dirname, '../view')
        ])
          .on('end', done);
      });

      it('should add myHouse.handle to app/home/my-house-module.ts', function () {
        assert.fileContent('app/home/my-house/my-house-module.ts', / {4}\'myHouse.handle\'/);
      });

      it('should name module in app/home/my-house/my-house-module.ts home.myHouse', function () {
        assert.fileContent('app/home/my-house/my-house-module.ts', /angular[^$]*.module[^$]*\'home.myHouse\'/);
      });
    });
  });
});
