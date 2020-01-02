/**
 * Created by Roy on 17/6/29.
 */
'use strict';
angular.module('appControllers').controller('baseInfoCtrl', ["$scope", "$rootScope", "$cookieStore", "validateService", "Upload", function ($scope, $rootScope, $cookieStore, validateService, Upload) {
    //订单状态(从url获取)
    var utilParams = $rootScope.util.paramsFormat();
    var _ut = $rootScope.util.getUserToken(),
        _fnG = $rootScope.ajax.get,
        _fnP = $rootScope.ajax.post,
        _fnE = $rootScope.error.checkCode,
        _host = $rootScope.host,
        _cid = $rootScope.companyId;
    $scope._getLayerAddress = _getLayerAddress;
    Object.myKeys = function (params) {
        var ary = [];
        if (Object.keys) {
            ary = this.keys(params);
        } else {
            for (var key in params) {
                if (hasOwn.call(params, key)) {
                    ary.push(key);
                }
            }
            var DONT_ENUM = "propertyIsEnumerable,isPrototypeOf,hasOwnProperty,toLocaleString,toString,valueOf,constructor".split(","),
                hasOwn = ({}).hasOwnProperty;
            for (var i in {
                toString: 1
            }) {
                DONT_ENUM = false;
            }
            if (DONT_ENUM && params) {
                for (var i = 0; key = DONT_ENUM[i++];) {
                    if (hasOwn.call(params, key)) {
                        ary.push(key);
                    }
                }
            }
        }
        return ary;
    }
    $scope.isCenter = Object.myKeys(utilParams).length == 0 || typeof utilParams.center != 'undefined'; //是否是个人中心首页

    if (!_ut) {
        $rootScope.showLoginBox = true;
        return;
    }
    //订单列表页
    $scope.infos = {
        userInfo: {},//用户信息
        memberInfo: {},//会员信息
        userEdit: {},
        years: [],
        months: [],
        days: [],
        isHeadPic: false,
        //获取用户信息
        getUserInfo: function (userType) {
            "use strict";
            var that = this;
            $rootScope._getUserInfo().then(function (result) {
                if (result.code == 0) {
                    that.userInfo = result.data.userInfo;
                    that.memberInfo = result.data.memberInfo;
                    that.userEdit.fixenPhone = result.data.linkTel
                    that.userEdit.extension = result.data.linkTelExt
                    that.userEdit.fixenPhone2 = result.data.linkTel2
                    that.userEdit.extension2 = result.data.linkTelExt2
                    that.userEdit.telephone = that.userInfo.mobile;
                    that.userEdit.memberCardNo = that.userInfo.memberCardNo;
                    that.userEdit.nickname = that.userInfo.nickname;
                    that.userEdit.customerName = that.userInfo.storeName;
                    that.userEdit.merchantName = that.userInfo.realName;
                    that.userEdit.phoneNum = result.data.mobile
                    if(result.data.storeInfo){
                        that.userEdit.otherTelephone = result.data.storeInfo.otherContact;
                    }
                    that.userEdit.emilNumber = that.userInfo.email;
                    var birthday;
                    if (that.userInfo.birthday != null && that.userInfo.birthday != '') {
                        birthday = new Date(that.userInfo.birthday);
                    } else {
                        birthday = new Date();
                    }
                    if (that.userInfo.headPicUrl) {
                        that.userEdit.headPicUrl = that.userInfo.headPicUrl;
                        that.isHeadPic = true;
                    }
                    if (result.data.storeInfo&&$rootScope.switchConfig.center.accountNews.cgJsController) {
                        $scope.multiAddress = {};
                        $scope.infos.editAddress(result.data.storeInfo);
                    }
                    that.userEdit.year = birthday.getFullYear();
                    that.userEdit.month = birthday.getMonth() + 1;
                    that.userEdit.day = birthday.getDate();
                    var dataSize = ((that.memberInfo ? that.memberInfo.growthBalence : 0 ) * 160) / (that.memberInfo ? that.memberInfo.growthReach : 0);
                    setTimeout(function () {
                        $(".person-progress").css({
                                                      width: dataSize + 'px',
                                                  })
                    }, 10)
                }
            }, function (res) {

            })
        },
        getOptions: function () {
            "use strict";
            var i = -1,
                newDate = new Date(),
                that = this;
            //添加年份
            for (i = 0; i <= 100; i++) {
                that.years.push(newDate.getFullYear() - i);
            }
            //添加月份
            for (i = 1; i <= 12; i++) {
                that.months.push(i);
            }
            //添加天份
            for (i = 1; i <= 31; i++) {
                that.days.push(i);
            }
        },

        setDays: function () {
            var that = this,
                monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
                yea = that.userEdit.year,
                mon = that.userEdit.month,
                num = monthDays[mon - 1];
            if (mon == 2 && that.isLeapYear(yea)) {
                num++;
            }

            for (var i = that.days.length; i >= num; i--) {
                var index = $.inArray(i, that.days);
                if (index !== -1) {
                    that.days.splice(index, 1);
                }
                ;
            }
            for (var i = 1; i <= num; i++) {
                if ($.inArray(i, that.days) === -1) {
                    that.days.push(i);
                }
            }
        },
        //判断是否闰年
        isLeapYear: function (year) {
            return (year % 4 == 0 && year % 100 != 0 || year % 400 == 0);
        },
        //上传文件
        upload: function () {
            if (!this.uploadImageUrl) {
                return;
            }
            var url = "/api/fileUpload/putObjectWithForm";  //params是model传的参数，图片上传接口的url
            var that = this;
            Upload.upload({
                url: url,
                data: {
                    file: this.uploadImageUrl
                }
            }).success(function (data) {
                if (data.code == 0) {
                    that.userEdit.headPicUrl = data.data.filePath;
                    that.isHeadPic = true;
                } else {
                    "use strict";
                    that.isHeadPic = false;
                    _fnE($scope.i18n('系统异常'), data.message);
                }
            }).error(function () {
                //logger.log('error');
            });
        },
        updateUser: function (userInfo) {
            "use strict";
            var mobileReg = /^0?1[0-9]{10}$/;
            var telephoneReg = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
            if (userInfo != null) {
                if (userInfo.nickname == '' || userInfo.nickname == null) {
                    _fnE($scope.i18n('提示'), $scope.i18n('请填写完整信息后保存'));
                    return;
                }
                // if (userInfo.fixenPhone == '' || userInfo.fixenPhone == null) {
                //     _fnE($scope.i18n('提示'), $scope.i18n('请填写完整信息后保存'));
                //     return;
                // }
                // if (userInfo.fixenPhone2 == '' || userInfo.fixenPhone2 == null) {
                //     _fnE($scope.i18n('提示'), $scope.i18n('请填写完整信息后保存'));
                //     return;
                // }
                // if (userInfo.phoneNum == '' || userInfo.phoneNum == null) {
                //     _fnE($scope.i18n('提示'), $scope.i18n('请填写完整信息后保存'));
                //     return;
                // }
                if(userInfo.phoneNum){
                    if (!mobileReg.test(userInfo.phoneNum)) {
                        _fnE($scope.i18n('提示'), $scope.i18n('手机号格式错误!'));
                        return;
                    }
                }
                if(userInfo.fixenPhone){
                    if (!telephoneReg.test(userInfo.fixenPhone)) {
                        _fnE($scope.i18n('提示'), $scope.i18n('固定电话格式错误!'));
                        return;
                    }
                }
                if(userInfo.fixenPhone2){
                    if (!telephoneReg.test(userInfo.fixenPhone)) {
                        _fnE($scope.i18n('提示'), $scope.i18n('固定电话格式错误!'));
                        return;
                    }
                }
            } else {
                return;
            }
            var url = '/ouser-web/api/user/info/updateADV.do',
                params = {
                    username: userInfo.nickname,
                    linkTel : userInfo.fixenPhone,
                    linkTelExt: userInfo.extension, 
                    linkTel2: userInfo.fixenPhone2,
                    linkTelExt2: userInfo.extension2,
                    // linkTel3: userInfo.headPicUrl,
                    // linkTelExt3: birthdayStr,
                    mobile:userInfo.phoneNum
                }
            $rootScope.ajax.post(url, params).then(function (result) {
                if (result.code == 0) {
                    $scope.infos.resetInfo();
                    $scope.infos.getUserInfoDetail();//用户信息
                    _fnE($scope.i18n('提示'), $scope.i18n('修改个人信息成功'));
                } else {
                    _fnE($scope.i18n('系统异常'), '修改个人信息失败,' + result.message);
                }
            })
        },
        resetInfo:function(){
            $scope.infos.userEdit.Changename = '';
            $scope.infos.userEdit.fixenPhone ='';
            $scope.infos.userEdit.extension = '';
            $scope.infos.userEdit.phoneNum = '';
        },

        //地址修改
        editAddress: function (address) {
            this.invalidSubmit = false;
            $scope.newAddress = {
                provinceCode: parseInt(address.provinceCode),
                provinceId: parseInt(address.provinceId),
                provinceName: address.provinceName,
                cityCode: parseInt(address.cityCode),
                cityId: parseInt(address.cityId),
                cityName: address.cityName,
                districtCode: parseInt(address.districtCode),
                districtId: parseInt(address.districtId),
                districtName: address.districtName,
                detailAddress: address.addressDetail
            };
            //在编辑地址的时候判断是否包含身份证
            $scope.multiAddress.provinces = {};
            $scope.multiAddress.cities = {};
            $scope.multiAddress.regions = {};
            //需要取出层级地址 editFlag:true
            _getLayerAddress(100000, 1,true);
        },
        //初始化操作, 这个方法在页面的ng-init里调用
        init: function () {
            "use strict";
            var that = this;
            //如果是个人中心页,需要调用个人信息相关的接口
            if ($scope.isCenter) {
                that.getOptions();
                that.getUserInfoDetail();
                // that.getUserInfo($rootScope.switchConfig.common.defaultIdentityTypeCode);//用户信息
                /*$rootScope.getUserType().then(function (result) {
                 if (result.data.code == 0){
                 $rootScope.userType = result.data.data[0];
                 that.getUserInfo($rootScope.userType);//用户信息
                 }
                 })*/
            }
        },
        //当用户点击地址时，当地址初始化
        initAddress: function (code, addr) {
            return
            if (code == 'province') {
                $scope.newAddress = {};
                if (code == 'city') {
                    $scope.newAddress.regionId = null;
                }
                if (code == 'region') {
                }
            }
        },
        getUserInfoDetail:function(){
            let that = this
            var url = '/custom-sbd-web/user/getUserDetail.do',
                params ='';
            $rootScope.ajax.postJson(url, params).then(function (result) {
                if (result.code == 0) {
                    $scope.infos.userEdit.nickname = result.data.username;
                    that.userEdit.fixenPhone = result.data.linkTel
                    that.userEdit.extension = result.data.linkTelExt
                    that.userEdit.fixenPhone2 = result.data.linkTel2
                    that.userEdit.extension2 = result.data.linkTelExt2
                    that.userEdit.phoneNum = result.data.mobile
                } else {
                    _fnE($scope.i18n('提示'), $scope.i18n(result.message));
                }
            })
        }
    }
   
    function _getLayerAddress(code, layer,type,name) {
        if (typeof code !== 'undefined' && code !== null) {
            var url = _host + '/location/list/' + code;
            $rootScope.ajax.getNoKey(url).then(function (res) {
                if (res.data !== null) {
                    if (layer === 1) {
                        if(type==true) {
                            $scope.multiAddress.provinces = res.data;
                            _getLayerAddress($scope.newAddress.provinceCode, 2,true);
                        } else {
                            $scope.multiAddress.cities = res.data;
                            angular.forEach($scope.multiAddress.provinces,function(a) {
                                if(a.code == code) {
                                    $scope.newAddress.provinceName = a.name;
                                }
                            })
                        }
                    }
                    else if (layer === 2) {
                        if(type==true) {
                            $scope.multiAddress.cities = res.data;
                            _getLayerAddress($scope.newAddress.cityCode, 3,true);
                        } else {
                            $scope.multiAddress.regions = res.data;
                            angular.forEach( $scope.multiAddress.cities,function(a) {
                                if(a.code == code) {
                                    $scope.newAddress.cityName = a.name;
                                }
                            } )
                        }
                    }
                    else if (layer === 3) {
                        if(type==true) {
                            $scope.multiAddress.regions = res.data;
                        }
                    }
                }  else if  (res.data == null&&layer === 3) {
                    angular.forEach( $scope.multiAddress.regions,function(a) {
                        if( a.code == code ) {
                            $scope.newAddress.districtName = a.name;
                        }
                    } )
                }
            })
        }
    };
}]);
