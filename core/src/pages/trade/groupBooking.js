/**
 * Created by sindy on 15/11/4.
 */

appControllers.controller("groupBookingCtrl", ['$log', '$rootScope', '$scope', '$cookieStore', 'commonService', 'categoryService', 'config','$window',
    function ($log, $rootScope, $scope, $cookieStore, commonService, categoryService, config,$window) {
    //国际化
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
  //默认省份与迷你购物车
  $rootScope.execute(false);
  $scope.getMsgList = [];
  $scope.getMessageList = function () {
    var url = '/ad-whale-web/dolphin/getAdSource',
        params = {
            pageCode:'HOME',
            adCode:'pintuan_performance',
            platform:1
        };
    $rootScope.ajax.get(url,params).then(function (res) {
      if (res.status == 200) {
        $scope.getMsgList=res.data.data.pintuan_performance;
      }
    })
  }
  $scope.getMessageList();
}]);
