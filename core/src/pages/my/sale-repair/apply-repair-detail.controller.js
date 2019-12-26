/**
 * Created by Roy on 17/6/29.
 */
'use strict';
angular.module('appControllers').controller('applyRepairDetailCtrl', ["$scope", "$rootScope", "$cookieStore", "commonService", 'categoryService', "validateService", "Upload", "$state", "$stateParams","$window",
    function ($scope, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload, $state, $stateParams,$window) {
        //国际化
        $scope.i18n = function (key) {
            return $window.i18n ? $window.i18n(key) : key;
        };
        //公共参数
        var _ut = $rootScope.util.getUserToken(),
            _fnG = $rootScope.ajax.get,
            _fnP = $rootScope.ajax.post,
            _fnE = $rootScope.error.checkCode,
            urlParams = $stateParams;

        if (!_ut) {
            $rootScope.showLoginBox = true;
            return;
        }

        $scope.repairDetail = {
            returnId: urlParams.returnId, //维修单号
            detail: {},//维修单详情
            relationOrders: null,
            //获取维修订单详情
            getRepairDetail: function () {
                var that = this,
                    url = '/back-order-web/restful/afterSales/queryReturnMaintainInfo.do',
                    params = {
                        returnId: that.returnId
                    };
                _fnP(url, params).then(function (res) {
                    if (res.code == 0) {
                        that.detail = res.data;
                        that.getRelationOrders(that.detail? that.detail.returnCode: '')
                    }
                }, function (res) {
                    _fnE($scope.i18n('系统异常'), $scope.i18n('系统异常'));
                })
            },

            //查询关联的配件订单
            getRelationOrders: function (ocd) {
                var url = '/back-order-web//restful/order/queryRelationOrderList.do',
                    that = this,
                    params = {
                        orderCode: ocd
                    };
                that.relationOrders = [];
                _fnP(url, params).then(function (res) {
                    if (res.code == 0 && res.data.listObj) {
                        that.relationOrders = res.data.listObj
                    }

                }, function (res) {
                    _fnE($scope.i18n('系统异常'), $scope.i18n('系统异常'));
                })

            },

            //取消维修申请
            cancelRepair: function (rcd) {
                var that = this;
                $rootScope.error.checkCode($scope.i18n('警告'), $scope.i18n('您确定取消申请吗') + '？', {
                    type: 'confirm',
                    ok: function () {
                        var url = "/oms-api/soReturn/cancel?id="+that.returnId
                        $rootScope.ajax.post(url, {}).then(function (result) {
                            that.getRepairDetail();
                        });
                    }
                });
            },
        };

        //维修单详情
        $scope.repairDetail.getRepairDetail();
    }]);
