/**
 * Created by Roy on 15/10/23.
 */
appControllers.controller("joinProcessStepCtrl", ['$rootScope', '$scope', 'commonService', 'validateService', '$interval', function ($rootScope, $scope, commonService, validateService, $interval) {
    "use strict"
    //默认省份与小能
    $rootScope.execute(false);
    var _ut = $rootScope.util.getUserToken();
    if (!_ut) {
        location.href = '/login.html';
    };
    $scope.reload = function () {
        location.reload();
    }
    $scope.backUrl = function () {
        location.href = '/joinProcess.html';
    }
}])
