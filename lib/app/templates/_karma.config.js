'use strict';
var buildConfig = require('./build.config.js')
  , preprocessors = {}
  , buildTestDir
  , templateDir
  , jsDir;

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

preprocessors[jsDir + '**/*.js'] = ['coverage'];
preprocessors[templateDir + '**/*-directive.tpl.html'] = ['ng-html2js'];

module.exports = {
  browsers: ['PhantomJS2'],
  frameworks: [<% if (testFramework === 'mocha') { %>'mocha', 'chai'<% } else { %>'jasmine'<% } %>, 'sinon'],
  reporters: ['failed', 'coverage','junit','spec'],
  preprocessors: preprocessors,
  ngHtml2JsPreprocessor: {
    stripPrefix: templateDir
  },
  singleRun: true,
  coverageReporter:{
    type : 'html',
    dir : buildConfig.coverageReportDir
  },
  junitReporter : {
    outputDir:buildConfig.junitDir,
    outputFile: 'unit-test.xml'
  }
};
