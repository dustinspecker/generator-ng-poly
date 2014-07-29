###global describe, beforeEach, it, browser, expect ###
'use strict'

describe '<%= humanName %> page', ->
  <%= lowerCamel %>Page = require './<%= hyphenName %>.po'

  beforeEach ->
    browser.get 'http://localhost:8080/#/<%= lowerCamel %>'

  it 'should say <%= ctrlName %>', ->
    expect(<%= lowerCamel %>Page.heading.getText()).toEqual '<%= lowerCamel %>'
    expect(<%= lowerCamel %>Page.text.getText()).toEqual '<%= ctrlName %>'