/**
 * Created by sindy on 15/11/4.
 */

appControllers.controller("iflashbuyCtrl", ['$log', '$rootScope', '$scope', '$cookieStore', 'commonService', 'categoryService', 'config','$window',
    function($log, $rootScope, $scope, $cookieStore, commonService, categoryService, config,$window) {
    //国际化
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
    //默认省份与迷你购物车
    $rootScope.execute(false);
    $scope.activeNum = 1;

        //今日闪购与明日预告
    $scope.buyList = [];
    $scope.paramsNum = 0;
    $scope.itemsPerPage = 6;
    $scope.buyTotalCount = ""
    $scope.todayBuy = function(todayPar) { //今日
        $scope.activeNum = 1;
        $scope.paramsNum = 0;
        $scope.requestData(todayPar)
    }
    $scope.tomorrowBuy = function(tomorrowPar) { //明日
        $scope.activeNum = 2;
        $scope.paramsNum = 1;
        $scope.requestData(tomorrowPar)
    }
    $scope.requestData = function(paramsNum) {

        var url = $rootScope.host + 'promotion/secondkill/lyfList',
            params = {
            promotionType: 1, //促销类型 0秒杀 1闪购
            timeType: paramsNum, //0今日 1明日
            itemsPerPage: $scope.itemsPerPage
        };

        $rootScope.ajax.get(url,params).then(function (res) {
            if (res.code == 0) {
                // console.log(res)
                $scope.buyTotalCount = res.data.length;
                $scope.buyList = res.data
            }
        },function(){

        })

    }


    $scope.todayBuy($scope.paramsNum)

    //今日闪购进入商品详情页
    $scope.todayBuyToDetails = function(itemId) {
            location.href = 'item.html?itemId=' + itemId
        }
        //明日预告进入详情页；
    $scope.tmorrowBuyToDetails = function(itemId) {
            location.href = 'item.html?itemId=' + itemId
        }
        //闪购
    $(window).scroll(function() {
        var scrollTop = $(window).scrollTop() + $(window).height();
        var windowHeight = $(window).height();
        var scrollHeight = $(".flashSales-list-ul").offset().top + $(".flashSales-list").height();
        if (scrollTop + windowHeight >= scrollHeight) {
            if ($scope.itemsPerPage <= $scope.buyTotalCount) {
                $scope.itemsPerPage += 4;
                $scope.requestData($scope.paramsNum);
            }
        }
    })
    //监听子控制器的事件
    $rootScope.$on('updateMiniCartToParent',function () {
        //监听到事件后再广播出去
        $rootScope.$broadcast('updateMiniCart');
    })

        //加入购物车
    $scope.addCart = function(proBuy) {
        var _sessionId = $cookieStore.get('sessionId')
        var config = {
            method: "POST",
            url: $rootScope.host + "/cart/addItem",
            data: {
                mpId: proBuy.mpId,
                num: 1,
                sessionId: _sessionId,
                areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
            }
        };

        $rootScope.ajax.postFrom($rootScope.host + "/cart/addItem",{
            mpId: proBuy.mpId,
            num: 1,
            sessionId: _sessionId,
            areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
        }).then(function (res) {
            if (res.code == 0) {
                $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('加入') + $scope.i18n($rootScope.switchConfig.common.allCartBtnName) + $scope.i18n('成功'), {
                    type: 'confirm',
                    ok: function() {
                        location.href = '/cart.html';
                    },
                    btnOKText: $scope.i18n('去结算')
                });
                $rootScope.$emit('updateMiniCartToParent');
            } else {
                $rootScope.error.checkCode(res.code, res.message);
            }
        },function(res){
            $rootScope.error.checkCode(res.code, res.message);
        });
    }
}]);
