/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('<%= lowerCamel %>', function () {
  var scope
    , element;

  beforeEach(module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>', '<%= templateUrl %>/<%= hyphenName %>-directive.tpl.html'));

  beforeEach(inject(function ($compile, $rootScope) {
    scope = $rootScope.$new();
    element = angular.element('<<%= hyphenName %>></<%= hyphenName %>>');
    $compile(element)($rootScope);
  }));

  it('should have correct text', function () {
    scope.$digest();
    expect(element.html()).<% if (testFramework === 'mocha') { %>to.equal<% } else { %>toEqual<% } %>('<%= lowerCamel %>\n[object Object]\n[object Object]');
  });

});
