var recipeViewControllers = angular.module('recipeViewControllers', []);

recipeViewControllers.controller('RecipeViewCtrl', ['$scope', '$routeParams', '$location', '$document', 'apiFactory', 'recipe_categories_mapper',
  function($scope, $routeParams, $location, $document, apiFactory, recipe_categories_mapper) {
    $scope.loaded = false;
    $scope.recipeId = $routeParams.id;
    $scope.recipe_categories_mapper = recipe_categories_mapper;

    function updateComments() {
      var config = {
        params: {
          where: JSON.stringify({recipe: $scope.recipe.id})
        }
      }
      apiFactory.recipe_comment.find(config).then(function(res) {
        $scope.comments = res.data;
        $scope.nb_comments = $scope.comments.length;
      });
      apiFactory.recipe.myComment($routeParams.id).then(function(res) {
        if (res.data.id) {
          $scope.commented = true;
        }
      });
    }

    apiFactory.recipe.findById($routeParams.id).then(function(res) {
      $scope.recipe = res.data;
      $scope.rate = res.data.rate;
      updateComments();

      var ingredients = _.pluck(res.data.ingredients, "ingredient");
      var quantities = _.mapValues(_.groupBy(res.data.ingredients, "ingredient"), function(ings) {
        return ings[0].quantity;
      });
      var config = {
        params: {
          where: JSON.stringify({id: ingredients})
        }
      };
      apiFactory.ingredient.find(config).then(function(res) {
        $scope.recipe.ingredients = _.map(res.data, function(ing) {
          ing.quantity = quantities[ing.id];
          return ing;
        });
        $scope.loaded = true;
      });
    });

    $scope.deleteRecipe = function() {
      apiFactory.recipe.deleteById($routeParams.id).then(function(res) {
        $location.url("/recipes");
      });
    };

    $scope.submitted = false;
    $scope.my_rate = 0;
    $scope.ratingStates = [
      {stateOn: 'glyphicon-star rating-star-selected', stateOff: 'glyphicon-star rating-star-unselected'},
      {stateOn: 'glyphicon-star rating-star-selected', stateOff: 'glyphicon-star rating-star-unselected'},
      {stateOn: 'glyphicon-star rating-star-selected', stateOff: 'glyphicon-star rating-star-unselected'},
      {stateOn: 'glyphicon-star rating-star-selected', stateOff: 'glyphicon-star rating-star-unselected'},
      {stateOn: 'glyphicon-star rating-star-selected', stateOff: 'glyphicon-star rating-star-unselected'}
    ];
    $scope.submit = function() {
      $scope.submitted = true;
      $scope.emptyRate = false;
      $scope.emptyComment = false;
      console.log($scope.comment);

      if ($scope.my_rate == 0) {
        $scope.emptyRate = true;
      }
      if ($scope.comment == undefined || $scope.comment == "") {
        $scope.emptyComment = true;
      }
      console.log($scope.my_rate);
      if ($scope.emptyComment || $scope.emptyRate) {
        return;
      }

      apiFactory.recipe_comment.create({"recipe": $scope.recipe.id, "rate": $scope.my_rate, "comment": $scope.comment}).then(function(res) {
        updateComments();
      });


    };
  }
]);
