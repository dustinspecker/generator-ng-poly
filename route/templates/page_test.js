/*global describe, beforeEach, it, browser, expect */
'use strict';

var buildConfigFile = require('findup-sync')('build.config.js')
  , buildConfig = require(buildConfigFile)
  , <%= upperCamel %>PagePo = require('./<%= hyphenName %>.po');

describe('<%= humanName %> page', function () {
  var <%= lowerCamel %>Page;

  beforeEach(function () {
    <%= lowerCamel %>Page = new <%= upperCamel %>PagePo();
    browser.driver.get(buildConfig.host + ':' + buildConfig.port + '/#/<%= lowerCamel %>');
  });

  it('should say <%= ctrlName %>', function () {
    expect(<%= lowerCamel %>Page.heading.getText()).toEqual('<%= lowerCamel %>');
    expect(<%= lowerCamel %>Page.text.getText()).toEqual('<%= ctrlName %>');
  });
});
