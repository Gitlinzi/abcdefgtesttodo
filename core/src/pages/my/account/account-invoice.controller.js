/**
 * Created by Roy on 17/6/29.
 */
'use strict';
angular.module('appControllers').controller('invoiceCtrl',['$scope','$rootScope',"$window",function($scope,$rootScope,$window){
    var _ut = $rootScope.util.getUserToken();
    //国际化
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
    var _fnE = $rootScope.error.checkCode,
        _host = $rootScope.host,
        _home = $rootScope.home,
        _cid = $rootScope.companyId;
    //初始化翻页, 切换tab的时候也会初始化分页
    $scope.initPagination = function () {
        $scope.pageNo = 1;
        $scope.pageSize = 10;
        $scope.totalCount = 0;
        
    };
    $scope.initPagination();
    //翻页广播接收
    $scope.$on('changePageNo', function (event, data) {
        "use strict";
        $scope.pageNo = data;
        $scope.invoice._getAllInvoice();
    })
    $scope.searchList = {};

    $scope.showToast = false; // toast提示框
    $scope.ToastTip = ''; // 提示文字
    $scope.allInvoice=[];
    $scope.Allnuits=[];

    $scope.invoiceTitleContent = '';
    $scope.defaultInvoice = false;
    
    $scope.invoice= {
        invoiceTitleContent:'',
        nuits:'',
        id:'',
        defaultInvoice:'',
        isEdit:false,

        init:function () {
            "use strict";
            this._getSettlementUnit();
            this.getUserInfoDetail();
        },
        /**
         * 获取发票列表
         * @param {*} data 列表查询数据
         */
        _getAllInvoice:function(data){
            var url = '/custom-sbd-web/invoice/getInvoiceConfigPage.do';
            var params = {
                itemsPerPage : $scope.pageSize,
            };
            if(data){
                $scope.pageNo = 1;
                params.currentPage = $scope.pageNo;
            }else {
                params.currentPage = $scope.pageNo;
            }
            if($scope.searchList.searchinvoiceTitle){
                params.invoiceTitleContent = $scope.searchList.searchinvoiceTitle
            }
            if($scope.searchList.nuits){
                params.merchantId =  $scope.searchList.nuits; 
            }
            $rootScope.ajax.postJson(url, params).then(function (res) {
                if (res.code == 0) {

                   $scope.totalCount = res.data.total;
                    $scope.totalPage = $scope.totalCount % $scope.pageSize == 0 ? (($scope.totalCount / $scope.pageSize) || 1) : parseInt($scope.totalCount / $scope.pageSize) + 1;

                    angular.forEach(res.data.listObj,function(temp){
                        if($scope.invoice.defInvoiceId == temp.id){
                            temp.deft = true; 
                        }else {
                            temp.deft = false; 
                        }
                    })
                    $scope.allInvoice = res.data.listObj;
                }else{
                    _fnE($scope.i18n('提示'),$scope.i18n(res.result));
                }
            });
        },
        /**
         * 获取结算单位
         */
        _getSettlementUnit:function(){
            var url = '/custom-sbd-web/product/getSettlementUnit.do';
            var params = {}
            $rootScope.ajax.postJson(url, params).then(function (res) {
                if (res.code == 0) {
                    $scope.Allnuits = res.data;
                }else{
                    _fnE($scope.i18n('提示'),$scope.i18n(res.result));
                }
            });
        },
        save:function(){
            if($scope.invoice.isEdit){
               this._updateInvoice();
               return;
            }
            this._addInvoice();
        },
        /**
         * 编辑地址:_editAddress
         * @param address
         * @param index
         * @private
         */
        _editAddress: function (address) {
            $scope.invoice.isEdit = true;
            $scope.invoice.invoiceTitleContent = address.invoiceTitleContent;
            $scope.invoice.nuits = address.merchantId;
            $scope.invoice.id = address.id;
            $scope.invoice.defaultInvoice = address.deft;
        },
        // 清除状态
        _cleanStu: function () {
            $scope.invoice.isEdit = false;
            $scope.invoice.invoiceTitleContent = '';
            $scope.invoice.nuits = '';
            $scope.invoice.id = '';
            $scope.invoice.defaultInvoice = false;
        },

        /** 
         *  新增发票
        */
        _addInvoice:function(){
            if(!$scope.invoice.nuits){
                _fnE($scope.i18n('提示'),$scope.i18n('请选择结算单位'));  
                return;
            }
            if(!$scope.invoice.invoiceTitleContent){
                _fnE($scope.i18n('提示'),$scope.i18n('请输入发票抬头'));  
                return; 
            }
            var url = '/custom-sbd-web/invoice/addInvoiceConfig.do';
            var params = {
                invoiceTitleContent:$scope.invoice.invoiceTitleContent,
                merchantId:$scope.invoice.nuits,
                isDef:$scope.invoice.defaultInvoice?1:0,
                invoiceTitleType:2, //1-个人 2-公司
            }
            $rootScope.ajax.postJson(url, params).then(function (res) {
                if (res.code == 0) {
                    $scope.invoice._cleanStu();
                    $scope.invoice.getUserInfoDetail();
                }else{
                    _fnE($scope.i18n('提示'),$scope.i18n(res.message));
                }
            });
        },
        /** 
         *  编辑发票
        */
       _updateInvoice:function(){
        var url = '/custom-sbd-web/invoice/editInvoiceConfig.do';
        var params = {
            invoiceTitleContent:$scope.invoice.invoiceTitleContent,
            merchantId:$scope.invoice.nuits,
            id:$scope.invoice.id,
            isDef:$scope.invoice.defaultInvoice?1:0,
        }
        $rootScope.ajax.postJson(url, params).then(function (res) {
            if (res.code == 0) {
                _fnE($scope.i18n('提示'),$scope.i18n('操作成功'));
                $scope.invoice._cleanStu();
                $scope.invoice.getUserInfoDetail();
            }else{
                _fnE($scope.i18n('提示'),$scope.i18n(res.message));
            }
        });
    
        },
        /**
         * 设置默认发票
         */
        _setDefaultInvoice:function(InvoiceId){
            var url = '/custom-sbd-web/invoice/setDefaultInvoiceConfig.do';
            var params = InvoiceId;
            $rootScope.ajax.postJson(url, params).then(function (res) {
                if (res.code == 0) {
                    $scope.invoice.getUserInfoDetail();
                }else{
                    _fnE($scope.i18n('提示'),$scope.i18n(res.message));
                }
            });
        },
        /**
         *  设置常用发票
         * @param {} id 
         */
        setCommonAddress:function (id) {
            var url = '/custom-sbd-web/product/setCommon.do';
            var params = {
                entityType:3,// entityType 1-收货人，2收货地址，3-发票
                entityId:id
            };
            $rootScope.ajax.postJson(url, params).then(function (res) {
                if (res.code == 0) {
                    $scope.invoice._getAllInvoice();
                } else {
                    _fnE($scope.i18n('提示'), $scope.i18n(res.message));
                }
            });
        },
        // 获取个人信息
        getUserInfoDetail:function(){
            var url = '/custom-sbd-web/user/getUserDetail.do',
                params ='';
            $rootScope.ajax.postJson(url, params).then(function (result) {
                if (result.code == 0) {
                    // isAdmin:1-是管理员，0-不是管理员
                    $scope.isAdmin = result.data.isAdmin == 1?true:false;
                    $scope.invoice.defInvoiceId = result.data.defInvoiceId;
                    $scope.invoice._getAllInvoice();
                } else {
                    _fnE($scope.i18n('提示'), $scope.i18n(result.message));
                }
            })
        },

        // 条件查询
        selectByCondition:function(){
            // if(!that.title && !that.terminal && !that.createTimeStart && !that.createTimeEnd){
            //     _fnE($scope.i18n('提示'),$scope.i18n('请输入查询条件！'));
            //     return;
            // }
            $scope.invoice._getAllInvoice(true)
        },
        resetInfo: function(){
            "use strict";
            $scope.searchList.searchinvoiceTitle = '';
            $scope.searchList.nuits = '';
        },
        getSelected:function(){},
        /**
         * 删除发票:_deleteAddress
         * @param id
         * @param defaultIs
         * @private
         */
        _deleteAddress: function (id, query) {
            if (query) {
                $scope.deleteData = {
                    bombShow: true,
                    rightText: $scope.i18n('是否删除发票') + '？',
                    title: $scope.i18n('删除'),
                    state: 'error',
                    position: 'top',
                    buttons: [
                        {
                            name: $scope.i18n('确定'),
                            className: 'one-button',
                            callback: function () {
                                $scope.deleteData.bombShow = false;
                                $scope.invoice._deleteAddress(id, false);
                            }
                        },
                        {
                            name: $scope.i18n('取消'),
                            className: 'two-button',
                            callback: function () {
                                $scope.deleteData.bombShow = false;
                            }
                        }
                    ]
                }
                return;
            }
            var url = "/custom-sbd-web/invoice/delInvoiceConfig.do",
                data = id;

            $rootScope.ajax.postJson(url, data).then(function (res) {
                if (res.code == 0) {
                    $scope.deleteData.bombShow = false;
                    $scope.invoice.getUserInfoDetail();
                }else {
                    _fnE($scope.i18n('提示'), $scope.i18n(res.message));
                }
            })
        },
    };
        
}]);
