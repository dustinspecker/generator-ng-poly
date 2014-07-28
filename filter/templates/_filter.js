'use strict';

angular.module('<% if (parentModuleName) { %><%= parentModuleName %>.<% } %><%= moduleName %>').filter('<%= lowerCamel %>', function <% if (namedFunc) { %><%= lowerCamel %><% } %>() {
  return function (input) {
    var temp = [];
    angular.forEach(input, function (item) {
      if(item > 3) {
        temp.push(item);
      }
    });
    return temp;
  };
});