###global describe, beforeEach, it, expect, inject, module###
'use strict'

describe '<%= upperCamel %>', ->
  factory = undefined

  beforeEach module '<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>'

  beforeEach inject (<%= upperCamel %>) ->
    factory = <%= upperCamel %>

  it 'should equal 0', ->
    expect(factory).toEqual '<%= upperCamel %>'