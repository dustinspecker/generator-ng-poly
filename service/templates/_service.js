(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>.service:<%= upperCamel %>
   *
   * @description
   *
   */
  angular
    .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')
    .service('<%= upperCamel %>', <%= upperCamel %>);

  function <%= upperCamel %>() {
    var self = this;

    self.get = function () {
      return '<%= upperCamel %>';
    };
  }
}());
