/**
 * Created by Roy on 17/6/29.
 */
'use strict';
angular.module('appControllers').controller('consultCtrl',["$scope","$rootScope","$cookieStore","commonService", 'categoryService',"validateService","Upload","$state","$stateParams","$window",
    function($scope,$rootScope,$cookieStore,commonService, categoryService,validateService,Upload,$state,$stateParams,$window) {
    //公共参数
    //国际化
    $scope.i18n = function (key) {
       return $window.i18n ? $window.i18n(key) : key;
    };
    var _ut = $rootScope.util.getUserToken();
    if (!_ut) {
        $rootScope.showLoginBox = true;
        return;
    };
    $scope.isShowPage = false;
    $scope.isShowIcon = false;

    //初始化翻页
    $scope.initPagination = function () {
        $scope.pageNo = 1;
        $scope.pageSize = 10;
        $scope.totalCount = 0;

    };
    //翻页广播接收
    $scope.$on('changePageNo', function (event, data) {
        "use strict";
        $scope.pageNo = data;
        $scope.getOwnerConsultListList();
    })

    $scope.getOwnerConsultListList=function () {
        var url = "/api/social/consultAppAction/getOwnerConsultAndQaList.do";
        var params = {
            currentPage:$scope.pageNo,   //当前页码
            itemsPerPage:$scope.pageSize, //每页显示数量
            headerType:0,   // 0=咨询，1=问答
            qaType:0
        },that = this;
        $rootScope.ajax.postJson(url, params).then(function(res){
            if(res.code == 0){
                if(res.data.listObj !=null && res.data.listObj.length>0){
                    $scope.consultationText = res.data.listObj;
                    $scope.totalCount = res.data.total;
                    $scope.totalPage = $scope.totalCount % $scope.pageSize == 0 ? (($scope.totalCount / $scope.pageSize) || 1) : parseInt($scope.totalCount / $scope.pageSize) + 1;
                    that.isShowPage = true;
                }else {
                    that.isShowIcon = true;
                }
            }else {
                that.isShowIcon = true;
            }
        }, function (res) {
            $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('获取问答异常'));
        });
    };

    //初始化操作, 这个方法在页面的ng-init里调用
    $scope.init = function () {
        "use strict";
        var that = this;
        $scope.isShowPage = false;
        $scope.isShowIcon = false;
        //初始化翻页
        $scope.initPagination();//初始化翻页
        $scope.getOwnerConsultListList();
    };
}]);
