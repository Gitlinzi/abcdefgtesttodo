/**
 * Created by sindy on 15/11/4.
 */

appControllers.controller("helpListCtrl", ['$log', '$rootScope', '$scope', '$cookieStore','commonService','config','$window','$location', function($log, $rootScope, $scope, $cookieStore,commonService,config,$window,$location){
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
    $scope.categoryId = $rootScope.util.paramsFormat().categoryId;
    $scope.categoryCode = $rootScope.util.paramsFormat().categoryCode;
    //默认为帮助中心
    if (!$scope.categoryCode){
        $scope.categoryCode = 'help';
    }
    $scope.isShowHelpTitle = true;
    $scope.isShowSearch = true;
    $scope.isHelp = $rootScope.util.paramsFormat().isHelp;
    $scope.noticeType = $rootScope.util.paramsFormat().type
    if ($scope.isHelp && $scope.isHelp == 0){
        $scope.isShowHelpTitle = false;
        $scope.isShowSearch = false;
    }
    $scope.keyword = $rootScope.util.paramsFormat().keyword? decodeURI($rootScope.util.paramsFormat().keyword) : '';

    $scope.searchArticleList = {};
    //初始化翻页
    $scope.initPagination = function () {
        $scope.pageNo = 1;
        $scope.pageSize = 10;
        $scope.totalCount = 0;
        $scope.searchList();
        /*if ($scope.keyword != null && $scope.keyword != ''){
            var url = 'http://'+$location.$$host + '/helpList.html?keyword=' + $scope.keyword;
            window.history.replaceState(null, "",  url);
        }*/
    };
    //翻页广播接收
    $scope.$on('changePageNo', function (event, data) {
        "use strict";
        $scope.pageNo = data;
        $scope.searchList();
    });
    if (($scope.categoryId != null && $scope.categoryId != '')){
        $scope.isShowSearch = false;
        // document.title = '帮助分类页';
    }else if ($scope.isHelp && $scope.isHelp == 0) {
        // document.title = $rootScope.switchConfig.common.bulletinName;
    } else {
        // document.title = '帮助搜索页';
    }
    $scope.searchList = function () {
        if ($scope.isHelp && $scope.isHelp == 0){
            if (!$scope.categoryCode){
                $scope.categoryCode = 'headlines';
            }
            var url = '/cms/view/pc/headlinesList',
                params = {
                    categoryType:2,
                    currentPage:$scope.pageNo,
                    itemsPerPage:$scope.pageSize,
                    code:$scope.categoryCode,
                    isMerchant: $scope.noticeType || 0
                };
            $rootScope.ajax.get(url,params).then(function( res ) {
                if( res.code == 0 && res.data && res.data.pageResult && res.data.pageResult) {
                    $scope.noticeData = res.data.pageResult.listObj
                    $scope.totalCount = res.data.pageResult.total;
                    $scope.totalPage = res.data.pageResult.totalPage;
                    $scope.searchArticleList = res.data.pageResult.listObj;
                    if ($scope.searchArticleList != null && $scope.searchArticleList.length > 0) {
                        $scope.isShowPage = true;
                    }else {
                        $scope.isShowPage = false;
                    }
                }
            })
        } else {
            var url = '/back-cms-web/cmsArticleRead/searchArticleList',
                params = {
                    currentPage:$scope.pageNo,
                    itemsPerPage:$scope.pageSize,
                    categoryId:$scope.categoryId,
                    keyword:$scope.keyword,
                    categoryCode:$scope.categoryCode,
                    platform:1
                };
            $rootScope.ajax.postJson(url, params).then(function (rest) {
                if (rest.code == 0){
                    $scope.totalCount = rest.data.total;
                    $scope.totalPage = $scope.totalCount % $scope.pageSize == 0 ? (($scope.totalCount / $scope.pageSize) || 1) : parseInt($scope.totalCount / $scope.pageSize) + 1;
                    $scope.searchArticleList = rest.data.listObj;
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
        }

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
        // $scope.pageNo = 1;
        // $scope.pageSize = 10;
        // $scope.totalCount = 0;
        // $scope.searchList();
        if ($scope.keyword){
            $window.location.href = '/helpList.html?keyword='+ $scope.keyword;
        }else {
            $window.location.href = '/helpList.html';
        }
    }
    $scope.initPagination();
    $scope.getCategoryTree();

    //国际化
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
}]);
