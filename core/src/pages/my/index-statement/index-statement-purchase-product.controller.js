/**
 * Created by Botao on 19/06/20
 */
'use strict';
angular.module('appControllers').controller('indexStatementPurchaseProductCtrl', ["$scope", "$rootScope", "$cookieStore", "commonService", 'categoryService', "validateService", "Upload", "$state", "$stateParams","$window", function ($scope, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload, $state, $stateParams,$window) {

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

    //成本中心列表
    $scope.costCenterList = []
    //商品类目列表
    $scope.categoryRootId = 0
    $scope.categoryList1 = []
    $scope.categoryList2 = []
    $scope.categoryList3 = []

    //-------所有查询条件参数-------
    //日期查询条件
    $scope.createTimeStart = ''
    $scope.createTimeEnd = ''
    //日期tab 0:无选中 1:昨天 7:近7天 30:近30天
    $scope.currentDateTab = 0
    //商品类目id -1全部
    $scope.category1 = -1
    $scope.category2 = -1
    $scope.category3 = -1
    //-------查询条件参数结束-------

    //报表数组
    $scope.purchaseInfoList = []

    //分页参数
    $scope.currentPage = 1 //当前页
    $scope.totalPage = 1 //总页数
    $scope.pageSize = 10 //单页显示条数

    $scope.init = function() {
        //翻页广播接收
        $scope.$on('changePageNo', function (event, data) {
            "use strict";
            $scope.currentPage = data;
            $scope.getPurchaseInfoList();
        })

        $scope.getCostCenterList()
        $scope.getCategoryList(1, 0)
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

    //获取类目树
    //@param level 类目等级 
    //@param parentId 父目录id
    //level=1 parentId=0 为查询父目录
    $scope.getCategoryList = function(level, parentId) {
        //清空之后目录列表
        if(level == 2) {
            $scope.categoryList2 = []
            $scope.categoryList3 = []
        }else if(level == 3) {
            $scope.categoryList3 = []
        }
        //父目录不能为'全部'
        if(parentId == -1) {
            return
        }
        const url = "/custom-sbd-web/form/query3BackCategory.do"
        const params = {
            level: level,
            parentId: parentId
        }
        $rootScope.ajax.postJson(url, params).then(res => {
            if(res.code == 0) {
                if(level == 1) {
                    let rootId = res.data[0].id
                    $scope.getCategoryList(2, rootId)
                }else if(level == 2) {
                    $scope.categoryList1 = res.data
                }else if(level == 3) {
                    $scope.categoryList2 = res.data
                }else if(level == 4) {
                    $scope.categoryList3 = res.data
                }
            }else {
                $rootScope.error.checkCode(res.code, $scope.i18n('系统异常'))
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
        $scope.category1 = -1
        $scope.category2 = -1
        $scope.category3 = -1
        $scope.categoryList2 = []
        $scope.categoryList3 = []
        $scope.costCenterList.forEach(cost => {
            cost.checked = false
        })
    }

    //点击下载
    $scope.clickDownload = function() {
        let url = "/custom-sbd-web/report/exportPurchaseInfoMp.do?"
        let queryContent = {
            createTimeStart: $scope.createTimeStart,
            createTimeEnd: $scope.createTimeEnd
        }
        let centerIdList = $scope.costCenterList.filter(c => c.checked).map(c => c.id)
        if(centerIdList) {
            queryContent.centerIdList = centerIdList
        }
        if($scope.category1 != -1) {
            queryContent.firstCategory = $scope.category1
        }
        if($scope.category2 != -1) {
            queryContent.secondCategory = $scope.category2
        }
        if($scope.category3 != -1) {
            queryContent.thirdCategory = $scope.category3
        }
        queryContent = JSON.stringify(queryContent)
        url += 'queryContent=' + encodeURIComponent(queryContent)
        
        var form=$("<form>");//定义一个form表单
        form.attr("style","display:none");
        form.attr("target","");
        form.attr("method","post");//请求类型
        form.attr("action",url);//请求地址
        $("body").append(form);//将表单放置在web中
        form.submit();//表单提交
        
        // window.open(url)
    }

    //获取报表信息
    $scope.getPurchaseInfoList = function() {
        const url = "/custom-sbd-web/report/purchaseInfoMp.do"
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
        if($scope.category1 != -1) {
            params.firstCategory = $scope.category1
        }
        if($scope.category2 != -1) {
            params.secondCategory = $scope.category2
        }
        if($scope.category3 != -1) {
            params.thirdCategory = $scope.category3
        }
        $rootScope.ajax.postJson(url, params).then(res => {
            if(res.code == 0) {
                $scope.purchaseInfoList = res.data.listObj || []
                $scope.purchaseInfoList.forEach(info => {
                    let categoryArr = info.fullNamePath.split('-')
                    info.firstCategory = categoryArr[1]
                    info.secondCategory = categoryArr[2]
                    info.thirdCategory = categoryArr[3]
                })
                $scope.totalPage = Math.ceil(res.data.total / $scope.pageSize)
            }else {
                $rootScope.error.checkCode(res.code, res.message)
            }
        })
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

    $scope.init()

}]);

