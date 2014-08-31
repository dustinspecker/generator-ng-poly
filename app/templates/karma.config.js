module.exports = {
  browsers: ['PhantomJS'],
  frameworks: ['jasmine'],
  files: [
  ],
  reporters: ['failed', 'coverage'],
  preprocessors: {
    'app/**/!(*_test)+(.js)': ['coverage'],
    'app/**/*-directive.tpl.haml': ['ng-haml2js'],
    'app/**/*-directive.tpl.html': ['ng-html2js'],
    'app/**/*-directive.tpl.jade': ['ng-jade2js'],
    '**/*.coffee': ['coffee']
  },
  ngHaml2JsPreprocessor: {
    stripPrefix: 'app/'
  },
  ngHtml2JsPreprocessor: {
    stripPrefix: 'app/'
  },
  ngJade2JsPreprocessor: {
    stripPrefix: 'app/'
  },
  singleRun: true
};
