/**
 * Created by Roy on 15/10/23.
 */
"use strict";

angular.module('my',['ui.router', 'appControllers'])
    .config(["$stateProvider","$urlRouterProvider", "routers",
    function($stateProvider,$urlRouterProvider, routers) {
        $urlRouterProvider.otherwise("/");
        angular.forEach(routers, function (router) {
            $stateProvider
                .state(router.state, {
                    url: router.url,
                    templateUrl: router.templateUrl,
                    controller: router.controller,
                    controllerAs: router.controllerAs,
                    params: router.params ? router.params : {},
                    menu: router.menu,
                    isShowMenu: router.isShowMenu
                })
        });
    }])
    .run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
        !function (scope) {

            function getSideList(d) {

                let sideList = angular.copy(d)
                const url = "/custom-sbd-web/user/getUserDetail.do";
                $rootScope.ajax.postJson(url).then(res=>{
                    if(res.code == 0) {
                        // 控制报表显示
                        let showStatement = res.data.showReportIs
                        // 管理官控制成本中心显示
                        let showStatement2 = res.data.isAdmin 
                        let reportMenu = sideList.find(item => item.title=="报表中心")
                        let zhreportMenu = sideList.find(item => item.title=="账户设置")
                        if(reportMenu) {
                            reportMenu.items.forEach(item => {
                                item.show = item.show && showStatement
                            })
                        }

                        scope.dataList = sideList

                        if (zhreportMenu) {
                            zhreportMenu.items.forEach(item => {
                                if (item.name == '成本中心' || item.name == '公告栏') {
                                    item.show = showStatement2
                                }
                            })
                        }
                        $rootScope.showStatement = showStatement
                        
                    }
                })

            }

            scope.$on("$stateChangeStart", function (e, toState, toParams) {
                switch (toState.menu){
                    case 'indexHome':
                        scope.isHide = false;
                        if (!toState.isShowMenu) {
                            scope.isHide = true;
                        }
                        getSideList($rootScope.switchConfig.menuList.indexHome);
                        break;
                    case 'accountInfo':
                        scope.isHide = false;
                        if (!toState.isShowMenu) {
                            scope.isHide = true;
                        }
                        getSideList($rootScope.switchConfig.menuList.indexHome);
                        break;
                    case 'messageInfo':
                        scope.isHide = false;
                        if (!toState.isShowMenu) {
                            scope.isHide = true;
                        }
                        getSideList($rootScope.switchConfig.menuList.messageInfo);
                        break;
                    default:
                        scope.isHide = false;
                        if (!toState.isShowMenu) {
                            scope.isHide = true;
                        }
                        getSideList($rootScope.switchConfig.menuList.indexHome);
                }
            });
        }($rootScope);
    }]);
angular.module('appControllers').controller("myCtrl",["$log","$rootScope","$scope","$cookieStore","commonService", 'categoryService',"validateService","Upload","$window", function($log,$rootScope,$scope,$cookieStore,commonService, categoryService,validateService,Upload, $window){
    var validateRegExp = validateService;
    $scope.usernameRegExp = new RegExp(validateRegExp.username);
    $scope.passwordRegExp = new RegExp(validateRegExp.password);
    $scope.mobileRegExp = new RegExp(validateRegExp.mobile);
    $scope.emailRegExp = new RegExp(validateRegExp.email);
    $scope.telRegExp = new RegExp(validateRegExp.tel);
    $scope.letterAndNumRegExp = new RegExp(validateRegExp.letterAndNum);
    $scope.bankAcountRegExp = new RegExp(validateRegExp.bankAcount);
    //默认省份与迷你购物车
    $rootScope.execute(true);
    $scope.user = {};
    $scope.modifys={};//修改密码对象
    $scope.clickFlag = false;
    //国际化
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };

    //监听子控制器的事件, 购物车， 添加到购物车， 刷新购物车数据
    $rootScope.$on('updateMiniCartToParent',function () {
        //监听到事件后再广播出去
        $scope.$broadcast('updateMiniCart');
    })

    //上传图片
    //没有使用， 先保留， 确认不会使用再删
    $scope.usingFlash = FileAPI && FileAPI.upload != null;
    $scope.taxIsUploading = false;
    $scope.taxpayerIsUploading = false;
    $scope.invoiceUploading = false;
    $scope.uploadBusinessProgressStatus = false;
    $scope.deleteUpload = function(file,$event){
        if($event && angular.element($event.currentTarget).prev().attr('name')){
            var name = angular.element($event.currentTarget).prev().attr('name');
            file = null;
            angular.element('#'+name+'Path').val('');
            $scope[name+'FileErrMsg'] = '';
            $scope[name+'Url'] = '';
            $scope[name+'IsUploading'] = false;
            $scope[name+'ProgressStatus'] = false;
        }
    }
    $scope.uploadPic = function (file,$event) {
        if($event && angular.element($event.currentTarget).next().attr('name')){
            var name = angular.element($event.currentTarget).next().attr('name');
            $scope[name+'IsUploading'] = true;
            $scope[name+'UpdStatus'] = true;
            fileUpload(file,name);
        }
        function fileUpload(file,name){
            if (file != null) {//file验证
                if(!(/(jpg|jpeg|png|bmp|pdf)/i.test(file.type))){
                    $scope[name+'FileErrMsg'] = $scope.i18n('上传文件必须是') +  'jpg|jpeg|png|bmp|pdf' + $scope.i18n('格式');
                    $scope[name+'IsUploading'] = false;
                    $scope[name+'ProgressStatus'] = false;
                    return;
                }
                if(parseInt(file.size)>10485760){
                    $scope[name+'FileErrMsg'] = $scope.i18n('上传文件必须') + '10M' + $scope.i18n('以内');
                    $scope[name+'IsUploading'] = false;
                    $scope[name+'ProgressStatus'] = false;
                    return;
                }
                $scope[name+'Type'] = file.type.indexOf('pdf')>-1 ? "pdf" : "image";
                Upload.upload({
                    url:uploadFileURL,
                    method:'POST',
                    data:{file:file},
                }).then(function(resp){
                    if(resp.data.code == "0"){
                        $scope[name+'Url'] = resp.data.data.filePath;
                        $scope[name+'FileErrMsg'] = resp.data.message;
                        $scope[name+'IsUploading'] = false;
                        $scope[name+'ProgressStatus'] = true;
                        $scope[name+'UpdStatus'] = false;
                    }else{
                        $scope[name+'ProgressStatus'] = true;
                        $scope[name+'IsUploading'] = false;
                        $scope[name+'Url'] = '';
                        $scope[name+'FileErrMsg'] = resp.data.message;
                    }

                }, function (resp) {
                    $scope[name+'ProgressStatus'] = false;
                    $scope[name+'Url'] = '';
                    $scope[name+'FileErrMsg'] = resp.data.message;
                }, function (evt) {
                    //var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    $scope[name+'ProgressStatus'] = true;
                    $scope[name+'IsUploading'] = true;
                    $scope[name+'FileErrMsg'] = $scope.i18n('正在上传') + '...';
                });
            }else{
                $scope[name+'IsUploading'] = false;
                $scope[name+'FileErrMsg'] = $scope.i18n('请选择图片');
                $scope[name+'Url'] = '';
            }
        }
    }
}]);
$(function(){
    //置顶
    $('.top-box').click(function(){
        $("html,body").animate({scrollTop:0}, 500);
    })
});
