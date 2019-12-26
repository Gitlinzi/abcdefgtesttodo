/**
 * Created by Roy on 15/10/23.
 */
appControllers.controller("loginCtrl", ['$log', '$rootScope', '$scope', '$cookieStore', 'commonService','$location','$window',function ($log, $rootScope, $scope, $cookieStore, commonService,$location, $window) {
    "use strict"
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
    //默认省份与迷你购物车
    $rootScope.execute(false);
    var alertMsg = function (msg) {
        return $rootScope.error.checkCode(null, msg);
    }
    //初始化变量
    $scope.isLogion = true;
    $scope.getCodeLoginData;
    $scope.smsBtn = $scope.i18n('获取短信验证码');
    $scope.loginInfo = {
        phoneNumber: '', //手机号
        phoneCaptcha: '', //手机验证码
        vicode: '', //图片验证码
        employee: '', //工号
        password: '', //密码
        user:0,
        isAuto: false
    }
    if ($rootScope.util.cookie.getCookie('_urname')) {
        $scope.loginInfo.employee = $rootScope.util.cookie.getCookie('_urname');
        $scope.loginInfo.isAutoName = true
    }
    $scope.isNoExistPhone = true;
    /**
     * 记住账号
     */
    var chkRemAccount = $cookieStore.get('chkRemAccount');//获取记住账号多选框的状态
    if(chkRemAccount) {
    	$scope.remAccount = true;//选中
    }else {
    	$cookieStore.remove('username');
    	$cookieStore.remove('chkRemAccount');
    }
    $scope.getRemAccount = function () {
    	var username = $cookieStore.get('username');
    	if(username) {
    		$scope.username = username;
    	}
    }();
    $scope.clickRemAccount = function () {
    	if(!$scope.remAccount) {
    		$cookieStore.remove('username');
    		$cookieStore.remove('chkRemAccount');
    	}else {
    		$cookieStore.put('chkRemAccount', '1');
    	}
    };
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


    //检查手机号是否存在（手机号+短信验证码）
    $scope.checkPhone = function() {

        //产品化，login.do不检查手机号是否注册，但做基本格式检验
        if(!$scope.loginInfo.phoneNumber || $scope.loginInfo.phoneNumber.length < 11){
            $scope.isNoExistPhone = true;
            $scope.msgPhone = '';
            return;
        }

        if( /^[0-9]{11}$/.test($scope.loginInfo.phoneNumber)){
            $scope.isNoExistPhone = false;
            return;
		} else{
            $scope.isNoExistPhone = true;
            $scope.msgPhone = $scope.i18n('请输入正确的手机号');
            return;
        }

    };
    //检查手机号是否存在（手机号+密码）
     $scope.check = function() {
        if (!$scope.loginInfo.employee) {
            $scope.isNoExistPhone = true;
            $scope.msg = '';
            return;
        }
        // else if( !/^[0-9]{11}$/.test($scope.loginInfo.employee)){
        //     $scope.isNoExistPhone = true;
		// 	 $scope.msg = '请输入11位手机号';
        //     return;
		// }
        var isRepeatPhoneURL = $rootScope.host_ouser + "/api/user/checkAccountRepeat.do";
        $scope.checkPhoneEnd = true;

        $rootScope.ajax.post(isRepeatPhoneURL, {
            mobile: $scope.loginInfo.employee
        }).then(function (res) {
            if (res.code == 0) {
                $scope.msg = '';
                $scope.checkPhoneEnd = false;
				$scope.isNoExistPhone = true;
            } else if(res.code == 2) {
                $scope.getInit();
				$scope.msg = '';
				$scope.isNoExistPhone = false;
            }
        }, function (res) {
            $scope.checkPhoneEnd = false;
        })
    };
//发送验证码
    $scope.smsSend = function (event) {
        if (!$scope.loginInfo.phoneNumber) {
            $scope.msgPhone = $scope.i18n('请输入手机号');
            return;
        }else if( !/^[0-9]{11}$/.test($scope.loginInfo.phoneNumber)){
            $scope.msgPhone = $scope.i18n('请输入正确的手机号');
            return;
        }
        var interval = 120; //重试时间间隔  秒
        var url = $rootScope.host_ouser + '/mobileRegister/sendCaptchasForm.do';

        $rootScope.ajax.post(url, {
            mobile: $scope.loginInfo.phoneNumber,
            captchasType: 3,
        }).then(function (res) {
            if (res.code == 0) {
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

            } else if(res.code == 6){
                $scope.msgPhone = res.message;
            }else {
                $scope.msgPhone = res.message;
            }
            // $scope.smsBtn = '重新获取';
        });
    };
    //手机登录
    $scope.phoneLogin = function () {
        var phoneNumber = $scope.loginInfo.phoneNumber;
        var phoneCaptcha = $scope.loginInfo.phoneCaptcha;
        var vicode = $scope.loginInfo.vicode;
        // $scope.phoneNumber = $('#phoneNumber').val();
        if (!phoneNumber) {
            $scope.msgPhone = $scope.i18n('请输入手机号');
            return;
        }
        if (!/^[0-9]{11}$/.test($scope.loginInfo.phoneNumber)) {
            $scope.msgPhone = $scope.i18n('请输入有效') + '11' + $scope.i18n('位有效手机号');
            return;
        }
        if (!phoneCaptcha) {
            $scope.msgPhone = $scope.i18n('请输入短信验证码');
            return;
        }
        if (!/^[0-9]{4,6}$/.test($scope.loginInfo.phoneCaptcha)) {
            $scope.msgPhone = $scope.i18n('请输入正确的短信验证码');
            return;
        }
        var url = $rootScope.host_ouser + '/api/user/login.do';
        var param = {
            mobile: phoneNumber,
            captchas: phoneCaptcha,
            checkImageCode: vicode,
        };
        $rootScope.ajax.post(url, param).then(function (res) {
            if (res.code == 0) {
                $rootScope.util.cookie.setCookie('getTicket',1);
                if ($scope.remAccount) {
                    $cookieStore.put('phoneNumber', phoneNumber); //记住账号
                }

                $scope.msg = "";
                // $rootScope.util.setUserToken(res.ut);
                // $rootScope.util.setCookie("zsUt", res.ut,null, $rootScope.cookieDomain);
                var backUrl = $cookieStore.get('backUrl');
                $rootScope.util.cookie.setCookie('shareCode8', "", -1);
                //如果没有选择地址的弹框，每次登陆， 重新复制地址
                if (!$rootScope.switchConfig.common.showUpdateDistributionAddress) {
                    $rootScope.localProvince.provinceFlag = true;
                }
                if ($scope.returnUrl) {
                    location.href = $scope.returnUrl;
                } else if (backUrl) {
                    location.href = backUrl;
                } else {
                    location.href = 'index.html';
                }
            }else if(res.code==-8){
                $rootScope.util.cookie.setCookie('shareCodeMessage',JSON.stringify(res.message));
                $rootScope.util.cookie.setCookie('shareCode8', "", -1);
                location.href = 'index.html';
            }else {
                $scope.getInitPhone();
                $scope.checkImage = $scope.ciUrl + "&" + new Date().getTime();
                $scope.msgPhone = res.message;
            }
        })
    };
    /**
     * 账号登录
     */
     $scope.login = function (){
         if($scope.loginInfo.user == 1){
            $scope.employeeLogin();
         }else if($scope.loginInfo.user == 0){
            $scope.userLogin();
         }else{
             $scope.userLogin();
         }
     }
    // 手机号+密码
     $scope.userLogin = function () {
         var phoneNumber = $scope.loginInfo.employee;
         var password = $scope.loginInfo.password;
         // var vicode = $scope.loginInfo.vicode;

        if (!phoneNumber) {
            $scope.msg = $scope.i18n('用户名不能为空');
            return false;
        }
        // else{
        //     var regEn = /[`~!#$%^&*()_+<>?:"{},\/;'[\]]/im,
        //     regCn = /[！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
        //     if(regEn.test(phoneNumber) || regCn.test(phoneNumber)) {
        //        $scope.msg = $scope.i18n('账号不能包含特殊字符');
        //        return false;
        //    }
        // }
        if (!password) {
            $scope.msg = $scope.i18n('密码不能为空');
            return false;
        }
        $scope.msg = "";
        //记住用户名
        if($scope.loginInfo.isAutoName){
           $rootScope.util.cookie.setCookie('_urname',phoneNumber);
        }else{
            if ($rootScope.util.cookie.getCookie('_urname')) {
                $rootScope.util.cookie.delCookie('_urname')
            }
        }
        var param ={
            mobile: phoneNumber,
            password: password,
            // checkImageCode: vicode,
            isAuto: $scope.loginInfo.isAuto
        };
        $rootScope.ajax.post($rootScope.host_ouser + '/api/user/login.do', param).then(function (res) {
            if (res.code == 0) {
                $rootScope.util.cookie.setCookie('getTicket',1);
                if ($scope.remAccount) {
                    $cookieStore.put('phoneNumber', phoneNumber); //记住账号
                }
                let url = '/custom-sbd-web/front/user/queryAccountGroup2.do'
                let params = {}
                $rootScope.ajax.postJson(url,params).then(function(res){
                    if (res.code ==0 && res.data.length) {
                        $scope.relevanceAccount = res.data || []
                        $rootScope.util.cookie.setCookie('relevanceAccount',JSON.stringify($scope.relevanceAccount),30)
                        // if ($scope.returnUrl) {
                        //     location.href = $scope.returnUrl;
                        // } else if (backUrl) {
                        //     location.href = backUrl;
                        // } else {
                        location.href = 'index.html';
                        // }
                    }
                })
                $scope.msg = "";
                // $rootScope.util.setUserToken(res.ut);
                var backUrl = $cookieStore.get('backUrl');
                //如果没有选择地址的弹框，每次登陆， 重新复制地址
                if (!$rootScope.switchConfig.common.showUpdateDistributionAddress) {
                    $rootScope.localProvince.provinceFlag = true;
                }
                // $rootScope.util.cookie.setCookie('shareCodeMessage',JSON.stringify(res.message));
                $rootScope.util.cookie.setCookie('shareCode8', "", -1);
            }else if(res.code == -8){

                $rootScope.util.cookie.setCookie('shareCodeMessage',JSON.stringify(res.message));
                //如果没有选择地址的弹框，每次登陆， 重新复制地址
                if (!$rootScope.switchConfig.common.showUpdateDistributionAddress) {
                    $rootScope.localProvince.provinceFlag = true;
                }

                location.href = 'index.html';
                $rootScope.util.cookie.setCookie('shareCode8', "", -1);

            }else {
                $scope.getInit();
                $scope.checkImage = $scope.ciUrl + "&" + new Date().getTime();
                $scope.msg = res.message;
            }
        })
    };
    // 工号+密码
    $scope.employeeLogin = function () {
        var employee = $scope.loginInfo.employee;
        var password = $scope.loginInfo.password;
        // var vicode = $scope.loginInfo.
        ;
        if (!employee) {
            $scope.msg = $scope.i18n('用户名不能为空');
            return false;
        } else if (!password) {
            $scope.msg = $scope.i18n('密码不能为空');
            return false;
        }
        else {
            $scope.msg = "";
        }
        //工号+密码

        $rootScope.ajax.post($rootScope.host_ouser + '/api/union/login.do', {
            employeeCode: employee,
            employeePassword: password,
            unionType: 5
        }).then(function (res) {
            if (res.code == 0) {
                //如果没有选择地址的弹框，每次登陆， 重新复制地址
                if (!$rootScope.switchConfig.common.showUpdateDistributionAddress) {
                    $rootScope.localProvince.provinceFlag = true;
                }
                if(!res.needBind){
                    location.href='/index.html';
                }else{
                    location.href='/binding.html?username='+res.oauthUsername;
                }
            }else{
                $scope.getInit();
                $scope.checkImage = $scope.ciUrl + "&" + new Date().getTime();
                $scope.msg = res.message;
            }
        })
    };
    //qq登录
    $scope.qqLogin = function () {
        $scope.unionLogin(1);
    };

    //微信登录
    $scope.weixinLogin = function () {
        $scope.unionLogin(2);
    };

    //微博登录
    $scope.weiboLogin = function () {
        $scope.unionLogin(3);
    }
    //支付宝登录
    $scope.alipayLogin = function () {
        $scope.unionLogin(4);
    }
    $scope.unionLogin = function (gateway) {
        var redirectUrl = $rootScope.util.getCurrentDomain() + "/unionlogin.html";

        $rootScope.ajax.post("/ouser-web/api/union/getLoginParamsURL.do", {
            unionType : gateway,
            redirectURL: redirectUrl
        }).then(function (res) {
            if (res.code == 0) {
                window.location.href = res.data;
            } else {
                $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('暂时无法处理您的请求') + '!');
            }
        }, function (res) {
            $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('暂时无法处理您的请求') + '!');
        });
    };

    //加载联合登录的配置信息
    $scope.loadUnionLoginSettings = function () {
        // body.../ouser-web/unionLogin/iconInvisible.do

        $rootScope.ajax.post("/ouser-web/api/union/getUnionTypeStatus.do", {}).then(function (result) {
            if (result.code == 0) {
                $scope.showQQ = false;
                $scope.showWeixin = false;
                $scope.showWeibo = false;
                $scope.showAlipay = false;
                $scope.isThirdOperation = false;
                var data = result.data;
                for(var i = 0;i < data.length; i++){
                    if(data[i] == 1){
                        $scope.showQQ = true;
                        $scope.isThirdOperation = true;
                    }
                    else if(data[i] == 2){
                        $scope.showWeixin = true;
                        $scope.isThirdOperation = true;
                    }
                    else if(data[i] == 3){
                        $scope.showWeibo = true;
                        $scope.isThirdOperation = true;
                    }
                    else if(data[i] == 4){
                        $scope.showAlipay = true;
                        $scope.isThirdOperation = true;
                    }
                }
                $scope.showUnionLogin = $scope.showWeixin || $scope.showQQ ||  $scope.showWeibo || $scope.showAlipay;
            }
        })
    };


//     //轮播登录页面的图片
//     $scope.getLunboAndRightAd = function () {
//         var url = $rootScope.host + '/passport/getLoginAdvertisement.do',
//             params = {
//                 companyId: $rootScope.companyId
//             };
//         $rootScope.ajax.get(url,params).then(function (res) {
//             if (res.data) {
//                 $scope.loginPic = res.data.loginCarouselPicArray;
//                 $scope.lunbo = {};
//                 angular.forEach($scope.loginPic, function (v, k) {
//                     $scope.lunbo[k] = v;
//                     $scope.lunbo[k].imageUrl = v.fileStr;
//                     $scope.lunbo[k].name = v.fileName;
//                 })

//             }
//  //            if (res.data && res.data.pc_lunbo) {
//             //                $scope.lunbo = res.data.pc_lunbo;
//             //            }
//             //            if (res.data && res.data.pc_lunbo_right) {
//             //                $scope.channel = res.data.pc_lunbo_right;
//             //            }
//         },function(err){
//              //do nothing
//         })
//     };

    //广告code对接-轮播图
    $scope.getCodeLogin = function() {
        var url = '/ad-whale-web/dolphin/getAdSource',
            params = {
                pageCode:'HOME',
                adCode:'login_left',
                platform:1,
                companyId:$rootScope.companyId
            };
        $rootScope.ajax.get(url,params).then(function (res) {
            if (res.data) {

                $scope.lunbo = res.data.login_left;
                $scope.swiper = new Swiper('.swiper-container', {
                    effect: 'fade',
                    speed: 1000,
                    simulateTouch: false,
                    autoplay: {
                        delay: 5000,//1秒切换一次
                    },
                    fadeEffect: {
                        crossFade: true,
                    },
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true
                    },
                    on: {
                        paginationUpdate: function paginationUpdate() {
                            if ($scope.lunbo.length <= 1) {
                                $('.main .swiper-pagination').hide();
                            }
                        }
                    },
                    observer: true,
                    observeParents:true,
                });
            }
        })
    }
    $scope.getCodeLogin()
    //广告code对接-导航栏
    $scope.getCodeLoginTab = function() {
        var url = '/ad-whale-web/dolphin/getAdSource',
            params = {
                pageCode:'HOME',
                adCode:'login_tab',
                platform:1,
                companyId:$rootScope.companyId
            };
        $rootScope.ajax.get(url,params).then(function (res) {
            $scope.getCodeLoginTabSelect()
            if (res.data && res.data.login_tab) {
                $scope.login_tab = res.data.login_tab;

            }
        })
    }
    $scope.getCodeLoginTab()
    // 跳转链接
    $scope.goToUrl = function(url) {
        location.href = url
    }
    $scope.getCodeLoginTabSelect = function() {
        var url = '/ad-whale-web/dolphin/getAdSource',
            params = {
                pageCode:'HOME',
                adCode:'login_tab1,login_tab2,login_tab3',
                platform:1,
                companyId:$rootScope.companyId
            };
        $rootScope.ajax.get(url,params).then(function (res) {
            if (res.data &&  $scope.login_tab.length>0) {
                $scope.login_tab[0]['tabList'] = res.data.login_tab1;
                $scope.login_tab[1]['tabList'] = res.data.login_tab2;
                $scope.login_tab[2]['tabList'] = res.data.login_tab3;

            }
        })
    }

    // 判断手机验证码接口
    $scope.getInitPhone = function () {
        var url = '/ouser-web/api/user/init.do';

        $rootScope.ajax.post(url, {
            mobile:$scope.loginInfo.phoneNumber,
            initType: 0
        }).then(function (res) {
            $scope.needImgCaptchaPhone = res.data.needImgCaptcha;
            if($scope.needImgCaptchaPhone){
                $scope.cantSee();
            }
        });
    }
     // 判断账号验证码接口
    $scope.getInit = function () {
        var url = '/ouser-web/api/user/init.do';

        $rootScope.ajax.post(url, {
            mobile:$scope.loginInfo.employee,
            initType: 0
        }).then(function (res) {
            $scope.needImgCaptcha  = res.data.needImgCaptcha;
            if( $scope.needImgCaptcha){
                $scope.cantSee();
            }
        })
    }
    // 图片验证码
    $scope.getInit();//账号登录判断输入错误次数
    $scope.loadUnionLoginSettings();
    //$scope.getLunboAndRightAd();

   //获取shareCode参数

    $scope.getShareCode = function () {
        $scope.shareCode8 = $rootScope.util.cookie.getCookie('shareCode8')
        // console.log($scope.shareCode8);
        if ($scope.shareCode8) {
            $scope.sharename = decodeURI($rootScope.util.paramsFormat().shareName)
        }
    }
    $scope.getShareCode()


   $scope.sharenamelink="cregis.html"
   if($scope.sharename){
       $scope.sharenamelink="cregis.html?shareName="+$scope.sharename
   }
}])

