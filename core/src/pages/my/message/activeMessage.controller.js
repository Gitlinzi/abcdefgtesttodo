/**
 * Created by user on 2017/11/14.
 */
'use strict';
angular.module('appControllers').controller('activeMessageCtrl',['$scope','$rootScope','$sce','$window',function($scope,$rootScope,$sce,$window){
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
    $scope.messageType = 2; //活动消息
    // 消息默认参数
    $scope.activeMessage = {
        pageNo : 1,    //当前页码
        pageSize : 10  // 一页多少个数据
    }
    $scope.$on('changePageNo', function (event, data) {
        "use strict";
        $scope.activeMessage.pageNo = data;
        $scope.takeMessage();
    })
    // 获取消息列表
    $scope.takeMessage = function (v,$index) {
        var url = $rootScope.host + '/social/vl/message/getMsgList';
        var params = {
            ut : $rootScope.util.getUserToken(),  //获取ut
            isUpdate : false,
            pageNo : $scope.activeMessage.pageNo,
            pageSize : $scope.activeMessage.pageSize,
            messageType : $scope.messageType
        }
        $rootScope.ajax.post(url , params).then(function(res){
            if( res.code == 0 ) {
                $scope.activeMessageArr = res.data.data;
                // 消息总数量
                $scope.activeMessage.totalCount = res.data.totalCount;
                // 消息总页数
                $scope.activeMessage.totalPage = Math.ceil(res.data.totalCount / $scope.activeMessage.pageSize);
                // 点击当前的数据时添加 isShow属性
                if ($index || $index === 0) {
                    $scope.activeMessageArr[$index].isShow = v;
                }
            }
        })
    }
    $scope.takeMessage();
    // 修改消息已读状态
    $scope.changeMessage = function(activeMessageArr,x,$index,event) {
        x.isShow = !x.isShow;
        // if( x.isShow ) {
        //     event.target.style.background = '#FFF2EC';
        // } else {
        //     event.target.style.background = '#FFFFFF';
        // }
        angular.forEach( activeMessageArr , function(val) {
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
            $rootScope.ajax.post(url,params).then(function(res){
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
    // 获取全部信息的数量
    $scope.unReadMessage = function() {
        var url = $rootScope.host + '/social/vl/message/getMsgSummary',
            params = {
                reType:1
            };
        $rootScope.ajax.get(url,params).then(function(res){
            angular.forEach( res.data,function(a) {
                if( a.messageType == 1 ) {
                    $scope.unReadSysteamMessage = a.unReadMsgCount;
                }
                if( a.messageType == 2 ) {
                    $scope.unReadActiveMessage = a.unReadMsgCount;
                }
            } )
        })
    }
    $scope.unReadMessage();
}]);
