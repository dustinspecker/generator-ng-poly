'use strict';

angular.module('<%= appName %>').directive('<%= dirName %>', function () {
  return {
    restrict: 'AE',
    scope: {},
    templateUrl: 'templates/<%= dirName %>.html', 
    replace: false,
    link: function (scope, element, attrs) {
      element.text('<%= dirName %>\n' + scope + '\n' + attrs);
    }
  };
});