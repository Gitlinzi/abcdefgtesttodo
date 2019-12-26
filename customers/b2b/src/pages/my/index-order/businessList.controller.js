/**
 * Created by Roy on 17/6/29.
 */
'use strict';
angular.module('appControllers').controller('businessListCtrl', ['$scope', '$rootScope', '$cookieStore', 'commonService', 'categoryService', 'validateService', 'Upload', '$state', '$stateParams', function ($scope, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload, $state, $stateParams) {
    var _ut = $rootScope.util.getUserToken(),
        _fnP = $rootScope.ajax.post,
        _fnG = $rootScope.ajax.get,
        _fnE = $rootScope.error.checkCode,
        _host = $rootScope.host,
        _cid = $rootScope.companyId;
	 if (!_ut) {
        $rootScope.showLoginBox = true;
        return;
   	 };
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


    $scope.init = function () {
        "use strict";
        $scope.initPagination();
        $scope.business.getBusinessList();
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
        $scope.business.getBusinessList();
    });

    //搜索条件
    $scope.obj = {};
    $scope.business = {
        list :[],//业务单数组
        billTypeList:[
            {
                "key":"",
                "value":"全部"
            },
            {
                "key":"1",
                "value":"批发销售单"
            },
            {
                "key":"2",
                "value":"批发退货单"
            }
        ],//单据类型
        selectBillType:{},//选中的类型
        billFromList:[
            {
                "key":"",
                "value":"全部"
            },
            {
                "key":"1",
                "value":"线下"
            },
            {
                "key":"2",
                "value":"B2B"
            },
            {
                "key":"3",
                "value":"巡店"
            }
        ],//单据来源
        billTypeStr:{
            1:"批发销售单",
            2:"批发退货单"
        },
        billFromStr:{
            1:"线下",
            2:"B2B",
            3:"巡店"
        },
        selectBillFrom:{},//选中的来源
        getBusinessList : function () {
            $scope.business.list = [];
            var url = '/back-order-web/restful/cgorder/businessH5Order.do',
                params = {
                    currentPage:$scope.pageNo,
                    itemsPerPage:$scope.pageSize,
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
            if($scope.obj.pfBillNo){
                params.pfBillNo = $scope.obj.pfBillNo;
            }
            if($scope.business.selectBillType && !$rootScope.util.isEmptyStr($scope.business.selectBillType.key)){
                params.billType = $scope.business.selectBillType.key;
            }
            if($scope.business.selectBillFrom && !$rootScope.util.isEmptyStr($scope.business.selectBillFrom.key)){
                params.billFrom = $scope.business.selectBillFrom.key;
            }
            _fnP(url,params).then(function (res) {
                if(res.code == 0 && res.data != null && res.data.listObj != null && res.data.listObj.length>0){
                    $scope.business.list = res.data.listObj;
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
    $scope.business.selectBillType = $scope.business.billTypeList[0];
    $scope.business.selectBillFrom = $scope.business.billFromList[0];
    $scope.init();
}]);
