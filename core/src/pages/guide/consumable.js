// import { debug } from "util";

/**
 * Created by Roy on 15/10/20.
 */
appControllers.controller("searchCtrl", ['$log', '$rootScope', '$scope', '$location', 'commonService', 'categoryService', '$anchorScroll','$window', function ($log, $rootScope, $scope, $location, commonService, categoryService, $anchorScroll,$window) {
    "use strict"
    //默认省份与小能
    $rootScope.execute(true);
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
    // 热销商品配置
    $scope.searchConfig = {
        pageSize:16,
        showIndex: false,        //显示标签型的index
        showSalesVolume: false,  //显示热销多少件
        showName: true,          //显示商品名
        showPromotion: true,      //显示促销标签,
        type: 'lookandsee',
        size: 4,                 //每次显示几个， 与showHeight有关
        showHeight: 1095,          //因为看了又看显示的标签不一样， 所以设置不同的高度size: 3,showHeight: 696
        addHeight: 50,
        domName: 'look-and-see-dom'
    }
    var util = $rootScope.util,obj;
    var urlParams=obj= util.paramsFormat(location.search);
    $scope.defaultKeyword = '耗材'
    $scope.defaultCategory = '1013104700000010'
    $scope.consumableSearch = function (keyword) {
        //跟踪云埋点
        try{
            window.eventSupport.emit('heimdallTrack',{
                ev:"1",
                kw:keyword
            });
        }catch(e) {
            //console.log(e);
        }
        try {
            gtag('event','search',{
                search_term:keyword
            })
        } catch (e) {
            console.log(e);
        }
        //产品化1.3接口不需要替换
        //keyword =keyword.replace(/@/g,'').replace(/\/\/\)/g,'').replace(/>/g,'').replace(/</g,'').replace(/--/g,'').replace(/;/g,'').replace(/\(/g,'').replace(/\)/g,'').replace(/\（/g,'').replace(/\）/g,'') ;
        // scope.keyword = (keyword || scope.keyword).substring(0, maxLength);
        if($scope.keyword == undefined){
            $scope.keyword = '耗材';
        }
        $scope.keyword = decodeURIComponent((keyword || $scope.keyword))
        //搜索历史不区分登录与未登录 全部读取接口
        //var keywordsList = localStorage.getItem('keywordsList');
        //如果登录就保存搜索词，并提交后台，否则仅保存localStorage中
        /*var ut = $rootScope.util.getUserToken();
        var arr = [];
        if (!scope.keyword) {
            if (scope.searcwordUrl) {
                window.location = scope.searcwordUrl;
            }
        }
        if (keywordsList) {
            arr = keywordsList.toString().split(',');
            var keywordIndex;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == keyword) {
                    keywordIndex = i;
                }
            }
            if ($.inArray(keyword, arr) > -1) {
                arr.splice(keywordIndex, 1);
                arr.unshift(keyword);
            }
            if (!($.inArray(keyword, arr) > -1) && keyword != '') {
                // arr.push(keyword);
                arr.unshift(keyword);
            }
            keywordsList = arr.join(',');

        } else {
            keywordsList = scope.keyword;
        }
        localStorage.setItem('keywordsList', keywordsList);*/
        var url = '/consumable.html?navCategoryIds=' + $scope.defaultCategory + '&categoryTreeNodeId=' +  $scope.defaultCategory + '&keyword=' + encodeURIComponent($scope.keyword || $scope.defaultKeyword);
        var areaCode = $rootScope.localProvince.province.provinceCode;
        var guid = encodeURI(localStorage.getItem("heimdall_GU"));
        if (areaCode) {
            url += '&areaCode=' + areaCode;
        }
        if (guid){
            url += '&guid=' + guid;
        }
        //积分页面的头部搜索，跳转积分搜索页面
        // var pointPage = ['/integral.html','/intergralList.html','/integralSearch.html'];
        // if($.inArray(location.pathname, pointPage) > -1){
        //     url = '/integralSearch.html?keyword=' + encodeURIComponent(scope.keyword || scope.defaultKeyword);
        // }
        // if (scope.searchType != 'good') {
        //     url += '&searchType=' + $scope.searchType;
        // }
        window.location = url;
    };
    //回车搜索
    $scope.consumableAutoSearch = function ($event, keyword) {
        if ($event.keyCode === 13) {
            if(keyword == undefined){
                $scope.consumableSearch('耗材');
            }else{
                $scope.consumableSearch(keyword);
            }
            try {
                gtag('event','search',{
                    search_term:keyword
                })
            } catch (e) {
                console.log(e);
            }
        }
    };

    // ===================================

    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
    //默认省份与迷你购物车
    $rootScope.execute(true);
    // 所有属性
    $scope.spesList = []
    $scope.proProptyList = []

    $scope.params ={
        itemId : ''
    }
    // 史泰博新增收藏夹功能
    $scope.obj ={
        hasFavorite: 1,
        labelText: '',
        isCheckFavorite: false,
        labelList: [],
        hasChooseLabel: false
    }
    // 获取已有标签列表
    $scope.getLabelList = function() {
        let url = '/custom-sbd-web/advFavoritesTag/queryAdvFavoritesTag.do'
        let params = {
            collectOrShare: 0
        }
        $rootScope.ajax.postJson(url,params).then(function(res){
            if (res.code ==0 && res.result) {
                $scope.obj.labelList = res.result || []
            }
        })
    }
    $scope.getLabelList();

    // 选择已有标签
    $scope.chooseLabel = function(item) {
        $scope.obj.hasChooseLabel = true
        angular.forEach($scope.obj.labelList,function(ele){
            ele.checked = false
        })
        item.checked = true
    }
    // 监听标签属性
    $scope.$watch('obj.hasFavorite',function(newVal){
        if (newVal == 1) {
            $scope.obj.labelText = ''
        } else if(newVal ==0) {
            $scope.obj.hasChooseLabel = false
            angular.forEach($scope.obj.labelList,function(ele){
                ele.checked = false
            })
        }
    })
    // 确认创建标签
    $scope.confirmSetLabel = function(flag) {
        let url = '/ouser-center/api/favorite/add.do'
        let params = {
            entityType: 1,
            entityId: $scope.params.itemId,
        }
        if( $scope.obj.labelText.length > 10) {
            $rootScope.error.checkCode($scope.i18n('标签字符限制1-10个字符'), $scope.i18n('标签字符限制1-10个字符'))
            return
        }
        // 收藏已有标签
        if (flag == 1) {
            angular.forEach($scope.obj.labelList,function(ele){
                if (ele.checked == true) {
                    params.favoriteTagId = ele.id
                }
            })
        } else if(flag ==2) {
            // if($scope.obj.labelList.length >= 1) {
            //     $rootScope.error.checkCode($scope.i18n('仅支持创建一个共享标签'), $scope.i18n('仅支持创建一个共享标签'))
            //     return
            // }
            params.tagName = $scope.obj.labelText
        }
        $rootScope.ajax.post(url,params).then(function(res){
            if (res.code ==0) {
                $scope.obj.isCheckFavorite = false
                $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n('收藏成功！'));
                $scope.isFavorite = true;
            } else {
                $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n(res.message));
            }
        })
    }
    // 跳转收藏夹
    $scope.goToCollect = function() {
        location.href = '/home.html#/frequence'
    }
    //本地公用方法
    $scope.getUt = function () {
        return $rootScope.util.getUserToken();
    };
    // 获取商品是否上下架
    $scope.getItemCansale = function (){
        return  new Promise((resolve, reject) => {
            var url = "/search/rest/queryMpCanSale";
            var params = {
                mpIds : $scope.params.itemId
            }
            $rootScope.ajax.post( url , params ).then( function ( res ) {
                if( res.code == 0 && res.data && res.data.dataList && res.data.dataList.length > 0 ) {

                    for( let i = 0 ; i < res.data.dataList.length ; i++ ) {
                        if( $scope.params.itemId == res.data.dataList[i].mpId ) {
                            $scope.productManagementState= res.data.dataList[i].canSale;
                        }
                    }
                }
                resolve($scope._checkFavorite())
            })
        })
    };
    // 判断商品是否已经收藏
    $scope._checkFavorite = function () {
        return  new Promise((resolve, reject) => {
            var url = "/ouser-center/api/favorite/queryIsFavorite.do",
                params = {
                    entityType: 1,//商品
                    entityId: $scope.params.itemId
                }
            $rootScope.ajax.post(url, params).then(function (res) {
                if (res.code == 0){
                    $scope.isFavorite = res.data.isFavorite;
                }else {
                    $scope.isFavorite = false;
                    return;
                }
                resolve($scope.addToFavorite())
            })
        })
    };
    //加入收藏
    $scope.addFavorite = function (product){
        $scope.params.itemId = product.mpId
        $scope._checkFavorite();
        $scope.getItemCansale();
    };
    //将商品加入收藏
    $scope.addToFavorite = function (){
        if(!$scope.productManagementState){
            $scope.favoriteSoldOut=true;
        }
        $scope.sureCheckFavorite = false;
        if ($scope.isFavorite) {
            $scope.sureCheckFavorite = true;
            return;
        }
        $scope.obj.isCheckFavorite = true;
    };
    // 关闭收藏弹框
    $scope.closeCheckFavorite = function() {
        $scope.sureCheckFavorite = false;
    }
    $scope.closeFavoriteSoldOut = function() {
        $scope.favoriteSoldOut = false;
    };
    $scope.$on('addFavorite',function ($event,data) {
        $scope.addFavorite(data)
    })
    // ======================================

    $scope.promotionId = false;
    $scope.crumbList = [];
    $scope.selectOptions={};
    $scope.priceRange={};
    $scope.searchObj={
        pageNo:1,
        pageSize:10,
        totalCount:0,
        checkAll:false
    };

    $scope.showCompare = false;
    $scope.$on('updateCompareBox',function ($event,data) {
        $scope.updateCompareBox(data);
    });
    // 改变对比盒显示状态
    $scope.updateCompareBox = function(param) {
        $scope.showCompare = param
    };
    $scope.$on('getCompareBox',function () {
        $scope.getCompareBox()
    });
    // 清空对比盒
    $scope.clearAllCompare = function() {
        if (!$scope.compareBoxList[0].mpId) {
            return false
        }
        var url = $rootScope.home + '/custom-sbd-web/product/deleteComparisonBox.do';
        $scope.compareBoxList.forEach((v,i)=>{
            if (v.mpId) {
                $rootScope.ajax.postJson(url,{merchantProductId:v.mpId}).then(res=>{
                    if (res.code == 0 ) {
                        $scope.delCompare(v.mpId);
                        if ((i+1) === $scope.compareBoxList.length) {
                            $scope.compareBoxList = [{},{},{},{}]
                        }
                    }else{
                        $rootScope.error.checkCode($scope.i18n('删除失败'),$scope.i18n('删除失败'),{
                            type:'info'
                        });
                    }
                },function (result) {
                    $rootScope.error.checkCode($scope.i18n('系统异常'),$scope.i18n('系统异常'),{
                        type:'info'
                    });
                });
            } else {
                if ((i+1) === $scope.compareBoxList.length) {
                    console.log($scope.compareBoxList.length);
                    $scope.compareBoxList = [{},{},{},{},{}]
                }
            }
        });
    };
    // 获取对比列表
    $scope.getCompareBox = function() {
        //查询商品属性
        let url = '/custom-sbd-web/product/getCurrentUserComparisonBox.do';
        $rootScope.ajax.postJson(url,{}).then(res=>{
            if (res.code == 0  && res.data) {
                $scope.compareBoxList = res.data.concat([{},{},{},{},{}]).slice(0,5)
                $scope.searchedObj.productList.forEach(v => {
                    $scope.compareBoxList.find(cv=>{
                        if (cv.mpId===v.mpId) {
                            v.compare = true
                        }
                    })
                })
            }
        },function (result) {
            $rootScope.error.checkCode($scope.i18n('系统异常'),$scope.i18n('系统异常'),{
                type:'info'
            });
        })
    };
    // 取消选中时取消勾选
    $scope.$on('delCompare',function (e,mpId) {
        $scope.delCompare(mpId)
        $scope.getCompareBox()
    });
    $scope.delCompare = function (mpId) {
        $scope.searchedObj.productList.find(v=>{
            if (v.mpId === mpId) {
                v.compare = false
            }
        });
    };

    $rootScope.switchConfig.guide.search.showMiniCartBtn = true;
    $rootScope.switchConfig.guide.search.searchShowRecommendGood = true;
    //搜索值的时候只能输入最大两位小数
    //第一位必须是数字
    //然后小数点可有可无
    //小数点后最多两位数字
    $scope.formatDecimals=function(item){
        $scope.displayCheck=true;
        if(!item){
            return;
        }
        if(item.match(/^\d+(\.\d{1,2}|\d*)/gi)){
            return item.match(/^\d+(\.\d{1,2}|\d*)/gi)[0];
        }
        return '';
    }
    //分页功能
    $scope.$on('changePageNo', function (event, data) {
        $scope.searchObj.pageNo = data;
        $scope.getProduct();
    })
    //如果列表页可以加入购物车， 监听子控制器的事件
    $rootScope.$on('updateMiniCartToParent',function () {
        //监听到事件后再广播出去
        $scope.$broadcast('updateMiniCart');
    });
    $scope.brandName=$scope.i18n("品牌");
    $scope.noResult = true ;
    $scope.initSearch=function() {
        //如果地址栏有参数
        if (location.search.length > 0) {
            //获取地址栏参数
            // var urlParams = util.paramsFormat(location.search);
            //如果搜索参数有keyword,使用搜索模式
            if (typeof urlParams.keyword !== 'undefined') {
                $scope.isList = false;//搜索框跳转
                $scope.searchObj.keyword = decodeURIComponent(urlParams.keyword)
                $scope.searchObj.keyword =$scope.searchObj.keyword.replace(/@/g,'').replace(/\/\/\)/g,'').replace(/>/g,'').replace(/</g,'').replace(/--/g,'').replace(/;/g,'').replace(/\(/g,'').replace(/\)/g,'').replace(/\（/g,'').replace(/\）/g,'');
                if (!$scope.searchObj.keyword) {
                    $scope.searchObj.keyword = $scope.i18n('搜索词');
                }
                //如果搜索参数没有keyword,但有categoryIds,则使用列表模式
            } else if (typeof urlParams.keyword === 'undefined' && typeof urlParams.navCategoryIds !== 'undefined') {
                $scope.isList = true;//类目跳转
            }
            //共通参数
            //$scope.searchObj.categoryIds = urlParams.categoryIds;
            //$scope.searchObj.categoryType = urlParams.categoryType;
            $scope.searchObj.navCategoryIds = urlParams.navCategoryIds||urlParams.categoryIds;
            if ($rootScope.switchConfig.common.companyProjectType == 'b2b') {
                delete $scope.searchObj.navCategoryIds;
                $scope.searchObj.mCategoryIds = urlParams.navCategoryIds||urlParams.categoryIds;
            }

            if (urlParams.artNoSearch) {
                $scope.searchObj.artNoSearch = urlParams.artNoSearch
            }
            // var mixAttrValueIds = urlParams.attrValueIds;
            // var mixAttrValueIdsArr = (mixAttrValueIds && mixAttrValueIds.split(':')) || [];
            // $scope.searchObj.attributeId=mixAttrValueIdsArr[0] || '';
            var attrsObj = getAttrJson(urlParams.attrValueIds);
            $scope.searchObj.attrValueIds = attrsObj.tempIds.join(',');
            $scope.searchObj.shoppingGuideJson = JSON.stringify(attrsObj.tempJson);


            $scope.searchObj.companyId = urlParams.companyId;
            $scope.searchObj.brandIds = urlParams.brandIds;
            $scope.searchObj.pageNo = parseInt(urlParams.pageNo || $scope.searchObj.pageNo);
            $scope.searchObj.pageSize = parseInt($scope.searchObj.pageSize);
            $scope.searchObj.sortType = urlParams.sortType || $scope.searchObj.sortType||10;
            $scope.searchObj.filterType=urlParams.filterType;

            $scope.categoryTreeNodeId = urlParams.categoryTreeNodeId;
            if($scope.searchObj.priceRange=urlParams.priceRange) {
                var tpr = $scope.searchObj.priceRange.toString().split(',');
                if ($scope.searchObj.priceRange) {
                    $scope.priceRange.from = tpr[0] == 0 ? '' : tpr[0];
                    $scope.priceRange.to = tpr[1] == 0 ? '' : tpr[1];
                }
            }

            if($scope.isList) {
                //获取类目面包屑
                $rootScope.getCrumbList($scope.categoryTreeNodeId, function (result) {//获取类目面包屑$scope.searchObj.categoryIds
                    //$log.debug('crumbList', result);
                    if (result && result != null && typeof result.data !== 'undefined' && result.data != null) {
                        $scope.crumbList = result.data;
                    }
                });
            }
        } else {
            //Get the keyword from service.
            // angular.extend($scope.searchObj,$rootScope.searchObj,{keyword:""});
            $scope.searchObj.keyword = "";
            $scope.searchObj.pageNo = $rootScope.searchObj.pageNo;
            $scope.searchObj.pageSize = $rootScope.searchObj.pageSize;
            $scope.searchObj.sortByType = $rootScope.searchObj.sortByType;
        }
    }();

    //Test page number which should be provided by back-end.
    $scope.pageTotal=0;

    //Pagination
    $scope.pageList=[]

    //导购属性/商品分类
    $scope.displayTitle= $scope.isList?$scope.i18n('导购属性'):$scope.i18n('商品分类');
    //$log.debug($scope.searchObj)

    //获取并格式化过滤属性
    function getAttrJson(attrParam){

        var attrJson={
            attributeJson:[]
        };
        var tempAttrValueIds = [];
        //var selectedPropIdsList=[];
        if(attrParam && attrParam.length>0){
            var l1=attrParam.replace(/\"/g,'').toString().split(',');
            if(l1.length>0){
                angular.forEach(l1, function (v) {
                    var l2=[];
                    if(v.length>0&&v.indexOf(":")>0&&(l2=v.toString().split(":")).length==2) {
                        var l21=[];
                        if(l2[1].split("-").length>0){
                            angular.forEach(l2[1].toString().split("-"), function (v) {
                                l21.push(v-0);
                                //selectedPropIdsList.push(v);
                            })
                        }
                        attrJson.attributeJson.push({
                            attributeId: l2[0]-0,
                            attrValueIds: l21
                        });
                        tempAttrValueIds = tempAttrValueIds.concat(l21);
                    }
                });
            }
        }
        return {
            tempJson:attrJson,
            tempIds:tempAttrValueIds
        }
    }
    //全选/全部选
    $scope.checkAllBtn = function () {

        if ($scope.searchObj.checkAll) {
            angular.forEach($scope.searchedObj.productList, function (val) {
                val.isChecked = true;
            })
        } else {
            angular.forEach($scope.searchedObj.productList, function (val) {
                val.isChecked = false;
            })
        }
    };


    $scope.$on('checkAllBtn2', function (prod) {
        var flag = $scope.searchedObj.productList.some(function(val){
            return !val.isChecked
        });
        $scope.searchObj.checkAll = !flag;

    })

    $scope.channelMember = {

        tempProduct: [],//选中的商品
        //获取商品

        putTempProduct: function () {
            var that = this;
            if ($scope.searchedObj && $scope.searchedObj.productList) {
                angular.forEach($scope.searchedObj.productList, function (val) {
                    if (val.isChecked && that.tempProduct.indexOf(val.mpId) == -1) {
                        that.tempProduct.push(val.mpId)

                    }
                })
            }
        },
    }


    $scope.getProduct=function(flag,flag2) {
        let that = this;
        $scope.noResultFlag=false;
        var params = $rootScope.util.paramsFormat(location.href);
        var url = '/search/rest/searchList.do';
        $scope.searchObj.timer=new Date().getTime();
        $scope.searchObj.platformId = $rootScope.platformId;
        $scope.searchObj.ut = $rootScope.util.getUserToken() || false;
        $scope.searchObj.companyId=$rootScope.companyId;
        $scope.searchObj.promotionIds =params.promotionId;
        $scope.searchObj.v =2;//接口版本 v=2 不返回价格、库存、促销
        let guid = localStorage.getItem("heimdall_GU")
        guid = guid.replace(/\^/g,'')
        guid = guid.replace(/\`/g,'')
        $scope.searchObj.guid = guid;
        //增值服务,过滤商品
        $scope.searchObj.types = params.types;
        if (!flag) {
            var areaCode = $rootScope.localProvince.province.provinceCode;
            if (areaCode) {
                $scope.searchObj.areaCode = flag2?areaCode:'';
            }
        }
        var itemIds = [];
        $rootScope.ajax.get(url, $scope.searchObj).then(function (res) {
            if(res.code==0) {
                $scope.noResultKeyword = $scope.searchObj.keyword;
                $scope.noResultKeyword1=$scope.searchObj.keyword;
                $scope.noResultKeyword2 = $scope.searchObj.keyword;
                $scope.searchObj.totalCount = res.data.totalCount;

                $scope.totalPage = $scope.searchObj.totalCount % $scope.searchObj.pageSize == 0 ? (($scope.searchObj.totalCount / $scope.searchObj.pageSize) || 1) : parseInt($scope.searchObj.totalCount / $scope.searchObj.pageSize) + 1;
                if (typeof res.data !== 'undefined'){
                    $scope.searchedObj = angular.copy(res.data);
                    $scope.attrCheck();

                    //数据筛选
                    $scope.prodValidate($scope.searchedObj.productList);
                    //zeroRecommendWord 搜索结果为空时，返回推荐词
                    //zeroRecommendResult 搜索结果为空时，返回推荐商品  见product描述
                    //maybeInterestedKeywords 搜索结果为空时，推荐可能是用户感兴趣的关键词
                    if($scope.searchedObj.totalCount===0) {
                        if(!$scope.searchedObj.zeroRecommendWord){
                            $scope.noResultFlag = true;
                        }
                        $scope.noResultKeyword = $scope.searchObj.keyword;
                        $scope.noResultKeyword1 = $scope.searchObj.keyword;
                        $scope.noResultKeyword2 = $scope.searchObj.keyword;
                        $scope.searchedObj.productList=$scope.searchedObj.zeroRecommendResult;
                        $scope.searchFlie();
                    }else if(angular.isArray($scope.searchedObj.hotwordsRecommended)){
                        //$scope.lessResult=true;
                        $scope.noResultKeyword=$scope.searchObj.keyword;
                        $scope.noResultKeyword1=$scope.searchObj.keyword;
                        $scope.noResultKeyword2=$scope.searchObj.keyword;
                    }

                    if ($scope.searchedObj.productList && $scope.searchedObj.productList.length > 0){
                        for(var i= 0 ; i<$scope.searchedObj.productList.length;i++){
                            $scope.volume4sale = $scope.searchedObj.productList[i].volume4sale;
                            if( $scope.volume4sale.toString().length >= 5 ){
                                $scope.volume4sale  =  parseFloat($scope.volume4sale)/10000+$scope.i18n('万');
                            }

                            itemIds.push($scope.searchedObj.productList[i].mpId);
                        }
                        // angular.forEach($scope.searchedObj.productList, function (val) {
                        //     val.isChecked = false;
                        //     if ($scope.channelMember.tempProduct.length > 0) {
                        //         angular.forEach($scope.channelMember.tempProduct, function (val2) {
                        //             if (val2 == val.mpId) {
                        //                 val.isChecked = true;
                        //             }
                        //         })
                        //     }
                        // })

                    }
                    // $scope.$emit('checkAllBtn2')
                    if(itemIds.length>0){
                        $scope.getPriceStockList(itemIds);
                        // $scope.promotionInfo(itemIds);
                    }
                    if(typeof res.data.productList !== 'undefined')
                        $scope.pageTotal = Math.ceil($scope.searchedObj.totalCount / $scope.searchObj.pageSize);
                } else {
                    $scope.searchedObj = {};
                    $scope.noResultFlag = true;
                }
                $scope.pageList=$scope._pagination($scope.pageTotal,$scope.searchObj.pageNo);
                $scope.getCompareBox()

            }else{
                $rootScope.error.checkCode(res.code,res.message);
            }
        }, function () {
            $rootScope.error.checkCode($scope.i18n('异常'),$scope.i18n('搜索系统异常'));
        })
    };

    // 失败关键子
    $scope.searchFlie = function (){
        if ( $scope.searchObj.totalCount==0){
            let url = '/custom-sbd-web/searchFailWord/addFailWord.do'
            let params = {"failWord":$scope.searchObj.keyword}
            $rootScope.ajax.postJson(url,params).then(res => {
                if (res.code ==0 ) {
                    console.log("记录失败关键字成功")
                }
            })
        }
    }

    //获取实时价格库存
    $scope.getPriceStockList = function (itemIds){
        var itemIdss = itemIds.join(','),
            areaCode = $rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode: $rootScope.defaultAreasCode;
        var url = $rootScope.host + '/realTime/getPriceStockList?mpIds='+itemIdss+'&areaCode=' + areaCode;
        var promotionId =[];
        $rootScope.ajax.get(url, {}).then(function(res){
            var plistMap={};
            angular.forEach(res.data.plist||[], function (pl) {
                plistMap[pl.mpId]=pl;
            })
            angular.forEach($scope.searchedObj.productList||[], function (pl) {
                if(plistMap[pl.mpId]){

                    pl.scripts = [{
                        displayType: plistMap[pl.mpId].displayType,
                        scriptIconUrl: plistMap[pl.mpId].superscriptUrl
                    }]

                    var volume4sale = pl.volume4sale;
                    var displayType = pl.displayType;
                    var superscriptUrl = pl.superscriptUrl;
                    $.extend(pl,plistMap[pl.mpId]);
                    pl.volume4sale = volume4sale;
                    pl.displayType = displayType;
                    pl.superscriptUrl = superscriptUrl;
                }
            })

            console.log($scope.searchedObj.productList)

            // debugger

        })
    }

    //活动凑单页
    var params = $rootScope.util.paramsFormat(location.href);
    if(params.promotionId){
        $scope.promotionId = true;
        var url=$rootScope.host + '/product/promotionDetail?promotionId='+params.promotionId +'&'+'platformId='+$rootScope.platformId + '&merchantId=' + urlParams.merchantId;
        $rootScope.ajax.get(url, {}).then(function(res){
            if(res.code == 0){
                $scope.description = res.data.description;
                $scope.startTime = res.data.startTime;
                $scope.endTime = res.data.endTime;
            }
        })
        if ($rootScope.switchConfig.guide.search.showPromotionTip) {
            $rootScope.getCartExt(params.promotionId);
        }
    }else{
        $scope.promotionId = false;
    }

    //促销标签
    $scope.promotionInfo = function (itemIds){
        function arr(arr) {
            var result=[]
            for(var i=0; i<arr.length; i++){
                if(result.indexOf(arr[i])==-1){
                    result.push(arr[i])
                }
            }
            return result;
        }
        var itemIdss = itemIds.join(',')
        var url = $rootScope.host + '/promotion/promotionInfo?mpIds='+itemIdss;
        var promotionId =[];
        $rootScope.ajax.get(url, {}).then(function(res){
            $scope.promotionInfoData = res.data? res.data.promotionInfo: {};
            var arrData = [];
            angular.forEach( $scope.searchedObj.productList , function( val,inx ) {
                val.incoTextData = [];
                angular.forEach( $scope.promotionInfoData , function(x) {
                    if( x.mpId == val.mpId ) {
                        angular.forEach( x.promotions,function(a,index) {
                            val.incoTextData.push(a.iconText)
                        } )
                    }
                    val.incoTextData = arr(val.incoTextData);
                } )
            })
        })
    }
    //排列与过滤相关
    $scope.selectOptions= {
        //排序操作
        sort:function (code) {
            $scope.searchObj['sortType']=code; //替换或增加当前排序
            $scope.getProduct();
            //location.href='?'+util.urlFormat(obj); //重新编辑参数并跳转
        },
        //价格区间操作
        price:function (from,to) {
            if ( to === undefined || to === null ) {
                $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('请输入筛选金额'));
                return;
            }
            var from=from-0||0,to=to-0||0,arr = [];
            if(from==to&&to==0) {//如果最大最小范围都为0, 去除价格区间过滤器
                delete $scope.searchObj['priceRange'];
            } else if(from==0||to==0){ //如果有其中一个为0, 则直接拼接, 不判断大小
                arr.push(from,to);
                $scope.searchObj['priceRange'] = arr.join(); //否则修改或增加价格区间过滤器
            } else {  //如果两值都不为0
                //调整from与to的先后顺序
                if (from <= to){
                    arr.push(from,to);
                }else {
                    var oldFrom = angular.copy($scope.priceRange.from);
                    $scope.priceRange.from=angular.copy($scope.priceRange.to);
                    $scope.priceRange.to = oldFrom;

                    arr.push(to,from);

                }
                $scope.searchObj['priceRange'] = arr.join(); //否则修改或增加价格区间过滤器
            }
            $scope.getProduct();
            //location.href='?'+util.urlFormat(obj); //重新编辑参数并跳转
        },
        //过滤操作
        filter:function (code) {
            if($scope.searchObj['filterType']&&$scope.searchObj['filterType'].indexOf(code)>-1){//如果已经存在当前过滤器
                //去除选中的过滤器
                var reg = new RegExp('(,'+code+'|^'+code+',?)','gi');
                $scope.searchObj['filterType']=$scope.searchObj['filterType'].replace(reg,'');
                //如果去除选中过滤器后只剩下空字符串, 直接把当前属性删除
                if($scope.searchObj['filterType']=='') delete $scope.searchObj['filterType'];
            }else { //如果不存在当前过滤器, 新增
                $scope.searchObj['filterType'] = $scope.searchObj['filterType'] ? [$scope.searchObj['filterType'], code].join() : code;
                if(code=='AREA_SELL'){
                    $scope.getProduct(false,true);
                    return;
                }
            }
            $scope.getProduct();
        }
    };
    /**
     * 验证(如果商品价格为null，则不显示)
     * @param productList
     */
    $scope.prodValidate = function(productList) {
        var validatedList=[];
        if(typeof productList!=='undefined' && angular.isArray(productList)) {
            angular.forEach(productList, function (product) {
                validatedList.push(product);
            });
        }
        $scope.searchedObj.productList=validatedList;
        angular.forEach($scope.searchedObj.productList,function(val){
            if( val.volume4sale > 10000 ) {
                val.volume4sale = (val.volume4sale / 10000).toFixed(1) + $scope.i18n('万');
            }
            if( val.commentInfo && val.commentInfo.commentNum > 10000 ) {
                val.commentInfo.commentNum = (val.commentInfo.commentNum / 10000).toFixed(1) + 搜索系统i18n('万');
            }
        })
    }

    /**
     * 属性判断,如果有被选中的属性标记出来
     */
    $scope.attrCheck=function(){
        var attrArray=$scope.searchObj.attrValueIds||"";
        var brandArray = $scope.searchObj.brandIds||"";
        $scope.activeAttr=[];

        if(brandArray.length>0&&angular.isArray($scope.searchedObj.brandResult)&&$scope.searchedObj.brandResult.length>0) {
            var title = $scope.i18n('品牌'), ids = brandArray, values = '';
            brandArray=brandArray.toString().split(',');
            angular.forEach($scope.searchedObj.brandResult, function (brand) {
                if ($.inArray(brand.id.toString(), brandArray) >= 0) {
                    brand.active=true; //属性是选中属性
                    values+=brand.name+",";
                }
            })
            $scope.activeAttr.push({
                title:title,
                ids:ids,
                values:values.substr(0,values.length-1)
            })
        }
        if(attrArray.length>0&&$scope.searchedObj.attributeResult&&angular.isArray($scope.searchedObj.attributeResult)){
            attrArray=attrArray.toString().split(',');
            angular.forEach($scope.searchedObj.attributeResult,function(attrs){
                if(angular.isArray(attrs.attributeValues)){
                    var title=attrs.name,ids="",values="";
                    angular.forEach(attrs.attributeValues,function(attrV){
                        if($.inArray(attrV.id.toString(), attrArray)>=0){
                            attrV.active=true;//属性是选中属性
                            attrs.active=true;//此类属性是选中属性类
                            ids+=attrV.id+",";
                            values+=attrV.value+",";
                        }
                    });
                    if(ids.length>0) {
                        $scope.activeAttr.push({
                            title:title,
                            ids:ids.substr(0,ids.length-1),
                            values:values.substr(0,values.length-1)
                        })
                    }
                }
            })
        }
    }
    //搜索商品
    $scope.getProduct();

    // Default page
    $scope.defaultPage = function () {
        var search = $location.search();
        if (search.pageNo != undefined) {
            $scope.searchObj.pageNo = parseInt(search.pageNo);
        } else {
            $location.search('pageNo', $scope.searchObj.pageNo)
        }
    }();
    //Previous page
    $scope.prev=function(){
        if($scope.searchObj.pageNo<=1) {
            return;
        }
        $scope.searchObj.pageNo--;
        $scope._pagination($scope.pageTotal,$scope.searchObj.pageNo);
        $scope.getProduct();
    }
    //Next page
    $scope.next=function(){
        if($scope.searchObj.pageNo>=$scope.pageTotal) {
            return;
        }
        $scope.searchObj.pageNo++;
        $scope._pagination($scope.pageTotal,$scope.searchObj.pageNo);
        $scope.getProduct();
    }
    //Locating page
    $scope.locate=function($event,num){
        $scope.searchObj.pageNo=num;
        $scope._pagination($scope.pageTotal,num);
        $scope.getProduct();
    }

    var flag = false;
    $rootScope.$watch('localProvince.gotAreas.area.code',function (v) {
        if (flag) {
            $scope.searchObj['areaCode']=$rootScope.localProvince.gotAreas.area.code;
            $scope.getProduct(true);
        }
        flag = true;
    })

    //定位到排序栏
    $('body').on('click','#paging a',function(){
        $location.hash('sctoolbar');
        $anchorScroll();
        $location.search('pageNo', $scope.searchObj.pageNo);
    });


    $scope.isShow=[];
    $scope._pagination=function(totalPage,currentPage){
        var pageList=[];
        currentPage=currentPage||1;
        for(var i=2;i<totalPage;i++) {
            pageList.push(i);
            if(i>currentPage&&i-currentPage<4||i<currentPage&&currentPage-i<4||i==currentPage)
                $scope.isShow[i-2]=true;
            else
                $scope.isShow[i-2]=false;
        }
        return pageList;
    }
}]);
