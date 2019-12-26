/**
 * Created by Roy on 17/6/29.
 */
'use strict';
angular.module('appControllers').controller('favoriteStoreCtrl', ["$scope", "$rootScope", "$cookieStore", "commonService", 'categoryService', "validateService", "Upload","$window",
    function ($scope, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload,$window) {
        //国际化
        $scope.i18n = function (key) {
            return $window.i18n ? $window.i18n(key) : key;
        };
        //公共参数
        var _host = $rootScope.host,
            _ut = $rootScope.util.getUserToken();
        $scope.isShowIcon = true;
        $scope.isTitleText = false;
        $scope.footList = null;
        $scope.ck = false;
        $scope.mpIds = null ;


        $scope.checkAll = function () {
            angular.forEach($scope.footList,function (val) {
                $.each(val.values, function (k, v) {
                    v.isChecked = $scope.ck;
                })
            })

        }


        $scope.init = function () {
            "use strict";
            $scope.initPagination();
            $scope.getFootList();
        };

        //初始化翻页
        $scope.initPagination = function () {
            $scope.pageNo = 1;
            $scope.pageSize = 10;
            $scope.totalPage = 0;
            $scope.totalCount = 0;
        };

        //翻页广播接收
        $scope.$on('changePageNo', function (event, data) {
            "use strict";
            $scope.pageNo = data;
            $scope.getFootList();
        })

        $scope.footList=[];
        $scope.getFootList = function (pageNo,scroll) {
            var that =this;
            if (_ut ==  undefined || _ut == null || _ut=='') {
                $rootScope.showLoginBox = true;
                return;
            }else {
                var config = {
                    platformId: 2,
                    pageNo: $scope.pageNo,
                    pageSize: $scope.pageSize,
                    clearCacheAddTimeStamp: new Date().getTime()
                };
                //1.第一页数据，按日期分组 goodsList
                //2.第二页数据，日期已存在 push进goodsList
                if(scroll){
                    config.pageNo = pageNo;
                }
                $rootScope.ajax.get(_host + '/my/foot/list', config).then(function (res) {
                    that.mpIds = [];
                    if (res.code == 0) {
                        if (res.data.data.length > 0) {
                            $scope.isShowIcon = false;
                            if (scroll) {
                                $.each(res.data.data,function(key3,val3){
                                    var flag = false;
                                    val3.values.forEach(function (v1, i1) {
                                        v1.isChecked = false;
                                        that.mpIds.push(v1.mpId);
                                    })
                                    $.each($scope.footList,function (key4,gl) {
                                        if(gl.name == val3.name){
                                            flag = true;
                                            gl.values = gl.values.concat(val3.values);
                                            return false;
                                        }else {
                                            flag = false;
                                        }
                                    })
                                    if(!flag){
                                        $scope.footList.push(val3);
                                    }
                                })
                            } else {
                                $scope.totalCount = res.data.totalCount;
                                $scope.totalPage = $scope.totalCount % $scope.pageSize == 0 ? (($scope.totalCount / $scope.pageSize) || 1) : parseInt($scope.totalCount / $scope.pageSize) + 1;
                                $scope.footList = res.data.data;
                                res.data.data.forEach(function (v, i) {
                                    v.values.forEach(function (v2, i2) {
                                        v2.isChecked = false;
                                        that.mpIds.push(v2.mpId);
                                    })
                                })
                            }

                            $rootScope.ajax.get(_host + '/realTime/getPriceStockList', {mpIds: $scope.mpIds,
                                areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode: $rootScope.defaultAreasCode}).then(function (res) {
                                if (res.code == 0) {
                                    if (!$.isEmptyObject(res.data)) {
                                        angular.forEach(res.data.plist, function (val2) {
                                            angular.forEach($scope.footList, function (val3) {
                                                angular.forEach(val3.values, function (val4) {
                                                    if (val2.mpId == val4.mpId) {
                                                        val4.realPrice = val2.availablePrice;
                                                        val4.realNum = val2.stockNum;
                                                        val4.realNumText = val2.stockText;
                                                    }
                                                });
                                            });
                                        });
                                    }
                                } else {
                                    $scope;
                                    $rootScope.error.checkCode(res.code, res.message);
                                }
                            },function(){
                                //$scope.isShowIcon = true;
                                $scope.isShowPage = false;
                                $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('获取实时库存价格异常'));
                            })

                        }
                    } else {
                        // $scope.isShowIcon = true;
                        $rootScope.error.checkCode(res.code, res.message);
                    }
                },function(res){
                    $scope.isShowIcon = true;
                    $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('获取足迹异常'));
                })
         }
        };

        $scope.cancelFav = function (item) {
            item.isChecked = false;
            angular.forEach($scope.footList,function (val) {
                var arr = val.values.filter(function (vv) {
                    return vv.isChecked
                });
                if (arr.length == val.length) {
                    $scope.ck = true;
                } else {
                    $scope.ck = false;
                }
            })

        };

        $scope.deleteFootList = function (ids) {
            var url = _host+'/my/foot/delete';
            var params = {
                companyId: this.companyId,
                mpIds: ids
            };
            $rootScope.ajax.post(url, params).then(function (res) {
                if (res.code == 0) {
                    $scope.init();
                    $scope.footList=[];
                    $scope.ck = false;
                } else {
                    $rootScope.error.checkCode(res.code, res.message);
                }
            }, function (res) {
            })

        }

        //批量执行删除
        $scope.batchDeleteFootList = function () {
            var ids = [];
            angular.forEach($scope.footList,function (val) {
                $.each(val.values, function (k, v) {
                    if (v.isChecked) {
                        ids.push(v.mpId);
                    }
                });
            })

            ids = ids.join();
            if(ids.length >0){
                $scope.deleteFootList(ids);
            }else {
                $rootScope.error.checkCode($scope.i18n('确定'),$scope.i18n('请选择商品'));
            }
        }

    // $(window).scroll(function() {
    //     var this_scrollTop = $(this).scrollTop() + $(this).height() ;
    //     var top_mainHeight = $('.history').height();
    //     var top_bannerHeight = $('.custom-header').height()
    //     var totalHeight = top_mainHeight + top_bannerHeight;
    //     if( this_scrollTop >= totalHeight ) {
    //         if( $scope.pageNo < $scope.totalPage ) {
    //             $scope.pageNo++;
    //             $scope.getFootList();
    //         }
    //     }
    // })
        $rootScope.scrollLoading({
            triggerHeight: 1000, callback: function () {
                if ($scope.pageNo < $scope.totalPage) {
                    $scope.pageNo++;
                    $scope.getFootList($scope.pageNo,true);
                }
            }
        });
        //今天昨天前天
}])
