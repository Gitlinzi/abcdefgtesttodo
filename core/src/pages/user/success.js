/**
 * Created by Roy on 15/10/23.
 */
appControllers.controller("successCtrl", ['$rootScope', 'commonService','$window','$scope',function ($rootScope, commonService,$window,$scope) {
    "use strict"
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
}])
