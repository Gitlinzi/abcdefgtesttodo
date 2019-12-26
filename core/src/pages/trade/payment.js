/**
 * Created by sindy on 15/11/4.
 */
appControllers.controller("paymentCtrl", ['$filter','$log','$cookieStore','$rootScope','$scope','commonService', '$window', 'allUrlApi',function($filter,$log,$cookieStore,$rootScope,$scope,commonService, $window,allUrlApi){
    "use strict"
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
    $scope.baseConfig = {
        orderStatus: $rootScope.switchConfig.orderStatus,
        orderSource: $rootScope.switchConfig.orderSource,
    }
    //默认省份与迷你购物车
    $rootScope.execute(false);
    if ($rootScope.switchConfig.common.showAllGlobalNav) {
        $rootScope.getCartTotal();
    }
    /**
     * 获取订单信息:_getOrderinfo
     */
    var ut = $rootScope.util.getUserToken();
    var urlParams = $rootScope.util.paramsFormat(location.search);
    var oid = urlParams.orderCode;//订单ID
    if(oid.indexOf('.')>=0){
        oid=oid.toString().split('.')[0];
        $scope.fromType=true;
    }
    $scope.oid=oid;
    $scope.merchantOrderinfo = [];
    $scope.paymentButtoms = [];
    $scope.validPayment=false;
    $scope.invalidPayment=false;
    $scope.importantTip = true;
    $scope.checkedWay;//选择的支付方式
    $scope.surplus = false;//控制显示倒计时还是时间段
    $scope.ut = ut;//确认订单提交传入页面form ut

    //检查用户是否登录
    // $rootScope.checkUser();

    //获取支付方式
    $scope._getPayGateway = function () {
        //  CMS platfromId是1，支付是2
        var url =$rootScope.host+ '/checkout/getPayGateway',
            params = {
                companyId:$rootScope.companyId,
                platfromId:2,
                orderCode:oid,
                areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
            };
        $rootScope.ajax.get(url,params).then(function (res) {
            //$log.debug(res);
            if(res.data && res.data.payGatewayList) {
                //res.data.payGatewayList 待接口确认
                $scope.payGatewayList = res.data.commonPayGatewayList.concat(res.data.payGatewayList);
                for(var i = 0;i<$scope.payGatewayList.length;i++){
                    $scope.payGatewayList[i].isSelected = 0;
                }
            }
        })

    }();

    //返回跟踪云可用字符串
    $scope.returnHeimdall = function (data) {
        var str = [];
        for(var i in data) {
            for(var j in data[i].items) {
                str.push({pri:"'+ data[i].items[j].storeMpId +'",prm:'+data[i].items[j].productItemNum+',prp:'+ data[i].items[j].productPriceFinal +'});
            }
        }
        str = JSON.stringify(str);
        return str;
    };

    //选择支付方式
    $scope.choosePayWay = function (way) {
        for(var i = 0;i<$scope.payGatewayList.length;i++){
            $scope.payGatewayList[i].isSelected = 0;
        }
        way.isSelected = 1;
        // $scope.checkedWay.payJumpUrl = $rootScope.host + '/api/cashier/createPay';
        for(var i=0; i<$scope.payGatewayList.length; i++) {
            if($scope.payGatewayList[i].paymentGateway == way.paymentGateway) {
                $scope.payGatewayList[i].checked = true;
                $scope.checkedWay = $scope.payGatewayList[i];
                angular.element('#payWayForm').attr('action', $rootScope.host + '/cashier/createPay');
            }else {
                $scope.payGatewayList[i].checked = false;
            }
        }
        //跟踪云
        try{
            window.eventSupport.emit('heimdallTrack',{
                ev: "7",
                oid: $scope.merchantOrderinfo.orderCode,
                otp: $scope.merchantOrderinfo.paymentAmount,
                sp: $scope.merchantOrderinfo.orderDeliveryFeeAccounting,
                pm: $scope.checkedWay.paymentThirdparty,
                prs: $scope.returnHeimdall($scope.merchantOrderinfo.orders),
                pc: $scope.merchantOrderinfo.paymentAmount
            });
        }catch(err){
            //console.log(err);
        }
        if(way.paymentThirdparty==$scope.i18n('微信支付')){
            angular.element('.wxPayDemo').toggleClass('none');
            angular.element('.payWay').toggleClass('none');
        }
        if(way.paymentThirdparty==$scope.i18n('微信支付')){
            //是微信支付，轮循订单
            clearInterval(timer);
            var num = 0;
            var timer = setInterval(function(){
                num+=2;
                if(num == 300){ //轮询校验微信支付接口成功5分钟
                    clearInterval(timer);
                    $scope.payAgain = {
                        bombShow:true,
                        rightText: $scope.i18n('您的订单未成功支付'),
                        title:'',
                        state:'error',
                        position:'top',
                        buttons: [
                            {
                                name:$scope.i18n('查看订单'),
                                className: 'one-button',
                                callback: function() {
                                    location.href = "/home.html#/orderList";
                                }
                            },
                            {
                                name:$scope.i18n('继续支付'),
                                className: 'two-button',
                                callback: function() { //继续支付再次刷新页面
                                    location.reload();
                                    $scope.payAgain.bombShow = false;
                                }
                            }
                        ],
                        closeCallback:function(){ //关闭弹框再次刷新页面
                            location.reload();
                            $scope.payAgain.bombShow = false;
                        }
                    }
                }
                if($scope.weixinTime){
                    $scope.getOrderLoop($scope.weixinTime);
                }
            },2000);
            var config= {
                method: 'POST',
                url:  $rootScope.host + '/cashier/createPay',
                data: {
                    orderCode: oid,
                    payOrderType:2,
                    companyId: $rootScope.companyId,
                    paymentConfigId:$scope.checkedWay.paymentConfigId,
                    promotionId:$scope.checkedWay.promotionId,
                    returnUrl:$rootScope.home+'/complete.html?orderCode='+oid,
                }
            };
        }else{
            var config= {
                method: 'POST',
                url:  $rootScope.host + '/cashier/createPay',
                data: {
                    orderCode: oid,
                    companyId: $rootScope.companyId,
                    paymentConfigId:$scope.checkedWay.paymentConfigId,
                    promotionId:$scope.checkedWay.promotionId,
                    returnUrl:$rootScope.home+'/complete.html?orderCode='+oid,
                }
            };
        }

        $rootScope.ajax.postFrom($rootScope.host + '/cashier/createPay', config.data).then(function (res) {
            if(res.data != null){
                $scope.weixinCode = res.data.paymentMessage.QRCode;
                $scope.weixinTime = $filter('timeTransferDate')(res.data.paymentMessage.createTimeStamp); //轮询接口初始化微信支付时间戳
                if(res.data.paymentMessage.QRCode){
                    angular.element('#payCode').attr('src',res.data.paymentMessage.QRCode);
                }else{
                    $(res.data.paymentMessage).appendTo('body').submit();
                }
            }
        });
    };
    // 微信支付返回
    $scope.payBack=function () {
        angular.element('.wxPayDemo').toggleClass('none');
        angular.element('.payWay').toggleClass('none');
    };
    //查询订单信息
    $scope._getOrderinfo=function(callback){

        $rootScope.ajax.get(allUrlApi.orderDetail,{
            t: new Date().getTime(),
            orderCode: oid,
        }).then(function (res) {
            if(res.data){
                $scope.merchantOrderinfo = res.data;
                $scope.merchantOrderinfo.nameStr = [];
                if(res.data.orders&&res.data.orders.length>0){
                    angular.forEach(res.data.orders,function(oneName){
                            angular.forEach(oneName.items,function(threeName){
                                $scope.merchantOrderinfo.nameStr.push(threeName.productCname);
                            })
                    })
                }
                if($scope.merchantOrderinfo) {
                    $scope.validPayment=true;
                    if($scope.merchantOrderinfo.orderSource==$scope.baseConfig.orderSource.presell&&$scope.merchantOrderinfo.presell.status == 25){
                        var endTime = $scope.merchantOrderinfo.presell.presellEndTime;
                        var startTime = $scope.merchantOrderinfo.presell.presellStartTime;
                        var nowTime = Date.parse(new Date());
                        if(nowTime>startTime&&nowTime<endTime){
                            $scope.surplus=true;
                            $scope.surplusTime =$filter('timeTransferDate')(startTime)+'-'+$filter('timeTransferDate')(endTime);
                            angular.element(document.getElementById("timer")).text($scope.surplusTime);
                        }else{
                            location.reload();
                        }
                    }else{
                        var dynamicTime=angular.copy($scope.merchantOrderinfo.countDownSeconds);
                        if(decreaseTime) {
                            clearInterval(decreaseTime);
                        }
                        var decreaseTime=setInterval(function(){
                            if(--dynamicTime==0) {
                                clearInterval(decreaseTime);
                                location.reload();
                            }
                            angular.element(document.getElementById("timer")).text($filter('timeFormat')(dynamicTime));
                        },1000);
                    }

                }else{
                    $scope.invalidPayment=true;
                }
                //$log.debug('orderdetai:',res.data);
                if(callback){
                    callback(res);
                }
            }
        });
    };
    $scope._getOrderinfo();

    //微信支付需要轮循订单，已支付状态就跳转，2s
    $scope.getOrderLoop=function(timeStr){
        var config= {
            method: 'POST',
            url:  '/opay-web/queryPayOrder.do ',
            data: {
                orderCode: oid,
                payStatus: 2,
                transDateStart:timeStr
            }
        };

        $rootScope.ajax.postFrom('/opay-web/queryPayOrder.do ',{
            orderCode: oid,
            payStatus: 2,
            transDateStart:timeStr
        }).then(function (res) {
            if(res.data!=null){
                if(res.data[0]&&res.data[0].payStatus == 2){
                    window.location.href=$rootScope.home+'/complete.html?orderCode='+oid;
                }
            }
        });
    };
    // $scope.getOrderLoop();//初始化自调用一下
    /**
     * 订单支付确认
     */
    $scope.confirmPayment = false;
    $scope.checkPayComplete = function () {
        $scope.confirmPayment = false;
        $scope._getOrderinfo(function(res){
            $scope.merchantOrderinfo = res.data;
            //$log.debug('orderdetai:',res.data);
            if($scope.merchantOrderinfo.orderStatus !== $scope.baseConfig.orderStatus.toPay) {
                location.href = 'complete.html?orderCode=' + oid;
                $scope.confirmPaymentComplete = false;
            }else {
                $scope.confirmPaymentComplete = true;
            }
        });
    };
    // 订单详情展开收起
    $scope.detailChange=function () {
        $('.arrow-bottom').toggleClass('trans180');
        $('.payDetail').toggleClass('none')
    };
    //关闭提示语
    $scope.closeImg = function(){
        $scope.importantTip = false;
    }

}]);
