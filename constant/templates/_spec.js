/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('<%= lowerCamel %>', function () {
  var constant;

  beforeEach(module('<%= appName %>'));

  beforeEach(inject(function (<%= lowerCamel %>) {
    constant = <%= lowerCamel %>;
  }));

  it('should equal 0', function () {
    expect(constant).toBe(0);
  });

});