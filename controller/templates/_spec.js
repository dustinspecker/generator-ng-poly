/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('<%= ctrlName %>', function () {
  var scope;

  beforeEach(module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>'));

  beforeEach(inject(function ($rootScope, $controller) {
    scope = $rootScope.$new();
    $controller('<%= ctrlName %>', {$scope: scope});
  }));

  it('should have ctrlName as <%= ctrlName %>', function () {
    expect(scope.ctrlName).toEqual('<%= ctrlName %>');
  });

});