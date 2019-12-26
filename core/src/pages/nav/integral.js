/**
 * Created by sindy on 15/11/4.
 */

appControllers.controller("integralCtrl", ['$log', '$rootScope', '$scope', '$cookieStore','commonService','categoryService','config', '$window', function($log, $rootScope, $scope, $cookieStore,commonService,categoryService,config, $window){
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
    //数据定义
    $scope.data = {
        ut:$rootScope.util.getUserToken(),
        userPointInfo:{},
        redemptionList:[],
        redemptionType:'',
        exchangeList:[],
        exchangeType:'',
        areaCode: $rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode,
        searchWord:'',
        placehold:'',
        pointPriceRange:[
            {"text":"0-1" + $scope.i18n('万'),"value":"0,10000"},
            {"text":"1" + $scope.i18n('万') + "-2" + $scope.i18n('万'),"value":"10000,20000"},
            {"text":"2" + $scope.i18n('万') + "-3" + $scope.i18n('万'),"value":"20000,30000"},
            {"text":"3" + $scope.i18n('万以上'),"value":"30000,"},
        ]
    }
    //初始化
    $scope.init = function () {
        //默认省份与迷你购物车
        $rootScope.execute(false);
        if($scope.data.ut){
            $scope.getUserPoint();
        }
        $scope.getRedemptionList();
        $scope.getExchangeList();
        $scope.getSearchWord();
    };

    $scope.getSearchWord = function () {
        var url = '/ad-whale-web/dolphin/getAdSource';
        $rootScope.ajax.get(url, {
            platform: 1,
            companyId: $rootScope.companyId,
            pageCode: "HOME",
            adCode: 'point_searchword'
        }).then(function (res) {
            if(res.code == 0 && res.data && res.data.point_searchword){
                $scope.data.placehold = res.data.point_searchword[0];
            }
        })
    }

    //获取用户积分
    $scope.getUserPoint = function () {
        let url = "/ouser-center/api/point/queryPointDetail.do";
        $rootScope.ajax.post(url, {}).then(function (res) {
            if(res.code == 0) {
                $scope.userPointInfo = res.data;
            }else {
                $rootScope.error.checkCode(res.code, res.message);
            }
        }, function () {
            $scope.sms.msg = $scope.i18n('系统故障');
        })
    };

    //获取积分换购商品
    $scope.getRedemptionList = function () {
        let url = '/search/rest/searchList.do';
        let params = {
            companyId: $rootScope.companyId,//公司id
            sortType: '15',//筛选过滤
            pageNo: 1,//当前页
            pageSize: 9,//当页显示数量
            platformId:$rootScope.platformId,
            areaCode: $scope.data.areaCode,
            isPointProduct:1,//查积分商品
            keyword:'*****',
            priceRange:'0.01,999999999',//标识价格不为0的商品
            pointPriceRange:'1,999999999',//标识积分不为0的商品
            v:2//接口版本 v=2 不返回价格、库存、促销
        };
        if($scope.data.redemptionType != ''){
            params.productType = $scope.data.redemptionType;
        }
        $rootScope.ajax.get(url, params).then(function (res) {
            if(res.code == 0) {
                // $scope.userPointInfo = res.data;
                $scope.data.redemptionList = res.data.productList || [];

                //积分实时价格库存
                $rootScope.util.getPointProPriceAndStock((function (productList) {
                    "use strict";
                    var itemIds = [];
                    angular.forEach(productList, function (v) {
                        itemIds.push(v.mpId);
                    });
                    return itemIds.join();
                })(res.data.productList),res.data.productList,function (obj) {
                    $scope.data.redemptionList = obj;
                })
            }else {
                $rootScope.error.checkCode(res.code, res.message);
            }
        }, function () {
            $scope.sms.msg = $scope.i18n('系统故障');
        })
    };

    //获取积分兑换商品
    $scope.getExchangeList = function () {
        let url = '/search/rest/searchList.do';
        let params = {
            companyId: $rootScope.companyId,//公司id
            sortType: '15',//筛选过滤
            pageNo: 1,//当前页
            pageSize: 9,//当页显示数量
            platformId:$rootScope.platformId,
            areaCode: $scope.data.areaCode,
            isPointProduct:1,//查积分商品
            keyword:'*****',
            priceRange:'0,0',//标识价格为0的商品,只需用积分兑换
            pointPriceRange:'1,999999999',//标识积分不为0的商品
            v:2//接口版本 v=2 不返回价格、库存、促销
        };
        if($scope.data.exchangeType != ''){
            params.productType = $scope.data.exchangeType;
        }
        $rootScope.ajax.get(url, params).then(function (res) {
            if(res.code == 0) {
                $scope.data.exchangeList = res.data.productList || [];

                //积分实时价格库存
                $rootScope.util.getPointProPriceAndStock((function (productList) {
                    "use strict";
                    var itemIds = [];
                    angular.forEach(productList, function (v) {
                        itemIds.push(v.mpId);
                    });
                    return itemIds.join();
                })(res.data.productList),res.data.productList,function (obj) {
                    $scope.data.exchangeList = obj;
                })
            }else {
                $rootScope.error.checkCode(res.code, res.message);
            }
        })
    };

    //搜索积分商品
    $scope.searchPointPro = function () {
        if($scope.data.searchWord != '' || $scope.data.placehold){
            location.href = '/integralSearch.html?isPointPro=1&keyword=' + ($scope.data.searchWord || $scope.data.placehold.title);
        } else{
            $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n('请输入关键字') + '!');
        }
    }
}]);
