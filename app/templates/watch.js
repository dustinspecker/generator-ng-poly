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

  , build = 'build/';

gulp.task('browserSync', function () {
  $.browserSync({
    server: {
      baseDir: build
    }
  });
});

gulp.task('watch', function () {
  $.browserSync.reload();
  gulp.watch([unitTestFiles], ['unitTest']);
  gulp.watch([appBase + '**/*'], ['build', $.browserSync.reload]);
});
