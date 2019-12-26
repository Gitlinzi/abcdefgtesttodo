/**
 * 联合登录第三方返回页面
 */
appControllers.controller("unionLoginCtrl", ["$rootScope", "$scope", "$cookieStore", "commonService", "$window",function($rootScope, $scope, $cookieStore, commonService, $window) {
    "use strict";
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
    //登录
    var  _fnE=$rootScope.error.checkCode;
    $scope.isLogion = true;
    $scope.unionLogin = function(unionType) {
        var params = $rootScope.util.paramsFormat(location.href);
       $rootScope.util.setUserToken(params.ut);
       localStorage.setItem('sId',params.sId);
       if(params.code==0){
            if(params.needBind == 'false' || params.needBind == null){
                //  location.href='/index.html';
                  var backUrl = $cookieStore.get('backUrl');
                if (backUrl) {
                    location.href = backUrl;
                } else {
                    location.href = 'index.html';
                }
            }else{
                 location.href='/binding.html?username='+params.oauthUsername;
            }
       }else if(params.code==6){
            $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n('您的账号已经被绑定'),{
                type:'info',
                btnOKText:$scope.i18n('确定'),
                ok:function(){
                   var backUrl = $cookieStore.get('backUrl');
                   location.href = backUrl;
                }
            });
       }
    };

    $scope.unionLogin();


}]);
