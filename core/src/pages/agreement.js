// import { debug } from "util";

/**
 * Created by Roy on 15/10/20.
 */
appControllers.controller("agreementCtrl", ['$log', '$rootScope', '$scope', '$location', 'commonService', 'categoryService', '$anchorScroll','$window', function ($log, $rootScope, $scope, $location, commonService, categoryService, $anchorScroll,$window) {
    
    $scope.searchObj={
        pageNo:1,
        pageSize:40,
        totalCount:0,
        checkAll:false,
        sortType: '10',
        keyword: '*****',
        filterType: 'AGREEMENT_PRODUCT'
    };
    $scope.totalPage = 0
    $scope.$on('changePageNo', function (event, data) {
        $scope.searchObj.pageNo = data;
        $scope.getProductList()
    })
    //如果列表页可以加入购物车， 监听子控制器的事件
    $rootScope.$on('updateMiniCartToParent',function () {
        //监听到事件后再广播出去
        $scope.$broadcast('updateMiniCart');
    });
    $scope.productList = []
    $scope.mpIdList = []
    let urlParams = $rootScope.util.paramsFormat(location.search)
    $scope.type = urlParams.type
    var params = $rootScope.util.paramsFormat(location.href);
    $scope.searchObj.timer=new Date().getTime();
    $scope.searchObj.areaCode = $rootScope.localProvince.province.provinceCode;
    $scope.searchObj.platformId = $rootScope.platformId;
    $scope.searchObj.ut = $rootScope.util.getUserToken() || false;
    $scope.searchObj.companyId=$rootScope.companyId;
    $scope.searchObj.promotionIds =params.promotionId;
    $scope.searchObj.v =2;//接口版本 v=2 不返回价格、库存、促销
    let guid = localStorage.getItem("heimdall_GU")
    guid = guid.replace(/\^/g,'')
    guid = guid.replace(/\`/g,'')
    $scope.searchObj.guid = guid;
    //增值服务,过滤商品
    $scope.searchObj.types = params.types;
    $scope.getProductList = function() {
        let url = ''
        // let params = {}
        if(urlParams.type == 1) {
            url = '/search/rest/searchList.do'
            // params = {
            //     currentPage: $scope.searchObj.pageNo,
            //     itemsPerPage: $scope.searchObj.pageSize
            // }
            $rootScope.ajax.get(url,$scope.searchObj).then(res => {
                if (res.code ==0 && res.data) {
                    var productList = res.data.productList || []
                    $scope.searchObj.totalCount = res.data.totalCount
                    $scope.totalPage = Math.ceil(res.data.totalCount/$scope.searchObj.pageSize)
                    if (res.data.productList.length > 0) {
                        $scope.productList = res.data.productList
                        angular.forEach(res.data.productList, function (val) {
                            $scope.mpIdList.push(val.mpId);
                        })
                    }
                    if (!$scope.mpIdList || !$scope.mpIdList.length) {
                        return;
                    }
                    $scope.getPriceStockList($scope.mpIdList)
                }
            })
        } else if(urlParams.type ==2) {
            url = '/custom-sbd-web/product/getHotSaleProductList.do'
            params = {
                currentPage: $scope.searchObj.pageNo,
                itemsPerPage: $scope.searchObj.pageSize
            }
            $rootScope.ajax.postJson(url,params).then(res => {
                if (res.code ==0 && res.data) {
                    var productList = res.data.listObj || []
                    $scope.searchObj.totalCount = res.data.total
                    $scope.totalPage = Math.ceil(res.data.total/$scope.searchObj.pageSize)
                    if (res.data.listObj.length > 0) {
                        $scope.productList = res.data.listObj
                        angular.forEach(res.data.listObj, function (val) {
                            $scope.mpIdList.push(val.mpId);
                        })
                    }
                    if (!$scope.mpIdList || !$scope.mpIdList.length) {
                        return;
                    }
                    $scope.getPriceStockList($scope.mpIdList)
                }
            })
        }
        
    }
    $scope.getProductList()
    $scope.getPriceStockList = function(mpIds) {
        $rootScope.ajax.get($rootScope.host + '/realTime/getPriceStockList', {mpIds: mpIds,
            areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode: $rootScope.defaultAreasCode}).then(function (res) {
            if (res.code == 0) {
                if (res.data) {
                    angular.forEach(res.data.plist, function (val2) {
                        angular.forEach($scope.productList, function (val3) {
                            if (val2.mpId == val3.mpId) {
                                val3.realPrice = val2.availablePrice;
                                val3.realNum = val2.stockNum;
                                val3.realNumText = val2.stockText;
                                val3.stockNum = val2.stockNum;
                            }
                        })
                    })
                }
            } else {
                $rootScope.error.checkCode(res.code, res.message);
            }
        },function(){
            $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('获取实时库存价格异常'));
        })
    }
    // 跳转商详页
    $scope.goToDetail = function(id) {
        location.href = '/item.html?itemId=' + id
    }
}]);
