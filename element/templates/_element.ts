///<reference path='<%= referencePath %>/references.d.ts' />

/*global Polymer*/
(function () {
  'use strict';

  var element = new Polymer('<%= hyphenName %>', {
    name: '<%= hyphenName %>',
    domReady: function () {
      console.log('<%= hyphenName %>');
    }
  });

  return element;
}());
