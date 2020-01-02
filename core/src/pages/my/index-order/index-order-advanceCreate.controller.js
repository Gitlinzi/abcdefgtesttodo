/**
 * Created by Roy on 17/1/5.
 */
angular.module('appControllers').controller('advanceCreateOrderCtrl', ["$scope", "$rootScope", "$q", "$cookieStore", "commonService", 'categoryService', "validateService", "Upload", "$state", "$stateParams","$window", "$filter", "allUrlApi","$timeout",function ($scope, $rootScope, $q, $cookieStore, commonService, categoryService, validateService, Upload, $state, $stateParams,$window,$filter, allUrlApi,$timeout) {
    //国际化
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
    let urlParams = $rootScope.util.paramsFormat(location.hash)
    let advanceData = $rootScope.util.getLocalItem('advanceData')

    // 商详页跳转过来需要回显商品编码
    $scope.proCode = urlParams.code
    // 商详页跳转过来需要回显商品数量
    $scope.proNum = +urlParams.num

    var _ut = $rootScope.util.getUserToken();
    var _fnP = $rootScope.ajax.post,
        _fnG = $rootScope.ajax.get,
        _fnE = $rootScope.error.checkCode,
        _host = $rootScope.host,
        _home = $rootScope.home,
        _cid = $rootScope.companyId;
    // 添加预置订单信息
    $scope.createInfo = {
        name: '',
        describe:''
    };
    // 一行代表一个shopInfo1
    $scope.newLine = {
        itemId1:'',
        num1:1,
        itemId2:'',
        num2:1,
        itemId3:'',
        num3:1,
    };
    $scope.line = [
        {
            itemId1: $scope.proCode || '',
            num1: $scope.proNum || 1,
            itemId2:'',
            num2:1,
            itemId3:'',
            num3:1,
        },{
            itemId1:'',
            num1:1,
            itemId2:'',
            num2:1,
            itemId3:'',
            num3:1,
        },{
            itemId1:'',
            num1:1,
            itemId2:'',
            num2:1,
            itemId3:'',
            num3:1,
        }
    ];

    if (!$scope.proCode && advanceData) {
        $scope.line = advanceData
    }

    // 重置
    $scope.reset = function () {
        $scope.createInfo = {
            name: '',
            describe:''
        };
        angular.forEach($scope.line, function (info,i) {
            $scope.line[i] = {
                itemId1:'',
                num1:1,
                itemId2:'',
                num2:1,
                itemId3:'',
                num3:1,
            }
        });

        $rootScope.util.removeLocalItem('advanceData')
    };
    // 添加更多
    $scope.addLine = function () {
        $scope.line.push({
            itemId1:'',
            num1:1,
            itemId2:'',
            num2:1,
            itemId3:'',
            num3:1
        });
    }
    // 提交
    $scope.save = function () {
        "use strict";
        if(!$scope.createInfo.name){
            _fnE($scope.i18n('提示'), $scope.i18n('请输入预置订单名称'));
            return;
        }
        var list = [];
        var tip = true;
        for(var i = 0;i<$scope.line.length;i++){
            if($scope.line[i].itemId1 && $scope.line[i].num1 > 0){
                var list1 = {
                    mpCode:$scope.line[i].itemId1,
                    num:$scope.line[i].num1
                }
                list.push(list1);
                tip = false;
            }
            if($scope.line[i].itemId2 && $scope.line[i].num2 > 0){
                var list1 = {
                    mpCode:$scope.line[i].itemId2,
                    num:$scope.line[i].num2
                }
                list.push(list1);
                tip = false;
            }
            if($scope.line[i].itemId3 && $scope.line[i].num3 > 0){
                var list1 = {
                    mpCode:$scope.line[i].itemId3,
                    num:$scope.line[i].num3
                }
                list.push(list1);
                tip = false;
            } 
        }
        if(tip){
            _fnE($scope.i18n('提示'), $scope.i18n('请输入商品编码和数量'));
            return;
        }
        var url = '/custom-sbd-web/sbdOrder/insertSoTemplate.do',
            params = {
                name: $scope.createInfo.name,
                remark: $scope.createInfo.describe,
                items: list,
            },
            that = this;
        $rootScope.ajax.postJson(url, params).then(function (res) {
            if(res.code == 0){
                _fnE($scope.i18n('提示'), $scope.i18n('创建预置订单成功！'));
                $scope.reset();
                $rootScope.$emit('updateMiniCartToParent');
            }else{
                _fnE($scope.i18n('提示'), $scope.i18n(res.message));
            }  
        }, function (res) {
            _fnE($scope.i18n('系统异常'), $scope.i18n('系统异常'));
        })
    };
}]);
