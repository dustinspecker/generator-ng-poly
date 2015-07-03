(function () {
  'use strict';

  /* @ngdoc object
   * @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= lowerCamel %>
   * @description
   *
   */
  angular
    .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= lowerCamel %>', [
    ]);
}());
