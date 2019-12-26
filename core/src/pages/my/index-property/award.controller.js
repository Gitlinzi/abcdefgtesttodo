/**
 * Created by Roy on 17/6/29.
 */
'use strict';
angular.module('appControllers').controller('awardCtrl', ["$scope", "$rootScope", "$cookieStore", "commonService", 'categoryService', "validateService", "Upload", "$stateParams","$window",
    function ($scope, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload, $stateParams,$window) {
        //国际化
        $scope.i18n = function (key) {
            return $window.i18n ? $window.i18n(key) : key;
        };
        var _ut = $rootScope.util.getUserToken();
        if (!_ut) {
            $rootScope.showLoginBox = true;
            return;
        };

        $scope.isShowIcon = false;//是否展示icon
        $scope.isShowPage = false;//是否展示分页
        $scope.activeNum = $stateParams.activeNum || 10;
        $scope.awardList = null;
        //初始化
        $scope.init = function (status) {
            "use strict";
            $scope.status = status;
            $scope.isShowIcon = false;//是否展示icon
            $scope.isShowPage = false;//是否展示分页
            $scope.initPagination();
            $scope.getAwardList();
        }

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
            $scope.getAwardList();
        })
        //我的奖品
        $scope.getAwardList = function () {
            var that = this,
                url = $rootScope.host + '/promotion/lottery/winningRecords',
                params = {
                    itemsPerPage:$scope.pageSize,
                    currentPage:$scope.pageNo,
                    status: $scope.status
                };
            $rootScope.ajax.get(url,params).then(function (res) {
                that.awardList = [];
                if (res.code == 0) {
                    if (res.data.listObj != null && res.data.listObj.length > 0) {
                        that.awardList = res.data.listObj || [];
                        $scope.totalCount = res.data.total;
                        $scope.totalPage = $scope.totalCount % $scope.pageSize == 0 ? (($scope.totalCount / $scope.pageSize) || 1) : parseInt($scope.totalCount / $scope.pageSize) + 1;
                        $scope.isShowPage = true;
                    } else {
                        that.isShowIcon = true;
                        that.isShowPage = false;
                    }
                } else {
                    that.isShowIcon = true;
                    that.isShowPage = false;
                }
            },function(){
                $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('获取奖品异常'));
            })
        };

        $scope.$watch('activeNum', function (val) {
            if (val == 10) {
                val = '';
            }
            $scope.init(val);
        });

        $scope.addCart = function (award) {
            if (award.awardsCategory != 1) {
                return;
            }
            var url = $rootScope.host + "/cart/addItem";
            var param = {
                companyId: $rootScope.companyId,
                mpId: award.awardsId,
                num: award.awardsNum,
                sessionId: $rootScope.sessionId,
                itemType:3,
                objectId:award.recordId,
                areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode

            };
            $rootScope.ajax.post(url, param).then(function (res) {
                if(res.code == 0){
                    $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n('加入') + $scope.i18n($rootScope.switchConfig.common.allCartBtnName) + $scope.i18n('成功'),{
                        type: 'confirm',
                        btnOKText:$scope.i18n('去') + $rootScope.switchConfig.common.allCartBtnName,
                        ok: function () {
                            location.href='cart.html';
                        }

                    });
                }else {
                    $rootScope.error.checkCode(res.data,res.message);
                }
            }, function (res) {
            })
        }
        $scope.close=function () {
            $scope.showSuccess = false;
        };

        $scope.awardStatus = {
            0:$scope.i18n('未领取'),
            1:$scope.i18n('已领取'),
            2:$scope.i18n('已失效')
        }

        $scope.nowTime = new Date().getTime();




    }]);
