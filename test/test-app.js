/*global describe, before, it */
'use strict';
var assert = require('yeoman-generator').assert
  , helpers = require('yeoman-generator').test
  , join = require('path').join
  , sinon = require('sinon');

describe('App generator', function () {
  describe('with HTML markup, CSS style, JS app, and JS test with module-type', function () {
    // used to test if methods have been called
    var gen;

    before(function (done) {
      helpers
        .run(join(__dirname, '../app'))
        .withOptions({
          'skip-install': false
        })
        .withOptions({
          host: '127.0.0.1',
          port: 8000,
          'app-dir': 'front/',
          'unit-test-dir': 'front/'
        })
        .withPrompts({
          appName: 'temp-app-diff',
          structure: 'module-type',
          ngversion: '1.2.*',
          markup: 'html',
          appScript: 'js',
          controllerAs: false,
          testScript: 'js',
          style: 'css',
          bower: []
        })
        .withGenerators([
          join(__dirname, '../module'),
          join(__dirname, '../route'),
          join(__dirname, '../controller'),
          join(__dirname, '../view')
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

    it('should create files in temp-app-diff directory', function () {
      // temp-app-diff folder is dropped since app generator modifies destination root
      // which affects helpers.inDir()
      assert.file([
        'front/fonts',
        'front/home/home-module.js',
        'front/home/views/home.css',
        'front/home/views/home.tpl.html',
        'front/home/controllers/home-controller.js',
        'front/home/controllers/home-controller_test.js',
        'front/images',
        'front/app-module.js',
        'front/index.html',
        'e2e/home/home.po.js',
        'e2e/home/home_test.js',
        'gulp/analyze.js',
        'gulp/build.js',
        'gulp/test.js',
        'gulp/watch.js',
        '.bowerrc',
        '.editorconfig',
        '.eslintrc',
        '.gitignore',
        '.jscsrc',
        '.jshintrc',
        '.yo-rc.json',
        'bower.json',
        'build.config.js',
        'Gulpfile.js',
        'karma.config.js',
        'package.json',
        'protractor.config.js',
        'README.md'
      ]);
    });

    it('should not create tsd.json', function () {
      assert.noFile([
        'tsd.json'
      ]);
    });

    describe('build.config.js', function () {
      it('should use \'front/\' for appDir in build.config.js', function () {
        assert.fileContent('build.config.js', 'appDir: \'front/\'');
      });

      it('should use \'front/\' for unitTestDir in build.config.js', function () {
        assert.fileContent('build.config.js', 'unitTestDir: \'front/\'');
      });

      it('should use 127.0.0.1 for host in build.config.js', function () {
        assert.fileContent('build.config.js', 'host: \'127.0.0.1\'');
      });

      it('should use 8000 for port in build.config.js', function () {
        assert.fileContent('build.config.js', 'port: 8000');
      });
    });
  });

  describe('with HAML markup, LESS style, TypeScript app, and TypeScript test', function () {
    // used to test if methods have been called
    var gen;

    before(function (done) {
      helpers
        .run(join(__dirname, '../app'))
        .withOptions({
          'skip-install': false
        })
        .withPrompts({
          appName: 'temp-app',
          appDir: 'app',
          markup: 'haml',
          appScript: 'ts',
          controllerAs: false,
          testScript: 'ts',
          unitTestDir: 'app',
          style: 'less',
          framework: 'uibootstrap',
          bower: []
        })
        .withGenerators([
          join(__dirname, '../module'),
          join(__dirname, '../route'),
          join(__dirname, '../controller'),
          join(__dirname, '../view')
        ])
        .on('ready', function (generator) {
          gen = generator;
          generator.installDependencies = sinon.spy();
          generator.spawnCommand = sinon.spy();
        })
        .on('end', done);
    });

    it('should call installDependencies once', function () {
      assert(gen.installDependencies.calledOnce);
    });

    it('should call spawnCommand once', function () {
      assert(gen.spawnCommand.calledOnce);
    });

    it('should create files', function () {
      assert.file([
        'app/fonts',
        'app/home/home-module.ts',
        'app/home/home.less',
        'app/home/home.tpl.haml',
        'app/home/home-controller.ts',
        'app/home/home-controller_test.ts',
        'app/images',
        'app/app-module.ts',
        'app/index.haml',
        'e2e/home/home.po.js',
        'e2e/home/home_test.js',
        'gulp/analyze.js',
        'gulp/build.js',
        'gulp/test.js',
        'gulp/watch.js',
        '.bowerrc',
        '.editorconfig',
        '.eslintrc',
        '.jscsrc',
        '.jshintrc',
        '.yo-rc.json',
        'bower.json',
        'tsd.json',
        'build.config.js',
        'Gulpfile.js',
        'karma.config.js',
        'package.json',
        'protractor.config.js',
        'README.md'
      ]);
    });
  });

  describe('with HAML markup, LESS style, Coffee app, and Coffee test', function () {
    before(function (done) {
      helpers
        .run(join(__dirname, '../app'))
        .withPrompts({
          appName: 'temp-app',
          appDir: 'app',
          markup: 'haml',
          appScript: 'coffee',
          controllerAs: false,
          testScript: 'coffee',
          unitTestDir: 'app',
          style: 'less',
          bower: []
        })
        .withGenerators([
          join(__dirname, '../module'),
          join(__dirname, '../route'),
          join(__dirname, '../controller'),
          join(__dirname, '../view')
        ])
        .on('end', done);
    });

    it('should create files', function () {
      assert.file([
        'app/fonts',
        'app/home/home-module.coffee',
        'app/home/home.less',
        'app/home/home.tpl.haml',
        'app/home/home-controller.coffee',
        'app/home/home-controller_test.coffee',
        'app/images',
        'app/app-module.coffee',
        'app/index.haml',
        'e2e/home/home.po.coffee',
        'e2e/home/home_test.coffee',
        'gulp/analyze.js',
        'gulp/build.js',
        'gulp/test.js',
        'gulp/watch.js',
        '.bowerrc',
        '.editorconfig',
        '.eslintrc',
        '.gitignore',
        '.jscsrc',
        '.jshintrc',
        '.yo-rc.json',
        'bower.json',
        'build.config.js',
        'Gulpfile.js',
        'karma.config.js',
        'package.json',
        'protractor.config.js',
        'README.md'
      ]);

      assert.noFile([
        'tsd.json'
      ]);
    });
  });

  describe('with Jade markup, Stylus style, ES6 app, and ES6 test', function () {
    before(function (done) {
      helpers
        .run(join(__dirname, '../app'))
        .withPrompts({
          appName: 'temp-app',
          markup: 'jade',
          appScript: 'es6',
          controllerAs: false,
          testScript: 'es6',
          unitTestDir: 'app',
          style: 'styl',
          bower: []
        })
        .withGenerators([
          join(__dirname, '../module'),
          join(__dirname, '../route'),
          join(__dirname, '../controller'),
          join(__dirname, '../view')
        ])
        .on('end', done);
    });

    it('should create files', function () {
      assert.file([
        'app/fonts',
        'app/home/home-module.es6',
        'app/home/home.styl',
        'app/home/home.tpl.jade',
        'app/home/home-controller.es6',
        'app/home/home-controller_test.es6',
        'app/images',
        'app/app-module.es6',
        'app/index.jade',
        'e2e/home/home.po.es6',
        'e2e/home/home_test.es6',
        'gulp/analyze.js',
        'gulp/build.js',
        'gulp/test.js',
        'gulp/watch.js',
        '.bowerrc',
        '.editorconfig',
        '.eslintrc',
        '.gitignore',
        '.jscsrc',
        '.jshintrc',
        '.yo-rc.json',
        'bower.json',
        'build.config.js',
        'Gulpfile.js',
        'karma.config.js',
        'package.json',
        'protractor.config.js',
        'README.md'
      ]);
    });
  });

  describe('with HTML markup, SCSS style, JS app, and JS test', function () {
    before(function (done) {
      helpers
        .run(join(__dirname, '../app'))
        .withPrompts({
          appName: 'temp-app',
          markup: 'html',
          appScript: 'js',
          controllerAs: false,
          ngversion: '1.3.*',
          testScript: 'js',
          unitTestDir: 'app',
          style: 'scss',
          bower: []
        })
        .withGenerators([
          join(__dirname, '../module'),
          join(__dirname, '../route'),
          join(__dirname, '../controller'),
          join(__dirname, '../view')
        ])
        .on('end', done);
    });

    it('should create files', function () {
      assert.file([
        'app/fonts',
        'app/home/home-module.js',
        'app/home/home.scss',
        'app/home/home.tpl.html',
        'app/home/home-controller.js',
        'app/home/home-controller_test.js',
        'app/images',
        'app/app-module.js',
        'app/index.html',
        'e2e/home/home.po.js',
        'e2e/home/home_test.js',
        'gulp/analyze.js',
        'gulp/build.js',
        'gulp/test.js',
        'gulp/watch.js',
        '.bowerrc',
        '.editorconfig',
        '.eslintrc',
        '.gitignore',
        '.jscsrc',
        '.jshintrc',
        '.yo-rc.json',
        'bower.json',
        'build.config.js',
        'Gulpfile.js',
        'karma.config.js',
        'package.json',
        'protractor.config.js',
        'README.md'
      ]);
    });
  });
});
