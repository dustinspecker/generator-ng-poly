'use strict';
var buildConfig = require('./build.config.js')
  , isProd = require('yargs').argv.stage === 'prod'
  , preprocessors = {}
  , buildDir
  , buildTestDir
  , templateDir
  , jsDir;

buildDir = buildConfig.buildDir;
// add slash if missing to properly strip prefix from directive templates
if (buildDir[buildDir.length - 1] !== '/') {
  buildDir = buildDir + '/';
}

buildTestDir = buildConfig.buildTestDir;
// add slash if missing to properly strip prefix from directive templates
if (buildTestDir[buildTestDir.length - 1] !== '/') {
  buildTestDir = buildTestDir + '/';
}

templateDir = buildTestDir + 'templates/';

jsDir = buildConfig.buildJs;
// add slash if missing to properly strip prefix from directive templates
if (jsDir[jsDir.length - 1] !== '/') {
  jsDir = jsDir + '/';
}

preprocessors[jsDir + '**/*.js)'] = ['coverage'];
preprocessors[templateDir + '**/*-directive.tpl.html'] = ['ng-html2js'];

module.exports = {
  browsers: ['PhantomJS'],
  frameworks: [<% if (testFramework === 'mocha') { %>'mocha', 'chai'<% } else { %>'jasmine'<% } %>, 'sinon'],
  reporters: ['failed', 'coverage'],
  preprocessors: preprocessors,
  ngHtml2JsPreprocessor: {
    stripPrefix: buildDir
  },
  singleRun: true
};
