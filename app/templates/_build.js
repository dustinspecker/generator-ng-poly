'use strict';

var gulp = require('gulp')
  , path = require('path')
  , notify = require('gulp-notify')
  , plumber = require('gulp-plumber')
  , $ = require('gulp-load-plugins')({
    pattern: [
      'gulp-*',
      'main-bower-files',
      'rimraf',
      'streamqueue',
      'uglify-save-license',
      'wiredep',
      'yargs'
    ]
  })

  , buildConfig = require('../build.config.js')
  , appBase = buildConfig.appDir<% if (polymer) { %>
  , appComponents = path.join(appBase, 'components/**/*')<% } %>
  , appFontFiles = path.join(appBase, 'fonts/**/*')
  , appImages = path.join(appBase, 'images/**/*')
  , appMarkupFiles = path.join(appBase, '**/*.{haml,html,jade}')
  , appScriptFiles = path.join(appBase, '**/*.{coffee,js}')
  , appStyleFiles = path.join(appBase, '**/*.{css,less,scss,styl}')

<% if (polymer) { %>  , fs = require('fs')
  , path = require('path')
  , bowerDir = JSON.parse(fs.readFileSync('.bowerrc')).directory + path.sep

<% } %>  , isProd = $.yargs.argv.stage === 'prod';

// delete build directory
gulp.task('clean', function (cb) {
  return $.rimraf(buildConfig.buildDir, cb);
});

// compile markup files and copy into build directory
gulp.task('markup', ['clean'], function () {
  var hamlFilter = $.filter('**/*.haml')
    , jadeFilter = $.filter('**/*.jade');

  return gulp.src([
    appMarkupFiles<% if (polymer) { %>,
    '!' + appComponents<% } %>
  ])
    .pipe(hamlFilter)
    .pipe($.haml())
    .pipe(hamlFilter.restore())
    .pipe(jadeFilter)
    .pipe($.jade())
    .pipe(jadeFilter.restore())
    .pipe(gulp.dest(buildConfig.buildDir));
});

// compile styles and copy into build directory
gulp.task('styles', ['clean'], function () {
  var lessFilter = $.filter('**/*.less')
    , scssFilter = $.filter('**/*.scss')
    , stylusFilter = $.filter('**/*.styl')
    , onError = function(err) {
        notify.onError({
            title:    'Syntax error in CSS',
            subtitle: ' ', //overrides defaults
            message:  ' ', //overrides defaults
            sound:    ' ' //overrides defaults
        })(err);

        this.emit('end');
    };

  return gulp.src([
    appStyleFiles<% if (polymer) { %>,
    '!' + appComponents<% } %>
  ])
    .pipe(plumber({errorHandler: onError}))
    .pipe(lessFilter)
    .pipe($.less())
    .pipe(lessFilter.restore())
    .pipe(scssFilter)
    .pipe($.sass())
    .pipe(scssFilter.restore())
    .pipe(stylusFilter)
    .pipe($.stylus())
    .pipe(stylusFilter.restore())
    .pipe($.autoprefixer())
    .pipe($.if(isProd, $.concat('app.css')))
    .pipe($.if(isProd, $.cssmin()))
    .pipe($.if(isProd, $.rev()))
    .pipe(gulp.dest(buildConfig.buildCss));
});

// compile scripts and copy into build directory
gulp.task('scripts', ['clean', 'analyze', 'markup'], function () {
  var coffeeFilter = $.filter('**/*.coffee')
    , htmlFilter = $.filter('**/*.html')
    , jsFilter = $.filter('**/*.js');

  return gulp.src([
    appScriptFiles,
    buildConfig.buildDir + '**/*.html'<% if (polymer) { %>,
    '!' + appComponents<% } %>,
    '!**/*_test.*',
    '!**/index.html'
  ])
    .pipe(coffeeFilter)
    .pipe($.coffee())
    .pipe(coffeeFilter.restore())
    .pipe($.if(isProd, htmlFilter))
    .pipe($.if(isProd, $.ngHtml2js({
      moduleName: require('../package.json').name,
      declareModule: false
    })))
    .pipe($.if(isProd, htmlFilter.restore()))
    .pipe(jsFilter)
    .pipe($.if(isProd, $.angularFilesort()))
    .pipe($.if(isProd, $.concat('app.js')))
    .pipe($.if(isProd, $.ngAnnotate()))
    .pipe($.if(isProd, $.uglify()))
    .pipe($.if(isProd, $.rev()))<% if (polymer) { %>
    .pipe($.addSrc($.mainBowerFiles({filter: /webcomponents/})))<% } %>
    .pipe(gulp.dest(buildConfig.buildJs))
    .pipe(jsFilter.restore());
});

// inject custom CSS and JavaScript into index.html
gulp.task('inject', ['markup', 'styles', 'scripts'], function () {
  var jsFilter = $.filter('**/*.js');

  return gulp.src(buildConfig.buildDir + 'index.html')
    .pipe($.inject(gulp.src([
      buildConfig.buildCss + '**/*',
      buildConfig.buildJs + '**/*'<% if (polymer) { %>,
      '!**/webcomponents.js'<% } %>
    ])
    .pipe(jsFilter)
    .pipe($.angularFilesort())
    .pipe(jsFilter.restore()), {
      addRootSlash: false,
      ignorePath: buildConfig.buildDir
    }))<% if (polymer) { %>
    .pipe($.inject(gulp.src([
      buildConfig.buildJs + 'webcomponents.js'
    ]), {
      starttag: '<!-- inject:head:{{ext}} -->',
      endtag: '<!-- endinject -->',
      addRootSlash: false,
      ignorePath: buildConfig.buildDir
    }))<% } %>
    .pipe(gulp.dest(buildConfig.buildDir));
});

// copy bower components into build directory
gulp.task('bowerCopy', ['inject'], function () {
  var cssFilter = $.filter('**/*.css')
    , jsFilter = $.filter('**/*.js')

    , stream = $.streamqueue({objectMode: true})
    , wiredep = $.wiredep(<% if (polymer || framework === 'uibootstrap') { %>{exclude: [<% } %><% if (framework === 'uibootstrap') { %>/bootstrap[.]js/<% } %><% if (polymer && framework === 'uibootstrap') { %>, <% } %><% if (polymer) { %>/polymer/, /webcomponents/<% } %><% if (polymer || framework === 'uibootstrap') { %>]}<% } %>);

  if (wiredep.js) {
    stream.queue(gulp.src(wiredep.js));
  }

  if (wiredep.css) {
    stream.queue(gulp.src(wiredep.css));
  }

  return stream.done()
    .pipe(cssFilter)
    .pipe($.if(isProd, $.concat('vendor.css')))
    .pipe($.if(isProd, $.cssmin()))
    .pipe($.if(isProd, $.rev()))
    .pipe(gulp.dest(buildConfig.extCss))
    .pipe(cssFilter.restore())
    .pipe(jsFilter)
    .pipe($.if(isProd, $.concat('vendor.js')))
    .pipe($.if(isProd, $.uglify({
      preserveComments: $.uglifySaveLicense
    })))
    .pipe($.if(isProd, $.rev()))
    .pipe(gulp.dest(buildConfig.extJs))
    .pipe(jsFilter.restore());
});

// inject bower components into index.html
gulp.task('bowerInject', ['bowerCopy'], function () {
  if (isProd) {
    return gulp.src(buildConfig.buildDir + 'index.html')
      .pipe($.inject(gulp.src([
        buildConfig.extCss + 'vendor*.css',
        buildConfig.extJs + 'vendor*.js'
      ], {
        read: false
      }), {
        starttag: '<!-- bower:{{ext}} -->',
        endtag: '<!-- endbower -->',
        addRootSlash: false,
        ignorePath: buildConfig.buildDir
      }))
      .pipe($.htmlmin({
        collapseWhitespace: true,
        removeComments: true
      }))
      .pipe(gulp.dest(buildConfig.buildDir));
  } else {
    return gulp.src(buildConfig.buildDir + 'index.html')
      .pipe($.wiredep.stream({<% if (polymer || framework === 'uibootstrap') { %>
        exclude: [<% } %><% if (framework === 'uibootstrap') { %>/bootstrap[.]js/<% } %><% if (polymer && framework === 'uibootstrap') { %>, <% } %><% if (polymer) { %>/polymer/, /webcomponents/<% } %><% if (polymer || framework === 'uibootstrap') { %>],<% } %>
        fileTypes: {
          html: {
            replace: {
              css: function (filePath) {
                return '<link rel="stylesheet" href="' + buildConfig.extCss.replace(buildConfig.buildDir, '') +
                  filePath.split('/').pop() + '">';
              },
              js: function (filePath) {
                return '<script src="' + buildConfig.extJs.replace(buildConfig.buildDir, '') +
                  filePath.split('/').pop() + '"></script>';
              }
            }
          }
        }
      }))
      .pipe(gulp.dest(buildConfig.buildDir));
  }
});

<% if (polymer) { %>// compile components and copy into build directory
gulp.task('components', ['bowerInject'], function () {
  var coffeeFilter = $.filter('**/*.coffee')
    , hamlFilter = $.filter('**/*.haml')
    , jadeFilter = $.filter('**/*.jade')
    , lessFilter = $.filter('**/*.less')
    , scssFilter = $.filter('**/*.scss')
    , stylFilter = $.filter('**/*.styl');

  return gulp.src(appComponents)<% if (polymer) { %>
    .pipe($.addSrc(bowerDir + 'polymer/{layout,polymer}.{html,js}', {base: bowerDir}))<% } %>
    .pipe(coffeeFilter)
    .pipe($.coffee())
    .pipe(coffeeFilter.restore())
    .pipe(hamlFilter)
    .pipe($.haml())
    .pipe(hamlFilter.restore())
    .pipe(jadeFilter)
    .pipe($.jade())
    .pipe(jadeFilter.restore())
    .pipe(lessFilter)
    .pipe($.less())
    .pipe(lessFilter.restore())
    .pipe(scssFilter)
    .pipe($.sass())
    .pipe(scssFilter.restore())
    .pipe(stylFilter)
    .pipe($.stylus())
    .pipe(stylFilter.restore())
    .pipe(gulp.dest(buildConfig.buildComponents));
});

<% } %>
// copy custom fonts into build directory
gulp.task('fonts', ['fontsBower'], function () {
  var fontFilter = $.filter('**/*.{eot,otf,svg,ttf,woff}');
  return gulp.src([appFontFiles])
    .pipe(fontFilter)
    .pipe(gulp.dest(buildConfig.buildFonts))
    .pipe(fontFilter.restore());
});
// copy Bower fonts into build directory
gulp.task('fontsBower', ['clean'], function () {
  var fontFilter = $.filter('**/*.{eot,otf,svg,ttf,woff}');
  return gulp.src($.mainBowerFiles())
    .pipe(fontFilter)
    .pipe(gulp.dest(buildConfig.extFonts))
    .pipe(fontFilter.restore());
});

// copy and optimize images into build directory
gulp.task('images', ['clean'], function () {
  return gulp.src(appImages)
    .pipe($.if(isProd, $.imagemin()))
    .pipe(gulp.dest(buildConfig.buildImages));
});

gulp.task('build', [<% if (polymer) { %>'components'<% } else { %>'bowerInject'<% } %>, 'images', 'fonts']);
