/* global describe, beforeEach, it, expect, inject, module */
'use strict';

describe('<%= name %>', () => {
  let decorator;

  beforeEach(module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>'));

  beforeEach(inject((<%= name %>) => {
    decorator = <%= name %>;
  }));

  it('should have simpleFunction return <%= name %>', () => {
    expect(decorator.simpleFunction()).<% if (testFramework === 'mocha') { %>to.equal<% } else { %>toEqual<% } %>('<%= name %>');
  });
});
