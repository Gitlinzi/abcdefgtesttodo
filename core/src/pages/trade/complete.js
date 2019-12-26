/**
 * Created by sindy on 15/11/4.
 */

appControllers.controller("completeCtrl", ['$filter','$log','$cookieStore','$rootScope','$scope','commonService', '$window', 'allUrlApi',function($filter,$log,$cookieStore,$rootScope,$scope,commonService, $window,allUrlApi){
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
    $scope.baseConfig = {
        orderSource: $rootScope.switchConfig.orderSource,
    }
    //默认省份与迷你购物车
    $rootScope.execute(false);
    if ($rootScope.switchConfig.common.showAllGlobalNav) {
        $rootScope.getCartTotal();
    }
    var ut=$rootScope.util.getUserToken();
    // var oid = location.search.split('?')[1];
    var oid = $rootScope.util.paramsFormat(location.href).orderCode; //订单ID
    $scope.isPunchout = $rootScope.util.paramsFormat(location.href).punchout //punchout订单

    $scope.detail = {};

    if ($scope.isPunchout) {
        var punchoutData = $rootScope.util.getLocalItem('punchout')
        $scope.money =  punchoutData.amount
        $scope.detail.nameStr =  punchoutData.itemList
    }

    //查询订单信息
    $scope._getOrderinfo=function(callback){
        $rootScope.ajax.get(allUrlApi.orderDetail,{
            t: new Date().getTime(),
            orderCode: oid,
        }).then(function (res) {
            if(res.code==0){
                $scope.detail = res.data;
                $scope.detail.nameStr = [];
                if(res.data.orders&&res.data.orders.length>0){
                    angular.forEach(res.data.orders,function(oneName){
                        angular.forEach(oneName.items,function(threeName){
                            $scope.detail.nameStr.push(threeName.productCname);
                        })
                    })
                }
             }
        });
    }
    
    //支付金额需要单独调用支付接口
    $scope.getOrderLoop=function(){

        $rootScope.ajax.postFrom('/opay-web/queryPayOrder.do ',{
            orderCode: oid,
            payStatus: 2,
            // transDateStart:timeStr
        }).then(function (res) {
            if(res.data!=null){
                if(res.data[0]&&res.data[0].payStatus == 2){
                    //支付的实际金额
                    // $scope.money = res.data[0].money;
                    // $rootScope.addXiaoNeng($rootScope.sessionId,$scope.money,oid);
                } else {
                    // $rootScope.addXiaoNeng($rootScope.sessionId,0,oid);
                }
            }
        });
    };
    
    // 获取订单详情接口
    $scope.getOrderDetail = function() {
        let url = '/oms-api/order/so/getOrderDetailByCode'
        let params = {
            orderCode: oid,
        }
        $rootScope.ajax.get(url,params).then(function(res) {
            if (res.code == 0) {
                $scope.money = res.data.currentPaymentAmount
            } 
        })
    }

    if (oid) {
        $scope._getOrderinfo();
        $scope.getOrderLoop();//初始化自调用一下
        $scope.getOrderDetail()
    }
    
}]);
