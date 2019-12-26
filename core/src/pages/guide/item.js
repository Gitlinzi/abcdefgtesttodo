        /**
 * Created by Roy on 15/10/23.
 */

appControllers.controller("detailCtrl", ['$q','$log','$rootScope','$scope','$sce','$cookieStore','commonService','categoryService','config','$filter', '$interval', '$timeout', '$window',function($q,$log,$rootScope,$scope,$sce,$cookieStore,commonService, categoryService,config,$filter,$interval,$timeout, $window){
    "use strict";
    //国际化
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };   
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
    $scope.getLabelList()
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
            entityId: $scope.itemId,
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
                $scope.pcIteminfo._init()
            } else {
                $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n(res.message));                
            }
        })
    }
    // 跳转收藏夹
    $scope.goToCollect = function() {
        location.href = '/home.html#/frequence'
    }
    //商品基础信息
    $scope.itemConfig = {
        pageSize:16,
        showIndex: true,        //显示标签型的index
        showSalesVolume: true,  //显示热销多少件
        showName: false,          //显示商品名
        showPromotion: false,      //显示促销标签
        type: 'crumb',
        size: 4,                 //每次显示几个， 与showHeight有关 size: 3,showHeight: 696,
        showHeight: 959,          //因为看了又看显示的标签不一样， 所以设置不同的高度
        addHeight: 50,
        domName: 'crumb-look-and-see-dom'
    }
    var _ut = $rootScope.util.getUserToken();
    $scope.parseInt = $window.parseInt;
    $scope.params={};
    $scope.sessionId=$rootScope.sessionId;
    $scope.serialProducts=[];
    // 获取发货仓
    $scope.param1 = {}
    // 预置订单
    $scope.advanceShow = false;
    //初始化翻页, 切换tab的时候也会初始化分页
    $scope.initPagination = function () {
        $scope.pageNo = 1;
        $scope.pageSize = 10;
        $scope.totalCount = 0; 
    };
    //翻页广播接收
    $scope.$on('changePageNo', function (event, data) {
        "use strict";
        $scope.pageNo = data;
        $scope.advanceOrder.getOrderList();
    })
    $scope.initPagination();
    // 时间组件
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
    };
    $scope.advanceOrder = {
        id: '',
        name :'',
        createTimeStart :'',
        createTimeEnd: '',
        advanceList:{},
        allCheck: false,
        checkList: [], //选中数列
        // 初始化操作
        // init: function(){
        //     var that = this;
        //     that.getOrderList();
        // },
        goto: function(){
            $rootScope.util.removeLocalItem('advanceData')
            location.href = '/home.html#/advanceCreateOrder?code=' + $scope.itemlist.code + '&num=' + $scope.pcIteminfo.itemAmount;
        },
        getOrderList: function(data){
            "use strict";
            var that = this;
            var url = '/custom-sbd-web/sbdOrder/queryOrderTemplateList.do';
            var params = {
                offset: $scope.pageNo -1 ,
                limit: $scope.pageSize,
                id: that.id,
                name: that.name,
                createTimeStart: that.createTimeStart,
                createTimeEnd : that.createTimeEnd ,
            }
            $rootScope.ajax.postJson(url, params).then(function (res) {
                if (res.code == 0 && res.result.listObj) {
                    that.advanceList = res.result.listObj;
                    if(that.allCheck){
                        angular.forEach(  res.result.listObj , function( q,i ) {
                            that.advanceList[i].checked = that.allCheck;
                            that.checkList.push({'id':q.id,'checked':true});
                        } )
                    }else{
                        angular.forEach(  that.checkList , function( q,i ) {
                            angular.forEach(  res.result.listObj , function( q1,i1 ) {
                                if(q1.id == q.id && q.checked){
                                    that.advanceList[i1].checked = true;
                                }else{
                                    if(q1.checked){
                                        that.advanceList[i1].checked = true;
                                    }else{
                                        that.advanceList[i1].checked = false;
                                    }
                                }
                            } )
                        } )
                    }
                    $scope.totalCount = res.result.total;
                    $scope.totalPage = $scope.totalCount % $scope.pageSize == 0 ? (($scope.totalCount / $scope.pageSize) || 1) : parseInt($scope.totalCount / $scope.pageSize) + 1;
                }else{
                    $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n(res.result));
                }
            });
        },
        // 重置
        resetInfo: function(){
            "use strict";
            var that = this;
            that.id =  '';
            that.name = '';
            that.createTimeStart =' ';
            that.createTimeEnd = '';
            that.checkList = [];
            that.allCheck = false;
        },
        closeAdvance: function(){
            $scope.advanceShow = false;
            $scope.initPagination();
            this.resetInfo();
            this.getOrderList();
        },
        // 全选
        allCheckbox: function(){
            var that = this;
            that.allCheck = !that.allCheck;
            if(that.allCheck ){
                angular.forEach(  that.advanceList , function( q,i ) {
                    that.advanceList[i].checked = true;
                    that.checkList.push({'id':q.id,'checked':true});
                } )
            }else{
                angular.forEach(  that.advanceList , function( q,i ) {
                    that.advanceList[i].checked = false;
                    that.checkList.push({'id':q.id,'checked':false});
                } )
            }
        },
        // checkbox 选中事件
        change: function(item){
            var that = this;
            if(item.checked){
                that.checkList.push({'id':item.id,'checked':true});
                // 循环判断列表中，全选则全选按钮选中
                for(var i = 0;i<that.advanceList.length;i++){
                    if(!that.advanceList[i].checked){
                        break;
                    }
                }
                if(i==that.advanceList.length){
                    that.allCheck = true;
                }
            }else{
                that.allCheck = false;
                angular.forEach(  that.checkList , function( q,i ) {
                    if(q.id == item.id){
                        q.checked = false;
                    }
                } )
            }
        },
        //加入
        addAdvance: function(){ 
            "use strict";
            var that = this;
            // 判断是否有选择的预置订单编号
            for(var i = 0;i<that.checkList.length;i++){
                if(that.checkList[i].checked){
                    break;
                }
            }
            if(i==that.checkList.length){
                $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n('请先选择预置订单编号'));
                return;
            }
            // end
            var list = [];
            angular.forEach(  that.checkList , function( q,i ) {
                if(q.checked){
                    list.push(q.id);
                }
            } )
            var url = '/custom-sbd-web/sbdOrder/addMpToTemplates.do';
            var params = {
                soTemplateIds :list,
                items :[{"mpCode": $scope.itemlist.code,num:1}],
            }
            $rootScope.ajax.postJson(url, params).then(function (res) {
                if (res.code == 0) {
                    $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n('添加成功'));
                    that.closeAdvance();
                }else{
                    $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n(res.result));
                }
            });
        }
    }
    $scope.advanceOrder.getOrderList();
    //监听子控制器的事件
    $rootScope.$on('updateMiniCartToParent',function () {
        //监听到事件后再广播出去
        $scope.$broadcast('updateMiniCart');
    })
    $scope.getData = Date.parse(new Date());
    $scope.area = {};
    $scope.area.areaTab = 1;
    $scope.hideHeadAddress=false;
    $scope.noneMoney = $scope.i18n('暂无价格');
    $scope.openSeckill=config.openSeckill;
    var urlParams = $rootScope.util.paramsFormat(location.search);
    $scope.itemId=urlParams.itemId;
    $scope.isPointPro=urlParams.isPointPro;

    var search=location.search;
    // 史泰博ADV商详页类目改造
    $scope.getcrumbList = function() {
        let url = '/custom-sbd-web/product/getCategoryByMpId.do'
        let params = {
            mpId: $scope.itemId
        }
        $rootScope.ajax.postJson(url,params).then(res => {
            if (res.code ==0) {
                $scope.crumbList = res.data.list || []
            }
        })
    }
    $scope.getcrumbList()
    if(search.length>0) {
        var urlParams = $rootScope.util.paramsFormat(location.search);
        $scope.params={
            companyId:urlParams.companyId||'',
            itemId:urlParams.mpId||urlParams.itemId||'',
            platform:urlParams.platform||''
        };
        //如果存在shopId和merchantId默认为是店铺详情页
        if (typeof urlParams.shopId !== 'undefined' && typeof urlParams.merchantId !== 'undefined') {
            $scope.isStoreItem=true;
            $scope.shopId=urlParams.shopId;
            $scope.merchantId=urlParams.merchantId;
        }
    }
    //以下是需要重置的值
    //店铺详细相关参数
    $scope.isStoreItem=false;
    $scope.crumbList = [];
    $scope.isProductLoading = false;
    //套餐用到的参数
    $scope.packageAttrArr = [];
    $scope.jqimgindex = 0;
    $scope.selectedPromotion={};//选中促销列表
    $scope.isShowNoProduct=false;//默认有商品时
    $scope.canExchange = true;
    $rootScope.execute(true);
    $scope.itemlist=[];
    $scope.itemlistStore=[];
    $scope.preSalePromotionStore={};
    $scope.packageItemListStore = [];
    $scope.itemAttrUrl= "";
    $scope.itemAttrSpec= "";
    $scope.tmid = 0;
    $scope.attrs = [];//系列品属性集合
    $scope.mpses = [];//系列品商品集合
    $scope.selects = [];//选中的属性组合
    //促销相关
    $scope.promotionInfo=null;//促销信息
    $scope.promotionType_s=null;//单一促销
    $scope.promotionType_m=[];//非单一促销
    $scope.isMainBoolthree = true;
    $scope.promotionNum=1;
    $scope.noArrowLeft=true;//满赠弹框默认不可点击
    $scope.yesArrowLeft=false;
    $scope.yesArrowRight=false;
    //大图下面的切换按钮
    $scope.noImgArrowLeft=true;
    $scope.yesImgArrowLeft=false;

    //套餐切换按钮
    $scope.isPackageUpMove=false;
    $scope.isPackageDownMove=true;
    //优惠券
    $scope.curruntTabCoupon=1;
    $scope.couponShow=false;
    $scope.btnEndLoading = true;
    $scope.endOtherLoading = true;
    //套餐
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }
    $scope.changeUrl = function(url){
        //判断link是否以http:开头以及是否在小程序环境中
      if (window.__wxjs_environment === "miniprogram") {
        return "https:" + url;
      } else {
        if (!/^http\:/gi.test(url)) {
            return "http:" + url;
        } else {
            return url;
        }
      }
    }
    $scope.lockBg = function () {
        angular.element('body').css('overflow', 'hidden');
    }
    $scope.unlockBg = function () {
        angular.element('body').css('overflow', 'auto');
    }
    $scope.packageMethod = {
        chosePackage: function (packageList,packageInfo,clickPackage,isChange,index) {
            if( GetQueryString('mainItemId') && isChange ) {
                angular.forEach( clickPackage , function( q ) {
                    if( q.level == 1 && q.flag ) {
                        $scope.packageMove(q.mpList.length);
                    }
                    if( q.level == 1 ) {
                        $scope.packageTeamMove(clickPackage.length-1);
                    }
                } )
                $scope.clickPackage = clickPackage;
                packageInfo.checked = true;
                angular.forEach( packageList , function(x) {
                    if( x.promotionId != packageInfo.promotionId ) {
                        x.checked = false
                    }
                } )
                var arrData = [];
                angular.forEach( packageInfo.promotionRuleList,function(q) {
                    if( q.level != 0 ) {
                        arrData.push(q);
                    }
                } )
                angular.forEach( arrData,function(g) {
                    g.flag = false;
                    arrData[0].flag = true;
                } )
                $scope.packageObject = arrData;
                $scope.limitToValue = arrData[0].conditionValue
            } else {
                $scope.initOrderData = [];
                angular.forEach( clickPackage , function(q) {
                    // if( q.level == 1 && q.flag  ) {
                    //     $scope.packageMove(q.mpList.length);
                    // }
                    if( q.level == 1 ) {
                        $scope.packageTeamMove(clickPackage.length-1);
                    }
                    q.packageChoseNum = 0;
                    q.num=0;
                    q.isChecked = false;
                    angular.forEach( q.mpList , function(a) {
                        a.isChose = false;
                        a.mainIsChose = false;
                        a.num = 0;
                    } )
                } )
                $('.bottom-text').html($scope.i18n("已选") + '<b>0<b>' + $scope.i18n("个"));
                $scope.isActive = false;
                $scope.isDisabled = true;
                $scope.packageTotalNum = 0;
                $scope.totalMoney = 0;
                $("#packageGood").css({
                    left:'0px'
                })
                $scope.clickPackage = clickPackage;
                packageInfo.checked = true;
                angular.forEach( packageList , function(x) {
                    if( x.promotionId != packageInfo.promotionId ) {
                        x.checked = false
                    }
                } )
                var arrData = [];
                angular.forEach( packageInfo.promotionRuleList,function(q) {
                    if( q.level != 0 ) {
                        arrData.push(q);
                    }
                } )
                angular.forEach( arrData,function(g) {
                    g.flag = false;
                } )
                arrData[0].flag = true;
                $scope.packageMove(arrData[0].mpList.length);
                $scope.packageObject = arrData;
                $scope.limitToValue = arrData[0].conditionValue
            }
        },
        choseTeam: function (v) {
            angular.forEach($scope.packageObject, function (val) {
                val.flag = false;
            })
            v.flag = true;
            $scope.limitToValue = v.conditionValue;
            $scope.packageMove(v.mpList.length)
        },
        addPackageData: function() {
            var initOrderPackageData = {"mpId":$scope.packageVirtualGood.mpId,"num":$scope.packAgeItemAmount,"itemType":1025,"objectId":$scope.packageVirtualGood.promotionId,"isMain":0,"additionalItems":[{"mpId":$rootScope.packageServiceGoodId,"num":1}]};
            if( $rootScope.packageServiceGoodId === null ) {
                initOrderPackageData = {"mpId":$scope.packageVirtualGood.mpId,"num":$scope.packAgeItemAmount,"itemType":1025,"objectId":$scope.packageVirtualGood.promotionId,"isMain":0}
            }
            $scope.initOrderData.push(initOrderPackageData);
            $scope.initOrderDataIm.push(initOrderPackageData);
        },
        deletePackageData: function (tt) {
            angular.forEach( $scope.initOrderData,function(val,index) {
                if( val.mpId == tt.mpId ) {
                    $scope.initOrderData.splice(index,1);
                    return;
                }
                angular.forEach( tt.childProductList,function(x) {
                    if( val.mpId == x.product.mpId ) {
                        $scope.initOrderData.splice(index,1);
                        return;
                    }
                } )
            } )
            angular.forEach( $scope.initOrderDataIm , function(p,index) {
                if( p.mpId == tt.mpId ) {
                    $scope.initOrderDataIm.splice(index,1);
                    return;
                }
                angular.forEach( tt.childProductList,function(q) {
                    if( p.mpId == q.product.mpId ) {
                        $scope.initOrderDataIm.splice(index,1);
                        return;
                    }
                } )
            } )
        },
        endSP: function() {
            var attrMapProd = {};
            var attrArr = [];
            angular.forEach($scope.packageSerialProducts, function (sp,index) {
                var apkeys = sp.key.replace(/^_|_$/g, '').split('_');
                attrArr.push( apkeys );
                attrMapProd[attrArr[index]] = $scope.packageSerialProducts[index].product
                // if (angular.isArray(apkeys)) {
                //     angular.forEach(apkeys, function (k) {
                //         attrMapProd[k] = attrMapProd[k] || [];
                //         if (attrMapProd[k].indexOf(sp.product.mpId.toString()) < 0) {
                //             attrMapProd[k].push(sp.product.mpId.toString());
                //         }
                //     })
                // }
            })
            //保存最后的组合结果信息
            $scope.packAgeSKUResult = {};
            initSKU();
            $('.skuTwo').each(function() {
                var self = $(this);
                var attr_id = self.attr('attr_id');
                if(!$scope.packAgeSKUResult[attr_id]) {
                    // self.attr('disabled', 'attrDisabledTwo').addClass('attrDisabledTwo');
                    self.prop('disabled', true)
                }
            })
            //获得对象的key
            function getObjKeys(obj) {
                if (obj !== Object(obj)) throw new TypeError('Invalid object');
                var keys = [];
                for (var key in obj)
                    if (Object.prototype.hasOwnProperty.call(obj, key))
                        keys[keys.length] = key;
                return keys;
            }
            //把组合的key放入结果集SKUResult
            function add2SKUResult(combArrItem, sku) {
                var key = combArrItem.join(",");
                if($scope.packAgeSKUResult[key]) {//SKU信息key属性·
                    $scope.packAgeSKUResult[key].count += sku.count;
                    $scope.packAgeSKUResult[key].prices.push(sku.price);
                } else {
                    $scope.packAgeSKUResult[key] = {
                        count : sku.count,
                        prices : [sku.price]
                    };
                }
            }

            //初始化得到结果集
            function initSKU() {
                var i, j, skuKeys = getObjKeys(attrMapProd);
                for(i = 0; i < skuKeys.length; i++) {
                    var skuKey = skuKeys[i];//一条SKU信息key
                    var sku = attrMapProd[skuKey];  //一条SKU信息value
                    var skuKeyAttrs = skuKey.split(","); //SKU信息key属性值数组
                    skuKeyAttrs.sort(function(value1, value2) {
                        return parseInt(value1) - parseInt(value2);
                    });
                    //对每个SKU信息key属性值进行拆分组合
                    var combArr = combInArray(skuKeyAttrs);
                    for(j = 0; j < combArr.length; j++) {
                        add2SKUResult(combArr[j], sku);
                    }

                    //结果集接放入SKUResult
                    $scope.packAgeSKUResult[skuKeyAttrs.join(",")] = {
                        count:sku.count,
                        prices:[sku.price]
                    }
                }
            }
            function combInArray(aData) {
                if(!aData || !aData.length) {
                    return [];
                }

                var len = aData.length;
                var aResult = [];

                for(var n = 1; n < len; n++) {
                    var aaFlags = getCombFlags(len, n);
                    while(aaFlags.length) {
                        var aFlag = aaFlags.shift();
                        var aComb = [];
                        for(var i = 0; i < len; i++) {
                            aFlag[i] && aComb.push(aData[i]);
                        }
                        aResult.push(aComb);
                    }
                }

                return aResult;
            }
            function getCombFlags(m, n) {
                if(!n || n < 1) {
                    return [];
                }

                var aResult = [];
                var aFlag = [];
                var bNext = true;
                var i, j, iCnt1;

                for (i = 0; i < m; i++) {
                    aFlag[i] = i < n ? 1 : 0;
                }

                aResult.push(aFlag.concat());

                while (bNext) {
                    iCnt1 = 0;
                    for (i = 0; i < m - 1; i++) {
                        if (aFlag[i] == 1 && aFlag[i+1] == 0) {
                            for(j = 0; j < i; j++) {
                                aFlag[j] = j < iCnt1 ? 1 : 0;
                            }
                            aFlag[i] = 0;
                            aFlag[i+1] = 1;
                            var aTmp = aFlag.concat();
                            aResult.push(aTmp);
                            if(aTmp.slice(-n).join("").indexOf('0') == -1) {
                                bNext = false;
                            }
                            break;
                        }
                        aFlag[i] == 1 && iCnt1++;
                    }
                }
                return aResult;
            }
        },
        queryStock: function(values) {
            var oldParams = [];
            if( values.attributes ) {
                angular.forEach( values.childProductList, function( val ) {
                    oldParams.push( val.product.mpId );
                } )
            }
            oldParams.push(values.mpId);
            var newParams = oldParams.join(',');
            var url = $rootScope.host + '/promotion/limitInfo',
                params = {
                    promotionIds:values.promotionId,
                    mpIds:newParams,
                    areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode: $rootScope.defaultAreasCode,
                    isCheckRealStock:true
                };
            $rootScope.ajax.get(url, params).then(function(res){
                if( res.code == 0 && res.data ) {
                    var pMap = {} , actPr = [];
                    angular.forEach( res.data,function(x) {
                        if( x.mpId == values.mpId ) {
                            values.canSaleNum = x.canSaleNum;
                        }
                    } )
                    angular.forEach( res.data, function (q) {
                        pMap[q.mpId] = q;
                    } )
                    angular.forEach( values.childProductList,function(p){
                        var pr = p.product;
                        if( pMap[pr.mpId] ) {
                            pr = angular.extend( pr , pMap[pr.mpId] );
                            if( pr.canSaleNum > 0 || pr.canSaleNum == null ) {
                                actPr.push(p);
                            } else {
                                delete pMap[pr.mpId]
                            }
                        }
                    } )
                    $scope.packageSerialProducts = actPr;
                    $scope.packageMethod.endSP();
                    $scope.canSaleNum = values.canSaleNum;
                    $scope.threeCansaleNum = values.canSaleNum;
                }
            })
        },
        // 套餐商品的关联服务商品 begin
        packageContent: function(id,values) {
            if( $rootScope.util.getCookies("areasCode") ) {
                $rootScope.areasCode = JSON.parse($rootScope.util.getCookies("areasCode"));
                var areasCodeOneCode = $rootScope.areasCode;
            }
            var url = '/back-product-web/consultAppAction/getMerchantProductList.do';
            if( id ) {
                var arrId = [id];
            } else {
                arrId = [$scope.packageVirtualGood.mpId];
            }
            var params = {
                mpIds : arrId,
                areaCode : areasCodeOneCode
            };
            var serviceId = [];
            var serviceData = null;
            $rootScope.ajax.postJson(url, params).then(function (res) {
                if (res.data && res.code == 0) {
                    angular.forEach(res.data, function (data) {
                        angular.forEach(data, function (value) {
                            serviceId.push(value.id);
                            serviceData = data;
                            value.checked = false;
                        })
                    })
                    var url = $rootScope.host + '/realTime/getPriceStockList',
                        params = {
                            mpIds: serviceId,
                            areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
                        };
                    $rootScope.ajax.get(url,params).then(function (res) {
                        if (res.code == 0) {
                            if (res.data.plist != null && res.data.plist.length > 0) {
                                angular.forEach(res.data.plist, function (val) {
                                    angular.forEach(serviceData, function (k) {
                                        if (val.mpId == k.id) {
                                            k.stockNum = val.stockNum;
                                            k.stockText = val.stockText;
                                            k.price = val.availablePrice;
                                            k.highestPrice = val.highestPrice;
                                        }
                                    })
                                })
                            }
                        }
                    })
                    $rootScope.packageServiceList = serviceData;
                    if( $rootScope.util.getCookies("areasCode") ) {
                        $rootScope.areasCode = JSON.parse($rootScope.util.getCookies("areasCode"));
                        var areasCodeOneCode = $rootScope.areasCode.oneCode;
                    }
                    var twoUrl = '/search/rest/checkMpSaleArea.do';
                    var twoArrId = [];
                    angular.forEach( $rootScope.packageServiceList , function(val) {
                        twoArrId.push(val.id);
                    })
                    var twoNewArrId = twoArrId.join(',');
                    var twoParams = {
                        mpIds : twoNewArrId,
                        areaCode : areasCodeOneCode
                    }
                    $rootScope.ajax.post(twoUrl, twoParams).then(function( res ) {
                        if( res.code == 0 ) {
                            angular.forEach( $scope.packageServiceList,function(val) {
                                for( var k in res.data ) {
                                    val.choseAdd = res.data[k];
                                }
                            } )
                        }
                    })
                }
            });
        },
        // 选择套餐商品的数量
        updateProduct: function(n,v) {
            $scope.packAgeItemAmount = parseInt( $scope.packAgeItemAmount ) + n;
            if( !$scope.packAgeItemAmount ) {
                $scope.packAgeItemAmount = 1;
            } else {
                if( $scope.packAgeItemAmount > $scope.canSaleNum ) {
                    $scope.packAgeItemAmount = $scope.canSaleNum;
                    // $scope._showLimitDiv();
                }
                if( $scope.packAgeItemAmount > v  ) {
                    $scope.packAgeItemAmount = v;
                }
            }
            // $rootScope.localProvince._computeDeliveryFee( $scope. )
        },
        choseCheckbox:function (value, event,bigVlue) {
            $rootScope.packageServiceGoodId = null;
            $scope.packageVirtualGood = value;
            $scope.packAgeItemAmount = 1;
            $scope.packageMethod.queryStock(value);
            //$scope.packageMethod.packageContent();产品化1.2没有服务商品功能注释
            // 套餐弹框中的取消按钮 end
            if( event.target.checked == false ) {
                var textHtml = $scope.i18n('已选')+'<b>'+0+'</b>'+$scope.i18n('个');
                event.target.nextElementSibling.innerHTML = textHtml;
                $scope.packageMethod.deletePackageData($scope.packageVirtualGood );
                value.isChose = false;
                var isChoseNum = 0;
                var mainIsChose = 0;
                angular.forEach( bigVlue.mpList,function(x) {
                    if(x.isChose) {
                        isChoseNum++;
                    }
                    if(x.mainIsChose) {
                        mainIsChose++;
                    }
                } )
                if( isChoseNum >= $scope.limitToValue || mainIsChose >= 1  ) {
                    bigVlue.isChecked = true;
                } else {
                    bigVlue.isChecked = false;
                }
                var packageisChoseNum = 0;
                angular.forEach($scope.packageObject,function(l){
                    if( l.isChecked ) {
                        packageisChoseNum++;
                    }
                })
                if( packageisChoseNum === $scope.packageObject.length  ) {
                    $scope.isActive = true;
                    $scope.isDisabled = false;
                } else {
                    $scope.isActive = false;
                    $scope.isDisabled = true;
                }
                bigVlue.packageChoseNum--;
                if(value.packAgeItemAmount){
                    $scope.totalMoney = $scope.totalMoney - value.packAgeItemAmount * value.promPrice;
                } else {
                    $scope.totalMoney = $scope.totalMoney - value.num * value.promPrice;
                }
                var hasIsMain = false;
                if( $scope.initOrderData.length ==  0 ) {
                    $scope.packageTotalNum = 0
                }
                angular.forEach( $scope.initOrderData,function(p) {
                    if( p.isMain ) {
                        hasIsMain = true;
                        $scope.packageTotalNum = $scope.initOrderData.length - 1;
                    }
                    if( !hasIsMain ) {
                        $scope.packageTotalNum = $scope.initOrderData.length;
                    }
                } )
                if( !$scope.packageAttrArr.length  ) {
                    value = angular.extend(value);
                }
                for( var i = 0 ; i < $scope.packageAttrArr.length ; i++ ) {
                    if( $scope.packageAttrArr[i].mpId == value.mpId ) {
                        value = angular.extend( value , angular.copy( $scope.packageAttrArr[i] ) )
                        $scope.packageAttrArr.splice( i,1 );
                        return;
                    }
                    for( var j = 0 ; j <$scope.packageAttrArr[i].childProductList.length ; j++ ) {
                        if( $scope.packageAttrArr[i].childProductList[j].product.mpId == value.mpId ) {
                            value = angular.extend( value , angular.copy( $scope.packageAttrArr[i] ) )
                            $scope.packageAttrArr.splice( i,1 );
                            return;
                        }
                    }
                }
            }
            if (!value.attributes && event.target.checked) {
                $scope.packageChoseAttrTwo = true;
                $scope.chosePackageSure = function() {
                    if( value.canSaleNum == 0  ) {
                        $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('目前商品没有库存'), {
                            type: 'info'
                        });
                        return;
                    }
                    event.target.checked = true;
                    $scope.packageChoseAttrOne = false;
                    $scope.packageChoseAttrTwo = false;
                    var textHtml = $scope.i18n('已选')+'<b>'+$scope.packAgeItemAmount+'</b>'+$scope.i18n('个');
                    event.target.nextElementSibling.innerHTML = textHtml;
                    event.target.nextElementSibling.title = textHtml;
                    $scope.initOrderMainData = {"mpId":$scope.packageVirtualGood.mpId,"num":$scope.packAgeItemAmount,"itemType":1025,"objectId":$scope.packageVirtualGood.promotionId,"isMain":1,"additionalItems":[{"mpId":$rootScope.packageServiceGoodId,"num":1}]};
                    if( $rootScope.packageServiceGoodId === null ) {
                        $scope.initOrderMainData = {"mpId":$scope.packageVirtualGood.mpId,"num":$scope.packAgeItemAmount,"itemType":1025,"objectId":$scope.packageVirtualGood.promotionId,"isMain":1}
                    }
                    if(bigVlue.level) {
                        $scope.packageMethod.addPackageData();
                        value.isChose = true;
                    } else if ( bigVlue.level == 0) {
                        $scope.initOrderData.push($scope.initOrderMainData);
                        $scope.initOrderDataIm.push($scope.initOrderMainData);
                        value.mainIsChose = true;
                    }
                    var isChoseNum = 0;
                    var mainIsChose = 0;
                    angular.forEach( bigVlue.mpList,function(x) {
                        if(x.isChose) {
                            isChoseNum++;
                        }
                        if(x.mainIsChose) {
                            mainIsChose++;
                        }
                    } )
                    if( isChoseNum >= $scope.limitToValue || mainIsChose >= 1  ) {
                        bigVlue.isChecked = true;
                    }
                    var packageisChoseNum = 0;
                    angular.forEach($scope.packageObject,function(l){
                        if( l.isChecked ) {
                            packageisChoseNum++;
                        }
                    })
                    if( packageisChoseNum === $scope.packageObject.length ) {
                        $scope.isActive = true;
                        $scope.isDisabled = false;
                    } else {
                        $scope.isActive = false;
                        $scope.isDisabled = true;
                    }
                    bigVlue.packageChoseNum++;
                    $scope.totalMoney = $scope.totalMoney + $scope.packAgeItemAmount * value.promPrice;
                    value.packAgeItemAmount = $scope.packAgeItemAmount;
                    var hasIsMain = false;
                    angular.forEach( $scope.initOrderData,function(p) {
                        if( p.isMain ) {
                            hasIsMain = true;
                            $scope.packageTotalNum = $scope.initOrderData.length - 1;
                        }
                        if( !hasIsMain ) {
                            $scope.packageTotalNum = $scope.initOrderData.length;
                        }
                    } )
                }
            }
            if (value.attributes && event.target.checked) {
                value.isSeries = 1;
                $scope.packageItemListStore = angular.copy(value);
                $scope.packageAttrArr.push( $scope.packageItemListStore );
                $scope.packageChoseAttrOne = true;
                $scope.packageAttr = value.attributes;
                //  选好套餐商品确定按钮 begin
                $scope.chosePackageSure = function() {
                    if( value.canSaleNum == 0 ) {
                        $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('目前商品没有库存'), {
                            type: 'info'
                        });
                        return;
                    }
                    if(!value.isSeries) {
                        event.target.checked = true;
                        var textHtml = [];
                        for( var k in $scope.selectedAttr ) {
                            if( $scope.selectedAttr[k].value ) {
                                textHtml.push($scope.selectedAttr[k].value);
                            }
                        }
                        $scope.newTextHtml = textHtml.join(',')
                        var textHtml = $scope.i18n('已选') + ':'+ $scope.newTextHtml +'。'+ $scope.packAgeItemAmount +$scope.i18n('个');
                        event.target.nextElementSibling.innerText = textHtml;
                        event.target.nextElementSibling.title = textHtml;
                        // event.target.nextElementSibling.nextSibling.nextElementSibling.innerText = $scope.packAgeItemAmount + '个';
                        // 立即购买套餐副品参数
                        // var initOrderPackageData = [{"mpId":$scope.packageVirtualGood.mpId,"num":$scope.packAgeItemAmount,"itemType":1025,"objectId":$scope.packageVirtualGood.promotionId,"isMain":0}];
                        // 立即购买套餐主品参数
                        $scope.initOrderMainData = {"mpId":$scope.packageVirtualGood.mpId,"num":$scope.packAgeItemAmount,"itemType":1025,"objectId":$scope.packageVirtualGood.promotionId,"isMain":1,"additionalItems":[{"mpId":$rootScope.packageServiceGoodId,"num":1}]};
                        if( $rootScope.packageServiceGoodId === null ) {
                            $scope.initOrderMainData = {"mpId":$scope.packageVirtualGood.mpId,"num":$scope.packAgeItemAmount,"itemType":1025,"objectId":$scope.packageVirtualGood.promotionId,"isMain":1}
                        }
                        if(bigVlue.level) {
                            $scope.packageMethod.addPackageData();
                            value.isChose = true;
                        } else if ( bigVlue.level == 0) {
                            $scope.initOrderData.push($scope.initOrderMainData);
                            $scope.initOrderDataIm.push($scope.initOrderMainData);
                            value.mainIsChose = true;
                        }
                        var isChoseNum = 0;
                        var mainIsChose = 0;
                        angular.forEach( bigVlue.mpList,function(x) {
                            if(x.isChose) {
                                isChoseNum++;
                            }
                            if(x.mainIsChose) {
                                mainIsChose++;
                            }
                        } )
                        if( isChoseNum >= $scope.limitToValue || mainIsChose >= 1  ) {
                            bigVlue.isChecked = true;
                        }
                        var packageisChoseNum = 0;
                        angular.forEach($scope.packageObject,function(l){
                            if( l.isChecked ) {
                                packageisChoseNum++;
                            }
                        })
                        if( packageisChoseNum === $scope.packageObject.length) {
                            $scope.isActive = true;
                            $scope.isDisabled = false;
                        } else {
                            $scope.isActive = false;
                            $scope.isDisabled = true;
                        }
                        $scope.packageChoseAttrOne = false;
                        $scope.packageChoseAttrTwo = false;
                        // value = angular.extend( value,angular.copy($scope.packageItemListStore) );
                    } else {
                        $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('请先选择商品属性'), {
                            type: 'info'
                        });
                        $scope.packageChoseAttrOne = true;
                        return;
                    }
                    if( $scope.packageChoseAttrOne == false || $scope.packageChoseAttrTwo == false   ) {
                        bigVlue.packageChoseNum++;
                        $scope.totalMoney = $scope.totalMoney + $scope.packAgeItemAmount * value.promPrice;
                    }
                        value.packAgeItemAmount = $scope.packAgeItemAmount;
                    var hasIsMain = false;
                    angular.forEach( $scope.initOrderData,function(p) {
                        if( p.isMain ) {
                            hasIsMain = true;
                            $scope.packageTotalNum = $scope.initOrderData.length - 1;
                        }
                        if( !hasIsMain ) {
                            $scope.packageTotalNum = $scope.initOrderData.length;
                        }
                    } )
                }
            }
            // 套餐商品中的关联服务商品 end
            $scope.mpId_attrId = [];  // 商品映射属性
            $scope.allValidAttrId = []; // 所有可用的属性
            $scope.attrId_mpId = [];  // 属性映射商品
            $scope.canSubmit = false; // 是否可以确认属性选择
            //  系列属性后续处理  begin
            $scope.attributes = value.attributes; // 系列属性
            //  系列属性后续处理 end
            $scope.selectedAttr = {}; //选中的属性
            //  选好套餐商品确定按钮 end
            $scope.packageMethod.chosePackageServiceGood = function (id, value, a) {
                $rootScope.packageServiceGoodId = id;
                a.checked = !a.checked;
                angular.forEach( value ,function( val ) {
                    if( a.id != val.id ) {
                        val.checked = false;
                    }
                })
                if( !a.checked ) {
                    $rootScope.packageServiceGoodId = null;
                    return false;
                }
            }
            // 套餐弹框中的取消按钮 begin
            $scope.packageMethod.closePackageAttr = function () {
                event.target.checked = false;
                $scope.packageChoseAttrOne = false;
                $scope.packageChoseAttrTwo = false;
                value.isChose = false;
                value.mainIsChose = false;
                for( var i = 0 ; i < $scope.packageAttrArr.length ; i++ ) {
                    if( $scope.packageAttrArr[i].mpId == value.mpId ) {
                        value = angular.extend( value , angular.copy( $scope.packageAttrArr[i] ) )
                        $scope.packageAttrArr.splice( i,1 );
                        return;
                    }
                    for( var j = 0 ; j <$scope.packageAttrArr[i].childProductList.length ; j++ ) {
                        if( $scope.packageAttrArr[i].childProductList[j].product.mpId == value.mpId ) {
                            value = angular.extend( value , angular.copy( $scope.packageAttrArr[i] ) )
                            $scope.packageAttrArr.splice( i,1 );
                            return;
                        }
                    }
                }
            }
            // 选择套餐系列品的属性 begin
            $scope.packageAttrs = function (v,values,$event) {
                //value.checked = !value.checked;
                var self = $($event.target);
                //选中自己，兄弟节点取消选中
                self.toggleClass('attrActiveTwo').siblings().removeClass('attrActiveTwo');
                //已经选择的节点
                var selectedObjs = $('.attrActiveTwo');
                $scope.selectedAttr = selectedObjs;
                if(selectedObjs.length>0){
                    //获得组合key价格
                    $scope.PackageSelectedIds = [];
                    selectedObjs.each(function(){
                        $scope.PackageSelectedIds.push($(this).attr('attr_id'));
                    });
                    $scope.PackageSelectedIds.sort(function(value1,value2){
                        return parseInt(value1) - parseInt(value2);
                    });
                    var len = $scope.PackageSelectedIds.length;
                    if (len == $scope.attributes.length) {
                        $scope.canSubmit = true;
                        $scope.packageMethod.updateSerialProduct(value);
                    } else {
                        $scope.canSubmit = false;
                        value = angular.extend( value,angular.copy($scope.packageItemListStore) );
                        $scope.canSaleNum = $scope.threeCansaleNum;
                    }
                    //用已选中的节点验证待测试节点 underTestObjs
                    $('.skuTwo').not(selectedObjs).not(self).each(function(){
                        var siblingsSelectedObj = $(this).siblings('.attrActiveTwo');
                        var testAttrIds = [];//从选中节点中去掉选中的兄弟节点
                        if(siblingsSelectedObj.length) {
                            var siblingsSelectedObjId = siblingsSelectedObj.attr('attr_id');
                            for(var i = 0; i < len; i++) {
                                ($scope.PackageSelectedIds[i] != siblingsSelectedObjId) && testAttrIds.push($scope.PackageSelectedIds[i]);
                            }
                        } else {
                            testAttrIds = $scope.PackageSelectedIds.concat();
                        }
                        testAttrIds = testAttrIds.concat($(this).attr('attr_id'));
                        testAttrIds.sort(function(value1, value2) {
                            return parseInt(value1) - parseInt(value2);
                        });
                        if(!$scope.packAgeSKUResult[testAttrIds.join(',')]) {
                            $(this).prop('disabled', true);
                        } else {
                            $(this).prop('disabled', false);
                        }
                    });
                }else{
                    value = angular.extend( value,angular.copy($scope.packageItemListStore) );
                    $scope.canSaleNum = $scope.threeCansaleNum;
                    //设置属性状态
                    $('.skuTwo').each(function() {
                        $scope.packAgeSKUResult[$(this).attr('attr_id')] ? $(this).prop('disabled', false) : $(this).prop('disabled', true);
                    })
                }
                // v.checked = true;
                // 遍历同级属性
                // 如果选中的属性个数与属性类别相同，表示可以提交
                // if( Object.getOwnPropertyNames($scope.selectedAttr).length == $scope.attributes.length ) {
                //     $scope.canSubmit = true;
                //     $scope.packageMethod.updateSerialProduct(value);
                // } else{
                //     $scope.canSubmit = false;
                //     // value = angular.extend(value),angular.copy($scope.packageItemListStore))
                //     value = angular.extend( value,angular.copy($scope.packageItemListStore) );
                // }
                // $scope.getValidAttrId(Object.getOwnPropertyNames($scope.selectedAttr).length == 0)
                // 选择套餐系列的属性 end
                // for( var k in $scope.selectedAttr) {
                //     if( textHtml.indexOf($scope.selectedAttr[k].value) < 0 ) {
                //         textHtml.push($scope.selectedAttr[k].value);
                //     }
                //     if( textHtml.indexOf( $scope.selectedAttr[k].value ) > 0 ) {
                //         textHtml.splice( $scope.selectedAttr[k] , 1 );
                //     }
                // }
            }
            //  系列属性后续处理 end
            //获取商品对属性的映射关系
            // angular.forEach(value.childProductList, function (p) {
            //     $scope.mpId_attrId[p.product.mpId] = p.key.replace(/(^_|_$)/g, '').split('_');
            //     $scope.allValidAttrId = $scope.allValidAttrId.concat($scope.mpId_attrId[p.product.mpId]);
            // })
            // 获取属性对商品的映射关系
            // angular.forEach(value.attributes, function (a) {
            //     angular.forEach(a.values, function (v) {
            //         $scope.attrId_mpId[v.id] = v.mpId;
            //     })
            // })
            // 按默认选中的属性选择
            // angular.forEach(value.attributes, function (a) {
            //     angular.forEach(a.values, function (v) {
            //         if (v.checked) {
            //             v.checked = !v.checked;
            //         }
            //     })
            // })
            // 更新系列品的对象属性
            $scope.packageMethod.updateSerialProduct = function(prod ) {
                if (!$scope.canSubmit) {
                    $rootScope.error.checkCode($scope.i18n('提示')), $scope.i18n('请选择想要修改的商品') + '!', {title: $scope.i18n('提示')};
                    return;
                }
                prod.attributes = $scope.attributes;
                $scope.selectedProd = {};
                var keys = [];
                angular.forEach( $scope.PackageSelectedIds , function( a ) {
                    keys.push(a);
                } )
                keys = keys.sort().join('_');
                angular.forEach( $scope.packageSerialProducts, function( p ) {
                    var tKey = p.key.replace( /(^_|_$)/g, '' ).split( '_' ).sort().join('_');
                    if( tKey == keys ) {
                        $scope.selectedProd = p.product;
                        value = angular.extend( value , {
                            isVirtual : false,
                            isSeries : null,
                            mpId : $scope.selectedProd.mpId,
                            price : $scope.selectedProd.price,
                            promPrice : $scope.selectedProd.promPrice,
                            picUrl : $scope.selectedProd.picUrl
                        } )
                    }
                })
                $scope.canSaleNum = $scope.selectedProd.canSaleNum;
                //$scope.packageMethod.packageContent(value.mpId,value);产品化1.2没有服务商品功能，注释
            }
        },
        // 立即购买
        packageBuyNow: function () {
            var url = $rootScope.host + '/checkout/initOrder';
            var newArr = [];
            var newArrTwo = [];
            var isMainBool = false;
            if( GetQueryString('groupId') ) {
                angular.forEach($scope.initOrderDataIm,function(val){
                    newArrTwo.unshift(val);
                })
                angular.forEach(newArrTwo,function(x){
                    if(x.isMain) {
                        isMainBool = true;
                        var params = {
                            skus:JSON.stringify(newArrTwo),
                            businessType : 7,
                            ut : _ut,
                            areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
                        }
                        if (!_ut) {
                            $rootScope.showLoginBox = true;
                            return;
                        } else if($scope.packageVirtualGood) {
                            if( !$scope.packageVirtualGood.isSeries ) {
                                $rootScope.ajax.post(url, params).then(function(res){
                                    if( res.code == 0 ) {
                                        localStorage.setItem('quickBuy', JSON.stringify(params));
                                        location.href = 'settlement.html?q=1';
                                    } else {
                                        if(res.data!=null&&res.data.error != null &&res.data.error.type==4||res.data.error.type==3){
                                            localStorage.setItem('quickBuy', JSON.stringify(params));
                                            location.href = 'settlement.html?q=1';
                                        }else{
                                            $rootScope.error.checkCode(res.code, res.data.error.message);
                                        }
                                        // $rootScope.error.checkCode( res.code , res.message );
                                    }
                                }, function(error) {
                                    $rootScope.error.checkCode($scope.i18n('系统弄异常'),$scope.i18n('一键购买异常') + '！');
                                })
                            }
                        } else {
                            $rootScope.ajax.post(url, params).then(function(res){
                                if( res.code == 0 ) {
                                    localStorage.setItem('quickBuy', JSON.stringify(params));
                                    location.href = 'settlement.html?q=1';
                                } else {
                                    $rootScope.error.checkCode( res.code , res.message );
                                }
                            }, function(error) {
                                $rootScope.error.checkCode($scope.i18n('系统弄异常'),$scope.i18n('一键购买异常') + '！')
                            })
                        }
                    }
                })
                if(!isMainBool){
                    $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n('请加入商品主品'),{
                        type: 'info'
                    })
                }
            } else {
                angular.forEach($scope.initOrderData,function(val){
                    newArr.unshift(val);
                })
                angular.forEach(newArr,function(x){
                    if(x.isMain) {
                        isMainBool = true;
                        var params = {
                            skus:JSON.stringify(newArr),
                            businessType : 7,
                            ut : _ut
                        }
                        if (!_ut) {
                            $rootScope.showLoginBox = true;
                            return;
                        } else if(!$scope.packageVirtualGood.isSeries) {
                            $rootScope.ajax.post(url, params).then(function(res){
                                if( res.code == 0 ) {
                                    localStorage.setItem('quickBuy', JSON.stringify(params));
                                    location.href = 'settlement.html?q=1';
                                } else {
                                    $rootScope.error.checkCode( res.code , res.message );
                                }
                            }, function(error) {
                                $rootScope.error.checkCode($scope.i18n('系统弄异常'),$scope.i18n('一键购买异常') + '！');
                            })
                        }
                    }
                })
                if(!isMainBool){
                    $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n('请加入商品主品'),{
                        type: 'info'
                    })
                }
            }
        },
        // 套餐商品加入购物车
        addToCart: function() {
            function GetQueryString(name) {
                var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
                var r = window.location.search.substr(1).match(reg);
                if(r!=null)return  unescape(r[2]); return null;
            }
            $scope.isMainBoolTwo = false;
            var url = $rootScope.host + '/cart/addItem';
            var newArr = [];
            angular.forEach($scope.initOrderData,function(val){
                newArr.unshift(val);
            })
            if( GetQueryString('groupId') ) {
                angular.forEach(newArr,function(x){
                    if(x.isMain) {
                        $scope.isMainBoolTwo = true;
                        var params = {
                            skus:JSON.stringify(newArr),
                            isReplace:0,
                            sessionId:$rootScope.sessionId,
                            areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
                        }
                        $rootScope.ajax.post(url, params).then(function(res) {
                            if( res.code == 0 ) {
                                var template =
                                    '<div class="bigBox-disable">' +
                                    '<div id="collectDialog1" class="dialogItem collectDialog1">' +
                                    '<a href="javascript:void(0)" class="tooltipClose dialog-close">&times;</a>' +
                                    '<div class="dialog-content">' +
                                    '<div class="dialog-header">' +
                                    '<h5 class="dialog-title">' + $scope.i18n("友情提示") + '</h5>' +
                                    '</div>' +
                                    '<div class="dialog-body">'+ $scope.i18n("添加成功") + '！<a class="red" href="cart.html">'+ $scope.i18n("去结算") + '</a>&nbsp;<a href="javascript:;" class="tooltipClose">'+ $scope.i18n("继续购物") + '</a></div>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>'
                                var tooltip = angular.element(template);
                                $(".item-list-box").after(tooltip);
                                setTimeout(function(){
                                    tooltip.remove();
                                },3000)
                                tooltip.find(".tooltipClose").on('click', function () {
                                    tooltip.remove();
                                });
                            } else if(res.code == '001001018' ) {
                                var template = '<div class="bigBox-disable">' +
                                    '<div class="packageReplaceBoomb">' +
                                    '<div class="arrival-title clearfix">' +
                                    '<div class="title-left">' +
                                    '<span>'+ $scope.i18n("提示") + '</span>'+
                                    '</div>'+
                                    '</div>'+
                                    '<div class="packageReplace-main">'+
                                    '<p>'+ res.message +'</p>'+
                                    '<a href="" ng-click="replacePackage()" class="button-sure">'+ $scope.i18n("确定") + '</a>'+
                                    '<a href="" class="button-cancel">'+ $scope.i18n("取消") + '</a>'+
                                    '</div>'+
                                    '</div>'+
                                    '</div>'
                                var tooltlp = angular.element(template);
                                $(".item-list-box").after(tooltlp);
                                tooltlp.find(".button-cancel").on('click',function(){
                                    tooltlp.remove();
                                })
                                tooltlp.find(".button-sure").on('click',function() {
                                    var changeUrl = $rootScope.host + '/cart/editGroup';
                                    var changeArr = [];
                                    var isMainBool = false;
                                    angular.forEach( $scope.initOrderData,function(val) {
                                        changeArr.push(val);
                                    } )
                                    angular.forEach( changeArr , function(x) {
                                        if( x.isMain ) {
                                            isMainBool = true;
                                            var changeParams = {
                                                sessionId:$rootScope.sessionId,
                                                groupId:GetQueryString('groupId'),
                                                isReplace:1,
                                                skus:JSON.stringify(changeArr),
                                                areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
                                            }

                                            $rootScope.ajax.post(changeUrl,changeParams).then(function(res) {
                                                if( res.code == 0 ) {
                                                    location.href = 'cart.html';
                                                } else {
                                                    $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n('修改套餐失败'),{
                                                        type : 'info'
                                                    })
                                                }
                                            })
                                        }
                                    })
                                    tooltlp.find(".button-sure").on('click',function(){
                                        tooltlp.remove();
                                    })
                                })
                            } else {
                                $rootScope.error.checkCode(res.code, res.message)
                            }
                        })
                    }
                })
                if( !$scope.isMainBoolTwo  ) {
                    $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n('请加入商品主品'),{
                        type: 'info'
                    })
                }
            } else {
                angular.forEach(newArr,function(x){
                    if(x.isMain) {
                        $scope.isMainBoolTwo = true;
                        var params = {
                            skus:JSON.stringify(newArr),
                            isReplace:0,
                            sessionId:$rootScope.sessionId,
                            areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
                        }
                        $rootScope.ajax.post(url, params).then(function(res) {
                            if( res.code == 0 ) {
                                var template =
                                    '<div class="bigBox-disable">' +
                                    '<div id="collectDialog1" class="dialogItem collectDialog1">' +
                                    '<a href="javascript:void(0)" class="tooltipClose dialog-close">&times;</a>' +
                                    '<div class="dialog-content">' +
                                    '<div class="dialog-header">' +
                                    '<h5 class="dialog-title">' +$scope.i18n("友情提示") + '</h5>' +
                                    '</div>' +
                                    '<div class="dialog-body">' +$scope.i18n("添加成功") + '！<a class="red" href="cart.html">' + $scope.i18n("去结算") + '</a>&nbsp;<a href="javascript:;" class="tooltipClose">' + $scope.i18n("继续购物") + '</a></div>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>'
                                var tooltip = angular.element(template);
                                $(".item-list-box").after(tooltip);
                                setTimeout(function(){
                                    tooltip.remove();
                                },3000)
                                tooltip.find(".tooltipClose").on('click', function () {
                                    tooltip.remove();
                                });
                            } else if( res.code == '001001018' ){
                                var template = '<div class="bigBox-disable">' +
                                    '<div class="packageReplaceBoomb">' +
                                    '<div class="arrival-title clearfix">' +
                                    '<div class="title-left">' +
                                    '<span>' + $scope.i18n("提示") + '</span>'+
                                    '</div>'+
                                    '</div>'+
                                    '<div class="packageReplace-main">'+
                                    '<p>'+ res.message +'</p>'+
                                    '<a href="" ng-click="replacePackage()" class="button-sure">' + $scope.i18n("确定") + '</a>'+
                                    '<a href="" class="button-cancel">' + $scope.i18n("取消") + '</a>'+
                                    '</div>'+
                                    '</div>'+
                                    '</div>'
                                var tooltlp = angular.element(template);
                                $(".item-list-box").after(tooltlp);
                                tooltlp.find(".button-cancel").on('click',function(){
                                    tooltlp.remove();
                                })
                                tooltlp.find(".button-sure").on('click',function() {
                                    var changeUrl = $rootScope.host + '/cart/addItem';
                                    var changeArr = [];
                                    var isMainBool = false;
                                    angular.forEach( $scope.initOrderData,function(val) {
                                        changeArr.push(val);
                                    } )
                                    angular.forEach( changeArr , function(x) {
                                        if( x.isMain ) {
                                            isMainBool = true;
                                            var changeParams = {
                                                isReplace:1,
                                                sessionId:$rootScope.sessionId,
                                                skus:JSON.stringify(changeArr),
                                                areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
                                            }
                                            $rootScope.ajax.post(changeUrl,changeParams).then(function(res) {
                                                if( res.code == 0 ) {
                                                    location.href = 'cart.html';
                                                } else {
                                                    $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n('修改套餐失败'),{
                                                        type : 'info'
                                                    })
                                                }
                                            })
                                        }
                                    } )
                                    tooltlp.find(".button-sure").on('click',function(){
                                        tooltlp.remove();
                                    })
                                })
                            } else {
                                $rootScope.error.checkCode(res.code, res.message)
                            }
                        })
                    }
                })
                if( !$scope.isMainBoolTwo  ) {
                    $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n('请加入商品主品'),{
                        type: 'info'
                    })

                }
            }
        }
    };
    $scope.showMore = function () {
        $scope.isClass = !$scope.isClass;
        if ($scope.promotionType_m.length >= 2) {
            $scope.promotionNum = $scope.promotionType_m.length;
        }
        if (!$scope.isClass) {
            $scope.promotionNum = 2;
        }
    }
    $scope.changeShow = function() {
        $scope.showMoreDesc = !$scope.showMoreDesc;
    }
    //评价列表
    $scope.comment = {
        mpLabelList: [],//分类列表
        commentList: [],//评价列表
        pageNo: 1,
        pageSize: 10,
        totalCount: 0,
        rateFlag: 0, //0:全部;1:好评;2:中评;3:差评;4:有图
        hasPic: 0, //0:全部;1:有图;2:无图,
        //获取商品评价全部信息列表
        // _getEvaluationList: function (isFirst) {
        //     var url = $rootScope.host + "/social/mpComment/get",
        //         params = {
        //             companyId:$scope.companyId,
        //             mpId:$scope.params.itemId,
        //             pageNo:$scope.comment.pageNo,
        //             pageSize:$scope.comment.pageSize,
        //             hasPic:$scope.comment.hasPic, //0全部1有图2无图
        //             rateFlag:$scope.comment.rateFlag
        //         };
        //     $rootScope.ajax.get(url, params).then(function (res) {
        //         if (res && res.code == 0 && res.data) {
        //             if (isFirst) {
        //                 $scope.comment.mpLabelList = res.data.mpLabelList;
        //                 $scope.comment.positiveRate = res.data.positiveRate; // 好评率
        //                 $scope.comment.ratingUserCount = res.data.ratingUserCount;
        //                 $scope.comment.defaultRating = 0;
        //             }
        //             if (res.data.mpcList && res.data.mpcList.listObj) {
        //                 angular.forEach(res.data.mpcList.listObj, function (obj) {
        //                     obj.imgFold = false;
        //                     obj.imgArr = [];
        //                     if (obj.mpShinePicList.length) {
        //                         angular.forEach(obj.mpShinePicList, function (img) {
        //                             obj.imgArr.push({url: img, on: false});
        //                         });
        //                     }
        //                     if( obj.addMPCommentVOList) {
        //                         angular.forEach(obj.addMPCommentVOList,function(val){
        //                             val.addImgFold = false;
        //                             val.addImgArr = [];
        //                             if( val.addMpShinePicList.length ) {
        //                                 angular.forEach( val.addMpShinePicList,function(k) {
        //                                     val.addImgArr.push({url:k,on:false});
        //                                 } )
        //                             }
        //                         })
        //                     }

        //                 });
        //                 $scope.comment.commentList = res.data.mpcList.listObj;
        //                 $scope.comment.totalCount = res.data.mpcList.total;
        //                 $scope.comment.totalPage = Math.ceil(res.data.mpcList.total / $scope.comment.pageSize);
        //             }
        //         }
        //     }, function () {
        //     })
        // },
        /* clickEvaluationList: function (type, hasPic) {
            $scope.comment.rateFlag = type;
            $scope.comment.hasPic = hasPic;
            $scope.comment.pageNo= 1;
            $scope.comment.totalCount= 0;
            $scope.comment.totalPage = 0;
            $scope.comment._getEvaluationList(false);
        }, */
        clickEvaluationList: function(labelflag){
            if(labelflag!=5){
                $scope.comment.hasPic = 0;
            }else{
                $scope.comment.hasPic = 1;
            }
            $scope.comment.rateFlag = labelflag;
            $scope.comment.pageNo = 1;
            $scope.comment.totalCount= 0;
            $scope.comment.totalPage = 1;
            $scope.comment.commentList = [];
            //$scope.comment._getEvaluationList(false);
        }
    }
    //系列品的计算包装方式
    function calculateNum() {
        $scope.totalPackingNum = 0;
        $scope.totalPackingAmount = 0;
        angular.forEach($scope.pcIteminfo.sp.serialProducts || [], function (attr) {
            if (!attr.product.chooseNum) {
                attr.product.chooseNum = 0;
            }
            $scope.totalPackingNum = $scope.totalPackingNum + attr.product.chooseNum * attr.product.choosePackingWayNum;
            $scope.totalPackingAmount = $scope.totalPackingAmount + attr.product.chooseNum * attr.product.choosePackingWayNum * attr.product.availablePrice;
        })
    }
    //基本商品的计算包装方式
    function calculateBasicNum() {
        $scope.totalPackingNum = 0;
        $scope.totalPackingAmount = 0;
        if(!$scope.itemlist.chooseNum) {
            $scope.itemlist.chooseNum = 1;
        }
        $scope.totalPackingNum = $scope.totalPackingNum + $scope.itemlist.chooseNum * $scope.itemlist.choosePackingWayNum;
        $scope.totalPackingAmount = $scope.totalPackingAmount + $scope.itemlist.chooseNum * $scope.itemlist.choosePackingWayNum * $scope.itemlist.availablePrice;
    }
    $scope.pcIteminfo = {
        itemAmount: 1,
        tipPop: true,
        //初始化
        _init: function () {
            $scope.pcIteminfo._getIteminfo(function () {
                $scope.pcIteminfo.sp.getSerialProducts($scope.itemlist);
                // $scope.pcIteminfo._addXiaoNeng();
                $scope.pcIteminfo._getItemDetail();
                $scope.pcIteminfo._getItemCansale();
                $scope.pcIteminfo._getImageVideoData();
                //$scope.pcIteminfo._getItemSecurities();
                $scope.pcIteminfo._getItemScript();
                $scope.pcIteminfo._getItemStandardPriceDisplay();

                $scope.pcIteminfo._getUserPermissions();
                $scope.pcIteminfo._getItemSpec();
            });
            // $scope.comment._getEvaluationList(true);
            //积分商品不查促销
            if(!$scope.isPointPro){
                $scope.pcIteminfo._getPromotionInfo();
            }
            this._checkFavorite();
            if($rootScope.util.getCookies("areasCode")){
                $rootScope.areasCode = JSON.parse($rootScope.util.getCookies("areasCode"));
            }
        },
        //小能客服
        // _addXiaoNeng: function () {
        //     if ($scope.itemlist && $scope.itemlist.length > 0) {
        //         var item = $scope.itemlist;
        //         var params = {companyId: item.companyId, merchantId: item.merchantId, pageCode: 2, itemid: item.mpId};
        //         $rootScope.addXiaoNeng(params);
        //     }
        // },
        //初始化倒计时
        _initCountDown: function () {
            $scope.showCountDown = true;
            $scope.$on('changeShow', function (e, d) {
                $scope.showCountDown = d.show;
                location.reload();
            })
        },
        //获取用户咨询问答权限
        _getUserPermissions:function(){
            var url='api/social/consultAppAction/validateUserPermissions.do';
            var params = {
                    merchantProductId:$scope.params.itemId
                }
            $rootScope.ajax.postJson(url,params).then((res)=>{
                if (res.code==0 && res.data) {
                    $scope.askPermissions=res.data.qaConfigVO;
                    $scope.consultPermissions=res.data.consultConfigVO;
                }
            })
        },
        //获取商品信息
        _getIteminfo: function (callback) {
            $scope.startPresellCountDown = false;
            if( $rootScope.util.getCookies("areasCode") ) {
                $rootScope.areasCode = JSON.parse($rootScope.util.getCookies("areasCode"));
                var areasCodeOneCode = $rootScope.areasCode.oneCode;
                var url = '/back-product-web2/extra/merchantProduct/getMerchantProductBaseInfoById.do',
                    //  + new Date().getTime()
                    params = {
                        mpId:$scope.params.itemId,
                        // areaCode:areasCodeOneCode,
                        // provinceId:0,
                        // platformId:$rootScope.platformId
                    },
                    urlPrSt = $rootScope.host + '/realTime/getPriceStockList',//实时价格与库存接口

                    paramsPrSt = {//实时价格与库存入参
                        mpIds: $scope.params.itemId,
                        areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
                    };
                    if($scope.isPointPro){
                        urlPrSt = $rootScope.host + '/pointMallProduct/getPriceLimitList';//积分商品实时价格库存接口
                    }
                $scope.isProductLoading = true;
                //       因为接口报错所以暂时不请求
                $q.all([$rootScope.ajax.postJson(url,params), $rootScope.getSysTimePromise(),$rootScope.ajax.get(urlPrSt, paramsPrSt) ])//商品信息,系统时间,实时价格与库存
                .then(function (responses) {
                    //商品首屏信息
                    var response = responses[0], sysTime = responses[1], realPrSt = responses[2];
                    //商品不存在时
                    if(response.code=='100'){
                        $scope.isShowNoProduct=true;
                        $scope.noProduct=response.message;
                    }
                    if(response.code=='10700101'){
                        location.href="/index.html";
                        return;
                    }

                    if (response.data) {
                        $scope.productInfoBrandName = response.data.brandName
                        var k = response.data;

                        // if($scope.isPointPro){
                        //     response.data[0].isSeckill = 0;
                        //     response.data[0].isPresell = 0;
                        // }
                        if(k.promotionStartTime){
                            $scope.showCountDown = true;
                            $scope.currentTime = k.promotionStartTime;
                            $scope.endTime = k.promotionEndTime;
                        } else{
                            $scope.currentTime = +new Date();
                            $scope.endTime = $scope.currentTime+ 100000;
                            $scope.showCountDown = true;
                        }
                        $scope.itemlist = response.data;
                        $scope.code = $scope.itemlist.code.substr(0,1);
                        // 商家信息
                        $scope.pcIteminfo._getItemMerchantType(response.data.merchantId)
                        // $scope.$apply();
                        $scope.pcIteminfo._getCoupons();

                        $scope.heimdall = {
                            ev: "2",
                            pri: $scope.itemlist.mpId,
                            pvi: $scope.itemlist.mpId,
                            prm: $scope.pcIteminfo.itemAmount,
                            prn: $scope.itemlist.chineseName,
                            pt: $scope.itemlist.categoryName,
                            pti: $scope.itemlist.categoryId,
                            bn: $scope.itemlist.brandName,
                            bni: $scope.itemlist.brandId,
                            prp: $scope.itemlist.availablePrice
                        }
                        // document.title = $scope.itemlist[0].name;
                        //  如果商品是预售商品 那么不获取实时的价格与库存

                        if (realPrSt.data) {
                            if(!realPrSt.data.plist[0].isPresell || $scope.isPointPro){
                                $scope.itemlist = angular.extend($scope.itemlist || {}, ($scope.isPointPro?realPrSt.data.pList[0]:realPrSt.data.plist[0]) || {},{isVirtual:$scope.itemlist.typeOfProduct&&$rootScope.isVirtual},($scope.isPointPro?{individualLimitNum:realPrSt.data.pList[0].individualLimit}:{}));
                                //$rootScope.goodService();产品化1.2没有服务商品功能，注释
                            } else {
                                $scope.itemlist = angular.extend($scope.itemlist || {}, ($scope.isPointPro?realPrSt.data.pList[0]:realPrSt.data.plist[0]) || {},{isVirtual:$scope.itemlist.typeOfProduct&&$rootScope.isVirtual},($scope.isPointPro?{individualLimitNum:realPrSt.data.pList[0].individualLimit}:{}));
                                $scope.startPresellCountDown = true;
                            }
                        }

                        //用实时价格与库存替换原来的商品,如果是虚品...
                        if($scope.isPointPro){
                            angular.forEach($scope.itemlist, function (v) {
                                v.isSeckill = false;
                                v.isPresell = false;
                            })
                        }
                        //积分商品兑换时间判断
                        try {
                            if($scope.itemlist.exchangeStartTime  > new Date().getTime() || $scope.itemlist.exchangeEndTime  < new Date().getTime()){
                                $scope.canExchange = false;
                                $rootScope.error.checkCode(0, $scope.i18n("对不起") + ',' + $scope.i18n("该商品不在兑换时间内") + ',' + $scope.i18n("无法兑换") +'！');
                            }
                        } catch (error) {

                        }
                        //传入商品Id 检查商品可售区域
                        $scope.pcIteminfo.sp.inspectionCommodity($scope.itemlist,false)   // 主品查看可售区域传入false
                        // 获取商品销量
                        $scope.pcIteminfo._getItemVolume4sale($scope.itemlist.id);
                        $scope.goodName = $scope.itemlist.chineseName;
                        $rootScope.serviceGoodMesage = $scope.itemlist;
                        $scope.currentTime = sysTime.data.timestamp;
                        //有活动
                        if ($scope.itemlist.promotionStartTime && $scope.itemlist.promotionEndTime) {
                            //活动已开始,但没结束
                            if ($scope.currentTime > $scope.itemlist.promotionStartTime && $scope.currentTime < $scope.itemlist.promotionEndTime) {
                                $scope.activityIng = true;
                                $scope.pcIteminfo._initCountDown();
                            } else if ($scope.currentTime < $scope.itemlist.promotionStartTime) {
                                $scope.activityTo = true;
                                $scope.pcIteminfo._initCountDown();
                            }
                        }
                        //获取秒杀字段的已购数据
                        if( $scope.itemlist.isSeckill ) {
                            $scope.startCountDown = true;
                            //$scope.itemlist[0].promotionId
                            var seckillPromontionId = $scope.itemlist.promotionId;
                            if ($scope.promotionInfo && $scope.promotionInfo.promotions && $scope.promotionInfo.promotions.length) {
                                for (var i = 0; i < $scope.promotionInfo.promotions.length; i++) {
                                    if ($scope.promotionInfo.promotions[i].frontPromotionType == 1012) {
                                        seckillPromontionId: $scope.promotionInfo.promotions[i].promotionId;
                                        break;
                                    }
                                }
                            }
                            var url = $rootScope.host + '/promotion/secondkill/killList',
                                params = {
                                    promotionId:seckillPromontionId
                                };
                            $rootScope.ajax.get(url, params).then(function(res) {
                                if( res.code == 0 ) {
                                    $scope.promotionGoodMes = res.data.listObj[0]
                                    angular.forEach( $scope.promotionGoodMes.merchantProducts,function(val) {
                                        if( val.mpId == $scope.itemId ) {
                                            $scope.itemlist.saleStock = val.saleStock;
                                        }
                                    } )
                                    //秒杀
                                    var seckill = ($scope.itemlist.saleStock * 260) / $scope.itemlist.totalLimitNum;
                                    $(".speedPro").css({
                                        width: seckill + "px"
                                    })
                                }
                            })
                        }
                        if ($rootScope.switchConfig.common.showChoosePackingMethod && $scope.promotionType_m) {
                            $scope.itemlist.packingPromotions = angular.copy($scope.promotionType_m);
                        }
                        //获取类目面包屑
                        // if ($scope.itemlist.categoryId != null) {
                        //     var url = '/back-product-web2/extra/category/listChildrenCategoryWithNologin.do',
                        //         params = {
                        //             categoryIds : [$scope.itemlist.categoryId]
                        //         };
                        //     $rootScope.ajax.postJson(url,params).then(function (res) {
                        //         if (res.data  && res.data.length > 0 ) {
                        //             let categoryIdArr = res.data[0].fullIdPath.replace(/-/g, ',').split(',');
                        //             let categoryNameArr = res.data[0].fullNamePath.replace(/-/g,',').split(',');
                        //             if( categoryIdArr && categoryIdArr.length > 0 ) {
                        //                 for( let o = 0 ; o < categoryIdArr.length ; o++ ) {
                        //                     $scope.crumbList.push( { 'categoryId' : categoryIdArr[o] , 'categoryName' : categoryNameArr[o] } );
                        //                 }
                        //             }
                        //         }
                        //     });
                        // }
                        callback();
                         // 获取缓存中的省份

                         var detailCode = JSON.parse($rootScope.util.getCookies("addrDetail")).detailCode
                         if ( typeof(detailCode)=='string' ) {
                            var detailCodeList = detailCode.split('_')
                            $scope.param1 = {
                                provinceCode: detailCodeList[0],
                                cityCode: detailCodeList[1],
                                districtCode: detailCodeList[2],
                            }
                            $rootScope.localProvince._getcangku($scope.param1);
                         }

                        $scope.arrowMove();


                        //跟踪云埋点
                        try{
                            window.eventSupport.emit('productHeimdallTrack',{
                                productName:$scope.itemlist.chineseName, //商品名称（详情页需要填写）
                                productType:$scope.itemlist.categoryName, //商品类型（详情页需要填写）
                                productTypeId:$scope.itemlist.categoryId, //商品类型（详情页需要填写）
                                brandId:$scope.itemlist.brandId, //品牌id（详情页需要填写）
                                brandName:$scope.itemlist.brandName, //品牌名称（详情页需要填写）
                                productPrice:$scope.itemlist.availablePrice || $scope.itemlist.originalPrice, //产品价格（详情页需要填写）
                                productId:$scope.itemlist.mpId, //产品id（详情页需要填写
                            });
                        }catch(e){
                        }
                        $scope.takeQRcode();
                        $scope.isProductLoading = false;
                    } else {
                        $scope.isProductLoading = false;
                    }
                    if ($rootScope.switchConfig.common.showChoosePackingMethod) {
                        $rootScope.ajax.postJson('/back-product-web2/orderMultipleAction/getMerchantProductOrderMultipleByMpIds.do', {mpIds: [$scope.itemlist.mpId]}).then(function (res) {
                            if(res.code == 0){
                                if (res.data[$scope.itemlist.mpId]) {
                                    $scope.itemlist.packingWayList = res.data[$scope.itemlist.mpId];
                                } else {
                                    $scope.itemlist.packingWayList = [{id:'', orderMultiple:1}];
                                }
                                $scope.itemlist.chooseNum = 1;
                                $scope.itemlist.choosePackingWayNum = $scope.itemlist.packingWayList[0].orderMultiple;
                                $scope.itemlist.productPackageId = $scope.itemlist.packingWayList[0].id;
                                calculateBasicNum();
                            } else {
                                $scope.itemlist.packingWayList = [{id:'', orderMultiple:1}];
                                $scope.itemlist.chooseNum = 1;
                                $scope.itemlist.choosePackingWayNum = $scope.itemlist.packingWayList[0].orderMultiple;
                                $scope.itemlist.productPackageId = $scope.itemlist.packingWayList[0].id;
                                calculateBasicNum();
                            }
                        },function () {
                            $scope.itemlist.packingWayList = [{id:'', orderMultiple:1}];
                            $scope.itemlist.chooseNum = 1;
                            $scope.itemlist.choosePackingWayNum = $scope.itemlist.packingWayList[0].orderMultiple;
                            $scope.itemlist.productPackageId = $scope.itemlist.packingWayList[0].id;
                            calculateBasicNum();
                        });
                    }
                }, function(response) {
                    $scope.isProductLoading = false;
                    if(response.code=='10700101'){
                        location.href="/index.html";
                        return;
                    }
                })
            } else {
                $rootScope.beforeChoseAdd = true;
                if ($rootScope.switchConfig.common.showUpdateDistributionAddress) {
                    $rootScope.util.setCookie("addrDetail",{
                        "detail":$scope.i18n('上海上海市黄浦区'),
                        "detailId":'10_110_1129',
                        "detailCode":'310000_310100_310101'
                    },90);
                    $rootScope.util.setCookie( "areasCode" , {
                        'oneCode' : $rootScope.defaultAreasCode
                    },90);
                    $rootScope.util.setCookie("province",{
                        "provinceId":10,
                        "provinceName":$scope.i18n('上海'),
                        "provinceCode":310000,
                        "cityId":110,
                        "cityName":$scope.i18n('上海市'),
                        "cityCode":310100,
                        "regionId":1129,
                        "regionName":$scope.i18n('黄浦区'),
                        "regionCode":310101
                    },90, $rootScope.cookieDomain);
                    $rootScope.util.setCookie("isAutoArea","no", 90);
                    $rootScope.localProvince._checkProvince();
                    location.reload();
                } else {
                    $rootScope.localProvince.provinceFlag = true;
                    location.reload();
                }
            }
        },
        _getCoupons:function(){
            var url = $rootScope.host + "/promotion/coupon/couponThemeList4DirectReceive";
            var param = {
                sourcePage:0,
                needDetail:true,
            }
            param.merchantIdList = $scope.itemlist.merchantId;
            $rootScope.ajax.post(url, param).then(function (res) {
                if( res.code == 0 && res.data && res.data.length > 0 ) {
                    $scope.canGoCouponNum = res.data[0].availableCouponThemeCount;
                    $scope.canUseCouponNum = res.data[0].availableCouponCount;
                    $scope.couponsListNow = res.data[0];
                    $scope.couponsList = res.data[0].availableCouponTheme||[];
                }
            });
        },
        //tab切换
        // $scope.isCanUseCoupons = 1;

        _switchCouponTab : function (tab) { //切换领券tab
            // 如果已经是当前tab return
            if($scope.curruntTabCoupon == tab) return;
            $scope.curruntTabCoupon = tab;
            if($scope.curruntTabCoupon == 1){
                $scope.couponsList = $scope.couponsListNow.availableCouponTheme||[];
            }else if($scope.curruntTabCoupon == 2){
                $scope.couponsList = $scope.couponsListNow.availableCoupon||[];
            }
        },
        //点击领取优惠券
        _baggageCoupon:function(coupon){
            //判断是否登录
            if (!$rootScope.util.loggedIn()){
                $rootScope.toLogin();
            }
            var url =  $rootScope.host + "/promotion/coupon/receiveCoupon";
            var param = {
                couponThemeId: coupon.couponThemeId, //券活动id
                source:4,//前台领券默认传4
            };
            $rootScope.ajax.post(url, param).then(function (res) {
                if(res.code == 0){
                    $scope.favoriteSuccessData = {
                        bombShow:true,
                        rightText: $scope.i18n('领取成功') + '!',
                        title:$scope.i18n('提示'),
                        state:'success',
                        position:'top',
                    }
                    $scope.pcIteminfo._getCoupons(coupon);
                } else{
                    $rootScope.error.checkCode(res.code,res.message,{
                        type:'info'
                    });
                }
            });
        },
        // 获取商品文描信息
        _getItemDetail:function() {
            var url = '/back-product-web2/extra/merchantProduct/getMerchantProductDescriptionByMpId.do';
            var params = {
                mpId : $scope.params.itemId,
                describeType : 1
            }
            $rootScope.ajax.postJson(url, params).then(function(res) {
                if (res.code == 0 && res.data){
                    $scope.itemAttrlist = res.data.content;
                } else {
                    $scope.itemAttrlist = null;
                }
            })
        },
        // 获取商品是否上下架
        _getItemCansale : function () {
            var url = "/search/rest/queryMpCanSale";
            var params = {
                mpIds : $scope.params.itemId
            }
            $rootScope.ajax.post( url , params ).then( function ( res ) {
                if( res.code == 0 && res.data && res.data.dataList && res.data.dataList.length > 0 ) {
                    for( let i = 0 ; i < res.data.dataList.length ; i++ ) {
                        if( $scope.params.itemId == res.data.dataList[i].mpId ) {
                            $scope.itemlist.managementState = res.data.dataList[i].canSale;
                            $scope.btnEndLoading = false;
                            $scope.productManagementState= res.data.dataList[i].canSale;
                        }
                    }
                }
            } )
        },
        // 获取商品图片
        _getImageVideoData:function () {
            var url = '/back-product-web2/extra/merchantProduct/getMerchantProductMediaByParam.do';
            var params = {
                mpIds : [$scope.params.itemId],
            }
            $rootScope.ajax.postJson(url,params).then(function(res){
                if( res.code == 0 ) {
                    $scope.itemlist.pictureUrlList = res.data;
                    $scope.arrowMove();
                    if ($scope.itemlist.pictureUrlList.length > 5) {
                        $scope.noImgArrowRight = true;
                    } else {
                        $scope.yesImgArrowRight = true;
                    }
                    angular.forEach($scope.itemlist.pictureUrlList,function(val){
                        val.isChecked  = false;
                    })
                    $scope.itemlistStore=angular.copy($scope.itemlist);

                }
            })
        },
        _getItemScript:function(){
            var url = '/back-product-web2/openApi/superscript/listMerchantProductSuperscript.do';
            var params = {
                mpIds : [$scope.params.itemId],
            };
            $rootScope.ajax.postJson(url,params).then(function (res) {
                if (res.code == 0 && res.data && res.data.length > 0){
                    $scope.itemlist.scripts = res.data[0];
                }else {
                    $scope.itemlist.scripts = null;
                }
            });
        },
        _getItemStandardPriceDisplay:function(){
            var url = '/custom-sbd-web/advEntInfo/getAdvEntInfo.do';
            let params = {}
            $rootScope.ajax.get(url,params).then(function(res) {
                if(res.code == 0 && res.data) {
                    //$scope.itemlist.mpItemStandardPriceDisplay=res.data.mpItemStandardPriceDisplay
                    $rootScope.mpItemStandardPriceDisplay = res.data.mpItemStandardPriceDisplay
                    $scope.mpItemStandardPriceDisplay = res.data.mpItemStandardPriceDisplay
                }
            })
        },
        //商品规格
        _getItemSpec: function (code) {//商品规格
            if (!$scope.isFirstItemSpec) {
                return;
            }
            var url = '/back-product-web2/extra/merchantProduct/listMerchantProductAttributeByMpId.do',
                params = {
                    mpId:$scope.params.itemId,
                };
            $rootScope.ajax.postJson(url, params).then(function (response) {
                $scope.isFirstItemSpec = false;
                if (response.data) {
                    $scope.itemAttrSpec = response.data;
                }
            })
        },
        // 商品保障方式  切换子品的时候重新调
        _getItemSecurities : function () {
            var url = '/back-product-web2/extra/merchantProduct/listMerchantProductSecuritiesByMpIds.do';
            var params = {
                mpIds : [$scope.params.itemId]
            }
            $rootScope.ajax.postJson( url , params ).then( function (res) {
                if( res.data && res.data.length > 0 ) {
                    $scope.securityVOList = res.data;

                }
            } )
        },
        //  商家merchantType字段
        _getItemMerchantType : function (merchantId) {
            var url = '/back-merchant-web/api/merchant/getMerchantInfoById.do';
            var params = {
                merchantId : merchantId
            }
            $rootScope.ajax.postJson( url , params ).then( function (res) {
                if( res.code == 0 && res.data ) {
                    $scope.itemlist.merchantType = res.data.merchantType;
                    $scope.itemlist.merchantName = res.data.merchantName;
                }
            } )
        },
        //售后服务
        _getItemService: function (code) {//售后服务
            if (!$scope.isFirstItemService) {
                return;
            }
            var url = '/back-product-web2/extra/merchantProduct/getMerchantProductAfterSalesByMpId.do',
                params = {
                    mpId: $scope.params.itemId
                };
            $rootScope.ajax.postJson(url, params).then(function (response) {
                $scope.isFirstItemService = false;
                if (response.data) {
                    // 返回的文字按照回车字符截断
                    $scope.itemService_afterService = response.data.content;
                }
            });
        },
        _imgSwitching: function (pic,index) {
            $scope.jqimgindex = index;
        },
        sp: {
            attributes: [],  //系列属性
            serialProducts: [], //系列商品
            mpId_attrId: {},  //商品映射属性
            attrId_mpId: {},  //属性映射商品
            allValidAttrId: [],  //所有可用的属性
            selectedAttr: {}, //选中的属性
            selectedProd: {}, //选中的系列商品
            canSubmit: false, //是否可以确认属性选择
            skuType: 'common', //系列属性类型 common:商品详情页 gift:赠品
            qualityGoods:[],  //获取商品和子品销售区域的参数
            //获取商品和子品的销售区域
            inspectionCommodity : function(values) {
                if( $rootScope.util.getCookies("areasCode") ) {
                    $rootScope.areasCode = JSON.parse($rootScope.util.getCookies("areasCode"));
                    var areasCodeOneCode = $rootScope.areasCode.oneCode;
                }
                var url = "/search/rest/checkMpSaleArea.do";    //   $rootScope.host + '/product/checkProductSaleArea'
                var arrId = $scope.itemlist.mpId;;
                var params = {
                    mpIds : arrId,
                    areaCode : areasCodeOneCode
                }
                $rootScope.ajax.get(url, params).then(function(res) {
                    if( res.code == 0 ) {
                        for( var k in res.data ) {
                            if( $scope.itemlist.mpId == k ) {
                                $scope.itemlist.isAreaSale = res.data[k];
                                $scope.endOtherLoading = false;
                            }
                        }
                    }
                })
            },
            //从接口返回系列属性
            getSP: function (prod, fun) {
                var that = this;
                $rootScope.getSerialProductsData( prod.mpId || prod.id , function ( obj ) {
                    that.attributes = obj.attributes || [];
                    that.serialProducts = obj.serialProducts || [];
                    // 获取到系列属性进行操作
                    var attrIdList
                    if (urlParams.attrId) {
                         attrIdList = urlParams.attrId.split('_')
                    }
                    var urlPrSt = $rootScope.host + '/realTime/getPriceStockList',//实时价格与库存接口
                        paramsPrSt = {//实时价格与库存入参
                            mpIds: [],
                            areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode: $rootScope.defaultAreasCode
                        };
                    if($scope.isPointPro){
                        urlPrSt = $rootScope.host + '/pointMallProduct/getPriceLimitList';
                    }
                    if ($rootScope.switchConfig.common.showChoosePackingMethod) {
                        if (that.serialProducts && that.serialProducts.length >= 3) {
                            $scope.packingMethodFun.hideMoreSerial = true;
                        }
                        angular.forEach(that.serialProducts || [], function (p) {
                            paramsPrSt.mpIds.push(p.product.mpId)
                            that.qualityGoods.push( p.product.mpId);
                            var attrName = p.value.replace(/(^_|_$)/g, '').replace(/_/g,',');
                            var attrNameList = attrName.split(",");
                            p.attrNameList = attrNameList;
                        })
                        var mpIdsAll = angular.copy(paramsPrSt.mpIds);
                        var mpIdsAllPaking = angular.copy(paramsPrSt.mpIds);
                        if (!mpIdsAll || mpIdsAll.length <=0) {
                            return;
                        }
                        var areaCode = $rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode: $rootScope.defaultAreasCode;
                        var url = $rootScope.host + '/realTime/getPriceStockList?mpIds='+mpIdsAll.join(',') + '&areaCode='+ areaCode;
                        $rootScope.ajax.get(url, {}).then(function(res){
                            var plistMap={};
                            angular.forEach(res.data.plist||[], function (pl) {
                                plistMap[pl.mpId]=pl;
                            })
                            var url =$rootScope.host + '/promotion/promotionInfo',
                                params = {
                                    mpIds:paramsPrSt.mpIds,
                                    platformId:$rootScope.platformId,
                                    areaCheckFlag: 1,
                                    areaCode:$rootScope.areasCode.oneCode,
                                    giftDetail: true
                                };
                            $rootScope.ajax.get(url,params).then(function (restt) {
                                if (restt.code == 0 && restt.data.promotionInfo) {
                                    var promotionMap={};
                                    angular.forEach(restt.data.promotionInfo||[], function (pl) {
                                        promotionMap[pl.mpId]=pl;
                                    })
                                    $rootScope.ajax.postJson('/back-product-web2/orderMultipleAction/getMerchantProductOrderMultipleByMpIds.do', {mpIds: mpIdsAllPaking}).then(function (rest) {
                                        if(rest.code == 0){
                                            var packingMethodMap= rest.data;

                                            angular.forEach(that.serialProducts || [], function (p) {
                                                if(plistMap[p.product.mpId]){
                                                    $.extend(p.product,plistMap[p.product.mpId]);
                                                }
                                                if(promotionMap[p.product.mpId]){
                                                    // var effectivePromotions = $filter('filter')(promotionMap[p.product.mpId].promotions || [], function (prom) {
                                                    //     return $rootScope.PackagePromotions.indexOf(prom.frontPromotionType - 0) < 0;
                                                    // });
                                                    // var effectivePackagePromotions = $filter('filter')($scope.promotionInfo.promotions || [], function (prom) {
                                                    //     return $rootScope.promotionTypePackage.indexOf(prom.frontPromotionType - 0) >= 0;
                                                    // })
                                                    // for( var i = 0 ; i < effectivePackagePromotions.length ; i++ ) {
                                                    //     if(effectivePackagePromotions[i].frontPromotionType == 1025 ) {
                                                    //         effectivePromotions.push(effectivePackagePromotions[i]);
                                                    //     }
                                                    // }
                                                    // // 查找促销中的赠品数据
                                                    // var effectiveGiftPromotions = $filter('filter')($scope.promotionInfo.promotions || [], function (prom) {
                                                    //     return $rootScope.promotionType_gift.indexOf(prom.frontPromotionType - 0) >= 0;
                                                    // })
                                                    // if (effectiveGiftPromotions.length > 0) {
                                                    //     p.product.giftDetail = effectiveGiftPromotions[0].promotionGiftDetailList[0].singleGiftInfoList;
                                                    // }
                                                    p.product.packingPromotions = promotionMap[p.product.mpId].promotions;
                                                    //p.product.packingGiftPromotions = effectiveGiftPromotions;
                                                }
                                                if (packingMethodMap[p.product.mpId]) {
                                                    p.product.packingWayList = packingMethodMap[p.product.mpId];
                                                } else {
                                                    p.product.packingWayList = [{id:'', orderMultiple:1}];
                                                }
                                                p.product.chooseNum = 0;
                                                p.product.choosePackingWayNum = p.product.packingWayList[0].orderMultiple;
                                                p.product.productPackageId = p.product.packingWayList[0].id;
                                            })
                                            calculateNum();
                                        } else {
                                            angular.forEach(that.serialProducts || [], function (p) {
                                                if(plistMap[p.product.mpId]){
                                                    $.extend(p.product,plistMap[p.product.mpId]);
                                                }
                                                if(promotionMap[p.product.mpId]){
                                                    p.product.packingPromotions = promotionMap[p.product.mpId].promotions;
                                                }
                                                p.product.packingWayList = [{id:'', orderMultiple:1}];
                                                p.product.chooseNum = 0;
                                                p.product.choosePackingWayNum = p.product.packingWayList[0].orderMultiple;
                                                p.product.productPackageId = p.product.packingWayList[0].id;
                                            })
                                            calculateNum();
                                        }
                                    },function () {
                                        angular.forEach(that.serialProducts || [], function (p) {
                                            if(plistMap[p.product.mpId]){
                                                $.extend(p.product,plistMap[p.product.mpId]);
                                            }
                                            p.product.packingWayList = [{id:'', orderMultiple:1}];
                                            p.product.chooseNum = 0;
                                            p.product.choosePackingWayNum = p.product.packingWayList[0].orderMultiple;
                                            p.product.productPackageId = p.product.packingWayList[0].id;
                                        })
                                        calculateNum();
                                    });
                                } else {
                                    angular.forEach(that.serialProducts || [], function (p) {
                                        if(plistMap[p.product.mpId]){
                                            $.extend(p.product,plistMap[p.product.mpId]);
                                        }
                                        p.product.packingWayList = [{id:'', orderMultiple:1}];
                                        p.product.chooseNum = 0;
                                        p.product.choosePackingWayNum = p.product.packingWayList[0].orderMultiple;
                                        p.product.productPackageId = p.product.packingWayList[0].id;
                                    })
                                    calculateNum();
                                }
                            }, function (error) {
                                angular.forEach(that.serialProducts || [], function (p) {
                                    if(plistMap[p.product.mpId]){
                                        $.extend(p.product,plistMap[p.product.mpId]);
                                    }
                                    p.product.packingWayList = [{id:'', orderMultiple:1}];
                                    p.product.chooseNum = 0;
                                    p.product.choosePackingWayNum = p.product.packingWayList[0].orderMultiple;
                                    p.product.productPackageId = p.product.packingWayList[0].id;
                                })
                                calculateNum();
                            })
                        })
                    } else {
                        angular.forEach(that.serialProducts || [], function (p) {
                            paramsPrSt.mpIds.push(p.product.mpId)
                            that.qualityGoods.push( p.product.mpId);
                        })
                    }
                    paramsPrSt.mpIds = paramsPrSt.mpIds.join();
                    $scope.btnEndLoading = false;
                    $scope.endOtherLoading = false;
                    $rootScope.ajax.get(urlPrSt, paramsPrSt).then( function(result) {
                        if( result && result.code!=0) {
                            $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n("此商品出现问题") + "，" + $scope.i18n("暂时无法购买"), {
                                type: 'info'
                            });
                        }
                        if (result && result.data && result.data.plist) {
                            var pMap = {},actPr=[];
                            angular.forEach(result.data.plist || [], function (p) {
                                pMap[p.mpId] = p;
                            })
                            // pMap 中存放着每个系列品mpId 所对应的实时价格与库存里的系列品属性
                            //过滤没有库存的商品
                            angular.forEach(that.serialProducts || [], function (p) {
                                var pr = p.product;
                                if (pMap[pr.mpId]) {
                                    // extend 将一个或多个对象的方法和属性扩展到一个目的对象中 传入的第一个参数为要被扩展的对象
                                    pr = angular.extend(pr, pMap[pr.mpId]);
                                    if ($rootScope.switchConfig.common.productRestrictedStock) {
                                        if(pr.stockNum>0&&pr.managementState){
                                            actPr.push(p)
                                        }else{
                                            delete pMap[pr.mpId]
                                        }
                                    } else {
                                        if(pr.stockNum>=0&&pr.managementState){
                                            actPr.push(p);
                                        }else{
                                            delete pMap[pr.mpId]
                                        }
                                    }
                                }
                            })
                            that.serialProducts=actPr;
                            that.endSP(prod);
                            if (angular.isFunction(fun)) {
                                fun();
                            }
                        }
                    } );
                    // 商详页选择属性
                    setTimeout(function(){
                        var skuList = document.getElementsByClassName("sku")
                        angular.forEach(attrIdList,function(item){
                            angular.forEach(skuList,function(items){
                                if (items.attributes.attr_id.nodeValue == item) {
                                    angular.element(items).triggerHandler('click');
                                }
                            })
                        })
                    },300)
                } )
            },
            //系列属性后续处理
            endSP: function (prod) {
                var that = this,
                    attrMapProd = {};
                var attrArr = [];
                angular.forEach(that.serialProducts, function (sp,index) {
                    // 将系列品中的key数字取出来
                    var spKeys = sp.key.replace(/(^_|_$)/g, '').replace(/_/g,',');
                    attrArr.push(spKeys);
                    attrMapProd[attrArr[index]] = that.serialProducts[index].product
                })
                prod.map = prod.map || {
                    serialProducts: that.serialProducts,
                    attributes: that.attributes
                };
                //保存最后的组合结果信息
                $scope.SKUResult = {};
                initSKU();
                $('.sku').each(function() {
                    var self = $(this);
                    var attr_id = self.attr('attr_id');
                    if(!$scope.SKUResult[attr_id]) {
                        // self.attr('attrDisabled', 'attrDisabled').addClass('attrDisabled');
                        self.prop("disabled",true);
                    }
                })
                //获得对象的key
                function getObjKeys(obj) {
                    if (obj !== Object(obj)) throw new TypeError('Invalid object');
                    var keys = [];
                    for (var key in obj)
                        if (Object.prototype.hasOwnProperty.call(obj, key))
                            keys[keys.length] = key;
                    return keys;
                }
                //把组合的key放入结果集SKUResult
                function add2SKUResult(combArrItem, sku) {

                    
                    var key = combArrItem.join(",");
                    if($scope.SKUResult[key]) {//SKU信息key属性·
                        $scope.SKUResult[key].count += sku.count;
                        $scope.SKUResult[key].prices.push(sku.price);
                    } else {
                        $scope.SKUResult[key] = {
                            count : sku.count,
                            prices : [sku.price]
                        };
                    }
                }

                //初始化得到结果集
                function initSKU() {
                    var i, j, skuKeys = getObjKeys(attrMapProd);
                    for(i = 0; i < skuKeys.length; i++) {
                        var skuKey = skuKeys[i];//一条SKU信息key
                        var sku = attrMapProd[skuKey];  //一条SKU信息value
                        var skuKeyAttrs = skuKey.toString().split(","); //SKU信息key属性值数组
                        skuKeyAttrs.sort(function(value1, value2) {
                            return parseInt(value1) - parseInt(value2);
                        });
                        //对每个SKU信息key属性值进行拆分组合
                        var combArr = combInArray(skuKeyAttrs);
                        for(j = 0; j < combArr.length; j++) {
                            add2SKUResult(combArr[j], sku);
                        }

                        //结果集接放入SKUResult
                        $scope.SKUResult[skuKeyAttrs.join(",")] = {
                            count:sku.count,
                            prices:[sku.price]
                        }
                    }
                }
                function combInArray(aData) {
                    if(!aData || !aData.length) {
                        return [];
                    }

                    var len = aData.length;
                    var aResult = [];

                    for(var n = 1; n < len; n++) {
                        var aaFlags = getCombFlags(len, n);
                        while(aaFlags.length) {
                            var aFlag = aaFlags.shift();
                            var aComb = [];
                            for(var i = 0; i < len; i++) {
                                aFlag[i] && aComb.push(aData[i]);
                            }
                            aResult.push(aComb);
                        }
                    }

                    return aResult;
                }
                function getCombFlags(m, n) {
                    if(!n || n < 1) {
                        return [];
                    }

                    var aResult = [];
                    var aFlag = [];
                    var bNext = true;
                    var i, j, iCnt1;

                    for (i = 0; i < m; i++) {
                        aFlag[i] = i < n ? 1 : 0;
                    }

                    aResult.push(aFlag.concat());

                    while (bNext) {
                        iCnt1 = 0;
                        for (i = 0; i < m - 1; i++) {
                            if (aFlag[i] == 1 && aFlag[i+1] == 0) {
                                for(j = 0; j < i; j++) {
                                    aFlag[j] = j < iCnt1 ? 1 : 0;
                                }
                                aFlag[i] = 0;
                                aFlag[i+1] = 1;
                                var aTmp = aFlag.concat();
                                aResult.push(aTmp);
                                if(aTmp.slice(-n).join("").indexOf('0') == -1) {
                                    bNext = false;
                                }
                                break;
                            }
                            aFlag[i] == 1 && iCnt1++;
                        }
                    }
                    return aResult;
                }
            },
            //选中/取消属性
            selectSerialAttr: function (value, values,smallValues,bigValues,$event) {
                //value.checked = !value.checked;
                var self = $($event.target || $event.srcElement);
                //选中自己，兄弟节点取消选中
                self.toggleClass('attrActive').siblings().removeClass('attrActive');
                //已经选择的节点
                var selectedObjs = $('.attrActive');
                if( selectedObjs.length == 0 ) {
                    this.canSubmit = false;
                    $scope.itemlist=angular.extend($scope.itemlist,angular.copy($scope.itemlistStore));
                    $scope.preSalePromotion = angular.copy($scope.preSalePromotionStore);
                    if ($scope.itemlist.isPresell) {
                        $rootScope.serviceList = [];
                    }
                    $('.sku').each(function() {
                        $scope.SKUResult[$(this).attr('attr_id')] ? $(this).prop('disabled',false) : $(this).prop('disabled',true);
                    })
                }else if(selectedObjs.length>0){
                    //获得组合key价格
                    $scope.selectedIds = [];
                    $scope.attrIdList = []
                    selectedObjs.each(function(){
                        $scope.selectedIds.push($(this).attr('attr_id'));
                        $scope.attrIdList.push($(this).attr('attr_id'));
                    });
                    $scope.selectedIds.sort(function(value1,value2){
                        return parseInt(value1) - parseInt(value2);
                    });
                    // 新增商品属性选择
                    var replaceUrl = '#?itemId=' + $scope.params.itemId + '&attrId=' + $scope.attrIdList.join('_')
                    $window.history.replaceState(null,'',replaceUrl)
                    var len = $scope.selectedIds.length;
                    if (len == this.attributes.length) {
                        this.canSubmit = true;
                        let mapAttrId= $scope.attrIdList.join('_');
                        // convert map
                        let serialProducts = $rootScope.serialProducts;
                        console.log('serialProducts=>' + JSON.stringify(serialProducts));
                        let serialMap = serialProducts.reduce(function (rtv, item) {
                            var se = item.serialAttrList.map(function(x) {return x.valueId;}).join('_');
                            rtv[se] = item.mpid
                            return rtv;
                        },{});

                        let productCode = '';
                        var url = '/custom-sbd-web/product/getProductByMpId.do';
                        var params = {
                            id: serialMap[mapAttrId]
                        };
                        $rootScope.ajax.postJson(url,params).then(function (res) {
                            console.log('res=>' + JSON.stringify(res))
                            if( res.code == 0 ) {
                                $scope.itemlist.code = res.data.code;
                            }
                        })

                        this.updateSerialProduct($scope.itemlist);
                    } else {
                        this.canSubmit = false;
                        $scope.itemlist=angular.extend($scope.itemlist,angular.copy($scope.itemlistStore));
                        if ($scope.itemlist.isPresell) {
                            $rootScope.serviceList = [];
                        }
                        $(".jqzoom").data("jqzoom",null);
                            if($(".jqzoom").find('.zoomPad').length>0){
                                $(".jqzoom").prepend($(".zoomPad").hide().find('.item-img'));
                                $(".zoomPad").remove();
                            }
                            $(".jqzoom").unbind('mouseover'); //关键操作3
                            $(".jqzoom img").unbind('mouseover'); //关键操作4
                            $(".jqzoom").jqzoom({
                                zoomType:"standard",
                                lens:true,
                                preloadImages:false,
                                alwaysOn:false,
                                zoomWidth:500,
                                zoomHeight:500
                            });
                    }
                    //用已选中的节点验证待测试节点 underTestObjs
                    $('.sku').not(selectedObjs).not(self).each(function(){
                        var siblingsSelectedObj = $(this).siblings('.attrActive');
                        var testAttrIds = [];//从选中节点中去掉选中的兄弟节点
                        if(siblingsSelectedObj.length) {
                            var siblingsSelectedObjId = siblingsSelectedObj.attr('attr_id');
                            for(var i = 0; i < len; i++) {
                                ($scope.selectedIds[i] != siblingsSelectedObjId) && testAttrIds.push($scope.selectedIds[i]);
                            }
                        } else {
                            testAttrIds = $scope.selectedIds.concat();
                        }
                        testAttrIds = testAttrIds.concat($(this).attr('attr_id'));
                        testAttrIds.sort(function(value1, value2) {
                            return parseInt(value1) - parseInt(value2);
                        });
                        if(!$scope.SKUResult[testAttrIds.join(',')]) {
                            // $(this).removeClass('attrActive').addClass('attrDisabled');
                            $(this).prop('disabled',true)
                        } else {
                            // $(this).removeClass('attrDisabled');
                            $(this).prop('disabled',false)
                        }
                    });
                }else{
                    //设置属性状态
                    $('.sku').each(function() {
                        $scope.SKUResult[$(this).attr('attr_id')] ? $(this).prop('disabled',false) : $(this).prop('disabled',true);
                    })

                }
            },
            getSerialProducts: function (prod, type) {
                //  prod为 $scope.itemlist[0]
                var that = this;
                //商品里面没有相应的map时, 先去取系列属性
                //isSeries是否是系列品 0不是 1是
                if ($scope.itemlist.typeOfProduct != 3) return;

                if (type == 'gift') {
                    this.skuType = type;
                } else {
                    this.skuType = 'common';
                }
                // map里面存放着系列品属性和规格
                //普通商品没有map属性，商品为系列品的话调接口取系列属性

                if (!prod.map) {
                    this.getSP(prod, function () {
                        that.getSerialProducts(prod)
                    });
                    return;
                }
                // getSp函数去去系列品属性 取完后回调再执行getSerialProducts
                prod.edit = true;
                // this.attributes = angular.copy(prod.map.attributes || []);
                // this.serialProducts = angular.copy(prod.map.serialProducts || []);
                //获取商品对属性的映射关系
                // angular.forEach(this.serialProducts, function (p) {
                //     that.mpId_attrId[p.product.mpId] = p.key.replace(/(^_|_$)/g, '').split('_');
                //     that.allValidAttrId = that.allValidAttrId.concat(that.mpId_attrId[p.product.mpId]);
                // })
                // this.mpId_attrId 存放着子品的mpId对应的是子品的key组合id
                // this,allValidAttrId 中存放着所有的key组合id
                // this.serialProducts存放着子品的对象
                //获取属性对商品的映射关系
                // angular.forEach(this.attributes, function (a) {
                //     angular.forEach(a.values, function (v) {
                //         that.attrId_mpId[v.id] = v.mpId;
                //     })
                // })
                // this.attrId_mpId 存放着子品每一个key属性id对应着子品mpId
                //按默认选中的属性选择
                // angular.forEach(this.attributes, function (a) {
                //     angular.forEach(a.values, function (v) {
                //         if (v.checked) {
                //             v.checked = !v.checked;
                //             that.selectSerialAttr(v, a.values)
                //         }
                //     })
                // })
            },
            rollback: function (prod) {
                //还原
                this.attributes = [];  //系列属性
                this.serialProducts = []; //系列商品
                this.mpId_attrId = {};  //商品映射属性
                this.attrId_mpId = {};  //属性映射商品
                this.allValidAttrId = [];  //所有可用的属性
                this.selectedAttr = {}; //选中的属性
                this.selectedProd = {}; //选中的系列商品
                this.canSubmit = false; //是否可以确认属性选择
                prod.edit = false;
            },
            //切换属性， 要切换系列品对应的促销活动
            updateSerialProduct: function (prod) {
                if (!this.canSubmit) {
                    $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('请选择想要修改的商品') + '!', {title: $scope.i18n('提示')});
                    return;
                }
                prod.map.attributes = this.attributes;
                //获取对应商品id
                var keys = [], that = this;
                angular.forEach($scope.selectedIds, function (a) {
                    keys.push(a);
                })
                keys = keys.sort().join('_');
                angular.forEach(this.serialProducts, function (p) {
                    var tKey = p.key.replace(/(^_|_$)/g, '').split('_').sort().join('_');
                    if (tKey == keys) {
                        that.selectedProd = p.product;
                        //更新价格与库存
                        $scope.itemlist=angular.extend($scope.itemlist,{
                            isVirtual:false,//支付按钮可点击
                            typeOfProduct:null,
                            isPresell: that.selectedProd.isPresell,
                            isSeckill: that.selectedProd.isSeckill,
                            mpId:that.selectedProd.mpId,
                            price:that.selectedProd.price,
                            availablePrice:that.selectedProd.availablePrice,
                            availablePriceText:that.selectedProd.availablePriceText,
                            lackOfStock:that.selectedProd.lackOfStock,
                            marketPrice:that.selectedProd.marketPrice,
                            promotionPrice:that.selectedProd.promotionPrice,
                            stockNum:that.selectedProd.stockNum,
                            highestPrice: that.selectedProd.highestPrice,
                            stockText:that.selectedProd.stockText,
                            originalPrice:that.selectedProd.originalPrice,
                            pictureUrlList:that.selectedProd.pictureUrlList,
                            isAreaSale:that.selectedProd.isAreaSale,
                            //更新积分商品信息
                            individualLimit:that.selectedProd.individualLimit,
                            individualLimitNum:that.selectedProd.individualLimit,
                            pointPrice:that.selectedProd.pointPrice,
                            realTimeStock:that.selectedProd.realTimeStock,
                            securityVOList: that.selectedProd.securityVOList,
                            name:that.selectedProd.name,
                            managementState : that.selectedProd.managementState
                        });
                        //需要调促销接口
                    }
                });
                //重新加载图片
                $(".jqzoom").data("jqzoom",null)
                if($(".jqzoom").find('.zoomPad').length>0){
                    $(".jqzoom").prepend($(".zoomPad").hide().find('.item-img'));
                    $(".zoomPad").remove();
                }
                $(".jqzoom").unbind('mouseover'); //关键操作3
                $(".jqzoom img").unbind('mouseover'); //关键操作4
                $(".jqzoom").jqzoom({
                    zoomType:"standard",
                    lens:true,
                    preloadImages:false,
                    alwaysOn:false,
                    zoomWidth:500,
                    zoomHeight:500
                });
                //如果不是预售， 调服务和价格的接口； //如果是预售， 调价格的接口
                if (!$scope.itemlist.isPresell) {
                    //$rootScope.goodService($scope.itemlist.mpId);产品化1.2没有服务商品功能，注释
                } else {
                    $rootScope.serviceList = [];
                    var url = $rootScope.host + '/realTime/getPriceStockList',
                        params = {
                            mpIds: [$scope.itemlist.mpId],
                            areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
                        };
                    $rootScope.ajax.get(url,params).then(function (res) {
                        if( res.code == 0 ) {
                            if( res.data.plist != null && res.data.plist.length > 0 ) {
                                angular.forEach(res.data.plist , function(val) {
                                    $scope.pcIteminfo._getPromotionInfo(val.mpId)
                                    $scope.itemlist.stockNum = val.stockNum;
                                    $scope.itemlist.highestPrice = val.highestPrice;
                                    $scope.itemlist.stockText = val.stockText;
                                    $scope.itemlist.availablePrice = val.availablePrice;
                                    $scope.itemlist.originalPrice = val.originalPrice;
                                    $scope.itemlist.presellDownPrice = val.presellDownPrice;
                                    $scope.itemlist.presellOffsetPrice = val.presellOffsetPrice;
                                    $scope.itemlist.balancePayment = val.balancePayment;
                                    $scope.itemlist.presellBookedNum = val.presellBookedNum;
                                })
                            }
                        }
                    })
                }

                $rootScope.serviceGoodMesage = $scope.itemlist;
            }
        },
        _updatedProducts: function (n) {
            this.itemAmount = parseInt(this.itemAmount) + n;
            if (!this.itemAmount ||this.itemAmount<=0) {
                this.itemAmount = 1;
            } else {
                if (this.itemAmount > $scope.itemlist.stockNum) {
                    this.itemAmount = $scope.itemlist.stockNum;
                    $scope.pcIteminfo._showLimitDiv();
                } else if ($scope.itemlist.individualLimitNum > 0 && this.itemAmount > $scope.itemlist.individualLimitNum) {//有限购, 并且超出了限购
                    var that = this;
                    if (that.tipPop && !$scope.isPointPro){
                        $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('商品限购') + $scope.itemlist.individualLimitNum + $scope.i18n('件') + ',' + $scope.i18n('超出部分将以原价购买'), {
                            type: 'confirm',
                            btnOKText: $scope.i18n('继续购买'),
                            ok: function () {
                                that.tipPop = false;
                            },
                            cancel: function () {
                                that.itemAmount = $scope.itemlist.individualLimitNum;
                            }
                        });
                    } else if($scope.isPointPro){
                        that.itemAmount = $scope.itemlist.individualLimitNum;
                        $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('对不起') + ',' + $scope.i18n('您的购买数量超过可兑换数量'));
                    }

                }
            }
            //html没有展示此接口返回的值，注释此接口 产品化1.2
            //$rootScope.localProvince._computeDeliveryFee($scope.params.itemId, $scope.pcIteminfo.itemAmount);
        },
        _showLimitDiv: function () {
            window.clearTimeout($scope.tmid);
            var _html = $('<div class="amount-msg" style="position:absolute;bottom:0px;left:100px;width:125px;color:black">'+$scope.i18n("最多购买")+'<span style="color: red;">' + $scope.itemlist.stockNum + '</span>'+$scope.i18n("件")+'<em></em></div>');
            $(".amount-msg").remove();
            $('.stock-text').append(_html);
            $scope.tmid = window.setTimeout(function () {
                $(".amount-msg").fadeOut("slow", function () {
                    $(".amount-msg").remove();
                });
                window.clearTimeout($scope.tmid);
            }, 1000);
        },
        _getPromotionInfo: function (itemParams) {
            var areasCodeOneCode = '';
            if( $rootScope.util.getCookies("areasCode") ) {
                $rootScope.areasCode = JSON.parse($rootScope.util.getCookies("areasCode"));
                areasCodeOneCode = $rootScope.areasCode.oneCode;
            }
            $scope.startCountDown = false;
            var url =$rootScope.host +  '/promotion/promotionInfo',
                params = {
                    mpIds:itemParams||$scope.params.itemId,
                    platformId:$rootScope.platformId,
                    areaCheckFlag: 1,
                    areaCode:areasCodeOneCode
                };
            $rootScope.ajax.get(url,params).then(function (res) {
                if (res.data&&res.data.promotionInfo&&res.data.promotionInfo.length>0) {
                    $scope.promotionInfo = res.data.promotionInfo[0];
                    $scope.promotionType_s = $filter('filter')($scope.promotionInfo.promotions || [], function (prom) {
                        return $rootScope.singlePromotions.indexOf(prom.frontPromotionType - 0) >= 0;
                    })[0];
                    var preSalePromotionStore = {};
                    $scope.promotionType_m = $filter('filter')($scope.promotionInfo.promotions || [], function (prom) {
                        if (prom.frontPromotionType == 1022) {
                            preSalePromotionStore = prom;
                            //预售说明展示的判断
                            if (prom.description && prom.description.length >= 100) {
                                $scope.showMoreDesc = true;
                            }
                        }
                        if (prom.frontPromotionType == 1012) {
                            return;
                        }
                        return $rootScope.PackagePromotions.indexOf(prom.frontPromotionType - 0) < 0;
                    });
                    $scope.preSalePromotionStore = preSalePromotionStore;
                    $scope.preSalePromotion = angular.copy(preSalePromotionStore);
                    $scope.promotionType_Package = $filter('filter')($scope.promotionInfo.promotions || [], function (prom) {
                        return $rootScope.promotionTypePackage.indexOf(prom.frontPromotionType - 0) >= 0;
                    })
                    for( var i = 0 ; i < $scope.promotionType_Package.length ; i++ ) {
                        if( $scope.promotionType_Package[i].frontPromotionType == 1025 ) {
                            $scope.promotionType_m.push($scope.promotionType_Package[i]);
                        }
                    }
                    // 查找促销中的赠品数据
                    $scope.promotionType_gift = $filter('filter')($scope.promotionInfo.promotions || [], function (prom) {
                        return $rootScope.promotionType_gift.indexOf(prom.frontPromotionType - 0) >= 0;
                    })
                    if ($scope.promotionType_gift.length > 0) {
                        if( $scope.promotionType_gift[0].promotionGiftDetailList && $scope.promotionType_gift[0].promotionGiftDetailList.length > 0) {
                            $scope.giftDetail = $scope.promotionType_gift[0].promotionGiftDetailList[0].singleGiftInfoList;
                            if($scope.giftDetail) {
                                if($scope.giftDetail.length>6){
                                    $scope.noArrowRight=true
                                }else{
                                    $scope.yesArrowRight=true;
                                }
                                var totalNum = $scope.giftDetail.length;
                            }
                        }
                    }
                    if ($rootScope.switchConfig.common.showChoosePackingMethod && $scope.itemlist) {
                        $scope.itemlist.packingPromotions = angular.copy($scope.promotionType_m);
                    }
                    var giftDetailNum = 0;
                    if( totalNum % 5 == 0 ) {
                        giftDetailNum = totalNum / 5 - 1
                    } else {
                        giftDetailNum = Math.floor( totalNum / 5 );
                    }
                    var picNum = 0;
                    $scope.giftArrowLeft = function() {
                        if( picNum === giftDetailNum ) {
                            return;
                        }
                        picNum++;
                        if((picNum+1)*6>$scope.giftDetail.length){
                            $scope.noArrowRight=false;
                            $scope.yesArrowRight=true;
                        }
                        $scope.noArrowLeft=false;
                        $scope.yesArrowLeft=true;
                        var target = -picNum * 455;
                        $(".gift-box").css({
                            transition:"all 0.5s",
                            left : target + 'px'
                        })
                    }
                    $scope.giftArrowRight = function() {
                        if (picNum === 0) {
                            return;
                        }
                        if(picNum===1){
                            $scope.noArrowRight=true;
                            $scope.yesArrowRight=false;
                        }
                        picNum--;
                        $scope.noArrowLeft = true;
                        $scope.yesArrowLeft = false;
                        var target = -picNum * 455;
                        $(".gift-box").css({
                            transition:"all 0.5s",
                            left : target + 'px'
                        })
                    }
                    // 筛选level=1的数据
                    $scope.trueLevel = []

                    angular.forEach($scope.promotionType_Package, function (val) {
                        val.checked = false;
                        $scope.promotionType_Package[0].checked = true;
                        angular.forEach(val.promotionRuleList, function (values, index) {
                            if(values.level !== 0) {
                                $scope.trueLevel.push(values);
                                values.index = index;
                                values.flag = false;
                            }

                            values.arrlength = values.mpList.length;
                            angular.forEach(values.mpList,function(x){
                                if( x.attributes ) {
                                    x.isSeries = 1;
                                } else {
                                    x.isSeries = 0;
                                }
                            })
                        })
                        $scope.trueLevel[0]['flag'] = true;
                    })

                    // 套餐商品中的唯一主品对象集合
                    $scope.mainOneObject = [];
                    if( GetQueryString('mainItemId') && $scope.queryPackageMesOne  ) {
                        if( $scope.queryPackageMesMain.length>0&&$scope.queryPackageMesOne.length>0 ) {
                            $scope.totalMoney = 0;
                            angular.forEach( $scope.promotionType_Package , function(v) {
                                v.checked = false;
                                angular.forEach( v.promotionRuleList ,function(val) {
                                    val.packageChoseNum = 0;
                                    angular.forEach( $scope.queryPackageMesOne , function(a) {
                                        if( a.promotionId == v.promotionId ) {
                                            if( val.level == 1 ) {
                                                angular.forEach( val.mpList , function( x,index ) {
                                                    if( x.childProductList ) {
                                                        angular.forEach( x.childProductList , function(h) {
                                                            if(  a.mpId == h.product.mpId )
                                                                if(a.checked) {
                                                                    v.checked = true;
                                                                    val.mpList[index].isChose = true;
                                                                    val.packageChoseNum++;
                                                                    val.mpList[index].price = h.product.price;
                                                                    val.mpList[index].promPrice = h.product.promPrice;
                                                                    // val.isChangeNum++;
                                                                    val.mpList[index].num = a.num;
                                                                    $scope.totalMoney += val.mpList[index].num * val.mpList[index].promPrice;
                                                                    $scope.packageMethod.chosePackage($scope.promotionType_Package,v,v.promotionRuleList,true);
                                                                    if( val.conditionValue <= val.packageChoseNum ) {
                                                                        val.isChecked = true;
                                                                        $scope.isActive = true;
                                                                        $scope.isDisabled = false;
                                                                    } else {
                                                                        $scope.isActive = false;
                                                                        $scope.isDisabled = true;
                                                                    }
                                                                }
                                                        } )
                                                    } else {
                                                        if( a.mpId == x.mpId  ) {
                                                            if(a.checked) {
                                                                v.checked = true;
                                                                x.isChose = true;
                                                                val.packageChoseNum++;
                                                                // val.isChangeNum++;
                                                                x.num = a.num;
                                                                $scope.totalMoney += x.num * x.promPrice;
                                                                $scope.packageMethod.chosePackage($scope.promotionType_Package,v,v.promotionRuleList,true);
                                                                if( val.conditionValue <= val.packageChoseNum ) {
                                                                    val.isChecked = true;
                                                                    $scope.isActive = true;
                                                                    $scope.isDisabled = false;
                                                                } else {
                                                                    $scope.isActive = false;
                                                                    $scope.isDisabled = true;
                                                                }
                                                            }
                                                        }
                                                    }
                                                } )
                                            }}
                                    } )
                                })
                            } )
                            // 套餐商品加主
                            angular.forEach($scope.promotionType_Package, function (val) {
                                angular.forEach(val.promotionRuleList, function (values) {
                                    if(values.level == 0) {
                                        angular.forEach($scope.queryPackageMesMain,function(x) {
                                            if (x.promotionId == val.promotionId) {
                                                if( values.mpList[0].childProductList ) {
                                                    angular.forEach(values.mpList[0].childProductList, function (n) {
                                                        if (n.product.mpId == x.mpId) {
                                                            // values.mpList[0] = angular.extend(values.mpList[0], n.product );
                                                            values.mpList[0].mainIsChose = true;
                                                            values.mpList[0].num = x.num;
                                                            values.mpList[0].price = n.product.price;
                                                            values.mpList[0].promPrice = n.product.promPrice
                                                            $scope.totalMoney += values.mpList[0].num * values.mpList[0].promPrice;

                                                        }
                                                    })
                                                } else if( values.mpList[0].mpId == x.mpId ) {
                                                    values.mpList[0].mainIsChose = true;
                                                    values.mpList[0].num = x.num;
                                                    $scope.totalMoney += values.mpList[0].num * values.mpList[0].promPrice;
                                                }
                                            }
                                        })
                                    }
                                })
                            })
                        } else {
                            $scope.isActive = false;
                            $scope.isDisabled = true;
                            $scope.totalMoney = 0;
                            angular.forEach($scope.promotionType_Package, function (val) {
                                angular.forEach(val.promotionRuleList, function (values) {
                                    values.packageChoseNum = 0;
                                    if(values.level == 0) {
                                        angular.forEach($scope.queryPackageMesMain,function(x) {
                                            if (x.promotionId == val.promotionId) {
                                                if( values.mpList[0].childProductList ) {
                                                    angular.forEach(values.mpList[0].childProductList, function (n) {
                                                        if (n.product.mpId == x.mpId) {
                                                            // values.mpList[0] = angular.extend(values.mpList[0], n.product );
                                                            values.mpList[0].mainIsChose = true;
                                                            values.mpList[0].num = x.num;
                                                            values.mpList[0].price = n.product.price;
                                                            values.mpList[0].promPrice = n.product.promPrice
                                                            $scope.totalMoney += values.mpList[0].num * values.mpList[0].promPrice;
                                                            if(!$scope.packageObject) {
                                                                $scope.packageMethod.chosePackage($scope.promotionType_Package,val,val.promotionRuleList,true);
                                                            }
                                                        }
                                                    })
                                                } else if( values.mpList[0].mpId == x.mpId ) {
                                                    values.mpList[0].mainIsChose = true;
                                                    values.mpList[0].num = x.num;
                                                    $scope.totalMoney += values.mpList[0].num * values.mpList[0].promPrice;
                                                    if(!$scope.packageObject) {
                                                        $scope.packageMethod.chosePackage($scope.promotionType_Package,val,val.promotionRuleList,true);
                                                    }
                                                }
                                            }
                                        })
                                    }
                                })
                            })
                            if(!$scope.packageObject) {
                                $scope.clickPackage = angular.copy($scope.promotionType_Package[0] ? $scope.promotionType_Package[0].promotionRuleList : []);
                                // 套餐商品副品的对象集合
                                $scope.packageObject = [];
                                $scope.totalMoney = 0;
                                // 套餐一共多少组
                                angular.forEach(angular.copy($scope.clickPackage), function (values) {
                                    if (values.level) {
                                        $scope.packageObject.push(values);
                                    }
                                })
                            }
                        }
                    } else {
                        $scope.isActive = false;
                        $scope.isDisabled = true;
                        $scope.clickPackage = angular.copy($scope.promotionType_Package[0] ? $scope.promotionType_Package[0].promotionRuleList : []);
                        // 套餐商品副品的对象集合
                        $scope.packageObject = [];
                        $scope.totalMoney = 0;
                        // 套餐一共多少组
                        angular.forEach(angular.copy($scope.clickPackage), function (values) {
                            if (values.level) {
                                $scope.packageObject.push(values);
                                $scope.packageObject[0].flag = true;
                                $scope.limitToValue = $scope.packageObject[0].conditionValue
                            }
                        })
                    }
                    //选中商品时进行的操作
                    if($scope.promotionType_Package.length>0) {
                        if( $scope.packageObject) {
                            $scope.packageMove($scope.packageObject[0].mpList.length);
                            $scope.packageTeamMove($scope.packageObject.length);
                            //$scope.packageObject.length
                            $scope.limitToValue = $scope.packageObject[0].conditionValue;
                        } else {

                        }
                    }
                    angular.forEach($scope.packageObject,function(o,dex) {
                        if( GetQueryString('mainItemId') == null ) {
                            o.packageChoseNum = 0;
                        }
                    })

                    // 使套餐图片滑动
                    // 立即购买选择好的套餐商品
                    //套餐点击选择的操作
                    $scope.packageTotalNum = 0;
                    $scope.initOrderData = [];
                    $scope.initOrderDataIm = []
                    angular.forEach( $scope.queryPackageMesMain,function(val) {
                        if( val.additionalProductList ) {
                            angular.forEach( val.additionalProductList,function(x) {
                                $scope.initOrderData.push({"mpId":val.mpId,"num":val.num,"itemType":1025,"objectId":val.promotionId,"isMain":1,"additionalItems":[{"mpId":x.mpId,"num":x.num}]})
                                $scope.initOrderDataIm.push({"mpId":val.mpId,"num":val.num,"itemType":1025,"objectId":val.promotionId,"isMain":1,"additionalItems":[{"mpId":x.mpId,"num":x.num}]})

                            } )
                        }
                        $scope.initOrderData.push({"mpId":val.mpId,"num":val.num,"itemType":1025,"objectId":val.promotionId,"isMain":1})
                        $scope.initOrderDataIm.push({"mpId":val.mpId,"num":val.num,"itemType":1025,"objectId":val.promotionId,"isMain":1})

                    } )
                    angular.forEach( $scope.queryPackageMesOne,function(v) {
                        if( v.additionalProductList) {
                            angular.forEach( v.additionalProductList,function(x) {
                                $scope.initOrderData.push({"mpId":v.mpId,"num":v.num,"itemType":1025,"objectId":v.promotionId,"isMain":0,"additionalItems":[{"mpId":x.mpId,"num":x.num}]})
                                $scope.initOrderDataIm.push({"mpId":v.mpId,"num":v.num,"itemType":1025,"objectId":v.promotionId,"isMain":0,"additionalItems":[{"mpId":x.mpId,"num":x.num}]})

                            } )
                        } else {
                            $scope.initOrderData.push({"mpId":v.mpId,"num":v.num,"itemType":1025,"objectId":v.promotionId,"isMain":0});
                            $scope.initOrderDataIm.push({"mpId":v.mpId,"num":v.num,"itemType":1025,"objectId":v.promotionId,"isMain":0});
                        }

                    } )
                    var hasIsMain = false;
                    angular.forEach( $scope.initOrderData,function(p) {
                        if( p.isMain ) {
                            hasIsMain = true;
                            $scope.packageTotalNum = $scope.initOrderData.length - 1;
                        }
                        if( !hasIsMain ) {
                            $scope.packageTotalNum = $scope.initOrderData.length;
                        }
                    } )

                    // 促销的折叠与展开
                    $scope.jumpUrl = function (e) {
                        switch (e.frontPromotionType) {
                            case 1:
                            case 7:
                            case 8:
                            case 1022:
                            case 2001:
                            case 2002:
                            case 3001:
                            case 1014:
                            case 1015:
                            case 1007:
                            case 1032:
                            case 1033:
                            case 1034:
                                break;
                            case 1005:
                                $scope.giftIsShow = true;
                                break;
                            case 1007:
                                break;
                            case 1012:
                                location.href = "/seckill.html";
                                break;
                            case 1013:
                                location.href = "/iflashbuy.html";
                                break;
                                case 1025:
                                location.href = '/detail-include/package.html?mpId=' + itemId;
                                break;
                            default:
                                location.href = "/search.html?promotionId=" + e.promotionId + "&merchantId=" + $scope.itemlist.merchantId
                        }
                    }
                    if ($scope.promotionType_m.length) {
                        $scope.promotionNum = 2;
                    }
                }
            }, function (error) {
                $rootScope.error.checkCode($scope.i18n('商品信息错误'), $scope.i18n('获取商品信息异常'));
            })
        },
        switchImg: function (c, index) {
            c.imgFold = true;
            if (c.imgOnIndex != index) {
                angular.forEach(c.imgArr, function (img, i) {
                    if (i == index) {
                        img.on = true;
                        c.imgOnIndex = index;
                    } else {
                        img.on = false;
                    }
                });
            }
            c.addImgFold = true;
            if (c.imgOnIndex != index) {
                angular.forEach(c.addImgArr, function (img, i) {
                    if (i == index) {
                        img.on = true;
                        c.imgOnIndex = index;
                    } else {
                        img.on = false;
                    }
                });
            }
        },
        // 判断商品是否已经收藏
        _checkFavorite: function () {
            if (!_ut) {
                //如果没有登录, 默认没有加入收藏
                $scope.isFavorite = false;
                return;
            }
            var url = "/ouser-center/api/favorite/queryIsFavorite.do",
                params = {
                    entityType: 1,//商品
                    entityId: $scope.itemId
                }
            $rootScope.ajax.post(url, params)
            .then(function (res) {
                if (res.code == 0){
                    $scope.isFavorite = (res.data || {}).isFavorite;
                }else {
                    $scope.isFavorite = false;
                }
            })
        },
        //收藏商品
        _addFavorite: function () {
            if(!_ut){
                $rootScope.showLoginBox = true;
                return;
             }
            //跟踪云
            $scope.heimdall.ev = "3";
            try{
                window.eventSupport.emit('heimdallTrack',$scope.heimdall);
            }catch(err){
            }
            if(!$scope.productManagementState){
                 $scope.favoriteSoldOut=true;
            }
            $scope.sureCheckFavorite = false;
            if ($scope.isFavorite) {
                $scope.sureCheckFavorite = true;
                return;
            }
            $scope.obj.isCheckFavorite = true;
            // var url = '/ouser-center/api/favorite/add.do',
            //     params = {
            //         entityType: 1,//商品
            //         entityId: $scope.itemId
            //     }
            // $rootScope.ajax.post(url, params)
            // .then(function (res) {
            //     if(res.code == 0) {
            //         $scope.isCheckFavorite = true;
            //     }
            //     $scope.pcIteminfo._checkFavorite();
            // })
        },
        // 获取商品销量
        _getItemVolume4sale : function (mpId) {
            var url = '/search/rest/getMpSaleNum.do';
            var params = {
                mpIds : mpId
            }
            $rootScope.ajax.get( url , params ).then( function (res) {
                if( res.code == 0 && res.data && res.data.dataList && res.data.dataList.length > 0 ) {
                    for( let i = 0 ; i < res.data.dataList.length ; i++ ) {
                        if( mpId == res.data.dataList[i].mpId ) {
                            $scope.itemlist.checkVolume4sale = res.data.dataList[i].saleNum
                        }
                    }
                }
            } )
        }
    }
    //修改套餐
    $scope.modifyPackage = function() {
        function GetQueryString(name) {
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if(r!=null)return  unescape(r[2]); return null;
        }
        if( GetQueryString('mainItemId') ) {
            var url = $rootScope.host + '/cart/getCartItem';
            var params = {
                ut : $rootScope.util.getUserToken(),
                sessionId:$rootScope.sessionId,
                platformId:$rootScope.platformId,
                itemId:GetQueryString('mainItemId'),
                areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
            }
            $rootScope.ajax.post(url,params).then(function(res){
                $scope.queryPackageMes = res.data.mpList;
                $scope.queryPackageMesMain = [];
                $scope.queryPackageMesOne = [];
                angular.forEach($scope.queryPackageMes,function(val) {
                    val.checked = true;
                    if( val.mainItemId == "isMain" ) {
                        $scope.queryPackageMesMain.push(val);
                    } else {
                        $scope.queryPackageMesOne.push(val);
                    }
                })
            })
        }
    }
    //初始化数据
    $scope.modifyPackage();
    $scope.pcIteminfo._init();
    //html没有展示此接口返回的值，注释此接口 产品化1.2
    $rootScope.$watch('localProvince.province.provinceCode',function(n,o){
        if($scope.params.itemId&&n!=o){
            $scope.isStoreItem=false;
            $scope.crumbList = [];
            $scope.getcrumbList();
            $scope.isProductLoading = false;
            //套餐用到的参数
            $scope.packageAttrArr = [];
            $scope.jqimgindex = 0;
            $scope.selectedPromotion={};//选中促销列表
            $scope.isShowNoProduct=false;//默认有商品时
            $scope.itemlist=[];
            $scope.itemlistStore=[];
            $scope.preSalePromotionStore={};
            $scope.packageItemListStore = [];
            $scope.itemAttrUrl= "";
            $scope.itemAttrSpec= "";
            $scope.tmid = 0;
            $scope.attrs = [];//系列品属性集合
            $scope.mpses = [];//系列品商品集合
            $scope.selects = [];//选中的属性组合
            //促销相关
            $scope.promotionInfo=null;//促销信息
            $scope.promotionType_s=null;//单一促销
            $scope.promotionType_m=[];//非单一促销
            $scope.isMainBoolthree = true;
            $scope.promotionNum=1;
            $scope.noArrowLeft=true;//满赠弹框默认不可点击
            $scope.yesArrowLeft=false;
            $scope.yesArrowRight=false;
            //大图下面的切换按钮
            $scope.noImgArrowLeft=true;
            $scope.yesImgArrowLeft=false;

            //套餐切换按钮
            $scope.isPackageUpMove=false;
            $scope.isPackageDownMove=true;
            //优惠券
            $scope.curruntTabCoupon=1;
            $scope.couponShow=false;
            $scope.btnEndLoading = true;
            $scope.endOtherLoading = true;
            $scope.modifyPackage();
            $scope.pcIteminfo._init();
        }
    });
    // 评价， 咨询， 问大家的列表接口
    $scope.$on('changePageNo', function (event, data) {
        "use strict";
        if ($scope.curruntTab == 4) {
            $scope.comment.pageNo = data;
            // $scope.comment._getEvaluationList(false);
        } else if($scope.curruntTab == 5) {
            $scope.QacurrentPage = data;
            $scope.takeQa();
        } else if ($scope.curruntTab == 6){
            $scope.takeQaCurrentPage = data;
            $scope.takeConsultation();
        }
    })
    //初始化数据， 只取一次
    $scope.isFirstItemSpec = true;
    $scope.isFirstItemService = true;
    $scope.curruntTab = 1;
    //最下面的切换tab
    $scope.changeItemDetail = function(type) {
        switch(type){
            case 1:
                $scope.curruntTab = 1;
                break;
            case 2:
                $scope.curruntTab = 2;
                $scope.pcIteminfo._getItemSpec();
                break;
            case 3:
                $scope.curruntTab = 3;
                $scope.pcIteminfo._getItemService();
                break;
            case 4:
                $scope.curruntTab = 4;
                $scope.comment.pageNo= 1;
                $scope.comment.totalCount= 0;
                $scope.comment.rateFlag = 0;
                $scope.comment.hasPic = 0;
                // $scope.comment._getEvaluationList(false);
                break;
            case 5:
                $scope.curruntTab = 5;
                $scope.QacurrentPage = 1;
                $scope.QaitemsPerPage = 10;
                $scope.takeQa();
                break;
            case 6:
                $scope.curruntTab = 6;
                $scope.takeQaItemsPerPage = 10;
                $scope.takeQaCurrentPage = 1;
                $scope.takeConsultation();
                break;
            default:
                $scope.pcIteminfo._getItemDetail();
                break;
        }
    }

    // 关闭收藏弹框
    $scope.closeCheckFavorite = function() {
        $scope.sureCheckFavorite = false;
    }
    $scope.closeFavoriteSoldOut = function() {
        $scope.favoriteSoldOut = false;
    }
    $scope.closeCheckFavorite();
    $rootScope.serviceGoodId = null;
    $scope.oneKey= {
        choseServiceGood:function(id,value,a){
            $rootScope.serviceGoodId = id;
            a.checked = !a.checked;
            angular.forEach(value,function(val) {
                if( a.id !== val.id ){
                    val.checked = false;
                }
            })
            if(!a.checked) {
                $rootScope.serviceGoodId = null;
                return false;
            }
        },
        _buy: function (v) {
            if($scope.code==4||$scope.code==5){
                return;
            }
            //跟踪云埋点
            $scope.heimdall.ev = "15";
            try{
                window.eventSupport.emit('heimdallTrack',$scope.heimdall);
            }catch(err){
            }
            var serviceGood = JSON.stringify([{'mpId':v.mpId,'num':$scope.pcIteminfo.itemAmount,'itemType':$scope.isPointPro?'6':'0','additionalItems':[{'mpId':$rootScope.serviceGoodId,'num':1}]}]);
            if( $rootScope.serviceGoodId===null ) {
                serviceGood = JSON.stringify([{'mpId':v.mpId,'num':$scope.pcIteminfo.itemAmount,'itemType':$scope.isPointPro?'6':'0'}])
            }
            $scope.sysSource = 'ody';
            if(v&&v.pointPrice){
                $scope.sysSource = 'INTEGRAL_MALL';
                //不在兑换时间内的积分商品
                if(!$scope.canExchange){
                    return;
                }
            }
            var params = {
                provinceId: $rootScope.localProvince.province.provinceId,
                companyId: $rootScope.companyId,
                merchantId: $scope.merchantId,
                platformId: $rootScope.platformId,
                skus:serviceGood,
                businessType : 7,
                sysSource:$scope.sysSource,
                areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
            }
            if ($rootScope.util.getUserToken() == undefined || $rootScope.util.getUserToken() == null || $rootScope.util.getUserToken() == '') {
                $rootScope.showLoginBox = true;
                return;
            } else if ($scope.itemlist.typeOfProduct != 3) {
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
                    $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('一键购买异常') +'！');
                })
            } else {
                $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('请先选择商品属性'), {
                    type: 'info'
                });
            }
        },
        //支付定金
        _buyDeposit:function(v){
            var params ={
                    skus:JSON.stringify([{'mpId':v.mpId,'num':$scope.pcIteminfo.itemAmount}]),
                    platformId: $rootScope.platformId,
                    businessType:5,
                    areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
            }
            if ($rootScope.util.getUserToken() == undefined || $rootScope.util.getUserToken() == null || $rootScope.util.getUserToken() == '') {
                $rootScope.showLoginBox = true;
                return;
                //$scope.itemlist[0].isSeries==false || $scope.itemlist[0].isSeries==null
            } else if( $scope.itemlist.typeOfProduct != 3 ) {
                $rootScope.ajax.post($rootScope.host + '/checkout/initOrder' , params).then(function(res){
                    if(res.code == 0) {
                        localStorage.setItem('quickBuy', JSON.stringify(params));
                        location.href = 'settlement.html?q=1';
                    } else{
                        if(res.data!=null&&res.data.error != null &&res.data.error.type==4||res.data.error.type==3){
                            localStorage.setItem('quickBuy', JSON.stringify(params));
                            location.href = 'settlement.html?q=1';
                        }else{
                            $rootScope.error.checkCode(res.code, res.data.error.message);
                        }
                    }
                }, function(error){
                    $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('一键购买异常') + '！');
                })
            }
            else{
                $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('请先选择商品属性'), {
                    type: 'info'
                });
            }
        },
        _addAdvance: function(v){
            var _ut = $rootScope.util.getUserToken();
            if(!_ut) {
                $rootScope.showLoginBox = true;
            } else if($scope.totalCount==0){
                $rootScope.util.removeLocalItem('advanceData')
                location.href = '/home.html#/advanceCreateOrder?code=' + $scope.itemlist.code + '&num=' + $scope.pcIteminfo.itemAmount;
            }else{
                $scope.advanceShow = true;
            }
        }
    }
    $scope.selectPromotion=function(prom){
        $scope.selectedPromotion=prom;
    }
    //服务商品选择
    // 商品咨询列表接口
    //商品小图片 向左向右的箭头
    function getClassNames(classStr,tagName){
        if (document.getElementsByClassName) {
            return document.getElementsByClassName(classStr)
        }else {
            var nodes = document.getElementsByTagName(tagName),ret = [];
            for(var i = 0; i < nodes.length; i++) {
                if(hasClass(nodes[i],classStr)){
                    ret.push(nodes[i])
                }
            }
            return ret;
        }
    }
    function hasClass(tagStr,classStr){
        var arr=tagStr.className.split(/\s+/ );  //这个正则表达式是因为class可以有多个,判断是否包含
        for (var i=0;i<arr.length;i++){
            if (arr[i]==classStr){
                 return true ;
            }
        }
        return false ;
    }

    $scope.arrowMove = function() {
        var lis = getClassNames('imgLi' , 'li');
        var pic = 0;
        $scope.arrowLeftImg = function() {
            if($scope.itemlist.pictureUrlList.length<=5){
                return false;
             }
            $scope.imgArrowRight=true;
            $scope.yesImgArrowRight=false;
            if (pic === 0) {
                return;
            }
            if (pic == 1) {
                $scope.noImgArrowLeft = true;
                $scope.yesImgArrowLeft = false;
            }
            pic--;
            var target = -pic * 74;
            $("#thumblist").css({
                transition:"all 0.5s",
                left:target + 'px'
            })
        }
        $scope.arrowRightImg = function() {
            if ($scope.itemlist.pictureUrlList.length <= 5) {
                return false;
            }
            $scope.noImgArrowLeft=false;
            $scope.yesImgArrowLeft=true;
            if( pic === lis.length - 1 ) {
                return;
            }
            if(pic === lis.length-2){
                $scope.imgArrowRight=false;
                $scope.yesImgArrowRight=true;
            }
            pic++;
            var target = -pic * 74;
            $("#thumblist").css({
                transition:"all 0.5s",
                left: target + 'px'
            })
        }
    }
    // 套餐商品图片，向左向右的箭头
    $scope.packageMove = function(length) {
        // var packLis = document.getElementsByClassName( "liImg" );
        $("#packageGood").css({
            left:'0px'
        })
        $scope.rightPicNum = 0;
        $scope.rightLength = length;
        $scope.packageLeftMove = function(event) {
            if($scope.rightPicNum===0) {
                return;
            }
            $scope.rightPicNum--;
            var target = -$scope.rightPicNum * 179;
            $("#packageGood").css({
                transition:"all 0.5s",
                left:target + 'px'
            })
        }
        $scope.packageRightMove = function(event) {
            if( $scope.rightPicNum === $scope.rightLength - 1 ) {
                return;
            }
            $scope.rightPicNum++;
            var target = -$scope.rightPicNum * 179;
            $("#packageGood").css({
                transition : "all 0.5s",
                left : target + 'px'
            })
        }
    }
    // 套餐组 向上向下的箭头
    $scope.packageTeamMove = function(length) {
        $(".package-left").css({
            top:'0px'
        })
        $scope.picNum = 0;
        $scope.maxPicNum = length
        $scope.packageDownMove = function(event) {
            if( $scope.picNum === $scope.maxPicNum - 1 ) {
                return;
            }
            $scope.picNum++;
            $scope.isPackageUpMove=true;
            $scope.isPackageDownMove=false;
            var target = -$scope.picNum * 83;
            $(".package-left").css({
                transition : "all 0.5s",
                top : target + 'px'
            })
        }
        $scope.packageUpMove = function(event) {
            if ($scope.picNum === 0) {
                return;
            }
            if($scope.picNum === 1){
                $scope.isPackageUpMove=false;
                $scope.isPackageDownMove=true;
            }
            $scope.picNum--;
            var target = -$scope.picNum * 83;
            $(".package-left").css({
                transition:"all 0.5s",
                top:target + 'px'
            })
        }
    }
    //分享弹窗
    $scope.sharePopup = function() {
        $scope.shareBox = false;
        $scope.showBox = function(){
            if (!_ut) {
                $rootScope.showLoginBox = true;
                $scope.shareBox = false;
                return;
            } else {
                $scope.shareBox = true;
                var url = $rootScope.host + '/share/shareInfo',
                    params = {
                        type:2,
                        platformId: 2,
                        paramId:$rootScope.util.paramsFormat().itemId
                    };
                $rootScope.ajax.get(url,params).then(function(res){
                    $scope.titleMsg=res.data.title;
                    $scope.imgUrl=res.data.url60x60;
                    $scope.linkUrl=$scope.changeUrl(res.data.linkUrl);
                    if( res.code == 0 && res ) {
                        $scope.shareContent = res.data;
                    }
                    $scope.messageLength = $scope.shareContent.content;
                    $scope.contentShare = $scope.shareContent.shareCode;
                    $scope.choseShareImg = function (v,values) {
                        v.isChecked = !v.isChecked;
                        $scope.imgUrl = v.url60x60;
                        angular.forEach(values,function(val) {
                            if( v.name !== val.name ){
                                val.isChecked = false;
                            }
                        })
                        $scope.beginWeibo();
                        $scope.beginHTML();
                    }
                    $scope.changeText = function() {
                        $scope.beginHTML();
                        $scope.beginWeibo();
                    }
                    $scope.beginWeibo = function() {
                        var url = "http://service.weibo.com/share/share.php?url=" + encodeURIComponent($scope.linkUrl) + "&title="+ $scope.messageLength + "&pic=" + $scope.imgUrl + '&shareCode=' + $scope.contentShare;
                        var html ='<a class="share-one share-img" target="_blank" href="'+ url +'" ng-click="getSharePoint()"></a>';
                        $(".share-icon-one").html(html);
                        $(".share-icon-one .share-one").click(function(){
                           $scope.getSharePoint();
                        });
                    }
                    $scope.beginHTML = function() {
                        var p = {
                            // url:location.href, /*获取URL，可加上来自分享到QQ标识，方便统计*/
                            url:$scope.linkUrl,
                            desc: $scope.messageLength, /*分享理由(风格应模拟用户对话),支持多分享语随机展现（使用|分隔）*/
                            title: $scope.titleMsg,
                            summary:$scope.goodName, /*分享摘要(可选)*/
                            pics:$scope.imgUrl, /*分享图片(可选)*/
                            style:'201',
                            width:32,
                            height:32,
                            shareCode : $scope.contentShare
                        };
                        var s = [];
                        for(var i in p){
                            s.push(i + '=' + encodeURIComponent(p[i]||''));
                        }
                        var html = ['<a class="qcShareQQDiv" href="http://connect.qq.com/widget/shareqq/index.html?',s.join('&'),'" target="_blank" ng-click="getSharePoint()"></a>'].join('');
                        $('.share-icon-two').html(html);
                        $(".share-icon-two .qcShareQQDiv").click(function(){
                           $scope.getSharePoint();
                        });
                    }
                    $scope.beginHTML();
                    $scope.beginWeibo();
                })
            }
        }
        $scope.closeButton = function(){
            $scope.shareBox = false;
        }
    }
    $scope.sharePopup();
    //分享获得积分
    $scope.getSharePoint = function() {
        var params = {
            refId: $scope.itemId, //分享对象的id
            refType: 6 //分享对象的类型:1话题 2本地 3活动 4用户 5app 6商品
        };
        $rootScope.ajax.post('/api/social/write/share/getSharePoint', params).then(function (res) {
        })
    }
    // 获取分享信息
    /*$scope.takeShare = function() {
        var url = $rootScope.host + "/share/shareDesc",
            params = {
                type:2,
                platformId:$rootScope.platformId
            };
        $rootScope.ajax.get(url,params).then(function(res){
            if(res.code == 0) {
                $scope.shareData = res.data;
                $scope.closeShareMove = function() {
                    $scope.closeShare = true;
                }
                $scope.closeShareLeave = function() {
                    $scope.closeShare = false;
                }
            }
        })
    }*/
    /*$scope.takeShare();*/
    // 商品咨询弹框数据
    $scope.busQuestion = function(v) {
        if ($rootScope.util.getUserToken() == undefined || $rootScope.util.getUserToken() == null || $rootScope.util.getUserToken() == '') {
            $rootScope.showLoginBox = true;
            return;
        } else {
            $scope.selectValue = null;
            $scope.busData = {
                bombShow : true,
                choseText : "",
                selectDiv:true,
                checkedNum : 1,
                typeId:$scope.selectValue,
                checked:[
                    {
                        isAvailableChecked:true,
                        chanceChecked:function() {
                            $scope.busData.checked[0].isAvailableChecked = !$scope.busData.checked[0].isAvailableChecked;
                            if($scope.busData.checked[0].isAvailableChecked){
                                $scope.busData.checkedNum = 1;
                            } else{
                                $scope.busData.checkedNum = 0;
                            }
                        }
                    }
                ],
                buttons:[
                    {
                        name:$scope.i18n('确定'),
                        className:"one-button",
                        callback:function() {
                            var content = document.getElementById("text").value
                            var url =  "/api/social/consultAppAction/insertNewConsult.do";
                            var params = {
                                merchantProductId : $scope.itemId,
                                type : $scope.busData.typeId,
                                content : content,
                                isAnonymity : $scope.busData.checkedNum
                            }
                            if( params.type == null ) {
                                $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n('请选择咨询类型'),{
                                    type: 'info'
                                })
                            }else if(content == null || content == ''){
                                $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n('请输入要咨询的内容'),{
                                    type: 'info'
                                });
                                return;
                            }else {
                                $rootScope.ajax.postJson(url, params).then(function(res){
                                    if( res.code == 0 ) {
                                        $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n('咨询成功'),{
                                            type: 'info'
                                        })
                                    } else {
                                        $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n('咨询失败') + ',' + $scope.i18n('请重试'),{
                                            type: 'info'
                                        })
                                    }
                                });
                                $scope.busData.bombShow = false;
                            }
                        }
                    },
                    {
                        name:$scope.i18n('取消'),
                        className:"two-button",
                        callback:function() {
                            $scope.busData.bombShow = false;
                        }
                    }
                ]
            }
        }
    }
    // 问大家弹框数据
    $scope.allQuestion = function() {
        if ($rootScope.util.getUserToken() == undefined || $rootScope.util.getUserToken() == null || $rootScope.util.getUserToken() == '') {
            $rootScope.showLoginBox = true;
            return;
        } else {
            $scope.isAvailableChecked = true;
            $scope.allData = {
                bombShow : true,
                choseText:"",
                textDiv: true,
                checkedNum : 1,
                checked:[
                    {
                        isAvailableChecked:true,
                        chanceChecked:function() {
                            $scope.allData.checked[0].isAvailableChecked = !$scope.allData.checked[0].isAvailableChecked;
                            if($scope.allData.checked[0].isAvailableChecked){
                                $scope.allData.checkedNum = 1;
                            } else{
                                $scope.allData.checkedNum = 0;
                            }
                        }
                    }
                ],
                buttons:[
                    {
                        name:$scope.i18n('确定'),
                        className:"one-button",
                        callback:function(){
                            var url = "/api/social/consultAppAction/insertNewQA.do";
                            var content = document.getElementById("text").value;
                            if(content == null || content == ''){
                                $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n('请输入要提问的内容'),{
                                    type: 'info'
                                });
                                return;
                            }
                            var params = {
                                merchantProductId:$scope.itemId,
                                content:content,
                                isAnonymity:$scope.allData.checkedNum
                            };
                            $rootScope.ajax.postJson(url, params).then(function(res){
                                if( res.code == 0 ) {
                                    $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n('提问成功'),{
                                        type: 'info'
                                    })
                                } else {
                                    $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n('提问失败') + ',' + $scope.i18n('请重试'),{
                                        type: 'info'
                                    })
                                }
                            });
                            $scope.allData.bombShow = false;
                        }
                    },
                    {
                        name:$scope.i18n('取消'),
                        className:"two-button",
                        callback:function(){
                            $scope.allData.bombShow = false;
                        }
                    }
                ]
            }
        }
    }
    // 预售页面关闭按钮
    $scope.iconShowBox = function() {
        $scope.isShowBox = !$scope.isShowBox;
    }
    $scope.iconCloseShow = function() {
        $scope.isShowBox = !$scope.isShowBox;
    }
    $scope.takeConsultation = function() {
        var url = "/api/social/consultAppAction/getOwnerConsultAndQaList.do";
        var params = {
            currentPage:$scope.takeQaCurrentPage,   //当前页码
            itemsPerPage:$scope.takeQaItemsPerPage, //每页显示数量
            headerType:1,   // 0=咨询，1=问答
            merchantProductId:$scope.itemId,
            fullReturn:false
        }
        $rootScope.ajax.postJson(url, params).then(function(res){
            if (res.code == 0 && res.data.listObj && res.data.listObj.length > 0){
                $scope.consultationText = res.data.listObj;
                angular.forEach( $scope.consultationText,function(val) {
                    angular.forEach( val.listObj , function(x) {
                        val.listObj[0].show = true;
                    } )
                } )
                $scope.AqTotalCount = res.data.total;
                $scope.AqTotalNum = Math.ceil(res.data.total / $scope.takeQaItemsPerPage);
            }
        });
    }
    $scope.takeContinue = function(value,v,bigValue) {
        v.checked = !v.checked;
        angular.forEach( value, function(x) {
                x.show = !x.show;
                value[0].show = true;
        } )
    }
    $scope.takeQa = function() {
        var url = "/api/social/consultAppAction/getOwnerConsultAndQaList.do";
        var params = {
            currentPage:$scope.QacurrentPage,   //当前页码
            itemsPerPage:$scope.QaitemsPerPage, //每页显示数量
            headerType:0,   // 0=咨询，1=问答
            merchantProductId:$scope.itemId,// 商品ID 问大家列表要传   写死的，因为后台数据有问题
            fullReturn : false
        }
        $rootScope.ajax.postJson(url, params).then(function(res){
            if( res.data && res.data.listObj ) {
                $scope.takeAq = res.data.listObj;
                angular.forEach( $scope.takeAq,function(val) {
                    angular.forEach( val.listObj , function(x) {
                        val.listObj[0].show = true;
                    } )
                } )
                $scope.QaTotalCount = res.data.total;
                $scope.QaTotalNum = Math.ceil(res.data.total / $scope.QaitemsPerPage);
            }
        });
    }
    // 更新足迹信息
    $scope.upDateMes = function() {
        if ($rootScope.util.getUserToken() == undefined || $rootScope.util.getUserToken() == null || $rootScope.util.getUserToken() == '') {
            return;
        }else{
            var url = $rootScope.host + '/my/foot/update';
            var params = {
                ut : $rootScope.util.getUserToken(),
                mpId : $scope.itemId
            }
            $rootScope.ajax.post(url,params).then(function (res) {
            })
        }
    }
    $scope.upDateMes();
    $scope.takeQRcode = function() {
        var url = "/cms/view/getUrlByPageCode.do",
            params = {
                pageCode:'product_detail',
                id:$scope.itemId,
                platform:$rootScope.platformId
            };
        $rootScope.ajax.get(url,params).then(function(res){
            $scope.textQR = $scope.changeUrl(res.data);
            if($scope.isPointPro){
                $scope.textQR += '&isPointPro=1';
            }
            //$("#code").children().remove();
            //如果是ie8用table渲染
            if( $rootScope.isIE8 ) {
                $("#code").qrcode({
                    render:"table",
                    width:123,
                    height:116,
                    text:$scope.textQR
                })
            } else {
                $("#code").qrcode({
                    render:"canvas",
                    width:123,
                    height:116,
                    text:$scope.textQR
                })
            }
        })
    }
    //$scope.takeQRcode();
    //进入页面检查服务商品可售范围
    // 商品关联服务
    $rootScope.goodService = function(v) {
        var areasCodeOneCode = '';
        if( $rootScope.util.getCookies("areasCode") ) {
            $rootScope.areasCode = JSON.parse($rootScope.util.getCookies("areasCode"));
            areasCodeOneCode = $rootScope.areasCode.oneCode;
        }
        var url = '/back-product-web/consultAppAction/getMerchantProductList.do';
        if(v) {
            var arrId = [v];
        } else {
            arrId = [$scope.itemId];
        }
        var params = {
            mpIds : arrId,
            areaCode : areasCodeOneCode
        }
        var serviceId = [];
        var serviceData = null;
        $rootScope.serviceList = [];
        $rootScope.ajax.postJson(url, params).then(function(res){ //这是选择属性的
            if(res.data && res.code == 0 ) {
                $scope.serviceGoodMes = res.data;
                angular.forEach(res.data,function(data,index){

                    angular.forEach(data,function(value,k){
                        serviceId.push(value.id);
                        serviceData = data;
                        value.checked = false;
                        value.choseAdd = true;
                    })
                })
                $scope.newServiceId = serviceId.join(',');
                // $scope.checkTheArea($scope.newServiceId)
                var url = $rootScope.host + '/realTime/getPriceStockList',
                    params = {
                        mpIds:serviceId,
                        areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
                    };
                $rootScope.ajax.get(url,params).then(function (res) {
                    if( res.code == 0 ) {
                        if( res.data.plist != null && res.data.plist.length > 0 ) {
                            angular.forEach(res.data.plist , function(val) {
                                angular.forEach(serviceData , function(k) {
                                    if(val.mpId == k.id) {
                                        k.stockNum = val.stockNum;
                                        k.stockText = val.stockText;
                                        k.availablePrice = val.availablePrice;
                                        k.highestPrice = val.highestPrice;
                                    }
                                })
                                $rootScope.serviceList = serviceData;
                            })
                        }
                    }
                })
            }
        });
    }
    $scope.arrivalShowFunc = function() {
        if(!$rootScope.util.getUserToken()) {
            $rootScope.showLoginBox = true;
            return;
        } else {
            $scope.arrivalShow = true;
            /*var url = $rootScope.host + '/attention/initAttentionMerchantProduct';
            var params = {
                mpId : $scope.itemId,
                ut : $rootScope.util.getUserToken()
            }
            $rootScope.ajax.post(url, params).then(function(res) {
                $scope.arrivalNotice = res.data;
                $scope.newPhone = res.data.mobile;
                $scope.isPhoneTrue = true;
            })*/
            if ($rootScope.userInfo && $rootScope.userInfo.mobile){
                $scope.newPhone = $rootScope.userInfo.mobile;
                $scope.isPhoneTrue = true;
            }
        }
    }
    $scope.changePhoneText = function() {
        if (!$scope.newPhone) {
            $scope.isPhoneTrue = false;
            return;
        }else if( !/^[0-9]{11}$/.test($scope.newPhone)){
            $scope.isPhoneTrue = false;
            return;
        } else {
            $scope.isPhoneTrue = true;
        }
    }
    $scope.arrivalShowFuncTwo = function() {
        if( $rootScope.util.getCookies("areasCode") ) {
            $rootScope.areasCode = JSON.parse($rootScope.util.getCookies("areasCode"));
            var areasCodeOneCode = $rootScope.areasCode.oneCode;
        }
        if( $scope.isPhoneTrue ) {
            $scope.rightPhoneText = false;
            var url = '/back-product-web2/extraLogin/extraImStockAlarm/saveImStockAlarm.do';
            var params = {
                merchantProductId : $scope.itemId,
                pushMobile : $scope.newPhone,
                pushType : 1,
                isOnline : 1,
                areaCode : areasCodeOneCode?areasCodeOneCode:$rootScope.defaultAreasCode
            }
            $rootScope.ajax.postJson(url, params).then(function(res) {
                if( res.code == 0 ) {
                    $scope.arrivalShow = false;
                    $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n('商品到货后') + ',' + $scope.i18n('我们将以短信的形式通知您'),{
                        type: 'info'
                    })
                } else {
                    $rootScope.error.checkCode($scope.i18n('提示'),res.message)
                }
            })
        } else {
            $scope.rightPhoneText = true;
        }
    }
    $scope.arrivalShowFuncOne = function() {
        $scope.arrivalShow = false;
    }
    /**
    * 以下是包装方式的开发
    */
    $scope.packingMethodFun = {
        maxAddCartNum: 1000000,
        hideMoreSerial: false,
        allPromotionIsShow: false,
        currentProduct: {}
    }
    $scope.changeSerailProductShow = function() {
        $scope.packingMethodFun.hideMoreSerial = !$scope.packingMethodFun.hideMoreSerial;
    }
    $scope.showSerialPromotion = function(serailProduct) {
        $scope.packingMethodFun.allPromotionIsShow = true;
        $scope.packingMethodFun.currentProduct = serailProduct;
    }
    $scope.hideSerialPromotion = function() {
        $scope.packingMethodFun.allPromotionIsShow = false;
        $scope.packingMethodFun.currentProduct = {};
    }
    $scope.addCartSuccess = false;
    $scope.hideCartSuccessPop = function() {
        $scope.addCartSuccess = false;
    }
    //系列品选择包装方式 start
    //选择包装方式
    $scope.choosePackingWay = function(id, num, index) {
        $scope.pcIteminfo.sp.serialProducts[index].product.productPackageId = id;
        $scope.pcIteminfo.sp.serialProducts[index].product.choosePackingWayNum = num;
        calculateNum();
    }
    // 改变数量 加号
    $scope.increase = function (event, index) {
        $scope.pcIteminfo.sp.serialProducts[index].product.chooseNum = $scope.pcIteminfo.sp.serialProducts[index].product.chooseNum + 1;
        if ($scope.pcIteminfo.sp.serialProducts[index].product.chooseNum >= $scope.packingMethodFun.maxAddCartNum) {
            $scope.pcIteminfo.sp.serialProducts[index].product.chooseNum = $scope.packingMethodFun.maxAddCartNum;
        }
        calculateNum();
    };
    // 改变数量 减号
    $scope.decrease = function (event, index) {
        $scope.pcIteminfo.sp.serialProducts[index].product.chooseNum = $scope.pcIteminfo.sp.serialProducts[index].product.chooseNum - 1;
        if ($scope.pcIteminfo.sp.serialProducts[index].product.chooseNum <=0) {
            $scope.pcIteminfo.sp.serialProducts[index].product.chooseNum = 0;
        }
        calculateNum();
    };
    //输入数字
    $scope.changeNum = function(event, index, chooseNum) {
        if ($scope.pcIteminfo.sp.serialProducts[index].product.chooseNum <=0) {
            $scope.pcIteminfo.sp.serialProducts[index].product.chooseNum = 0;
        }
        if ($scope.pcIteminfo.sp.serialProducts[index].product.chooseNum >= $scope.packingMethodFun.maxAddCartNum) {
            $scope.pcIteminfo.sp.serialProducts[index].product.chooseNum = $scope.packingMethodFun.maxAddCartNum;
        }
        $scope.pcIteminfo.sp.serialProducts[index].product.chooseNum = parseInt($scope.pcIteminfo.sp.serialProducts[index].product.chooseNum);
        calculateNum();
    }
    //系列品选择包装方式 end
    //正常商品选择包装方式 start
    //选择包装方式
    $scope.choosePackingWayBasic = function(id, num) {
        $scope.itemlist.productPackageId = id;
        $scope.itemlist.choosePackingWayNum = num;
        calculateBasicNum();
    }
    // 改变数量 加号
    $scope.increaseBasic = function (event) {
        $scope.itemlist.chooseNum = $scope.itemlist.chooseNum + 1;
        if ($scope.itemlist.chooseNum >= $scope.packingMethodFun.maxAddCartNum) {
            $scope.itemlist.chooseNum = $scope.packingMethodFun.maxAddCartNum;
        }
        calculateBasicNum();
    };
    // 改变数量 减号
    $scope.decreaseBasic = function (event) {
        $scope.itemlist.chooseNum = $scope.itemlist.chooseNum - 1;
        if ($scope.itemlist.chooseNum <=1) {
            $scope.itemlist.chooseNum = 1;
        }
        calculateBasicNum();
    };
    //只能输入数字
    $scope.changeNumBasic = function(event, chooseNum) {
        if ($scope.itemlist.chooseNum <=1) {
            $scope.itemlist.chooseNum= 1;
        }
        if ($scope.itemlist.chooseNum >= $scope.packingMethodFun.maxAddCartNum) {
            $scope.itemlist.chooseNum = $scope.packingMethodFun.maxAddCartNum;
        }
        $scope.itemlist.chooseNum = parseInt($scope.itemlist.chooseNum);
        calculateBasicNum();
    }
    //正常商品选择包装方式 end
    //有包装方式的立即购买和加车
    $scope.packingKey= {
        _packingBuy: function (v) {
            if (!_ut) {
                $rootScope.showLoginBox = true;
                return;
            }
            //跟踪云埋点
            $scope.heimdall.ev = "15";
            try{
                window.eventSupport.emit('heimdallTrack',$scope.heimdall);
            }catch(err){
            }
            $scope.sysSource = 'ody';
            if(v&&v.pointPrice){
                $scope.sysSource = 'INTEGRAL_MALL';
                //不在兑换时间内的积分商品
                if(!$scope.canExchange){
                    return;
                }
            }
            var params = {
                provinceId: $rootScope.localProvince.province.provinceId,
                companyId: $rootScope.companyId,
                merchantId: $scope.merchantId,
                platformId: $rootScope.platformId,
                businessType : 7,
                sysSource:$scope.sysSource,
                areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
            }
            if (!$scope.totalPackingNum) {
                $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n('请先选择商品'), {
                    type: 'info'
                });
                return;
            }

            if (v.typeOfProduct==3) {
                var quickSkus = [];
                angular.forEach($scope.pcIteminfo.sp.serialProducts,function(qs) {
                    var skusObj = {};
                    if (qs.product.chooseNum) {
                        if(qs.product.productPackageId){
                            skusObj = {"mpId":qs.product.mpId,"num":qs.product.chooseNum * qs.product.choosePackingWayNum,"productPackageId":qs.product.productPackageId};
                        }else{
                            skusObj = {"mpId":qs.product.mpId,"num":qs.product.chooseNum * qs.product.choosePackingWayNum};
                        }
                    }
                    quickSkus.push(skusObj);
                })
                params.skus = JSON.stringify(quickSkus);
            } else {
                var serviceGood = JSON.stringify([{'mpId':v.mpId,'num':v.chooseNum * v.choosePackingWayNum,'itemType':$scope.isPointPro?'6':'0','additionalItems':[{'mpId':$rootScope.serviceGoodId,'num':1}]}]);
                if( !$rootScope.serviceGoodId ) {
                    serviceGood = JSON.stringify([{'mpId':v.mpId,'num':v.chooseNum * v.choosePackingWayNum,'itemType':$scope.isPointPro?'6':'0'}])
                }
                params.skus = serviceGood;
            }

            if (!$rootScope.util.getUserToken()) {
                $rootScope.showLoginBox = true;
                return;
            } else {
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
        },
        //支付定金
        _packingBuyBuyDeposit:function(v){
            if (!_ut) {
                $rootScope.showLoginBox = true;
                return;
            }
            var params ={
                platformId: $rootScope.platformId,
                businessType:5,
                areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
            }
            if (v.typeOfProduct==3) {
                var quickSkus = [];
                angular.forEach($scope.pcIteminfo.sp.serialProducts,function(qs) {
                    var skusObj = {};
                    if(qs.product.productPackageId){
                        skusObj = {"mpId":qs.product.mpId,"num":qs.product.chooseNum * qs.product.choosePackingWayNum,"productPackageId":qs.product.productPackageId};
                    }else{
                        skusObj = {"mpId":qs.product.mpId,"num":qs.product.chooseNum * qs.product.choosePackingWayNum};
                    }
                    quickSkus.push(skusObj);
                })
                params.skus = JSON.stringify(quickSkus);
            } else {
                if (v.productPackageId) {
                    params.skus = JSON.stringify([{'mpId':v.mpId,'num':v.chooseNum * v.choosePackingWayNum,"productPackageId":v.productPackageId}]);
                } else {
                    params.skus = JSON.stringify([{'mpId':v.mpId,'num':v.chooseNum * v.choosePackingWayNum}]);
                }
            }
            if (!$rootScope.util.getUserToken()) {
                $rootScope.showLoginBox = true;
                return;
            } else if( $scope.itemlist.typeOfProduct != 3 ) {
                $rootScope.ajax.post($rootScope.host + '/checkout/initOrder' , params).then(function(res){
                    if(res.code == 0) {
                        localStorage.setItem('quickBuy', JSON.stringify(params));
                        location.href = 'settlement.html?q=1';
                    } else{
                        if(res.data!=null&&res.data.error != null &&res.data.error.type==4||res.data.error.type==3){
                            localStorage.setItem('quickBuy', JSON.stringify(params));
                            location.href = 'settlement.html?q=1';
                        }else{
                            $rootScope.error.checkCode(res.code, res.data.error.message);
                        }
                    }
                }, function(error){
                    $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('一键购买异常') + '！');
                })
            } else{
                $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('请先选择商品属性'), {
                    type: 'info'
                });
            }
        },
        //加入购物车
        _packingAddToCart:function(v){
            if (!_ut) {
                $rootScope.showLoginBox = true;
                return;
            }
            if (!$scope.totalPackingNum) {
                $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('请先选择商品'), {
                    type: 'info'
                });
                return;
            }
            if (v.typeOfProduct==3) {
                $scope.batchAddCart(v, $scope.pcIteminfo.sp.serialProducts,function() {
                    $scope.addCartSuccess = true;
                    //3秒钟后移除
                    setTimeout(function () {
                        $scope.addCartSuccess = false;
                        $scope.$apply();
                    }, 3000)
                });
            } else {
                $rootScope.addCart(v,v.chooseNum * v.choosePackingWayNum,true,function() {
                    $scope.addCartSuccess = true;
                    //3秒钟后移除
                    setTimeout(function () {
                        $scope.addCartSuccess = false;
                        $scope.$apply();
                    }, 3000)
                })
            }
        }
    }
    //批量加入进货单
    $scope.batchAddCart = function (item, itemList, callback) {
        var quickSkus = [];
        //跟踪云埋点 点击就记录
        try{
            window.eventSupport.emit('heimdallTrack',{
                ev: "4",
                pri: item.mpId,
                pvi: item.mpId,
                prm: amount,
                prn: item.name,
                pt: item.categoryName,
                pti: item.categoryId,
                bn: item.brandName,
                bni: item.brandId,
                prp: item.availablePrice
            });
        }catch(err){
            //console.log(err);
        }
        angular.forEach(itemList,function(qs) {
            var skusObj = {};
            if (qs.product.chooseNum) {
                if(qs.product.productPackageId){
                    skusObj = {"mpId":qs.product.mpId,"num":qs.product.chooseNum * qs.product.choosePackingWayNum,"itemType":0,"objectId":0,"isMain":0,"productPackageId":qs.product.productPackageId};
                }else{
                    skusObj = {"mpId":qs.product.mpId,"num":qs.product.chooseNum * qs.product.choosePackingWayNum,"itemType":0,"objectId":0,"isMain":0};
                }
                quickSkus.push(skusObj);
            }
        })
        var url = $rootScope.host + "/cart/addItem";
        var param = {
            "companyId":$rootScope.companyId,
            "ut": _ut,
            "sessionId": $scope.sessionId,
            "skus": JSON.stringify(quickSkus),
            "areaCode":$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
        };

        $rootScope.ajax.post(url, param).then(function (result) {
            if (result.code == 0) {
                if(callback) {
                    callback(true);
                }
                $rootScope.$emit('updateMiniCartToParent');//把成功事件传递到父控制器
            }else{
                $rootScope.error.checkCode(result.code,result.message,{
                    type:'info'
                });
            }
        })
    };

    $scope.favoriteGoods = [];
    // 获取收藏商品
    $scope.getFavoriteGoods = function () {
        var url = "/ouser-center/api/favorite/queryFavoriteDetailPage.do",
            params = {
                currentPage: 1,
                itemsPerPage:4,
                entityType : 1,
            };
        $rootScope.ajax.post(url,params).then(res=>{
            if (res.code == 0 ) {
                $scope.favoriteGoods =res.data.listObj;
                $rootScope.getPrice($scope.favoriteGoods).then(res=> {
                    $scope.favoriteGoods = res
                })
            }
        })
    };
    $scope.getFavoriteGoods()
    $scope.historyGoods = [];
    $scope.getHistoryGoods = function () {
        var url = "/api/my/foot/list",
            params = {
                clearCacheAddTimeStamp: +new Date(),
                pageNo: 1,
                pageSize: 4,
                platformId: 2
            };
        $rootScope.ajax.get(url,params).then(res=>{
            if (res.code == 0 ) {
                var arr = [];
                res.data.data.forEach( v => {
                    arr = arr.concat(v.values)
                })
                $scope.historyGoods = arr;
                $rootScope.getPrice($scope.historyGoods).then(res=>{
                    $scope.historyGoods = res
                })
            }
        });
    };
    $scope.getHistoryGoods();
    $scope.leftBoxIndex = 0;
    $scope.toDetail = function(mpId) {
        window.location.href = '/item.html?itemId='+mpId;
    }

}]);
$(function(){
    "use strict"
    // $(".jqzoom").data("jqzoom",null);
    // if($(".jqzoom").find('.zoomPad').length>0){
    //     $(".jqzoom").prepend($(".zoomPad").hide().find('.item-img'));
    //     $(".zoomPad").remove();
    // }
    // $(".jqzoom").unbind('mouseover'); //关键操作3
    // $(".jqzoom img").unbind('mouseover'); //关键操作4
    // $(".jqzoom").jqzoom({
    //     zoomType:"standard",
    //     lens:true,
    //     preloadImages:false,
    //     alwaysOn:false,
    //     zoomWidth:500,
    //     zoomHeight:500
    // });
    // setTimeout(function(){
    //
    // },2000)
    $("body").on('mouseover','#gdshow .left',function(){
        if (!$("#gdshow .left .jqzoom-item-img")[0].src){
            return;
        }
        $(".jqzoom").jqzoom({
            zoomType:"standard",
            lens:true,
            preloadImages:true,
            alwaysOn:false,
            zoomWidth:500,
            zoomHeight:500
        });
    })
});

$(function() {
    $('.tab-titles li').click(function () {
        var acli = $('.tab-titles li').filter('.active');
        var index = $(this).index();
        var cons = $('.tab-contents .content');
        if (acli[0] != this) {
            acli.removeClass('active');
            $(this).addClass('active');
            cons.removeClass('active');
            cons.eq(index).addClass('active');
        }
    });
});
