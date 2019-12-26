/**
 * Created by Botao on 19/06/18
 */
angular.module('appControllers').controller('authorizationCtrl', ["$scope", "$rootScope", "$q", "$cookieStore", "commonService", 'categoryService', "validateService", "Upload", "$state", "$stateParams","$window", "$filter", "allUrlApi","$timeout", function ($scope, $rootScope, $q, $cookieStore, commonService, categoryService, validateService, Upload, $state, $stateParams, $window, $filter, allUrlApi, $timeout) {
    
    var _ut = $rootScope.util.getUserToken();
    var _fnP = $rootScope.ajax.post,
        _fnG = $rootScope.ajax.get,
        _fnE = $rootScope.error.checkCode,
        _host = $rootScope.host,
        _home = $rootScope.home,
        _cid = $rootScope.companyId;

    //国际化
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    }

    //日期组件option必须不同
    $scope.datetimepickerOptions1 = getDatetimepickerOptions()
    $scope.datetimepickerOptions2 = getDatetimepickerOptions()
    $scope.datetimepickerOptions3 = getDatetimepickerOptions()
    $scope.datetimepickerOptions4 = getDatetimepickerOptions()

    //成本中心列表
    $scope.costCenterList = []
    //审批列表
    $scope.orderApprovalList = []
    $scope.currentPage = 1 //当前页
    $scope.totalPage = 1 //总页数
    $scope.pageSize = 10 //单页显示条数
    //订单总金额
    $scope.totalMoney = 100
    //当前金额
    $scope.currentMoney = 100
    //查询参数
    $scope.queryOrderParams = {
        //下单时间
        orderMinTime: '',
        orderMaxTime: '',
        //审批时间
        approvalMinTime: '',
        approvalMaxTime: '',
        //订单编号
        orderId: '',
        //下单人
        orderPerson: '',
        //申请人部门id -1为全部
        costCenterId: -1
    }
    //审批状态 -1全部 0待审批 1审批中 2审批通过 3审批拒绝 4审批退回
    $scope.approvalStatus = 0
    //全选
    $scope.allCheck = false

    //初始化
    $scope.init = function() {
        //翻页广播接收
        $scope.$on('changePageNo', function (event, data) {
            "use strict";
            $scope.currentPage = data;
            $scope.getOrderApprovalList();
        })
        $scope.getCostCenter()
        $scope.getOrderApprovalList()
    }

    //获取成本中心列表（申请人部门）
    $scope.getCostCenter = function() {
        const url = "/custom-sbd-web/advCostCenter/getCostCenterByUserId.do"
        $rootScope.ajax.postJson(url).then(res => {
            if(res.code == 0) {
                $scope.costCenterList = res.data
            }else {
                $rootScope.error.checkCode(res.code, res.message)
            }
        })
    }

    //按审批状态查询
    $scope.filterStatus = function(newStatus) {
        if(newStatus == $scope.approvalStatus) {
            return
        }
        $scope.approvalStatus = newStatus
        $scope.currentPage = 1
        $scope.getOrderApprovalList()
    }

    //查询审批列表
    $scope.getOrderApprovalList = function() {
        $scope.orderApprovalList = []
        const url = "/custom-sbd-web/approval/queryApprSoListPage.do"
        const params = {
            currentPage: $scope.currentPage,
            itemsPerPage: $scope.pageSize
        }
        if($scope.queryOrderParams.orderMinTime) {
            params.orderBeginTime = $scope.queryOrderParams.orderMinTime
        }
        if($scope.queryOrderParams.orderMaxTime) {
            params.orderEndTime = $scope.queryOrderParams.orderMaxTime
        }
        if($scope.queryOrderParams.approvalMinTime) {
            params.beginApprovalDate = $scope.queryOrderParams.approvalMinTime
        }
        if($scope.queryOrderParams.approvalMaxTime) {
            params.endApprovalDate = $scope.queryOrderParams.approvalMaxTime
        }
        if($scope.queryOrderParams.orderId) {
            params.orderCode = $scope.queryOrderParams.orderId
        }
        if($scope.queryOrderParams.orderPerson) {
            params.nickName = $scope.queryOrderParams.orderPerson
        }
        if($scope.queryOrderParams.costCenterId != -1) {
            params.costId = $scope.queryOrderParams.costCenterId
        }
        if($scope.approvalStatus != -1) {
            if($scope.approvalStatus == 3) {
                params.approvalStatusList = [3,4]
            }else {
                params.approvalStatus = $scope.approvalStatus
            }
        }
        $rootScope.ajax.postJson(url, params).then(res => {
            if(res.code == 0) {
                $scope.orderApprovalList = res.data.pageResult.listObj || []
                $scope.totalPage = Math.ceil(res.data.pageResult.total / $scope.pageSize)
                if($scope.totalPage <= 0) {
                    $scope.totalPage = 1
                }
                $scope.totalMoney = res.data.total
                $scope.currentMoney = res.data.currentTotal
                $scope.orderApprovalList.forEach(order => {
                    order.isSelected = false
                    if(order.approvalStatus == 0) {
                        order.approvalStatusName = "待审批"
                    }else if(order.approvalStatus == 1) {
                        order.approvalStatusName = "审批中"
                    }else if(order.approvalStatus == 2) {
                        order.approvalStatusName = "审批通过"
                    }else if(order.approvalStatus == 3) {
                        order.approvalStatusName = "审批拒绝"
                    }else if(order.approvalStatus == 4) {
                        order.approvalStatusName = "审批退回"
                    }
                    order.approvalDate = formatDateTime(new Date(order.approvalDate))
                })
                $scope.allCheck = false
            }else {
                $rootScope.error.checkCode(res.code, res.message)
            }
        })

    }

    //点击查询
    $scope.clickQuery = function() {
        $scope.currentPage = 1
        $scope.getOrderApprovalList()
    }

    //重置查询参数
    $scope.resetParams = function() {
        $scope.queryOrderParams = {
            orderMinTime: '',
            orderMaxTime: '',
            approvalMinTime: '',
            approvalMaxTime: '',
            orderId: '',
            orderPerson: '',
            costCenterId: -1
        }
    }

    //改变订单状态 2通过 3拒绝 4退回
    $scope.changeOrderStatus = function(order, newStatus) {
        const url = "/custom-sbd-web/approval/approveOrder.do"
        const params = {
            id: order.id,
            approvalStatus: newStatus
        }
        $rootScope.ajax.postJson(url, params).then(res => {
            if(res.code == 0) {
                $scope.getOrderApprovalList()
            }else {
                $rootScope.error.checkCode(res.code, $scope.i18n('系统异常'))
            }
        })
    }

    //批量通过/取消
    $scope.batchChangeOrderStatus = function(newStatus) {
        let orderList = $scope.orderApprovalList.filter(order => order.isSelected)
        let ids = orderList.map(order => order.id)
        const url = "/custom-sbd-web/approval/approveOrder.do"
        const params = {
            ids: ids,
            approvalStatus: newStatus
        }
        $rootScope.ajax.postJson(url, params).then(res => {
            if(res.code == 0) {
                $scope.getOrderApprovalList()
            }else {
                $rootScope.error.checkCode(res.code, $scope.i18n('系统异常'))
            }
        })
    }

    //点击全选
    $scope.changeAllCheck = function() {
        $scope.orderApprovalList.forEach(order => {
            order.isSelected = $scope.allCheck
        })
    }

    //选中审批单
    $scope.changeCheckBox = function() {
        $scope.allCheck = $scope.orderApprovalList.findIndex(order => !order.isSelected) == -1
    }

    //日期组件配置
    function getDatetimepickerOptions() {
        return {
            format:'Y-m-d',
            lang:'zh',
            timepickerScrollbar:false,
            timepicker:false,
            scrollInput:false,
            scrollMonth:false,
            scrollTime:false
        }
    }

    //Y-m-d
    function formatDate(date) {
        let year = date.getFullYear().toString()
        let month = (date.getMonth()+1).toString()//month是从0开始的
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

