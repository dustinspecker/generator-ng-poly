/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('<%= upperCamel %>', function () {
  var factory;

  beforeEach(module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>'));

  beforeEach(inject(function (<%= upperCamel %>) {
    factory = <%= upperCamel %>;
  }));

  it('should equal 0', function () {
    expect(factory).toEqual('<%= upperCamel %>');
  });

});