/**
 * Created by Roy on 15/10/20.
 */

//var appControllers=angular.module("appControllers",['ngCookies','ngFileUpload','directives','filters','services']);

appControllers.controller("marketingIndexCtrl", ['$log', '$rootScope', '$scope', 'commonService','categoryService', function ($log, $rootScope, $scope, commonService,categoryService) {
    'use strict';
    var ut = $rootScope.util.getUserToken(),
        _host = $rootScope.host,
        _fnP = $rootScope.ajax.post,
        _fnE = $rootScope.error.checkCode;
    $rootScope.execute();
    //
    $scope.getPageHome = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_SCENE_HOME_PAGE',
                adCode: 'scene_illustration,scene_classification',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.get(url, params).then(function (res) {
            if (res.data && res.data.scene_illustration && res.data.scene_illustration.length>0) {
                $scope.sceneIllustration = res.data.scene_illustration[0];
            }
            if (res.data && res.data.scene_classification && res.data.scene_classification.length>0) {
                $scope.sceneClassification = res.data.scene_classification;
            }
        })
    };
    $scope.getPageHome();
}]);

