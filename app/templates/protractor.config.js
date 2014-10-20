exports.config = {
  seleniumServerJar: './node_modules/protractor/selenium/selenium-server-standalone-2.43.1.jar',
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
