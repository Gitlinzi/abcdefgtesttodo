/**
 * Created by Roy on 17/6/29.
 */
'use strict';
angular.module('appControllers').controller('indexCreditCtrl', ['$scope', '$rootScope', '$cookieStore', 'commonService', 'categoryService', 'validateService', 'Upload', '$state', '$stateParams', function ($scope, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload, $state, $stateParams) {
    var urlParams = $stateParams,
        _ut = $rootScope.util.getUserToken(),
        _host = $rootScope.host,
        _fnP = $rootScope.ajax.post,
        _fnE = $rootScope.error.checkCode;
    if (!_ut) {
        $rootScope.showLoginBox = true;
        return;
    };


    $scope.activeNum = $stateParams.activeNum || 0;

    //初始化
    $scope.init = function (creditStatus) {
        "use strict";
        $scope.isShowIcon = false;//是否展示icon
        $scope.isShowPage = false;//是否展示分页
        if(creditStatus == 0){
            $scope.creditStatus = null;
        }else {
            $scope.creditStatus = creditStatus;
        }
        $scope.initPagination();
        $scope.getCreditList();
    }

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
        $scope.getCreditList();
    });
    //我的信用额度列表
    $scope.getCreditList = function () {
        var that = this;
        $scope.creditList = [];//信用额度列表
        _fnP('/back-finance-web/api/userAccount/queryUserCreditAccountLogListInMerchant.do', {
            currentPage: $scope.pageNo,
            itemsPerPage: $scope.pageSize,
            operationType: $scope.creditStatus
        }).then(function (res) {
            if (res.code == 0 && res.data != null && res.data.listObj && res.data.listObj.length > 0) {
                    $scope.totalCount = res.data.total;
                    $scope.totalPage = $scope.totalCount % $scope.pageSize == 0 ? (($scope.totalCount / $scope.pageSize) || 1) : parseInt($scope.totalCount / $scope.pageSize) + 1;
                    $scope.creditList = res.data.listObj || [];
                    $scope.isShowPage = true;
            } else {
                $scope.isShowPage = false;
                $scope.isShowIcon = true;
                $rootScope.error.checkCode(res.code, res.message);
            }
        }, function (res) {
            $scope.isShowPage = false;
            $scope.isShowIcon = true;
            $rootScope.error.checkCode('系统异常', '获取信用额度异常');
        })
    };

    //我的信用额度账户
    $scope.myCreditAccount = {};
    $scope.getCreditAccount = function () {
        _fnP('/back-finance-web/api/userAccount/queryUserCreditAccountInMerchant.do', {
        }).then(function (res) {
            if (res.code == 0 ) {
                if(res.data){
                    $scope.myCreditAccount = res.data;
                }
            }
        }, function (res) {
            $rootScope.error.checkCode('系统异常', '获取信用额度异常');
        })
    };

    $scope.getCreditAccount();
    $scope.$watch('activeNum', function (val) {
        $scope.init(val);
    });
}]);
