/* global Polymer */
(function () {
  'use strict';

  var element = new Polymer({
    is: '<%= hyphenName %>',
    ready: function () {
      console.log('<%= hyphenName %>');
    }
  });

  return element;
}());
