###global Polymer###
'use strict'

element = new Polymer '<%= hyphenName %>',
  name: '<%= hyphenName %>'
  domReady: ->
    console.log '<%= hyphenName %>'

element
