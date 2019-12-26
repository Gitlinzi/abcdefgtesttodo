/**
 * Created by user on 2017/8/11.
 */
/**
 * Created by Roy on 17/1/5.
 */
angular.module('appControllers').controller('orderSubpartsCtrl', ["$scope", "$rootScope", "$cookieStore", "commonService", 'categoryService', "validateService", "Upload", "$state", "$stateParams","$window",function ($scope, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload, $state, $stateParams,$window) {
    //国际化
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
    //公共参数
    $scope.code = $stateParams.code;
    var _ut = $rootScope.util.getUserToken();

    var _fnE = $rootScope.error.checkCode,
        _host = $rootScope.host,
        _cid = $rootScope.companyId;

    //补购
    $scope.addBuying = {
        isHas: false,
        orderCode: $scope.code,//订单号
        goodsList: [],//商品集合
        mpIds: [],//商品mpid
        goodPriceStock: [],//服务商品属性
        serviceGoodMpIds: [],//服务商品mpIds
        serviceGoodList: [],//服务商品购买
        //查询订单详情
        getOrderDetails: function () {
            //查询订单信息
            var url = _host + '/my/order/detail',
                params = {
                    orderCode: this.orderCode,
                    companyId: _cid,
                    v: '2.2'
                }, that = this;
            $rootScope.ajax.post(url, params).then(function (res) {
                if (res.code == 0) {
                    //获取订单下的商品
                    if (res.data && res.data.childOrderList != null && res.data.childOrderList.length > 0) {
                        var orderList = res.data.childOrderList;
                        angular.forEach(orderList, function (order) {
                            angular.forEach(order.orderProductList, function (value) {
                                value.serviceList = [];
                                that.goodsList.push(value);
                                $scope.addBuying.mpIds.push(value.mpId);
                            })
                        })

                        $scope.addBuying.getServiceGoods().then(function (result) {
                            if (result.code == 0 && !$.isEmptyObject(result.data)) {
                                angular.forEach(result.data, function (value, key) {
                                    if (value) {
                                        angular.forEach(that.goodsList, function (pro) {
                                            if (value.bomLinesId == pro.mpId) {
                                                value.buyNum=0;
                                                pro.serviceList.push(angular.copy(value));
                                            }
                                            that.serviceGoodMpIds.push(value.mpId);
                                        })
                                    }
                                })
                            }
                            var url2 = $rootScope.host + '/realTime/getPriceStockList',
                                params2 = {
                                    mpIds:that.serviceGoodMpIds,
                                    areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
                                };
                            $rootScope.ajax.get(url2,params2).then(function (res) {
                                if (res.code == 0) {
                                    if (res.data.plist) {
                                        angular.forEach(res.data.plist, function (val) {
                                            angular.forEach(that.goodsList, function (pro) {
                                                angular.forEach(pro.serviceList, function (spro) {
                                                    if (val.mpId == spro.mpId) {
                                                        spro.stockNum = val.stockNum;
                                                        spro.stockText = val.stockText;
                                                        spro.price = val.availablePrice;
                                                    }
                                                })
                                            })
                                        })
                                    }
                                }
                            });
                        })

                    } else {
                        _fnE($scope.i18n('提示'), $scope.i18n('很抱歉') + '，' + $scope.i18n('没有可补购的商品'));
                    }
                } else {
                    _fnE($scope.i18n('系统异常'), $scope.i18n('查询订单信息异常'));
                }

            }, function (res) {
                _fnE($scope.i18n('系统异常'), $scope.i18n('查询订单信息异常'));
            })
        },
        getServiceGoods: function () {
            if ($rootScope.util.getCookies("areasCode")) {
                $rootScope.areasCode = JSON.parse($rootScope.util.getCookies("areasCode"));
                var areasCodeOneCode = $rootScope.areasCode.oneCode;
            }
            var that = this,
                params = {
                    areaCode: areasCodeOneCode,
                    mpIds: that.mpIds
                };
            return $rootScope.ajax.postJson('/back-product-web/product/queryProductBomLines.do', params);

        },

        //初始化操作, 这个方法在页面的ng-init里调用
        init: function () {
            "use strict";
            var that = this;
            if (!this.orderCode)
                history.back()
            this.getOrderDetails();
            $scope.isOrderDetail = true;
        },

        //数目输入值格式判断
        checkNum: function (num, max) {
            if (num.match(/^[0-9]{1,3}$/)) {
                if (parseInt(num) < 1)
                    return 1;
                if (parseInt(num) >= max)
                    return max;
                return parseInt(num);
            } else {
                return 1;
            }
        },

        //数目输入值格式判断
        checkItem: function (serviceItem, flag, pro) {
            //当flag为2时加，为1时减
            if (flag == 2) {
                if (serviceItem.buyNum < serviceItem.stockNum) {
                    serviceItem.buyNum = serviceItem.buyNum + 1;
                } else {
                    _fnE($scope.i18n('提示'), $scope.i18n('库存不足或达到购买上限'))
                }
            } else if (flag == 1) {
                if (serviceItem.buyNum > 0) {
                    serviceItem.buyNum = serviceItem.buyNum - 1;
                }
            }
        }
    };
    $scope.addBuying.init();

    $scope.oneKey = {
        _input: {
            ut: _ut,
            platformId: $rootScope.platformId,
            skus: null,
            businessType: 7//普通订单传0
        },

        _buy: function () {
            var list = [],
                totalNum = null,
                that = this;
            angular.forEach($scope.addBuying.goodsList, function (val) {
                angular.forEach(val.serviceList, function (val2) {
                    totalNum += val2.buyNum;
                    if (val2.buyNum > 0) {
                        var serviceGood = {
                            "mpId": val2.mpId,
                            "num": val2.buyNum,
                            "isMain": 0,
                            "soParentItemIdList": val.soItemId,
                            "areaCode":$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
                        };
                        list.push(serviceGood);
                    }
                })
            })
            if ((list && list.length == 0) || totalNum <= 0) {
                _fnE($scope.i18n('提示'), $scope.i18n('请选择要补购的商品'));
                return;
            }
            this._input.skus = JSON.stringify(list);

            if (!_ut) {
                $rootScope.showLoginBox = true;
                return;
            } else {
                $rootScope.ajax.post($rootScope.host + '/checkout/initOrder', this._input).then(function (res) {
                    if (res.code == 0) {
                        localStorage.setItem('quickBuy', JSON.stringify($scope.oneKey._input));
                        location.href = 'settlement.html?q=1';
                    } else {
                        if(res.data!=null&&res.data.error != null &&res.data.error.type==4||res.data.error.type==3){
                            localStorage.setItem('quickBuy', JSON.stringify($scope.oneKey._input));
                            location.href = 'settlement.html?q=1';
                        }else{
                            $rootScope.error.checkCode(res.code, res.data.error.message);
                        }
                        // if (res.data != null && res.data.error != null)
                        //       $rootScope.error.checkCode(res.code, res.data.error.message);
                    }
                }, function (error) {
                    $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('一键购买异常') + '！');
                })
            }
        },
    }
}]);
