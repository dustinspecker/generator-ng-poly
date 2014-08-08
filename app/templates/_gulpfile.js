'use strict';

// gulp plugins
var gulp = require('gulp')
  , addSrc = require('gulp-add-src')
  , angularSort = require('gulp-angular-filesort')
  , coffeelint = require('gulp-coffeelint')
  , concat = require('gulp-concat')
  , cssmin = require('gulp-cssmin')
  , gulpIf = require('gulp-if')
  , htmlmin = require('gulp-htmlmin')
  , inject = require('gulp-inject')
  , jade = require('gulp-jade')
  , jshint = require('gulp-jshint')
  , less = require('gulp-less')
  , ngAnnotate = require('gulp-ng-annotate')
  , plato = require('gulp-plato')
  , prefix = require('gulp-autoprefixer')
  , protractor = require('gulp-protractor').protractor
  , sass = require('gulp-sass')
  , stylus = require('gulp-stylus')
  , uglify = require('gulp-uglify')
  /* jshint -W106 */
  , webdriverUpdate = require('gulp-protractor').webdriver_update;
  /* jshint +W106 */

// other node modules
var _ = require('lodash')
  , args = require('yargs').argv
  , browserSync = require('browser-sync')
  , karma = require('karma').server
  , rimraf = require('rimraf')
  , streamqueue = require('streamqueue');

// app src locations
var appBase = 'app/'
  , appMarkupFiles = appBase + '**/*.{html,jade}'
  , appScriptFiles = appBase + '**/*.js'
  , appStyleFiles = appBase + '**/*.{less,scss,styl}';

// custom component locations
var componentsBase = appBase + 'components/'
  , componentsMarkupFiles = componentsBase + '**/*.{html,jade}'
  , componentsScriptFiles = componentsBase + '**/*.js'
  , componentsStyleFiles = componentsBase + '**/*.{less,scss,styl}';

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
  'angular-animate/angular-animate.js',
  'angular-cookies/angular-cookies.js',
  'angular-resource/angular-resource.js',
  'angular-sanitize/angular-sanitize.js',
  'angular-touch/angular-touch.js',
  'angular-ui-router/release/angular-ui-router.js',
  'platform/platform.js'
];

// minified bower assets to be injected into index.html
// 'bower_components' is automatically prepended
var minInjectableBowerComponents = [
  'angular/angular.min.js',
  'angular-animate/angular-animate.min.js',
  'angular-cookies/angular-cookies.min.js',
  'angular-resource/angular-resource.min.js',
  'angular-sanitize/angular-sanitize.min.js',
  'angular-touch/angular-touch.min.js',
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

gulp.task('watch', function () {
  gulp.watch([unitTestsFiles], ['unitTest']);
  gulp.watch([appMarkupFiles, appScriptFiles, appStyleFiles, componentsBase + '**/*'], ['angularInject', 'polymer', browserSync.reload]);
});

gulp.task('browser-sync', function () {
  browserSync({
    server: {
      baseDir: build
    }
  });
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
  stream.queue(gulp.src([
    componentsStyleFiles,
    '!**/*.{scss,styl}'
  ], { base: componentsBase })
    .pipe(less())
    .pipe(prefix()))
  ;

  // sass
  stream.queue(gulp.src([
    componentsStyleFiles,
    '!**/*.{less,styl}',
  ], { base: componentsBase })
    .pipe(sass())
    .pipe(prefix()))
  ;

  // stylus
  stream.queue(gulp.src([
    componentsStyleFiles,
    '!**/*.{less,scss}'
  ], { base: componentsBase })
    .pipe(stylus())
    .pipe(prefix()))
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
  var stream = streamqueue({ objectMode: true });

  // less
  stream.queue(gulp.src([
    appStyleFiles,
    '!**/*.{scss,styl}',
    '!' + componentsBase + '**/*'
  ])
    .pipe(less()))
  ;

  // sass
  stream.queue(gulp.src([
    appStyleFiles,
    '!**/*.{less,styl}',
    '!' + componentsBase + '**/*'
  ])
    .pipe(sass()))
  ;

  // stylus
  stream.queue(gulp.src([
    appStyleFiles,
    '!**/*.{less,scss}',
    '!' + componentsBase + '**/*'
  ])
    .pipe(stylus()))
  ;

  return stream.done()
    .pipe(prefix())
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
    bowerDir + 'angular-animate/angular-animate.js',
    bowerDir + 'angular-cookies/angular-cookies.js',
    bowerDir + 'angular-resource/angular-resource.js',
    bowerDir + 'angular-sanitize/angular-sanitize.js',
    bowerDir + 'angular-touch/angular-touch.js',
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

gulp.task('dev', ['build', 'browser-sync'], function () {
  gulp.start('watch');
});

gulp.task('build', ['angularInject', 'polymer'], function () {
});

gulp.task('default', ['dev']);
