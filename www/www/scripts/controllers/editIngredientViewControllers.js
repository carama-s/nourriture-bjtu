var editIngredientViewControllers = angular.module('editIngredientViewControllers', []);

editIngredientViewControllers.controller('EditIngredientViewCtrl', function() {});

editIngredientViewControllers.controller('EditIngredientCtrl', ['$scope', '$routeParams', '$location', 'apiFactory', 'ingredient_categories_mapper',
  function($scope, $routeParams, $location, apiFactory, ingredient_categories_mapper) {
    $scope.loaded = false;
    $scope.ingredientId = $routeParams.id;
    $scope.emptyIngredientName = false;
    $scope.emptyIngredientDescription = false;
    // Categories
    $scope.ingredient_categories_mapper = ingredient_categories_mapper;
    $scope.changeCategory = function($event, value) {
      var parent = $event.currentTarget.parentNode;
      for (var i = 1; i < parent.children.length; i++) {
        parent.children[i].style.backgroundColor = "#DADADA";
      }
      $event.currentTarget.style.backgroundColor = ingredient_categories_mapper[value].color;
      $scope.categoryIngredient = value;
    };

    // Image
    $scope.simulateClickFile = function() {
      $("#uploadImage").click();
    };

    // Season Period
    $scope.months = [
      {name: "Jan", active: false},
      {name: "Fev", active: false},
      {name: "Mar", active: false},
      {name: "Apr", active: false},
      {name: "May", active: false},
      {name: "Jun", active: false},
      {name: "Jul", active: false},
      {name: "Aug", active: false},
      {name: "Sep", active: false},
      {name: "Oct", active: false},
      {name: "Nov", active: false},
      {name: "Dec", active: false}
    ];

    $scope.changeMonth = function(index) {
      $scope.months[index].active = !$scope.months[index].active;
    }

    $scope.hasSeasonPeriod = function() {
      if ($scope.categoryIngredient == 'fruit' || $scope.categoryIngredient == 'vegetable') {
        return true;
      }
      return false;
    };

    // Load data
    apiFactory.ingredient.findById($routeParams.id).then(function(res) {
      $scope.ingredient = res.data;
      $scope.nameIngredient = $scope.ingredient.name;
      $scope.categoryIngredient = $scope.ingredient.category;
      $scope.descriptionIngredient = $scope.ingredient.description;

      for (var i = 0; i < $scope.ingredient.period.length; i++) {
        ($scope.ingredient.period[i]) ? ($scope.months[i].active = true) : '';
      }

      $scope.loaded = true;
    });

    // Nutritions

    function nutritionIsValid(row) {
      var final = true;
      if (row.designation.trim().length <= 0) {
        final = false;
      }
      if (row.value.trim().length <= 0) {
        final = false;
      }
      if (row.dailyValue.trim().length <= 0) {
        final = false;
      }
      return final;
    }

    $scope.removeNutrition = function(index) {
      $scope.ingredient.nutritions.splice(index, 1);
    };

    $scope.addNutrition = function() {
      if ($scope.ingredient.nutritions.length > 0 && !nutritionIsValid(_.last($scope.ingredient.nutritions))) return;
      $scope.ingredient.nutritions.push({designation: '', value: '', dailyValue: ''});
    };

    // Submit data
    $scope.submitEditIngredient = function() {
      $scope.submitted = true;
      // Verification
      if ($scope.nameIngredient == undefined || $scope.nameIngredient == '') {
        $scope.emptyIngredientName = true;
      }
      if ($scope.descriptionIngredient == undefined || $scope.descriptionIngredient == '') {
        $scope.emptyIngredientDescription = true;
      }
      if ($scope.emptyIngredientName || $scope.emptyIngredientDescription) {
        return;
      }

      var period = [];
      for(var i = 0; i < $scope.months.length; i++) {
        if ($scope.hasSeasonPeriod()) {
          period[i] = ($scope.months[i].active ? 1 : 0);
        }
        else {
          period[i] = 0;
        }
      }

      var nutritionsOk = _.every($scope.ingredient.nutritions, nutritionIsValid);
      if (!nutritionsOk) return;

      var fd = new FormData();
      fd.append('photo', $scope.photoIngredient);
      fd.append('name', $scope.nameIngredient);
      fd.append('category', $scope.categoryIngredient);
      fd.append('description', $scope.descriptionIngredient);
      fd.append('period', JSON.stringify(period));
      fd.append("nutritions", JSON.stringify($scope.ingredient.nutritions));

      var config = {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      };
      apiFactory.ingredient.updateById($routeParams.id, fd, config).then(function(res) {
        console.log(res.data);
        $location.url("/ingredient/" + $routeParams.id);
      }, function(res) {
        console.error(res);
      });
    };
  }
]);
