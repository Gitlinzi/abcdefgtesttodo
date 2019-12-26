/**
 * Created by Roy on 16/12/26.
 */

angular.module('directives')

.directive("loginBomb", ['$rootScope', '$cookieStore','$window', function ($rootScope, $cookieStore,$window) {
    return {
        template: '<div class="mini-login-modal" style="display: block" ng-if="showLoginBox">'+
            '    <div class="mnl-box">'+
            '        <div id="login-page">'+
            '            <dl class="mnl-title clearfix">'+
            '                <dt> {{i18n(\'您尚未登录\')}} </dt>'+
            '                <dd class="mnl-close" ng-click="hideLoginBox()">×</dd>'+
            '            </dl>'+
            '            <form class="login-form" ng-if="activeBox==0&&showScanLogin">' +
            '                <div ng-click="changeTab(\'scan\')" class="phone-box">' +
            '                    <span class="phone-text">' +
            '                        {{i18n(\'账号登录在这里\')' +
            '                    </span>' +
            '                </div>' +
            '                <h2 class="phoneText mgT25">{{i18n(\'手机扫码\')}}，{{i18n(\'安全登录\')}}</h2>' +
            '                <div class="code-img-box">' +
            '                    <span id="qrCode"></span>' +
            '                    <span>{{i18n(\'打开\')}}<b>APP</b>，{{i18n(\'扫码二维码登录\')}}</span>' +
            '                </div>' +
            '            </form>' +
            '            <form class="login-form" ng-if="activeBox==1">'+
            '                <div ng-click="changeTab()" class="qrcode-box" ng-if="showScanLogin">' +
            '                   <span class="qrcode-text">' +
            '                       <i class="qrcode-img"></i>' +
            '                       {{i18n(\'扫码登录更安全\')}}' +
            '                   </span>' +
            '                </div>' +
            '                <div class="login-index" ng-class="{\'mgT25\': showScanLogin}">' +
            '                   <div class="clearfix login-line">' +
            '                       <span ng-class="{\'login-active\':activeNum==1}" ng-click="changeLogin()">{{i18n(\'账号登录\')}}</span>' +
            '                       <span ng-class="{\'login-active\':activeNum==0}" ng-click="changeLogin(\'validate\')">{{i18n(\'手机登录\')}}</span>' +
            '                   </div>'+
            '                </div>'+
            '                <div class="phone-login" ng-if="activeNum==0">'+
            '                    <!--手机登录begin-->'+
            '                    <div class="msg-login">{{ msgPhone }}</div>'+
            '                    <div class="form-group">'+
            '                        <div class="has-prefix">'+
            '                            <input class="input big phone-user" autocomplete="off" pc-placeholder="i18n(\'手机号\')" placeholder="{{i18n(\'手机号\')}}" type="text"  ng-model="loginInfo.phoneNumber" name="phoneNumber" id="phoneNumber" ng-blur="mobile_tip = false;checkPhone()" ng-change="mobile_tip = false;checkPhone()">'+
            '                        </div>'+
            '                    </div>'+
            '                    <div class="form-group"  ng-if="needImgCaptchaPhone">'+
            '                        <div class="has-prefix">'+
            '                            <input class="input big phone-user" pc-placeholder="i18n(\'图片验证码\')" placeholder="{{i18n(\'图片验证码\')}}" type="text" ng-model="loginInfo.vicode" name="vicode">'+
            '                            <div class="phone-code">'+
            '                                <img width="100" height="40" class="vicode" id="vicode" ng-src="{{ checkImage }}" ng-click="cantSee()">'+
            '                                <span><a href="javascript:void(0)" ng-click="cantSee()">{{i18n(\'看不清换一张\')}}</a></span>'+
            '                            </div>'+
            '                        </div>'+
            '                    </div>'+
            '                    <div class="form-group">'+
            '                        <input class="input big codeipt" pc-placeholder="i18n(\'短信验证码\')" placeholder="{{i18n(\'短信验证码\')}}" type="text" ng-model="loginInfo.phoneCaptcha" name="phoneCaptcha" ng-enter="phoneLogin()">'+
            '                        <input type="button" class="btn" ng-value="smsBtn" ng-class="{\'smsBtn\': isNoExistPhone, \'smsBtnHigh\': !isNoExistPhone}" ng-value="smsBtn" ng-click="smsSend($event)" ng-disabled="isNoExistPhone">'+
            '                    </div>'+
            '                    <div class="form-group mgB0" >'+
            '                        <input type="button" id="loginBtn1" class="btn btn-one big red" ng-click="phoneLogin()" value="{{i18n(\'登录\')}}">'+
            '                    </div>'+
            '                </div>'+
            '                <!--手机登录end-->'+
            '                <div class="identity-login" ng-if="activeNum==1">'+
            '                    <div class="msg-login" >{{ msg }}</div>'+
            '                    <!--账号登录begin-->'+
            '                    <div class="form-group">'+
            '                        '+
            '                        <div class="has-prefix login-select">'+
            '                            <div class="icon-user-box fl">'+
            '                                <i class="icon-user"></i>'+
            // '                                <i class="icon-more-down"></i>'+
            '                            </div>'+
            '                            <select class="user-sele"  ng-model="loginInfo.user" ng-if="showJobNumber">'+
            '                                <option value="0">{{i18n(\'手机号\')}}</option>'+
            '                                <option value="1">{{i18n(\'工号\')}}</option>'+
            '                                '+
            '                            </select>'+
            '                            '+
            '                            <input class="input big icon-user-box-padL" pc-placeholder="i18n(\'账号\')" placeholder="{{i18n(\'账号\')}}" ng-class="{\'user-phone\': showJobNumber}" autocomplete="off" type="text" ng-model="loginInfo.employee" name="employee"  ng-blur="mobile_tip = false;check()" ng-change="mobile_tip = false;check()">'+
            '                        </div>'+
            '                    </div>'+
            '                    <div class="form-group">'+
            '                        <div class="has-prefix">'+
            '                            <div class="icon-user-box fl">'+
            '                                <i class="icon-suo"></i>'+
            '                            </div>'+
            '                            <input class="input big icon-user-box-padL" pc-placeholder="i18n(\'密码\')" placeholder="{{i18n(\'密码\')}}" type="password" ng-model="loginInfo.password" name="password" ng-enter="login()">'+
            '                        </div>'+
            '                    </div>'+
            '                    <div class="form-group mgB10" ng-if="needImgCaptcha">'+
            '                        <div class="has-prefix">'+
            '                            <input class="input big phone-user" pc-placeholder="i18n(\'图片验证码\')" placeholder="{{i18n(\'图片验证码\')}}" type="text" ng-model="loginInfo.vicode" name="vicode" ng-enter="login()">'+
            '                            <div class="phone-code">'+
            '                                <img width="100" height="40" class="vicode" id="vicode" ng-src="{{ checkImage }}" ng-click="cantSee()">'+
            '                                <span><a href="javascript:void(0)" ng-click="cantSee()">{{i18n(\'看不清换一张\')}}</a></span>'+
            '                            </div>'+
            '                        </div>'+
            '                    </div>'+
            '                    <a class="forget" href="forgot.html">{{i18n(\'忘记密码\')}}</a>'+
            '                    <!--<div class="form-group">'+
            '                        <input class="input big codeipt" pc-placeholder="i18n(\'短信验证码\')" placeholder="{{i18n(\'短信验证码\')}}" type="text" ng-model="vicode" name="vicode">'+
            '                        <input type="button" class="btn smsBtn " value="{{i18n(\'获取短信验证码\')}}" ng-model="captchaMsg" ng-click="smsSend($event)">'+
            '                    </div>-->'+
            '                    <div class="form-group" style="margin-bottom:0px">'+
            '                        <input type="button" id="loginBtn" class="btn btn-one big" ng-click="login()" value="{{i18n(\'登录\')}}">'+
            '                    </div>'+
            '                </div>'+
            '            </form>'+
            '            <div class="clear"></div>'+
            '            <!--账号登录end-->'+
            '            <div class="three-title" ng-if="isThirdOperation && showUnionLogin">{{i18n(\'第三方登录\')}}</div>'+
            '            <div class="union-login ng-cloak ">    '+
            '                <a href="javascript:void(0)" ng-click="weixinLogin()"  ng-if="showWeixin && showUnionLogin">'+
            '                    <img src="/images/weixin.png?v=${version}" alt="{{i18n(\'微信\')}}" title="{{i18n(\'微信\')}}" width="31px" height="30px">'+
            '                </a>'+
            '                <a href="javascript:void(0)"  ng-click="qqLogin()"  ng-if="showQQ && showUnionLogin">'+
            '                    <img src="/images/qq.png?v=${version}" alt="QQ" title="QQ" width="31px" height="30px">'+
            '                 </a>'+
            '                 <a href="javascript:void(0)"  ng-click="weiboLogin()" ng-if="showWeibo && showUnionLogin">'+
            '                    <img src="/images/weibo.png?v=${version}" alt="{{i18n(\'微博\')}}" title="{{i18n(\'微博\')}}" width="31px" height="30px">'+
            '                 </a>'+
            '                 <a href="javascript:void(0)"  ng-click="alipayLogin()"  ng-if="showAlipay && showUnionLogin">'+
            '                    <img src="/images/zhifubao.png?v=${version}" alt="{{i18n(\'支付宝\')}}" title="{{i18n(\'支付宝\')}}" width="31px" height="30px">'+
            '                 </a>'+
            '                 <a class="regis" href="cregis.html"> <i class="op-icons op-icons-regis"></i>{{i18n(\'免费注册\')}}</a>'+
            '            </div>'+
            '        </div>'+
            '    </div>'+
            '</div>',
        scope: {
            showLoginBox: '=',
            ngModel: '='
        },
        require: '?ngModel',
        link: function (scope, element, attrs, ngModel) {
            scope.i18n = function (key) {
                return $window.i18n ? $window.i18n(key) : key;
            };
            scope.changeTab = function(type) {
                if (!scope.showScanLogin) {
                    return;
                }
                if (type == 'scan') {
                    scope.activeBox=1;
                    scope.activeNum=0;
                    scope.clearInterval();
                } else {
                    scope.activeBox=0;
                    scope.startInterval();
                    //scope.getQrMessage();
                }
            }
            scope.changeLogin = function(type) {
                if (type == 'validate') {
                    scope.activeNum=0;
                    scope.checkPhone();
                } else {
                    scope.activeNum=1;
                }
            }
            //初始化变量
            scope.smsBtn = scope.i18n('获取短信验证码');
            scope.loginInfo = {
                phoneNumber: '', //手机号
                phoneCaptcha: '', //手机验证码
                vicode: '', //图片验证码
                employee: '', //工号
                password: '', //密码
                user:0,
            }
            scope.isNoExistPhone = true;
            /**
             * 记住账号
             */
            var chkRemAccount = $cookieStore.get('chkRemAccount');//获取记住账号多选框的状态
            if(chkRemAccount) {
                scope.remAccount = true;//选中
            }else {
                $cookieStore.remove('username');
                $cookieStore.remove('chkRemAccount');
            }
            scope.hideLoginBox = function() {
                $rootScope.showLoginBox = false;
                scope.clearInterval();
            }
            scope.getRemAccount = function () {
                var username = $cookieStore.get('username');
                if(username) {
                    scope.username = username;
                }
            }();
            scope.clickRemAccount = function () {
                if(!scope.remAccount) {
                    $cookieStore.remove('username');
                    $cookieStore.remove('chkRemAccount');
                }else {
                    $cookieStore.put('chkRemAccount', '1');
                }
            };
            /**
             * 验证码
             */
            scope.time = new Date().getTime(); //时间秒数
            //验证码图片获取地址
            scope.ciUrl = $rootScope.host_ouser + "/mobileLogin/checkImageForm.do?" +
                "width=" + 110 +
                "&height=" + 40 +
                "&codeNmInSession=" + 'vicode' +
                "&codeCount=" + 4;
            scope.checkImage = scope.ciUrl + "&" + scope.time;
            //刷新验证码
            scope.cantSee = function () {
                scope.checkImage = scope.ciUrl + "&" + new Date().getTime();
            };

            //检查手机号是否存在（手机号+短信验证码）
            scope.checkPhone = function() {
                // if (!scope.loginInfo.phoneNumber) {
                //     scope.isNoExistPhone = true;
                //     scope.msgPhone = '';
                //     return;
                // }
                // var isRepeatPhoneURL = $rootScope.host_ouser + "/api/user/checkAccountRepeat.do";
                // var params = {
                //     mobile: scope.loginInfo.phoneNumber
                // };
                // scope.checkPhoneEnd = true;
                // $rootScope.ajax.post(isRepeatPhoneURL, params).then(function (result) {
                //     if(result.code == 0){
                //         scope.msgPhone = '账号未注册';
                //         scope.checkPhoneEnd = false;
                //         scope.isNoExistPhone = true;
                //     } else if(result.code == 2) {
                //         scope.getInitPhone();
                //         scope.msgPhone = '';
                //         scope.isNoExistPhone = false;
                //     }
                // }).error(function () {
                //     scope.checkPhoneEnd = false;
                // });

                //产品化，快速登录不检查手机号是否注册，但做基本格式检验
                if(!scope.loginInfo.phoneNumber || scope.loginInfo.phoneNumber.length < 11){
                    scope.isNoExistPhone = true;
                    scope.msgPhone = '';
                    return;
                }

                if( /^[0-9]{11}$/.test(scope.loginInfo.phoneNumber)){
                    scope.isNoExistPhone = false;
                    return;
                } else{
                    scope.isNoExistPhone = true;
                    scope.msgPhone = scope.i18n('请输入正确的手机号');
                    return;
                }
            };
            //检查手机号是否存在（手机号+密码）
             scope.check = function() {
                if (!scope.loginInfo.employee) {
                    scope.isNoExistPhone = true;
                    scope.msg = '';
                    return;
                }
                var isRepeatPhoneURL = $rootScope.host_ouser + "/api/user/checkAccountRepeat.do";
                var params = {
                    mobile: scope.loginInfo.employee
                };
                scope.checkPhoneEnd = true;
                $rootScope.ajax.post(isRepeatPhoneURL, params).then(function (result) {
                    if(result.code == 0){
                        scope.msg = '';
                        scope.checkPhoneEnd = false;
                        scope.isNoExistPhone = true;
                    } else if(result.code == 2) {
                        scope.getInit();
                        scope.msg = '';
                        scope.isNoExistPhone = false;
                    }
                }, function () {
                    scope.checkPhoneEnd = false;
                })
            };
            //发送验证码
            scope.smsSend = function (event) {
                if (!scope.loginInfo.phoneNumber) {
                    scope.msgPhone = scope.i18n('请输入手机号');
                    return;
                }else if( !/^[0-9]{11}$/.test(scope.loginInfo.phoneNumber)){
                    scope.msgPhone = scope.i18n('请输入正确的手机号');
                    return;
                }
                var interval = 120; //重试时间间隔  秒
                var url = $rootScope.host_ouser + '/mobileRegister/sendCaptchasForm.do';
                var param = {
                    mobile: scope.loginInfo.phoneNumber,
                    captchasType: 3,
                };
                $rootScope.ajax.post(url, param).then(function (res) {
                    if (res.code == 0) {
                        //设置手机验证码重新获取倒计时
                        var obj = event.currentTarget;
                        var seconds = interval;
                        obj.value =scope.i18n('重新发送') + '(' + seconds + ')';
                        obj.disabled = true;
                        var inter = setInterval(function () {
                            seconds--;
                            obj.value = scope.i18n('重新发送') + '(' + seconds + ')';
                            if (seconds === 0) {
                                obj.value = scope.i18n('获取短信验证码');
                                obj.disabled = false;
                                clearInterval(inter);
                            }
                        }, 1000);
                    } else if(res.code == 6){
                        scope.msgPhone = res.message;
                    }else {
                        scope.msgPhone = res.message;
                    }
                    // scope.smsBtn = '重新获取';
                })
            };
            //手机登录
            scope.phoneLogin = function () {
                var phoneNumber = scope.loginInfo.phoneNumber;
                var phoneCaptcha = scope.loginInfo.phoneCaptcha;
                var vicode = scope.loginInfo.vicode;
                // scope.phoneNumber = $('#phoneNumber').val();
                if (!phoneNumber) {
                    scope.msgPhone = scope.i18n('请输入手机号');
                    return;
                }
                if (!/^[0-9]{11}$/.test(scope.loginInfo.phoneNumber)) {
                    scope.msgPhone = scope.i18n('请输入有效') + '11' + scope.i18n('位有效手机号');
                    return;
                }
                if (!phoneCaptcha) {
                    scope.msgPhone = scope.i18n('请输入短信验证码');
                    return;
                }
                if (!/^[0-9]{4,6}$/.test(scope.loginInfo.phoneCaptcha)) {
                    scope.msgPhone = scope.i18n('请输入正确的短信验证码');
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
                        if (scope.remAccount) {
                            $cookieStore.put('phoneNumber', phoneNumber); //记住账号
                        }
                        scope.msg = "";
                        //修改密码会有问题
                        //$rootScope.util.setUserToken(res.ut);
                        //scope.showBox = false;
                        //如果没有选择地址的弹框，每次登陆， 重新复制地址
                        if (!$rootScope.switchConfig.common.showUpdateDistributionAddress) {
                            $rootScope.localProvince.provinceFlag = true;
                        }
                        window.location.href=window.location.href.split('#')[0];
                    } else {
                        scope.getInitPhone();
                        scope.checkImage = scope.ciUrl + "&" + new Date().getTime();
                        scope.msgPhone = res.message;
                    }
                })
            };
            /**
             * 账号登录
             */
             scope.login = function (){
                 if(scope.loginInfo.user == 1){
                    scope.employeeLogin();
                 }else if(scope.loginInfo.user == 0){
                    scope.userLogin();
                 }else{
                     scope.userLogin();
                 }
             }
            // 手机号+密码
             scope.userLogin = function () {
                var phoneNumber = scope.loginInfo.employee;
                var password = scope.loginInfo.password;
                var vicode = scope.loginInfo.vicode;
                if (!phoneNumber) {
                    scope.msg = scope.i18n('用户名不能为空');
                    return false;
                } else if (!password) {
                    scope.msg = scope.i18n('密码不能为空');
                    return false;
                }
                else {
                    scope.msg = "";
                }
                $rootScope.ajax.post($rootScope.host_ouser + '/api/user/login.do', {
                    mobile: phoneNumber,
                    password: password,
                    checkImageCode: vicode,
                }).then(function (res) {
                    if (res.code == 0) {
                        $rootScope.util.cookie.setCookie('getTicket',1);
                        if (scope.remAccount) {
                            $cookieStore.put('phoneNumber', phoneNumber); //记住账号
                        }
                        scope.msg = "";
                        //修改密码会有问题
                        //$rootScope.util.setUserToken(res.ut);
                        //scope.showBox = false;
                        //如果没有选择地址的弹框，每次登陆， 重新复制地址
                        if (!$rootScope.switchConfig.common.showUpdateDistributionAddress) {
                            $rootScope.localProvince.provinceFlag = true;
                        }
                        window.location.href=window.location.href.split('#')[0];
                    }else {
                        scope.getInit();
                        scope.checkImage = scope.ciUrl + "&" + new Date().getTime();
                        scope.msg = res.message;
                    }
                });
            };
            // 工号+密码
            scope.employeeLogin = function () {
                var employee = scope.loginInfo.employee;
                var password = scope.loginInfo.password;
                var vicode = scope.loginInfo.vicode;

                if (!employee) {
                    scope.msg = scope.i18n('用户名不能为空');
                    return false;
                } else if (!password) {
                    scope.msg = scope.i18n('密码不能为空');
                    return false;
                }
                else {
                    scope.msg = "";
                }
                //工号+密码
                $rootScope.ajax.post($rootScope.host_ouser + '/api/union/login.do', {
                    employeeCode: employee,
                    employeePassword: password,
                    unionType: 5
                }).then(function (res) {
                    if(res.code == 0){
                        scope.msg = "";
                        //如果没有选择地址的弹框，每次登陆， 重新复制地址
                        if (!$rootScope.switchConfig.common.showUpdateDistributionAddress) {
                            $rootScope.localProvince.provinceFlag = true;
                        }
                        //scope.showBox = false;
                        if(!res.needBind){
                            window.location.href=window.location.href.split('#')[0];
                            //location.href='/index.html';
                        }else{
                            location.href='/binding.html?username='+res.oauthUsername;
                        }
                    }else{
                        scope.getInit();
                        scope.checkImage = scope.ciUrl + "&" + new Date().getTime();
                        scope.msg = res.message;
                    }
                });
            };
            //qq登录
            scope.qqLogin = function () {
                scope.unionLogin(1);
            };

            //微信登录
            scope.weixinLogin = function () {
                scope.unionLogin(2);
            };

            //微博登录
            scope.weiboLogin = function () {
                scope.unionLogin(3);
            }
            //支付宝登录
            scope.alipayLogin = function () {
                scope.unionLogin(4);
            }
            scope.unionLogin = function (gateway) {
                var redirectUrl = $rootScope.util.getCurrentDomain() + "/unionlogin.html";
                $rootScope.ajax.post("/ouser-web/api/union/getLoginParamsURL.do", {
                    unionType : gateway,
                    redirectURL: redirectUrl
                }).then(function (result) {
                    if (result.code == 0) {
                        window.location.href = result.data;
                    } else {
                        $rootScope.error.checkCode(scope.i18n('系统异常'), scope.i18n('暂时无法处理您的请求') + '!');
                    }
                }, function (result) {
                    $rootScope.error.checkCode(scope.i18n('系统异常'), scope.i18n('暂时无法处理您的请求') + '!');
                })
            };

            //加载联合登录的配置信息
            scope.loadUnionLoginSettings = function () {
                $rootScope.ajax.post("/ouser-web/api/union/getUnionTypeStatus.do", {}).then(function (result) {
                    if (result.code == "0") {
                        scope.showQQ = false;
                        scope.showWeixin = false;
                        scope.showWeibo = false;
                        scope.showAlipay = false;
                        scope.isThirdOperation = false;
                        var data = result.data;
                        for(var i = 0;i < data.length; i++){
                            if(data[i] == 1){
                                scope.showQQ = true;
                                scope.isThirdOperation = true;
                            }
                            else if(data[i] == 2){
                                scope.showWeixin = true;
                                scope.isThirdOperation = true;
                            }
                            else if(data[i] == 3){
                                scope.showWeibo = true;
                                scope.isThirdOperation = true;
                            }
                            else if(data[i] == 4){
                                scope.showAlipay = true;
                                scope.isThirdOperation = true;
                            }
                        }
                        scope.showUnionLogin = scope.showWeixin || scope.showQQ ||  scope.showWeibo || scope.showAlipay;
                    }
                });
            };

            // 判断手机验证码接口
            scope.getInitPhone = function () {
                var url = '/ouser-web/api/user/init.do';
                $rootScope.ajax.post(url, {
                    mobile:scope.loginInfo.phoneNumber,
                    initType: 0
                }).then(function (res) {
                   scope.needImgCaptchaPhone = res.data.needImgCaptcha;

                    if(scope.needImgCaptchaPhone){
                        scope.cantSee();
                    }
                });
            }
             // 判断账号验证码接口
            scope.getInit = function () {
                var url = '/ouser-web/api/user/init.do';
                $rootScope.ajax.post(url, {
                    mobile:scope.loginInfo.employee,
                    initType: 0
                }).then(function (res) {
                    scope.needImgCaptcha  = res.data.needImgCaptcha;
                    if( scope.needImgCaptcha){
                        scope.cantSee();
                    }
                });
            }

            var timer;
            scope.deviceId = 'qwerasdzxc111222';
            // 获取扫描登录的二维码
            scope.getQrMessage = function() {
                var url = ' /ouser-web/scanLogin/getTokenForm.do';
                var params = {
                    deviceId : scope.deviceId,
                    sourseId : 3
                }
                $rootScope.ajax.post(url, params).then(function(res) {
                    if( res.code == 0 ) {
                        scope.phoneUt = res.ut;
                        scope.phoneSt = res.st;
                        scope.phoneNewSt =  'lyf://sweepLogin?st=' + res.st + ',' + scope.deviceId;
                        $("#qrCode").children().remove();
                        if( $rootScope.isIE8 ) {
                            $("#qrCode").qrcode({
                                render:"table",
                                width:116,
                                height:116,
                                text:scope.phoneNewSt
                            })
                        } else {
                            $("#qrCode").qrcode({
                                render:"canvas",
                                width:116,
                                height:116,
                                text:scope.phoneNewSt
                            })
                        }
                        clearInterval(timer);
                        var num = 0;
                        timer = setInterval(function(){
                            num+=2;
                            if(num >= 30){ //0.5分钟轮询校验登录接口成功
                                num = 0;
                                scope.getLoginStatus();
                            }
                        },2000);
                    }
                });
            }

            scope.clearInterval = function() {
                clearInterval(timer);
            }

            scope.startInterval = function() {
                clearInterval(timer);
                var num = 0;
                timer = setInterval(function(){
                    num+=2;
                    if(num >= 30){ //0.5分钟轮询校验登录接口成功
                        num = 0;
                        scope.getLoginStatus();
                    }
                },2000);
            }

            // 循环检验登录状态
            scope.getLoginStatus = function() {
                var url = '/ouser-web/scanLogin/getAuthorizationStateForm.do';
                var params = {
                    ut : scope.phoneUt,
                    st : scope.phoneSt,
                    sourseId : 3,
                    deviceId : scope.deviceId
                }
                $rootScope.ajax.post(url, params).then(function( res ) {
                    if( res.code == 0 ) {
                        window.location.href=window.location.href.split('#')[0];
                    }
                });
            }
            scope.$watch('showLoginBox', function (value) {
                if (value) {
                    scope.showScanLogin = $rootScope.switchConfig.common.showScanLogin;
                    scope.showJobNumber = $rootScope.switchConfig.user.login.showJobNumber;
                    scope.showUnionLogin = $rootScope.switchConfig.user.login.showUnionLogin;
                    scope.showAccountLoginDesc = $rootScope.switchConfig.user.login.showAccountLoginDesc;
                    scope.showLoginBox = true;
                    // 图片验证码
                    scope.getInit();//账号登录判断输入错误次数
                    scope.loadUnionLoginSettings();
                    if (scope.showScanLogin) {
                        scope.activeBox = 0;
                        scope.getQrMessage();
                    } else {
                        scope.activeBox = 1;
                        scope.activeNum=1;
                    }
                }
            });

            /*$rootScope.$watch('isNeedCheckLogin', function (value) {
                if ($rootScope.isNeedCheckLogin) {
                    scope.showBox = true;
                }
            });*/
        }
    }
}])
//添加到购物车
.directive('miniAddCart', ['$rootScope','$window', function ($rootScope,$window) {
    return {
        template: [
            '<div class="choose-btns mgT5">',
            //~ '    <div class="count">',
            //~ '        <input class="num" data-min="1" data-max="9999" ng-model="pcIteminfo.itemAmount" ng-change="pcIteminfo._updatedProducts(0)">',
            //~ '        <div class="count-btn">',
            //~ '           <span class="posR" ng-click="pcIteminfo._updatedProducts(1)">',
            //~ '            <i class="icons my-add"></i>',
            //~ '            <input type="button" class="add" value=" " ng-class="{disabled:pcIteminfo.itemAmount>=prod.stockNum || pcIteminfo.itemAmount>=prod.virtualAvailableStockNum}"  ng-disabled="pcIteminfo.itemAmount>=prod.stockNum || pcIteminfo.itemAmount>=prod.virtualAvailableStockNum">',
            //~ '           </span>',
            //~ '           <span class="posR" ng-click="pcIteminfo._updatedProducts(-1)">',
            //~ '            <i class="icons my-sub"></i>',
            //~ '            <input type="button" class="sub disabled" value=" " ng-class="{disabled:pcIteminfo.itemAmount<=1}" ng-disabled="pcIteminfo.itemAmount<=1" ng-click="pcIteminfo._updatedProducts(-1)">',
            //~ '           </span>',
            //~ '        </div>',
            //~ '    </div>',
            // '    <a class="compare" ng-class="{checked: prod.compare}" ng-click="opts.addCompareBox($event,prod)">{{i18n("对比")}}</a>',
            // '    <a class="favor" ng-class="{favored: prod.favored}" ng-click="opts.itemAddFavorite($event,prod)">{{i18n("收藏")}}</a>',
            '    <a class="addCarts" href="javascript:void(0)" ng-if="prod.stockNum>0 || prod.virtualAvailableStockNum>0" num="pcIteminfo.itemAmount" ng-click="pcIteminfo._addToCart(prod)">',
            '       {{i18n("加入")}}{{i18n(cartName)}}',
            '    </a>',
            '    <a class="addCarts disable" href="javascript:void(0)" ',
            '           ng-class="{disabled: prod.stockNum<=0 || prod.virtualAvailableStockNum<=0}" ',
            '           ng-disabled="prod.stockNum<=0 || prod.virtualAvailableStockNum<=0" ',
            '           ng-if="prod.stockNum<=0 || prod.virtualAvailableStockNum<=0">',
            '       {{i18n("暂无库存")}}',
            '    </a>',
            '</div>',
        ].join(''),
        scope: {
            prod: '=',
            cartName: '@'
        },
        transclude: true,
        link: function (scope, element, attrs, ctrl) {
            scope.i18n = function (key) {
                return $window.i18n ? $window.i18n(key) : key;
            };
            var prod = scope.prod;
            scope.prod.amount = 1;
            scope.addCart = $rootScope.addCart;
            scope.tmid = 0;
            scope.pcIteminfo = {
                itemAmount: 1,
                tipPop: true,
                _updatedProducts: function (n) {
                    this.itemAmount = parseInt(this.itemAmount) + n;
                    if (!this.itemAmount) {
                        this.itemAmount = 1;
                    } else {
                        if (prod.stockNum && this.itemAmount > prod.stockNum ) {
                            this.itemAmount = prod.stockNum;
                        // } else if (prod.individualLimitNum > 0 && this.itemAmount > prod.individualLimitNum) {//有限购, 并且超出了限购
                        //     var that = this;
                        //     if (that.tipPop) {
                        //         $rootScope.error.checkCode('提示', '商品限购' + prod.individualLimitNum + '件, 超出部分将以原价购买', {
                        //             type: 'confirm',
                        //             btnOKText: '继续购买',
                        //             ok: function () {
                        //                 that.tipPop = false;
                        //             },
                        //             cancel: function () {
                        //                 that.itemAmount = prod.individualLimitNum;
                        //             }
                        //         });
                        //     }
                        }else if(prod.virtualAvailableStockNum && this.itemAmount > prod.virtualAvailableStockNum ){
                            this.itemAmount = prod.virtualAvailableStockNum;
                        }
                    }
                    scope.prod.amount = this.itemAmount
                    //html没有展示此接口返回的值，注释此接口 产品化1.2
                    //$rootScope.localProvince._computeDeliveryFee(prod.mpId, scope.pcIteminfo.itemAmount);
                },
                _addToCart: function(prod) {
                    var url = '/back-product-web2/extra/merchantProduct/getMerchantProductBaseInfoById.do',
                        params = {
                            mpId:prod.mpId,
                        },
                        that = this;
                    $rootScope.ajax.postJson(url,params).then(function (response) {
                         //商品不存在时
                        if(response.code=='100'){
                            $scope.isShowNoProduct=true;
                            $scope.noProduct=response.message;
                        }
                        if(response.code=='10700101'){
                            location.href="/index.html";
                            return;
                        }
                        if(response.data.typeOfProduct == 3){
                            window.location.href = '/item.html?itemId='+prod.mpId;
                            return;
                        }else{
                            that._addToCart2(prod);
                        }
                    });
                },
                _addToCart2: function(prod) {
                    var opts = {
                        isSeries: false, //是否虚品
                        checked: true,
                        isPresell: 0
                    }
                    opts.isSeries = prod.typeOfProduct;
                    opts.isPresell = prod.isPresell;
                    //如果有商品属性，提示选择属性，如果是虚拟商品, 不处理
                    if (opts.isSeries==3) {
                        return;
                    }
                    //添加成功的提示
                    $rootScope.addCart(prod, scope.pcIteminfo.itemAmount, opts.checked,function(data){
                        $rootScope.error.checkCode($rootScope.i18n('提示'),$rootScope.i18n('加入购物车成功'));
                        $rootScope.$emit('updateMiniCartToParent');//把成功事件传递到父控制器
                    });
                }
            };
            scope.opts = {
                linkTo: '/item.html?itemId=',
                showPromotion: true, //是否展示促销标签
                showStore: true, //是否展示商家
                showComment: false, //是否展示评论数
                showVolume: false, //是否展示销量
                styles: {}, //元素的css样式:price, promotion, goodsName, storeName
                addCompareBox:function ($event,product) {
                    $event.stopPropagation();
                    $event.preventDefault();
                    if (!product.compare) {
                        var url = $rootScope.home + '/custom-sbd-web/product/addComparisonBox.do';
                        $rootScope.ajax.postJson(url,{mpIds:[product.mpId]}).then(res=>{
                            if (res.code == 0) {
                                scope.$emit('getCompareBox')
                                scope.$emit('updateCompareBox',true)
                            }else{
                                $rootScope.error.checkCode(res.message,res.message,{
                                    type:'info'
                                });
                            }

                        },function (result) {
                            $rootScope.error.checkCode(scope.i18n('系统异常'),scope.i18n('系统异常'),{
                                type:'info'
                            });
                        })
                    } else {
                        var merchantProductId = product.mpId;
                        var url = $rootScope.home + '/custom-sbd-web/product/deleteComparisonBox.do';
                        $rootScope.ajax.postJson(url,{merchantProductId}).then(res=>{
                            if (res.code == 0) {
                                scope.$emit('delCompare',merchantProductId)
                            }else{
                                $rootScope.error.checkCode($scope.i18n('删除失败'),$scope.i18n('删除失败'),{
                                    type:'info'
                                });
                            }

                        },function (result) {
                            $rootScope.error.checkCode($scope.i18n('系统异常'),$scope.i18n('系统异常'),{
                                type:'info'
                            });
                        })
                    }

                },
                itemAddFavorite: function(e,prod) {
                  scope.$emit('addFavorite',prod)
                },
                checkOneBtn:function (prod) {
                    scope.$emit('checkAllBtn2', prod);
                },
                //点击添加至预置订单
                addAdvance:function ($event,product) {
                    $event.stopPropagation();
                    $event.preventDefault();
                    angular.forEach(scope.prodList,function (item) {
                        if (item.advanceShow) {
                            item.advanceShow = false;
                        }
                    })
                    product.advanceShow = true;
                    $rootScope.addNewprodList=product;
                }
            };
        }
    }
}])

//搜索页加入购物车
.directive('searchMiniAddCart', ['$rootScope','$window', function ($rootScope,$window) {
    return {
        template: [
            '<div class="choose-btns mgT5">',
            //~ '    <div class="count">',
            //~ '        <input class="num" data-min="1" data-max="9999" ng-model="pcIteminfo.itemAmount" ng-change="pcIteminfo._updatedProducts(0)">',
            //~ '        <div class="count-btn">',
            //~ '           <span class="posR" ng-click="pcIteminfo._updatedProducts(1)">',
            //~ '            <i class="icons my-add"></i>',
            //~ '            <input type="button" class="add" value=" " ng-class="{disabled:pcIteminfo.itemAmount>=prod.stockNum || pcIteminfo.itemAmount>=prod.virtualAvailableStockNum}"  ng-disabled="pcIteminfo.itemAmount>=prod.stockNum || pcIteminfo.itemAmount>=prod.virtualAvailableStockNum">',
            //~ '           </span>',
            //~ '           <span class="posR" ng-click="pcIteminfo._updatedProducts(-1)">',
            //~ '            <i class="icons my-sub"></i>',
            //~ '            <input type="button" class="sub disabled" value=" " ng-class="{disabled:pcIteminfo.itemAmount<=1}" ng-disabled="pcIteminfo.itemAmount<=1" ng-click="pcIteminfo._updatedProducts(-1)">',
            //~ '           </span>',
            //~ '        </div>',
            //~ '    </div>',
            '    <a class="compare" ng-class="{checked: prod.compare}" ng-click="opts.addCompareBox($event,prod)">{{i18n("对比")}}</a>',
            '    <a class="favor" ng-class="{favored: prod.favored}" ng-click="opts.itemAddFavorite($event,prod)">{{i18n("收藏")}}</a>',
            '    <a class="addCarts" href="javascript:void(0)" ng-if="prod.stockNum>0 || prod.virtualAvailableStockNum>0" num="pcIteminfo.itemAmount" ng-click="pcIteminfo._addToCart(prod)">',
            '       {{i18n("加入")}}{{i18n(cartName)}}',
            '    </a>',
            '    <a class="addCarts disable" href="javascript:void(0)" ',
            '           ng-class="{disabled: prod.stockNum<=0 || prod.virtualAvailableStockNum<=0}" ',
            '           ng-disabled="prod.stockNum<=0 || prod.virtualAvailableStockNum<=0" ',
            '           ng-if="prod.stockNum<=0 || prod.virtualAvailableStockNum<=0">',
            '       {{i18n("暂无库存")}}',
            '    </a>',
            '</div>',
        ].join(''),
        scope: {
            prod: '=',
            cartName: '@'
        },
        transclude: true,
        link: function (scope, element, attrs, ctrl) {
            scope.i18n = function (key) {
                return $window.i18n ? $window.i18n(key) : key;
            };
            var prod = scope.prod;
            scope.prod.amount = 1;
            scope.addCart = $rootScope.addCart;
            scope.tmid = 0;
            scope.pcIteminfo = {
                itemAmount: 1,
                tipPop: true,
                _updatedProducts: function (n) {
                    this.itemAmount = parseInt(this.itemAmount) + n;
                    if (!this.itemAmount) {
                        this.itemAmount = 1;
                    } else {
                        if (prod.stockNum && this.itemAmount > prod.stockNum ) {
                            this.itemAmount = prod.stockNum;
                        // } else if (prod.individualLimitNum > 0 && this.itemAmount > prod.individualLimitNum) {//有限购, 并且超出了限购
                        //     var that = this;
                        //     if (that.tipPop) {
                        //         $rootScope.error.checkCode('提示', '商品限购' + prod.individualLimitNum + '件, 超出部分将以原价购买', {
                        //             type: 'confirm',
                        //             btnOKText: '继续购买',
                        //             ok: function () {
                        //                 that.tipPop = false;
                        //             },
                        //             cancel: function () {
                        //                 that.itemAmount = prod.individualLimitNum;
                        //             }
                        //         });
                        //     }
                        }else if(prod.virtualAvailableStockNum && this.itemAmount > prod.virtualAvailableStockNum ){
                            this.itemAmount = prod.virtualAvailableStockNum;
                        }
                    }
                    scope.prod.amount = this.itemAmount
                    //html没有展示此接口返回的值，注释此接口 产品化1.2
                    //$rootScope.localProvince._computeDeliveryFee(prod.mpId, scope.pcIteminfo.itemAmount);
                },
                _addToCart: function(prod) {
                    var url = '/back-product-web2/extra/merchantProduct/getMerchantProductBaseInfoById.do',
                        params = {
                            mpId:prod.mpId,
                        },
                        that = this;
                    $rootScope.ajax.postJson(url,params).then(function (response) {
                         //商品不存在时
                        if(response.code=='100'){
                            $scope.isShowNoProduct=true;
                            $scope.noProduct=response.message;
                        }
                        if(response.code=='10700101'){
                            location.href="/index.html";
                            return;
                        }
                        if(response.data.typeOfProduct == 3){
                            window.location.href = '/item.html?itemId='+prod.mpId;
                            return;
                        }else{
                            that._addToCart2(prod);
                        }
                    });
                },
                _addToCart2: function(prod) {
                    var opts = {
                        isSeries: false, //是否虚品
                        checked: true,
                        isPresell: 0
                    }
                    opts.isSeries = prod.typeOfProduct;
                    opts.isPresell = prod.isPresell;
                    //如果有商品属性，提示选择属性，如果是虚拟商品, 不处理
                    if (opts.isSeries==3) {
                        return;
                    }
                    //添加成功的提示
                    $rootScope.addCart(prod, scope.pcIteminfo.itemAmount, opts.checked,function(data){
                        $rootScope.error.checkCode($rootScope.i18n('提示'),$rootScope.i18n('加入购物车成功'));
                        $rootScope.$emit('updateMiniCartToParent');//把成功事件传递到父控制器
                    });
                }
            };
            scope.opts = {
                linkTo: '/item.html?itemId=',
                showPromotion: true, //是否展示促销标签
                showStore: true, //是否展示商家
                showComment: false, //是否展示评论数
                showVolume: false, //是否展示销量
                styles: {}, //元素的css样式:price, promotion, goodsName, storeName
                addCompareBox:function ($event,product) {
                    $event.stopPropagation();
                    $event.preventDefault();
                    if (!product.compare) {
                        var url = $rootScope.home + '/custom-sbd-web/product/addComparisonBox.do';
                        $rootScope.ajax.postJson(url,{mpIds:[product.mpId]}).then(res=>{
                            if (res.code == 0) {
                                scope.$emit('getCompareBox')
                                scope.$emit('updateCompareBox',true)
                            }else{
                                $rootScope.error.checkCode(res.message,res.message,{
                                    type:'info'
                                });
                            }

                        },function (result) {
                            $rootScope.error.checkCode(scope.i18n('系统异常'),scope.i18n('系统异常'),{
                                type:'info'
                            });
                        })
                    } else {
                        var merchantProductId = product.mpId;
                        var url = $rootScope.home + '/custom-sbd-web/product/deleteComparisonBox.do';
                        $rootScope.ajax.postJson(url,{merchantProductId}).then(res=>{
                            if (res.code == 0) {
                                scope.$emit('delCompare',merchantProductId)
                            }else{
                                $rootScope.error.checkCode($scope.i18n('删除失败'),$scope.i18n('删除失败'),{
                                    type:'info'
                                });
                            }

                        },function (result) {
                            $rootScope.error.checkCode($scope.i18n('系统异常'),$scope.i18n('系统异常'),{
                                type:'info'
                            });
                        })
                    }

                },
                itemAddFavorite: function(e,prod) {
                  scope.$emit('addFavorite',prod)
                },
                checkOneBtn:function (prod) {
                    scope.$emit('checkAllBtn2', prod);
                },
                //点击添加至预置订单
                addAdvance:function ($event,product) {
                    $event.stopPropagation();
                    $event.preventDefault();
                    angular.forEach(scope.prodList,function (item) {
                        if (item.advanceShow) {
                            item.advanceShow = false;
                        }
                    })
                    product.advanceShow = true;
                    $rootScope.addNewprodList=product;
                }
            };
        }
    }
}])
    // 原按钮
    .directive('miniAddCartTwo', ['$rootScope','$window', function ($rootScope,$window) {
        return {
            template: [
                '<div class="choose-btns mgT5" style="border: none">',
                '    <div class="count">',
                '        <input class="num" data-min="1" data-max="9999" ng-model="pcIteminfo.itemAmount" ng-change="pcIteminfo._updatedProducts(0)">',
                '        <div class="count-btn">',
                '           <span class="posR" ng-click="pcIteminfo._updatedProducts(1)">',
                '            <i class="icons my-add"></i>',
                '            <input type="button" class="add" value=" " ng-class="{disabled:pcIteminfo.itemAmount>=prod.stockNum || pcIteminfo.itemAmount>=prod.virtualAvailableStockNum}"  ng-disabled="pcIteminfo.itemAmount>=prod.stockNum || pcIteminfo.itemAmount>=prod.virtualAvailableStockNum">',
                '           </span>',
                '           <span class="posR" ng-click="pcIteminfo._updatedProducts(-1)">',
                '            <i class="icons my-sub"></i>',
                '            <input type="button" class="sub disabled" value=" " ng-class="{disabled:pcIteminfo.itemAmount<=1}" ng-disabled="pcIteminfo.itemAmount<=1" ng-click="pcIteminfo._updatedProducts(-1)">',
                '           </span>',
                '        </div>',
                '    </div>',
                // '    <a class="compare" ng-class="{checked: prod.compare}" ng-click="opts.addCompareBox($event,prod)">{{i18n("对比")}}</a>',
                // '    <a class="favor" ng-class="{favored: prod.favored}" ng-click="opts.itemAddFavorite($event,prod)">{{i18n("收藏")}}</a>',
                '    <a class="addCarts" style="margin-left: 110px;" href="javascript:void(0)" ng-if="prod.stockNum>0 || prod.virtualAvailableStockNum>0" num="pcIteminfo.itemAmount" ng-click="pcIteminfo._addToCart(prod)">',
                '       {{i18n("加入")}}{{i18n(cartName)}}',
                '    </a>',
                '    <a class="addCarts disable" href="javascript:void(0)" ',
                '           ng-class="{disabled: prod.stockNum<=0 || prod.virtualAvailableStockNum<=0}" ',
                '           ng-disabled="prod.stockNum<=0 || prod.virtualAvailableStockNum<=0" ',
                '           ng-if="prod.stockNum<=0 || prod.virtualAvailableStockNum<=0">',
                '       {{i18n("暂无库存")}}',
                '    </a>',
                '</div>',
            ].join(''),
            scope: {
                prod: '=',
                cartName: '@'
            },
            transclude: true,
            link: function (scope, element, attrs, ctrl) {
                scope.i18n = function (key) {
                    return $window.i18n ? $window.i18n(key) : key;
                };
                var prod = scope.prod;
                scope.prod.amount = 1;
                scope.addCart = $rootScope.addCart;
                scope.tmid = 0;
                scope.pcIteminfo = {
                    itemAmount: 1,
                    tipPop: true,
                    _updatedProducts: function (n) {
                        this.itemAmount = parseInt(this.itemAmount) + n;
                        if (!this.itemAmount) {
                            this.itemAmount = 1;
                        } else {
                            if (prod.stockNum && this.itemAmount > prod.stockNum ) {
                                this.itemAmount = prod.stockNum;
                                // } else if (prod.individualLimitNum > 0 && this.itemAmount > prod.individualLimitNum) {//有限购, 并且超出了限购
                                //     var that = this;
                                //     if (that.tipPop) {
                                //         $rootScope.error.checkCode('提示', '商品限购' + prod.individualLimitNum + '件, 超出部分将以原价购买', {
                                //             type: 'confirm',
                                //             btnOKText: '继续购买',
                                //             ok: function () {
                                //                 that.tipPop = false;
                                //             },
                                //             cancel: function () {
                                //                 that.itemAmount = prod.individualLimitNum;
                                //             }
                                //         });
                                //     }
                            }else if(prod.virtualAvailableStockNum && this.itemAmount > prod.virtualAvailableStockNum ){
                                this.itemAmount = prod.virtualAvailableStockNum;
                            }
                        }
                        scope.prod.amount = this.itemAmount
                        //html没有展示此接口返回的值，注释此接口 产品化1.2
                        //$rootScope.localProvince._computeDeliveryFee(prod.mpId, scope.pcIteminfo.itemAmount);
                    },
                    _addToCart: function(prod) {
                        var url = '/back-product-web2/extra/merchantProduct/getMerchantProductBaseInfoById.do',
                            params = {
                                mpId:prod.mpId,
                            },
                            that = this;
                        $rootScope.ajax.postJson(url,params).then(function (response) {
                            //商品不存在时
                            if(response.code=='100'){
                                $scope.isShowNoProduct=true;
                                $scope.noProduct=response.message;
                            }
                            if(response.code=='10700101'){
                                location.href="/index.html";
                                return;
                            }
                            if(response.data.typeOfProduct == 3){
                                window.location.href = '/item.html?itemId='+prod.mpId;
                                return;
                            }else{
                                that._addToCart2(prod);
                            }
                        });
                    },
                    _addToCart2: function(prod) {
                        var opts = {
                            isSeries: false, //是否虚品
                            checked: true,
                            isPresell: 0
                        }
                        opts.isSeries = prod.typeOfProduct;
                        opts.isPresell = prod.isPresell;
                        //如果有商品属性，提示选择属性，如果是虚拟商品, 不处理
                        if (opts.isSeries==3) {
                            return;
                        }
                        //添加成功的提示
                        $rootScope.addCart(prod, scope.pcIteminfo.itemAmount, opts.checked,function(data){
                            $rootScope.error.checkCode($rootScope.i18n('提示'),$rootScope.i18n('加入购物车成功'));
                            $rootScope.$emit('updateMiniCartToParent');//把成功事件传递到父控制器
                        });
                    }
                };
                scope.opts = {
                    linkTo: '/item.html?itemId=',
                    showPromotion: true, //是否展示促销标签
                    showStore: true, //是否展示商家
                    showComment: false, //是否展示评论数
                    showVolume: false, //是否展示销量
                    styles: {}, //元素的css样式:price, promotion, goodsName, storeName
                    addCompareBox:function ($event,product) {
                        $event.stopPropagation();
                        $event.preventDefault();
                        if (!product.compare) {
                            var url = $rootScope.home + '/custom-sbd-web/product/addComparisonBox.do';
                            $rootScope.ajax.postJson(url,{mpIds:[product.mpId]}).then(res=>{
                                if (res.code == 0) {
                                    scope.$emit('getCompareBox')
                                    scope.$emit('updateCompareBox',true)
                                }else{
                                    $rootScope.error.checkCode(res.message,res.message,{
                                        type:'info'
                                    });
                                }

                            },function (result) {
                                $rootScope.error.checkCode(scope.i18n('系统异常'),scope.i18n('系统异常'),{
                                    type:'info'
                                });
                            })
                        } else {
                            var merchantProductId = product.mpId;
                            var url = $rootScope.home + '/custom-sbd-web/product/deleteComparisonBox.do';
                            $rootScope.ajax.postJson(url,{merchantProductId}).then(res=>{
                                if (res.code == 0) {
                                    scope.$emit('delCompare',merchantProductId)
                                }else{
                                    $rootScope.error.checkCode($scope.i18n('删除失败'),$scope.i18n('删除失败'),{
                                        type:'info'
                                    });
                                }

                            },function (result) {
                                $rootScope.error.checkCode($scope.i18n('系统异常'),$scope.i18n('系统异常'),{
                                    type:'info'
                                });
                            })
                        }

                    },
                    itemAddFavorite: function(e,prod) {
                        scope.$emit('addFavorite',prod)
                    },
                    checkOneBtn:function (prod) {
                        scope.$emit('checkAllBtn2', prod);
                    },
                    //点击添加至预置订单
                    addAdvance:function ($event,product) {
                        $event.stopPropagation();
                        $event.preventDefault();
                        angular.forEach(scope.prodList,function (item) {
                            if (item.advanceShow) {
                                item.advanceShow = false;
                            }
                        })
                        product.advanceShow = true;
                        $rootScope.addNewprodList=product;
                    }
                };
            }
        }
    }])
//地址弹框组件调用
.directive("addressBox", ['$rootScope','$window', function($rootScope,$window) {
    return {
        template: '<form class="form add-user transverse-display-block" id="addressEdit" name="addressEdit" novalidate ng-if="toAddNewAddress">' +
            '    <div class="add-title clearfix">' +
            '        <span ng-if="!addressBoxData.newAddress.id" class="title-text">{{i18n(\'新增收货人信息\')}}</span>' +
            '        <span ng-if="addressBoxData.newAddress.id" class="title-text">{{i18n(\'编辑收货人信息\')}}</span>' +
            '        <span class="close-img" ng-click="close()"></span>' +
            '    </div>' +
            '    <div ng-init="hasError={color:\'red\'}">' +
            '        <dl class="clearfix">' +
            '            <dt>' +
            '                <span class="colorRed">*</span>' +
            '                <span>{{i18n(\'收货人\'}})</span>' +
            '            </dt>' +
            '            <dd>' +
            '                <input type="text"' +
            '                         class="input seem-height"' +
            '                         placeholder="{{i18n(\'姓名\')}}" ' +
            '                         id="userName"' +
            '                         name="userName"' +
            '                         ng-model="addressBoxData.newAddress.userName"' +
            '                         ng-blur="validateStatus.nameTipShow=false"' +
            '                         ng-focus="validateStatus.nameTipShow=true"' +
            '                         ng-pattern="nameRex"' +
            '                         required>' +
            '                <div class="clear"></div>' +
            '            </dd>' +
            '            <p class="addr-infor">' +
            '                <div class="addr pddleft fl"' +
            '                     ng-style="{display:validateStatus.nameTipShow?\'block\':\'none\'}">{{i18n(\'仅支持\')}}20{{i18n(\'个字符以内的中文\')}}、{{i18n(\'英文或数字\')}}</div>' +
            '                <div class="tip addr err pddleft"' +
            '                     ng-style="{display:!validateStatus.nameTipShow && (addressEdit.userName.$dirty||addressBoxData.invalidSubmit) && addressEdit.userName.$invalid?\'block\':\'none\'}">' +
            '                    <span ng-show="addressEdit.userName.$error.required">{{i18n(\'收货人不能为空")</span>' +
            '                    <span ng-show="addressEdit.userName.$error.pattern">{{i18n(\'仅支持\')}}20{{i18n(\'个字符以内的中文\')}}、{{i18n(\'英文或数字\')}}</span>' +
            '                </div>' +
            '            </p>' +
            '        </dl>' +
            '        <dl class="clearfix">' +
            '            <dt class="fl">' +
            '                <span class="colorRed">*</span>' +
            '                <span>{{i18n(\'所在地区\')}}</span>' +
            '            </dt>' +
            '            <dd>' +
            '                <select class="select"' +
            '                        name="province"' +
            '                        id="province"' +
            '                        required' +
            '                        ng-blur="validateStatus.provinceTipShow=false"' +
            '                        ng-focus="validateStatus.provinceTipShow=true"' +
            '                        ng-model="addressBoxData.newAddress.provinceCode"' +
            '                        ng-change="_getLayerAddress(addressBoxData.newAddress.provinceCode,2);validate(\'province\',addressBoxData.newAddress.provinceCode)"' +
            '                        ng-options="pro.code+\'_\'+pro.code as pro.name for pro in multiAddress.provinces">' +
            '                    <option value="">-- {{i18n(\'省份\')}} --</option>' +
            '                </select>' +

            '                <select class="select"' +
            '                        name="city"' +
            '                        id="city"' +
            '                        required' +
            '                        ng-blur="validateStatus.cityTipShow=false"' +
            '                        ng-focus="validateStatus.cityTipShow=true"' +
            '                        ng-model="addressBoxData.newAddress.cityCode"' +
            '                        ng-change="_getLayerAddress(addressBoxData.newAddress.cityId,3);validate(\'city\',addressBoxData.newAddress.cityId)"' +
            '                        ng-options="city.code+\'_\'+city.code as city.name for city in multiAddress.cities">' +
            '                    <option value="">-- {{i18n(\'城市\')}} --</option>' +
            '                </select>' +
            '                <select class="select"' +
            '                        name="region"' +
            '                        id="region"' +
            '                        required' +
            '                        ng-blur="validateStatus.regionTipShow=false"' +
            '                        ng-focus="validateStatus.regionTipShow=true"' +
            '                        ng-model="addressBoxData.newAddress.regionId"' +
            '                        ng-change="validate(\'region\',addressBoxData.newAddress.regionCode)"' +
            '                        ng-options="region.code+\'_\'+region.code as region.name for region in multiAddress.regions">' +
            '                    <option value="">-- {{i18n(\'区县\')}} --</option>' +
            '                </select>' +
            '                <div class="clear"></div>' +
            '                <!--<span ng-style="hasError"-->' +
            '                      <!--ng-show="validateStatus.v_province||validateStatus.v_city||validateStatus.v_region">*&nbsp;{{validateMessage.v_address}}</span>-->' +
            '            </dd>' +
            '            <p class="addr-infor">' +
            '                <div class="tip addr pddleft"' +
            '                     ng-style="{display:validateStatus.provinceTipShow?\'block\':\'none\'}">{{i18n(\'请选择省份\')}}</div>' +
            '                <div class="tip addr pddleft"' +
            '                     ng-style="{display:validateStatus.cityTipShow?\'block\':\'none\'}">{{i18n(\'请选择城市\')}}</div>' +
            '                <div class="tip addr pddleft"' +
            '                     ng-style="{display:validateStatus.regionTipShow?\'block\':\'none\'}">{{i18n(\'请选择区县\')}}</div>' +
            '                <div class="tip addr err pddleft"' +
            '                     ng-style="{display:!validateStatus.provinceTipShow&&!validateStatus.cityTipShow&&!validateStatus.regionTipShow' +
            '                         &&(addressEdit.province.$dirty||addressEdit.city.$dirty||addressEdit.region.$dirty||address.invalidSubmit)' +
            '                         && (addressEdit.province.$invalid||addressEdit.city.$invalid||addressEdit.region.$invalid)?\'block\':\'none\'}">' +
            '                        <span ng-show="addressEdit.province.$error.required">{{i18n(\'省份\')}}</span' +
            '                                ><span ng-show="addressEdit.city.$error.required">{{i18n(\'城市\')}}</span' +
            '                        ><span ng-show="addressEdit.region.$error.required">{{i18n(\'区县\')}}</span' +
            '                        ><span ng-show="addressEdit.province.$error.required||addressEdit.city.$error.required||addressEdit.region.$error.required">{{i18n(\'不能为空")</span>' +
            '                </div>' +
            '            </p>' +
            '        </dl>' +
            '        <dl class="clearfix">' +
            '            <dt>' +
            '                <span class="colorRed">*</span>' +
            '                <span>{{i18n(\'详细地址\')}}</span>' +
            '            </dt>' +
            '            <dd><input type="text"' +
            '                       class="input no-height"' +
            '                       id="detailAddress"' +
            '                       name="detailAddress"' +
            '                       ng-model="addressBoxData.newAddress.detailAddress"' +
            '                       ng-model-options="{updateOn:\'blur\'}"' +
            '                       placeholder="{{i18n(\'街道名称编号\')}} {{i18n(\'楼宇名称\')}} {{i18n(\'单位\')}} {{i18n(\'房间\')}}"' +
            '                       ng-pattern="addressNumRex" required' +
            '                       maxlength="100"' +
            '                       ng-blur="validateStatus.detailAddressTipShow=false"' +
            '                       ng-focus="validateStatus.detailAddressTipShow=true"/>' +
            '                <div class="clear"></div>' +
            '            </dd>' +
            '            <p class="addr-infor">' +
            '                <div class="tip addr pddleft"' +
            '                     ng-style="{display:validateStatus.detailAddressTipShow?\'block\':\'none\'}">{{i18n(\'仅支持\')}}100{{i18n(\'个字符以内的中文\')}}、{{i18n(\'英文或数字\')}}</div>' +
            '                <div class="tip addr err pddleft"' +
            '                     ng-style="{display:!validateStatus.detailAddressTipShow && (addressEdit.detailAddress.$dirty||addressBoxData.invalidSubmit) && addressEdit.detailAddress.$invalid?\'block\':\'none\'}">' +
            '                    <span ng-show="addressEdit.detailAddress.$error.required">{{i18n(\'详细地址不能为空\')}}</span>' +
            '                    <span ng-show="addressEdit.detailAddress.$error.pattern">{{i18n(\'详细地址不合法\')}}</span>' +
            '                </div>' +
            '            </p>' +
            '        </dl>' +
            '        <dl class="clearfix">' +
            '            <dt>' +
            '                <span class="colorRed">*</span>' +
            '                <span>{{i18n(\'手机号码\')}}</span>' +
            '            </dt>' +
            '            <dd><input type="text" class="input seem-height"' +
            '                       id="mobile"' +
            '                       name="mobile"' +
            '                       ng-model="addressBoxData.newAddress.mobile"' +
            '                       ng-model-options="{updateOn:\'blur\'}"' +
            '                       placeholder="{{i18n(\'常用手机号码\')}}' +
            '                       ng-pattern="mobileRex" required' +
            '                       ng-blur="validateStatus.mobileTipShow=false"' +
            '                       ng-focus="validateStatus.mobileTipShow=true"/>' +
            '                <span ng-if="false">{{i18n(\'或固定电话\')}} <input type="text" class="input" ng-disabled="true"' +
            '                             ng-model-options="{updateOn:\'blur\'}"' +
            '                             ng-model="addressBoxData.newAddress.zip" placeholder="{{i18n(\'区号\')}}"/> -' +
            '                <input type="text" class="input" ng-disabled="true"' +
            '                       ng-model-options="{updateOn:\'blur\'}"' +
            '                       ng-model="addressBoxData.newAddress.phone" placeholder="{{i18n(\'电话号码\')}}"/> -' +
            '                <input type="text" class="input" ng-disabled="true"' +
            '                       ng-model-options="{updateOn:\'blur\'}"' +
            '                       ng-model="addressBoxData.newAddress.ext" placeholder="{{i18n(\'分机号\')}}"/></span>' +
            '                <span ng-style="hasError" ng-show="validateStatus.v_mobile">*&nbsp;{{validateMessage.v_mobile}}</span>' +
            '                <div class="clear"></div>' +
            '                <!--<span>用来接收订单提醒邮件，便于您及时了解订单状态</span>-->' +
            '            </dd>' +
            '            <p class="addr-infor">' +
            '                <div class="addr pddleft"' +
            '                     ng-style="{display:validateStatus.mobileTipShow?\'block\':\'none\'}">{{i18n(\'请输入\')}}11{{i18n(\'位的手机号码\')}}</div>' +
            '                <div class="addr err pddleft"' +
            '                     ng-style="{display:!validateStatus.mobileTipShow && (addressEdit.mobile.$dirty||addressBoxData.invalidSubmit) && addressEdit.mobile.$invalid?\'block\':\'none\'}">' +
            '                    <span ng-show="addressEdit.mobile.$error.required">{{i18n(\'手机不能为空\')}}</span>' +
            '                    <span ng-show="addressEdit.mobile.$error.pattern">{{i18n(\'手机号码不合法\')}}</span>' +
            '                </div>' +
            '            </p>' +
            '        </dl>' +
            '        <dl class="choose-default-address clearfix">' +
            '            <label class="checkboxStyle">' +
            '                <input type="checkbox" ng-model="addressBoxData.newAddress.defaultIs">' +
            '                <span></span>{{i18n(\'设置为默认地址\')}}' +
            '            </label>' +
            '        </dl>' +
            '        <div class="add-bottom">' +
            '            <input type="button" class="btn"' +
            '                    ng-click="_addNewAddress(addressEdit.$invalid)"' +
            '                    ng-if="!addressBoxData.newAddress.id" value="{{i18n(\'保存并使用\')}}"/>' +
            '            <input type="button" class="btn"' +
            '                    ng-click="_updateAddress(addressEdit.$invalid,addressBoxData.newAddress.id)"' +
            '                    ng-if="addressBoxData.newAddress.id" value="{{i18n(\'保存并使用\')}}"/>' +
            '            <input type="button" class="btn cancel-btn" value="{{i18n(\'取消\')}}" ng-click="close()">' +
            '        </div>' +
            '    </div>' +
            '</form>',
        transclude: true,
        scope: {
            addressBoxData: "="
        },
        link: function (scope, elem, attrs) {
            scope.i18n = function (key) {
                return $window.i18n ? $window.i18n(key) : key;
            };
            scope.nameRex = /^[\u4E00-\u9FA5\w\d-]{1,20}$/;
            scope.addressNumRex = /.{2,100}/;
            scope.mobileRex = /^[0-9]{11}$/;
            var _ut = $rootScope.util.getUserToken(),
                _fnG = $rootScope.ajax.get,
                _fnP = $rootScope.ajax.post,
                _host = $rootScope.host,
                _hostU=$rootScope.host_ouser,
                _pid=$rootScope.localProvince.province.provinceId;
            scope.multiAddress = {};
            /**
             * 获取省份/城市/区县:_getLayerAddress
             * @param code
             * @param layer
             * @param editFlag
             * @private
             */
            function _getLayerAddress(code,layer,editFlag,cb) {
                if (typeof code !== 'undefined' && code != null) {
                    code = !isNaN(code) ? code : code.split('_')[1];
                    var url = _host + '/location/list/' + code;
                    $rootScope.ajax.getNoKey(url).then(function (res) {
                        if (res.data !== null) {
                            if (layer === 1) {
                                scope.multiAddress.provinces = res.data;
                                if (editFlag) {
                                    angular.forEach(scope.multiAddress.provinces, function (pro) {
                                        if (scope.addressBoxData.newAddress.provinceCode == pro.id) {
                                            scope.addressBoxData.newAddress.provinceCode += ('_' + pro.code);
                                        }
                                    })
                                    _getLayerAddress(scope.addressBoxData.newAddress.provinceCode, 2, editFlag,cb);
                                }
                            }
                            else if (layer === 2) {
                                scope.multiAddress.cities = res.data;
                                scope.multiAddress.regions = {};
                                if (editFlag) {
                                    angular.forEach(scope.multiAddress.cities, function (city) {
                                        if (scope.addressBoxData.newAddress.cityCode === city.code) {
                                            scope.addressBoxData.newAddress.cityCode += '_' + city.code;
                                        }
                                    })
                                    _getLayerAddress(scope.addressBoxData.newAddress.cityCode, 3, editFlag,cb);
                                } else {
                                    scope.addressBoxData.newAddress.cityCode = '';
                                    scope.addressBoxData.newAddress.regionCode = '';
                                }
                            }
                            else if (layer === 3) {
                                scope.multiAddress.regions = res.data;
                                if (editFlag) {
                                    angular.forEach(scope.multiAddress.regions, function (region) {
                                        if (scope.addressBoxData.newAddress.regionCode === region.code) {
                                            scope.addressBoxData.newAddress.regionCode += '_' + region.code;
                                        }
                                    })
                                } else {
                                    scope.addressBoxData.newAddress.regionCode = '';
                                }
                                if(typeof cb == 'function'){
                                    cb();
                                }
                            }
                        }
                    })
                }
            }
            scope._getLayerAddress=_getLayerAddress;

            //关闭窗口
            scope.close = function () {
                scope.addressBoxData.toAddNewAddress = false;
                scope.toAddNewAddress = false;
            }

            /**
             * 新增地址
             * @private
             */
            scope._addNewAddress = function (boo) {
                var address = angular.copy(scope.addressBoxData.newAddress);
                if (boo) {
                    this.invalidSubmit = true;
                } else {
                    this.invalidSubmit = false;
                    var url = "/ouser-center/address/addAddressForm.do",
                        data = {
                            userName: address.userName,
                            provinceCode: address.provinceCode.toString().split('_')[0],
                            cityCode: address.cityCode.toString().split('_')[0],
                            regionCode: address.regionCode.toString().split('_')[0],
                            detailAddress: address.detailAddress,
                            mobile: address.mobile,
                            // defaultIs: address.defaultIs ? 1 : 0
                        };
                    _fnP(url, data).then(function (res) {
                        scope.close();
                        if (res.data) {
                            if (scope.addressBoxData.callbackFun && typeof scope.addressBoxData.callbackFun == 'function') {
                                scope.addressBoxData.callbackFun(null, res.data, null);
                            }
                        }
                    })
                }
            }

            /**
             * 更新地址:_updateAddress
             * @private
             */
            scope._updateAddress = function (boo,id) {
                var address = angular.copy(scope.addressBoxData.newAddress);
                if (boo) {
                    this.invalidSubmit = true;
                } else {
                    // address.defaultIs = address.defaultIs ? 1 : 0;
                    address.provinceCode = address.provinceCode.toString().split('_')[0];
                    address.cityCode = address.cityCode.toString().split('_')[0];
                    address.regionCode = address.regionCode.toString().split('_')[0];
                    var url = "/ouser-center/address/updateAddressForm.do",
                        data = address;
                    data.ut = _ut;
                    _fnP(url, data).then(function (res) {
                        scope.close();
                        var thisID;
                        if (id && scope.addressBoxData.newAddress.provinceCode.indexOf(_pid) == 0) thisID = id;

                        if (scope.addressBoxData.callbackFun && typeof scope.addressBoxData.callbackFun == 'function') {
                            scope.addressBoxData.callbackFun(thisID, id, scope.addressBoxData.newAddress);
                        }
                    })
                }
            },
            scope.$watch('addressBoxData.toAddNewAddress', function (value) {
                if (value) {
                    if (scope.addressBoxData.newAddress.id) {
                        _getLayerAddress(100000, 1, true);
                    } else {
                        _getLayerAddress(100000, 1)
                    }
                    scope.toAddNewAddress = true;
                }
            });
        }
    }
}])
// 史泰博专业导购添加到购物车
//添加到购物车
.directive('stbMiniAddCart', ['$rootScope','$window', function ($rootScope,$window) {
    return {
        template: [
            '<div class="choose-btns mgT5">',
            '    <div class="count">',
            '        <input class="num" data-min="1" data-max="9999" ng-model="pcIteminfo.itemAmount" ng-change="pcIteminfo._updatedProducts(0)">',
            '        <div class="count-btn">',
            '           <span class="posR" ng-click="pcIteminfo._updatedProducts(1)">',
            '            <i class="icons my-add"></i>',
            '            <input type="button" class="add" value="" ng-class="{disabled:pcIteminfo.itemAmount>=prod.stockNum}"  ng-disabled="pcIteminfo.itemAmount>=prod.stockNum" ng-click="pcIteminfo._updatedProducts(1)">',
            '           </span>',
            '           <span class="posR" ng-click="pcIteminfo._updatedProducts(-1)">',
            '            <i class="icons my-sub"></i>',
            '            <input type="button" class="sub disabled" value="" ng-class="{disabled:pcIteminfo.itemAmount<=1}" ng-disabled="pcIteminfo.itemAmount<=1" ng-click="pcIteminfo._updatedProducts(-1)">',
            '           </span>',
            '        </div>',
            '    </div>',
            '    <a class="addCarts fr pdL25" href="javascript:void(0)" ng-if="prod.stockNum>0 && !prod.isSeries" num="pcIteminfo.itemAmount" ng-click="pcIteminfo._addToCart(prod)">',
            '       <i class="my-cart" style="width: 16px;height: 14px;left: 4px;top: 5px;"></i>{{i18n("加入")}}{{i18n(cartName)}}',
            '    </a>',
            '    <a class="addCarts" href="javascript:void(0)" ',
            '           ng-class="{disabled: prod.stockNum<=0 || prod.isSeries}" ',
            '           ng-disabled="prod.stockNum<=0 || prod.isSeries" ',
            '           ng-if="prod.stockNum<=0 || prod.isSeries">',
            '         <i class="cart-icon mgR10"></i>{{i18n("暂无库存")}}',
            '    </a>',
            '</div>',
        ].join(''),
        scope: {
            prod: '=',
            cartName: '@'
        },
        transclude: true,
        link: function (scope, element, attrs, ctrl) {
            scope.i18n = function (key) {
                return $window.i18n ? $window.i18n(key) : key;
            };
            var prod = scope.prod;
            scope.addCart = $rootScope.addCart;
            scope.tmid = 0;
            scope.pcIteminfo = {
                itemAmount: 1,
                tipPop: true,
                _updatedProducts: function (n) {
                    this.itemAmount = parseInt(this.itemAmount) + n;
                    if (!this.itemAmount) {
                        this.itemAmount = 1;
                    } else {
                        if (this.itemAmount > prod.stockNum) {
                            this.itemAmount = prod.stockNum;
                        // } else if (prod.individualLimitNum > 0 && this.itemAmount > prod.individualLimitNum) {//有限购, 并且超出了限购
                        //     var that = this;
                        //     if (that.tipPop) {
                        //         $rootScope.error.checkCode('提示', '商品限购' + prod.individualLimitNum + '件, 超出部分将以原价购买', {
                        //             type: 'confirm',
                        //             btnOKText: '继续购买',
                        //             ok: function () {
                        //                 that.tipPop = false;
                        //             },
                        //             cancel: function () {
                        //                 that.itemAmount = prod.individualLimitNum;
                        //             }
                        //         });
                        //     }
                        }
                    }
                    //html没有展示此接口返回的值，注释此接口 产品化1.2
                    //$rootScope.localProvince._computeDeliveryFee(prod.mpId, scope.pcIteminfo.itemAmount);
                },
                _addToCart: function(prod) {
                    var url = '/back-product-web2/extra/merchantProduct/getMerchantProductBaseInfoById.do'
                    var params = {
                        mpId: prod.id
                    }
                    $rootScope.ajax.postJson(url,params).then(function(res){
                        if (res.code ==0 && res.data && res.data.typeOfProduct ==3) {
                            location.href = '/item.html?itemId=' + prod.id
                        } else {
                            var opts = {
                                isSeries: false, //是否虚品
                                checked: true,
                                isPresell: 0
                            }
                            opts.isSeries = prod.typeOfProduct;
                            opts.isPresell = prod.isPresell;
                            //如果有商品属性，提示选择属性，如果是虚拟商品, 不处理
                            if (opts.isSeries==3) {
                                return;
                            }
                            //添加成功的提示
                            scope.addCart(prod, scope.pcIteminfo.itemAmount, opts.checked);
                        }
                    })
                }
            }
            //全局添加到购物车
            scope.addCart=function(item,amount,flag,callback){
                if(typeof flag != 'undefined' && !flag) {
                    $rootScope.willchoose = true;
                    return false;
                }else if(typeof flag != 'undefined' && flag) {
                    $rootScope.willchoose = false;
                }
                var serviceGod = JSON.stringify([{"mpId":$rootScope.serviceGoodId,'num':1}])
                if($rootScope.serviceGoodId===null||$rootScope.serviceGoodId===undefined) {
                    serviceGod = null;
                }
                $rootScope.addCartRes={};
                var data = {
                    companyId:$rootScope.companyId,
                    provinceId: $rootScope.localProvince.province.provinceId,
                    sessionId: $rootScope.sessionId,
                    mpId: item.id,
                    num: parseInt(amount),
                    additionalItems:serviceGod,
                    areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode: $rootScope.defaultAreasCode
                }
                if ($rootScope.switchConfig.common.showChoosePackingMethod) {
                    data.productPackageId = item.productPackageId;
                }
                $rootScope.ajax.postFrom($rootScope.host + "/cart/addItem",data).then(function (res) {
                    if(res.code==0) {
                        if(callback)
                            callback(true);
                        $rootScope.addCartRes = res;
                        if ($rootScope.switchConfig.guide.search.showPromotionTip) {
                            $rootScope.getCartExt($rootScope.util.paramsFormat(location.href).promotionId);
                        }
                        $rootScope.$emit('updateMiniCartToParent');//把成功事件传递到父控制器
                    }else{
                        $rootScope.error.checkCode(res.code,res.message);
                    }
                }, function(res){
                    //$log.debug(res);
                    $rootScope.error.checkCode($rootScope.i18n('系统异常'),$rootScope.i18n('加入') + $rootScope.i18n($rootScope.switchConfig.common.allCartBtnName) + $rootScope.i18n('异常') + '！');
                });
            };
            scope.checkIsSerial = function(prod) {

            }
        }
    }
}])
.directive('stbCount', ['$rootScope','$window', function ($rootScope,$window) {
    return {
        template: [
            '    <div class="count">',
            '        <input class="num" data-min="1" data-max="9999" ng-model="prod.itemAmount" ng-change="pcIteminfo._updatedProducts(0)">',
            '        <div class="count-btn">',
            '           <span class="posR" ng-click="pcIteminfo._updatedProducts(1)">',
            '            <i class="icons my-add"></i>',
            '            <input type="button" class="add" value="" ng-class="{disabled:prod.itemAmount>=prod.virtualAvailableStockNum}"  ng-disabled="prod.itemAmount>=prod.virtualAvailableStockNum" ng-click="pcIteminfo._updatedProducts(1)">',
            '           </span>',
            '           <span class="posR" ng-click="pcIteminfo._updatedProducts(-1)">',
            '            <i class="icons my-sub"></i>',
            '            <input type="button" class="sub disabled" value="" ng-class="{disabled:prod.itemAmount<=1}" ng-disabled="prod.itemAmount<=1" ng-click="pcIteminfo._updatedProducts(-1)">',
            '           </span>',
            '        </div>',
            '    </div>',
        ].join(''),
        scope: {
            prod: '=',
            cartName: '@'
        },
        link: function (scope, element, attrs, ctrl) {
            scope.i18n = function (key) {
                return $window.i18n ? $window.i18n(key) : key;
            };
            var prod = scope.prod;
            prod.itemAmount = 1;
            scope.pcIteminfo = {
                _updatedProducts: function (n) {
                    prod.itemAmount = parseInt(prod.itemAmount) + n;
                    if (!prod.itemAmount) {
                        prod.itemAmount = 1;
                    } else {
                        if (prod.itemAmount > prod.virtualAvailableStockNum) {
                            prod.itemAmount = prod.virtualAvailableStockNum;

                        }
                    }
                },

            }

        }
    }
}])
// 史泰博ADV协议商品和热销商品加车
.directive('advMiniAddCart', ['$rootScope','$window', function ($rootScope,$window) {
    return {
        template: [
            '<div class="choose-btns mgT5">',
            '    <div class="count">',
            '        <input class="num" data-min="1" data-max="9999" ng-model="pcIteminfo.itemAmount" ng-change="pcIteminfo._updatedProducts(0)">',
            '        <div class="count-btn">',
            '           <span class="posR" ng-click="pcIteminfo._updatedProducts(1)">',
            '            <i class="icons my-add"></i>',
            '            <input type="button" class="add" value=" " ng-class="{disabled:pcIteminfo.itemAmount>=prod.stockNum}"  ng-disabled="pcIteminfo.itemAmount>=prod.stockNum">',
            '           </span>',
            '           <span class="posR" ng-click="pcIteminfo._updatedProducts(-1)">',
            '            <i class="icons my-sub"></i>',
            '            <input type="button" class="sub disabled" value=" " ng-class="{disabled:pcIteminfo.itemAmount<=1}" ng-disabled="pcIteminfo.itemAmount<=1" ng-click="pcIteminfo._updatedProducts(-1)">',
            '           </span>',
            '        </div>',
            '    </div>',
            '    <a class="addCarts fr pdL20" href="javascript:void(0)" ng-if="prod.stockNum>0 && !prod.isSeries" num="pcIteminfo.itemAmount" ng-click="pcIteminfo._addToCart(prod,$event)">',
            '       <i class="my-cart" style="width: 16px;height: 14px;left: 4px;top: 5px;"></i>{{i18n("加入")}}{{i18n(cartName)}}',
            '    </a>',
            '    <a class="addCarts" href="javascript:void(0)" ',
            '           ng-class="{disabled: prod.stockNum<=0 || prod.isSeries}" ',
            '           ng-disabled="prod.stockNum<=0 || prod.isSeries" ',
            '           ng-if="prod.stockNum<=0 || prod.isSeries">',
            '         <i class="cart-icon mgR10"></i>{{i18n("暂无库存")}}',
            '    </a>',
            '</div>',
        ].join(''),
        scope: {
            prod: '=',
            cartName: '@'
        },
        transclude: true,
        link: function (scope, element, attrs, ctrl) {
            scope.i18n = function (key) {
                return $window.i18n ? $window.i18n(key) : key;
            };
            var prod = scope.prod;
            scope.addCart = $rootScope.addCart;
            scope.tmid = 0;
            scope.pcIteminfo = {
                itemAmount: 1,
                tipPop: true,
                _updatedProducts: function (n) {
                    this.itemAmount = parseInt(this.itemAmount) + n;
                    if (!this.itemAmount) {
                        this.itemAmount = 1;
                    } else {
                        if (this.itemAmount > prod.virtualAvailableStockNum) {
                            this.itemAmount = prod.virtualAvailableStockNum;
                        // } else if (prod.individualLimitNum > 0 && this.itemAmount > prod.individualLimitNum) {//有限购, 并且超出了限购
                        //     var that = this;
                        //     if (that.tipPop) {
                        //         $rootScope.error.checkCode('提示', '商品限购' + prod.individualLimitNum + '件, 超出部分将以原价购买', {
                        //             type: 'confirm',
                        //             btnOKText: '继续购买',
                        //             ok: function () {
                        //                 that.tipPop = false;
                        //             },
                        //             cancel: function () {
                        //                 that.itemAmount = prod.individualLimitNum;
                        //             }
                        //         });
                        //     }
                        }
                    }
                    //html没有展示此接口返回的值，注释此接口 产品化1.2
                    //$rootScope.localProvince._computeDeliveryFee(prod.mpId, scope.pcIteminfo.itemAmount);
                },
                _addToCart: function(prod,$event) {
                    $event.stopPropagation()
                    var url = '/back-product-web2/extra/merchantProduct/getMerchantProductBaseInfoById.do',
                        params = {
                            mpId:prod.mpId,
                        },
                        that = this;
                    $rootScope.ajax.postJson(url,params).then(function (response) {
                         //商品不存在时
                        if(response.code=='100'){
                            $scope.isShowNoProduct=true;
                            $scope.noProduct=response.message;
                        }
                        if(response.code=='10700101'){
                            location.href="/index.html";
                            return;
                        }
                        if(response.data.typeOfProduct == 3){
                            window.location.href = '/item.html?itemId='+prod.mpId;
                            return;
                        }else{
                            that._addToCart2(prod);
                        }
                    });
                },
                _addToCart2: function(prod) {
                    var opts = {
                        isSeries: false, //是否虚品
                        checked: true,
                        isPresell: 0
                    }
                    opts.isSeries = prod.typeOfProduct;
                    opts.isPresell = prod.isPresell;
                    //如果有商品属性，提示选择属性，如果是虚拟商品, 不处理
                    if (opts.isSeries==3) {
                        return;
                    }
                    //添加成功的提示
                    $rootScope.addCart(prod, scope.pcIteminfo.itemAmount, opts.checked,function(data){
                        $rootScope.error.checkCode($rootScope.i18n('提示'),$rootScope.i18n('加入购物车成功'));
                    });
                }
            }
        }
    }
}])
