/* global describe, beforeEach, it, expect, inject, module */
'use strict';

describe('<%= upperCamel %>', () => {
  let provider;

  beforeEach(module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>'));

  beforeEach(inject((<%= upperCamel %>) => {
    provider = <%= upperCamel %>;
  }));

  it('should equal <%= upperCamel %>', () => {
    expect(provider).<% if (testFramework === 'mocha') { %>to.equal<% } else { %>toEqual<% } %>('<%= upperCamel %>');
  });
});
