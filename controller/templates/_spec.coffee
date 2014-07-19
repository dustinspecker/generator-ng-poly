###global describe, beforeEach, it, expect, inject, module###
'use strict'

describe '<%= ctrlName %>', ->
  scope = undefined

  beforeEach module '<%= appName %>'

  beforeEach inject ($rootScope, $controller) ->
    scope = $rootScope.$new()
    $controller '<%= ctrlName %>', $scope: scope

  it 'should have ctrlName as <%= ctrlName %>', ->
    expect(scope.ctrlName).toEqual '<%= ctrlName %>'