/**
 * Created by Roy on 15/10/23.
 */
appControllers.controller("shareController", ['$rootScope', 'commonService','$window','$scope',function ($rootScope, commonService,$window,$scope) {
    "use strict"
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
    if($rootScope.util.paramsFormat().type=="8"){
        $rootScope.util.cookie.setCookie('shareCode8', $rootScope.util.paramsFormat().shareCode);
        location="login.html?shareCode="+$rootScope.util.paramsFormat().shareCode+"&shareName="+$rootScope.util.paramsFormat().shareName;
    }
    if($rootScope.util.paramsFormat().type=="2"){
        $rootScope.util.cookie.setCookie('shareCode', $rootScope.util.paramsFormat().shareCode);
        location="item.html?itemId="+$rootScope.util.paramsFormat().paramId;
    }
}])
