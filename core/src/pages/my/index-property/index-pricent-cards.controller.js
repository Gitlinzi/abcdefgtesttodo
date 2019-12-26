/**
 * Created by Roy on 17/1/10.
 */
appControllers.controller('pricentCardsCtrl', ["$scope", "$rootScope", "$cookieStore", "commonService", "$stateParams","$window",
    function ($scope, $rootScope, $cookieStore, commonService, $stateParams,$window) {
        //国际化
        $scope.i18n = function (key) {
            return $window.i18n ? $window.i18n(key) : key;
        };
        var _ut = $rootScope.util.getUserToken();
        if (!_ut) {
            $rootScope.showLoginBox = true;
            return;
        };

        //初始化
        $scope.init = function (pointStatus) {
            "use strict";
            $scope.initPagination();
        }

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
        })

        // $scope.$watch('activeNum', function (val) {

        //     $scope.init(val);
        // });


    }]);
