'use strict';

var _ = require('lodash')
  , buildConfig = require('./build.config')
  , config = {}
  , gulp = require('gulp')
  , gulpFiles = require('require-dir')('./gulp')
  , path = require('path')
  , $, key;

$ = require('gulp-load-plugins')({
  pattern: [
  'browser-sync',
  'del',
  'gulp-*',
  'karma',
  'main-bower-files',
  'multi-glob'<% if (style === 'styl') { %>,
  'nib'<% } %>,
  'plato',
  'run-sequence',
  'streamqueue',
  'uglify-save-license',
  'wiredep',
  'yargs'
  ]
});

_.merge(config, buildConfig);

<% if (polymer) { %>config.appComponents = path.join(config.appDir, 'components/**/*');
<% } %>config.appFiles = path.join(config.appDir, '**/*');
config.appFontFiles = path.join(config.appDir, 'fonts/**/*');
config.appImageFiles = path.join(config.appDir, 'images/**/*');
config.appMarkupFiles = path.join(config.appDir, '**/*.<%= markup %>');
config.appScriptFiles = path.join(config.appDir, '**/*.<%= appScript %>');
config.appStyleFiles = path.join(config.appDir, '**/*.<%= style %>');

config.buildDirectiveTemplateFiles = path.join(config.buildDir, '**/*directive.tpl.html');
config.buildJsFiles = path.join(config.buildJs, '**/*.js');

config.buildTestDirectiveTemplateFiles = path.join(config.buildTestDir, '**/*directive.tpl.html');
config.buildE2eTestsDir = path.join(config.buildTestDir, 'e2e');
config.buildE2eTests = path.join(config.buildE2eTestsDir, '**/*_test.js');
config.buildTestDirectiveTemplatesDir = path.join(config.buildTestDir, 'templates');
config.buildUnitTestsDir = path.join(config.buildTestDir, config.unitTestDir);
config.buildUnitTestFiles = path.join(config.buildUnitTestsDir, '**/*_test.js');

config.e2eFiles = path.join('e2e', '**/*.<% if (testScript === 'ts') { %>js<% } else { %><%= testScript %><% } %>');
config.unitTestFiles = path.join(config.unitTestDir, '**/*_test.<%= testScript %>');<% if (appScript === 'ts' || testScript === 'ts') { %>

config.tsSourceProject = $.typescript.createProject({
  declarationFiles: true,
  noExternalResolve: false
});

config.tsTestProject = $.typescript.createProject({
  declarationFiles: false,
  noExternalResolve: false
});<% } %>

for (key in gulpFiles) {
  gulpFiles[key](gulp, $, config);
}

gulp.task('dev', ['build'], function () {
  gulp.start('browserSync');
  gulp.start('watch');
});

gulp.task('default', ['dev']);
