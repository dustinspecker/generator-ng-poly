/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('<%= constantName %>', function () {
  var constant;

  beforeEach(module('<%= appName %>'));

  beforeEach(inject(function (<%= constantName %>) {
    constant = <%= constantName %>;
  }));

  it('should equal 0', function () {
    expect(constant).toBe(0);
  });

});