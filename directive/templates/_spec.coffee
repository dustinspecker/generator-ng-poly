###global describe, beforeEach, it, expect, inject, module###
'use strict'

describe '<%= dirName %>', ->
  scope = undefined
  element = undefined

  beforeEach module('<%= appName %>', 'templates/<%= dirName %>.html')

  beforeEach inject ($compile, $rootScope) ->
    scope = $rootScope.$new()
    element = angular.element '<<%= dirName %>></<%= dirName %>>'
    $compile(element) $rootScope

  it 'should have correct text', ->
    scope.$digest()
    expect(element.html()).toEqual '<%= dirName %>\n[object Object]\n[object Object]'