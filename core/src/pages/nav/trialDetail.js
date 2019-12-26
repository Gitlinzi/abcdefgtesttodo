/**
 * Created by sindy on 15/11/4.
 */

appControllers.controller("trialDetailCtrl", ['$log', '$rootScope', '$scope', '$cookieStore', 'commonService', 'config', 'categoryService','$sce','$window',
    function ($log, $rootScope, $scope, $cookieStore, commonService, config, categoryService,$sce,$window) {
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
    $scope.toFreeTrial = function (mpId, activityId) {
        if (!_ut) {
            $rootScope.showLoginBox = true;
            return;
        }
        //校验用户是否符合活动的申请规则
        var url = _host + '/social/trialAppliced/queryUserAccordActivityRule',
            params = {
                activityId:activityId
            };
        _fnP(url, params).then(function (res) {
            if (res.code == 0) {
                if(res.data){
                    location.href = '/trialApply.html?mpId=' + mpId + '&activityId=' + activityId;
                }
                else{
                    _fnE($scope.i18n('提示'),res.desc);
                    return;
                }
            }
        }, function (res) {
            _fnE($scope.i18n('提示'), $scope.i18n('系统异常'));
        })

    };

    //初始化翻页
    $scope.initPagination = function () {
        $scope.pageNo = 1;
        $scope.pageSize = 5;
        $scope.totalCount = 0;
    };

    $scope.$on('changePageNo', function (event, data) {
        "use strict";
        $scope.pageNo = data;
        $scope.productReport.getProductReport();
    });

    //商品详情
    $scope.productDetail = {
        productInfo: null,
        limitNum: 0,
        crumbList: [],//面包屑
        getTrialDetail: function () {
            var url = _host + '/social/trialActivity/trialMpInfo.do',
                that = this,
                params = $rootScope.util.paramsFormat();
            $rootScope.ajax.postJson(url, params).then(function (res) {
                if (res.code == 0) {
                    that.getTotalLimit();
                    that.getData();
                    that.productInfo = res.data;
                    if (that.productInfo.categoryId){
                        that.crumbList = [];
                        that.getPreadCrumb(that.productInfo.categoryId);
                    }
                }
            }, function (res) {
                _fnE($scope.i18n('提示'), $scope.i18n('系统异常'));
            });
        },
        getData: function () {
            var url = _host +'/realTime/getTimestamp',
                params = {
                    clearCacheAddTimeStamp:new Date().getTime()
                };
            _fnG(url,params).then(function (res) {
                if(res.code == 0){
                    $scope.nowTime = res.data.timestamp;
                }
            })
        },

        toItemPage: function (itemId,seriesParentId) {
            location.href = "item.html?itemId=" + (seriesParentId || itemId);
        },
        getTotalLimit: function () {
            var url = _host + "/promotion/limitInfo",
                that = this,
                params = {
                    promotionIds:$rootScope.util.paramsFormat().activityId,
                    mpIds:$rootScope.util.paramsFormat().mpId
                };
            _fnG(url,params).then(function (res) {
                if (res.code == 0) {
                    that.limitNum = res.data[0].totalLimit;
                }
            }, function (res) {
                _fnE($scope.i18n('提示'), $scope.i18n('系统异常'));
            })
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


        // _getIteminfo: function (callback) {
        //     var url = $rootScope.host + '/product/baseInfo',
        //         that = this,
        //         params={
        //             mpId:$rootScope.util.paramsFormat().mpId,
        //         };
        //     $rootScope.ajax.postJson(url,params).then(function (res) {
        //         if(res.code == 0 && res.data !=null && res.data.length > 0){
        //             $scope.descUrl = res.data[0].pcDetailUrl;
        //             that._getProductDetail();
        //         }
        //     })
        // },

        // 获取商品文描信息
        _getProductDetail:function() {
            var url = '/back-product-web2/extra/merchantProduct/getMerchantProductDescriptionByMpId.do';
            var params = {
                mpId : $rootScope.util.paramsFormat().mpId,
                describeType : 1
            }
            $rootScope.ajax.get(url, params).then(function(res) {
                $scope.itemAttrlist = res.data.content;
            })
        }
    };
    // $scope.productDetail._getIteminfo();

    //临时函数:html安全转码
    $scope.toSafeHtml=function(html){
        return $sce.trustAsHtml(html);
    };


    //试用报告
    $scope.productReport = {
        showPage: false,
        showIcon: false,
        productReportList: null,
        getProductReport: function () {
            var url = _host+'/social/trialReport/trialReportList',
                that = this,
                params = {
                    mpId: $rootScope.util.paramsFormat().mpId,
                    pageNo: $scope.pageNo,
                    pageSize: $scope.pageSize,
                    status:4//试用报告状态，已发布
                };
            $rootScope.ajax.postJson(url, params).then(function (res) {
                that.productReportList = [];
                if (res.code == 0 && res.data !=null && res.data.listObj && res.data.listObj.length>0) {
                    that.productReportList = res.data.listObj;
                    angular.forEach(that.productReportList,function (val) {
                        val.deccodeVariables = JSON.parse(decodeURIComponent(val.variables));
                    });
                    $scope.totalCount = res.data.total;
                    $scope.totalPage = $scope.totalCount % $scope.pageSize == 0 ? (($scope.totalCount / $scope.pageSize) || 1) : parseInt($scope.totalCount / $scope.pageSize) + 1;
                    that.showPage = true;
                    that.showIcon = false;
                }
            }, function (res) {
                that.showPage = false;
                that.showIcon = true;
                _fnE($scope.i18n('提示'), $scope.i18n('系统异常'));
            });
        }
    };

    //试用商品详情tab

    $scope.$watch('activeNum', function (tab) {
        $scope.initPagination();
        if (tab == 0 || tab == 1) {
            $scope.productDetail.getTrialDetail();
        } else if (tab == 2) {
            $scope.productReport.getProductReport();
        }
    })
}]);
