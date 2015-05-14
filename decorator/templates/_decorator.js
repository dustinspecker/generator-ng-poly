(function () {
  'use strict';

  /**
   * @ngdoc decorator
   * @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>.decorator:<%= name %>
   * @restrict EA
   * @element
   *
   * @description
   *
   */
  angular
    .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')
    .config(decorator);

  function decorator($provide) {
    $provide.decorator('<%= name %>', function ($delegate) {
      $delegate.simpleFunction = function () {
        return '<%= name %>';
      };
      return $delegate;
    });
  }
}());
