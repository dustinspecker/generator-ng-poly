'use strict';

var gulp = require('gulp')
  , path = require('path')
  , $ = require('gulp-load-plugins')({
    pattern: [
      'gulp-*',
      'karma',
      'lodash',
      'streamqueue',
      'wiredep'
    ]
  })

  , appBase = require('../build.config.js').appDir
  , appDirectiveTemplateFiles = path.join(appBase, '**/*directive.tpl.{haml,html,jade}')
  , appScriptFiles = path.join(appBase, '**/*.{coffee,js}')

  , unitTests = path.join(require('../build.config.js').unitTestDir, '**/*_test.*')
  , e2eTestFiles = 'e2e/**/*_test.*'

  , karmaConf = $.lodash.assign({}, require('../karma.config.js'));

// karmaConf.files get populated in karmaFiles
karmaConf.files = [];

// inject scripts in karma.config.js
gulp.task('karmaFiles', function () {
  var stream = $.streamqueue({objectMode: true});

  // add bower javascript
  stream.queue(gulp.src($.wiredep({
    devDependencies: true<% if (polymer) { %>,
    exclude: [/polymer/, /platform/]<% } %>
  }).js));

  // add application templates
  stream.queue(gulp.src([appDirectiveTemplateFiles]));

  // add application javascript
  stream.queue(gulp.src([
    appScriptFiles,
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
  $.karma.server.start($.lodash.assign({}, karmaConf), done);
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
