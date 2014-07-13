/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('<%= dirName %>', function () {
  var scope;
  var element;

  beforeEach(module('<%= appName %>', 'templates/<%= dirName %>.html'));

  beforeEach(inject(function ($compile, $rootScope) {
    scope = $rootScope.$new();
    element = angular.element('<<%= dirName %>></<%= dirName %>>');
    $compile(element)($rootScope);
  }));

  it('should have correct text', function () {
    scope.$digest();
    expect(element.html()).toEqual('<%= dirName %>\n[object Object]\n[object Object]');
  });

});