/**
 * Created by Botao on 19/06/20
 */
'use strict';
angular.module('appControllers').controller('indexStatementPurchaseMonthCtrl', ["$scope", "$rootScope", "$cookieStore", "commonService", 'categoryService', "validateService", "Upload", "$state", "$stateParams","$window", function ($scope, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload, $state, $stateParams,$window) {

    //国际化
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    }

    //成本中心列表
    $scope.costCenterList = []

    //年份
    $scope.yearInput = ""

    //分页参数
    $scope.currentPage = 1 //当前页
    $scope.totalPage = 1 //总页数
    $scope.pageSize = 10 //单页显示条数

    //报表数组
    $scope.purchaseInfoList = []
    $scope.yearMap = {}

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

    //点击查询
    $scope.clickSearch = function() {
        $scope.currentPage = 1
        $scope.getPurchaseInfoList()
    }

    //重置查询参数
    $scope.clickReset = function() {
        $scope.yearInput = ""
        $scope.costCenterList.forEach(cost => {
            cost.checked = false
        })
    }

    //点击下载
    $scope.clickDownload = function() {
        let url = "/custom-sbd-web/report/exportPurchaseInfoMonth.do?"
        let queryContent = {}
        let centerIdList = $scope.costCenterList.filter(c => c.checked).map(c => c.id)
        if(centerIdList) {
            queryContent.centerIdList = centerIdList
        }
        if($scope.yearInput) {
            queryContent.yearList = $scope.yearInput.split(',').map(y => Number(y))
        }
        queryContent = JSON.stringify(queryContent)
        url += 'queryContent=' + encodeURIComponent(queryContent)
        window.open(url)
    }

    //获取采购月表
    $scope.getPurchaseInfoList = function() {
        const url = "/custom-sbd-web/report/purchaseInfoMonth.do"
        const params = {
            currentPage: $scope.currentPage,
            itemsPerPage: $scope.pageSize,
        }
        let centerIdList = $scope.costCenterList.filter(c => c.checked).map(c => c.id)
        if(centerIdList) {
            params.centerIdList = centerIdList
        }
        if($scope.yearInput) {
            params.yearList = $scope.yearInput.split(',').map(y => Number(y))
        }
        $rootScope.ajax.postJson(url, params).then(res => {
            if(res.code == 0) {
                $scope.purchaseInfoList = res.data.pageResult.listObj
                $scope.totalPage = Math.ceil(res.data.pageResult.total / $scope.pageSize)
                $scope.yearMap = res.data.yearMap
                $scope.drawChart()
            }else {
                $rootScope.error.checkCode(res.code, $scope.i18n('系统异常'))
            }
        })
    }

    //画图表
    $scope.drawChart = function() {
        if(!$scope.myChart) {
            $scope.myChart = echarts.init(document.getElementById('month-chart'))
        }
        $scope.myChart.clear()
        const chartData = []
        for(let year in $scope.yearMap) {
            let monthData = new Array(12).fill('-')
            $scope.yearMap[year].forEach(monthMap => {
                let month = Number(monthMap.month)-1
                monthData[month] = monthMap.amount
            })
            let data = {
                name: year,
                data: monthData,
                type: 'line',
                smooth: true
            }
            chartData.push(data)
        }
        const option = {
            title: {
                text: $scope.getChartTitle()
            },
            legend: {
                type: 'plain'
            },
            xAxis: {
                name: $scope.i18n('月份'),
                nameLocation: 'center',
                nameGap: 30,
                type: 'category',
                data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            },
            yAxis: {
                name: $scope.i18n('采购额（元）'),
                nameLocation: 'center',
                nameGap: 40,
                type: 'value'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a}年{b}月: ¥{c}'
            },
            series: chartData
        }
        $scope.myChart.setOption(option);
    }

    //获取图标标题
    $scope.getChartTitle = function() {
        let years = Object.keys($scope.yearMap)
        return $scope.i18n('采购额月表') + " " + years.join(',') 
    }
    
    $scope.init()

}]);

