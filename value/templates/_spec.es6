/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('<%= upperCamel %>', () => {
  let value;

  beforeEach(module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>'));

  beforeEach(inject((<%= upperCamel %>) => {
    value = <%= upperCamel %>;
  }));

  it('should equal 0', () => {
    expect(value).<% if (testFramework === 'mocha') { %>to.equal<% } else { %>toBe<% } %>(0);
  });
});
