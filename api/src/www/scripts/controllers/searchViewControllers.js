var searchViewControllers = angular.module('searchViewControllers', []);

searchViewControllers.controller("SearchViewCtrl", [function() {}]);

searchViewControllers.controller("SearchBarCtrl", ["$scope", "$location",
  function($scope, $location) {
    var qs = $location.search();
    $scope.searchValue = qs.q || "";

    $scope.onSubmit = function() {
      if ($scope.searchValue.length > 0) {
        $location.url("/search?q=" + encodeURI($scope.searchValue));
      }
    };
  }
]);

searchViewControllers.controller('SearchViewResult', ['$scope', "$location", 'apiFactory', 'recipe_categories_mapper', 'ingredient_categories_mapper',
  function($scope, $location, apiFactory, recipe_category_mapper, ingredient_categories_mapper) {
    var qs = $location.search();
    if (!qs.q) return $location.url("/");

    if (qs.what == undefined) $scope.selectedCategory = "all";
    else if (_.contains(["all", "recipe", "ingredient"], qs.what)) $scope.selectedCategory = qs.what;
    else return $location.url("/");

    $scope.modeDisplay = "module";
    $scope.nbElements = 0;
    $scope.nbPage = 0;
    $scope.currentPage = 1;
    $scope.perPage = 9;
    $scope.ingredient_categories_mapper = ingredient_categories_mapper;
    $scope.recipe_category_mapper = recipe_category_mapper;

    function changeUrl(q, what) {
      $location.url("/search?q=" + encodeURI(q) + "&what=" + what);
    }

    $scope.changeCategory = function(v) {
      changeUrl(qs.q, v);
    };

    $scope.switchView = function(v) {
      $scope.modeDisplay = v;
    };

    $scope.pageChanged = function() {
      doSearch();
    };

    function doSearch() {
      var params = {search: qs.q};
      if (_.contains(["recipe", "ingredient"], qs.what)) params.what = qs.what;
      params.limit = $scope.perPage;
      params.skip = ($scope.currentPage - 1) * $scope.perPage;

      apiFactory.common.search({params: params}).then(function(res) {
        $scope.nbElements = res.data.total;
        $scope.nbPage = Math.ceil(res.data.total.all / $scope.perPage);
        $scope.results = res.data.results;
      });
    }

    doSearch();
  }
]);
