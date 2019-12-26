'use strict';
angular.module('appControllers').controller('indexStatementCategoryCtrl', ["$scope", "$rootScope", "$cookieStore", "commonService", 'categoryService', "validateService", "Upload", "$state", "$stateParams","$window",
    function ($scope, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload, $state, $stateParams,$window) {
        // $scope.isShowPage = true
        $scope.queryFlag = false
        $scope.startTime = '',
        $scope.endTime = '',
        // 时间组件
        $scope.options1= {
            format:'Y-m-d',
            lang:'zh',
            timepickerScrollbar:false,
            timepicker:false,
            scrollInput:false,
            scrollMonth:false,
            scrollTime:false
        }
        $scope.options2= {
            format:'Y-m-d',
            lang:'zh',
            timepickerScrollbar:false,
            timepicker:false,
            scrollInput:false,
            scrollMonth:false,
            scrollTime:false
        }
        $scope.pieListData = []
        $scope.staticsCategoryList = []
        $scope.statementCategory = function() {
            var url = '/custom-sbd-web/form/queryDeliverCategory.do'
            var params = {}
            if ($scope.queryFlag) {
                if ($scope.startTime) {
                    params.orderCreateTimeStart = $scope.startTime
                }
                if ($scope.endTime) {
                    params.orderCreateTimeEnd = $scope.endTime
                }
            }            
            $rootScope.ajax.postJson(url,params).then(function(res) {
                var flag = false
                if (res.code ==0 && res.data && res.data.list.length) {
                    $scope.staticsCategoryList = res.data.list || []
                    angular.forEach(res.data.list,function(item,index){
                        // $scope.pieListData.push({name:item.name + ':' + item.productPrice + '(' + item.percentage + ')',value:item.productPrice})
                        $scope.pieListData.push({name:item.name,value:item.productPrice})
                        if (index == res.data.list.length-1) {
                            flag = true
                        }
                    })
                    if (flag) {
                        var myChart = echarts.init(document.getElementById('main-charts'))
                        var option = {
                            title: {
                                text: '分类采购额',
                                x: 'center'
                            },
                            tooltip : {
                                trigger: 'item',
                                formatter: "{a} <br/>{b} : {c} ({d}%)"
                            },
                            legend: {
                                data:['分类采购额'],
                                x: 'center'
                            },
                            series: [{
                                name: '销量',
                                type: 'pie',
                                data: $scope.pieListData
                            }]
                        };
                        // 使用刚指定的配置项和数据显示图表。
                        myChart.setOption(option);
                    }                    
                }
            })
        }        
        $scope.statementCategory()
        $scope.querystatementCategory = function() {
            $scope.queryFlag = true
            $scope.pieListData = []
            $scope.staticsCategoryList = []    
            $scope.statementCategory() 
        }
        $scope.chooseTime = function() {
            $scope.queryFlag = false
        }   
        // 下載excel
        $scope.downloadFileByGet = function(url, params = {}, fileName = 'fileName.xlsx') {
            var leg = $rootScope.host.length
            leg = leg - 4
            var baseUrl = $rootScope.host.slice(0,leg)
            url = url || baseUrl + '/custom-sbd-web/form/exportDeliverCategory.do'
            // const downloadUrl = `${url}?${param(params)}`
            if ($scope.queryFlag) {
                if ($scope.startTime) {
                   url = url + '?start=' + $scope.startTime
                }
                if ($scope.endTime) {
                    if ($scope.startTime) {
                        url = url + '&end=' + $scope.endTime
                    } else {
                        url = url + '?end=' + $scope.endTime
                    }
                }
            }    
            const downloadUrl = url
            try {
                const a = document.createElement('a')
                a.setAttribute('href', downloadUrl)
                a.setAttribute('download', fileName)
                a.click()
            } catch (ex) {
            // 定义一个form表单,通过form表单来发送请求
              $('<form>')
                .attr('style', 'display:none')
                .attr('method', 'get')
                .attr('action', downloadUrl)
                .appendTo('body')
                .submit()// 表单提交
            }
            // return
          }
    }
])
;
