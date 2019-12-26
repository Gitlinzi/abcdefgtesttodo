/**
 * Created by Roy on 17/6/29.
 */
'use strict';
angular.module('appControllers').controller('receivableDetailCtrl', ['$scope', '$rootScope', '$cookieStore', 'commonService', 'categoryService', 'validateService', 'Upload', '$state', '$stateParams', function ($scope, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload, $state, $stateParams) {
    var _ut = $rootScope.util.getUserToken(),
        _fnP = $rootScope.ajax.post,
        _fnG = $rootScope.ajax.get,
        _fnE = $rootScope.error.checkCode,
        _host = $rootScope.host,
        _cid = $rootScope.companyId;
    if (!_ut) {
        $rootScope.showLoginBox = true;
        return;
    };

    $scope.init = function () {
        "use strict";
        $scope.initPagination();
        $scope.detail.getBodyList();
    };

    //初始化翻页
    $scope.initPagination = function () {
        $scope.pageNo = 1;
        $scope.pageSize = 10;
        $scope.totalCount = 0;
    };

    //翻页广播接收
    $scope.$on('changePageNo', function (event, data) {
        "use strict";
        $scope.pageNo = data;
        $scope.ck = false;
        $scope.detail.getBodyList();
    });

    $scope.detail = {
        list :[],//从数据数组
        getBodyList : function () {
            var url = '/finance-plugin-web/api/cg/queryPaymentOrderDetailList.do',
                params = {
                    currentPage:$scope.pageNo,
                    itemsPerPage:$scope.pageSize,
                    pfBillNo:$stateParams.pfBillNo
                };
            _fnP(url,params).then(function (res) {
                if(res.code == 0 && res.data != null && res.data.listObj != null & res.data.listObj.length>0){
                    $scope.detail.list = res.data.listObj;
                    $scope.totalCount = res.data.total;
                    $scope.totalPage = $scope.totalCount % $scope.pageSize == 0 ? (($scope.totalCount / $scope.pageSize) || 1) : parseInt($scope.totalCount / $scope.pageSize) + 1;
                    $scope.isShowPage= true;
                    $scope.isShowIcon= false;
                }else {
                    $scope.isShowPage= false;
                    $scope.isShowIcon= true;
                }
            },function (res) {
                $scope.isShowPage= false;
                $scope.isShowIcon= true;
                _fnE("提示","系统异常！");
            })
        },
    };

    $scope.parentOrder = {};
    $scope.getParentOrder = function () {
        if(!$stateParams.pfBillNo){
            _fnE("提示","单据号不能为空！");
        };
        var url = '/finance-plugin-web/api/cg/queryPaymentOrderList.do',
            params = {
                currentPage:1,
                itemsPerPage:10,
                pfBillNo:$stateParams.pfBillNo
            };
        _fnP(url,params).then(function (res) {
            if(res.code == 0){
                if(res.data != null && res.data.listObj != null && res.data.listObj.length>0){
                    $scope.parentOrder = res.data.listObj[0];
                }
            }else {
                $scope.isShowPage= false;
                $scope.isShowIcon= true;
            }
        },function (res) {
            $scope.isShowPage= false;
            $scope.isShowIcon= true;
            _fnE("提示","系统异常！");
        })
    };
    $scope.getParentOrder();
    $scope.init();
}]);
