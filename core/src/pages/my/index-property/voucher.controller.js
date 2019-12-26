/**
 * Created by Roy on 17/6/29.
 */
'use strict';
angular.module('appControllers').controller('voucherCtrl', ["$scope", "$rootScope", "$cookieStore", "commonService", 'categoryService', "validateService", "Upload", "$stateParams","$window",
    function ($scope, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload,$stateParams,$window) {
        //国际化
        $scope.i18n = function (key) {
            return $window.i18n ? $window.i18n(key) : key;
        };
        $scope.activeNum = $stateParams.activeNum || 1;
        var _ut = $rootScope.util.getUserToken();
        if (!_ut) {
            $rootScope.showLoginBox = true;
            return;
        };
        $scope.isShowIcon = false;//是否展示icon
        $scope.isShowPage =false;//是否展示分页
        $scope.voucherList = null;
        $scope.tempCode = {
            currentCodeId : null
        };
        $scope.rebate = 0;
        $scope.give= 0;
        //初始化
        $scope.init = function (voucherType) {
            "use strict";
            $scope.isShowIcon = false;//是否展示icon
            $scope.isShowPage = false;//是否展示分页
            $scope.voucherType = voucherType;
            $scope.initPagination();
            $scope.getVoucherdList();
        }

        //初始化翻页
        $scope.initPagination = function () {
            $scope.pageNo = 1;
            $scope.pageSize = 9;
            $scope.totalCount = 0;
        };

        //翻页广播接收
        $scope.$on('changePageNo', function (event, data) {
            "use strict";
            $scope.pageNo = data;
            $scope.getVoucherdList();
        })
        //我的优惠码列表
        $scope.getVoucherdList = function () {
            var that = this,
                url = $rootScope.host + '/referralCode/list',
                params = {
                    type:$scope.voucherType,
                    currentPage:$scope.pageNo,
                    itemsPerPage:$scope.pageSize,
                    isNeedCount:true
                };
            $rootScope.ajax.get(url,params).then(function (res) {
                if (res.code == 0) {
                    that.voucherList=[];
                    if (res.data.listObj != null &&res.data.listObj.length>0 ) {
                        $scope.totalCount = res.data.total;
                        //全部
                        that.voucherList = res.data.listObj || [];
                        $scope.totalPage = $scope.totalCount % $scope.pageSize == 0 ? (($scope.totalCount / $scope.pageSize) || 1) : parseInt($scope.totalCount / $scope.pageSize) + 1;
                        $scope.isShowPage = true;
                    } else {
                        $scope.isShowIcon = true;
                    }
                } else {
                    $scope.isShowIcon = true;
                }
            },function(){
                $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('获取优惠码异常'));
            })
        };

        //保存优惠码
        $scope.saveCode = function (code) {
            if(!code){
                $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('请输入优惠码'));
                return;
            }

            $rootScope.ajax.post($rootScope.host + '/promotion/referralCode/receive', {
                type: 2,
                referralCode: code,
            }).then(function (res) {
                if (res.code == 0) {
                    $scope.activeNum = 1;
                    $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('添加成功'));
                } else {
                    $rootScope.error.checkCode(res.code, res.message);

                }
            }, function (res) {
                $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('添加优惠码失败'));
            })
        };


        $scope.getVoucherCount = function () {
            var url1 = $rootScope.host + '/referralCode/list',
                params1 = {
                    type:1,
                    currentPage:1,
                    itemsPerPage:10,
                    isNeedCount:true
                };
            $rootScope.ajax.get(url1,params1).then(function (res) {
                if (res.code == 0) {
                    if (res.data.listObj != null && res.data.listObj.length > 0) {
                        $scope.rebate = res.data.total;
                    }
                }
            },function(){
                $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('获取优惠码异常'));
            });
            var url2 = $rootScope.host + '/referralCode/list',
                params2 = {
                    type:2,
                    currentPage:1,
                    itemsPerPage:10,
                    isNeedCount:true
                };
            $rootScope.ajax.get(url2,params2).then(function (res) {
                if (res.code == 0) {
                    if (res.data.listObj != null && res.data.listObj.length > 0) {
                        $scope.give = res.data.total;
                    }
                }
            },function(){
                $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('获取优惠码异常'));
            })
        };
        $scope.getVoucherCount();

        $scope.$watch('activeNum',function (val) {
            $scope.init(val);
        })

    }]);
//复制功能
angular.module('appControllers').directive('copyBtn',['$window', function ($window) {
    return {
        scope: {
            copyText: '=',
            result: '=',
            currentCodeId:'='
        },
        link: function ($scope, elem) {
            //国际化
            $scope.i18n = function (key) {
                return $window.i18n ? $window.i18n(key) : key;
            };
            var clipboard = new Clipboard(elem[0], {
                text: function () {
                    return $scope.copyText;
                }
            });

            clipboard.on('success', function (e) {
                $scope.currentCodeId = $scope.copyText;
                $scope.result = $scope.i18n('复制成功');
                $scope.$apply();
            });

            clipboard.on('error', function (e) {
                $scope.result = $scope.i18n('复制失败');
                $scope.$apply();
            });

            $scope.$on("$destroy", function () {
                clipboard.destroy();
            })
        }
    }
}]);
