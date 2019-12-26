/**
 * Created by Roy on 17/6/29.
 */
'use strict';
angular.module('appControllers').controller('oftenBuyCtrl', ['$scope', '$rootScope', '$cookieStore', 'commonService', 'categoryService', 'validateService', 'Upload', '$state', '$stateParams','$window', function ($scope, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload, $state, $stateParams,$window) {
    //国际化
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
    $scope.ck = false;  //用于判断全选按钮的状态
        $scope.oftenBuyList = [];//用于存储数据接口返回的数据，当点击全选的时候让其处于选中状态
        //初始化翻页
        $scope.initPagination = function () {
            $scope.pageNo = 1;
            $scope.pageSize = 12;
            $scope.totalCount = 1;
        };


        $scope.getInventoryList=function(){
            var params={
                    pageSize:12,
                    pageNo:1,
            }
            $rootScope.ajax.post('/api/my/behavior/record', params).then(function (res) {
                if(res.code==0){
                    //$scope.oftenBuyList = res.data.data;
                }
            })
        }
        $scope.getInventoryList();

        //全选
        $scope.allChooseBtn=function(){
            $scope.ck=!$scope.ck
        }

        //单个加入购物车
        $scope.addShoppingCart=function(){
            $rootScope.ajax.postFrom($rootScope.host + "/cart/addItem",{
                mpId:mpId,
                num:1,
                sessionId:$cookieStore.get('sessionId'),
                areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
            }).then(function (res) {
                if (res.code == 0) {
                    $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('加入') + $scope.i18n($rootScope.switchConfig.common.allCartBtnName) + $scope.i18n('成功'), {
                        type: 'confirm',
                        ok: function () {
                            location.href = '/cart.html';
                        },
                        btnOKText: $scope.i18n('去结算')
                    });
                    $rootScope.$emit('updateMiniCartToParent');
                } else {
                    $rootScope.error.checkCode(res.code, res.message);
                }
            }, function (res) {
                 $rootScope.error.checkCode(res.code, res.message);
            });
        }
         //查看详情
        $scope.addShoppingCart = function (itemId) {
            location.href = "/item.html?itemId=" + itemId;
        }

        //批量加入购物车
        $scope.moreAddCart=function(){
            var skus = [];
            $.each($scope.oftenBuyList, function (k, v) {
                if (v.isChecked) {
                    var pro = {};
                    pro.mpId = v.mpId;
                    pro.num = 1;
                    skus.push(pro);
                }
            });
            $rootScope.ajax.postFrom($rootScope.host + "/cart/addItem",{
                skus:JSON.stringify(skus),
                areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
            }).then(function (res) {
                if (res.code == 0) {
                    $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('加入') + $scope.i18n($rootScope.switchConfig.common.allCartBtnName) + $scope.i18n('成功'), {
                        type: 'confirm',
                        ok: function () {
                            location.href = '/cart.html';
                        },
                        btnOKText: $scope.i18n('去结算')
                    });
                    $rootScope.$emit('updateMiniCartToParent');
                } else {
                    $rootScope.error.checkCode(res.code, res.message);
                }
            }, function (res) {
                 $rootScope.error.checkCode(res.code, res.message);
            });
        }
}]);
