/**
 * Created by Roy on 17/6/29.
 */
'use strict';
angular.module('appControllers').controller('authenticationCtrl', ['$scope', '$rootScope', '$stateParams', 'Upload', '$http','$location', 'validateService',function ($scope, $rootScope, $stateParams, Upload, $http,$location, validateService) {
    var validateRegExp = validateService;
    $scope.bankAcountReg = new RegExp(validateRegExp.bankAcount);
    $scope.mobileReg = new RegExp(validateRegExp.mobile);
    $scope.msg = '';

    var _ut = $rootScope.util.getUserToken(),
        _cid = $rootScope.companyId;

    $scope.methods = {
        identity: {},
        msg: '',
        checkMobile: function() {
            var params = {
                mobile: $scope.methods.identity.mobile,
                companyId: $rootScope.companyId
            };
            $http.post($rootScope.host_ouser + "/mobileRegister/isRepeatPhoneForm.do", params).success(function(result) {
               if( result.code == -1 ) {
                    //已注册
                    $scope.mobileErr = false;
                    $scope.methods.getPicNum();
                } else {
                    //未注册
                    $scope.mobileErr = true;
                    $scope.methods.getPicNum();
                }
            });
        },
        //发送手机验证码
        smsCode:function () {
            "use strict";
            if(!$scope.mobileReg.test($scope.methods.identity.mobile)) {
                return;
            }
            // var sendCaptchas = $rootScope.host_ouser + '/mobileRegister/sendCaptchasCodeFormNew.do';
            var sendCaptchas =$rootScope.host_ouser + '/mobileRegister/sendCaptchasForm.do';
            $http.post(sendCaptchas, {
                mobile: $scope.methods.identity.mobile,
                captchasType : 3,
                checkImageCode: $scope.methods.needImgCaptchaNum,
                imgeKey : $scope.checkImageKey
            }).success(function(res) {
                if (res.code == 0) {
                    $scope.imgTips = '';
                    $scope.sendErr = false;
                    var seconds = 60;
                    angular.element("#smsBtn").val(seconds + $scope.i18n('秒后重新获取')).prop('disabled', true);
                    var inter = setInterval(function() {
                        seconds--;
                        angular.element("#smsBtn").val(seconds + $scope.i18n('秒后重新获取'));
                        if (seconds === 0) {
                            angular.element("#smsBtn").val($scope.i18n('获取验证码')).prop('disabled', false);
                            $scope.disabled = false;
                            clearInterval(inter);
                        }
                    }, 1000);
                } else if (res.code === -1) {
                    $scope.sendErr = true;
                } else if(res.code == 6){
                    $scope.msg = res.message;
                    //$scope.disabled = true;
                } else {
                    $scope.sendErr = false;
                    $scope.imgTips = res.message;
                }
            });
        },
        //获取图片验证码
        getPicNum: function() {
            var url =  $rootScope.host_ouser +  '/api/user/init.do';
            var params = {
                mobile:$scope.methods.identity.mobile,
                initType:2,
                width:100,
                height:40
            }
            $http.post( url , params ).success( function(res) {
                if( res.code == 0 ) {
                    $scope.checkImage = res.data.image;
                    $scope.needImgCaptcha = res.data.needImgCaptcha;
                    $scope.checkImageKey = res.data.imageKey
                } else {
                    $scope.needImgCaptcha = false;
                }
            } )
        },
        checkCaptchas:function (type) {
            "use strict";
            $scope.sendErr = false;
            var checkCaptchasUrl = $rootScope.host_ouser + '/mobileRegister/checkCaptchasForm.do',
                params = {
                    mobile: $scope.methods.identity.mobile,
                    captchas: $scope.methods.captcha,
                    captchasType:5,
                    companyId: _cid
            };
            $http.post(checkCaptchasUrl,params)
                .success(function (result) {
                    if (result.code == 0) {
                        $scope.checkSms = false;
                        $scope.msg = '';
                        if (type == 'update') {
                            $scope.methods.modifyRealNameAuthInfo();
                        } else {
                            $scope.methods.addRealNameAuthInfo();
                        }
                    } else if (result.code === 1) {
                        $scope.checkSms = true;
                        $scope.msg = '';
                    }else {
                        $scope.msg = result.message;
                    }
            }).error(function (result) {
                $rootScope.error.checkCode($scope.i18n('系统异常'),result.message);
            });
        },
        // 初始化认证信息
        initIdentityInfo:function () {
            var url = '/ouser-center/realNameAuth/getRealNameAuthInfo.do';
            var params = {
            };
            //隐藏图形验证码
            $scope.needImgCaptcha = '';
            $http.post(url, params).success(function(res) {
                if (res.code == 0) {
                    // res.data = {
                    //     "errorCode":null,
                    //     "reason":"还未实名认证",
                    //     "orderCode":null,
                    //     "authType":null,
                    //     "authStatus":2,
                    //     "bankCardNo":'371122199201161265',
                    //     "realName":123213,
                    //     "certificateType":1,
                    //     "certificateNo":'371122199201161265',
                    //     "mobile":18661673147,
                    //     "userId":1282047200000207
                    // }
                    $scope.methods.authStatus = res.data.authStatus;
                    $scope.methods.identity = res.data;
                    // -1未提交认证，3认证失败  0已提交待审核，1待认证，2认证成功
                    $scope.methods.isEdit = false;
                    $scope.methods.isEnd = false;
                    $scope.methods.isWait = false;
                    $scope.methods.isAdd = false;
                    if (res.data.authStatus === 3){
                        $scope.methods.isEdit = true;
                        $scope.methods.getPicNum();
                    } else if (res.data.authStatus === 2){
                        $scope.methods.isEnd = true;
                    } else if (res.data.authStatus === 0) {
                        $scope.methods.isWait = true;
                        $scope.methods.message = $scope.i18n('已提交待审核');
                    } else if (res.data.authStatus === 1) {
                        $scope.methods.isWait = true;
                        $scope.methods.message = $scope.i18n('待认证');
                    } else {
                        $scope.methods.isAdd = true;
                    }
                }
            }).error(function(res) {
                $scope.methods.isAdd = true;
            });
        },
        // 提交认证信息
        addRealNameAuthInfo:function () {
            if (!$scope.methods.isAdd) {
                return;
            }
            if(!$scope.methods.identity.realName || !$scope.methods.identity.certificateNo || !$scope.methods.identity.bankCardNo || !$scope.methods.identity.mobile){
                return;
            };
            // 提交
            var url = '/ouser-center/realNameAuth/addRealNameAuthInfo.do';
            var params = {
                authType:3,//认证类型 1：两要素认证、2：三要素认证、3：四要素认证
                realName: $scope.methods.identity.realName,
                certificateType: 1,//证件类型 1：身份证
                certificateNo: $scope.methods.identity.certificateNo,//证件号码
                bankCardNo: $scope.methods.identity.bankCardNo,//银行卡号
                mobile: $scope.methods.identity.mobile, //预留手机号
                // certificateImgFront: '',//证件正面照
                // certificateImgBack: '',//证件背面照
                // cateBeginTime:$scope.methods.identity.starDate, //起止时间
                // cateEndTime:$scope.methods.identity.endDate,//终止时间
            };
            $http.post(url, params).success(function(res){
                if(res.code == 0){
                    $scope.methods.initIdentityInfo();
                } else {
                    $scope.msg = res.message || res.data;
                }
            });
        },
        // 修改实名认证信息
        modifyRealNameAuthInfo:function () {
            if (!$scope.methods.isEdit) {
                return;
            }
            if(!$scope.methods.identity.realName || !$scope.methods.identity.certificateNo || !$scope.methods.identity.bankCardNo || !$scope.methods.identity.mobile){
                return;
            };

            // 提交修改
            var url = '/ouser-center/realNameAuth/modifyRealNameAuthInfo.do';
            //银行卡没有编辑过并且认证失败状态
            var params = {
                authType:3,//认证类型 1：两要素认证、2：三要素认证、3：四要素认证
                realName: $scope.methods.identity.realName,
                certificateType: 1,//证件类型 1：身份证
                certificateNo: $scope.methods.identity.certificateNo,//证件号码
                bankCardNo: $scope.methods.identity.bankCardNo,//银行卡号
                mobile: $scope.methods.identity.mobile,//预留手机号
                // certificateImgFront: '',//证件正面照
                // certificateImgBack: '',//证件背面照
                // cateBeginTime:$scope.methods.identity.starDate, //起止时间
                // cateEndTime:$scope.methods.identity.endDate,//终止时间
            };

            $http.post(url, params).success(function(res) {
                if (res.code == 0) {
                    $scope.methods.initIdentityInfo();
                } else {
                    $scope.msg = res.message || res.data;
                }
            });
        },
    }

    if(!_ut){
        $rootScope.showLoginBox = true;
        return;
    } else {
        //获取基本信息
        $scope.methods.initIdentityInfo();
    }
}])
