///<reference path='<%= referencePath %>/references.d.ts' />

/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('<%= upperCamel %>', function () {
  var factory;

  beforeEach(module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>'));

  beforeEach(inject(function (<%= upperCamel %>) {
    factory = <%= upperCamel %>;
  }));

  it('should have getGreeting return <%= upperCamel %>', function () {
    expect(factory.getGreeting('world')).<% if (testFramework === 'mocha') { %>to.equal<% } else { %>toEqual<% } %>('greeting world');
  });

});
