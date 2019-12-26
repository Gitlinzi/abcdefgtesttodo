/**
 * Created by Roy on 17/1/10.
 */
appControllers.controller('couponsCtrl', ["$scope", "$rootScope", "$cookieStore", "commonService", "$log","$stateParams","$window",
    function ($scope, $rootScope, $cookieStore, commonService, $log,$stateParams,$window) {
        //国际化
        $scope.i18n = function (key) {
            return $window.i18n ? $window.i18n(key) : key;
        };
        //左侧菜单
        var _ut = $rootScope.util.getUserToken();

        if(!_ut){
            $rootScope.showLoginBox = true;
            return;
        }

        $scope.numList = [0,1,2,3];

        $scope.isShowDesc = false;//是否显示优惠券说明
        $scope.couponList = null;
        $scope.activeNum = $stateParams.activeNum || 1;


        //初始化
        $scope.init = function (activeNum) {
            "use strict";
            $scope.couponList = [];
            $scope.activeNum = activeNum;
            $scope.isShowIcon = false;
            $scope.isShowPage = false;
            $scope.initPagination();
            $scope.getAllCoupons();
        }

        //初始化翻页
        $scope.initPagination = function () {
            $scope.pageNo = 1;
            $scope.pageSize = 12;
            $scope.totalCount = 0;
        };

        //翻页广播接收
        $scope.$on('changePageNo', function (event, data) {
            $scope.pageNo = data;
            $scope.getAllCoupons();
        })

        //获取优惠券列表
        $scope.getAllCoupons = function () {
            var params = {
                    companyId: $rootScope.companyId,
                    pageSize: $scope.pageSize,
                    pageNo: $scope.pageNo,
                    couponStatus: $scope.activeNum
                },
                that = this;
            $rootScope.ajax.post('/api/my/coupon', params).then(function (res) {
                $scope.isShowIcon = false;
                that.totalCount = 0;
                that.couponList = [];
                if (res.code == 0) {
                    if ($scope.activeNum == 1) {
                        if (res.data.canUseCouponList.length > 0) {
                            that.totalCount = res.data.canUserCount;
                            $scope.couponList = res.data.canUseCouponList;
                            that.isShowPage = true;
                        } else {
                            $scope.isShowIcon = true;
                        }
                    } else if ($scope.activeNum == 2) {
                        if (res.data.usedCouponList.length > 0) {
                            that.totalCount = res.data.usedCount;
                            $scope.couponList = res.data.usedCouponList;
                            that.isShowPage = true;
                        } else {
                            $scope.isShowIcon = true;
                        }
                    } else if ($scope.activeNum == 3) {
                        if (res.data.expiredCouponList.length > 0) {
                            that.totalCount = res.data.expiredCount;
                            $scope.couponList = res.data.expiredCouponList;
                            that.isShowPage = true;
                        } else {
                            $scope.isShowIcon = true;
                        }
                    }
                    $scope.totalPage = $scope.totalCount % $scope.pageSize == 0 ? $scope.totalCount / $scope.pageSize : parseInt($scope.totalCount / $scope.pageSize) + 1;
                } else {
                    $scope.isShowIcon = true;
                }
            }, function (res) {
                $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('获取优惠券失败'));
            })
        };
        $scope.init($scope.activeNum);
    }])
