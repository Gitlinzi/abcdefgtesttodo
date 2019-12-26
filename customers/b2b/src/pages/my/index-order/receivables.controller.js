/**
 * Created by Roy on 17/6/29.
 */
'use strict';
angular.module('appControllers').controller('receivablesCtrl', ['$scope', '$rootScope', '$cookieStore', 'commonService', 'categoryService', 'validateService', 'Upload', '$state', '$stateParams', function ($scope, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload, $state, $stateParams) {
    var _ut = $rootScope.util.getUserToken(),
        _fnP = $rootScope.ajax.post,
        _fnG = $rootScope.ajax.get,
        _fnE = $rootScope.error.checkCode,
        _host = $rootScope.host,
        _cid = $rootScope.companyId;

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
    }
    if (!_ut) {
        $rootScope.showLoginBox = true;
        return;
    };

    $scope.init = function () {
        "use strict";
        $scope.isShowPage= false;//是否展示分页
        $scope.isShowIcon= false;//是否展示icon
        $scope.initPagination();
        $scope.receivables.getReceivablesList();
    };

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
        $scope.receivables.getReceivablesList();
    });

    //搜索条件
    $scope.obj = {};
    $scope.receivables = {
        list :[],//批发收款单数组
        getReceivablesList : function () {
            var url = '/finance-plugin-web/api/cg/queryPaymentOrderList.do',
                params = {
                    currentPage:$scope.pageNo,
                    itemsPerPage:$scope.pageSize
                };
            if($scope.obj.startTime){
                params.rzDateStart = $scope.obj.startTime;
            }
            if($scope.obj.endTime){
                params.rzDateEnd = $scope.obj.endTime;
            }
            if(!$rootScope.util.isEmptyStr($scope.obj.startTime) && !$rootScope.util.isEmptyStr($scope.obj.endTime)){
                if($scope.obj.startTime > $scope.obj.endTime) {
                    _fnE("提示","开始时间不能大于结束时间！");
                    return;
                }
            }
            if($scope.obj.pfBillNo){
                params.pfBillNo = $scope.obj.pfBillNo;
            }
            _fnP(url,params).then(function (res) {
                if(res.code == 0 && res.data != null && res.data.listObj != null && res.data.listObj.length>0){
                    $scope.receivables.list = res.data.listObj;
                    $scope.totalCount = res.data.total;
                    $scope.totalPage = $scope.totalCount % $scope.pageSize == 0 ? (($scope.totalCount / $scope.pageSize) || 1) : parseInt($scope.totalCount / $scope.pageSize) + 1;
                    $scope.isShowPage= true;
                    $scope.isShowIcon= false;
                }else {
                    $scope.isShowPage= false;
                    $scope.isShowIcon= true;
                }
            },function (res) {
                $scope.isShowPage= false;
                $scope.isShowIcon= true;
                _fnE("提示","系统异常！");
            })
        }
    };

    $scope.init();

}]);
