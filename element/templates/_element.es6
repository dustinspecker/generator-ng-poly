/*global Polymer*/
(() => {
  'use strict';

  let element = new Polymer('<%= hyphenName %>', {
    name: '<%= hyphenName %>',
    domReady: () => {
      console.log('<%= hyphenName %>');
    }
  });

  return element;
}());
