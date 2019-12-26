/**
 * Created by Roy on 17/6/29.
 */
'use strict';
angular.module('appControllers').controller('lookCommentCtrl', ["$scope", "$rootScope", "$cookieStore", "commonService", 'categoryService', "validateService", "Upload", "$stateParams","$window",
    function ($scope, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload, $stateParams,$window) {
        //国际化
        $scope.i18n = function (key) {
            return $window.i18n ? $window.i18n(key) : key;
        };
        var _ut = $rootScope.util.getUserToken(),
            orderCode = $stateParams.code,
            mpId = $stateParams.mpId,
            isOrder = $stateParams.isOrder;

        $scope.lookComment = {
            comment: null,//评价内容
            mpIds:[],
            allmproList: [],
            currentmpoList: [],
            mporderDetail: null,
            totalPage: 1,
            currentPageNo: 1,
            // 上一页
            upPage: function() {
                var that = this
                that.currentPageNo--
                if (that.currentPageNo < 1) {
                    that.currentPageNo = 1
                    return
                }
                let start = (that.currentPageNo-1)*4
                let end = start + 4
                that.currentmpoList = that.allmproList.slice(start,end)
            },
            // 下一页
            nextPage: function() {
                var that = this
                that.currentPageNo++
                if (that.currentPageNo > that.totalPage) {
                    that.currentPageNo = that.totalPage
                    return
                }
                let start = (that.currentPageNo-1)*4
                let end = start + 4
                that.currentmpoList = that.allmproList.slice(start,end)
            },
            // look: function () {
            //     var that = this,
            //         url = '',
            //         params = {};
                // if(isOrder){
                //     url = $rootScope.host + "/social/mpComment/get",
                //     params = {
                //         // companyId:$scope.companyId,
                //         pageNo:1,
                //         pageSize:10,
                //         hasPic: 0, //0全部1有图2无图
                //         rateFlag:0,
                //         orderCode:orderCode,
                //         commentSource:2
                //     };
                // }else {
                //     url = $rootScope.host + "/social/mpComment/get",
                //         params = {
                //             // companyId:$scope.companyId,
                //             mpId:mpId,
                //             pageNo:1,
                //             pageSize:10,
                //             hasPic: 0, //0全部1有图2无图
                //             rateFlag:0,
                //             orderCode:orderCode,
                //             commentSource:3
                //         }
                // }
                // $rootScope.ajax.get(url,params).then(function (res) {
                //     that.comment = [];
                //     if (res.code == 0 && res.data) {
                //         if (res.data.mpcList != null && !$.isEmptyObject(res.data.mpcList.listObj) && res.data.mpcList.listObj.length > 0) {
                //             that.comment = res.data.mpcList.listObj;
                //             angular.forEach(that.comment,function (val) {
                //                 that.mpIds.push(val.mpId);
                //             })
                //         }else {
                //             $rootScope.error.checkCode(res.code, res.message);
                //         }
                //         var url2 = $rootScope.host + '/realTime/getPriceStockList',
                //             params2 = {
                //                 mpIds: that.mpIds,
                //                 areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode: $rootScope.defaultAreasCode
                //         };
                //         $rootScope.ajax.get(url2,params2).then(function (res) {
                //             if (res.code == 0 && !$.isEmptyObject(res.data)) {
                //                     angular.forEach(res.data.plist, function (val) {
                //                         angular.forEach(that.comment, function (val2) {
                //                             if (val.mpId == val2.mpId) {
                //                                 val2.realPrice = val.availablePrice;
                //                             }
                //                         })
                //                     })

                //             }else {
                //                 $rootScope.error.checkCode(res.code, $scope.i18n('系统异常'));
                //             }
                //         }, function (res) {
                //             $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('获取实时库存价格异常'));
                //         })
                //     }
                // }, function (res) {
                //     $rootScope.error.checkCode($scope.i18n('系统异常'), res.message);
                // })
            // },
            // 查看评价详情
            getCommentDetail: function() {
                var that = this
                let url = '/api/social/mpComment/getOrderComment'
                let params = {
                    commentSource: 3,
                    hasPic: 0,
                    orderCode: orderCode,
                    pageNo: 1,
                    pageSize: 10,
                    rateFlag: 0
                }
                $rootScope.ajax.get(url,params).then(function(res){
                    if (res.code ==0) {
                        that.allmproList = res.data.mpcList.listObj[0].merchantProducts
                        that.currentmpoList = that.allmproList.slice(0,4)
                        that.mporderDetail = res.data.mpcList.listObj[0]
                        that.totalPage = Math.ceil(that.allmproList.length/4)
                    }
                })
            },
            // 初始化
            init: function() {
                let that = this
                that.getCommentDetail()
            }
        }
    }]);
