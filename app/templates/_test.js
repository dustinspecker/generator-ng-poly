'use strict';

var gulp = require('gulp')
  , $ = require('gulp-load-plugins')({
    pattern: [
      'gulp-*',
      'karma',
      'lodash',
      'streamqueue',
      'wiredep'
    ]
  })

  , appDirectiveTemplateFiles = 'app/**/*directive.tpl.{haml,html,jade}'
  , appScriptFiles = 'app/**/*.{coffee,js}'

  , unitTests = '{app,test}/**/*_test.*'

  , e2eTestFiles = 'e2e/**/*_test.*';

// inject scripts in karma.config.js
gulp.task('karmaInject', function () {
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

  return gulp.src('karma.config.js')
    .pipe($.inject(stream.done(), {
      starttag: 'files: [',
      endtag: ']',
      addRootSlash: false,
      transform: function (filepath, file, i, length) {
        return '\'' + filepath + '\'' + (i + 1 < length ? ',' : '');
      }
    }))
    .pipe(gulp.dest('./'));
});

// run unit tests
gulp.task('unitTest', ['lint', 'karmaInject'], function (done) {
  var karmaConf = require('../karma.config.js');
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
