'use strict';

// gulp plugins
var gulp = require('gulp')
  , plugins = require('gulp-load-plugins')()

  // other node modules
  , _ = require('lodash')
  , args = require('yargs').argv
  , browserSync = require('browser-sync')
  , karma = require('karma').server
  , rimraf = require('rimraf')
  , streamqueue = require('streamqueue')

  // app src locations
  , appBase = 'app/'
  , appFontFiles = appBase + 'fonts/**/*'
  , appImageFiles = appBase + 'images/**/*'
  , appMarkupFiles = appBase + '**/*.{haml,html,jade}'
  , appScriptFiles = appBase + '**/*.{coffee,js}'
  , appStyleFiles = appBase + '**/*.{css,less,scss,styl}'

<% if (polymer) { %>  // custom component locations
  , componentsBase = appBase + 'components/'
  , componentsMarkupFiles = componentsBase + '**/*.{haml,html,jade}'
  , componentsScriptFiles = componentsBase + '**/*.{coffee,js}'
  , componentsStyleFiles = componentsBase + '**/*.{css,less,scss,styl}'

<% } %>  // e2e test locations
  , e2ePoFiles = 'e2e/**/*.po.{coffee,js}'
  , e2eTestsFiles = 'e2e/**/*_test.{coffee,js}'
  , protractorConfig = 'protractor.config.js'

  // unit test locations
  , unitTestsFiles = '{app,test}/**/*_test.{coffee,js}'
  , karmaConfig = 'karma.config.js'

  // build locations
  , build = 'build/'
<% if (polymer) { %>  , buildComponents = build + 'components/'
<% } %>  , buildFonts = build + 'fonts/'
  , buildCss = build + 'css/'
  , buildImages = build + 'images/'
  , buildJs = build + 'js/'

  // passed arguments
  , isProd = args.stage === 'prod'

  // bower assets to be injected into index.html
  // 'bower_components' is automatically prepended
  , injectableBowerComponents = [
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
    'angular-ui-router/release/angular-ui-router.js'<% } %><% if (bower.indexOf('restangular') > -1 || bower.indexOf('lodash') > -1) { %>,
    'lodash/dist/lodash.js'<% } %><% if (polymer) { %>,
    'platform/platform.js'<% } %><% if (bower.indexOf('restangular') > -1) { %>,
    'restangular/dist/restangular.js'<% } %>
  ]

  // minified bower assets to be injected into index.html
  // 'bower_components' is automatically prepended
  , minInjectableBowerComponents = [
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
    'angular-ui-router/release/angular-ui-router.min.js'<% } %><% if (bower.indexOf('restangular') > -1 || bower.indexOf('lodash') > -1) { %>,
    'lodash/dist/lodash.min.js'<% } %><% if (polymer) { %>,
    'platform/platform.js'<% } %><% if (bower.indexOf('restangular') > -1) { %>,
    'restangular/dist/restangular.min.js'<% } %>
  ]

<% if (polymer) { %>  // bower polymer components that do not need to be injected into index.html
  // 'bower_components' is automatically prepended
  , bowerPolymerComponents = [
    'polymer/polymer.{js,html}',
    'polymer/layout.html'
  ]

<% } %>  , bowerDir = 'bower_components';
function prependBowerDir(file) {
  return bowerDir + '/' + file;
}

gulp.task('watch', function () {
  browserSync.reload();
  gulp.watch([unitTestsFiles], ['unitTest']);
  gulp.watch([appFontFiles, appImageFiles, appMarkupFiles, appScriptFiles, appStyleFiles<% if (polymer) { %>, componentsBase + '**/*'<% } %>],
    ['build', browserSync.reload]);
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
    appScriptFiles<% if (polymer) { %>,
    componentsScriptFiles<% } %>,
    unitTestsFiles,
    e2eTestsFiles,
    e2ePoFiles,
    '!**/*.js'
  ])
    .pipe(plugins.coffeelint({
      opt: {
        // jscs: disable disallowQuotedKeysInObjects
        'no_backticks': {
        // jscs: enable disallowQuotedKeysInObjects
          level: 'ignore'
        }
      }
    }))
    .pipe(plugins.coffeelint.reporter())
    .pipe(plugins.coffeelint.reporter('fail'))
  ;
});

gulp.task('jshint', function () {
  return gulp.src([
    appScriptFiles<% if (polymer) { %>,
    componentsScriptFiles<% } %>,
    e2ePoFiles,
    e2eTestsFiles,
    protractorConfig,
    unitTestsFiles,
    '!**/*.coffee'
  ])
    .pipe(plugins.jscs())
    .pipe(plugins.addSrc([
      karmaConfig,
      'Gulpfile.js'
    ]))
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    .pipe(plugins.jshint.reporter('fail'))
    .pipe(plugins.plato('report'))
  ;
});

<% if (polymer) { %>gulp.task('components', ['clean', 'jshint'], function () {
  var stream = streamqueue({objectMode: true});

  // haml
  stream.queue(gulp.src([
    componentsMarkupFiles,
    '!**/*.{html,jade}'
  ], {base: componentsBase})
    .pipe(plugins.haml()));

  // html
  stream.queue(gulp.src([
    componentsMarkupFiles,
    '!**/*.{haml,jade}'
  ], {base: componentsBase}));

  // jade
  stream.queue(gulp.src([
    componentsMarkupFiles,
    '!**/*.{haml,html}'
  ], {base: componentsBase})
    .pipe(plugins.jade()));

  // coffee
  stream.queue(gulp.src([
    componentsScriptFiles,
    '!**/*.js'
  ], {base: componentsBase})
    .pipe(plugins.coffee()));

  // js
  stream.queue(gulp.src([
    componentsScriptFiles,
    '!**/*.coffee'
  ], {base: componentsBase}));

  // css
  stream.queue(gulp.src([
    componentsStyleFiles,
    '!**/*.{less,scss,styl}'
  ], {base: componentsBase}));

  // less
  stream.queue(gulp.src([
    componentsStyleFiles,
    '!**/*.{css,scss,styl}'
  ], {base: componentsBase})
    .pipe(plugins.less())
    .pipe(plugins.autoprefixer()));

  // sass
  stream.queue(gulp.src([
    componentsStyleFiles,
    '!**/*.{css,less,styl}'
  ], {base: componentsBase})
    .pipe(plugins.sass())
    .pipe(plugins.autoprefixer()));

  // stylus
  stream.queue(gulp.src([
    componentsStyleFiles,
    '!**/*.{css,less,scss}'
  ], {base: componentsBase})
    .pipe(plugins.stylus())
    .pipe(plugins.autoprefixer()));

  return stream.done()
    .pipe(gulp.dest(buildComponents));
});

<% } %>gulp.task('fonts', ['clean'], function () {
  return gulp.src([
    appFontFiles<% if (framework === 'angularstrap' || framework === 'uibootstrap') { %>,
    bowerDir + '/bootstrap/dist/fonts/**'<% } %><% if (bower.indexOf('fontawesome') > -1) { %>,
    bowerDir + '/font-awesome/fonts/**'<% } %>
  ])
    .pipe(gulp.dest(buildFonts));
});

gulp.task('images', ['clean'], function () {
  return gulp.src([
    appImageFiles
  ])
    .pipe(plugins.imagemin())
    .pipe(gulp.dest(buildImages));
});

gulp.task('scripts', ['clean', 'jshint', 'coffeelint'], function () {
  var stream = streamqueue({objectMode: true})
    , appFilter, bowerFilter, templateFilter;

  // coffeescript
  stream.queue(gulp.src([
    appScriptFiles<% if (polymer) { %>,
    '!' + componentsScriptFiles<% } %>,
    '!' + unitTestsFiles,
    '!**/*.js'
  ])
    .pipe(plugins.coffee()));

  // javascript
  stream.queue(gulp.src([
    appScriptFiles<% if (polymer) { %>,
    '!' + componentsScriptFiles<% } %>,
    '!' + unitTestsFiles,
    '!**/*.coffee'
  ]));

  if (isProd) {
    appFilter = plugins.filter(function (file) {
      <% if (polymer) { %>var platformRegex = new RegExp('platform.js').test(file.path);

      if (platformRegex) {
        return false;
      }

      <% } %>if (/[.]tpl[.]html$/.test(file.path)) {
        return false;
      }

      return !file.path.match(bowerDir);
    });

    bowerFilter = plugins.filter(function (file) {
      <% if (polymer) { %>var  platformRegex = new RegExp('platform.js').test(file.path);

      if (platformRegex) {
        return false;
      }

      <% } %>if (/[.]tpl[.]html$/.test(file.path)) {
        return false;
      }

      return file.path.match(bowerDir);
    });

    templateFilter = plugins.filter(function (file) {
      return /[.]tpl[.]html$/.test(file.path);
    });

    stream.queue(gulp.src(
      [].concat(minInjectableBowerComponents.map(prependBowerDir))
    ));

    stream.queue(gulp.src([
      build + '**/*.html',
      '!**/index.html'
    ]));

    return stream.done()
      .pipe(templateFilter)
      .pipe(plugins.ngHtml2js({
        moduleName: require('./package.json').name,
        declareModule: false
      }))
      .pipe(templateFilter.restore())
      .pipe(appFilter)
      .pipe(plugins.angularFilesort())
      .pipe(plugins.ngAnnotate())
      .pipe(plugins.concat('app.js'))
      .pipe(plugins.streamify(plugins.rev()))
      .pipe(plugins.uglify())
      .pipe(appFilter.restore())
      .pipe(bowerFilter)
      .pipe(plugins.angularFilesort())
      .pipe(plugins.order(['**/angular.min.js']))
      .pipe(plugins.concat('vendor.js'))
      .pipe(plugins.streamify(plugins.rev()))
      .pipe(bowerFilter.restore())
      .pipe(gulp.dest(buildJs));
  } else {
    stream.queue(gulp.src(
      [].concat(injectableBowerComponents.map(prependBowerDir))
    ));

    return stream.done()
      .pipe(gulp.dest(buildJs));
  }
});

gulp.task('style', ['clean'], function () {
  var stream = streamqueue({objectMode: true})
    , appFilter, bowerFilter;

<% if (framework !== 'none') { %>  // load frameworks first, so that when concating custom CSS overrides frameworks<% } %><% if (framework === 'angularstrap' || framework === 'uibootstrap') { %>
  stream.queue(gulp.src([
    bowerDir + '/bootstrap/less/bootstrap.less'
  ])
    .pipe(plugins.less({
      paths: [
        bowerDir + '/bootstrap/less/**/*.less'
      ]
    })));

<% } %><% if (framework === 'foundation') { %>  stream.queue(gulp.src([
    bowerDir + '/foundation/scss/**/*.scss'
  ])
    .pipe(plugins.sass()));

<% } %><% if (bower.indexOf('fontawesome') > -1) { %>  stream.queue(gulp.src([
    bowerDir + '/font-awesome/css/font-awesome.css'
  ]));

<% } %>  // css
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
    .pipe(plugins.less()));

  // sass
  stream.queue(gulp.src([
    appStyleFiles,
    '!**/*.{css,less,styl}'<% if (polymer) { %>,
    '!' + componentsBase + '**/*'<% } %>
  ])
    .pipe(plugins.sass()));

  // stylus
  stream.queue(gulp.src([
    appStyleFiles,
    '!**/*.{css,less,scss}'<% if (polymer) { %>,
    '!' + componentsBase + '**/*'<% } %>
  ])
    .pipe(plugins.stylus()));

  if (isProd) {
    appFilter = plugins.filter(function (file) {
      return !file.path.match(bowerDir);
    });

    bowerFilter = plugins.filter(function (file) {
      return file.path.match(bowerDir);
    });

    return stream.done()
      .pipe(plugins.autoprefixer())
      .pipe(appFilter)
      .pipe(plugins.concat('app.css'))
      .pipe(plugins.streamify(plugins.rev()))
      .pipe(plugins.cssmin())
      .pipe(appFilter.restore())
      .pipe(bowerFilter)
      .pipe(plugins.concat('vendor.css'))
      .pipe(plugins.streamify(plugins.rev()))
      .pipe(plugins.cssmin())
      .pipe(bowerFilter.restore())
      .pipe(gulp.dest(buildCss));
  } else {
    return stream.done()
      .pipe(plugins.autoprefixer())
      .pipe(gulp.dest(buildCss));
  }
});

gulp.task('markup', ['clean'], function () {
  var stream = streamqueue({objectMode: true});

  // haml
  stream.queue(gulp.src([
    appMarkupFiles<% if (polymer) { %>,
    '!' + componentsBase + '**/*'<% } %>,
    '!**/*.{html,jade}'
  ])
    .pipe(plugins.haml()))
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
    .pipe(plugins.jade()))
  ;

  return stream.done()
    .pipe(gulp.dest(build));

});

gulp.task('inject', [<% if (polymer) { %>'components', <% } %>'markup', 'scripts', 'style'], function () {
  return gulp.src(build + 'index.html')
    .pipe(plugins.inject(gulp.src([
      buildCss + 'vendor*.css',
      <% if (framework === 'angularstrap' || framework === 'uibootstrap') { %>buildCss + 'bootstrap.css',
      <% } %><% if (framework === 'foundation') { %>buildCss + 'normalize.css',
      buildCss + 'foundation.css',
      <% } %><% if (polymer) { %>buildComponents + '**/*.html',
      <% } %>buildCss + '**/*.css',
      buildJs + 'angular.js',
      buildJs + 'angular.min.js'
    ], {read: false}), {
      addRootSlash: false,
      ignorePath: build
    }))
    .pipe(gulp.dest(build))
  ;
});

<% if (polymer) { %>gulp.task('headInject', ['inject'], function () {
  return gulp.src(build + 'index.html')
    .pipe(plugins.inject(gulp.src(buildJs + 'platform.js'), {
      starttag: '<!-- inject:head:{{ext}} -->',
      addRootSlash: false,
      ignorePath: build
    }))
    .pipe(gulp.dest(build))
  ;
});

<% } %>gulp.task('angularInject', [<% if (polymer) { %>'headInject'<% } else { %>'inject'<% } %>], function () {
  return gulp.src(build + 'index.html')
    .pipe(plugins.inject(gulp.src([
      buildJs + '**/*.js'<% if (polymer) { %>,
      '!' + buildComponents + '**/*'<% } %>,
      '!' + buildJs + 'angular.js',
      '!' + buildJs + 'angular.min.js'<% if (polymer) { %>,
      '!' + buildJs + 'platform.js'<% } %>,
      '!**/*_test.*'
    ]).pipe(plugins.angularFilesort()), {
      starttag: '<!-- inject:angular:{{ext}} -->',
      addRootSlash: false,
      ignorePath: build
    }))
    .pipe(plugins.if(isProd, plugins.htmlmin({
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
  var stream = streamqueue({objectMode: true});
  stream.queue(gulp.src([
    <% if (bower.indexOf('restangular') > -1 || bower.indexOf('lodash') > -1) { %>bowerDir + '/lodash/dist/lodash.js',
    <% } %>bowerDir + '/angular/angular.js',
    bowerDir + '/angular-mocks/angular-mocks.js',
    appBase + '**/*-directive.tpl.{haml,html,jade}'
  ]));

  stream.queue(gulp.src([
    appScriptFiles<% if (polymer) { %>,
    '!' + componentsBase + '**/*'<% } %>,
    '!**/*_test.*'<% if (bower.indexOf('animate') > -1) { %>,
    bowerDir + '/angular-animate/angular-animate.js'<% } %><% if (bower.indexOf('cookies') > -1) { %>,
    bowerDir + '/angular-cookies/angular-cookies.js'<% } %><% if (framework === 'uibootstrap') { %>,
    bowerDir + '/angular-bootstrap/ui-bootstrap.tpls.js'<% } %><% if (framework === 'foundation') { %>,
    bowerDir + '/angular-foundation/mm-foundation-tpls.js'<% } %><% if (bower.indexOf('resource') > -1) { %>,
    bowerDir + '/angular-resource/angular-resource.js'<% } %><% if (ngRoute) { %>,
    bowerDir + '/angular-route/angular-route.js'<% } %><% if (bower.indexOf('sanitize') > -1) { %>,
    bowerDir + '/angular-sanitize/angular-sanitize.js'<% } %><% if (framework === 'angularstrap') { %>,
    bowerDir + '/angular-strap/dist/angular-strap.js',
    bowerDir + '/angular-strap/dist/angular-strap.tpl.js'<% } %><% if (bower.indexOf('touch') > -1) { %>,
    bowerDir + '/angular-touch/angular-touch.js'<% } %><% if (!ngRoute) { %>,
    bowerDir + '/angular-ui-router/release/angular-ui-router.js'<% } %><% if (bower.indexOf('restangular') > -1) { %>,
    bowerDir + '/restangular/dist/restangular.js'<% } %>
  ]).pipe(plugins.angularFilesort()));

  stream.queue(gulp.src([
    unitTestsFiles
  ]));

  return gulp.src(karmaConfig)
    .pipe(plugins.inject(stream.done(), {
      starttag: 'files: [',
      endtag: ']',
      addRootSlash: false,
      transform: function (filepath, file, i, length) {
        return '\'' + filepath + '\'' + (i + 1 < length ? ',' : '');
      }
    }))
    .pipe(gulp.dest('./'))
  ;
});

gulp.task('unitTest', ['jshint', 'coffeelint', 'karmaInject'], function (done) {
  var karmaConf = require('./' + karmaConfig);
  karma.start(_.assign({}, karmaConf), done);
});

gulp.task('e2eTest', ['jshint', 'coffeelint'], function () {
  return gulp.src(e2eTestsFiles)
    .pipe(plugins.protractor.protractor({
      configFile: protractorConfig
    }))
    .on('error', function (e) {
      console.log(e);
    });
});

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
/* jshint -W106 */
gulp.task('webdriverUpdate', plugins.protractor.webdriver_update);
/* jshint +W106 */
// jscs:enable requireCamelCaseOrUpperCaseIdentifiers

gulp.task('dev', ['build', 'browser-sync'], function () {
  gulp.start('watch');
});

gulp.task('build', ['angularInject', 'fonts', 'images'<% if (polymer) { %>, 'polymer'<% } %>], function () {
});

gulp.task('default', ['dev']);
