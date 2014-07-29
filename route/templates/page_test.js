/*global describe, beforeEach, it, browser, expect */
'use strict';

describe('<%= humanName %> page', function () {
  var <%= lowerCamel %>Page = require('./<%= hyphenName %>.po');

  beforeEach(function () {
    browser.get('http://localhost:8080/#/<%= lowerCamel %>');
  });

  it('should say <%= ctrlName %>', function() {
    expect(<%= lowerCamel %>Page.heading.getText()).toEqual('<%= lowerCamel %>');
    expect(<%= lowerCamel %>Page.text.getText()).toEqual('<%= ctrlName %>');
  });
});