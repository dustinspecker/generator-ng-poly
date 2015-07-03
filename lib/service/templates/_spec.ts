///<reference path='<%= referencePath %>' />

/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('<%= upperCamel %>', function () {
  var service;

  beforeEach(module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>'));

  beforeEach(inject(function (<%= upperCamel %>) {
    service = <%= upperCamel %>;
  }));

  it('should equal <%= upperCamel %>', function () {
    expect(service.get()).<% if (testFramework === 'mocha') { %>to.equal<% } else { %>toEqual<% } %>('<%= upperCamel %>');
  });

});
