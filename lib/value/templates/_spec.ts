///<reference path='<%= referencePath %>' />

/* global describe, beforeEach, it, expect, inject, module */
'use strict';

describe('<%= lowerCamel %>', function () {
  var value;

  beforeEach(module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>'));

  beforeEach(inject(function (<%= lowerCamel %>) {
    value = <%= lowerCamel %>;
  }));

  it('should equal 0', function () {
    expect(value).<% if (testFramework === 'mocha') { %>to.equal<% } else { %>toBe<% } %>(0);
  });

});
