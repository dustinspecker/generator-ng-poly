/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('<%= lowerCamel %>', function () {
  var service;

  beforeEach(module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>'));

  beforeEach(inject(function (<%= lowerCamel %>) {
    service = <%= lowerCamel %>;
  }));

  it('should equal <%= lowerCamel %>', function () {
    expect(service.get()).toEqual('<%= lowerCamel %>');
  });

});