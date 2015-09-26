###global describe, beforeEach, it, browser<% if (e2eTestFramework === 'jasmine') { %>, expect<% } %> ###
'use strict'

<% if (e2eTestFramework === 'mocha') { %>chai = require 'chai'
chaiAsPromised = require 'chai-as-promised'
expect = chai.expect<% } %>
<%= upperCamel %>PagePo = require './<%= hyphenName %>.po'<% if (e2eTestFramework === 'mocha') { %>

chai.use chaiAsPromised<% } %>

describe '<%= humanName %> page', ->
  <%= lowerCamel %>Page = undefined

  beforeEach ->
    <%= lowerCamel %>Page = new <%= upperCamel %>PagePo
    browser.get '/#<%= url %>';

  it 'should say <%= ctrlName %>', ->
    expect(<%= lowerCamel %>Page.heading.getText()).<% if (e2eTestFramework === 'mocha') { %>to.eventually.equal<% } else { %>toEqual<% } %> '<%= lowerCamel %>'
    expect(<%= lowerCamel %>Page.text.getText()).<% if (e2eTestFramework === 'mocha') { %>to.eventually.equal<% } else { %>toEqual<% } %> '<%= ctrlName %>'
