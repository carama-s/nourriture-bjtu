var addRecipeViewControllers = angular.module('addRecipeViewControllers', []);

addRecipeViewControllers.controller('AddRecipeViewCtrl', ['$scope', "$timeout", "$document", "$location", 'apiFactory', 'recipe_categories_mapper', 'recipe_categories_mapper_first',
  function($scope, $timeout, $document, $location, apiFactory, recipe_categories_mapper, recipe_categories_mapper_first) {

    var timeUnitMult = {
      "minutes": 1,
      "hours": 60,
      "days": 1440 // 60 * 24
    };

    $scope.timeList = ["minutes", "hours", "days"];
    $scope.submitted = false;
    $scope.servingsRecipe = 1;
    $scope.prepTimeValueRecipe = 0;
    $scope.prepTimeUnitRecipe = $scope.timeList[0];
    $scope.cookTimeValueRecipe = 0;
    $scope.cookTimeUnitRecipe = $scope.timeList[0];
    $scope.categoryRecipe = recipe_categories_mapper_first;

    $scope.stepsRecipe = [];

    // Submit button
    $scope.createRecipe = function() {
      $scope.submitted = true;
      var valid = true;

      // Verification
      if ($scope.nameRecipe == undefined || $scope.nameRecipe.trim().length === 0) {
        $scope.emptyRecipeName = true;
        valid = false;
      }
      if ($scope.descriptionRecipe == undefined || $scope.descriptionRecipe.trim().length === 0) {
        $scope.emptyRecipeDescription = true;
        valid = false;
      }
      $scope.stepsRecipe = _.filter($scope.stepsRecipe, function(step) {
        return (step.trim().length > 0);
      });
      if (!_.contains($scope.timeList, $scope.prepTimeUnitRecipe)) {
        $scope.prepTimeUnitRecipe = $scope.timeList[0];
        valid = false;
      }
      if (!_.contains($scope.timeList, $scope.cookTimeUnitRecipe)) {
        $scope.cookTimeUnitRecipe = $scope.timeList[0];
        valid = false;
      }
      if ($scope.stepsRecipe.length <= 0 || $scope.recipeIngredients <= 0) {
        valid = false;
      }

      if (!valid) return;

      var cooking_time = $scope.cookTimeValueRecipe; // * timeUnitMult[$scope.cookTimeUnitRecipe];
      var preparation_time = $scope.prepTimeValueRecipe; // * timeUnitMult[$scope.prepTimeUnitRecipe];
      var ingredients = _.map($scope.recipeIngredients, function(ing) {
        return {ingredient: ing.id, quantity: ing.quantity};
      });

      var fd = new FormData();
      fd.append('photo', $scope.photoRecipe);
      fd.append('name', $scope.nameRecipe);
      fd.append('category', $scope.categoryRecipe);
      fd.append('description', $scope.descriptionRecipe);
      fd.append("servings", $scope.servingsRecipe);
      fd.append("preparation_time", preparation_time);
      fd.append("cooking_time", cooking_time);
      fd.append("ingredients", JSON.stringify(ingredients));
      fd.append("directions", JSON.stringify($scope.stepsRecipe));

      var config = {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      };

      apiFactory.recipe.create(fd, config).then(function(res) {
        $location.url("/recipes");
      }, function(res) {
        console.error(res);
      });
    };

    // Image
    $scope.simulateClickFile = function() {
      angular.element("#uploadImage").click();
    };

    // Steps
    $scope.addStep = function() {
      function focusLast() {
        var last = angular.element("#lastStepTextAddRecipe");
        last.focus();
        $document.scrollToElementAnimated(last);
      }

      if ($scope.stepsRecipe.length > 0 && _.last($scope.stepsRecipe).trim().length == 0) {
        return focusLast();
      }
      $scope.stepsRecipe.push("");
      $timeout(focusLast);
    };

    $scope.removeStep = function(i) {
      if (i < $scope.stepsRecipe.length) {
        $scope.stepsRecipe.splice(i, 1);
      }
    };

    // Categories
    $scope.recipe_categories_mapper = recipe_categories_mapper;
    $scope.changeCategory = function($event, value) {
      var parent = $event.currentTarget.parentNode;
      for (var i = 1; i < parent.children.length; i++) {
        parent.children[i].style.backgroundColor = "#DADADA";
      }
      $event.currentTarget.style.backgroundColor = recipe_categories_mapper[value].color;
      $scope.categoryRecipe = value;
    };

    // List ingredients
    $scope.recipeIngredients = [];
    $scope.idIngredientExclude = [];
    $scope.urlIngredientExclude = "";

    function updateIdIngredientExclude() {
      $scope.idIngredientExclude = [];
      for (var i = 0; i < $scope.recipeIngredients.length; i++) {
        if ($scope.recipeIngredients[i].id) {
          $scope.idIngredientExclude.push($scope.recipeIngredients[i].id);
        }
      }
      $scope.urlIngredientExclude = "";
      if ($scope.idIngredientExclude.length > 0) {
        $scope.urlIngredientExclude = $.param({ exclude: $scope.idIngredientExclude }) + '&';
      }
    }

    $scope.addIngredientToRecipe = function(selected) {
      $scope.$broadcast('angucomplete-alt:clearInput');

      var new_ingredient = {
        'name': selected.originalObject.name,
        'quantity': '1'
      }

      if (selected.originalObject.id) {
        new_ingredient.id = selected.originalObject.id;
      }

      if (selected.originalObject.photo_url) {
        new_ingredient.photo_url = selected.originalObject.photo_url;
      }
      else {
        new_ingredient.photo_url = '/images/default-preview.png';
      }

      $scope.recipeIngredients.push(new_ingredient);
      updateIdIngredientExclude();
    }

    $scope.checkQuantity = function(data) {
      if (!data || data == '') {
        return "Quantity can't be empty.";
      }
    };

    $scope.removeIngredientFromRecipe = function(index) {
      $scope.recipeIngredients.splice(index, 1);
      updateIdIngredientExclude();
    };

    function initUploadImage() {
      $("#uploadImage").change(function() {
        if (this.files && this.files[0]) {
          var reader = new FileReader();
          reader.onload = function (e) {
            $('#previewImage').css('background-image', 'url(' + e.target.result + ')');
          }
          reader.readAsDataURL(this.files[0]);
        }
      });
    }
    $(document).ready(initUploadImage);
  }
]);
