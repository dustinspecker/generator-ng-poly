'use strict';

angular.module('<%= appName %>').service('<%= serviceName %>', function () {
  function <%= upperServiceName %> () {}
  <%= upperServiceName %>.prototype.get = function () {
    return '<%= serviceName %>';
  };

  return new <%= upperServiceName %>();
});