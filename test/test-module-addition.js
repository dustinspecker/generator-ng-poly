/*global describe, before, it */
'use strict';
var assert = require('yeoman-generator').assert
  , helpers = require('yeoman-generator').test
  , path = require('path')
  , sinon = require('sinon');

describe('module generator', function () {
  var gen; // used to test if methods have been called

  // generate default app
  // appName different than directory for code coverage
  // stub installDependencies for code coverage
  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join(__dirname, 'module-temp'))
      .withOptions({
        'skip-install': false
      })
      .withPrompts({
        appName: 'module-temp-test',
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
        .withArguments(['home/door'])
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
          .withArguments(['home/door/handle'])
          .withGenerators([
            path.join(__dirname, '../route'),
            path.join(__dirname, '../controller'),
            path.join(__dirname, '../view')
          ])
          .on('end', done);
      });

      it('should add door.handle to app/home/door.coffee', function () {
        assert.fileContent('app/home/door/door.coffee', /    \'door.handle\'/);
      });
    });

    it('should add comma to ui.router in app/home/home.js deps', function () {
      assert.fileContent('app/home/home.js', /    \'ui.router\',/);
    });

    it('should add home.door to app/home/home.js deps', function () {
      assert.fileContent('app/home/home.js', /    \'home.door\'/);
    });

    it('should name module in app/home/door/door.coffee home.door', function () {
      assert.fileContent('app/home/door/door.coffee', /angular[^$]*.module[^$]*\'home.door\'/);
    });
  });

});
