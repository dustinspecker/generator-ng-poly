###global describe, beforeEach, it, expect, inject, module###
'use strict'

describe '<%= upperCamel %>', ->
  constant = undefined

  beforeEach module '<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>'

  beforeEach inject (<%= upperCamel %>) ->
    constant = <%= upperCamel %>

  it 'should equal 0', ->
    expect(constant).<% if (testFramework === 'mocha') { %>to.equal<% } else { %>toBe<% } %> 0
