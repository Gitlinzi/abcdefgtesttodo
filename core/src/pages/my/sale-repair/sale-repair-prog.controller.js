/**
 * Created by Roy on 17/6/29.
 */
'use strict';
angular.module('appControllers').controller('saleRepairProgCtrl', ["$scope", "$rootScope", "$cookieStore", "commonService", 'categoryService', "validateService", "Upload", "$state", "$stateParams","$window",
    function ($scope, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload, $state, $stateParams,$window) {
        //国际化
        $scope.i18n = function (key) {
            return $window.i18n ? $window.i18n(key) : key;
        };
        //公共参数
        var urlParams = $stateParams,
            _ut = $rootScope.util.getUserToken(),
            _host = $rootScope.host,
            _fnP = $rootScope.ajax.post,
            _fnE = $rootScope.error.checkCode;

        if (!_ut) {
            $rootScope.showLoginBox = true;
            return;
        }

        //初始化翻页
        $scope.initPagination = function () {
            $scope.pageNo = 1;
            $scope.pageSize = 10;
            $scope.totalCount = 0;
        };


        //维修的记录订单列表
        $scope.afterRepairProgList = {
            isShowIcon:false,
            isShowPage:false,
            list: null,
            type: {
                1: $scope.i18n('退款'),
                2: $scope.i18n('退货'),
                4: $scope.i18n('换货'),
                11:$scope.i18n('维修')
            },
            returnStatus: {
                1: $scope.i18n('平台审核中'),
                2: $scope.i18n('审核通过'),
                3: $scope.i18n('审核不通过'),
                4: $scope.i18n('待收件'),
                5: $scope.i18n('平台审核通过'),
                6: $scope.i18n('退换货验货不通过'),
                8: $scope.i18n('维修完成'),
                9: $scope.i18n('已取消')
            },
            getAfterRepairProgList: function () {
                var url = "/api/my/orderAfterSale/afterSaleList";
                var params = {
                    companyId: $rootScope.companyId,
                    pageNum: $scope.pageNo,
                    afterSaleType:11,//维修订单列表
                    pageSize: $scope.pageSize
                };
                var that = this;
                that.list = [];
                _fnP(url, params).then(function (result) {
                    if (result.data && result.data.orderRefundVOs) {
                        that.list = result.data.orderRefundVOs;
                        $scope.totalCount = result.data.total;
                        $scope.totalPage = $scope.totalCount % $scope.pageSize == 0 ? (($scope.totalCount / $scope.pageSize) || 1) : parseInt($scope.totalCount / $scope.pageSize) + 1;
                        that.isShowPage = true;
                        that.isShowIcon = false;
                    } else {
                        that.isShowIcon = true
                        that.isShowPage = false;
                    }

                },function (res) {
                    that.isShowIcon = true
                    that.isShowPage = false;
                    _fnE($scope.i18n('提示'),$scope.i18n('系统异常'));
                });
            },
            init: function () {
                $scope.initPagination();
                //this.getAfterRepairProgList();
                //翻页广播接收
                var that = this;
                $scope.$on('changePageNo', function (event, data) {
                    "use strict";
                    $scope.pageNo = data;
                    that.getAfterRepairProgList();
                })
            }
        };


        (function () {
            //维修记录列表
            $scope.afterRepairProgList.init();
        })();

    }]);
