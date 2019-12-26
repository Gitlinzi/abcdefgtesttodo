/**
 * Created by Roy on 17/6/29.
 */
'use strict';
angular.module('appControllers').controller('commentCtrl', ["$scope", "$stateParams", "$rootScope", "$cookieStore", "commonService", 'categoryService', "validateService", "Upload", "$window","allUrlApi",
    function ($scope, $stateParams, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload,$window,allUrlApi) {
        //国际化
        $scope.i18n = function (key) {
            return $window.i18n ? $window.i18n(key) : key;
        };
        //公共参数
        var code = $stateParams.code,
            _ut = $rootScope.util.getUserToken(),
            _fnE = $rootScope.error.checkCode,
            _host = $rootScope.host,
            _cid = $rootScope.companyId;

        if (!_ut) {
            $rootScope.showLoginBox = true;
            return;
        };
        //初始化翻页
        $scope.initPagination = function (activeNum) {
            $scope.activeNum = activeNum;
            $scope.pageNo = 1;
            $scope.pageSize = 10;
            $scope.totalCount = 0;
        };
        //翻页广播接收
        $scope.$on('changePageNo', function (event, data) {
            "use strict";
            $scope.pageNo = data;
            if ($scope.activeNum == 1) {
                $scope.canEvaluateOrder.getEvaluateOrders();
            } else if ($scope.activeNum == 2) {
                $scope.canEvaluateOrder.getAddAppraise();
            }
        })
        //评价列表
        $scope.canEvaluateOrder = {
            commonList: [],//待评价
            addAppraise: null,//可追评
            isShowPage: false,//是否展示分页
            isShowIcon: false,//是否展示icon
            keyword: '',
            //获取评价订单
            getEvaluateOrders: function (status) {
                var that = this;
                $rootScope.ajax.postFrom($rootScope.host + "/social/read/comment/myCommentList",{
                    status: status,//状态
                    pageNo: $scope.pageNo,
                    pageSize: $scope.pageSize
                }).then(function (res) {
                    that.commonList = [];
                    if (res.code == 0) {
                        if (res.data.commentList != null && res.data.commentList.length > 0) {
                            $scope.totalCount = res.data.totalCount;
                            $scope.totalPage = $scope.totalCount % $scope.pageSize == 0 ? (($scope.totalCount / $scope.pageSize) || 1) : parseInt($scope.totalCount / $scope.pageSize) + 1;
                            that.commonList = res.data.commentList;
                            that.isShowPage = true;
                            that.isShowIcon =false;
                        } else {
                            that.isShowPage = false;
                            that.isShowIcon = true;
                        }
                    } else {
                        that.isShowPage = false;
                        that.isShowIcon = true;
                    }
                },function(res){
                    that.isShowPage = false;
                    that.isShowIcon = true;
                    _fnE($scope.i18n('系统异常'), $scope.i18n('获取订单异常'));
                });
            },

            //获取追加评价商品
            getAddAppraise: function () {
                var  that = this;
                $rootScope.ajax.postFrom($rootScope.host + "/social/read/comment/myCommentList",{
                    status: 1,//可追加评价状态
                    pageNo: $scope.pageNo,
                    pageSize: $scope.pageSize
                }).then(function (res) {
                    that.addAppraise = [];
                    if (res.code == 0) {
                        if (res.data.commentList != null && res.data.commentList.length > 0) {
                            $scope.totalCount = res.data.totalCount;
                            $scope.totalPage = $scope.totalCount % $scope.pageSize == 0 ? (($scope.totalCount / $scope.pageSize) || 1) : parseInt($scope.totalCount / $scope.pageSize) + 1;
                            that.addAppraise = res.data.commentList;
                            that.isShowPage = true;
                            that.isShowIcon =false;
                        } else {
                            that.isShowPage = false;
                            that.isShowIcon = true;
                        }
                    } else {
                        that.isShowPage = false;
                        that.isShowIcon = true;
                    }
                },function(res){
                    that.isShowPage = false;
                    that.isShowIcon = true;
                    _fnE($scope.i18n('系统异常'), $scope.i18n('获取订单异常'));
                });
            },
            //初始化操作, 这个方法在页面的ng-init里调用
            init: function (activeNum) {
                "use strict";
                var that = this;
                that.isShowPage = false;
                that.isShowIcon = false;
                //初始化翻页

                if (activeNum === 1) {
                    $scope.initPagination(activeNum);
                    that.getEvaluateOrders(2);//获取可评价订单
                }else if(activeNum === 2){
                    $scope.initPagination(activeNum);
                    that.getEvaluateOrders(1);//获取可评价订单
                }

                
            }
        };

    }]);
