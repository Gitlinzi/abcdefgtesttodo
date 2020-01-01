/**
 * Created by Roy on 17/6/29.
 */ 
'use strict';
angular.module('appControllers').controller('consigneeCtrl', ['$scope', '$rootScope', '$anchorScroll', '$location', '$interval', "$window", function ($scope, $rootScope, $anchorScroll, $location, $interval, $window) {
    $location.hash();
    $anchorScroll();
    $scope.showNoIcon = false;
    var _ut = $rootScope.util.getUserToken();
    if (!_ut) {
        $rootScope.showLoginBox = true;
        return;
    };
    //国际化
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
    var _fnG = $rootScope.ajax.get,
        _fnP = $rootScope.ajax.post,
        _fnE = $rootScope.error.checkCode,
        _host = $rootScope.host,
        _hostU = $rootScope.host_ouser,
        _sid = $rootScope.sessionId,
        _pid = $rootScope.localProvince.province.provinceId,
        urlParams = $rootScope.util.paramsFormat(location.search),
        _bType = urlParams.type,
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
        $scope.consignee._getAllAddress();
    })

    // 筛选条件
    $scope.searchList = {},
    $scope.showToast = false, // toast提示框
    $scope.ToastTip = '', // 提示文字
    

    $scope.consignee = {
        isEdit: false,
        id :'',
        telephone  :'',
        telephoneExt :'',
        email :'',
        mobile :'',
        fax :'',
        receiverDeft:false,
        receiverName :'',
        _IntendedEffect : function () {
            var mobileReg = /^0?(13[0-9]|15[012356789]|17[0135678]|18[0-9]|14[57])[0-9]{8}$/;
            var emailReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
            var faxReg = /^(\d{3,4}-)?\d{7,8}$/;
            var telephoneReg = /^([0-9]{3,4}-)?[0-9]{7,8}$/;

            // if ($scope.consignee.fax == null || $scope.consignee.fax == '') {
            //     _fnE($scope.i18n('提示'), $scope.i18n('请填写完整信息后保存'));
            //     return;
            // }

            if ($scope.consignee.telephone == null || $scope.consignee.telephone == '') {
                _fnE($scope.i18n('提示'), $scope.i18n('请填写完整信息后保存'));
                return;
            }

            if ($scope.consignee.telephone) {
                if (!telephoneReg.test($scope.consignee.telephone)) {
                    _fnE($scope.i18n('提示'), $scope.i18n('固定电话格式错误!'));
                    return;
                }
            }
            if ($scope.consignee.telephone2) {
                if (!telephoneReg.test($scope.consignee.telephone2)) {
                    _fnE($scope.i18n('提示'), $scope.i18n('固定电话2格式错误!'));
                    return;
                }
            }
            if ( $scope.consignee.fax != null && $scope.consignee.fax != '' && !faxReg.test($scope.consignee.fax)) {
                _fnE($scope.i18n('提示'), $scope.i18n('传真格式错误!'));
                return;
            }
            // if ($scope.consignee.email == null || $scope.consignee.email == '') {
            //     _fnE($scope.i18n('提示'), $scope.i18n('请填写完整信息后保存'));
            //     return;
            // }

            if (!emailReg.test($scope.consignee.email)&& $scope.consignee.email != '' && $scope.consignee.email != NULL) {
                _fnE($scope.i18n('提示'), $scope.i18n('邮箱格式错误!'));
                return;
            }
            if ($scope.consignee.mobile == null || $scope.consignee.mobile == '') {
                _fnE($scope.i18n('提示'), $scope.i18n('请填写完整信息后保存'));
                return;
            }
            if (!mobileReg.test($scope.consignee.mobile)) {
                _fnE($scope.i18n('提示'), $scope.i18n('手机号格式错误!'));
                return;
            }
            if ($scope.consignee.receiverName == null || $scope.consignee.receiverName == '') {
                _fnE($scope.i18n('提示'), $scope.i18n('请填写完整信息后保存'));
                return;
            }
    
            if ($scope.consignee.isEdit) {
                $scope.consignee._updateAddress();
                return;
            }
            $scope.consignee._addNewAddress();
        },
        /**
        * 新增收货人
        * @private
        */
        _addNewAddress : function () {
            var url = "/custom-sbd-web/product/addReceiver.do",
                data = {
                    telephone: $scope.consignee.telephone,
                    telephone2: $scope.consignee.telephone2,
                    telephoneExt: $scope.consignee.telephoneExt,
                    telephoneExt2: $scope.consignee.telephoneExt2,
                    email: $scope.consignee.email,
                    mobile: $scope.consignee.mobile,
                    fax: $scope.consignee.fax,
                    receiverDeft: $scope.consignee.receiverDeft,
                    receiverName: $scope.consignee.receiverName,
                };
            $rootScope.ajax.postJson(url, data).then(function (res) {
                if (res.code == 0) {
                    $scope.consignee._getAllAddress();
                    $scope.consignee._cleanStatus();
                }
                if (res.code != 0) {
                    _fnE($scope.i18n('提示'), $scope.i18n(res.message));
                }
            })
        },
        /**
         * 更新收货人:_updateAddress
         * @private
         */
        _updateAddress : function () {
            var url = "/custom-sbd-web/product/modifyReceiver.do",
                data = {
                    receiverId:$scope.consignee.id,
                    telephone: $scope.consignee.telephone,
                    telephone2: $scope.consignee.telephone2,
                    telephoneExt: $scope.consignee.telephoneExt,
                    telephoneExt2: $scope.consignee.telephoneExt2,
                    email: $scope.consignee.email,
                    mobile: $scope.consignee.mobile,
                    fax: $scope.consignee.fax,
                    receiverDeft: $scope.consignee.receiverDeft,
                    receiverName: $scope.consignee.receiverName,
                }
            $rootScope.ajax.postJson(url, data).then(function (res) {
                if (res.code == 0) {
                    _fnE($scope.i18n('提示'), $scope.i18n('修改成功'));
                    $scope.consignee._cleanStatus();
                    $scope.consignee._getAllAddress();
                }
                if (res.code != 0) {
                    _fnE($scope.i18n('提示'), $scope.i18n(res.message));
                }
            })
    
        },
        /**
        * 获取所有收货人
        * @private
        */
        _getAllAddress:function (data) {
            var url = '/custom-sbd-web/product/getReceiverListPage.do';
            var params = {
                itemsPerPage: $scope.pageSize,
            }
            if (data) {
                $scope.pageNo = 1;
                params.currentPage = $scope.pageNo;
            } else {
                params.currentPage = $scope.pageNo;
            }
            if ($scope.searchList.receiverName) {
                params.receiverName = $scope.searchList.receiverName
            }
            if ($scope.searchList.mobile) {
                params.moblie = $scope.searchList.mobile;
            }
            $rootScope.ajax.postJson(url, params).then(function (res) {
                if (res.code == 0) {
                    if (res.data !== null) {

                        $scope.totalCount = res.data.total;
                        $scope.totalPage = $scope.totalCount % $scope.pageSize == 0 ? (($scope.totalCount / $scope.pageSize) || 1) : parseInt($scope.totalCount / $scope.pageSize) + 1;

                        $scope.Allconsignee = res.data.listObj;
                    }
                } else {
                    _fnE($scope.i18n('提示'), $scope.i18n(res.message));
                }
            })
        },
        /**
         * 清除状态:_cleanStatus
         * @private
         */
        _cleanStatus:function () {
            $scope.consignee.telephone ='';
            $scope.consignee.telephone2 ='';
            $scope.consignee.telephoneExt ='';
            $scope.consignee.telephoneExt2 ='';
            $scope.consignee.email ='';
            $scope.consignee.mobile ='';
            $scope.consignee.fax ='';
            $scope.consignee.receiverDeft = false;
            $scope.consignee.receiverName ='';
            $scope.consignee.isEdit = false;
        },
        /**
         * 删除地址:_deleteAddress
         * @param id
         * @param defaultIs
         * @private
         */
        _deleteAddress:function (id, query) {
            if (query) {
                $scope.deleteData = {
                    bombShow: true,
                    rightText: $scope.i18n('是否删除收货人信息') + '？',
                    title: $scope.i18n('删除'),
                    state: 'error',
                    position: 'top',
                    buttons: [
                        {
                            name: $scope.i18n('确定'),
                            className: 'one-button',
                            callback: function () {
                                $scope.deleteData.bombShow = false;
                                $scope.consignee._deleteAddress(id, false);
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
            var url = "/custom-sbd-web/product/deleteReceiver.do",
                data = {
                    receiverId: id,
                }
    
            $rootScope.ajax.postJson(url, data).then(function (res) {
                if (res.code == 0) {
                    $scope.consignee._getAllAddress();
                } else {
                    _fnE($scope.i18n('提示'), $scope.i18n(res.message));
                }
            })
        },
        
        
        // 获取个人信息
        getUserInfoDetail:function(){
            var url = '/custom-sbd-web/user/getUserDetail.do',
                params ='';
            $rootScope.ajax.postJson(url, params).then(function (result) {
                if (result.code == 0) {
                    // isAdmin:1-是管理员，0-不是管理员
                    $scope.isAdmin = result.data.isAdmin == 1? true:false;
                } else {
                    _fnE($scope.i18n('提示'), $scope.i18n(result.message));
                }
            })
        },
        /**
         * 更新地址为默认地址:_updateAddress
         * @private
         */
        _updateAddressMo:function (id) {
            var url = "/custom-sbd-web/product/setDefaultReceiver.do";
            var params = {
                receiverId: id
            }
            $rootScope.ajax.postJson(url, params).then(function (res) {
                if (res.code == 0) {
                    $scope.showToast = true;
                    $scope.ToastTip = '设置默认地址成功！';
                    $scope.consignee._getAllAddress();
                    var timer = $interval(function () {
                        $scope.showToast = false;
                        $interval.cancel(timer);
                    }, 2000);
                }
            })
        },
        resetInfo :function () {
            "use strict";
            $scope.searchList.receiverName = '';
            $scope.searchList.mobile = ''; 
        },
        /**
         *  设置常用收货地址
         * @param {} id 
         */
        setCommonAddress:function (id) {
            var url = '/custom-sbd-web/product/setCommon.do';
            var params = {
                entityType:1,// entityType 1-收货人，2收货地址，3-发票
                entityId:id
            };
            $rootScope.ajax.postJson(url, params).then(function (res) {
                if (res.code == 0) {
                    $scope.consignee._getAllAddress();
                } else {
                    _fnE($scope.i18n('提示'), $scope.i18n(res.message));
                }
            });
        },
        /**
         * 编辑地址:_editAddress
         * @param address
         * @private
         */
        _editAddress : function (address) {
            $scope.consignee.id = address.id;
            $scope.consignee.isEdit = true;
            $scope.consignee.telephone = address.telephone;
            $scope.consignee.telephoneExt =address.telephoneExt;
            $scope.consignee.telephone2 = address.telephone2;
            $scope.consignee.telephoneExt2 =address.telephoneExt2;
            $scope.consignee.email = address.email;
            $scope.consignee.mobile = address.mobile;
            $scope.consignee.fax = address.fax;
            $scope.consignee.receiverDeft = address.deft == 1? true : false;
            $scope.consignee.receiverName = address.receiverName ;
        },
        //保存地址 跳转至订单页
        _saveReceiver: function (receiverId) {
            var url = _host + '/checkout/saveReceiver',
                data = {
                    receiverId: receiverId,
                    businessType: _bType,
                    areaCode: $rootScope.util.getCookies("areasCode") ? JSON.parse($rootScope.util.getCookies("areasCode")).oneCode : $rootScope.defaultAreasCode
                };
            _fnP(url, data).then(function (res) {
            })
        },
        /**
         * 保存用户选择的地址:_changeSaveAddress
         * @param id
         * @private
         */
        _changeSaveAddress: function (id) {
            var url = _host + '/checkout/saveReceiver',
                data = {
                    receiverId: id,
                    sessionId: _sid,
                    provinceId: _pid,
                    companyId: _cid,
                    businessType: _bType,
                    areaCode: $rootScope.util.getCookies("areasCode") ? JSON.parse($rootScope.util.getCookies("areasCode")).oneCode : $rootScope.defaultAreasCode
                }

            $rootScope.ajax.post(url, data).then(function (res) {
                $scope.address.storeId = angular.copy($scope.address.selectedId);
            }, function (res) {
                $scope.address.selectedId = $scope.address.storeId;
                if ($scope.merchantProductList.receiver != null) {
                    $scope.address.selectedId = $scope.merchantProductList.receiver.receiverId || 0;
                }
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

        
        init: function () {
            "use strict";
            $scope.consignee._getAllAddress();
            $scope.consignee.getUserInfoDetail();
        },

        // 条件查询
        selectByCondition: function () {
            var that = this;
            // if(!$scope.searchList.chooseunit && !$scope.searchList.provinceCode && !$scope.searchList.cityCode && !$scope.searchList.detailAddress){
            //     _fnE($scope.i18n('提示'),$scope.i18n('请输入查询条件！'));
            //     return;
            // }
            $scope.consignee._getAllAddress(true);
        },
    };
}]);
