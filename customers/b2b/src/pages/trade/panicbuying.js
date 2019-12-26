/**
 * Created by sindy on 15/11/4.
 */

appControllers.controller("panicbuyingCtrl", ['$log', '$rootScope', '$scope', '$http', '$cookieStore', 'commonService', 'categoryService', 'config', function($log, $rootScope, $scope, $http, $cookieStore, commonService, categoryService, config ) {
    //默认省份与迷你购物车
    $rootScope.execute(false);
    $scope.activeNum = 0;
    $scope.isActiveNum=function(numStatus){
        $scope.activeNum = numStatus;
    }

    //默认省份与小能
    $rootScope.execute(false);
    //抢购时间列表
    $scope.promotionIdNum = "";
    $scope.stateNum = -1;
    $scope.stateChange = function(parNum) {
        $scope.stateNum = parNum;
    }
    $scope.purchaseTimeList = [];
    $scope.isShowLeft = false;
    $scope.isShowRight = false;
    $scope.getTimeList = function() {
        var url = '/api/promotion/secondkill/timeList',
            params = {
                nocache:new Date().getTime(),
            }
        $http.get(url,params).success(function(res) {
            if (res.code == 0 && res.data != null && res.data.timeList != null) {
                angular.forEach(res.data.timeList[0].times,function (val) {
                    //过滤掉过期的
                    if(val.status != 3 && val.timeStr != "00:00"){
                        $scope.purchaseTimeList.push(val);
                    }
                });
                if ($scope.purchaseTimeList.length > 5) {
                    $scope.isShowRight = true;
                }
                // $scope.purchaseTimeList = res.data.timeList[0].times;
                $scope.currentPromotion = $scope.purchaseTimeList[0];
                var promotionId = $scope.promotionIdNum = $scope.purchaseTimeList[0].promotionId;
                $scope.purchaseBuy(promotionId);
            }
        })
    }
    $scope.getTimeList();
    //抢购的信息列表
    $scope.purchaseBuyList = [];
    $scope.pageSize = 12;
    $scope.pageNo = 1;
    $scope.totalProducts = "";
    $scope.promotionId = "";
    $scope.purchaseTotalCount = "";
    $scope.purchaseBuy = function(promotionId) {
        // if (promotionId != $scope.promotionId) {
        //     $scope.isShowLeft = true;
        //     $scope.isShowRight = true;
        // }
        $scope.promotionIdNum = promotionId;
        $scope.stateNum = promotionId;
        var url = "/api/promotion/secondkill/killList";
        var params = {
            promotionId: promotionId,
            pageSize: $scope.pageSize,
            pageNo: $scope.pageNo,
        }
        $http.post(url, params).success(function(res) {
            $scope.purchaseBuyList=[];
            if (res.code == 0) {
                // status==3表示已售罄要过滤掉
                /*res.data.listObj[0].merchantProducts.forEach(function(v,i){
                 if(v.status!=3){
                 $scope.purchaseBuyList.push(v);
                 }
                 })*/
                $scope.purchaseBuyList = res.data.listObj?res.data.listObj[0]:[];
                if( $rootScope.util.paramsFormat().mpId){
                    for(var i = 0;i<$scope.purchaseBuyList.merchantProducts.length;i++){
                        if($scope.purchaseBuyList.merchantProducts[i].mpId == $rootScope.util.paramsFormat().mpId){
                            var temp = $scope.purchaseBuyList.merchantProducts.splice(i, 1);
                            $scope.purchaseBuyList.merchantProducts.unshift(temp[0]);
                            break;
                        }
                    }
                }
                // $scope.purchaseBuyList = {status: 2,merchantProducts:[]};
                // $scope.purchaseBuyList.merchantProducts = [{totalLimit: 1, saleStock: 2},{totalLimit: 3, saleStock: 2},{status: 1},{status: 1}];
                $scope.purchaseTotalCount = (res.data.listObj &&  res.data.listObj[0].merchantProducts) ? res.data.listObj[0].merchantProducts.length: 0;
                $scope.promotionId = (res.data.listObj && res.data.listObj[0]) ? res.data.listObj[0].promotionId: '';
                $scope.totalProducts = angular.copy($scope.purchaseTotalCount);
                // $scope.purchaseBuyList = res.data.listObj[0].merchantProducts;
            }
        }).error(function() {

        })
    }


    //滚动请求数据
    $rootScope.scrollLoading({
         callback : function() {
             if ($scope.pageSize <= $scope.purchaseTotalCount) {
                 $scope.pageSize += 4;
                 $scope.purchaseBuy($scope.promotionId)
             }else{
                 return
             }
         }
     });

    // 滚动加载抢购
    // $(window).scroll(function() {
    //     var scrollTop = $(window).scrollTop();
    //     var scrollHeight = $(".channel-list-ul").offset().top + $(".channel-list").height();
    //     var windowHeight = $(window).height();
    //     if (scrollTop + windowHeight >= scrollHeight) {
    //         if ($scope.pageSize <= $scope.purchaseTotalCount) {
    //             $scope.pageSize += 4;
    //             $scope.purchaseBuy($scope.promotionId)
    //         }
    //     }
    // })

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
    // $scope.rushTopurchase = function(itemId) {
    //     location.href = 'item.html?itemId=' + itemId
    // }
    //监听子控制器的事件
    $rootScope.$on('updateMiniCartToParent',function () {
        //监听到事件后再广播出去
        $rootScope.$broadcast('updateMiniCart');
    })
    //加入购物车
    $scope.addToCart = function(proBuy) {
        var _sessionId = $cookieStore.get('sessionId')
        var config = {
            method: "POST",
            url: $rootScope.host + "/cart/addItem",
            data: {
                mpId: proBuy.mpId,
                num: 1,
                sessionId: _sessionId,
            }
        };
        $http(config).success(function(res) {
            if (res.code == 0) {
                $rootScope.error.checkCode('提示', '加入' + $rootScope.switchConfig.common.allCartBtnName + '成功', {
                    type: 'confirm',
                    ok: function() {
                        location.href = '/cart.html';
                    },
                    btnOKText: '去结算'
                });
                $rootScope.$emit('updateMiniCartToParent');
            } else {
                $rootScope.error.checkCode(res.code, res.message);
            }
        }).error(function(res) {
            $rootScope.error.checkCode(res.code, res.message);
        });
    }

    $scope.toDetail = function (mpId) {
        location.href="/item.html?itemId=" + mpId;
    }
}]);
