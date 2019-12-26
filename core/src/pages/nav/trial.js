/**
 * Created by sindy on 15/11/4.
 */

appControllers.controller("trialCtrl", ['$log', '$rootScope', '$scope', '$cookieStore', 'commonService', 'config', '$anchorScroll','categoryService','$window',
    function ($log, $rootScope, $scope, $cookieStore, commonService, config, $anchorScroll,categoryService,$window) {
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
    $scope.trialTab = 1;
    var paramsUrl = $rootScope.util.paramsFormat();
    if (paramsUrl.trialTab) {
        $scope.trialTab = paramsUrl.trialTab;
    }
    //初始化翻页
    $scope.initPagination = function () {
        $scope.pageNo = 1;
        $scope.pageSize = 10;
        $scope.totalCount = 0;
    };

    $scope.$on('changePageNo', function (event, data) {
        "use strict";
        $scope.pageNo = data;
        if ($scope.trialTab == 1) {
            $scope.allTrial.getAllTrial();
        } else if ($scope.trialTab == 2) {
            $scope.trialReport.getReport();
        } else if ($scope.trialTab == 3) {
            $scope.myTrial.getMyAppliced();
            $scope.myTrial.getMyInfo();
        }
    });

    //全部试用活动
    $scope.allTrial = {
        showPage: false,
        showIcon: false,
        trialList: null,
        pageSize: 10,
        getAllTrial: function () {
            var url = _host + '/promotion/promotionProduct/list',
                that = this,
                params = {
                    isNeedTotal: 1,
                    status: 4,
                    promotionType: 16,
                    itemsPerPage: that.pageSize,
                    currentPage: $scope.pageNo,
                    isNeedRule: 1
                }
            ;
            _fnP(url, params).then(function (res) {
                that.trialList = [];
                if (res.code == 0 && res.data.listObj != null && res.data.listObj.length > 0) {
                    that.trialList = res.data.listObj;

                    angular.forEach(res.data.listObj, function (val) {
                        angular.forEach(val.merchantProducts, function (val2) {
                            var url = _host + '/social/trialAppliced/getTrialApplicedCount',
                                params = {
                                    activityId: val2.promotionId,
                                    mpId: val2.mpId
                                };
                            $rootScope.ajax.postJson(url, params).then(function (res) {
                                if (res.code == 0) {
                                    val2.applicedCount = res.data;
                                }
                            });
                        });
                        that.getData();
                    });
                    $scope.totalCount = res.data.total;
                    $scope.totalPage = $scope.totalCount % that.pageSize == 0 ? (($scope.totalCount / that.pageSize) || 1) : parseInt($scope.totalCount / that.pageSize) + 1;
                    that.showPage = true;
                    that.showIcon = false;
                } else {
                    that.showPage = false;
                    that.showIcon = true;
                }
            }, function (res) {
                that.showPage = false;
                that.showIcon = true;
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
        }
    };

    //试用报告
    $scope.trialReport = {
        showPage: false,
        showIcon: false,
        reportList: null,
        pageSize: 20,
        getReport: function () {
            var url = _host + '/social/trialReport/trialReportList',
                that = this,
                params = {
                    status: 4,//报告状态 0.待提交 1.待发布 2.已发布 默认传2
                    pageNo: $scope.pageNo,
                    pageSize: that.pageSize
                };
            $rootScope.ajax.postJson(url, params).then(function (res) {
                that.reportList = [];
                if (res.code == 0 && res.data.listObj != null && res.data.listObj.length > 0) {
                    that.reportList = res.data.listObj;
                    angular.forEach(that.reportList, function (val) {
                        val.deccodeVariables = JSON.parse(decodeURIComponent(val.variables));
                    });
                    $scope.totalCount = res.data.total;
                    $scope.totalPage = $scope.totalCount % that.pageSize == 0 ? (($scope.totalCount / that.pageSize) || 1) : parseInt($scope.totalCount / that.pageSize) + 1;
                    that.showPage = true;
                    that.showIcon = false;
                } else {
                    that.showPage = false;
                    that.showIcon = true;
                }
            });
        },

        toProductDetail: function (itemId) {
            location.href = "item.html?itemId=" + itemId;
        }
    };

    //我的试用
    $scope.myTrial = {
        showPage: false,
        showIcon: false,
        myTrialList: null,
        myInfo: null,
        statu: 0,//申请状态
        pageSize: 5,
        trialReportStatus: {
            0: $scope.i18n('待提交'),
            1: $scope.i18n('待提交'),
            2: $scope.i18n('待提交'),
            3: $scope.i18n('待发布'),
            4: $scope.i18n('已发布')
        },
        getMyAppliced: function () {
            var url = _host + '/social/trialAppliced/myAppliced',
                that = this,
                params = {
                    backFrontFlag: 0,//前后台标识 0：前台 1：后台
                    status: that.statu,
                    pageNo: $scope.pageNo,
                    pageSize: that.pageSize
                };
            that.showPage = false;
            that.showIcon = false;
            that.myTrialList = [];
            $rootScope.ajax.postJson(url, params).then(function (res) {
                if (res.code == 0 && res.data != null && res.data.listObj != null && res.data.listObj.length > 0) {
                    that.myTrialList = res.data.listObj;
                    $scope.totalCount = res.data.total;
                    $scope.totalPage = $scope.totalCount % that.pageSize == 0 ? (($scope.totalCount / that.pageSize) || 1) : parseInt($scope.totalCount / that.pageSize) + 1;
                    that.showPage = true;
                } else {
                    that.showPage = false;
                    that.showIcon = true;
                }
            }, function (res) {
                _fnE($scope.i18n('提示'), $scope.i18n('系统异常'));
            });
        },

        getMyInfo: function () {
            var url = _host + '/social/trialAppliced/getMyInfo',
                that = this,
                params = {
                };
            _fnP(url, params).then(function (res) {
                if (res.code == 0) {
                    that.myInfo = res.data;
                }
            }, function (res) {
                _fnE($scope.i18n('提示'), $scope.i18n('系统异常'));
            })
        }
    };

    $scope.$watch('trialTab', function (val) {
        $scope.initPagination();
        $anchorScroll();
        if (val == 1) {
            $scope.allTrial.getAllTrial();
        } else if (val == 2) {
            $scope.trialReport.getReport();
        } else if (val == 3) {
            $scope.$watch('myTrial.statu', function (val) {
                if (!_ut) {
                    $rootScope.showLoginBox = true;
                    return;
                }
                $scope.myTrial.getMyAppliced();
                $scope.myTrial.getMyInfo();
            });
        }
    });
}])
;
