/**
 * Created by Roy on 17/6/29.
 */
'use strict';
angular.module('appControllers').controller('feedbackCtrl', ['$scope', '$rootScope', '$cookieStore', 'commonService', 'categoryService', 'validateService', 'Upload', '$state', '$stateParams', function ($scope, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload, $state, $stateParams) {
    var _ut = $rootScope.util.getUserToken();
    if (!_ut) {
        $rootScope.showLoginBox = true;
        return;
    };
    // 初始化数据
    $scope.feedback = {
        pageNo : 1,
        pageSize : 12,
        ut : $rootScope.util.getUserToken(),
        list: []
    }
    //获取当前进行中的券活动列表
    $scope.getList = function(pageNo,scroll){
        var params = {
            pageNo: $scope.feedback.pageNo,
            pageSize: $scope.feedback.pageSize
        };
        if(scroll){
            params.pageNo = pageNo;
        }
        var url = '/api/social/live/complain/list';
        $rootScope.ajax.get(url, params).then(function(res) {
            if (res&&res.code == 0) {
                if(scroll){
                    $scope.feedback.list = $scope.feedback.list.concat(res.data.listObj);
                }else{

                    $scope.feedback.listCount = res.data.total;
                    $scope.totalPage = ($scope.feedback.listCount % $scope.feedback.pageSize == 0) ? (($scope.feedback.listCount / $scope.feedback.pageSize) || 1) : parseInt($scope.feedback.listCount / $scope.feedback.pageSize) + 1;
                    $scope.feedback.list = res.data.listObj;
                }
            }
        }, function() {
        });
    }

    $rootScope.scrollLoading({triggerHeight: 1000, callback: function() {
        if ($scope.feedback.pageNo < $scope.totalPage) {
            $scope.feedback.pageNo++;
            $scope.getList($scope.feedback.pageNo,true);
        }
    }});

    //初始化页面
    $scope.getList($scope.feedback.pageNo,false);
}]);
