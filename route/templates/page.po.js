/*global element, by*/
'use strict';

var <%= upperCamel %>Page = function () {
  this.text = element(by.tagName('p'));
  this.heading = element(by.tagName('h2'));
};

module.exports = <%= upperCamel %>Page;
