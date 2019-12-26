/**
 * Created by Roy on 15/10/23.
 */
appControllers.controller("supportCtrl",['$rootScope','$scope','commonService','$sce','$window',function($rootScope,$scope,commonService,$sce,$window){
	"use strict"
	$scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
	//默认省份与小能
	$rootScope.execute(false);
	$scope.mpId = window.location.href.match(/mpId=(\d+)&/)[1];
	$scope.sectid = window.location.href.match(/sectid=(\d+)/)[1];
	$scope.supportUrl = $rootScope.host+'/product/securityInfo?mpId='+$scope.mpId+'&sectid='+$scope.sectid;
	$rootScope.ajax.get($scope.supportUrl, {}).then(function(res){
		if(res.code == "0"){
			if(res.data){
				$scope.supportCon = res.data.content;
				$scope.trustHtml = $sce.trustAsHtml($scope.supportCon);
				$scope.supTitle = res.data.title;
			}
		}
	})
}]);
