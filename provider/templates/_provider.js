'use strict';

angular.module('<%= appName %>').factory('<%= lowerCamel %>', function () {
  return {
    $get: function () {
      return '<%= lowerCamel %>';
    }
  };
});