'use strict';

// gulp plugins
var gulp = require('gulp')
  , addSrc = require('gulp-add-src')
  , angularSort = require('gulp-angular-filesort')
  , coffeelint = require('gulp-coffeelint')
  , concat = require('gulp-concat')
  , cssmin = require('gulp-cssmin')
  , gulpIf = require('gulp-if')
  , haml = require('gulp-haml')
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
  , appMarkupFiles = appBase + '**/*.{haml,html,jade}'
  , appScriptFiles = appBase + '**/*.js'
  , appStyleFiles = appBase + '**/*.{css,less,scss,styl}';

<% if (polymer) { %>// custom component locations
var componentsBase = appBase + 'components/'
  , componentsMarkupFiles = componentsBase + '**/*.{haml,html,jade}'
  , componentsScriptFiles = componentsBase + '**/*.js'
  , componentsStyleFiles = componentsBase + '**/*.{css,less,scss,styl}';

<% } %>// e2e test locations
var e2ePoFiles = 'e2e/**/*.po.{coffee,js}'
  , e2eTestsFiles = 'e2e/**/*_test.{coffee,js}'
  , protractorConfig = 'protractor.config.js';

// unit test locations
var unitTestsFiles = '{app,test}/**/*_test.{coffee,js}'
  , karmaConfig = 'karma.config.js';

// build locations
var build = 'build/'
<% if (polymer) { %>  , buildComponents = build + 'components/'
<% } %><% if (framework === 'angularstrap' || framework === 'uibootstrap') { %>  , buildFonts = build + 'fonts/'
<% } %>  , buildCss = build + 'css/'
  , buildJs = build + 'js/';

// passed arguments
var isProd = args.stage === 'prod';

// bower assets to be injected into index.html
// 'bower_components' is automatically prepended
var injectableBowerComponents = [
  'angular/angular.js'<% if (bower.indexOf('animate') > -1) { %>,
  'angular-animate/angular-animate.js'<% } %><% if (framework === 'uibootstrap') { %>,
  'angular-bootstrap/ui-bootstrap-tpls.js'<% } %><% if (bower.indexOf('cookies') > -1) { %>,
  'angular-cookies/angular-cookies.js'<% } %><% if (framework === 'foundation') { %>,
  'angular-foundation/mm-foundation-tpls.js'<% } %><% if (bower.indexOf('resource') > -1) { %>,
  'angular-resource/angular-resource.js'<% } %><% if (ngRoute) { %>,
  'angular-route/angular-route.js'<% } %><% if (bower.indexOf('sanitize') > -1) { %>,
  'angular-sanitize/angular-sanitize.js'<% } %><% if (framework === 'angularstrap') { %>,
  'angular-strap/dist/angular-strap.js',
  'angular-strap/dist/angular-strap.tpl.js'<% } %><% if (bower.indexOf('touch') > -1) { %>,
  'angular-touch/angular-touch.js'<% } %><% if (!ngRoute) { %>,
  'angular-ui-router/release/angular-ui-router.js'<% } %><% if (polymer) { %>,
  'platform/platform.js'<% } %>
];

// minified bower assets to be injected into index.html
// 'bower_components' is automatically prepended
var minInjectableBowerComponents = [
  'angular/angular.min.js'<% if (bower.indexOf('animate') > -1) { %>,
  'angular-animate/angular-animate.min.js'<% } %><% if (framework === 'uibootstrap') { %>,
  'angular-bootstrap/ui-bootstrap-tpls.min.js'<% } %><% if (bower.indexOf('cookies') > -1) { %>,
  'angular-cookies/angular-cookies.min.js'<% } %><% if (framework === 'foundation') { %>,
  'angular-foundation/mm-foundation-tpls.js'<% } %><% if (bower.indexOf('resource') > -1) { %>,
  'angular-resource/angular-resource.min.js'<% } %><% if (ngRoute) { %>,
  'angular-route/angular-route.min.js'<% } %><% if (bower.indexOf('sanitize') > -1) { %>,
  'angular-sanitize/angular-sanitize.min.js'<% } %><% if (framework === 'angularstrap') { %>,
  'angular-strap/dist/angular-strap.min.js',
  'angular-strap/dist/angular-strap.tpl.min.js'<% } %><% if (bower.indexOf('touch') > -1) { %>,
  'angular-touch/angular-touch.min.js'<% } %><% if (!ngRoute) { %>,
  'angular-ui-router/release/angular-ui-router.min.js'<% } %><% if (polymer) { %>,
  'platform/platform.js'<% } %>
];

<% if (polymer) { %>// bower polymer components that do not need to be injected into index.html
// 'bower_components' is automatically prepended
var bowerPolymerComponents = [
  'polymer/polymer.{js,html}',
  'polymer/layout.html'
];

<% } %>var bowerDir = 'bower_components/';
function prependBowerDir(file) {
  return bowerDir + file;
}

gulp.task('watch', function () {
  gulp.watch([unitTestsFiles], ['unitTest']);
  gulp.watch([appMarkupFiles, appScriptFiles, appStyleFiles<% if (polymer) { %>, componentsBase + '**/*'<% } %>], ['build', browserSync.reload]);
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
    appScriptFiles<% if (polymer) { %>,
    componentsScriptFiles<% } %>,
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

<% if (polymer) { %>gulp.task('components', ['clean', 'jshint'], function () {
  var stream = streamqueue({ objectMode: true });

  // haml
  stream.queue(gulp.src([
    componentsMarkupFiles,
    '!**/*.{html,jade}'
  ], { base: componentsBase })
    .pipe(haml()))
  ;

  // html
  stream.queue(gulp.src([
    componentsMarkupFiles,
    '!**/*.{haml,jade}'
  ], { base: componentsBase }));

  // jade
  stream.queue(gulp.src([
    componentsMarkupFiles,
    '!**/*.{haml,html}'
  ], { base: componentsBase })
    .pipe(jade()))
  ;

  // js
  stream.queue(gulp.src(
    componentsScriptFiles
  , { base: componentsBase }))
  ;

  // css
  stream.queue(gulp.src([
    componentsStyleFiles,
    '!**/*.{less,scss,styl}'
  ], { base: componentsBase }));

  // less
  stream.queue(gulp.src([
    componentsStyleFiles,
    '!**/*.{css,scss,styl}'
  ], { base: componentsBase })
    .pipe(less())
    .pipe(prefix()))
  ;

  // sass
  stream.queue(gulp.src([
    componentsStyleFiles,
    '!**/*.{css,less,styl}',
  ], { base: componentsBase })
    .pipe(sass())
    .pipe(prefix()))
  ;

  // stylus
  stream.queue(gulp.src([
    componentsStyleFiles,
    '!**/*.{css,less,scss}'
  ], { base: componentsBase })
    .pipe(stylus())
    .pipe(prefix()))
  ;

  return stream.done()
    .pipe(gulp.dest(buildComponents));
});

<% } %><% if (framework === 'angularstrap' || framework === 'uibootstrap') { %>gulp.task('fonts', ['clean'], function () {
  return gulp.src([
    bowerDir + 'bootstrap/dist/fonts/**'
  ])
    .pipe(gulp.dest(buildFonts));
});

<% } %>gulp.task('scripts', ['clean', 'jshint'], function () {
  if (isProd) {
    return gulp.src([
      appScriptFiles<% if (polymer) { %>,
      '!' + componentsBase + '**/*'<% } %>,
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
      appScriptFiles<% if (polymer) { %>,
      '!' + componentsBase + '**/*'<% } %>,
      '!' + unitTestsFiles
    ])
      .pipe(addSrc([].concat(injectableBowerComponents.map(prependBowerDir))))
      .pipe(gulp.dest(buildJs))
    ;
  }
});

gulp.task('style', ['clean'], function () {
  var stream = streamqueue({ objectMode: true });

  <% if (framework !== 'none') { %>// load frameworks first, so that when concating custom CSS overrides frameworks<% } %><% if (framework === 'angularstrap' || framework === 'uibootstrap') { %>
  stream.queue(gulp.src([
    bowerDir + 'bootstrap/less/bootstrap.less'
  ])
    .pipe(less({
      paths: [
        bowerDir + 'bootstrap/less/**/*.less'
      ]
    })))
  ;

  <% } %><% if (framework === 'foundation') { %>
  stream.queue(gulp.src([
    bowerDir + 'foundation/scss/**/*.scss'
  ])
    .pipe(sass()))
  ;

  <% } %>// css
  stream.queue(gulp.src([
    appStyleFiles,
    '!**/*.{less,scss,styl}'<% if (polymer) { %>,
    '!' + componentsBase + '**/*'<% } %>
  ]));

  // less
  stream.queue(gulp.src([
    appStyleFiles,
    '!**/*.{css,scss,styl}'<% if (polymer) { %>,
    '!' + componentsBase + '**/*'<% } %>
  ])
    .pipe(less()))
  ;

  // sass
  stream.queue(gulp.src([
    appStyleFiles,
    '!**/*.{css,less,styl}'<% if (polymer) { %>,
    '!' + componentsBase + '**/*'<% } %>
  ])
    .pipe(sass()))
  ;

  // stylus
  stream.queue(gulp.src([
    appStyleFiles,
    '!**/*.{css,less,scss}'<% if (polymer) { %>,
    '!' + componentsBase + '**/*'<% } %>
  ])
    .pipe(stylus()))
  ;

  return stream.done()
    .pipe(prefix())
    .pipe(gulpIf(isProd, concat('style.css')))
    .pipe(gulpIf(isProd, cssmin()))
    .pipe(gulp.dest(buildCss))
  ;
});

gulp.task('markup', ['clean'], function () {
  var stream = streamqueue({ objectMode: true });

  // haml
  stream.queue(gulp.src([
    appMarkupFiles,<% if (polymer) { %>,
    '!' + componentsBase + '**/*'<% } %>,
    '!**/*.{html,jade}'
  ])
    .pipe(haml()))
  ;

  // html
  stream.queue(gulp.src([
    appMarkupFiles<% if (polymer) { %>,
    '!' + componentsBase + '**/*'<% } %>,
    '!**/*.{haml,jade}'
  ]));

  // jade
  stream.queue(gulp.src([
    appMarkupFiles<% if (polymer) { %>,
    '!' + componentsBase + '**/*'<% } %>,
    '!**/*.{haml,html}'
  ])
    .pipe(jade()))
  ;

  return stream.done()
    .pipe(gulp.dest(build));

});

gulp.task('inject', [<% if (polymer) { %>'components', <% } %>'markup', 'scripts', 'style'], function () {
  return gulp.src(build + 'index.html')
    .pipe(inject(gulp.src([
      <% if (framework === 'angularstrap' || framework === 'uibootstrap') { %>buildCss + 'bootstrap.css',
      <% } %><% if (framework === 'foundation') { %>buildCss + 'normalize.css',
      buildCss + 'foundation.css',
      <% } %><% if (polymer) { %>buildComponents + '**/*.html',
      <% } %>buildCss + '**/*.css',
      buildJs + 'angular.js',
      buildJs + 'angular.min.js'
    ], { read: false }), {
        addRootSlash: false,
        ignorePath: build
    }))
    .pipe(gulp.dest(build))
  ;
});

<% if (polymer) { %>gulp.task('headInject', ['inject'], function () {
  return gulp.src(build + 'index.html')
    .pipe(inject(gulp.src(buildJs + 'platform.js'), {
      starttag: '<!-- inject:head:{{ext}} -->',
      addRootSlash: false,
      ignorePath: build
    }))
    .pipe(gulp.dest(build))
  ;
});

<% } %>gulp.task('angularInject', [<% if (polymer) { %>'headInject'<% } else { %>'inject'<% } %>], function () {
  return gulp.src(build + 'index.html')
    .pipe(inject(gulp.src([
      buildJs + '**/*.js'<% if (polymer) { %>,
      '!' + buildComponents + '**/*'<% } %>,
      '!' + buildJs + 'angular.js',
      '!' + buildJs + 'angular.min.js'<% if (polymer) { %>,
      '!' + buildJs + 'platform.js'<% } %>,
      '!**/*_test.*'
    ]).pipe(angularSort()), { starttag: '<!-- inject:angular:{{ext}} -->', addRootSlash: false, ignorePath: build }))
    .pipe(gulpIf(isProd, htmlmin({
      collapseWhitespace: true,
      removeComments: true
    })))
    .pipe(gulp.dest(build))
  ;
});

<% if (polymer) { %>gulp.task('polymer', ['inject'], function () {
  return gulp.src(bowerPolymerComponents.map(prependBowerDir), {
      base: bowerDir
    })
    .pipe(gulp.dest(buildComponents))
  ;
});

<% } %>gulp.task('karmaInject', function () {
  var stream = streamqueue({ objectMode: true});
  stream.queue(gulp.src([
    bowerDir + 'angular/angular.js',
    bowerDir + 'angular-mocks/angular-mocks.js',
    appBase + '**/*-directive.tpl.{haml,html,jade}'
  ]));

  stream.queue(gulp.src([
    appBase + '**/*.js'<% if (polymer) { %>,
    '!' + componentsBase + '**/*'<% } %>,
    '!**/*_test.*'<% if (bower.indexOf('animate') > -1) { %>,
    bowerDir + 'angular-animate/angular-animate.js'<% } %><% if (bower.indexOf('cookies') > -1) { %>,
    bowerDir + 'angular-cookies/angular-cookies.js'<% } %><% if (framework === 'uibootstrap') { %>,
    bowerDir + 'angular-bootstrap/ui-bootstrap.tpls.js'<% } %><% if (framework === 'foundation') { %>,
    bowerDir + 'angular-foundation/mm-foundation-tpls.js'<% } %><% if (bower.indexOf('resource') > -1) { %>,
    bowerDir + 'angular-resource/angular-resource.js'<% } %><% if (ngRoute) { %>,
    bowerDir + 'angular-route/angular-route.js'<% } %><% if (bower.indexOf('sanitize') > -1) { %>,
    bowerDir + 'angular-sanitize/angular-sanitize.js'<% } %><% if (framework === 'angularstrap') { %>,
    bowerDir + 'angular-strap/dist/angular-strap.js',
    bowerDir + 'angular-strap/dist/angular-strap.tpl.js'<% } %><% if (bower.indexOf('touch') > -1) { %>,
    bowerDir + 'angular-touch/angular-touch.js'<% } %><% if (!ngRoute) { %>,
    bowerDir + 'angular-ui-router/release/angular-ui-router.js'<% } %>
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

gulp.task('build', ['angularInject'<% if (framework === 'angularstrap' || framework === 'uibootstrap') { %>, 'fonts'<% } %><% if (polymer) { %>, 'polymer'<% } %>], function () {
});

gulp.task('default', ['dev']);
