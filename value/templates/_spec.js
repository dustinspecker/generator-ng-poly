/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('<%= lowerCamel %>', function () {
  var value;

  beforeEach(module('<%= appName %>'));

  beforeEach(inject(function (<%= lowerCamel %>) {
    value = <%= lowerCamel %>;
  }));

  it('should equal 0', function () {
    expect(value).toBe(0);
  });

});