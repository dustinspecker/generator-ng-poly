###global describe, beforeEach, it, expect, inject, module###
'use strict'

describe '<%= factoryName %>', ->
  factory = undefined

  beforeEach module '<%= appName %>'

  beforeEach inject (<%= factoryName %>) ->
    factory = <%= factoryName %>

  it 'should equal 0', ->
    expect(factory).toEqual '<%= factoryName %>'