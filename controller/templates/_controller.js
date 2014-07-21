'use strict';

angular.module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>').controller('<%= ctrlName %>', function ($scope) {
  $scope.ctrlName = '<%= ctrlName %>';
});