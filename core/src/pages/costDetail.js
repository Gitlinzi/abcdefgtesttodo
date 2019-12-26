appControllers.controller("indexCtrl", ['$filter','$log', '$rootScope', '$scope', 'commonService', 'categoryService', "$cmsData","$window","$compile","Upload",function ($filter,$log, $rootScope, $scope, commonService,categoryService,$cmsData,$window,$compile,Upload) {
    'use strict';
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
    $scope.bgColor = $cmsData.pageInfo ? ($cmsData.pageInfo.bgColor? $cmsData.pageInfo.bgColor: '#f8f8f8') : '#f8f8f8';
    //国际化
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
    var urlParams = $rootScope.util.paramsFormat(location.search);
    //订单信息
    $scope.order = [];
    //查询订单详情
    $scope.userdetail={};
    $scope.invoiceId = ''
    $scope.userId = ''
    // 上传文件
    $scope.upload = function () {
        if (!$scope.userdetail.fileUrl) {
            return;
        }
        Upload.upload({
            url: "/api/fileUpload/putObjectWithForm", //图片上传接口的url
            data: {
                file: $scope.userdetail.fileUrl
            }
        }).success(function (res) {
            if (res.code == 0) {
                $scope.userdetail.fileUrl = res.data.filePath;
            }
        }).error(function (res) {
            $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n(res.message));
        });
    },
    $scope.getuserinfo = function(){
        var url = '/custom-sbd-web/approvaOrder/queryOrderInfo.do';
        var params = {
            orderCode:urlParams.orderCode
        }
        $rootScope.ajax.postJson(url,params).then(res=>{
            if(res.code==0){
                $scope.userdetail = res.data;
                $scope.getflow();
                //回显收货人
            if ($scope.userdetail.goodReceiverPersonId){
                var url = '/custom-sbd-web/product/getCommonReceiverList.do';
                var params = {
                    receiverId : $scope.userdetail.goodReceiverPersonId
                }
                $rootScope.ajax.postJson(url,params).then(res=>{
                    if(res.code == 0){
                    $scope.consignee = res.data;
                }
            });
            }

            //因需要回显收货地址  在这里就要请求到地址列表
                if($scope.userdetail.goodReceiverAddressId){
                    var url = '/custom-sbd-web/product/getReceiverAddressList.do';
                    var params = {
                        receiverId : $scope.userdetail.goodReceiverAddressId
                    }
                    $rootScope.ajax.postJson(url,params).then(res=>{
                        if(res.code == 0){
                            $scope.addressList = res.data;
                        }
                    });
                }
                //根据查询到的订单号 调以前的详情老接口；
                var url2 = '/oms-api/order/so/getOrderDetailByCodePro';
                var params2 = {
                    // t: new Date().getTime(),
                    orderCode: $scope.userdetail.orderCode,
                }
                $rootScope.ajax.get(url2, params2).then(res=>{
                    if(res.code==0){
                        $scope.order = res.data;
                        $scope.userdetail.goodReceiverMobile = $scope.order.receiverPerson && $scope.order.receiverPerson.mobile
                        $scope.userId = res.data.userId
                        $scope.getallprice()
                        $scope.getallnum()
                        $scope.getallroad();
                        $scope.getcostList();
                        $scope.getmerchant();
                    }
                })
            }
        })
    }
    $scope.getuserinfo()
    // $scope.userinfo = {};
    // var urlParams = $stateParams;//获取到url后面的参数  需要用户id和订单id
   //获取当前用户的成本中心列表
   $scope.costList = [];
   $scope.getcostList = function(){
       var url = '/custom-sbd-web/advCostCenter/getCostCenterByUserId.do';
    //    var params = '19031208230459'
       var params = $scope.userdetail.userId;
       $rootScope.ajax.postJson(url,params).then(res=>{
           if(res.code == 0){
               $scope.costList = res.data;
           }else {
            $rootScope.error.checkCode(res.code, res.message);
           }
       })
   }

   //选完收货地址之后需要数组；
   $scope.authorization={}
   //拿到merchantid查询到发票抬头
   $scope.invoiceList = [];
   $scope.getmerchant = function(){
            // res.data.merchantId
            var url= '/custom-sbd-web/invoice/getInvoiceConfigListByUserId.do';
            var params = $scope.userdetail.userId;
            $rootScope.ajax.postJson(url,params).then(res=>{
                if(res.code==0 && res.data){
                    $scope.invoiceList=res.data;
                    for(let i=0;i<res.data.length;i++) {
                        if(res.data[i].invoiceTitleContent === $scope.userdetail.invoiceTitleContent) {
                            $scope.invoiceId = res.data[i].id
                        }
                    }
                }else{
                    $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n(res.message));
                }
            })
   }

   //获取到审批流程
   $scope.flowList = [];
   $scope.getflow = function(){
       var url = '/custom-sbd-web/approval/queryApproveFlow.do';
       var params = {
           orderCode: urlParams.orderCode
       }
       $rootScope.ajax.postJson(url,params).then(res=>{
           if(res.code==0){
                $scope.flowList = res.data;

           }else{
            $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n(res.result));
           }
       })
   }
   //操作审批单
   $scope.operate = function(type){

       if(!$scope.userdetail.costName){
            $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n('请选择成本中心'));
            return;
       }
       if(!$scope.userdetail.goodReceiverPersonId){
            $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n('请选择收货人'));
            return;
       }
       if(!$scope.userdetail.goodReceiverAddressId){
            $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n('请选择收货地址'));
            return;
       }
       var url = '/custom-sbd-web/approval/approveOrder.do';
       var params = {
        id:urlParams.id,
        "approvalStatus":type,
       } 
       $rootScope.ajax.postJson(url,params).then(res=>{

           if(res.code==0){
            location.href = '/home.html#/authorization'
           }else {
            $rootScope.error.checkCode(res.code, res.data);
           }
       })
   }
   //获取常用收货人列表
   $scope.consignee = [];
   $scope.getconsignee=function(){
       var url = '/custom-sbd-web/product/getCommonReceiverList.do';
       var params = {};
       $rootScope.ajax.postJson(url,params).then(res=>{
           if(res.code==0){
               angular.forEach(res.data,item=>{
                   item.value = item.id;
               })
               console.log(res.data);
               $scope.consignee = res.data;
           }
       })
   }
   $scope.getconsignee()
    //收货地址的列表
    $scope.addressList = [];
   $scope.selectlist = function(id){
       console.log(id)
    //    $scope.$apply(function(){
        var zs = $scope.consignee.filter(item=>{
            return item.id == id
        })
        console.log(zs)
        $scope.userdetail.goodReceiverTel = zs[0].telephone;
        $scope.userdetail.goodReceiverTel2 = zs[0].telephone2;
        $scope.userdetail.goodReceiverMobile = zs[0].mobile;
    //    })
      
        var url = '/custom-sbd-web/product/getReceiverAddressList.do';
        var params = {
         receiverId : id
        }
        $rootScope.ajax.postJson(url,params).then(res=>{
            if(res.code == 0){
                $scope.addressList = res.data;
            }
        }) 
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
    //获取发货时间
    $scope.gettime = function(id){

        var zs = $scope.addressList.filter(item=>{
            return item.addressId==id
        })
        
        var url = 'custom-sbd-web/advEstimeateDeliveryTime/queryFront.do';
        var params = {
            districtCode:zs[0].regionCode,
            provinceCode:zs[0].provinceCode,
            cityCode:zs[0].cityCode,
        }

        $rootScope.ajax.postJson(url,params).then(res=>{
            if(res.code==0){
                
                if (res.data.orderDeliveryTimeStr) {
                    $scope.userdetail.shipmentDate = res.data.orderDeliveryTimeStr;
                }else{
                    $scope.userdetail.shipmentDate = $filter('date')(new Date(+new Date() + 3 * 24 * 60 * 60 * 1000),'yyyy-MM-dd')
                }

            }else {
                $rootScope.error.checkCode(res.code, res.data);
            }
        })
    }
    //获取全路径
    $scope.allroad = [];
    $scope.getallroad = function(){
    var url2 = '/custom-sbd-web/advCostCenter/getCostCenterFullPathProById.do'
    var params2 = $scope.userdetail.costCenterId;
    $rootScope.ajax.postJson(url2,params2).then(res=>{
        if(res.code==0){
            $scope.allroad = []
            $scope.allroad.push(res.data.costName)
            if(res.data.childAdvCostCenterVoList&&res.data.childAdvCostCenterVoList.length>0){
                $scope.allroad.push(res.data.childAdvCostCenterVoList[0].costName);
                if(res.data.childAdvCostCenterVoList[0].childAdvCostCenterVoList&&res.data.childAdvCostCenterVoList[0].childAdvCostCenterVoList.length>0){
                    $scope.allroad.push(res.data.childAdvCostCenterVoList[0].childAdvCostCenterVoList[0].costName)
                    if(res.data.childAdvCostCenterVoList[0].childAdvCostCenterVoList[0].childAdvCostCenterVoList&&res.data.childAdvCostCenterVoList[0].childAdvCostCenterVoList[0].childAdvCostCenterVoList.length>0){
                        $scope.allroad.push(res.data.childAdvCostCenterVoList[0].childAdvCostCenterVoList[0].childAdvCostCenterVoList[0].costName)
                    }
                }
            }
            $scope.allroad=res.data.costNames;
            console.log($scope.allroad)
        }
    })
    }

    $scope.editNumCtrl = true;
       // 改变数量 加号
       $scope.increase = function (event, product,editNumCtrl) {
        if(!$scope.editNumCtrl){
            return;
        }

            var currentElement = angular.element(event.currentTarget);
            var num = currentElement.prev().val() * 1 + 1;
            //跟踪云
            try{
                window.eventSupport.emit('heimdallTrack',{
                    ev: "14",
                    pri: product.mpId,
                    pvi: product.mpId,
                    prm: num,
                    prn: product.name,
                    pt: product.categoryName||'',
                    pti: product.categoryId||'',
                    bn: product.brandName||'',
                    bni: product.brandId||'',
                    prp: product.availablePrice
                });
            }catch(err){
                //console.log(err);
            }
            // if(num > product.stockNum){
            //     currentElement.prev().val(product.num);
            // }else{
                product.productItemNum=num
                // $scope.editNumCtrl = false;
                $scope.getallprice()
                $scope.getallnum()
            // $scope.delayChangeNum(currentElement, product, num);
        // }


    };

    // 改变数量 减号
    $scope.decrease = function (event, product,editNumCtrl) {
        // if(!$scope.editNumCtrl){
        //     return;
        // }
        var currentElement = angular.element(event.currentTarget);
        var currentNum = currentElement.next().val();
        //跟踪云
        try{
            window.eventSupport.emit('heimdallTrack',{
                ev: "12",
                pri: product.mpId,
                pvi: product.mpId,
                prm: currentNum,
                prn: product.name,
                pt: product.categoryName||'',
                pti: product.categoryId||'',
                bn: product.brandName||'',
                bni: product.brandId||'',
                prp: product.availablePrice
            });
        }catch(err){
            //console.log(err);
        }
        //数量不可小于1
        if (currentNum <= 1) {
            return;
        }else{
            // $scope.editNumCtrl = true;
        }
        var num = currentElement.next().val() * 1 - 1;
        product.productItemNum = num;
        $scope.getallprice()
        $scope.getallnum()
        // $scope.delayChangeNum(currentElement, product, num);
    };
    //改变数量
    $scope.changeNum = function(){
        $scope.getallprice()
        $scope.getallnum()
    }
    //动态计算所有的价格
    $scope.allprice = 0;
    $scope.getallprice = function(){
        $scope.allprice = 0;
        angular.forEach($scope.order.orders[0].items,item=>{
            $scope.allprice=$scope.allprice + item.productPriceFinal * item.productItemNum
        })
    }
    //动态计算所有商品的数量
    $scope.allnum = 0;
    $scope.getallnum = function(){
        $scope.allnum = 0;
        angular.forEach($scope.order.orders[0].items,item=>{
           $scope.allnum = $scope.allnum +  item.productItemNum;
        })
    }
    //保存修改订单
    $scope.saveEdit = function(){
        var url = '/custom-sbd-web/order/updateApproveDetail.do';
        var so = {
            orderCode:$scope.userdetail.orderCode,
            costCenterId:$scope.userdetail.costCenterId,
            goodReceiverPersonId:$scope.userdetail.goodReceiverPersonId,
            goodReceiverAddressId:+$scope.userdetail.goodReceiverAddressId,
            expectDeliverDate:$scope.userdetail.shipmentDate,
            proxyReceiverName:$scope.userdetail.proxyReceiverName,
            proxyReceiverMobile:$scope.userdetail.proxyReceiverMobile,
            orderRemarkUser:$scope.order.orders[0].RemarkUser,
            orderPaymentType:$scope.order.orderPaymentType,
        }
        var soItems = [];
      angular.forEach($scope.order.orders[0].items,item=>{
         var zs = {
            'mpId':item.mpId,
            'productItemNum':item.productItemNum,
            'productPriceSale':item.productPriceSale,
            'productPriceFinal': item.productPriceFinal
        }
        soItems.push(zs)
      })  
      var soInvoice = {
        isNeed:1,
        invoiceType:$scope.userdetail.invoiceType,
        invoiceTitleContent:$scope.userdetail.invoiceTitleContent,
        poCode:$scope.userdetail.poCode,
        poAmountFax:$scope.userdetail.poAmountFax,
        poAmount:$scope.userdetail.poAmount,
        fileUrl:$scope.userdetail.fileUrl,
        invoiceId: $scope.invoiceId,
        userId: $scope.userId
      }
        var params = {
            so:so,
            soItems:soItems,
            soInvoice:soInvoice,
        }
        
        $rootScope.ajax.postJson(url,params).then(res=>{
            console.log(params)
            if(res.code==0){
                $rootScope.error.checkCode(res.code, res.message);
                location.href = '/home.html#/authorization'
            }else {
                console.log(params)
                $rootScope.error.checkCode(res.code, res.message);
            }
        })
    }
}]);
$(function () {
    'use strict'
    //置顶
    $('.top-box').click(function () {
        $("html,body").animate({
            scrollTop: 0
        }, 500);
    })
})