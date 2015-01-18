///<reference path='<%= referencePath %>' />

/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('<%= upperCamel %>', function () {
  var value;

  beforeEach(module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>'));

  beforeEach(inject(function (<%= upperCamel %>) {
    value = <%= upperCamel %>;
  }));

  it('should equal 0', function () {
    expect(value).<% if (testFramework === 'mocha') { %>to.equal<% } else { %>toBe<% } %>(0);
  });

});
