'use strict';
import _ from 'lodash';
import {EOL} from 'os';
import indentString from 'indent-string';
import fs from 'fs';
import funcHasParam from 'func-has-param';
import {join} from 'path';
import newlineRegex from 'newline-regex';
import {start} from 'count-spaces';

/**
 * Returns whether the module's config function is injecting parameter
 * @param {String} fileContents - file contents of module
 * @param {Object} config - user's config
 * @return {Boolean} - does module have param?
 */
function hasParam(fileContents, config) {
  const param = config.ngRoute ? '$routeProvider' : '$stateProvider';

  let opts = {};

  if (config.appScript === 'coffee') {
    return new RegExp('\\(.*' + param + '.*\\) ->').test(fileContents);
  }

  opts.language = config.appScript === 'es6' ? 'js' : config.appScript;

  return funcHasParam(fileContents, 'config', param, opts);
}

/**
 * Line include config function
 * @param {String} line - line to check for config function existence
 * @param {Boolean} isCoffeeScript - is the line written in CoffeeScript?
 * @return {Boolean} - line has config function
 */
function lineHasConfigFunction(line, isCoffeeScript) {
  if (isCoffeeScript) {
    return line.indexOf('config') > -1 && line.indexOf('->') > -1;
  }

  return line.indexOf('function config(') > -1;
}

/**
 * Add param to config function line
 * @param {String} line - line to add parameter to
 * @param {String} param - parameter to add
 * @param {String} lang - which language is line written in? (coffee, es6, js, or ts)
 * @param {String} [type] - when lang === ts then insert type
 * @return {String} - config function line with parameter added
 */
function addParamToConfigFunction(line, param, lang, type) {
  let paramToInsert = `$${param}`;
  if (lang === 'ts') {
    paramToInsert += `: ${type}) {`;
  } else if (lang === 'coffee') {
    paramToInsert += ') ->';
  } else {
    paramToInsert += ') {';
  }

  if (line.lastIndexOf('(') === line.lastIndexOf(')') - 1) {
    return line.slice(0, line.lastIndexOf(')')) + paramToInsert;
  }

  if (lang === 'coffee' && line.lastIndexOf('(') === -1 && line.lastIndexOf(')') === -1) {
    return line.slice(0, line.lastIndexOf('g')) + 'g (' + paramToInsert;
  }

  return line.slice(0, line.lastIndexOf(')')) + ', ' + paramToInsert;
}

/**
 * Injects the parameter into the module's config function
 * @param {Array} lines - lines to modify
 * @param {Object} config - user's config
 * @return {Array} - modified lines
 */
function addParam(lines, config) {
  const param = config.ngRoute ? 'routeProvider' : 'stateProvider'
    , type = config.ngRoute ? 'ng.route.IRouteProvider' : 'ng.ui.IStateProvider';

  lines = lines.map(line => {
    if (lineHasConfigFunction(line, config.appScript === 'coffee')) {
      return addParamToConfigFunction(line, param, config.appScript, type);
    }

    return line;
  });

  return lines;
}

/**
 * Analyzes lines to determine where to insert new route
 * @param {Array} lines - lines to analyze
 * @param {Object} config - user's config
 * @return {Object} - info regarding insertion points
 */
function analyzeLines(lines, config) {
  const newRoute = config.ngRoute ? 'when' : 'state';

  let braceCount = 0
    , analysis;

  analysis = {
    routeStartIndex: -1,
    routeEndIndex: -1,
    configFunctionIndex: -1
  };

  lines.forEach((line, i) => {
    if (config.appScript === 'ts' || config.appScript === 'js' || config.appScript === 'es6') {
      if (line.indexOf('function config(') > -1) {
        analysis.configFunctionIndex = i;
      }

      // look for .state and set routeStartIndex
      if (line.indexOf('.' + newRoute + '(') > -1) {
        analysis.routeStartIndex = i;
      }

      // open braces add to braceCount
      if (analysis.routeStartIndex > -1 && line.indexOf('{') > -1) {
        braceCount++;
      }

      // close braces subract from braceCount
      if (analysis.routeStartIndex > -1 && line.indexOf('}') > -1) {
        braceCount--;
      }

      // when braceCount = 0 the end of the state has been reached
      // set routeEndIndex
      if (analysis.routeStartIndex > -1 && braceCount === 0) {
        analysis.routeEndIndex = i;
      }
    } else {
      if (line.indexOf('.config') > -1 && line.indexOf('->') > -1) {
        analysis.configFunctionIndex = i;
      }

      // look for .state and set routeStartIndex
      if (line.indexOf('.' + newRoute) > -1) {
        analysis.routeStartIndex = i;
      }
    }
  });

  return analysis;
}

/**
 * Returns new state to add
 * @param {Object} state - state info to format
 * @param {Object} analysis - information for insertion
 * @param {Object} config - user's config
 * @return {Array} - lines of new state
 */
function prepareState(state, analysis, config) {
  let context = {}
    , templateFile = '';

  templateFile = join(__dirname, 'templates', `_${(config.ngRoute ? 'ngroute' : 'uirouter')}.`);
  templateFile += config.appScript === 'coffee' ? 'coffee' : 'js';

  context.analysis = analysis;
  context.config = config;
  context.state = state;

  return _.template(fs.readFileSync(templateFile))(context).split(newlineRegex);
}

/**
 * Adds state to lines
 * @param {Array} lines - lines to modify with state
 * @param {Object} state - state info to add to lines
 * @param {Object} analysis - insertion info
 * @param {Object} config - user's config
 * @return {Array} - modified lines with added state
 */
function addState(lines, state, analysis, config) {
  let insertLine, lineToCheck, numOfSpaces, numOfSpacesCounter;

  // count spaces to prepend to state
  if (analysis.routeStartIndex > -1) {
    lineToCheck = lines[analysis.routeStartIndex];
  } else {
    lineToCheck = lines[analysis.configFunctionIndex];
  }

  numOfSpaces = start(lineToCheck);

  // if this is the first state, add 2 more spaces to indent inside config function
  // else remove 2 spaces to line up with existing states
  if (analysis.routeStartIndex === -1) {
    numOfSpaces += 2;
  } else {
    numOfSpaces -= 2;
  }

  // prepend spaces
  state = state.map(function (stateLine) {
    return indentString(stateLine, ' ', numOfSpaces);
  });

  if (config.appScript !== 'coffee') {
    insertLine = analysis.routeStartIndex > -1 ? analysis.routeEndIndex : analysis.configFunctionIndex + 1;
  } else if (analysis.routeStartIndex > -1) {
    // determine where last state ends by examining spaces
    // insert new route on first line to have less spaces at the start
    numOfSpaces = start(lines[analysis.routeStartIndex]);
    numOfSpacesCounter = numOfSpaces;
    insertLine = analysis.routeStartIndex;
    while (numOfSpacesCounter >= numOfSpaces) {
      insertLine++;
      numOfSpacesCounter = start(lines[insertLine]);
    }
  } else {
    insertLine = analysis.configFunctionIndex + 1;
  }

  lines.splice(insertLine, 0, state.map(stateline => stateline).join(EOL));

  return lines.join(EOL);
}

/**
 * Adds route to module's config
 * @param {String} fileContents - file contents of module
 * @param {Object} state - state info to add
 * @param {Object} config - user's config
 * @return {String} - modified file contents with added state
 */
exports.addRoute = function addRoute(fileContents, state, config) {
  // checking if provider is used
  let needsParam = !hasParam(fileContents, config)

    // split fileContents
    , lines

    // new state insertion info
    , analysis
    , newState;

  lines = fileContents.split(newlineRegex);
  analysis = analyzeLines(lines, config);

  // if file needs parameter, add it
  if (needsParam) {
    lines = addParam(lines, config);
  }

  newState = prepareState(state, analysis, config);

  return addState(lines, newState, analysis, config);
};
