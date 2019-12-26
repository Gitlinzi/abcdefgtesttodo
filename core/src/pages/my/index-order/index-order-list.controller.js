/**
 * Created by Roy on 17/1/5.
 */
angular.module('appControllers').controller('orderCtrl', ["$scope", "$rootScope", "$q", "$cookieStore", "commonService", 'categoryService', "validateService", "Upload", "$state", "$stateParams","$window", "$filter", "allUrlApi","$timeout",function ($scope, $rootScope, $q, $cookieStore, commonService, categoryService, validateService, Upload, $state, $stateParams,$window,$filter, allUrlApi,$timeout) {
    //国际化
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
    var _ut = $rootScope.util.getUserToken();
    var _fnP = $rootScope.ajax.post,
        _fnG = $rootScope.ajax.get,
        _fnE = $rootScope.error.checkCode,
        _host = $rootScope.host,
        _home = $rootScope.home,
        _cid = $rootScope.companyId;
    $scope.baseConfig = {
        orderStatus: $rootScope.switchConfig.orderStatus,
        orderSource: $rootScope.switchConfig.orderSource,
        orderType: $rootScope.switchConfig.orderType,
        promotionChannel: $rootScope.switchConfig.promotionChannel
    }
    //初始化翻页, 切换tab的时候也会初始化分页
    $scope.initPagination = function () {
        $scope.pageNo = 1;
        $scope.pageSize = 10;
        $scope.totalCount = 0;
    };

    $scope.getUserDetailInfo = function () {
        var url = "/custom-sbd-web/user/getUserDetail.do";
        $rootScope.ajax.postJson(url).then(function (res) {
            if (res.code == 0) {
                $scope.userIsAdmin = res.data.userIsAdmin == 1 ? 1 : 0;
                $rootScope.userRelationType=res.data.userRelationType;
                $rootScope.userRelationId=res.data.userRelationId;
            }
        });
    };
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
    $scope.options2= {
        format:'Y-m-d',
        lang:'zh',
        timepickerScrollbar:false,
        timepicker:false,
        scrollInput:false,
        scrollMonth:false,
        scrollTime:false
    };
    if (!_ut) {
        $rootScope.showLoginBox = true;
        return;
    };
    //公共参数
    var vm = $scope;
    //取消弹框
    $scope.showCancelWindow = {
        isShow: false,
        noCancel: function () {
            var that = this;
            that.isShow = false;
        }
    };

    //取消退款弹框
    $scope.showRefundWindow = {
        isShow2: false,
        noRefund: function () {
            var that = this;
            that.isShow2 = false;
        }
    };

//翻页广播接收
    $scope.$on('changePageNo', function (event, data) {
        "use strict";
        $scope.pageNo = data;
        $scope.orders.getOrders();
    })

    //获取退货的跟踪云数据
    $scope.getHeimdallParams = function (suborder) {
        let idArr = [];
        let numArr = [];
        let prod;

        for (let i = 0; i < suborder.productList.length; i++) {
            prod = suborder.productList[i];
            idArr.push(prod.storeMpId);
            numArr.push(prod.num);
        }
        var heimdallParam = {
            ev: "9",//退款售後
            oid: suborder.orderCode,
            pri: idArr.join(','),
            prm: numArr.join(',')
        }

        return heimdallParam;
        // $('#heimdall_el').attr('heimdall_productid', idArr.join(','));
        // $('#heimdall_el').attr('heimdall_productnum', numArr.join(','));
        // $('#heimdall_el').click();
    },

//订单列表页
    $scope.orders = {
        accountSummary: {},//用户概况
        userInfo: {},//用户信息
        list: null,//订单列表
        childList: [],//子订单
        summary: {},//订单各状态数量
        isShowPage: false,//是否展示分页
        isShowIcon: false,//是否展示icon
        keyword: '',
        sysSource: [],//订单来源
        orderType: [],//订单类型
        selectedSource: '',
        selectedOrderType: {},
        searchOrderCode: '',
        searchOrderName: '',
        searchOrderStatus: '',
        searchOrderOwner: '',
        createTimeStart: '',
        searchCostCenter: '',//成本中心
        createTimeEnd: '',
        merchantReceiverMumberList: [],
        searchFlag: false,
        exportOrderAdmin: 0,
        exportOrderDetailAdmin: 0,
        // downloadFileByGet: function() {
        //     let url = '/oms-api/orderExport/export.do' 
        //     let params = {
        //         flag: "fpsckr",
        //         deleteStatus: 0,
        //     }
        //     $rootScope.ajax.postJson(url,params).then(function() {

        //     })
        // },
        // 获取导出订单的权限
        getOrderAdmin: function() {
            var that = this
            let url = '/oms-api/orderExport/exportPermissions.do'
            let params = {}
            $rootScope.ajax.get(url,params).then(function(res) {
                if (res.code ==0) {
                    that.exportOrderAdmin = res.data.exportOrderPermissions || 0
                    that.exportOrderDetailAdmin = res.data.exportOrderDetailPermissions || 0
                }
            })
        },
        // 导出订单
        downloadFileByGet: function(params = {}, fileName = 'fileName.xlsx',flag) {

            var leg = $rootScope.host.length
            leg = leg - 4
            var baseUrl = $rootScope.host.slice(0,leg)
            if (flag) {
                var url = baseUrl + '/oms-api/orderExport/exportDetail.do'
            } else {
                var url = baseUrl + '/oms-api/orderExport/export.do'   
            }
            url += '?query.deleteStatus=0&query.flag=fpsckr'
            if ($scope.approveStatus || $scope.approveStatus === 0) {
                url += '&query.approvalStatus=' + $scope.approveStatus
            } else if($scope.activeNum) {
                url += '&query.orderStatus=' + $scope.activeNum
            }    
            const downloadUrl = url
            try {
              const a = document.createElement('a')
              a.setAttribute('href', downloadUrl)
              a.setAttribute('download', fileName)
              a.click()
            } catch (ex) {
            // 定义一个form表单,通过form表单来发送请求
              $('<form>')
                .attr('style', 'display:none')
                .attr('method', 'post')
                .attr('action', downloadUrl)
                .appendTo('body')
                .submit()// 表单提交
            }
          },
        // 根据条件查询订单
        getOrderList: function() {
            this.searchFlag = true;
            $scope.pageNo = 1;
            $scope.orders.getOrders();
        },
        // 重置查询条件
        resetInfo: function() {
            this.searchFlag = false;
            $scope.orders.searchOrderCode = ''
            $scope.orders.searchCostCenter = ''
            $scope.orders.searchOrderOwner = ''
            $scope.orders.createTimeStart = ''
            $scope.orders.createTimeEnd = ''
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
        clickFunction: function(name, order) {
            switch(name) {
                case 'canPayRemaining':
                    $scope.orderCommon.payRetainage(order);
                    break;
                case 'canConfirmReceive':
                    $scope.orderCommon.confirmReceived(order.orderCode);
                    break;
                case 'canRecart':
                    $scope.orderCommon.addItemToCart(order.orderCode);
                    break;
                case 'canCancel':
                    $scope.orderCommon.cancelOrder(order);
                    break;
                case 'canBatchAfterSafe':
                    $scope.orderCommon.openListBatchAfterPop(order.orderCode);
                    break;
            }
        },
        //获取用户概况
        getAccountSummary: function () {
            "use strict";
            var url = _host + '/my/accountSummary',
                params = {
                },
                that = this;
            _fnG(url, params)
                .then(function (result) {
                    that.accountSummary = result.data;
                });
        },
        //获取订单各状态数量
        getSummary: function () {
            "use strict";
            var url = _home + allUrlApi.orderSummary,
                params = {
                  orderStatus: "",
                  orderType: "",
                  sysSource: ""
                },
                that = this;
            $rootScope.ajax.postJson(url, params).then(function (res) {
                that.summary = res.data;
            })
        },
        //获取订单
        getOrders: function () {
            var  that = this;
            var params = {
                deleteStatus: 0,
                currentPage: $scope.pageNo,
                itemsPerPage: $scope.pageSize,
                // itemsPerPage: 2,
                flag: "fpsckr"
            };
            if($scope.approveStatus || $scope.approveStatus === 0) {
                params.approvalStatus = $scope.approveStatus
            } else if($scope.activeNum) {
                params.orderStatus = $scope.activeNum;
            }
            if ($scope.orders.searchFlag) {
                if ($scope.orders.searchOrderCode) {
                    params.orderCode  = $scope.orders.searchOrderCode
                }
                if ($scope.orders.searchCostCenter) {
                    params.costName  = $scope.orders.searchCostCenter
                }
                if ($scope.orders.searchOrderOwner) {
                    params.goodReceiverPersonId  = $scope.orders.searchOrderOwner
                }
                if ($scope.orders.createTimeStart) {
                    params.createTimeStart = $scope.orders.createTimeStart
                }
                if ($scope.orders.createTimeEnd) {
                    params.createTimeEnd = $scope.orders.createTimeEnd
                }                
            }
            //前台待评价对应后台的已签收状态，所以需要增加canReview字段判断是后台订单是否已评价
            //前台待评价 == 后台已签收，且还未评价的订单
            // DDX-9123	Medium	【产品化2.4 test】订单评价之后仍是待评价状态
            if($scope.activeNum == $scope.baseConfig.orderStatus.received){
                //0未评价 1已评价 2已评价或者追评"
                params.commentStatus =  0;
            }
            // if (that.keyword){
            //     params.frontKeyword = that.keyword;
            // }
            $rootScope.ajax.postJson($rootScope.home + allUrlApi.orderList, params).then(function (res) {
                that.list = [];
                if (res.code == 0 || res.code === '0') {

                    $scope.totalCount = res.total;
                    $scope.totalPage = $scope.totalCount % $scope.pageSize == 0 ? (($scope.totalCount / $scope.pageSize) || 1) : parseInt($scope.totalCount / $scope.pageSize) + 1;
                    // $scope.totalPage = $scope.totalCount % 2 == 0 ? (($scope.totalCount / 2) || 1) : parseInt($scope.totalCount / 2) + 1;
                    if (res.data && res.data.length > 0) {
                        angular.forEach(res.data,function (v) {
                            v.delete = false;
                            v.itemList = [];
                            //删除和物流不属于列表按钮
                            var defaultBtn = [
                                {
                                    name: '批量售后',
                                    key: 'canBatchAfterSafe',
                                    show: v.operations.canBatchAfterSafe,
                                    className: 'ody-btn-xs-default-plain1',
                                    type: 'function'
                                },
                                {
                                    name: '付款',
                                    key: 'canPay',
                                    show: v.operations.canPay,
                                    className: 'ody-btn-xs-default-plain1',
                                    type: 'href',
                                    interactiveData: '/payment.html?orderCode='+v.orderCode
                                },
                                {//order.presell.status == 10
                                    name: '支付定金',
                                    key: 'canPayBooking',
                                    show: v.operations.canPayBooking&&v.orderSource==$scope.baseConfig.orderSource.presell&&v.presell.status == 10,
                                    className: 'ody-btn-xs-default-plain1',
                                    type: 'href',
                                    interactiveData: '/payment.html?orderCode='+v.orderCode
                                },
                                {//order.presell.status == 20 || order.presell.status == 30 || order.presell.status == 25
                                    name: '支付尾款',
                                    key: 'canPayRemaining',
                                    show: v.operations.canPayRemaining&&v.orderSource==$scope.baseConfig.orderSource.presell&&(v.presell.status == 20 || v.presell.status == 30 || v.presell.status == 25),
                                    className: 'ody-btn-xs-default-plain1',
                                    type: 'function',
                                    interactiveData: ''
                                },
                                {
                                    name: '确认收货',
                                    key: 'canConfirmReceive',
                                    show: v.operations.canConfirmReceive,
                                    className: 'ody-btn-xs-default-plain1',
                                    type: 'function',
                                    interactiveData: ''
                                },
                                // {
                                //     name: '评价',
                                //     key: 'canReview',
                                //     show: v.operations.canReview,
                                //     className: 'ody-btn-xs-default-plain1',
                                //     type: 'ui-sref',
                                //     interactiveData: 'index_go_comment({code:'+ v.orderCode+'})'
                                // },
                                {
                                    name: '评价',
                                    key: 'canReview',
                                    show: v.operations.canReview,
                                    className: 'ody-btn-xs-default-plain1',
                                    type: 'href',
                                    interactiveData: '#/goComment?code='+ v.orderCode
                                },
                                {
                                    name: '再次购买',
                                    key: 'canRecart',
                                    show: v.operations.canRecart,
                                    className: 'ody-btn-xs-default-plain1',
                                    type: 'function',
                                    interactiveData: ''
                                },
                                {
                                    name: '取消订单',
                                    key: 'canCancel',
                                    show: v.operations.canCancel,
                                    className: 'ody-btn-xs-default-plain1 notBright',
                                    type: 'function',
                                    interactiveData: ''
                                },
                                {
                                    name: '查看交货单',
                                    key: 'canShowdevlivery',
                                    show: v.operations.canShowdevlivery,
                                    // show: v.operations.canRecart,
                                    className: 'ody-btn-xs-default-plain1',
                                    type: 'href',
                                    interactiveData: '#/deliveryOrderList?code=' + v.orderCode
                                }
                                // {
                                //     name: '补购服务',
                                //     key: 'canSalesService',
                                //     sortValue: 14,
                                //     show: v.operations.canSalesService,
                                //     className: 'ody-btn-xs-default-plain1',
                                //     type: 'ui-sref',
                                //     interactiveData: 'index_orderSubsidy({code:'+v.orderCode+'})'
                                // },
                                // {
                                //     name: '补购配件',
                                //     key: 'canBuyComponent',
                                //     sortValue: 15,
                                //     show: v.operations.canBuyComponent,
                                //     className: 'ody-btn-xs-default-plain1',
                                //     type: 'url-userpage',
                                //     interactiveData: 'index_orderSubparts({code:'+v.orderCode+'})'
                                // },
                            ];
                            v.orderBtnList = $rootScope.obtionFilterBtns(defaultBtn,v.orderStatus,v.orderSource, v.orderSource==$scope.baseConfig.orderSource.presell?v.presell.status: '');
                            angular.forEach(v.orders,function (order) {
                                angular.forEach(order.items,function (item) {
                                    v.itemList.push(item);
                                })
                            })
                        });
                        that.list = res.data;
                        that.isShowPage = true;
                        that.isShowIcon = false;
                    } else{
                        that.isShowPage = false;
                        that.isShowIcon = true;
                    }
                } else {
                    that.isShowPage = false;
                    that.isShowIcon = true;
                    _fnE(res.code, res.message);
                }
            },function (result) {
                _fnE($scope.i18n('提示'), $scope.i18n('获取订单异常'));
            });
        },
        //订单来源， 以后可能读接口
        getSysSource: function () {
            var that = this;
            that.sysSource = [
                {
                    "key": "selfSupport",
                    "value": $scope.i18n($rootScope.switchConfig.common.companyName) + $scope.i18n('官方商城')

                },
                {
                    "key": "thirdParty",
                    "value": $scope.i18n('天猫京东其他')
                }
            ];
            that.selectedSource = that.sysSource[0];
        },
        //订单类型， 以后可能读接口
        getOrderType: function () {
            var that = this;
            that.orderType = [
                {
                    "key": "",
                    "value": $scope.i18n('全部')
                },
                {
                    "key": 0,
                    "value": $scope.i18n('普通订单')
                },
                {
                    "key": 2,
                    "value": $scope.i18n('服务订单')
                }
            ];
            that.selectedOrderType = that.orderType[0];
        },
        //初始化操作, 这个方法在页面的ng-init里调用
        init: function (activeNum) {
            "use strict";
            var that = this;
            if (!activeNum) {
                if (!$stateParams.activeNum) {
                    activeNum = '';
                } else {
                    activeNum = angular.copy($stateParams.activeNum);
                }
            }
            $scope.activeNum = activeNum;
            // that.getOrderType();//初始化订单来源
            // that.getSysSource();//初始化订单类型
            that.isShowPage = false;
            that.isShowIcon = false;
            $scope.initPagination();//初始化翻页
            $scope.getUserDetailInfo();
            that.getSummary();//所有状态订单数目
            that.getOrders();//获取所有订单
            that.getOrderAdmin()
        }
    };
    $scope.orders.getMerchantReceiverList()
    $scope.changeActiveNum = function(num,examine) {
        $scope.activeNum = num;
        if(examine) {
            $scope.approveStatus = num
        }
        if (!num && num !== 0) {
            $scope.approveStatus = ''
        }
        if(num > 5) {
            $scope.approveStatus = ''
        }
        if (num == 5) {
            $scope.approveStatus = 0
        }
        $scope.orders.isShowPage = false;
        $scope.orders.isShowIcon = false;
        $scope.initPagination();//初始化翻页
        $scope.orders.getSummary();//所有状态订单数目
        $scope.orders.getOrders();//获取所有订单
    }
    //订单公共操作
    $scope.orderCommon = {
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
        deliveryOrderCodeList: [],
        currentIndex: 0,
        packageCurrentIndex: 0,
        allPackages: [], //交货单中所有包裹
        openListBatchAfterPop: function(orderCode) {
            $rootScope.util.setCookie( "showBatchAfterPop",true,90);
            $timeout(function() {
                location.href = '#/orderDetail?code=' + orderCode;
            },20)
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
        },
        //打开物流信息窗口
        openDelivery: function (order) {
            "use strict";
            $scope.orderCommon.deliveryOrderCodeList = order.deliveryCodes
            $scope.orderCommon.getLogisInfo($scope.orderCommon.deliveryOrderCodeList[0])
            console.log(order)
            this.packages = order.orders[0].packageList;
            //if(this.activePackage==null)
            this.activePackage = order.orders[0].packageList[0];
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
            this.packageCurrentIndex = idx
        },
        //查询物流信息
        getNewOrderMessage: function (orderCode, packageCode) {
            var url = _home + allUrlApi.newOrderMessage,
                params = {
                    orderCode: orderCode,
                    packageCode: packageCode
                }, that = this;
            _fnP(url, params).then(function (res) {
                // that.showDelivery = true;
                that.delivery = that.delivery || {};
                that.delivery[packageCode] = res.data;
                that.activeDelivery = that.delivery[packageCode];
            }, function (res) {
                _fnE($scope.i18n('系统异常'), $scope.i18n('查询物流信息异常'));
            });
        },
        //对订单操作后重新调接口取值
        dataRefresh: function (paramsCode) {
            "use strict";
            $scope.orders.getOrders();
            $scope.orders.getSummary();
        },
        //申请退款
        toRefund: function (cause) {
            "use strict";
            var url = _host + '/my/orderAfterSale/applyRefund',
                params = {
                    companyId: _cid,
                    orderCode: this.orderCode,
                    refundReasonId: cause.key,
                    refundRemark: cause.value
                },
                that = this;
            _fnP(url, params)
                .then(function (res) {
                    that.dataRefresh();
                }, function (res) {
                    _fnE($scope.i18n('系统异常'), $scope.i18n('申请退款异常'));
                })
        },
        //申请取消退款
        undoRefund: function (orderCode, isOK) {
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
            var url = _home + allUrlApi.orderCancel,
                params = {
                    orderCode: order.orderCode,
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
                if (res.code == 0 || res.code === '0') {
                    //已确认
                    $scope.showCancelWindow.isShow = false;
                    that.dataRefresh();//数据刷新
                }
            }, function (res) {
                $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('取消订单异常'));
            })
        },
        //分批去支付
        toPayment: function (code) {
            location.href = 'payment.html?orderCode=' + code;
        },
        //支付尾款
        payRetainage: function (order,presellStatus) {
            if (!order.orderCode) {
                return;
            }
            presellStatus = order.presell.status;
            var params =  {
                platformId: $rootScope.platformId,
                skus: null,
                businessType: 6,
                orderCode : order.orderCode
            };
            var list = [];
            angular.forEach(order.productList,function (val) {
                var sku = {
                    "mpId": val.storeMpId,
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
        //删除订单
        deleteOrder: function (orderCode, isOK) {
            var that = this;
            if (!orderCode) {
                return;
            }
            if (!isOK) {//还未确认
                _fnE($scope.i18n('确认'), $scope.i18n('您确定要删除订单吗') + '?', {
                    type: 'confirm',
                    ok: function () {
                        "use strict";
                        that.deleteOrder(orderCode, true)
                    }
                })
                return;
            }
            var url = $rootScope.home + allUrlApi.deleteOrder,
                params = {
                    orderCode: orderCode
                };
            _fnP(url, params)
                .then(function (res) {
                    "use strict";
                    that.dataRefresh();//数据刷新
                }, function (res) {
                    "use strict";
                    _fnE($scope.i18n('系统异常'), $scope.i18n('删除订单异常'));
                })
        },
        //判断订单是否可删除
        confirmDelete: function () {
            _fnE($scope.i18n('确认'), $scope.i18n('订单状态不可删除'), {
                type: 'confirm',
                ok: function () {
                    "use strict";
                }
            })
        },
        //取消待发货订单
        refundOrder: function (order, isOK) {
            var that = this;
            //order存在則緩存orderCode
            if (order) {
                $scope.orderCode = order.orderCode;
            }
            $scope.order2 = order;
            that.getcauses();
            if (!isOK) {
                return;
            }
            //已确认
            $scope.showRefundWindow.isShow2 = false;
            var url = _host + '/my/orderAfterSale/applyRefund',
                params = {
                    companyId: _cid,
                    orderCode: $scope.orderCode,
                    refundReasonId: this.selectedCauses.code,
                    refundRemark: this.cancelRemark
                };
            _fnP(url, params).then(function (res) {
                if(res.code == 0 || res.code === '0'){
                    that.dataRefresh();//数据刷新
                }
                try {
                    var heimdallParam = $scope.getHeimdallParams(order);
                    window.eventSupport.emit('heimdallTrack', heimdallParam);
                } catch (err) {
                    //console.log(err);
                }
                that.dataRefresh();
            }, function (res) {
                _fnE($scope.i18n('系统异常'), $scope.i18n('申请退款异常'));
            })
        },
        //取消订单
        cancelOrder: function (order, isOK) {
            var that = this;
            if (!order) {
                return;
            }
            $scope.order = order;
            $scope.orderCode = order.orderCode;
            that.getcauses(true);
            if (!isOK) {
                return;
            }
            var url = _home + allUrlApi.orderCancel,
                params = {
                    orderCode: order.orderCode,
                    orderCancelReasonId: this.selectedCauses.code,
                    orderCsCancelReason: this.cancelRemark,
                    orderCanceOperateType: 0,
                };
            $rootScope.ajax.postJson(url, params)
                .then(function (res) {
                    "use strict";
                    try {
                        window.eventSupport.emit('heimdallTrack', {
                            ev: "8",
                            otp: order.amount,
                            sp: order.orderDeliveryFeeAccounting,
                            oid: order.orderCode
                        });
                    } catch (err) {
                        //console.log(err);
                    }
                    if (res.code == 0 || res.code === '0') {
                        that.dataRefresh($rootScope.util.paramsFormat(location.hash).code);//数据刷新
                        //已确认
                        $scope.showCancelWindow.isShow = false;
                    }
                }, function (res) {
                    $scope.showCancelWindow.isShow = false;
                    _fnE($scope.i18n('系统异常'), $scope.i18n('取消订单异常'));
                })
        },
        //取消订单原因
        getcauses: function (flag) {
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
                    if (flag) {
                        $scope.showCancelWindow.isShow = true;
                    } else {
                        $scope.showRefundWindow.isShow2 = true;
                    }
                }
            });
        },
        //确认收货
        confirmReceived: function (orderCode, isOK) {
            var that = this;
            if (!orderCode) {
                return;
            }
            if (!isOK) {//还未确认
                _fnE($scope.i18n('确认'), $scope.i18n('您确定收货吗') + '?', {
                    type: 'confirm',
                    ok: function () {
                        "use strict";
                        that.confirmReceived(orderCode, true)
                    }
                })
                return;
            }
            //已确认
            var url = _home + allUrlApi.confirmReceived,
                params = {
                    orderCode: orderCode
                };

            _fnP(url, params)
                .then(function (res) {
                    that.dataRefresh();//数据刷新
                }, function (res) {
                    _fnE($scope.i18n('系统异常'), $scope.i18n('确认收货异常'));
                })
        },
        //再次购买， 添加到购物车， 并且mini购物车的数量++
        addItemToCart: function (orderCode) {
            var skus = [],
                availableProductList = [],
                that = this;
            var params = {
                orderCode: orderCode,
                areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
            };

            $rootScope.ajax.get($rootScope.host + '/my/order/getOrderStockState',params).then(function (res) {
                if (!res.data || res.data.availableProductList.length == 0) {
                    _fnE($scope.i18n('提示'), $scope.i18n('没有可再次购买的有效商品'));
                    return;
                }
                if (res.data && res.data.availableProductList.length > 0) {
                    that.availableProductList = res.data.availableProductList;
                    for(var i=0 ;i < that.availableProductList.length;i++){
                        skus.push({"mpId": that.availableProductList[i].mpId, "num": that.availableProductList[i].num});
                    }
                    // {
                    //     skus: JSON.stringify(skus),
                    //     areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
                    // }
                    $rootScope.ajax.postFrom($rootScope.host + "/cart/addItem",{
                        skus: JSON.stringify(skus),
                        areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
                    }).then(function(res) {
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
                    },function(err) {
                        $rootScope.error.checkCode(err.code, err.message);
                    })
                    // var params = {
                    //     provinceId: $rootScope.localProvince.province.provinceId,
                    //     companyId: $rootScope.companyId,
                    //     merchantId: $scope.merchantId,
                    //     platformId: $rootScope.platformId,
                    //     businessType : 7,
                    //     skus: JSON.stringify(skus),
                    //     sysSource:$scope.sysSource,
                    //     areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
                    // }
                    // $rootScope.ajax.postFrom($rootScope.host + "/checkout/initOrder",params).then(function (res) {
                    //     if (res.code == 0 || res.code === '0') {
                    //         // $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('加入') + $scope.i18n($rootScope.switchConfig.common.allCartBtnName) + $scope.i18n('成功'), {
                    //         //     type: 'confirm',
                    //         //     ok: function () {
                    //         //         location.href = '/settlement.html';
                    //         //     },
                    //         //     btnOKText: $scope.i18n('去') + $scope.i18n($rootScope.switchConfig.common.allCartBtnName)
                    //         // });
                    //         // $rootScope.$emit('updateMiniCartToParent');
                    //         localStorage.setItem('quickBuy', JSON.stringify(params));
                    //         location.href = 'settlement.html?q=1';
                    //     } else {
                    //         $rootScope.error.checkCode(res.code, res.message);
                    //     }
                    // },function (err) {
                    //     $rootScope.error.checkCode(err.code, err.message);
                    // });
                }
            })
        },
        // 再次购买，进入结算页
        goToSettle: function () {
            //跟踪云埋点
            $scope.heimdall.ev = "15";
            try{
                window.eventSupport.emit('heimdallTrack',$scope.heimdall);
            }catch(err){
            }
            $scope.sysSource = 'ody';
            if(v&&v.pointPrice){
                $scope.sysSource = 'INTEGRAL_MALL';
                //不在兑换时间内的积分商品
                if(!$scope.canExchange){
                    return;
                }
            }
            var params = {
                provinceId: $rootScope.localProvince.province.provinceId,
                companyId: $rootScope.companyId,
                merchantId: $scope.merchantId,
                platformId: $rootScope.platformId,
                businessType : 7,
                sysSource:$scope.sysSource,
                areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
            }
            if (!$scope.totalPackingNum) {
                $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n('请先选择商品'), {
                    type: 'info'
                });
                return;
            }

            if (v.typeOfProduct==3) {
                var quickSkus = [];
                angular.forEach($scope.pcIteminfo.sp.serialProducts,function(qs) {
                    var skusObj = {};
                    if (qs.product.chooseNum) {
                        if(qs.product.productPackageId){
                            skusObj = {"mpId":qs.product.mpId,"num":qs.product.chooseNum * qs.product.choosePackingWayNum,"productPackageId":qs.product.productPackageId};
                        }else{
                            skusObj = {"mpId":qs.product.mpId,"num":qs.product.chooseNum * qs.product.choosePackingWayNum};
                        }
                    }
                    quickSkus.push(skusObj);
                })
                params.skus = JSON.stringify(quickSkus);
            } else {
                var serviceGood = JSON.stringify([{'mpId':v.mpId,'num':v.chooseNum * v.choosePackingWayNum,'itemType':$scope.isPointPro?'6':'0','additionalItems':[{'mpId':$rootScope.serviceGoodId,'num':1}]}]);
                if( !$rootScope.serviceGoodId ) {
                    serviceGood = JSON.stringify([{'mpId':v.mpId,'num':v.chooseNum * v.choosePackingWayNum,'itemType':$scope.isPointPro?'6':'0'}])
                }
                params.skus = serviceGood;
            }

            if (!$rootScope.util.getUserToken()) {
                $rootScope.showLoginBox = true;
                return;
            } else {
                $rootScope.ajax.post($rootScope.host + '/checkout/initOrder', params).then(function (res) {
                    if (res.code == 0) {
                        localStorage.setItem('quickBuy', JSON.stringify(params));
                        location.href = 'settlement.html?q=1';
                    } else {
                        if(res.data!=null&&res.data.error != null && (res.data.error.type==4||res.data.error.type==3)){
                            localStorage.setItem('quickBuy', JSON.stringify(params));
                            location.href = 'settlement.html?q=1';
                        }else{
                            $rootScope.error.checkCode(res.code, res.message);
                        }
                    }
                }, function (error) {
                    $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('一键购买异常') + '！');
                })
            }
        },
        //晨光确认订单
        confirmOrder: function (orderCode) {
            if (!orderCode) {
                return;
            }
            window.location = "confirmation.html?" + orderCode;
        }
    }
}]);

