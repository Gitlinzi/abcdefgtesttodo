/**
 * Created by Roy on 15/10/20.
 */

//var appControllers=angular.module("appControllers",['ngCookies','ngFileUpload','directives','filters','services']);

appControllers.controller("indexCtrl", ['$log', '$rootScope', '$scope', 'commonService', 'categoryService', "$cmsData","$window",function ($log, $rootScope, $scope, commonService,categoryService,$cmsData,$window) {
    'use strict';
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
    $scope.bgColor = $cmsData.pageInfo ? ($cmsData.pageInfo.bgColor? $cmsData.pageInfo.bgColor: '#f8f8f8') : '#f8f8f8';
    //国际化
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
}]);
$(function () {
    'use strict'
    //置顶
    $('.top-box').click(function () {
        $("html,body").animate({
            scrollTop: 0
        }, 500);
    })
})
