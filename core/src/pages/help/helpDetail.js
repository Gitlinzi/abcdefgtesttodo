/**
 * Created by sindy on 15/11/4.
 */

appControllers.controller("helpDetailCtrl", ['$log', '$rootScope', '$scope', '$cookieStore','commonService','config','$location', '$window',function($log, $rootScope, $scope, $cookieStore,commonService,config,$location,$window){
    var _ut = $rootScope.util.getUserToken(),
        _fnE=$rootScope.error.checkCode;
    if ($rootScope.switchConfig.common.showAllGlobalNav) {
        $rootScope.execute();
    }
    $scope.articleInfo = {};
    $scope.categoryList = {};
    $scope.keyword = '';
    $scope.isShowHelpTitle = true;
    var id = $rootScope.util.paramsFormat().id,
        isHelp = $rootScope.util.paramsFormat().isHelp;
    if (isHelp && isHelp == 0){
        $scope.isShowHelpTitle = false;
    }
    //查询文章详细信息
    $scope.articleDetail = function (id) {
        var url = '/back-cms-web/cmsArticleRead/queryCmsArticles',
            params = {
                id: id,
                platformStr:'1'
            };

        $rootScope.ajax.postJson(url, params).then(function (rest) {
            if (rest.code == 0){
                $scope.articleInfo = rest.data;
                if ($scope.articleInfo != null){
                    if ($scope.articleInfo.articleContent != ''){
                        angular.element(document.querySelector('#article_content')).html($scope.articleInfo.articleContent);
                    }
                    if ($scope.articleInfo.displayTitle != ''){
                        // document.title = $scope.articleInfo.displayTitle;
                    }
                    if ($scope.articleInfo.categoryId != ''){
                        $scope.categoryId = $scope.articleInfo.categoryId;
                        $scope.getCategoryTree($scope.articleInfo.categoryId);
                    }
                }
            }
        }, function (rest) {
            _fnE($scope.i18n('系统异常'),rest.message);
        });
    };

    $scope.categoryId = $rootScope.util.paramsFormat().categoryId;
    //查询文章所属分类
    $scope.getCategoryTree = function () {
        $rootScope.ajax.get('/back-cms-web/cmsCategoryRead/getCategoryTreeByCategoryId', {
            categoryId: $scope.categoryId
        }).then(function (resp) {
            if (resp.code == 0) {
                $scope.categoryList = resp.data;
            }
        });
    };

    //修改文章访问数量
    $scope.updateArticleViews = function (id) {
        var url = '/back-cms-web/cmsArticleWrite/updateCmsArticleViews',
            params = {
                id: id
            };
        $rootScope.ajax.postJson(url, params).then(function (rest) {
            if (rest.code == 0){
                if (rest.data != true){
                    _fnE($scope.i18n('系统异常'),$scope.i18n('修改浏览数失败'));
                }
            }
        }, function (rest) {
            _fnE($scope.i18n('系统异常'),rest.message);
        });

    };
    $scope.searchList = function () {
        if ($scope.keyword){
            $window.location.href = '/helpList.html?keyword='+ $scope.keyword;
        }else {
            $window.location.href = '/helpList.html';
        }
    };
    $scope.articleDetail(id);
    $scope.updateArticleViews(id);

    //国际化
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
}]);
