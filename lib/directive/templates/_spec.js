/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('<%= lowerCamel %>', function () {
  var scope
    , element;

  beforeEach(module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>', '<%= templateUrl %>/<%= hyphenName %>-directive.tpl.html'));

  beforeEach(inject(function ($compile, $rootScope) {
    scope = $rootScope.$new();
    element = $compile(angular.element('<<%= hyphenName %>></<%= hyphenName %>>'))(scope);
  }));

  it('should have correct text', function () {
    scope.$apply();
    expect(element.isolateScope().<%= lowerCamel %>.name).<% if (testFramework === 'mocha') { %>to.equal<% } else { %>toEqual<% } %>('<%= lowerCamel %>');
  });
});
