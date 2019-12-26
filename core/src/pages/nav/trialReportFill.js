/**
 * Created by sindy on 15/11/4.
 */

appControllers.controller("trialReportFillCtrl", ['$log', '$rootScope', '$scope', '$cookieStore', 'commonService', 'categoryService', 'config','$window',
    function ($log, $rootScope, $scope, $cookieStore, commonService, categoryService, config,$window) {
    //国际化
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
    var _ut = $rootScope.util.getUserToken(),
        _fnP = $rootScope.ajax.post,
        _fnG = $rootScope.ajax.get,
        _fnE = $rootScope.error.checkCode,
        _host = $rootScope.host,
        _cid = $rootScope.companyId;

    //默认省份与迷你购物车
    $rootScope.execute(true);

    var compare = function (property) {
        return function (a, b) {
            var value1 = a[property];
            var value2 = b[property];
            return value1 - value2;
        }
    }

    $scope.reportFill = {
        picUrl: [],//上传的图片
        crumbList: [],//面包屑
        trialProcess: '',//试用过程
        trialExperience: '',//试用心得
        getReportdetail: function () {
            var that = this,
                params = {
                    id: $rootScope.util.paramsFormat().id
                },
                url = _host + '/social/trialReport/trialReportInfo';
            $rootScope.ajax.postJson(url, params).then(function (res) {
                that.myTrialList = [];
                if (res.code == 0 && res.data != null) {
                    that.reportDetial = res.data;
                    if(that.reportDetial.status == 3){
                        location.href = '/trial.html?trialTab=3';
                    }
                    if (that.reportDetial.variables != null) {
                        var arr = JSON.parse(decodeURIComponent(that.reportDetial.variables));
                        var arr1 = [];
                        angular.forEach(arr, function (item) {
                            arr1.push(item);
                        });
                        that.reportDetial.decodeVariables = arr1;
                    }
                    if (that.reportDetial.categoryId)   {
                        that.crumbList = [];
                        that.getPreadCrumb(that.reportDetial.categoryId);
                    }
                }
            }, function (res) {
                _fnE($scope.i18n('提示'), $scope.i18n('系统异常'));
            });
        },
        //跳转商详页
        toItemPage: function (itemId,seriesParentId) {
            location.href = "item.html?itemId=" + (seriesParentId || itemId);
        },

        getPreadCrumb: function (categoryId) {
            var that = this;
            var url = '/back-product-web2/extra/category/listChildrenCategoryWithNologin.do',
                params = {
                    categoryIds : [categoryId]
                };
            $rootScope.ajax.postJson(url,params).then(function (res) {
                if (res.data  && res.data.length > 0 ) {
                    let categoryIdArr = res.data[0].fullIdPath.replace(/-/g, ',').split(',');
                    let categoryNameArr = res.data[0].fullNamePath.replace(/-/g,',').split(',');
                    if( categoryIdArr && categoryIdArr.length > 0 ) {
                        for( let o = 0 ; o < categoryIdArr.length ; o++ ) {
                            that.crumbList.push( { 'categoryId' : categoryIdArr[o] , 'categoryName' : categoryNameArr[o] } );
                        }
                    }
                }
            });

        },
        //保存试用报告
        submitTrialReport: function (reportId) {
            var arr = $scope.reportFill.reportDetial ? $scope.reportFill.reportDetial.decodeVariables: [];
            var arr1 = {};
            var flag = false;
            angular.forEach(arr, function (item) {
                if (!flag) {
                    if(item.key != 'image'){
                        if(item.value != null && item.value.length < 30){
                            flag = true;
                            _fnE($scope.i18n('提示'),$scope.i18n('无法提交') + '，' + $scope.i18n('您有信息未填写完整'));
                            return;
                        }
                    }
                    arr1[item.key] = item;
                }
            });
            if (flag) {
                return;
            }

            var variables = encodeURIComponent(JSON.stringify(arr1));
            var that = this,
                params = {
                    id: reportId,
                    variables: variables,
                    status: 3//提交
                },
                url = _host + '/social/trialReport/updateTrialReport';
            _fnP(url, params).then(function (res) {
                if (res.code == 0) {
                    $scope.submitSuccessData = {
                        bombShow:true,
                        rightText: $scope.i18n('提交报告成功') + "！",
                        title:$scope.i18n('提示'),
                        state:'success',
                        position:'top',
                        closeCallback:function () {
                            location.href = '/trial.html?trialTab=3';
                        }
                    }
                } else {
                    _fnE($scope.i18n('提示'),$scope.i18n('提交报告失败'));
                }
            });
        },
        saveDraftTrialReport: function (reportId) {
            var arr = $scope.reportFill.reportDetial ? $scope.reportFill.reportDetial.decodeVariables: [];
            var arr1 = {};
            angular.forEach(arr, function (item) {
                arr1[item.key] = item;
            });
            var variables = encodeURIComponent(JSON.stringify(arr1));
            var that = this,
                params = {
                    id: reportId,
                    variables: variables,
                    status: 1//保存草稿
                },
                url = _host + '/social/trialReport/updateTrialReport';
            _fnP(url, params).then(function (res) {
                if (res.code == 0) {
                    $scope.submitSuccessData = {
                        bombShow:true,
                        rightText: $scope.i18n('草稿保存成功') + "！",
                        title:$scope.i18n('提示'),
                        state:'success',
                        position:'top',
                    }
                    $scope.reportFill.getReportdetail();
                } else{
                    _fnE($scope.i18n('提示'),$scope.i18n('草稿保存失败'));
                }
            });
        },
    };

    $scope.reportFill.getReportdetail();
}]);
