<% if (analysis.routeStartIndex === -1) { %>$stateProvider
<% } %>  .state '<%= state.name %>',
    url: '<%= state.url %>'
    templateUrl: '<%= state.templateUrl %>'<% if (!config.skipController) { %>
    controller: '<%= state.ctrlName %>'<% if (config.controllerAs) { %>
    controllerAs: '<%= state.lowerCamel %>'<% } %><% } %>