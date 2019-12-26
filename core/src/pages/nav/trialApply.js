/**
 * Created by sindy on 15/11/4.
 */

appControllers.controller("trialApplyCtrl", ['$log', '$rootScope', '$scope', '$cookieStore', 'commonService', 'config','$window',
    function ($log, $rootScope, $scope, $cookieStore, commonService, config,$window) {
    //国际化
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
    var _ut = $rootScope.util.getUserToken(),
        _fnG = $rootScope.ajax.get,
        _fnP = $rootScope.ajax.post,
        _fnE = $rootScope.error.checkCode,
        _host = $rootScope.host,
        _hostU = $rootScope.host_ouser;
    //默认省份与迷你购物车
    $rootScope.execute(true);
    if (!_ut) {
        $rootScope.showLoginBox = true;
        return;
    }
    $scope._getLayerAddress = _getLayerAddress;

    //分类面包屑
    $scope.trialDetail = {
        crumbList: [],//面包屑
        trialInfo: null,
        limitNum: 0,
        getTrialDetail: function () {
            var url = _host+'/social/trialActivity/trialMpInfo.do',
                that = this,
                params = $rootScope.util.paramsFormat();
            $rootScope.ajax.postJson(url, params).then(function (res) {
               if(res.code == 0){
                   that.getTotalLimit();
                   that.getData();
                   that.trialInfo = res.data;
                   if (that.trialInfo.categoryId){
                       that.crumbList = [];
                       that.getPreadCrumb(that.trialInfo.categoryId);
                   }
               }
            }, function (res) {
                _fnE($scope.i18n('提示'), $scope.i18n('系统异常'));
            });
        },
        getData: function () {
            var url = _host +'/realTime/getTimestamp',
                params = {
                    clearCacheAddTimeStamp:new Date().getTime()
                };
            _fnG(url,params).then(function (res) {
                if(res.code == 0){
                    $scope.nowTime = res.data.timestamp;
                }
            })
        },

        getPreadCrumb: function (categoryId) {
            var that = this;
            var url = '/back-product-web2/extra/category/listChildrenCategoryWithNologin.do',
                params = {
                    categoryIds : [categoryId]
                };
            $rootScope.ajax.postJson(url,params).then(function (res) {
                if (res.data  && res.data.length > 0 ) {
                    let categoryIdArr = res.data[0].fullIdPath.replace(/-/g, ',').split(',');
                    let categoryNameArr = res.data[0].fullNamePath.replace(/-/g,',').split(',');
                    if( categoryIdArr && categoryIdArr.length > 0 ) {
                        for( let o = 0 ; o < categoryIdArr.length ; o++ ) {
                            that.crumbList.push( { 'categoryId' : categoryIdArr[o] , 'categoryName' : categoryNameArr[o] } );
                        }
                    }
                }
            });

        },

        getTotalLimit: function () {
            var url = _host + "/promotion/limitInfo",
                that = this,
                params = {
                    promotionIds:$rootScope.util.paramsFormat().activityId,
                    mpIds:$rootScope.util.paramsFormat().mpId
                };
            _fnG(url,params).then(function (res) {
                if (res.code == 0) {
                    that.limitNum = res.data[0].totalLimit;
                }
            }, function (res) {
                _fnE($scope.i18n('提示'), $scope.i18n('系统异常'));
            })
        }
    };
    $scope.trialDetail.getTrialDetail();

    //用户提交申请
    $scope.applyTrial = function (mpId, activityId) {
        if(!$scope.address.selectedAddr.id){
            _fnE($scope.i18n('提示'), $scope.i18n('请添加收货人地址'));
            return;
        }
        var url = _host+'/social/trialAppliced/saveTrilaAppliced',
            that = this,
            params = {
                activityId: activityId,
                mpId: mpId,
                addressId: $scope.address.selectedAddr.id
            };
        _fnP(url, params).then(function (res) {
            if (res.code == 0) {
                $scope.shareBox.showBox();
            }else {
                _fnE($scope.i18n('提示'), $scope.i18n('当前不能申请'));
            }

        }, function (res) {
            _fnE($scope.i18n('提示'), $scope.i18n('当前不能申请'));
        });
    };

    $scope.shareBox = {
        box: false,
        url: null,
        shareContent: null,//分享内容
        closeBox: function () {
            this.box = false;
            location.href = '/trial.html?trialTab=3';
        },
        showBox: function () {
            var that = this;
            that.box = true;
            that.picUrl = [];
            that.shareContent = '【' + $scope.i18n('免费试用') + '】' + $scope.trialDetail.trialInfo.mpName;
            $scope.$watch('shareType', function (shareType) {
                that.url = '';
                if (shareType == 'weibo') {
                    var shareUrl = location.origin + '/item.html?itemId=' +($scope.trialDetail.trialInfo.seriesParentId || $scope.trialDetail.trialInfo.mpId);
                    that.url = "http://service.weibo.com/share/share.php?url=" + encodeURIComponent(shareUrl)  + "&title=" + that.shareContent + "&pic=" + $scope.trialDetail.trialInfo.picUrl;
                } else if (shareType == 'qq') {
                    var p = {
                        url: location.origin + '/item.html?itemId=' +($scope.trialDetail.trialInfo.seriesParentId || $scope.trialDetail.trialInfo.mpId), /*获取URL，可加上来自分享到QQ标识，方便统计*/
                        desc: that.shareContent, /*分享理由(风格应模拟用户对话),支持多分享语随机展现（使用|分隔）*/
                        title: $scope.trialDetail.trialInfo.mpName,
                        summary: $scope.trialDetail.trialInfo.mpName, /*分享摘要(可选)*/
                        pics: $scope.trialDetail.trialInfo.picUrl, /*分享图片(可选)*/
                        style: '201',
                        width: 32,
                        height: 32
                    };
                    var s = [];
                    for (var i in p) {
                        s.push(i + '=' + encodeURIComponent(p[i] || ''));
                    }
                    that.url = "http://connect.qq.com/widget/shareqq/index.html?" + s.join('&');
                }
            })
        },
        toShare :function () {
            if($scope.shareBox.url){
                location.href = $scope.shareBox.url;
            }else {
                _fnE($scope.i18n('提示'), $scope.i18n('请选择分享方式'));
            }
        }
    };


    // 地址功能相关
    $scope.multiAddress = {};
    $scope.showList = [];
    $scope.addressLength = true;
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
                        // provinceId: address.provinceId.toString().split('_')[0],
                        provinceCode: address.provinceCode.toString().split('_')[1],
                        // cityId: address.cityId.toString().split('_')[0],
                        cityCode: address.cityCode.toString().split('_')[1],
                        // regionId: address.regionId.toString().split('_')[0],
                        regionCode: address.regionCode.toString().split('_')[1],
                        detailAddress: address.detailAddress,
                        mobile: address.mobile
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
        confirmDeleteAddress:function(id){
            var that = this;
            that.id = id;
            _fnE($scope.i18n('确认'), $scope.i18n('您确定要删除该收货地址吗') + '？', {
                type: 'confirm',
                ok: function () {
                    "use strict";
                    that._deleteAddress(that.id)
                }
            });
        },

        /**
         * 删除地址:_deleteAddress
         * @param id
         * @param defaultIs
         * @private
         */
        _deleteAddress: function (id) {
            $scope.toAddNewAddress = false;
            $scope.showList = [];
            var url = "/ouser-center/address/deleteAddressForm.do",
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
                provinceCode: address.provinceCode,
                cityCode:address.cityCode,
                regionCode: address.regionCode,
                detailAddress: address.detailAddress,
                mobile: address.mobile
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
                // address.defaultIs = address.defaultIs ? 1 : 0;
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
                    // var thisID;
                    // if (id && $scope.newAddress.provinceCode.indexOf(_pid) == 0) thisID = id;
                    // if (id && $scope.newAddress.provinceCode.indexOf(_pid) < 0) $scope.address.selectedId = 0;
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
                id : id
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
                }

            })
        }
    }

}]);
