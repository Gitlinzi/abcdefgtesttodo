/**
 * Created by Botao on 19/06/20
 */
'use strict';
angular.module('appControllers').controller('indexStatementPurchaseCategoryCtrl', ["$scope", "$rootScope", "$cookieStore", "commonService", 'categoryService', "validateService", "Upload", "$state", "$stateParams","$window", function ($scope, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload, $state, $stateParams,$window) {

    //国际化
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };

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

    //日期查询条件
    $scope.createTimeStart = ''
    $scope.createTimeEnd = ''

    //报表数组
    $scope.purchaseInfoList = []
    //总金额
    $scope.totalMoney = 0
    //总百分比
    $scope.totalPercent = 0.0
    //商品总数量
    $scope.totalProducts = 0

    $scope.init = function() {
        $scope.getPurchaseInfoList()
    }

    //获取报表
    $scope.getPurchaseInfoList = function() {
        const url = "/custom-sbd-web/report/purchaseInfoCategory.do"
        const params = {
            createTimeStart: $scope.createTimeStart,
            createTimeEnd: $scope.createTimeEnd
        }
        $rootScope.ajax.postJson(url, params).then(res => {
            if(res.code == 0) {
                if(res.data.summary) {
                    $scope.totalMoney = res.data.summary.amount
                    $scope.totalPercent = res.data.summary.percent
                    $scope.totalProducts = res.data.summary.num
                }else {
                    $scope.totalMoney = 0
                    $scope.totalPercent = 0
                    $scope.totalProducts = 0
                }
                $scope.purchaseInfoList = res.data.list
                $scope.purchaseInfoList.forEach(info => {
                    info.categoryName = getCategoryName(info.fullNamePath)
                })
                $scope.purchaseInfoList.sort((a, b) => a.amount - b.amount)
                $scope.drawChart()
            }else {
                $rootScope.error.checkCode(res.code, res.message);
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
        $scope.createTimeStart = ''
        $scope.createTimeEnd = ''
    }

    //画图表
    $scope.drawChart = function() {
        if(!$scope.myChart) {
            $scope.myChart = echarts.init(document.getElementById('category-chart'))
        }
        $scope.myChart.clear()
        const pieData = $scope.purchaseInfoList.map(info => {
            return {
                name: info.categoryName,
                value: info.amount
            }
        })
        const option = {
            title: {
                text: $scope.getChartTitle()
            },
            tooltip : {
                trigger: 'item',
                formatter: "{b} : ¥{c} ({d}%)"
            },
            series: [{
                name: '采购数据-按类目',
                type: 'pie',
                data: pieData,
                label: {
                    formatter: "{b} : ¥{c} ({d}%)"
                }
            }]
        }
        $scope.myChart.setOption(option);
    }

    //根据完整类目获取一级目录名称
    //Ex：后台类目树-休闲服饰 => 休闲服饰
    function getCategoryName(fullNamePath) {
        return fullNamePath.split('-')[1]
    }

    //获取图标标题
    $scope.getChartTitle = function() {
        let timeStart = $scope.createTimeStart
        let timeEnd = $scope.createTimeEnd
        if(!timeEnd) {
            let today = new Date()
            timeEnd = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
        }
        return $scope.i18n('采购数据-按类目') + 
        ` ${timeStart} ~ ${timeEnd}`
    }

    $scope.init()

}]);

