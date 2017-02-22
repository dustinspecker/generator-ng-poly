var glob = require('glob')
  , buildConfigFile = require('find-up').sync('build.config.js')
  , buildConfig = require(buildConfigFile)
  , jasmineReporters = require('jasmine-reporters')
  , SpecReporter = require('jasmine-spec-reporter');

exports.config = {
  baseUrl: 'http://' + buildConfig.host + ':' + buildConfig.port,
  seleniumServerJar: glob.sync('./node_modules/protractor/selenium/selenium-server-standalone-*.jar').join(),
  framework: 'jasmine2',
  capabilities: {
      'browserName': 'phantomjs',
      'phantomjs.binary.path': require('phantomjs').path
  },
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
	print: function() {}
  },
  onPrepare: function() {
    jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
    	consolidateAll: true,
    	savePath: buildConfig.junitDir,
    	filePrefix: 'e2e-test'
    }));

    // add jasmine spec reporter
    jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: 'all'}));
  }

  <% if (e2eTestFramework === 'mocha') { %>framework: 'mocha'<% } else { %>jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  }<% } %>
};
