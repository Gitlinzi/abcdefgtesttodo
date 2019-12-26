/**
 * Created by Roy on 15/10/23.
 */
appControllers.controller("joinProcessCtrl", ['$rootScope', '$scope', 'commonService', 'validateService', '$interval', function ($rootScope, $scope, commonService, validateService, $interval) {
    "use strict"
    $scope.isLogion = true;
    //默认省份与小能
    $rootScope.execute(false);
    var _host = $rootScope.host;  // 后台地址前缀 api
    var _merchant = '/back-merchant-web'; // 后台地址前缀 用户线
    var _get = $rootScope.ajax.get;
    var _post = $rootScope.ajax.post;
    var _postJson = $rootScope.ajax.postJson;
    var _fnE = $rootScope.error.checkCode; //错误提示信息
    $scope.merchantMes = {
        masterName : '', // 店主姓名
        storeName : '' , //门店名称
        phone : '' , //手机号码
        otherContact : '', //其他联系方式
        email : '', //电子邮件
        region : '', //门店所在地区
        addessDetail : '' , //门店详细地址
        expressCenter : '' , //配送中心
        choseCenter : ''  // 选择配送中心
    };
    $scope.$watch('userInfo' , function(n,o) {
        if(n&&n.mobile) {
            $scope.merchantMes.phone = n.mobile;
            $scope.mobileName = true;
        }
    })
    //获取地址省份
    $scope.getProvince = function() {
        var url = _host + '/location/provinces';
        _get( url , {} ).then( function( res ) {
            if( res.code == 0 ) {
                $scope.allProvince = res.data.all;
                $scope.saveAllProvince = angular.copy(res.data.all);
                $scope.allProvinceTwo = res.data.all;
            }
        } );
    };
    $scope.getProvince();
    //门店所在地区 获取地址市区
    $scope.getCity = function(id,code,provinceName,name) {
        if( id ) {
            var url = _host + '/location/list/' + id;
            _get(url).then( function( res ) {
                if( res.code == 0 ) {
                    $scope.allProvince = res.data;
                    $scope.provinceName = provinceName;
                    $scope.provinceNameThree = provinceName;
                    $scope.allProvince.one = true;
                }
            } )
        } else if ($scope.allProvince.one) {
            var url = _host + '/location/list/' + code;
            _get(url).then( function( res ) {
                if( res.code == 0 ) {
                    $scope.allProvince = res.data;
                    $scope.allProvince.three = true;
                    $scope.urbanName = name;
                    $scope.urbanNameTwo = name;
                }
            } )
        } else if( $scope.allProvince.three ){
            var url = _host + '/location/list/' + code;
            _get(url).then( function( res ) {
                if( res.code == 0 ) {
                    $scope.allProvince = res.data;
                }
            } )
        }
        if( $scope.allProvince.three ) {
            $scope.cityName = name;
            $('.lastChoseText').html($scope.provinceName+$scope.urbanName+$scope.cityName);
            event.stopPropagation();
            $scope.adesssChoseBox = false;
            $scope.merchatAddessTwo = false;
            $scope.provinceName = '请选择省份';
            $scope.urbanName = false;
        }
    };
    $scope.showAddress = function() {
        $scope.adesssChoseBox=true;
        $scope.merchatAddess=true;
        $scope.merchatAddessTwo=true;
        $scope.errorTipsFive = false;
        $scope.allProvince = angular.copy($scope.saveAllProvince);
    }
    $scope.hideAddress = function($event) {
        $event.stopPropagation();
        $scope.adesssChoseBox=false;
        $scope.merchatAddessTwo=false;
    }
    // 去除市区
    $scope.closeUrbanName = function() {
        $scope.urbanName = false;
        $scope.allProvince = $scope.saveAllProvince;
    }
    // 选择配送中心 获取地址市
    $scope.getCityTwo = function(id,provinceName,name,code) {
        if( name ) {
            $scope.cityNameTwo = name;
            $('.lastChoseTextTwo').html($scope.provinceNameTwo+name);
            event.stopPropagation();
            $scope.adesssChoseBoxTwo = false;
            $scope.allProvinceTwo = $scope.saveAllProvince;
            $scope.provinceNameTwo = '请选择省份';
            $scope.adessDetailShowTwo = false;
            $scope.areaId = code;
            var url = _merchant + '/merchantMng_DS/findMerchants.do';
            var params = {
                registeredProvinceId : $scope.cityId,
                registeredCityId : $scope.areaId,
                auditStatus : 1,  // 审核通过  后台朱海涛说直接写死
                status : 1  // 商家状态为正常/可用  后台朱海涛说直接写死
            }
            _postJson(url,params).then(function(res) {
                if( res.code == 0&&res.data.listObj&&res.data.listObj.length>0 ) {
                    $scope.merchantNameData = res.data.listObj;
                } else if(res.code != 0) {
                    _fnE("提示",'选择配送中心失败，请重试');
                } else {
                    _fnE("提示",'您选择的区域没有配送中心，请重新选择');
                }
            })
        } else {
            var url = _host + '/location/list/' + id;
            _get(url).then( function( res ) {
                if( res.code == 0 ) {
                    $scope.allProvinceTwo = res.data;
                    $scope.provinceNameTwo = provinceName;
                    $scope.cityId = id;
                }
            } )
        }
    }
    // 验证门店名称是否重复
    $scope.merchantRepeat = function() {
        if($scope.merchantMes.storeName!='') {
            var url = _merchant + '/merchantMng_DS/isRepeatMerchantName.do';
            var params = {
                merchantName : $scope.merchantMes.storeName
            };
            _postJson(url,params).then( function(res) {
                if( res.code == 0 ) {
                    $scope.merchantNameIsRepeat = res.data;
                } else {
                    _fnE('提示','门店校验失败，请重试');
                }
            } );
        }
    };
    // 选择配送中心
    $scope.choseAddess = function(name,id) {
        $('.lastChoseTextThree').html(name);
        $scope.merchantId = id;
    }
    // 提交审核
    $scope.submitExamine = function() {
        // 没有填店主姓名时 提示报错信息
        if( $scope.merchantMes.masterName == '' ) {
            $scope.errorTipsName = true;
            return;
        }
        // 没有填门店名称时 提示报错信息
        if( $scope.merchantMes.storeName == '' ) {
            $scope.errorTipsTwo = true;
            return;
        }
        // 没有填手机号码时 提示报错信息
        if( $scope.merchantMes.phone == '' ) {
            $scope.errorTipsThreeTwo = true;
            return;
        }
        // 没有填电子邮件时 提示报错信息
        if( $scope.merchantMes.email == '' ) {
            $scope.errorTipsFore = true;
            return;
        }
        // 没有填门店详细地址时 提示报错信息
        if( $scope.merchantMes.addessDetail == '' ) {
            $scope.errorTipsSix = true;
            return;
        }
        if( $scope.merchantId == '' || $scope.merchantId == null ) {
            $scope.errorTipsSeven = true;
            return;
        }
        if( $scope.provinceNameThree == '' || $scope.urbanNameTwo == '' || $scope.cityName == ''|| $scope.provinceNameThree == null || $scope.urbanNameTwo == null || $scope.cityName == null ) {
            $scope.errorTipsFive = true;
            return;
        }
        var url = '/ouser-web/api/user/info/update.do';
        var params = {
            realName :$scope.merchantMes.masterName, //店主名称
            userProvince : $scope.provinceNameThree, //省名称
            userCity  : $scope.urbanNameTwo , //市名称
            userRegion : $scope.cityName , //区名称
            userAddress : $scope.merchantMes.addessDetail , //门店详细地址
            email : $scope.merchantMes.email , //电子邮件
            merchantId : $scope.merchantId, //配送中心对应的商家id
            telephone : $scope.merchantMes.phone, //联系方式
            storeName : $scope.merchantMes.storeName, //门店名称
            otherContact:$scope.merchantMes.otherContact//其他联系方式
        };
        _post(url,params).then(function(res) {
            if( res.code == 0 ) {
                location.href = '/joinProcessStep.html';
            } else {
                _fnE('提示','提交审核失败，请重试');
            }
        })
    }
    // 校验手机号
    $scope.checkPhoneNum = function() {
        if(!$scope.merchantMes.phone || $scope.merchantMes.phone.length < 11){
            $scope.errorTipsThreeTwo = true;
            return;
        }
        if( /^[0-9]{11}$/.test($scope.merchantMes.phone)){
            $scope.errorTipsThreeTwo = false;
        } else{
            $scope.errorTipsThreeTwo = true;
        }
    }
}])
