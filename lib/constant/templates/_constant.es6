(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>.constant:<%= lowerCamel %>
   *
   * @description
   *
   */
  angular
    .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')
    .constant('<%= lowerCamel %>', 0);
}());
