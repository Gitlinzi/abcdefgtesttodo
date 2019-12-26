
appControllers.controller("helpVideoListCtrl", ['$log', '$rootScope', '$scope', '$cookieStore','commonService','config','$window','$location','$sce', function($log, $rootScope, $scope, $cookieStore,commonService,config,$window,$location,$sce){
    var _ut = $rootScope.util.getUserToken(),
        _fnE=$rootScope.error.checkCode;
    if ($rootScope.switchConfig.common.showAllGlobalNav) {
        $rootScope.execute();
    }
    /**
     * url参数格式化
     * 例：?param=1
     * 参数得到方式：paramsObj.param
     */
    $scope.paramsFormat = function(url) {
        var qInd = url.indexOf('?');
        var sharpInd = url.indexOf('#'); //路由
        var search = "";
        var paramsList = [];
        var paramsObj = {};

        if (qInd >= 0) {
            if (sharpInd > 0) {
                search = url.substring(qInd + 1, sharpInd);
            } else {
                search = url.substring(qInd + 1);
            }
            paramsList = search.split('&');
            for (var ind=0;ind<paramsList.length;ind++) {
                var param = paramsList[ind];
                if(param) {
                    var pind = param.indexOf("=");
                    if (pind >= 0) {
                        paramsObj[param.substring(0, pind)] = param.substr(pind + 1);
                    } else {
                        paramsObj[param] = "";
                    }
                }

            }
        }
        return paramsObj;
    };
    /**
     * 普通用户 1 审批人2  管理员3
     */
    $scope.objUser = $rootScope.util.paramsFormat().objUser || 1; 
    $scope.isShowHelpTitle = true;
    $scope.isShowSearch = true;
    if ($scope.isHelp && $scope.isHelp == 0){
        $scope.isShowHelpTitle = false;
        $scope.isShowSearch = false;
    }
    $scope.keyword = $rootScope.util.paramsFormat().keyword? decodeURI($rootScope.util.paramsFormat().keyword) : '';

    $scope.searchArticleList = [];
    $scope.searchArticle = [];
    $scope.searchListData = [];
    //初始化翻页
    $scope.initPagination = function () {
        $scope.pageNo = 1;
        $scope.pageSize = 10;
        $scope.totalCount = 0;
        
        $scope.searchList(1);
        $scope.searchList(2);
        $scope.searchList(3);
    };
    $scope.play = function($event,video){
        video.show = false;
        var ele = angular.element($event.currentTarget).find('video');
        ele[0].play()
    }
    //翻页广播接收
    $scope.$on('changePageNo', function (event, data) {
        "use strict";
        $scope.pageNo = data;
        $scope.searchList(1);
        $scope.searchList(2);
        $scope.searchList(3);
    });

    $scope.videoUrlFun = function(url){
        //$sce.trustAsResourceUrl方法把普通路径处理加工成一个angular环境可识别，并认为是安全的路径来使用
        var urlFun = $sce.trustAsResourceUrl(url);
        return urlFun;
    };
    $scope.searchList = function (objUser) {
        var url = '/back-cms-web/cmsArticleRead/queryVideoList.do',
            params = {
                objUser:objUser || 1,
                currentPage:$scope.pageNo,
                itemsPerPage:$scope.pageSize,
                
            };
        $rootScope.ajax.postJson(url, params).then(function (rest) {
            if (rest.code == 0){
                $scope.totalCount = rest.data.total;
                $scope.totalPage = $scope.totalCount % $scope.pageSize == 0 ? (($scope.totalCount / $scope.pageSize) || 1) : parseInt($scope.totalCount / $scope.pageSize) + 1;
                rest.data.listObj.forEach(function(v){
                    v.show = true;
                })
                if(objUser == 1){
                    $scope.searchArticleList = rest.data.listObj;
                }else if(objUser == 2){
                    $scope.searchArticle = rest.data.listObj;
                }else if(objUser == 3){
                    $scope.searchListData = rest.data.listObj;
                }
                
                if ($scope.keyword){
                    $scope.searchResultDesc = $scope.i18n('搜索到')+ rest.data.total+$scope.i18n('条')+$scope.keyword+$scope.i18n('的结果');
                }else {
                    $scope.searchResultDesc = '';
                }
                if (rest.data.listObj != null && rest.data.listObj.length > 0) {
                    $scope.isShowPage = true;
                }else {
                    $scope.isShowPage = false;
                }
            }
        }, function (rest) {
            _fnE($scope.i18n('系统异常'),rest.message);
        });
    };
    $scope.getCategoryTree = function () {
        if (!$scope.isShowSearch){
            $rootScope.ajax.get('/back-cms-web/cmsCategoryRead/getCategoryTreeByCategoryId', {
                categoryId: $scope.categoryId
            }).then(function (resp) {
                if (resp.code == 0) {
                    $scope.categoryList = resp.data;
                }
            });
        }
    };
    $scope.search = function() {
        if ($scope.keyword){
            $window.location.href = '/helpVideoList.html?keyword='+ $scope.keyword;
        }else {
            $window.location.href = '/helpVideoList.html';
        }
    }
    $scope.initPagination();
    $scope.getCategoryTree();

    //国际化
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
}]);
