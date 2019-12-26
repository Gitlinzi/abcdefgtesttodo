/**
 * Created by Roy on 17/6/29.
 */
'use strict';
angular.module('appControllers').controller('businessDetailCtrl', ['$scope', '$rootScope', '$cookieStore', 'commonService', 'categoryService', 'validateService', 'Upload', '$state', '$stateParams', function ($scope, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload, $state, $stateParams) {
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

    $scope.init = function () {
        "use strict";
        $scope.initPagination();
        $scope.detail.getBodyList();
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
        $scope.ck = false;
        $scope.detail.getBodyList();
    });

    $scope.detail = {
        billType:{
            1:'批发销售单',
            2:'批发退货单'
        },
        parentBill:{},//父单
        list :[],//从数据数组
        getBodyList : function () {
            var url = '/back-order-web/restful/cgorder/businessH5OrderDetail.do',
                params = {
                    currentPage:$scope.pageNo,
                    itemsPerPage:$scope.pageSize,
                    pfBillNo:$stateParams.pfBillNo
                };
            _fnP(url,params).then(function (res) {
                if(res.code == 0 && res.data){
                    $scope.detail.parentBill = res.data.businessDetail;
                    $scope.detail.list = res.data.detailPage.listObj;
                    $scope.totalCount = res.data.detailPage.total;
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
