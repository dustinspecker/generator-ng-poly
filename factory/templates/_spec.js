/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('<%= upperCamel %>', function () {
  var factory;

  beforeEach(module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>'));

  beforeEach(inject(function (<%= upperCamel %>) {
    factory = <%= upperCamel %>;
  }));

  it('should have someValue be <%= upperCamel %>', function () {
    expect(factory.someValue).toEqual('<%= upperCamel %>');
  });

  it('should have someMethod return <%= upperCamel %>', function () {
    expect(factory.someMethod()).toEqual('<%= upperCamel %>');
  });

});