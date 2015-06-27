###global describe, beforeEach, it, expect, inject, module###
'use strict'

describe '<%= lowerCamel %>', ->
  constant = undefined

  beforeEach module '<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>'

  beforeEach inject (<%= lowerCamel %>) ->
    constant = <%= lowerCamel %>

  it 'should equal 0', ->
    expect(constant).<% if (testFramework === 'mocha') { %>to.equal<% } else { %>toBe<% } %> 0
