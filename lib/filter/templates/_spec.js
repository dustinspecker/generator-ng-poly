/* global describe, beforeEach, it, expect, inject, module */
'use strict';

describe('<%= lowerCamel %>', function () {
  beforeEach(module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>'));

  it('should filter our numbers not greater than 3', inject(function ($filter) {
    expect($filter('<%= lowerCamel %>')([1, 2, 3, 4])).<% if (testFramework === 'mocha') { %>to.include.members<% } else { %>toEqual<% } %>([4]);
  }));
});
