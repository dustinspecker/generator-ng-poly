'use strict';

var gulp = require('gulp')
  , $ = require('gulp-load-plugins')({
    pattern: [
      'gulp-*',
      'browser-sync'
    ]
  })

  , appBase = 'app/'
  , unitTestFiles = '{app,test}/**/*_test.*'

  , buildConfig = require('../build.config.js');

gulp.task('browserSync', function () {
  $.browserSync({
    host: buildConfig.host,
    open: 'external',
    port: buildConfig.port,
    server: {
      baseDir: buildConfig.buildDir
    }
  });
});

gulp.task('watch', function () {
  $.browserSync.reload();
  gulp.watch([unitTestFiles], ['unitTest']);
  gulp.watch([appBase + '**/*'], ['build', $.browserSync.reload]);
});
