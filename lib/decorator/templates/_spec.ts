///<reference path='<%= referencePath %>' />

/* global describe, beforeEach, it, expect, inject, module */
'use strict';

describe('<%= name %>', function () {
  var decorator;

  beforeEach(module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>'));

  beforeEach(inject(function (<%= name %>) {
    decorator = <%= name %>;
  }));

  it('should have simpleFunction return <%= name %>', function () {
    expect(decorator.simpleFunction()).<% if (testFramework === 'mocha') { %>to.equal<% } else { %>toEqual<% } %>('<%= name %>');
  });
});
