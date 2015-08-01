/* global describe, beforeEach, it, expect, inject, module */
'use strict';

describe('<%= upperCamel %>', () => {
  let factory;

  beforeEach(module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>'));

  beforeEach(inject((<%= upperCamel %>) => {
    factory = <%= upperCamel %>;
  }));

  it('should have someValue be <%= upperCamel %>', () => {
    expect(factory.someValue).<% if (testFramework === 'mocha') { %>to.equal<% } else { %>toEqual<% } %>('<%= upperCamel %>');
  });

  it('should have someMethod return <%= upperCamel %>', () => {
    expect(factory.someMethod()).<% if (testFramework === 'mocha') { %>to.equal<% } else { %>toEqual<% } %>('<%= upperCamel %>');
  });
});
