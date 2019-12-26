/**
 * Created by Roy on 17/6/29.
 */
'use strict';
angular.module('appControllers').controller('goCommentCtrl', ["$scope", "$rootScope", "$cookieStore", "commonService", 'categoryService', "validateService", "Upload", "$stateParams","$window",
    function ($scope, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload, $stateParams,$window) {
        //国际化
        $scope.i18n = function (key) {
            return $window.i18n ? $window.i18n(key) : key;
        };
        var _ut = $rootScope.util.getUserToken(),
            code = $stateParams.code,
            _fnE = $rootScope.error.checkCode,
            _host = $rootScope.host;

        if (!_ut) {
            $rootScope.showLoginBox = true;
            return;
        };
        $scope.good = {
            serviceRate: 5,
            saleRate: 5,
            logisticsRate: 5,
            content: '', //评价内容
            mpcPicList: [], //图片列表
        }
        //初始化订单商品信息
        $scope.evaluate = {
            isHideUserName: true, // 是否匿名：0:隐藏；1:显示
            evaluateInit: null,//商品
            //图片上传相关
            file: null, //选择文件
            inputJson: {}, //订单的商品评价集合
            userMPCommentVOList: {}, //评价集合
            mpIds: null,//mpId集合
            allmproList: [], //商品列表
            currentmpoList: [],
            mporderDetail: null,
            currentPageNo: 1,
            totalPage: 1,
            paramList: [],
            productMpids: [],
            // 上一页
            upPage: function() {
                var that = this
                that.currentPageNo--
                if (that.currentPageNo < 1) {
                    that.currentPageNo = 1
                    return
                }
                let start = (that.currentPageNo-1)*4
                let end = start + 4
                that.currentmpoList = that.allmproList.slice(start,end)
            },
            // 下一页
            nextPage: function() {
                var that = this
                that.currentPageNo++
                if (that.currentPageNo > that.totalPage) {
                    that.currentPageNo = that.totalPage
                    return
                }
                let start = (that.currentPageNo-1)*4
                let end = start + 4
                that.currentmpoList = that.allmproList.slice(start,end)
            },
            getGoodsInit: function () {
                "use strict";
                var url = _host + '/social/my/comment/init',
                    params = {
                        orderCode: code
                    },
                    that = this;
                $rootScope.ajax.get(url, params).then(function (res) {
                    if (res.code == 0) {
                        that.mpIds = [];
                        that.evaluateInit = [];
                        if (res.data != null && res.data.length > 0) {
                            for (var i in res.data) {
                                if (res.data[i].commentType == 0) {
                                    res.data[i].mpcPicList = [];
                                    res.data[i].platformId = $rootScope.platformId;
                                    that.mpIds.push(res.data[i].mpId);
                                    that.evaluateInit.push(res.data[i]);
                                }
                            }
                        }
                        var url2 = _host + '/realTime/getPriceStockList',
                            params2 = {
                                mpIds: that.mpIds,
                                areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode: $rootScope.defaultAreasCode
                            };
                        $rootScope.ajax.get(url2,params2).then(function (res) {
                            if (res.code == 0) {
                                if (!$.isEmptyObject(res.data)) {
                                    angular.forEach(res.data.plist, function (val) {
                                        angular.forEach(that.evaluateInit, function (val2) {
                                            if (val.mpId == val2.mpId) {
                                                val2.realPrice = val.availablePrice;
                                                val2.realNum = val.stockNum;
                                                val2.realNumText = val.stockText;
                                            }
                                        })
                                    })
                                    that.allmproList = that.evaluateInit
                                    that.productMpids = that.allmproList.map(item => item.soItemId)
                                    that.currentmpoList = that.allmproList.slice(0,4)
                                    that.totalPage = Math.ceil(that.allmproList.length/4)
                                }
                            }
                        }, function (res) {
                            $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('获取实时库存价格异常'));
                        })
                    } else {
                        $rootScope.error.checkCode(res.code, res.message);
                    }
                })
            },
            // 初始化获取评论信息
            getGoodsDetail: function() {
                var that = this
                let url = '/api/social/mpComment/getOrderComment'
                let params = {
                    commentSource: 3,
                    hasPic: 0,
                    orderCode: $stateParams.code,
                    pageNo: 1,
                    pageSize: 10,
                    rateFlag: 0
                }
                $rootScope.ajax.get(url,params).then(function(res){
                    if (res.code ==0) {
                        that.allmproList = res.data.mpcList.listObj[0].merchantProducts
                        that.currentmpoList = that.allmproList.slice(0,4)
                        that.mporderDetail = res.data.mpcList.listObj[0]
                        that.totalPage = Math.ceil(that.allmproList.length/4)
                    }
                })
            },
            //保存评价
            save: function () {
                var that = this;
                var flag = true;
                // for (var i = 0; i<that.evaluateInit.length; i++) {
                    // var val = that.evaluateInit[i];
                    if(!$scope.good.content || $scope.good.content.length < 6){
                        _fnE($scope.i18n('提示'),$scope.i18n('评价字数不少于') + '6' + $scope.i18n('个字') + '，' + $scope.i18n('请认真评价哦') + '~');
                        return
                    }
                // }
                var obj = {
                    orderCode: code,
                    serviceRate: $scope.good.serviceRate,
                    saleRate: $scope.good.saleRate,
                    logisticsRate: $scope.good.logisticsRate,
                    content: $scope.good.content,
                    mpcPicList: $scope.good.paramList,
                    platformId: 2,
                    commentType: 3
                }
                that.paramList.push(obj)
                var inputJson = {
                        "isHideUserName": that.isHideUserName ? 0 : 1,
                        "userMPCommentVOList": that.paramList,
                    }, //订单的商品评价集合
                    params = {
                        inputJson: JSON.stringify(inputJson)
                    };
                $rootScope.ajax.post('/api/social/my/comment/save', params).then(function (res) {
                    if (res.code == 0) {
                        $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('评价成功'), {
                            type: 'info',
                        });
                        location.href = '#/comment';
                        // $scope.showSuccess = true;
                    } else {
                        $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('评价失败'), {
                            type: 'info',
                        });
                        location.href = '#/comment';
                        // $scope.showFail = true;
                    }
                })
            },
            init: function () {
                "use strict";
                var that = this;
                that.getGoodsInit();
                // that.getGoodsDetail()
            }

        };
    }]);
