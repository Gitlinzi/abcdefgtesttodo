/**
 * Created by Roy on 15/10/23.
 */
appControllers
    .controller("settlementCtrl", ['$log', '$rootScope', '$scope', '$cookieStore','commonService','config','$window','validateService','$filter',"Upload", function ($log, $rootScope, $scope, $cookieStore,commonService,config,$window,validateService,$filter,Upload) {
    "use strict"
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
    
    $scope.pageSize = 10;
    $scope.pageNo =1;

    $scope.mobileRegExp = new RegExp(validateService.mobile);
    $scope.bankAcountRegExp = new RegExp(validateService.bankAcount);
    var _ut=$rootScope.util.getUserToken();
    var _cid = $rootScope.companyId;
    var  _fnP=$rootScope.ajax.post,
        _fnG=$rootScope.ajax.get,
        _fnE=$rootScope.error.checkCode,
        _host=$rootScope.host,
        _hostU=$rootScope.host_ouser,
        _sid=$rootScope.checkSessionId(),
        // _pid=$rootScope.localProvince.province.provinceId,
        _pid=JSON.parse($rootScope.util.getCookies("addrDetail")).areasCode,
        _cid=$rootScope.companyId,
        urlParams = $rootScope.util.paramsFormat(location.search),

        _bType = urlParams.type || 0;
    $scope._getLayerAddress=_getLayerAddress;
        if(urlParams.orderCode){
            var orderCodeSurplus = urlParams.orderCode;  //个人中心的预售传来的订单号
            var businessTypeSurplus = urlParams.businessType;//个人中心的预售传来的类型
        }
    $scope.ShowPart = false; // 史泰博ADV页面要求 
    //默认省份与迷你购物车
    $rootScope.execute();
    if ($rootScope.switchConfig.common.showAllGlobalNav) {
        $rootScope.getCartTotal();
    }
    $scope.isShowCashOnDelivery = false
    // 根据区域判断是否展示货到付款
    // $scope.showCashOnDlivery = function() {
    //     let params = {
    //         code: $rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
    //     }
    //     let url = '/custom-sbd-web/area/queryAreaByCode.do'
    //     $rootScope.ajax.postJson(url,params).then(res => {
    //         if (res.code == 0) {
    //             if (res.data ==0) {
    //                 $scope.isShowCashOnDelivery = false
    //             } else if (res.data == 1){
    //                 $scope.isShowCashOnDelivery = true
    //             }
    //         }
    //     })
    // },
    // $scope.showCashOnDlivery()
    //判断用户是否登录
    // $rootScope.checkUser();
    $scope.toAddNewAddress=false;
    //身份证验证是否正确的标识
    $scope.cardIdErrorMessageFlag = false;
    $scope.showList=[];
    $scope.newAddress={};
    $scope.multiAddress={};
    $scope.addressChecked='';
    $scope.couponCodeBool = true;
    $scope.referralCodeDataBool = true;
    $scope.personVat='';
    $scope.cardIdErrorMessage='';
    $scope.showCombation = false;
    $scope.combationList = [];
    //查看组合商品
    $scope.combation = function(id,e){
        e.stopPropagation()
        e.preventDefault()
        // if(!$scope.getUt()){
        //     $rootScope.showLoginBox = true;
        //     return;
        // }
        let url = '/api/checkout/queryMpcombinationById'
        let params = {
            id:id
        }
        $rootScope.ajax.postJson(url,params).then(res=>{
            if(res.code==0&&res.data&&res.data.length>0){
                $scope.showCombation = true;
                $scope.combationList = res.data;
            }
        })
        
    }
    $scope.defInvoiceId = '';
    $scope.UserId = '';
    // 获取个人信息
    $scope.getUserInfoDetail=function(){
        var url = '/custom-sbd-web/user/getUserDetail.do',
            params ='';
        $rootScope.ajax.postJson(url, params).then(function (result) {
            if (result.code == 0) {
                $scope.defInvoiceId = result.data.defInvoiceId;
                $scope.UserId = result.data.id;
                $scope.canOwe = result.data.canOwe;

                angular.forEach($scope.merchantProductList.payments,function(temp){
                    if(temp.paymentId == 4){
                        temp.canOwe = +$scope.canOwe;
                    }else{
                        temp.canOwe = 1;
                    }
                })
                
            } else {
                _fnE($scope.i18n('提示'), $scope.i18n(result.message));
            }
        })
    },

    // 成本中心相关
    /**
     * type 1-收货人 2-收货地址
     */
    $scope.getSelected = function(data,type){
        if(type == 1){
            $scope.consignee.consSelecked = data 
        }
    };
    $scope.costCenter={
        costCenterList:[],
        costDepartment:'',
        /**
        * 获取成本中心
        * @private
        */
        _getAllcostCenter:function () {
            var url = '/custom-sbd-web/advCostCenter/getCostCenterByUserId.do';
            var params;
            $rootScope.ajax.postJson(url, params).then(function (res) {
                if (res.code == 0) {
                    if (res.data !== null) {
                        $scope.costCenter.costCenterList = res.data;
                    }
                } else {
                    _fnE($scope.i18n('提示'), $scope.i18n(res.message));
                }
            })
        },
        // 保存成本中心
        _saveCostCenterId:function () {
            var url = '/api/checkout/saveCostCenterId.do';
            var params = {
                costCenterId:this.costDepartment
            };
            $rootScope.ajax.get(url, params).then(function (res) {
                if (res.code != 0) {
                    this.costDepartment = '';
                    _fnE($scope.i18n('提示'), $scope.i18n(res.message));
                }else {
                    $scope.consignee.saveProxyMsg();
                }
            })
        },
        
    }
    // 收货地址/收货人信息相关
    $scope.consignee={
        consNameList:[],
        consSelecked:{}, // 选中收货人
        consPhone:'',
        fixedMobile:'',
        receiver:'',
        fixedMobile2:'',
        receiverPhone:'',
        consAdressList:[],
        AdreSelecked:{}, // 选中地址
        orderDeliveryTimeStr:'',// 预计发货时间
        orderDeliveryTime:'',
        /**
        * 获取常用收货人
        * @private
        */
       _getAllConsignee:function () {
            var url = '/custom-sbd-web/product/getCommonReceiverList.do';
            var params = {}
            $rootScope.ajax.postJson(url, params).then(function (res) {
                if (res.code == 0) {
                    if (res.data !== null) {
                        angular.forEach(res.data,function(con){
                            if(con.deft){
                                $scope.consignee.consSelecked = con; 
                            }
                        })
                        // 如果没有默认则选中第一个
                        if (!$scope.consignee.consSelecked && !$scope.consignee.consSelecked.id) {
                            $scope.consignee.consSelecked = res.data[0]
                        }
                        $scope.consignee.consNameList = res.data;
                    }
                } else {
                    _fnE($scope.i18n('提示'), $scope.i18n(res.message));
                }
            })
        },
        /**
         * 获取常用地址
         * @param runSaveAddress
         * @private
         */
        _getAllAddress: function () {
            var url = '/custom-sbd-web/product/getCommonAddressList.do';
            var params = {
                userId:$scope.UserId,
            }
            $rootScope.ajax.postJson(url, params).then(function (res) {
                if (res.code == 0) {
                    if (res.data.listObj !== null) {
                        angular.forEach(res.data,function(con){
                            if(con.deft){
                                $scope.consignee.AdreSelecked = con; 
                                $scope.consignee._queryFront();
                            }
                        })
                        if(!$scope.consignee.AdreSelecked.id) {
                            $scope.consignee.AdreSelecked = res.data[0]
                            $scope.consignee._queryFront();
                        }
                        $scope.consignee.consAdressList = res.data;
                    }
                } else {
                    _fnE($scope.i18n('提示'), $scope.i18n(res.result));
                }
            });
        },
        // 预计发货时间
        _queryFront:function(){
            if(!this.AdreSelecked){
                return;
            }
            var time = new Date().getTime() + 3*24*60*60*1000
            var url = '/custom-sbd-web/advEstimeateDeliveryTime/queryFront.do';
            var params = {
                districtCode: this.AdreSelecked.regionCode,
                provinceCode: this.AdreSelecked.provinceCode,
                cityCode: this.AdreSelecked.cityCode,
            }
            $rootScope.ajax.postJson(url, params).then(function (res) {
                if (res.code == 0) {
                    if (res.data !== null) {
                        $scope.consignee.orderDeliveryTimeStr = res.data.orderDeliveryTimeStr;
                        $scope.consignee.orderDeliveryTime = res.data.orderDeliveryTime;
                    }
                    // $scope.consignee.saveProxyMsg();
                } else {
                    // 如果没有预计发货时间取当前时间加三天
                    $scope.consignee.orderDeliveryTime = new Date(parseInt(time)).toLocaleString().substr(0,10)
                    // $scope.consignee.saveProxyMsg();
                }
            });
        },
        // 切换收货人
        _chooseAdress() {
            if(!this.AdreSelecked){
                return;
            }
            var time = new Date().getTime() + 3*24*60*60*1000
            var url = 'custom-sbd-web/advEstimeateDeliveryTime/queryFront.do';
            var params = {
                districtCode: this.AdreSelecked.regionCode,
                provinceCode: this.AdreSelecked.provinceCode,
                cityCode: this.AdreSelecked.cityCode,
            }
            $rootScope.ajax.postJson(url, params).then(function (res) {
                if (res.code == 0) {
                    if (res.data !== null) {
                        $scope.consignee.orderDeliveryTimeStr = res.data.orderDeliveryTimeStr;
                        $scope.consignee.orderDeliveryTime = res.data.orderDeliveryTime;
                    }
                    $scope.consignee.saveProxyMsg();
                } else {
                    // 如果没有预计发货时间取当前时间加三天
                    $scope.consignee.orderDeliveryTime = time;
                    $scope.consignee.saveProxyMsg();
                }
            });
        },
        // 验证信息
        checkMsg: function () {
            if(!$scope.consignee.consSelecked.id){
                _fnE($scope.i18n('提示'), $scope.i18n('收货人信息为空'));
                return; 
            }
            if($scope.consignee.AdreSelecked && !$scope.consignee.AdreSelecked.addressId){
                _fnE($scope.i18n('提示'), $scope.i18n('收货人地址信息为空'));
                return;
            }
        },
        // 保存收货人/收货地址信息
        saveProxyMsg:function () {
            var currentMessage = $scope.consignee.consSelecked
            var url = '/api/checkout/saveProxyMsg.do'
            var params = {
                orderBusinessType: _bType, // 订单类型（原接口字段）
                goodReceiverPersonId: currentMessage.id,
                goodReceiverName: currentMessage.receiverName,
                goodReceiverMobile: currentMessage.mobile,
                goodReceiverTel: currentMessage.telephone,
                goodReceiverTelExt: currentMessage.telephoneExt,
                goodReceiverTel2: currentMessage.telephone2,
                goodReceiverTelExt2: currentMessage.telephoneExt2,
                goodReceiverAddress: $scope.consignee.AdreSelecked.detailAddress,
                //shipmentDate: $scope.consignee.orderDeliveryTimeStr
            }
/*
             params.shipmentDate = $filter("date")($scope.consignee.orderDeliveryTime, "yyyy/MM/dd HH:mm:ss")
*/
             if($scope.consignee.orderDeliveryTime){
                 params.shipmentDate = $filter("date")($scope.consignee.orderDeliveryTime, "yyyy/MM/dd HH:mm:ss")
               /*  approvalDate = $filter("date")(new Date(), "yyyy/MM/dd HH:mm:ss")
                 params.approvalDate = approvalDate ;  // 预收货日期*/
             }
            if($scope.consignee.receiver){
                params.proxyReceiverName = $scope.consignee.receiver;  //代收人
            }
            if($scope.consignee.receiverPhone){
                // var mobileReg = /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/;
                let mobileReg = /^0?[1]\d{10}/
                if (!mobileReg.test($scope.consignee.receiverPhone)) {
                    _fnE($scope.i18n('提示'), $scope.i18n('手机号格式错误!'));
                    return;
                }
                params.proxyReceiverMobile = $scope.consignee.receiverPhone;  //代收人电话
            }
            if($scope.consignee.AdreSelecked.addressId){
                params.goodReceiverAddressId = $scope.consignee.AdreSelecked.addressId;  // 收货人地址id
            }
            if($scope.consignee.fixedMobile){
                params.goodReceiverTel = $scope.consignee.fixedMobile;  // 收货人固定电话1
            }
            if($scope.consignee.fixedMobile2){
                params.goodReceiverTel2 = $scope.consignee.fixedMobile2;  //收货人固定电话2
            }
            // goodReceiverTelExt: $scope.consignee.orderDeliveryTime, // 收货人固定电话分机号1
            // goodReceiverTelExt2: $scope.consignee.orderDeliveryTime, //收货人固定电话分机号2
            $rootScope.ajax.get(url, params).then(function (res) {
                if (res.code == 0) {
                    if (res.data !== null) {
                        _getProduct(false);
                    }
                } else {
                    _fnE($scope.i18n('提示'), $scope.i18n(res.message));
                }
            })
        },
    }
    $scope.consignee._getAllConsignee();
    $scope.consignee._getAllAddress();
    $scope.costCenter._getAllcostCenter();
   
    //备注
    $scope.remarks='';
    //初始化地址为默认相同
    $scope.sameAddress = {
        sameAddressBool :true,
    };
   
    
    // 发票功能相关
    $scope.invoice={
        invoiceType:[
            // {
            //     code:1,
            //     name:$scope.i18n('普通发票')
            // },
            {
                code:2,
                name:$scope.i18n('增值税发票')
            }
        ],
        invoiceTitleType:[],
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
        invoiceTypeChecked:'',
        invoiceTitleChecked:'',
        PoNumber:'', // po编号
        PoAmountincludingTax:'', // po金额含税
        PoAmount:'', // po金额不含税
        uploadFileUrl:'', 
        fileName:'选择文件上传', // 保存地址
        fileUrl:'',
        needInvoice:true, // true-无需发票

        /**
         * 获取发票列表
         */
        _getAllInvoice:function(){
            var url = '/custom-sbd-web/invoice/getInvoiceConfigListByUserId.do';
            // var params = {
            //     commonFlag:true
            // };
            var params =null;
            $rootScope.ajax.postJson(url, params).then(function (res) {
                if (res.code == 0) {
                    var allInvoice = res.data; // 默认以及常用发票
                    angular.forEach(allInvoice,function(temp){
                        if(temp.isDef == 1){
                            $scope.invoice.invoiceTitleChecked = temp;
                        }
                    })

                    $scope.invoice.invoiceTitleType = allInvoice;
                }else{
                    _fnE($scope.i18n('提示'),$scope.i18n(res.message));
                }
            });
        },
        getFileContent:function($event){
            var ele = angular.element($event.currentTarget).find('input');
        },
         //上传文件
        upload: function () {
            if (!this.uploadFileUrl) {
                return;
            }
            var url = "/api/fileUpload/putObjectWithForm";  //params是model传的参数，图片上传接口的url
            var that = this;
            Upload.upload({
                url: url,
                data: {
                    file: this.uploadFileUrl
                }
            }).success(function (data) {
                if (data.code == 0) {
                    $scope.invoice.fileName = data.data.fileName;
                    $scope.invoice.fileUrl = data.data.filePath;
                    $scope.invoice.saveinvoice();
                } else {
                    "use strict";
                    _fnE($scope.i18n('系统异常'), data.message);
                }
            }).error(function () {
                //logger.log('error');
            });
        },
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
            // if(boo) this.checkLastInvoice(this.toSaveInvoiceObj.invoiceType);
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
            invoiceMode:'',
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
        //需要发票
        invoiceNeed:function(type){
            if (type ==1) {
                $scope.invoice.invoiceSure = !$scope.invoice.invoiceSure;
                if(!$scope.invoice.invoiceSure){
                    $scope.invoice.toSaveInvoiceObj.invoiceType = 0;
                    $scope.invoice.toSaveInvoiceObj.invoiceMode = 0;
                    $scope.invoice.toSaveInvoiceObj.invoiceTitleType = 0;
                    $scope.invoice.toSaveInvoiceObj.isNeedDetails = 0;
                }else{
                    $scope.invoice.toSaveInvoiceObj.invoiceType = 1;
                    $scope.invoice.toSaveInvoiceObj.invoiceMode = 2;
                    $scope.invoice.toSaveInvoiceObj.invoiceTitleType = 1;
                    $scope.invoice.toSaveInvoiceObj.isNeedDetails = 1;
                }
            } 
            if (type ==2) {
                if ($scope.invoice.invoiceSure) {
                    $scope.invoice.invoiceSure = !$scope.invoice.invoiceSure
                    $scope.invoice.toSaveInvoiceObj.invoiceType = 0;
                    $scope.invoice.toSaveInvoiceObj.invoiceMode = 0;
                    $scope.invoice.toSaveInvoiceObj.invoiceTitleType = 0;
                    $scope.invoice.toSaveInvoiceObj.isNeedDetails = 0;
                }
            } 
            if(needInvoice){

            }     
        },
        //获取上次发票信息
        checkLastInvoice:function(invoiceType) {
            $scope.invoice.invoiceSubmit = false;
            //初始化先调用个人资质有没有,oupu又不要了，需要增值税再打开
            if($scope.invoice.toSaveInvoiceObj.invoiceType){
                $scope.invoice.showVat();
            }
            $scope.showTabHead(-1);
            $scope.showTabContent(-1);
            $scope.invoice.toSaveInvoiceObj.invoiceType = $scope.merchantProductList.orderInvoice.invoice.invoiceType;
            $scope.invoice.toSaveInvoiceObj.invoiceTitleType = $scope.merchantProductList.orderInvoice.invoice.invoiceTitleType;
            $scope.invoice.toSaveInvoiceObj.invoiceMode = $scope.merchantProductList.orderInvoice.invoice.invoiceMode;
            $scope.invoice.toSaveInvoiceObj.invoiceTitleContent = $scope.merchantProductList.orderInvoice.invoice.invoiceTitleContent;
            $scope.invoice.toSaveInvoiceObj.isNeedDetails = $scope.merchantProductList.orderInvoice.invoice.isNeedDetails;
            $scope.invoice.toSaveInvoiceObj.taxpayerIdentificationCode = $scope.merchantProductList.orderInvoice.invoice.taxpayerIdentificationCode;
            if($scope.invoice.toSaveInvoiceObj.invoiceTitleContent == $scope.i18n('个人')){
                $scope.invoice.toSaveInvoiceObj.invoiceTitleContent = '';
            }

            if($scope.invoice.toSaveInvoiceObj.invoiceType == 0){
                $scope.invoice.toSaveInvoiceObj.invoiceMode = 0;
                $scope.invoice.invoiceSure = false;
            }else{
                $scope.invoice.invoiceSure = true;
            }
            // angular.element('.invoice-type-box .invoice-type').removeClass('red-icon');


            // if (invoiceType == 1) {
            //     this.toSaveInvoiceObj.invoiceType = 1;
            //     if (angular.isUndefined(this.toSaveInvoiceObj.invoiceTitleType)) this.toSaveInvoiceObj.invoiceTitleType = 1;
            //     this.toSaveInvoiceObj.invoiceTitleContent = this.toSaveInvoiceObj.invoiceTitleContent || '';
            //     if (angular.isUndefined(this.toSaveInvoiceObj.isNeedDetails)) this.toSaveInvoiceObj.isNeedDetails = 1;
            //     if (angular.isUndefined(this.toSaveInvoiceObj.invoiceContentId)) this.toSaveInvoiceObj.invoiceContentId = 1;
            // }
            // _fnP(url, data).then(function (res) {
            //     $scope.invoice.lastInvoice[invoiceType] = res.data;
            //     if (invoiceType == 2) {
            //         if (res.data == null || $rootScope.util.isEmptyObj(res.data)) {
            //             $scope.invoice.addInvoiceIsFirst = true;
            //         } else {
            //             $scope.invoice.addInvoiceIsFirst = false;
            //         }
            //     } else if (invoiceType == 1) {
            //         that.toSaveInvoiceObj = that.lastInvoice[invoiceType];
            //         //如果重未使用过发票，返回是空对象，需要给予默认值
            //         that.toSaveInvoiceObj = {
            //             invoiceType: that.toSaveInvoiceObj.invoiceType || 1,
            //             invoiceTitleType: that.toSaveInvoiceObj.invoiceTitleType || 1,
            //             invoiceTitleContent: that.toSaveInvoiceObj.invoiceTitleContent || '',
            //             isNeedDetails: that.toSaveInvoiceObj.isNeedDetails || 1,
            //             invoiceContentId: that.toSaveInvoiceObj.invoiceContentId || 1,
            //             invoiceContent: that.toSaveInvoiceObj.invoiceContent || '',
            //             invoiceMode: that.toSaveInvoiceObj.invoiceMode || 2,
            //         };
            //     }
            // }, errorHandle);
        },
        invoiceFormat:function() {
            if($scope.merchantProductList)
            if(typeof $scope.merchantProductList.orderInvoice !== 'undefined' && $scope.merchantProductList.orderInvoice) {
                if (angular.isArray($scope.merchantProductList.orderInvoice.invoiceContentList)) {
                    var invoiceContent = {};
                    this.invoiceContentList=$scope.merchantProductList.orderInvoice.invoiceContentList;
                    this.soInviceConfig=$scope.merchantProductList.orderInvoice.soInviceConfig;
                    this.merchantSupportInvoiceType = $scope.merchantProductList.orderInvoice.merchantSupportInvoiceType;
                    angular.forEach($scope.merchantProductList.orderInvoice.invoiceContentList, function (inv) {
                        invoiceContent[inv.invoiceContentId.toString()] = inv.invoiceContentValue;
                    })
                    this.invoiceContent = invoiceContent;
                }
                if($scope.merchantProductList.orderInvoice.invoice!=null)
                    this.toSaveInvoiceObj.invoiceType=$scope.merchantProductList.orderInvoice.invoice.invoiceType;
                    if(this.toSaveInvoiceObj.invoiceType == 0){
                        $scope.invoice.invoiceSure = false;
                    }
                switch (parseInt($scope.merchantProductList.orderInvoice.merchantSupportInvoiceType)) {
                    case 0:
                        break;
                    case 1:
                    {
                        this.invoiceRadio.commonDisabled = false;
                        this.invoiceRadio.addedDisabled = true;
                        break;
                    }
                    case 2:
                    {
                        this.invoiceRadio.commonDisabled = true;
                        this.invoiceRadio.addedDisabled = false;
                        break;
                    }
                    case 3:
                    {
                        this.invoiceRadio.commonDisabled = false;
                        this.invoiceRadio.addedDisabled = false;
                        break;
                    }
                }
            }
        },
        //发票保存(非史泰博ADV)
        invoiceSave:function(invoiceType){
            $scope.invoice.needInvoice = !$scope.invoice.needInvoice;
            
            if (!$scope.invoice.needInvoice) {
                if ($scope.invoice.invoiceTitleType && $scope.invoice.invoiceTitleType.length === 0) {
                    _fnE($scope.i18n('提示'),$scope.i18n('未设置常用发票信息'));
                }
            }

            if($scope.invoice.needInvoice){
                this.saveinvoice();
            }
            return;
            if ($scope.invoice.toSaveInvoiceObj.invoiceType == 2 && !$scope.personVat.unitName) {
                // if($scope.myForm.$invalid){
                //     return;
                // } 
                var params = {
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
                    // adv扩展字段：
                    invoiceType: $scope.invoice.invoiceTypeChecked.code, // 发票类型
                    merchantId: $scope.invoice.invoiceTitleChecked.merchantId, // adv结算单位/企业/商家Id
                    invoiceId: $scope.invoice.invoiceTitleChecked.id, // adv发票Id
                    poCode: $scope.invoice.PoNumber, //advPO编号
                    poAmountFax: $scope.invoice.PoAmountincludingTax, //advPO金额含税
                    poAmount: $scope.invoice.PoAmount, //advPO金额
                    fileUrl: '', //adv发票附件url
                }
                // /api/my/editVATInvoice 原接口
                $rootScope.ajax.post('/api/checkout/saveOrderInvoice',params).then(function (result) {
                    if(result.code==0) {
                        if (result && result.code == "0") {
                            // _fnE($scope.i18n('提示'), $scope.i18n('修改增票资质成功'));
                            var data = $scope.invoice.toSaveInvoiceObj;
                            data.ut = _ut;
                            data.companyId = _cid;
                            data.businessType = _bType;
                            data.areaCode = $rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode;
                            var url = _host + '/checkout/saveOrderInvoice';
                            _fnP(url, data).then(function (res) {
                                $scope.invoice.changeInvoiceShow(false);
                                _getProduct();
                            }, errorHandle)
                        } else {
                            $scope.invoiceErrMsg = result.message;
                        }
                    }else{
                        _fnE(result.code,result.message);
                    }
                }, function (data,header,config,status) {
                    _fnE($scope.i18n('系统异常'),$scope.i18n('提交注册异常'));
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
                    var data = this.toSaveInvoiceObj;
                    data.ut = _ut;
                    data.companyId = _cid;
                    data.businessType = _bType;
                    data.areaCode = $rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode;
                    var url = _host + '/checkout/saveOrderInvoice';
                    _fnP(url, data).then(function (res) {
                        $scope.invoice.changeInvoiceShow(false);
                        _getProduct();
                    }, errorHandle)
                }else{
                     _fnE($scope.i18n('警告'),$scope.i18n('表单填写不正确'));
                }
            }
        },
        // 发票保存
        saveinvoice:function(){
            var url = '/api/checkout/saveOrderInvoice';
            if($scope.invoice.needInvoice){
                var params = {
                    invoiceType: 0,
                    invoiceTitleType:0,
                    invoiceTitleContent:'',
                    isNeedDetails:0,
                    invoiceMode:0,
                    ut: _ut,
                    companyId: _cid,
                }
            }else {
                var params = {
                    // show: false,
                    // goodReceiverName: $scope.settmentinvoice.goodReceiverName,
                    // goodReceiverAddress:  $scope.settmentinvoice.goodReceiverAddress,
                    // goodReceiverMobile: $scope.settmentinvoice.goodReceiverMobile,
                    // unitName: $scope.settmentinvoice.unitName,
                    // taxpayerIdentificationCode: $scope.settmentinvoice.taxpayerIdentificationCode,
                    // registerAddress: $scope.settmentinvoice.registerAddress,
                    // registerPhone: $scope.settmentinvoice.registerPhone,
                    // bankDeposit: $scope.settmentinvoice.bankDeposit,
                    // bankAccount: $scope.settmentinvoice.bankAccount,
                    // goodReceiverProvinceId: typeof $scope.invoice.selectedDistrict=='undefined'?'':($scope.invoice.selectedDistrict.key||''),
                    // goodReceiverProvince: typeof $scope.invoice.selectedDistrict=='undefined'?'':($scope.invoice.selectedDistrict.name||''),
                    // goodReceiverCityId: typeof $scope.invoice.selectedUnit=='undefined'?'':($scope.invoice.selectedUnit.key||''),
                    // goodReceiverCity: typeof $scope.invoice.selectedUnit=='undefined'?'':($scope.invoice.selectedUnit.name||''),
                    // goodReceiverAreaId: typeof $scope.invoice.selectedPosition=='undefined'?'':($scope.invoice.selectedPosition.key||''),
                    // goodReceiverArea: typeof $scope.invoice.selectedPosition=='undefined'?'':($scope.invoice.selectedPosition.name||''),
                    ut: _ut,
                    companyId: _cid,
                    // adv扩展字段：
                    invoiceTitleType: $scope.invoice.invoiceTitleChecked.invoiceTitleType, // 发票抬头类型
                    merchantId: $scope.invoice.invoiceTitleChecked.merchantId, // adv结算单位/企业/商家Id
                    invoiceId: $scope.invoice.invoiceTitleChecked.id, // adv发票Id
                    invoiceMode:2, // 1 电子发票 2 纸质发票
                    invoiceTitleContent:$scope.invoice.invoiceTitleChecked.invoiceTitleContent,
                    isNeedDetails:1,
                }
                if(!$scope.invoice.invoiceTypeChecked.code){
                    _fnE($scope.i18n('提示'), $scope.i18n('请选择发票类型!'));
                    return;
                }
                if($scope.invoice.invoiceTitleChecked.invoiceTitleType === null || $scope.invoice.invoiceTitleChecked.invoiceTitleType === undefined){
                    _fnE($scope.i18n('提示'), $scope.i18n('请选择发票抬头!'));
                    return;
                }
                if($scope.invoice.invoiceTypeChecked.code){
                    params.invoiceType = $scope.invoice.invoiceTypeChecked.code; // 发票类型
                }
                if($scope.invoice.PoNumber){
                    params.poCode = $scope.invoice.PoNumber; //advPO编号
                }
                if($scope.invoice.PoAmountincludingTax){
                    params.poAmountFax = $scope.invoice.PoAmountincludingTax; //advPO金额含税
                }
                if($scope.invoice.PoAmount){
                    params.PoAmount = $scope.invoice.PoAmount; //advPO金额
                }
                if($scope.invoice.fileUrl){
                    params.fileUrl = $scope.invoice.fileUrl; //adv发票附件url
                }
            }
            $rootScope.ajax.get(url, params).then(function (res) {
                if (res.code == 0) {
                    _getProduct();
                }else{
                    _fnE($scope.i18n('提示'),$scope.i18n(res.message));
                }
            });
        },
    }
    $scope.invoice._getAllInvoice();
    
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
        show: false,

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
       // $scope.areaJson = areajson;
    }
    // 初始化增票资质
    $scope.invoiceInit()

     $scope.addressLength=true;
    // 地址功能相关
    $scope.address= {

        selectedId:0,
        /**
         * 新增地址
         * @private
         */
        _addNewAddress: function (boo) {
            var address = angular.copy($scope.newAddress);
            if (boo) {
                this.invalidSubmit = true;
            } else {
                this.invalidSubmit = false;
                var url = "/ouser-center/address/addAddressForm.do",
                    data = {
                        userName: address.userName,
                        provinceCode: address.provinceCode.toString().split('_')[1],
                        cityCode: address.cityCode.toString().split('_')[1],
                        regionCode: address.regionCode.toString().split('_')[1],
                        detailAddress: address.detailAddress,
                        mobile: address.mobile,
                    };
                    //判断是否需要输入身份证号码
                    if ($rootScope.switchConfig.common.showIDCardWhenEditAddress) {
                        data.identityCardNumber = address.userIDcard;
                    }
                _fnP(url, data).then(function (res) {
                    if( res.code == 0 ){
                        $scope.newAddress = {};
                        $scope.toAddNewAddress = false;
                        $scope.hideOtherAddress = false;
                    }
                    if (res.data) {
                        $scope.address._getAllAddress(res.data);
                    }
                    if( res.code != 0 ){
                        $scope.cardIdErrorMessageFlag = true;
                        $scope.cardIdErrorMessage = res.message;
                    }
                }, errorHandle)
            }
        },

        /**
         * 获取所有地址
         * @param runSaveAddress
         * @private
         */
        _getAllAddress: function (newId) {
            var url = '/ouser-center/address/getAllAddressForm.do',
                data = {
                }
            $scope.allAddress = [];
            $scope.invoiceAllAdress = []
            _fnP(url, data).then(function (res) {
                if (res.data !== null) {
                    $scope.allAddress = res.data;
                    $scope.invoiceAllAdress = res.data
                    if($scope.allAddress.length==0){
                        $scope.addressLength = true;
                        $scope.receiverNullData = {
                            settleShow:true,
                            settleTips:$scope.i18n('您还没有收货地址') + ',' + $scope.i18n('请新增收货地址'),
                            buttons:[
                                {
                                    name:$scope.i18n('知道了'),
                                    callback:function(){
                                        $scope.receiverNullData.settleShow = false;
                                    }
                                }
                            ]
                        }
                    }else{
                        $scope.addressLength = false;
                    }

                    if (newId) {
                        if(newId == 'mo'){
                            if(res.data&&res.data[0]){
                                $scope.address.selectedId = res.data[0].id;
                            }
                            $scope.address.storeId = angular.copy($scope.address.selectedId)
                            $scope.address._changeSaveAddress($scope.address.selectedId);
                        }else{
                            $scope.address.selectedId = newId;
                            $scope.address.storeId = angular.copy($scope.address.selectedId)
                            $scope.address._changeSaveAddress(newId);
                        }
                    }
                }
            },errorHandle);
        },

        /**
         * 删除地址:_deleteAddress
         * @param id
         * @param defaultIs
         * @private
         */
        _deleteAddress: function (id,defaultIs) {
            if (angular.isDefined(id) && angular.isDefined(defaultIs)) {
                this.id = id;
                this.isDefault = defaultIs;
            } else {
                this.deleted = 1;
            }
            if (!this.deleted) {
                var _this = this;
                $scope.deleteData = {
                    bombShow:true,
                    rightText: $scope.i18n('您确定要删除该收货地址吗') + "？",
                    title:$scope.i18n('删除'),
                    state:'error',
                    position:'top',
                    buttons: [
                        {
                            name:$scope.i18n('确定'),
                            className: 'one-button',
                            callback: function() {
                                $scope.delAddressBool = true;
                                _this._deleteAddress();
                            }
                        },
                        {
                            name:$scope.i18n('取消'),
                            className: 'two-button',
                            callback: function() {
                                $scope.deleteData.bombShow = false;
                            }
                        }
                    ]
                }
                return;
            }
            this.deleted = 0;
            $scope.toAddNewAddress = false;
            $scope.showList = [];
            var url = "/ouser-center/address/deleteAddressForm.do",
                data = {
                    id: $scope.address.id,
                }
            _fnP(url, data).then(function (res) {
                if(res.code == 0){
                    $scope.deleteData.bombShow = false;
                }
                delete $scope.address.id;
                delete $scope.address.defaultIs;
                $scope.allAddress = null;
                _getProduct();
            }, errorHandle);
        },

        /**
         * 编辑地址:_editAddress
         * @param address
         * @param index
         * @private
         */
        _editAddress: function (address,index) {
            this.invalidSubmit=false;
            $scope.newAddress = {
                id: address.id,
                userName: address.userName,
                provinceCode: address.provinceCode,
                cityCode:address.cityCode,
                regionCode: address.regionCode,
                detailAddress: address.detailAddress,
                mobile: address.mobile,
            };
            //在编辑地址的时候判断是否包含身份证
            if ($rootScope.switchConfig.common.showIDCardWhenEditAddress) {
                $scope.newAddress.userIDcard = address.identityCardNumber;
            }
            $scope.multiAddress.provinceCode = {};
            $scope.multiAddress.cities = {};
            $scope.multiAddress.regions = {};
            //需要取出层级地址 editFlag:true
            _getLayerAddress(100000, 1, true);
            $scope.toAddNewAddress = false;
            $scope.address._resetShowList(index);
        },
         /*
            i18n('在输入身份证信息错误的时候修改是否显示身份证信息的状态')
        */
        _changeCardIdErrorMessageFlag: function(){
            $scope.cardIdErrorMessageFlag = false;
        },
        /**
         * 更新地址:_updateAddress
         * @private
         */
        _updateAddress: function (boo,id,server) {
            var address = angular.copy($scope.newAddress);
            if (boo) {
                this.invalidSubmit = true;
            } else {
                // address.defaultIs = address.defaultIs ? 1 : 0;
                address.provinceCode = address.provinceCode.toString().split('_')[1];
                address.cityCode = address.cityCode.toString().split('_')[1];
                address.regionCode = address.regionCode.toString().split('_')[1];
                //在更新的时候判断是否包含身份证
                if ($rootScope.switchConfig.common.showIDCardWhenEditAddress) {
                    address.identityCardNumber = address.userIDcard;
                }
                var url = "/ouser-center/address/updateAddressForm.do",
                    data = address;
                data.ut = _ut;
                _fnP(url, data).then(function (res) {
                    var thisID;
                    if (id && $scope.newAddress.provinceCode.indexOf(_pid) == 0) thisID = id;
                    if (id && $scope.newAddress.provinceCode.indexOf() < 0) $scope.address.selectedId = 0;
                    // $scope.address._getAllAddress(thisID);
                    $scope.showList = [];
                    $scope.address._saveReceiver(id);
                }, errorHandle)
            }
        },
        /**
         * 更新地址为默认地址:_updateAddress
         * @private
         */
        _updateAddressMo: function (address,boo,id,server) {
            var url = "/ouser-center/address/setDefaultUserAddressForm.do";
            var params = {
                id : address.id
            }
            $rootScope.ajax.post( url , params ).then( function ( res ) {
                if( res.code == 0 ) {
                    // $scope.address._getAllAddress();
                }
            } )
        },
        //保存地址 跳转至订单页
        _saveReceiver: function(receiverId) {
            var url = _host + '/checkout/saveReceiver',
                data = {
                    receiverId: receiverId,
                    businessType: _bType,
                    areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
                };
            _fnP(url, data).then(function (res) {
                _getProduct();
            }, errorHandle)
        },
        /**
         * 清除状态:_cleanStatus
         * @private
         */
        _cleanStatus: function () {
            $scope.toAddNewAddress = false;
            $scope.defaultEdit = false;
            $scope.showList = [];
        },

        /**
         * 保存用户选择的地址:_changeSaveAddress
         * @param id
         * @private
         */
        deliverUrl:'',
        _changeSaveAddress: function (id,server) {
            // if($scope.sameAddress.sameAddressBool){
            //
            // }
            $scope.submitCtrl = true;
            if(server){
                this.deliverUrl = _host + '/checkout/saveInstallReceiver';

            }else{
                this.deliverUrl = _host + '/checkout/saveReceiver';
                $scope.deliverySaveOne = id;
            }
            var url = this.deliverUrl,
                data = {
                    receiverId: id,
                    sessionId: _sid,
                    provinceId: _pid,
                    companyId: _cid,
                    businessType: _bType,
                    areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
                }
            _fnP(url, data).then(function (res) {
                errorHandle(res);
                _getProduct();
                $scope.address.storeId = angular.copy($scope.address.selectedId);
            }, function (res) {
                //如果报错则恢复原来的地址选择
                $scope.address.selectedId = $scope.address.storeId;
                if ($scope.merchantProductList.receiver != null)
                    $scope.address.selectedId = $scope.merchantProductList.receiver.receiverId || 0;
                errorHandle(res);
            })
        },
        //服务地址修改跟踪
        sameAddressFn:function(bool){
            if(bool){
                var  data = {
                    receiverId: $scope.deliverySaveOne,
                    sessionId: _sid,
                    provinceId: _pid,
                    companyId: _cid,
                    businessType: _bType,
                    isSameAsReceiver:1,
                }
            }else{
                var  data = {
                    receiverId: $scope.deliverySaveOne,
                    sessionId: _sid,
                    provinceId: _pid,
                    companyId: _cid,
                    businessType: _bType,
                    isSameAsReceiver:0,
                    areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
                }
            }
            var url =  _host + '/checkout/saveInstallReceiver';
            _fnP(url, data).then(function (res) {
                if(res.code != 0){
                    errorHandle(res);
                    $scope.sameAddress.sameAddressBool = !$scope.sameAddress.sameAddressBool;
                    return;
                }
                _getProduct();
                $scope.address.storeId = angular.copy($scope.address.selectedId);
            }, function (res) {
                //如果报错则恢复原来的地址选择
                $scope.address.selectedId = $scope.address.storeId;
                if ($scope.merchantProductList.receiver != null)
                    $scope.address.selectedId = $scope.merchantProductList.receiver.receiverId || 0;
                errorHandle(res);
            })
        },

        /**
         * 地址栏恢复状态:_resetShowList
         * @param index
         * @private
         */
        _resetShowList: function (index) {
            $scope.showList = [];
            $scope.showList[index] = true;
        },

        /**
         * 显示增加新地址:_showAddNewAddress
         * @private
         */
        _showAddNewAddress: function () {
            $scope.toAddNewAddress = true;
            this.invalidSubmit=false;
            $scope.newAddress = {};
            $scope.showList = [];
            $scope.multiAddress.cities = {};
            $scope.multiAddress.regions = {};
            _getLayerAddress(100000, 1)

        }
    };

    if($scope.addressLength){
        // $scope.address._getAllAddress();
    }


    /**
     * 获取省份/城市/区县:_getLayerAddress
     * @param code
     * @param layer
     * @param editFlag
     * @private
     */
    function _getLayerAddress(code,layer,editFlag,cb) {
        if (typeof code !== 'undefined' && code !== null) {
            code = (typeof code === 'number') ? code : code.split('_')[1];
            var url = _host + '/location/list/' + code;
            $rootScope.ajax.getNoKey(url).then(function (res) {
                if (res.data !== null) {
                    if (layer === 1) {
                        $scope.multiAddress.provinces = res.data;
                        if (editFlag) {
                            angular.forEach($scope.multiAddress.provinces, function (pro) {
                                if ($scope.newAddress.provinceCode == pro.code) {
                                    $scope.newAddress.provinceCode += ('_' + pro.code);
                                }
                            })
                            _getLayerAddress($scope.newAddress.provinceCode, 2, $scope.newAddress,cb);
                        }
                    }
                    else if (layer === 2) {
                        $scope.multiAddress.cities = res.data;
                        $scope.multiAddress.regions = {};
                        if (editFlag) {
                            angular.forEach($scope.multiAddress.cities, function (city) {
                                if ($scope.newAddress.cityCode == city.code) {
                                    $scope.newAddress.cityCode += '_' + city.code;
                                }
                            })
                            _getLayerAddress($scope.newAddress.cityCode, 3, $scope.newAddress,cb);
                        } else {
                            $scope.newAddress.cityCode = '';
                            $scope.newAddress.regionCode = '';

                        }

                    }
                    else if (layer === 3) {
                        $scope.multiAddress.regions = res.data;
                        if (editFlag) {
                            angular.forEach($scope.multiAddress.regions, function (region) {
                                if ($scope.newAddress.regionCode == region.code) {
                                    $scope.newAddress.regionCode += '_' + region.code;
                                }
                            })
                        } else {

                            $scope.newAddress.regionCode = '';
                        }
                        if(typeof cb == 'function'){
                            cb();
                        }
                    }
                }

            }, errorHandle)
        }
    }

    /**
     * 获取订单信息:_getProduct
     * @param isInit 是否是初始化
     * @param isIgnore 是否忽略无效商品
     * @private
     */
        function _getProduct(isInit,isIgnore,delMpIds) {
        var url = $rootScope.host + (isInit ? '/checkout/initOrder':'/checkout/showOrder');
            // data = {
            //     sessionId: _sid,
            //     provinceId: _pid,
            //     businessType: _bType
            // };

        // _fnP(url, data).then(_afterGet,errorHandle).catch(function(error){
        //     //alert(error)
        // })
        if(isInit){  //只要初始化就请求优惠码
            $scope.couponCodeBool = true;//再次请求优惠码
        }
       /* if(!String(_pid).split('_')[2]){
            _pid = _pid;
        }else{
            _pid = _pid.split('_')[2];
        }*/
        var param = {
            sessionId: _sid,
            areaCode: $rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode,
            platformId: 2,
            orderCode:orderCodeSurplus,
            businessType:businessTypeSurplus,
        }
        if($rootScope.util.paramsFormat(location.href).q == 1){
            param = JSON.parse(localStorage.getItem('quickBuy'));

        }
        if(isIgnore){
            if($rootScope.util.paramsFormat(location.href).q == 1&&localStorage.getItem('quickBuy')){
                var paramLocal = localStorage.getItem('quickBuy');
                param = JSON.parse(paramLocal);
            }
            param.ignoreChange=1;//继续结算
        }
        if(delMpIds) param.delMpIds=delMpIds;//删除无效商品

        $rootScope.ajax.post(url, param,true).then(function (result) {  

            if(result.code == 0&&isInit){
                $scope.submitCtrl = true;
                // $scope.consignee.saveProxyMsg()
            }
            if(result.code==10200002){
                $scope.submitCtrl = true;
            }
            if(result.code == 99){
                window.location = '/login.html';
                return;
            }


            // 来源punchout
            if(result.code == '0_punchout' && result.data ){
                $rootScope.util.setLocalItem('punchout', result.data)
                window.location = "/complete.html?punchout=1";
                return;
            }

            if( result.code == 0&&result.data.payments&&result.data.payments.length>0 ) {
                angular.forEach( result.data.payments , function(a) {
                    if( a.selected&&a.paymentId == '301' ) {
                        $scope.payMentErrorShow = true;
                        $scope.payMentErrorText = a.unavailableReason;
                    }
                })
            }
            if(result.code != 10200002&&result.code != 0){
                settleErrorHandle(result);
                return;
            }
            errorHandle(result);
            // if(result.data.error){
            //     $scope.settleError = result.data.error;
            //     if($scope.settleError.type == 3){
            //         $scope.serData = {
            //             settleShow:true,
            //             settleTips:result.data.error.message,
            //             buttons:[
            //                 {
            //                     name:'删除商品',
            //                     callback:function(){
            //                         alert(22)
            //                     }
            //                 }
            //             ],
            //             settleGoods:result.data.error.data
            //         }
            //     }
            // }
            _afterGet(result);
            $scope.saveCouponCtrl = true; //使用优惠券控制
            if($scope.couponCodeBool&&$scope.merchantProductList.orderReferralCode!=null){
                if( $rootScope.switchConfig.trade.settle.isConcession){
                    $scope.couponCode();
                }
                $scope.couponCodeBool = false;
            }
        },errorHandle)
    }
    

    //获取订单信息后续处理

    function _afterGet(res){
        if(res.data!=null){
            $scope.merchantProductList = res.data;
            $scope.getUserInfoDetail();
            if($scope.merchantProductList.receiverStatus == 3){
                $scope.sameAddress.sameAddressBool= false;
            }
            $scope.invoiceSupportLeft = false;
            $scope.invoiceSupportRight = false;
            $scope.cheapCodes = res.data.referralCodeAmount;
            $scope.deliverySaveOne = res.data.receiver?res.data.receiver.receiverId:'';
        }
        if(res.data != null){
            $scope.proInvoiceArr = [];
            //所有不支持发票的集合
            angular.forEach($scope.merchantProductList.merchantList,function(val){
                $scope.proInvoiceArr = $scope.proInvoiceArr.concat(val.productList);
            })
            angular.forEach($scope.proInvoiceArr,function(val){
                if(val.supportInvoiceType == 1){
                    $scope.invoiceSupportLeft = true;
                }
                if(val.supportInvoiceType == 0){
                    $scope.invoiceSupportRight = true;
                }
            })
            if ($scope.merchantProductList.receiver != null) {
                $scope.address.selectedId = $scope.merchantProductList.receiver.receiverId || 0;
                if($scope.merchantProductList.installReceiver != null){
                    $scope.address.selectedServer = $scope.merchantProductList.installReceiver.receiverId || 0;
                }
                $scope.address.storeId = angular.copy($scope.address.selectedId);
            }
            $scope.invoice.invoiceFormat();
            if($scope.merchantProductList.orderInvoice != null){
                $scope.invoice.toSaveInvoiceObj=angular.copy($scope.merchantProductList.orderInvoice.invoice)||$scope.invoice.toSaveInvoiceObj;
            }
            //如果没有地址列表,需要请求
            if(!$scope.allAddress) {
                //获取所有地址
                if($scope.delAddressBool){
                    // $scope.address._getAllAddress('mo');
                    $scope.delAddressBool = false;
                }else{
                    // $scope.address._getAllAddress();
                }

            }
            setDeliveryMode();
            $scope.paymentUtil._init($scope.merchantProductList.payments);
            //如果带出收货人, 把收货人的id设为选中id
            if(res.data.installReceiver){
                $scope.address.selectedServer=res.data.installReceiver.receiverId;
                $scope.address.selectedId1=res.data.installReceiver.receiverId||0;
            }else{
                if(res.data.receiver != null){
                    $scope.address.selectedId=res.data.receiver.receiverId||0;
                }
            }
            //抵扣信息
            $scope.discount.init(res.data);
        }
    }

    //报错机制
    function errorHandle(res) {
        if(angular.isObject(res)) {
            if(res.code == 10200101){
                window.location.href="home.html#/orderList"
            }
            //code=10200002业务逻辑
            if (res.code == 10200002) {
                var e,
                    mpIds=[],
                    msgInfo={},
                    backCart=function(){//返回购物车
                        location.href = '/cart.html';
                    },
                    continueE=function(){//继续结算||删除无效商品
                        _getProduct(true,true)//init
                    },
                    backPage=function(){//回去看看
                        history.back();
                    },
                    deleteInv=function(){
                        _getProduct(true,true,mpIds.join())//init
                    };
                try {
                    e = res.data.error;
                    $scope.errorInfo = {
                        type: e.type||res.data.message,
                        msg: e.message,
                        data:e.data,
                    }
                    msgInfo.isHtml=true;
                    msgInfo.size='md';
                    msgInfo.type='warn';
                    switch(e.type) {
                        case 0:
                        {
                            msgInfo.btnOK = true;
                            msgInfo.btnOKText = $scope.i18n('返回购物车');
                            msgInfo.ok = backCart;
                            msgInfo.btnGoBackText = $scope.i18n('继续结算');
                            msgInfo.goBack = continueE;
                            break;
                        }
                        case 1:
                        {
                            $scope.errorInfo.data=e.data || [];
                            msgInfo = angular.extend(msgInfo, {
                                // message: $scope.errorInfo.msg='以下商品暂时无货!',
                                btnOK: true,
                                btnOKText: $scope.i18n('返回购物车'),
                                ok: backCart,
                                btnGoBackText: $scope.i18n('继续结算'),
                                goBack: continueE
                            })
                            break;
                        }
                        case 2:
                        {
                            msgInfo.btnGoBackText = $scope.i18n('返回购物车');
                            msgInfo.goBack = backCart;
                            break;
                        }
                        case 3:
                        {
                            // _afterGet(res);
                            $scope.errorInfo.data=e.data || [];
                            //获取要无效商品的id
                            angular.forEach($scope.errorInfo.data,function(d){
                                mpIds.push(d.id);
                            })
                            msgInfo.message=$scope.errorInfo.msg=$scope.i18n('以下商品不在区域销售范围内') + '!'
                            msgInfo.btnOK = true;
                            msgInfo.btnOKText = $scope.i18n('修改收货地址');
                            msgInfo.btnGoBackText = $scope.i18n('删除无效商品');
                            msgInfo.goBack = deleteInv;
                            break;
                        }
                        case 4:
                        {
                            // $scope.receiverData = {
                            //     settleShow:true,
                            //     settleTips:res.data.message,
                            //     buttons:[
                            //         {
                            //             name:'知道了111',
                            //             callback:function(){
                            //                 $scope.receiverData.settleShow = false;
                            //             }
                            //         }
                            //     ]
                            // }
                            // _afterGet(res);
                            msgInfo.btnOK = true;
                            msgInfo.btnOKText = $scope.i18n('修改收货地址')
                            msgInfo.btnGoBackText = $scope.i18n('回去看看');
                            msgInfo.goBack = backPage;
                            break;
                        }
                        case 6:
                        {
                            // _afterGet(res);
                            $scope.errorInfo.data=e.data || [];
                            //获取要无效商品的id
                            angular.forEach($scope.errorInfo.data,function(d){
                                mpIds.push(d.id);
                            })
                            // msgInfo.message=$scope.errorInfo.msg='以下服务商品不在区域销售范围内!'
                            msgInfo.message=$scope.errorInfo.msg=$scope.i18n('您选购的部分商品超出安装服务范围') + '!';
                            msgInfo.btnOK = true;
                            msgInfo.btnOKText = $scope.i18n('修改收货地址');
                            msgInfo.btnGoBackText = $scope.i18n('删除无效商品');
                            msgInfo.goBack = deleteInv;
                            break;
                        }
                        case 7:
                        {
                            msgInfo.btnOK = true;
                            msgInfo.btnOKText = $scope.i18n('修改安装地址')
                            msgInfo.btnGoBackText = $scope.i18n('回去看看');
                            msgInfo.goBack = backPage;
                            break;
                        }
                        case 12:
                        {
                            {
                                msgInfo.btnOK = true;
                                msgInfo.btnOKText = $scope.i18n('继续结算');
                                msgInfo.ok = deleteInv;
                                msgInfo.btnGoBackText = $scope.i18n('回去看看');
                                msgInfo.goBack = backPage;
                                break;
                            }
                        }
                    }
                    _fnE($scope.i18n('系统异常'), 'warnInner', msgInfo);
                } catch (e) {
                    //$log.debug(e);
                }
            }else {
                if(res.code == 10200102){
                    return;
                }
                _fnE(res.code, res.message);
            }
        }else {
            _fnE($scope.i18n('异常'), $scope.i18n('系统异常'));
        }
    }


    // 结算页报错返回上一步
    function settleErrorHandle(res) {
        if(angular.isObject(res)) {
            //code=10200002业务逻辑
            var msgInfo={},
            backStep=function(){//返回上一步
                history.back();
            };
            $scope.errorInfo = {
                type: 'warn',
                msg: res.message,
            }
            msgInfo.isHtml=true;
            msgInfo.size='md';
            msgInfo.type='error';
            msgInfo.btnGoBackText = $scope.i18n('返回');
            msgInfo.goBack = backStep;
            _fnE($scope.i18n('系统异常'), 'warnInner', msgInfo);
        }else {
            _fnE($scope.i18n('异常'), $scope.i18n('系统异常'));
        }
    }

    //结算页的各种报错处理
    function payError(res) {
        if(angular.isObject(res)) {
            if(res.code == 10200101){
                window.location.href="home.html#/orderList"
            }
            //code=10200002业务逻辑
            if (res.code == 10200002) {
                var e,
                    mpIds=[],
                    msgInfo={},
                    backCart=function(){//返回购物车
                        location.href = '/cart.html';
                    },
                    continueE=function(){//继续结算||删除无效商品
                        _getProduct(true,true)//init
                    },
                    backPage=function(){//回去看看
                        history.back();
                    },
                    deleteInv=function(){
                        _getProduct(true,true,mpIds.join())//init
                    };
                try {
                    e = res.data.error;
                    $scope.errorInfo = {
                        type: e.type||res.data.message,
                        msg: e.message,
                        data:e.data,
                    }
                    msgInfo.isHtml=true;
                    msgInfo.size='md';
                    msgInfo.type='warn';
                    switch(e.type) {
                        case 0:
                        {
                            msgInfo.btnOK = true;
                            msgInfo.btnOKText = $scope.i18n('返回购物车');
                            msgInfo.ok = backCart;
                            msgInfo.btnGoBackText = $scope.i18n('继续结算');
                            msgInfo.goBack = continueE;
                            break;
                        }
                        case 1:
                        {
                            $scope.errorInfo.data=e.data || [];
                            msgInfo = angular.extend(msgInfo, {
                                // message: $scope.errorInfo.msg='以下商品暂时无货!',
                                btnOK: true,
                                btnOKText: $scope.i18n('返回购物车'),
                                ok: backCart,
                                btnGoBackText: $scope.i18n('继续结算'),
                                goBack: continueE
                            })
                            break;
                        }
                        case 2:
                        {
                            msgInfo.btnGoBackText = $scope.i18n('返回购物车');
                            msgInfo.goBack = backCart;
                            break;
                        }
                        case 3:
                        {
                            // _afterGet(res);
                            $scope.errorInfo.data=e.data || [];
                            //获取要无效商品的id
                            angular.forEach($scope.errorInfo.data,function(d){
                                mpIds.push(d.id);
                            })
                            msgInfo.message=$scope.errorInfo.msg=$scope.i18n('以下商品不在区域销售范围内') + '!';
                            msgInfo.btnOK = true;
                            msgInfo.btnOKText = $scope.i18n('修改收货地址');
                            msgInfo.btnGoBackText = $scope.i18n('删除无效商品');
                            msgInfo.goBack = deleteInv;
                            break;
                        }
                        case 4:
                        {
                            // $scope.receiverData = {
                            //     settleShow:true,
                            //     settleTips:res.data.message,
                            //     buttons:[
                            //         {
                            //             name:'知道了111',
                            //             callback:function(){
                            //                 $scope.receiverData.settleShow = false;
                            //             }
                            //         }
                            //     ]
                            // }
                            // _afterGet(res);
                            msgInfo.btnOK = true;
                            msgInfo.btnOKText = $scope.i18n('修改收货地址');
                            msgInfo.btnGoBackText = $scope.i18n('回去看看');
                            msgInfo.goBack = backPage;
                            break;
                        }
                        case 6:
                        {
                            // _afterGet(res);
                            $scope.errorInfo.data=e.data || [];
                            //获取要无效商品的id
                            angular.forEach($scope.errorInfo.data,function(d){
                                mpIds.push(d.id);
                            })
                            // msgInfo.message=$scope.errorInfo.msg='以下服务商品不在区域销售范围内!'
                            msgInfo.message=$scope.errorInfo.msg=$scope.i18n('您选购的部分商品超出安装服务范围') + '!';
                            msgInfo.btnOK = true;
                            msgInfo.btnOKText = $scope.i18n('修改收货地址');
                            msgInfo.btnGoBackText = $scope.i18n('删除无效商品');
                            msgInfo.goBack = deleteInv;
                            break;
                        }
                        case 7:
                        {
                            msgInfo.btnOK = true;
                            msgInfo.btnOKText = $scope.i18n('修改安装地址');
                            msgInfo.btnGoBackText = $scope.i18n('回去看看');
                            msgInfo.goBack = backPage;
                            break;
                        }
                    }
                    _fnE($scope.i18n('系统异常'), 'warnInner', msgInfo);
                } catch (e) {
                    //$log.debug(e);
                }
            }else if(res.code == 10200102){
                _fnE($scope.i18n('提示'),$scope.i18n('请先填写收货地址') + '!');
            }else {
                _fnE(res.code, res.message);
            }
        }else {
            _fnE($scope.i18n('异常'), $scope.i18n('系统异常'));
        }
    }
    //支付方式功能
    $scope.paymentUtil= {
        //初始化支付方式
        _init: function (payments) {
            angular.forEach(payments, function (pay) {
                if(pay.name=='赊销' || pay.name=='赊账'){
                    pay.choose = 1;
                    $scope.paymentUtil.selectedPaymentId = pay.paymentId;
                }else {
                    pay.choose = 0;
                }
                // if (pay.selected == 1) {
                //     $scope.paymentUtil.selectedPaymentId = 4; //默认选中赊销
                //     // $scope.paymentUtil.paymentSelect($scope.paymentUtil.selectedPaymentId);
                //     // return false;
                // }
            });
        },
        //保存支付方式
        paymentSelect: function (paymentId,name) {
            if( name != '月结' ) {
                $scope.payMentErrorShow = false;
            }
            var url = _host + '/checkout/savePayment',
                data = {
                    paymentId: paymentId,
                    companyId: _cid,
                    businessType: _bType,
                    areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
                }
            _fnP(url, data).then(function (res) {
                if( res.code == 0 ) {
                    _getProduct();
                } else if( res.code == '10200172' ) {
                    _fnE('提示',res.message);
                }
            }, errorHandle)
        }
    }

    /**
     * 选择运送方式:_changeDeliveryMode
     * @private
     */
    $scope.delivery = {
        selectedId :0
    };
    $scope.delivery.deliveryModeValue = [];
    $scope._changeDeliveryMode=function(mid, code,isSkip) {
        if (isSkip) return;
        var url = _host + '/checkout/saveDeliveryMode',
            data = {
                merchantId: mid,
                deliveryModeCodeChecked: code,
                companyId: _cid,
                businessType: _bType,
                areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
            }
        _fnP(url, data).then(function (res) {
            if(res.code != 0){
                errorHandle(res);
            }
            _getProduct();
        }, errorHandle)
    }

    function setDeliveryMode() {
        if($scope.merchantProductList)
        var list = $scope.merchantProductList.merchantDeliveryModeList;
        for(var i in list) {
            for(var j in list[i].deliveryModeList) {
                if(list[i].deliveryModeList[j].isDefault===1) {
                    $scope.delivery.deliveryModeValue[i]=list[i].deliveryModeList[j].code;
                }
            }
        }
        //$log.debug('setDeliveryMode',$scope.delivery.deliveryModeValue);
    }

    /**
     * 保存用户留言: _saveRemarks
     */
    $scope._saveRemarks=function(id,remark) {
        if (angular.isString(remark)) {
            var url = _host + '/checkout/saveRemark',
                data = {
                    remark: remark,
                    id: id,
                    businessType: _bType,
                    areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
                }
            _fnP(url, data).then(function (res) {
                _getProduct();
            }, errorHandle)
        }
    };

    $scope.returnHeimdall = function (data) {
        var str = '';
        for(var i in data) {
            for(var j in data[i].productList) {
                str += '{pri:"'+ data[i].productList[j].mpId +'",prm:'+data[i].productList[j].num+',prp:'+ data[i].productList[j].productAmount +'},'
            }
        }
        str = str.substring(0, str.length-1);
        str = '[' + str + ']';

        //$('#heimdall_el').attr('heimdall_products', str);
        return str;
    };
    /**
     * 提交定单: _submitOrder
     * @private
     */
    $scope.submitCtrl = false;//初始化成功后才可点击调用
    $scope._submitOrder=function() {
        if(!$scope.costCenter.costDepartment){
            _fnE($scope.i18n('提示'), $scope.i18n('请选择成本中心！')); 
            return;
        }
        if(!$scope.consignee.consSelecked.id){
            _fnE($scope.i18n('提示'), $scope.i18n('请选择收货人姓名！')); 
            return;
        }

        // if (!$scope.invoice.needInvoice) {
        //     $scope.invoice.saveinvoice();
        //     return;
        // }

        if(!$scope.submitCtrl){
            return;
        }
        var url = _host + '/checkout/submitOrder',
        data = {
            companyId: _cid,
            businessType: _bType?_bType:businessTypeSurplus,
            sessionId:_sid,
            areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
        }
        if ($scope.invoice.toSaveInvoiceObj.invoiceType == 1 && $scope.invoice.invoiceSure) {
            data.addressId  = $scope.invoiceAllAdress[$scope.invoice.invoiceAdressCurrentIndex].id
        }
        $scope.consignee.checkMsg();
        _fnP(url, data).then(function (res) {
            var _oid = 0;
            //跟踪云埋点
            try {
                window.eventSupport.emit('heimdallTrack', {
                    ev: "6",
                    oid: res.data.orderCode,
                    otp: res.data.amount,
                    sp: $scope.merchantProductList.totalDeliveryFee,
                    prs: $scope.returnHeimdall($scope.merchantProductList.merchantList),
                    pc: $scope.merchantProductList.totalNum
                });
            } catch (err) {
                //console.log(err);
            }
            if (res.data !== null && res.data && res.data.orderCode !== null) {
                errorHandle(res);
                _oid = res.data.orderCode;
                if (res.data.isPaid == 1) {
                    window.location = "complete.html?orderCode=" + _oid;
                } else if(res.data.isPaid == 0){
                    window.location = "payment.html?orderCode=" + _oid;
                }
            } else {
                _fnE(res.code, res.message);
            }
        }, errorHandle)
    }

    //抵扣相关
    $scope.saveCouponCtrl = true;
    $scope.discount={
        init:function(data) {
            angular.extend(this, {
                coupons: data.coupons || [],
                allCoupons: $scope.discount.groupCoupon(((data.allCoupon || {}).orderCoupons || []).concat((data.allCoupon || {}).freightCoupons)),
                couponAmount: data.couponAmount || 0,
                points: data.points,
                giftCard: data.giftCard,
                giftCardAmount:data.giftCardAmount,
                giftUseNum:(data.allCoupon || {}).availableQuantity||0,
                orderReferralCode:data.orderReferralCode||{},
                brokerage: data.brokerage || {},  //佣金
            })
        },
        show:true, //是否展示抵扣详情
        coupons:[],//可用优惠券
        allCoupons:[],//所有优惠券,含不可用
        couponAmount:0, //优惠券优惠额
        groupCoupon:function(obj){
            var temp = [];
            var temp1 = [];
            var temp2 = [];
            var temp3 = [];
            var array = [];
            $scope.couponIdAll = [];
            $scope.couponIdSelected = [];
            //商家券分组
            var merchant = {};
            angular.forEach(obj,function(v){
                if(v.isAvailable){
                    $scope.couponIdAll.push(v);
                }
                if (v.themeType == 0 || v.themeType == null) {
                    //平台券
                    temp.push(v);
                }
                if (v.themeType == 1) {
                    //平台自营券
                    temp1.push(v);
                }
                if (v.themeType == 11) {
                    //商家券
                    temp2.push(v);
                }
            })
            //商家分组
            angular.forEach(temp2,function(v){
                if (merchant[v.merchantId]) {
                    merchant[v.merchantId]['coupons'].push(v)
                } else {
                    merchant[v.merchantId] = {'merchantName': v.merchantName, 'coupons': [v]}
                }
            })
            angular.forEach(merchant,function(v){
                angular.forEach(v.coupons,function(c){
                    temp3.push(c);
                })
            })
            array = [].concat(temp,temp1,temp3);
            return array;
        },
        saveCoupon:function(coupon) { //保存优惠券
            if(!$scope.saveCouponCtrl){
                return;
            }
            $scope.saveCouponCtrl = false;
            $scope.couponIdAllCopy = angular.copy($scope.couponIdAll); //用于提交后台的优惠券集合
            angular.forEach( $scope.couponIdAll,function (val,index) {
                if(val.couponId == coupon.couponId&&coupon.selected==1){ //如果此时是已经选中就删除
                    $scope.couponIdAllCopy.splice(index,1);
                }else if(val.couponId == coupon.couponId&&coupon.selected==0){ //如果没选中，删除相同分组下已选，在添加新的进去
                    if(coupon.couponDeductionType == 0){ //不是运费券才删除，运费券可多选
                        angular.forEach( $scope.couponIdAll||[],function (da,index) {
                            if(da.selected == 1&&da.merchantId == coupon.merchantId&&da.couponDeductionType==0){
                                da.selected = 0;
                                $scope.couponIdAllCopy.splice(index,1);
                            }
                        })
                    }
                    val.selected = 1;
                    $scope.couponIdAllCopy.push(val);
                }
            })
            angular.forEach( $scope.couponIdAllCopy,function (val) {
                if(val.selected==1){
                    $scope.couponIdSelected.push(val.couponId);
                }
            })
            
            var url = _host + "/checkout/saveCoupon",
                params = {
                    // selected: coupon.selected==1?0:1,
                    // couponId: coupon.couponId,
                    couponIds: $scope.couponIdSelected.join(","),
                    companyId: _cid,
                    businessType: _bType,
                    areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
                };
            _fnP(url, params).then(function (res) {
                _getProduct();
            },function(res){
                _fnE($scope.i18n('提示'),res.message);
            })
        },
        couponCode:'',
        receiveCoupon:function(){
            if(!$scope.discount.couponCode) {
                _fnE($scope.i18n('提示'), $scope.i18n('请输入优惠券券号') + '!');
                return;
            }
            var url=_host+"/my/coupon/bindCoupon",
                params= {
                    companyId:  _cid,
                    couponCode:this.couponCode
                };
            _fnP(url, params).then(function(res){
                _getProduct(true);
                _fnE($scope.i18n('提示'),res.message);
                $scope.discount.couponCode = '';
            },function(res){
                _fnE($scope.i18n('提示'),res.message);
            })
        },
        points:null, //积分
        usePoint:false, //是否使用积分
        savePoints:function(point) {
            "use strict";
            var url = _host + "/checkout/savePoints",
                params = {
                    businessType: _bType,
                    points: this.usePoint ? (point || 0) : 0,
                    areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
                },
                that=this;
            _fnP(url, params).then(function (res) {
                _getProduct();
            }, function (res) {
                if ($.inArray(res.code.toString(), ['10200003', '10200004', '10200005', '10200006']) >= 0) {
                    that.usePoint = false;
                    _fnE($scope.i18n('提示'),res.message);
                    _getProduct();
                }
            })
        },
        canUsageAmount:false, //是否使用佣金
        saveBrokerage:function(brokeage){
            // if(!this.canUsageAmount){
            //     return;
            // }
            var url = _host + "/checkout/saveBrokerage",
                params = {
                    businessType: _bType,
                    usageAmount: this.canUsageAmount ? (brokeage || 0) : 0,
                    areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
                },
                that=this;
            _fnP(url, params).then(function (res) {
                _getProduct();
            }, function (res) {
                if ($.inArray(res.code.toString(), ['10200003', '10200004', '10200005', '10200006']) >= 0) {
                    that.brokerage.usageAmount = false;
                    _fnE($scope.i18n('提示'),res.message);
                    _getProduct();
                }
            })
        },
        giftCard:null, //礼品卡信息
        giftCardAmount:0//礼品卡抵扣
    };
    $scope.brokerageCheckNum = function(num){
        //先把非数字的都替换掉，除了数字和.
        // num = num.toString();
        num = num.replace(/[^\d.]/g,"");
//必须保证第一个为数字而不是.
        num = num.replace(/^\./g,"");
//保证只有出现一个.而没有多个.
        num = num.replace(/\.{2,}/g,"");
//保证.只出现一次，而不能出现两次以上
        num = num.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
        $scope.discount.brokerage.usageAmount = num;
    }
    //2开的优惠码
    $scope.cheapCodes = 0;
    $scope.couponCode = function(){
        var url = _host + "/checkout/getOrderReferralCode";

        $rootScope.ajax.get(url, {
            clearCacheAddTimeStamp: new Date().getTime(),
            areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
        }).then(function (res) {
            if (res.code == 0) {
                // $scope.referralCodeDataBool = true;
                $scope.referralCodesBool = res.data;
                $scope.referralCodes = res.data.referralCodes;
                $scope.canUseCodes = false;
                $scope.unCanUseCodes = false;
                if($scope.referralCodes&&$scope.referralCodes.length>0){
                    for(var i = 0;i<$scope.referralCodes.length;i++){
                        if($scope.referralCodes[i].isAvailable){
                            $scope.canUseCodes = true;
                        }
                        if($scope.referralCodes[i].isAvailable == 0){
                            $scope.unCanUseCodes = true;
                        }
                        // if($scope.referralCodes[i].selected){
                        //     $scope.cheapCodes = $scope.referralCodes[i].contentValue;
                        // }
                    }
                }
            }
        })
    }
    //保存优惠码
    $scope.saveReferralCodes = function(code){
        var selected = code.selected==1?0:1;
        var url = _host + "/checkout/saveReferralCode";
        if(selected){
            var pramas = {
                referralCodeId:code.referralCodeId,
                clearCacheAddTimeStamp: new Date().getTime(),
                areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
            }
            if($scope.referralCodeDataBool){
                $scope.referralCodeData = {
                    bombShow:true,
                    rightText: $scope.i18n('使用优惠码') + '，' + $scope.i18n('其余优惠将失效'),
                    title:$scope.i18n('提示'),
                    state:'error',
                    position:'top',
                    buttons: [
                        {
                            name:$scope.i18n('确定'),
                            className: 'one-button',
                            callback: function() {
                                $scope.referralCodeData.bombShow = false;
                                $scope.referralCodeDataBool = false;
                            }
                        }
                    ]
                }

            }
        }else{
            $scope.referralCodeDataBool = true;
            var pramas = {
                clearCacheAddTimeStamp: new Date().getTime()
            }
        }

        $rootScope.ajax.get(url, pramas).then(function (res) {
            if (res.code == 0) {
                if( $rootScope.switchConfig.trade.settle.isConcession ) {
                    $scope.couponCode();
                }
                _getProduct();
            }
        })
    }
    //新增优惠码
    $scope.addCodes = '';
    $scope.addReferralCodes = function(){
        if($scope.addCodes.length==0) {
            _fnE($scope.i18n('提示'), $scope.i18n('请输入优惠券券号') + '!');
            return;
        }
        var url=_host+"/promotion/referralCode/receive",
            params= {
                type:2,
                referralCode:$scope.addCodes
            };
        _fnP(url, params).then(function(res){
            _getProduct(true);
            _fnE($scope.i18n('提示'),res.message);
            $scope.addCodes = '';
        },function(res){
            _fnE($scope.i18n('提示'),res.message);
        })
    }

    $scope.showTabHead = function(index){
        if($scope.invoice.invoiceSure){
            index == 0 ? ($scope.invoice.toSaveInvoiceObj.invoiceTitleType=1):($scope.invoice.toSaveInvoiceObj.invoiceTitleType=2);
            $scope.selected = index;
        }
    }
    $scope.showTabContent = function(index){
        if($scope.invoice.invoiceSure){
            $scope.selected1 = index;
        }
    }
    // 晨光提交订单按钮
    $scope.cgSubmitOrder = function() {
        if(!$scope.costCenter.costDepartment){
            _fnE($scope.i18n('提示'), $scope.i18n('请选择成本中心！')); 
            return;
        }
        var url = _host + '/checkout/submitOrder',
            data = {
                companyId: _cid,
                businessType: _bType?_bType:businessTypeSurplus,
                sessionId:_sid,
                areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
            }
        _fnP(url, data).then(function (res) {
            var _oid = 0;
            //跟踪云埋点
            try {
                window.eventSupport.emit('heimdallTrack', {
                    ev: "6",
                    oid: res.data.orderCode,
                    otp: res.data.amount,
                    sp: $scope.merchantProductList.totalDeliveryFee,
                    prs: $scope.returnHeimdall($scope.merchantProductList.merchantList),
                    pc: $scope.merchantProductList.totalNum
                });
            } catch (err) {
                //console.log(err);
            }
            if (res.data !== null && res.data && res.data.orderCode !== null) {
                errorHandle(res);
                _oid = res.data.orderCode;
                if (res.data.isPaid == 1) {
                    window.location = "confirmation.html?" + _oid;
                } else if(res.data.isPaid == 0){
                    window.location = "confirmation.html?" + _oid;
                }
            } else {
                _fnE(res.code, res.message);
            }
        }, errorHandle)
    }
    //开始处理
    $scope.init=function(){
        //如果果带参数q表示立即购买
        _getProduct(true);
        // _getProduct($rootScope.util.paramsFormat(location.href).q?true:true);
        //抵扣相关
        // if($scope.couponCodeBool){
        //     $scope.couponCode();
        //     $scope.couponCodeBool = false;
        // }
        tabHandle();
    }
    function tabHandle() {
        var _$=angular.element;
        _$('.tab-titles li').click(function () {
            var acli = _$('.tab-titles li').filter('.active');
            var index = _$(this).index();
            var cons = _$('.tab-contents .content');
            if (acli[0] != this) {
                acli.removeClass('active');
                _$(this).addClass('active');
                cons.removeClass('active');
                cons.eq(index).addClass('active');
            }
        });
        _$('.coupon li').click(function () {
            var coupon_acli = _$('.coupon li').filter('.liactive');
            var coupon_index = _$(this).index();
            var coupon_cons = _$('.coupon-content');
            if (coupon_acli[0] != this) {
                coupon_acli.removeClass('liactive');
                _$(this).addClass('liactive');
                coupon_cons.css("display", 'none');
                coupon_cons.eq(coupon_index).css({"display": "block", "clear": "both"});
            }
        });
        _$('.coupon-code li').click(function () {
            var coupon_acli = _$('.coupon-code li').filter('.liactive');
            var coupon_index = _$(this).index();
            var coupon_cons = _$('.coupon-code-content');
            if (coupon_acli[0] != this) {
                coupon_acli.removeClass('liactive');
                _$(this).addClass('liactive');
                coupon_cons.css("display", 'none');
                coupon_cons.eq(coupon_index).css({"display": "block", "clear": "both"});
            }
        });

    }

}])
