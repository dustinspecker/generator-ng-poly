'use strict';

angular.module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>', ['ui.router']);

angular.module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>').config(function ($stateProvider) {
  $stateProvider
    .state('<%= moduleName %>', {
      url: '/<%= moduleName %>',
      templateUrl: '<%= templateUrl %>/<%= hyphenName %>.tpl.html',
      controller: '<%= upperModule %>Ctrl'
    });
});