var app = angular.module('nourritureApp', [
  'ngRoute',
  'btford.socket-io',
  'LocalStorageModule',
  'duScroll',
  'xeditable',
  'angucomplete-alt',
  'ui.bootstrap',
  'addIngredientViewControllers',
  'addRecipeViewControllers',
  'editIngredientViewControllers',
  'editRecipeViewControllers',
  'editUserViewControllers',
  'homeViewControllers',
  'ingredientViewControllers',
  'ingredientsViewControllers',
  'loginViewControllers',
  'registerUserViewControllers',
  'recipeViewControllers',
  'recipesViewControllers',
  "searchViewControllers"
]);

app.value('socket_domain_mapper', {
  'ingredient': {name: "Ingredient", color: 'red'},
  "recipe": {name: "Recipe", color: "blue"}
});

app.value('socket_name_mapper', {
  'create': {name: "created"},
  'update': {name: "updated"},
  'destroy': {name: "deleted"}
});

app.value('ingredient_categories_mapper', {
  'bread': {name: "Bread", color: '#ecf0f1'},
  'cheese': {name: "Cheese", color: '#f1c40f'},
  'chocolate': {name: "Chocolate", color: '#d35400'},
  'egg': {name: "Egg", color: '#1abc9c'},
  'fish': {name: "Fish", color: '#3498db'},
  'fruit': {name: "Fruit", color: '#2ecc71'},
  'meat': {name: "Meat", color: '#c0392b'},
  'spice': {name: "Spice", color: '#e74c3c'},
  'vegetable': {name: "Vegetable", color: '#e67e22'},
  'other': {name: "Other", color: '#bdc3c7'}
});

app.value('recipe_categories_mapper', {
  'appetizer': {name: "Appetizer", color: "orange"},
  'dessert': {name: "Dessert", color: '#1abc9c'},
  'main': {name: "Main dish", color: '#c0392b'},
  'starter': {name: "Starter", color: '#e74c3c'},
  'vegetarian': {name: "Vegetarian", color: '#2ecc71'},
  'other': {name: "Other", color: '#bdc3c7'}
});

app.value('recipe_categories_mapper_first', 'appetizer');

app.value("apiURL", "/api");
app.value("apiSocketURL", "/");

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/editUser', {
        templateUrl: '/views/editUser.html',
        controller: 'EditUserViewCtrl'
      }).
      when('/login', {
        templateUrl: '/views/login.html',
        controller: 'LoginViewCtrl'
      }).
      when('/registerUser', {
        templateUrl: '/views/registerUser.html',
        controller: 'RegisterUserViewCtrl'
      }).
      when('/home', {
        templateUrl: '/views/home.html',
        controller: 'HomeViewCtrl'
      }).
      when('/ingredients', {
        templateUrl: '/views/ingredients.html',
        controller: 'IngredientsViewCtrl'
      }).
      when('/ingredient/:id', {
        templateUrl: '/views/ingredient.html',
        controller: 'IngredientViewCtrl'
      }).
      when('/ingredient/:id/edit', {
        templateUrl: '/views/editIngredient.html',
        controller: 'EditIngredientViewCtrl'
      }).
      when('/addIngredient', {
        templateUrl: '/views/addIngredient.html',
        controller: 'AddIngredientViewCtrl'
      }).
      when('/addRecipe', {
        templateUrl: '/views/addRecipe.html',
        controller: 'AddRecipeViewCtrl'
      }).
      when('/recipes', {
        templateUrl: '/views/recipes.html',
        controller: 'RecipesViewCtrl'
      }).
      when('/recipe/:id', {
        templateUrl: '/views/recipe.html',
        controller: 'RecipeViewCtrl'
      }).
      when('/recipe/:id/edit', {
        templateUrl: '/views/editRecipe.html',
        controller: 'EditRecipeViewCtrl'
      }).
      when("/search", {
        templateUrl: "/views/search.html",
        controller: "SearchViewCtrl"
      }).
      otherwise({
        redirectTo: '/home'
      });
  }
]);

app.filter("sanitize", ['$sce', function($sce) {
  return function(htmlCode){
    return $sce.trustAsHtml(htmlCode);
  }
}]);

app.run(["$rootScope", "$location", "apiFactory", function($rootScope, $location, apiFactory) {
  $rootScope.$on("$routeChangeStart", function(event, next, current) {
    if (apiFactory.isRole()) { // user logged
      if (next.templateUrl) {
        if (next.templateUrl == "/views/login.html" || next.templateUrl == "/views/registerUser.html") {
          $location.url("/");
        }
      }
    }
  });
}]);

app.run(["editableOptions", "editableThemes", function(editableOptions, editableThemes) {
  editableThemes.bs3.inputClass = 'input-text';
  editableThemes.bs3.buttonsClass = 'btn-icon-nutrition';
  editableOptions.theme = 'bs3';
}]);

// Initialize Facebook
app.run(["Facebook", function(face) {
  console.log("Loading facebook...");
  (function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
}]);

app.directive('fileModel', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;

      element.bind('change', function(){
          scope.$apply(function(){
              modelSetter(scope, element[0].files[0]);
          });
      });
    }
  };
}]);

app.factory("globalFactory", [function() {
  var data = {};
  var g = {};

  g.get = function(key) {
    return data[key];
  };

  g.set = function(key, value) {
    data[key] = value;
  };

  g.pop = function(key) {
    var t = data[key];
    data[key] = undefined;
    return t;
  };

  g.delete = function(key) {
    data[key] = undefined;
  };

  g.exists = function(key) {
    return data[key] != undefined;
  };

  return g;
}]);

app.directive("scrolltableofcontentsingredient", ['$window', function ($window) {
  return function(scope, element, attrs) {
    angular.element($window).bind("scroll", function() {
        if (this.pageYOffset >= 64) { // navbar height
          element.addClass('fixed');
          element.css('top', 0);
          element.css('width', $("#magic-table-of-contents-line").width());
       } else {
          element.removeClass('fixed');
       }
    });
  };
}]);

app.directive("resizetableofcontentsingredient", ['$window', function ($window) {
  return function(scope, element, attrs) {
    angular.element($window).bind("resize", function() {
      element.css('width', $("#magic-table-of-contents-line").width());
    });
  };
}]);

app.factory("refreshInputForms", [function() {
  return function() {
    var text_inputs = $('input[type=text], input[type=password], input[type=email], textarea');

    text_inputs.each(function(){
      if($(this).val().length !== 0) {
       $(this).siblings('label').addClass('active');
      }
    })

    text_inputs.focus(function () {
      $(this).siblings('label').addClass('active');
    });

    text_inputs.blur(function () {
      if ($(this).val().length === 0) {
        $(this).siblings('label').removeClass('active');
      }
    });
  }
}]);

app.factory("apiFactory", ["apiURL", '$http', "$q", "localStorageService", "$location", function (apiURL, $http, $q, localStorage, $location) {
    var host = apiURL;
    var urlUser = host + "/user";
    var urlIngredient = host + "/ingredient";
    var urlTimeline = host + "/timeline";
    var urlRecipe = host + "/recipe";
    var urlRecipeComment = host + "/recipe_comment";
    var urlCommon = host + "/common";

    var apiFactory = {user: {}, ingredient: {}, timeline: {}, recipe: {}, recipe_comment: {}, common: {}};
    var token = localStorage.get("token");
    var user = undefined;

    apiFactory.isRole = function(roles) {
      if (user) return true;
      return false;
    };

    apiFactory.logout = function(red) {
      user = false;
      token = false;
      localStorage.remove('token');
      if (red) $location.url(red);
    };

    function httpGet(url, config) {
      config = config || {};
      config.headers = config.headers || {};
      if (token !== undefined) {
        config.headers.Authorization = "Bearer " + token;
      }
      return $http.get(url, config);
    }

    function httpPost(url, data, config) {
      config = config || {};
      config.headers = config.headers || {};
      if (token !== undefined)
        config.headers.Authorization = "Bearer " + token;
      return $http.post(url, data, config);
    }

    function httpDelete(url, config) {
      config = config || {};
      config.headers = config.headers || {};
      if (token !== undefined) {
        config.headers.Authorization = "Bearer " + token;
      }
      return $http.delete(url, config);
    }

    function httpPut(url, data, config) {
      config = config || {};
      config.headers = config.headers || {};
      if (token !== undefined) {
        config.headers.Authorization = "Bearer " + token;
      }
      return $http.put(url, data, config);
    }

    apiFactory.getToken = function() {
      return token;
    };

    apiFactory.setToken = function(t, save) {
      token = t;
      if (save) localStorage.set("token", t);
    };

    apiFactory.getUser = function() {
      return user;
    };

    /* API USER */

    apiFactory.setUser = function(u) {
      user = u;
    };

    apiFactory.user.find = function(config) {
      return httpGet(urlUser, config);
    };

    apiFactory.user.me = function() {
      return httpGet(urlUser + "/me").then(function(res) {
        return res.data;
      });
    };

    apiFactory.user.signup = function(firstname, lastname, gender, username, email, passwd) {
      return httpPost(urlUser + "/signup", {
        firstname: firstname,
        lastname: lastname,
        gender: gender,
        username: username,
        email: email,
        passwd: passwd
      });
    };

    apiFactory.user.signupFB = function(firstname, lastname, gender, username, email, passwd, fb_id, fb_token) {
      return httpPost(urlUser + "/signup", {
        firstname: firstname,
        lastname: lastname,
        gender: gender,
        username: username,
        email: email,
        passwd: passwd,
        facebook_id: fb_id,
        facebook_token: fb_token
      });
    };

    apiFactory.user.authenticate = function(email, passwd) {
      return httpPost(urlUser + "/get_token", {
        email: email,
        passwd: passwd
      }).then(function(res) {
        return res.data;
      });
    };

    apiFactory.user.authenticateFB = function(user_id, user_token) {
      return httpPost(urlUser + "/get_token", {
        facebook_id: user_id,
        facebook_token: user_token
      }).then(function(res) {
        return res.data;
      });
    };

    apiFactory.user.changePassword = function(old_pwd, new_pwd) {
      return httpPost(urlUser + "/change_passwd", {
        old_passwd: old_pwd,
        new_passwd: new_pwd
      }).then(function(res) {
        return res;
      });
    };

    apiFactory.user.editUser = function(data) {
      return httpPost(urlUser + "/update", data);
    };

    /* API INGREDIENT */

    apiFactory.ingredient.find = function(config) {
      return httpGet(urlIngredient, config);
    };

    apiFactory.ingredient.findById = function(id, config) {
      return httpGet(urlIngredient + '/' + id, config);
    };

    apiFactory.ingredient.deleteById = function(id, config) {
      return httpDelete(urlIngredient + '/' + id, config);
    };

    apiFactory.ingredient.updateById = function(id, data, config) {
      return httpPut(urlIngredient + '/' + id, data, config);
    };

    apiFactory.ingredient.create = function(data, config) {
      return httpPost(urlIngredient, data, config);
    };

    apiFactory.ingredient.findCategories = function(config) {
      return httpGet(urlIngredient + "/categories", config);
    };

    apiFactory.ingredient.count = function(config) {
      return httpGet(urlIngredient + "/count", config).then(function(res) {
        return res.data.count;
      });
    };

    /* API TIMELINE */

    apiFactory.timeline.find = function(config) {
      return httpGet(urlTimeline, config);
    };

    /* API RECIPE */

    apiFactory.recipe.find = function(config) {
      return httpGet(urlRecipe, config);
    };

    apiFactory.recipe.findById = function(id, config) {
      return httpGet(urlRecipe + '/' + id, config);
    };

    apiFactory.recipe.findCategories = function(config) {
      return httpGet(urlRecipe + "/categories", config);
    };

    apiFactory.recipe.create = function(data, config) {
      return httpPost(urlRecipe, data, config);
    };

    apiFactory.recipe.updateById = function(id, data, config) {
      return httpPut(urlRecipe + '/' + id, data, config);
    };

    apiFactory.recipe.myComment = function(id, config) {
      return httpGet(urlRecipe + '/' + id + "/my_comment", config);
    };

    /* API RECIPE COMMENT */

    apiFactory.recipe_comment.find = function(config) {
      return httpGet(urlRecipeComment, config);
    };

    apiFactory.recipe_comment.create = function(data, config) {
      return httpPost(urlRecipeComment, data, config);
    };

    apiFactory.recipe.count = function(config) {
      return httpGet(urlRecipe + "/count", config).then(function(res) {
        return res.data.count;
      });
    };

    apiFactory.recipe.deleteById = function(id, config) {
      return httpDelete(urlRecipe + '/' + id, config);
    };

    /* COMMON */

    apiFactory.common.search = function(config) {
      return httpGet(urlCommon + "/search", config);
    };

    return apiFactory;
  }
]);

app.factory('apiSocketFactory', ["socketFactory", "apiSocketURL", function(socketFactory, apiSocketURL) {
  if (!window.io) {
    console.warn("Can't load socket.io !");
    return {subscribe: _.identity};
  }
  var ioSocket = io.connect(apiSocketURL);
  var socket = socketFactory({
    ioSocket: ioSocket,
    prefix: "apiSocket:"
  });
  var counter = {};
  var fac = {};

  fac.subscribe = function(events, scope) {
    var toSubscribe = [];
    _.forEach(events, function(ev) {
      if (counter[ev] == undefined) {
        counter[ev] = 1;
      } else {
        counter[ev] += 1;
      }
      if (counter[ev] == 1) {
        toSubscribe.push(ev);
      }
    });
    if (toSubscribe.length > 0) {
      socket.emit("subscribe", {names: toSubscribe});
    }

    scope.$on("$destroy", function() {
      var toUnsubscribe = [];
      _.forEach(events, function(ev) {
        counter[ev] -= 1;
        if (counter[ev] <= 0) {
          toUnsubscribe.push(ev);
        }
      });
      if (toUnsubscribe.length > 0) {
        socket.emit("unsubscribe", {names: toUnsubscribe});
      }
    });

    socket.forward(events, scope);
  };

  return fac;
}]);


app.factory("Facebook", ["$q",
  function(Q) {
    var loaded = false;
    var fac = {};

    window.fbAsyncInit = function() {
      console.log("Facebook is loaded !");
      loaded = true;
      FB.init({
        appId: '1569143169966374',
        xfbml: true,
        version: 'v2.2'
      });
    };

    function waitLoaded(fn) {
      if (loaded) return fn();
      setTimeout(waitLoaded, 100, fn);
    }

    fac.login = function(scope) {
      var d = Q.defer();
      waitLoaded(function() {
        FB.login(function(res) {
          if (res.status === 'connected') {
            d.resolve(res);
          } else {
            d.reject(res);
          }
        }, scope);
      });
      return d.promise;
    };

    return fac;
  }
]);

app.controller('MainAppCtrl', ['$scope', 'apiFactory',
  function($scope, apiFactory) {
    $scope.loaded = true;
    $scope.apiFactory = apiFactory;
    if (apiFactory.getToken() && !apiFactory.isRole()) {
      $scope.loaded = false;
      apiFactory.user.me()
        .then(function(data) { // token is the same
          apiFactory.setUser(data);
        }, function(res) { // invalid token
          if (res.status == 403) apiFactory.logout();
        })
        .then(function() {
          $scope.loaded = true;
        });
    }
  }
]);

app.controller('RouteCtrl', ['$scope', '$location', 'apiFactory', function($scope, $location, apiFactory) {
  $scope.apiFactory = apiFactory;
  $scope.isActive = function(route) {
    return route === $location.path();
  };

  $scope.go = function (path) {
    $location.url(path);
  };
}]);
