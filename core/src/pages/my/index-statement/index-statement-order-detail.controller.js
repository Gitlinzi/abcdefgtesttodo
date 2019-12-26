/**
 * Created by Botao on 19/06/20
 */
'use strict';
angular.module('appControllers').controller('indexStatementOrderDetailCtrl', ["$scope", "$rootScope", "$cookieStore", "commonService", 'categoryService', "validateService", "Upload", "$state", "$stateParams","$window", function ($scope, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload, $state, $stateParams,$window) {

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
    //当前订单状态 -1全部
    $scope.orderStatus = -1

    //报表数组
    $scope.orderDetailList = []

    $scope.init = function() {
        //翻页广播接收
        $scope.$on('changePageNo', function (event, data) {
            "use strict";
            $scope.currentPage = data;
            $scope.getOrderDetailList()
        })
        $scope.getOrderDetailList()
    }

    //点击日期tab
    $scope.clickDateTab = function(days) {
        $scope.currentDateTab = days
        const MILLISECONDS_IN_DAY = 24*60*60*1000
        let endDate = new Date(new Date().getTime())
        let startDate = new Date(new Date().getTime() - days * MILLISECONDS_IN_DAY)
        $scope.createTimeEnd = formatDate(endDate)
        $scope.createTimeStart = formatDate(startDate)
    }

    //点击查询
    $scope.clickSearch = function() {
        $scope.currentPage = 1
        $scope.getOrderDetailList()
    }

    //重置查询参数
    $scope.clickReset = function() {
        $scope.createTimeStart = ''
        $scope.createTimeEnd = ''
        $scope.currentDateTab = 0
        $scope.orderStatus = -1
    }

    //点击下载
    $scope.clickDownload = function() {
        let url = "/custom-sbd-web/report/exportSoList.do?"
        let queryContent = {}
        if($scope.createTimeStart) {
            queryContent.startCreateTime = $scope.createTimeStart
        }
        if($scope.createTimeEnd) {
            queryContent.endCreateTime = $scope.createTimeEnd
        }
        if($scope.orderStatus != -1) {
            queryContent.orderStatus = $scope.orderStatus
        }
        queryContent = JSON.stringify(queryContent)
        url += 'queryContent=' + encodeURIComponent(queryContent)
        window.open(url)
    }
    //账号订单明细
    $scope.clickDownload2 = function (){
        //var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var fileName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'fileName.xlsx';
        var leg = $rootScope.host.length - 4;
        //var baseUrl = $rootScope.host.slice(0, leg);
        var url = "/custom-sbd-web/report/exportSoList.do?";
        var queryContent = {};
        if ($scope.createTimeStart) {
            queryContent.startCreateTime = $scope.createTimeStart;
        }
        if ($scope.createTimeEnd) {
            queryContent.endCreateTime = $scope.createTimeEnd;
        }
        if ($scope.orderStatus != -1) {
            queryContent.orderStatus = $scope.orderStatus;
        }
        queryContent = JSON.stringify(queryContent);
        url += 'queryContent=' + encodeURIComponent(queryContent);
        var downloadUrl = url;
        try {
            var a = document.createElement('a');
            a.setAttribute('href', downloadUrl);
            a.setAttribute('download', fileName);
            $('body').append(a);
            a.click();
            $(a).remove();
        } catch (ex) {
            // 定义一个form表单,通过form表单来发送请求
            $('<form>').attr('style', 'display:none').attr('method', 'get').attr('action', downloadUrl).appendTo('body').submit(); // 表单提交
        }
    };

    //获取订单明细表
    $scope.getOrderDetailList = function() {
        const url = "/custom-sbd-web/report/getSoListPage.do"
        const params = {
            currentPage: $scope.currentPage,
            itemsPerPage: $scope.pageSize,
        }
        if($scope.createTimeStart) {
            params.startCreateTime = $scope.createTimeStart
        }
        if($scope.createTimeEnd) {
            params.endCreateTime = $scope.createTimeEnd
        }
        if($scope.orderStatus != -1) {
            params.orderStatus = $scope.orderStatus
        }
        $rootScope.ajax.postJson(url, params).then(res => {
            if(res.code == 0) {
                $scope.orderDetailList = res.data.listObj
                $scope.totalPage = Math.ceil(res.data.total / $scope.pageSize)
                $scope.orderDetailList.forEach(order => {
                    order.purchaseDate = formatDateTime(new Date(order.createTime))
                    order.orderStatusStr = getOrderStatusStr(order.orderStatus)
                })
                if($scope.totalPage <= 0) {
                    $scope.totalPage = 1
                }
            }else {
                $rootScope.error.checkCode(res.code, $scope.i18n('系统异常'))
            }
        })
    }

    //获取订单状态string
    function getOrderStatusStr(status) {
        if(status == 1010) {
            return $scope.i18n("待支付")
        }else if(status == 1020) {
            return $scope.i18n("已支付")
        }else if(status == 1030) {
            return $scope.i18n("待确认")
        }else if(status == 1031) {
            return $scope.i18n("已确认")
        }else if(status == 1040) {
            return $scope.i18n("待审核")
        }else if(status == 1050) {
            return $scope.i18n("待发货")
        }else if(status == 1060) {
            return $scope.i18n("已发货，待收货")
        }else if(status == 1070) {
            return $scope.i18n("已签收，待评价")
        }else if(status == 1999) {
            return $scope.i18n("已完成")
        }else if(status == 9000) {
            return $scope.i18n("已关闭，已取消")
        }
        return ""
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

    //Y-m-d h:m:s
    function formatDateTime(date) {
        let year = date.getFullYear().toString()
        let month = (date.getMonth()+1).toString()//month是从0开始的
        let day = date.getDate().toString()
        let hour = date.getHours().toString()
        let minute = date.getMinutes().toString()
        let second = date.getSeconds().toString()
        if(month.length == 1) {
            month = "0" + month
        }
        if(day.length == 1) {
            day = "0" + day
        }
        if(hour.length == 1) {
            hour = "0" + hour
        }
        if(minute.length == 1) {
            minute = "0" + minute
        }
        if(second.length == 1) {
            second = "0" + second
        }
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`
    }

    $scope.init()

}]);

