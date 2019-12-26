/**
 * Created by sindy on 15/11/4.
 */

appControllers.controller("helpCtrl", ['$log', '$rootScope', '$scope', '$cookieStore','commonService','config','$window', function($log, $rootScope, $scope, $cookieStore,commonService,config,$window){
    var _ut = $rootScope.util.getUserToken(),
        _fnE=$rootScope.error.checkCode;
    if ($rootScope.switchConfig.common.showAllGlobalNav) {
        $rootScope.execute();
    }

    $scope.articleViews = {};
    $scope.category = {};
    $scope.keyword = '';
    //浏览最多
    $scope.initArticleViews = function () {
        var url = '/back-cms-web/cmsArticleRead/queryCmsArticleList',
            params = {
                isOrderByViews: 1,
                currentPage:0,
                itemsPerPage:10,
                status:4,
                platformIds:'1'
            };
        $rootScope.ajax.postJson(url, params).then(function (rest) {
            if (rest.code == 0){
                $scope.articleViews = rest.data.listObj;
            }
        }, function (rest) {
            _fnE($scope.i18n('系统异常'),rest.message);
        });
    };
    //查询分类文章列表
    $scope.initQuerySubCategory = function () {
        var url = '/back-cms-web/cmsCategoryRead/querySubCategory',
            params = {
                categoryCode:'help',
                platformIds:'1',
                itemsPerPage:5
            };
        $rootScope.ajax.postJson(url, params).then(function (rest) {
            if (rest.code == 0){
                $scope.category = rest.data;
            }
        }, function (rest) {
            _fnE($scope.i18n('系统异常'),rest.message);
        });
    };

    $scope.searchList = function (keyword) {
        if ($scope.keyword){
            $window.location.href = '/helpList.html?keyword='+ $scope.keyword;
        }else {
            $window.location.href = '/helpList.html';
        }
    };
    $scope.initArticleViews();
    $scope.initQuerySubCategory();

    //国际化
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
}]);
