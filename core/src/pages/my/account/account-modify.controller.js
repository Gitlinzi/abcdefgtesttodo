/**
 * Created by Roy on 17/6/28.
 */
'use strict';
angular.module('appControllers').controller('modifyCtrl',['$scope','$rootScope',function($scope,$rootScope){
    var _ut = $rootScope.util.getUserToken(),
        _fnP = $rootScope.ajax.post,
        _fnE=$rootScope.error.checkCode,
        _cid = $rootScope.companyId;

    if(!_ut){
        $rootScope.showLoginBox = true;
        return;
    }
    $scope.realPasswordRegExp = /(?!^\d+$)(?!^[A-Za-z]+$)(?!^[^A-Za-z0-9]+$)(?!^.*[\u4E00-\u9FA5].*$)^\S{6,20}$/
    $scope.showTips = false
    $scope.$watch('modifys.newPwd',function(val){
        if (!val) {
            $scope.showTips = false
            return
        }
        if (!$scope.realPasswordRegExp.test(val)) {
            $scope.showTips = true
        } else {
            $scope.showTips = false
        }
    })
    $scope.modifys = {
        newPwd:'',
        oldPwd:'',
        newPwdConfirm:'',
        oldErrmess:false,
    }

    // 修改密码
    $scope.checkOldPwd = function() {
        if ($scope.modifys.newPwd != $scope.modifys.newPwdConfirm) {
            // _fnE($scope.i18n('提示'),$scope.i18n('两次密码不一致，请重新填写'));
            return
        }
        if ($scope.showTips) {
            return
        }
        var url = '/ouser-web/user/updateNewPwByOldPw.do';
        var params = {
            password:$scope.modifys.oldPwd,
            password1:$scope.modifys.newPwd,
            password2:$scope.modifys.newPwdConfirm
        };
        $rootScope.ajax.postJson(url, params).then(function (res) {
            if (res.code == 0) {
                $scope.resetInfo();
                _fnE($scope.i18n('提示'),$scope.i18n('密码修改成功'));
                // $rootScope.util.deleteUserToken();
            }else{
                if(res.message == '旧密码输入错误，请重试'){
                    $scope.modifys.oldErrmess = true;
                }else{
                    _fnE($scope.i18n('提示'),$scope.i18n(res.message));
                }
            }
        });
    }
    $scope.resetInfo = function(){
        $scope.modifys.oldPwd ='';
        $scope.modifys.newPwd='';
        $scope.modifys.newPwdConfirm='';
    },

    $scope.step = 1;
    /**
	 * 验证码
	 */
	$scope.time = new Date().getTime(); //时间秒数
	//验证码图片获取地址
	$scope.ciUrl = $rootScope.host_ouser + "/mobileLogin/checkImageForm.do?" +
		"width=" + 110 +
		"&height=" + 40 +
		"&codeNmInSession=" + 'vicode' +
		"&codeCount=" + 4;
	$scope.checkImage = $scope.ciUrl + "&" + $scope.time;
	//刷新验证码
	$scope.cantSee = function () {
		$scope.checkImage = $scope.ciUrl + "&" + new Date().getTime();
	};
    $scope.modify = {
        modifyInfo:null,
        hasMobile:true,
        hasPassword:true,
        mobile:'',
        bindTel:false,
        alertPwd:false,
        captcha:'',
        password1:'',
        password2:'',
        phoneNumber:'',
        bind:function () {
            this.bindTel = true;
        },
        closeBind:function () {
            this.bindTel = false;
            this.captcha = '';
            this.phoneNumber = '';
            $scope.msg = '';
            $scope.phoneForm.$setPristine();
        },
        pwdCloseBind:function () {
            $scope.step = 1;
            this.alertPwd = false;
            this.captcha = '';
            this.password1 = '';
            this.password2 = '';
            $scope.checkSms = false;
            $scope.sendErr = false;
            $scope.passwdForm.$setPristine();
            $scope.msg = '';
        },
        pwd:function () {
            this.alertPwd=true;
        },
        //获取用户绑定信息
        getUserSecurityInfo:function () {
            "use strict";
            var url = $rootScope.host_ouser + '/api/user/info/getUserSecurityInfo.do',
                that = this;
            $rootScope.ajax.post(url).then(function (res) {
                if (res.code == 0){
                    that.hasMobile = res.data.hasMobile;
                    that.hasPassword = res.data.hasPassword;
                }else {
                    _fnE($scope.i18n('系统异常'),res.message);
                }
            }, function (res) {
                _fnE($scope.i18n('系统异常'),res.message);
            })

        },
        //获取绑定手机
        getBoundMobile:function () {
            "use strict";
            var url = "/ouser-web/api/loginAccount/queryLoginAccountMap.do",
                params = {
                    clearCacheAddTimeStamp:new Date().getTime()
                };
            $rootScope.ajax.post(url,params).then(function (res) {
                if(res.code==0) {
                    if (res.data && res.data.mobile && res.data.mobile.accountType == 'mobile') {
                        $scope.modify.mobile = res.data.mobile.accountNo;
                    }
                }else
                    $rootScope.error.checkCode(res.code,res.message);
            },function(res){
                $rootScope.error.checkCode($scope.i18n('系统异常'),$scope.i18n('获取绑定手机异常'));
            })
        },
        //修改密码校验验证码
        checkCaptchas:function () {
            "use strict";
            $scope.sendErr = false;
            var checkCaptchasUrl = $rootScope.host_ouser + '/api/user/checkMobileCaptcha.do',
                params = {
                    mobile: $scope.modify.mobile,
                    captchas: $scope.modify.captcha,
                    companyId: _cid
                };

            $rootScope.ajax.post(checkCaptchasUrl, params).then(function (result) {
                if (result.code == 0) {
                    if($scope.step==1){
                        $scope.step =2;
                    }
                    $scope.checkSms = false;
                    $scope.msg = '';
                    $scope.modify.updatePassword();
                } else if (result.code === 1) {
                    $scope.checkSms = true;
                    $scope.msg = '';
                }else {
                    $scope.msg = result.message;
                }
            }, function (result) {
                _fnE($scope.i18n('系统异常'),result.message);
            })

        },
        //修改密码
        updatePassword:function () {
            "use strict";
            var url = $rootScope.host_ouser + '/mobileRegister/modifyPasswordForm.do',
                that = this;

            $rootScope.ajax.post(url,{
                mobile: $scope.modify.mobile,
                password1: $scope.modify.password1,
                password2: $scope.modify.password2,
                captchas: $scope.modify.captcha
            }).then(function (result) {
                if (result.code == 0) {
                    that.pwdCloseBind();
                    //_fnE("提示","密码修改成功");
                    $rootScope.util.deleteUserToken();
                    $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n('密码修改成功'),{
                        type:'confirm',
                        ok:$rootScope.toLogin(),
                        btnOKText:$scope.i18n('登录')
                    });
                } else if (result.code == 7) {
                    $scope.msg = result.message;
                } else {
                    $scope.msg = $scope.i18n('密码修改失败') + '，' + $scope.i18n('请稍后再试');
                }
            }, function (result) {
                _fnE($scope.i18n('系统异常'),result.message);
            })

        },
        //校验手机号
        checkMobile:function () {
            $scope.msg = '';
            "use strict";
            var checkMobileUrl = $rootScope.host_ouser + "/api/user/checkAccountRepeat.do",
                params = {
                    mobile: $scope.modify.mobile,
                    companyId: _cid
                };

            $rootScope.ajax.post(checkMobileUrl, params).then(function (result) {
                if (result && result.code != "0") {
                    $scope.mobileErr = false;
                    $scope.modify.smsCode();
                } else {
                    $scope.mobileErr = true;
                }
            }, function (result) {
                _fnE($scope.i18n('系统异常'),result.message);
            })

        },
        //发送手机验证码
        smsCode:function () {
            "use strict";
            var seconds = 60;
            angular.element("#smsBtn").val(seconds + $scope.i18n('秒后重新获取')).prop('disabled', true);
            var sendCaptchas = $rootScope.host_ouser + '/mobileRegister/sendCaptchasForm.do';

            $rootScope.ajax.post(sendCaptchas,  {
                mobile: $scope.modify.mobile,
                companyId: _cid
            }).then(function (res) {
                if (res.code === -1) {
                    $scope.sendErr = true;
                    var inter = setInterval(function() {
                        seconds--;
                        angular.element("#smsBtn").val(seconds + $scope.i18n('秒后重新获取'));
                        if (seconds === 0) {
                            angular.element("#smsBtn").val(i18n('获取短信验证码')).prop('disabled', false);
                            $scope.disabled = false;
                            clearInterval(inter);
                        }
                    }, 1000);
                } else if(res.code == 6){
                    $scope.msg = res.message;
                    //$scope.disabled = true;
                } else {
                    $scope.sendErr = false;
                }
            }, function (res) {
            })

            var inter = setInterval(function() {
                seconds--;
                angular.element("#smsBtn").val(seconds + $scope.i18n('秒后重新获取'));
                if (seconds === 0) {
                    angular.element("#smsBtn").val($scope.i18n('获取短信验证码')).prop('disabled', false);
                    $scope.disabled = false;
                    clearInterval(inter);
                }
            }, 1000);
        },
        //修改绑定手机号
        changePhone:function () {
            alert(1)
            "use strict";
            var sendCaptchas = $rootScope.host_ouser + '/api/user/changeAuthMobile.do',
                params = {
                    captchas:$scope.modify.captcha,
                    mobile:$scope.modify.phoneNumber
                },
                that = this;
            $rootScope.ajax.post(sendCaptchas,params).then(function (result) {
                if (result && result.code == 0) {
                    that.closeBind();
                }else if(result.code == 2){
                    $scope.msg = result.message;
                } else if(result.code == 3){
                    $scope.msg = result.message;
                } else {
                    $scope.mobileErr = true;
                }
            }, function (result) {
                _fnE($scope.i18n('系统异常'),result.message);
            })

        },
        init:function () {
            "use strict";
            this.getUserSecurityInfo();
            this.getBoundMobile();
        }
    };
    // 下一步
    $scope.nextStep = function () {
        "use strict";
        $scope.msg = '';
        var url = '/custom-sbd-web/sbdEmailRegister/emailVerify',
            that = this;

        $rootScope.ajax.postJson(url,{
            email: $scope.emailModify.email,
            checkImageCode: $scope.emailModify.vicode,
        }).then(function (result) {
            if (result.code == 0) {
                $scope.step = 4;
            } else {
                $scope.msg = $scope.i18n(result.result) ;
            }
        }, function (result) {
            _fnE($scope.i18n('系统异常'),result.message);
        })
    }
    $scope.emailModify = {
        email: '',
        password1:'',
        password2:'',
        vicode: '', 
        pwdCloseBind:function () {
            $scope.step = 1;
            $scope.modify.alertPwd = false;
            this.vicode = '';
            this.password1 = '';
            this.password2 = '';
            $scope.emailForm2.$setPristine();
            $scope.msg = '';
        },
        //修改密码
        updatePassword:function () {
            "use strict";
            var url = '/custom-sbd-web/sbdEmailRegister/updatePassword',
                that = this;

            $rootScope.ajax.postJson(url,{
                email: that.email,
                password: that.password1,
            }).then(function (result) {
                if (result.code == 0) {
                    that.pwdCloseBind();
                    $rootScope.util.deleteUserToken();
                    $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n('密码修改成功'),{
                        type:'confirm',
                        ok:$rootScope.toLogin(),
                        btnOKText:$scope.i18n('登录')
                    });
                } else if (result.code == 7) {
                    $scope.msg = result.message;
                } else {
                    $scope.msg = $scope.i18n('密码修改失败') + '，' + $scope.i18n('请稍后再试');
                }
            }, function (result) {
                _fnE($scope.i18n('系统异常'),result.message);
            })

        },
    }
}])
