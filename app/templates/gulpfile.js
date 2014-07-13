'use strict';

var gulp = require('gulp')
  , connect = require('gulp-connect')
  , inject = require('gulp-inject')
  , jade = require('gulp-jade')
  , jshint = require('gulp-jshint')
  , less = require('gulp-less')
  , open = require('gulp-open')
  , plato = require('gulp-plato');

var _ = require('lodash')
  , karma = require('karma').server
  , path = require('path')
  , rimraf = require('rimraf');

var karmaConf = {
  browsers: ['PhantomJS'],
  frameworks: ['jasmine'],
  files: [
    'bower_components/angular/angular.js',
    'bower_components/angular-ui-router/release/angular-ui-router.js',
    'bower_components/angular-mocks/angular-mocks.js',
    'src/js/**/*.js',
    'tests/unit/**/*.spec.js',
    'src/jade/templates/*.jade'
  ],
  reporters: ['progress', 'coverage'],
  preprocessors: {
    'src/js/**/*.js': ['coverage'],
    'src/jade/templates/*.jade': ['ng-jade2js']
  },
  ngJade2JsPreprocessor: {
    stripPrefix: 'src/jade/'
  },
  singleRun: true
};

gulp.task('clean', function (cb) {
  return rimraf('build', cb);
});

gulp.task('connect', function () {
  connect.server({
    root: 'build',
    port: 8080,
    livereload: true
  });
});

gulp.task('jade', ['clean'], function () {
  return gulp.src('src/jade/**/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('build/'));
});

gulp.task('inject', ['jade', 'js', 'less'], function () {
  return gulp.src('build/index.html')
    .pipe(inject(gulp.src([
      'build/css/*.css',
      'build/js/angular.js',
      'build/js/angular-ui-router.js',    
      'build/js/**/*.js'
      ], { read: false }), {
        addRootSlash: false,
        ignorePath: 'build/'
    }))
    .pipe(gulp.dest('build/'))
    .pipe(connect.reload());
});

gulp.task('js', ['clean', 'jshint'], function () {
  return gulp.src([
      'src/js/**/*.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js'
    ])
    .pipe(gulp.dest('build/js'));
});

gulp.task('jshint', function () {
  return gulp.src([
    'src/js/**/*.js',
    'tests/unit/**/*.spec.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
    .pipe(plato('report'));
});

gulp.task('less', ['clean'], function () {
  return gulp.src('src/less/style.less')
    .pipe(less({
      paths: [path.join(__dirname, 'src/less', 'src/less/includes')]
    }))
    .pipe(gulp.dest('build/css'));
});

gulp.task('open', function () {
  // A file must be specified as the src when running options.url or gulp will overlook the task.
  return gulp.src('Gulpfile.js')
    .pipe(open('', {url: 'http://localhost:8080'}));
});

gulp.task('build', ['inject']);

gulp.task('default', ['build'], function () {
  gulp.start('connect');
  gulp.start('open');
  gulp.start('watch');
});

gulp.task('test', ['jshint'], function (done) {
  karma.start(_.assign({}, karmaConf), done);
});

gulp.task('watch', function () {
  gulp.watch(['tests/unit/**/*.spec.js'], ['test']);
  gulp.watch(['src/jade/**/*.jade', 'src/js/**/*.js'], ['build']);
});