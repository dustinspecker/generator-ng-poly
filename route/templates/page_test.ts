///<reference path='<%= referencePath %>/references.d.ts' />

/*global describe, beforeEach, it, browser<% if (e2eTestFramework === 'jasmine') { %>, expect<% } %> */
'use strict';

var buildConfigFile = require('findup-sync')('build.config.js')
  , buildConfig = require(buildConfigFile)<% if (e2eTestFramework === 'mocha') { %>
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
    expect(<%= lowerCamel %>Page.heading.getText()).<% if (e2eTestFramework === 'mocha') { %>to.eventually.equal<% } else { %>toEqual<% } %>('<%= lowerCamel %>');
    expect(<%= lowerCamel %>Page.text.getText()).<% if (e2eTestFramework === 'mocha') { %>to.eventually.equal<% } else { %>toEqual<% } %>('<%= ctrlName %>');
  });
});
