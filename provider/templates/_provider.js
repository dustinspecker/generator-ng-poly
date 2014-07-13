'use strict';

angular.module('<%= appName %>').factory('<%= providerName %>', function () {
  return {
    $get: function () {
      return '<%= providerName %>';
    }
  };
});