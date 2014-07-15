/*global Polymer*/
'use strict';
(function () {
  var element = new Polymer('<%= elementName %>', {
    name: '<%= elementName %>',
    domReady: function () {
      console.log('<%= elementName %>');
    }
  });
  return element;
}());