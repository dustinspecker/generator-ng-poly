///<reference path='<%= referencePath %>' />
module <%= upperCamel %> {
  'use strict';<% if (!controllerAs) { %>
  interface I<%= upperCamel %>Scope extends ng.IScope {
    <%= lowerCamel %>: any
  }<% } %>

  function <%= upperCamel %>Directive(): ng.IDirective {
    return {
      restrict: 'EA',
      scope: {}<% if (directiveTemplateUrl) { %>,
      templateUrl: '<%= templateUrl %>/<%= hyphenName %>-directive.tpl.html'<% } else { %>,
      template: '<div>{{<%= lowerCamel %>.name}}</div>'<% } %>,
      replace: false,<% if (controllerAs) { %>
      controllerAs: '<%= lowerCamel %>',<% } %>
      controller: <% if (!controllerAs) { %>function($scope: I<%= upperCamel %>Scope): void {
          $scope.<%= lowerCamel %> = {};
          $scope.<%= lowerCamel %>.name = '<%= lowerCamel %>';
      },<% } else { %><%= upperCamel %>Controller,<% } %>
      link: function (scope: ng.IScope, element: JQuery, attrs: any): void {
        /*jshint unused:false */
        /*eslint "no-unused-vars": [2, {"args": "none"}]*/
      }
    }
  }<% if (controllerAs) { %>

  export class <%= upperCamel %>Controller {
    public name: string;
    public static $inject: Array<string> = [];

    constructor() {
      this.name = '<%= lowerCamel %>';
    }
  }<% } %>

  /**
  * @ngdoc directive
  * @name <% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>.directive:<%= lowerCamel %>
  * @restrict EA
  * @element
  *
  * @description
  *
  * @example
  *   <example module="<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>">
  *       <file name="index.html">
  *           <<%= hyphenName %>></<%= hyphenName %>>
  *       </file>
  *   </example>
  *
  */
  angular
    .module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>')
    .directive('<%= lowerCamel %>', <%= upperCamel %>Directive);
}
