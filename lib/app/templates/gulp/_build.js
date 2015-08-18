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
    return gulp.src([
      config.appMarkupFiles<% if (polymer) { %>,
      '!' + config.appComponents<% } %>
    ])<% if (markup === 'haml') { %>
      .pipe($.haml())<% } else if (markup === 'jade') { %>
      .pipe($.jade())<% } %>
      .pipe(gulp.dest(config.buildDir));
  });

  // compile styles and copy into build directory
  gulp.task('styles', ['clean'], function () {
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
      }}))<% if (style === 'less') { %>
      .pipe($.less())<% } else if (style === 'scss') { %>
      .pipe($.sass())<% } else if (style === 'styl') { %>
      .pipe($.stylus({
        use: $.nib()
      }))<% } %>
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
    var <% if (appScript === 'coffee') { %>coffeeFilter = $.filter('**/*.coffee', {restore: true})
      , <% } %><% if (appScript === 'es6') { %>es6Filter = $.filter('**/*.es6', {restore: true})
      , <% } %>htmlFilter = $.filter('**/*.html', {restore: true})
      , jsFilter = $.filter('**/*.js', {restore: true})<% if (appScript === 'ts') { %>
      , tsFilter = $.filter('**/*.ts', {restore: true})<% } %>;

    return gulp.src([
      config.appScriptFiles,
      config.buildDir + '**/*.html'<% if (polymer) { %>,
      '!' + config.appComponents<% } %>,
      '!**/*_test.*',
      '!**/index.html'
    ])
      .pipe($.sourcemaps.init())<% if (appScript === 'es6') { %>
      .pipe(es6Filter)
      .pipe($.babel())
      .pipe($.rename(function (filePath) {
        filePath.extname = '.js';
      }))
      .pipe(es6Filter.restore)<% } else if (appScript === 'ts') { %>
      .pipe(tsFilter)
      .pipe($.typescript(config.tsSourceProject))
      .pipe(tsFilter.restore)<% } else if (appScript === 'coffee') { %>
      .pipe(coffeeFilter)
      .pipe($.coffee())
      .pipe(coffeeFilter.restore)<% } %>
      .pipe($.if(isProd, htmlFilter))
      .pipe($.if(isProd, $.ngHtml2js({
        // lower camel case all app names
        moduleName: _.camelize(_.slugify(_.humanize(require('../package.json').name))),
        declareModule: false
      })))
      .pipe($.if(isProd, htmlFilter.restore))
      .pipe(jsFilter)
      .pipe($.if(isProd, $.angularFilesort()))
      .pipe($.if(isProd, $.concat('app.js')))
      .pipe($.if(isProd, $.ngAnnotate()))
      .pipe($.if(isProd, $.uglify()))
      .pipe($.if(isProd, $.rev()))<% if (polymer) { %>
      .pipe($.addSrc($.mainBowerFiles({filter: /webcomponents/})))<% } %>
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest(config.buildJs))
      .pipe(jsFilter.restore);
  });

  // inject custom CSS and JavaScript into index.html
  gulp.task('inject', ['markup', 'styles', 'scripts'], function () {
    var jsFilter = $.filter('**/*.js', {restore: true});

    return gulp.src(config.buildDir + 'index.html')
      .pipe($.inject(gulp.src([
          config.buildCss + '**/*',
          config.buildJs + '**/*'<% if (polymer) { %>,
          '!**/webcomponents.js'<% } %>
        ])
        .pipe(jsFilter)
        .pipe($.angularFilesort())
        .pipe(jsFilter.restore), {
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
    var cssFilter = $.filter('**/*.css', {restore: true})
      , jsFilter = $.filter('**/*.js', {restore: true});

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
          return url;
        }
      })))
      .pipe($.if(isProd, $.concat('vendor.css')))
      .pipe($.if(isProd, $.cssmin()))
      .pipe($.if(isProd, $.rev()))
      .pipe(gulp.dest(config.extDir))
      .pipe(cssFilter.restore)
      .pipe(jsFilter)
      .pipe($.if(isProd, $.concat('vendor.js')))
      .pipe($.if(isProd, $.uglify({
        preserveComments: $.uglifySaveLicense
      })))
      .pipe($.if(isProd, $.rev()))
      .pipe(gulp.dest(config.extDir))
      .pipe(jsFilter.restore);
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
          exclude: [<% } %><% if (framework === 'uibootstrap') { %>/bootstrap[.]js/<% } %><% if (polymer && framework === 'uibootstrap') { %>, <% } %><% if (polymer) { %>/webcomponents/<% } %><% if (polymer || framework === 'uibootstrap') { %>],<% } %>
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
    var <% if (markup !== 'html') { %>markupFilter = $.filter('**/*.<%= markup %>', {restore: true})
      , <% } %>polymerBowerAssetsToCopy<% if (appScript !== 'js') { %>
      , scriptFilter = $.filter('**/*.<%= appScript %>', {restore: true})<% } %><% if (style !== 'css') { %>
      , styleFilter = $.filter('**/*.<%= style %>', {restore: true})<% } %>;

    // List all Bower component assets that should be copied to the build
    // directory. The Bower directory is automatically prepended via the
    // map function.
    polymerBowerAssetsToCopy = [
      'polymer/polymer*.html'
    ].map(function (file) {
      return bowerDir + file;
    });

    return gulp.src(config.appComponents)
      .pipe($.addSrc(polymerBowerAssetsToCopy, {base: bowerDir}))
      .pipe($.sourcemaps.init())<% if (appScript !== 'js') { %>
      .pipe(scriptFilter)<% } %><% if (appScript === 'es6') { %>
      .pipe($.babel())
      .pipe($.rename(function (filePath) {
        filePath.extname = '.js';
      }))<% } else if (appScript === 'ts') { %>
      .pipe($.typescript(config.tsSourceProject))<% } else if (appScript === 'coffee') { %>
      .pipe($.coffee())<% } %><% if (appScript !== 'js') { %>
      .pipe(scriptFilter.restore)<% } %><% if (markup !== 'html') { %>
      .pipe(markupFilter)<% } %><% if (markup === 'haml') { %>
      .pipe($.haml())<% } else if (markup === 'jade') { %>
      .pipe($.jade())<% } %><% if (markup !== 'html') { %>
      .pipe(markupFilter.restore)<% } %><% if (style !== 'css') { %>
      .pipe(styleFilter)<% } %><% if (style === 'less') { %>
      .pipe($.less())<% } else if (style === 'scss') { %>
      .pipe($.sass())<% } else if (style === 'styl') { %>
      .pipe($.stylus({
        use: $.nib()
      }))<% } %><% if (style !== 'css') { %>
      .pipe(styleFilter.restore)<% } %>
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest(config.buildComponents));
  });

  // inject components
  gulp.task('componentsInject', ['components'], function () {
    // List all Polymer and custom copmonents that should be injected
    // into index.html. The are injected in the order listed and the
    // components directory is automatically prepended via the
    // map function.
    var polymerAssetsToInject = [
      'polymer/polymer.html'
    ].map(function (file) {
      return config.buildComponents + file;
    });

    return gulp.src(config.buildDir + 'index.html')
      .pipe($.inject(gulp.src(polymerAssetsToInject), {
          starttag: '<!-- inject:html -->',
          endtag: '<!-- endinject -->',
          addRootSlash: false,
          ignorePath: config.buildDir
        })
      )
      .pipe(gulp.dest(config.buildDir));
  });<% } %>

  // copy Bower fonts and images into build directory
  gulp.task('bowerAssets', ['clean'], function () {
    var assetFilter = $.filter('**/*.{eot,otf,svg,ttf,woff,woff2,gif,jpg,jpeg,png}', {restore: true});
    return gulp.src($.mainBowerFiles(), {base: bowerDir})
      .pipe(assetFilter)
      .pipe(gulp.dest(config.extDir))
      .pipe(assetFilter.restore);
  });

  // copy custom fonts into build directory
  gulp.task('fonts', ['clean'], function () {
    var fontFilter = $.filter('**/*.{eot,otf,svg,ttf,woff,woff2}', {restore: true});
    return gulp.src([config.appFontFiles])
      .pipe(fontFilter)
      .pipe(gulp.dest(config.buildFonts))
      .pipe(fontFilter.restore);
  });

  // copy and optimize images into build directory
  gulp.task('images', ['clean'], function () {
    return gulp.src(config.appImageFiles)
      .pipe($.if(isProd, $.imagemin()))
      .pipe(gulp.dest(config.buildImages));
  });

  gulp.task('copyTemplates', [<% if (polymer) { %>'componentsInject'<% } else { %>'bowerInject'<% } %>], function () {
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
          '!' + config.buildJs,
          '!' + config.extDir,
          '!' + config.buildDir + 'index.html'
        ], {mark: true}, cb);
      });
  });

  gulp.task('build', ['deleteTemplates', 'bowerAssets', 'images', 'fonts']);
};
