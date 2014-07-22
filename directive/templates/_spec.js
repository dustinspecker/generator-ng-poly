/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('<%= lowerCamel %>', function () {
  var scope;
  var element;

  beforeEach(module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>', '<%= modulePath %>/<%= hyphenName %>-directive.tpl.html'));

  beforeEach(inject(function ($compile, $rootScope) {
    scope = $rootScope.$new();
    element = angular.element('<<%= hyphenName %>></<%= hyphenName %>>');
    $compile(element)($rootScope);
  }));

  it('should have correct text', function () {
    scope.$digest();
    expect(element.html()).toEqual('<%= lowerCamel %>\n[object Object]\n[object Object]');
  });

});