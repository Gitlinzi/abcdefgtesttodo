/**
 * Created by Roy on 17/1/5.
 */
angular.module('appControllers').controller('advanceDetailOrderCtrl', ["$scope", "$rootScope", "$q", "$cookieStore", "commonService", 'categoryService', "validateService", "Upload", "$state", "$stateParams","$window", "$filter", "allUrlApi","$timeout",function ($scope, $rootScope, $q, $cookieStore, commonService, categoryService, validateService, Upload, $state, $stateParams,$window,$filter, allUrlApi,$timeout) {
    "use strict";
    //国际化
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
    $scope.id=$stateParams.id;//预置订单号
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
        },{
            itemId1:'',
            num1:1,
            itemId2:'',
            num2:1,
            itemId3:'',
            num3:1,
        }
    ];
    // 重置
    $scope.reset = function () {
        // $scope.createInfo = {
        //     name: '',
        //     describe:''
        // };
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
    $scope.advanceDetailOrder = {
        totalMoney: 0,
        // 初始化操作
        init: function(){
            var that = this;
            that.getAdvanceDetail();
        },
        getAdvanceDetail: function () {
            "use strict";
            var that = this;
            var url = '/custom-sbd-web/sbdOrder/queryOrderTemplateDetail';
            var params = {
                    id: $scope.id,
                }
            $rootScope.ajax.postJson(url, params).then(function (res) {
                if (res.code == 0) {
                    $scope.getAdvanceDetailInfo = res.result || [];
                    $scope.createInfo = {
                        name: res.result.name,
                        describe: res.result.remark 
                    };
                    that.totalMoney1();
                }else{
                    _fnE($scope.i18n('提示'),$scope.i18n(res.message));
                }
            });
        },
        // 总金额计算
        totalMoney1: function(){
            var that = this;
            that.totalMoney = 0;
            angular.forEach($scope.getAdvanceDetailInfo.items,function(q){
                that.totalMoney += q.price * q.num;
            });
        },
        save : function(data){
            "use strict";
            var that = this;
            var url = '/custom-sbd-web/sbdOrder/updateOrderTemplate.do';
            var list = [];
            // 添加商品循环
            for(var i = 0;i<$scope.line.length;i++){
                if($scope.line[i].itemId1 && $scope.line[i].num1 > 0){
                    var list1 = {
                        mpCode:$scope.line[i].itemId1,
                        num:$scope.line[i].num1
                    }
                    list.push(list1);
                }
                if($scope.line[i].itemId2 && $scope.line[i].num2 > 0){
                    var list1 = {
                        mpCode:$scope.line[i].itemId2,
                        num:$scope.line[i].num2
                    }
                    list.push(list1);
                }
                if($scope.line[i].itemId3 && $scope.line[i].num3 > 0){
                    var list1 = {
                        mpCode:$scope.line[i].itemId3,
                        num:$scope.line[i].num3
                    }
                    list.push(list1);
                } 
            }
            //修改商品数量循环
            angular.forEach(  $scope.getAdvanceDetailInfo.items , function( q,i ) {
                var list1 = {
                    mpCode:q.mpCode,
                    num:q.num
                }
                list.push(list1);
            } )
            var params = {
                    id: $scope.id,
                    name: $scope.createInfo.name,
                    remark: $scope.createInfo.describe,
                    items:list
                }
            $rootScope.ajax.postJson(url, params).then(function (res) {
                if (res.code == 0) {
                    if(!data){
                        _fnE($scope.i18n('提示'),$scope.i18n('修改成功'));
                    }
                    // history.back()
                    $scope.reset();
                    that.getAdvanceDetail();
                }else{
                    _fnE($scope.i18n('提示'),$scope.i18n(res.result));
                }
            });
        },
        delete: function(merchantProductCode ){
            "use strict";
            var that = this;
            var url = '/custom-sbd-web/sbdOrder/deleteOrderTemplate';
            var params = {
                    id: $scope.id,
                    merchantProductCode: merchantProductCode,
                }
            $rootScope.ajax.postJson(url, params).then(function (res) {
                if (res.code == 0) {
                    _fnE($scope.i18n('提示'),$scope.i18n('删除成功'));
                    // history.back()
                    $scope.advanceDetailOrder.getAdvanceDetail();
                }else{
                    _fnE($scope.i18n('提示'),$scope.i18n(res.result));
                }
            });
        },
        addOrSub: function(symbol,index){
            if(symbol == 'add'){
                $scope.getAdvanceDetailInfo.items[index].num ++; 
            }else{
                $scope.getAdvanceDetailInfo.items[index].num --;  
            }
            this.totalMoney1();
            // this.save('1');
        },
    };
}]);
