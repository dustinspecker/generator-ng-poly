///<reference path='<%= referencePath %>' />

/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('<%= upperCamel %>', function () {
  var constant;

  beforeEach(module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>'));

  beforeEach(inject(function (<%= upperCamel %>) {
    constant = <%= upperCamel %>;
  }));

  it('should equal 0', function () {
    expect(constant).<% if (testFramework === 'mocha') { %>to.equal<% } else { %>toBe<% } %>(0);
  });

});
