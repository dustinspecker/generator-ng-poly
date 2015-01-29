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
      'wiredep',
      'yargs'
    ]
  })
  , buildConfig = require('../build.config.js')
  , buildDirectiveTemplateFiles = path.join(buildConfig.buildTestDir, '**/*directive.tpl.html')
  , buildJsFiles = path.join(buildConfig.buildJs, '**/*.js')

  , unitTests = path.join(buildConfig.unitTestDir, '**/*_test.*')
  , compiledUnitTestsDir = path.join(buildConfig.buildTestDir, buildConfig.unitTestDir)
  , compiledUnitTests = path.join(compiledUnitTestsDir, '**/*_test.js')
  , e2eFiles = 'e2e/**/*'
  , compiledE2eTestsDir = path.join(buildConfig.buildTestDir, 'e2e/')
  , compiledE2eTests = path.join(compiledE2eTestsDir, '**/*_test.*')

  , karmaConf = require('../karma.config.js')

  , tsProject = $.typescript.createProject({
    declarationFiles: true,
    noExternalResolve: false
  });

// karmaConf.files get populated in karmaFiles
karmaConf.files = [];

gulp.task('clean:test', function (cb) {
  return $.del(buildConfig.buildTestDir, cb);
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
gulp.task('karmaFiles', ['build', 'buildTests'], function () {
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
