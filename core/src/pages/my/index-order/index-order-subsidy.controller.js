/**
 * Created by user on 2017/8/11.
 */
/**
 * Created by Roy on 17/1/5.
 */
angular.module('appControllers').controller('orderSubsidyCtrl', ["$scope", "$rootScope", "$cookieStore", "commonService", 'categoryService', "validateService", "Upload", "$state", "$stateParams","$window",function ($scope, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload, $state, $stateParams,$window) {
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
        orderList: null,
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
                that.orderList = [];
                if (res.code == 0) {
                    //获取订单下的商品
                    if (res.data && res.data.childOrderList != null && res.data.childOrderList.length > 0) {
                        that.orderList = res.data.childOrderList;
                        angular.forEach(that.orderList, function (order) {
                            angular.forEach(order.orderProductList, function (value) {
                                value.serviceList = [];
                                that.goodsList.push(value)
                            })
                        })
                        $scope.addBuying.mpIds = $.map(that.goodsList, function (val1) {
                            return val1.mpId;
                        });
                        $scope.addBuying.getServiceGoods().then(function (result) {
                            var serviceTotal = [];
                            if (result.code == 0 && !$.isEmptyObject(result.data)) {
                                angular.forEach(result.data, function (value, key) {
                                    if (value && value.length > 0) {
                                        serviceTotal.push(value);
                                        angular.forEach(that.goodsList, function (pro) {
                                            angular.forEach(value, function (spro) {
                                                if (key == pro.mpId) {
                                                    spro.stockNum = null;
                                                    spro.price = null;
                                                    spro.buyNum = 0;
                                                    spro.parentSoItemId = pro.soItemId;
                                                    that.serviceGoodMpIds.push(spro.id);
                                                }
                                            })
                                            if (key == pro.mpId) {
                                                pro.serviceList = angular.copy(value);
                                            }
                                        })
                                    }
                                })
                                //console.log(that.goodsList);
                            } else {
                                _fnE($scope.i18n('提示'), $scope.i18n('很抱歉') + '，' + $scope.i18n('没有可补购的服务商品'));
                            }
                            if (serviceTotal.length <= 0) {
                                _fnE($scope.i18n('提示'), $scope.i18n('很抱歉') + '，' + $scope.i18n('没有可补购的服务商品'));
                            }else {
                                that.isHas = true;
                            }
                            if (that.serviceGoodMpIds && that.serviceGoodMpIds.length == 0) {
                                return;
                            }
                            var url2 = '/api/realTime/getPriceStockList',
                                params2 = {
                                    mpIds:that.serviceGoodMpIds,
                                    areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
                                };
                            $rootScope.ajax.get(url2,params2).then(function (res) {
                                if (res.code == 0) {
                                    if (res.data.plist != null && res.data.plist.length > 0) {
                                        angular.forEach(res.data.plist, function (val) {
                                            angular.forEach(that.goodsList, function (pro) {
                                                angular.forEach(pro.serviceList, function (spro) {
                                                    if (val.mpId == spro.id) {
                                                        spro.stockNum = val.stockNum;
                                                        spro.stockText = val.stockText;
                                                        spro.price = val.availablePrice;
                                                    }
                                                })
                                            })
                                        })
                                    }
                                }
                            })
                        })
                    } else {
                        _fnE($scope.i18n('提示'), $scope.i18n('很抱歉') + '，' + $scope.i18n('没有可补购的服务商品'));
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
            return $rootScope.ajax.postJson('/back-product-web/consultAppAction/getMerchantProductList.do', params);
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
        checkNum: function (num, max,bigMax) {
            if (num.match(/^[0-9]{1,3}$/)) {
                if (parseInt(num) < 1){
                    return 1;
                }
                if (parseInt(num) < max&&parseInt(num)>bigMax){
                    return bigMax;
                }
                if (parseInt(num) < max&&parseInt(num)<bigMax){
                    return parseInt(num);
                }
                return parseInt(num)
            } else {
                return 1;
            }
        },

        //数目输入值格式判断
        checkItem: function (serviceItem, flag, pro) {
            //当flag为2时加，为1时减
            if (flag == 2) {
                if (serviceItem.stockNum > serviceItem.buyNum && serviceItem.buyNum < pro.num) {
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

        // ,
        //
        // //更新相应的购买商品数目
        // updateChange: function (sg) {
        //     var that = this;
        //     if (that.serviceGoodList != [] && that.serviceGoodList.length > 0) {
        //         var flag = false;
        //         angular.forEach(that.serviceGoodList, function (val) {
        //             if (sg.id == val.id) {
        //                 val.buyNum = sg.buyNum;
        //                 flag = true;
        //             }
        //         });
        //         if (!flag) {
        //             that.serviceGoodList.push(sg);
        //         }
        //     } else {
        //         that.serviceGoodList.push(sg);
        //     }
        // },
    };


    $scope.oneKey = {

        _input: {
            ut: $rootScope.util.getUserToken(),
            platformId: $rootScope.platformId,
            skus: null,
            businessType: 7
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
                            "mpId": val2.id,
                            "num": val2.buyNum,
                            "isMain": 0,
                            "soParentItemIdList": val2.parentSoItemId,
                            "areaCode":$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
                        };
                        list.push(serviceGood);
                    }

                })
            })


            // angular.forEach($scope.addBuying.serviceGoodList, function (val) {
            //     var serviceGood = {
            //         "mpId": val.id,
            //         "num": val.buyNum,
            //         "isMain": 0,
            //         "soParentItemIdList": val.parentSoItemId
            //     };
            //     total+=val.buyNum;
            //     list.push(serviceGood);
            // });
            this._input.skus = JSON.stringify(list);
            if ($.isEmptyObject(list) || totalNum <= 0) {
                _fnE($scope.i18n('提示'), $scope.i18n('请选择要补购的商品'));
                return;
            }
            if ($rootScope.util.getUserToken() == undefined || $rootScope.util.getUserToken() == null) {
                $rootScope.showLoginBox = true;
                return;
            } else {
                $rootScope.ajax.post($rootScope.host + '/checkout/initOrder', this._input).then(function (res) {
                    if (res.code == 0) {
                        localStorage.setItem('quickBuy', JSON.stringify($scope.oneKey._input));
                        location.href = 'settlement.html?q=1';
                    } else {
                        if (res.data != null && res.data.error != null) {
                             $rootScope.error.checkCode(res.code, res.data.error.message);
                        }
                    }
                }, function (error) {
                    $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('一键购买异常') + '！');
                })
            }
        }
    }
}]);
