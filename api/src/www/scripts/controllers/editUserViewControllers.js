var editUserViewControllers = angular.module('editUserViewControllers', []);

editUserViewControllers.controller('EditUserViewCtrl', ['$scope', 'apiFactory',
  function($scope, apiFactory) {
    $scope.apiFactory = apiFactory;
  }
]);

editUserViewControllers.controller("EditUserFormCtrl", ['$scope', '$timeout', 'apiFactory',
  function($scope, $timeout, apiFactory) {
    $scope.editUserInputFirstname = apiFactory.getUser().firstname;
    $scope.editUserInputLastname = apiFactory.getUser().lastname;
    $scope.editUserInputGender = apiFactory.getUser().gender;
    $scope.editUserInputEmail = apiFactory.getUser().email;

    $scope.emailAlreadyExists = false;

    $scope.submitEditUser = function(isValid) {
      $scope.submitted = true;
      $scope.editUserSuccess = false;

      if (isValid) {
        apiFactory.user.editUser({'firstname': $scope.editUserInputFirstname, 'lastname': $scope.editUserInputLastname, 'gender': $scope.editUserInputGender, 'email': $scope.editUserInputEmail })
          .then(function(res) {
            $scope.editUserSuccess = true;
          }, function(res) {
            var err = res.data;
            if (err.status == 400 && err.code == "E_VALIDATION") {
              var mapping = {email: "emailAlreadyExists"};
              _.forOwn(err.invalidAttributes, function(errors, field) {
                errors = _.pluck(errors, 'rule');
                if (_.contains(errors, "unique")) {
                  var realName = mapping[field];
                  $scope[realName] = true;
                }
              });
            }
            else {
              // server problem
            }
        });
      }
    }
  }
]);

editUserViewControllers.controller("ChangePasswordFormCtrl", ['$scope', 'apiFactory', function($scope, apiFactory) {
  $scope.submitChangePassword = function(isValid) {
    $scope.submitted = true;
    $scope.editPasswordSuccess = false;
    $scope.passwordDontMatch = false;
    $scope.badCurrentPassword = false;

    if (isValid) {
      if ($scope.changePasswordInputNewPassword != $scope.changePasswordInputConfirmNewPassword) {
        $scope.passwordDontMatch = true;
        return;
      }
      apiFactory.user.changePassword($scope.changePasswordInputCurrentPassword, $scope.changePasswordInputNewPassword)
        .then(function(res) {
          $scope.editPasswordSuccess = true;
        }, function(res) {
          $scope.badCurrentPassword = true;
        });
    }
  };
}]);
