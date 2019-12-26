/**
 * Created by Botao on 19/06/20
 */
'use strict';
angular.module('appControllers').controller('indexStatementAccountPointCtrl', ["$scope", "$rootScope", "$cookieStore", "commonService", 'categoryService', "validateService", "Upload", "$state", "$stateParams","$window", function ($scope, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload, $state, $stateParams,$window) {

    //国际化
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    }

    //分页参数
    $scope.currentPage = 1 //当前页
    $scope.totalPage = 1 //总页数
    $scope.pageSize = 10 //单页显示条数

    //查询账号名称
    $scope.accountName = ""

    //报表数组
    $scope.accountInfoList = []

    $scope.init = function() {
        //翻页广播接收
        $scope.$on('changePageNo', function (event, data) {
            "use strict";
            $scope.currentPage = data;
            $scope.getAccountInfoList()
        })
        $scope.getAccountInfoList()
    }

    //点击日期tab
    $scope.clickDateTab = function(days) {
        $scope.currentDateTab = days
        const MILLISECONDS_IN_DAY = 24*60*60*1000
        let endDate = new Date(new Date().getTime() - 1 * MILLISECONDS_IN_DAY)
        let startDate = new Date(new Date().getTime() - days * MILLISECONDS_IN_DAY)
        $scope.createTimeEnd = formatDate(endDate)
        $scope.createTimeStart = formatDate(startDate)
    }

    //点击查询
    $scope.clickSearch = function() {
        $scope.currentPage = 1
        $scope.getAccountInfoList()
    }

    //重置查询参数
    $scope.clickReset = function() {
        $scope.accountName = ""
    }

    //点击下载
    $scope.clickDownload = function() {
        let url = "/custom-sbd-web/report/exportUserBalance.do?"
        let queryContent = {}
        if($scope.accountName) {
            queryContent.nickname = $scope.accountName
        }
        queryContent = JSON.stringify(queryContent)
        url += 'queryContent=' + encodeURIComponent(queryContent)
        window.open(url)
    }

    //获取账号余额表
    $scope.getAccountInfoList = function() {
        const url = "/custom-sbd-web/report/getUserBalancePage.do"
        const params = {
            currentPage: $scope.currentPage,
            itemsPerPage: $scope.pageSize
        }
        if($scope.accountName) {
            params.nickname = $scope.accountName
        }
        $rootScope.ajax.postJson(url, params).then(res => {
            if(res.code == 0) {
                $scope.accountInfoList = res.data.listObj
                $scope.totalPage = Math.ceil(res.data.total / $scope.pageSize)
            }else {
                $rootScope.error.checkCode(res.code, $scope.i18n('系统异常'))
            }
        })
    }

    $scope.init()

}]);

