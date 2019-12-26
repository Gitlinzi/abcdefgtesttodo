/**
 * Created by Roy on 17/6/29.
 */
'use strict';
angular.module('appControllers').controller('billDetailCtrl', ["$scope", "$rootScope", "$cookieStore", "commonService", 'categoryService', "validateService", "Upload", "$state", "$stateParams","$window","$timeout",'allUrlApi',
    function ($scope, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload, $state, $stateParams,$window,$timeout,allUrlApi) {
        //国际化
        $scope.i18n = function (key) {
            return $window.i18n ? $window.i18n(key) : key;
        };
        //公共参数
        var _ut = $rootScope.util.getUserToken(),
            _fnE = $rootScope.error.checkCode,
            _host = $rootScope.host,
            _cid = $rootScope.companyId;
        $scope.showInvoiceImage = $rootScope.switchConfig.center.bill.showInvoiceImage;
        if (!_ut) {
            $rootScope.showLoginBox = true;
            return;
        }

        $scope.orderCode = $stateParams.orderCode;

        $scope.invoiceDetail = {
            invoiceType: {
                1: $scope.i18n('普通发票'),
                2: $scope.i18n('增值发票')
            },
            invoiceMode: {
                1: $scope.i18n('电子发票'),
                2: $scope.i18n('纸质发票')
            },

            orderDetail: {},
            invoiceList: {},
            getBillDetail() {
                var url = '/custom-sbd-web/deliverOrder/getDeliverInvoiceInfo'
                var params = {
                    orderCode: $scope.orderCode
                }
                $rootScope.ajax.postFrom(url,params).then(function(res) {
                    if (res.code == 0 && res.data) {
                        $scope.invoiceDetail.orderDetail = res.data[0]
                    }
                })
            }
        };
        $scope.invoiceDetail.getBillDetail();
        // 下載pdf
        $scope.downloadFileByGet = function(url, params = {}, fileName = 'fileName.xlsx') {
            url = url || $scope.invoiceDetail.orderDetail.url  
            const downloadUrl = url        
            try {
              const a = document.createElement('a')
              a.setAttribute('href', downloadUrl)
              a.setAttribute('download', fileName)
              a.click()
            } catch (ex) {
            // 定义一个form表单,通过form表单来发送请求
              $('<form>')
                .attr('style', 'display:none')
                .attr('method', 'get')
                .attr('action', downloadUrl)
                .appendTo('body')
                .submit()// 表单提交
            }
        }
    }]);
