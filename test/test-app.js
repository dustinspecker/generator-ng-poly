/*global describe, before, it */
'use strict';
var assert = require('yeoman-generator').assert
  , helpers = require('yeoman-generator').test
  , join = require('path').join
  , os = require('os');

describe('App generator', function () {
  describe('with HTML markup, CSS style, JS app, and JS test', function () {
    before(function (done) {
      helpers.run(join(__dirname, '../app'))
        .inDir(join(os.tmpDir(), 'temp-app-1'))
        .withOptions({
          'skip-install': true
        })
        .withPrompts({
          appName: 'temp-app-diff',
          appDir: 'front/',
          markup: 'html',
          appScript: 'js',
          controllerAs: false,
          passFunc: true,
          namedFunc: true,
          testScript: 'js',
          unitTestDir: 'front/',
          style: 'css',
          bower: []
        })
        .withGenerators([
          join(__dirname, '../module'),
          join(__dirname, '../route'),
          join(__dirname, '../controller'),
          join(__dirname, '../view')
        ])
        .on('end', function () {
          // TODO: determine why done is called before files are finished writing
          // setTimeout is used to allow files to be finished writing before running tests
          setTimeout(done, 400);
        });
    });

    it('should create files in temp-app-diff directory', function () {
      // temp-app-diff folder is dropped since app generator modifies destination root
      // which affects helpers.inDir()
      assert.file([
        'front/fonts',
        'front/home/home.js',
        'front/home/home.css',
        'front/home/home.tpl.html',
        'front/home/home-controller.js',
        'front/home/home-controller_test.js',
        'front/images',
        'front/app.js',
        'front/index.html',
        'e2e/home/home.po.js',
        'e2e/home/home_test.js',
        'gulp/analyze.js',
        'gulp/build.js',
        'gulp/test.js',
        'gulp/watch.js',
        '.bowerrc',
        '.editorconfig',
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

  describe('with HAML markup, LESS style, TypeScript app, and TypeScript test', function () {
    before(function (done) {
      helpers.run(join(__dirname, '../app'))
        .inDir(join(os.tmpDir(), 'temp-app-5'))
        .withOptions({
          'skip-install': true
        })
        .withPrompts({
          appName: 'temp-app',
          appDir: 'app',
          markup: 'haml',
          appScript: 'ts',
          controllerAs: false,
          passFunc: true,
          namedFunc: true,
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
        .on('end', function () {
          // TODO: determine why done is called before files are finished writing
          // setTimeout is used to allow files to be finished writing before running tests
          setTimeout(done, 400);
        });
    });

    it('should create files', function () {
      assert.file([
        'app/fonts',
        'app/home/home.ts',
        'app/home/home.less',
        'app/home/home.tpl.haml',
        'app/home/home-controller.ts',
        'app/home/home-controller_test.ts',
        'app/images',
        'app/app.ts',
        'app/index.haml',
        'e2e/home/home.po.ts',
        'e2e/home/home_test.ts',
        'gulp/analyze.js',
        'gulp/build.js',
        'gulp/test.js',
        'gulp/watch.js',
        '.bowerrc',
        '.editorconfig',
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
      helpers.run(join(__dirname, '../app'))
        .inDir(join(os.tmpDir(), 'temp-app-2'))
        .withOptions({
          'skip-install': true
        })
        .withPrompts({
          appName: 'temp-app',
          appDir: 'app',
          markup: 'haml',
          appScript: 'coffee',
          controllerAs: false,
          passFunc: true,
          namedFunc: true,
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
        .on('end', function () {
          // TODO: determine why done is called before files are finished writing
          // setTimeout is used to allow files to be finished writing before running tests
          setTimeout(done, 400);
        });
    });

    it('should create files', function () {
      assert.file([
        'app/fonts',
        'app/home/home.coffee',
        'app/home/home.less',
        'app/home/home.tpl.haml',
        'app/home/home-controller.coffee',
        'app/home/home-controller_test.coffee',
        'app/images',
        'app/app.coffee',
        'app/index.haml',
        'e2e/home/home.po.coffee',
        'e2e/home/home_test.coffee',
        'gulp/analyze.js',
        'gulp/build.js',
        'gulp/test.js',
        'gulp/watch.js',
        '.bowerrc',
        '.editorconfig',
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

  describe('with Jade markup, Stylus style, JS app, and JS test', function () {
    before(function (done) {
      helpers.run(join(__dirname, '../app'))
        .inDir(join(os.tmpDir(), 'temp-app-3'))
        .withOptions({
          'skip-install': true
        })
        .withPrompts({
          appName: 'temp-app',
          markup: 'jade',
          appScript: 'js',
          controllerAs: false,
          passFunc: true,
          namedFunc: true,
          testScript: 'js',
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
        .on('end', function () {
          // TODO: determine why done is called before files are finished writing
          // setTimeout is used to allow files to be finished writing before running tests
          setTimeout(done, 400);
        });
    });

    it('should create files', function () {
      assert.file([
        'app/fonts',
        'app/home/home.js',
        'app/home/home.styl',
        'app/home/home.tpl.jade',
        'app/home/home-controller.js',
        'app/home/home-controller_test.js',
        'app/images',
        'app/app.js',
        'app/index.jade',
        'e2e/home/home.po.js',
        'e2e/home/home_test.js',
        'gulp/analyze.js',
        'gulp/build.js',
        'gulp/test.js',
        'gulp/watch.js',
        '.bowerrc',
        '.editorconfig',
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
      helpers.run(join(__dirname, '../app'))
        .inDir(join(os.tmpDir(), 'temp-app-4'))
        .withOptions({
          'skip-install': true
        })
        .withPrompts({
          appName: 'temp-app',
          markup: 'html',
          appScript: 'js',
          controllerAs: false,
          passFunc: true,
          namedFunc: true,
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
        .on('end', function () {
          // TODO: determine why done is called before files are finished writing
          // setTimeout is used to allow files to be finished writing before running tests
          setTimeout(done, 400);
        });
    });

    it('should create files', function () {
      assert.file([
        'app/fonts',
        'app/home/home.js',
        'app/home/home.scss',
        'app/home/home.tpl.html',
        'app/home/home-controller.js',
        'app/home/home-controller_test.js',
        'app/images',
        'app/app.js',
        'app/index.html',
        'e2e/home/home.po.js',
        'e2e/home/home_test.js',
        'gulp/analyze.js',
        'gulp/build.js',
        'gulp/test.js',
        'gulp/watch.js',
        '.bowerrc',
        '.editorconfig',
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
