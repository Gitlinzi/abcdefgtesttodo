/**
 * Created by Roy on 17/6/29.
 */
'use strict';
angular.module('appControllers').controller('questionDetailCtrl',['$scope','$rootScope','$cookieStore','commonService', 'categoryService','validateService','Upload','$state','$stateParams','$window',
    function($scope,$rootScope,$cookieStore,commonService, categoryService,validateService,Upload,$state,$stateParams,$window) {
        //国际化
        $scope.i18n = function (key) {
            return $window.i18n ? $window.i18n(key) : key;
        };
    }]);
