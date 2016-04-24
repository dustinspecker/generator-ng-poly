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
const hasParam = (fileContents, config) => {
  const param = config.ngRoute ? '$routeProvider' : '$stateProvider';

  const opts = config.appScript === 'ts' ? {language: 'ts'} : null;

  if (config.appScript === 'coffee') {
    return new RegExp('\\(.*' + param + '.*\\) ->').test(fileContents);
  }

  return funcHasParam(fileContents, 'config', param, opts);
};

/**
 * Line includes config function
 * @param {String} line - line to check for config function existence
 * @param {Boolean} isCoffeeScript - is the line written in CoffeeScript?
 * @return {Boolean} - line has config function
 */
const lineHasConfigFunction = (line, isCoffeeScript) => {
  if (isCoffeeScript) {
    return line.indexOf('config') > -1 && line.indexOf('->') > -1;
  }

  return line.indexOf('function config(') > -1;
};

/**
 * Add param to config function line
 * @param {String} line - line to add parameter to
 * @param {String} param - parameter to add
 * @param {String} lang - which language is line written in? (coffee, es6, js, or ts)
 * @param {String} [type] - when lang === ts then insert type
 * @return {String} - config function line with parameter added
 */
const addParamToConfigFunction = (line, param, lang, type) => {
  let paramToInsert = `$${param}`;

  // config line ending will be stripped
  // this will add it back
  if (lang === 'ts') {
    paramToInsert += `: ${type}) {`;
  } else if (lang === 'coffee') {
    paramToInsert += ') ->';
  } else {
    paramToInsert += ') {';
  }

  // previous state had no parameters - config()
  if (line.lastIndexOf('(') === line.lastIndexOf(')') - 1) {
    return line.slice(0, line.lastIndexOf(')')) + paramToInsert;
  }

  // CoffeScript && previous state had no existing parameters - config ->
  if (lang === 'coffee' && line.lastIndexOf('(') === -1 && line.lastIndexOf(')') === -1) {
    return line.slice(0, line.lastIndexOf('g')) + 'g (' + paramToInsert;
  }

  // previous state had existing parameters - config()
  return line.slice(0, line.lastIndexOf(')')) + ', ' + paramToInsert;
};

/**
 * Injects the parameter into the module's config function
 * @param {Array} lines - lines to modify
 * @param {Object} config - user's config
 * @return {Array} - modified lines
 */
const addParam = (lines, config) => {
  const param = config.ngRoute ? 'routeProvider' : 'stateProvider'
    , type = config.ngRoute ? 'ng.route.IRouteProvider' : 'ng.ui.IStateProvider';

  return lines.map(line => {
    if (lineHasConfigFunction(line, config.appScript === 'coffee')) {
      return addParamToConfigFunction(line, param, config.appScript, type);
    }

    return line;
  });
};

/**
 * Analyzes lines to determine where to insert new route
 * @param {Array} lines - lines to analyze
 * @param {Object} config - user's config
 * @return {Object} - info regarding insertion points
 */
const analyzeLines = (lines, config) => {
  const newRoute = config.ngRoute ? 'when' : 'state';

  let braceCount = 0;

  const analysis = {
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

  analysis.existingRouteFound = analysis.routeStartIndex !== -1;

  return analysis;
};

/**
 * Returns new state to add
 * @param {Object} state - state info to format
 * @param {Object} analysis - information for insertion
 * @param {Object} config - user's config
 * @return {String[]} - lines of new state
 */
const prepareState = (state, analysis, config) => {
  let templateFile;

  const context = {
    analysis,
    config,
    state
  };

  templateFile = join(__dirname, 'templates', `_${(config.ngRoute ? 'ngroute' : 'uirouter')}.`);
  // js, es6, ts files all use the same templates
  templateFile += config.appScript === 'coffee' ? 'coffee' : 'js';

  return _.template(fs.readFileSync(templateFile))(context).split(newlineRegex);
};

/**
 * Adds state to lines
 * @param {Array} lines - lines to modify with state
 * @param {Object} state - state info to add to lines
 * @param {Object} analysis - insertion info
 * @param {Object} config - user's config
 * @return {Array} - modified lines with added state
 */
const addState = (lines, state, analysis, config) => {
  let insertLine, numOfSpaces, numOfSpacesCounter;

  // count spaces to prepend to state
  const lineToCheck = lines[analysis.existingRouteFound ? analysis.routeStartIndex : analysis.configFunctionIndex];

  numOfSpaces = start(lineToCheck);

  // if there is an existing route, remove 2 more spaces from indent to line up with existing routes
  // else add 2 spaces
  if (analysis.existingRouteFound) {
    numOfSpaces -= 2;
  } else {
    numOfSpaces += 2;
  }

  // prepend spaces
  state = state.map(stateLine => indentString(stateLine, ' ', numOfSpaces));

  if (config.appScript !== 'coffee') {
    insertLine = analysis.existingRouteFound ? analysis.routeEndIndex : analysis.configFunctionIndex + 1;
  } else if (analysis.existingRouteFound) {
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

  lines.splice(insertLine, 0, state.join(EOL));

  return lines.join(EOL);
};

module.exports = {
  /**
   * Adds route to module's config
   * @param {String} fileContents - file contents of module
   * @param {Object} state - state info to add
   * @param {Object} config - user's config
   * @return {String} - modified file contents with added state
   */
  addRoute(fileContents, state, config) {
    // checking if provider is used
    const needsParam = !hasParam(fileContents, config);

    let lines = fileContents.split(newlineRegex);

    const analysis = analyzeLines(lines, config);

    // if file needs parameter, add it
    if (needsParam) {
      lines = addParam(lines, config);
    }

    const newState = prepareState(state, analysis, config);

    return addState(lines, newState, analysis, config);
  }
};
