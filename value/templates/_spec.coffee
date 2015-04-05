###global describe, beforeEach, it, expect, inject, module###
'use strict'

describe '<%= lowerCamel %>', ->
  value = undefined

  beforeEach module '<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>'

  beforeEach inject (<%= lowerCamel %>) ->
    value = <%= lowerCamel %>

  it 'should equal 0', ->
    expect(value).<% if (testFramework === 'mocha') { %>to.equal<% } else { %>toBe<% } %> 0
