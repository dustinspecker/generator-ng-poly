/* global Polymer */
(function () {
  'use strict';

  let element = new Polymer({
    is: '<%= hyphenName %>',
    ready: () => {
      console.log('<%= hyphenName %>');
    }
  });

  return element;
}());
