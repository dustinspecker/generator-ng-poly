/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('<%= lowerCamel %>', function () {
  var factory;

  beforeEach(module('<%= appName %>'));

  beforeEach(inject(function (<%= lowerCamel %>) {
    factory = <%= lowerCamel %>;
  }));

  it('should equal 0', function () {
    expect(factory).toEqual('<%= lowerCamel %>');
  });

});