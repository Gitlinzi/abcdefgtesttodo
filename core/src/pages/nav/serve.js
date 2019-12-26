/**
 * Created by sindy on 15/11/4.
 */

appControllers.controller("serveCtrl", ['$log', '$rootScope', '$scope', '$cookieStore', 'commonService', 'categoryService','config','$window',
    function ($log, $rootScope, $scope, $cookieStore, commonService, categoryService,config,$window) {
    //国际化
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
    //默认省份与迷你购物车
    $rootScope.execute();
    $scope.init = function () {
        $scope.afterSaleServiceAd.getAfterSaleServiceAd();
        $scope.valueAddedServiceAd.getValueAddedServiceAd();
        $scope.shoppingSkills.getShoppingSkills();
    };

    $scope.afterSaleServiceAd = {
        saleServiceAd1:{},
        saleServiceAd2:{},
        saleServiceAd3:{},
        saleServiceAd4:{},
        getAfterSaleServiceAd : function () {
            var url = '/ad-whale-web/dolphin/getAdSource',
                that = this,
                params = {
                    platform: 1,
                    pageCode: 'HOME',
                    adCode: 'after_sale_service1,after_sale_service2,after_sale_service3,after_sale_service4',
                    companyId: $rootScope.companyId,
                };
            $rootScope.ajax.get(url, params).then(function (res) {
                if(res.code == 0 && !$.isEmptyObject(res.data)){
                    if(!$.isEmptyObject(res.data.after_sale_service1)){
                        that.saleServiceAd1 = res.data.after_sale_service1[0];
                    }
                    if(!$.isEmptyObject(res.data.after_sale_service2)){
                        that.saleServiceAd2 = res.data.after_sale_service2[0];
                    }
                    if(!$.isEmptyObject(res.data.after_sale_service3)){
                        that.saleServiceAd3 = res.data.after_sale_service3[0];
                    }
                    if(!$.isEmptyObject(res.data.after_sale_service4)){
                        that.saleServiceAd4 = res.data.after_sale_service4[0];
                    }
                }
            })
        }
    };
    $scope.valueAddedServiceAd = {
        serviceAd1:{},
        serviceAd2:{},
        serviceAd3:{},
        serviceAd4:{},
        getValueAddedServiceAd : function () {
            var url = '/ad-whale-web/dolphin/getAdSource',
                that = this,
                params = {
                    platform: 1,
                    pageCode: 'HOME',
                    adCode: 'value_added_service1,value_added_service2,value_added_service3,value_added_service4',
                    companyId: $rootScope.companyId,
                };
            $rootScope.ajax.get(url, params).then(function (res) {
                if(res.code == 0 && !$.isEmptyObject(res.data)){
                    if(!$.isEmptyObject(res.data.value_added_service1)){
                        that.serviceAd1 = res.data.value_added_service1[0];
                    }
                    if(!$.isEmptyObject(res.data.value_added_service2)){
                        that.serviceAd2 = res.data.value_added_service2[0];
                    }
                    if(!$.isEmptyObject(res.data.value_added_service3)){
                        that.serviceAd3 = res.data.value_added_service3[0];
                    }
                    if(!$.isEmptyObject(res.data.value_added_service4)){
                        that.serviceAd4 = res.data.value_added_service4[0];
                    }
                }
            })
        }
    };

    $scope.shoppingSkills = {
        skillsAd1:{},
        skillsAd2:{},
        getShoppingSkills:function () {
            var url = '/ad-whale-web/dolphin/getAdSource',
                that = this,
                params = {
                    platform: 1,
                    pageCode: 'HOME',
                    adCode: 'service_cms',
                    companyId: $rootScope.companyId,
                };
            $rootScope.ajax.get(url, params).then(function (res) {
                if(res.code == 0 && !$.isEmptyObject(res.data.service_cms)){
                    that.skillsAd1 = res.data.service_cms[0];
                    that.skillsAd2 = res.data.service_cms[1];
                }
            })
        }
    }
}]);
