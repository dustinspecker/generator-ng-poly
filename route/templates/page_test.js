/*global describe, beforeEach, it, browser, expect */
'use strict';

var buildConfigFile = require('findup-sync')('build.config.js')
  , buildConfig = require(buildConfigFile);

describe('<%= humanName %> page', function () {
  var <%= lowerCamel %>Page = require('./<%= hyphenName %>.po');

  beforeEach(function () {
    browser.driver.get(buildConfig.host + ':' + buildConfig.port + '/#/<% lowerCamel %>');
  });

  it('should say <%= ctrlName %>', function () {
    expect(<%= lowerCamel %>Page.heading.getText()).toEqual('<%= lowerCamel %>');
    expect(<%= lowerCamel %>Page.text.getText()).toEqual('<%= ctrlName %>');
  });
});
