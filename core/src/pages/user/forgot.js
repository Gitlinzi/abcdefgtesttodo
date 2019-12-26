/**
 * Created by Roy on 15/10/22.
 */
appControllers.controller("forgotCtrl", ['$log', '$rootScope', '$scope', '$cookieStore', 'commonService', 'validateService', '$window', function($log, $rootScope, $scope, $cookieStore, commonService, validateService, $window) {
    "use strict"
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
    //默认省份与迷你购物车
    $rootScope.execute(false);
    $scope.headTitle = $scope.i18n('找回密码');
    $scope.step = 3; //步骤
    $scope.isLogion = true;
    // 发送验证码
    var sendCaptchas = $rootScope.host_ouser + '/mobileRegister/sendCaptchasForm.do';
    // step == 0下一步(校验验证码)
    // var checkCaptchas = $rootScope.host_ouser + '/mobileRegister/checkCaptchasForm.do';
    var checkCaptchas = $rootScope.host_ouser + '/api/user/checkMobileCaptcha.do';
    // step ==1 修改密码
    var modifyPassword = $rootScope.host_ouser + '/mobileRegister/modifyPasswordForm.do';
    //验证密码
    $scope.passwordRegExp = new RegExp(validateService.password);
    $scope.realPasswordRegExp = /(?!^\d+$)(?!^[A-Za-z]+$)(?!^[^A-Za-z0-9]+$)(?!^.*[\u4E00-\u9FA5].*$)^\S{6,20}$/
    $scope.showTips = false
    $scope.showTips2 = false
    $scope.$watch('password1',function(val){
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
    $scope.$watch('password3',function(val) {
        if (!val) {
            $scope.showTips2 = false
            return
        }
        if (!$scope.realPasswordRegExp.test(val)) {
            $scope.showTips2 = true
        } else {
            $scope.showTips2 = false
        }
    })
    //检查手机号是否存在
    $scope.checkMobile = function() {
        $rootScope.ajax.post($rootScope.host_ouser + "/api/user/checkAccountRepeat.do", {
            mobile: $scope.mobile,
            companyId: $rootScope.companyId
        }).then(function (result) {
            if (result && result.code != "0") {
                $scope.mobileErr = false;
                $scope.smsCode();
            } else {
                $scope.mobileErr = true;
            }
        })
    };
    $scope.hasEmailActive = false
    $scope.emailErrMessage = ''
    // 检验邮箱是否激活
    // $scope.getEmailCode = function() {
    //     let url = '/custom-sbd-web/sbdEmailRegister/queryEmailActive.do'
    //     let params = {
    //         emailAddress: $scope.email
    //     }
    //     $rootScope.ajax.get(url,params).then(function(res) {
    //         if (res.code == 0) {
    //             $scope.hasEmailActive = true
    //             $scope.emailErrMessage = ''
    //         } else {
    //             $scope.hasEmailActive = false
    //             $scope.emailErrMessage = res.message
    //             // $rootScope.error.checkCode($scope.i18n(res.message) );
    //             // $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n(res.message) + '!');
    //         }
    //     },function(err){
    //         $scope.emailErrMessage = err.message
    //         // $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n(err.message) + '!');
    //     })
    // }
    // 获取邮箱验证码
    $scope.getEmailCode = function() {

        $scope.hasEmailActive = true
        $scope.emailErrMessage = ''
        $scope.sendEmailCode()


        // let url = '/custom-sbd-web/sbdEmailRegister/queryEmailActive.do'
        // let params = {
        //     emailAddress: $scope.email
        // }
        // $rootScope.ajax.get(url,params).then(function(res) {
        //     if (res.code == 0) {
        //         $scope.hasEmailActive = true
        //         $scope.emailErrMessage = ''
        //         $scope.sendEmailCode()
        //     } else {
        //         $scope.hasEmailActive = false
        //         $scope.emailErrMessage = res.message
        //     }
        // },function(err){
        //     $scope.emailErrMessage = err.message
        //     // $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n(err.message) + '!');
        // })
       
    }
    $scope.sendEmailCode = function() {

        //根据用户名发送验证码
        var seconds = 120;
        angular.element("#smsBtns").val($scope.i18n('重新发送') + '(' + seconds + ')').prop('disabled', true);
        let url = '/custom-sbd-web/advUser/sendEmailByUserName'
        let params = {
            // emailAddress: $scope.email,
            username:$scope.username,
        }
        
        $rootScope.ajax.postJson(url,params).then(function(res) {
            if(res.code == 0) {
                $scope.sendErrs = false

                if (res.data) {
                    $scope.email = res.data.email
                }

                var inter = setInterval(function() {
                    seconds--;
                    angular.element("#smsBtns").val($scope.i18n('重新发送') + '(' + seconds + ')');
                    if (seconds === 0) {
                        angular.element("#smsBtns").val($scope.i18n('获取短信验证码')).prop('disabled', false);
                        $scope.disabled = false;
                        clearInterval(inter);
                    }
                }, 1000);
            } else {
                angular.element("#smsBtns").val($scope.i18n('获取短信验证码')).prop('disabled', false);
                $scope.sendErrs = true;

                $scope.emailErrMessage = res.data
            }
        })
    },
    //发送验证码
    $scope.smsCode = function() {
         var seconds = 120;
         angular.element("#smsBtn").val($scope.i18n('重新发送') + '(' + seconds + ')').prop('disabled', true);

        $rootScope.ajax.post(sendCaptchas, {
            //username: $scope.username,
            mobile: $scope.mobile,
            companyId: $rootScope.companyId
        }).then(function (res) {
            if (res.code == 0) {
                var inter = setInterval(function() {
                    seconds--;
                    angular.element("#smsBtn").val($scope.i18n('重新发送') + '(' + seconds + ')');
                    if (seconds === 0) {
                        angular.element("#smsBtn").val($scope.i18n('获取短信验证码')).prop('disabled', false);
                        $scope.disabled = false;
                        clearInterval(inter);
                    }
                }, 1000);
            } else if (res.code === -1) {
                $scope.sendErr = true;
            } else {
                $scope.sendErr = false;
            }
        })
    };

    //验证用户信息
    $scope.checkCaptchas = function() {
        $scope.sendErr = false;
        angular.element("#nextStepBtn").prop('disabled', true);

        $rootScope.ajax.post(checkCaptchas, {
            username: $scope.username,
            mobile: $scope.mobile,
            captchas: $scope.captchas,
            companyId: $rootScope.companyId
        }).then(function (res) {
            angular.element("#nextStepBtn").prop('disabled', false);
            if (res.code == 0) {
                $scope.checkSms = false;
                $scope.unameerr = false;
                $scope.step = 1;
            } else if (res.code === 1) {
                $scope.checkSms = true;
            } else if (res.code === 3) {
                $scope.unameerr = true;
            }
        })
    };
    //修改密码  -- 手机号
    $scope.updPasswd = function() {

        $rootScope.ajax.post(modifyPassword, {
            mobile: $scope.mobile,
            password1: $scope.password1,
            password2: $scope.password2,
            captchas: $scope.captchas
        }).then(function (res) {
            if (res.code == 0) {
                $scope.step = 2;
                setTimeout(function() {
                    location.href = "login.html";
                }, 5000);
            } else if (res.code == 7) {
                $scope.msg = res.message;
            } else {
                $scope.msg = $scope.i18n('密码修改失败') + '，' + i18n('请稍后再试');
            }
        })
    };
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
    // 邮箱修改密码
    $scope.updEmailPasswd = function () {
        "use strict";
        var url = '/custom-sbd-web/sbdEmailRegister/updatePassword';
        var params = {
            email: $scope.email,
            password: $scope.password3,
            emailVerificationCode: $scope.vicode
        }
        $rootScope.ajax.postJson(url, params).then(function (res) {
            if (res.code == 0) {
                $scope.step = 2;
                setTimeout(function() {
                    location.href = "login.html";
                }, 5000);
            } else if (res.code == 7) {
                $scope.msg = res.message;
                $scope.password = ''
            } else {
                $scope.msg = res.message || ($scope.i18n('密码修改失败') + '，' + i18n('请稍后再试'))
                $scope.password = ''
            }
        })
    };
     // 下一步
     $scope.nextStep = function () {
        // "use strict";
        // $scope.msg = '';
        // var url = '/custom-sbd-web/sbdEmailRegister/emailVerify',
        //     that = this;

        // $rootScope.ajax.postJson(url,{
        //     email: $scope.email,
        //     checkImageCode: $scope.vicode,
        // }).then(function (result) {
        //     if (result.code == 0) {
        //         $scope.step = 4;
        //     } else {
        //         $scope.checkVicode = result.result;
        //     }
        // }, function (result) {
        //     _fnE($scope.i18n('系统异常'),result.message);
        // })
        $scope.step = 4;
    }
}])
