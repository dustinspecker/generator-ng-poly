<% if (analysis.routeStartIndex > -1) { %>  })
<% } else { %>$routeProvider
<% } %>  .when('<%= state.url %>', {
    templateUrl: '<%= state.templateUrl %>'<% if (!config.skipController) { %>,
    controller: '<%= state.ctrlName %>'<% if (config.controllerAs) { %>,
    controllerAs: '<%= state.lowerCamel %>'<% } %><% } %><% if (analysis.routeStartIndex === -1) { %>
  });<% } %>