/* global describe, beforeEach, it, expect, inject, module */
'use strict';

describe('<%= ctrlName %>', function () {
  <% if (controllerAs) { %>var ctrl;<% } else { %>var scope;<% } %>

  beforeEach(module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>'));

  beforeEach(inject(function ($rootScope, $controller) {
    <% if (controllerAs) { %>ctrl = $controller('<%= ctrlName %>');<% } else { %>scope = $rootScope.$new();
    $controller('<%= ctrlName %>', {$scope: scope});<% } %>
  }));

  it('should have ctrlName as <%= ctrlName %>', function () {
    <% if (controllerAs) { %>expect(ctrl.ctrlName).<% if (testFramework === 'mocha') { %>to.equal<% } else { %>toEqual<% } %>('<%= ctrlName %>');<% } else { %>expect(scope.<%= lowerCamel %>.ctrlName).<% if (testFramework === 'mocha') { %>to.equal<% } else { %>toEqual<% } %>('<%= ctrlName %>');<% } %>
  });
});
