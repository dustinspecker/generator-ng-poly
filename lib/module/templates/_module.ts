///<reference path='<%= referencePath %>' />
module <%= moduleName %> {
  'use strict';

  /* @ngdoc object
  * @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>
  * @description
  *
  */
  angular
    .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>', [
    ]);
}
