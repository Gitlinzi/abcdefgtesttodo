/**
 * Created by Roy on 18/4/**.
 */
angular.module('appControllers').controller('advanceOrderCtrl', ["$scope", "$rootScope", "$q", "$cookieStore", "commonService", 'categoryService', "validateService", "Upload", "$state", "$stateParams","$window", "$filter", "allUrlApi","$timeout",function ($scope, $rootScope, $q, $cookieStore, commonService, categoryService, validateService, Upload, $state, $stateParams,$window,$filter, allUrlApi,$timeout) {
    "use strict";
    //国际化
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
    var _ut = $rootScope.util.getUserToken();
    var _fnP = $rootScope.ajax.post,
        _fnG = $rootScope.ajax.get,
        _fnE = $rootScope.error.checkCode,
        _host = $rootScope.host,
        _home = $rootScope.home,
        _cid = $rootScope.companyId;

    //初始化翻页, 切换tab的时候也会初始化分页
    $scope.initPagination = function () {
        $scope.pageNo = 1;
        $scope.pageSize = 10;
        $scope.totalCount = 0;
        
    };
    //翻页广播接收
    $scope.$on('changePageNo', function (event, data) {
        "use strict";
        $scope.pageNo = data;
        $scope.advanceOrder.getOrderList();
    })
    $scope.initPagination();
    // 时间组件
    $scope.options1= {
        format:'Y-m-d',
        lang:'zh',
        timepickerScrollbar:false,
        timepicker:false,
        scrollInput:false,
        scrollMonth:false,
        scrollTime:false
    }
    $scope.options2= {
        format:'Y-m-d',
        lang:'zh',
        timepickerScrollbar:false,
        timepicker:false,
        scrollInput:false,
        scrollMonth:false,
        scrollTime:false
    };
    $scope.advanceOrder = {
        id: '',
        name :'',
        createTimeStart :'',
        createTimeEnd: '',
        advanceList:{},
        // 初始化操作
        init: function(){
            var that = this;
            that.getOrderList();
        },
        goto: function(){
            $rootScope.util.removeLocalItem('advanceData')
            location.href = '/home.html#/advanceCreateOrder';
        },
        getOrderList: function(data){
            "use strict";
            var that = this;
            var url = '/custom-sbd-web/sbdOrder/queryOrderTemplateList.do';
            var params = {};
            if(!data){
                params = {
                    offset: $scope.pageNo -1 ,
                    limit: $scope.pageSize,
                    id: '',
                    name: '',
                    createTimeStart: '',
                    createTimeEnd : '' ,
                }
            }else{
                $scope.pageNo = 1;
                params = {
                    offset: $scope.pageNo -1 ,
                    limit: $scope.pageSize,
                    id: that.id,
                    name: that.name,
                    createTimeStart: that.createTimeStart,
                    createTimeEnd : that.createTimeEnd ,
                }
            } 
            $rootScope.ajax.postJson(url, params).then(function (res) {
                if (res.code == 0 && res.result.listObj) {
                    that.advanceList = res.result.listObj;
                    $scope.totalCount = res.result.total;
                    $scope.totalPage = $scope.totalCount % $scope.pageSize == 0 ? (($scope.totalCount / $scope.pageSize) || 1) : parseInt($scope.totalCount / $scope.pageSize) + 1;
                }else{
                    _fnE($scope.i18n('提示'),$scope.i18n(res.result));
                }
            });
        },
        resetInfo: function(){
            "use strict";
            var that = this;
            that.id =  '';
            that.name = '';
            that.createTimeStart =' ';
            that.createTimeEnd = '';
        },
        delete: function(id){
            "use strict";
            var that = this;
            var arr = []
            arr.push(id)
            var url = '/custom-sbd-web/sbdOrder/deleteOrderTemplate';
            var params = {
                    ids: arr,
                }
            $rootScope.ajax.postJson(url, params).then(function (res) {
                if (res.code == 0) {
                    _fnE($scope.i18n('提示'),$scope.i18n('删除成功'));
                    that.getOrderList();
                }else{
                    _fnE($scope.i18n('提示'),$scope.i18n(res.result));
                }
            });
        },
        getAdvanceDetail: function (id) {
            "use strict";
            var that = this;
            var url = '/custom-sbd-web/sbdOrder/queryOrderTemplateDetail';
            var params = {
                    id: id,
                }
            $rootScope.ajax.postJson(url, params).then(function (res) {
                if (res.code == 0 && res.result) {
                //    $scope.items = res.result.items;
                    if(res.result.items){
                        $scope.goodsAmount = res.result.amount
                        that.tackOrder(res.result.items);
                    }else{
                        _fnE($scope.i18n('提示'),$scope.i18n('预置订单中暂无商品，无法完成下单'));
                    }
                }else{
                    _fnE($scope.i18n('提示'),$scope.i18n(res.message));
                }
            });
        },
        tackOrder: function(items){
            "use strict";
            var that = this;
            var skus = [];
            var goods = [];
            $scope.sysSource = 'ody';
            if(items.length>0){
                for(var i=0 ;i < items.length;i++){
                    skus.push({"mpId": items[i].mpid, "num": items[i].num, "itemType": items[i].mpType,"code": items[i].mpCode});
                    goods.push({"mpId": items[i].mpid, "num": items[i].num, "name": items[i].mpName,"price": items[i].price});
                }

                var url = '/custom-sbd-web/sbdCart/checkOrderLimit.do';
                var param = {
                    amount: $scope.goodsAmount,
                    productList: goods
                }

                $rootScope.ajax.postJson(url,param).then(function (res) {
                    if (res.code == 0 || res.code === '0') {
                        var params = {
                            provinceId: $rootScope.localProvince.province.provinceId,
                            companyId: $rootScope.companyId,
                            merchantId: $scope.merchantId,
                            platformId: $rootScope.platformId,
                            businessType : 7,
                            skus: JSON.stringify(skus),
                            sysSource:$scope.sysSource,
                            areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
                        }
                        $rootScope.ajax.postFrom($rootScope.host + "/checkout/initOrder",params).then(function (res) {
                            if (res.code == 0 || res.code === '0') {
                                localStorage.setItem('quickBuy', JSON.stringify(params));
                                location.href = 'settlement.html?q=1';
                            } else {
                                $rootScope.error.checkCode(res.code, res.message);
                            }
                        },function (err) {
                            $rootScope.error.checkCode(err.code, err.message);
                        });
                    }else{
                        $rootScope.error.checkCode(res.code, res.message);
                    }

                },function (err) {
                    $rootScope.error.checkCode(err.code, err.message);
                });

            }
        },
        // 导出
        exportPreOrder: function(url, params = {}, fileName = 'fileName.xlsx') {
            let leg = $rootScope.host.length - 4
            let baseUrl = $rootScope.host.slice(0,leg)
            url = url || baseUrl + '/custom-sbd-web/sbdOrder/exportPreOrder.do?ut=' + _ut  
            const downloadUrl = url
            try {
              const a = document.createElement('a')
              a.setAttribute('href', downloadUrl)
              a.setAttribute('download', fileName)
              $('body').append(a)
              a.click()
              $(a).remove()
            } catch (ex) {
            // 定义一个form表单,通过form表单来发送请求
              $('<form>')
                .attr('style', 'display:none')
                .attr('method', 'get')
                .attr('action', downloadUrl)
                .appendTo('body')
                .submit()// 表单提交
            }
            // return
          }
    }
}]);
