/*global describe, beforeEach, it, browser<% if (e2eTestFramework === 'jasmine') { %>, expect<% } %> */
'use strict';

var <% if (e2eTestFramework === 'mocha') { %>chai = require('chai')
  , chaiAsPromised = require('chai-as-promised')
  , expect = chai.expect
  , <% } %><%= upperCamel %>PagePo = require('./<%= hyphenName %>.po');<% if (e2eTestFramework === 'mocha') { %>

chai.use(chaiAsPromised);<% } %>

describe('<%= humanName %> page', function () {
  var <%= lowerCamel %>Page;

  beforeEach(function () {
    <%= lowerCamel %>Page = new <%= upperCamel %>PagePo();
    browser.get('/#<%= url %>');
  });

  it('should say <%= ctrlName %>', function () {
    expect(<%= lowerCamel %>Page.heading.getText()).<% if (e2eTestFramework === 'mocha') { %>to.eventually.equal<% } else { %>toEqual<% } %>('<%= lowerCamel %>');
    expect(<%= lowerCamel %>Page.text.getText()).<% if (e2eTestFramework === 'mocha') { %>to.eventually.equal<% } else { %>toEqual<% } %>('<%= ctrlName %>');
  });
});
