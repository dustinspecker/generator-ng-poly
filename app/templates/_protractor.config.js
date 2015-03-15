var glob = require('glob')
  , buildConfigFile = require('findup-sync')('build.config.js')
  , buildConfig = require(buildConfigFile);

exports.config = {
  baseUrl: 'http://' + buildConfig.host + ':' + buildConfig.port,
  seleniumServerJar: glob.sync('./node_modules/protractor/selenium/selenium-server-standalone-*.jar').join(),
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      args: ['--test-type']
    }
  },

  <% if (e2eTestFramework === 'mocha') { %>framework: 'mocha'<% } else { %>jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  }<% } %>
};
