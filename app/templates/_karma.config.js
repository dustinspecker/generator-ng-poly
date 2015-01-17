'use strict';
var buildConfig = require('./build.config.js')
  , preprocessors = {}
  , buildDir
  , jsDir;

buildDir = 'tmp/' + buildConfig.buildDir;
// add slash if missing to properly strip prefix from directive templates
if (buildDir[buildDir.length - 1] !== '/') {
  buildDir = buildDir + '/';
}

jsDir = 'tmp/' + buildConfig.buildJs;
// add slash if missing to properly strip prefix from directive templates
if (jsDir[jsDir.length - 1] !== '/') {
  jsDir = jsDir + '/';
}

preprocessors[jsDir + '**/!(*_test)+(.js)'] = ['coverage'];
preprocessors[buildDir + '**/*-directive.tpl.html'] = ['ng-html2js'];

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
