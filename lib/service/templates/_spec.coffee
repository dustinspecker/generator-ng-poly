###global describe, beforeEach, it, expect, inject, module###
'use strict'

describe '<%= upperCamel %>', ->
  service = undefined

  beforeEach module '<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>'

  beforeEach inject (<%= upperCamel %>) ->
    service = <%= upperCamel %>

  it 'should equal <%= upperCamel %>', ->
    expect(service.get()).<% if (testFramework === 'mocha') { %>to.equal<% } else { %>toEqual<% } %> '<%= upperCamel %>'
