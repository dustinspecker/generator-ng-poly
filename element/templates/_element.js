/*global Polymer*/
'use strict';
(function () {
  var element = new Polymer('<%= hyphenName %>', {
    name: '<%= hyphenName %>',
    domReady: function () {
      console.log('<%= hyphenName %>');
    }
  });
  return element;
}());