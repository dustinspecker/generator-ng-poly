'use strict';

angular.module('<%= appName %>').service('<%= lowerCamel %>', function () {
  function <%= upperCamel %> () {}
  <%= upperCamel %>.prototype.get = function () {
    return '<%= lowerCamel %>';
  };

  return new <%= upperCamel %>();
});