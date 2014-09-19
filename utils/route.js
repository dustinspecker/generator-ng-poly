'use strict';
var endOfLine = require('os').EOL
  , exports = module.exports
  , moduleUtils = require('./module');

function numOfSpacesAtStart(line) {
  return line.substring(0, line.search(/[^ ]/)).length;
}

exports.addRoute = function addRoute(fileContents, state, config) {
  var dependency = config.ngRoute ? 'ngRoute' : 'ui.router'
    , param = config.ngRoute ? 'routeProvider' : 'stateProvider'
    , newRoute = config.ngRoute ? 'when' : 'state'

    // checking if provider is used
    , regex = new RegExp('function.*\\(.*\\$' + param + '.*\\)')
    , addParam = !regex.test(fileContents)

    // for determining where to place new state
    , routeStartIndex = -1
    , routeEndIndex = -1
    , braceCount = 0 // {}
    , configFunctionIndex = -1

    // for prepending spaces to new route
    , numOfSpaces = 0
    , lineToCheck = null

    , lines // split fileContents

    // new state insertion
    , insertLine
    , newState;

  // if file doesn't have the dependency, add it
  if (!moduleUtils.dependencyExists(fileContents, dependency)) {
    fileContents = moduleUtils.addDependency(fileContents, dependency);
  }

  lines = fileContents.split(endOfLine);

  // find line to add new state
  lines.forEach(function (line, i) {
    // add $stateProvider if needed
    if ((addParam && config.passFunc && line.indexOf('function config(') > -1) ||
      (addParam && !config.passFunc && line.indexOf('.config(function') > -1)) {
      // check if function has a parameter already
      if (line.lastIndexOf('(') === line.lastIndexOf(')') - 1) {
        lines[i] = lines[i].slice(0, line.lastIndexOf(')')) + '$' + param + ') {';
      } else {
        lines[i] = lines[i].slice(0, line.lastIndexOf(')')) + ', $' + param + ') {';
      }
    }

    if (line.indexOf('function config(') > -1 || line.indexOf('.config(function') > -1) {
      configFunctionIndex = i;
    }

    // look for .state and set routeStartIndex
    if (line.indexOf('.' + newRoute + '(') > -1) {
      routeStartIndex = i;
    }

    // open braces add to braceCount
    if (routeStartIndex > -1 && line.indexOf('{') > -1) {
      braceCount++;
    }

    // close braces subract from braceCount
    if (routeStartIndex > -1 && line.indexOf('}') > -1) {
      braceCount--;
    }

    // when braceCount = 0 the end of the state has been reached
    // set routeEndIndex
    if (routeStartIndex > -1 && braceCount === 0) {
      routeEndIndex = i;
    }

    // loop through everything to append new route at the end
  });

  // base route logic
  if (config.ngRoute) {
    newState = [
      '  .when(\'' + state.url + '\', {',
      '    templateUrl: \'' + state.templateUrl + '\','
    ];
  } else {
    newState = [
      '  .state(\'' + state.lowerCamel + '\', {',
      '    url: \'' + state.url + '\',',
      '    templateUrl: \'' + state.templateUrl + '\','
    ];
  }

  // controller as logic
  if (config.controllerAs && config.ngRoute) {
    newState.push('    controller: \'' + state.ctrlName + '\',');
    newState.push('    controllerAs: \'' + state.lowerCamel + '\'');
  } else if (config.controllerAs && !config.ngRoute) {
    newState.push('    controller: \'' + state.ctrlName + ' as ' + state.lowerCamel + '\'');
  } else {
    newState.push('    controller: \'' + state.ctrlName + '\'');
  }

  if (routeStartIndex > -1) {
    // add cloasing to squeeze new state between existing route and the final });
    newState.unshift('  })');
  } else {
    // add provider
    if (config.ngRoute) {
      newState.unshift('$routeProvider');
    } else {
      newState.unshift('$stateProvider');
    }

    // close up this new state, which is the first state
    newState.push('  });');
  }

  // count spaces to prepend to state
  if (routeStartIndex > -1) {
    lineToCheck = lines[routeStartIndex];
  } else {
    lineToCheck = lines[configFunctionIndex];
  }

  // strip away line after first non space character and count number of spaces left
  numOfSpaces = numOfSpacesAtStart(lineToCheck);

  // if this is the first state, add 2 more spaces to indent inside config function
  // else remove 2 spaces to line up with existing states
  if (routeStartIndex === -1) {
    numOfSpaces += 2;
  } else {
    numOfSpaces -= 2;
  }

  // prepend spaces
  newState = newState.map(function (newStateLine) {
    for (var i = 0; i < numOfSpaces; i++) {
      newStateLine = ' ' + newStateLine;
    }
    return newStateLine;
  });

  // insert the ilne after last existing state or at the start of the config function
  insertLine = (routeStartIndex > -1) ? routeEndIndex : configFunctionIndex + 1;

  lines.splice(insertLine, 0, newState.map(function (newStateLine) {
    return newStateLine;
  }).join(endOfLine));

  return lines.join(endOfLine);
};

exports.addRouteCoffee = function addRouteCoffee(fileContents, state, config) {
  var dependency = config.ngRoute ? 'ngRoute' : 'ui.router'
    , param = config.ngRoute ? 'routeProvider' : 'stateProvider'
    , newRoute = config.ngRoute ? 'when' : 'state'

    // checking if provider is used
    , regex = new RegExp('\\(.*\\$' + param + '.*\\) ->')
    , addParam = !regex.test(fileContents)

    // for determining where to place new state
    , routeStartIndex = -1
    , configFunctionIndex = -1

    // for prepending spaces to new route
    , numOfSpaces
    , numOfSpacesCounter
    , lineToCheck = null

    , lines // split fileContents

    // new state insertion
    , insertLine
    , newState;

  // if file doesn't have the dependency, add it
  if (!moduleUtils.dependencyExists(fileContents, dependency)) {
    fileContents = moduleUtils.addDependency(fileContents, dependency);
  }

  lines = fileContents.split(endOfLine);

  // find line to add new state
  lines.forEach(function (line, i) {
    // add $stateProvider if needed
    if (addParam && line.indexOf('.config') > -1 && line.indexOf('->') > -1) {
      // check if function has a parameter already
      if (line.lastIndexOf('(') === line.lastIndexOf(')') - 1) {
        lines[i] = lines[i].slice(0, line.lastIndexOf(')')) + '$' + param + ') ->';
      } else if (line.lastIndexOf('(') === -1 && line.lastIndexOf(')') === -1) {
        lines[i] = lines[i].slice(0, line.lastIndexOf('g')) + 'g ($' + param + ') ->';
      } else {
        lines[i] = lines[i].slice(0, line.lastIndexOf(')')) + ', $' + param + ') ->';
      }
    }

    if (line.indexOf('.config') > -1 && line.indexOf('->') > -1) {
      configFunctionIndex = i;
    }

    // look for .state and set routeStartIndex
    if (line.indexOf('.' + newRoute) > -1) {
      routeStartIndex = i;
    }

    // loop through everything to append new route at the end
  });

  // base route logic
  if (config.ngRoute) {
    newState = [
      '  .when \'' + state.url + '\',',
      '    templateUrl: \'' + state.templateUrl + '\''
    ];
  } else {
    newState = [
      '  .state \'' + state.lowerCamel + '\',',
      '    url: \'' + state.url + '\'',
      '    templateUrl: \'' + state.templateUrl + '\''
    ];
  }

  // controller as logic
  if (config.controllerAs && config.ngRoute) {
    newState.push('    controller: \'' + state.ctrlName + '\'');
    newState.push('    controllerAs: \'' + state.lowerCamel + '\'');
  } else if (config.controllerAs && !config.ngRoute) {
    newState.push('    controller: \'' + state.ctrlName + ' as ' + state.lowerCamel + '\'');
  } else {
    newState.push('    controller: \'' + state.ctrlName + '\'');
  }

  if (routeStartIndex === -1) {
    // add provider
    if (config.ngRoute) {
      newState.unshift('$routeProvider');
    } else {
      newState.unshift('$stateProvider');
    }
  }

  // count spaces to prepend to state
  if (routeStartIndex > -1) {
    lineToCheck = lines[routeStartIndex];
  } else {
    lineToCheck = lines[configFunctionIndex];
  }

  // strip away line after first non space character and count number of spaces left
  numOfSpaces = lineToCheck.substring(0, lineToCheck.search(/[^ ]/)).length;

  // if this is the first state, add 2 more spaces to indent inside config function
  // else remove 2 spaces to line up with existing states
  if (routeStartIndex === -1) {
    numOfSpaces += 2;
  } else {
    numOfSpaces -= 2;
  }

  // prepend spaces
  newState = newState.map(function (newStateLine) {
    for (var i = 0; i < numOfSpaces; i++) {
      newStateLine = ' ' + newStateLine;
    }
    return newStateLine;
  });

  if (routeStartIndex > -1) {
    // determine where last state ends by examining spaces
    // insert new route on first line to have less spaces at the start
    numOfSpaces = numOfSpacesAtStart(lines[routeStartIndex]);
    numOfSpacesCounter = numOfSpaces;
    insertLine = routeStartIndex;
    while (numOfSpacesCounter >= numOfSpaces) {
      insertLine++;
      numOfSpacesCounter = numOfSpacesAtStart(lines[insertLine]);
    }
  } else {
    insertLine = configFunctionIndex + 1;
  }

  lines.splice(insertLine, 0, newState.map(function (newStateLine) {
    return newStateLine;
  }).join(endOfLine));

  return lines.join(endOfLine);
};
