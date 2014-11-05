/*global describe, before, it */
'use strict';
var assert = require('yeoman-generator').assert
  , helpers = require('yeoman-generator').test
  , os = require('os')
  , path = require('path')
  , sinon = require('sinon');

describe('Module generator', function () {
  var gen; // used to test if methods have been called

  // generate default app
  // appName different than directory for code coverage
  // stub installDependencies for code coverage
  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join(os.tmpDir(), 'temp-module'))
      .withOptions({
        'skip-install': false
      })
      .withPrompts({
        appName: 'temp-module',
        markup: 'html',
        appScript: 'js',
        controllerAs: false,
        passFunc: true,
        namedFunc: true,
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
      .on('ready', function (generator) {
        gen = generator;
        generator.installDependencies = sinon.spy();
      })
      .on('end', done);
  });

  it('should call installDependencies once', function () {
    assert(gen.installDependencies.calledOnce);
  });

  describe('adding a new empty module', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../module'))
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
        'app/test-group/test-group-controller.js',
        'app/test-group/test-group-controller_test.js',
        'app/test-group/test-group.tpl.html',
        'e2e/test-group/test-group.po.js',
        'e2e/test-group/test-group_test.js'
      ]);
    });
  });

  // trailing slash to test trailing slash removal
  describe('adding a new module', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../module'))
        .withArguments(['test/'])
        .withGenerators([
          path.join(__dirname, '../route'),
          path.join(__dirname, '../controller'),
          path.join(__dirname, '../view')
        ])
        .on('end', done);
    });

    it('should add comma to ui.router in app/app.js', function () {
      assert.fileContent('app/app.js', /    \'ui.router\',/);
    });

    it('should add test to app/app.js deps', function () {
      assert.fileContent('app/app.js', /    \'test\'/);
    });
  });

  describe('adding a deep level module', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../module'))
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
        helpers.run(path.join(__dirname, '../module'))
          .withArguments(['home/myDoor/handle'])
          .withGenerators([
            path.join(__dirname, '../route'),
            path.join(__dirname, '../controller'),
            path.join(__dirname, '../view')
          ])
          .on('end', done);
      });

      it('should add door.handle to app/home/my-door.coffee', function () {
        assert.fileContent('app/home/my-door/my-door.coffee', /    \'myDoor.handle\'/);
      });
    });

    it('should add comma to ui.router in app/home/home.js deps', function () {
      assert.fileContent('app/home/home.js', /    \'ui.router\',/);
    });

    it('should add home.door to app/home/home.js deps', function () {
      assert.fileContent('app/home/home.js', /    \'home.myDoor\'/);
    });

    it('should name module in app/home/my-door/my-door.coffee home.myDoor', function () {
      assert.fileContent('app/home/my-door/my-door.coffee', /angular[^$]*.module[^$]*\'home.myDoor\'/);
    });
  });

  describe('adding a deep level Typescript module', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../module'))
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

    describe('adding a deeper level module', function () {
      before(function (done) {
        helpers.run(path.join(__dirname, '../module'))
          .withArguments(['home/myHouse/handle'])
          .withGenerators([
            path.join(__dirname, '../route'),
            path.join(__dirname, '../controller'),
            path.join(__dirname, '../view')
          ])
          .on('end', done);
      });

      it('should add door.handle to app/home/my-house.ts', function () {
        assert.fileContent('app/home/my-house/my-house.ts', /    \'myHouse.handle\'/);
      });

      it('should name module in app/home/my-house/my-house.ts home.myHouse', function () {
        assert.fileContent('app/home/my-house/my-house.ts', /angular[^$]*.module[^$]*\'home.myHouse\'/);
      });
    });

    it('should add comma to ui.router in app/home/home.js deps', function () {
      assert.fileContent('app/home/home.js', /    \'ui.router\',/);
    });

    it('should add home.door to app/home/home.js deps', function () {
      assert.fileContent('app/home/home.js', /    \'home.myHouse\'/);
    });
  });
});
