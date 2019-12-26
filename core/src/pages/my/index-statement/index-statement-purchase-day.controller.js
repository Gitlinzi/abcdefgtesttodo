/**
 * Created by Botao on 19/06/20
 */
'use strict';
angular.module('appControllers').controller('indexStatementPurchaseDayCtrl', ["$scope", "$rootScope", "$cookieStore", "commonService", 'categoryService', "validateService", "Upload", "$state", "$stateParams","$window", function ($scope, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload, $state, $stateParams,$window) {

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

    //成本中心列表
    $scope.costCenterList = []

    //分页参数
    $scope.currentPage = 1 //当前页
    $scope.totalPage = 1 //总页数
    $scope.pageSize = 10 //单页显示条数

    //日期查询条件
    $scope.createTimeStart = ''
    $scope.createTimeEnd = ''
    //日期tab 0:无选中 1:昨天 7:近7天 30:近30天
    $scope.currentDateTab = 0

    //报表数组
    $scope.purchaseInfoList = []

    $scope.init = function() {
        //翻页广播接收
        $scope.$on('changePageNo', function (event, data) {
            "use strict";
            $scope.currentPage = data;
            $scope.getPurchaseInfoList()
        })
        $scope.getCostCenterList()
        $scope.getPurchaseInfoList()
    }

    //获取成本中心列表
    $scope.getCostCenterList = function() {
        const url = "/custom-sbd-web/advCostCenter/getCostCenterByUserId.do"
        $rootScope.ajax.postJson(url).then(res => {
            if(res.code == 0) {
                $scope.costCenterList = res.data
            }else {
                $rootScope.error.checkCode(res.code, res.message)
            }
        })
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
        $scope.getPurchaseInfoList()
    }

    //重置查询参数
    $scope.clickReset = function() {
        $scope.createTimeStart = ''
        $scope.createTimeEnd = ''
        $scope.currentDateTab = 0
        $scope.costCenterList.forEach(cost => {
            cost.checked = false
        })
    }

    //点击下载
    $scope.clickDownload = function() {
        let url = "/custom-sbd-web/report/exportPurchaseInfoDay.do?"
        let queryContent = {
            createTimeStart: $scope.createTimeStart,
            createTimeEnd: $scope.createTimeEnd
        }
        let centerIdList = $scope.costCenterList.filter(c => c.checked).map(c => c.id)
        if(centerIdList) {
            queryContent.centerIdList = centerIdList
        }
        queryContent = JSON.stringify(queryContent)
        url += 'queryContent=' + encodeURIComponent(queryContent)
        window.open(url)
    }

    //获取采购额天表
    $scope.getPurchaseInfoList = function() {
        const url = "/custom-sbd-web/report/purchaseInfoDay.do"
        const params = {
            currentPage: $scope.currentPage,
            itemsPerPage: $scope.pageSize,
            createTimeStart: $scope.createTimeStart,
            createTimeEnd: $scope.createTimeEnd
        }
        let centerIdList = $scope.costCenterList.filter(c => c.checked).map(c => c.id)
        if(centerIdList) {
            params.centerIdList = centerIdList
        }
        $rootScope.ajax.postJson(url, params).then(res => {
            if(res.code == 0) {
                $scope.purchaseInfoList = res.data.pageResult.listObj
                $scope.totalPage = Math.ceil(res.data.pageResult.total / $scope.pageSize)
                $scope.infoMap = res.data.list
                $scope.drawChart()
            }else {
                $rootScope.error.checkCode(res.code, $scope.i18n('系统异常'))
            }
        })
    }

    //画图表
    $scope.drawChart = function() {
        let infoMap = $scope.infoMap
        if(!$scope.myChart) {
            $scope.myChart = echarts.init(document.getElementById('day-chart'))
        }
        $scope.myChart.clear()
        let xAxis = []
        if(infoMap.length >= 1) {
            let startDate = parseDate(infoMap[0].pruchaseDate)
            let endDate = parseDate(infoMap[infoMap.length-1].pruchaseDate)
            xAxis = dateInterval(startDate, endDate)
        }
        let chartData = new Array(xAxis.length).fill(0)
        let xIndex = 0
        for(let info of infoMap) {
            while(info.pruchaseDate != xAxis[xIndex]) {
                xIndex ++
            }
            chartData[xIndex] = info.amount
        }
        const option = {
            title: {
                text: $scope.getChartTitle()
            },
            xAxis: {
                name: $scope.i18n('日期'),
                nameLocation: 'center',
                nameGap: 30,
                type: 'category',
                data: xAxis
            },
            yAxis: {
                name: $scope.i18n('采购额（元）'),
                nameLocation: 'center',
                nameGap: 40,
                type: 'value'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b}: ¥{c}'
            },
            series: [{
                data: chartData,
                type: 'line',
                smooth: true
            }]
        }
        $scope.myChart.setOption(option);
    }

    //获取图标标题
    $scope.getChartTitle = function() {
        let timeStart = $scope.createTimeStart
        let timeEnd = $scope.createTimeEnd
        if(!timeEnd) {
            let today = new Date()
            timeEnd = formatDate(today)
        }
        return $scope.i18n('采购额天表') + 
        ` ${timeStart} ~ ${timeEnd}`
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

    //将Y-m-d字符串日期格式转为Date对象
    function parseDate(dateStr) {
        return new Date(dateStr)
    }

    //获取下一天日期
    function nextDay(date) {
        const DAY = 24 * 60 * 60 * 1000
        return new Date(date.getTime() + DAY)
    }

    //获取从开始日期至结束日期并返回数组
    function dateInterval(startDate, endDate) {
        let ret = []
        ret.push(startDate)
        let currentDate = startDate
        while(currentDate.getTime() < endDate.getTime()) {
            currentDate = nextDay(currentDate)
            ret.push(currentDate)
        }
        return ret.map(formatDate)
    }

    $scope.init()

}]);

