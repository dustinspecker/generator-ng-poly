'use strict';
import _ from 'lodash';
import appUtils from './app';
import elementUtils from './element';
import moduleUtils from './module';
import nameUtils from './name';
import promptsUtils from './prompts';
import routeUtils from './route';

_.assign(exports, appUtils);
_.assign(exports, elementUtils);
_.assign(exports, moduleUtils);
_.assign(exports, nameUtils);
_.assign(exports, promptsUtils);
_.assign(exports, routeUtils);
