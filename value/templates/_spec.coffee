###global describe, beforeEach, it, expect, inject, module###
'use strict'

describe '<%= lowerCamel %>', ->
  value = undefined

  beforeEach module '<%= appName %>'

  beforeEach inject (<%= lowerCamel %>) ->
    value = <%= lowerCamel %>

  it 'should equal 0', ->
    expect(value).toBe 0