###global describe, beforeEach, it, expect, inject, module###
'use strict'

describe '<%= providerName %>', ->
  provider = undefined

  beforeEach module '<%= appName %>'

  beforeEach inject (<%= providerName %>) ->
    provider = <%= providerName %>

  it 'should equal <%= providerName %>', ->
    expect(provider.$get()).toEqual '<%= providerName %>'