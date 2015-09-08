///<reference path='<%= referencePath %>' />

/* global describe, beforeEach, it, expect, inject, module */
'use strict';

describe('<%= lowerCamel %>', function () {
  var constant;

  beforeEach(angular.mock.module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>'));

  beforeEach(inject(function (<%= lowerCamel %>) {
    constant = <%= lowerCamel %>;
  }));

  it('should equal 0', function () {
    expect(constant).<% if (testFramework === 'mocha') { %>to.equal<% } else { %>toBe<% } %>(0);
  });
});
