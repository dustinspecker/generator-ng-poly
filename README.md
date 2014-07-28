# generator-ng-poly [![Build Status](https://travis-ci.org/dustinspecker/generator-ng-poly.svg?branch=v0.0.9)](https://travis-ci.org/dustinspecker/generator-ng-poly) [![Coverage Status](https://img.shields.io/coveralls/dustinspecker/generator-ng-poly.svg)](https://coveralls.io/r/dustinspecker/generator-ng-poly?branch=master)
[![Dependencies](https://david-dm.org/dustinspecker/generator-ng-poly.svg)](https://david-dm.org/dustinspecker/generator-ng-poly/#info=dependencies&view=table) [![DevDependencies](https://david-dm.org/dustinspecker/generator-ng-poly/dev-status.svg)](https://david-dm.org/dustinspecker/generator-ng-poly/#info=devDependencies&view=table) [![PeerDependencies](https://david-dm.org/dustinspecker/generator-ng-poly/peer-status.svg)](https://david-dm.org/dustinspecker/generator-ng-poly/#info=peerDependencies&view=table)

> [Yeoman](http://yeoman.io) generator for AngularJS and Polymer apps. A work in progress.

## Usage

Install `generator-ng-poly`:

```
npm install -g generator-ng-poly
```

Run `yo ng-poly`
Yeoman will then ask for an app name and language preferences.

Run `gulp` to build.

## Generators

Available generators:
* AngularJS
  - [ng-poly](#app) (aka [ng-poly:app](#app))
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
  * Markup
    - Jade
    - HTML
  * Application scripting languages
    - JavaScript
  * Testing scripting
    - CoffeeScript
    - JavaScript
  * Style languages
    - LESS
  * Unit testing
    - Jasmine (Karma as the test runner) for AngularJS
  * Task runners
    - Gulp


### Gulp Tasks
`gulp` will start a localhost and open in the default browser

`gulp test` will run Jasmine tasks via Karma

Using `--stage prod` will concat and minify HTML, CSS, and Angular modules.

* * *
**All generators ask for a module name except app and element. All generators except app take a name as an argument. A name can be written with CamelCase or hyphens.**

Generators requiring a module can take a module option to bypass the prompt:
```
yo ng-poly:view --module=home/kitchen
```
* * *

### App
Asks for application name and language preferences to scaffold out an application with a home module. It will also ask if tests should be placed in the `src/` or `tests/` directory. Then installs npm and Bower dependencies.

Example:
```
yo ng-poly
```

Produces:
```
root/
├── bower_components/
├── node_modules/
├── src/
│   ├── home/
│   │   ├── home.js
│   │   ├── home.less
│   │   ├── home.tpl.{html,jade}
│   │   ├── home-controller.js
│   │   └── home-controller_test.{coffee,js}
│   ├── app.js
│   └── index.{html,jade}
├── .editorconfig
├── .jshintrc
├── .yo-rc.json
├── bower.json
├── Gulpfile.js
├── karma.config.js
└── package.json
```

### Constant
Generates a constant and its test.

Example:
```
yo ng-poly:constant theHero
```

Produces `src/module/the-hero-constant.js`:
```javascript
'use strict';

angular
  .module('module')
  .constant('TheHero', 0);
```

Produces `src/module/the-hero-constant_test.js`:
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
```

Produces `src/module/micro-controller.js`:
```javascript
'use strict';

angular
  .module('module')
  .controller('MicroCtrl', function ($scope) {
    $scope.ctrlName = 'MicroCtrl';
  });
```

Produces `src/module/micro-controller_test.js`:
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
    expect(scope.ctrlName).toEqual('MicroCtrl');
  });

});
```

### Directive
Generates a directive, its template, and its test.

Example:
```
yo ng-poly:directive fancy-button
```

Produces `src/module/fancy-button-directive.js`:
```javascript
'use strict';

angular
  .module('module')
  .directive('fancyButton', function () {
    return {
      restrict: 'AE',
      scope: {},
      templateUrl: 'module/fancy-button-directive.tpl.html', 
      replace: false,
      link: function (scope, element, attrs) {
        element.text('fancyButton\n' + scope + '\n' + attrs);
      }
    };
  });
```

Produces `src/module/fancy-button-directive.tpl.html`:
```html
<div></div>
```

Produces `src/module/fancy-button-directive_test.js`:
```javascript
/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('fancyButton', function () {
  var scope;
  var element;

  beforeEach(module('module', 'module/fancy-button-directive.tpl.html'));

  beforeEach(inject(function ($compile, $rootScope) {
    scope = $rootScope.$new();
    element = angular.element('<fancy-button></fancy-button>');
    $compile(element)($rootScope);
  }));

  it('should have correct text', function () {
    scope.$digest();
    expect(element.html()).toEqual('fancyButton\n[object Object]\n[object Object]');
  });

});
```
**The directive's template (HTML or Jade) is converted to a temporary module automatically for testing.**

### Factory
Generates a factory and its test.

Example:
```
yo ng-poly:factory cake
```

Produces `src/module/cake-factory.js`:
```javascript
'use strict';

angular
  .module('module')
  .factory('Cake', function() {
    var CakeBase = {};
    CakeBase.someValue = 'Cake';
    CakeBase.someMethod = function () {
      return 'Cake';
    };
    return CakeBase;
  });
```

Produces `src/module/Cake-factory_test.js`:
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
```

Produces `src/module/coffee-filter.js`:
```javascript
'use strict';

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

Produces `src/module/coffee-filter_test.js`:
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
Generates a new module, view, and controller. Updates parent module's dependencies.

**Top Level Example:**
```
yo ng-poly:module top
```

Produces `src/top/top.js`:
```javascript
'use strict';

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

Produces `src/top/top-controller.js`, `src/top/top-controller_test.js`, `src/top/top.tpl.html`, `src/top/top.less`

Updates `src/app.js`:
```javascript
'use strict';

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

Produces `src/top/bottom/bottom.js`, `src/top/bottom/bottom-controller.js`, `src/top/bottom/bottom-controller_test.js`, `src/top/bottom/bottom.tpl.html`, `src/top/bottom/bottom.less`

Updates `src/top/top.js`:
```javascript
'use strict';

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

**Notice the module in `src/top/bottom/` is called 'top.bottom'. All tests in this directory use this nomenclature, as well.**

* * *
**Deeper Level Example:**
```
yo ng-poly:module top/bottom/bottomest
```

Produces 'bottom.bottomest' module, a controller, controller test, style, and a view in `src/top/bottom/bottomest/`

Updates 'top.bottom' module with the new 'bottom.bottemest' module as a dependency.

* * *
**Deeperestier Level Example:**

It just keeps going...

### Provider
Generates a provider and its test.

Example:
```
yo ng-poly:provider bacon
```

Produces `src/module/bacon-provider.js`:
```javascript
'use strict';

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

Produces `src/module/Bacon-provider_test.js`:
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
Adds a new route and generates a controller and view. The name provided is used as state name. Yeoman will then ask for the module to add the route to and the URL for the route (default is the state name provided).

Example:
```
yo ng-poly:route your-place
```

Updates `src/module/module.js`:
```javascript
'use strict';

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

Produces `src/module/your-place-controller.js`, `src/module/your-place-controller_test.js`, `src/module/your-place.tpl.html`, and `src/module/your-place.less`

**Currently, the module must have an existing state for another to be added.**

* * *
The route generator can take a URL option, as well.
```
yo ng-poly:route --url=yourPlace
```
* * *

### Service
Generates a service and its test.

Example:
```
yo ng-poly:service cheap-or-good
```

Produces `src/module/cheap-or-good-service.js`:
```javascript
'use strict';

angular
  .module('module')
  .service('CheapOrGood', function () {
    function CheapOrGoodBase() {}
    CheapOrGoodBase.prototype.get = function () {
      return 'CheapOrGood';
    };

    return new CheapOrGoodBase();
  });
```

Produces `src/module/cheap-or-good-service_test.js`:
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
```

Produces `src/module/morals-value.js`:
```javascript
'use strict';

angular
  .module('module')
  .value('Morals', 0);
```

Produces `src/module/Morals-value_test.js`:
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
```

Produces `src/module/nice-view.tpl.html`:
```html
<h2>nice</h2>
<p>{{ctrlName}}</p>
```

Produces `src/module/nice-view.less`:
```css
@bg-color: #E5E5E5;

body {
  background-color: @bg-color;
}
```

### Element
Generates a Polymer element.

Example:
```
yo ng-poly:element gold-silver
```

Produces `src/components/gold-silver/gold-silver.less`:
```css
:host {
  height: 100px;
  width: 100px;
  display: inline-block;
}
```

Produces `src/components/gold-silver/gold-silver.html`:
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

Produces `src/components/gold-silver/gold-silver.js`:
```javascript
/*global Polymer*/
'use strict';
(function () {
  var element = new Polymer('gold-silver', {
    name: 'gold-silver',
    domReady: function () {
      console.log('gold-silver');
    }
  });
  return element;
}());
```

**For the time being, the element generator is very experimental and not guaranteed to function properly.**

* * *

### Controller As Syntax

This generator has support for the Controller As syntax. Yeoman will ask if this should be enabled when `ng-poly:app` is ran.

This will generate controllers like:

```javascript
'use strict';

angular
  .module('home')
  .controller('HomeCtrl', function () {
    this.ctrlName = 'HomeCtrl';
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

Lastly, views will be generated like:

```html
<h2>home</h2>
<p>{{home.ctrlName}}</p>
```

### Pass functions

The generator will ask when `ng-poly:app` is ran if it should pass functions or assign as callbacks.

If enabled, the app source code will pass functions, such as:

```javascript
'use strict';

/* @ngInject */
function HomeCtrl() {
  this.ctrlName = 'HomeCtrl';
}

angular
  .module('home')
  .controller('HomeCtrl', HomeCtrl);
```

**Gulp will automatically surround each file with an IIFE to prevent polluting the global scope and the collision of names.**

### Named functions

The generator will ask when `ng-poly:app` is ran if it should use named functions or anonymous functions. Named functions create a stack trace that is easier to understand.

If enabled, the app source code will have named functions, such as:

```javascript
'use strict';

angular
  .module('module')
  .factory('Cake', function Cake() {
    var CakeBase = {};
    CakeBase.someValue = 'Cake';
    CakeBase.someMethod = function someMethod() {
      return 'Cake';
    };
    return CakeBase;
  });
```

### License

MIT
