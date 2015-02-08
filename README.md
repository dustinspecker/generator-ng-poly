# generator-ng-poly [![NPM version](https://badge.fury.io/js/generator-ng-poly.svg)](http://badge.fury.io/js/generator-ng-poly) [![Build Status](https://travis-ci.org/dustinspecker/generator-ng-poly.svg?branch=v0.0.9)](https://travis-ci.org/dustinspecker/generator-ng-poly) [![Coverage Status](https://img.shields.io/coveralls/dustinspecker/generator-ng-poly.svg)](https://coveralls.io/r/dustinspecker/generator-ng-poly?branch=master)
[![Code Climate](https://codeclimate.com/github/dustinspecker/generator-ng-poly/badges/gpa.svg)](https://codeclimate.com/github/dustinspecker/generator-ng-poly) [![Dependencies](https://david-dm.org/dustinspecker/generator-ng-poly.svg)](https://david-dm.org/dustinspecker/generator-ng-poly/#info=dependencies&view=table) [![DevDependencies](https://david-dm.org/dustinspecker/generator-ng-poly/dev-status.svg)](https://david-dm.org/dustinspecker/generator-ng-poly/#info=devDependencies&view=table) [![PeerDependencies](https://david-dm.org/dustinspecker/generator-ng-poly/peer-status.svg)](https://david-dm.org/dustinspecker/generator-ng-poly/#info=peerDependencies&view=table)

> [Yeoman](http://yeoman.io) generator for modular AngularJS apps with Gulp and optional Polymer support

## Purpose

This generator focuses on organizing Angular components by feature (home, about, video player, etc.) instead of by type (controller, service, directive, etc.) to encourage the development of self-contained, reusable components.

A typical workflow with this generator consists of creating an Angular module ([ng-poly:module](#module)) and then generating controllers, directives, etc. for this module to create a new feature.

**Polymer is just an added feature, but it isn't required to utilize this generator.**

## Usage

Install `generator-ng-poly`:

```
npm install -g generator-ng-poly
```

Be sure to install `yo` before running any Yeoman generators:

```
npm install -g yo
```

If TypeScript is going to be used, `tsd@next` will need to be installed:

```
npm install -g tsd@next
```

Run `yo ng-poly`
Yeoman will then ask for an app name and language preferences.

Install `Gulp` via `npm install -g gulp` and run `gulp` to build and start the development environment.

## User Groups

Please feel free to ask any questions on our [GitHub Issues](https://github.com/dustinspecker/generator-ng-poly/issues) or [Google Group](https://groups.google.com/forum/#!forum/generator-ng-poly)

## Generators

Available generators:
* AngularJS
  - [ng-poly](#app) (a.k.a. [ng-poly:app](#app))
  - [ng-poly:constant](#constant)
  - [ng-poly:controller](#controller)
  - [ng-poly:directive](#directive)
  - [ng-poly:factory](#factory)
  - [ng-poly:filter](#filter)
  - [ng-poly:module](#module)
  - [ng-poly:provider](#provider)
  - [ng-poly:route](#route)
  - [ng-poly:service](#service)
  - [ng-poly:value](#value)
  - [ng-poly:view](#view)
* Polymer
  - [ng-poly:element](#element)

Languages and Features supported:
  * Angular Versions
    - 1.2.\*, 1.3.\*
  * Markup
    - HAML, HTML, Jade
  * Application scripting languages
    - CoffeeScript, JavaScript, TypeScript
  * Testing scripting languages
    - CoffeeScript, JavaScript, TypeScript†
  * Style languages
    - CSS, LESS, SCSS, Stylus
  * Routers
    - Angular Route, UI Router
  * Unit testing
    - Jasmine (Karma as the test runner) for AngularJS
    - Mocha with Chai (Karma as the test runner) for AngularJS
  * e2e testing
    - Jasmine (ran with Protractor) for AngularJS
    - Mocha, Chai, and Chai as Promised (ran with Protractor) for AngularJS
  * Frameworks
    - Bootstrap with AngularStrap
    - Bootstrap with UI Bootstrap
    - Foundation with Angular Foundation
  * Polymer
    - Core, Paper
  * Task runners
    - Gulp
  * Other supported Bower packages:
    - Angular Animate
    - Angular Cookies
    - Angular Messages
    - Angular Resource
    - Angular Sanitize
    - Angular Touch
    - Font Awesome
    - Lo-Dash
    - Restangular

[Configurations](#configurations):
  * Syntax
    - [Controller As](#controller-as-syntax)
    - [Pass Function](#pass-functions)
    - [Named Functions](#named-functions)

† e2e tests are not supported in TypeScript. JavaScript will instead be used for e2e tests.

### Gulp Tasks
`gulp` will start a localhost and open in the default browser

Using `--stage prod` will concat and minify HTML, CSS, and Angular modules.

`gulp build` will compile the assets

`gulp dev` will call the build task and setup the development environment

`gulp unitTest` will run unit tests via Karma and create code coverage reports

`gulp webdriverUpdate` will download the Selenium server standalone and Chrome driver for e2e testing

`gulp e2eTest` will run e2e tests via Protractor (must start a localhost before running `gulp e2eTest`)


* * *
**All generators ask for a module name except app and element. All generators except app take a name as an argument. A name can be written with CamelCase or hyphens.**

Generators requiring a module can take a module option to bypass the prompt:
```
yo ng-poly:view newView --module=home/kitchen
```
**A module value of `app` will add the new components to the module defined in app.js or app.coffee.**
* * *

**Examples are shown with HTML, LESS, JavaScript, Jasmine, and UI Router as the app configuration.**

### App
Asks for application name and language preferences to scaffold out an application with a home module. It will also ask if tests should be placed in the `app/` or `tests/` directory. It'll ask for some additional Bower dependencies and then install npm and Bower dependencies.

Example:
```
yo ng-poly
[?] What is the app's name?
[?] Which version of Angular should be used?
[?] What host should the app run on?
[?] Which port should the app run on?
[?] Which folder should the app be developed in?
[?] Which is the preferred markup language?
[?] Which is the preferred application scripting language?
[?] Want to use Controller As syntax?
[?] By default, should the route generator create controllers?
[?] Should functions be defined and passed instead of defined inline (in callbacks)?
[?] Want to use named functions instead of anonymous?
[?] Where should unit tests be saved?
[?] Which is the preferred test scripting language?
[?] Which is the preferred unit testing framework?
[?] Which is the preferred e2e testing framework?
[?] Which is the preferred style language?
[?] Should Polymer support be enabled?
[?] Should a framework be setup?
[?] Should ngRoute be used instead of UI Router?
[?] Which additional Bower components should be installed?
```

Produces:
```
root/
├── app/
│   ├── fonts/ (empty)
│   ├── home/
│   │   ├── home.{coffee,js}
│   │   ├── home.{css,less,scss,styl}
│   │   ├── home.tpl.{haml,html,jade}
│   │   ├── home-controller.{coffee,js}
│   │   └── home-controller_test.{coffee,js}
│   ├── images/ (empty)
│   ├── app.{coffee,js}
│   └── index.{haml,html,jade}
├── bower_components/
├── e2e/
│   └── home/
│       ├── home.po.{coffee,js}
│       └── home_test.{coffee,js}
├── gulp/
│   ├── analyze.js
│   ├── build.js
│   ├── test.js
│   └── watch.js
├── node_modules/
├── typings/*
├── .bowerrc
├── .editorconfig
├── .gitignore
├── .jscsrc
├── .jshintrc
├── .yo-rc.json
├── bower.json
├── build.config.js
├── Gulpfile.js
├── karma.config.js
├── package.json
├── protractor.config.js
├── README.md
└── tsd.json*
```
\* Only TypeScript projects will have this.
### Constant
Generates a constant and its test.

Example:
```
yo ng-poly:constant theHero
[?] Which module is this for?
```

Produces `app/module/the-hero-constant.js`:
```javascript
'use strict';

/**
 * @ngdoc service
 * @name module.constant:TheHero
 *
 * @description
 *
 */
angular
  .module('module')
  .constant('TheHero', 0);
```

Produces `app/module/the-hero-constant_test.js`:
```javascript
/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('TheHero', function () {
  var constant;

  beforeEach(module('module'));

  beforeEach(inject(function (TheHero) {
    constant = TheHero;
  }));

  it('should equal 0', function () {
    expect(constant).toBe(0);
  });

});
```

### Controller
Genrates a controller and its test.

Example:
```
yo ng-poly:controller micro
[?] Which module is this for?
```

Produces `app/module/micro-controller.js`:
```javascript
'use strict';

/**
 * @ngdoc object
 * @name module.controller:MicroCtrl
 * @requires $scope
 *
 * @description
 *
 */
angular
  .module('module')
  .controller('MicroCtrl', function ($scope) {
    $scope.micro = {};
    $scope.micro.ctrlName = 'MicroCtrl';
  });
```

Produces `app/module/micro-controller_test.js`:
```javascript
/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('MicroCtrl', function () {
  var scope;

  beforeEach(module('module'));

  beforeEach(inject(function ($rootScope, $controller) {
    scope = $rootScope.$new();
    $controller('MicroCtrl', {$scope: scope});
  }));

  it('should have ctrlName as MicroCtrl', function () {
    expect(scope.micro.ctrlName).toEqual('MicroCtrl');
  });

});
```

### Directive
Generates a directive, its template, and its test.

Example:
```
yo ng-poly:directive fancy-button
[?] Which module is this for?
```

Produces `app/module/fancy-button-directive.js`:
```javascript
'use strict';

/**
 * @ngdoc directive
 * @name module.directive:fancyButton
 * @restrict EA
 * @element
 *
 * @description
 *
 * @example
   <example module="module">
     <file name="index.html">
      <fancy-button></fancy-button>
     </file>
   </example>
 *
 */
angular
  .module('module')
  .directive('fancyButton', function () {
    return {
      restrict: 'EA',
      scope: {},
      templateUrl: 'module/fancy-button-directive.tpl.html',
      replace: false,
      controller: function (scope) {
        scope.fancyButton = {};
        scope.fancyButton.name = 'fancyButton';
      },
      link: function (scope, element, attrs) {
        /*jshint unused:false */
      }
    };
  });
```

Produces `app/module/fancy-button-directive.tpl.html`:
```html
<div>{{fancyButton.name}}</div>
```

Produces `app/module/fancy-button-directive_test.js`:
```javascript
/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('fancyButton', function () {
  var scope;
  var element;

  beforeEach(module('module', 'module/fancy-button-directive.tpl.html'));

  beforeEach(inject(function ($compile, $rootScope) {
    scope = $rootScope.$new();
    element = $compile(angular.element('<fancy-button></fancy-button>'))(scope);
  }));

  it('should have correct text', function () {
    scope.$digest();
    expect(element.isolateScope().fancyButton.name).toEqual('fancyButton');
  });

});
```
**The directive's template (HAML, HTML, or Jade) is converted to a temporary module automatically for testing.**

### Factory
Generates a factory and its test.

Example:
```
yo ng-poly:factory cake
[?] Which module is this for?
```

Produces `app/module/cake-factory.js`:
```javascript
'use strict';

/**
 * @ngdoc service
 * @name module.factory:Cake
 *
 * @description
 *
 */
angular
  .module('module')
  .factory('Cake', function () {
    var CakeBase = {};
    CakeBase.someValue = 'Cake';
    CakeBase.someMethod = function () {
      return 'Cake';
    };
    return CakeBase;
  });
```

Produces `app/module/Cake-factory_test.js`:
```javascript
/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('Cake', function () {
  var factory;

  beforeEach(module('module'));

  beforeEach(inject(function (Cake) {
    factory = Cake;
  }));

  it('should have someValue be Cake', function () {
    expect(factory.someValue).toEqual('Cake');
  });

  it('should have someMethod return Cake', function () {
    expect(factory.someMethod()).toEqual('Cake');
  });

});
```

### Filter
Generates a filter and its test.

Example:
```
yo ng-poly:filter coffee
[?] Which module is this for?
```

Produces `app/module/coffee-filter.js`:
```javascript
'use strict';

/**
 * @ngdoc filter
 * @name module.filter:coffee
 *
 * @description
 *
 * @param {Array} input The array to filter
 * @returns {Array} The filtered array
 *
 */
angular
  .module('module')
  .filter('coffee', function () {
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
```

Produces `app/module/coffee-filter_test.js`:
```javascript
/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('coffee', function () {
  beforeEach(module('module'));

  it('should filter our numbers not greater than 3', inject(function ($filter) {
    expect($filter('coffee')([1,2,3,4])).toEqual([4]);
  }));

});
```

### Module
Generates a new module and create a new route. Updates parent module's dependencies.

**Top Level Example:**
```
yo ng-poly:module top
```

Produces `app/top/top.js`:
```javascript
'use strict';

/* @ngdoc object
 * @name top
 *
 * @description
 *
 */
angular
  .module('top', [
    'ui.router'
  ]);

angular
  .module('top')
  .config(function ($stateProvider) {
    $stateProvider
      .state('top', {
        url: '/top',
        templateUrl: 'top/top.tpl.html',
        controller: 'TopCtrl'
      });
  });
```

Produces `app/top/top-controller.js`, `app/top/top-controller_test.js`, `app/top/top.tpl.html`, `app/top/top.less`, `e2e/top/top.po.js`, `e2e/top/top_test.js`

Updates `app/app.js`:
```javascript
'use strict';

/* @ngdoc object
 * @name module
 * @requires $urlRouterProvider
 *
 * @description
 *
 */
angular
  .module('module', [
    'ui.router',
    'home',
    'top'
  ]);

angular
  .module('module')
  .config(function ($urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
  });
```

* * *

**Deep Level Example:**
```
yo ng-poly:module top/bottom
```

Produces `app/top/bottom/bottom.js`, `app/top/bottom/bottom-controller.js`, `app/top/bottom/bottom-controller_test.js`, `app/top/bottom/bottom.tpl.html`, `app/top/bottom/bottom.less`, `e2e/bottom/bottom.po.js`, `e2e/bottom/bottom_test.js`

Updates `app/top/top.js`:
```javascript
'use strict';

/* @ngdoc object
 * @name top
 * @requires $stateProvider
 *
 * @description
 *
 */
angular
  .module('top', [
    'ui.router',
    'top.bottom'
  ]);

angular
  .module('top')
  .config(function ($stateProvider) {
    $stateProvider
      .state('top', {
        url: '/top',
        templateUrl: 'top/top.tpl.html',
        controller: 'TopCtrl'
      });
  });
```

**Notice the module in `app/top/bottom/` is called 'top.bottom'. All tests in this directory use this nomenclature, as well.**

* * *
**Deeper Level Example:**
```
yo ng-poly:module top/bottom/bottomest
```

Produces 'bottom.bottomest' module, a controller, controller test, style, and a view in `app/top/bottom/bottomest/`

Updates 'top.bottom' module with the new 'bottom.bottemest' module as a dependency.

* * *
**Deeperestier Level Example:**

It just keeps going...

* * *
**Empty modules**

By running `ng-poly:module newHome --empty` a module without a route will be created as such:
```javascript
'use strict';

/* @ngdoc object
 * @name newHome
 *
 * @description
 *
 */
angular
  .module('newHome', [
  ]);

angular
  .module('newHome')
  .config(function () {
  });
```
**It is still possible to add a route to this module via [ng-poly:route](#route).** The route subgenerator will also add the ui.router dependency and $stateProvider paramater for the config function.

### Provider
Generates a provider and its test.

Example:
```
yo ng-poly:provider bacon
[?] Which module is this for?
```

Produces `app/module/bacon-provider.js`:
```javascript
'use strict';

/**
 * @ngdoc service
 * @name module.provider:Bacon
 *
 * @description
 *
 */
angular
  .module('module')
  .provider('Bacon', function () {
    return {
      $get: function () {
        return 'Bacon';
      }
    };
  });
```

Produces `app/module/Bacon-provider_test.js`:
```javascript
/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('Bacon', function () {
  var provider;

  beforeEach(module('module'));

  beforeEach(inject(function (Bacon) {
    provider = Bacon;
  }));

  it('should equal Bacon', function () {
    expect(provider).toEqual('Bacon');
  });

});
```

### Route
Adds a new route and generates a controller and view. The name provided is used as state name for UI Router and as the route URL for ngRoute. Yeoman will then ask for the module to add the route to, the URL for the route (UI Router only), and the templateUrl. It will also generate an e2e test and a Page Object model for the new route.

Example:
```
yo ng-poly:route your-place
[?] Which module is this for?
[?] What's the URL for this route? (UI Router only)
[?] What's the templateURL for this route?
```

Updates `app/module/module.js`:
```javascript
'use strict';

/* @ngdoc object
 * @name module
 * @requires $stateProvider
 *
 * @description
 *
 */
angular
  .module('module', [
    'ui.router'
  ]);

angular
  .module('module')
  .config(function ($stateProvider) {
    $stateProvider
      .state('module', {
        url: '/module',
        templateUrl: 'module/module.tpl.html',
        controller: 'ModuleCtrl'
      })
      .state('yourPlace', {
        url: '/yourPlace',
        templateUrl: 'module/your-place.tpl.html',
        controller: 'YourPlaceCtrl'
      });
  });
```

Produces `e2e/your-place/your-place.po.js`:
```javascript
/*global element, by*/
'use strict';

var YourPlacePage = function () {
  this.text = element(by.tagName('p'));
  this.heading = element(by.tagName('h2'));
};

module.exports = YourPlacePage;
```

Produces `e2e/your-place/your-place_test.js`:
```javascript
/*global describe, beforeEach, it, browser, expect */
'use strict';

var buildConfigFile = require('findup-sync')('build.config.js')
  , buildConfig = require(buildConfigFile)
  , YourPlacePagePo = require('./your-place.po');

describe('Your place page', function () {
  var yourPlacePage;

  beforeEach(function () {
    yourPlacePage = new YourPlacePagePo();
    browser.driver.get(buildConfig.host + ':' + buildConfig.port + '/#/yourPlace');
  });

  it('should say YourPlaceCtrl', function () {
    expect(yourPlacePage.heading.getText()).toEqual('yourPlace');
    expect(yourPlacePage.text.getText()).toEqual('YourPlaceCtrl');
  });
});
```

Produces `app/module/your-place-controller.js`, `app/module/your-place-controller_test.js`, `app/module/your-place.tpl.html`, and `app/module/your-place.less`

**Currently, the module must have an existing state for another to be added.**

* * *
The route generator can take URL and templateUrl options, as well.
```
yo ng-poly:route yourPlace --url=yourPlace --template-url=your-place
```
The URL will automatically be prepended with `/` and and the templateUrl will be appended with `.tpl.html`.
* * *

### Service
Generates a service and its test.

Example:
```
yo ng-poly:service cheap-or-good
[?] Which module is this for?
```

Produces `app/module/cheap-or-good-service.js`:
```javascript
'use strict';

/**
 * @ngdoc service
 * @name home.service:CheapOrGood
 *
 * @description
 *
 */
angular
  .module('module')
  .service('CheapOrGood', function CheapOrGood() {
    var self = this;

    self.get = function get() {
      return 'CheapOrGood';
    };
  });
```

Produces `app/module/cheap-or-good-service_test.js`:
```javascript
/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('CheapOrGood', function () {
  var service;

  beforeEach(module('module'));

  beforeEach(inject(function (CheapOrGood) {
    service = CheapOrGood;
  }));

  it('should equal CheapOrGood', function () {
    expect(service.get()).toEqual('CheapOrGood');
  });

});
```

### Value
Generates a value and its test.

Example:
```
yo ng-poly:value morals
[?] Which module is this for?
```

Produces `app/module/morals-value.js`:
```javascript
'use strict';

/**
 * @ngdoc service
 * @name module.constant:Morals
 *
 * @description
 *
 */
angular
  .module('module')
  .value('Morals', 0);
```

Produces `app/module/Morals-value_test.js`:
```javascript
/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('Morals', function () {
  var value;

  beforeEach(module('module'));

  beforeEach(inject(function (Morals) {
    value = Morals;
  }));

  it('should equal 0', function () {
    expect(value).toBe(0);
  });

});
```

### View
Generates a view and its style.

Example:
```
yo ng-poly:view nice
[?] Which module is this for?
```

Produces `app/module/nice-view.tpl.html`:
```html
<h2>nice</h2>
<p>{{nice.ctrlName}}</p>
```

Produces `app/module/nice-view.less`:
```css
@bg-color: #E5E5E5;

body {
  background-color: @bg-color;
}
```

* * *

### Element
Generates a Polymer element.

Example:
```
yo ng-poly:element gold-silver
```

Produces `app/components/gold-silver/gold-silver.less`:
```css
:host {
  height: 100px;
  width: 100px;
  display: inline-block;
}
```

Produces `app/components/gold-silver/gold-silver.html`:
```html
<link rel='import' href='../polymer/polymer.html'>

<polymer-element name='gold-silver'>
  <template>
    <link rel='stylesheet' href='gold-silver.css'>
    <div>{{name}}</div>
  </template>

  <script src='gold-silver.js'></script>
</polymer-element>
```

Produces `app/components/gold-silver/gold-silver.js`:
```javascript
/*global Polymer*/
(function () {
  'use strict';

  var element = new Polymer('gold-silver', {
    name: 'gold-silver',
    domReady: function () {
      console.log('gold-silver');
    }
  });

  return element;
}());
```

* * *

## Configurations

It is possible to override the configurations initially specified when `yo ng-poly` was ran.

Each generator is able to take the following arguments. For example, `yo ng-poly:module test --controller-as=true --markup=jade` will override the configuration settings for everything generated by this command.

| Option | Possible Values|
| ------ | -------------- |
| app-script | coffee, js, ts |
| markup | haml, html, jade|
| style | css, less, scss, styl|
| test-script | coffee, js|
| controller-as | true, false |
| skip-controller | true, false |
| pass-func | true, false |
| named-func | true, false |
| ng-route | true, false|

**It's not recommended to mix ngRoute and UI Router, but it's possible.**

### Controller As Syntax

This generator has support for the Controller As syntax. Yeoman will ask if this should be enabled when `ng-poly:app` is ran.

This will generate controllers like:

```javascript
'use strict';

/**
 * @ngdoc object
 * @name home.controller:HomeCtrl
 *
 * @description
 *
 */
angular
  .module('home')
  .controller('HomeCtrl', function () {
    var vm = this;
    vm.ctrlName = 'HomeCtrl';
  });
```

...and their tests like:

```javascript
/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('HomeCtrl', function () {
  var ctrl;

  beforeEach(module('home'));

  beforeEach(inject(function ($rootScope, $controller) {
    ctrl = $controller('HomeCtrl');
  }));

  it('should have ctrlName as HomeCtrl', function () {
    expect(ctrl.ctrlName).toEqual('HomeCtrl');
  });

});
```

It'll also modify the state's controller like:

```javascript
'use strict';

/* @ngdoc object
 * @name home
 * @requires $stateProvider
 *
 * @description
 *
 */
angular
  .module('home', [
    'ui.router'
  ]);

angular
  .module('home')
  .config(function ($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'home/home.tpl.html',
        controller: 'HomeCtrl as home'
      });
  });
```

Directives will be generated like:

```javascript
'use strict';

/**
 * @ngdoc directive
 * @name home.directive:fancyButton
 * @restrict EA
 * @element
 *
 * @description
 *
 * @example
   <example module="home">
     <file name="index.html">
      <fancy-button></fancy-button>
     </file>
   </example>
 *
 */
angular
  .module('home')
  .directive('fancyButton', function fancyButton() {
    return {
      restrict: 'EA',
      scope: {},
      templateUrl: 'home/fancy-button-directive.tpl.html',
      replace: false,
      controllerAs: 'fancyButton',
      controller: function () {
        var vm = this;
        vm.name = 'fancyButton';
      },
      link: function (scope, element, attrs) {
        /*jshint unused:false */
      }
    };
  });
```


Lastly, views will be generated like:

```html
<h2>home</h2>
<p>{{home.ctrlName}}</p>
```

### Pass Functions

The generator will ask when `ng-poly:app` is ran if it should pass defined functions instead of defining inline.

**This is currently only supported in JavaScript files.**

If enabled, the app source code will pass functions, such as:

```javascript
(function () {
  'use strict';

  /**
   * @ngdoc object
   * @name home.controller:HomeCtrl
   *
   * @description
   *
   */
  angular
    .module('home')
    .controller('HomeCtrl', HomeCtrl);

  function HomeCtrl() {
    var vm = this;
    vm.ctrlName = 'HomeCtrl';
  }

})();
```

### Named Functions

The generator will ask when `ng-poly:app` is ran if it should use named functions or anonymous functions. Named functions create a stack trace that is easier to understand.

**This is only supported in JavaScript files.**

If enabled, the app source code will have named functions, such as:

```javascript
(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name module.factory:Cake
   *
   * @description
   *
   */
  angular
    .module('module')
    .factory('Cake', Cake);

  function Cake() {
    var CakeBase = {};
    CakeBase.someValue = 'Cake';
    CakeBase.someMethod = function someMethod() {
      return 'Cake';
    };
    return CakeBase;
  }

})();
```

### License

MIT
