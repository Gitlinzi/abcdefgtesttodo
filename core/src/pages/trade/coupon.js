/**
 * Created by sindy on 15/11/4.
 */

appControllers.controller("couponCtrl", ['$log', '$rootScope', '$scope', '$cookieStore', 'commonService', 'categoryService', 'config','$window',
    function ($log, $rootScope, $scope, $cookieStore, commonService, categoryService, config,$window) {
    //默认省份与迷你购物车
    $rootScope.execute(false);
    //国际化
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
}]);
