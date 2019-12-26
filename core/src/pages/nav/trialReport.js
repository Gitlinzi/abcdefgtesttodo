/**
 * Created by sindy on 15/11/4.
 */

appControllers.controller("trialReportCtrl", ['$log', '$rootScope', '$scope', '$cookieStore', 'commonService', 'config','categoryService','$window',
    function ($log, $rootScope, $scope, $cookieStore, commonService, config,categoryService,$window) {
    //国际化
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
    var _ut = $rootScope.util.getUserToken(),
        _fnP = $rootScope.ajax.post,
        _fnG = $rootScope.ajax.get,
        _fnE = $rootScope.error.checkCode,
        _host = $rootScope.host,
        _cid = $rootScope.companyId;

    //默认省份与迷你购物车
    $rootScope.execute(true);

    $scope.initPagination = function () {
        $scope.pageNo = 1;
        $scope.pageSize = 5;
        $scope.totalCount = 0;
    };


    //试用报告详情
    $scope.reportDetail = {
        productInfo: null,
        showPage: false,
        showIcon: false,
        reportList: null,
        reportInfo:null,
        crumbList:[],
        getReportDetail: function () {
            var url = _host + '/social/trialReport/trialReportInfo',
                that = this,
                params = {
                    id: $rootScope.util.paramsFormat().trialReportId
                };
            $rootScope.ajax.postJson(url, params).then(function (res) {
                if (res.code == 0) {
                    that.reportInfo = res.data;
                    that.reportInfo.decodeVariables = JSON.parse(decodeURIComponent(that.reportInfo.variables));
                    $scope.mpId = that.reportInfo.mpId;
                    $scope.reportDetail.getReport();
                    if (that.reportInfo.categoryId){
                        that.crumbList = [];
                        $scope.reportDetail.getPreadCrumb(that.reportInfo.categoryId);
                    }
                }
            }, function (res) {
                _fnE($scope.i18n('提示'), $scope.i18n('系统异常'));
            });
        },

        getReport: function () {
            var url = _host + '/social/trialReport/trialReportList',
                that = this,
                params = {
                    status: 4,//报告状态 0.待提交 1.待发布 2.已发布 默认传2
                    mpId:$scope.mpId,
                    pageNo: $scope.pageNo,
                    pageSize: $scope.pageSize,
                    isReportPageDetail: 1//是试用报告详情页
                };
            $rootScope.ajax.postJson(url, params).then(function (res) {
                that.reportList = [];
                if (res.code == 0) {
                    that.reportList = res.data.listObj;
                    $scope.totalCount = res.data.total;
                    $scope.totalPage = $scope.totalCount % $scope.pageSize == 0 ? (($scope.totalCount / $scope.pageSize) || 1) : parseInt($scope.totalCount / $scope.pageSize) + 1;
                }
            }, function (res) {
                _fnE($scope.i18n('提示'), $scope.i18n('系统异常'));
            });
        },

        getPreadCrumb: function (categoryId) {
            var that = this;
            var url = '/back-product-web2/extra/category/listChildrenCategoryWithNologin.do',
                params = {
                    categoryIds : [categoryId]
                };
            $rootScope.ajax.postJson(url,params).then(function (res) {
                if (res.data  && res.data.length > 0 ) {
                    let categoryIdArr = res.data[0].fullIdPath.replace(/-/g, ',').split(',');
                    let categoryNameArr = res.data[0].fullNamePath.replace(/-/g,',').split(',');
                    if( categoryIdArr && categoryIdArr.length > 0 ) {
                        for( let o = 0 ; o < categoryIdArr.length ; o++ ) {
                            that.crumbList.push( { 'categoryId' : categoryIdArr[o] , 'categoryName' : categoryNameArr[o] } );
                        }
                    }
                }
            });

        },

        changePageNum: function (type) {
            //减
            if (type == 0) {
                if ($scope.pageNo > 1) {
                    $scope.pageNo--;
                    $scope.reportDetail.getReport();
                }
            }
            //加
            if (type == 1) {
                if ($scope.pageNo < $scope.totalPage) {
                    $scope.pageNo++;
                    $scope.reportDetail.getReport();
                }
            }
        },

        toItemPage:function (itemId) {
           location.href="item.html?itemId="+itemId;
        },


        init: function () {
            $scope.initPagination();
            $scope.reportDetail.getReportDetail();
        }
    };

    $scope.reportDetail.init();
}])
;
