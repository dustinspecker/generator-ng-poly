'use strict';

var gulp = require('gulp')
  , $ = require('gulp-load-plugins')()

  , appBase = 'app/'
  , appScriptFiles = appBase + '**/*.{coffee,js}'

  , e2eFiles = 'e2e/**/*.{coffee,js}'
  , unitTests = '{app,test}/**/*.{coffee,js}';

// lint CoffeeScript and jshint and jscs JavaScript
gulp.task('lint', function () {
  var coffeeFilter = $.filter('**/*.coffee')
    , jsFilter = $.filter('**/*.js');

  return gulp.src([
    appScriptFiles,
    e2eFiles,
    unitTests
  ])
    .pipe(coffeeFilter)
    .pipe($.coffeelint())
    .pipe($.coffeelint.reporter())
    .pipe($.coffeelint.reporter('fail'))
    .pipe(coffeeFilter.restore())
    .pipe(jsFilter)
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'))
    .pipe($.jscs());
});

// run plato anaylysis on JavaScript files
gulp.task('staticAnalysis', function () {
  var jsFilter = $.filter('**/*.js');

  return gulp.src([
    appScriptFiles,
    e2eFiles,
    unitTests
  ])
    .pipe(jsFilter)
    .pipe($.plato('report'));
});

gulp.task('analyze', ['lint', 'staticAnalysis']);
