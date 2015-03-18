var ingredientViewControllers = angular.module('ingredientViewControllers', []);


ingredientViewControllers.controller('IngredientViewCtrl', ['$scope', '$routeParams', '$location', '$document', 'apiFactory', 'ingredient_categories_mapper',
  function($scope, $routeParams, $location, $document, apiFactory, ingredient_categories_mapper) {
    $scope.loaded = false;
    $scope.ingredientId = $routeParams.id;
    $scope.months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    $scope.ingredient_categories_mapper = ingredient_categories_mapper;
    apiFactory.ingredient.findById($routeParams.id).then(function(res) {
      $scope.ingredient = res.data;
      
      $scope.hasSeasonPeriod = function() {
        if ($scope.ingredient.category == 'fruit' || $scope.ingredient.category == 'vegetable')
          return true;
        return false;
      };
      $scope.loaded = true;
    });

    $scope.deleteIngredient = function() {
      apiFactory.ingredient.deleteById($routeParams.id).then(function(res) {
        $location.url("/ingredients");
      });
    };
  }
]);
