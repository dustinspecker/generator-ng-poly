/* global element, by */
'use strict';

function <%= upperCamel %>Page() {
  this.text = element(by.tagName('p'));
  this.heading = element(by.tagName('h2'));
}

module.exports = <%= upperCamel %>Page;
