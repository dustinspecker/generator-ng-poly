###global describe, beforeEach, it, expect, inject, module###
'use strict'

describe '<%= serviceName %>', ->
  service = undefined

  beforeEach module '<%= appName %>'

  beforeEach inject (<%= serviceName %>) ->
    service = <%= serviceName %>

  it 'should equal <%= serviceName %>', ->
    expect(service.get()).toEqual '<%= serviceName %>'