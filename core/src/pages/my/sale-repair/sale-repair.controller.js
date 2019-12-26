/**
 * Created by Roy on 17/6/29.
 */
'use strict';
angular.module('appControllers').controller('saleRepairCtrl', ["$scope", "$rootScope", "$cookieStore", "commonService", 'categoryService', "validateService", "Upload", "$state", "$stateParams","$window",
    function ($scope, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload, $state, $stateParams,$window) {
        //国际化
        $scope.i18n = function (key) {
            return $window.i18n ? $window.i18n(key) : key;
        };
        var _ut = $rootScope.util.getUserToken(),
            _fnE = $rootScope.error.checkCode,
            _fnP = $rootScope.ajax.post;

        if (!_ut) {
            $rootScope.showLoginBox = true;
            return;
        }
        ;

        //初始化翻页
        $scope.initPagination = function () {
            $scope.pageNo = 1;
            $scope.pageSize = 10;
            $scope.totalCount = 0;
        };


        //可维修的订单列表
        $scope.afterRepairList = {
            isShowIcon: false,
            isShowPage: false,
            keyword: '',//搜索关键词
            totalCount: 0,
            showPage: false,
            list: null,
            getAfterRepairList: function () {
                var url = '/oms-api/restful/order/queryOrderList.do';
                var that = this;
                var params = {
                    companyId: $rootScope.companyId,
                    status: 25, //可维修订单
                    currentPage: $scope.pageNo,
                    itemsPerPage: $scope.pageSize,
                    keyword: that.keyword
                };
                that.list = [];
                _fnP(url, params).then(function (res) {
                    if (res.code == 0 && res.data && res.data.listObj.length > 0) {
                        that.list = res.data.listObj;
                        $scope.totalCount = res.data.total;
                        $scope.totalPage = $scope.totalCount % $scope.pageSize == 0 ? (($scope.totalCount / $scope.pageSize) || 1) : parseInt($scope.totalCount / $scope.pageSize) + 1;
                        that.isShowPage = true;
                    } else {
                        that.isShowIcon = true;
                        that.isShowPage = false;
                    }
                }, function (res) {
                    that.isShowIcon = true;
                    that.isShowPage = false;
                    _fnE($scope.i18n('提示'), $scope.i18n('系统异常'));
                });
            },
            init: function () {
                $scope.initPagination();
                this.getAfterRepairList();
                //翻页广播接收
                var that = this;
                $scope.$on('changePageNo', function (event, data) {
                    "use strict";
                    $scope.pageNo = data;
                    that.getAfterRepairList();
                })
            }
        };

        //可申请维修订单列表
        $scope.afterRepairList.init();
    }]);
