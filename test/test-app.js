/*global describe, before, it */
'use strict';
var assert = require('yeoman-generator').assert
  , eol = require('os').EOL
  , helpers = require('yeoman-generator').test
  , join = require('path').join
  , sinon = require('sinon')
  , coffeeDeps, es2015Deps, jadeDeps, hamlDeps, lessDeps, scssDeps, stylusDeps, typescriptDeps;

coffeeDeps = [
  '"coffee-script":',
  '"gulp-coffee":',
  '"gulp-coffeelint":'
];

es2015Deps = [
  '"gulp-babel":'
];

jadeDeps = [
  '"gulp-jade":'
];

hamlDeps = [
  '"gulp-haml":'
];

lessDeps = [
  '"gulp-less":'
];

scssDeps = [
  '"gulp-sass":'
];

stylusDeps = [
  '"gulp-stylus":',
  '"nib":'
];

typescriptDeps = [
  '"gulp-typescript":'
];

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
        'front/home/home-routes.js',
        'front/home/views/home.css',
        'front/home/views/home.tpl.html',
        'front/home/controllers/home-controller.js',
        'front/home/controllers/home-controller_test.js',
        'front/images',
        'front/app-module.js',
        'front/app-routes.js',
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

    describe('gulp/analyze.js', function () {
      it('should have JS linting', function () {
        assert.fileContent('gulp/analyze.js', '$.eslint()');
        assert.fileContent('gulp/analyze.js', '$.jshint()');
        assert.fileContent('gulp/analyze.js', '$.jscs()');
      });

      it('should not have filters', function () {
        assert.noFileContent('gulp/analyze.js', 'coffeeFilter = $.filter(\'**/*.coffee\')');
      });

      it('should not have CS linting', function () {
        assert.noFileContent('gulp/analyze.js', '$.coffeelint()');
      });
    });

    describe('gulp/build.js', function () {
      it('should not have coffeeFilter', function () {
        assert.noFileContent('gulp/build.js', 'coffeeFilter = $.filter(\'**/*.coffee\')');
      });

      it('should not have es6Filter', function () {
        assert.noFileContent('gulp/build.js', 'es6Filter = $.filter(\'**/*.es6\')');
      });

      it('should not have tsFilter', function () {
        assert.noFileContent('gulp/build.js', ', tsFilter = $.filter(\'**/*.ts\')');
      });

      it('should not use compilers', function () {
        var markup, scripts, styles;

        markup = [
          '    ])',
          '      .pipe(gulp.dest(config.buildDir));'
        ].join(eol);

        scripts = [
          '      .pipe($.sourcemaps.init())',
          '      .pipe($.if(isProd, htmlFilter))'
        ].join(eol);

        styles = [
          '      }}))',
          '      .pipe($.autoprefixer())'
        ].join(eol);

        assert.fileContent('gulp/build.js', markup);
        assert.fileContent('gulp/build.js', scripts);
        assert.fileContent('gulp/build.js', styles);
      });
    });

    describe('gulp/test.js', function () {
      it('should not use compilers', function () {
        var buildTests, buildE2ETests;

        buildTests = [
          '    return gulp.src([config.unitTestFiles])',
          '      .pipe(gulp.dest(config.buildUnitTestsDir));'
        ].join(eol);

        buildE2ETests = [
          '    return gulp.src([config.e2eFiles])',
          '      .pipe(gulp.dest(config.buildE2eTestsDir));'
        ].join(eol);

        assert.fileContent('gulp/test.js', buildTests);
        assert.fileContent('gulp/test.js', buildE2ETests);
      });
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

    it('should create home/views/home.tpl.html templateUrl in front/home/home-routes.js', function () {
      assert.fileContent('front/home/home-routes.js', 'templateUrl: \'home/views/home.tpl.html\',');
    });
  });

  describe('Gulpfile.js', function () {
    it('should include correct config', function () {
      [
        'config.appMarkupFiles = path.join(config.appDir, \'**/*.html\');',
        'config.appScriptFiles = path.join(config.appDir, \'**/*.js\');',
        'config.appStyleFiles = path.join(config.appDir, \'**/*.css\');',
        'config.e2eFiles = path.join(\'e2e\', \'**/*.js\');',
        'config.unitTestFiles = path.join(config.unitTestDir, \'**/*_test.js\');'
      ].forEach(function (config) {
        assert.fileContent('Gulpfile.js', config);
      });
    });

    it('should not load nib', function () {
      assert.noFileContent('Gulpfile.js', '\'nib\',');
    });

    it('should not include TypeScript project', function () {
      assert.noFileContent('Gulpfile.js', 'config.tsProject = $.typescript.createProject({');
    });
  });

  describe('package.json', function () {
    it('should not include coffee-script dependencies', function () {
      coffeeDeps.forEach(function (dep) {
        assert.noFileContent('package.json', dep);
      });
    });

    it('should not include typescript dependencies', function () {
      typescriptDeps.forEach(function (dep) {
        assert.noFileContent('package.json', dep);
      });
    });

    it('should not include ES2015 dependencies', function () {
      es2015Deps.forEach(function (dep) {
        assert.noFileContent('package.json', dep);
      });
    });

    it('should not include Jade dependencies', function () {
      jadeDeps.forEach(function (dep) {
        assert.noFileContent('package.json', dep);
      });
    });

    it('should not include HAML dependencies', function () {
      hamlDeps.forEach(function (dep) {
        assert.noFileContent('package.json', dep);
      });
    });

    it('should not include Less dependencies', function () {
      lessDeps.forEach(function (dep) {
        assert.noFileContent('package.json', dep);
      });
    });

    it('should not inclue SCSS dependencies', function () {
      scssDeps.forEach(function (dep) {
        assert.noFileContent('package.json', dep);
      });
    });

    it('should not include Stylus dependencies', function () {
      stylusDeps.forEach(function (dep) {
        assert.noFileContent('package.json', dep);
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
          polymer: true,
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

    it('should call spawnCommand once to install typings', function () {
      assert(gen.spawnCommand.calledOnce);
      assert(gen.spawnCommand.calledWith('tsd', ['reinstall', '--save']));
    });

    it('should create files', function () {
      assert.file([
        'app/fonts',
        'app/home/home-module.ts',
        'app/home/home-routes.ts',
        'app/home/home.less',
        'app/home/home.tpl.haml',
        'app/home/home-controller.ts',
        'app/home/home-controller_test.ts',
        'app/images',
        'app/app-module.ts',
        'app/app-routes.ts',
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

    it('should create home/home.tpl.html templateUrl in app/home/home-routes.ts', function () {
      assert.fileContent('app/home/home-routes.ts', 'templateUrl: \'home/home.tpl.html\',');
    });

    describe('gulp/analyze.js', function () {
      it('should not have JS linting', function () {
        assert.noFileContent('gulp/analyze.js', '$.eslint()');
        assert.noFileContent('gulp/analyze.js', '$.jshint()');
        assert.noFileContent('gulp/analyze.js', '$.jscs()');
      });

      it('should not have filters', function () {
        assert.noFileContent('gulp/analyze.js', 'coffeeFilter = $.filter(\'**/*.coffee\')');
      });

      it('should not have CS linting', function () {
        assert.noFileContent('gulp/analyze.js', '$.coffeelint()');
      });
    });

    describe('gulp/build.js', function () {
      it('should use compilers', function () {
        var markup, scripts, styles;

        markup = [
          '    ])',
          '      .pipe($.haml())',
          '      .pipe(gulp.dest(config.buildDir));'
        ].join(eol);

        scripts = [
          '      .pipe($.sourcemaps.init())',
          '      .pipe(tsFilter)',
          '      .pipe($.typescript(config.tsProject))',
          '      .pipe(tsFilter.restore())',
          '      .pipe($.if(isProd, htmlFilter))'
        ].join(eol);

        styles = [
          '      }}))',
          '      .pipe($.less())',
          '      .pipe($.autoprefixer())'
        ].join(eol);

        assert.fileContent('gulp/build.js', markup);
        assert.fileContent('gulp/build.js', scripts);
        assert.fileContent('gulp/build.js', styles);
      });

      it('should have a components task', function () {
        assert.fileContent('gulp/build.js', 'gulp.task(\'components\', [\'bowerInject\'], function () {');
      });

      it('should have componentsInject task', function () {
        assert.fileContent('gulp/build.js', 'gulp.task(\'componentsInject\', [\'components\'], function () {');
      });

      it('should have copmonentsInject as dependency task for copyTemplates task', function () {
        assert.fileContent('gulp/build.js', 'gulp.task(\'copyTemplates\', [\'componentsInject\'], function () {');
      });
    });

    describe('gulp/test.js', function () {
      it('should use compiler for unit and not for e2e', function () {
        var buildTests, buildE2ETests;

        buildTests = [
          '    return gulp.src([config.unitTestFiles])',
          '      .pipe($.typescript(config.tsProject))',
          '      .pipe(gulp.dest(config.buildUnitTestsDir));'
        ].join(eol);

        buildE2ETests = [
          '    return gulp.src([config.e2eFiles])',
          '      .pipe(gulp.dest(config.buildE2eTestsDir));'
        ].join(eol);

        assert.fileContent('gulp/test.js', buildTests);
        assert.fileContent('gulp/test.js', buildE2ETests);
      });
    });

    describe('Gulpfile.js', function () {
      it('should include correct config', function () {
        [
          'config.appMarkupFiles = path.join(config.appDir, \'**/*.haml\');',
          'config.appScriptFiles = path.join(config.appDir, \'**/*.ts\');',
          'config.appStyleFiles = path.join(config.appDir, \'**/*.less\');',
          'config.e2eFiles = path.join(\'e2e\', \'**/*.js\');',
          'config.unitTestFiles = path.join(config.unitTestDir, \'**/*_test.ts\');'
        ].forEach(function (config) {
          assert.fileContent('Gulpfile.js', config);
        });
      });

      it('should not load nib', function () {
        assert.noFileContent('Gulpfile.js', '\'nib\',');
      });

      it('should include TypeScript project', function () {
        assert.fileContent('Gulpfile.js', 'config.tsProject = $.typescript.createProject({');
      });
    });

    describe('package.json', function () {
      it('should not include coffee-script dependencies', function () {
        coffeeDeps.forEach(function (dep) {
          assert.noFileContent('package.json', dep);
        });
      });

      it('should include typescript dependencies', function () {
        typescriptDeps.forEach(function (dep) {
          assert.fileContent('package.json', dep);
        });
      });

      it('should not include ES2015 dependencies', function () {
        es2015Deps.forEach(function (dep) {
          assert.noFileContent('package.json', dep);
        });
      });

      it('should not include Jade dependencies', function () {
        jadeDeps.forEach(function (dep) {
          assert.noFileContent('package.json', dep);
        });
      });

      it('should include HAML dependencies', function () {
        hamlDeps.forEach(function (dep) {
          assert.fileContent('package.json', dep);
        });
      });

      it('should include Less dependencies', function () {
        lessDeps.forEach(function (dep) {
          assert.fileContent('package.json', dep);
        });
      });

      it('should not inclue SCSS dependencies', function () {
        scssDeps.forEach(function (dep) {
          assert.noFileContent('package.json', dep);
        });
      });

      it('should not include Stylus dependencies', function () {
        stylusDeps.forEach(function (dep) {
          assert.noFileContent('package.json', dep);
        });
      });
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
        'app/home/home-routes.coffee',
        'app/home/home.less',
        'app/home/home.tpl.haml',
        'app/home/home-controller.coffee',
        'app/home/home-controller_test.coffee',
        'app/images',
        'app/app-module.coffee',
        'app/app-routes.coffee',
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

    describe('gulp/analyze.js', function () {
      it('should not have JS linting', function () {
        assert.noFileContent('gulp/analyze.js', '$.eslint()');
        assert.noFileContent('gulp/analyze.js', '$.jshint()');
        assert.noFileContent('gulp/analyze.js', '$.jscs()');
      });

      it('should not have filters', function () {
        assert.noFileContent('gulp/analyze.js', 'coffeeFilter = $.filter(\'**/*.coffee\')');
      });

      it('should have CS linting', function () {
        assert.fileContent('gulp/analyze.js', '$.coffeelint()');
      });
    });

    describe('gulp/build.js', function () {
      it('should use compilers', function () {
        var markup, scripts, styles;

        markup = [
          '    ])',
          '      .pipe($.haml())',
          '      .pipe(gulp.dest(config.buildDir));'
        ].join(eol);

        scripts = [
          '      .pipe($.sourcemaps.init())',
          '      .pipe(coffeeFilter)',
          '      .pipe($.coffee())',
          '      .pipe(coffeeFilter.restore())',
          '      .pipe($.if(isProd, htmlFilter))'
        ].join(eol);

        styles = [
          '      }}))',
          '      .pipe($.less())',
          '      .pipe($.autoprefixer())'
        ].join(eol);

        assert.fileContent('gulp/build.js', markup);
        assert.fileContent('gulp/build.js', scripts);
        assert.fileContent('gulp/build.js', styles);
      });
    });

    describe('gulp/test.js', function () {
      it('should use compilers', function () {
        var buildTests, buildE2ETests;

        buildTests = [
          '    return gulp.src([config.unitTestFiles])',
          '      .pipe($.coffee())',
          '      .pipe(gulp.dest(config.buildUnitTestsDir));'
        ].join(eol);

        buildE2ETests = [
          '    return gulp.src([config.e2eFiles])',
          '      .pipe($.coffee())',
          '      .pipe(gulp.dest(config.buildE2eTestsDir));'
        ].join(eol);

        assert.fileContent('gulp/test.js', buildTests);
        assert.fileContent('gulp/test.js', buildE2ETests);
      });
    });

    describe('Gulpfile.js', function () {
      it('should include correct config', function () {
        [
          'config.appMarkupFiles = path.join(config.appDir, \'**/*.haml\');',
          'config.appScriptFiles = path.join(config.appDir, \'**/*.coffee\');',
          'config.appStyleFiles = path.join(config.appDir, \'**/*.less\');',
          'config.e2eFiles = path.join(\'e2e\', \'**/*.coffee\');',
          'config.unitTestFiles = path.join(config.unitTestDir, \'**/*_test.coffee\');'
        ].forEach(function (config) {
          assert.fileContent('Gulpfile.js', config);
        });

        it('should not load nib', function () {
          assert.noFileContent('Gulpfile.js', '\'nib\',');
        });
      });

      it('should not include TypeScript project', function () {
        assert.noFileContent('Gulpfile.js', 'config.tsProject = $.typescript.createProject({');
      });
    });

    describe('package.json', function () {
      it('should include coffee-script dependencies', function () {
        coffeeDeps.forEach(function (dep) {
          assert.fileContent('package.json', dep);
        });
      });

      it('should not include typescript dependencies', function () {
        typescriptDeps.forEach(function (dep) {
          assert.noFileContent('package.json', dep);
        });
      });

      it('should not include ES2015 dependencies', function () {
        es2015Deps.forEach(function (dep) {
          assert.noFileContent('package.json', dep);
        });
      });

      it('should not include Jade dependencies', function () {
        jadeDeps.forEach(function (dep) {
          assert.noFileContent('package.json', dep);
        });
      });

      it('should include HAML dependencies', function () {
        hamlDeps.forEach(function (dep) {
          assert.fileContent('package.json', dep);
        });
      });

      it('should include Less dependencies', function () {
        lessDeps.forEach(function (dep) {
          assert.fileContent('package.json', dep);
        });
      });

      it('should not inclue SCSS dependencies', function () {
        scssDeps.forEach(function (dep) {
          assert.noFileContent('package.json', dep);
        });
      });

      it('should not include Stylus dependencies', function () {
        stylusDeps.forEach(function (dep) {
          assert.noFileContent('package.json', dep);
        });
      });
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
        'app/home/home-routes.es6',
        'app/home/home.styl',
        'app/home/home.tpl.jade',
        'app/home/home-controller.es6',
        'app/home/home-controller_test.es6',
        'app/images',
        'app/app-module.es6',
        'app/app-routes.es6',
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

    describe('gulp/analyze.js', function () {
      it('should not have JS linting', function () {
        assert.noFileContent('gulp/analyze.js', '$.eslint()');
        assert.noFileContent('gulp/analyze.js', '$.jshint()');
        assert.noFileContent('gulp/analyze.js', '$.jscs()');
      });

      it('should not have filters', function () {
        assert.noFileContent('gulp/analyze.js', 'coffeeFilter = $.filter(\'**/*.coffee\')');
      });

      it('should not have CS linting', function () {
        assert.noFileContent('gulp/analyze.js', '$.coffeelint()');
      });
    });

    describe('gulp/build.js', function () {
      it('should use compilers', function () {
        var markup, scripts, styles;

        markup = [
          '    ])',
          '      .pipe($.jade())',
          '      .pipe(gulp.dest(config.buildDir));'
        ].join(eol);

        scripts = [
          '      .pipe($.sourcemaps.init())',
          '      .pipe(es6Filter)',
          '      .pipe($.babel())',
          '      .pipe($.rename(function (filePath) {',
          '        filePath.extname = \'.js\';',
          '      }))',
          '      .pipe(es6Filter.restore())',
          '      .pipe($.if(isProd, htmlFilter))'
        ].join(eol);

        styles = [
          '      }}))',
          '      .pipe($.stylus({',
          '        use: $.nib()',
          '      }))',
          '      .pipe($.autoprefixer())'
        ].join(eol);

        assert.fileContent('gulp/build.js', markup);
        assert.fileContent('gulp/build.js', scripts);
        assert.fileContent('gulp/build.js', styles);
      });
    });

    describe('gulp/test.js', function () {
      it('should use compilers', function () {
        var buildTests, buildE2ETests;

        buildTests = [
          '    return gulp.src([config.unitTestFiles])',
          '      .pipe($.babel())',
          '      .pipe($.rename(function (filePath) {',
          '        filePath.extname = \'.js\';',
          '      }))',
          '      .pipe(gulp.dest(config.buildUnitTestsDir));'
        ].join(eol);

        buildE2ETests = [
          '    return gulp.src([config.e2eFiles])',
          '      .pipe($.babel())',
          '      .pipe($.rename(function (filePath) {',
          '        filePath.extname = \'.js\';',
          '      }))',
          '      .pipe(gulp.dest(config.buildE2eTestsDir));'
        ].join(eol);

        assert.fileContent('gulp/test.js', buildTests);
        assert.fileContent('gulp/test.js', buildE2ETests);
      });
    });

    describe('Gulpfile.js', function () {
      it('should include correct config', function () {
        [
          'config.appMarkupFiles = path.join(config.appDir, \'**/*.jade\');',
          'config.appScriptFiles = path.join(config.appDir, \'**/*.es6\');',
          'config.appStyleFiles = path.join(config.appDir, \'**/*.styl\');',
          'config.e2eFiles = path.join(\'e2e\', \'**/*.es6\');',
          'config.unitTestFiles = path.join(config.unitTestDir, \'**/*_test.es6\');'
        ].forEach(function (config) {
          assert.fileContent('Gulpfile.js', config);
        });
      });

      it('should load nib', function () {
        assert.fileContent('Gulpfile.js', '\'nib\',');
      });

      it('should not include TypeScript project', function () {
        assert.noFileContent('Gulpfile.js', 'config.tsProject = $.typescript.createProject({');
      });
    });

    describe('package.json', function () {
      it('should not include coffee-script dependencies', function () {
        coffeeDeps.forEach(function (dep) {
          assert.noFileContent('package.json', dep);
        });

        it('should not include typescript dependencies', function () {
          typescriptDeps.forEach(function (dep) {
            assert.noFileContent('package.json', dep);
          });
        });

        it('should not include ES2015 dependencies', function () {
          es2015Deps.forEach(function (dep) {
            assert.noFileContent('package.json', dep);
          });
        });

        it('should include Jade dependencies', function () {
          jadeDeps.forEach(function (dep) {
            assert.fileContent('package.json', dep);
          });
        });

        it('should not include HAML dependencies', function () {
          hamlDeps.forEach(function (dep) {
            assert.noFileContent('package.json', dep);
          });
        });

        it('should not include Less dependencies', function () {
          lessDeps.forEach(function (dep) {
            assert.noFileContent('package.json', dep);
          });
        });

        it('should not inclue SCSS dependencies', function () {
          scssDeps.forEach(function (dep) {
            assert.noFileContent('package.json', dep);
          });
        });

        it('should include Stylus dependencies', function () {
          stylusDeps.forEach(function (dep) {
            assert.fileContent('package.json', dep);
          });
        });
      });
    });
  });

  describe('with HTML markup, SCSS style, JS app, and JS test', function () {
    before(function (done) {
      helpers
        .run(join(__dirname, '../app'))
        .withOptions({
          'skip-controller': true
        })
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
        'app/home/home-routes.js',
        'app/home/home.scss',
        'app/home/home.tpl.html',
        'app/images',
        'app/app-module.js',
        'app/app-routes.js',
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

    it('should not create controllers', function () {
      assert.noFile([
        'app/home-controller.js',
        'app/home-controller_test.js'
      ]);
    });

    describe('gulp/analyze.js', function () {
      it('should have JS linting', function () {
        assert.fileContent('gulp/analyze.js', '$.eslint()');
        assert.fileContent('gulp/analyze.js', '$.jshint()');
        assert.fileContent('gulp/analyze.js', '$.jscs()');
      });

      it('should not have filters', function () {
        assert.noFileContent('gulp/analyze.js', 'coffeeFilter = $.filter(\'**/*.coffee\')');
      });

      it('should not have CS linting', function () {
        assert.noFileContent('gulp/analyze.js', '$.coffeelint()');
      });
    });

    describe('gulp/build.js', function () {
      it('should use compilers', function () {
        var markup, scripts, styles;

        markup = [
          '    ])',
          '      .pipe(gulp.dest(config.buildDir));'
        ].join(eol);

        scripts = [
          '      .pipe($.sourcemaps.init())',
          '      .pipe($.if(isProd, htmlFilter))'
        ].join(eol);

        styles = [
          '      }}))',
          '      .pipe($.sass())',
          '      .pipe($.autoprefixer())'
        ].join(eol);

        assert.fileContent('gulp/build.js', markup);
        assert.fileContent('gulp/build.js', scripts);
        assert.fileContent('gulp/build.js', styles);
      });

      it('should not have a components task', function () {
        assert.noFileContent('gulp/build.js', 'gulp.task(\'components\', [\'bowerInject\'], function () {');
      });

      it('should not have componentsInject task', function () {
        assert.noFileContent('gulp/build.js', 'gulp.task(\'componentsInject\', [\'components\'], function () {');
      });

      it('should have bowerInject as dependency task for copyTemplates task', function () {
        assert.fileContent('gulp/build.js', 'gulp.task(\'copyTemplates\', [\'bowerInject\'], function () {');
      });
    });

    describe('gulp/test.js', function () {
      it('should not use compilers', function () {
        var buildTests, buildE2ETests;

        buildTests = [
          '    return gulp.src([config.unitTestFiles])',
          '      .pipe(gulp.dest(config.buildUnitTestsDir));'
        ].join(eol);

        buildE2ETests = [
          '    return gulp.src([config.e2eFiles])',
          '      .pipe(gulp.dest(config.buildE2eTestsDir));'
        ].join(eol);

        assert.fileContent('gulp/test.js', buildTests);
        assert.fileContent('gulp/test.js', buildE2ETests);
      });
    });

    describe('Gulpfile.js', function () {
      it('should include correct config', function () {
        [
          'config.appMarkupFiles = path.join(config.appDir, \'**/*.html\');',
          'config.appScriptFiles = path.join(config.appDir, \'**/*.js\');',
          'config.appStyleFiles = path.join(config.appDir, \'**/*.scss\');',
          'config.e2eFiles = path.join(\'e2e\', \'**/*.js\');',
          'config.unitTestFiles = path.join(config.unitTestDir, \'**/*_test.js\');'
        ].forEach(function (config) {
          assert.fileContent('Gulpfile.js', config);
        });
      });

      it('should not load nib', function () {
        assert.noFileContent('Gulpfile.js', '\'nib\',');
      });

      it('should not include TypeScript project', function () {
        assert.noFileContent('Gulpfile.js', 'config.tsProject = $.typescript.createProject({');
      });
    });

    describe('package.json', function () {
      it('should not include coffee-script dependencies', function () {
        coffeeDeps.forEach(function (dep) {
          assert.noFileContent('package.json', dep);
        });
      });

      it('should not include typescript dependencies', function () {
        typescriptDeps.forEach(function (dep) {
          assert.noFileContent('package.json', dep);
        });
      });

      it('should not include ES2015 dependencies', function () {
        es2015Deps.forEach(function (dep) {
          assert.noFileContent('package.json', dep);
        });
      });

      it('should not include Jade dependencies', function () {
        jadeDeps.forEach(function (dep) {
          assert.noFileContent('package.json', dep);
        });
      });

      it('should not include HAML dependencies', function () {
        hamlDeps.forEach(function (dep) {
          assert.noFileContent('package.json', dep);
        });
      });

      it('should not include Less dependencies', function () {
        lessDeps.forEach(function (dep) {
          assert.noFileContent('package.json', dep);
        });
      });

      it('should inclue SCSS dependencies', function () {
        scssDeps.forEach(function (dep) {
          assert.fileContent('package.json', dep);
        });
      });

      it('should not include Stylus dependencies', function () {
        stylusDeps.forEach(function (dep) {
          assert.noFileContent('package.json', dep);
        });
      });
    });
  });
});
