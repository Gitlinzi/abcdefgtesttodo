/**
 * Created by sindy on 15/11/4.
 */

appControllers.controller("crowdFundingCtrl", ['$log', '$rootScope', '$scope', '$http', '$cookieStore', 'commonService', 'categoryService', 'config', function($log, $rootScope, $scope, $http, $cookieStore, commonService, categoryService, config) {
    var _ut = $rootScope.util.getUserToken(),
        _fnP = $rootScope.ajax.post,
        _fnG = $rootScope.ajax.get,
        _fnE = $rootScope.error.checkCode,
        _host = $rootScope.host,
        _cid = $rootScope.companyId;
    $scope.activeNum = 0;
    $rootScope.execute();
    $scope.isActiveNum=function(numStatus){
        $scope.activeNum = numStatus;
    };

    $scope.pageSize = 10;
    $scope.pageNo = 1;
    $scope.crowdfundList = [];
    $scope.getCrowdfundList = function (pageNo, scroll) {
        var url = _host + '/promotion/promotionProduct/list',
            params = {
                isNeedTotal: 1,
                status: 4,
                promotionType: 17,//众筹
                itemsPerPage: $scope.pageSize,
                currentPage: $scope.pageNo,
                isNeedRule: 1,
            }
        ;
        if(scroll){
            params.pageNo = pageNo;
        }
        _fnP(url, params).then(function (res) {
            if (res.code == 0 && res.data.listObj != null && res.data.listObj.length > 0) {
                if(scroll){
                    $scope.crowdfundList = $scope.crowdfundList.concat(res.data.listObj);
                }else{
                    $scope.crowdfundList = $scope.crowdfundList.concat(res.data.listObj);
                    $scope.totalCount = res.data.total;
                    $scope.totalPage = $scope.totalCount % $scope.pageSize == 0 ? (($scope.totalCount / $scope.pageSize) || 1) : parseInt($scope.totalCount / $scope.pageSize) + 1;
                    }
            } else {
                $scope.showPage = false;
                $scope.showIcon = true;
            }
        }, function (res) {

        });
    };
    $scope.getCrowdfundList();
    //滚动请求数据
    $rootScope.scrollLoading({triggerHeight: 1000, callback: function() {
        if ($scope.pageNo < $scope.totalPage) {
            $scope.pageNo++;
            $scope.getCrowdfundList($scope.pageNo,true);
        } else {
            $scope.showPage = false;
            $scope.showIcon = true;
        }
    }});

    //立即抢购弹框
    $scope.merchantProduct = {};
    $scope.immediatelySnappedUp = {
        showBuyBox : false,//弹框
        packingWay :1,//包装方式
        packingWayList:[],//包装方式数组
        num:1,//起始购买数量
        totalNum:0, //总量
        totalPrice:0,
        closeShowBuyBox : function () {
            $scope.immediatelySnappedUp.showBuyBox = false;
            $scope.immediatelySnappedUp.resetTotal();
        },
        openShowBuyBox : function (product) {
            var _ut = $rootScope.util.getUserToken();
            if (!_ut) {
                $rootScope.showLoginBox = true;
                return;
            };
            $scope.immediatelySnappedUp.showBuyBox = true;
            $scope.merchantProduct = product;
            //获取库存
            $rootScope.ajax.get(_host + '/realTime/getPriceStockList', {mpIds: [product.mpId]}).then(function (res) {
                if(res.code == 0 && res.data !=null && res.data.plist[0] !=null){
                    $scope.realStock =res.data.plist[0].stockNum;
                    $scope.realStockText =res.data.plist[0].stockText;
                }
            });
            //获取商品的包装方式
            $rootScope.ajax.postJson('/back-product-web2/orderMultipleAction/getMerchantProductOrderMultipleByMpIds.do', {mpIds: [product.mpId]}).then(function (res) {
                if(res.code == 0){
                    $scope.immediatelySnappedUp.packingWayList = res.data[product.mpId];
                    if ($scope.immediatelySnappedUp.packingWayList && $scope.immediatelySnappedUp.packingWayList.length > 0) {
                        $scope.immediatelySnappedUp.packingWay = $scope.immediatelySnappedUp.packingWayList[0].orderMultiple;
                    }else {
                        $scope.immediatelySnappedUp.packingWayList = [{orderMultiple:1}];
                        $scope.immediatelySnappedUp.packingWay = $scope.immediatelySnappedUp.packingWayList[0].orderMultiple;
                    }
                    //总数量 = 包装方式*购买个数
                    $scope.immediatelySnappedUp.totalNum = $scope.immediatelySnappedUp.packingWay*$scope.immediatelySnappedUp.num;
                    $scope.immediatelySnappedUp.totalPrice = $scope.immediatelySnappedUp.totalNum*$scope.merchantProduct.promotionPrice;
                }
            },function () {
                $scope.immediatelySnappedUp.showBuyBox = false;
                _fnE('提示','系统异常');
            });
        },

        //数目输入值格式判断
        checkNum: function (num) {
            if (num.match(/^[0-9]{1,3}$/)) {
                if (parseInt(num) < 1)
                    return 1;
                return parseInt(num);
            } else {
                return 1;
            }
        },

        //更新购买总数量
        updateTotal:function () {
            $scope.immediatelySnappedUp.totalNum = $scope.immediatelySnappedUp.packingWay*$scope.immediatelySnappedUp.num;
            $scope.immediatelySnappedUp.totalPrice = $scope.immediatelySnappedUp.totalNum*$scope.merchantProduct.promotionPrice;
        },

        //切换包装方式，重置总数
        resetTotal:function () {
            $scope.immediatelySnappedUp.num = 1;
            $scope.immediatelySnappedUp.totalNum = $scope.immediatelySnappedUp.packingWay*$scope.immediatelySnappedUp.num;
        },
        //确订购买，初始化订单
        submit:function () {
            var params = {
                platformId: $rootScope.platformId,
                skus: JSON.stringify([{'mpId': $scope.merchantProduct.mpId, 'num': $scope.immediatelySnappedUp.totalNum,'promotionId':$scope.merchantProduct.promotionId}]),
                businessType: 9//众筹传9
            };
            if ($rootScope.util.getUserToken() == undefined || $rootScope.util.getUserToken() == null) {
                $rootScope.showLoginBox = true;
                return;
            } else if ($scope.merchantProduct.mpId == null || $scope.merchantProduct.mpId == undefined) {
                return;
            } else {
                $rootScope.ajax.post($rootScope.host + '/checkout/initOrder', params).then(function (res) {
                    if (res.code == 0) {
                        localStorage.setItem('quickBuy', JSON.stringify(params));
                        location.href = 'settlement.html?q=1';
                    } else {
                        $rootScope.error.checkCode('系统异常', res.message);
                    }
                },function (error) {
                    $rootScope.error.checkCode('系统异常', '一键购买异常！');
                })
            }
        }
    }

}]);
