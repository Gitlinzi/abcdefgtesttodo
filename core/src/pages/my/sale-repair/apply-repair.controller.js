/**
 * Created by Roy on 17/6/29.
 */
'use strict';
angular.module('appControllers').controller('applyRepairCtrl', ["$scope", "$rootScope", "$cookieStore", "commonService", 'categoryService', "validateService", "Upload", "$state", "$stateParams","$window",
    function ($scope, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload, $state, $stateParams,$window) {
        //国际化
        $scope.i18n = function (key) {
            return $window.i18n ? $window.i18n(key) : key;
        };
        //公共参数
        var _ut = $rootScope.util.getUserToken(),
            _fnG = $rootScope.ajax.get,
            _fnP = $rootScope.ajax.post,
            _fnE = $rootScope.error.checkCode,
            _host = $rootScope.host,
            _hostU = $rootScope.host_ouser,
            urlParams = $stateParams,
            isModify = (urlParams.returnId || '').length > 0;//修改订单
        $scope._getLayerAddress = _getLayerAddress;
        if (!_ut) {
            $rootScope.showLoginBox = true;
            return;
        }

        $scope.applyRepair = {
            submitBtn: true,
            submitAgain: false,
            orderCode: urlParams.code, //订单号
            repairOrderInfo: {},//初始化维修订单信息
            repairProductInfo: [],//初始化维修商品集合
            repairReasonList: [],//维修原因集合
            returnProductList: [],//需要维修商品集合
            returnProductIdList: [],
            selectReason: {},//维修选中原因
            remark: '',//维修问题描素
            picUrl: [],
            //初始化维修商品信息
            initRepairProduct: function () {
                var that = this,
                    url = '/back-order-web/restful/order/queryApplyMaintainGoodsInfo.do',
                    params = {
                        orderCode: that.orderCode
                    };
                _fnP(url, params).then(function (res) {
                    if (res.code == 0) {
                        that.repairOrderInfo = res.data;
                        that.repairProductInfo = res.data.orderProductList;
                        if (!$.isEmptyObject(that.repairProductInfo)) {
                            angular.forEach(that.repairProductInfo, function (val) {
                                val.repairReturnNum = val.canReturnNumber;
                                if (val.guaranteeDays&&val.guaranteeDays>=0&&val.canReturnNumber >= 1) {
                                    $scope.applyRepair.submitBtn = false;
                                }
                            })
                        }
                        that.getRepairReason();
                    }
                })
            },

            getRepairReason: function () {
                var that = this,
                    url = '/back-order-web/restful/afterSales/queryReturnReason.do',
                    params = {
                        type: 1  //维修类型
                    };
                _fnP(url, params).then(function (res) {
                    if (res.code == 0 && !$.isEmptyObject(res.data.returnReasonVOList)) {
                        that.repairReasonList = res.data.returnReasonVOList;
                        that.selectReason = res.data.returnReasonVOList[0];
                    }
                })
            },

            //参数校验
            //数目输入值格式判断
            checkNum: function (num, max) {
                if (num.match(/^[0-9]{1,3}$/)) {
                    if (parseInt(num) < 1)
                        return 1;
                    if (parseInt(num) > max)
                        return max;
                    return parseInt(num);
                } else {
                    return 1;
                }
            },

            //校验可维修的商品数量
            checkItem: function (pro,flag) {
                //当flag为1时减，为2时加
                if (flag == 2) {
                    if (pro.repairReturnNum < pro.canReturnNumber) {
                        pro.repairReturnNum = pro.repairReturnNum + 1;
                    } else {
                        _fnE($scope.i18n('提示'), $scope.i18n('最多选择')+pro.canReturnNumber+$scope.i18n('个'));
                    }
                } else if (flag == 1) {
                    if (pro.repairReturnNum>1) {
                        pro.repairReturnNum = pro.repairReturnNum - 1;
                    }
                }
            },


            //需要维修的商品
            needRepairProduct: function (pro) {
                if(!pro.guaranteeDays || pro.guaranteeDays < 0 || pro.canReturnNumber < 1){
                    return;
                }
                this.returnProductList[0] = pro;

                //选中的商品
                // if (checked) {
                //     this.returnProductList.push(pro);
                //     this.returnProductIdList.push(mpId);
                // } else {
                //     var position = $.inArray(mpId, this.returnProductIdList);
                //     if (position != -1) {
                //         this.returnProductList.splice(position, 1);
                //         this.returnProductIdList.splice(position, 1);
                //     }
                //
                // }
            },


            repairApply: function () {
                if ($scope.applyRepair.submitBtn) {
                    return;
                }
                if (this.returnProductList && this.returnProductList.length == 0) {
                    _fnE($scope.i18n('提示'), $scope.i18n('请选择要维修的商品'));
                    return;
                }
                if(this.returnProductList && this.returnProductList[0].repairReturnNum == 0){
                    _fnE($scope.i18n('提示'), $scope.i18n('请选择可维修的商品'));
                    return;
                }
                if($.isEmptyObject(this.selectReason)){
                    _fnE($scope.i18n('提示'), $scope.i18n('维修原因不能为空'));
                    return;
                }
                if(this.remark == null || this.remark == undefined || this.remark == ''){
                    _fnE($scope.i18n('提示'), $scope.i18n('问题描述不能为空'));
                    return;
                }
                $scope.applyRepair.submitAgain = true;
                var that = this,
                    picListStr = [],//凭证图片json集合
                    url = '/back-order-web/restful/afterSales/applyMaintainSoReturn.do',
                    repairPro = {
                        soItemId: that.returnProductList[0].id,
                        productNum: that.returnProductList[0].repairReturnNum,
                    },
                    params = {
                        orderCode: that.orderCode,
                        type: 11, //维修类型
                        returnProductListStr: angular.toJson([repairPro]),
                        returnReasonId: that.selectReason.returnReasonId,
                        returnReason: that.selectReason.returnReason,
                        returnRemark: that.remark,
                        picListStr: null,
                        receiverId: $scope.address.selectedAddr.id

                    };
                angular.forEach(that.picUrl, function (val) {
                    var pic = {};
                    pic.url = val;
                    picListStr.push(pic)
                });
                params.picListStr = angular.toJson(picListStr);
                _fnP(url, params).then(function (res) {
                    $scope.applyRepair.submitAgain = false;
                    if (res.code == 0) {
                        location.href = "#/saleRepairProgList"
                    }
                    if(res.code==-1){
                        _fnE($scope.i18n('提示'), $scope.i18n(res.message));
                    }
                },function (res) {
                    $scope.applyRepair.submitAgain = false;
                    _fnE(res.code,res.message||$scope.i18n('系统异常'));
                })
            },
        }

        $scope.repairUpdate = {
            submitAgain: false,
            returnId: urlParams.returnId, //维修单号
            detail: {},//维修单详情
            relationOrders: null,
            remark: '',//维修问题描素
            picUrl: [],
            returnProductList: [],//需要维修商品集合
            //获取维修订单详情
            getRepairDetail: function () {
                var that = this,
                    url = '/back-order-web/restful/afterSales/queryReturnMaintainInfo.do',
                    params = {
                        returnId: that.returnId
                    };
                _fnP(url, params).then(function (res) {
                    if (res.code == 0 && res.data) {
                        that.detail = res.data;
                        that.returnProductList = that.detail.returnItems;
                        that.remark = that.detail.returnRemark;
                        angular.forEach(that.detail.returnPics, function (val) {
                            that.picUrl.push(val.picUrl);
                        });
                        that.getRepairReason();
                    }
                }, function (res) {
                    _fnE($scope.i18n('提示'), $scope.i18n('系统异常'));
                })
            },

            getRepairReason: function () {
                var that = this,
                    url = '/back-order-web/restful/afterSales/queryReturnReason.do',
                    params = {
                        type: 1  //维修类型
                    };
                _fnP(url, params).then(function (res) {
                    if (res.code == 0 && !$.isEmptyObject(res.data.returnReasonVOList)) {
                        that.repairReasonList = res.data.returnReasonVOList;
                        if (that.detail.returnReasonId) {
                            angular.forEach(res.data.returnReasonVOList, function (val) {
                                if (that.detail.returnReasonId == val.returnReasonId) {
                                    that.selectReason = val;
                                }
                            });
                        } else {
                            that.selectReason = res.data.returnReasonVOList[0];
                        }
                    }
                })
            },

            updateRepairApply: function (returnCode) {
                $scope.repairUpdate.submitAgain = true;
                var that = this,
                    picListStr = [],//凭证图片json集合
                    url = '/back-order-web//restful/afterSales/updateSoReturn.do',

                    repairPro = {
                        soItemId: that.returnProductList[0].soItemId,
                        productNum: that.returnProductList[0].returnProductItemNum,
                    },

                    params = {
                        returnCode: returnCode,
                        type: 11, //维修类型
                        returnProductListStr: angular.toJson([repairPro]),
                        returnReasonId: that.selectReason.returnReasonId,
                        returnReason: that.selectReason.returnReason,
                        returnRemark: that.remark,
                        picListStr: null,
                        receiverId: $scope.address.selectedAddr.id

                    };
                angular.forEach(that.picUrl, function (val) {
                    var pic = {};
                    pic.url = val;
                    picListStr.push(pic)
                });
                params.picListStr = angular.toJson(picListStr);
                _fnP(url, params).then(function (res) {
                    $scope.repairUpdate.submitAgain = false;
                    if (res.code == 0) {
                        location.href = "#/applyRepairDetail?returnId=" + urlParams.returnId;
                    }
                }, function(res) {
                    $scope.repairUpdate.submitAgain = false;
                })
            }
        };

        $scope.multiAddress = {};
        $scope.addressLength = true;
        // 地址功能相关
        $scope.address = {

            selectedId: 0,
            selectedAddr: {},
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
                        if (res.code == 0) {
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
                    that = this,
                    data = {
                    }
                $scope.allAddress = [];
                _fnP(url, data).then(function (res) {
                    if (res.data !== null) {
                        $scope.allAddress = res.data;
                        if ($scope.allAddress.length == 0) {
                            $scope.addressLength = true;
                            $scope.receiverNullData = {
                                settleShow: true,
                                settleTips: $scope.i18n('您还没有收货地址') + ',' + $scope.i18n('请新增收货地址'),
                                buttons: [
                                    {
                                        name: $scope.i18n('知道了'),
                                        callback: function () {
                                            $scope.receiverNullData.settleShow = false;
                                        }
                                    }
                                ]
                            }
                        } else {
                            $scope.addressLength = false;
                        }

                        if (newId) {
                            that.selectedAddr = res.data[0];
                            $scope.address._changeSaveAddress(that.selectedAddr);
                        } else {
                            angular.forEach(res.data, function (val) {
                                if (val.isDefault == 1) {
                                    that.selectedAddr = val
                                    $scope.address._changeSaveAddress(val)
                                }
                            })


                        }
                    }
                });
            },

            /**
             * 删除地址:_deleteAddress
             * @param id
             * @param defaultIs
             * @private
             */
            _deleteAddress: function (id, defaultIs) {
                if (angular.isDefined(id) && angular.isDefined(defaultIs)) {
                    this.id = id;
                    this.isDefault = isDefault;
                } else {
                    this.deleted = 1;
                }
                if (!this.deleted) {
                    var that = this;
                    _fnE($scope.i18n('确认'), $scope.i18n('您确定要删除该收货地址吗') + '？', {
                        type: 'confirm',
                        ok: function () {
                            "use strict";
                            that._deleteAddress()
                        }
                    })
                    return;
                }
                this.deleted = 0;
                $scope.toAddNewAddress = false;
                $scope.showList = [];
                var url = _hostU + '/address/deleteAddressForm.do',
                    data = {
                        id: id,
                    }
                _fnP(url, data).then(function (res) {
                    if (res.code == 0) {
                        $scope.address._getAllAddress(res.data);
                    }
                });
            },

            /**
             * 编辑地址:_editAddress
             * @param address
             * @param index
             * @private
             */
            _editAddress: function (address, index) {
                this.invalidSubmit = false;
                $scope.newAddress = {
                    id: address.id,
                    userName: address.userName,
                    detailAddress: address.detailAddress,
                    provinceCode: address.provinceCode,
                    cityCode:address.cityCode,
                    regionCode: address.regionCode,
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

            /**
             * 更新地址:_updateAddress
             * @private
             */
            _updateAddress: function (boo, id) {
                var address = angular.copy($scope.newAddress);
                if (boo) {
                    this.invalidSubmit = true;
                } else {
                    address.provinceCode = address.provinceCode.toString().split('_')[1];
                    address.cityCode = address.cityCode.toString().split("_")[1];
                    address.regionCode = address.regionCode.toString().split("_")[1];
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
                        if (res.code == 0) {
                            $scope.address._getAllAddress(id);
                            $scope.showList = [];
                        }

                    })
                }
            },
            /**
             * 更新地址为默认地址:_updateAddress
             * @private
             */
            _updateAddressMo: function (address, boo, id) {
                var url = "/ouser-center/address/setDefaultUserAddressForm.do";
                var params = {
                    id : address.id
                }
                $rootScope.ajax.post( url , params ).then( function ( res ) {
                    if( res.code == 0 ) {
                        $scope.address._getAllAddress();
                    }
                } )
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
            _changeSaveAddress: function (addr) {
                $scope.address.selectedAddr = addr;
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
        }
        if ($scope.addressLength) {
            $scope.address._getAllAddress();
        }

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

        //申请维修初始化
        if (!isModify) {
            $scope.applyRepair.initRepairProduct();
        } else {
            $scope.repairUpdate.getRepairDetail();
        }
    }]);
