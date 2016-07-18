/**
 * contacts.directive.js
 *
 * no globals
 */

(function() {

  'use strict';

  angular
    .module('myApp')
    .directive("contactForm", contactForm)
    .directive("contactList", contactList)
    .directive("username", username)
    .directive("email", checkEmail)
    .directive("confirm", confirm)

  // Display contact form to add/edit contact
  function contactForm() {
    var directive = {
      restrict: "E",
      transclude: true,
      replace: false,
      templateUrl: "contacts/form",
    };

    return directive;
  }

  // Display a list of contacts
  function contactList() {
    var directive =  {
      restrict: "E",
      transclude: true,
      replace: false,
      templateUrl: "contacts/list",
    };

    return directive;
  }
  // Native confirm delete
  // usage
  // button.btn.btn-danger(confirm="Are you sure?", confirmed-click="cCtrl.remove(contact._id)") Delete
  function confirm() {
    return {
      link: function (scope, element, attr) {
        var msg = attr.confirm;
        var clickAction = attr.confirmedClick;
        element.bind('click', function (event) {
          if (window.confirm(msg)) {
            scope.$eval(clickAction)
          }
        });
      }
    };
  }
  function username($q, $timeout, $http) {
    return {
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {
        var usernames = [];

        ctrl.$asyncValidators.username = function(modelValue, viewValue) {

          if (ctrl.$isEmpty(modelValue)) {
            // consider empty model valid
            return $q.when();
          }

          var def = $q.defer();

          $timeout(function() {
            console.log(modelValue);
            $http.get('/api/checkUsernameContact/' + modelValue)
              // handle success
              .success(function (data, status) {
                if(status === 200 && data !== null){
                  // def.resolve(data);
                  def.reject();
                }
                else {
                  def.resolve();
                }
              })
              // handle error
              .error(function (fallback) {
                // deferred.reject - with or without reason
                def.resolve(fallback);
              });

          }, 300);

          return def.promise;
        };
      }
    };
  }

  function checkEmail($q, $timeout, $http) {
    return {
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {
        ctrl.$asyncValidators.emailExists = function(modelValue, viewValue) {
          if (ctrl.$isEmpty(modelValue)) {
            // consider empty model valid
            return $q.when();
          }

          var def = $q.defer();

          $timeout(function() {
            $http.get('/api/checkEmailContact/' + modelValue)
              // handle success
              .success(function (data, status) {
                if(status === 200 && data !== null){
                  def.reject();
                }
                else {
                  def.resolve();
                }
              })
              // handle error
              .error(function (fallback) {
                // deferred.reject - with or without reason
                def.resolve(fallback);
              });

          }, 300);

          return def.promise;
        };
      }
    };
  }

})();
