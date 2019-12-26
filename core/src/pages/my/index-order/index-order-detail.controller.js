/**
 * Created by Roy on 17/1/5.
 */
angular.module('appControllers').controller('orderDetailCtrl', ["$scope", "$rootScope", "$q", "$cookieStore", "commonService", 'categoryService', "validateService", "Upload", "$state", "$stateParams","$window", "$filter", "allUrlApi",function ($scope, $rootScope, $q, $cookieStore, commonService, categoryService, validateService, Upload, $state, $stateParams,$window,$filter,allUrlApi) {
    //国际化
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
    var vm = $scope,
        _ut = $rootScope.util.getUserToken(),
        apiHost = $rootScope.host,
        companyId = $rootScope.companyId,
        _fnE = $rootScope.error.checkCode;
    if (!_ut) {
        $rootScope.showLoginBox = true;
        return;
    };
    $scope.baseConfig = {
        orderStatus: $rootScope.switchConfig.orderStatus,
        orderSource: $rootScope.switchConfig.orderSource,
        orderType: $rootScope.switchConfig.orderType,
        promotionChannel: $rootScope.switchConfig.promotionChannel
    }
    // 时间组件
    $scope.options1= {
        format:'Y-m-d',
        lang:'zh',
        timepickerScrollbar:false,
        timepicker:false,
        scrollInput:false,
        scrollMonth:false,
        scrollTime:false
    }
    //取消弹框
    $scope.showCancelWindow = {
        isShow: false,
        noCancel: function () {
            var that = this;
            that.isShow = false;
        }
    };
    $scope.orderCode=$stateParams.code;//订单号
    //订单详情页
    $scope.detail = {
        order: null,//订单详情
        approveOrders: {},
        invoiceType: {
            1: $scope.i18n('普通发票'),
            2: $scope.i18n('增值发票')
        },
        invoiceMode: {
            1: $scope.i18n('电子发票'),
            2: $scope.i18n('纸质发票')
        },
        paymentType: {
            3: '货到付款',
            4: '赊账'
        },
        orderBtnList: [],
        parentOrder: null,//补够服务的父类商品
        popIsShow : false,
        unshippedDelivery : [],  // 未发货
        alreadyShipped : [],  // 已发货
        activeTab : 1 ,
        aftersaleGoods : [],
        selectedArr : [],
        allSelectButton : false,
        merchantReceiverMumberList: [], //所有收货人姓名列表
        merchantReceiverAdressList: [], //收货地址列表
        costCenterList: [], //成本中心列表
        merchantInvoiceTitleList: [], //发票抬头列表
        invoiceUrl: '', //审核文件
        invoiceImageUrl: '', //上传文件地址
        proAllNum: 0, //商品总数
        proAllPrice: 0, //商品总价
        orderRemarkUser: '', //订单备注
        currentReviciveNum: null,
        approveList: [], //审批流程列表
        totalOrderDeliveryFee: 0, //总运费
        approveStatus: {

        },
        receiverMobile: '', // 收货人电话
        //获取预计发货时间
        getPredictTime: function(id){
            var that = this
            let zs = that.merchantReceiverAdressList.filter(item=>{
                return item.addressId==id
            })
            let url = 'custom-sbd-web/advEstimeateDeliveryTime/queryFront.do';
            /**
            let params = {
                districtCode:zs[0].regionCode,
                provinceCode:zs[0].provinceCode,
                cityCode:zs[0].cityCode,
            }
             **/
            let params = {
                districtCode: zs[0].regionCode,
                provinceCode: zs[0].provinceCode,
                cityCode: zs[0].cityCode,
            }

            $rootScope.ajax.postJson(url,params).then(res=>{
                if(res.code==0 || res.code==101){

                    if (res.data.orderDeliveryTimeStr) {
                        that.approveOrders.shipmentDate = res.data.orderDeliveryTimeStr;
                    }else{
                        that.approveOrders.shipmentDate = $filter('date')(new Date(+new Date() + 3 * 24 * 60 * 60 * 1000),'yyyy-MM-dd')
                    }

                }else {
                    $rootScope.error.checkCode(res.code, res.data);
                }
            })
        },
        //查询订单详情
        getOrderDetails2: function () {
            var that = this;
            var url = allUrlApi.orderDetail,
                params = {
                    t: new Date().getTime(),
                    orderCode: $scope.orderCode,
                };
            return $rootScope.ajax.get(url, params).then(function (res) {
                if (res.code == 0) {
                    that.order = res.data;
                    that.orderRemarkUser = that.order.orders[0].orderRemarkUser
                    // 获取收货电话
                    $scope.detail.receiverMobile = that.order.receiverPerson.mobile
                    var defaultBtn = [
                        {
                            name: '批量售后',
                            key: 'canBatchAfterSafe',
                            show: that.order.operations.canBatchAfterSafe,
                            className: 'ody-btn-xs-default-plain1',
                            type: 'function'
                        },
                        {
                            name: '付款',
                            key: 'canPay',
                            show: that.order.operations.canPay,
                            className: 'ody-btn-xs-default-plain1',
                            type: 'href',
                            interactiveData: '/payment.html?orderCode='+that.order.orderCode
                        },
                        {//order.presell.status == 10
                            name: '支付定金',
                            key: 'canPayBooking',
                            show: that.order.operations.canPayBooking&&that.order.orderSource==$scope.baseConfig.orderSource.presell&&that.order.presell.status == 10,
                            className: 'ody-btn-xs-default-plain1',
                            type: 'href',
                            interactiveData: '/payment.html?orderCode='+that.order.orderCode
                        },
                        {//order.presell.status == 20 || order.presell.status == 30 || order.presell.status == 25
                            name: '支付尾款',
                            key: 'canPayRemaining',
                            show: that.order.operations.canPayRemaining&&that.order.orderSource==$scope.baseConfig.orderSource.presell&&(that.order.presell.status == 20 || that.order.presell.status == 30 || that.order.presell.status == 25),
                            className: 'ody-btn-xs-default-plain1',
                            type: 'function',
                            interactiveData: ''
                        },
                        {
                            name: '确认收货',
                            key: 'canConfirmReceive',
                            show: that.order.operations.canConfirmReceive,
                            className: 'ody-btn-xs-default-plain1',
                            type: 'function',
                            interactiveData: ''
                        },
                        // {
                        //     name: '评价',
                        //     key: 'canReview',
                        //     show: that.order.operations.canReview,
                        //     className: 'ody-btn-xs-default-plain1',
                        //     type: 'ui-sref',
                        //     interactiveData: 'index_go_comment({code:'+ that.order.orderCode+'})'
                        // },
                        {
                            name: '评价',
                            key: 'canReview',
                            show: that.order.operations.canReview,
                            className: 'ody-btn-xs-default-plain1',
                            type: 'href',
                            interactiveData: '#/goComment?code='+ that.order.orderCode
                        },
                        {
                            name: '提交订单',
                            key: 'canSubmitOrder',
                            show: that.order.operations.canResubmit,
                            className: 'ody-btn-xs-default-plain1',
                            type: 'function',
                            interactiveData: ''
                        },
                        {
                            name: '再次购买',
                            key: 'canRecart',
                            show: that.order.operations.canRecart,
                            className: 'ody-btn-xs-default-plain1',
                            type: 'function',
                            interactiveData: ''
                        },
                        {
                            name: '取消订单',
                            key: 'canCancel',
                            show: that.order.operations.canCancel,
                            className: 'ody-btn-xs-default-plain1 notBright',
                            type: 'function',
                            interactiveData: ''
                        },
                        {
                            name: '删除订单',
                            key: 'canDelete',
                            show: that.order.operations.canDelete,
                            className: 'ody-btn-xs-default-plain1 notBright',
                            type: 'function',
                            interactiveData: ''
                        },
                        {
                            name: '查看交货单',
                            key: 'canShowdevlivery',
                            // show: !that.order.operations.canShowdevlivery,
                            show: that.order.operations.canShowdevlivery,
                            className: 'ody-btn-xs-default-plain1',
                            type: 'href',
                            interactiveData: '#/deliveryOrderList?code=' + that.order.orderCode
                        }
                        // {
                        //     name: '补购服务',
                        //     key: 'canSalesService',
                        //     sortValue: 14,
                        //     show: that.order.operations.canSalesService,
                        //     className: 'ody-btn-xs-default-plain1',
                        //     type: 'ui-sref',
                        //     interactiveData: 'index_orderSubsidy({code:'+that.order.orderCode+'})'
                        // },
                        // {
                        //     name: '补购配件',
                        //     key: 'canBuyComponent',
                        //     sortValue: 15,
                        //     show: that.order.operations.canBuyComponent,
                        //     className: 'ody-btn-xs-default-plain1',
                        //     type: 'url-userpage',
                        //     interactiveData: 'index_orderSubparts({code:'+that.order.orderCode+'})'
                        // },
                    ];
                    if( res.code == 0 && res.data && res.data.orders && res.data.orders.length > 0 ) {
                        for( let i = 0 ; i < res.data.orders.length ; i++ ) {
                            that.totalOrderDeliveryFee = res.data.orders[i].orderDeliveryFee
                            if( res.data.orders[i].items && res.data.orders[i].items.length > 0 ) {
                                for( let k = 0 ; k < res.data.orders[i].items.length ; k++ ) {
                                    that.proAllNum += res.data.orders[i].items[k].productItemNum
                                    that.proAllPrice += res.data.orders[i].items[k].productItemNum*res.data.orders[i].items[k].productPriceFinal
                                    if( res.data.orders[i].items[k].supportedReturnTypes && res.data.orders[i].items[k].supportedReturnTypes.length > 0 ) {
                                        res.data.orders[i].items[k].checked = false;
                                        // itemStatus 1050 为待发货的商品  1010为待支付的商品
                                        if( res.data.orders[i].items[k].itemStatus == 1050 || res.data.orders[i].items[k].itemStatus == 1010 ) {
                                            that.unshippedDelivery.push( res.data.orders[i].items[k] );
                                        } else if( res.data.orders[i].items[k].itemStatus == 1060 || res.data.orders[i].items[k].itemStatus == 1999 || res.data.orders[i].items[k].itemStatus == 1070 ) {
                                            // itemStatus 1060 为已发货的商品  1999为已完成的商品  1070为待评价的商品
                                            that.alreadyShipped.push( res.data.orders[i].items[k] );
                                        }
                                    }
                                }
                            }
                        }
                        if( that.alreadyShipped && that.alreadyShipped.length > 0 ) {
                            that.aftersaleGoods = that.alreadyShipped;
                        } else {
                            that.aftersaleGoods = that.unshippedDelivery;
                        }
                    }
                    if ($rootScope.util.getCookies("showBatchAfterPop")) {
                        if (that.order.operations.canBatchAfterSafe) {
                            $scope.detail.popIsShow = true;
                        }
                        $rootScope.util.delCookie('showBatchAfterPop');
                    }
                    that.orderBtnList = $rootScope.obtionFilterBtns(defaultBtn,that.order.orderStatus,that.order.orderSource, that.order.orderSource==$scope.baseConfig.orderSource.presell?that.order.presell.status: '');
                } else {
                    $rootScope.error.checkCode($scope.i18n('系统异常'), res.message);
                }
            },function (res) {
                $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('获取订单详情异常'));
            })
        },
        // 查询审批订单详情（史泰博ADV订单详情新增字段）
        getApproveOrderDetail: function() {
            var that = this
            let url = '/custom-sbd-web/approvaOrder/queryOrderInfo.do'
            let params = {
                orderCode: $scope.orderCode,
            }
            $rootScope.ajax.postJson(url,params).then(function(res) {
                if (res.code && res.data) {
                    that.approveOrders = res.data 
                    // if (that.approveOrders.approvalStatus == 4) {
                        that.getAllCostName()
                        that.getMerchantReceiverList()
                        that.getMerchantReceiverAdressList()
                        that.getmerchantInvoiceTitleList()
                    // }
                }
            })
        },
        // 编辑商品数量
        decrease: function(e,pro) {
            pro.productItemNum--
            this.calculatePrice()
        },
        increase: function(e,pro) {
            pro.productItemNum++
            this.calculatePrice()
        },
        changeNum: function(e,pro) {
            if (pro.productItemNum <=1) {
                pro.productItemNum = 1
            }
            this.calculatePrice()
        },
        // 计算商品价格
        calculatePrice: function() {
            var that = this
            that.proAllNum = 0
            that.proAllPrice = 0
            angular.forEach(that.order.orders,function(item) {
                angular.forEach(item.items,function(ele) {
                    that.proAllNum += ele.productItemNum
                    that.proAllPrice += ele.productItemNum*ele.productPriceFinal
                })
            })
            
        },
        // 获取当前用户所有的额成本中心
        getAllCostName: function() {
            var that = this
            let url = '/custom-sbd-web/advCostCenter/getCostCenterByUserId.do'
            let params = null
            $rootScope.ajax.postJson(url).then(function(res) {
                if (res.code ==0) {
                    that.costCenterList = res.data
                }
            })
        },
        // 获取收货人列表
        getMerchantReceiverList: function() {
            var that = this
            let url = '/custom-sbd-web/product/getMerchantReceiverList.do'
            let params  = {
                currentPage: 1,
                itemsPerPage: 100
            }
            $rootScope.ajax.postJson(url,params).then(function(res) {
                if (res.code ==0 && res.data) {
                    that.merchantReceiverMumberList = res.data.listObj || []
                }
            })
        }, 
        // 改变收货人
        changeRecieiverName: function(id) {
            var that = this
            angular.forEach(that.merchantReceiverMumberList,function(item) {
                if (item.id == id) {
                    that.currentReviciveNum = item                   
                }
            })
            that.approveOrders.goodReceiverTel = that.currentReviciveNum.telephone
            that.approveOrders.goodReceiverTel2 = that.currentReviciveNum.telephone2
            that.approveOrders.goodReceiverMobile = that.currentReviciveNum.mobile
            this.getMerchantReceiverAdressList()
        },
        // 获取收货地址列表
        getMerchantReceiverAdressList: function() {
            var that = this
            let url = '/custom-sbd-web/product/getReceiverAddressList.do'
            let params = {
                receiverId: that.approveOrders.goodReceiverPersonId
            }
            $rootScope.ajax.postJson(url,params).then(function(res) {
                if (res.code ==0 && res.data) {
                    that.merchantReceiverAdressList = res.data  
                    // 获取到地址列表之后在获取预计发货时间  
                    that.getPredictTime(that.approveOrders.goodReceiverAddressId)
                }
            })
        },
        // 切换收货地址
        changeReciveAdress: function(id) {
            var that = this
            that.getPredictTime(id)
        },
        // 获取发票抬头列表
          //拿到merchantid查询到发票抬头
        getmerchantInvoiceTitleList: function(){
            var that = this
            var url = '/custom-sbd-web/user/getUserDetail.do';
            $rootScope.ajax.postJson(url).then(res=>{
                if(res.code==0){
                    res.data.merchantId
                    var url= '/custom-sbd-web/invoice/getInvoiceConfigPage.do';
                    var params = {
                        merchantId:res.data.merchantId,
                    }
                    $rootScope.ajax.postJson(url,params).then(res=>{
                        if(res.code==0){
                            that.merchantInvoiceTitleList=res.data.listObj;
                        }else{
                            $rootScope.error.checkCode(scope.i18n('提示'),scope.i18n(res.result));
                        }
                    })
                }
            })
        },
        // 上传凭证
        uploadImage:  function () {
            var that = this
            if (!that.invoiceUrl) {
                return;
            }
            Upload.upload({
                url: "/api/fileUpload/putObjectWithForm", //图片上传接口的url
                data: {
                    file: that.invoiceUrl
                }
            }).success(function (res) {
                if (res.code == 0) {
                    that.detail.approveOrders.invoiceUrl = res.data.filePath;
                }
            }).error(function (res) {
            });
        },
        // 获取审批流程信息
        getApproveFlow: function() {
            var that = this
            let url = '/custom-sbd-web/approval/queryApproveFlow.do'
            let params = {
                orderCode: $scope.orderCode
            }
            $rootScope.ajax.postJson(url,params).then(function(res) {
                if(res.code ==0 && res.data) {
                    that.approveList = res.data
                }
            })
        },
        // 选择所有商品优化
        changeAllSelectOpt : function (arrName) {
            if(this.allSelectButton) {
                this.selectedArr = [];
                for( let i = 0 ; i < arrName.length ; i++ ) {
                    arrName[i].checked = true;
                    this.selectedArr.push( arrName[i] );
                }
            } else {
                this.selectedArr = [];
                for( let i = 0 ; i < arrName.length ; i++ ) {
                    arrName[i].checked = false;
                }
            }
        },
        submitSelected : function () {
            var that = this;
            var selectIdArr = [];
            for( let i = 0 ; i < this.selectedArr.length ; i++ ) {
                selectIdArr.push( this.selectedArr[i].storeMpId );
            }
            if( this.selectedArr && this.selectedArr.length > 0 ) {
                location.href = "#/afterSaleApplyNew?applyAfterSale=1&code=" + $scope.orderCode + '&mpId=' + selectIdArr.join(",") + '&length=' + that.aftersaleGoods.length;
            } else {
                _fnE($scope.i18n('提示'),$scope.i18n('请选择要售后的商品'));
            }
        },
        cancerSelected : function () {
            this.popIsShow = false;
            this.allSelectButton = false;
            for( let i = 0 ; i < this.aftersaleGoods.length ; i++ ) {
                this.aftersaleGoods[i].checked = false;
            }
        },
        switchTab : function ( num ) {
            if( num == 1 ) {
                this.activeTab = 1;
                this.aftersaleGoods = this.alreadyShipped
                for( let i = 0 ; i < this.aftersaleGoods.length ; i++ ) {
                    this.aftersaleGoods[i].checked = false;
                }
            } else if ( num == 0) {
                this.activeTab = 0;
                this.aftersaleGoods = this.unshippedDelivery
                for( let i = 0 ; i < this.aftersaleGoods.length ; i++ ) {
                    this.aftersaleGoods[i].checked = false;
                }
            };
            this.selectedArr = [];
            this.allSelectButton = false;
        },
        chooseCheck : function ( item ) {
            if( this.aftersaleGoods == this.alreadyShipped ) {
                if( item.checked ) {
                    this.getPushSelected(item,this.alreadyShipped)
                } else {
                    this.getUnSelected(item,this.alreadyShipped)
                }
            } else if ( this.aftersaleGoods == this.unshippedDelivery ) {
                if( item.checked ) {
                    this.getPushSelected(item,this.unshippedDelivery)
                } else {
                    this.getUnSelected(item,this.unshippedDelivery)
                }
            }
        },
        // 将选中的某个商品推送到数组 selectedArr中
        getPushSelected : function (item,arrName) {
            this.selectedArr.push( item );
            if( this.selectedArr.length == arrName.length ) {
                this.allSelectButton = true;
            } else {
                this.allSelectButton = false;
            }
        },
        //  将选中的某个商品设为不选中
        getUnSelected : function (item,arrName) {
            for( let i = 0; i < this.selectedArr.length ; i++ ) {
                if( this.selectedArr[i].storeMpId == item.storeMpId ) {
                    this.selectedArr.splice( i,1 )
                }
            }
            if( this.selectedArr.length == arrName.length ) {
                this.allSelectButton = true;
            } else {
                this.allSelectButton = false;
            }
        },
        changeAllSelect : function () {
            if( this.aftersaleGoods == this.alreadyShipped ) {
                this.changeAllSelectOpt( this.alreadyShipped );
            } else if ( this.aftersaleGoods == this.unshippedDelivery ) {
                this.changeAllSelectOpt( this.unshippedDelivery );
            }
        },
        clickFunction: function(name) {
            switch(name) {
                case 'canPayRemaining':
                    $scope.orderCommon.payRetainage();
                    break;
                case 'canConfirmReceive':
                    $scope.orderCommon.confirmReceived();
                    break;
                case 'canRecart':
                    $scope.orderCommon.addItemToCart();
                    // $scope.orderCommon.showdevlivery()
                    break;
                case 'canCancel':
                    $scope.orderCommon.cancelOrder();
                    break;
                case 'canDelete':
                    $scope.orderCommon.deleteOrder();
                    break;
                case 'canBatchAfterSafe':
                    $scope.orderCommon.openBatchAfterPop();
                    break;
                case 'canSubmitOrder':
                    $scope.orderCommon.canSubmitOrder()
                    break;
            }
        },
        //初始化操作, 这个方法在页面的ng-init里调用
        init: function () {
            if (!$scope.orderCode) {
                history.back()
            }
            this.getOrderDetails2();
            this.getApproveOrderDetail()
            this.getApproveFlow()
        }
    };

//订单公共操作
    $scope.orderCommon = {
        deliveryOrderCodeList: [],
        currentIndex: 0,
        packageCurrentIndex: 0,
        causes: [],//退款原因列表
        causesShow: false,//展示退款原因列表框
        selectCause: {},//选中退款原因
        orderCode: null,//订单code
        delivery: null,//物流信息
        showDelivery: false,//物流信息弹窗,
        activePackage: null,//当前包裹
        activeDelivery: null,//当前包裹的物流信息
        packages: {},//包裹列表
        selectedCauses: null,//选中取消原因
        defaultOrderCode: null,
        allPackages: [], //交货单中所有包裹
        openBatchAfterPop: function() {
            $scope.detail.popIsShow=true;
        },
        // 查看交货单
        // showdevlivery: function () {
        //     location.href = '/deliveryOrderList?code=1.html'
        // },
        // 重新提交订单
        canSubmitOrder: function() {
            var soItemsList = []
            angular.forEach($scope.detail.order.orders,function(fl){
                angular.forEach(fl.items,function(sl){
                    soItemsList.push({mpId: sl.mpId,productItemNum:sl.productItemNum,productPriceSale:sl.productPriceSale,productPriceFinal:sl.productPriceFinal})
                })
            })
            let url = '/custom-sbd-web/order/updateApproveDetail.do'
            var params = {
                so: {
                orderCode: $scope.orderCode,
                costCenterId: $scope.detail.approveOrders.costCenterId,
                goodReceiverPersonId: $scope.detail.approveOrders.goodReceiverPersonId,
                goodReceiverAddressId: $scope.detail.approveOrders.goodReceiverAddressId,
                expectDeliverDate: $scope.detail.approveOrders.shipmentDate,
                proxyReceiverName: $scope.detail.approveOrders.proxyReceiverName,
                proxyReceiverMobile: $scope.detail.approveOrders.proxyReceiverMobile,
                orderRemarkUser: $scope.detail.orderRemarkUser,
                orderPaymentType: $scope.detail.order.orderPaymentType
                },
                soItems: soItemsList,
                }
            if ($scope.detail.approveOrders.isInvoice == 1) {
                params.soInvoice = {
                    isNeed: 1,
                    invoiceType: $scope.detail.approveOrders.invoiceType,
                    invoiceTitleContent: $scope.detail.approveOrders.invoiceTitleContent,
                    poCode: $scope.detail.approveOrders.poCode,
                    poAmountFax: $scope.detail.approveOrders.poAmountFax,
                    poAmount: $scope.detail.approveOrders.poAmount,
                    fileUrl: $scope.detail.approveOrders.invoiceUrl
                }
            } else {
                params.soInvoice = {
                    isNeed: 0,
                    invoiceType: 0,
                    invoiceTitleContent: '',
                    poCode: null,
                    poAmountFax: null,
                    poAmount: null,
                    fileUrl: null
                }
            }
            $rootScope.ajax.postJson(url,params).then(function(res) {
                if (res.code ==0) {
                    location.href = '/home.html#/orderList'
                }
            })
        },
        //支付尾款
        payRetainage: function () {
            var order = $scope.detail.order,
                presellStatus = $scope.detail.order.presell.status
            if (!order.orderCode) {
                return;
            }
            var params =  {
                platformId: $rootScope.platformId,
                skus: null,
                businessType: 6,
                orderCode : order.orderCode
            };
            var list = [];
            angular.forEach(order.productList,function (val) {
                var sku = {
                    "storeMpId": val.storeMpId,
                    "num": val.num,
                    "isMain": 0,
                };
                list.push(sku);
            });
            params.skus = JSON.stringify(list);
            if(presellStatus == 25){
                localStorage.setItem('quickBuy', JSON.stringify(params));
                location.href = 'settlement.html?q=1';
            }else if(presellStatus == 30){
                location.href = '/payment.html?orderCode='+order.orderCode;
            }
        },
        //打开物流信息窗口
        openDelivery: function (order) {
            console.log(order)
            $scope.orderCommon.deliveryOrderCodeList = order.deliveryCodes
            $scope.orderCommon.getLogisInfo($scope.orderCommon.deliveryOrderCodeList && $scope.orderCommon.deliveryOrderCodeList[0])
            this.packages = order.orders[0].packageList;
            //if(this.activePackage==null)
            this.activePackage = order.orders[0].packageList ? order.orders[0].packageList[0] : {};
            //切换包裹时请求接口获取相关物流信息
            var that = this;
            if (!this.activePackage) {
                return;
            }
            this.activeNumTwo = 0;
            this.defaultOrderCode = order.orderCode;
            // that.getNewOrderMessage(order.orderCode, this.activePackage.packageCode);
            $scope.$watch('orderCommon.showDelivery', function (n, o) {
                if (n) {
                    angular.element('body').css('overflow', 'hidden')
                } else {
                    angular.element('body').css('overflow', 'initial')
                }
            })
        },
        //物流弹框选择的不同的包裹
        changeDelivery: function(idx) {
            this.packageCurrentIndex = idx;
            // this.activePackage = pack;
            // this.getNewOrderMessage(this.defaultOrderCode, this.activePackage.packageCode);
        },
        //对订单操作后重新调接口取值
        dataRefresh: function () {
            $scope.detail.getOrderDetails2();
        },
        //删除订单
        deleteOrder: function (isOK) {
            var that = this,
                orderCode = $scope.detail.order.orderCode;
            if (!orderCode) {
                return;
            }
            if (!isOK) {//还未确认
                $rootScope.error.checkCode($scope.i18n('确认'), $scope.i18n('您确定要删除订单吗') + '?', {
                    type: 'confirm',
                    ok: function () {
                        that.deleteOrder(orderCode, true)
                    }
                })
                return;
            }
            var url = $rootScope.home + allUrlApi.deleteOrder,
                params = {
                    orderCode: orderCode
                };
            $rootScope.ajax.post(url, params).then(function (res) {
                location.href="/home.html#/orderList";
            }, function (res) {
                $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('删除订单异常'));
            })
        },
        //取消订单
        cancelOrder: function (isOK) {
            var that = this;
            var order = $scope.detail.order;
            if (!order) {
                return;
            }
            $scope.order = order;
            $scope.orderCode = order.orderCode;

            if (!isOK) {
                that.getcauses();
                return;
            }
            var url = allUrlApi.orderCancel,
                params = {
                    orderCode: $scope.orderCode,
                    orderCancelReasonId: this.selectedCauses.code,
                    orderCsCancelReason: this.cancelRemark,
                    orderCanceOperateType: 0,
                };
            $rootScope.ajax.postJson(url, params).then(function (res) {
                try {
                    window.eventSupport.emit('heimdallTrack', {
                        ev: "8",
                        otp: order.amount,
                        sp: order.orderDeliveryFee,
                        oid: order.orderCode
                    });
                } catch (err) {
                }
                if (res.code == 0) {
                    //已确认
                    $scope.showCancelWindow.isShow = false;
                    that.dataRefresh();//数据刷新
                }
            }, function (res) {
                $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('取消订单异常'));
            })
        },
        //取消订单原因
        getcauses: function () {
            var that = this;
            $rootScope.getOrderDictionary('ORDER_CANCEL_REASON_NEW', function(data) {
                if (data&&data.length) {
                    angular.forEach(data,function (v, idx) {
                        if (v.category=='ORDER_CANCEL_REASON_NEW' && v.code=='0') {
                            data.splice(idx,1);
                        }
                    });
                    that.causes = data;
                    that.selectedCauses = data[0];
                    $scope.showCancelWindow.isShow = true;
                }
            });
        },
        //确认收货
        confirmReceived: function (isOK) {
            var that = this,
                orderCode = $scope.detail.order.orderCode;
            if (!orderCode) {
                return;
            }
            if (!isOK) {//还未确认
                $rootScope.error.checkCode($scope.i18n('确认'), $scope.i18n('您确定收货吗') + '?', {
                    type: 'confirm',
                    ok: function () {
                        that.confirmReceived(true)
                    }
                })
                return;
            }
            //已确认
            var url = $rootScope.home + allUrlApi.confirmReceived,
                params = {
                    orderCode: orderCode
                };

            $rootScope.ajax.post(url, params).then(function (res) {
                that.dataRefresh();//数据刷新
            }, function (res) {
                $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('确认收货异常'));
            })
        },
        //再次购买， 添加到购物车， 并且mini购物车的数量++
        addItemToCart: function () {
            var skus = [],
                availableProductList = [],
                that = this;
            var params = {
                orderCode: $scope.detail.order.orderCode,
                areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
            };

            $rootScope.ajax.get($rootScope.host + '/my/order/getOrderStockState',params).then(function (res) {
                if (!res.data || res.data.availableProductList.length == 0) {
                    $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('没有可再次购买的有效商品'));
                    return;
                }
                if (res.data && res.data.availableProductList.length > 0) {
                    that.availableProductList = res.data.availableProductList;
                    for(var i=0 ;i < that.availableProductList.length;i++){
                        skus.push({"mpId": that.availableProductList[i].mpId, "num": that.availableProductList[i].num});
                    }
                    $rootScope.ajax.postFrom($rootScope.host + "/cart/addItem",{
                        skus: JSON.stringify(skus),
                        areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
                    }).then(function (res) {
                        if (res.code == 0) {
                            $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('加入') + $scope.i18n($rootScope.switchConfig.common.allCartBtnName) + $scope.i18n('成功'), {
                                type: 'confirm',
                                ok: function () {
                                    location.href = '/cart.html';
                                },
                                btnOKText: $scope.i18n('去') + $scope.i18n($rootScope.switchConfig.common.allCartBtnName)
                            });
                            $rootScope.$emit('updateMiniCartToParent');
                        } else {
                            $rootScope.error.checkCode(res.code, res.message);
                        }
                    },function (err) {
                        $rootScope.error.checkCode(err.code, err.message);
                    });
                }
            })
        },
        // 根据订单获取所有的交货单
        // getAllDeliveryByOrder: function(code) {
        //     var url = '/custom-sbd-web/order/devliverOrderList.do'
        //     var params = {
        //         orderCode: code,
        //         pageNum: 1,
        //         pageSize: 100
        //     }
        //     $rootScope.ajax.postJson(url,params).then(function(res) {
        //         if (res.code ==0 && res.data && res.data.list.length) {
        //             $scope.orderCommon.deliveryOrderCodeList = res.data.list
        //             $scope.orderCommon.getLogisInfo($scope.orderCommon.deliveryOrderCodeList[0].deliverOrderCode)
        //         }
        //     })
        // },
        // 根据发货单号查询物流信息
        getLogisInfo: function(code) {
            var url = '/custom-sbd-web/order/getLogisInfo.do'
            var params = {
                sapObdId: code
                // sapObdId: '4500761173'
            }
            $rootScope.ajax.postJson(url,params).then(function(res) {
                if (res.code == 0 && res.data) {
                    $scope.orderCommon.showDelivery = true;
                    $scope.orderCommon.allPackages = res.data
                } else {
                   $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('暂无物流信息'));
                }
            })
        },
        // 切换交货单查看物流
        swicthDeliVeryOrder: function(item,index) {
            $scope.orderCommon.currentIndex = index
            $scope.orderCommon.packageCurrentIndex = 0
            $scope.orderCommon.getLogisInfo(item)
        }
    }
}]);

