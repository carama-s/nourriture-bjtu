var addIngredientViewControllers = angular.module('addIngredientViewControllers', []);

addIngredientViewControllers.controller('AddIngredientViewCtrl', ['$scope', '$location', 'apiFactory', 'ingredient_categories_mapper',
  function($scope, $location, apiFactory, ingredient_categories_mapper) {
    $scope.submitted = false;

    // Periods
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

    $scope.hasSeasonPeriod = function() {
      if ($scope.categoryIngredient == 'fruit' || $scope.categoryIngredient == 'vegetable') {
        return true;
      }
      return false;
    };

    // Image
    $scope.simulateClickFile = function() {
      $("#uploadImage").click();
    };

    // Nutrition

    $scope.nutritions = [];

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
      $scope.nutritions.splice(index, 1);
    };

    $scope.addNutrition = function() {
      if ($scope.nutritions.length > 0 && !nutritionIsValid(_.last($scope.nutritions))) return;
      $scope.nutritions.push({designation: '', value: '', dailyValue: ''});
    };

    $scope.submitAddIngredient = function() {
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
        period[i] = ($scope.months[i].active ? 1 : 0);
      }

      var nutritionsOk = _.every($scope.nutritions, nutritionIsValid);
      if (!nutritionsOk) return;

      var fd = new FormData();
      fd.append('photo', $scope.photoIngredient);
      fd.append('name', $scope.nameIngredient);
      fd.append('category', $scope.categoryIngredient);
      fd.append('description', $scope.descriptionIngredient);
      fd.append('period', JSON.stringify(period));
      fd.append("nutritions", JSON.stringify($scope.nutritions));

      var config = {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      };
      apiFactory.ingredient.create(fd, config).then(function(res) {
        console.log(res.data);
        $location.url("/ingredients");
      }, function(res) {
        console.error(res);
      });
    };
  }
]);
