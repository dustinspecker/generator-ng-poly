###global describe, beforeEach, it, browser, expect ###
'use strict'

buildConfigFile = require('findup-sync') 'build.config.js'
buildConfig = require buildConfigFile

describe '<%= humanName %> page', ->
  <%= lowerCamel %>Page = require './<%= hyphenName %>.po'

  beforeEach ->
    browser.driver.get buildConfig.host + ':' + buildConfig.port + '/#/<% lowerCamel %>'

  it 'should say <%= ctrlName %>', ->
    expect(<%= lowerCamel %>Page.heading.getText()).toEqual '<%= lowerCamel %>'
    expect(<%= lowerCamel %>Page.text.getText()).toEqual '<%= ctrlName %>'
