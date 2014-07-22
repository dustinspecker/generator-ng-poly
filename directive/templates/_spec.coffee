###global describe, beforeEach, it, expect, inject, module###
'use strict'

describe '<%= lowerCamel %>', ->
  scope = undefined
  element = undefined

  beforeEach module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>', '<%= modulePath %>/<%= hyphenName %>-directive.tpl.html')

  beforeEach inject ($compile, $rootScope) ->
    scope = $rootScope.$new()
    element = angular.element '<<%= lowerCamel %>></<%= lowerCamel %>>'
    $compile(element) $rootScope

  it 'should have correct text', ->
    scope.$digest()
    expect(element.html()).toEqual '<%= lowerCamel %>\n[object Object]\n[object Object]'