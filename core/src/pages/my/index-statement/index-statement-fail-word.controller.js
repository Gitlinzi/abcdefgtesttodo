/**
 * Created by Botao on 19/06/20
 */
'use strict';
angular.module('appControllers').controller('indexStatementFailWordCtrl', ["$scope", "$rootScope", "$cookieStore", "commonService", 'categoryService', "validateService", "Upload", "$state", "$stateParams","$window", function ($scope, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload, $state, $stateParams,$window) {

    //国际化
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    }

    //日期组件
    $scope.datetimepickerOptions1 = {
        format:'Y-m-d',
        lang:'zh',
        timepickerScrollbar:false,
        timepicker:false,
        scrollInput:false,
        scrollMonth:false,
        scrollTime:false
    }
    $scope.datetimepickerOptions2 = {
        format:'Y-m-d',
        lang:'zh',
        timepickerScrollbar:false,
        timepicker:false,
        scrollInput:false,
        scrollMonth:false,
        scrollTime:false
    }

    //分页参数
    $scope.currentPage = 1 //当前页
    $scope.totalPage = 1 //总页数
    $scope.pageSize = 10 //单页显示条数

    //日期查询条件
    $scope.createTimeStart = ''
    $scope.createTimeEnd = ''
    //日期tab 0:无选中 1:昨天 7:近7天 30:近30天
    $scope.currentDateTab = 0
    $scope.createTime = ''

    //报表数组
    $scope.failWordList = []

    $scope.init = function() {
        //翻页广播接收
        $scope.$on('changePageNo', function (event, data) {
            "use strict";
            $scope.currentPage = data;
            $scope.getFailWordList()
        })

        $scope.getFailWordList()
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
        $scope.getFailWordList()
    }

    //重置查询参数
    $scope.clickReset = function() {
        $scope.createTimeStart = ''
        $scope.createTimeEnd = ''
        $scope.currentDateTab = 0
    }

    //点击下载
    $scope.clickDownload = function() {
        let url = "/custom-sbd-web/searchFailWord/exportList.do?"
        let queryContent = {
            createTimeStart: $scope.createTimeStart,
            createTimeEnd: $scope.createTimeEnd
        }
        queryContent = JSON.stringify(queryContent)
        url += 'queryContent=' + encodeURIComponent(queryContent)
        window.open(url)
    }

    //获取搜索失败词
    $scope.getFailWordList = function() {
        const url = "/custom-sbd-web/searchFailWord/list.do"
        const params = {
            currentPage: $scope.currentPage,
            itemsPerPage: $scope.pageSize,
            createTimeStart: $scope.createTimeStart,
            createTimeEnd: $scope.createTimeEnd
        }
        $rootScope.ajax.postJson(url, params).then(res => {
            if(res.code == 0) {
                $scope.failWordList = res.data.listObj
                $scope.totalPage = Math.ceil(res.data.total / $scope.pageSize)
                if(res.data.listObj) {
                    res.data.listObj.forEach(time => {
                        $scope.createTime = new Date(parseInt(time.createTime)).toLocaleString().replace(/:\d{1,2}$/,' ');
                    });
                }
            }else {
                $rootScope.error.checkCode(res.code, $scope.i18n('系统异常'))
            }
        })
    }

    //Y-m-d
    function formatDate(date) {
        let year = date.getFullYear().toString()
        let month = (date.getMonth()+1).toString()
        let day = date.getDate().toString()
        if(month.length == 1) {
            month = "0" + month
        }
        if(day.length == 1) {
            day = "0" + day
        }
        return `${year}-${month}-${day}`
    }

    $scope.init()

}]);

