/**
 * Created by Roy on 17/6/29.
 */
'use strict';
angular.module('appControllers').controller('messageCtrl',['$scope','$rootScope','$sce','$window',function($scope,$rootScope,$sce,$window){
    //国际化
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
    var _ut = $rootScope.util.getUserToken();

    if(!_ut){
        $rootScope.showLoginBox = true;
        return;
    }
    $scope.toSafeHtml=function(html){
        return $sce.trustAsHtml(html);
    };
    // 消息默认参数
    $scope.message = {
        pageNo : 1,    //当前页码
        pageSize : 10  // 一页多少个数据
    }
    $scope.$on('changePageNo', function (event, data) {
        "use strict";
        $scope.message.pageNo = data;
        $scope.takeMessage();
    })
    // 获取消息列表
    $scope.takeMessage = function (v,$index) {
        var url = $rootScope.host + '/social/vl/message/getMsgList';
        var params = {
            ut : $rootScope.util.getUserToken(),  //获取ut
            isUpdate : false,
            pageNo : $scope.message.pageNo,
            pageSize : $scope.message.pageSize
        }
        $rootScope.ajax.post(url , params).then(function(res){
            if( res.code == 0 ) {
                $scope.messageArr = res.data.data;
                // 消息总数量
                $scope.message.totalCount = res.data.totalCount;
                // 消息总页数
                $scope.message.totalPage = Math.ceil(res.data.totalCount / $scope.message.pageSize);
                // 点击当前的数据时添加 isShow属性
                if ($index || $index === 0) {
                    $scope.messageArr[$index].isShow = v;
                }
            }
        })
    }
    $scope.takeMessage();
    // 修改消息已读状态
    $scope.changeMessage = function(messageArr,x,$index) {
        x.isShow = !x.isShow;
        angular.forEach( messageArr , function(val) {
            if(val.id != x.id) {
                val.isShow = false;
            }
        } )
        if( x.isShow ) {
            var url = $rootScope.host + '/social/vl/message/updateMsgStatus';
            var params = {
                ut : $rootScope.util.getUserToken(),
                msgId : x.id
            }
            $rootScope.ajax.post(url, params).then(function(res){
                if( res.code == 0  ) {
                    // 将属性和$index传入方法中
                    $scope.takeMessage(x.isShow,$index);
                }

                $scope.unReadMessage();
            })
        } else {
            return;
        }
    }
    $scope.unReadMessage = function() {
        var url = $rootScope.host + '/social/vl/message/getMsgSummary',
            params = {
            };
        $rootScope.ajax.get(url,params).then(function(res){
            if (res.code == 0) {
                $rootScope.untreatedMesNum = res.data.unReadMsgCount;
            }
        })
    }
    $scope.unReadMessage()
}]);
