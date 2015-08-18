/* global describe, beforeEach, it, expect, inject, module */
'use strict';

describe('<%= lowerCamel %>', () => {
  let scope
    , element;

  beforeEach(module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>'<% if (directiveTemplateUrl) { %>, '<%= templateUrl %>/<%= hyphenName %>-directive.tpl.html'<% } %>));

  beforeEach(inject(($compile, $rootScope) => {
    scope = $rootScope.$new();
    element = $compile(angular.element('<<%= hyphenName %>></<%= hyphenName %>>'))(scope);
  }));

  it('should have correct text', () => {
    scope.$apply();
    expect(element.isolateScope().<%= lowerCamel %>.name).<% if (testFramework === 'mocha') { %>to.equal<% } else { %>toEqual<% } %>('<%= lowerCamel %>');
  });
});
