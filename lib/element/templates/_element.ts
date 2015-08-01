///<reference path='<%= referencePath %>' />
/* global Polymer */
module UpperCamel {
  'use strict';

  var element = new Polymer({
    is: '<%= hyphenName %>',
    ready: function () {
      console.log('<%= hyphenName %>');
    }
  });

  return element;
}
