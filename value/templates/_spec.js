/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('<%= valueName %>', function () {
  var value;

  beforeEach(module('<%= appName %>'));

  beforeEach(inject(function (<%= valueName %>) {
    value = <%= valueName %>;
  }));

  it('should equal 0', function () {
    expect(value).toBe(0);
  });

});