var registerUserViewControllers = angular.module('registerUserViewControllers', []);

registerUserViewControllers.controller('RegisterUserViewCtrl', ['$scope',
  function($scope) {
  }
]);

registerUserViewControllers.controller("RegisterFormCtrl", ['$scope', 'apiFactory', "globalFactory", "$location", function($scope, apiFactory, glob, $location) {
  var initData = glob.pop("forRegisterUser");
  var facebookMode = undefined;
  if (initData === undefined) {
    facebookMode = false;
    $scope.registerInputGender = "male";
  } else {
    facebookMode = true;
    $scope.registerInputGender = initData.gender;
    $scope.registerInputFirstname = initData.firstname;
    $scope.registerInputLastname = initData.lastname;
    $scope.registerInputEmail = initData.email;
  }

  $scope.submitRegister = function(isValid) {
    $scope.submitted = true;
    $scope.usernameAlreadyExists = false;
    $scope.emailAlreadyExists = false;
    $scope.passwordDontMatch = false;

    if (isValid) {
      if ($scope.registerInputPassword != $scope.registerInputConfirmPassword) {
        $scope.passwordDontMatch = true;
        return;
      }
      var fn = undefined;
      if (facebookMode) {
        fn = apiFactory.user.signupFB($scope.registerInputFirstname, $scope.registerInputLastname, $scope.registerInputGender,
                                    $scope.registerInputUsername, $scope.registerInputEmail, $scope.registerInputPassword,
                                    initData.facebook_id, initData.facebook_token);
      } else {
        fn = apiFactory.user.signup($scope.registerInputFirstname, $scope.registerInputLastname, $scope.registerInputGender,
                                    $scope.registerInputUsername, $scope.registerInputEmail, $scope.registerInputPassword);
      }
      fn.then(function(res) {
        return apiFactory.user.authenticate($scope.registerInputEmail, $scope.registerInputPassword).then(function(data) {
          apiFactory.setToken(data.token.token, $scope.loginInputRemember);
          apiFactory.setUser(data.user);
          $location.url('/');
        }, function() {
          apiFactory.logout('/');
        });
      }, function(res) {
        var err = res.data;
        if (err.status == 400 && err.error == "E_VALIDATION") {
          var mapping = {username: "usernameAlreadyExists", email: "emailAlreadyExists"};
          _.forOwn(err.invalidAttributes, function(errors, field) {
            errors = _.pluck(errors, 'rule');
            if (_.contains(errors, "unique")) {
              var realName = mapping[field];
              $scope[realName] = true;
            }
          });
        }
        else {}
      });
    }
  };
}]);
