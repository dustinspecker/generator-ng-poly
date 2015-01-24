'use strict';

var gulp = require('gulp')
  , path = require('path')
  , $ = require('gulp-load-plugins')({
    pattern: [
      'del',
      'gulp-*',
      'karma',
      'run-sequence',
      'streamqueue',
      'wiredep'
    ]
  })
  , buildConfig = require('../build.config.js')
  , buildDirectiveTemplateFiles = path.join('tmp', buildConfig.buildDir, '**/*directive.tpl.html')
  , buildJsFiles = path.join('tmp', buildConfig.buildJs, '**/*.js')

  , unitTests = path.join(buildConfig.unitTestDir, '**/*_test.*')
  , compiledUnitTestsDir = path.join('tmp', buildConfig.unitTestDir)
  , compiledUnitTests = path.join(compiledUnitTestsDir, '**/*_test.js')
  , e2eFiles = 'e2e/**/*'
  , compiledE2eTestsDir = 'tmp/e2e/'
  , compiledE2eTests = compiledE2eTestsDir + '**/*_test.*'

  , karmaConf = require('../karma.config.js');

// karmaConf.files get populated in karmaFiles
karmaConf.files = [];

gulp.task('clean:test', function (cb) {
  return $.del('tmp', cb);
});

gulp.task('build:test', ['clean:test'], function (cb) {
  buildConfig.buildDir = path.join('tmp', buildConfig.buildDir);
  buildConfig.buildCss = path.join('tmp', buildConfig.buildCss);
  buildConfig.buildFonts = path.join('tmp', buildConfig.buildFonts);
  buildConfig.buildImages = path.join('tmp', buildConfig.buildImages);
  buildConfig.buildJs = path.join('tmp', buildConfig.buildJs);
  buildConfig.extCss = path.join('tmp', buildConfig.extCss);
  buildConfig.extFonts = path.join('tmp', buildConfig.extFonts);
  buildConfig.extJs = path.join('tmp', buildConfig.extJs);
  $.runSequence('build', cb);
});

var tsProject = $.typescript.createProject({
  declarationFiles: true,
  noExternalResolve: false
});

gulp.task('buildTests', ['lint', 'clean:test'], function () {
  var typescriptFilter = $.filter('**/*.ts')
    , coffeeFilter = $.filter('**/*.coffee')
    , jsFilter = $.filter('**/*.js');

  return gulp.src([unitTests])
    .pipe(typescriptFilter)
    .pipe($.typescript(tsProject))
    .pipe(typescriptFilter.restore())
    .pipe(coffeeFilter)
    .pipe($.coffee())
    .pipe(coffeeFilter.restore())
    .pipe(jsFilter)
    .pipe(gulp.dest(compiledUnitTestsDir))
    .pipe(jsFilter.restore());
});

// inject scripts in karma.config.js
gulp.task('karmaFiles', ['build:test', 'buildTests'], function () {
  var stream = $.streamqueue({objectMode: true});

  // add bower javascript
  stream.queue(gulp.src($.wiredep({
    devDependencies: true<% if (polymer) { %>,
    exclude: [/polymer/, /webcomponents/]<% } %>
  }).js));

  // add application templates
  stream.queue(gulp.src([buildDirectiveTemplateFiles]));

  // add application javascript
  stream.queue(gulp.src([
    buildJsFiles<% if (polymer) { %>,
    '!**/webcomponents.js'<% } %>,
    '!**/*_test.*'
  ])
    .pipe($.angularFilesort()));

  // add unit tests
  stream.queue(gulp.src([compiledUnitTests]));

  return stream.done()
    .on('data', function (file) {
      karmaConf.files.push(file.path);
    });
});

// run unit tests
gulp.task('unitTest', ['lint', 'karmaFiles'], function (done) {
  $.karma.server.start(karmaConf, done);
});

gulp.task('build:e2eTest', function () {
  var typescriptFilter = $.filter('**/*.ts')
    , coffeeFilter = $.filter('**/*.coffee')
    , jsFilter = $.filter('**/*.js');

  return gulp.src([e2eFiles])
    .pipe(typescriptFilter)
    .pipe($.typescript(tsProject))
    .pipe(typescriptFilter.restore())
    .pipe(coffeeFilter)
    .pipe($.coffee())
    .pipe(coffeeFilter.restore())
    .pipe(jsFilter)
    .pipe(gulp.dest(compiledE2eTestsDir))
    .pipe(jsFilter.restore());
});

// run e2e tests - SERVER MUST BE RUNNING FIRST
gulp.task('e2eTest', ['lint', 'build', 'build:e2eTest'], function () {
  return gulp.src(compiledE2eTests)
    .pipe($.protractor.protractor({
      configFile: 'protractor.config.js'
    }))
    .on('error', function (e) {
      console.log(e);
    });
});

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
/* jshint -W106 */
gulp.task('webdriverUpdate', $.protractor.webdriver_update);
/* jshint +W106 */
// jscs:enable requireCamelCaseOrUpperCaseIdentifiers
