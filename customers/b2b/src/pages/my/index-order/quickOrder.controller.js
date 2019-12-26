/**
 * Created by Roy on 17/6/29.
 */
'use strict';
angular.module('appControllers').controller('quickOrderCtrl', ['$scope', '$rootScope', '$cookieStore', 'commonService', 'categoryService', 'validateService', 'Upload', '$state', '$stateParams','config', function ($scope, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload, $state, $stateParams,config) {
    var _ut = $rootScope.util.getUserToken(),
        _fnP = $rootScope.ajax.post,
        _fnG = $rootScope.ajax.get,
        _fnE = $rootScope.error.checkCode,
        _host = $rootScope.host,
        _cid = $rootScope.companyId;

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
    if (!_ut) {
        $rootScope.showLoginBox = true;
        return;
    };
    $scope.quickTab = $rootScope.util.paramsFormat(location.hash).quickTabUrl || 1; //参数hash无值默认1
    //信用额度查询
    $scope.getCreditAccount = function () {
        $rootScope.ajax.post('/back-finance-web/api/userAccount/queryUserCreditAccountInMerchant.do', {
        }).then(function (res) {
            if (res.code == 0 ) {
                if(res.data){
                    $scope.myCreditAccount = res.data;
                }
            }
        }, function (res) {
            $rootScope.error.checkCode('系统异常', '获取信用额度异常');
        })
    };
    $scope.searchTableCtrl = false;//默认的搜索列表框隐藏
    $scope.searchGoods = function (val,event) {
        $scope.enterVal = val;
        var url='/rest/search/shoppingCartSearch.do';
        var params={
            "ut": _ut,
            "companyId":$rootScope.companyId,
            "start":0,
            "count":20,
            "keyword":val
        }
        $rootScope.ajax.get(url, params).then(function(result) {
            if(result){
                $scope.searchList = result;
                $scope.searchTableCtrl = true;
                if($scope.searchList.merchantProductResult&&$scope.searchList.merchantProductResult.length>0){
                    $scope.now = -1;
                }
            }
        },function(result){
            $rootScope.error.checkCode('系统异常', result.data.warnMsg||result.message, {
                type: 'info'
            });
        })
    }
    $scope.now = -1;
    $scope.searchDirect = function($event){
        if($event.keyCode == 40){
            $scope.now++;
            if($scope.searchList.merchantProductResult&&$scope.now == $scope.searchList.merchantProductResult.length){
                $scope.now = -1;
            }
        }else if($event.keyCode == 38){
            $scope.now--;
            if($scope.now == -2){
                $scope.now = $scope.searchList.merchantProductResult.length -1;
            }
        }else if($event.keyCode == 13&&$scope.now != -1){
            if($scope.searchList.merchantProductResult&&$scope.searchList.merchantProductResult[$scope.now]){
                $scope.getPackageList($scope.searchList.merchantProductResult[$scope.now].id);
                $scope.searchValue = $scope.searchList.merchantProductResult[$scope.now].code||$scope.searchValue;
                $scope.now = -1;
            }
        }else if($event.keyCode == 13&&$scope.now == -1){
            $scope.searchGoods($scope.enterVal);
        }
    }
    //获取实时价格库存
    $scope.getPriceStockList = function (itemIds){
        if(itemIds.length <= 0){
            return;
        }
        var itemIdss = itemIds.join(',');
        var url = $rootScope.host + '/realTime/getPriceStockList?mpIds='+itemIdss;
        $rootScope.ajax.get(url, {}).then(function(res){
            var plistMap={};
            if(res.data&&res.data.plist){
                angular.forEach(res.data.plist||[], function (pl) {
                    plistMap[pl.mpId]=pl;
                })
            }
            if($scope.searchList&&$scope.searchList.merchantProductResult){
                angular.forEach($scope.searchList.merchantProductResult||[], function (pl) {
                    if(plistMap[pl.id]){
                        $.extend(pl,plistMap[pl.id]);
                        if(pl.id == itemIds){
                            $scope.searchListOne = pl;
                        }
                    }
                })
            }
        })
    }
    //获取商品的包装方式
    //包装方式搜索为空时
    $scope.nullPackage = [{
        "id":'nullId',
        "orderMultiple":1
    }];
    $scope.getPackageList = function(mpId){
        // if(mpIdsAll.length <= 0){
        //     return;
        // }
        $scope.getPriceStockList([mpId]); //获取实时库存价格
        var url = '/back-product-web2/orderMultipleAction/getMerchantProductOrderMultipleByMpIds.do';
        var params={
            "mpIds": [mpId]
        };
        $rootScope.ajax.postJson(url,params).then(function (res) {
            if(res.code == 0){
                $scope.searchTableCtrl = false;
                if(res.data&&$scope.searchList.merchantProductResult){
                    if($rootScope.util.isEmptyObj(res.data)){
                        $scope.packageWayOne =  $scope.nullPackage;
                        $scope.package =  $scope.nullPackage[0];
                        return;
                    }
                    angular.forEach($scope.searchList.merchantProductResult||[], function (pl) {
                        if(res.data[pl.id]){
                            $.extend(pl,{'packageWay':res.data[pl.id]});
                            if(pl.id == mpId){
                                $scope.packageWayOne = pl.packageWay;
                                $scope.package = res.data[pl.id][0];
                            }
                        }
                    })
                }
            }
        },function () {
            _fnE('提示','系统异常');
        });
    }
    //购买数量的加减
    $scope.quickNum = 1;
    $scope.maxAddCartNum = 1000000;
    $scope.quickDecrease = function(){
        $scope.quickNum -= 1;
        if ($scope.quickNum <= 1) {
            $scope.quickNum = 1;
        }
    };
    $scope.quickIncrease = function(){
        $scope.quickNum += 1;
        if ($scope.quickNum >= $scope.maxAddCartNum) {
            $scope.quickNum = $scope.maxAddCartNum;
        }
    };
    //只能输入数字
    $scope.quickChange = function() {
        if ($scope.quickNum <=1) {
            $scope.quickNum = 1;
        }
        if ($scope.quickNum >= $scope.maxAddCartNum) {
            $scope.quickNum = $scope.maxAddCartNum;
        }
        $scope.quickNum = parseInt($scope.quickNum);
    }
    //添加商品
    $scope.quickAdd = function(mpId,num,packageId){
        if(!mpId){
            return;
        }
        var url = $rootScope.host + "/my/fastbuy/addItem";
        var param = {
            "companyId":$rootScope.companyId,
            "provinceId": $rootScope.localProvince.province.provinceId,
            "mpId": mpId,
            "num": num,
            "ut": _ut,
            "sessionId": $rootScope.sessionId
        };
        if(packageId != 'nullId'){
            param.productPackageId = packageId;
        }

        $rootScope.ajax.post(url, param).then(function (result) {
            if (result.code == 0) {
                $scope.goodList();//重新刷新列表
                $scope.searchListOne = {};//搜索结果置空
                $scope.packageWayOne =  $scope.nullPackage;
                $scope.package =  $scope.nullPackage[0];
                $scope.quickNum = 1;
                $scope.searchValue = '';
            }else{
                $rootScope.error.checkCode(result.code,result.message,{
                    type:'info'
                });
            }
        }, function (result) {
            $rootScope.error.checkCode('系统异常','系统异常',{
                type:'error',
                btnGoBackText:'确定',
                btnGoBackUrl:'cart.html'
            });
        })
    }
    //删除商品
    $scope.quickDelete = function(mpIds,mpIdCtrl){
        var url = $rootScope.host + "/my/fastbuy/removeItemBatch";
        var param = {
            "companyId":$rootScope.companyId,
            "provinceId": $rootScope.localProvince.province.provinceId,
            "ut": _ut,
            "sessionId": $rootScope.sessionId
        };
        if(mpIdCtrl){
            param.mpIds = $scope.allMpIds.join(",");
        }else{
            param.mpIds = mpIds;
        }
        $rootScope.ajax.post(url, param).then(function (result) {
            if (result.code == 0) {
                $scope.goodList();
            }else{
                $rootScope.error.checkCode(result.code,result.message,{
                    type:'warn',
                    btnGoBackText:'确定',
                    btnGoBackUrl:'cart.html'
                });
            }
        }, function (result) {
            $rootScope.error.checkCode('系统异常','系统异常',{
                type:'info'
            });
        })
    }
    //所有添加的商品列表
    $scope.blurCtrl = true;
    $scope.goodList = function(){
        var url = $rootScope.host + "/my/fastbuy/list";
        var param = {
            "companyId":$rootScope.companyId,
            "provinceId": $rootScope.localProvince.province.provinceId,
            "platformId":$rootScope.platformId,
            "ut":_ut,
            "sessionId": $rootScope.sessionId,
            'v':config.cartListVersion
        };

        $rootScope.ajax.post(url, param).then(function (result) {
            if(result.code == 0&&result.data){
                $scope.blurCtrl = true;
                $scope.quickList = result.data;
                $scope.totleNum = 0;
                $scope.totlePrice = 0;
                $scope.allMpIds = [];
                angular.forEach($scope.quickList,function(ql){
                    ql.canBuy = true; //初始化都可买
                    $scope.allMpIds.push(ql.mpId);
                    $scope.totleNum += ql.num;
                    $scope.totlePrice += ql.num*ql.price;
                    if(ql.packageList&&ql.packageList.length>0){
                        angular.forEach(ql.packageList,function(pl){
                            if(pl.checked){
                                ql.packageTab = pl;
                                ql.infactNum = ql.num/pl.orderMultiple;
                            }
                        })
                    }else{
                        ql.infactNum = ql.num;
                        ql.packageList = $scope.nullPackage;
                        ql.packageTab = $scope.nullPackage[0];
                    }
                })
                $scope.getCreditAccount();//信用额度
            }else{
                $rootScope.error.checkCode(result.code,result.message,{
                    type:'warn',
                    btnGoBackText:'返回首页',
                    btnGoBackUrl:'index.html'
                });
            }
        }, function (result) {
            $rootScope.error.checkCode('系统异常','系统异常',{
                type:'error',
                btnGoBackText:'返回首页',
                btnGoBackUrl:'index.html'
            });
        })
    }
    //列表的商品数量加减
    $scope.goodDecrease = function(event,good){
        var currentElement = angular.element(event.currentTarget);
        var currentNum = currentElement.next().val();
        //数量不可小于1
        if (currentNum <= 1) {
            return;
        }
        var num = (currentElement.next().val()-1)*(good.orderMultiple?good.orderMultiple:1);
        currentElement.next().val(currentElement.next().val()*1-1);
        $scope.editGood(currentElement, good, num);
    };
    $scope.goodIncrease = function(event,good){
        var currentElement = angular.element(event.currentTarget);
        var currentNum = currentElement.prev().val();
        //数量不可大于最大值
        if (currentNum >= $scope.maxAddCartNum) {
            currentNum = $scope.maxAddCartNum;
        }
        var num = (currentElement.prev().val()*1+1)*(good.orderMultiple?good.orderMultiple:1);
        currentElement.prev().val(currentElement.prev().val()*1+1);
        $scope.editGood(currentElement, good, num);
    };
    //只能输入数字
    $scope.goodChange = function(currentElement, good, num) {
        if (num <=1) {
            num = 1;
        }
        if (num >= $scope.maxAddCartNum) {
            num = $scope.maxAddCartNum;
        }
        num = parseInt(num);
        $scope.editGood(currentElement, good, num);

    }
    //编辑单个商品数量
    $scope.editGood = function(currentElement, good, num){
        $scope.blurCtrl = false;
        var url = $rootScope.host + "/my/fastbuy/editItemNum";
        var param = {
            "companyId":$rootScope.companyId,
            "provinceId": $rootScope.localProvince.province.provinceId,
            "mpId": good.mpId,
            "num": num,
            "ut": _ut,
            "sessionId":$rootScope.sessionId,
        };
        if(good.packageTab.id != 'nullId'){
            param.productPackageId = good.packageTab.id;
        }
        $rootScope.ajax.post(url, param).then(function (result) {
            if (result.code == 0) {
                $scope.goodList();
            }else{
                $rootScope.error.checkCode(result.code,result.message,{
                    type:'info'
                });
            }
        }, function (result) {
            $rootScope.error.checkCode('系统异常','系统异常',{
                type:'error',
                btnGoBackText:'确定',
                btnGoBackUrl:'cart.html'
            });
        })
    };
    //加入购物车
    $scope.quickModalCtrl = false;
    $scope.quickAddCart = function(type,tabType,error){  //type 0 加车 type 1 立即购买 ,tabType 1快速下单 3历史进货
        //加车之前先校验是否有失效商品
        if($scope.blurCtrl){
            var url = $rootScope.host + "/my/fastbuy/checkAddCart";
            var skusObj = [];
            if(tabType == 1){
                angular.forEach($scope.allMpIds,function(mpId){
                    var mpIdOne = {"mpId":mpId};
                    skusObj.push(mpIdOne);
                })
            }else if(tabType ==3){
                if($scope.history.srarchList&&$scope.history.srarchList.length>0){
                    $scope.histortAllMpId = [];
                    angular.forEach($scope.history.srarchList,function(hs){
                        if(hs.checked){
                            $scope.histortAllMpId.push(hs.mpId);
                        }
                    })
                }
                angular.forEach( $scope.histortAllMpId,function(mpId){
                    var mpIdOne = {"mpId":mpId};
                    skusObj.push(mpIdOne);
                })
            }
            var param = {
                "companyId":$rootScope.companyId,
                "provinceId": $rootScope.localProvince.province.provinceId,
                "platformId":$rootScope.platformId,
                "ut":_ut,
                "sessionId": $rootScope.sessionId,
                "skus":JSON.stringify(skusObj)
            };

            $rootScope.ajax.post(url, param).then(function (result) {
                if(result.code == 0){
                    if(Array.isArray(result.data)){
                        $scope.errorType = type;
                        $scope.quickModalCtrl = true;
                        $scope.historyArtNo = result.data.join(","); //失效商品的集合
                        if($scope.quickTab == 1){
                            angular.forEach($scope.quickList,function(sq){
                                angular.forEach(result.data||[],function(artNo){
                                    if(artNo == sq.mpCode){
                                        sq.canBuy = false;
                                    }else{
                                        sq.canBuy = true;
                                    }
                                });
                            })
                        }else if($scope.quickTab == 3){
                            angular.forEach($scope.history.srarchList||[],function(hs){
                                angular.forEach(result.data||[],function(artNo){
                                    if(hs.artNo == artNo){
                                        hs.canBuy = false;
                                    }
                                });
                            });
                        }
                        if(error == 2){
                            if(type == 0 ){
                                $scope.quickAddCartConfirm(tabType);
                            }else if(type == 1){
                                $scope.quickAddOrderConfirm(tabType);
                            }
                        }else{
                            return;
                        }
                    }else{
                        if(type == 0 ){
                            $scope.quickAddCartConfirm(tabType);
                        }else if(type == 1){
                            $scope.quickAddOrderConfirm(tabType);
                        }
                    }
                }else{
                    _fnE("提示",result.message);
                }
            }, function (result) {
                $rootScope.error.checkCode('系统异常','系统异常',{
                    type:'error',
                    btnGoBackText:'返回首页',
                    btnGoBackUrl:'index.html'
                });
            })
        }
    };
    //快速下单确认加车
    $scope.quickAddCartConfirm = function(tabType){
        $scope.quickSkus = [];
        var skusObj;
        if(tabType == 1){
            angular.forEach($scope.quickList,function(qs) {
                if(qs.packageTab.id != 'nullId'){
                    skusObj = {"mpId":qs.mpId,"num":qs.num,"itemType":0,"objectId":0,"isMain":0,"productPackageId":qs.packageTab.id};
                }else{
                    skusObj = {"mpId":qs.mpId,"num":qs.num,"itemType":0,"objectId":0,"isMain":0};
                }
                if(qs.canBuy){
                    $scope.quickSkus.push(skusObj);
                }
            })
        }else if(tabType == 3){
            angular.forEach($scope.history.srarchList,function(hs) {
                if(hs.checked&&hs.canBuy){
                    skusObj = {"mpId":hs.mpId,"num":1,"itemType":0,"objectId":0,"isMain":0};
                    $scope.quickSkus.push(skusObj);
                }
            })
        }
        var url = $rootScope.host + "/cart/addItem";
        var param = {
            "companyId":$rootScope.companyId,
            "ut": _ut,
            "sessionId": $rootScope.sessionId,
            "skus": JSON.stringify($scope.quickSkus),
            "businessType": 102,
        };
        $rootScope.ajax.post(url, param).then(function (result) {
            if (result.code == 0) {
                if(tabType == 1){
                    $scope.goodList();
                    _fnE("提示","加入进货单成功！");
                    $scope.quickModalCtrl = false;
                }else if(tabType == 3){
                    _fnE("提示","加入进货单成功！");
                    $scope.quickModalCtrl = false;
                }
            }else{
                $rootScope.error.checkCode(result.code,result.message,{
                    type:'info'
                });
            }
        })
    }
    //立即购买
    $scope.quickAddOrderConfirm = function(tabType){
        var params = {
            provinceId: $rootScope.localProvince.province.provinceId,
            companyId: $rootScope.companyId,
            platformId: $rootScope.platformId,
            businessType : 7,
        }
        var skusObj;
        $scope.quickOrderSkus = [];
        if(tabType == 1){
            angular.forEach($scope.quickList,function(qs) {
                if(qs.packageTab.id != 'nullId'){
                    skusObj = {"mpId":qs.mpId,"num":qs.num,"itemType":0,"objectId":0,"isMain":0,"productPackageId":qs.packageTab.id};
                }else{
                    skusObj = {"mpId":qs.mpId,"num":qs.num,"itemType":0,"objectId":0,"isMain":0};
                }
                if(qs.canBuy){
                    $scope.quickOrderSkus.push(skusObj);
                }
            })
        }else if(tabType == 3){
            angular.forEach($scope.history.srarchList,function(hs) {
                if(hs.checked&&hs.canBuy){
                    skusObj = {"mpId":hs.mpId,"num":1,"itemType":0,"objectId":0,"isMain":0};
                    $scope.quickOrderSkus.push(skusObj);
                }
            })
        }
        params.skus = JSON.stringify($scope.quickOrderSkus);
        $rootScope.ajax.post($rootScope.host + '/checkout/initOrder', params).then(function (res) {
            if (res.code == 0) {
                localStorage.setItem('quickBuy', JSON.stringify(params));
                location.href = 'settlement.html?q=1';
            } else {
                if(res.data!=null&&res.data.error != null && (res.data.error.type==4||res.data.error.type==3)){
                    localStorage.setItem('quickBuy', JSON.stringify(params));
                    location.href = 'settlement.html?q=1';
                }else{
                    $rootScope.error.checkCode(res.code, res.message);
                }
            }
        }, function (error) {
            $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('一键购买异常') + '！');
        })
    }
    //晨光快速导入表格下单
    $scope.goodsUpload = function(){
        // $scope.excelData = '';
        if (!$scope.excelData) {
            return;
        }
        Upload.upload({
            url: $rootScope.host + '/cart/importAddItems',
            data: {
                file: $scope.excelData,
                companyId:$rootScope.companyId,
                provinceId:$rootScope.localProvince.province.provinceId,
                sessionId: $rootScope.sessionId
            }
        })
        .success(function (data, status, headers, config) {
            if(data.code != 0){
                $rootScope.error.checkCode(data.code,data.message,{
                    type:'info'
                });
                return;
            }
            if(data.code == 0){
                _fnE("提示","商品文件导入成功！");
            }
        })
        .error(function (data, status, headers, config) {
            //console.log('error status: ' + status);
        })
    }
    //分页
    $scope.$on('changePageNo', function (event, data) {
        "use strict";
        $scope.pageNo = data;
    });
    $scope.pageNo = 1;
    $scope.pageSize = 10;
    $scope.isShowIcon= true;
    $scope.history = {
        srarchList:[],//搜索的结果
        historySearch : function(type,keyword){
            var url = '/back-order-web/restful/cgorder/personalProductCount.do';
            var param = {
                "ut":_ut,
                "currentPage":$scope.pageNo,
                "itemsPerPage":$scope.pageSize
            };
            if(type == 0){
                param.artNo = keyword;
            }else if(type == 1){
                param.productName = keyword;
            }

            if($scope.startTime){
                param.dateStart = $scope.startTime;
            }
            if($scope.endTime){
                param.dateEnd = $scope.endTime;
            }
            if(!$scope.startTime){
                _fnE("提示","请选择开始时间");
                return;
            }
            if(!$scope.endTime){
                _fnE("提示","请选择结束时间");
                return;
            }
            if(!$rootScope.util.isEmptyStr($scope.startTime) && !$rootScope.util.isEmptyStr($scope.endTime)){
                if($scope.startTime > $scope.endTime) {
                    $scope.isShowPage= false;
                    $scope.isShowIcon= true;
                    _fnE("提示","开始时间不能大于结束时间！");
                    return;
                }
            }
            $rootScope.ajax.post(url, param).then(function (res) {
                if(res.code == 0 && res.data != null){
                    $scope.history.srarchList = res.data.listObj;
                    if($scope.history.srarchList&&$scope.history.srarchList.length>0){
                        angular.forEach($scope.history.srarchList,function(hs){
                            hs.canBuy = true;
                        });
                    }
                    $scope.totalCount = res.data.total;
                    $scope.totalPage = $scope.totalCount % $scope.pageSize == 0 ? (($scope.totalCount / $scope.pageSize) || 1) : parseInt($scope.totalCount / $scope.pageSize) + 1;
                    $scope.isShowPage= true;
                    $scope.isShowIcon= false;
                }
                if(res.data.listObj == null){
                    $scope.isShowPage= false;
                    $scope.isShowIcon= true;
                }
            },function (res) {
                $scope.isShowPage= false;
                $scope.isShowIcon= true;
                _fnE("提示","系统异常！");
            })
        }
    }
    // $scope.history.srarchList =  [{"productName":"铅笔","artNo":"222333","buyNum":30,"buyAmount":1000.00}];

    //进货数量排序
    $scope.historyNumCtrl = false;
    $scope.historyMoneyCtrl = false;
    $scope.historyNum = true;
    $scope.historyMoney = true;
    $scope.sortBy = function(attr,rev){
        //第二个参数没有传递 默认升序排列
        if(rev ==  undefined){
            rev = 1;
        }else{
            rev = (rev) ? 1 : -1;
        }
        return function(a,b){
            a = a[attr];
            b = b[attr];
            if(a < b){
                return rev * -1;
            }
            if(a > b){
                return rev * 1;
            }
            return 0;
        }
    }
    $scope.sortNum = function(){
        $scope.historyNumCtrl = true;
        $scope.historyMoneyCtrl = false;
        $scope.historyNum = !$scope.historyNum;
        $scope.history.srarchList =  $scope.history.srarchList.sort($scope.sortBy('buyNum',$scope.historyNum));
    }
    $scope.sortMoney = function(){
        $scope.historyMoneyCtrl = true;
        $scope.historyNumCtrl = false;
        $scope.historyMoney = !$scope.historyMoney;
        $scope.history.srarchList =  $scope.history.srarchList.sort($scope.sortBy('buyAmount',$scope.historyMoney));
    }
    //历史进货全选
    $scope.checkedAllCtrl = false;
    $scope.checkAllRow = function(){
        if($scope.history.srarchList&&$scope.history.srarchList.length>0){
            angular.forEach($scope.history.srarchList,function(hs){
                if($scope.checkedAllCtrl){
                    hs.checked = true;
                }else{
                    hs.checked = false;
                }
            })
        }
    }
    //历史进货单选框控制
    $scope.checkSingleRow = function(row){
        if($scope.history.srarchList&&$scope.history.srarchList.length>0){
            $scope.checkedNum = 0;
            angular.forEach($scope.history.srarchList,function(hs){
                if(hs.checked){
                    $scope.checkedNum += 1;
                }
            });

            if($scope.checkedNum == $scope.history.srarchList.length){
                $scope.checkedAllCtrl = true;
            }else{
                $scope.checkedAllCtrl = false;
            }
        }
    }
    $scope.init = function(){
        $scope.getCreditAccount();//信用额度
        $scope.goodList();//快速下单的所有商品列表初始化
    }
    $scope.init();
}]);
