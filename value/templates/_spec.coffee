###global describe, beforeEach, it, expect, inject, module###
'use strict'

describe '<%= valueName %>', ->
  value = undefined

  beforeEach module '<%= appName %>'

  beforeEach inject (<%= valueName %>) ->
    value = <%= valueName %>

  it 'should equal 0', ->
    expect(value).toBe 0