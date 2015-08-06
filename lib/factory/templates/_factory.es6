(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>.factory:<%= upperCamel %>
   *
   * @description
   *
   */
  angular
    .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')
    .factory('<%= upperCamel %>', <%= upperCamel %>);

  function <%= upperCamel %>() {
    let <%= upperCamel %>Base = {};
    <%= upperCamel %>Base.someValue = '<%= upperCamel %>';
    <%= upperCamel %>Base.someMethod = () => {
      return '<%= upperCamel %>';
    };
    return <%= upperCamel %>Base;
  }
}());
