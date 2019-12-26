/**
 * Created by Roy on 17/6/29.
 */
'use strict';
angular.module('appControllers').controller('chaseCommentCtrl', ["$scope", "$rootScope", "$cookieStore", "commonService", 'categoryService', "validateService", "Upload", "$stateParams","$window",
    function ($scope, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload, $stateParams,$window) {
        //国际化
        $scope.i18n = function (key) {
            return $window.i18n ? $window.i18n(key) : key;
        };
        var _ut = $rootScope.util.getUserToken();
        var code = $stateParams.code,
            _fnE = $rootScope.error.checkCode,
            _host = $rootScope.host;

        //初始化追评订单商品信息
        $scope.additional = {
            isHideUserName: true, // 是否匿名：0:隐藏；1:显示
            goods: [],//商品
            file: null, //选择文件
            addEvaluateInit: [],
            getaddInit: function () {
                "use strict";
                var url = _host + '/social/my/comment/addInit',
                    params = {
                        orderCode: code,
                        soItemId:$stateParams.soItemId
                    },
                    that = this;
                $rootScope.ajax.get(url, params).then(function (res) {
                    if (res.code == 0) {
                        if (res.data != null && res.data.length > 0) {
                            for (var i=0; i< res.data.length; i++) {
                                var evaluate = {};
                                evaluate.mpCommentId = res.data[i].id;
                                evaluate.orderItemId = res.data[i].mpId;
                                evaluate.addShinePicList = [];
                                evaluate.addContent = '';
                                res.data[i].evaluate = evaluate;
                                that.goods.push(res.data[i]);
                            }
                        }
                    } else {
                        $rootScope.error.checkCode(res.code, res.message);
                    }
                })
            },
            /*
            //上传文件
            upload: function (index) {
                if (!this.file) {
                    return;
                }
                var url = "/api/fileUpload/putObjectWithForm";  //params是model传的参数，图片上传接口的url
                var that = this;
                Upload.upload({
                    url: url,
                    data: {
                        file: this.file
                    }
                }).success(function (res) {
                    if (res.code == 0) {
                        that.goods[index].evaluate.addShinePicList.push(res.data.filePath);
                    }
                }).error(function () {
                    //logger.log('error');
                });
            },
            //删除图片
            deletePicByIndex: function (good, ind) {
                good.evaluate.addShinePicList.splice(ind, 1);
            },
            */
            //保存评价
            save: function () {
                var that = this;
                that.addEvaluateInit = [];
                angular.forEach(that.goods, function (val) {
                    that.addEvaluateInit.push(val.evaluate)

                })

                var flag = true;
                for (var i = 0; i<that.addEvaluateInit.length; i++) {
                    var val = that.addEvaluateInit[i];
                    if($.isEmptyObject(val.addContent) || (val.addContent != null&&val.addContent.length <=6)){
                        _fnE($scope.i18n('提示'),$scope.i18n('评价字数不少于') + '6' + $scope.i18n('个字') + '，' + $scope.i18n('请认真评价哦') + '~');
                        flag = false;
                        break;
                    }
                }
                if (!flag) {
                    return;
                }


                var inputJson = {
                    "userAddMPCommentVOList": that.addEvaluateInit
                }; //订单的商品评价集合
                var params = {
                    inputJson: JSON.stringify(inputJson)
                };
                $rootScope.ajax.post('/api/social/my/comment/addSave', params).then(function (res) {
                    if (res.code == 0) {
                        $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('追评成功'), {
                            type: 'info',
                        });
                        location.href = '#/comment';
                        // $scope.showSuccess = true;
                    }else {
                        $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('追评失败'), {
                            type: 'info',
                        });
                        location.href = '#/comment';
                        // $scope.showFail = true;
                    }
                })
            },


            init: function () {
                "use strict";
                var that = this;
                that.getaddInit();
            }

        };

    }]);
