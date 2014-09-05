'use strict';

var gulp = require('gulp');

require('require-dir')('./gulp');

gulp.task('dev', ['build', 'browserSync'], function () {
  gulp.start('watch');
});

gulp.task('default', ['dev']);