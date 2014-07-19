'use strict';

angular.module('<%= appName %>').directive('<%= lowerCamel %>', function () {
  return {
    restrict: 'AE',
    scope: {},
    templateUrl: 'templates/<%= lowerCamel %>.html', 
    replace: false,
    link: function (scope, element, attrs) {
      element.text('<%= lowerCamel %>\n' + scope + '\n' + attrs);
    }
  };
});