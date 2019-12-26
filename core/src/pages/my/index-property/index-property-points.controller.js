/**
 * Created by Roy on 17/1/10.
 */
appControllers.controller('pointsCtrl', ["$scope", "$rootScope", "$cookieStore", "commonService", "$stateParams","$window",
    function ($scope, $rootScope, $cookieStore, commonService, $stateParams,$window) {
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
        $scope.pointList = null;//积分列表
        $scope.pointAds = [];//积分广告位
        $scope.activeNum = $stateParams.activeNum || 0;

        //初始化
        $scope.init = function (pointStatus) {
            "use strict";
            $scope.isShowIcon = false;//是否展示icon
            $scope.isShowPage = false;//是否展示分页
            $scope.pointStatus = pointStatus;
            $scope.initPagination();
            $scope.getPointList();
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
            $scope.getPointList();
        })
        //我的积分
        $scope.getPointList = function () {
            var that = this;
            that.pointList = [];

            $rootScope.ajax.post("/ouser-center/api/point/queryPointTransLogPage.do", {
                currentPage: $scope.pageNo,
                itemsPerPage: $scope.pageSize,
                actionType: $scope.pointStatus
            }).then(function (res) {
                if (res.code == 0 && res.data) {
                    $scope.totalCount = res.data.total;
                    $scope.totalPage = $scope.totalCount % $scope.pageSize == 0 ? (($scope.totalCount / $scope.pageSize) || 1) : parseInt($scope.totalCount / $scope.pageSize) + 1;
                    if (res.data.pointTransLogOutDTO != null && res.data.pointTransLogOutDTO.length > 0) {
                        that.pointList = res.data.pointTransLogOutDTO || [];
                        that.isShowPage = true;
                    } else {
                        that.isShowPage = false;
                        that.isShowIcon = true;
                    }
                } else {
                    that.isShowPage = false;
                    that.isShowIcon = true;
                    $rootScope.error.checkCode(res.code, res.message);
                }
            }, function (res) {
                that.isShowPage = false;
                that.isShowIcon = true;
                $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('获取积分异常'));
            })
        };

        $scope.getPointAccount = function () {
            $rootScope.ajax.post("/ouser-center/api/point/queryPointDetail.do", {}).then(function (res) {
                if (res.code == 0 && res.data) {
                    $scope.pointSum = res.data.balanceAccount;
                    $scope.pointFreezed = res.data.freezedAccount;
                } else {
                    $rootScope.error.checkCode(res.code, res.message);
                }
            }, function (res) {
                $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('获取积分异常'));
            })
        };

        //获取积分广告位
        $scope.getPointPage = function () {
            var that = this,
                url ='/ad-whale-web/dolphin/getAdSource',
                params = {
                    pageCode:'MyPoints_Page',
                    adCode:'points_instruction',
                    platform:1,
                    companyId:$rootScope.companyId
                };
            $rootScope.ajax.get(url,params).then(function (res) {
                if(res.code == 0 && !$.isEmptyObject(res.data)){
                    if(!$.isEmptyObject(res.data.points_instruction)){
                        that.pointAds = res.data.points_instruction;
                    }
                }else {
                    $rootScope.error.checkCode(res.code, res.message);
                }
            },function(){
                $rootScope.error.checkCode(res.code, res.message);
            })

        };

        $scope.$watch('activeNum', function (val) {

            $scope.init(val);
        });


    }]);
