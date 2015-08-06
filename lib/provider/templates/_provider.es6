(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>.provider:<%= upperCamel %>
   *
   * @description
   *
   */
  angular
    .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')
    .provider('<%= upperCamel %>', <%= upperCamel %>);

  function <%= upperCamel %>() {
    return {
      $get() {
        return '<%= upperCamel %>';
      }
    };
  }
}());
