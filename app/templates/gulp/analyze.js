'use strict';

module.exports = function (gulp, $, config) {
  // lint CoffeeScript and jshint and jscs JavaScript
  gulp.task('lint', function () {
    var coffeeFilter = $.filter('**/*.coffee')
      , jsFilter = $.filter('**/*.js');

    return gulp.src([
      config.appScriptFiles,
      config.e2eFiles,
      config.unitTestFiles
    ])
      .pipe($.plumber({errorHandler: function (err) {
        $.notify.onError({
          title: 'Error linting at ' + err.plugin,
          subtitle: ' ', //overrides defaults
          message: err.message.replace(/\u001b\[.*?m/g, ''),
          sound: ' ' //overrides defaults
        })(err);

        this.emit('end');
      }}))
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
    $.multiGlob.glob([config.appScriptFiles, config.e2eFiles, config.unitTestFiles], function (err, matches) {
      if (err) {
        throw new Error('Couldn\'t find files.');
      }

      // only inspect JS (ES5) files
      matches = matches.filter(function (file) {
        return file.match(/.*[.]js/);
      });

      if (matches.length > 0) {
        $.plato.inspect(matches, './report', {}, function () {
          done();
        });
      } else {
        done();
      }
    });
  });

  gulp.task('analyze', ['lint', 'staticAnalysis']);
};
