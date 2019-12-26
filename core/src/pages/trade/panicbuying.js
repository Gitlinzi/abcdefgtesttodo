/**
 * Created by sindy on 15/11/4.
 */

appControllers.controller("panicbuyingCtrl", ['$log', '$rootScope', '$scope', '$cookieStore', 'commonService', 'categoryService', 'config','$window',
    function($log, $rootScope, $scope, $cookieStore, commonService, categoryService, config,$window) {
    //国际化
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
    //默认省份与迷你购物车
    $rootScope.execute(false);
    $scope.activeNum = 1;

    //抢购时间列表
    $scope.promotionIdNum = ""
    $scope.stateNum = -1;
    $scope.stateChange = function(parNum) {
        $scope.stateNum = parNum;
    }
    $scope.purchaseTimeList = [];
    $scope.isShowLeft = false;
    $scope.isShowRight = false;
    $scope.getTimeList = function() {

        $rootScope.ajax.get('/api/promotion/secondkill/lyfTimeList', {}).then(function (res) {
            if (res.code == 0) {
                scope.lastPrice = res.data.plist; if (res.data.timeList[0].times.length > 5) {
                    $scope.isShowRight = true;
                }
                $scope.purchaseTimeList = res.data.timeList[0].times;
                var promotionId = $scope.promotionIdNum = res.data.timeList[0].times[0].promotionId;
                $scope.purchaseBuy(promotionId);
            }
        })
    }
    $scope.getTimeList()
        //抢购的信息列表
    $scope.purchaseBuyList = [];
    $scope.pageSize = 12;
    $scope.totalProducts = "";
    $scope.promotionId = "";
    $scope.purchaseTotalCount = "";
    $scope.purchaseBuy = function(promotionId) {
            // if (promotionId != $scope.promotionId) {
            //     $scope.isShowLeft = true;
            //     $scope.isShowRight = true;
            // }
            $scope.promotionIdNum = promotionId
            $scope.stateNum = promotionId;
            var url = "/api/promotion/secondkill/lyfKillList";
            var params = {
                promotionId: promotionId,
                pageSize: $scope.pageSize,
                pageNo: 1
            }

            $rootScope.ajax.post(url, params).then(function (res) {
                if (res.code == 0) {
                    // console.log(res);
                    $scope.purchaseTotalCount = res.data.listObj[0].merchantProducts.length;
                    $scope.promotionId = res.data.listObj[0].promotionId;
                    $scope.totalProducts = res.data.listObj[0].merchantProducts.length;
                    $scope.purchaseBuyList = res.data.listObj[0].merchantProducts;
                }
            }, function (res) {

            })
        }
        //滚动加载抢购
    $(window).scroll(function() {
        var scrollTop = $(window).scrollTop();
        var scrollHeight = $(".channel-list-ul").offset().top + $(".channel-list").height();
        var windowHeight = $(window).height();
        if (scrollTop + windowHeight >= scrollHeight) {
            if ($scope.pageSize <= $scope.purchaseTotalCount) {
                $scope.pageSize += 4;
                $scope.purchaseBuy($scope.promotionId)
            }
        }
    })

    //点击左右切换按钮
    $scope.arrowMove = function() {
        // var lis = getClassNames('imgLi', 'li');
        var lis = document.getElementById("thumblist").children;
        var pic = 0;
        $scope.arrowLeftImg = function() {
            if (pic == 0) {
                $scope.isShowRight = true;
                return;
            }
            if (pic == 1) {
                $scope.isShowRight = true;
                $scope.isShowLeft = false;
            }
            pic--;
            var target = -pic * 240;
            var thumblist = document.getElementById("thumblist");
            thumblist.style.transform = "translateX(" + target + "px)";
        }
        $scope.arrowRightImg = function() {
            $scope.isShowLeft = true;
            if (pic === lis.length - 1) {
                return;
            }
            if (pic >= lis.length - 6) {
                $scope.isShowLeft = true;
                $scope.isShowRight = false;
            }
            if (pic >= lis.length - 5) {
                $scope.isShowLeft = true;
                return false;
            }
            pic++;

            var target = -pic * 240;
            var thumblist = document.getElementById("thumblist");
            thumblist.style.transform = "translateX(" + target + "px)";
        }
    }
    $scope.arrowMove();
    //抢购进入商品详情
    $scope.rushTopurchase = function(itemId) {
        location.href = 'item.html?itemId=' + itemId
    }
    //监听子控制器的事件
    $rootScope.$on('updateMiniCartToParent',function () {
        //监听到事件后再广播出去
        $rootScope.$broadcast('updateMiniCart');
    })
    //加入购物车
    $scope.addToCart = function(proBuy) {
        var _sessionId = $cookieStore.get('sessionId')

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
