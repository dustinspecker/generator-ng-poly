<% if (analysis.routeStartIndex > -1) { %>  })
<% } else { %>$stateProvider
<% } %>  .state('<%= state.name %>', {
    url: '<%= state.url %>',
    templateUrl: '<%= state.templateUrl %>'<% if (!config.skipController) { %>,
    controller: '<%= state.ctrlName %>'<% if (config.controllerAs) { %>,
    controllerAs: '<%= state.lowerCamel %>'<% } %><% } %><% if (analysis.routeStartIndex === -1) { %>
  });<% } %>