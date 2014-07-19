###global describe, beforeEach, it, expect, inject, module###
'use strict'

describe '<%= constantName %>', ->
  constant = undefined

  beforeEach module '<%= appName %>'

  beforeEach inject (<%= constantName %>) ->
    constant = <%= constantName %>

  it 'should equal 0', ->
    expect(constant).toBe 0