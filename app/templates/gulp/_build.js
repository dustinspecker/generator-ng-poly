'use strict';

var _ = require('underscore.string')
  , fs = require('fs')
  , path = require('path')

  , bowerDir = JSON.parse(fs.readFileSync('.bowerrc')).directory + path.sep;

module.exports = function (gulp, $, config) {
  var isProd = $.yargs.argv.stage === 'prod';

  // delete build directory
  gulp.task('clean', function (cb) {
    return $.del(config.buildDir, cb);
  });

  // compile markup files and copy into build directory
  gulp.task('markup', ['clean'], function () {
    var hamlFilter = $.filter('**/*.haml')
      , jadeFilter = $.filter('**/*.jade');

    return gulp.src([
      config.appMarkupFiles<% if (polymer) { %>,
      '!' + config.appComponents<% } %>
    ])
      .pipe(hamlFilter)
      .pipe($.haml())
      .pipe(hamlFilter.restore())
      .pipe(jadeFilter)
      .pipe($.jade())
      .pipe(jadeFilter.restore())
      .pipe(gulp.dest(config.buildDir));
  });

  // compile styles and copy into build directory
  gulp.task('styles', ['clean'], function () {
    var lessFilter = $.filter('**/*.less')
      , scssFilter = $.filter('**/*.scss')
      , stylusFilter = $.filter('**/*.styl');

    return gulp.src([
      config.appStyleFiles<% if (polymer) { %>,
      '!' + config.appComponents<% } %>
    ])
      .pipe($.plumber({errorHandler: function (err) {
        $.notify.onError({
          title: 'Error linting at ' + err.plugin,
          subtitle: ' ', //overrides defaults
          message: err.message.replace(/\u001b\[.*?m/g, ''),
          sound: ' ' //overrides defaults
        })(err);

        this.emit('end');
      }}))
      .pipe(lessFilter)
      .pipe($.less())
      .pipe(lessFilter.restore())
      .pipe(scssFilter)
      .pipe($.sass())
      .pipe(scssFilter.restore())
      .pipe(stylusFilter)
      .pipe($.stylus({
        use: $.nib()
      }))
      .pipe(stylusFilter.restore())
      .pipe($.autoprefixer())
      .pipe($.if(isProd, $.cssRebaseUrls()))
      .pipe($.if(isProd, $.modifyCssUrls({
        modify: function (url) {
          // determine if url is using http, https, or data protocol
          // cssRebaseUrls rebases these URLs, too, so we need to fix that
          var beginUrl = url.indexOf('http:');
          if (beginUrl < 0) {
            beginUrl = url.indexOf('https:');
          }
          if (beginUrl < 0) {
            beginUrl = url.indexOf('data:');
          }

          if (beginUrl > -1) {
            return url.substring(beginUrl, url.length);
          }

          // prepend all other urls
          return '../' + url;
        }
      })))
      .pipe($.if(isProd, $.concat('app.css')))
      .pipe($.if(isProd, $.cssmin()))
      .pipe($.if(isProd, $.rev()))
      .pipe(gulp.dest(config.buildCss));
  });

  // compile scripts and copy into build directory
  gulp.task('scripts', ['clean', 'analyze', 'markup'], function () {
    var typescriptFilter = $.filter('**/*.ts')
      , coffeeFilter = $.filter('**/*.coffee')
      , es6Filter = $.filter('**/*.es6')
      , htmlFilter = $.filter('**/*.html')
      , jsFilter = $.filter('**/*.js');

    return gulp.src([
      config.appScriptFiles,
      config.buildDir + '**/*.html'<% if (polymer) { %>,
      '!' + config.appComponents<% } %>,
      '!**/*_test.*',
      '!**/index.html'
    ])
      .pipe(es6Filter)
      .pipe($.sourcemaps.init())
      .pipe($.babel())
      .pipe($.rename(function (filePath) {
        filePath.extname = '.js';
      }))
      .pipe(es6Filter.restore())
      .pipe(typescriptFilter)
      .pipe($.typescript(config.tsProject))
      .pipe(typescriptFilter.restore())
      .pipe(coffeeFilter)
      .pipe($.coffee())
      .pipe(coffeeFilter.restore())
      .pipe($.if(isProd, htmlFilter))
      .pipe($.if(isProd, $.ngHtml2js({
        // lower camel case all app names
        moduleName: _.camelize(_.slugify(_.humanize(require('../package.json').name))),
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
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest(config.buildJs))
      .pipe(jsFilter.restore());
  });

  // inject custom CSS and JavaScript into index.html
  gulp.task('inject', ['markup', 'styles', 'scripts'], function () {
    var jsFilter = $.filter('**/*.js');

    return gulp.src(config.buildDir + 'index.html')
      .pipe($.inject(gulp.src([
          config.buildCss + '**/*',
          config.buildJs + '**/*'<% if (polymer) { %>,
          '!**/webcomponents.js'<% } %>
        ])
        .pipe(jsFilter)
        .pipe($.angularFilesort())
        .pipe(jsFilter.restore()), {
          addRootSlash: false,
          ignorePath: config.buildDir
        })
      )<% if (polymer) { %>
      .pipe($.inject(gulp.src([
          config.buildJs + 'webcomponents.js'
        ]), {
          starttag: '<!-- inject:head:{{ext}} -->',
          endtag: '<!-- endinject -->',
          addRootSlash: false,
          ignorePath: config.buildDir
        })
      )<% } %>
      .pipe(gulp.dest(config.buildDir));
  });

  // copy bower components into build directory
  gulp.task('bowerCopy', ['inject'], function () {
    var cssFilter = $.filter('**/*.css')
      , jsFilter = $.filter('**/*.js');

    return gulp.src($.mainBowerFiles(), {base: bowerDir})
      .pipe(cssFilter)
      .pipe($.if(isProd, $.modifyCssUrls({
        modify: function (url, filePath) {
          if (url.indexOf('http') !== 0 && url.indexOf('data:') !== 0) {
            filePath = path.dirname(filePath) + path.sep;
            filePath = filePath.substring(filePath.indexOf(bowerDir) + bowerDir.length,
              filePath.length);
          }
          url = path.normalize(filePath + url);
          url = url.replace(/[/\\]/g, '/');
          console.log(url);
          return url;
        }
      })))
      .pipe($.if(isProd, $.concat('vendor.css')))
      .pipe($.if(isProd, $.cssmin()))
      .pipe($.if(isProd, $.rev()))
      .pipe(gulp.dest(config.extDir))
      .pipe(cssFilter.restore())
      .pipe(jsFilter)
      .pipe($.if(isProd, $.concat('vendor.js')))
      .pipe($.if(isProd, $.uglify({
        preserveComments: $.uglifySaveLicense
      })))
      .pipe($.if(isProd, $.rev()))
      .pipe(gulp.dest(config.extDir))
      .pipe(jsFilter.restore());
  });

  // inject bower components into index.html
  gulp.task('bowerInject', ['bowerCopy'], function () {
    if (isProd) {
      return gulp.src(config.buildDir + 'index.html')
        .pipe($.inject(gulp.src([
          config.extDir + 'vendor*.css',
          config.extDir + 'vendor*.js'
        ], {
          read: false
        }), {
          starttag: '<!-- bower:{{ext}} -->',
          endtag: '<!-- endbower -->',
          addRootSlash: false,
          ignorePath: config.buildDir
        }))
        .pipe($.htmlmin({
          collapseWhitespace: true,
          removeComments: true
        }))
        .pipe(gulp.dest(config.buildDir));
    } else {
      return gulp.src(config.buildDir + 'index.html')
        .pipe($.wiredep.stream({<% if (polymer || framework === 'uibootstrap') { %>
          exclude: [<% } %><% if (framework === 'uibootstrap') { %>/bootstrap[.]js/<% } %><% if (polymer && framework === 'uibootstrap') { %>, <% } %><% if (polymer) { %>/polymer/, /webcomponents/<% } %><% if (polymer || framework === 'uibootstrap') { %>],<% } %>
          ignorePath: '../../' + bowerDir.replace(/\\/g, '/'),
          fileTypes: {
            html: {
              replace: {
                css: function (filePath) {
                  return '<link rel="stylesheet" href="' + config.extDir.replace(config.buildDir, '') +
                    filePath + '">';
                },
                js: function (filePath) {
                  return '<script src="' + config.extDir.replace(config.buildDir, '') +
                    filePath + '"></script>';
                }
              }
            }
          }
        }))
        .pipe(gulp.dest(config.buildDir));
    }
  });<% if (polymer) { %>

  // compile components and copy into build directory
  gulp.task('components', ['bowerInject'], function () {
    var typeScriptFilter = $.filter('**/*.ts')
      , coffeeFilter = $.filter('**/*.coffee')
      , es6Filter = $.filter('**/*.es6')
      , hamlFilter = $.filter('**/*.haml')
      , jadeFilter = $.filter('**/*.jade')
      , lessFilter = $.filter('**/*.less')
      , scssFilter = $.filter('**/*.scss')
      , stylFilter = $.filter('**/*.styl');

    return gulp.src(config.appComponents)
      .pipe($.addSrc(bowerDir + 'polymer/{layout,polymer}.{html,js}', {base: bowerDir}))
      .pipe($.sourcemaps.init())
      .pipe(es6Filter)
      .pipe($.babel())
      .pipe($.rename(function (filePath) {
        filePath.extname = '.js';
      }))
      .pipe(es6Filter.restore())
      .pipe(typeScriptFilter)
      .pipe($.typescript())
      .pipe(typeScriptFilter.restore())
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
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest(config.buildComponents));
  });<% } %>

  // copy Bower fonts and images into build directory
  gulp.task('bowerAssets', ['clean'], function () {
    var assetFilter = $.filter('**/*.{eot,otf,svg,ttf,woff,gif,jpg,jpeg,png}');
    return gulp.src($.mainBowerFiles(), {base: bowerDir})
      .pipe(assetFilter)
      .pipe(gulp.dest(config.extDir))
      .pipe(assetFilter.restore());
  });

  // copy custom fonts into build directory
  gulp.task('fonts', ['clean'], function () {
    var fontFilter = $.filter('**/*.{eot,otf,svg,ttf,woff}');
    return gulp.src([config.appFontFiles])
      .pipe(fontFilter)
      .pipe(gulp.dest(config.buildFonts))
      .pipe(fontFilter.restore());
  });

  // copy and optimize images into build directory
  gulp.task('images', ['clean'], function () {
    return gulp.src(config.appImageFiles)
      .pipe($.if(isProd, $.imagemin()))
      .pipe(gulp.dest(config.buildImages));
  });

  gulp.task('copyTemplates', [<% if (polymer) { %>'components'<% } else { %>'bowerInject'<% } %>], function () {
    // always copy templates to testBuild directory
    var stream = $.streamqueue({objectMode: true});

    stream.queue(gulp.src([config.buildDirectiveTemplateFiles]));

    return stream.done()
      .pipe(gulp.dest(config.buildTestDirectiveTemplatesDir));
  });

  gulp.task('deleteTemplates', ['copyTemplates'], function (cb) {
    // only delete templates in production
    // the templates are injected into the app during prod build
    if (!isProd) {
      return cb();
    }

    gulp.src([config.buildDir + '**/*.html'])
      .pipe(gulp.dest('tmp/' + config.buildDir))
      .on('end', function () {
        $.del([
          config.buildDir + '*'<% if (polymer) { %>,
          '!' + config.buildComponents<% } %>,
          '!' + config.buildCss,
          '!' + config.buildFonts,
          '!' + config.buildImages,
          '!' + config.buildImages,
          '!' + config.buildJs,
          '!' + config.extDir,
          '!' + config.buildDir + 'index.html'
        ], {mark: true}, cb);
      });
  });

  gulp.task('build', ['deleteTemplates', 'bowerAssets', 'images', 'fonts']);
};
