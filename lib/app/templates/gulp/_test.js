'use strict';

var karmaConf = require('../karma.config.js');

// karmaConf.files get populated in karmaFiles
karmaConf.files = [
  'node_modules/karma-babel-preprocessor/node_modules/babel-core/browser-polyfill.js'
];

module.exports = function (gulp, $, config) {
  gulp.task('clean:test', function (cb) {
    return $.del(config.buildTestDir, cb);
  });

  gulp.task('buildTests', ['lint', 'clean:test'], function () {
    return gulp.src([config.unitTestFiles])<% if (testScript === 'es6') { %>
      .pipe($.babel())
      .pipe($.rename(function (filePath) {
        filePath.extname = '.js';
      }))<% } else if (testScript === 'ts') { %>
      .pipe($.typescript(config.tsTestProject))<% } else if (testScript === 'coffee') { %>
      .pipe($.coffee())<% } %>
      .pipe(gulp.dest(config.buildUnitTestsDir));
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
    stream.queue(gulp.src([config.buildTestDirectiveTemplateFiles]));

    // add application javascript
    stream.queue(gulp.src([
      config.buildJsFiles<% if (polymer) { %>,
      '!**/webcomponents.js'<% } %>,
      '!**/*_test.*'
    ])
      .pipe($.angularFilesort()));

    // add unit tests
    stream.queue(gulp.src([config.buildUnitTestFiles]));

    return stream.done()
      .on('data', function (file) {
        karmaConf.files.push(file.path);
      });
  });

  // run unit tests
  gulp.task('unitTest', ['lint', 'karmaFiles'], function (done) {
    var server = new $.karma.Server(karmaConf, done);
    server.start();
  });

  gulp.task('build:e2eTest', function () {
    return gulp.src([config.e2eFiles])<% if (testScript === 'es6') { %>
      .pipe($.babel())
      .pipe($.rename(function (filePath) {
        filePath.extname = '.js';
      }))<% } else if (testScript === 'coffee') { %>
      .pipe($.coffee())<% } %>
      .pipe(gulp.dest(config.buildE2eTestsDir));
  });

  // run e2e tests - SERVER MUST BE RUNNING FIRST
  gulp.task('e2eTest', ['lint', 'build:e2eTest'], function () {
    return gulp.src(config.buildE2eTests)
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
};
