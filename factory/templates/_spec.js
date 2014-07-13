/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('<%= factoryName %>', function () {
  var factory;

  beforeEach(module('<%= appName %>'));

  beforeEach(inject(function (<%= factoryName %>) {
    factory = <%= factoryName %>;
  }));

  it('should equal 0', function () {
    expect(factory).toEqual('<%= factoryName %>');
  });

});