'use strict';<% if (passFunc) { %>

/* @ngInject */
function <%= lowerCamel %>() {
  return {
    restrict: 'EA',
    scope: {},
    templateUrl: '<%= modulePath %>/<%= hyphenName %>-directive.tpl.html', 
    replace: false,
    link: function (scope, element, attrs) {
      element.text('<%= lowerCamel %>\n' + scope + '\n' + attrs);
    }
  };
}<% } %>

angular
  .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')<% if (passFunc) { %>
  .directive('<%= lowerCamel %>', <%= lowerCamel %>);<% } else { %>
  .directive('<%= lowerCamel %>', function <% if (namedFunc) { %><%= lowerCamel %><% } %>() {
    return {
      restrict: 'AE',
      scope: {},
      templateUrl: '<%= modulePath %>/<%= hyphenName %>-directive.tpl.html', 
      replace: false,
      link: function (scope, element, attrs) {
        element.text('<%= lowerCamel %>\n' + scope + '\n' + attrs);
      }
    };
  });<% } %>