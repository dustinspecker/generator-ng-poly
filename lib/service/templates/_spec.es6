/* global describe, beforeEach, it, expect, inject, module */
'use strict';

describe('<%= upperCamel %>', () => {
  let service;

  beforeEach(module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>'));

  beforeEach(inject((<%= upperCamel %>) => {
    service = <%= upperCamel %>;
  }));

  it('should equal <%= upperCamel %>', () => {
    expect(service.get()).<% if (testFramework === 'mocha') { %>to.equal<% } else { %>toEqual<% } %>('<%= upperCamel %>');
  });
});
