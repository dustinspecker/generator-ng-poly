'use strict';

var gulp = require('gulp')
  , multiGlob = require('multi-glob')
  , path = require('path')
  , plato = require('plato')
  , $ = require('gulp-load-plugins')()

  , appBase = require('../build.config.js').appDir
  , appScriptFiles = path.join(appBase, '**/*.{coffee,js}')

  , e2eFiles = 'e2e/**/*.{coffee,js}'
  , unitTests = path.join(require('../build.config.js').unitTestDir, '**/*_test.{coffee,js}');

// lint CoffeeScript and jshint and jscs JavaScript
gulp.task('lint', function () {
  var coffeeFilter = $.filter('**/*.coffee')
    , jsFilter = $.filter('**/*.js')
    , onError = function (err) {
      $.notify.onError({
        title: 'Error linting at ' + err.plugin,
        subtitle: ' ', //overrides defaults
        message: err.message.replace(/\u001b\[.*?m/g, ''),
        sound: ' ' //overrides defaults
      })(err);

      this.emit('end');
    };

  return gulp.src([
    appScriptFiles,
    e2eFiles,
    unitTests
  ])
    .pipe($.plumber({errorHandler: onError}))
    .pipe(coffeeFilter)
    .pipe($.coffeelint())
    .pipe($.coffeelint.reporter())
    .pipe($.coffeelint.reporter('fail'))
    .pipe(coffeeFilter.restore())
    .pipe(jsFilter)
    .pipe($.eslint())
    .pipe($.eslint.formatEach('./node_modules/eslint-path-formatter'))
    .pipe($.eslint.failOnError())
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'))
    .pipe($.jscs());
});

// run plato anaylysis on JavaScript (ES5) files
gulp.task('staticAnalysis', function (done) {
  multiGlob.glob([appScriptFiles, e2eFiles, unitTests], function (err, matches) {
    if (err) {
      throw new Error('Couldn\'t find files.');
    }

    matches = matches.filter(function (file) {
      return file.match(/.*[.]js/);
    });

    if (matches.length > 0) {
      plato.inspect(matches, './report', {}, function () {
        done();
      });
    }
  });
});

gulp.task('analyze', ['lint', 'staticAnalysis']);
