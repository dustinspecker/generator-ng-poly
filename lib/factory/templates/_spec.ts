///<reference path='<%= referencePath %>' />

/* global describe, beforeEach, it, expect, inject, module */
'use strict';

describe('<%= upperCamel %>', function () {
  var factory;

  beforeEach(module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>'));

  beforeEach(inject(function (<%= upperCamel %>) {
    factory = <%= upperCamel %>;
  }));

  it('should have someValue be <%= upperCamel %>', function () {
    expect(factory.someValue).<% if (testFramework === 'mocha') { %>to.equal<% } else { %>toEqual<% } %>('<%= upperCamel %>');
  });

  it('should have someMethod return <%= upperCamel %>', function () {
    expect(factory.someMethod()).<% if (testFramework === 'mocha') { %>to.equal<% } else { %>toEqual<% } %>('<%= upperCamel %>');
  });

});
