'use strict';

var karmaConf = require('../karma.config.js');

// karmaConf.files get populated in karmaFiles
karmaConf.files = [];

module.exports = function (gulp, $, config) {
  gulp.task('clean:test', function (cb) {
    return $.del(config.buildTestDir, cb);
  });

  gulp.task('buildTests', ['lint', 'clean:test'], function () {
    var typescriptFilter = $.filter('**/*.ts')
      , coffeeFilter = $.filter('**/*.coffee')
      , es6Filter = $.filter('**/*.es6')
      , jsFilter = $.filter('**/*.js');

    return gulp.src([config.unitTestFiles])
      .pipe(es6Filter)
      .pipe($.babel())
      .pipe($.rename(function (filePath) {
        filePath.extname = '.js';
      }))
      .pipe(es6Filter.restore())
      .pipe(typescriptFilter)
      .pipe($.typescript(config.tsProject))
      .pipe(typescriptFilter.restore())
      .pipe(coffeeFilter)
      .pipe($.coffee())
      .pipe(coffeeFilter.restore())
      .pipe(jsFilter)
      .pipe(gulp.dest(config.buildUnitTestsDir))
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
    $.karma.server.start(karmaConf, function () {
      done();
    });
  });

  gulp.task('build:e2eTest', function () {
    var typescriptFilter = $.filter('**/*.ts')
      , coffeeFilter = $.filter('**/*.coffee')
      , es6Filter = $.filter('**/*.es6')
      , jsFilter = $.filter('**/*.js');

    return gulp.src([config.e2eFiles])
      .pipe(es6Filter)
      .pipe($.babel())
      .pipe($.rename(function (filePath) {
        filePath.extname = '.js';
      }))
      .pipe(es6Filter.restore())
      .pipe(typescriptFilter)
      .pipe($.typescript(config.tsProject))
      .pipe(typescriptFilter.restore())
      .pipe(coffeeFilter)
      .pipe($.coffee())
      .pipe(coffeeFilter.restore())
      .pipe(jsFilter)
      .pipe(gulp.dest(config.buildE2eTestsDir))
      .pipe(jsFilter.restore());
  });

  // run e2e tests - SERVER MUST BE RUNNING FIRST
  gulp.task('e2eTest', ['lint', 'build', 'build:e2eTest'], function () {
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
