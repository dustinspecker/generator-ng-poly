###global describe, beforeEach, it, expect, inject, module###
'use strict'

describe '<%= lowerCamel %>', ->
  provider = undefined

  beforeEach module '<%= appName %>'

  beforeEach inject (<%= lowerCamel %>) ->
    provider = <%= lowerCamel %>

  it 'should equal <%= lowerCamel %>', ->
    expect(provider.$get()).toEqual '<%= lowerCamel %>'