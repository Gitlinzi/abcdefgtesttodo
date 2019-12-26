/**
 * Created by Roy on 17/6/29.
 */
'use strict';
angular.module('appControllers').controller('questionCtrl', ["$scope", "$rootScope", "$cookieStore", "commonService", 'categoryService', "validateService", "Upload", "$state", "$stateParams","$window",
    function ($scope, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload, $state, $stateParams,$window) {
        //国际化
        $scope.i18n = function (key) {
            return $window.i18n ? $window.i18n(key) : key;
        };
        //公共参数
        $scope.isShowPage = false;
        $scope.isShowIcon = false;
        var _ut = $rootScope.util.getUserToken();
        if (!_ut) {
            $rootScope.showLoginBox = true;
            return;
        };

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
            // $scope.getOwnerQaList();//原有
            $scope.getAnswer();//后加
        })

        $scope.getOwnerQaList = function () {
            var url = "/api/social/consultAppAction/getOwnerConsultAndQaList.do";
            var params = {
                currentPage: $scope.pageNo,   //当前页码
                itemsPerPage: $scope.pageSize, //每页显示数量
                headerType: 1,   // 0=咨询，1=问答
                qaType: 0,     // 0=我的提问，1=问答，2=待回答，
            }, that = this;
            $rootScope.ajax.postJson(url, params).then(function (res) {
                if (res.code == 0) {
                    if (res.data.listObj != null && res.data.listObj.length > 0) {
                        $scope.qaText = res.data.listObj;
                        // $scope.totalCount = res.data.total;
                        // $scope.totalPage = $scope.totalCount % $scope.pageSize == 0 ? (($scope.totalCount / $scope.pageSize) || 1) : parseInt($scope.totalCount / $scope.pageSize) + 1;
                        // that.isShowPage = true;
                        // $scope.isHidden = false;原有
                    } else {
                        that.isShowPage = false;
                        that.isShowIcon = true;
                    }
                } else {
                    that.isShowPage = false;
                    that.isShowIcon = true;
                }
            }, function (res) {
                $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('获取问答异常'));
            });
        };


        $scope.getAnswer = function () {
            $scope.answer = [];
            var url = "/api/social/consultAppAction/getToAnswerlist.do";
            var params = {
                currentPage: $scope.pageNo,   //当前页码
                itemsPerPage: $scope.pageSize, //每页显示数量
                headerType: 1,   // 0=咨询，1=问答
                userIsAnsweredFlag:null,     //0 待回答列表，1 已回答列表,默认是待回答列表
            }, that = this;
            if($scope.type == 1){//已回答列表
                params.userIsAnsweredFlag = 1;
            }else if($scope.type == 2){//待回答列表
                params.userIsAnsweredFlag = 0;
            }
            $rootScope.ajax.postJson(url, params).then(function (res) {
                if (res.code == 0&&res.data.listObj != null && res.data.listObj.length > 0) {
                        $scope.answer=res.data.listObj;

                        $scope.totalCount = res.data.total;//后加
                        $scope.totalPage = $scope.totalCount % $scope.pageSize == 0 ? (($scope.totalCount / $scope.pageSize) || 1) : parseInt($scope.totalCount / $scope.pageSize) + 1;
                        that.isShowPage = true;
                        $scope.isHidden = false;
                } else {
                    that.isShowPage = false;
                    that.isShowIcon = true;
                }
            }, function (res) {
                $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('获取问答异常'));
            });
        };

        //初始化操作, 这个方法在页面的ng-init里调用
        $scope.init = function (type) {
            "use strict";
            var that = this;
            $scope.isShowPage = false;
            $scope.isShowIcon = false;
            $scope.type = type;
            //初始化翻页
            $scope.initPagination();//初始化翻页
            if (type == 0) {
                $scope.getOwnerQaList();
            }
            else {
                $scope.getAnswer();
            }
        };

        $scope.$watch('activeNum', function (val) {
            $scope.init(val || 0);
        });


    }
])
;
