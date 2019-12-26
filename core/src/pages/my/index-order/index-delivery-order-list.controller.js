/**
 * Created by Roy on 17/1/5.
 */
angular.module('appControllers').controller('deliveryOrderCtrl', ["$scope", "$rootScope", "$q", "$cookieStore", "commonService", 'categoryService', "validateService", "Upload", "$state", "$stateParams","$window", "$filter", "allUrlApi","$timeout",function ($scope, $rootScope, $q, $cookieStore, commonService, categoryService, validateService, Upload, $state, $stateParams,$window,$filter, allUrlApi,$timeout) {
    //国际化
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
    var _ut = $rootScope.util.getUserToken();
    if (!_ut) {
        $rootScope.showLoginBox = true;
        return;
    };
    $scope.deliveryOrderList = []
    $scope.getDeliveryOrderList = function() {
        // var urlParamt = $rootScope.util.paramsFormat(location.search)
        var url = '/custom-sbd-web/order/devliverOrderList.do'
        var params = {
            orderCode: $stateParams.code,
            pageNum: $scope.pageNo,
            pageSize: $scope.pageSize
        }
        $rootScope.ajax.postJson(url,params).then(function(res) {
            if (res.code ==0 && res.data) {
                $scope.deliveryOrderList = res.data.list || []
                $scope.totalCount = res.data.total
                $scope.totalPage = $scope.totalCount % $scope.pageSize == 0 ? (($scope.totalCount / $scope.pageSize) || 1) : parseInt($scope.totalCount / $scope.pageSize) + 1;
            }
        })
    }
    $scope.isShowPage = true
     //初始化翻页, 切换tab的时候也会初始化分页
     $scope.initPagination = function () {
        $scope.pageNo = 1;
        $scope.pageSize = 5;
        $scope.totalCount = 0;
        
    }
    $scope.initPagination()
    //翻页广播接收
    $scope.$on('changePageNo', function (event, data) {
        "use strict";
        $scope.pageNo = data;
        $scope.getDeliveryOrderList()
    })
    // 返回
    $scope.goToBack = function() {
        history.back()
    }
    $scope.deliveryOrder = {
        init: function() {
            $scope.getDeliveryOrderList()
            // 初始化翻页
            $scope.initPagination()
        }
    }
}]);

