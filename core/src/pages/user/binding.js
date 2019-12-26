/**
 * Created by Roy on 15/10/23.
 */
appControllers.controller("bindCtrl", ['$rootScope', '$scope', 'commonService', 'validateService', '$interval', '$window',function ($rootScope, $scope, commonService, validateService, $interval,$window) {
	"use strict"
    //国际化
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
	//默认省份与迷你购物车
	$rootScope.execute(false);
	var validateRegExp = validateService;
	$scope.usernameRegExp = new RegExp(validateRegExp.username);
	$scope.passwordRegExp = new RegExp(validateRegExp.password);
	$scope.mobileRegExp = new RegExp(validateRegExp.mobile);
	$scope.emailRegExp = new RegExp(validateRegExp.email);
	$scope.isNoExistPhone = true;
	$scope.isExistPhone = true;
	$scope.isRepeatPhone = false ;
    $scope.isLogion = true;
	// var alertMsg = function (msg) {
	// 	return $rootScope.error.checkCode(null, msg);
	// }
	$rootScope.util.deleteUserToken();
	$scope.protocol=true;
	//初始化变量
	$scope.smsBtn = $scope.i18n('获取短信验证码');
	$scope.loginInfo = {
		phoneNumber: '', //手机号
		phoneCaptcha: '', //手机验证码
		vicode: '', //图片验证码
		username: '', //用户名
		password: '' ,//密码
		threeName: ''
	}
	$scope.msg = '';
	var sendCaptchasURL = $rootScope.host_ouser + '/mobileRegister/sendCaptchasForm.do'; //发送手机验证码
	var isRepeatPhoneURL = $rootScope.host_ouser + "/api/user/checkAccountRepeat.do"; //检查手机号是否已存在
	var registerSubmitURL = $rootScope.host_ouser + '/api/union/bindUnionMobile.do'; //提交注册


	$scope.captchasErrMsg = ""; //手机验证码错误信息
	$scope.registerErrMsg = ""; //注册错误信息
	$scope.registerSubmit = false; //提交过的标志，方便显示表单验证的信息
	$scope.user = {};
	$scope.isRepeatPhone1 =false;
	$scope.protocolCheck = function () {
		$scope.protocol = !$scope.protocol;
	}
	//第三方用户名
	$scope.threeName = function () {
		var params = $rootScope.util.paramsFormat(location.href);
		$scope.loginInfo.threeName = decodeURIComponent(decodeURIComponent(params.username));
	}
	$scope.active = function () {
		$scope.msg = '';
		$scope.registerErrMsg = '';
		// $scope.loginInfo.phoneNumber = '';
		$scope.loginInfo.phoneCaptcha = '';
		$scope.loginInfo.vicode = '';
		// $scope.user.mobile = '';
		$scope.user.captchas = '';
		$scope.user.password = '';
		$scope.user.confirmPassword = '';
		$scope.captchas_tip = false;
	}

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

	/**
     * 获取地址栏returnUrl
     */
    $scope.getReturnUrl = function () {
        var search = location.search;
        if (search) {
            var params = search.substring(1).split('&');
            for (var i in params) {
                if (params[i].indexOf('returnUrl') == 0) {
                    var url = encodeURI(params[i].substring(params[i].indexOf('=') + 1));
                    //网址验证
                    var re = /((http|https|ftp):(\/\/|\\\\)((\w)+[.]){1,}(net|com|cn|org|cc|tv|[0-9]{1,3})(((\/[\~]*|\\[\~]*)(\w)+)|[.](\w)+)*(((([?](\w)+){1}[=]*))*((\w)+){1}([\&](\w)+[\=](\w)+)*)*)/;
                    if (re.test(url)) {
                        $scope.returnUrl = url;
                    }
                }
            }
        }

    }();
	//检查手机号是否已存在（已有账号）
	 $scope.checkPhone = function() {
        if (!$scope.loginInfo.phoneNumber) {
			$scope.isNoExistPhone = true;
            $scope.msg = $scope.i18n('请输入手机号');
            return;
        }else if( !/^[0-9]{11}$/.test($scope.loginInfo.phoneNumber)){
			$scope.isNoExistPhone = true;
			 $scope.msg = $scope.i18n('请输入') + '11' + $scope.i18n('位手机号');
            return;
		}
        var isRepeatPhoneURL = $rootScope.host_ouser + "/api/user/checkAccountRepeat.do";
        var params = {
            mobile: $scope.loginInfo.phoneNumber
        };
        $scope.checkPhoneEnd = true;
		$rootScope.ajax.post(isRepeatPhoneURL,params).then(function (result) {
            if(result.code == 0){
                $scope.msg = $scope.i18n('没有账号') + ',' + $scope.i18n('请完善资料');
                $scope.checkPhoneEnd = false;
				$scope.isNoExistPhone = true;
            } else if(result.code == 2) {
				$scope.getInit();
				$scope.msg = '';
				$scope.isNoExistPhone = false;
			}
		}, function () {
			$scope.checkPhoneEnd = false;
		})
    };
	//检查手机号是否已存在(没有账号)
	 $scope.checkChangePhone = function() {
		if (!$scope.user.mobile) {
			$scope.isExistPhone = true;
            return;
        }else if( !/^[0-9]{11}$/.test($scope.user.mobile)){
			$scope.isExistPhone = true;
            return;
		} else {
			$scope.mobile_tip = true;
		}
        var isRepeatPhoneURL = $rootScope.host_ouser + "/api/user/checkAccountRepeat.do";
		var params = {
            mobile: $scope.user.mobile
        };
		$rootScope.ajax.post(isRepeatPhoneURL, params).then(function (result) {
			if (result.code == 0) {
				$scope.isExistPhone = false;
            } else if(result.code == 2) {
				$scope.isExistPhone = true;
				$scope.registerErrMsg = $scope.i18n('已有账号') + ',' + $scope.i18n('请直接绑定');
			}
		}, function (res) {

		})

    };
	//短信验证码
	$scope.smsSend = function (event) {
		if ($scope.isNoExistPhone) {
			return;
		}
		if (!$scope.checkPhoneEnd) {
			return;
		}
		if (!$scope.loginInfo.phoneNumber ) {
            $scope.msg = $scope.i18n('请输入手机号');
            return;
        }else if( !/^[0-9]{11}$/.test($scope.loginInfo.phoneNumber)){
			 $scope.msg = $scope.i18n('请输入') + '11' + $scope.i18n('位有效手机号');
            return;
		}
		var interval = 120; //重试时间间隔  秒
		var url = $rootScope.host_ouser + '/mobileRegister/sendCaptchasForm.do';
		var param = {
			mobile: $scope.loginInfo.phoneNumber,
			captchasType: 3,
		};
		$rootScope.ajax.post(url, param).then(function (res) {
			if(res.code == 0){
				//发送成功
				//设置手机验证码重新获取倒计时
				var obj = event.currentTarget;
				var seconds = interval;
				obj.value =$scope.i18n('重新发送')+ '(' + seconds + ')';
				obj.disabled = true;
				var inter = setInterval(function () {
					seconds--;
					obj.value = $scope.i18n('重新发送') + '(' + seconds + ')';
					if (seconds === 0) {
						obj.value = $scope.i18n('获取短信验证码');
						obj.disabled = false;
						clearInterval(inter);
					}
				}, 1000);
			}else{
				$scope.msg = res.message ? res.message : $scope.i18n('验证码发送失败');
			}
		});

	}
	//绑定手机号
	$scope.bindMobile = function () {
		var phoneNumber = $scope.loginInfo.phoneNumber;
        var phoneCaptcha = $scope.loginInfo.phoneCaptcha;
		var sId=localStorage.getItem('sId');
        // if (!$scope.loginInfo.phoneNumber) {
        //     $scope.msg = '请输入手机号';
        //     return;
        // }
        if (!/^[0-9]{11}$/.test($scope.loginInfo.phoneNumber)) {
           $scope.msg = $scope.i18n('请输入') + '11' + $scope.i18n('位有效手机号');
            return;
        }
        if (!$scope.loginInfo.phoneCaptcha) {
            $scope.msg = $scope.i18n('请输入短信验证码');
            return;
        }
        if (!/^[0-9]{4,6}$/.test($scope.loginInfo.phoneCaptcha)) {
            $scope.msg = $scope.i18n('请输入正确的短信验证码');
            return;
        }
		var url = $rootScope.host_ouser + '/api/union/bindUnionMobile.do';
		var param = {
			mobile: phoneNumber,
			captchas: phoneCaptcha,
			sId: sId
		}
		$rootScope.ajax.post(url, param).then(function (res) {
			if (res.code == 0) {
				location.href='/index.html';
			}else if(res.code == 7){
				$scope.msg = $scope.i18n('没有账号') + '，' + $scope.i18n('请完善资料');
			}else{
				$scope.msg = res.message;
			}
		})
	}



	//发送验证码
	$scope.smsRegisterSend = function (event) {
		if ($scope.isExistPhone) {
			return;
		}
		if (!$scope.user.mobile) {
            return;
        }else if( !/^[0-9]{11}$/.test($scope.user.mobile)){
            return;
		}
		// if (!$scope.user.mobie) {
		// 	return;
		// }
		// if (!$scope.user.mobie) {
		// 	return;
		// }
		// if (!$scope.user.mobie) {
		// 	return;
		// }

		var interval = 120; //重试时间间隔  秒

		$rootScope.ajax.post(sendCaptchasURL, {
			mobile: $scope.user.mobile
		}).then(function (result) {
			if (result && result.code == "0") { //发送成功
				//设置手机验证码重新获取倒计时
				var obj = event.currentTarget;
				var seconds = interval;
				obj.value =$scope.i18n('重新发送') + '(' + seconds + ')';
				obj.disabled = true;
				var inter = setInterval(function () {
					seconds--;
					obj.value = $scope.i18n('重新发送') + '(' + seconds + ')';
					if (seconds === 0) {
						obj.value = $scope.i18n('获取短信验证码');
						obj.disabled = false;
						clearInterval(inter);
					}
				}, 1000);

			} else if (result && result.code == "2") {
				$scope.captchasErrMsg = $scope.i18n('手机号码已经注册');
			} else if (result.code == "6"){
                $scope.captchasErrMsg = result.message;
			}else {
				$scope.captchasErrMsg = $scope.i18n('验证码发送失败') + '（' + $scope.i18n('请') + '120' + $scope.i18n('秒后重试') + '）';
			}
		})

	}

	//提交注册
	$scope.register = function () {
		$scope.registerSubmit = true;
		if ($scope.regisForm.$invalid) {
			return;
		}
		//手机号已被注册
		if ($scope.isRepeatPhone) {
			return;
		}

		if (!$scope.protocol) { //服务条款
			return;
		}
		if (!$scope.user.username) {
			angular.element("#registerBtn").prop('disabled', true); //按钮不可用
			registerSubmitFunc(); //提交
		} else if (!isRepeatUsernameEnd) { //用户名没有验证完
			angular.element("#registerBtn").prop('disabled', true); //按钮不可用
			var isRepeatUsernameEndInter = setInterval(function () {
				if (isRepeatUsernameEnd) { //用户名验证结束
					if (!$scope.isRepeatUsernameRst) { //
						registerSubmitFunc(); //提交
					} else {
						angular.element("#registerBtn").prop('disabled', false); //按钮可用
					}

					clearInterval(isRepeatUsernameEndInter);
				}
			}, 100);
		} else if (!$scope.isRepeatUsernameRst) { //用户名验证结束并且用户名不重复
			angular.element("#registerBtn").prop('disabled', true); //按钮不可用
			registerSubmitFunc();
		}

	}


	var registerSubmitFunc = function () {
		var sId=localStorage.getItem('sId');
		var user = $.extend({},$scope.user,true);
		delete user.confirmPassword;
		user.identityTypeCode = $rootScope.switchConfig.common.defaultIdentityTypeCode;
		user.sId = sId;

		$rootScope.ajax.post(registerSubmitURL, user).then(function (result) {
			angular.element("#registerBtn").prop('disabled', false); //按钮恢复到可使用
			var successCode = "0"; //注册成功的code
			if (result && result.code == successCode) { //注册成功
				location.href = '/index.html';
			} else {
				$scope.getInit();
				$scope.registerErrMsg = result.message;

			}
		}, function (data, header, config, status) {
			angular.element("#registerBtn").prop('disabled', false); //按钮恢复到可使用
		})
	}

	//显示隐藏 注册协议
	$scope.showAgmt = function (boo, $event) {
		$scope.agmt = boo;
		if ($event) {
			$event.stopPropagation();
		}
	}
	$scope.showAgmtSubmit = function (boo, $event) {
		$scope.agmt = boo;
		if ($event) {
			$event.stopPropagation();
		}
		$scope.protocol=true;
	}
	//用户注册协议

	$scope._getRegPro = function () {
		var url = "/osc-web/frontBasicSetting/getRegisterProtocol.do",
			params = {
                companyId:$rootScope.companyId
			};
		$rootScope.ajax.get(url,params).then(function (res) {
			if (res.code == 0) {
				var protocalCms = res.resultData.registerProtocol;
				$scope.protocolTitle = res.resultData.registerProtocolName;

				var timer = $interval(function () {
					if ($("#protocalCms").length > 0) {
						$("#protocalCms").append(protocalCms);
						$interval.cancel(timer);
					}
				}, 200);
			}
		});
	};

	$scope._getRegPro();
	/* $scope._getRegPro = function () {
		var url = $rootScope.host + "/passport/getUserRegisterProtocol.do?companyId=" + $rootScope.companyId;

		$rootScope.ajax.get(url, {}).then(function (res) {
			if (res.data) {
				var protocalCms = res.data.registerProtocol;
				$scope.protocolTitle = res.data.protocolTitle;

				var timer = $interval(function () {
					if ($("#protocalCms").length > 0) {
						$("#protocalCms").append(protocalCms);
						$interval.cancel(timer);
					}
				}, 200);
			}
		})
	};
	$scope._getRegPro(); */



	  // 判断账号验证码接口
    $scope.getInit = function () {
        var url = '/ouser-web/api/user/init.do';

		$rootScope.ajax.post(url, {
			mobile:$scope.loginInfo.phoneNumber,
            initType: 0
		}).then(function (res) {
			$scope.needImgCaptcha  = res.data.needImgCaptcha;
            if( $scope.needImgCaptcha){
                $scope.cantSee();
            }
		})
    }
    $scope.getInit();//账号登录判断输入错误次数
	$scope.threeName();

}])
