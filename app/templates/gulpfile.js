'use strict';

// gulp plugins
var gulp = require('gulp')
  , addSrc = require('gulp-add-src')
  , angularSort = require('gulp-angular-filesort')
  , coffeelint = require('gulp-coffeelint')
  , concat = require('gulp-concat')
  , connect = require('gulp-connect')
  , cssmin = require('gulp-cssmin')
  , gulpIf = require('gulp-if')
  , htmlmin = require('gulp-htmlmin')
  , inject = require('gulp-inject')
  , jade = require('gulp-jade')
  , jshint = require('gulp-jshint')
  , less = require('gulp-less')
  , ngAnnotate = require('gulp-ng-annotate')
  , open = require('gulp-open')
  , plato = require('gulp-plato')
  , protractor = require('gulp-protractor').protractor
  , uglify = require('gulp-uglify')
  /* jshint -W106 */
  , webdriverUpdate = require('gulp-protractor').webdriver_update;
  /* jshint +W106 */

// other node modules
var _ = require('lodash')
  , args = require('yargs').argv
  , karma = require('karma').server
  , rimraf = require('rimraf')
  , streamqueue = require('streamqueue');

// app src locations
var appBase = 'app/'
  , appMarkupFiles = appBase + '**/*.{html,jade}'
  , appScriptFiles = appBase + '**/*.js'
  , appStyleFiles = appBase + '**/*.less';

// custom component locations
var componentsBase = appBase + 'components/'
  , componentsMarkupFiles = componentsBase + '**/*.{html,jade}'
  , componentsScriptFiles = componentsBase + '**/*.js'
  , componentsStyleFiles = componentsBase + '**/*.less';

// e2e test locations
var e2ePoFiles = 'e2e/**/*.po.{coffee,js}'
  , e2eTestsFiles = 'e2e/**/*_test.{coffee,js}'
  , protractorConfig = 'protractor.config.js';

// unit test locations
var unitTestsFiles = '{app,test}/**/*_test.{coffee,js}'
  , karmaConfig = 'karma.config.js';

// build locations
var build = 'build/'
  , buildComponents = build + 'components/'
  , buildCss = build
  , buildJs = build;

// passed arguments
var isProd = args.stage === 'prod';

// bower assets to be injected into index.html
// 'bower_components' is automatically prepended
var injectableBowerComponents = [
  'angular/angular.js',
  'angular-ui-router/release/angular-ui-router.js',
  'platform/platform.js'
];

// minified bower assets to be injected into index.html
// 'bower_components' is automatically prepended
var minInjectableBowerComponents = [
  'angular/angular.min.js',
  'angular-ui-router/release/angular-ui-router.min.js',
  'platform/platform.js'
];

// bower polymer components that do not need to be injected into index.html
// 'bower_components' is automatically prepended
var bowerPolymerComponents = [
  'polymer/polymer.{js,html}',
  'polymer/layout.html'
];

var bowerDir = 'bower_components/';
function prependBowerDir(file) {
  return bowerDir + file;
}

gulp.task('connect', function () {
  connect.server({
    root: build,
    port: 8080,
    livereload: true
  });
});

gulp.task('open', function () {
  // A file must be specified as the src when running options.url or gulp will overlook the task.
  return gulp.src('Gulpfile.js')
    .pipe(open('', {url: 'http://localhost:8080'}));
});

gulp.task('watch', function () {
  gulp.watch([unitTestsFiles], ['unitTest']);
  gulp.watch([appMarkupFiles, appScriptFiles, appStyleFiles, componentsBase + '**/*'], ['build']);
});

gulp.task('clean', function (cb) {
  return rimraf(build, cb);
});

gulp.task('coffeelint', function () {
  return gulp.src([
    unitTestsFiles,
    e2eTestsFiles,
    e2ePoFiles,
    '!**/*.js'
    ])
    .pipe(coffeelint({
      opt: {
        'no_backticks': {
          level: 'ignore'
        }
      }
    }))
    .pipe(coffeelint.reporter())
    .pipe(coffeelint.reporter('fail'))
  ;
});

gulp.task('jshint', function () {
  return gulp.src([
    appScriptFiles,
    componentsScriptFiles,
    e2ePoFiles,
    e2eTestsFiles,
    karmaConfig,
    protractorConfig,
    unitTestsFiles,
    'Gulpfile.js',
    '!**/*.coffee'
  ])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
    .pipe(plato('report'))
  ;
});

gulp.task('components', ['clean', 'jshint'], function () {
  var stream = streamqueue({ objectMode: true });

  // jade
  stream.queue(gulp.src([
    componentsMarkupFiles,
    '!**/*.html'
  ], { base: componentsBase })
    .pipe(jade()))
  ;

  // html
  stream.queue(gulp.src([
    componentsMarkupFiles,
    '!**/*.jade'
  ], { base: componentsBase }));

  // js
  stream.queue(gulp.src(
    componentsScriptFiles
  , { base: componentsBase }))
  ;

  // less
  stream.queue(gulp.src(
    componentsStyleFiles
  , { base: componentsBase })
    .pipe(less()))
  ;

  return stream.done()
    .pipe(gulp.dest(buildComponents))
  ;
});

gulp.task('scripts', ['clean', 'jshint'], function () {
  if (isProd) {
    return gulp.src([
      appScriptFiles,
      '!' + componentsBase + '**/*',
      '!' + unitTestsFiles
    ])
      .pipe(angularSort())
      .pipe(ngAnnotate())
      .pipe(concat('app.js'))
      .pipe(uglify())
      .pipe(addSrc([].concat(minInjectableBowerComponents.map(prependBowerDir))))
      .pipe(gulp.dest(buildJs));
  } else {
    return gulp.src([
      appScriptFiles,
      '!' + componentsBase + '**/*',
      '!' + unitTestsFiles
    ])
      .pipe(addSrc([].concat(injectableBowerComponents.map(prependBowerDir))))
      .pipe(gulp.dest(buildJs))
    ;
  }

});

gulp.task('style', ['clean'], function () {
  return gulp.src([
    appStyleFiles,
    '!' + componentsBase + '**/*'
  ])
    .pipe(less())
    .pipe(gulpIf(isProd, concat('style.css')))
    .pipe(gulpIf(isProd, cssmin()))
    .pipe(gulp.dest(build))
  ;
});

gulp.task('markup', ['clean'], function () {
  return gulp.src([
    appMarkupFiles,
    '!' + componentsBase + '**/*',
    '!**/*.html'
  ])
    .pipe(jade())
    .pipe(addSrc([
      appMarkupFiles,
      '!' + componentsBase + '**/*',
      '!**/*.jade'
    ]))
    .pipe(gulp.dest(build))
  ;
});

gulp.task('inject', ['components', 'markup', 'scripts', 'style'], function () {
  return gulp.src(build + 'index.html')
    .pipe(inject(gulp.src([
      buildComponents + '**/*.html',
      buildCss + '**/*.css',
      buildJs + 'angular.js',
      buildJs + 'angular.min.js'
    ], { read: false }), {
        addRootSlash: false,
        ignorePath: build
    }))
    .pipe(gulp.dest(build))
  ;
});

gulp.task('headInject', ['inject'], function () {
  return gulp.src(build + 'index.html')
    .pipe(inject(gulp.src(buildJs + 'platform.js'), {
      starttag: '<!-- inject:head:{{ext}} -->',
      addRootSlash: false,
      ignorePath: build
    }))
    .pipe(gulp.dest(build))
  ;
});

gulp.task('angularInject', ['headInject'], function () {
  return gulp.src(build + 'index.html')
    .pipe(inject(gulp.src([
      buildJs + '**/*.js',
      '!' + buildComponents + '**/*',
      '!' + buildJs + 'angular.js',
      '!' + buildJs + 'angular.min.js',
      '!' + buildJs + 'platform.js',
      '!**/*_test.*'
    ]).pipe(angularSort()), { starttag: '<!-- inject:angular:{{ext}} -->', addRootSlash: false, ignorePath: build }))
    .pipe(gulpIf(isProd, htmlmin({
      collapseWhitespace: true,
      removeComments: true
    })))
    .pipe(gulp.dest(build))
    .pipe(connect.reload())
  ;
});

gulp.task('polymer', ['inject'], function () {
  return gulp.src(bowerPolymerComponents.map(prependBowerDir), {
      base: bowerDir
    })
    .pipe(gulp.dest(buildComponents))
  ;
});

gulp.task('karmaInject', function () {
  var stream = streamqueue({ objectMode: true});
  stream.queue(gulp.src([
    bowerDir + 'angular/angular.js',
    bowerDir + 'angular-mocks/angular-mocks.js',
    appBase + '**/*-directive.tpl.{html,jade}'
  ]));

  stream.queue(gulp.src([
    appBase + '**/*.js',
    '!' + componentsBase + '**/*',
    '!**/*_test.*',
    bowerDir + 'angular-ui-router/release/angular-ui-router.js',
  ]).pipe(angularSort()));

  stream.queue(gulp.src([
    unitTestsFiles
  ]));

  return gulp.src(karmaConfig)
    .pipe(inject(stream.done(), {
      starttag: 'files: [',
      endtag: ']',
      addRootSlash: false, 
      transform: function (filepath, file, i, length) {
        return '  \'' + filepath + '\'' + (i + 1 < length ? ',' : '');
    }}))
    .pipe(gulp.dest('./'))
  ;
});

gulp.task('unitTest', ['jshint', 'coffeelint', 'karmaInject'], function (done) {
  var karmaConf = require('./' + karmaConfig);
  karma.start(_.assign({}, karmaConf), done);
});

gulp.task('e2eTest', ['jshint', 'coffeelint'], function () {
  return gulp.src(e2eTestsFiles)
    .pipe(protractor({
      configFile: protractorConfig
    }))
    .on('error', function (e) {
      console.log(e);
    });
});

gulp.task('webdriverUpdate', webdriverUpdate);

gulp.task('build', ['angularInject', 'polymer'], function () {
  gulp.start('connect');
  gulp.start('open');
  gulp.start('watch');
});

gulp.task('default', ['build']);