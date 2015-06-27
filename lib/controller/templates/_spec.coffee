###global describe, beforeEach, it, expect, inject, module###
'use strict'

describe '<%= ctrlName %>', ->
  <% if (controllerAs) { %>ctrl = undefined<% } else { %>scope = undefined<% } %>

  beforeEach module '<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>'

  beforeEach inject ($rootScope, $controller) ->
    <% if (controllerAs) { %>ctrl = $controller '<%= ctrlName %>'<% } else { %>scope = $rootScope.$new()
    $controller '<%= ctrlName %>', $scope: scope<% } %>

  it 'should have ctrlName as <%= ctrlName %>', ->
    <% if (controllerAs) { %>expect(ctrl.ctrlName).<% if (testFramework === 'mocha') { %>to.equal<% } else { %>toEqual<% } %> '<%= ctrlName %>'<% } else { %>expect(scope.<%= lowerCamel %>.ctrlName).<% if (testFramework === 'mocha') { %>to.equal<% } else { %>toEqual<% } %> '<%= ctrlName %>'<% } %>

