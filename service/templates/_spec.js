/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('<%= serviceName %>', function () {
  var service;

  beforeEach(module('<%= appName %>'));

  beforeEach(inject(function (<%= serviceName %>) {
    service = <%= serviceName %>;
  }));

  it('should equal <%= serviceName %>', function () {
    expect(service.get()).toEqual('<%= serviceName %>');
  });

});