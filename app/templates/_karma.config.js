'use strict';
var buildConfig = require('./build.config.js')
  , preprocessors = {}
  , appDir;

  appDir = buildConfig.appDir;
  // add slash if missing to properly strip prefix from directive templates
  if (appDir[appDir.length - 1] !== '/') {
    appDir = appDir + '/';
  }

  preprocessors[appDir + '**/!(*_test)+(.js)'] = ['coverage'];
  preprocessors[appDir + '**/*-directive.tpl.haml'] =  ['ng-haml2js'];
  preprocessors[appDir + '**/*-directive.tpl.html'] = ['ng-html2js'];
  preprocessors[appDir + '**/*-directive.tpl.jade'] = ['ng-jade2js'];
  preprocessors['**/*.coffee'] = ['coffee'];

module.exports = {
  browsers: ['PhantomJS'],
  frameworks: [<% if (testFramework === 'mocha') { %>'mocha', 'chai'<% } else { %>'jasmine'<% } %>],
  files: [
  ],
  reporters: ['failed', 'coverage'],
  preprocessors: preprocessors,
  ngHaml2JsPreprocessor: {
    stripPrefix: appDir
  },
  ngHtml2JsPreprocessor: {
    stripPrefix: appDir
  },
  ngJade2JsPreprocessor: {
    stripPrefix: appDir
  },
  singleRun: true
};
