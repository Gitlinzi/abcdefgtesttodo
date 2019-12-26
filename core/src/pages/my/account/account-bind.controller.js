/**
 * Created by Roy on 17/6/29.
 */
'use strict';
angular.module('appControllers').controller('bindCtrl',['$scope','$rootScope','$cookieStore',function($scope,$rootScope,$cookieStore){
    var _ut = $rootScope.util.getUserToken();
    if (!_ut) {
        $rootScope.showLoginBox = true;
        return;
    };

    $scope.bindQQ =false;
    $scope.bindWX =false;
    $scope.bindWB =false;
    $scope.bindZFB =false;
    $scope.bindShow = function (platform) {
        if (platform == 1){
            if ($scope.binds.qqIsBind){
                $scope.bindQQ =true;
            }
        }else if (platform == 2){
            if ($scope.binds.wxIsBind){
                $scope.bindWX =true;
            }
        }else if (platform == 3){
            if ($scope.binds.wbIsBind){
                $scope.bindWB =true;
            }
        }else if (platform == 4){
            if ($scope.binds.zfbIsBind){
                $scope.bindZFB =true;
            }
        }
    };
    $scope.closeBind = function ($event,platform) {
        $event.stopPropagation();
        if (platform == 1){
            $scope.bindQQ =false;
        }else if (platform == 2){
            $scope.bindWX =false;
        }else if (platform == 3){
            $scope.bindWB =false;
        }else if (platform == 4){
            $scope.bindZFB =false;
        }
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
        $rootScope.ajax.post($rootScope.home+ "/ouser-web/api/union/getLoginParamsURL.do", {
            unionType : gateway,
            redirectURL: redirectUrl
        }).then(function (result) {
            if (result.code == 0) {
                $cookieStore.put('backUrl',location.href);
                window.location.href = result.data;
            } else {
                $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('暂时无法处理您的请求') + '!');
            }
        }, function (result) {
            $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('暂时无法处理您的请求') + '!');
        })
    };
    var _ut = $rootScope.util.getUserToken(),
        _fnP = $rootScope.ajax.post,
        _fnE=$rootScope.error.checkCode;
    $scope.binds ={
        bindInfo:{},
        qqIsBind:false,
        qqName:{},
        wxIsBind:false,
        wxName:{},
        wbIsBind:false,
        wbName:{},
        zfbIsBind:false,
        zfbName:{},
        getBindInfo:function () {
            "use strict";
            var url = $rootScope.host_ouser + '/api/union/getUserUnionInfoList.do',
                params = {
                },
                that = this;

                $rootScope.ajax.post(url, params).then(function (result) {
                    if (result.code == 0){
                        that.bindInfo = result.data;
                        $.each(that.bindInfo,function (key,value) {
                            if (key == 1){
                                that.qqIsBind = true;
                                that.qqName = value.oauthUsername;
                            }else if (key == 2){
                                that.wxIsBind = true;
                                that.wxName = value.oauthUsername;
                            }else if (key == 3){
                                that.wbIsBind = true;
                                that.wbName = value.oauthUsername;
                            }else if (key == 4){
                                that.zfbIsBind = true;
                                that.zfbName = value.oauthUsername;
                            }
                        });
                    }else {
                        _fnE($scope.i18n('系统异常'),result.message);
                    }
                }, function (res) {
                })

        },
        confirmRemoveUnion:function ($event,unionType) {

            "use strict";
            $event.stopPropagation();
            var unionName = '',
            that = this;
            if (unionType == 1){
                unionName = 'QQ';
            }else if (unionType == 2){
                unionName = $scope.i18n('微信');
            } else if (unionType == 3){
                unionName = $scope.i18n('微博');
            }else if (unionType == 4){
                unionName = $scope.i18n('支付宝');
            }
            $rootScope.error.checkCode($scope.i18n('您确定要解除绑定') + '？',$scope.i18n('您确定要解除绑定')+ unionName+$scope.i18n('账号') + '？',{
                type:'confirm',
                btnOKText:$scope.i18n('确定'),
                ok:function(){
                   that.removeUnion(unionType)
                }

            });
        },
        removeUnion:function (unionType) {
            "use strict";
            var url = $rootScope.host_ouser + '/api/union/revokeUnion.do',
                params = {
                    unionType: unionType
                };
            var that=this;
            $rootScope.ajax.post(url, params).then(function (result) {
                if (result.code == 0){
                    _fnE($scope.i18n('提示'),$scope.i18n('解绑成功'),{
                         type:'info',
                        btnOKText:$scope.i18n('确定'),
                        ok:function(){
                         window.location.reload();
                        }

                    });


                }else {
                    _fnE($scope.i18n('系统异常'),result.message);
                }
            }, function (res) {
                _fnE($scope.i18n('系统异常'),result.message);
            })

        },
        init:function () {
            "use strict";
            this.getBindInfo();
        }
    };

}]);
