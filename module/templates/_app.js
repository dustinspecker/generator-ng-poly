'use strict';

angular.module('<%= moduleName %>', []);

angular.module('<%= moduleName %>').config(function ($stateProvider) {
  $stateProvider
    .state('<%= moduleName %>', {
      url: '/<%= moduleName %>',
      templateUrl: '<%= moduleName %>/<%= moduleName %>.tpl.html',
      controller: '<%= upperModule %>Ctrl'
    });
});