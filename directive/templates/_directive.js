'use strict';

angular.module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>').directive('<%= lowerCamel %>', function <% if (namedFunc) { %><%= lowerCamel %><% } %>() {
  return {
    restrict: 'AE',
    scope: {},
    templateUrl: '<%= modulePath %>/<%= hyphenName %>-directive.tpl.html', 
    replace: false,
    link: function (scope, element, attrs) {
      element.text('<%= lowerCamel %>\n' + scope + '\n' + attrs);
    }
  };
});