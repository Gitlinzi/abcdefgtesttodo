/**
 * Created by Roy on 17/6/29.
 */
'use strict';
angular.module('appControllers').controller('receiveAwardCtrl', ["$scope", "$rootScope", "$cookieStore", "commonService", 'categoryService', "validateService", "Upload", "$stateParams","$window",
    function ($scope, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload, $stateParams,$window) {
        //国际化
        $scope.i18n = function (key) {
            return $window.i18n ? $window.i18n(key) : key;
        };
        var _ut = $rootScope.util.getUserToken();
        var urlParams = $stateParams;
        $scope.isEject = false;
        $scope.toAddNewAddress = false;

        var _fnP = $rootScope.ajax.post,
            _fnG = $rootScope.ajax.get,
            _fnE = $rootScope.error.checkCode,
            _host = $rootScope.host,
            _hostU = $rootScope.host_ouser,
            _sid = $rootScope.sessionId,
            _pid = $rootScope.localProvince.province.provinceId,
            _cid = $rootScope.companyId,
            _bType = urlParams.type;

        $scope._getLayerAddress = _getLayerAddress;
        $scope.awardsName = urlParams.awardsName;
        $scope.picUrl = urlParams.picUrl;
        $scope.recordId = urlParams.recordId;

        $scope.newAddress = {};
        $scope.multiAddress = {};
        $scope.addressChecked = '';


        $scope.confirmReceive = function () {
            var params = {
                recordId: $scope.recordId,
                receiver: {
                    receiverId: $scope.address.selectedId
                }
            };
            $rootScope.ajax.postJson('/api/promotion/lottery/save', params).then(function (res) {
                if(res.code == 0){
                    $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n('领取成功'));
                    location.href='#/award';
                }
            });
        }
        // 地址功能相关
        $scope.address = {
            selectedId: 0,

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
                            // provinceId:address.provinceId.toString().split('_')[0],
                            provinceCode: address.provinceCode.toString().split('_')[1],
                            // cityId: address.cityId.toString().split('_')[0],
                            cityCode:address.cityCode.toString().split('_')[1],
                            // regionId: address.regionId.toString().split('_')[0],
                            regionCode: address.regionCode.toString().split('_')[1],
                            detailAddress: address.detailAddress,
                            mobile: address.mobile,
                            // defaultIs: address.defaultIs ? 1 : 0
                        };

                    //判断是否需要添加身份证
                    if ($rootScope.switchConfig.common.showIDCardWhenEditAddress) {
                        data.identityCardNumber = address.userIDcard;
                    }
                    _fnP(url, data).then(function (res) {
                        $scope.newAddress = {};
                        $scope.toAddNewAddress = false;
                        $scope.hideOtherAddress = false;
                        if (res.data) {
                            $scope.address._getAllAddress(res.data);
                        }
                    })
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
                $rootScope.ajax.post(url, data).then(function (res) {
                    if (res.data !== null) {
                        $scope.allAddress = res.data;
                        angular.forEach($scope.allAddress, function (val) {
                            if (val.isDefault = 1) {
                                $scope.address.selectedId = val.id;
                            }
                        })

                    }
                })
            },
            /**
             * 更新地址:_updateAddress
             * @private
             */
            _updateAddress: function (boo, id) {
                var address = angular.copy($scope.newAddress);
                if (boo) {
                    this.invalidSubmit = true;
                } else {
                    // address.defaultIs = address.defaultIs ? 1 : 0;
                    address.provinceCode = address.provinceCode.toString().split('_')[1];
                    address.cityCode = address.cityCode.toString().split("_")[1];
                    address.regionCode = address.regionCode.toString().split("_")[1];
                    // address.provinceId= address.provinceId.toString().split('_')[0];
                    // address.cityId = address.cityId.toString().split('_')[0];
                    // address.regionId = address.regionId.toString().split('_')[0];

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
                        if (id && $scope.newAddress.provinceCode.indexOf(_pid) < 0) $scope.address.selectedId = 0;
                        $scope.address._getAllAddress(thisID);
                        $scope.showList = [];
                        $scope.address._saveReceiver(id);
                    })
                }
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
            _changeSaveAddress: function (id) {
                $scope.address.selectedId = id;
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
                _getLayerAddress(100000, 1)

            }
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
                                _getLayerAddress($scope.newAddress.provinceCode, 2, $scope.newAddress, cb);
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
                                        $scope.newAddress.regionCode += '_' + region.code;
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
