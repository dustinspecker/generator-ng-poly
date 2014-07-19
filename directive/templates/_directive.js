'use strict';

angular.module('<%= appName %>').directive('<%= lowerCamel %>', function () {
  return {
    restrict: 'AE',
    scope: {},
    templateUrl: '<%= moduleName %>/<%= lowerCamel %>Directive.html', 
    replace: false,
    link: function (scope, element, attrs) {
      element.text('<%= lowerCamel %>\n' + scope + '\n' + attrs);
    }
  };
});