/**
 * Created by Roy on 17/6/29.
 */
'use strict';
angular.module('appControllers').controller('billCtrl', ["$scope", "$rootScope", "$cookieStore", "commonService", 'categoryService', "validateService", "Upload", "$state", "$stateParams","$window","allUrlApi",
    function ($scope, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload, $state, $stateParams,$window,allUrlApi) {
        //国际化
        $scope.i18n = function (key) {
            return $window.i18n ? $window.i18n(key) : key;
        };
        var  _fnP=$rootScope.ajax.post
        //公共参数
        var _ut = $rootScope.util.getUserToken(),
            _fnE = $rootScope.error.checkCode,
            _home = $rootScope.home,
            _host = $rootScope.host,
            _cid = $rootScope.companyId;
        if (!_ut) {
            $rootScope.showLoginBox = true;
            return;
        }
        $scope.orderCode = $stateParams.orderCode;

        //初始化翻页
        $scope.initPagination = function () {
            $scope.pageNo = 1;
            $scope.pageSize = 5;
            $scope.totalCount = 0;
            //翻页广播接收
            $scope.$on('changePageNo', function (event, data) {
                "use strict";
                $scope.pageNo = data;
                $scope.ownInvoice.getInvoiceOrders();
            })
        };
        $scope.currentIndex = 1
        $scope.switchTab = function(index) {
            $scope.pageNo = 1
            $scope.ownInvoice.list = []
            $scope.currentIndex = index
            $scope.confirmSearch = false
            $scope.keywords = ''
            if (index == 1) {
                $scope.isInvoice = 1
                $scope.ownInvoice.getInvoiceOrders();
            }
            if (index == 2) {
                $scope.isInvoice = 0
                $scope.ownInvoice.getInvoiceOrders();
            }
            if(index ==3) {
                $scope.isInvoice = 2
                $scope.ownInvoice.getInvoiceOrders();
            }
        },
        $scope.isInvoice = 1
        $scope.currentDeliverOrderCode = null
        // 根据商品名称，编号，交货单号查询
        $scope.confirmSearch = false
        $scope.keywords = ''
        $scope.gotoSearch = function() {
            if (!$scope.keywords) {
                return
            }
            $scope.confirmSearch = true
            $scope.ownInvoice.getInvoiceOrders();
        }
        $scope.ownInvoice = {
            isShowPage: false,
            isShowIcon: false,
            invoiceMode: {
                1: $scope.i18n('电子发票'),
                2: $scope.i18n('纸质发票')
            },

            invoiceType: {
                0: $scope.i18n('普通发票'),
                1: $scope.i18n('增值发票')
            },
            list: [],
            // 申请补开开票
            applyMakeInvoice(pro) {
                $scope.currentDeliverOrderCode = pro.deliverOrderCode
                $scope.invoice.changeInvoiceShow(true)
            },
            // 获取交货单列表
            getInvoiceOrders: function() {
                var that = this
                var url = '/custom-sbd-web/order/devliverOrderList.do'
                var params = {
                    pageNum: $scope.pageNo,
                    pageSize: $scope.pageSize,
                    isInvoice: $scope.isInvoice
                }
                if ($scope.keywords && $scope.confirmSearch) {
                    params.keywords = $scope.keywords
                }
                $rootScope.ajax.postJson(url,params).then(function(res) {
                    if (res.code ==0) {
                        if (res.data && res.data.list.length) {
                            that.list = res.data.list || []
                            that.isShowPage = true
                            that.isShowIcon = false
                            $scope.totalCount = res.data.total
                            $scope.totalPage = $scope.totalCount % $scope.pageSize == 0 ? (($scope.totalCount / $scope.pageSize) || 1) : parseInt($scope.totalCount / $scope.pageSize) + 1;
                        } else {
                            that.isShowPage = false
                            that.isShowIcon = true
                        }                   
                    } else {
                        that.isShowPage = false
                        that.isShowIcon = true
                    }
                })
            },
            //初始化操作, 这个方法在页面的ng-init里调用
            init: function () {
                "use strict";
                var that = this;
                that.isShowPage = false;
                that.isShowIcon = false;
                //初始化翻页
                $scope.initPagination();//初始化翻页
                that.getInvoiceOrders();
            }
        }
        $scope.ownInvoice.init();
        // 开具发票弹框逻辑
        // 发票功能相关
        $scope.invoice={
            invoiceType:{
                '1':$scope.i18n('普通发票'),
                '2':$scope.i18n('增值税发票')
            },
            invoiceTitleType:[
                {
                    id:1,
                    value:$scope.i18n('个人')
                },
                {
                    id:2,
                    value:$scope.i18n('单位')
                }
            ],
            invoiceHideOtherAddress: true, //影藏其他发票地址
            invoiceAdressCurrentIndex: 0,
            invoiceModeNum: 1, //1纸质发票，2电子发票
            invoiceContent:{},
            invoiceContentList:[],
            soInviceConfig:[],//纸质电子发票读取后台配置
            invoiceShow:false,
            addInvoiceIsFirst:false,
            lastInvoice:{},
            invoiceRadio:{
                commonDisabled:true,
                addedDisabled:true
            },
            invoiceSure:true,
            invoiceSubmit:false,
            companyTips:false,
            personTips:false,
            showVat:function(){
                var url = _host + '/my/showVATInvoice';
                var data = {
                    companyId: _cid,
                }
                _fnP(url, data).then(function (res) {
                    $scope.personVat = res.data;
                }, function (res) {});
            //    errorHandle 错误信息上面一行的
            },
            changeInvoiceShow:function(boo){
                this.invoiceShow=boo;
                if(boo) this.checkLastInvoice(this.toSaveInvoiceObj.invoiceType);
            },
            toSaveInvoiceObj:{
                //发票类型
                invoiceType:1,
                //默认抬头：个人
                invoiceTitleType:1,
                //发票抬头内容
                invoiceTitleContent:'',
                //默认发票内容：需要明细发票
                isNeedDetails:1,
                //其他发票内容默认选择:1(食品)
                invoiceContentId:1,
                //发票内容
                invoiceContent:'',
                //发票种类，1电子发票，2纸质发票(默认2)
                invoiceMode: 2,
                //纳税人识别号
                taxpayerIdentificationCode:'',
            },
            // 切换纸质发票
            paperOrderInvioce() {
                $scope.invoice.invoiceModeNum =1
                $scope.invoice.toSaveInvoiceObj.invoiceMode = 2
            },
            // 切换电子发票
            electrocOrderInvioce() {
                $scope.invoice.invoiceModeNum =2 
                $scope.invoice.toSaveInvoiceObj.invoiceMode =1
            },
            // 切换发票地址
            changeinvoiceAddress(index) {
                this.invoiceAdressCurrentIndex = index
            },
            changezzsInvoice() {
                if (!$scope.invoice.invoiceSure) {
                    return 
                }
                $scope.invoice.toSaveInvoiceObj.invoiceType=2 
                $scope.invoice.invoiceModeNum =1
            },
            //获取上次发票信息
            checkLastInvoice:function(invoiceType) {
                $scope.invoice.invoiceSubmit = false;
                //初始化先调用个人资质有没有,oupu又不要了，需要增值税再打开
                // if($scope.invoice.toSaveInvoiceObj.invoiceType){
                    $scope.invoice.showVat();
                // }
                if($scope.invoice.toSaveInvoiceObj.invoiceTitleContent == $scope.i18n('个人')){
                    $scope.invoice.toSaveInvoiceObj.invoiceTitleContent = '';
                }

                if($scope.invoice.toSaveInvoiceObj.invoiceType == 0){
                    $scope.invoice.toSaveInvoiceObj.invoiceMode = 0;
                    $scope.invoice.invoiceSure = false;
                }else{
                    $scope.invoice.invoiceSure = true;
                }
            },
            //发票保存
            invoiceSave:function(invoiceType){
                if ($scope.invoice.toSaveInvoiceObj.invoiceType == 2 && !$scope.personVat.unitName) {
                    var params = {
                        invoiceType: false,
                        show: false,
                        goodReceiverName: $scope.settmentinvoice.goodReceiverName,
                        goodReceiverAddress:  $scope.settmentinvoice.goodReceiverAddress,
                        goodReceiverMobile: $scope.settmentinvoice.goodReceiverMobile,
                        unitName: $scope.settmentinvoice.unitName,
                        taxpayerIdentificationCode: $scope.settmentinvoice.taxpayerIdentificationCode,
                        registerAddress: $scope.settmentinvoice.registerAddress,
                        registerPhone: $scope.settmentinvoice.registerPhone,
                        bankDeposit: $scope.settmentinvoice.bankDeposit,
                        bankAccount: $scope.settmentinvoice.bankAccount,
                        goodReceiverProvinceId: typeof $scope.invoice.selectedDistrict=='undefined'?'':($scope.invoice.selectedDistrict.key||''),
                        goodReceiverProvince: typeof $scope.invoice.selectedDistrict=='undefined'?'':($scope.invoice.selectedDistrict.name||''),
                        goodReceiverCityId: typeof $scope.invoice.selectedUnit=='undefined'?'':($scope.invoice.selectedUnit.key||''),
                        goodReceiverCity: typeof $scope.invoice.selectedUnit=='undefined'?'':($scope.invoice.selectedUnit.name||''),
                        goodReceiverAreaId: typeof $scope.invoice.selectedPosition=='undefined'?'':($scope.invoice.selectedPosition.key||''),
                        goodReceiverArea: typeof $scope.invoice.selectedPosition=='undefined'?'':($scope.invoice.selectedPosition.name||''),
                        ut: _ut,
                        companyId: _cid,
                    }
                    $rootScope.ajax.post('/api/my/editVATInvoice',params).then(function (result) {
                        if(result.code==0) {
                            if (result && result.code == "0") {
                                var url = '/custom-sbd-web/sbdOrder/patchInvoice'
                                var params = {
                                    deliverOrderCodeList: [$scope.currentDeliverOrderCode],
                                    invoice: $scope.invoice.toSaveInvoiceObj
                                }
                                $rootScope.ajax.postJson(url,params).then(function(res) {
                                    if (res.code ==0) {
                                        $scope.invoice.invoiceShow = false
                                        $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n('开票成功'),{
                                            type:'info'
                                        });
                                        $scope.switchTab($scope.currentIndex)
                                    } else {
                                        $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n('开票失败'),{
                                            type:'info'
                                        });
                                    }
                                })
                            } else {
                                // $scope.invoiceErrMsg = result.message;
                                _fnE(result.message);
                            }
                        }else{
                            _fnE(result.code,result.message);
                        }
                    }, function () {
                        _fnE($scope.i18n('系统异常'),$scope.i18n('提交失败'));
                    })
                } else {
                    if($scope.invoice.toSaveInvoiceObj.invoiceType == 2){
                        $scope.invoice.invoiceSubmit = true;
                    }
                    if($scope.invoice.toSaveInvoiceObj.invoiceTitleType == 2){
                        if($scope.invoice.toSaveInvoiceObj.invoiceTitleContent == ''|| $scope.invoice.toSaveInvoiceObj.invoiceTitleContent == null){
                            $scope.invoice.companyTips = true;
                        }else if($scope.invoice.toSaveInvoiceObj.taxpayerIdentificationCode == ''|| $scope.invoice.toSaveInvoiceObj.taxpayerIdentificationCode == null){
                            $scope.invoice.companyTips = false;
                            $scope.invoice.personTips = true;
                        }else{
                            $scope.invoice.personTips = false;
                            $scope.invoice.invoiceSubmit = true;
                        }
                    }else{
                        $scope.invoice.invoiceSubmit = true;
                    }
                    if(!$scope.invoice.invoiceSubmit){
                        return;
                    }
                    if((invoiceType == 0&&!$scope.invoice.invoiceSure)||$scope.invoice.invoiceSubmit) {
                        if (invoiceType == 1 && this.toSaveInvoiceObj.isNeedDetails !== 1) {
                            this.toSaveInvoiceObj.invoiceContent = this.invoiceContent[this.toSaveInvoiceObj.invoiceContentId.toString()];
                        }
                        var url = '/custom-sbd-web/sbdOrder/patchInvoice'
                        var params = {
                            deliverOrderCodeList: [$scope.currentDeliverOrderCode],
                            invoice: $scope.invoice.toSaveInvoiceObj
                        }
                        if ($scope.invoice.toSaveInvoiceObj.invoiceType == 1 && $scope.invoice.invoiceSure) {
                            params.addressId  = $scope.invoiceAllAdress[$scope.invoice.invoiceAdressCurrentIndex].id
                        }
                        $rootScope.ajax.postJson(url,params).then(function(res) {
                            if (res.code ==0) {
                                $scope.invoice.invoiceShow = false
                                $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n('开票成功'),{
                                    type:'info'
                                });
                                $scope.switchTab($scope.currentIndex)
                            } else {
                                $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n('开票失败'),{
                                    type:'info'
                                });
                            }
                        })
                       
                     }//else{
                    //     _fnE($scope.i18n('警告'),$scope.i18n('表单填写不正确'));
                    // }
                }
            }
        }
        // 增票资质相关数据
        $scope.selectedDis = null;//省
        $scope.selectedUn = null;//市
        $scope.selectedAr = null;//区
        $scope.isOrders=false;
        //$scope.disMax = 0;//最大省id
        //$scope.unitMax = 0;//最大市id
        $scope.settmentinvoice = {
            invoiceSubmit: false,
            invoiceType: false,
            message: '',
            show: false   
        };
        $scope.invoiceUrl = false;
        $scope.invoiceSubmit = false;
        // $scope.invoice.invoiceType = false;
        $scope.invoice.message = '';
        $scope.invoice.show = false;
        //var invoiceSubmitURL = _host + "/my/editVATInvoice";//提交注册
        // $scope.taxLicenseUpdStatus = false;
        //页面数据初始化
        $scope.areaSelect = function(arr,key,index,selectedDistrict){
            var isNull = true;
            for(var i=0;i<arr.length;i++){
                if(arr[i].key ==  key){
                    if(index == 1){//省
                        $scope.selectedDis = arr[i];
                        $scope.selectedUn = null;//置空
                        $scope.invoice.selectedUnit = null;
                        $scope.selectedAr = null;//置空
                        $scope.selectedPosition = null;
                    }else if(index == 2){
                        $scope.selectedUn = arr[i];//市
                        $scope.selectedAr = null;//置空
                        $scope.invoice.selectedPosition = null;
                    }else{
                        $scope.selectedAr = arr[i];//区
                    }
                    isNull = false;
                    return;
                }
            }
            if(isNull){//请选择
                if(index == 1){
                    $scope.selectedDis = null;
                    $scope.invoice.selectedDistrict = null;
                    $scope.selectedUn = null;//置空
                    $scope.invoice.selectedUnit = null;
                    $scope.selectedAr = null;//置空
                    $scope.invoice.selectedPosition = null;
                }else if(index == 2){
                    $scope.selectedUn = null;//置空
                    $scope.invoice.selectedUnit = null;
                    $scope.selectedAr = null;//置空
                    $scope.invoice.selectedPosition = null;
                }else{
                    $scope.selectedAr = null;//置空
                    $scope.invoice.selectedPosition = null;
                }
    
            }
        }
        // 增票资质表单
        $scope.invoiceInit = function(){//增票页面初始化
            $scope.areaJson = areajson;
        }
        // 初始化增票资质
        $scope.invoiceInit()
        $scope._getAllAddress = function (newId) {
            var url = '/ouser-center/address/getAllAddressForm.do',
                data = {
                }
            $scope.allAddress = [];
            $scope.invoiceAllAdress = []
            $rootScope.ajax.post(url, data).then(function (res) {
                if (res.data !== null) {
                    $scope.allAddress = res.data;
                    $scope.invoiceAllAdress = res.data
                }
            });
        }
        $scope._getAllAddress()
    }]);
