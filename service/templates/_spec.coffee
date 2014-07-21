###global describe, beforeEach, it, expect, inject, module###
'use strict'

describe '<%= lowerCamel %>', ->
  service = undefined

  beforeEach module '<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>'

  beforeEach inject (<%= lowerCamel %>) ->
    service = <%= lowerCamel %>

  it 'should equal <%= lowerCamel %>', ->
    expect(service.get()).toEqual '<%= lowerCamel %>'