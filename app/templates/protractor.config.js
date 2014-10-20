var glob = require('glob');

exports.config = {
  seleniumServerJar: glob.sync('./node_modules/protractor/selenium/selenium-server-standalone-*.jar').join(),
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      args: ['--test-type']
    }
  },

  <% if (testFramework === 'mocha') { %>framework: 'mocha'<% } else { %>jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  }<% } %>
};
