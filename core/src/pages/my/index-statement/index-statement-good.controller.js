'use strict';
angular.module('appControllers').controller('indexStatementGoodsCtrl', ["$scope", "$rootScope", "$cookieStore", "commonService", 'categoryService', "validateService", "Upload", "$state", "$stateParams","$window",
    function ($scope, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload, $state, $stateParams,$window) {
        $scope.isShowPage = false
        // 是否显示时间和类目检索
        $scope.queryFlag = false
        $scope.isNocategoryList = false
        $scope.categoryId = null
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
        $scope.chooseStartTime = function(){
            $scope.queryFlag = false
        }
        //初始化翻页, 切换tab的时候也会初始化分页
        $scope.initPagination = function () {
            $scope.pageNo = 1;
            $scope.pageSize = 10;
            $scope.totalCount = 0;
            $scope.isShowPage = false
        }
        //翻页广播接收
        $scope.$on('changePageNo', function (event, data) {
            "use strict";
            $scope.pageNo = data;
            $scope.getStatementGoods()
        })
        $scope.initPagination()
        $scope.statement = {
            startTime: '',
            endTime: '',
        }
        // 获取总类目树
        $scope.RootCategoryList = []
        $scope.getRootCategory = function() {
            var url = '/custom-sbd-web/form/query3BackCategory.do'
            var params = {
                level: 1,
                parentId: 0
            }
            $rootScope.ajax.postJson(url, params).then(function(res) {
                if (res.code ==0 && res.data) {
                    $scope.RootCategoryList = res.data
                    var item = $scope.RootCategoryList[0]
                    $scope.getFirstCategory(item)
                }
            })
        },
        $scope.getRootCategory()
        $scope.firstCategory = []
        $scope.isShowfirstCategory = false
        $scope.firstCategoryVal = ''
        // 显示影藏一级分类
        $scope.showfirstCategory = function() {
            $scope.isShowfirstCategory = !$scope.isShowfirstCategory
            // 二级和三级类目都隐藏
            $scope.isShowsecondCategory = false
            $scope.isShowthirdCategory = false
        }
        // 获取一级分类
        $scope.getFirstCategory = function(item) {
            var url = '/custom-sbd-web/form/query3BackCategory.do'
            var params = {
                level: 2,
                parentId: item.id,
            }
            $rootScope.ajax.postJson(url, params).then(function(res) {
                if (res.code ==0 && res.data) {
                    $scope.firstCategory = res.data || []
                }
            })
        }
        // 获取二级分类
        $scope.secondCategory = []
        // 多有的二级和三级分类
        $scope.allSecondCategory = []
        $scope.getSecondCategory = function(item) {
            $scope.queryFlag = false
            $scope.firstCategoryVal = item.name
            $scope.secondCategoryVal = ''
            $scope.thirdCategoryVal = ''
            $scope.isShowfirstCategory = false
            $scope.categoryId = item.id
            $scope.thirdCategory = []
            // var url = '/back-product-web2/extra/category/listChildrenCategoryWithNologin.do'
            var url = '/custom-sbd-web/form/query3BackCategory.do'
            var params = {
                parentId: item.id,
                level: 3
            }
            $rootScope.ajax.postJson(url, params).then(function(res) {
                if (res.code ==0 && res.data) {
                    // $scope.allSecondCategory = res.data
                    // angular.forEach(res.data,function(item) {
                    //     if (item.level == 3) {
                    //         $scope.secondCategory.push(item)
                    //     }
                    // })
                    $scope.secondCategory = res.data                   
                }
            })
        }
        // 显示二级分类
        $scope.isShowsecondCategory = false
        $scope.secondCategoryVal = ''
        $scope.showSecondCategory = function() {
            $scope.isShowsecondCategory = !$scope.isShowsecondCategory
            $scope.isShowfirstCategory = false
            $scope.isShowthirdCategory = false
        }
        // 获取三级类目
        $scope.thirdCategory = []
        $scope.getThidCategory = function(item) {
            // $scope.isShowthirdCategory = true
            $scope.queryFlag = false
            $scope.categoryId = item.id
            $scope.isShowsecondCategory = false
            $scope.thirdCategory = []
            $scope.secondCategoryVal = item.name
            $scope.thirdCategoryVal = ''
            var url = '/custom-sbd-web/form/query3BackCategory.do'
            var params = {
                level: 4,
                parentId: item.id
            }
            $rootScope.ajax.postJson(url, params).then(function(res) {
                if (res.code ==0 && res.data) {
                    $scope.thirdCategory = res.data || []
                }
            })
        }
        // 显示三级分类
        $scope.thirdCategoryVal = ''
        $scope.isShowthirdCategory = false
        $scope.showThirdCategory = function() {
            $scope.isShowthirdCategory = !$scope.isShowthirdCategory
            $scope.isShowsecondCategory = false
            $scope.isShowfirstCategory = false
        }
        $scope.getfouthCategory = function(item) {
            $scope.queryFlag = false
            $scope.isShowthirdCategory = false
            $scope.thirdCategoryVal = item.name
            $scope.categoryId = item.id
        }
        $scope.StatementGoodsList = []
        $scope.totalCount = null
        $scope.getStatementGoods = function() {
            var url = '/custom-sbd-web/form/queryProductSaleReportByUserId.do'
            var params = {
                pageNum: $scope.pageNo,
                pageSize: $scope.pageSize
            }
            if ($scope.queryFlag) {
                if ($scope.statement.startTime) {
                    params.orderCreateTimeStart = $scope.statement.startTime
                }
                if ($scope.statement.endTime) {
                    params.orderCreateTimeEnd = $scope.statement.endTime
                }
                if ($scope.categoryId) {
                    params.categoryId = $scope.categoryId
                }
            }           
            $rootScope.ajax.postJson(url,params).then(function(res) {
                if (res.code ==0 && res.data) {
                    if (res.data.list) {
                        $scope.isShowPage = true
                        $scope.isNocategoryList = false
                        $scope.StatementGoodsList = res.data.list || []
                        if ($scope.StatementGoodsList.length) {
                            $scope.totalCount = res.data.total
                            $scope.totalPage = $scope.totalCount % $scope.pageSize == 0 ? (($scope.totalCount / $scope.pageSize) || 1) : parseInt($scope.totalCount / $scope.pageSize) + 1;
                        } else {
                            $scope.isShowPage = false
                            $scope.isNocategoryList = true
                        }  
                    }          
                } else {
                    $scope.isShowPage = false
                    $scope.isNocategoryList = true
                }
            })
        }
        $scope.getStatementGoods()
        $scope.queryStatementGoods = function() {
            $scope.pageNo = 1
            $scope.queryFlag = true
            $scope.StatementGoodsList = []
            $scope.getStatementGoods()
        }
    }
])
;
