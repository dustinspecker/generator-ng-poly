/*global describe, beforeEach, it, browser<% if (testFramework === 'jasmine') { %>, expect<% } %> */
'use strict';

var buildConfigFile = require('findup-sync')('build.config.js')
  , buildConfig = require(buildConfigFile)<% if (testFramework === 'mocha') { %>
  , chai = require('chai')
  , expect = chai.expect<% } %>
  , <%= upperCamel %>PagePo = require('./<%= hyphenName %>.po');

describe('<%= humanName %> page', function () {
  var <%= lowerCamel %>Page;

  beforeEach(function () {
    <%= lowerCamel %>Page = new <%= upperCamel %>PagePo();
    browser.driver.get(buildConfig.host + ':' + buildConfig.port + '/#/<%= lowerCamel %>');
  });

  it('should say <%= ctrlName %>', function () {
    expect(<%= lowerCamel %>Page.heading.getText()).<% if (testFramework === 'mocha') { %>to.eventually.equal<% } else { %>toEqual<% } %>('<%= lowerCamel %>');
    expect(<%= lowerCamel %>Page.text.getText()).<% if (testFramework === 'mocha') { %>to.eventually.equal<% } else { %>toEqual<% } %>('<%= ctrlName %>');
  });
});
