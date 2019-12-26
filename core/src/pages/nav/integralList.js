/**
 * Created by sindy on 15/11/4.
 */

appControllers.controller("integralListCtrl", ['$log', '$rootScope', '$scope', '$cookieStore','commonService','categoryService','config','$window',
    function($log, $rootScope, $scope, $cookieStore,commonService,categoryService,config,$window){
    //国际化
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
    var urlParams = $rootScope.util.paramsFormat(location.search);
    //数据定义
    $scope.data = {
        searchObj:{
            pageNo:1,
            pageSize:12,
            totalCount:0,
            totalPage:0
        },
        searchList:[],//搜索结果列表
        redemptionType:urlParams.redemptionType || 1,
        areaCode: $rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode,
        amountBalance:0,
        ut:$rootScope.util.getUserToken(),
        filterSwitch:false,//过滤自身积分区间段标识
    }
    //默认省份与迷你购物车
    $rootScope.execute(false);
    $scope.getSearchList = function () {
        let url = '/search/rest/searchList.do';
        let params = {
            companyId: $rootScope.companyId,//公司id
            sortType: '15',//筛选过滤
            pageNo: $scope.data.searchObj.pageNo,//当前页
            pageSize: $scope.data.searchObj.pageSize,//当页显示数量
            platformId:$rootScope.platformId,
            areaCode: $scope.data.areaCode,
            isPointProduct:1,//查积分商品
            keyword:'*****',
            // priceRange:'1,100000000',//标识价格为0的商品
            // pointPriceRange:'1,100000000',//标识价格为0的商品
            v :2//接口版本 v=2 不返回价格、库存、促销

        };
        if($scope.data.filterSwitch){
            params.pointPriceRange = '0,' + $scope.data.amountBalance;
        }
        //积分换购的商品
        if($scope.data.redemptionType == 1){
            params.priceRange = '0.01,99999999999999';
            params.pointPriceRange = '1,99999999999999';
        } else if($scope.data.redemptionType == 2){
            //积分兑换的商品
            params.priceRange = '0,0';
        }
        $rootScope.ajax.get(url, params).then(function (res) {
            if(res.code == 0) {
                // $scope.userPointInfo = res.data;
                $scope.data.searchList = res.data.productList || [];

                //积分实时价格库存
                $rootScope.util.getPointProPriceAndStock((function (productList) {
                    "use strict";
                    var itemIds = [];
                    angular.forEach(productList, function (v) {
                        itemIds.push(v.mpId);
                    });
                    return itemIds.join();
                })(res.data.productList),res.data.productList,function (obj) {
                    $scope.data.searchList = obj;
                });

                $scope.data.searchObj.totalCount = res.data.totalCount;
                $scope.data.searchObj.totalPage = Math.ceil(res.data.totalCount / $scope.data.searchObj.pageSize);
            }else {
                $rootScope.error.checkCode(res.code, res.message);
            }
        }, function () {
            $scope.sms.msg = $scope.i18n('系统故障');
        })
    }

    $scope.$on('changePageNo', function (event, data) {
            "use strict";
        $scope.data.searchObj.pageNo = data;
        $scope.getSearchList();
    })

    $scope.getAmountBalance = function () {
        if(!$scope.data.ut) return;
        var url = "/ouser-center/api/point/queryPointDetail.do";
        $rootScope.ajax.post(url, {}).then(function (res) {
            if(res.code == 0 && res.data ) {
                $scope.data.amountBalance = res.data.balanceAccount + res.data.freezedAccount;
            }else {
                $rootScope.error.checkCode(res.code, res.message);
            }
        })
    }
    $scope.getAmountBalance();
    $scope.filterPointPro = function () {
        $scope.data.filterSwitch = !$scope.data.filterSwitch;
        this.getSearchList();
    }
}]);
