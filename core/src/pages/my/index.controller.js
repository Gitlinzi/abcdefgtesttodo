/**
 * Created by Roy on 17/1/5.
 */
'use strict';
angular.module('appControllers').controller('homeIndexCtrl', ["$scope", "$rootScope", "$cookieStore", "commonService", 'categoryService', "validateService", "Upload", "$log","$window", "allUrlApi",function ($scope, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload, $log, $window,allUrlApi) {
    //公共参数
    //订单状态(从url获取)
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
    var utilParams = $rootScope.util.paramsFormat();
    var orderStatus = utilParams.orders || 0;
    var _ut = $rootScope.util.getUserToken(),
        _fnP = $rootScope.ajax.post,
        _fnG = $rootScope.ajax.get,
        _fnE = $rootScope.error.checkCode,
        _host = $rootScope.host,
        _cid = $rootScope.companyId;
    if(!_ut){
        $rootScope.showLoginBox = true;
        return;
    }

    $scope.regionList = [];
    $scope.reconciliationList = [];
    $scope.saleafterList = [];
    $scope.getCustomerDelegateList = function () {
        var url = '/custom-sbd-web/customerDelegate/getCustomerDelegateList.do'
        $rootScope.ajax.postJson(url,{}).then(function (res) {

            if (res.code == 0 && res.data) {
                $scope.regionList = res.data.region
                $scope.reconciliationList = res.data.reconciliation
                $scope.saleafterList = res.data.saleafter
            } 
        })
    };
    $scope.getCustomerDelegateList();


    //订单列表页与详情页区分
    $scope.isOrders = false; //是否是订单列表页
    $scope.isOrderDetail = false; //是否是订单详情页
    Object.myKeys = function (params) {
        var ary = [];
        if (Object.keys) {
            ary = this.keys(params);
        } else {
            for(var key in params ) if(hasOwn.call(params,key)){
                ary.push(key) ;
            }
            var DONT_ENUM =  "propertyIsEnumerable,isPrototypeOf,hasOwnProperty,toLocaleString,toString,valueOf,constructor".split(","),
                hasOwn = ({}).hasOwnProperty;
            for (var i in {
                toString: 1
            }){
                DONT_ENUM = false;
            }
            if(DONT_ENUM && params){
                for(var i = 0 ;key = DONT_ENUM[i++]; ){
                    if(hasOwn.call(params,key)){
                        ary.push(key);
                    }
                }
            }
        }
        return ary;
    }

    $scope.isCenter = Object.myKeys(utilParams).length == 0 || typeof utilParams.center != 'undefined'; //是否是个人中心首页
    $scope.isShowIcon = false;

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
        $scope.orders.getOrders();
    })
    //订单列表页
    $scope.myHome = {
        accountSummary: {},//用户概况
        userInfo: {},//用户信息
        memberInfo: {},//会员信息
        list: null,//订单列表
        childList: [],//子订单
        summary: {},//订单各状态数量
        pointSum: 0,//可用积分
        pointFreezed: 0,//冻结积分
        footList: null,//足迹
        commissionSum: 0,//佣金
        canUserCount: null,//可用优惠券数量
        favoriteGoods: null,//我的收藏

        //获取用户信息
        getUserInfo: function (userType) {
            "use strict";
            var url = '/ouser-center/api/user/info/detail.do',
                params = {
                    cashe: Date.parse(new Date()),
                    identityTypeCode: userType
                },
                that = this;
            $rootScope.ajax.post(url, params).then(function (result) {
                if (result.code == 0) {
                    that.userInfo = result.data.userInfo;
                    that.memberInfo = result.data.memberInfo;
                    setTimeout(function () {
                        $(".progressB").css({
                            width: ((that.memberInfo? that.memberInfo.growthBalence: 0) * 160 / (that.memberInfo? that.memberInfo.growthReach: 0)) + "px"
                        })
                    }, 10)
                } else {
                    _fnE($scope.i18n('系统异常'), result.message);
                }
            })
        },
        //获取用户概况
        getAccountSummary: function () {
            "use strict";
            var url = _host + '/my/accountSummary',
                params = {
                },
                that = this;
            _fnG(url, params)
                .then(function (result) {
                    that.accountSummary = result.data;
                });
        },
        //获取订单各状态数量
        getSummary: function () {
            "use strict";
            var url = $rootScope.home + allUrlApi.orderSummary,
                params = {
                  orderStatus: "",
                  orderType: "",
                  sysSource: ""
                },
                that = this;
            $rootScope.ajax.postJson(url, params)
                .then(function (res) {
                    if (res.code == 0) {
                        if(res.data&&res.data.unPay) {
                            if(res.data.unPay > 99) {
                                that.summary.unPay = '99+';
                            } else {
                                that.summary.unPay = res.data.unPay; //待付款
                            }
                        }
                        if(res.data&&res.data.unReceive) {
                            if(res.data.unReceive > 99) {
                                that.summary.unReceive = '99+';
                            } else {
                                that.summary.unReceive = res.data.unReceive; //待收货
                            }
                        }
                        that.summary.unEvaluate = res.data.unEvaluate;//待评价
                    }
                })
        },
        //获取订单
        getOrders: function () {
            var that = this;
            var params = {
                deleteStatus: 0,
                currentPage: $scope.pageNo,
                itemsPerPage: $scope.pageSize,
                flag: "fp4"
            };
            $rootScope.ajax.postJson($rootScope.home + allUrlApi.orderList,params).then(function (res) {
                that.list = [];
                if (res.code == 0) {
                    if (res.data && res.data.length) {
                        $scope.totalCount = res.total;
                        angular.forEach(res.data,function (v) {
                            v.delete = false;
                            v.itemList = [];
                            angular.forEach(v.orders,function (order) {
                                angular.forEach(order.items,function (item) {
                                    v.itemList.push(item);
                                })
                            })
                        });
                        that.list = res.data;

                    } else {
                        $scope.totalCount = 0;
                    }
                } else {
                    $scope.totalCount = 0;
                }
            }, function (res) {
                _fnE($scope.i18n('系统异常'), $scope.i18n('获取订单异常'));
            });
        },

        FavoriteGoodPageNo: 1,
        favoriteGoodPageTotal: 0,
        //我的收藏
        getFavoriteGoods: function () {
            var config = {
                    currentPage: this.FavoriteGoodPageNo,
                    itemsPerPage: 6,
                    entityType : 1
                },
                that = this,
                mpIds = [];
            $rootScope.ajax.post("/ouser-center/api/favorite/queryFavoriteDetailPage.do", config).then(function (res) {
                that.favoriteGoods = [];
                if (res.code == 0) {
                    if (!$.isEmptyObject(res.data)) {
                        that.favoriteGoodPageTotal = res.data.total;

                        if ( res.data.listObj && res.data.listObj.length > 0) {
                            angular.forEach(res.data.listObj, function (val) {
                                val.isChecked = false;
                                that.favoriteGoods.push(val);
                                mpIds.push(val.mpId);
                            })

                            $rootScope.ajax.get(_host + '/realTime/getPriceStockList', {mpIds: mpIds,
                                areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode}).then(function (res) {
                                if (res.code == 0) {
                                    angular.forEach(res.data.plist, function (val2) {
                                        angular.forEach(that.favoriteGoods, function (val3) {
                                            if (val2.mpId == val3.mpId) {
                                                val3.realPrice = val2.availablePrice;
                                                val3.realNum = val2.stockNum;
                                                val3.realNumText = val2.stockText;
                                                val3.stockNum = val2.stockNum;

                                            }
                                        })
                                    })
                                } else {
                                    $rootScope.error.checkCode(res.code, res.message);
                                }
                            }, function (res) {
                                $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('获取实时库存价格异常'));
                            })

                        }
                    }
                } else {
                    $rootScope.error.checkCode(res.code, res.message);
                }
            }, function (res) {
                $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('获取收藏异常'));
            })
        },

        //获取足迹
        footPageNo: 1,
        footPageTotal: 1,
        getFootList: function () {
            var that = this,
                config = {
                    platformId:$rootScope.platformId,
                    pageNo: this.footPageNo,
                    pageSize: 6
                };
            $rootScope.ajax.get(_host + '/my/foot/list', config).then(function (res) {
                that.footList = [];
                if (res.code == 0) {
                    if (res.data.data.length > 0) {
                        that.footPageTotal = res.data.totalPage;
                        angular.forEach(res.data.data, function (val) {
                            angular.forEach(val.values, function (val2) {
                                that.footList.push(val2);
                            })
                        })
                    }
                } else {
                    $rootScope.error.checkCode(res.code, res.message);
                }
            }, function (res) {
                $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('获取足迹异常'));
            })
        },

        //优惠券
        getAllCoupons: function () {
            var params = {
                    companyId: $rootScope.companyId
                },
                that = this;
            $rootScope.ajax.post('/api/my/coupon', params).then(function (res) {
                if (res.code == 0) {
                    that.canUserCount = res.data.canUserCount;
                } else {
                    //$log.debug('获取优惠券列表失败');
                }
            }, function (result) {
                $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('获取优惠券失败'));
            })
        },

        //获取积分账户
        getPointAccount: function () {
            var that = this;
            $rootScope.ajax.post("/ouser-center/api/point/queryPointDetail.do", {}).then(function (res) {
                if (res.code == 0) {
                    if (res.data) {
                        that.pointSum = res.data.balanceAccount,
                            that.pointFreezed = res.data.freezedAccount
                    }
                } else {
                    that.pointSum = 0;
                    that.pointFreezed = 0
                }
            }, function (res) {
                $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('获取积分异常'));
            })
        },

        //获取佣金账户
        getCommissionAcount: function () {
            var that = this;
            $rootScope.ajax.post('/back-finance-web/api/commission/queryCommissionAccount.do', {
            }).then(function (res) {
                if (res.code == 0) {
                    if (res.data) {
                        that.commissionSum = res.data.availableAccountAmount;
                    }
                } else {
                    that.commissionSum = 0;
                }
            }, function (res) {
                $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('获取佣金账户异常'));
            })
        },

        pageEnd: function () {
            if( $scope.myHome.FavoriteGoodPageNo ==Math.ceil($scope.myHome.favoriteGoodPageTotal/6) || $scope.myHome.favoriteGoodPageTotal<=6)
            return true;
            else return false;
        },

        //初始化操作, 这个方法在页面的ng-init里调用
        init: function () {
            "use strict";
            var that = this;
            $scope.isOrders = true;
            //初始化翻页
            $scope.initPagination();//初始化翻页
            //如果是个人中心页,需要调用个人信息相关的接口
            if ($scope.isCenter) {
                that.getUserInfo($rootScope.switchConfig.common.defaultIdentityTypeCode);
                ;//用户信息
                that.getAccountSummary();//用户统计
            }
            that.getSummary();//所有状态订单数目
            that.getOrders();//获取所有订单
            that.getPointAccount();//获取积分账户
            that.getFavoriteGoods();//我的收藏
            that.getFootList();//足迹
            that.getAllCoupons();//优惠券
            // that.getCommissionAcount();//佣金
        }
    };
    $scope.nextPage = function (type) {
        $scope.myHome.FavoriteGoodPageNo++;
        $scope.myHome.footPageNo++;
        if (type == 'favorite') {   
            if ($scope.myHome.FavoriteGoodPageNo <= Math.ceil($scope.myHome.favoriteGoodPageTotal/6) ) {
                $scope.myHome.getFavoriteGoods();
                return;
            } else {
                $scope.myHome.FavoriteGoodPageNo = Math.ceil($scope.myHome.favoriteGoodPageTotal/6)
                return
            }
        }
        if (type == 'foot') {
            if ($scope.myHome.footPageNo > $scope.myHome.footPageTotal) {
                $scope.myHome.footPageNo = $scope.myHome.footPageTotal;
                $scope.myHome.getFootList();
            } else {
                $scope.myHome.getFootList();
            }
        }
    }
    $scope.upPage = function (type) {
        $scope.myHome.FavoriteGoodPageNo--;
        $scope.myHome.footPageNo--;
        if (type == 'favorite') {
            if ($scope.myHome.FavoriteGoodPageNo <= 0) {
                $scope.myHome.FavoriteGoodPageNo = 1
                return;
            } else {
                $scope.myHome.getFavoriteGoods();
            }
        }
        if (type == 'foot') {
            if ($scope.myHome.footPageNo <= 0) {
                $scope.myHome.footPageNo = 1;
                $scope.myHome.getFootList();
            } else {
                $scope.myHome.getFootList();
            }
        }
    }

    $scope.pageEnd=function () {
        if( $scope.myHome.FavoriteGoodPageNo >= Math.ceil($scope.myHome.favoriteGoodPageTotal/6))
        return true;
        else return false;
    };

    // 晨光个人中心头部预付款、信用额度、欠款等信息
    $scope.getCgMyheadMes = function() {
        var url = '/finance-plugin-web/api/cg/queryUserAccount.do';
        var params = {
            ut : $rootScope.util.getUserToken()
        }
        $rootScope.ajax.post( url , params ).then( function( res ) {
            if( res.code == 0 ) {
                $scope.cgMyHeadData = res.data;
            }
        } )
    };
    if( $rootScope.switchConfig.center.showCgMyHeadMes ) {
        $scope.getCgMyheadMes();
    }
    $scope.unReadMessage = function () {
        var url = $rootScope.host + '/social/vl/message/getMsgSummary',
            params = {
            };
        $rootScope.ajax.get(url,params).then(function (res) {
            if (res.code == 0) {
                $rootScope.unRead = res.data.unReadMsgCount;
            }
        })
    }
    $scope.unReadMessage();

    $scope.accountInfo = {}
    $scope.showMoreCostCenter = false

    $scope.initAccountInfo = function() {
        const url = '/custom-sbd-web/user/getUserDetail.do'
        $rootScope.ajax.post(url).then(function(res) {
            if(res.code == 0) {
                res.data.costCenterArr = []
                $scope.accountInfo = res.data
                $scope.getCostCenter()
            }
        })
    }

    $scope.getCostCenter = function() {
        const url = '/custom-sbd-web/advCostCenter/getCostCenterByUserId.do'
        $rootScope.ajax.post(url).then(function(res) {
            if(res.code == 0) {
                $scope.accountInfo.costCenterArr = res.data
            }
        })
    }

    $scope.initAccountInfo()

}]);
