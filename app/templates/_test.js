'use strict';

var gulp = require('gulp')
  , path = require('path')
  , $ = require('gulp-load-plugins')({
    pattern: [
      'gulp-*',
      'karma',
      'streamqueue',
      'wiredep'
    ]
  })
  , buildConfig = require('../build.config.js')
  , appBase = buildConfig.appDir
  , buildDir = buildConfig.buildDir
  , appDirectiveTemplateFiles = path.join(appBase, '**/*directive.tpl.{haml,html,jade}')
  , buildJsFiles = path.join(buildConfig.buildJs, '**/*.js')

  , unitTests = path.join(buildConfig.unitTestDir, '**/*_test.*')
  , e2eTestFiles = 'e2e/**/*_test.*'

  , karmaConf = require('../karma.config.js');

// karmaConf.files get populated in karmaFiles
karmaConf.files = [];

// inject scripts in karma.config.js
gulp.task('karmaFiles', function () {
  var stream = $.streamqueue({objectMode: true});

  // add bower javascript
  stream.queue(gulp.src($.wiredep({
    devDependencies: true<% if (polymer) { %>,
    exclude: [/polymer/, /webcomponents/]<% } %>
  }).js));

  // add application templates
  stream.queue(gulp.src([appDirectiveTemplateFiles]));

  // add application javascript
  stream.queue(gulp.src([
    buildJsFiles,
    '!**/*_test.*'
  ])
    .pipe($.angularFilesort()));

  // add unit tests
  stream.queue(gulp.src(unitTests));

  return stream.done()
    .on('data', function (file) {
      karmaConf.files.push(file.path);
    });
});

// run unit tests
gulp.task('unitTest', ['lint', 'karmaFiles'], function (done) {
  $.karma.server.start(karmaConf, done);
});

// run e2e tests - SERVER MUST BE RUNNING FIRST
gulp.task('e2eTest', ['lint'], function () {
  return gulp.src(e2eTestFiles)
    .pipe($.protractor.protractor({
      configFile: 'protractor.config.js'
    }))
    .on('error', function (e) {
      console.log(e);
    });
});

// run unit and e2e tests
gulp.task('test', ['build', 'unitTest'], function () {
  gulp.start('e2eTest');
});

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
/* jshint -W106 */
gulp.task('webdriverUpdate', $.protractor.webdriver_update);
/* jshint +W106 */
// jscs:enable requireCamelCaseOrUpperCaseIdentifiers
