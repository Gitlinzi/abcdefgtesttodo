/**
 * Created by Roy on 17/6/29.
 */
'use strict';
angular.module('appControllers').controller('addressCtrl', ['$scope', '$rootScope', '$anchorScroll', '$location', '$interval', "$window", function ($scope, $rootScope, $anchorScroll, $location, $interval, $window) {
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
        $scope.address._getAllAddress();
    })
    $scope._getLayerAddress = _getLayerAddress;
    $scope.toAddNewAddress = false;
    //身份证验证是否正确的标识
    $scope.cardIdErrorMessageFlag = false;
    $scope.showList = [];
    $scope.newAddress = {};
    $scope.multiAddress = {};
    $scope.addressChecked = '';
    $scope.cardIdErrorMessage = '';
    
    // 筛选条件
    $scope.searchList = {
        units: [], //结算单位
        chooseunit: '',
    }

    $scope.isNewaddress=1;
    $scope.showToast = false, // toast提示框
    $scope.ToastTip = '', // 提示文字
    $scope.getSelected = function () { }
    $scope.getUserDetail= function() {
        var url = "/custom-sbd-web/user/getUserDetail.do";
        $rootScope.ajax.postJson(url).then(res=>{
            if(res.code == 0){
                $scope.isNewaddress=(res.data.newAddressIs==1 || res.data.isAdmin==1 ) ? 1:0
            }
            console.log($scope.isNewaddress)
        })
    }

    $scope.getUserDetail();
    // 地址功能相关
    $scope.address = {
        selectedId: 0,
        isEdit: false,
        /**
         * 新增地址
         * @private
         */
        _addNewAddress: function (boo) {
            var address = angular.copy($scope.newAddress);
            var url = "/custom-sbd-web/product/addAddress.do",
                data = {
                    merchantId: $scope.nuits,
                    provinceCode: $scope.newAddress.provinceCode,
                    cityCode: $scope.newAddress.cityCode,
                    regionCode: $scope.newAddress.regionCode,
                    detailAddress: $scope.detailAddress,
                    postCode: $scope.postCode,
                    isDefaultAddress: $scope.address.isDefaultAddress ? 1 : 0,
                };
            $rootScope.ajax.postJson(url, data).then(function (res) {
                if (res.code == 0) {
                    $scope.nuits = '';
                    $scope.newAddress.provinceCode = '';
                    $scope.newAddress.cityCode = '';
                    $scope.newAddress.regionCode = '';
                    $scope.detailAddress = '';
                    $scope.postCode = '';
                    $scope.address.isDefaultAddress = false;
                    $scope.address._getAllAddress();
                }
                if (res.code != 0) {
                    _fnE($scope.i18n('提示'), $scope.i18n(res.message));
                }
            })
        },

        
        /**
         * 获取结算单位
         */
        _getSettlementUnit: function () {
            var url = '/custom-sbd-web/product/getSettlementUnit.do';
            var params = {}
            $rootScope.ajax.postJson(url, params).then(function (res) {
                if (res.code == 0) {
                    $scope.Allnuits = res.data;
                    $scope.searchList.units = res.data;
                } else {
                    _fnE($scope.i18n('提示'), $scope.i18n(res.message));
                }
            });
        },
        _IntendedEffect: function () {
            if($scope.address.isEdit){
                this._updateAddress();
                return;
            }
            this._addNewAddress();
        },

        /**
         * 获取所有地址
         * @param runSaveAddress
         * @private
         */
        _getAllAddress: function (newId) {
            var url = '/custom-sbd-web/product/queryReceiverAddressByPage.do';
            var params = {
                itemsPerPage: $scope.pageSize,
            }
            if(newId){
                $scope.pageNo =1;
                params.currentPage=$scope.pageNo;
            }else {
                params.currentPage=$scope.pageNo;
            }
            if ($scope.searchList.provinceCode) {
                params.provinceCode = $scope.searchList.provinceCode;
            }
            if ($scope.searchList.cityCode) {
                params.cityCode = $scope.searchList.cityCode;
            }
            if ($scope.searchList.detailAddress) {
                params.detailAddress = $scope.searchList.detailAddress;
            }

            $rootScope.ajax.postJson(url, params).then(function (res) {
                if (res.code == 0) {
                    if (res.data !== null) {
                        $scope.totalCount = res.data.total;
                        $scope.totalPage = $scope.totalCount % $scope.pageSize == 0 ? (($scope.totalCount / $scope.pageSize) || 1) : parseInt($scope.totalCount / $scope.pageSize) + 1;

                        $scope.allAddress = res.data.listObj;
                        // if (newId) {
                        //     $scope.address.selectedId = newId;
                        //     $scope.address.storeId = angular.copy($scope.address.selectedId)
                        //     $scope.address._changeSaveAddress(newId);
                        // }
                    }
                } else {
                    _fnE($scope.i18n('提示'), $scope.i18n(res.result));
                }
            });
        },

        /**
         * 删除地址:_deleteAddress
         * @param id
         * @param defaultIs
         * @private
         */
        _deleteAddress: function (id, query) {
            if (query) {
                $scope.deleteData = {
                    bombShow: true,
                    rightText: $scope.i18n('是否删除收货地址') + '？',
                    title: $scope.i18n('删除'),
                    state: 'error',
                    position: 'top',
                    buttons: [
                        {
                            name: $scope.i18n('确定'),
                            className: 'one-button',
                            callback: function () {
                                $scope.deleteData.bombShow = false;
                                $scope.address._deleteAddress(id, false);
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
            var url = "/custom-sbd-web/product/deleteAddress.do",
                data = {
                    addressId: id,
                }

            $rootScope.ajax.postJson(url, data).then(function (res) {
                if (res.code == 0) {
                    $scope.deleteData.bombShow = false;
                    $scope.address._getAllAddress();
                }else {
                    _fnE($scope.i18n('提示'), $scope.i18n(res.message));
                }
            })
        },

        /**
         * 编辑地址:_editAddress
         * @param address
         * @param index
         * @private
         */
        _editAddress: function (address, index) {
            this.invalidSubmit = false;
            $scope.nuits = address.merchantId;
            $scope.addressId = address.addressId;
            $scope.detailAddress = address.detailAddress;
            $scope.postCode = address.postCode;
            $scope.address.isDefaultAddress = address.deft;
            $scope.newAddress.provinceCode = address.provinceCode;
            $scope.newAddress.cityCode = address.cityCode;
            $scope.newAddress.regionCode = address.regionCode;
            $scope.address.isEdit = true;
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
        _changeCardIdErrorMessageFlag: function () {
            $scope.cardIdErrorMessageFlag = false;
        },
        /**
         * 更新地址:_updateAddress
         * @private
         */
        _updateAddress: function (id) {
            var url = "/custom-sbd-web/product/modifyAddress.do",
            data = {
                merchantId: $scope.nuits,
                provinceCode: $scope.newAddress.provinceCode,
                cityCode: $scope.newAddress.cityCode,
                regionCode: $scope.newAddress.regionCode,
                detailAddress: $scope.detailAddress,
                postCode: $scope.postCode,
                isDefaultAddress: $scope.address.isDefaultAddress ? 1 : 0,
                addressId:$scope.addressId
            }
            $rootScope.ajax.postJson(url, data).then(function (res) {
                if (res.code == 0) {
                    $scope.nuits = '';
                    $scope.newAddress.provinceCode = '';
                    $scope.newAddress.cityCode = '';
                    $scope.newAddress.regionCode = '';
                    $scope.detailAddress = '';
                    $scope.postCode = '';
                    $scope.address.isDefaultAddress = false;
                    $scope.address._getAllAddress();
                }
                if (res.code != 0) {
                    _fnE($scope.i18n('提示'), $scope.i18n(res.message));
                }
            })

        },
        /**
         * 更新地址为默认地址:_updateAddress
         * @private
         */

        _updateAddressMo: function (id) {
            var url = "/custom-sbd-web/product/setDefaultAddress.do";
            var params = {
                addressId: id
            }
            $rootScope.ajax.postJson(url, params).then(function (res) {
                if (res.code == 0) {
                    $scope.showToast = true;
                    $scope.ToastTip = '设置默认地址成功！';
                    $scope.address._getAllAddress();
                    var timer = $interval(function () {
                        $scope.showToast = false;
                        $interval.cancel(timer);
                    }, 2000);
                }
            })
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
         * 清除状态:_cleanStatus
         * @private
         */
        _cleanStatus: function () {
            $scope.toAddNewAddress = false;
            $scope.defaultEdit = false;
            $scope.cardIdErrorMessageFlag = false;
            $scope.showList = [];
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

        /**
         * 显示增加新地址:_showAddNewAddress
         * @private
         */
        _showAddNewAddress: function () {
            $scope.toAddNewAddress = true;
            this.invalidSubmit = false;
            $scope.newAddress = {};
            $scope.showList = [];
            $scope.multiAddress.cities = {};
            $scope.multiAddress.regions = {};
            $scope.searchList.provincies = [];
            $scope.searchList.cities = [];
            $scope.searchList.detailAddress = '';
            _getLayerAddress(100000, 1)

        },
        init: function () {
            "use strict";
            this._getAllAddress('init');
            this._showAddNewAddress();
            this._getSettlementUnit()
        },

        // 条件查询
        selectByCondition: function () {
            var that = this;
            // if(!$scope.searchList.chooseunit && !$scope.searchList.provinceCode && !$scope.searchList.cityCode && !$scope.searchList.detailAddress){
            //     _fnE($scope.i18n('提示'),$scope.i18n('请输入查询条件！'));
            //     return;
            // }
            this._getAllAddress();
        },
        resetInfo: function () {
            "use strict";
            $scope.multiAddress.cities = {};
            $scope.multiAddress.regions = {};
            $scope.searchList.provinceCode = ''
            $scope.searchList.cities = [];
            $scope.searchList.cityCode = ''
            $scope.searchList.chooseunit = '';
            $scope.searchList.detailAddress = '';
        },
        /**
         *  设置常用收货地址
         * @param {} id 
         */
        setCommonAddress: function (id) {
            var url = '/custom-sbd-web/product/setCommon.do';
            var params = {
                entityType:2,// entityType 1-收货人，2收货地址，3-发票
                entityId:id
            };
            $rootScope.ajax.postJson(url, params).then(function (res) {
                if (res.code == 0) {
                    $scope.address._getAllAddress();
                } else {
                    _fnE($scope.i18n('提示'), $scope.i18n(res.message));
                }
            });
        },

    };

    /**
     * 获取省份/城市/区县:_getLayerAddress
     * @param code
     * @param layer
     * @param editFlag
     * @private
     */
    function _getLayerAddress(code, layer, editFlag, cb) {
        if (typeof code !== 'undefined' && code !== null) {
            code = (typeof code === 'number') ? code : code.split('_')[1];
            var url = _host + '/location/list/' + code;
            if (code === 84) {
                $scope.newAddress.cityCode = '';
                $scope.newAddress.regionCode = '';
            }
            $rootScope.ajax.getNoKey(url).then(function (res) {
                if (res.data !== null) {
                    if (layer === 1) {
                        $scope.multiAddress.provinces = res.data;
                        $scope.searchList.provincies = res.data;
                        if (editFlag) {
                            angular.forEach($scope.multiAddress.provinces, function (pro) {
                                if ($scope.newAddress.provinceCode == pro.code) {
                                    $scope.newAddress.provinceCode = pro.code;
                                }
                            })
                            _getLayerAddress($scope.newAddress.provinceCode, 2, $scope.newAddress, cb);
                        }
                    }
                    else if (layer === 2) {
                        $scope.multiAddress.cities = res.data;
                        $scope.searchList.cities = res.data;
                        $scope.multiAddress.regions = {};
                        if (editFlag) {
                            angular.forEach($scope.multiAddress.cities, function (city) {
                                if ($scope.newAddress.cityCode == city.code) {
                                    $scope.newAddress.cityCode = city.code
                                }
                            })
                            _getLayerAddress($scope.newAddress.cityCode, 3, $scope.newAddress, cb);
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
                                    $scope.newAddress.regionCode = region.code
                                }
                            })
                        } else {

                            $scope.newAddress.regionCode = '';
                        }
                        if (typeof cb == 'function') {
                            cb();
                        }
                    }
                }else if (code==84){
                    $scope.newAddress.cityCode = '';
                    $scope.newAddress.regionCode = '';
                    $scope.multiAddress.cities = res.data;
                    $scope.multiAddress.regions = {};
                }


            })
        }
    }

}]);
