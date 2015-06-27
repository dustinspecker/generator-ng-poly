###global element, By###
'use strict'

class <%= upperCamel %>Page
  constructor: ->
    @text = element By.tagName('p')
    @heading = element By.tagName('h2')

module.exports = <%= upperCamel %>Page
