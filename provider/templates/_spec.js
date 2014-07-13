/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('<%= providerName %>', function () {
  var provider;

  beforeEach(module('<%= appName %>'));

  beforeEach(inject(function (<%= providerName %>) {
    provider = <%= providerName %>;
  }));

  it('should equal <%= providerName %>', function () {
    expect(provider.$get()).toEqual('<%= providerName %>');
  });

});