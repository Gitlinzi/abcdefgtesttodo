/**
 * Created by Roy on 15/10/23.
 */
appControllers.controller("confirmationCtrl", ['$log', '$rootScope', '$scope', '$cookieStore','commonService','config', 'Upload',function ($log, $rootScope, $scope, $cookieStore,commonService,config,Upload) {
        "use strict"
    //获取订单信息
    var oid = location.search.split('?')[1];//订单ID
    var ut = $rootScope.util.getUserToken();
    var _fnE = $rootScope.error.checkCode; //错误提示信息
    if ($rootScope.switchConfig.common.showAllGlobalNav) {
        $rootScope.getCartTotal();
    }
    $scope.reload = function () {
        location.reload();
    }
    // 弹框需要的数据
    $scope.bombBox = {
        settleShow : false,
        settleTips: '请确认订单信息无误，确认订单后将无法再修改',
        buttons: [
            {
                name : '确定',
                callback : function() {
                    var url = '/back-order-web/restful/cgorder/confirmH5Order.do';
                    var params = {
                        orderCode : oid
                    };
                    $rootScope.ajax.post(url,params).then(function(res) {
                        if( res.code == 0 ) {
                            if( res.data.orderPaymentType  == 1 && res.data.orderPaymentStatus != 3 ) {
                                window.location = "payment.html?orderCode=" + oid;
                            } else if ( res.data.orderPaymentType  == 2 || res.data.orderPaymentType  == 301 ) {
                                window.location = "complete.html?" + oid;
                            } else if( res.data.orderPaymentType  == 1 && res.data.orderPaymentStatus == 3 ) {
                                window.location = "complete.html?" + oid;
                            }
                        } else {
                            _fnE('提示',res.data);
                        }
                    })
                }
            },
            {
                name : '取消',
                callback : function() {
                    $scope.bombBox.settleShow = false;
                }
            }
        ]
    };
    // 确认订单按钮
    $scope.sureOrder = function() {
        $scope.bombBox.settleShow = true;
    }
    //获取订单信息
    $scope.getOrderMessage = function() {
        var url = '/back-order-web/restful/cgorder/confirmOrderList.do';
        var params = {
            orderCode : oid,
        };
        $rootScope.ajax.post(url,params).then(function(res) {
            if( res.code == 0 ) {
                $scope.orderMesData = res.data;
                $scope.orderCodeData = res.data.orderItemList;
            }
        })
    }
    $scope.getOrderMessage();
}]);

