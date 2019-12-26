/**
 * Created by Roy on 17/6/29.
 */
'use strict';
angular.module('appControllers').controller('indexStatisticsCtrl', ['$scope', '$rootScope', '$cookieStore', 'commonService', 'categoryService', 'validateService', 'Upload', '$state', '$stateParams', function ($scope, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload, $state, $stateParams) {
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
        $scope.initPagination();
        $scope.statistic.getList();
    };

    //分页
    $scope.initPagination = function () {
        $scope.pageNo = 1;
        $scope.pageSize = 10;
        $scope.totalCount = 0;
    };

    //
    $scope.$on('changePageNo', function (event, data) {
        "use strict";
        $scope.pageNo = data;
        $scope.ck = false;
        $scope.statistic.getList();
    });

    //搜索条件
    $scope.obj = {};
    $scope.statistic = {
        list :[],//欠量统计数组
        selectBillFrom:{},//选中的来源
        getList : function () {
            $scope.statistic.list = [];
            var url = '/back-order-web/restful/cgorder/productOwedCount.do',
                params = {
                    currentPage:$scope.pageNo,
                    itemsPerPage:$scope.pageSize
                };
            if($scope.obj.startTime){
                params.dateStart = $scope.obj.startTime + " 00:00:00";
            }
            if($scope.obj.endTime){
                params.dateEnd = $scope.obj.endTime + " 23:59:59";
            }
            if(!$rootScope.util.isEmptyStr($scope.obj.startTime) && !$rootScope.util.isEmptyStr($scope.obj.endTime)){
                if($scope.obj.startTime > $scope.obj.endTime) {
                    $scope.isShowPage= false;
                    $scope.isShowIcon= true;
                    _fnE("提示","开始时间不能大于结束时间！");
                    return;
                }
            }
            if(!$rootScope.util.isEmptyStr($scope.obj.mpName)){
                params.productName = $scope.obj.mpName;
            }
            if(!$rootScope.util.isEmptyStr($scope.obj.number)){
                params.code = $scope.obj.number;
            }
            _fnP(url,params).then(function (res) {
                if(res.code == 0 && res.data != null && res.data.listObj != null && res.data.listObj.length>0){
                    $scope.statistic.list = res.data.listObj;
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
        },
    };
    $scope.init();
}]);
