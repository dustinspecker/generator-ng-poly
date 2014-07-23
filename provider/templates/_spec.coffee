###global describe, beforeEach, it, expect, inject, module###
'use strict'

describe '<%= lowerCamel %>', ->
  provider = undefined

  beforeEach module '<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>'

  beforeEach inject (<%= lowerCamel %>) ->
    provider = <%= lowerCamel %>

  it 'should equal <%= lowerCamel %>', ->
    expect(provider).toEqual '<%= lowerCamel %>'