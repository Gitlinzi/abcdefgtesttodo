/**
 * Created by Roy on 17/6/29.
 */
'use strict';
angular.module('appControllers').controller('favoriteGoodsCtrl', ["$scope", "$rootScope", "$cookieStore", "commonService", 'categoryService', "validateService", "Upload","$window",
    function ($scope, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload,$window) {
        //国际化
        $scope.i18n = function (key) {
            return $window.i18n ? $window.i18n(key) : key;
        };
        //公共参数
        var _ut = $rootScope.util.getUserToken();

        if (!_ut) {
            $rootScope.showLoginBox = true;
            return;
        };

        //数据定义
        $scope.data = {
            ut:$rootScope.util.getUserToken(),
            orderList:[],
            searchObj:{
                pageNo:1,
                pageSize:10,
                totalCount:0,
                totalPage:0
            },
            orderType:0,//订单类型:0 普通 1 生鲜类 2 服务类 3 虚拟’,
            loading:false,//是否加载中判断
        }

        $scope.getOrderList = function () {
            if($scope.data.loading) return;
            let url = $rootScope.host + '/my/order/list';
            $scope.data.loading = true;

            $rootScope.ajax.post(url, {
                companyId: $rootScope.companyId,//公司id
                orderStatus:0,//0:查询所有
                pageNo:$scope.data.searchObj.pageNo,
                pageSize:$scope.data.searchObj.pageSize,
                orderType:$scope.data.orderType,
                sysSourceList:'INTEGRAL_MALL'
            }).then(function (res) {
                if(res.code == 0) {
                    // $scope.userPointInfo = res.data;
                    $scope.data.orderList = res.data.orderList || [];
                    $scope.data.searchObj.totalCount = res.data.totalCount;
                    $scope.data.searchObj.totalPage = Math.ceil(res.data.totalCount / $scope.data.searchObj.pageSize);
                }else {
                    $rootScope.error.checkCode(res.code, res.message);
                }
                $scope.data.loading = false;
            }, function (res) {
                $scope.data.loading = false;
                $scope.sms.msg = $scope.i18n('系统故障');
            })
        }

        $scope.$on('changePageNo', function (event, data) {
            "use strict";
            $scope.data.searchObj.pageNo = data;
            $scope.getOrderList();
        });


        $scope.switchTab = function (orderType) {
            if($scope.data.orderType == orderType || $scope.data.loading){
                return;
            }
            $scope.data.orderType = orderType;
            $scope.data.searchObj.pageNo = 1;
            $scope.data.orderList = [];
            $scope.getOrderList();
        }
    }]);
