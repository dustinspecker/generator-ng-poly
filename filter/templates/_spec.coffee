###global describe, beforeEach, it, expect, inject, module###
'use strict'

describe '<%= filterName %>', ->
  beforeEach module '<%= appName %>'

  it 'should filter our numbers not greater than 3', inject ($filter) ->
    expect($filter('<%= filterName %>')([1,2,3,4])).toEqual [4]