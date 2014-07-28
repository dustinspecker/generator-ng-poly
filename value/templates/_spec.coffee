###global describe, beforeEach, it, expect, inject, module###
'use strict'

describe '<%= upperCamel %>', ->
  value = undefined

  beforeEach module '<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>'

  beforeEach inject (<%= upperCamel %>) ->
    value = <%= upperCamel %>

  it 'should equal 0', ->
    expect(value).toBe 0