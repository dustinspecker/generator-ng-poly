///<reference path='<%= referencePath %>' />
/*global Polymer*/
module UpperCamel {
  'use strict';

  var element = new Polymer('<%= hyphenName %>', {
    name: '<%= hyphenName %>',
    domReady: function () {
      console.log('<%= hyphenName %>');
    }
  });

  return element;
}
