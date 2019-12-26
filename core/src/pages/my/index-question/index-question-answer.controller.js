/**
 * Created by Roy on 17/6/29.
 */
'use strict';
angular.module('appControllers').controller('questionAnswerCtrl', ["$scope", "$rootScope", "$cookieStore", "commonService", 'categoryService', "validateService", "Upload", "$state", "$stateParams","$window",
    function ($scope, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload, $state, $stateParams,$window) {
        //国际化
        $scope.i18n = function (key) {
            return $window.i18n ? $window.i18n(key) : key;
        };
        //公共参数
        $scope.consultItemId = $stateParams.consultItemId;
        $scope.flag = $stateParams.flag;//查看和回答问题的标识
        var _ut = $rootScope.util.getUserToken();
        if(!_ut){
            $rootScope.showLoginBox = true;
            return;
        }
        $scope.isShowPage = false;
        $scope.isShowIcon = false;

        //初始化翻页
        $scope.initPagination = function () {
            $scope.pageNo = 1;
            $scope.pageSize = 10;
            $scope.totalCount = 0;
        };

        //翻页广播接收
        $scope.$on('changePageNo', function (event, data) {
            "use strict";
            $scope.pageNo = data;
            $scope.getQaDetailList();
        })

        $scope.getQaDetailList = function () {
            var url = "/api/social/consultAppAction/getQaDetailList.do";
            var params = {
                currentPage: $scope.pageNo,   //当前页码
                itemsPerPage: $scope.pageSize, //每页显示数量
                consultItemId: $scope.consultItemId,   //问题id
            }, that = this;
            $rootScope.ajax.postJson(url, params).then(function (res) {
                if (res.code == 0) {
                    if (!$.isEmptyObject(res.data)) {
                        $scope.answerDetail = res.data;
                        $scope.answerToQuestion.params.consultHeaderId = res.data.consultHeaderId;
                        $scope.mpId = res.data.merchantProductId;
                        $scope.totalCount = res.data.total;
                        $scope.totalPage = $scope.totalCount % $scope.pageSize == 0 ? (($scope.totalCount / $scope.pageSize) || 1) : parseInt($scope.totalCount / $scope.pageSize) + 1;
                        $scope.getBaseInfo();
                        // $scope.getEvaluationNum();
                        that.isShowPage = true;
                    } else {
                        that.isShowIcon = true;
                    }
                    that.isShowIcon = true;
                }else {
                    history.back();
                    $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('获取问答异常'));
                }
            }, function (res) {
                $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('获取问答异常'));
            });
        };

        $scope.getBaseInfo = function () {
            var url = '/back-product-web2/extra/merchantProduct/getMerchantProductBaseInfoById.do',
                params = {
                    mpId:$scope.mpId
                };
            $rootScope.ajax.postJson(url,params).then(function (res) {
                if (res.code == 0) {
                    if (!$.isEmptyObject(res.data)) {
                        $scope.baseInfo = res.data;
                        // 获取商品销量
                        $scope.getVolume4sale();
                    }
                }
            })
        };
        // 获取商品销量
        $scope.getVolume4sale = function () {
            var url = '/search/rest/getMpSaleNum.do';
            var params = {
                mpIds : $scope.mpId
            };
            $rootScope.ajax.get( url,params ).then( function (res) {
                if( res.code == 0 && res.data && res.data.dataList && res.data.dataList.length > 0 ) {
                    for( let i = 0 ; i < res.data.dataList.length ; i++ ) {
                        if( $scope.mpId == res.data.dataList[i].mpId ) {
                            $scope.baseInfo.checkVolume4sale = res.data.dataList[i].saleNum;
                        }
                    }
                }
            } )
        }
        // $scope.getEvaluationNum = function () {
        //     var url = $rootScope.host + "/social/mpComment/get",
        //         params = {
        //             companyId:$scope.companyId,
        //             mpId:$scope.mpId,
        //             pageNo:$scope.pageNo,
        //             pageSize:$scope.pageSize,
        //             hasPic: 0,//0全部1有图2无图
        //             rateFlag: 0
        //         };
        //     $rootScope.ajax.get(url,params).then(function (res) {
        //         if (res && res.code == 0 && res.data) {
        //             $scope.evaluationNum = res.data.ratingUserCount;
        //         }
        //     })
        // };


        //初始化操作, 这个方法在页面的ng-init里调用
        $scope.init = function () {
            "use strict";
            var that = this;
            that.isShowPage = false;
            that.isShowIcon = false;
            //初始化翻页
            $scope.initPagination();//初始化翻页
            $scope.getQaDetailList();

        };

        $scope.answerToQuestion = {
            isChecked: true,
            params: {
                consultItemId: $scope.consultItemId,
                consultHeaderId: '',
                content: '',
                isAnonymity: null
            },
            saveAnswer: function () {
                var that = this,
                    url = '/api/social/consultAppAction/answerTheConsult.do';
                if (that.isChecked) {
                    that.params.isAnonymity = 1
                } else {
                    that.params.isAnonymity = 0
                }
                $rootScope.ajax.postJson(url, that.params).then(function (res) {
                    if (res.code == 0) {
                        $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('回答成功'), {
                            type: 'info',
                        });
                        location.href = '#/questionList';
                    } else {
                        location.href = '#/questionList';
                    }
                }, function (res) {
                    $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('回答失败'));
                    location.href = '#/questionList';
                });
            }
        }
    }
])

