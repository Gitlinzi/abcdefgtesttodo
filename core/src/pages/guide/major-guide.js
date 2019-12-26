/**
 * Created by Roy on 15/10/20.
 */
appControllers.controller("majorGuideCtrl", ['$log', '$rootScope', '$scope', '$location', 'commonService', 'categoryService', '$anchorScroll','$window', function ($log, $rootScope, $scope, $location, commonService, categoryService, $anchorScroll,$window) {  
    
    //监听子控制器的事件
    $rootScope.$on('updateMiniCartToParent',function () {
        //监听到事件后再广播出去
        $scope.$broadcast('updateMiniCart');
    })
    $scope.rootParams = $rootScope.util.paramsFormat(location.search);
    $scope.goToDetail = function(item) {
        window.location = item.linkUrl
    }
    switch($scope.rootParams.tab) {
        case '0':
        $scope.f1_classificationadCode = 'one_f1_classification'
        $scope.f1_pic_ad = 'one_f1_pic'
        $scope.f1 = 'one_f1'
        $scope.f1_1_recommend_brand = 'one_f1_1_recommend_brand'
        // $scope.f2_classificationadCode = 'one_f2_classification'
        $scope.f2_pic_ad = 'one_f2_pic'
        $scope.f2 = 'one_f2'
        $scope.f2_1_recommend_brand = 'one_f2_1_recommend_brand'
        // $scope.f3_classificationadCode = 'one_f3_classification'
        $scope.f3_pic_ad = 'one_f3_pic'
        $scope.f3 = 'one_f3'
        $scope.f3_1_recommend_brand = 'one_f3_1_recommend_brand'
        $scope.f4_pic_ad = 'one_f4_pic'
        $scope.f4 = 'one_f4'
        $scope.f4_1_recommend_brand = 'one_f4_1_recommend_brand'
        $scope.f5_pic_ad = 'one_f5_pic'
        $scope.f5 = 'one_f5'
        $scope.f5_1_recommend_brand = 'one_f5_1_recommend_brand'
        $scope.f6_pic_ad = 'one_f6_pic'
        $scope.f6 = 'one_f6'
        $scope.f6_1_recommend_brand = 'one_f6_1_recommend_brand'
        $scope.f7_pic_ad = 'one_f7_pic'
        $scope.f7 = 'one_f7'
        $scope.f7_1_recommend_brand = 'one_f7_1_recommend_brand'
        $scope.f8_pic_ad = 'one_f8_pic'
        $scope.f8 = 'one_f8'
        $scope.f8_1_recommend_brand = 'one_f8_1_recommend_brand'
        $scope.f9_pic_ad = 'one_f9_pic'
        $scope.f9 = 'one_f9'
        $scope.f9_1_recommend_brand = 'one_f9_1_recommend_brand'
        $scope.f10_pic_ad = 'one_f10_pic'
        $scope.f10 = 'one_f10'
        $scope.f10_1_recommend_brand = 'one_f10_1_recommend_brand'
        break;
        case '1':
        $scope.f1_classificationadCode = 'two_f1_classification'
        $scope.f1_pic_ad = 'two_f1_pic'
        $scope.f1 = 'two_f1'
        $scope.f1_1_recommend_brand = 'two_f2_1_recommend_brand'
        $scope.f2_pic_ad = 'two_f2_pic'
        $scope.f2 = 'two_f2'
        $scope.f2_1_recommend_brand = 'two_f2_1_recommend_brand'
        $scope.f3_pic_ad = 'two_f3_pic'
        $scope.f3 = 'two_f3'
        $scope.f3_1_recommend_brand = 'two_f3_1_recommend_brand'
        $scope.f4_pic_ad = 'two_f4_pic'
        $scope.f4 = 'two_f4'
        $scope.f4_1_recommend_brand = 'two_f4_1_recommend_brand'
        $scope.f5_pic_ad = 'two_f5_pic'
        $scope.f5 = 'two_f5'
        $scope.f5_1_recommend_brand = 'two_f5_1_recommend_brand'
        $scope.f6_pic_ad = 'two_f6_pic'
        $scope.f6 = 'two_f6'
        $scope.f6_1_recommend_brand = 'two_f6_1_recommend_brand'
        $scope.f7_pic_ad = 'two_f7_pic'
        $scope.f7 = 'two_f7'
        $scope.f7_1_recommend_brand = 'two_f7_1_recommend_brand'
        $scope.f8_pic_ad = 'two_f8_pic'
        $scope.f8 = 'two_f8'
        $scope.f8_1_recommend_brand = 'two_f8_1_recommend_brand'
        $scope.f9_pic_ad = 'two_f9_pic'
        $scope.f9 = 'two_f9'
        $scope.f9_1_recommend_brand = 'two_f9_1_recommend_brand'
        $scope.f10_pic_ad = 'two_f10_pic'
        $scope.f10 = 'two_f10'
        $scope.f10_1_recommend_brand = 'two_f10_1_recommend_brand'
        break;
        case '2':
        $scope.f1_classificationadCode = 'three_f1_classification'
        $scope.f1_pic_ad = 'three_f1_pic'
        $scope.f1 = 'three_f1'
        $scope.f1_1_recommend_brand = 'three_f1_1_recommend_brand'
        $scope.f2_pic_ad = 'three_f2_pic'
        $scope.f2 = 'three_f2'
        $scope.f2_1_recommend_brand = 'three_f2_1_recommend_brand'
        $scope.f3_pic_ad = 'three_f3_pic'
        $scope.f3 = 'three_f3'
        $scope.f3_1_recommend_brand = 'three_f3_1_recommend_brand'
        $scope.f4_pic_ad = 'three_f4_pic'
        $scope.f4 = 'three_f4'
        $scope.f4_1_recommend_brand = 'three_f4_1_recommend_brand'
        $scope.f5_pic_ad = 'three_f5_pic'
        $scope.f5 = 'three_f5'
        $scope.f5_1_recommend_brand = 'three_f5_1_recommend_brand'
        $scope.f6_pic_ad = 'three_f6_pic'
        $scope.f6 = 'three_f6'
        $scope.f6_1_recommend_brand = 'three_f6_1_recommend_brand'
        $scope.f7_pic_ad = 'three_f7_pic'
        $scope.f7 = 'three_f7'
        $scope.f7_1_recommend_brand = 'three_f7_1_recommend_brand'
        $scope.f8_pic_ad = 'three_f8_pic'
        $scope.f8 = 'three_f8'
        $scope.f8_1_recommend_brand = 'three_f8_1_recommend_brand'
        $scope.f9_pic_ad = 'three_f9_pic'
        $scope.f9 = 'three_f9'
        $scope.f9_1_recommend_brand = 'three_f9_1_recommend_brand'
        $scope.f10_pic_ad = 'three_f10_pic'
        $scope.f10 = 'three_f10'
        $scope.f10_1_recommend_brand = 'three_f10_1_recommend_brand'
        break;
        case '3':
        $scope.f1_classificationadCode = 'four_f1_classification'
        $scope.f1_pic_ad = 'four_f1_pic'
        $scope.f1 = 'four_f1'
        $scope.f1_1_recommend_brand = 'four_f1_1_recommend_brand'
        $scope.f2_pic_ad = 'four_f2_pic'
        $scope.f2 = 'four_f2'
        $scope.f2_1_recommend_brand = 'four_f2_1_recommend_brand'
        $scope.f3_pic_ad = 'four_f3_pic'
        $scope.f3 = 'four_f3'
        $scope.f3_1_recommend_brand = 'four_f3_1_recommend_brand'
        $scope.f4_pic_ad = 'four_f4_pic'
        $scope.f4 = 'four_f4'
        $scope.f4_1_recommend_brand = 'four_f4_1_recommend_brand'
        $scope.f5_pic_ad = 'four_f5_pic'
        $scope.f5 = 'four_f5'
        $scope.f5_1_recommend_brand = 'four_f5_1_recommend_brand'
        $scope.f6_pic_ad = 'four_f6_pic'
        $scope.f6 = 'four_f6'
        $scope.f6_1_recommend_brand = 'four_f6_1_recommend_brand'
        $scope.f7_pic_ad = 'four_f7_pic'
        $scope.f7 = 'four_f7'
        $scope.f7_1_recommend_brand = 'four_f7_1_recommend_brand'
        $scope.f8_pic_ad = 'four_f8_pic'
        $scope.f8 = 'four_f8'
        $scope.f8_1_recommend_brand = 'four_f8_1_recommend_brand'
        $scope.f9_pic_ad = 'four_f9_pic'
        $scope.f9 = 'four_f9'
        $scope.f9_1_recommend_brand = 'four_f9_1_recommend_brand'
        $scope.f10_pic_ad = 'four_f10_pic'
        $scope.f10 = 'four_f10'
        $scope.f10_1_recommend_brand = 'four_f10_1_recommend_brand'
        break;
        case '4':
        $scope.f1_classificationadCode = 'five_f1_classification'
        $scope.f1_pic_ad = 'five_f1_pic'
        $scope.f1 = 'five_f1'
        $scope.f1_1_recommend_brand = 'five_f1_1_recommend_brand'
        $scope.f2_pic_ad = 'five_f2_pic'
        $scope.f2 = 'five_f2'
        $scope.f2_1_recommend_brand = 'five_f2_1_recommend_brand'
        $scope.f3_pic_ad = 'five_f3_pic'
        $scope.f3 = 'five_f3'
        $scope.f3_1_recommend_brand = 'five_f3_1_recommend_brand'
        $scope.f4_pic_ad = 'five_f4_pic'
        $scope.f4 = 'five_f4'
        $scope.f4_1_recommend_brand = 'five_f4_1_recommend_brand'
        $scope.f5_pic_ad = 'five_f5_pic'
        $scope.f5 = 'five_f5'
        $scope.f5_1_recommend_brand = 'five_f5_1_recommend_brand'
        $scope.f6_pic_ad = 'five_f6_pic'
        $scope.f6 = 'five_f6'
        $scope.f6_1_recommend_brand = 'five_f6_1_recommend_brand'
        $scope.f7_pic_ad = 'five_f7_pic'
        $scope.f7 = 'five_f7'
        $scope.f7_1_recommend_brand = 'five_f7_1_recommend_brand'
        $scope.f8_pic_ad = 'five_f8_pic'
        $scope.f8 = 'five_f8'
        $scope.f8_1_recommend_brand = 'five_f8_1_recommend_brand'
        $scope.f9_pic_ad = 'five_f9_pic'
        $scope.f9 = 'five_f9'
        $scope.f9_1_recommend_brand = 'five_f9_1_recommend_brand'
        $scope.f10_pic_ad = 'five_f10_pic'
        $scope.f10 = 'five_f10'
        $scope.f10_1_recommend_brand = 'five_f10_1_recommend_brand'
        break;
        case '5':
        $scope.f1_classificationadCode = 'six_f1_classification'
        $scope.f1_pic_ad = 'six_f1_pic'
        $scope.f1 = 'six_f1'
        $scope.f1_1_recommend_brand = 'six_f1_1_recommend_brand'
        $scope.f2_pic_ad = 'six_f2_pic'
        $scope.f2 = 'six_f2'
        $scope.f2_1_recommend_brand = 'six_f2_1_recommend_brand'
        $scope.f3_pic_ad = 'six_f3_pic'
        $scope.f3 = 'six_f3'
        $scope.f3_1_recommend_brand = 'six_f3_1_recommend_brand'
        $scope.f4_pic_ad = 'six_f4_pic'
        $scope.f4 = 'six_f4'
        $scope.f4_1_recommend_brand = 'six_f4_1_recommend_brand'
        $scope.f5_pic_ad = 'six_f5_pic'
        $scope.f5 = 'six_f5'
        $scope.f5_1_recommend_brand = 'six_f5_1_recommend_brand'
        $scope.f6_pic_ad = 'six_f6_pic'
        $scope.f6 = 'six_f6'
        $scope.f6_1_recommend_brand = 'six_f6_1_recommend_brand'
        $scope.f7_pic_ad = 'six_f7_pic'
        $scope.f7 = 'six_f7'
        $scope.f7_1_recommend_brand = 'six_f7_1_recommend_brand'
        $scope.f8_pic_ad = 'six_f8_pic'
        $scope.f8 = 'six_f8'
        $scope.f8_1_recommend_brand = 'six_f8_1_recommend_brand'
        $scope.f9_pic_ad = 'six_f9_pic'
        $scope.f9 = 'six_f9'
        $scope.f9_1_recommend_brand = 'six_f9_1_recommend_brand'
        $scope.f10_pic_ad = 'six_f10_pic'
        $scope.f10 = 'six_f10'
        $scope.f10_1_recommend_brand = 'six_f10_1_recommend_brand'
        break;
        case '6':
        $scope.f1_classificationadCode = 'seven_f1_classification'
        $scope.f1_pic_ad = 'seven_f1_pic'
        $scope.f1 = 'seven_f1'
        $scope.f1_1_recommend_brand = 'seven_f1_1_recommend_brand'
        $scope.f2_pic_ad = 'seven_f2_pic'
        $scope.f2 = 'seven_f2'
        $scope.f2_1_recommend_brand = 'seven_f2_1_recommend_brand'
        $scope.f3_pic_ad = 'seven_f3_pic'
        $scope.f3 = 'seven_f3'
        $scope.f3_1_recommend_brand = 'seven_f3_1_recommend_brand'
        $scope.f4_pic_ad = 'seven_f4_pic'
        $scope.f4 = 'seven_f4'
        $scope.f4_1_recommend_brand = 'seven_f4_1_recommend_brand'
        $scope.f5_pic_ad = 'seven_f5_pic'
        $scope.f5 = 'seven_f5'
        $scope.f5_1_recommend_brand = 'seven_f5_1_recommend_brand'
        $scope.f6_pic_ad = 'seven_f6_pic'
        $scope.f6 = 'seven_f6'
        $scope.f6_1_recommend_brand = 'seven_f6_1_recommend_brand'
        $scope.f7_pic_ad = 'seven_f7_pic'
        $scope.f7 = 'seven_f7'
        $scope.f7_1_recommend_brand = 'seven_f7_1_recommend_brand'
        $scope.f8_pic_ad = 'seven_f8_pic'
        $scope.f8 = 'seven_f8'
        $scope.f8_1_recommend_brand = 'seven_f8_1_recommend_brand'
        $scope.f9_pic_ad = 'seven_f9_pic'
        $scope.f9 = 'seven_f9'
        $scope.f9_1_recommend_brand = 'seven_f9_1_recommend_brand'
        $scope.f10_pic_ad = 'seven_f10_pic'
        $scope.f10 = 'seven_f10'
        $scope.f10_1_recommend_brand = 'seven_f10_1_recommend_brand'
        break;
        case '7':
        $scope.f1_classificationadCode = 'eight_f1_classification'
        $scope.f1_pic_ad = 'eight_f1_pic'
        $scope.f1 = 'eight_f1'
        $scope.f1_1_recommend_brand = 'eight_f1_1_recommend_brand'
        $scope.f2_pic_ad = 'eight_f2_pic'
        $scope.f2 = 'eight_f2'
        $scope.f2_1_recommend_brand = 'eight_f2_1_recommend_brand'
        $scope.f3_pic_ad = 'eight_f3_pic'
        $scope.f3 = 'eight_f3'
        $scope.f3_1_recommend_brand = 'eight_f3_1_recommend_brand'
        $scope.f4_pic_ad = 'eight_f4_pic'
        $scope.f4 = 'eight_f4'
        $scope.f4_1_recommend_brand = 'eight_f4_1_recommend_brand'
        $scope.f5_pic_ad = 'eight_f5_pic'
        $scope.f5 = 'eight_f5'
        $scope.f5_1_recommend_brand = 'eight_f5_1_recommend_brand'
        $scope.f6_pic_ad = 'eight_f6_pic'
        $scope.f6 = 'eight_f6'
        $scope.f6_1_recommend_brand = 'eight_f6_1_recommend_brand'
        $scope.f7_pic_ad = 'eight_f7_pic'
        $scope.f7 = 'eight_f7'
        $scope.f7_1_recommend_brand = 'eight_f7_1_recommend_brand'
        $scope.f8_pic_ad = 'eight_f8_pic'
        $scope.f8 = 'eight_f8'
        $scope.f8_1_recommend_brand = 'eight_f8_1_recommend_brand'
        $scope.f9_pic_ad = 'eight_f9_pic'
        $scope.f9 = 'eight_f9'
        $scope.f9_1_recommend_brand = 'eight_f9_1_recommend_brand'
        $scope.f10_pic_ad = 'eight_f10_pic'
        $scope.f10 = 'eight_f10'
        $scope.f10_1_recommend_brand = 'eight_f10_1_recommend_brand'
        break;
        case '8':
        $scope.f1_classificationadCode = 'nine_f1_classification'
        $scope.f1_pic_ad = 'nine_f1_pic'
        $scope.f1 = 'nine_f1'
        $scope.f1_1_recommend_brand = 'nine_f1_1_recommend_brand'
        $scope.f2_pic_ad = 'nine_f2_pic'
        $scope.f2 = 'nine_f2'
        $scope.f2_1_recommend_brand = 'nine_f2_1_recommend_brand'
        $scope.f3_pic_ad = 'nine_f3_pic'
        $scope.f3 = 'nine_f3'
        $scope.f3_1_recommend_brand = 'nine_f3_1_recommend_brand'
        $scope.f4_pic_ad = 'nine_f4_pic'
        $scope.f4 = 'nine_f4'
        $scope.f4_1_recommend_brand = 'nine_f4_1_recommend_brand'
        $scope.f5_pic_ad = 'nine_f5_pic'
        $scope.f5 = 'nine_f5'
        $scope.f5_1_recommend_brand = 'nine_f5_1_recommend_brand'
        $scope.f6_pic_ad = 'nine_f6_pic'
        $scope.f6 = 'nine_f6'
        $scope.f6_1_recommend_brand = 'nine_f6_1_recommend_brand'
        $scope.f7_pic_ad = 'nine_f7_pic'
        $scope.f7 = 'nine_f7'
        $scope.f7_1_recommend_brand = 'nine_f7_1_recommend_brand'
        $scope.f8_pic_ad = 'nine_f8_pic'
        $scope.f8 = 'nine_f8'
        $scope.f8_1_recommend_brand = 'nine_f8_1_recommend_brand'
        $scope.f9_pic_ad = 'nine_f9_pic'
        $scope.f9 = 'nine_f9'
        $scope.f9_1_recommend_brand = 'nine_f9_1_recommend_brand'
        $scope.f10_pic_ad = 'nine_f10_pic'
        $scope.f10 = 'nine_f10'
        $scope.f10_1_recommend_brand = 'nine_f10_1_recommend_brand'
        break;
        case '9':
        $scope.f1_classificationadCode = 'ten_f1_classification'
        $scope.f1_pic_ad = 'ten_f1_pic'
        $scope.f1 = 'ten_f1'
        $scope.f1_1_recommend_brand = 'ten_f1_1_recommend_brand'
        $scope.f2_pic_ad = 'ten_f2_pic'
        $scope.f2 = 'ten_f2'
        $scope.f2_1_recommend_brand = 'ten_f2_1_recommend_brand'
        $scope.f3_pic_ad = 'ten_f3_pic'
        $scope.f3 = 'ten_f3'
        $scope.f3_1_recommend_brand = 'ten_f3_1_recommend_brand'
        $scope.f4_pic_ad = 'ten_f4_pic'
        $scope.f4 = 'ten_f4'
        $scope.f4_1_recommend_brand = 'ten_f4_1_recommend_brand'
        $scope.f5_pic_ad = 'ten_f5_pic'
        $scope.f5 = 'ten_f5'
        $scope.f5_1_recommend_brand = 'ten_f5_1_recommend_brand'
        $scope.f6_pic_ad = 'ten_f6_pic'
        $scope.f6 = 'ten_f6'
        $scope.f6_1_recommend_brand = 'ten_f6_1_recommend_brand'
        $scope.f7_pic_ad = 'ten_f7_pic'
        $scope.f7 = 'ten_f7'
        $scope.f7_1_recommend_brand = 'ten_f7_1_recommend_brand'
        $scope.f8_pic_ad = 'ten_f8_pic'
        $scope.f8 = 'ten_f8'
        $scope.f8_1_recommend_brand = 'ten_f8_1_recommend_brand'
        $scope.f9_pic_ad = 'ten_f9_pic'
        $scope.f9 = 'ten_f9'
        $scope.f9_1_recommend_brand = 'ten_f9_1_recommend_brand'
        $scope.f10_pic_ad = 'ten_f10_pic'
        $scope.f10 = 'ten_f10'
        $scope.f10_1_recommend_brand = 'ten_f10_1_recommend_brand'
        break;
    }
    // 获取左侧广告图
    $scope.getf1_classification = function() {
        var url = '/ad-whale-web/dolphin/getAdSource',
            params = {
                pageCode:'HOME',
                adCode: $scope.f1_classificationadCode,
                platform:1,
                companyId:$rootScope.companyId
            };
        $rootScope.ajax.get(url,params).then(function (res) {
            if (res.code ==0) {
                
                $scope.f1_classification = res.data[$scope.f1_classificationadCode][0];
            }
        })
    }
    $scope.getf1_classification()
    // 获取f1_pic广告图片
    $scope.getf1_picAd = function () {
        var url = '/ad-whale-web/dolphin/getAdSource',
            params = {
                pageCode:'HOME',
                adCode: $scope.f1_pic_ad,
                platform:1,
                companyId:$rootScope.companyId
            };
        $rootScope.ajax.get(url,params).then(function (res) {
            if (res.code ==0 && res.data) {
                $scope.f1_pic = res.data[$scope.f1_pic_ad][0];
            }
        })
    };
    $scope.getf1_picAd()
    // 获取f1标题
    $scope.getf1_title = function() {
        var url = '/ad-whale-web/dolphin/getAdSource',
            params = {
                pageCode:'HOME',
                adCode:$scope.f1,
                platform:1,
                companyId:$rootScope.companyId
            };
        $rootScope.ajax.get(url,params).then(function (res) {
            if (res.code ==0) {
                $scope.f1_title = res.data[$scope.f1][0];
            }
        })
    }
    $scope.getf1_title()
    // 获取商品信息
    $scope.getf1_goods = function() {
        var url = '/ad-whale-web/dolphin/getAdSource',
        params = {
            pageCode:'HOME',
            adCode:$scope.f1_1_recommend_brand,
            platform:1,
            companyId:$rootScope.companyId
        };
        $rootScope.ajax.get(url,params).then(function (res) {
            if (res.code ==0) {
                $scope.f1_goods = res.data[$scope.f1_1_recommend_brand];
                $scope.getPrice1($scope.f1_goods)
            }
        })
    }
    // 获取实时价格库存接口
    $scope.getPrice1 = function(productList) {
        var url = $rootScope.host + '/realTime/getPriceStockList'
        var mpIds = []
        angular.forEach(productList,function(item) {
            mpIds.push(item.refObject.id)
        })
        var params = {
            mpIds: mpIds,
            areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode: $rootScope.defaultAreasCode
        }
        $rootScope.ajax.get(url,params).then(function(res) {
            if (res.code ==0 && res.data) {
                angular.forEach(productList,function(item) {
                    angular.forEach(res.data.plist,function(items) {
                        if (item.refObject.id == items.mpId) {
                            item.refObject.price =items.availablePrice
                            item.refObject.stockNum = items.stockNum
                        }
                    })
                })
            }
        })
    },
    $scope.getf1_goods()
    // 获取f2_pic广告图片
    $scope.getf2_picAd = function () {
        var url = '/ad-whale-web/dolphin/getAdSource',
            params = {
                pageCode:'HOME',
                adCode:$scope.f2_pic_ad,
                platform:1,
                companyId:$rootScope.companyId
            };
        $rootScope.ajax.get(url,params).then(function (res) {
            if (res.code ==0) {
                $scope.f2_pic = res.data[$scope.f2_pic_ad][0];
            }
        })
    };
    $scope.getf2_picAd()
      // 获取f2标题
      $scope.getf2_title = function() {
        var url = '/ad-whale-web/dolphin/getAdSource',
            params = {
                pageCode:'HOME',
                adCode:$scope.f2,
                platform:1,
                companyId:$rootScope.companyId
            };
        $rootScope.ajax.get(url,params).then(function (res) {
            if (res.code ==0) {
                $scope.f2_title = res.data[$scope.f2][0];
            }
        })
    }
    $scope.getf2_title()
    // 获取f2商品信息
    $scope.getf2_goods = function() {
        var url = '/ad-whale-web/dolphin/getAdSource',
        params = {
            pageCode:'HOME',
            adCode:$scope.f2_1_recommend_brand,
            platform:1,
            companyId:$rootScope.companyId
        };
        $rootScope.ajax.get(url,params).then(function (res) {
            if (res.code ==0) {
                $scope.f2_goods = res.data[$scope.f2_1_recommend_brand];
                $scope.getPrice1($scope.f2_goods)
            }
        })
    }
    $scope.getf2_goods()
     // 获取f3_pic广告图片
     $scope.getf3_picAd = function () {
        var url = '/ad-whale-web/dolphin/getAdSource',
            params = {
                pageCode:'HOME',
                adCode:$scope.f3_pic_ad,
                platform:1,
                companyId:$rootScope.companyId
            };
        $rootScope.ajax.get(url,params).then(function (res) {
            if (res.code ==0) {
                $scope.f3_pic = res.data[$scope.f3_pic_ad][0];
            }
        })
    };
    $scope.getf3_picAd()
     // 获取f3标题
    $scope.getf3_title = function() {
        var url = '/ad-whale-web/dolphin/getAdSource',
            params = {
                pageCode:'HOME',
                adCode:$scope.f3,
                platform:1,
                companyId:$rootScope.companyId
            };
        $rootScope.ajax.get(url,params).then(function (res) {
            if (res.code ==0) {
                $scope.f3_title = res.data[$scope.f3][0];
            }
        })
    }
    $scope.getf3_title()
     // 获取f3商品信息
     $scope.getf3_goods = function() {
        var url = '/ad-whale-web/dolphin/getAdSource',
        params = {
            pageCode:'HOME',
            adCode:$scope.f3_1_recommend_brand,
            platform:1,
            companyId:$rootScope.companyId
        };
        $rootScope.ajax.get(url,params).then(function (res) {
            if (res.code ==0) {
                $scope.f3_goods = res.data[$scope.f3_1_recommend_brand];
                $scope.getPrice1($scope.f3_goods)
            }
        })
    }
    $scope.getf3_goods()
     // 获取f4_pic广告图片
     $scope.getf4_picAd = function () {
        var url = '/ad-whale-web/dolphin/getAdSource',
            params = {
                pageCode:'HOME',
                adCode:$scope.f4_pic_ad,
                platform:1,
                companyId:$rootScope.companyId
            };
        $rootScope.ajax.get(url,params).then(function (res) {
            if (res.code ==0) {
                $scope.f4_pic = res.data[$scope.f4_pic_ad][0];
            }
        })
    };
    $scope.getf4_picAd()
    //  // 获取f4标题
    $scope.getf4_title = function() {
        var url = '/ad-whale-web/dolphin/getAdSource',
            params = {
                pageCode:'HOME',
                adCode:$scope.f4,
                platform:1,
                companyId:$rootScope.companyId
            };
        $rootScope.ajax.get(url,params).then(function (res) {
            if (res.code ==0) {
                $scope.f4_title = res.data[$scope.f4][0];
            }
        })
    }
    $scope.getf4_title()
    //  // 获取f4商品信息
     $scope.getf4_goods = function() {
        var url = '/ad-whale-web/dolphin/getAdSource',
        params = {
            pageCode:'HOME',
            adCode:$scope.f4_1_recommend_brand,
            platform:1,
            companyId:$rootScope.companyId
        };
        $rootScope.ajax.get(url,params).then(function (res) {
            if (res.code ==0) {
                $scope.f4_goods = res.data[$scope.f4_1_recommend_brand];
            }
        })
    }
    $scope.getf4_goods()
     // 获取f5_pic广告图片
     $scope.getf5_picAd = function () {
        var url = '/ad-whale-web/dolphin/getAdSource',
            params = {
                pageCode:'HOME',
                adCode:$scope.f5_pic_ad,
                platform:1,
                companyId:$rootScope.companyId
            };
        $rootScope.ajax.get(url,params).then(function (res) {
            if (res.code ==0) {
                $scope.f5_pic = res.data[$scope.f5_pic_ad][0];
            }
        })
    };
    $scope.getf5_picAd()
    //  // 获取f5标题
    $scope.getf5_title = function() {
        var url = '/ad-whale-web/dolphin/getAdSource',
            params = {
                pageCode:'HOME',
                adCode:$scope.f5,
                platform:1,
                companyId:$rootScope.companyId
            };
        $rootScope.ajax.get(url,params).then(function (res) {
            if (res.code ==0) {
                $scope.f5_title = res.data[$scope.f5][0];
            }
        })
    }
    $scope.getf5_title()
    //  // 获取f5商品信息
    $scope.getf5_goods = function() {
        var url = '/ad-whale-web/dolphin/getAdSource',
        params = {
            pageCode:'HOME',
            adCode:$scope.f5_1_recommend_brand,
            platform:1,
            companyId:$rootScope.companyId
        };
        $rootScope.ajax.get(url,params).then(function (res) {
            if (res.code ==0) {
                $scope.f5_goods = res.data[$scope.f5_1_recommend_brand];
            }
        })
    }
    $scope.getf5_goods()
    // 获取f6_pic广告图片
    $scope.getf6_picAd = function () {
        var url = '/ad-whale-web/dolphin/getAdSource',
            params = {
                pageCode:'HOME',
                adCode:$scope.f6_pic_ad,
                platform:1,
                companyId:$rootScope.companyId
            };
        $rootScope.ajax.get(url,params).then(function (res) {
            if (res.code ==0) {
                $scope.f6_pic = res.data[$scope.f6_pic_ad][0];
            }
        })
    };
    $scope.getf6_picAd()
    //  // 获取f6标题
    $scope.getf6_title = function() {
        var url = '/ad-whale-web/dolphin/getAdSource',
            params = {
                pageCode:'HOME',
                adCode:$scope.f6,
                platform:1,
                companyId:$rootScope.companyId
            };
        $rootScope.ajax.get(url,params).then(function (res) {
            if (res.code ==0) {
                $scope.f6_title = res.data[$scope.f6][0];
            }
        })
    }
    $scope.getf6_title()
    //  // 获取f6商品信息
    $scope.getf6_goods = function() {
        var url = '/ad-whale-web/dolphin/getAdSource',
        params = {
            pageCode:'HOME',
            adCode:$scope.f6_1_recommend_brand,
            platform:1,
            companyId:$rootScope.companyId
        };
        $rootScope.ajax.get(url,params).then(function (res) {
            if (res.code ==0) {
                $scope.f6_goods = res.data[$scope.f6_1_recommend_brand];
            }
        })
    }
    $scope.getf6_goods()
    // 获取f7_pic广告图片
    $scope.getf7_picAd = function () {
        var url = '/ad-whale-web/dolphin/getAdSource',
            params = {
                pageCode:'HOME',
                adCode:$scope.f7_pic_ad,
                platform:1,
                companyId:$rootScope.companyId
            };
        $rootScope.ajax.get(url,params).then(function (res) {
            if (res.code ==0) {
                $scope.f7_pic = res.data[$scope.f7_pic_ad][0];
            }
        })
    };
    $scope.getf7_picAd()
    //  // 获取f5标题
    $scope.getf7_title = function() {
        var url = '/ad-whale-web/dolphin/getAdSource',
            params = {
                pageCode:'HOME',
                adCode:$scope.f7,
                platform:1,
                companyId:$rootScope.companyId
            };
        $rootScope.ajax.get(url,params).then(function (res) {
            if (res.code ==0) {
                $scope.f7_title = res.data[$scope.f7][0];
            }
        })
    }
    $scope.getf7_title()
    //  // 获取f5商品信息
    $scope.getf7_goods = function() {
        var url = '/ad-whale-web/dolphin/getAdSource',
        params = {
            pageCode:'HOME',
            adCode:$scope.f7_1_recommend_brand,
            platform:1,
            companyId:$rootScope.companyId
        };
        $rootScope.ajax.get(url,params).then(function (res) {
            if (res.code ==0) {
                $scope.f7_goods = res.data[$scope.f7_1_recommend_brand];
            }
        })
    }
    $scope.getf7_goods()
    // 获取f8_pic广告图片
    $scope.getf8_picAd = function () {
        var url = '/ad-whale-web/dolphin/getAdSource',
            params = {
                pageCode:'HOME',
                adCode:$scope.f8_pic_ad,
                platform:1,
                companyId:$rootScope.companyId
            };
        $rootScope.ajax.get(url,params).then(function (res) {
            if (res.code ==0) {
                $scope.f8_pic = res.data[$scope.f8_pic_ad][0];
            }
        })
    };
    $scope.getf8_picAd()
    //  // 获取f5标题
    $scope.getf8_title = function() {
        var url = '/ad-whale-web/dolphin/getAdSource',
            params = {
                pageCode:'HOME',
                adCode:$scope.f8,
                platform:1,
                companyId:$rootScope.companyId
            };
        $rootScope.ajax.get(url,params).then(function (res) {
            if (res.code ==0) {
                $scope.f8_title = res.data[$scope.f8][0];
            }
        })
    }
    $scope.getf8_title()
    //  // 获取f5商品信息
    $scope.getf8_goods = function() {
        var url = '/ad-whale-web/dolphin/getAdSource',
        params = {
            pageCode:'HOME',
            adCode:$scope.f8_1_recommend_brand,
            platform:1,
            companyId:$rootScope.companyId
        };
        $rootScope.ajax.get(url,params).then(function (res) {
            if (res.code ==0) {
                $scope.f8_goods = res.data[$scope.f8_1_recommend_brand];
            }
        })
    }
    $scope.getf8_goods()
    // 获取f9_pic广告图片
    $scope.getf9_picAd = function () {
        var url = '/ad-whale-web/dolphin/getAdSource',
            params = {
                pageCode:'HOME',
                adCode:$scope.f9_pic_ad,
                platform:1,
                companyId:$rootScope.companyId
            };
        $rootScope.ajax.get(url,params).then(function (res) {
            if (res.code ==0) {
                $scope.f9_pic = res.data[$scope.f9_pic_ad][0];
            }
        })
    };
    $scope.getf9_picAd()
    //  // 获取f5标题
    $scope.getf9_title = function() {
        var url = '/ad-whale-web/dolphin/getAdSource',
            params = {
                pageCode:'HOME',
                adCode:$scope.f9,
                platform:1,
                companyId:$rootScope.companyId
            };
        $rootScope.ajax.get(url,params).then(function (res) {
            if (res.code ==0) {
                $scope.f9_title = res.data[$scope.f9][0];
            }
        })
    }
    $scope.getf9_title()
    //  // 获取f5商品信息
    $scope.getf9_goods = function() {
        var url = '/ad-whale-web/dolphin/getAdSource',
        params = {
            pageCode:'HOME',
            adCode:$scope.f9_1_recommend_brand,
            platform:1,
            companyId:$rootScope.companyId
        };
        $rootScope.ajax.get(url,params).then(function (res) {
            if (res.code ==0) {
                $scope.f9_goods = res.data[$scope.f9_1_recommend_brand];
            }
        })
    }
    $scope.getf9_goods()
    // 获取f10_pic广告图片
    $scope.getf10_picAd = function () {
        var url = '/ad-whale-web/dolphin/getAdSource',
            params = {
                pageCode:'HOME',
                adCode:$scope.f10_pic_ad,
                platform:1,
                companyId:$rootScope.companyId
            };
        $rootScope.ajax.get(url,params).then(function (res) {
            if (res.code ==0) {
                $scope.f10_pic = res.data[$scope.f10_pic_ad][0];
            }
        })
    };
    $scope.getf10_picAd()
    //  // 获取f10标题
    $scope.getf10_title = function() {
        var url = '/ad-whale-web/dolphin/getAdSource',
            params = {
                pageCode:'HOME',
                adCode:$scope.f10,
                platform:1,
                companyId:$rootScope.companyId
            };
        $rootScope.ajax.get(url,params).then(function (res) {
            if (res.code ==0) {
                $scope.f10_title = res.data[$scope.f10][0];
            }
        })
    }
    $scope.getf10_title()
    //  // 获取f5商品信息
    $scope.getf10_goods = function() {
        var url = '/ad-whale-web/dolphin/getAdSource',
        params = {
            pageCode:'HOME',
            adCode:$scope.f10_1_recommend_brand,
            platform:1,
            companyId:$rootScope.companyId
        };
        $rootScope.ajax.get(url,params).then(function (res) {
            if (res.code ==0) {
                $scope.f10_goods = res.data[$scope.f10_1_recommend_brand];
            }
        })
    }
    $scope.getf10_goods()
}]);
