# generator-ng-poly [![Build Status](https://secure.travis-ci.org/dustinspecker/generator-ng-poly.png?branch=master)](https://travis-ci.org/dustinspecker/generator-ng-poly)
[![Dependencies](https://david-dm.org/dustinspecker/generator-ng-poly.png)](https://david-dm.org/dustinspecker/generator-ng-poly/#info=dependencies&view=table) [![DevDependencies](https://david-dm.org/dustinspecker/generator-ng-poly/dev-status.png)](https://david-dm.org/dustinspecker/generator-ng-poly/#info=devDependencies&view=table) [![PeerDependencies](https://david-dm.org/dustinspecker/generator-ng-poly/peer-status.svg)](https://david-dm.org/dustinspecker/generator-ng-poly/#info=peerDependencies&view=table)

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

**All generators ask for a module name except app and element. All generators except app take a name as an argument. A name can be written with CamelCase or hyphens.**

### Gulp Tasks
`gulp` will start a localhost and open in the default browser

`gulp test` will run Jasmine tasks via Karma

### App
Asks for application name and language preferences to scaffold out an application with a home module. Then installs npm and Bower dependencies.

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
├── Gulpefile.js
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

angular.module('module').constant('theHero', 0);
```

Produces `src/module/the-hero-constant_test.js`:
```javascript
/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('theHero', function () {
  var constant;

  beforeEach(module('module'));

  beforeEach(inject(function (theHero) {
    constant = theHero;
  }));

  it('should equal 0', function () {
    expect(constant).toBe(0);
  });

});
```

### Controller
Geenrates a controller and its test.

Example:
```
yo ng-poly:controller micro
```

Produces `src/module/micro-controller.js`:
```javascript
'use strict';

angular.module('module').controller('MicroCtrl', function ($scope) {
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

angular.module('module').directive('fancyButton', function () {
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

angular.module('module').factory('cake', function () {
  return 'cake';
});
```

Produces `src/module/cake-factory_test.js`:
```javascript
/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('cake', function () {
  var factory;

  beforeEach(module('module'));

  beforeEach(inject(function (cake) {
    factory = cake;
  }));

  it('should equal 0', function () {
    expect(factory).toEqual('cake');
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

angular.module('module').filter('coffee', function () {
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

angular.module('top', ['ui.router']);

angular.module('top').config(function ($stateProvider) {
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

angular.module('module', ['ui.router', 'home', 'top']);

angular.module('module').config(function ($urlRouterProvider) {
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

angular.module('top', ['ui.router', 'top.bottom']);

angular.module('top').config(function ($stateProvider) {
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

angular.module('module').factory('bacon', function () {
  return {
    $get: function () {
      return 'bacon';
    }
  };
});
```

Produces `src/module/bacon-provider_test.js`:
```javascript
/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('bacon', function () {
  var provider;

  beforeEach(module('module'));

  beforeEach(inject(function (bacon) {
    provider = bacon;
  }));

  it('should equal bacon', function () {
    expect(provider.$get()).toEqual('bacon');
  });

});
```

### Route
Adds a new route and generates a controller and view. The name provided is used as state name. Yeoman will then ask for the module to add the route to and the URL for the route (default is the state name provided).

Updates `src/module/module.js`:
```javascript
'use strict';

angular.module('module', ['ui.router']);

angular.module('module').config(function ($stateProvider) {
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

### Service
Generates a service and its test.

Example:
```
yo ng-poly:service cheap-or-good
```

Produces `src/moudle/cheap-or-good-service.js`:
```javascript
'use strict';

angular.module('module').service('cheapOrGood', function () {
  function CheapOrGood () {}
  CheapOrGood.prototype.get = function () {
    return 'cheapOrGood';
  };

  return new CheapOrGood();
});
```

Produces `src/module/cheap-or-good-service_test.js`:
```javascript
/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('cheapOrGood', function () {
  var service;

  beforeEach(module('module'));

  beforeEach(inject(function (cheapOrGood) {
    service = cheapOrGood;
  }));

  it('should equal cheapOrGood', function () {
    expect(service.get()).toEqual('cheapOrGood');
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

angular.module('module').value('morals', 0);
```

Produces `src/module/morals-value_test.js`:
```javascript
/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('morals', function () {
  var value;

  beforeEach(module('module'));

  beforeEach(inject(function (morals) {
    value = morals;
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

### License

MIT
