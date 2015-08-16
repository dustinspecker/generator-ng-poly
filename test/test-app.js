/* global describe, before, it */
'use strict';
import {assert, test as helpers} from 'yeoman-generator';
import {EOL} from 'os';
import {join} from 'path';
import sinon from 'sinon';

let coffeeDeps, es2015Deps, jadeDeps, hamlDeps, lessDeps, scssDeps, stylusDeps, typescriptDeps;

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

describe('App generator', () => {
  describe('with HTML markup, CSS style, JS app, and JS test with module-type', () => {
    // used to test if methods have been called
    let gen;

    before(done => {
      helpers
        .run(join(__dirname, '../generators/app'))
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
          polymer: true,
          bower: [],
          framework: 'uibootstrap'
        })
        .withGenerators([
          join(__dirname, '../generators/module'),
          join(__dirname, '../generators/route'),
          join(__dirname, '../generators/controller'),
          join(__dirname, '../generators/view')
        ])
        .on('ready', generator => {
          gen = generator;
          generator.installDependencies = sinon.spy();
        })
        .on('end', done);
    });

    it('should call installDependencies once', () => {
      assert(gen.installDependencies.calledOnce);
    });

    it('should create files in temp-app-diff directory', () => {
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

    it('should not create tsd.json', () => {
      assert.noFile([
        'tsd.json'
      ]);
    });

    describe('.eslintrc', () => {
      it('should extend dustinspecker', () => {
        assert.fileContent('.eslintrc', '"dustinspecker"');
      });
    });

    describe('bower.json', () => {
      it('should have UI Bootstrap version 0.12.1', () => {
        assert.fileContent('bower.json', '"angular-bootstrap": "~0.12.1"');
      });
    });

    describe('gulp/analyze.js', () => {
      it('should have JS linting', () => {
        assert.fileContent('gulp/analyze.js', '$.eslint()');
        assert.fileContent('gulp/analyze.js', '$.jshint()');
        assert.fileContent('gulp/analyze.js', '$.jscs()');
      });

      it('should JS have filters', () => {
        assert.fileContent('gulp/analyze.js', 'var jsFilter = $.filter(\'**/*.js\', {restore: true});');
      });

      it('should not have unrequired filters', () => {
        assert.noFileContent('gulp/analyze.js', 'coffeeFilter = $.filter(\'**/*.coffee\', {restore: true});');
        assert.noFileContent('gulp/analyze.js', 'es6Filter = $.filter(\'**/*.es6\', {restore: true});');
      });

      it('should not have CS linting', () => {
        assert.noFileContent('gulp/analyze.js', '$.coffeelint()');
      });
    });

    describe('gulp/build.js', () => {
      it('should not have coffeeFilter', () => {
        assert.noFileContent('gulp/build.js', 'coffeeFilter = $.filter(\'**/*.coffee\', {restore: true})');
      });

      it('should not have es6Filter', () => {
        assert.noFileContent('gulp/build.js', 'es6Filter = $.filter(\'**/*.es6\', {restore: true})');
      });

      it('should not have tsFilter', () => {
        assert.noFileContent('gulp/build.js', ', tsFilter = $.filter(\'**/*.ts\', {restore: true})');
      });

      it('should not use compilers', () => {
        let markup, scripts, styles;

        markup = [
          '    ])',
          '      .pipe(gulp.dest(config.buildDir));'
        ].join(EOL);

        scripts = [
          '      .pipe($.sourcemaps.init())',
          '      .pipe($.if(isProd, htmlFilter))'
        ].join(EOL);

        styles = [
          '      }}))',
          '      .pipe($.autoprefixer())'
        ].join(EOL);

        assert.fileContent('gulp/build.js', markup);
        assert.fileContent('gulp/build.js', scripts);
        assert.fileContent('gulp/build.js', styles);
      });

      it('should have a components task', () => {
        assert.fileContent('gulp/build.js', 'gulp.task(\'components\', [\'bowerInject\'], function () {');
      });

      it('should not have filters in components task', () => {
        assert.noFileContent('gulp/build.js', 'markupFilter');
        assert.noFileContent('gulp/build.js', 'scriptFilter');
        assert.noFileContent('gulp/build.js', 'styleFilter');
      });

      it('should have componentsInject task', () => {
        assert.fileContent('gulp/build.js', 'gulp.task(\'componentsInject\', [\'components\'], function () {');
      });

      it('should have copmonentsInject as dependency task for copyTemplates task', () => {
        assert.fileContent('gulp/build.js', 'gulp.task(\'copyTemplates\', [\'componentsInject\'], function () {');
      });
    });

    describe('gulp/test.js', () => {
      it('should not use compilers', () => {
        let buildTests, buildE2ETests;

        buildTests = [
          '    return gulp.src([config.unitTestFiles])',
          '      .pipe(gulp.dest(config.buildUnitTestsDir));'
        ].join(EOL);

        buildE2ETests = [
          '    return gulp.src([config.e2eFiles])',
          '      .pipe(gulp.dest(config.buildE2eTestsDir));'
        ].join(EOL);

        assert.fileContent('gulp/test.js', buildTests);
        assert.fileContent('gulp/test.js', buildE2ETests);
      });
    });

    describe('build.config.js', () => {
      it('should use \'front/\' for appDir in build.config.js', () => {
        assert.fileContent('build.config.js', 'appDir: \'front/\'');
      });

      it('should use \'front/\' for unitTestDir in build.config.js', () => {
        assert.fileContent('build.config.js', 'unitTestDir: \'front/\'');
      });

      it('should use 127.0.0.1 for host in build.config.js', () => {
        assert.fileContent('build.config.js', 'host: \'127.0.0.1\'');
      });

      it('should use 8000 for port in build.config.js', () => {
        assert.fileContent('build.config.js', 'port: 8000');
      });
    });

    it('should create home/views/home.tpl.html templateUrl in front/home/home-routes.js', () => {
      assert.fileContent('front/home/home-routes.js', 'templateUrl: \'home/views/home.tpl.html\',');
    });
  });

  describe('Gulpfile.js', () => {
    it('should include correct config', () => {
      ['config.appMarkupFiles = path.join(config.appDir, \'**/*.html\');',
        'config.appScriptFiles = path.join(config.appDir, \'**/*.js\');',
        'config.appStyleFiles = path.join(config.appDir, \'**/*.css\');',
        'config.e2eFiles = path.join(\'e2e\', \'**/*.js\');',
        'config.unitTestFiles = path.join(config.unitTestDir, \'**/*_test.js\');'
      ].forEach((config) => {
        assert.fileContent('Gulpfile.js', config);
      });
    });

    it('should not load nib', () => {
      assert.noFileContent('Gulpfile.js', '\'nib\',');
    });

    it('should not include TypeScript project', () => {
      assert.noFileContent('Gulpfile.js', 'config.tsSourceProject = $.typescript.createProject({');
    });
  });

  describe('package.json', () => {
    it('should not include coffee-script dependencies', () => {
      coffeeDeps.forEach((dep) => {
        assert.noFileContent('package.json', dep);
      });
    });

    it('should not include typescript dependencies', () => {
      typescriptDeps.forEach((dep) => {
        assert.noFileContent('package.json', dep);
      });
    });

    it('should not include ES2015 dependencies', () => {
      es2015Deps.forEach((dep) => {
        assert.noFileContent('package.json', dep);
      });
    });

    it('should not include Jade dependencies', () => {
      jadeDeps.forEach((dep) => {
        assert.noFileContent('package.json', dep);
      });
    });

    it('should not include HAML dependencies', () => {
      hamlDeps.forEach((dep) => {
        assert.noFileContent('package.json', dep);
      });
    });

    it('should not include Less dependencies', () => {
      lessDeps.forEach((dep) => {
        assert.noFileContent('package.json', dep);
      });
    });

    it('should not inclue SCSS dependencies', () => {
      scssDeps.forEach((dep) => {
        assert.noFileContent('package.json', dep);
      });
    });

    it('should not include Stylus dependencies', () => {
      stylusDeps.forEach((dep) => {
        assert.noFileContent('package.json', dep);
      });
    });
  });

  describe('with HAML markup, LESS style, TypeScript app, and TypeScript test', () => {
    // used to test if methods have been called
    let gen;

    before(done => {
      helpers
        .run(join(__dirname, '../generators/app'))
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
          ngversion: '1.4.*',
          framework: 'uibootstrap',
          polymer: true,
          bower: []
        })
        .withGenerators([
          join(__dirname, '../generators/module'),
          join(__dirname, '../generators/route'),
          join(__dirname, '../generators/controller'),
          join(__dirname, '../generators/view')
        ])
        .on('ready', generator => {
          gen = generator;
          generator.installDependencies = sinon.spy();
          generator.spawnCommand = sinon.spy();
        })
        .on('end', done);
    });

    it('should call installDependencies once', () => {
      assert(gen.installDependencies.calledOnce);
    });

    it('should call spawnCommand once to install typings', () => {
      assert(gen.spawnCommand.calledOnce);
      assert(gen.spawnCommand.calledWith('tsd', ['reinstall', '--save']));
    });

    it('should create files', () => {
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

    it('should create home/home.tpl.html templateUrl in app/home/home-routes.ts', () => {
      assert.fileContent('app/home/home-routes.ts', 'templateUrl: \'home/home.tpl.html\',');
    });

    describe('.eslintrc', () => {
      it('should extend dustinspecker', () => {
        assert.fileContent('.eslintrc', '"dustinspecker"');
      });
    });

    describe('bower.json', () => {
      it('should have UI Bootstrap version 0.13.3', () => {
        assert.fileContent('bower.json', '"angular-bootstrap": "~0.13.3"');
      });
    });

    describe('gulp/analyze.js', () => {
      it('should not have JS linting', () => {
        assert.noFileContent('gulp/analyze.js', '$.eslint()');
        assert.noFileContent('gulp/analyze.js', '$.jshint()');
        assert.noFileContent('gulp/analyze.js', '$.jscs()');
      });

      it('should not have filters', () => {
        assert.noFileContent('gulp/analyze.js', 'coffeeFilter = $.filter(\'**/*.coffee\', {restore: true})');
        assert.noFileContent('gulp/analyze.js', 'es6Filter = $.filter(\'**/*.es6\', {restore: true})');
        assert.noFileContent('gulp/analyze.js', 'jsFilter = $.filter(\'**/*.js\', {restore: true})');
      });

      it('should not have CS linting', () => {
        assert.noFileContent('gulp/analyze.js', '$.coffeelint()');
      });
    });

    describe('gulp/build.js', () => {
      it('should use compilers', () => {
        let markup, scripts, styles;

        markup = [
          '    ])',
          '      .pipe($.haml())',
          '      .pipe(gulp.dest(config.buildDir));'
        ].join(EOL);

        scripts = [
          '      .pipe($.sourcemaps.init())',
          '      .pipe(tsFilter)',
          '      .pipe($.typescript(config.tsSourceProject))',
          '      .pipe(tsFilter.restore)',
          '      .pipe($.if(isProd, htmlFilter))'
        ].join(EOL);

        styles = [
          '      }}))',
          '      .pipe($.less())',
          '      .pipe($.autoprefixer())'
        ].join(EOL);

        assert.fileContent('gulp/build.js', markup);
        assert.fileContent('gulp/build.js', scripts);
        assert.fileContent('gulp/build.js', styles);
      });

      it('should have a components task', () => {
        assert.fileContent('gulp/build.js', 'gulp.task(\'components\', [\'bowerInject\'], function () {');
      });

      it('should use filters in components task', () => {
        let expectedMarkup, expectedScript, expectedStyle;

        expectedMarkup = [
          '      .pipe(markupFilter)',
          '      .pipe($.haml())',
          '      .pipe(markupFilter.restore)'
        ].join(EOL);

        expectedScript = [
          '      .pipe(scriptFilter)',
          '      .pipe($.typescript(config.tsSourceProject))',
          '      .pipe(scriptFilter.restore)'
        ].join(EOL);

        expectedStyle = [
          '      .pipe(styleFilter)',
          '      .pipe($.less())',
          '      .pipe(styleFilter.restore)'
        ].join(EOL);

        assert.fileContent('gulp/build.js', 'markupFilter = $.filter(\'**/*.haml\', {restore: true})');
        assert.fileContent('gulp/build.js', 'scriptFilter = $.filter(\'**/*.ts\', {restore: true})');
        assert.fileContent('gulp/build.js', 'styleFilter = $.filter(\'**/*.less\', {restore: true})');

        assert.fileContent('gulp/build.js', expectedMarkup);
        assert.fileContent('gulp/build.js', expectedScript);
        assert.fileContent('gulp/build.js', expectedStyle);
      });

      it('should have componentsInject task', () => {
        assert.fileContent('gulp/build.js', 'gulp.task(\'componentsInject\', [\'components\'], function () {');
      });

      it('should have copmonentsInject as dependency task for copyTemplates task', () => {
        assert.fileContent('gulp/build.js', 'gulp.task(\'copyTemplates\', [\'componentsInject\'], function () {');
      });
    });

    describe('gulp/test.js', () => {
      it('should use compiler for unit and not for e2e', () => {
        let buildTests, buildE2ETests;

        buildTests = [
          '    return gulp.src([config.unitTestFiles])',
          '      .pipe($.typescript(config.tsTestProject))',
          '      .pipe(gulp.dest(config.buildUnitTestsDir));'
        ].join(EOL);

        buildE2ETests = [
          '    return gulp.src([config.e2eFiles])',
          '      .pipe(gulp.dest(config.buildE2eTestsDir));'
        ].join(EOL);

        assert.fileContent('gulp/test.js', buildTests);
        assert.fileContent('gulp/test.js', buildE2ETests);
      });
    });

    describe('Gulpfile.js', () => {
      it('should include correct config', () => {
        ['config.appMarkupFiles = path.join(config.appDir, \'**/*.haml\');',
          'config.appScriptFiles = path.join(config.appDir, \'**/*.ts\');',
          'config.appStyleFiles = path.join(config.appDir, \'**/*.less\');',
          'config.e2eFiles = path.join(\'e2e\', \'**/*.js\');',
          'config.unitTestFiles = path.join(config.unitTestDir, \'**/*_test.ts\');'
        ].forEach((config) => {
          assert.fileContent('Gulpfile.js', config);
        });
      });

      it('should not load nib', () => {
        assert.noFileContent('Gulpfile.js', '\'nib\',');
      });

      it('should include TypeScript project', () => {
        assert.fileContent('Gulpfile.js', 'config.tsSourceProject = $.typescript.createProject({');
      });
    });

    describe('package.json', () => {
      it('should not include coffee-script dependencies', () => {
        coffeeDeps.forEach((dep) => {
          assert.noFileContent('package.json', dep);
        });
      });

      it('should include typescript dependencies', () => {
        typescriptDeps.forEach((dep) => {
          assert.fileContent('package.json', dep);
        });
      });

      it('should not include ES2015 dependencies', () => {
        es2015Deps.forEach((dep) => {
          assert.noFileContent('package.json', dep);
        });
      });

      it('should not include Jade dependencies', () => {
        jadeDeps.forEach((dep) => {
          assert.noFileContent('package.json', dep);
        });
      });

      it('should include HAML dependencies', () => {
        hamlDeps.forEach((dep) => {
          assert.fileContent('package.json', dep);
        });
      });

      it('should include Less dependencies', () => {
        lessDeps.forEach((dep) => {
          assert.fileContent('package.json', dep);
        });
      });

      it('should not inclue SCSS dependencies', () => {
        scssDeps.forEach((dep) => {
          assert.noFileContent('package.json', dep);
        });
      });

      it('should not include Stylus dependencies', () => {
        stylusDeps.forEach((dep) => {
          assert.noFileContent('package.json', dep);
        });
      });
    });
  });

  describe('with HAML markup, LESS style, Coffee app, and Coffee test', () => {
    before(done => {
      helpers
        .run(join(__dirname, '../generators/app'))
        .withPrompts({
          appName: 'temp-app',
          appDir: 'app',
          markup: 'haml',
          appScript: 'coffee',
          controllerAs: false,
          testScript: 'coffee',
          unitTestDir: 'app',
          style: 'less',
          polymer: true,
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

    it('should create files', () => {
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

    describe('.eslintrc', () => {
      it('should extend dustinspecker', () => {
        assert.fileContent('.eslintrc', '"dustinspecker"');
      });
    });

    describe('gulp/analyze.js', () => {
      it('should not have JS linting', () => {
        assert.noFileContent('gulp/analyze.js', '$.eslint()');
        assert.noFileContent('gulp/analyze.js', '$.jshint()');
        assert.noFileContent('gulp/analyze.js', '$.jscs()');
      });

      it('should have CS filter', () => {
        assert.fileContent('gulp/analyze.js', 'var coffeeFilter = $.filter(\'**/*.coffee\', {restore: true});');
      });

      it('should not have unrequired filters', () => {
        assert.noFileContent('gulp/analyze.js', 'es6Filter = $.filter(\'**/*.es6\', {restore: true})');
        assert.noFileContent('gulp/analyze.js', 'jsFilter = $.filter(\'**/*.js\', {restore: true})');
      });

      it('should have CS linting', () => {
        assert.fileContent('gulp/analyze.js', '$.coffeelint()');
      });
    });

    describe('gulp/build.js', () => {
      it('should use compilers', () => {
        let markup, scripts, styles;

        markup = [
          '    ])',
          '      .pipe($.haml())',
          '      .pipe(gulp.dest(config.buildDir));'
        ].join(EOL);

        scripts = [
          '      .pipe($.sourcemaps.init())',
          '      .pipe(coffeeFilter)',
          '      .pipe($.coffee())',
          '      .pipe(coffeeFilter.restore)',
          '      .pipe($.if(isProd, htmlFilter))'
        ].join(EOL);

        styles = [
          '      }}))',
          '      .pipe($.less())',
          '      .pipe($.autoprefixer())'
        ].join(EOL);

        assert.fileContent('gulp/build.js', markup);
        assert.fileContent('gulp/build.js', scripts);
        assert.fileContent('gulp/build.js', styles);
      });

      it('should have a components task', () => {
        assert.fileContent('gulp/build.js', 'gulp.task(\'components\', [\'bowerInject\'], function () {');
      });

      it('should use filters in components task', () => {
        let expectedMarkup, expectedScript, expectedStyle;

        expectedMarkup = [
          '      .pipe(markupFilter)',
          '      .pipe($.haml())',
          '      .pipe(markupFilter.restore)'
        ].join(EOL);

        expectedScript = [
          '      .pipe(scriptFilter)',
          '      .pipe($.coffee())',
          '      .pipe(scriptFilter.restore)'
        ].join(EOL);

        expectedStyle = [
          '      .pipe(styleFilter)',
          '      .pipe($.less())',
          '      .pipe(styleFilter.restore)'
        ].join(EOL);

        assert.fileContent('gulp/build.js', 'markupFilter = $.filter(\'**/*.haml\', {restore: true})');
        assert.fileContent('gulp/build.js', 'scriptFilter = $.filter(\'**/*.coffee\', {restore: true})');
        assert.fileContent('gulp/build.js', 'styleFilter = $.filter(\'**/*.less\', {restore: true})');

        assert.fileContent('gulp/build.js', expectedMarkup);
        assert.fileContent('gulp/build.js', expectedScript);
        assert.fileContent('gulp/build.js', expectedStyle);
      });

      it('should have componentsInject task', () => {
        assert.fileContent('gulp/build.js', 'gulp.task(\'componentsInject\', [\'components\'], function () {');
      });

      it('should have copmonentsInject as dependency task for copyTemplates task', () => {
        assert.fileContent('gulp/build.js', 'gulp.task(\'copyTemplates\', [\'componentsInject\'], function () {');
      });
    });

    describe('gulp/test.js', () => {
      it('should use compilers', () => {
        let buildTests, buildE2ETests;

        buildTests = [
          '    return gulp.src([config.unitTestFiles])',
          '      .pipe($.coffee())',
          '      .pipe(gulp.dest(config.buildUnitTestsDir));'
        ].join(EOL);

        buildE2ETests = [
          '    return gulp.src([config.e2eFiles])',
          '      .pipe($.coffee())',
          '      .pipe(gulp.dest(config.buildE2eTestsDir));'
        ].join(EOL);

        assert.fileContent('gulp/test.js', buildTests);
        assert.fileContent('gulp/test.js', buildE2ETests);
      });
    });

    describe('Gulpfile.js', () => {
      it('should include correct config', () => {
        ['config.appMarkupFiles = path.join(config.appDir, \'**/*.haml\');',
          'config.appScriptFiles = path.join(config.appDir, \'**/*.coffee\');',
          'config.appStyleFiles = path.join(config.appDir, \'**/*.less\');',
          'config.e2eFiles = path.join(\'e2e\', \'**/*.coffee\');',
          'config.unitTestFiles = path.join(config.unitTestDir, \'**/*_test.coffee\');'
        ].forEach((config) => {
          assert.fileContent('Gulpfile.js', config);
        });

        it('should not load nib', () => {
          assert.noFileContent('Gulpfile.js', '\'nib\',');
        });
      });

      it('should not include TypeScript project', () => {
        assert.noFileContent('Gulpfile.js', 'config.tsSourceProject = $.typescript.createProject({');
      });
    });

    describe('package.json', () => {
      it('should include coffee-script dependencies', () => {
        coffeeDeps.forEach((dep) => {
          assert.fileContent('package.json', dep);
        });
      });

      it('should not include typescript dependencies', () => {
        typescriptDeps.forEach((dep) => {
          assert.noFileContent('package.json', dep);
        });
      });

      it('should not include ES2015 dependencies', () => {
        es2015Deps.forEach((dep) => {
          assert.noFileContent('package.json', dep);
        });
      });

      it('should not include Jade dependencies', () => {
        jadeDeps.forEach((dep) => {
          assert.noFileContent('package.json', dep);
        });
      });

      it('should include HAML dependencies', () => {
        hamlDeps.forEach((dep) => {
          assert.fileContent('package.json', dep);
        });
      });

      it('should include Less dependencies', () => {
        lessDeps.forEach((dep) => {
          assert.fileContent('package.json', dep);
        });
      });

      it('should not inclue SCSS dependencies', () => {
        scssDeps.forEach((dep) => {
          assert.noFileContent('package.json', dep);
        });
      });

      it('should not include Stylus dependencies', () => {
        stylusDeps.forEach((dep) => {
          assert.noFileContent('package.json', dep);
        });
      });
    });
  });

  describe('with Jade markup, Stylus style, ES6 app, and ES6 test', () => {
    before(done => {
      helpers
        .run(join(__dirname, '../generators/app'))
        .withPrompts({
          appName: 'temp-app',
          markup: 'jade',
          appScript: 'es6',
          controllerAs: false,
          testScript: 'es6',
          unitTestDir: 'app',
          style: 'styl',
          polymer: true,
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

    it('should create files', () => {
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

    describe('.eslintrc', () => {
      it('should extend dustinspecker', () => {
        assert.fileContent('.eslintrc', '"dustinspecker/esnext"');
      });
    });

    describe('gulp/analyze.js', () => {
      it('should have JS linting', () => {
        assert.fileContent('gulp/analyze.js', '$.eslint()');
        assert.fileContent('gulp/analyze.js', '$.jshint()');
        assert.fileContent('gulp/analyze.js', '$.jscs({');
      });

      it('should have es6 filters', () => {
        assert.fileContent('gulp/analyze.js', 'var es6Filter = $.filter(\'**/*.es6\', {restore: true});');
      });

      it('should not have unrequired filters', () => {
        assert.noFileContent('gulp/analyze.js', 'coffeeFilter = $.filter(\'**/.coffee\', {restore: true})');
        assert.noFileContent('gulp/analyze.js', 'jsFilter = $.filter(\'**/*.js\', {restore: true})');
      });

      it('should not have CS linting', () => {
        assert.noFileContent('gulp/analyze.js', '$.coffeelint()');
      });
    });

    describe('gulp/build.js', () => {
      it('should use compilers', () => {
        let markup, scripts, styles;

        markup = [
          '    ])',
          '      .pipe($.jade())',
          '      .pipe(gulp.dest(config.buildDir));'
        ].join(EOL);

        scripts = [
          '      .pipe($.sourcemaps.init())',
          '      .pipe(es6Filter)',
          '      .pipe($.babel())',
          '      .pipe($.rename(function (filePath) {',
          '        filePath.extname = \'.js\';',
          '      }))',
          '      .pipe(es6Filter.restore)',
          '      .pipe($.if(isProd, htmlFilter))'
        ].join(EOL);

        styles = [
          '      }}))',
          '      .pipe($.stylus({',
          '        use: $.nib()',
          '      }))',
          '      .pipe($.autoprefixer())'
        ].join(EOL);

        assert.fileContent('gulp/build.js', markup);
        assert.fileContent('gulp/build.js', scripts);
        assert.fileContent('gulp/build.js', styles);
      });

      it('should have a components task', () => {
        assert.fileContent('gulp/build.js', 'gulp.task(\'components\', [\'bowerInject\'], function () {');
      });

      it('should use filters in components task', () => {
        let expectedMarkup, expectedScript, expectedStyle;

        expectedMarkup = [
          '      .pipe(markupFilter)',
          '      .pipe($.jade())',
          '      .pipe(markupFilter.restore)'
        ].join(EOL);

        expectedScript = [
          '      .pipe(scriptFilter)',
          '      .pipe($.babel())',
          '      .pipe($.rename(function (filePath) {',
          '        filePath.extname = \'.js\';',
          '      }))',
          '      .pipe(scriptFilter.restore)'
        ].join(EOL);

        expectedStyle = [
          '      .pipe(styleFilter)',
          '      .pipe($.stylus({',
          '        use: $.nib()',
          '      }))',
          '      .pipe(styleFilter.restore)'
        ].join(EOL);

        assert.fileContent('gulp/build.js', 'markupFilter = $.filter(\'**/*.jade\', {restore: true})');
        assert.fileContent('gulp/build.js', 'scriptFilter = $.filter(\'**/*.es6\', {restore: true})');
        assert.fileContent('gulp/build.js', 'styleFilter = $.filter(\'**/*.styl\', {restore: true})');

        assert.fileContent('gulp/build.js', expectedMarkup);
        assert.fileContent('gulp/build.js', expectedScript);
        assert.fileContent('gulp/build.js', expectedStyle);
      });

      it('should have componentsInject task', () => {
        assert.fileContent('gulp/build.js', 'gulp.task(\'componentsInject\', [\'components\'], function () {');
      });

      it('should have copmonentsInject as dependency task for copyTemplates task', () => {
        assert.fileContent('gulp/build.js', 'gulp.task(\'copyTemplates\', [\'componentsInject\'], function () {');
      });
    });

    describe('gulp/test.js', () => {
      it('should use compilers', () => {
        let buildTests, buildE2ETests;

        buildTests = [
          '    return gulp.src([config.unitTestFiles])',
          '      .pipe($.babel())',
          '      .pipe($.rename(function (filePath) {',
          '        filePath.extname = \'.js\';',
          '      }))',
          '      .pipe(gulp.dest(config.buildUnitTestsDir));'
        ].join(EOL);

        buildE2ETests = [
          '    return gulp.src([config.e2eFiles])',
          '      .pipe($.babel())',
          '      .pipe($.rename(function (filePath) {',
          '        filePath.extname = \'.js\';',
          '      }))',
          '      .pipe(gulp.dest(config.buildE2eTestsDir));'
        ].join(EOL);

        assert.fileContent('gulp/test.js', buildTests);
        assert.fileContent('gulp/test.js', buildE2ETests);
      });
    });

    describe('Gulpfile.js', () => {
      it('should include correct config', () => {
        ['config.appMarkupFiles = path.join(config.appDir, \'**/*.jade\');',
          'config.appScriptFiles = path.join(config.appDir, \'**/*.es6\');',
          'config.appStyleFiles = path.join(config.appDir, \'**/*.styl\');',
          'config.e2eFiles = path.join(\'e2e\', \'**/*.es6\');',
          'config.unitTestFiles = path.join(config.unitTestDir, \'**/*_test.es6\');'
        ].forEach((config) => {
          assert.fileContent('Gulpfile.js', config);
        });
      });

      it('should load nib', () => {
        assert.fileContent('Gulpfile.js', '\'nib\',');
      });

      it('should not include TypeScript project', () => {
        assert.noFileContent('Gulpfile.js', 'config.tsSourceProject = $.typescript.createProject({');
      });
    });

    describe('package.json', () => {
      it('should not include coffee-script dependencies', () => {
        coffeeDeps.forEach((dep) => {
          assert.noFileContent('package.json', dep);
        });

        it('should not include typescript dependencies', () => {
          typescriptDeps.forEach((dep) => {
            assert.noFileContent('package.json', dep);
          });
        });

        it('should not include ES2015 dependencies', () => {
          es2015Deps.forEach((dep) => {
            assert.noFileContent('package.json', dep);
          });
        });

        it('should include Jade dependencies', () => {
          jadeDeps.forEach((dep) => {
            assert.fileContent('package.json', dep);
          });
        });

        it('should not include HAML dependencies', () => {
          hamlDeps.forEach((dep) => {
            assert.noFileContent('package.json', dep);
          });
        });

        it('should not include Less dependencies', () => {
          lessDeps.forEach((dep) => {
            assert.noFileContent('package.json', dep);
          });
        });

        it('should not inclue SCSS dependencies', () => {
          scssDeps.forEach((dep) => {
            assert.noFileContent('package.json', dep);
          });
        });

        it('should include Stylus dependencies', () => {
          stylusDeps.forEach((dep) => {
            assert.fileContent('package.json', dep);
          });
        });
      });
    });
  });

  describe('with HTML markup, SCSS style, JS app, and JS test', () => {
    before(done => {
      helpers
        .run(join(__dirname, '../generators/app'))
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
          polymer: true,
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

    it('should create files', () => {
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

    describe('.eslintrc', () => {
      it('should extend dustinspecker', () => {
        assert.fileContent('.eslintrc', '"dustinspecker"');
      });
    });

    it('should not create controllers', () => {
      assert.noFile([
        'app/home-controller.js',
        'app/home-controller_test.js'
      ]);
    });

    describe('gulp/analyze.js', () => {
      it('should have JS linting', () => {
        assert.fileContent('gulp/analyze.js', '$.eslint()');
        assert.fileContent('gulp/analyze.js', '$.jshint()');
        assert.fileContent('gulp/analyze.js', '$.jscs()');
      });

      it('should not have filters', () => {
        assert.noFileContent('gulp/analyze.js', 'coffeeFilter = $.filter(\'**/*.coffee\', {restore: true})');
      });

      it('should not have CS linting', () => {
        assert.noFileContent('gulp/analyze.js', '$.coffeelint()');
      });
    });

    describe('gulp/build.js', () => {
      it('should use compilers', () => {
        let markup, scripts, styles;

        markup = [
          '    ])',
          '      .pipe(gulp.dest(config.buildDir));'
        ].join(EOL);

        scripts = [
          '      .pipe($.sourcemaps.init())',
          '      .pipe($.if(isProd, htmlFilter))'
        ].join(EOL);

        styles = [
          '      }}))',
          '      .pipe($.sass())',
          '      .pipe($.autoprefixer())'
        ].join(EOL);

        assert.fileContent('gulp/build.js', markup);
        assert.fileContent('gulp/build.js', scripts);
        assert.fileContent('gulp/build.js', styles);
      });

      it('should have a components task', () => {
        assert.fileContent('gulp/build.js', 'gulp.task(\'components\', [\'bowerInject\'], function () {');
      });

      it('should use filters in components task', () => {
        let expectedStyle;

        expectedStyle = [
          '      .pipe(styleFilter)',
          '      .pipe($.sass())',
          '      .pipe(styleFilter.restore)'
        ].join(EOL);

        assert.noFileContent('gulp/build.js', 'markupFilter');
        assert.noFileContent('gulp/build.js', 'scriptFilter');
        assert.fileContent('gulp/build.js', 'styleFilter = $.filter(\'**/*.scss\', {restore: true})');

        assert.fileContent('gulp/build.js', expectedStyle);
      });

      it('should have componentsInject task', () => {
        assert.fileContent('gulp/build.js', 'gulp.task(\'componentsInject\', [\'components\'], function () {');
      });

      it('should have copmonentsInject as dependency task for copyTemplates task', () => {
        assert.fileContent('gulp/build.js', 'gulp.task(\'copyTemplates\', [\'componentsInject\'], function () {');
      });
    });

    describe('gulp/test.js', () => {
      it('should not use compilers', () => {
        let buildTests, buildE2ETests;

        buildTests = [
          '    return gulp.src([config.unitTestFiles])',
          '      .pipe(gulp.dest(config.buildUnitTestsDir));'
        ].join(EOL);

        buildE2ETests = [
          '    return gulp.src([config.e2eFiles])',
          '      .pipe(gulp.dest(config.buildE2eTestsDir));'
        ].join(EOL);

        assert.fileContent('gulp/test.js', buildTests);
        assert.fileContent('gulp/test.js', buildE2ETests);
      });
    });

    describe('Gulpfile.js', () => {
      it('should include correct config', () => {
        ['config.appMarkupFiles = path.join(config.appDir, \'**/*.html\');',
          'config.appScriptFiles = path.join(config.appDir, \'**/*.js\');',
          'config.appStyleFiles = path.join(config.appDir, \'**/*.scss\');',
          'config.e2eFiles = path.join(\'e2e\', \'**/*.js\');',
          'config.unitTestFiles = path.join(config.unitTestDir, \'**/*_test.js\');'
        ].forEach((config) => {
          assert.fileContent('Gulpfile.js', config);
        });
      });

      it('should not load nib', () => {
        assert.noFileContent('Gulpfile.js', '\'nib\',');
      });

      it('should not include TypeScript project', () => {
        assert.noFileContent('Gulpfile.js', 'config.tsSourceProject = $.typescript.createProject({');
      });
    });

    describe('package.json', () => {
      it('should not include coffee-script dependencies', () => {
        coffeeDeps.forEach((dep) => {
          assert.noFileContent('package.json', dep);
        });
      });

      it('should not include typescript dependencies', () => {
        typescriptDeps.forEach((dep) => {
          assert.noFileContent('package.json', dep);
        });
      });

      it('should not include ES2015 dependencies', () => {
        es2015Deps.forEach((dep) => {
          assert.noFileContent('package.json', dep);
        });
      });

      it('should not include Jade dependencies', () => {
        jadeDeps.forEach((dep) => {
          assert.noFileContent('package.json', dep);
        });
      });

      it('should not include HAML dependencies', () => {
        hamlDeps.forEach((dep) => {
          assert.noFileContent('package.json', dep);
        });
      });

      it('should not include Less dependencies', () => {
        lessDeps.forEach((dep) => {
          assert.noFileContent('package.json', dep);
        });
      });

      it('should inclue SCSS dependencies', () => {
        scssDeps.forEach((dep) => {
          assert.fileContent('package.json', dep);
        });
      });

      it('should not include Stylus dependencies', () => {
        stylusDeps.forEach((dep) => {
          assert.noFileContent('package.json', dep);
        });
      });
    });
  });
});
