/**
 * Created by Roy on 15/10/20.
 */
appControllers.controller("consumableProductsCtrl", ['$log', '$rootScope', '$scope', '$location', 'commonService', 'categoryService', '$anchorScroll','$window', function ($log, $rootScope, $scope, $location, commonService, categoryService, $anchorScroll,$window) {
    "use strict"
    //默认省份与小能
    $scope.getLunboAndRightAd = function () {
        var url = '/ad-whale-web/dolphin/getAdSource',
            params = {
                pageCode:'HOME',
                adCode:'material_banner',
                platform:1,
                companyId:$rootScope.companyId
            };
        $rootScope.ajax.get(url,params).then(function (res) {
            if (res.data && res.data.material_banner) {
                $scope.lunbo = res.data.material_banner;
            }
        })
    };
    // 搜索关键词
    $scope.keywords = ''
    $scope.gotoSearch = function() {
        if (!$scope.keywords) {
            return
        }
        var url = '/search.html?artNoSearch=1&keyword=' + encodeURIComponent($scope.keywords || '');
        var areaCode = $rootScope.localProvince.province.provinceCode;
        var guid = localStorage.getItem("heimdall_GU");
        guid = guid.replace(/\^/g,'')
        guid = guid.replace(/\`/g,'')
        if (areaCode) {
            url += '&areaCode=' + areaCode;
        }
        if (guid){
            url += '&guid=' + guid;
        }
        location.href = url
    }
    $scope.getLunboAndRightAd();
    // 获取所有品牌
    $scope.queryMpConsumeAllBrand = function() {    
        var url = 'custom-sbd-web/mpConsume/queryMpConsumeAllBrand.do'
        var params = {}
        $rootScope.ajax.get(url,params).then(function(res) {
            if (res.code ==0) {
                $scope.allBrands = res.data || []
            }
        })
    }
    $scope.queryMpConsumeAllBrand()
    // 根据品牌获取型号
    $scope.currentIndex = null
    $scope.chooseBrand = function(item,index) {
        $scope.currentIndex = index
        var url = 'custom-sbd-web/mpConsume/queryMpConsumeByBrandId.do'
        var params = {
            currentPage: 1,
            itemsPerPage: 20,
            brandId : item.id,
        }
        $rootScope.ajax.get(url,params).then(function(res) {
            if (res.code ==0 ) {
                $scope.versionList = res.data.listObj || []
            }
        })
    }
    // 根据型号选择商品
    $scope.chooseVersion = function(item) {
        $scope.keyword = item.merchantProduct.artNo
        var url = '/search.html?artNoSearch=1&keyword=' + encodeURIComponent($scope.keyword || '');
        var areaCode = $rootScope.localProvince.province.provinceCode;
        var guid = localStorage.getItem("heimdall_GU");
        guid = guid.replace(/\^/g,'')
        guid = guid.replace(/\`/g,'')
        if (areaCode) {
            url += '&areaCode=' + areaCode;
        }
        if (guid){
            url += '&guid=' + guid;
        }
        location.href = url
    }
}]);
