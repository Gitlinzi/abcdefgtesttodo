/**
 * Created by Roy on 17/6/29.
 */
'use strict';
angular.module('appControllers').controller('commissionCtrl', ["$scope", "$rootScope", "$cookieStore", "commonService", 'categoryService', "validateService", "Upload","$window",
    function ($scope, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload,$window) {
        //国际化
        $scope.i18n = function (key) {
            return $window.i18n ? $window.i18n(key) : key;
        };
        var _ut = $rootScope.util.getUserToken();

        if (!_ut) {
            $rootScope.showLoginBox = true;
            return;
        };

        $scope.commissionSum = 0;
        $scope.edouFreezed = 0;
        $scope.EdouList = null;//佣金列表


        $scope.init = function (inOutType) {
            "use strict";
            $scope.isShowIcon = false;//是否展示icon
            $scope.isShowPage = false;//是否展示分页
            $scope.inOutType = inOutType;
            $scope.initPagination();
            $scope.getEdoutList();
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
            $scope.getEdoutList();
        })

        //我的佣金
        $scope.getEdoutList = function () {
            var that =this;
            that.EdouList =[];

            $rootScope.ajax.post('/back-finance-web/api/commission/queryCommissionIncomeDetail.do', {
                currentPage: $scope.pageNo,
                itemsPerPage: $scope.pageSize,
                inOutType: $scope.inOutType
            }).then(function (res) {
                if (res.code == 0) {
                    if (res.data.commissionDetail.listObj.length > 0) {
                        $scope.EdouList = res.data.commissionDetail.listObj || [];
                        that.totalCount=res.data.commissionDetail.total;
                        $scope.totalPage = $scope.totalCount % $scope.pageSize == 0 ? (($scope.totalCount / $scope.pageSize) || 1) : parseInt($scope.totalCount / $scope.pageSize) + 1;
                        $scope.isShowPage = true;
                    } else {
                        $scope.isShowIcon = true;
                    }
                }else {
                    $scope.isShowIcon = true;
                }
            }, function (res) {
                $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('获取佣金异常'));
            })

            //获取佣金账户
            $rootScope.ajax.post('/back-finance-web/api/commission/queryCommissionAccount.do', {
            }).then(function (res) {
                if (res.code == 0) {
                    if (res.data) {
                        $scope.commissionSum = res.data.availableAccountAmount;
                        $scope.edouFreezed = res.data.frozenAmount;
                    }
                } else {
                }
            }, function (res) {
                $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('获取佣金账户异常'));
            })


        };
    }]);
    angular.module('appControllers').filter("newCurrency",function () {
        return function (value) {
            var newValue = value.toFixed(2);
            if(newValue > 0){
                return '+' + newValue;
            } else{
                return newValue;
            }
        }
    })
