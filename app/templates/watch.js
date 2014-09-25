'use strict';

var gulp = require('gulp')
  , path = require('path')
  , $ = require('gulp-load-plugins')({
    pattern: [
      'gulp-*',
      'browser-sync'
    ]
  })

  , buildConfig = require('../build.config.js')

  , appFiles = path.join(buildConfig.appDir, '**/*')
  , unitTestFiles = path.join(buildConfig.unitTestDir, '**/*_test.*');

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
  gulp.watch([appFiles, '!' + unitTestFiles], ['build', $.browserSync.reload]);
});
