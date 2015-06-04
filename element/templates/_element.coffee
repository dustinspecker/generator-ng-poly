###global Polymer###
'use strict'

element = new Polymer
  is: '<%= hyphenName %>'
  ready: ->
    console.log '<%= hyphenName %>'

element
