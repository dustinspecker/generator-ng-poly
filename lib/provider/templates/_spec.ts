///<reference path='<%= referencePath %>' />

/* global describe, beforeEach, it, expect, inject, module */
'use strict';

describe('<%= upperCamel %>', function () {
  var provider;

  beforeEach(module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>'));

  beforeEach(inject(function (<%= upperCamel %>) {
    provider = <%= upperCamel %>;
  }));

  it('should equal <%= upperCamel %>', function () {
    expect(provider).<% if (testFramework === 'mocha') { %>to.equal<% } else { %>toEqual<% } %>('<%= upperCamel %>');
  });

});
