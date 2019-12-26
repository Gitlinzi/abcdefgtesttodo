/**
 * Created by Roy on 15/10/23.
 */
appControllers.controller("personalRegisterCtrl", ['$rootScope', '$scope', 'commonService', 'validateService', '$interval', '$window',function ($rootScope, $scope, commonService, validateService, $interval, $window) {
	"use strict"
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
	$scope.isExistPhone = true;
    $scope.isLogion = true;
	//头部信息
	$scope.headTitle = $scope.i18n('个人账号注册');
	$scope.bannerRightLinks = [{
		title: $scope.i18n('切换成企业账号注册') + '>',
		url: 'bregis.html'
	}];
	var isRepeatUsernameURL = $rootScope.host + "/passport/isRepeatUsername.do"; //验证用户名是否重复
	var sendCaptchasURL = $rootScope.host_ouser + '/mobileRegister/sendCaptchasForm.do'; //发送手机验证码
	//var registerSubmitURL = $rootScope.host_ouser + "/mobileRegister/checkAndRegisterForm.do";//提交注册
	var registerSubmitURL = $rootScope.host_ouser + "/api/user/register.do"; //提交注册
	//var isRepeatPhoneURL = $rootScope.host_ouser + "/mobileRegister/isRepeatPhoneForm.do";//检查手机号是否已存在
	var isRepeatPhoneURL = $rootScope.host_ouser + "/api/user/checkAccountRepeat.do"; //检查手机号是否已存在

	var isRepeatUsernameEnd = false; //用户名重复验证是否完成
	$scope.isRepeatUsernameRst = false; //用户名是否重复，true为重复，false为不重复
	$scope.captchasErrMsg = ""; //手机验证码错误信息
	$scope.registerErrMsg = ""; //注册错误信息
	$scope.registerSubmit = false; //提交过的标志，方便显示表单验证的信息
	$scope.registerSubmit2 = false; //提交过的标志，方便显示表单验证的信息
	$scope.isRepeatEmail = false;
	$scope.user = {};
	$scope.user2 = {};
	// 默认邮箱登录
	$scope.step = 2;
	// $scope.loginInfo = {
    //     vicode: '',
    // }
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
	$scope.isCountDownTime=false;
	//验证用户名是否重复
	$scope.isRepeatUsername = function () {
		if ($scope.regisForm.username.$valid) {
			isRepeatUsernameEnd = false; //开始验证用户名是否重复
			var url = isRepeatUsernameURL,
				params = {
                    username:$scope.user.username,
                    userType:$rootScope.personalUserType,
                    companyId:$rootScope.companyId
				};
			$rootScope.ajax.get(url,params).then(function (result) {
				var successCode = "0"; //返回成功的code
				if (result && result.code == successCode && result.data.result == true) {
					$scope.isRepeatUsernameRst = true;
				} else {
					$scope.isRepeatUsernameRst = false;
				}
				isRepeatUsernameEnd = true; //验证完成
			},function(data, header, config, status){
				isRepeatUsernameEnd = true; //验证完成
			})
		}
	}

	//检查手机号是否已存在
	$scope.checkPhone = function () {
		$scope.isExistPhone=true;
		$scope.isRepeatPhone = false;
		if (!$scope.user.mobile) {
			$scope.isExistPhone = true;
            return;
        }else if( !/^(1)[0-9]{10}$/.test($scope.user.mobile)){
			$scope.isExistPhone = true;
            return;
		}

		$scope.checkPhoneEnd = false;

		$rootScope.ajax.post(isRepeatPhoneURL, {
			mobile: $scope.user.mobile
		}).then(function (result) {
			if(result.code == 0){
				$scope.isExistPhone = false;
			}else if(result.code == 2){
				$scope.isRepeatPhone = true;
			}
			// $scope.getInit();
				// $scope.isRepeatPhone = result.code != "0";
			$scope.checkPhoneEnd = true
		}, function (res) {
			$scope.checkPhoneEnd = true;
		})
	}

	//发送验证码
	$scope.smsSend = function (event) {
		if ($scope.regisForm.mobile.$invalid || !$scope.checkPhoneEnd || $scope.isRepeatPhone) {
			return;
		}
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
						$scope.isExistPhone = false;
						$scope.isCountDownTime=false;
						clearInterval(inter);
					}else{
						$scope.isExistPhone = true;
						$scope.isCountDownTime=true;
					}
				}, 1000);
			} else if (result && result.code == "2") {
				$scope.captchasErrMsg = $scope.i18n('手机号码已经注册');
			}else if(result.code == "6"){
				$scope.registerErrMsg = result.message;
			} else {
                $scope.registerErrMsg = result.message ? result.message : $scope.i18n('验证码发送失败');
            }
		})
	}
	// 晨光注册完登录
	$scope.registerLogin = function() {
		var url = '/ouser-web/api/user/login.do';
		var params  = {
            mobile : $scope.user.mobile,
            password : $scope.user.password
		}
		$rootScope.ajax.post(url,params).then(function(res) {
			if( res.code == 0 ) {
                location.href = 'joinProcess.html';
			}
		})
	};
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
		var user = $scope.user;
		// user.type = $rootScope.personalUserType;
		user.identityTypeCode = $rootScope.switchConfig.common.defaultIdentityTypeCode;
		user.platformId = $rootScope.platformId ;
		//user.vicode = $scope.loginInfo.vicode;

		$rootScope.ajax.post(registerSubmitURL, user).then(function (result) {
			//跟踪云
			try{
				window.eventSupport.emit('heimdallTrack',{
					ev: "5"
				});
			}catch(err){
				//console.log(err);
			}

			angular.element("#registerBtn").prop('disabled', false); //按钮恢复到可使用
			var successCode = "0"; //注册成功的code
			if (result && result.code == successCode) { //注册成功
				$rootScope.util.cookie.setCookie('shareCode8', "", -1);
				if( $rootScope.switchConfig.user.regist.cgJumpMerchant ) {
                    $scope.registerLogin();
				} else {
					$rootScope.ajax.post($rootScope.host_ouser + '/api/user/login.do', {
						mobile: $scope.user.mobile,
						password: $scope.user.confirmPassword,
					}).then(function (res) {
						if (res.code == 0) {
							//如果没有选择地址的弹框，每次登陆， 重新复制地址
							if (!$rootScope.switchConfig.common.showUpdateDistributionAddress) {
			                    $rootScope.localProvince.provinceFlag = true;
			                    $rootScope._getUserInfo().then(function(res){
			                        $rootScope.util.setCookie("addrDetail",{
			                            "detail":$rootScope.i18n( + $rootScope.merchantInfo.merchantRegisterProvinceName + $rootScope.merchantInfo.merchantRegisterCityName + $rootScope.merchantInfo.merchantRegisterRegionName),
			                            "detailId":$rootScope.merchantInfo.merchantRegisterProvinceId + '_' + $rootScope.merchantInfo.merchantRegisterCityId + '_' + $rootScope.merchantInfo.merchantRegisterRegionId,
			                            "detailCode":$rootScope.merchantInfo.merchantRegisterProvinceCode + '_' + $rootScope.merchantInfo.merchantRegisterCityCode + '_' + $rootScope.merchantInfo.merchantRegisterRegionCode,
			                        },90);
			                        $rootScope.util.setCookie( "areasCode" , {
			                            'oneCode' :$rootScope.merchantInfo.merchantRegisterRegionCode
			                        },90);
			                        $rootScope.util.setCookie("province",{
			                            "provinceId":$rootScope.merchantInfo.merchantRegisterProvinceId,
			                            "provinceName":$rootScope.i18n($rootScope.merchantInfo.merchantRegisterProvinceName),
			                            "provinceCode":$rootScope.merchantInfo.merchantRegisterProvinceCode,
			                            "cityId":$rootScope.merchantInfo.merchantRegisterCityId,
			                            "cityName":$rootScope.i18n($rootScope.merchantInfo.merchantRegisterCityName),
			                            "cityCode":$rootScope.merchantInfo.merchantRegisterCityCode,
			                            "regionId":$rootScope.merchantInfo.merchantRegisterRegionId,
			                            "regionName":$rootScope.i18n($rootScope.merchantInfo.merchantRegisterRegionName),
			                            "regionCode":$rootScope.merchantInfo.merchantRegisterRegionCode
			                        },90, $rootScope.cookieDomain);
									$rootScope.util.setCookie("isAutoArea","no", 90);
			                    })
                            }
							location.href="/index.html";
						}
					})
				}
			} else {
				// $scope.getInit();
				$scope.registerErrMsg = result.message;
				$rootScope.util.cookie.setCookie('shareCode8', "", -1);
			}
		}, function (data, header, config, status) {
			angular.element("#registerBtn").prop('disabled', false); //按钮恢复到可使用
		})
	}

	//提交注册 邮箱注册 
	$scope.register2 = function () {
		$scope.registerSubmit2 = true;
		if ($scope.regisForm2.$invalid) {
			return;
		}
		//邮箱已被注册
		// if ($scope.isRepeatPhone) {
		// 	return;
		// }

		if (!$scope.protocol) { //服务条款
			return;
		}
		if (!$scope.user2.username) {
			angular.element("#registerBtn2").prop('disabled', true); //按钮不可用
			registerSubmitFunc2(); //提交
		} else if (!isRepeatUsernameEnd) { //用户名没有验证完
			angular.element("#registerBtn2").prop('disabled', true); //按钮不可用
			var isRepeatUsernameEndInter = setInterval(function () {
				if (isRepeatUsernameEnd) { //用户名验证结束
					if (!$scope.isRepeatUsernameRst) { //
						registerSubmitFunc2(); //提交
					} else {
						angular.element("#registerBtn2").prop('disabled', false); //按钮可用
					}

					clearInterval(isRepeatUsernameEndInter);
				}
			}, 100);
		} else if (!$scope.isRepeatUsernameRst) { //用户名验证结束并且用户名不重复
			angular.element("#registerBtn2").prop('disabled', true); //按钮不可用
			registerSubmitFunc2();
		}
	}
	var registerSubmitFunc2 = function () {
		$scope.isRepeatEmail = false;
		var user = $scope.user2;
		// user.type = $rootScope.personalUserType;
		user.identityTypeCode = $rootScope.switchConfig.common.defaultIdentityTypeCode;
		user.platformId = $rootScope.platformId ;
		// user.vicode = $scope.loginInfo.vicode;

		$rootScope.ajax.postJson('/custom-sbd-web/sbdEmailRegister/emailRegistered', user).then(function (result) {
			//跟踪云
			try{
				window.eventSupport.emit('heimdallTrack',{
					ev: "5"
				});
			}catch(err){
				//console.log(err);
			}

			angular.element("#registerBtn2").prop('disabled', false); //按钮恢复到可使用
			var successCode = "0"; //注册成功的code
			if (result && result.code == successCode) { //注册成功
				$rootScope.util.cookie.setCookie('shareCode8', "", -1);
				if( $rootScope.switchConfig.user.regist.cgJumpMerchant ) {
                    $scope.registerLogin();
				} else {
					location.href = '/success.html'
					// $rootScope.ajax.post($rootScope.host_ouser + '/api/user/login.do', {
					// 	mobile: $scope.user2.email,
					// 	password: $scope.user2.confirmPassword2,
					// }).then(function (res) {
					// 	if (res.code == 0) {
					// 		//如果没有选择地址的弹框，每次登陆， 重新复制地址
					// 		if (!$rootScope.switchConfig.common.showUpdateDistributionAddress) {
			        //             $rootScope.localProvince.provinceFlag = true;
			        //             $rootScope._getUserInfo().then(function(res){
			        //                 $rootScope.util.setCookie("addrDetail",{
			        //                     "detail":$rootScope.i18n( + $rootScope.merchantInfo.merchantRegisterProvinceName + $rootScope.merchantInfo.merchantRegisterCityName + $rootScope.merchantInfo.merchantRegisterRegionName),
			        //                     "detailId":$rootScope.merchantInfo.merchantRegisterProvinceId + '_' + $rootScope.merchantInfo.merchantRegisterCityId + '_' + $rootScope.merchantInfo.merchantRegisterRegionId,
			        //                     "detailCode":$rootScope.merchantInfo.merchantRegisterProvinceCode + '_' + $rootScope.merchantInfo.merchantRegisterCityCode + '_' + $rootScope.merchantInfo.merchantRegisterRegionCode,
			        //                 },90);
			        //                 $rootScope.util.setCookie( "areasCode" , {
			        //                     'oneCode' :$rootScope.merchantInfo.merchantRegisterRegionCode
			        //                 },90);
			        //                 $rootScope.util.setCookie("province",{
			        //                     "provinceId":$rootScope.merchantInfo.merchantRegisterProvinceId,
			        //                     "provinceName":$rootScope.i18n($rootScope.merchantInfo.merchantRegisterProvinceName),
			        //                     "provinceCode":$rootScope.merchantInfo.merchantRegisterProvinceCode,
			        //                     "cityId":$rootScope.merchantInfo.merchantRegisterCityId,
			        //                     "cityName":$rootScope.i18n($rootScope.merchantInfo.merchantRegisterCityName),
			        //                     "cityCode":$rootScope.merchantInfo.merchantRegisterCityCode,
			        //                     "regionId":$rootScope.merchantInfo.merchantRegisterRegionId,
			        //                     "regionName":$rootScope.i18n($rootScope.merchantInfo.merchantRegisterRegionName),
			        //                     "regionCode":$rootScope.merchantInfo.merchantRegisterRegionCode
			        //                 },90, $rootScope.cookieDomain);
					// 				$rootScope.util.setCookie("isAutoArea","no", 90);
			        //             })
                    //         }
					// 		location.href="/index.html";
					// 	}
					// })
				}
			} else {
				// $scope.getInit();
				// $scope.registerErrMsg = result.message;
				if(result.result == '验证码输入有误'){
					$scope.checkImageCodeErrMsg = result.result;
				}
				if(result.message == '请勿重复注册'){
					$scope.isRepeatEmail = true;
				}
				$rootScope.util.cookie.setCookie('shareCode8', "", -1);
			}
		}, function (data, header, config, status) {
			angular.element("#registerBtn2").prop('disabled', false); //按钮恢复到可使用
		})
	}
	//显示隐藏 注册协议
	$scope.showAgmt = function (boo, $event) {
		$scope.agmt = boo;
		if ($event) {
			$event.stopPropagation();
		}
		$scope.protocol=true;
	}



	//用户注册协议
	$scope._getRegPro = function () {
		var url = "/osc-web/frontBasicSetting/getRegisterProtocol.do?companyId=" + $rootScope.companyId;

		$rootScope.ajax.get(url, {}).then(function (res) {
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


	// 判断验证码接口
    // $scope.getInit = function () {
    //     var url = '/ouser-web/api/user/init.do';
    //     $rootScope.ajax.post(url, {
    //         mobile: $scope.user.mobile,
    //         initType: 0
    //     }).then(function (res) {
    //          $scope.needImgCaptcha  = res.data.needImgCaptcha;
    //             if($scope.needImgCaptcha){
    //                 $scope.cantSee();
    //             }
    //     });
    // }
    // 图片验证码
   // $scope.getInit();//判断输入错误次数



	$scope.getShareCode = function () {
		$scope.shareCode8 = $rootScope.util.cookie.getCookie('shareCode8')
		if ($scope.shareCode8) {
			$scope.sharename = decodeURI($rootScope.util.paramsFormat().shareName)
		}
	}
	$scope.getShareCode()
	
}])
