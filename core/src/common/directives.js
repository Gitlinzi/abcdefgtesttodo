/**
 * Created by Roy on 16/12/26.
 */

angular.module('directives')
//个人中心的左侧菜单栏
.directive('sideLayout', ['$rootScope','$state','$location','$stateParams','routers','$window', function ($rootScope, $state,$location,$stateParams, routers,$window) {
    return {
        template: [
            '<div class="group" ng-repeat="side in sideList">',
            '    <span ng-if="showParent(side)" class="mgT10" ng-if="side.title">{{i18n(side.title)}}</span>',
            '    <a class="pdB10" ng-repeat="item in side.items" href="{{item.href}}" ng-if="item.show&&item.href">{{i18n(item.name)}}</a>',
            '    <a class="pdB10" ng-class="{\'active\': curretnState == item.state}" ui-sref="{{item.state || false}}" ng-repeat="item in side.items" ng-if="item.show&&!item.href" ng-click="toOtherUrl($event, item.state)">{{i18n(item.name)}}</a>',
            '</div>'
        ].join(''),
        scope: {
            sideList: '='
        },
        controller: '',
        link: function (scope, elems, attrs, controller) {
            var cacheState = [];
            var currentUrl = $window.location;
            if (currentUrl.href.indexOf('home.html') >= 0) {
                var curretnStateUrl = currentUrl.hash;
                if (curretnStateUrl) {
                    curretnStateUrl = curretnStateUrl.replace("#","");
                    for (var i = 0; i < routers.length; i++) {
                        if (curretnStateUrl == routers[i].url) {
                            scope.curretnState = routers[i].state;
                            break;
                        }
                    }
                }
            }

            scope.i18n = function (key) {
                return $window.i18n ? $window.i18n(key) : key;
            };
            scope.toOtherUrl = function (e, state) {
                scope.curretnState = state;
                var _ut = $rootScope.util.getUserToken();
                //如果没有登录，阻止href跳转
                if (!_ut) {
                    $rootScope.showLoginBox = true;
                    stopDefault(e);
                    return false;
                };
                return true;
            }

            //如果没有子菜单，不显示父菜单
            scope.showParent = function(side) {
                return side.items.filter(a => a.show).length > 0
            }

            function stopDefault( e )
            {
                if (e && e.preventDefault) {
                    e.preventDefault();
                } else {
                    window.event.returnValue = false;
                }
            }
        }
    }
}])
//商品搜索页列表
.directive('goodsItem', ['$log', '$rootScope','$window', function ($log, $rootScope,$window) { //商品展示
    return {
        template: [
            '<div class="goods-content" ng-if="prod" ng-mouseover="compareBoxShow=true" ng-mouseleave="compareBoxShow=false">',
            //预置订单弹框
            '    <div add-advance-order prod="prod"></div>',

            '    <a href="{{opts.linkTo+prod.mpId}}" target="_blank" style="padding-top: 24px;">',
            '       <img class="content-img" data="{{opts.style.img.width}}" ng-src="{{prod.picUrl}}" alt="" >',
            //'       <div class="compare-box" ng-show="compareBoxShow">',
            //'            <span class="fl compare-box-left" ng-click="opts.addCompareBox($event,prod)">{{i18n("加入比较盒")}}</span>' ,
            //'            <span class="fl compare-box-right" ng-click="opts.addAdvance($event,prod);">{{i18n("添加到预置订单")}}</span>' ,
            //'       </div>',
            // '       <label id="searchSelect" class="checkboxStyle-big checkCollection">',
            // '           <input  type="checkbox" ng-model="prod.isChecked" ng-change="opts.checkOneBtn(prod)">',
            // '           <span></span>',
            // '       </label>',
            '       <div class="sub-icon" ng-if="prod.superscriptUrl"  ng-class="{lt:prod.displayType==0,rt:prod.displayType==1,rb:prod.displayType==2,lb:prod.displayType==3}">',
            '            <img ng-if="prod.superscriptUrl" class="icon-img" ng-src="{{prod.superscriptUrl}}">' ,
            '       </div>',
            '        <div class="price">' +
            '            <span ng-if="!prod.isPresell && !hideProductPrice" ng-style="{{opts.styles.price||\'\'}}">{{prod.availablePrice||prod.promotionPrice||prod.price | currency:\'￥\'}}</span>',
            '            <span class="price-text" ng-if="!prod.isPresell && hideProductPrice" ng-style="{{opts.styles.price||\'\'}}">{{switchConfig.common.showTextWhenHidePrice}}</span>',
            //预售商品显示预售价
            '            <span  ng-if="prod.isPresell && !hideProductPrice" ng-style="{{opts.styles.price||\'\'}}">{{prod.presellTotalPrice | currency:\'￥\'}}</span>',
            '            <span class="price-text" ng-if="prod.isPresell && $hideProductPrice" ng-style="{{opts.styles.price||\'\'}}">{{switchConfig.common.showTextWhenHidePrice}}</span>',
            //显示标签
            '           <div class="disIB fr" ng-class="{\'full-reduce\': $parent.$parent.companyId == 30,\'juan\': $parent.$parent.companyId != 30}">',
            '               <span class="event" ng-style="{background:\'#\'+ (text.bgColor?text.bgColor:\'f23030\'),color:\'#\'+ (text.fontColor?text.fontColor:\'fff\')}" ng-repeat="(index,text) in prod.promotionIcon track by $index|limitTo:3" ng-if="text.iconText && index<3">{{text.iconText}}</span>',
            '           </div>',
            '        </div>',
            '        <h5 ng-style="{\'margin-bottom\': switchConfig.guide.search.showMiniCartBtn ? \'3px\' : \'5px\'}">',            //自营/直营 标签
            '            <span ng-if="prod.adv_delivery_type==1" class="self-sell"></span>',
            '            <span ng-if="prod.adv_delivery_type==2" class="direct-sell"></span>',
            '           {{prod.name}}',
            '        </h5>',
            '    </a>',
            // '    <div mini-add-cart prod="prod" cart-name="{{switchConfig.common.allCartBtnName}}" ng-if="switchConfig.guide.search.showMiniCartBtn"></div>',
            '    <div class="merchant">',
            '        <div class="shop" ng-if="switchConfig.guide.search.showMerchantName">',
            //'           <img src="../images/shop_03.png" alt="">',
            '           <span>{{prod.shopName || i18n("自营")}}</span>',
            '        </div>',
            //显示销量或者评分， 右边是评论
            //'        <div class="store" ng-if="switchConfig.guide.search.showCommoditySales">',
            //'           <span>{{i18n("累计销量")}}:</span>',
            //'           <span class="val" ng-if="switchConfig.common.companyProjectType == \'b2b\'">{{(prod.volume4sale | numMultipleFormat : 10000 : \'+\')||(0 | numMultipleFormat : 10000 : \'+\')}}</span>',
            //'           <span class="val" ng-if="switchConfig.common.companyProjectType != \'b2b\'">{{prod.volume4sale||0}}</span>',
            //'        </div>',
            //'        <div class="store" ng-if="switchConfig.guide.search.showCommodityScore">',
            //'           <span>{{i18n("评分")}}:</span>',
            //'           <span class="val">{{prod.commentInfo.goodRate||0}}%</span>',
            //'        </div>',
            //'        <div class="comment" ng-if="opts.showComment&&prod.commentInfo">', //评价数
            //'           <span>{{i18n("评价")}}:</span>',
            //'           <span class="val">{{prod.commentInfo.commentNum||0}}</span>',
            //'        </div>',
            '    </div>',
            //显示商品编码
            '    <div class="store">',
            '       <span>{{i18n("商品编码")}}:</span>',
            '       <span class="">{{prod.code||0}}</span>',
            '    </div>',
            '    <div mini-add-cart prod="prod" cart-name="{{switchConfig.common.allCartBtnName}}" ng-if="switchConfig.guide.search.showMiniCartBtn"></div>',
            // //显示标签
            // '    <div ng-class="{\'full-reduce\': $parent.$parent.companyId == 30,\'juan\': $parent.$parent.companyId != 30}">',
            // '       <span class="event" ng-style="{background:\'#\'+ (text.bgColor?text.bgColor:\'f23030\'),color:\'#\'+ (text.fontColor?text.fontColor:\'fff\')}" ng-repeat="text in prod.promotionIcon track by $index|limitTo:3" ng-if="text.iconText">{{text.iconText}}</span>',
            // '    </div>',
            //显示销量
            '   <div class="volume" ng-if="opts.showVolume">', //销量
            '       <span>{{i18n("销量")}}:</span>',
            '       <span class="val">{{prod.volume4sale||0}}</span>',
            '   </div>',
            '    <div ng-transclude></div>', //可插入其他html内容
            '</div>',
            '<div class="goods-content-prev" ng-if="!prod">', //如果prod没有加载, 使用占位
            '    <a href="#">',
            '        <div class="prev-img"></div>',
            '        <p class="price"></p>',
            '        <h5></h5>',
            '    </a>',
            '    <div class="merchant">',
            '        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>',
            '    </div>',
            '</div>'
        ].join(''),
        scope: {
            prod: '=',
            options: '=',
            prodList:'='
        },
        transclude: true,
        controller: '',
        link: function (scope, elems, attrs, controller) {
            scope.i18n = function (key) {
                return $window.i18n ? $window.i18n(key) : key;
            };
            //set default options
            scope.switchConfig = $rootScope.switchConfig;
            scope.opts = {
                linkTo: '/item.html?itemId=',
                showPromotion: true, //是否展示促销标签
                showStore: true, //是否展示商家
                showComment: false, //是否展示评论数
                showVolume: false, //是否展示销量
                styles: {}, //元素的css样式:price, promotion, goodsName, storeName
                addCompareBox:function ($event,product) {
                    $event.stopPropagation();
                    $event.preventDefault();
                    var url = $rootScope.home + '/custom-sbd-web/product/addComparisonBox.do';
                    $rootScope.ajax.postJson(url,{mpIds:[product.mpId]}).then(res=>{
                    if (res.code == 0) {
                        $rootScope.error.checkCode(scope.i18n('成功加入比较盒'),scope.i18n('成功加入比较盒'),{
                            type:'info'
                        });
                    }else{
                        $rootScope.error.checkCode(res.message,res.message,{
                            type:'info'
                        });
                    }

                    },function (result) {
                        $rootScope.error.checkCode(scope.i18n('系统异常'),scope.i18n('系统异常'),{
                            type:'info'
                        });
                    })
                },
                checkOneBtn:function (prod) {
                    scope.$emit('checkAllBtn2', prod);
                },
                //点击添加至预置订单
                addAdvance:function ($event,product) {
                    $event.stopPropagation();
                    $event.preventDefault();
                    angular.forEach(scope.prodList,function (item) {
                        if (item.advanceShow) {
                            item.advanceShow = false;
                        }
                    })
                    product.advanceShow = true;
                    $rootScope.addNewprodList=product;
                }
            };
            //scope.hideProductPrice = $rootScope.hideProductPrice;
            //rewrite options
            angular.extend(scope.opts, scope.options || {});

        }
    }
}])
//商品搜索页列表
.directive('searchItem', ['$log', '$rootScope', '$window', function ($log, $rootScope, $window) { //商品展示
    return {
        template: [
            '<div class="goods-content" ng-if="prod" ng-mouseover="compareBoxShow=true" ng-mouseleave="compareBoxShow=false">',
            //预置订单弹框
            '    <div add-advance-order prod="prod"></div>',

            '    <a href="{{opts.linkTo+prod.mpId}}" target="_blank" style="padding-top: 24px;">',
            '       <img class="content-img" data="{{opts.style.img.width}}" ng-src="{{prod.picUrl}}" alt="" >',
            //'       <div class="compare-box" ng-show="compareBoxShow">',
            //'            <span class="fl compare-box-left" ng-click="opts.addCompareBox($event,prod)">{{i18n("加入比较盒")}}</span>' ,
            //'            <span class="fl compare-box-right" ng-click="opts.addAdvance($event,prod);">{{i18n("添加到预置订单")}}</span>' ,
            //'       </div>',
            // '       <label id="searchSelect" class="checkboxStyle-big checkCollection">',
            // '           <input  type="checkbox" ng-model="prod.isChecked" ng-change="opts.checkOneBtn(prod)">',
            // '           <span></span>',
            // '       </label>',
            '       <div class="sub-icon" ng-if="prod.superscriptUrl"  ng-class="{lt:prod.displayType==0,rt:prod.displayType==1,rb:prod.displayType==2,lb:prod.displayType==3}">',
            '            <img ng-if="prod.superscriptUrl" class="icon-img" ng-src="{{prod.superscriptUrl}}">' ,
            '       </div>',
            '        <div class="price">' +
            '            <span ng-if="!prod.isPresell && !hideProductPrice" ng-style="{{opts.styles.price||\'\'}}">{{prod.availablePrice||prod.promotionPrice||prod.price | currency:\'￥\'}}</span>',
            '            <span class="price-text" ng-if="!prod.isPresell && hideProductPrice" ng-style="{{opts.styles.price||\'\'}}">{{switchConfig.common.showTextWhenHidePrice}}</span>',
            //预售商品显示预售价
            '            <span  ng-if="prod.isPresell && !hideProductPrice" ng-style="{{opts.styles.price||\'\'}}">{{prod.presellTotalPrice | currency:\'￥\'}}</span>',
            '            <span class="price-text" ng-if="prod.isPresell && $hideProductPrice" ng-style="{{opts.styles.price||\'\'}}">{{switchConfig.common.showTextWhenHidePrice}}</span>',
            //显示标签
            '           <div class="disIB fr" ng-class="{\'full-reduce\': $parent.$parent.companyId == 30,\'juan\': $parent.$parent.companyId != 30}">',
            '               <span class="event" ng-style="{background:\'#\'+ (text.bgColor?text.bgColor:\'f23030\'),color:\'#\'+ (text.fontColor?text.fontColor:\'fff\')}" ng-repeat="(index,text) in prod.promotionIcon track by $index|limitTo:3" ng-if="text.iconText && index<3">{{text.iconText}}</span>',
            '           </div>',
            '        </div>',
            '        <h5 ng-style="{\'margin-bottom\': switchConfig.guide.search.showMiniCartBtn ? \'3px\' : \'5px\'}">',            //自营/直营 标签
            '            <span ng-if="prod.adv_delivery_type==1" class="self-sell"></span>',
            '            <span ng-if="prod.adv_delivery_type==2" class="direct-sell"></span>',
            '           {{prod.name}}',
            '        </h5>',
            '    </a>',
            // '    <div mini-add-cart prod="prod" cart-name="{{switchConfig.common.allCartBtnName}}" ng-if="switchConfig.guide.search.showMiniCartBtn"></div>',
            '    <div class="merchant">',
            '        <div class="shop" ng-if="switchConfig.guide.search.showMerchantName">',
            //'           <img src="../images/shop_03.png" alt="">',
            '           <span>{{prod.shopName || i18n("自营")}}</span>',
            '        </div>',
            //显示销量或者评分， 右边是评论
            //'        <div class="store" ng-if="switchConfig.guide.search.showCommoditySales">',
            //'           <span>{{i18n("累计销量")}}:</span>',
            //'           <span class="val" ng-if="switchConfig.common.companyProjectType == \'b2b\'">{{(prod.volume4sale | numMultipleFormat : 10000 : \'+\')||(0 | numMultipleFormat : 10000 : \'+\')}}</span>',
            //'           <span class="val" ng-if="switchConfig.common.companyProjectType != \'b2b\'">{{prod.volume4sale||0}}</span>',
            //'        </div>',
            //'        <div class="store" ng-if="switchConfig.guide.search.showCommodityScore">',
            //'           <span>{{i18n("评分")}}:</span>',
            //'           <span class="val">{{prod.commentInfo.goodRate||0}}%</span>',
            //'        </div>',
            //'        <div class="comment" ng-if="opts.showComment&&prod.commentInfo">', //评价数
            //'           <span>{{i18n("评价")}}:</span>',
            //'           <span class="val">{{prod.commentInfo.commentNum||0}}</span>',
            //'        </div>',
            '    </div>',
            //显示商品编码
            '    <div class="store">',
            '       <span>{{i18n("商品编码")}}:</span>',
            '       <span class="">{{prod.code||0}}</span>',
            '    </div>',
            '    <div search-mini-add-cart prod="prod" cart-name="{{switchConfig.common.allCartBtnName}}" ng-if="switchConfig.guide.search.showMiniCartBtn"></div>',
            // //显示标签
            // '    <div ng-class="{\'full-reduce\': $parent.$parent.companyId == 30,\'juan\': $parent.$parent.companyId != 30}">',
            // '       <span class="event" ng-style="{background:\'#\'+ (text.bgColor?text.bgColor:\'f23030\'),color:\'#\'+ (text.fontColor?text.fontColor:\'fff\')}" ng-repeat="text in prod.promotionIcon track by $index|limitTo:3" ng-if="text.iconText">{{text.iconText}}</span>',
            // '    </div>',
            //显示销量
            '   <div class="volume" ng-if="opts.showVolume">', //销量
            '       <span>{{i18n("销量")}}:</span>',
            '       <span class="val">{{prod.volume4sale||0}}</span>',
            '   </div>',
            '    <div ng-transclude></div>', //可插入其他html内容
            '</div>',
            '<div class="goods-content-prev" ng-if="!prod">', //如果prod没有加载, 使用占位
            '    <a href="#">',
            '        <div class="prev-img"></div>',
            '        <p class="price"></p>',
            '        <h5></h5>',
            '    </a>',
            '    <div class="merchant">',
            '        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>',
            '    </div>',
            '</div>'
        ].join(''),
        scope: {
            prod: '=',
            options: '=',
            prodList:'='
        },
        transclude: true,
        controller: '',
        link: function (scope, elems, attrs, controller) {
            scope.i18n = function (key) {
                return $window.i18n ? $window.i18n(key) : key;
            };
            //set default options
            scope.switchConfig = $rootScope.switchConfig;
            scope.opts = {
                linkTo: '/item.html?itemId=',
                showPromotion: true, //是否展示促销标签
                showStore: true, //是否展示商家
                showComment: false, //是否展示评论数
                showVolume: false, //是否展示销量
                styles: {}, //元素的css样式:price, promotion, goodsName, storeName
                addCompareBox:function ($event,product) {
                    $event.stopPropagation();
                    $event.preventDefault();
                    var url = $rootScope.home + '/custom-sbd-web/product/addComparisonBox.do';
                    $rootScope.ajax.postJson(url,{mpIds:[product.mpId]}).then(res=>{
                    if (res.code == 0) {
                        $rootScope.error.checkCode(scope.i18n('成功加入比较盒'),scope.i18n('成功加入比较盒'),{
                            type:'info'
                        });
                    }else{
                        $rootScope.error.checkCode(res.message,res.message,{
                            type:'info'
                        });
                    }

                    },function (result) {
                        $rootScope.error.checkCode(scope.i18n('系统异常'),scope.i18n('系统异常'),{
                            type:'info'
                        });
                    })
                },
                checkOneBtn:function (prod) {
                    scope.$emit('checkAllBtn2', prod);
                },
                //点击添加至预置订单
                addAdvance:function ($event,product) {
                    $event.stopPropagation();
                    $event.preventDefault();
                    angular.forEach(scope.prodList,function (item) {
                        if (item.advanceShow) {
                            item.advanceShow = false;
                        }
                    })
                    product.advanceShow = true;
                    $rootScope.addNewprodList=product;
                }
            };
            //scope.hideProductPrice = $rootScope.hideProductPrice;
            //rewrite options
            angular.extend(scope.opts, scope.options || {});

        }
    }
}])
    //耗材列表
    .directive('consumableGoodItem', ['$log', '$rootScope','$window', function ($log, $rootScope,$window) { //商品展示
        return {
            template: [
                '<div class="goods-content" ng-if="prod" ng-mouseover="compareBoxShow=true" ng-mouseleave="compareBoxShow=false">',
                //预置订单弹框
                '    <div add-advance-order prod="prod"></div>',

                '    <a href="{{opts.linkTo+prod.mpId}}" target="_blank" style="padding-top: 24px;">',
                '       <img class="content-img" data="{{opts.style.img.width}}" ng-src="{{prod.picUrl}}" alt="" >',
                //'       <div class="compare-box" ng-show="compareBoxShow">',
                //'            <span class="fl compare-box-left" ng-click="opts.addCompareBox($event,prod)">{{i18n("加入比较盒")}}</span>' ,
                //'            <span class="fl compare-box-right" ng-click="opts.addAdvance($event,prod);">{{i18n("添加到预置订单")}}</span>' ,
                //'       </div>',
                // '       <label id="searchSelect" class="checkboxStyle-big checkCollection">',
                // '           <input  type="checkbox" ng-model="prod.isChecked" ng-change="opts.checkOneBtn(prod)">',
                // '           <span></span>',
                // '       </label>',
                '       <div class="sub-icon" ng-if="prod.superscriptUrl"  ng-class="{lt:prod.displayType==0,rt:prod.displayType==1,rb:prod.displayType==2,lb:prod.displayType==3}">',
                '            <img ng-if="prod.superscriptUrl" class="icon-img" ng-src="{{prod.superscriptUrl}}">' ,
                '       </div>',
                '        <div class="price">' +
                '            <span ng-if="!prod.isPresell && !hideProductPrice" ng-style="{{opts.styles.price||\'\'}}">{{prod.availablePrice||prod.promotionPrice||prod.price | currency:\'￥\'}}</span>',
                '            <span class="price-text" ng-if="!prod.isPresell && hideProductPrice" ng-style="{{opts.styles.price||\'\'}}">{{switchConfig.common.showTextWhenHidePrice}}</span>',
                //预售商品显示预售价
                '            <span  ng-if="prod.isPresell && !hideProductPrice" ng-style="{{opts.styles.price||\'\'}}">{{prod.presellTotalPrice | currency:\'￥\'}}</span>',
                '            <span class="price-text" ng-if="prod.isPresell && $hideProductPrice" ng-style="{{opts.styles.price||\'\'}}">{{switchConfig.common.showTextWhenHidePrice}}</span>',
                //显示标签
                '           <div class="disIB fr" ng-class="{\'full-reduce\': $parent.$parent.companyId == 30,\'juan\': $parent.$parent.companyId != 30}">',
                '               <span class="event" ng-style="{background:\'#\'+ (text.bgColor?text.bgColor:\'f23030\'),color:\'#\'+ (text.fontColor?text.fontColor:\'fff\')}" ng-repeat="(index,text) in prod.promotionIcon track by $index|limitTo:3" ng-if="text.iconText && index<3">{{text.iconText}}</span>',
                '           </div>',
                '        </div>',
                '        <h5 ng-style="{\'margin-bottom\': switchConfig.guide.search.showMiniCartBtn ? \'3px\' : \'5px\'}">',            //自营/直营 标签
                '            <span ng-if="prod.adv_delivery_type==1" class="self-sell"></span>',
                '            <span ng-if="prod.adv_delivery_type==2" class="direct-sell"></span>',
                '           {{prod.name}}',
                '        </h5>',
                '    </a>',
                // '    <div mini-add-cart prod="prod" cart-name="{{switchConfig.common.allCartBtnName}}" ng-if="switchConfig.guide.search.showMiniCartBtn"></div>',
                '    <div class="merchant">',
                '        <div class="shop" ng-if="switchConfig.guide.search.showMerchantName">',
                //'           <img src="../images/shop_03.png" alt="">',
                '           <span>{{prod.shopName || i18n("自营")}}</span>',
                '        </div>',
                //显示销量或者评分， 右边是评论
                //'        <div class="store" ng-if="switchConfig.guide.search.showCommoditySales">',
                //'           <span>{{i18n("累计销量")}}:</span>',
                //'           <span class="val" ng-if="switchConfig.common.companyProjectType == \'b2b\'">{{(prod.volume4sale | numMultipleFormat : 10000 : \'+\')||(0 | numMultipleFormat : 10000 : \'+\')}}</span>',
                //'           <span class="val" ng-if="switchConfig.common.companyProjectType != \'b2b\'">{{prod.volume4sale||0}}</span>',
                //'        </div>',
                //'        <div class="store" ng-if="switchConfig.guide.search.showCommodityScore">',
                //'           <span>{{i18n("评分")}}:</span>',
                //'           <span class="val">{{prod.commentInfo.goodRate||0}}%</span>',
                //'        </div>',
                //'        <div class="comment" ng-if="opts.showComment&&prod.commentInfo">', //评价数
                //'           <span>{{i18n("评价")}}:</span>',
                //'           <span class="val">{{prod.commentInfo.commentNum||0}}</span>',
                //'        </div>',
                '    </div>',
                //显示商品编码
                '    <div class="store">',
                '       <span>{{i18n("商品编码")}}:</span>',
                '       <span class="">{{prod.code||0}}</span>',
                '    </div>',
                '    <div mini-add-cart-two prod="prod" cart-name="{{switchConfig.common.allCartBtnName}}" ng-if="switchConfig.guide.search.showMiniCartBtn"></div>',
                // //显示标签
                // '    <div ng-class="{\'full-reduce\': $parent.$parent.companyId == 30,\'juan\': $parent.$parent.companyId != 30}">',
                // '       <span class="event" ng-style="{background:\'#\'+ (text.bgColor?text.bgColor:\'f23030\'),color:\'#\'+ (text.fontColor?text.fontColor:\'fff\')}" ng-repeat="text in prod.promotionIcon track by $index|limitTo:3" ng-if="text.iconText">{{text.iconText}}</span>',
                // '    </div>',
                //显示销量
                '   <div class="volume" ng-if="opts.showVolume">', //销量
                '       <span>{{i18n("销量")}}:</span>',
                '       <span class="val">{{prod.volume4sale||0}}</span>',
                '   </div>',
                '    <div ng-transclude></div>', //可插入其他html内容
                '</div>',
                '<div class="goods-content-prev" ng-if="!prod">', //如果prod没有加载, 使用占位
                '    <a href="#">',
                '        <div class="prev-img"></div>',
                '        <p class="price"></p>',
                '        <h5></h5>',
                '    </a>',
                '    <div class="merchant">',
                '        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>',
                '    </div>',
                '</div>'
            ].join(''),
            scope: {
                prod: '=',
                options: '=',
                prodList:'='
            },
            transclude: true,
            controller: '',
            link: function (scope, elems, attrs, controller) {
                scope.i18n = function (key) {
                    return $window.i18n ? $window.i18n(key) : key;
                };
                //set default options
                scope.switchConfig = $rootScope.switchConfig;
                scope.opts = {
                    linkTo: '/item.html?itemId=',
                    showPromotion: true, //是否展示促销标签
                    showStore: true, //是否展示商家
                    showComment: false, //是否展示评论数
                    showVolume: false, //是否展示销量
                    styles: {}, //元素的css样式:price, promotion, goodsName, storeName
                    addCompareBox:function ($event,product) {
                        $event.stopPropagation();
                        $event.preventDefault();
                        var url = $rootScope.home + '/custom-sbd-web/product/addComparisonBox.do';
                        $rootScope.ajax.postJson(url,{mpIds:[product.mpId]}).then(res=>{
                            if (res.code == 0) {
                                $rootScope.error.checkCode(scope.i18n('成功加入比较盒'),scope.i18n('成功加入比较盒'),{
                                    type:'info'
                                });
                            }else{
                                $rootScope.error.checkCode(res.message,res.message,{
                                    type:'info'
                                });
                            }

                        },function (result) {
                            $rootScope.error.checkCode(scope.i18n('系统异常'),scope.i18n('系统异常'),{
                                type:'info'
                            });
                        })
                    },
                    checkOneBtn:function (prod) {
                        scope.$emit('checkAllBtn2', prod);
                    },
                    //点击添加至预置订单
                    addAdvance:function ($event,product) {
                        $event.stopPropagation();
                        $event.preventDefault();
                        angular.forEach(scope.prodList,function (item) {
                            if (item.advanceShow) {
                                item.advanceShow = false;
                            }
                        })
                        product.advanceShow = true;
                        $rootScope.addNewprodList=product;
                    }
                };
                //scope.hideProductPrice = $rootScope.hideProductPrice;
                //rewrite options
                angular.extend(scope.opts, scope.options || {});

            }
        }
    }])

    //首页/服务中心图片显示/轮翻
.directive('odyCarousel', [function () {
    // Runs during compile
    return {
        scope:{
            lunbo:'=',
            mainDom: '@',
            lunboTime: '@',
        }, // {}独立作用域  true子作用域
        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements // E = Element, A = Attribute, C = Class, M = Comment
        template: '<div class="carousel">' +
            '   <div class="carousel-inner" ng-style="{width: imgwidth? imgwidth:\'100%\'}">' +
            '       <a ng-repeat="img in lunbo" ng-class="{active:$first}" href="{{ img.linkUrl }}" ng-style="{width: imgwidth? imgwidth:\'100%\'}"><img ng-style="{width: imgwidth? imgwidth:\'100%\'}" width="{{ imgwidth }}" height="{{ imgHeight }}" ng-src="{{ img.imageUrl }}" alt="{{ img.name }}"></a>' +
            '   </div>' +
            '   <ul class="carousel-paging" ng-if="lunbo.length > 1">' +
            '       <li ng-class="{active:$first}" ng-repeat="img in lunbo"></li>' +
            '   </ul>' +
            '   <div ng-show="lunbo.length > 1" class="carousel-btn prev"></div>' +
            '   <div ng-show="lunbo.length > 1" class="carousel-btn next"></div>' +
            '</div>',
        replace: true,
        link: function (scope, iElm, iAttrs, controller) {
            scope.imgwidth = iAttrs.imgwidth;
            scope.imgHeight = iAttrs.imgheight;
            var mainDom = 'carousel';
            var lunboTime = 5000;
            var lunboSmallTime = 500;

            function startSelfLunbo(scope) {
                if(scope.mainDom) {
                    mainDom = scope.mainDom;
                }
                mainDom = '.' + mainDom;
                if(scope.lunboTime) {
                    var lunboTime = scope.lunboTime;
                    var lunboSmallTime = angular.copy(scope.lunboTime)/10;
                }

                function aniRunning(mainDom) {
                    return angular.element(mainDom  + ' .carousel-inner a').filter(':animated').length;
                }

                function switchPic(mainDom, curr, next) {
                    if (aniRunning(mainDom) === 0) {
                        angular.element(mainDom  + ' .carousel-inner a').eq(next).fadeIn(500, function () {
                            angular.element(this).addClass('active');
                            angular.element(mainDom  + ' .carousel-paging li').eq(next).addClass('active');
                        });
                        angular.element(mainDom  + ' .carousel-inner a').eq(curr).fadeOut(500, function () {
                            angular.element(this).removeClass('active');
                            angular.element(mainDom  + ' .carousel-paging li').eq(curr).removeClass('active');
                        });
                    }
                }

                function autoPlay(mainDom) {
                    var liIndex = angular.element(mainDom  + ' .carousel-paging li').filter('.active').index();
                    liIndex++;
                    if (liIndex === angular.element(mainDom  + ' .carousel-paging li').length) {
                        liIndex = 0;
                    }
                    angular.element(mainDom  + ' .carousel-paging li').eq(liIndex).click();
                }

                function init(mainDom, lunboTime, lunboSmallTime) {
                    var jqinner = angular.element(mainDom  + ' .carousel-inner'),
                        jqbtn = angular.element(mainDom  + ' .carousel-btn'),
                        inter;
                    jqinner.mouseover(function () {
                        jqbtn.show();
                    }).mouseout(function () {
                        jqbtn.hide();
                    });
                    jqbtn.mouseover(function () {
                        jqbtn.show();
                    }).mouseout(function () {
                        jqbtn.hide();
                    }).click(function () {
                        var curr = angular.element(mainDom  + ' .carousel-inner a').filter('.active').index();
                        var next = 0;
                        if (angular.element(this).hasClass('prev')) {
                            if (curr === 0) {
                                next = angular.element(mainDom  + ' .carousel-inner a').length - 1;
                            } else {
                                next = curr - 1;
                            }
                        } else if (angular.element(this).hasClass('next')) {
                            if (curr === (angular.element(mainDom  + ' .carousel-inner a').length - 1)) {
                                next = 0;
                            } else {
                                next = curr + 1;
                            }
                        }
                        if (scope.lunbo.length > 1) {
                            switchPic(mainDom, curr, next);
                            clearInterval(inter);
                            inter = setInterval(function () {
                                autoPlay(mainDom)
                            }, lunboTime);
                        }
                    });

                    angular.element(document).on('click', mainDom  + ' .carousel-paging li', function (e) {
                        var event = e || window.event;
                        var acLi = angular.element(mainDom  + ' .carousel-paging li').filter('.active');
                        if (event.originalEvent) {
                            clearInterval(inter);
                            inter = setInterval(function () {
                                autoPlay(mainDom)
                            }, lunboTime);
                        }
                        if (acLi[0] === this) {
                            return false;
                        }
                        var activeIndex = acLi.index();
                        var currIndex = angular.element(this).index();
                        switchPic(mainDom, activeIndex, currIndex);
                    });
                    inter = setInterval(function () {
                        autoPlay(mainDom)
                    }, lunboTime);
                }
                init(mainDom, lunboTime, lunboSmallTime);
            };
            startSelfLunbo(scope);
        }
    };
}])
//验证确认密码与密码是否一致的指令
.directive('pwCheck', [function () {
    "use strict";
    return {
        require: "ngModel",
        link: function (scope, elem, attrs, ctrl) {
            var otherInput = elem.inheritedData("$formController")[attrs.pwCheck];
            ctrl.$parsers.push(function (value) {
                ctrl.$setValidity("repeat", value === otherInput.$viewValue);
                return value;
            });
            otherInput.$parsers.push(function (value) {
                ctrl.$setValidity("repeat", value === ctrl.$viewValue);
                return value;
            });
        }
    };
}])
//分页， 当页数超过4页显示..., 当前页前后（加自己）显示4个， 如果是中间值，多显示第一页最后一页
.directive('pagination', ['$window',function ($window) {
    return {
        scope: {
            pageSize: '=',
            pageNo: '=',
            totalCount: '=',
            totalPage: '='
        },
        template: '<div id="paging"class="search-pag"> ' +
        '   <a target="_self" href="javascript:void(0);" ng-click="prev($event)" ng-class="{disable: pageNo<=1}">&lt;</a><!--<pagination/>-->' +
        '   <a target="_self" href="javascript:void(0);" ng-class="{active:pageNo==1}" ng-click="locate($event, 1)">1</a>' +
        '   <span class="middle-symbol-begin" ng-if="pageNo>5">...</span>' +
        '   <a target="_self" href="javascript:void(0);" ng-class="{active:pageNo==n}" ng-click="locate($event,n)" ng-repeat=\'n in pageList\' ng-show="isShow[$index]"  track-by="$index">{{n}}</a>' +
        '   <span class="middle-symbol-end" ng-if="totalPage-pageNo>4">...</span><a href="javascript:void(0);" ng-class="{active:pageNo==totalPage}" ng-click="locate($event,totalPage)" ng-if="totalPage>1">{{totalPage}}</a><!--<a href="javascript:void(0);" ng-class="{active:searchObj.pageNo===pageTotal}" ng-click="locate($event,pageTotal)">{{pageTotal}}</a>-->' +
        '   <a target="_self" href="javascript:void(0);" ng-click="next($event)" ng-class="{disable: pageNo>=totalPage}">&gt;</a>' +
        //~ '   <span class=\'total\'>{{i18n("共")}}{{totalPage||1}}{{i18n("页")}}</span> ' +
        //~ '   <span>{{i18n("到第")}}<input type="text" ng-change="checkNum()" ng-blur="checkNum()" ng-model="enterPageNo"><em class=\'pageInfor\'>{{i18n("页")}}</em></span>' +
        //~ '   <a href="javascript:void(0);" class=\'sure\' ng-click="locate($event,enterPageNo)">{{i18n("确定")}}</a>' +
        '</div>',
        link: function (scope, element, attrs) {
            scope.i18n = function (key) {
                return $window.i18n ? $window.i18n(key) : key;
            };
            scope.enterPageNo=1
            //输入框填值
            scope.checkNum = function () {
                if (!/^\d+$/.test(scope.enterPageNo)) {
                    scope.enterPageNo = 1;
                }
                if (scope.enterPageNo < 1) {
                    scope.enterPageNo = 1;
                } else if (scope.enterPageNo > scope.totalPage) {
                    scope.enterPageNo = scope.totalPage;
                }
            }
            //Previous page
            scope.prev = function ($event) {
                if (scope.pageNo > 1) {
                    scope.locate($event, --scope.pageNo);
                }
            };
            //下一页
            scope.next = function ($event) {
                if (scope.pageNo < scope.totalPage) {
                    scope.locate($event, ++scope.pageNo);
                }
            };
            //输入框填值后点击确认
            scope.locate = function ($event, num) {
                if (num == undefined) {
                    return;
                }
                scope.pageNo = num;
                scope._pagination(scope.totalPage, scope.pageNo);
                scope.$emit('changePageNo', scope.pageNo);
            };
            //pagination logic
            scope.isShow = [];
            //格式化分页显示的数组，选中当前页， 将当前页填入输入框
            scope._pagination = function (totalPage, currentPage) {
                scope.enterPageNo = currentPage;
                var pageList = [];
                if (!scope.pageNo) {
                }
                currentPage = currentPage || 1;
                //当页数超过4页显示..., 当前页前后（加自己）显示4个， 如果是中间值，多显示第一页最后一页
                for (var i = 2; i < totalPage; i++) {
                    pageList.push(i);
                    if (i > currentPage && i - currentPage < 4 || i < currentPage && currentPage - i < 4 || i == currentPage) {
                        scope.isShow[i - 2] = true;
                    } else {
                        scope.showcode = true;
                        scope.isShow[i - 2] = false;
                    }
                }
                return pageList;
            };
            scope.$watch('totalPage', function (n, o) {
                if (n > 0) {
                    if (scope.totalPage > 1) {
                        scope.pageList = scope._pagination(scope.totalPage, scope.pageNo);
                    } else {
                        scope.enterPageNo = 1;
                        scope.pageList = [];
                    }
                }
            });
        }
    }
}])
//搜索页添加置预置订单弹框的  分页， 当页数超过4页显示..., 当前页前后（加自己）显示4个， 如果是中间值，多显示第一页最后一页
.directive('advancePagination', ['$window',function ($window) {
    return {
        scope: {
            pageSize: '=',
            pageNo: '=',
            totalCount: '=',
            totalPage: '='
        },
        template: '<div id="paging"class="search-pag"> ' +
        '   <a target="_self" href="javascript:void(0);" ng-click="prev($event)" ng-show="pageNo>1">{{i18n("上一页")}}</a><!--<pagination/>-->' +
        '   <a target="_self" href="javascript:void(0);" ng-class="{active:pageNo==1}" ng-click="locate($event, 1)">1</a>' +
        '   <span class="middle-symbol-begin" ng-if="pageNo>5">...</span>' +
        '   <a target="_self" href="javascript:void(0);" ng-class="{active:pageNo==n}" ng-click="locate($event,n)" ng-repeat=\'n in pageList\' ng-show="isShow[$index]"  track-by="$index">{{n}}</a>' +
        '   <span class="middle-symbol-end" ng-if="totalPage-pageNo>4">...</span><a href="javascript:void(0);" ng-class="{active:pageNo==totalPage}" ng-click="locate($event,totalPage)" ng-if="totalPage>1">{{totalPage}}</a><!--<a href="javascript:void(0);" ng-class="{active:searchObj.pageNo===pageTotal}" ng-click="locate($event,pageTotal)">{{pageTotal}}</a>-->' +
        '   <a target="_self" href="javascript:void(0);" ng-click="next($event)" ng-hide="pageNo>=totalPage">{{i18n("下一页")}}</a>' +
        '   <span class=\'total\'>{{i18n("共")}}{{totalPage||1}}{{i18n("页")}}</span> ' +
        '   <span>{{i18n("到第")}}<input type="text" ng-change="checkNum()" ng-blur="checkNum()" ng-model="enterPageNo"><em class=\'pageInfor\'>{{i18n("页")}}</em></span>' +
        '   <a href="javascript:void(0);" class=\'sure\' ng-click="locate($event,enterPageNo)">{{i18n("确定")}}</a>' +
        '</div>',
        link: function (scope, element, attrs) {
            scope.i18n = function (key) {
                return $window.i18n ? $window.i18n(key) : key;
            };
            scope.enterPageNo=1
            //输入框填值
            scope.checkNum = function () {
                if (!/^\d+$/.test(scope.enterPageNo)) {
                    scope.enterPageNo = 1;
                }
                if (scope.enterPageNo < 1) {
                    scope.enterPageNo = 1;
                } else if (scope.enterPageNo > scope.totalPage) {
                    scope.enterPageNo = scope.totalPage;
                }
            }
            //Previous page
            scope.prev = function ($event) {
                if (scope.pageNo > 1) {
                    scope.locate($event, --scope.pageNo);
                }
            };
            //下一页
            scope.next = function ($event) {
                if (scope.pageNo < scope.totalPage) {
                    scope.locate($event, ++scope.pageNo);
                }
            };
            //输入框填值后点击确认
            scope.locate = function ($event, num) {
                if (num == undefined) {
                    return;
                }
                scope.pageNo = num;
                scope._pagination(scope.totalPage, scope.pageNo);
                scope.$emit('advanceChangePageNo', scope.pageNo);
            };
            //pagination logic
            scope.isShow = [];
            //格式化分页显示的数组，选中当前页， 将当前页填入输入框
            scope._pagination = function (totalPage, currentPage) {
                scope.enterPageNo = currentPage;
                var pageList = [];
                if (!scope.pageNo) {
                }
                currentPage = currentPage || 1;
                //当页数超过4页显示..., 当前页前后（加自己）显示4个， 如果是中间值，多显示第一页最后一页
                for (var i = 2; i < totalPage; i++) {
                    pageList.push(i);
                    if (i > currentPage && i - currentPage < 4 || i < currentPage && currentPage - i < 4 || i == currentPage) {
                        scope.isShow[i - 2] = true;
                    } else {
                        scope.showcode = true;
                        scope.isShow[i - 2] = false;
                    }
                }
                return pageList;
            };
            scope.$watch('totalPage', function (n, o) {
                if (n > 0) {
                    if (scope.totalPage > 1) {
                        scope.pageList = scope._pagination(scope.totalPage, scope.pageNo);
                    } else {
                        scope.enterPageNo = 1;
                        scope.pageList = [];
                    }
                }
            });
        }
    }
}])

//添加到购物车， 目前未使用
.directive('addCart', [function () {
    return {
        template: [
            '<div class="buy clearfix">',
            '   <div class="count"> ',
            '       <input class="num" type="text" ng-model="prod.amount" ng-disabled="prod.stockNum<1"/> ',
            '       <div class="count-btn">',
            '           <button class="add"',
            '               ng-class="{disable:prod.amount>=prod.stockNum}"',
            '               ng-disabled="prod.stockNum<1"',
            '               type="button"',
            '               ng-click="prod.amount=prod.amount<prod.stockNum?prod.amount-0+1:prod.stockNum;">',
            '                   <i class="icon-more-up"></i>',
            '           </button>',
            '           <button class="sub"',
            '               ng-class="{disable:prod.amount<=1}"',
            '               ng-disabled="prod.stockNum<1||prod.amount<=1"',
            '               type="button"',
            '               ng-click="prod.amount=prod.amount>1?prod.amount-1:1">',
            '                   <i class="icon-more-down"></i>',
            '           </button>',
            '       </div>',
            '   </div>',
            '   <div ng-transclude></div>',
            '</div>',
        ].join(''),
        scope: {
            prod: '='
        },
        transclude: true
    }
}])
//商品详情添加到购物车
.directive('addToCart', ['$rootScope','$window', function ($rootScope,$window) {
    return {
        scope: {
            prod: '=',
            handle: '=',
            opts: '=options',
            num: '='
        },
        link: function (scope, element, attrs, ctrl) {
            scope.i18n = function (key) {
                return $window.i18n ? $window.i18n(key) : key;
            };
            element.on('click', function (event) {
                var opts = {
                    isV: false, //是否虚品
                    index: 0, //第几个元素
                    checked: true,
                    isPresell: 0
                }
                if(scope.prod.code.substr(0,1)==4||scope.prod.code.substr(0,1)==5){
                    return;
                }
                angular.extend(opts, scope.opts);
                //如果有商品属性，提示选择属性，如果是虚拟商品, 不处理
                if (opts.isV==3) {
                    var template = scope.isIE ? 'dialog-close-ie' : 'dialog-close-notie';
                    template = [
                        '<div id="collectDialog1" class="dialogItem collectDialog1">' +
                        '   <a href="javascript:void(0)" class="tooltipClose dialog-close \' + template + \'">&times;</a>' +
                        '   <div class="dialog-content">' +
                        '       <div class="dialog-header">' +
                        '           <h5 class="dialog-title"> ' + scope.i18n("友情提示") + '</h5>' +
                        '       </div>' +
                        '       <div class="dialog-body"> ' + scope.i18n("请先选择商品属性") + '</div>' +
                        '       <a class="sure-button" href="javascript:void(0)"> ' + scope.i18n("确定") + '</a>' +
                        '   </div>' +
                        '</div>'
                    ].join('');
                    var tooltip = angular.element(template);
                    //如果有没关闭的提示框，先关闭
                    if (angular.element('#collectDialog1'))
                        angular.element('#collectDialog1').remove();
                    element.after(tooltip);
                    tooltip.find(".tooltipClose").on('click', function () {
                        tooltip.remove();
                    });
                    tooltip.find(".sure-button").on("click", function () {
                        tooltip.remove();
                    })
                    return;
                }
                //添加成功的提示
                var template = scope.isIE ? 'dialog-close-ie' : 'dialog-close-notie';
                template = [
                    '<div class="default-pop-box">' +
                    '   <div id="collectDialog1" class="dialogItem collectDialog1">' +
                    '       <a href="javascript:void(0)" class="tooltipClose dialog-close ' + template + '">&times;</a>' +
                    '       <div class="dialog-content">' +
                    '           <div class="dialog-header">' +
                    '               <h5 class="dialog-title"> ' +scope.i18n("友情提示") + '</h5>' +
                    '           </div>' +
                    '           <div class="dialog-body"> ' + scope.i18n("添加成功") + ' ！ <a class="red" href="cart.html"> ' +  scope.i18n("去结算") + '</a>&nbsp;<a href="javascript:;" class="tooltipClose">' + scope.i18n("继续购物") + '</a></div>' +
                    '       </div>' +
                    '   </div>' +
                    '</div>'
                ].join('');
                var tooltip = angular.element(template);
                //如果有没关闭的提示框，先关闭
                if (angular.element('#collectDialog1'))
                    angular.element('#collectDialog1').remove();
                //如果是第四个商品，提示框向左移一点
                if (0 == (opts.index + 1) % 4) {
                    tooltip.css('margin-left', '-50px');
                }
                //添加购回车的回调方法， callback
                scope.handle(scope.prod, scope.num, opts.checked, function (boo) {
                    if (boo) {
                        element.after(tooltip);
                        //3秒钟后移除
                        setTimeout(function () {
                            tooltip.remove();
                        }, 3000)
                        // element.after(tooltip);
                        tooltip.find(".tooltipClose").on('click', function () {
                            tooltip.remove();
                        });
                    }
                });
                scope.$apply();
            });
        }
    };
}])
//品牌,导购属性与商品类目的选择指令， 支持多选和单选(点击属性直接搜索)
.directive('searchProperty', ['$rootScope','$window', function ($rootScope,$window) {
    return {
        template: [
            '<div class="type" ng-if="datas.length>0&&!opts.isSelected()">',
            '    <div class="key">{{title}}</div>',
            '    <div class="value">',
            '        <div class="brand">',
            '            <ul class="brand-box clearfix">',
            '                <li ng-repeat="data in datas | limitTo:opts.limit track by $index">',
            '                    <a href="javascript:void(0)"',
            '                        ng-class="{selected:data.checked}"',
            '                        ng-click="opts.check(data)" title="{{data.name}}">',
            '                        <i class="icon-checkbox" ng-show="opts.isMulti"></i>',
            '                        <span ng-if="!data.logo" style="word-wrap: break-word;" ng-click="!opts.isMulti&&opts.singleSubmit(data)">{{data.name}}</span>',
            '                        <img class="img-logo" height="50" width="90" ng-src="{{data.logo}}" ng-if="data.logo" ',
            '                           alt="{{data.name}}">',
            '                    </a>',
            '                </li>',
            '            </ul>',
            '        </div>',
            '    </div>',
            '    <div class="fun">',
            '        <a href="javascript:void(0)" class="multi" ng-click="opts.openMulti()" ',
            '           ng-show="datas.length>1&&!opts.isMulti&&opts.dataType!=\'search\'">{{i18n("多选")}}</a>',
            '        <a href="javascript:void(0)" class="more" ng-click="opts.showMore()" ',
            '           ng-show="datas.length>opts.min&&!opts.isMulti">{{opts.limit>opts.min?i18n("收起"):i18n("更多")}}</a>',
            '    </div>',
            '    <div class="multi-confirm" ng-if="opts.isMulti">',
            '        <button class="confirm" ng-class="{active:opts.num>0}" ng-click="opts.submit(datas)">{{i18n("确定")}}</button>',
            '        <button class="cancel" ng-click="opts.cancel(datas)">{{i18n("取消")}}</button>',
            '    </div>',
            '</div>'
        ].join(''),
        scope: {
            title: '@', //类型名称, 如品牌,尺寸
            datas: '=', //数组
            options: '=', //配置项
            callback: '&'//callback方法
        },
        link: function (scope, elem, attr) {
            scope.i18n = function (key) {
                return $window.i18n ? $window.i18n(key) : key;
            };
            scope.opts = setOpts();
            scope.setUrl = function () {};
            scope.datas = transform(scope.datas);
            var util = $rootScope.util;

            //把不同的数据结构改成一致
            function transform(dl) {
                angular.forEach(dl || [], function (d) {
                    if (!d.name && d.value) {
                        d.name = d.value
                    };
                })
                if (scope.opts.dataType == 'search') {
                    dl = dl[0].children;
                }
                return dl;
            };
            //合并默认选项与入参选项
            function setOpts() {
                var options = scope.options || {};
                return {
                    //过滤器最小值
                    min: options.min || 8,
                    //过滤器最大值
                    max: options.max || 1000,
                    //过滤器
                    limit: options.min || 8,
                    //是否多选
                    isMulti: false,
                    //选中数量(多选时用)
                    num: options.num || 0,
                    //数据类型, brand:品牌, list:类目列表, search:搜索
                    dataType: options.dataType || 'brand',
                    //判断当前
                    isSelected: function () {
                        for (var i = 0; i < scope.datas.length; i++) {
                            if (scope.datas[i].active) return true;
                        }
                        return false;
                    },
                    //生成url, 目前没有用到
                    setUrl: function (data) {
                        var obj = util.paramsFormat();
                        if (this.isMulti) //多选的时候不需要跳转
                            return 'javascript:;';
                        else if (this.dataType == 'brand') //品牌
                            obj.brandIds = data.id;
                        else if (this.dataType == 'list') //类目
                            obj.attrValueIds = data.id;
                        else if (this.dataType == 'search') //搜索
                            obj.navCategoryIds = data.id;
                        return '?' + util.urlFormat(obj);
                    },

                    //展开/收起更多
                    showMore:function () {
                        this.limit=this.limit>this.min?this.min:this.max;
                    },
                    //打开多选模式
                    openMulti: function () {
                        this.limit = this.max;
                        this.isMulti = true;
                    },
                    //选中操作
                    check: function (data) {
                        if (this.isMulti) {
                            data.checked = !data.checked;
                            this.num += !!data.checked ? 1 : -1;
                        }
                    },
                    //多选的取消操作
                    cancel: function (datas) {
                        this.isMulti = false;
                        var that = this;
                        angular.forEach(datas || [], function (data) {
                            data.checked = false;
                            that.num = 0;
                        })
                    },
                    //多选的确定操作
                    submit: function (datas) {
                        var obj = util.paramsFormat(),
                            attrId = null,
                            checked = [];

                        attrId = datas[0].attr_id;
                        angular.forEach(datas || [], function (v) {
                            if (v.checked) checked.push(v.id);
                        });
                        if (this.dataType == 'brand') { //品牌
                            obj.brandIds = checked.join(',');
                            return location.href = '?' + util.urlFormat(obj);
                        } else if (this.dataType == 'list') { //类目
                            if (obj.attrValueIds) {
                                obj.attrValueIds += ",";
                            } else {
                                obj.attrValueIds = "";
                            }
                            obj.attrValueIds += (attrId+":"+checked.join('-'));
                            //  obj.attrValueIds = checked.join(',');
                            return location.href = '?' + util.urlFormat(obj);
                        }
                        // else if (this.dataType == 'search') {
                        //     obj.navCategoryIds = checked.join(',');
                        //     return location.href = '?' + util.urlFormat(obj);
                        // }
                    },
                    //多选的确定操作
                    singleSubmit: function (data) {
                        var obj = util.paramsFormat(),
                            attrId = null,
                            checked = [];
                        if (data) {
                            checked.push(data.id);
                            attrId = data.attr_id;
                        }

                        if (this.dataType == 'brand') { //品牌
                            obj.brandIds = checked.join(',');
                            return location.href = '?' + util.urlFormat(obj);
                        } else if (this.dataType == 'list') { //类目
                            if (obj.attrValueIds) {
                                obj.attrValueIds += ",";
                            } else {
                                obj.attrValueIds = "";
                            }
                            obj.attrValueIds += (attrId+":"+checked.join('-'));
                            return location.href = '?' + util.urlFormat(obj);
                        }
                    }
                }
            }
        }
    }
}])
    .directive('consumableProperty', ['$rootScope','$window', function ($rootScope,$window) {
        return {
            template: [
                '<div class="type" ng-if="datas.length>0&&!opts.isSelected()">',
                '    <div class="key">{{title}}</div>',
                '    <div class="value">',
                '        <div class="brand">',
                '            <ul class="brand-box clearfix">',
                '                <li ng-repeat="data in datas | limitTo:opts.limit track by $index">',
                '                    <a href="javascript:void(0)"',
                '                        ng-class="{selected:data.checked}"',
                '                        ng-click="opts.check(data)" title="{{data.name}}">',
                '                        <span ng-if="!data.logo" style="word-wrap: break-word;" ng-click="!opts.isMulti&&opts.singleSubmit(data)">{{data.name}}</span>',
                '                        <img class="img-logo" height="50" width="90" ng-src="{{data.logo}}" ng-if="data.logo" ',
                '                           alt="{{data.name}}">',
                '                    </a>',
                '                </li>',
                '            </ul>',
                '        </div>',
                '    </div>',
                '    <div class="fun">',
                '        <a href="javascript:void(0)" class="multi" ng-click="opts.openMulti()" ',
                '           ng-show="datas.length>1&&!opts.isMulti&&opts.dataType!=\'search\'">{{i18n("多选")}}</a>',
                '        <a href="javascript:void(0)" class="more" ng-click="opts.showMore()" ',
                '           ng-show="datas.length>opts.min&&!opts.isMulti">{{opts.limit>opts.min?i18n("收起"):i18n("更多")}}</a>',
                '    </div>',
                `<div class="select-box clearfix" ng-show="opts.isMulti">
                    <div class="left fl">已选条件</div>
                    <div class="right fl">
                        <div class="select-box-list" ng-repeat="data in datas track by $index" ng-if="data.checked">
                            <i class="icon-checkbox" ng-click="opts.check(data)"></i>
                            <span>{{data.name}}</span>
                        </div>
                    </div>
                </div>` +
                '    <div class="multi-confirm" ng-if="opts.isMulti">',
                '        <button class="confirm" ng-class="{active:opts.num>0}" ng-click="opts.submit(datas)">{{i18n("确定")}}</button>',
                '        <button class="cancel" ng-click="opts.cancel(datas)">{{i18n("取消")}}</button>',
                '    </div>',
                '</div>'
            ].join(''),
            scope: {
                title: '@', //类型名称, 如品牌,尺寸
                datas: '=', //数组
                options: '=', //配置项
                callback: '&'//callback方法
            },
            link: function (scope, elem, attr) {
                scope.i18n = function (key) {
                    return $window.i18n ? $window.i18n(key) : key;
                };
                scope.opts = setOpts();
                scope.setUrl = function () {};
                scope.datas = transform(scope.datas);
                var util = $rootScope.util;

                //把不同的数据结构改成一致
                function transform(dl) {
                    angular.forEach(dl || [], function (d) {
                        if (!d.name && d.value) {
                            d.name = d.value
                        };
                    })
                    if (scope.opts.dataType == 'search') {
                        dl = dl[0].children;
                    }
                    return dl;
                };
                //合并默认选项与入参选项
                function setOpts() {
                    var options = scope.options || {};
                    return {
                        //过滤器最小值
                        min: options.min || 8,
                        //过滤器最大值
                        max: options.max || 1000,
                        //过滤器
                        limit: options.min || 8,
                        //是否多选
                        isMulti: false,
                        //选中数量(多选时用)
                        num: options.num || 0,
                        //数据类型, brand:品牌, list:类目列表, search:搜索
                        dataType: options.dataType || 'brand',
                        //判断当前
                        isSelected: function () {
                            for (var i = 0; i < scope.datas.length; i++) {
                                if (scope.datas[i].active) return true;
                            }
                            return false;
                        },
                        //生成url, 目前没有用到
                        setUrl: function (data) {
                            var obj = util.paramsFormat();
                            if (this.isMulti) //多选的时候不需要跳转
                                return 'javascript:;';
                            else if (this.dataType == 'brand') //品牌
                                obj.brandIds = data.id;
                            else if (this.dataType == 'list') //类目
                                obj.attrValueIds = data.id;
                            else if (this.dataType == 'search') //搜索
                                obj.navCategoryIds = data.id;
                            return '?' + util.urlFormat(obj);
                        },

                        //展开/收起更多
                        showMore:function () {
                            this.limit=this.limit>this.min?this.min:this.max;
                        },
                        //打开多选模式
                        openMulti: function () {
                            this.limit = this.max;
                            this.isMulti = true;
                        },
                        //选中操作
                        check: function (data) {
                            if (this.isMulti) {
                                data.checked = !data.checked;
                                this.num += !!data.checked ? 1 : -1;
                            }
                        },
                        //多选的取消操作
                        cancel: function (datas) {
                            this.isMulti = false;
                            var that = this;
                            angular.forEach(datas || [], function (data) {
                                data.checked = false;
                                that.num = 0;
                            })
                        },
                        //多选的确定操作
                        submit: function (datas) {
                            var obj = util.paramsFormat(),
                                attrId = null,
                                checked = [];

                            attrId = datas[0].attr_id;
                            angular.forEach(datas || [], function (v) {
                                if (v.checked) checked.push(v.id);
                            });
                            if (this.dataType == 'brand') { //品牌
                                obj.brandIds = checked.join(',');
                                return location.href = '?' + util.urlFormat(obj);
                            } else if (this.dataType == 'list') { //类目
                                if (obj.attrValueIds) {
                                    obj.attrValueIds += ",";
                                } else {
                                    obj.attrValueIds = "";
                                }
                                obj.attrValueIds += (attrId+":"+checked.join('-'));
                                //  obj.attrValueIds = checked.join(',');
                                return location.href = '?' + util.urlFormat(obj);
                            }
                            // else if (this.dataType == 'search') {
                            //     obj.navCategoryIds = checked.join(',');
                            //     return location.href = '?' + util.urlFormat(obj);
                            // }
                        },
                        //多选的确定操作
                        singleSubmit: function (data) {
                            var obj = util.paramsFormat(),
                                attrId = null,
                                checked = [];
                            if (data) {
                                checked.push(data.id);
                                attrId = data.attr_id;
                            }

                            if (this.dataType == 'brand') { //品牌
                                obj.brandIds = checked.join(',');
                                return location.href = '?' + util.urlFormat(obj);
                            } else if (this.dataType == 'list') { //类目
                                if (obj.attrValueIds) {
                                    obj.attrValueIds += ",";
                                } else {
                                    obj.attrValueIds = "";
                                }
                                obj.attrValueIds += (attrId+":"+checked.join('-'));
                                return location.href = '?' + util.urlFormat(obj);
                            }
                        }
                    }
                }
            }
        }
    }])

    .directive('crumb', ['$rootScope','$window', function ($rootScope,$window) {
    return {
        transclude: true,
        template: [
            '<div class="search-crumb">',
            '    <div id="breadcrumb" ng-if="isList" ng-repeat="crumb in crumbList">',
            '        <span ng-if="$first"><a href="../index.html">{{i18n("首页")}}</a></span><span class="right-icon"></span>',
            '        <a href="search.html?navCategoryIds={{crumb.categoryId}}&categoryTreeNodeId={{crumb.categoryTreeNodeId}}" class="show-crumb">{{crumb.categoryName}}</a>',
            // '     <i class="icon-more-down"></i>   <ul class="crumb-down"><li><a href="#">类目名称</a></li><li><a href="#">类目名称</a></li><li><a href="#">类目名称</a></li><li><a href="#">类目名称</a></li><li><a href="#">类目名称</a></li><li><a href="#">类目名称</a></li><li><a href="#">类目名称</a></li><li><a href="#">类目名称</a></li></ul>',
            '        <span ng-if="!$last"></span>',
            '    </div>',
            '    <div id="searchBreadcrumb" ng-if="!isList">',
            '        <a href="javascript:;" onclick="location.reload()">{{i18n("全部")}}</a>',
            '        <span class="right-icon"></span>',
            '        <div class="crumb-search"><input type="text"  class="search-last" ng-model="keyword" ng-keydown="autoSearch($event,keyword)">',
            '           <span class="search-fang" ng-click="search(keyword)"><i class="op-icons op-icons-search" ></i><span></div>',
            '    </div>',
            '    <span class="next" ng-repeat-start="attr in activeAttr">&gt;</span>',
            '    <div class="selectedTag" ng-repeat-end >',
            '        <a ng-click="delAttr(attr.ids)" class="tag" title="{{attr.values}}">',
            '            <span class="attr-title">{{attr.title}}:</span>',
            '            <span>{{attr.values.split(",")[0]}}</span>',
            '            <span ng-if="attr.values.split(\',\')[1]">,&nbsp;</span>',
            '            <span ng-if="!attr.values.split(\',\')[1]"></span>',
            '            <span>{{attr.values.split(",")[1]}}</span>',
            '            <span ng-if="attr.values.split(\',\').length > 2">...</span>&nbsp;',
            '            <span>&times;</span>',
            '        </a>',
            '    </div>',
            '    <div ng-transclude></div ng-transclude>',
            '    <div class="clear"></div>',
            '</div>'
        ].join(''),
        scope: {
            crumbList: '=',
            activeAttr: '=',
            isList: '=',
            keyword: '='
        },
        link: function (scope, elem, attr) {
            scope.i18n = function (key) {
                return $window.i18n ? $window.i18n(key) : key;
            };
            var maxLength = 256;
            scope.search = function (keyword) {
                //跟踪云埋点
                try{
                    window.eventSupport.emit('heimdallTrack',{
                        ev:"1",
                        kw:keyword
                    });
                }catch(e) {
                    //console.log(e);
                }
                //scope.keyword =scope.keyword.replace(/@/g,'').replace(/\/\/\)/g,'').replace(/>/g,'').replace(/</g,'').replace(/--/g,'').replace(/;/g,'').replace(/\(/g,'').replace(/\)/g,'').replace(/\（/g,'').replace(/\）/g,'') ;
                // scope.keyword = (keyword || scope.keyword).substring(0, maxLength);
                scope.keyword = decodeURIComponent((keyword || scope.keyword)).split(" ");
                let guid = localStorage.getItem("heimdall_GU")
                guid = guid.replace(/\^/g,'')
                guid = guid.replace(/\`/g,'')
                window.location = '/search.html?keyword=' + encodeURIComponent(scope.keyword[0] || scope.defaultKeyword) + '&guid=' + guid;
            }
            //回车搜索
            scope.autoSearch = function ($event, keyword) {
                //keyword =scope.keyword.replace(/@/g,'').replace(/\/\/\)/g,'').replace(/>/g,'').replace(/</g,'').replace(/--/g,'').replace(/;/g,'').replace(/\(/g,'').replace(/\)/g,'').replace(/\（/g,'').replace(/\）/g,'') ;
                if ($event.keyCode === 13)
                    scope.search(keyword);
            };
            var util = $rootScope.util;

            function cLists(s1, s2) {
                var l1 = (s1 || '').split(','),
                    l2 = (s2 || '').split(',');
                // l1.sort().join()===l2.sort().join();
                return true
            }
            function getAttrJson(attrParam){
                var attrJson={
                    attributeJson:[]
                };
                var tempAttrValueIds = [];
                //var selectedPropIdsList=[];
                if(attrParam && attrParam.length>0){
                    var l1=attrParam.replace(/\"/g,'').split(',');
                    if(l1.length>0){
                        angular.forEach(l1, function (v) {
                            var l2=[];
                            if(v.length>0&&v.indexOf(":")>0&&(l2=v.split(":")).length==2) {
                                var l21=[];
                                if(l2[1].split("-").length>0){

                                    angular.forEach(l2[1].split("-"), function (v) {
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
            //删除属性值，重新搜索刷新页面
            scope.delAttr = function (ids) {
                var obj = util.paramsFormat();
                if (obj['brandIds'] && cLists(obj['brandIds'], ids)) { //品牌
                    delete obj['brandIds'];
                } else if (obj['attrValueIds'] && cLists(obj['attrValueIds'], ids)) {
                    var idsArr = ids.toString().split(',');
                    var attrArr = getAttrJson(obj['attrValueIds']).tempJson.attributeJson;
                    // delete obj['attrValueIds']==ids;
                    for (var j = 0; j < attrArr.length; j++) {
                        for (var i = 0; i < idsArr.length; i++) {
                            if ($.inArray(Number(idsArr[i]),attrArr[j].attrValueIds)>-1) {
                                attrArr.splice(j,1);
                                break;
                            }
                        }
                    } //类目
                    var tempArr = $.map(attrArr,function(val,key){
                        var tempStr = '';
                        tempStr = val['attributeId'] + ':' +val['attrValueIds'].join('-');
                        return tempStr;
                    });
                    obj['attrValueIds'] = tempArr.join(',');
                } else if (obj['navCategoryIds'] && cLists(obj['navCategoryIds'], ids)) {
                    delete obj['navCategoryIds'];
                } //搜索
                return location.href = '?' + util.urlFormat(obj);
            }
        }
    }
}])
    .directive('consumableCrumb', ['$rootScope','$window', function ($rootScope,$window) {
        return {
            transclude: true,
            template: [
                '<div class="search-crumb">',
                '    <div id="breadcrumb" ng-if="isList" ng-repeat="crumb in crumbList">',
                '        <span ng-if="$first"><a href="../index.html">{{i18n("首页")}}</a></span><span class="right-icon"></span>',
                '        <a href="consumable.html?navCategoryIds={{crumb.categoryId}}&categoryTreeNodeId={{crumb.categoryTreeNodeId}}" class="show-crumb">{{crumb.categoryName}}</a>',
                // '     <i class="icon-more-down"></i>   <ul class="crumb-down"><li><a href="#">类目名称</a></li><li><a href="#">类目名称</a></li><li><a href="#">类目名称</a></li><li><a href="#">类目名称</a></li><li><a href="#">类目名称</a></li><li><a href="#">类目名称</a></li><li><a href="#">类目名称</a></li><li><a href="#">类目名称</a></li></ul>',
                '        <span ng-if="!$last"></span>',
                '    </div>',
                '    <div id="searchBreadcrumb" ng-if="!isList">',
                `        <a ng-href="{{'/consumable.html?navCategoryIds='+categoryId + '&categoryTreeNodeId='+ categoryId}}">{{i18n("耗材查找")}}</a>`,
                '        <span class="right-icon"></span>   <span style="color:#333">{{keyword}}</span>',
                // '        <div class="crumb-search"><input type="text"  class="search-last" ng-model="keyword" ng-keydown="autoSearch($event,keyword)">',
                // '           <span class="search-fang" ng-click="search(keyword)"><i class="op-icons op-icons-search" ></i><span></div>',
                '    </div>',
                '    <span class="next" ng-repeat-start="attr in activeAttr"> <span class="right-icon"></span></span>',
                '    <div class="selectedTag" ng-repeat-end >',
                '        <a ng-click="delAttr(attr.ids)" class="tag" title="{{attr.values}}">',
                '            <span class="attr-title">{{attr.title}}:</span>',
                `            <span ng-repeat="v in attr.values.split(',')">{{v}} </span>`,
                // '            <span ng-if="attr.values.split(\',\')[1]">,&nbsp;</span>',
                // '            <span ng-if="!attr.values.split(\',\')[1]"></span>',
                // '            <span>{{attr.values.split(",")[1]}}</span>',
                // '            <span ng-if="attr.values.split(\',\').length > 2">...</span>&nbsp;',
                '            <span>&times;</span>',
                '        </a>',
                '    </div>',
                '    <div ng-transclude></div ng-transclude>',
                '    <div class="clear"></div>',
                '</div>'
            ].join(''),
            scope: {
                crumbList: '=',
                activeAttr: '=',
                isList: '=',
                keyword: '=',
                categoryId: '='
            },
            link: function (scope, elem, attr) {
                scope.i18n = function (key) {
                    return $window.i18n ? $window.i18n(key) : key;
                };
                var maxLength = 256;
                scope.search = function (keyword) {
                    //跟踪云埋点
                    try{
                        window.eventSupport.emit('heimdallTrack',{
                            ev:"1",
                            kw:keyword
                        });
                    }catch(e) {
                        //console.log(e);
                    }
                    //scope.keyword =scope.keyword.replace(/@/g,'').replace(/\/\/\)/g,'').replace(/>/g,'').replace(/</g,'').replace(/--/g,'').replace(/;/g,'').replace(/\(/g,'').replace(/\)/g,'').replace(/\（/g,'').replace(/\）/g,'') ;
                    // scope.keyword = (keyword || scope.keyword).substring(0, maxLength);
                    scope.keyword = decodeURIComponent((keyword || scope.keyword)).split(" ");
                    let guid = localStorage.getItem("heimdall_GU")
                    guid = guid.replace(/\^/g,'')
                    guid = guid.replace(/\`/g,'')
                    window.location = '/search.html?keyword=' + encodeURIComponent(scope.keyword[0] || scope.defaultKeyword) + '&guid=' + guid;
                }
                //回车搜索
                scope.autoSearch = function ($event, keyword) {
                    //keyword =scope.keyword.replace(/@/g,'').replace(/\/\/\)/g,'').replace(/>/g,'').replace(/</g,'').replace(/--/g,'').replace(/;/g,'').replace(/\(/g,'').replace(/\)/g,'').replace(/\（/g,'').replace(/\）/g,'') ;
                    if ($event.keyCode === 13)
                        scope.search(keyword);
                };
                var util = $rootScope.util;

                function cLists(s1, s2) {
                    var l1 = (s1 || '').split(','),
                        l2 = (s2 || '').split(',');
                    // l1.sort().join()===l2.sort().join();
                    return true
                }
                function getAttrJson(attrParam){
                    var attrJson={
                        attributeJson:[]
                    };
                    var tempAttrValueIds = [];
                    //var selectedPropIdsList=[];
                    if(attrParam && attrParam.length>0){
                        var l1=attrParam.replace(/\"/g,'').split(',');
                        if(l1.length>0){
                            angular.forEach(l1, function (v) {
                                var l2=[];
                                if(v.length>0&&v.indexOf(":")>0&&(l2=v.split(":")).length==2) {
                                    var l21=[];
                                    if(l2[1].split("-").length>0){

                                        angular.forEach(l2[1].split("-"), function (v) {
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
                //删除属性值，重新搜索刷新页面
                scope.delAttr = function (ids) {
                    var obj = util.paramsFormat();
                    if (obj['brandIds'] && cLists(obj['brandIds'], ids)) { //品牌
                        delete obj['brandIds'];
                    } else if (obj['attrValueIds'] && cLists(obj['attrValueIds'], ids)) {
                        var idsArr = ids.toString().split(',');
                        var attrArr = getAttrJson(obj['attrValueIds']).tempJson.attributeJson;
                        // delete obj['attrValueIds']==ids;
                        for (var j = 0; j < attrArr.length; j++) {
                            for (var i = 0; i < idsArr.length; i++) {
                                if ($.inArray(Number(idsArr[i]),attrArr[j].attrValueIds)>-1) {
                                    attrArr.splice(j,1);
                                    break;
                                }
                            }
                        } //类目
                        var tempArr = $.map(attrArr,function(val,key){
                            var tempStr = '';
                            tempStr = val['attributeId'] + ':' +val['attrValueIds'].join('-');
                            return tempStr;
                        });
                        obj['attrValueIds'] = tempArr.join(',');
                    } else if (obj['navCategoryIds'] && cLists(obj['navCategoryIds'], ids)) {
                        delete obj['navCategoryIds'];
                    } //搜索
                    return location.href = '?' + util.urlFormat(obj);
                }
            }
        }
    }])

    //商品详情页的推荐商品
.directive('recommendGoods', ['$rootScope','$window', function ($rootScope,$window) {
    return {
        template: [
            '<div class="container-left">',
            '    <div class="related-box" ng-class={"left":side==\'left\',"right":side==\'right\'} ng-style="{height:options.showHeight + options.addHeight}">',
            '        <div class="guess">',
            '            <span class="title">{{title}}</span>',
            '        </div>',
            '       <div class="good-item-bigBox" ng-style="{height:options.showHeight}">',
            '           <div class="good-item-box {{options.domName}}">',
            '               <span class="no-data" ng-if="prods.length==0">{{i18n("暂无数据")}}</span>',
            // 原有热销
            '               <div class="good-item"  ng-repeat="prod in prods track by $index | limitTo : options.pageSize" ng-if="showOldHotGoods">',
            '                   <a ng-href="{{\'/item.html?itemId=\'+prod.mpId}}" class="pat-pro">',
            '                       <!--<span class="null">自定义</span>-->',
            '                       <img class="img-list" width="140" height="140" ng-src="{{prod.url400x400}}">',
            '                       <p class="money">',
            '                           <span class="ranking" ng-if="options.showIndex">{{$index+1}}</span>',
            '                           <span class="selling" ng-if="options.showSalesVolume">{{i18n("热销")}}{{prod.mpSalesVolume}}{{i18n("件")}}</span>',
            '                           <span class="money-img" ng-if="!hideProductPrice">{{prod.availablePrice||prod.originalPrice|currency:"￥"}}</span>',
            '                           <span class="money-img price-text" ng-if="hideProductPrice">{{switchConfig.common.showTextWhenHidePrice}}</span>',
            '                       </p>',
            '                       <p class="pro-infor" ng-if="options.showName">{{prod.name}}</p>',
            // '                       <p class="pro-label" ng-if="options.showPromotion">',
            // '                           <span ng-repeat="text in prod.incoTextData track by $index|limitTo:3" ng-if="text">{{text}}</span>',
            // '                       </p>',
            '                   </a>',
            '                </div>',
            // 新增热销
            '               <div class="good-item"  ng-repeat="prod in prods track by $index | limitTo : options.pageSize" ng-if="showNewHotGoods">',
            '                   <a ng-href="{{\'/item.html?itemId=\'+prod.mpId}}" class="pat-pro">',
            '                       <!--<span class="null">自定义</span>-->',
            '                       <img class="img-list" width="140" height="140" ng-src="{{prod.mainPictureUrl}}">',
            '                       <p class="money">',
            '                           <span class="ranking" ng-if="options.showIndex">{{$index+1}}</span>',
            '                           <span class="selling" ng-if="options.showSalesVolume">{{i18n("热销")}}{{prod.saleNum}}{{i18n("件")}}</span>',
            '                           <span class="money-img" ng-if="!hideProductPrice">{{prod.salePriceWithTax || 0 |currency:"￥"}}</span>',
            '                           <span class="money-img price-text" ng-if="hideProductPrice">{{switchConfig.common.showTextWhenHidePrice}}</span>',
            '                       </p>',
            '                       <p class="pro-infor" ng-if="options.showName">{{prod.chineseName}}</p>',
            // '                       <p class="pro-label" ng-if="options.showPromotion">',
            // '                           <span ng-repeat="text in prod.incoTextData track by $index|limitTo:3" ng-if="text">{{text}}</span>',
            // '                       </p>',
            '                   </a>',
            '                </div>',
            '            </div>',
            '        </div>',
            '        <div class="bottom-arrow" ng-if="!prods.length==0" ng-cloak>',
            '            <a href="javascript:;" class="arrow-down arrow" ng-cloak ng-click="wipeDown()"',
            '               ng-class="{disabled:page>=maxLength}" ng-if="side==\'left\'||side==\'right\'"></a>',
            '            <a href="javascript:;" class="arrow-up arrow disabled" ng-click="wipeUp()"',
            '               ng-class="{disabled:pageTrue<1}"  ng-if="side==\'left\'||side==\'right\'" ng-if="!across"></a>',
            '        </div>',
            '    </div>',
            '</div>'
        ].join(''),
        scope: {
            title: '@',
            sceneNo: '@', //推荐商品场景(0:首页;1:详情页;2:购物车;3:订单页;4:搜索无结果)
            options: '=',
            onInit: '=',
            side: '@',
            prodItemId: "=",
            crumbList: '='
        },
        link: function (scope, elem, attr) {
            scope.i18n = function (key) {
                return $window.i18n ? $window.i18n(key) : key;
            };
            scope.hideProductPrice = $rootScope.hideProductPrice;
            scope.switchConfig = {
                common: {
                    showTextWhenHidePrice: $rootScope.switchConfig.common.showTextWhenHidePrice,
                    companyProjectType: $rootScope.switchConfig.common.companyProjectType
                }
            }
            scope.$watchCollection('crumbList', function (n) {
                // && n.length != 0
                if (n) {
                    getRecommend(1);
                }
            }, true)
            scope.$watch('onInit',function (v) {
                if(v) scope.getRecommend(1);
            })
            scope.prods = [];
            scope.getRecommend = getRecommend;
            var size = scope.options.size || 3;
            function getClassNames(classStr,tagName){
                if (document.getElementsByClassName) {
                    return document.getElementsByClassName(classStr)
                }else {
                    var nodes = document.getElementsByTagName(tagName),ret = [];
                    for(i = 0; i < nodes.length; i++) {
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

            //商品全部都查出来， 通过控制高度显示不同的商品
            scope.arrowMoveGood = function() {
                var pic = 0;

                var totalNum = scope.isEnd;
                var num = 0;
                if( totalNum % size == 0 ) {
                    num = totalNum / size - 1;
                } else {
                    num = Math.floor( totalNum / size );
                }
                scope.pageTrue=0;   //控制按钮下
                scope.page=1        //控制按钮上

                scope.wipeDown = function() {

                    if( pic === num ) {
                        return;
                    }
                    pic++;
                    scope.pageTrue++

                    scope.page++

                    var target = -(pic * scope.options.showHeight);
                    $("." + scope.options.domName).css({
                        transition:"all 0.5s",
                        top:target + 'px'
                    })
                }
                scope.wipeUp = function() {

                    if( pic === 0 ) {
                        return;
                    }
                    pic--;
                    var target = -(pic * scope.options.showHeight);
                    $("." + scope.options.domName).css({
                        transition:"all 0.5s",
                        top:target + 'px'
                    })

                    if(scope.page<1){
                        scope.page=1
                        return false;
                    }

                    scope.page--
                    if(scope.page<=0){//上
                        scope.page=scope.pageTrue;
                    }

                    scope.pageTrue--
                    if(scope.pageTrue<=0){
                        scope.pageTrue=0
                    }

                }
            }
            // 數組排序方法
            function compare(property){
                return function(a,b){
                    var value1 = a[property];
                    var value2 = b[property];
                    return value1 - value2;
                }
            }
            //通过面包屑和options获取商品列表
            function getRecommend(pageNo) {
                if (pageNo == 0) return; //如果是无效的pageNo, 不做任何操作
                scope.pageNo = pageNo
                let url = '/custom-sbd-web/product/getHotSaleProductList.do'
                let params = {
                    currentPage: scope.pageNo,
                    itemsPerPage: scope.options.pageSize
                }
                $rootScope.ajax.postJson(url,params).then(function(res) {
                    if (res.code ==0 && res.data) {
                        scope.prods = res.data
                        if (scope.prods.length) {
                            let ids = []
                            angular.forEach(scope.prods,function(item) {
                                ids.push(item.mpId)
                            })
                            scope.showNewHotGoods = true
                            let url = '/search/rest/getMpSaleNum.do';
                            let params = {
                                mpIds: ids.join()
                            }
                            $rootScope.ajax.get(url,params).then(function(res) {
                                angular.forEach(scope.prods,function(item) {
                                    angular.forEach(res.data.dataList,function(items) {
                                        if (item.mpId == items.mpId) {
                                            item.saleNum = items.saleNum
                                        }
                                    })
                                })
                            })
                            scope.prods = scope.prods.sort(compare('saleNum'))
                            // scope.prods = scope.prods.concat(scope.prods)
                        }
                        if(!scope.prods || !scope.prods.length) {
                            var params = angular.extend({
                                platformId: $rootScope.platformId, //默认PC
                                pageSize: scope.options.pageSize,
                                sortType: '15',
                                v:2//接口版本 v=2 不返回价格、库存、促销
                            }, {
                                pageNo: scope.pageNo
                            }); //sceneNo优先级:options.sceneNo>sceneNo
                            var url = '/search/rest/searchList.do';
                            if (scope.options.type == 'crumb') {
                                var crumbArr = []
                                for (var k in scope.crumbList) {
                                    crumbArr.push(scope.crumbList[k].categoryId);
                                }
                                var newArr = crumbArr.join(',');
                                params.navCategoryIds = newArr;
                                if (scope.switchConfig.common.companyProjectType == 'b2b') {
                                    delete params.navCategoryIds;
                                    params.mCategoryIds = newArr;
                                }
                            } else {
                                params.keyword = '*****';
                            }
                            $rootScope.ajax.get(url, params).then(function (res) {
                                if (res.code == 0 && res.data && angular.isArray(res.data.productList) && res.data.productList.length > 0) {
                                    scope.showOldHotGoods = true
                                    scope.prods = res.data.productList;
                                    //判断当前页是否是最后一页
                                    var twoArr = [];
                                    angular.forEach(scope.prods, function (val) {
                                        if (val.mpSalesVolume >= 10000) {
                                            val.mpSalesVolume = (val.mpSalesVolume / 10000).toFixed(1) + scope.i18n('万');
                                        }
                                        twoArr.push(val.mpId);
                                    })
                                    var threeArr = twoArr.join(',');
                                    scope.isEnd = res.data.productList.length;
                                    var num = 0;
                                    if( scope.isEnd % size == 0 ) {
                                        num =  scope.isEnd / size;
                                    } else {
                                        num = scope.isEnd / size + 1;
                                    }
                                    scope.maxLength = num;
                                    var url = $rootScope.host + '/realTime/getPriceStockList',
                                        params = {
                                            mpIds:threeArr,
                                            areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode: $rootScope.defaultAreasCode
                                    };
                                    $rootScope.ajax.get(url,params).then(function (res) {
                                        if (res.code == 0) {
                                            scope.lastPrice = res.data.plist;
                                            scope.arrowMoveGood();
                                            angular.forEach( scope.prods,function(val) {
                                                angular.forEach( scope.lastPrice,function(x) {
                                                    if( val.mpId == x.mpId ) {
                                                        val.availablePrice = x.availablePrice;
                                                    }
                                                } )
                                            } )
                                        }
                                    })
                                }
                            });
                        }
                    }
                })
            }
        }
    }
}])
//猜你喜欢
.directive('guessYouLike',['$rootScope', function ($rootScope) { //推荐商品|猜你喜欢...
    return {
        restrict: 'AE',
        template: [
            '<div class="container-left">',
            '    <div class="related clearfix bottom">',
            '        <h4 class="guess">{{title}}</h4>',
            '        <div class="com-pro-item">',
            '            <a href="javascript:;" class="com-arrow-left" ng-style="{top: options.top}" ng-click="getRecommend(pageNo-1)" ' ,
            '                  ng-class="{disabled:pageNo<=1}" ng-if="prods.length"></a>',
            '            <ul class="cart-goods-list">',
            '                <li class="cart-single-good" ng-style="{width: (options.pageWidth-200) / options.pageSize}" ng-repeat="prod in prods |limitTo: options.pageSize" ng-click="toDetail(prod.mpId)">',
            '                    <dt ng-style="{padding: options.paddingWidth, width: (options.pageWidth-200) / options.pageSize - (options.paddingWidth * 2)}"><img class="transverse-inline-block" ng-src="{{prod.url400x400}}" alt="" ng-style="{width: ((options.pageWidth-200) / options.pageSize) - (options.paddingWidth * 2), height: ((options.pageWidth-200) / options.pageSize) - (options.paddingWidth * 2)}"></dt>',
            '                    <dd ng-style="{\'padding-left\': options.paddingWidth,\'padding-right\': options.paddingWidth}">',
            '                        <label ng-if="!hideProductPrice">{{prod.salePrice|currency:"￥"}}</label>',
            '                        <label class="price-text" ng-if="hideProductPrice">{{switchConfig.common.showTextWhenHidePrice}}</label>',
            '                        <span class="name">{{prod.mpName}}</span>',
            '                        <p class="pro-label" ng-if="options.showPromotion">',
            '                           <span ng-repeat="pro in prod.tagList" class="bgff714b">{{pro.tagName}}</span>',
            '                        </p>',
            '                    </dd>',
            '                </li>',
            '            </ul>',
            '            <div class="none-goods-box" ng-if="!prods || prods.length<=0"><img src="../images/none-goods.png" alt=""><span class="noneGoods">{{i18n("暂无商品")}}</span></div>',
            '            <a href="javascript:;" class="com-arrow-right" ng-style="{top: options.top}" ng-click="getRecommend(isEnd?0:pageNo+1)" ',
            '               ng-class="{disabled:isEnd}" ng-if="prods.length"></a>',
            '        </div>',
            '    </div>',
            '</div>'
        ].join(''),
        scope: {
            title: '@',
            options:'=',
            onInit:'='
        },
        link: function (scope, elem, attr) {
            scope.hideProductPrice = $rootScope.hideProductPrice;
            scope.switchConfig = {
                common: {
                    showTextWhenHidePrice: $rootScope.switchConfig.common.showTextWhenHidePrice
                }
            }
            scope.$watch('onInit',function (v) {
                scope.options.paddingWidth = scope.options.paddingWidth || 20;
                if(v) scope.getRecommend(1);
            })
            scope.options.pageSize = scope.options.pageSize || 5;
            scope.options.pageWidth = scope.options.pageWidth || 1200;
            scope.prods=[];
            scope.getRecommend = function(pageNo) {
                if(pageNo==0) return; //如果是无效的pageNo, 不做任何操作
                scope.pageNo=pageNo;
                var params = angular.extend({
                    platformId: $rootScope.platformId, //默认PC
                    pageSize: scope.options.pageSize,
                    sceneNo:2,
                    areaCode: $rootScope.localProvince.province.provinceCode
                }, {pageNo:scope.pageNo});
                $rootScope.ajax.get('/search/rest/recommendMpList', params).then(function (res) {
                    if (res.code == 0 && res.data && angular.isArray(res.data.dataList)&&res.data.dataList.length>0) {
                        scope.prods = res.data.dataList;
                        //判断当前页是否是最后一页
                        scope.isEnd = res.data.dataList.length<(scope.options.pageSize||5);
                        var arr = [];
                        angular.forEach( scope.prods , function( q ) {
                            arr.push( q.mpId );
                        })
                        var newArr = arr.join(',');
                        var twoUrl = $rootScope.host + '/realTime/getPriceStockList',
                            params = {
                                mpIds:newArr,
                                areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode: $rootScope.defaultAreasCode
                            };
                        $rootScope.ajax.get(twoUrl, params).then(function( result ) {
                            if( result.code == 0 ) {
                                var priceMes = result.data.plist;
                                angular.forEach( scope.prods , function(x) {
                                    angular.forEach(priceMes , function( s ) {
                                        if( x.mpId == s.mpId ) {
                                            x.availablePrice = s.availablePrice;
                                        }
                                    })
                                })
                            }
                        })
                    }
                });
            }
            scope.toDetail = function(mpId) {
                location.href="/item.html?itemId=" + mpId;
            }
        }
    }
}])
//顶部大的搜索框，取历史记录之类
.directive('searchBar', ['$rootScope','$window',function ($rootScope,$window) {
    return {
        template: [
            '<div class="positonRE" ng-mouseleave=searchHide()>',
            '    <div class="search-text clearfix">',
            '        <ul class="search-product-type" ng-if="$parent.switchConfig.common.showSearchCommodityTypes">' ,
            '           <li class="type" ng-class="{active: searchType == \'good\'}" ng-click="changeSearchType(\'good\')">{{i18n("商品")}}</li>' ,
            '           <li class="type" ng-class="{active: searchType == \'shop\'}" ng-click="changeSearchType(\'shop\')">{{i18n("店铺")}}</li>' ,
            '        </ul>',
            '        <input style="width: 450px" class="search-ipt" type="text" ng-model="keyword" ng-keydown="autoSearch($event,keyword)" ng-change="auto(keyword)" ng-click="searchShow()" placeholder="{{defaultKeyword}}">',
            '        <input ng-class="{mgT30:$parent.switchConfig.common.showSearchCommodityTypes, \'search-top-btn\': $parent.switchConfig.common.showSearchIcon, \'search-top-text-btn\': !$parent.switchConfig.common.showSearchIcon}" type="button" autocomplete="false" ng-click="search(keyword)" value="{{!$parent.switchConfig.common.showSearchIcon? i18n(\'搜索\'): \'\'}}">',
            '    </div>',
            //热词
            '    <p class="hotword" ng-class="{top38:!$parent.switchConfig.common.showSearchCommodityTypes, top68:$parent.switchConfig.common.showSearchCommodityTypes}" ng-show="hotWords && hotWords.length>0">',
            '        <a ng-repeat="hot in hotWords|limitTo:6" ng-href="{{hot.linkUrl}}">{{hot.content}}</a>',
            '    </p>',
            //历史记录
            '    <div id="shelper" ng-if="shelper.isHotwords&&searchHistoryList">',
            '       <ul class="shelper top-2">',
            '           <li class="shelper-first">{{i18n("历史记录")}}</li>',
            '           <li ng-repeat="list in searchHistoryList | limitTo:10"><div class="search-item" ng-click="searchHistory(list.keyword || list)">{{list.keyword|| list}}</div></li>',
            '           <li class="close" ng-click="searchClose()">{{i18n("全部删除")}}</li>',
            '       </ul>',
            '    </div>',
            //联想词，输入搜索自动加载相同的；
            '    <div ng-if="autoList" id="shelper">',
            '       <ul class="shelper top-2">',
            '           <li ng-repeat="lista in autoList"><div class="search-item"  ng-click="searchHistory(lista.keyword)">{{lista.keyword}}</div></li>',
            '       </ul>',
            '    </div>',
            '</div>'
        ].join(''),
        scope: {
            shelper: "=",
            keyword: "=",
        },
        link: function (scope, elem, attr) {
            scope.i18n = function (key) {
                return $window.i18n ? $window.i18n(key) : key;
            };
            // $rootScope.switchConfig.common.showSearchCommodityTypes = true;
            scope.searchType = 'good';
            var urlParams = $rootScope.util.paramsFormat(location.search);
            var searchType = urlParams.searchType;
            if (searchType == 'good' || searchType == 'shop') {
                scope.searchType = searchType;
            }
            scope.keyword = '';
            if (urlParams.keyword) {
                scope.keyword = decodeURIComponent(urlParams.keyword);
                //scope.keyword =scope.keyword.replace(/@/g,'').replace(/\/\/\)/g,'').replace(/>/g,'').replace(/</g,'').replace(/--/g,'').replace(/;/g,'').replace(/\(/g,'').replace(/\)/g,'').replace(/\（/g,'').replace(/\）/g,'') ;
            }
            //选择店铺或者商品搜索
            scope.changeSearchType = function (type) {
                scope.searchType = type;
            }
            if (!scope.keyword) {
                scope.defaultKeyword = scope.i18n('搜索词');
            } else {
                scope.defaultKeyword = '';
            }
            scope.shelper = {
                isHotwords: false
            }
            var maxLength = 256;
            scope.searchHistory = function (keyword) {
                // scope.keyword = (keyword || scope.keyword).substring(0, maxLength);
                // window.location = '/search.html?keyword=' + encodeURIComponent(scope.keyword || scope.defaultKeyword);
                scope.search(keyword);
            }
            scope.search = function (keyword) {
                //跟踪云埋点
                try{
                    window.eventSupport.emit('heimdallTrack',{
                        ev:"1",
                        kw:keyword
                    });
                }catch(e) {
                    //console.log(e);
                }
                //产品化1.3接口不需要替换
                //keyword =keyword.replace(/@/g,'').replace(/\/\/\)/g,'').replace(/>/g,'').replace(/</g,'').replace(/--/g,'').replace(/;/g,'').replace(/\(/g,'').replace(/\)/g,'').replace(/\（/g,'').replace(/\）/g,'') ;
                // scope.keyword = (keyword || scope.keyword).substring(0, maxLength);
                if(scope.keyword == undefined){
                    scope.keyword = scope.defaultKeyword;
                }
                scope.keyword = decodeURIComponent((keyword || scope.keyword)).split(" ");
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
                var url = '/search.html?keyword=' + encodeURIComponent(scope.keyword[0] || scope.defaultKeyword);
                var areaCode = $rootScope.localProvince.province.provinceCode;
                var guid = localStorage.getItem("heimdall_GU");
                guid = guid.replace(/\^/g,'')
                guid = guid.replace(/\`/g,'')
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
                if (scope.searchType != 'good') {
                    url += '&searchType=' + scope.searchType;
                }
                window.location = url;
            };
            //回车搜索
            scope.autoSearch = function ($event, keyword) {
                if ($event.keyCode === 13) {
                    if(keyword == undefined){
                        scope.search(scope.defaultKeyword);
                    }else{
                        scope.search(keyword);
                    }
                }
            };
            //获取热搜词
            var getHotWord = function () {
                var url = '/ad-whale-web/dolphin/getAdSource',
                    params = {
                        platform: 1,
                        companyId: $rootScope.companyId,
                        pageCode: "HOME",
                        adCode: "searchword,hotword"
                        // adCode: $.inArray(location.pathname, ['/integral.html','/intergralList.html','/integralSearch.html']) > -1?"point_searchword,point_hotword":"searchword,hotword"
                    };
                $rootScope.ajax.get(url,params).then(function (res) {
                    if (res.code == 0) {
                        scope.hotWords = res.data.hotword || [];
                        if ((res.data.hotword || []).length > 0) {

                        }
                        scope.searchwords = res.data.searchword || [];
                        if ((res.data.searchword || []).length > 0) {
                            scope.defaultKeyword = res.data.searchword[0].title ? res.data.searchword[0].title : scope.i18n('搜索词');
                            scope.searcwordUrl = res.data.searchword[0].linkUrl;
                        }
                        // var pointPage = ['/integral.html','/intergralList.html','/integralSearch.html'];
                        // if($.inArray(location.pathname, pointPage) > -1){
                        //     scope.hotWords = res.data.point_hotword || [];
                        //     if ((res.data.point_hotword || []).length > 0) {

                        //     }
                        //     scope.searchwords = res.data.point_searchword || [];
                        //     if ((res.data.point_searchword || []).length > 0) {
                        //         scope.defaultKeyword = res.data.point_searchword[0].title;
                        //         scope.searcwordUrl = res.data.point_searchword[0].linkUrl;
                        //     }
                        // } else{
                        //     scope.hotWords = res.data.hotword || [];
                        //     if ((res.data.hotword || []).length > 0) {

                        //     }
                        //     scope.searchwords = res.data.searchword || [];
                        //     if ((res.data.searchword || []).length > 0) {
                        //         scope.defaultKeyword = res.data.searchword[0].title;
                        //         scope.searcwordUrl = res.data.searchword[0].linkUrl;
                        //     }
                        // }
                    }
                });
            }
            if (!scope.keyword) {
                getHotWord();
            }
            //联想词
            scope.auto = function (keyword) {
                scope.shelper.isHotwords = false;
                var url = '/search/rest/auto.do',
                    params ={
                        keyword: keyword
                    };
                var tList = [];
                $rootScope.ajax.get(url, params).then(function (res) {
                    if (res.code == 0) {
                        if (res.data && res.data.length > 0) {
                            tList = res.data;
                        }
                        scope.autoList = tList;
                    } else {
                        scope.autoList = tList;
                    }
                }, function(res) {
                    scope.autoList = tList;
                });
            }
            //获取历史搜索
            scope.searchShow = function () {
                if (scope.autoList && scope.autoList.length > 0) {
                    return;
                }
                scope.shelper.isHotwords = true;
                $rootScope.util.isPointPage(function () {
                    scope.shelper.isHotwords = false;
                })
                var url = '/search/rest/searchHistoryList.do';
                //var sList = [];
                    /*  kList = localStorage.getItem('keywordsList');*/
                scope.searchHistoryList = [];
                let guid = localStorage.getItem("heimdall_GU")
                guid = guid.replace(/\^/g,'')
                guid = guid.replace(/\`/g,'')
                var params = {
                        count: 10,
                        guid:guid
                    };
                $rootScope.ajax.get(url, params).then(function (res) {
                    if (res.code == 0) {
                        if (res.data && res.data.length > 0) {
                            scope.searchHistoryList = res.data;
                            //sList = (kList && kList.toString().split(','));
                        }
                    }
                });
                /*if (ut) {

                } else {
                    sList = (kList && kList.toString().split(','));
                    scope.searchHistoryList = sList;
                }*/
            }
            //删除历史记录
            scope.searchClose = function () {
                var url = '/search/rest/cleanSearchHistory.do';
                var ut = $rootScope.util.getUserToken();
                let guid = localStorage.getItem("heimdall_GU")
                guid = guid.replace(/\^/g,'')
                guid = guid.replace(/\`/g,'')
                $rootScope.ajax.post(url, {
                    guid:guid
                }).then(function (res) {
                    if (res.code == 0) {

                    }
                })
                /*if (ut) {

                    localStorage.removeItem('keywordsList')
                } else {
                    localStorage.removeItem('keywordsList')
                }*/
            }
            scope.searchHide = function () {
                scope.shelper.isHotwords = false;
                scope.autoList = [];
            }
        }
    }
}])
//顶部的迷你购物车
.directive('miniCart', ['$rootScope', 'config','$window',function ($rootScope,config,$window) {
    return {
        template: [
            '<div ng-mousemove="showCart=true" ng-mouseleave="showCart=false">',
            '   <span class="cart-count" ng-cloak ng-if="cartTotal">{{cartTotal}}</span>',
            '   <a class="car-shop" href="/cart.html" ng-style="{backgroundColor:showCart?\'#fff\':\'#FFF6F6\',borderColor:showCart?\'#cc0000\':\'\'}">',
            '     {{i18n($parent.switchConfig.common.allCartBtnName)}}<i></i></a>',
            '   <span class="mask" ng-show="showCart"></span>',
            '   <div id="minicart" ng-style="{display:showCart?\'block\':\'none\'}" ng-mouseenter="showCart=true"',
            '       ng-mouseleave="showCart=false">',
            '       <div class="cart-inner"' +
            ' ng-if="miniCartInfo.merchantList && showCart"' +
            '>',
            '           <div class="gds">',
            '               <div class="store" ng-repeat="merchant in miniCartInfo.merchantList">',
            '                   <div class="row" ng-repeat="product in merchant.productList">',
            '                       <div class="cell c1"><a href="/item.html?itemId={{product.mpId}}">',
            '                           <img width="80" height="80" class="pic" ng-src="{{product.url60x60 }}" alt=""></a>',
            '                       </div>',
            '                       <div class="cell c2">',
            '                           <a href="/item.html?itemId={{product.mpId}}" class="clearfix"><h5>{{product.name}}</h5><span class="num">x {{product.num}}</span><span class="price fr">{{product.price | currency:\'￥\'}}</span></a>',
            '                           <a href="javascript:void(0)" class="del-button" target="_self" ng-click="removeMiniCartItem(product.mpId)"><i class="op-icons op-icons-del"></i></a>',
            '                       </div>',
            // '                       <div class="cell c3">',
            // '                           <a href="javascript:void(0)" target="_self" ng-click="removeMiniCartItem(product.mpId)"><i class="op-icons op-icons-del"></i></a>',
            // '                           <p class="m">{{product.price | currency:\'￥\'}}</p>',
            // '                       </div>',
            '                   </div>',
            '               </div>',
            '           </div>',
            '           <div class="clear"></div>',
            '           <div class="bottom">',
            '               <div class="sum">{{i18n("共有")}}<span class="red">{{cartTotalNum||0}}</span>{{i18n("件商品")}}</div>',
            '               <span>{{i18n("合计")}}:<span class="red he">{{miniCartInfo.summary.amountAll||0 | currency:\'￥\'}}</span>',
            '               <a href="/cart.html" class="btn-cart">{{i18n("查看")}}{{i18n($parent.switchConfig.common.allCartBtnName)}}</a>',
            '           </div>',
            '       </div>',
            '       <div class="cart-null" ng-if="!miniCartInfo.merchantList && showCart">',
            '           <i></i>{{i18n($parent.switchConfig.common.allCartBtnName)}}{{i18n("中还没有商品")}}，{{i18n("赶紧选购吧")}}！',
            '       </div>',
            '   </div>',
            '</div>'
        ].join(''),
        link: function (scope, elem, attr) {
            scope.i18n = function (key) {
                return $window.i18n ? $window.i18n(key) : key;
            };
            //监听加车事件
            scope.$on('updateMiniCart', function () {
                scope.updateMiniCart();
            });
            //初始化取数据
            (scope.updateMiniCart = function () {
                getCartTotal();
                getMiniCart();
            })();
            //获取总数, 最多显示99,多余99显示99+
            function getCartTotal() {
                $rootScope.ajax.postFrom($rootScope.host + "/cart/count",{
                    companyId: $rootScope.companyId,
                    sessionId: $rootScope.sessionId,
                    areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode: $rootScope.defaultAreasCode
                }).then(function (res) {
                    if (res.code == 0) {
                        scope.cartTotal = res.data;
                        scope.cartTotalNum = res.data;
                        if (scope.cartTotal > 99) {
                            scope.cartTotal = '99+';
                        }
                    } else {
                        scope.cartTotal = 0;
                    }
                });
            };
            //获取列表
            function getMiniCart() {
                var url = $rootScope.host + "/cart/list";
                var param = {
                    "companyId": $rootScope.companyId,
                    "provinceId": $rootScope.localProvince.province.provinceId,
                    "platformId": $rootScope.platformId,
                    "ut": $rootScope.util.getUserToken(),
                    "sessionId": $rootScope.sessionId,
                    "areaCode":$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode: $rootScope.defaultAreasCode
                };
                $rootScope.ajax.post(url, param).then(function (result) {
                    if (result.code == 0) {
                        if (result.data != null && result.data.merchantList != null && result.data.merchantList.length != 0) {
                            scope.miniCartInfo = result.data;
                        } else {
                            scope.miniCartInfo = null;
                        }
                    }
                });
            };
            scope.removeMiniCartItem = function (mpId) {
                var url = $rootScope.host + "/cart/removeItem.do";
                var params = {
                    "mpId": mpId,
                    "sessionId": $rootScope.sessionId,
                    "areaCode":$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode: $rootScope.defaultAreasCode
                };

                $rootScope.ajax.post(url, params).then(function (result) {
                    if (result.code == 0) {
                        scope.updateMiniCart();
                        if ($rootScope.switchConfig.guide.search.showPromotionTip) {
                            $rootScope.getCartExt($rootScope.util.paramsFormat(location.href).promotionId);
                        }
                    } else
                        $rootScope.error.checkCode(result.code, result.message);
                }, function (res) {
                    $rootScope.error.checkCode(scope.i18n('系统异常'), scope.i18n('删除迷你') + scope.i18n($rootScope.switchConfig.common.allCartBtnName) + scope.i18n('异常') + '！');
                });
            };
        }
    }
}])
//倒计时指令
.directive('countDown', ['$interval', '$timeout','$window', function ($interval, $timeout,$window) {
    return {
        template: '<div ng-if="!noFont&&!isAll" style="display: inline-block;">' +
            '   <span ng-if="d>0">' +
            '       <span class="ce62128"> {{d}} </span>{{i18n("天")}}' +
            '   </span>' +
            '   <span class="ce62128"> {{h}} </span>{{i18n("时")}}' +
            '   <span class="ce62128"> {{m}} </span>{{i18n("分")}}' +
            '   <span class="ce62128" ng-if="d<=0"> {{s}} {{i18n("秒")}}</span> ' +
            '</div>' +
            '<div ng-if="noFont&&!isAll" style="display: inline-block;">' +
            '   <span ng-if="d>0">' +
            '       <span class="ce62128"> {{d}} </span>{{i18n("天")}}' +
            '   </span>' +
            '   <span class="ce62128"> {{h}} </span>:' +
            '   <span class="ce62128"> {{m}} </span>:' +
            '   <span class="ce62128"> {{s}} </span>' +
            '</div>' +
            '<div ng-if="isAll" style="display: inline-block;">' +
            '   <span ng-if="d>0">' +
            '       <span class="ce62128"> {{d}} </span>{{i18n("天")}} ' +
            '   </span>' +
            '   <span class="ce62128"> {{h}} </span>:' +
            '   <span class="ce62128"> {{m}} </span>:' +
            '   <span class="ce62128"> {{s}} </span>' +
            '</div>',
        scope: {
            showCountDown: "=",
            endTime: "=",
            currentTime: "=",
            callback: "&",
            noFont: '@',
            isAll: '@'
        },
        transclude: true,
        link: function (scope, elem, attrs) {
            scope.i18n = function (key) {
                return $window.i18n ? $window.i18n(key) : key;
            };
            scope.noFont = false;
            var timeLeft = 0,
                timer;
            scope.d = 0, scope.h = 0, scope.m = 0, scope.s = 0;
            scope.$watch('showCountDown', function (n, o) {
                if (n) {
                    timeLeft = scope.endTime - scope.currentTime;
                    scope.countDown();
                }
            })
            scope.getDisplay = function (t) {
                if (t >= 0) {
                    scope.d = scope.fmtTimeStr(Math.floor(t / 1000 / 60 / 60 / 24));
                    scope.h = scope.fmtTimeStr(Math.floor(t / 1000 / 60 / 60 % 24));
                    scope.m = scope.fmtTimeStr(Math.floor(t / 1000 / 60 % 60));
                    scope.s = scope.fmtTimeStr(Math.floor(t / 1000 % 60));
                }
            };
            scope.countDown = function () {
                //如果时间不是整秒,需要先延时非整秒的时间再开始倒计时
                if (timeLeft % 1000 > 0) scope.getDisplay(timeLeft + 1000);
                timeLeft -= timeLeft % 1000;
                //等待整秒开始倒计时
                $timeout(function () {
                    if (timer) {
                        $interval.cancel(timer);
                        timer = null;
                    }
                    scope.getDisplay(timeLeft)
                    //循环算值
                    timer = $interval(function () {
                        scope.getDisplay(timeLeft -= 1000)
                        if (timeLeft == 0) {
                            scope.showCountDown = false;
                            scope.$emit('changeShow', {
                                show: false
                            }); //把值传递出去
                            $interval.cancel(timer)
                            if (typeof scope.callback == 'function') {
                                scope.callback();
                            }
                        }
                    }, 1000)
                }, timeLeft % 1000)
            };
            scope.fmtTimeStr = function (t) {
                return t >= 10 ? t : "0" + t;
            }
        }
    }
}])
//购物车弹框组件调用
.directive("bombBox", [function () {
    return {
        template: '<div class="bg-modal" ng-if="cartData.bombShow">' +
        '   <div class="bomb-Box"><div class="bomb-title clearfix">' +
        '       <span class="title-text">{{cartData.title}}</span>' +
        '           <span class="close-img" ng-click="close()"></span>' +
        '       </div>' +
        '       <div class="bomb-main">' +
        '           <div class="main-left" ng-class={"top-vertical":cartData.position==\'top\',"middle-vertical":cartData.position==\'middle\'}>' +
        '               <span ng-class={"success-img":cartData.state==\'success\',"error-img":cartData.state==\'error\'}></span>' +
        '           </div>' +
        '           <div class="main-right" ng-class={"top-vertical":cartData.position==\'top\',"middle-vertical":cartData.position==\'middle\'}>' +
        '               <span class="right-text" ng-class={"success-text":cartData.state==\'success\',"error-text":cartData.state==\'error\'}>{{cartData.rightText}}</span>' +
        '               <p ng-if="cartData.choesText" class="chose-text">{{cartData.choesText}}</p>' +
        '               <a class="integral" href="">{{integral}}</a>' +
        '               <div  class="right-botton" ng-if="cartData.buttons.length > 0">' +
        '                   <a  href="" class="{{item.className}}" ng-click="item.callback()" ng-repeat="item in cartData.buttons">{{item.name}}</a>' +
        '               </div>' +
        '           </div>' +
        '       </div>' +
        '   </div>' +
        '</div>',
        transclude: true,
        scope: {
            cartData: "="
        },
        link: function (scope, elem, attrs) {
            scope.close = function () {
                if (scope.cartData.closeCallback && typeof scope.cartData.closeCallback == 'function') {
                    scope.cartData.closeCallback();
                } else {
                    scope.cartData.bombShow = false;
                }
            }
        }
    }
}])
//倒计时指令
.directive('singleCountDown', ['$interval', '$timeout','$window', function ($interval, $timeout,$window) {
    return {
        template: '<span ng-if="!noFont&&!isAll" style="display: inline-block;">' +
            '   <span ng-if="d>0">' +
            '       <span class="ce62128"> {{d}} </span>{{i18n("天")}}' +
            '   </span>' +
            '   <span class="ce62128"> {{h}} </span>{{i18n("时")}}' +
            '   <span class="ce62128"> {{m}} </span>{{i18n("分")}}' +
            '   <span class="ce62128" ng-if="d<=0"> {{s}} {{i18n("秒")}}</span> ' +
            '</span>' +
            '<span ng-if="noFont&&!isAll" style="display: inline-block;">' +
            '   <span ng-if="d>0">' +
            '       <span class="ce62128"> {{d}} </span>{{i18n("天")}}' +
            '   </span>' +
            '   <span class="ce62128"> {{h}} </span>:' +
            '   <span class="ce62128"> {{m}} </span>:' +
            '   <span class="ce62128"> {{s}} </span>' +
            '</span>' +
            '<span ng-if="isAll" style="display: inline-block;">' +
            '   <span ng-if="d>0">' +
            '       <span class="ce62128"> {{d}} </span>{{i18n("天")}} ' +
            '   </span>' +
            '   <span class="ce62128"> {{h}} </span>:' +
            '   <span class="ce62128"> {{m}} </span>:' +
            '   <span class="ce62128"> {{s}} </span>' +
            '</span>',
        scope: {
            showCountDown: "=",
            timeLeft: "=",
            callback: "&",
            noFont: '@',
            isAll: '@'
        },
        transclude: true,
        link: function (scope, elem, attrs) {
            scope.i18n = function (key) {
                return $window.i18n ? $window.i18n(key) : key;
            };
            scope.noFont = false;
            var timeLeft = 0,
                timer;
            scope.d = 0, scope.h = 0, scope.m = 0, scope.s = 0;
            scope.$watch('showCountDown', function (n, o) {
                if (n) {
                    timeLeft = scope.timeLeft;
                    scope.countDown();
                }
            })
            scope.getDisplay = function (t) {
                if (t >= 0) {
                    scope.d = scope.fmtTimeStr(Math.floor(t / 1000 / 60 / 60 / 24));
                    scope.h = scope.fmtTimeStr(Math.floor(t / 1000 / 60 / 60 % 24));
                    scope.m = scope.fmtTimeStr(Math.floor(t / 1000 / 60 % 60));
                    scope.s = scope.fmtTimeStr(Math.floor(t / 1000 % 60));
                }
            };
            scope.countDown = function () {
                //如果时间不是整秒,需要先延时非整秒的时间再开始倒计时
                if (timeLeft % 1000 > 0) scope.getDisplay(timeLeft + 1000);
                timeLeft -= timeLeft % 1000;
                //等待整秒开始倒计时
                $timeout(function () {
                    if (timer) {
                        $interval.cancel(timer);
                        timer = null;
                    }
                    scope.getDisplay(timeLeft)
                    //循环算值
                    timer = $interval(function () {
                        scope.getDisplay(timeLeft -= 1000)
                        if (timeLeft == 0) {
                            scope.showCountDown = false;
                            scope.$emit('changeShow', {
                                show: false
                            }); //把值传递出去
                            $interval.cancel(timer)
                            if (typeof scope.callback == 'function') {
                                scope.callback();
                            }
                        }
                    }, 1000)
                }, timeLeft % 1000)
            };
            scope.fmtTimeStr = function (t) {
                return t >= 10 ? t : "0" + t;
            }
        }
    }
}])
//结算页弹框组件调用
.directive("settleTips", ['$window',function ($window) {
    return {
        template: '<div class="bg-modal" ng-if="settleData.settleShow">' +
            '   <div id="settle">' +
            '       <div class="settle-title">' +
            '           {{i18n("提示")}}<span class="settle-close" ng-click="close()"></span>' +
            '       </div>' +
            '       <div class="settle-container">' +
            '           <p class="settle-tips" ng-if="settleData.settleTips">{{settleData.settleTips}}</p>' +
            '           <div class="settle-goods" ng-if="settleData.settleGoods">' +
            '               <p class="settle-msg" ng-if="settleData.settleMsg">{{settleData.settleMsg}}</p>' +
            '               <ul>' +
            '                   <li ng-repeat="good in settleData.settleGoods">' +
            '                       <img ng-src="{{good.imgUrl}}" width="100" height="100" alt="">' +
            '                       <div class="goods-detail">' +
            '                           <div class="goods-name">{{good.name}}</div>' +
            '                           <div class="goods-series">{{good.series}}</div>' +
            '                       </div>' +
            '                   </li>' +
            '               </ul>' +
            '           </div>' +
            '           <div class="settle-btn">' +
            '               <button ng-repeat="btn in settleData.buttons" ng-click="btn.callback()">{{btn.name}}</button>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '</div>',
        transclude: true,
        scope: {
            settleData: "="
        },
        link: function (scope, elem, attrs) {
            scope.i18n = function (key) {
                return $window.i18n ? $window.i18n(key) : key;
            };
            scope.close = function () {
                scope.settleData.settleShow = false;
            }
        }
    }
}])
//咨询弹框， 比如商品咨询和问大家的我要提问
.directive("goodDetailBomb", ['$rootScope','$window', function ($rootScope,$window) {
    return {
        template: '<div class="consultation-bigBomb" ng-if="questionData.bombShow">' +
            '    <div class="consultation-Bomb">' +
            '        <div class="bomb-title clearfix">' +
            '            <span class="title-text">{{i18n("提示")}}</span>' +
            '            <span ng-click="closeQuestion()" class="close-img"></span>' +
            '        </div>' +
            '        <div class="bomb-main">' +
            '            <div ng-if="questionData.selectDiv" class="main-title">' +
            '                <span class="main-text">{{i18n("咨询类型")}}</span>' +
            '                <select ng-model="selectValue" ng-change="selectedChange(selectValue)" name="" id="selectDetectUnit">' +
            '                    <option value="" style="display:none">{{i18n("请选择")}}</option>' +
            '                    <option ng-repeat="v in ConsultationText" value="{{v.id}}">{{v.name}}</option>' +
            '                </select>' +
            //'                <span class="close-icon"></span>' +
            '            </div>' +
            '            <div ng-if="questionData.textDiv" class="top-text">' +
            '                <span>{{i18n("您的问题将推送给已购用户")}}，TA{{i18n("们会帮您解答")}}</span>' +
            '            </div>' +
            '            <div class="textarea-box">' +
            '                <textarea maxlength=500 ng-model="textData" id="text" name="" placeholder="{{i18n(\'请输入咨询内容\')}}"></textarea>' +
            '                <span class="text-num">{{i18n("还可以输入")}}{{500-textData.length}}{{i18n("个字")}}</span>' +
            '            </div>' +
            '            <div ng-if="questionData.buttons.length >0" class="main-bottom">' +
            '                <a ng-repeat="item in questionData.buttons" class="{{item.className}}" ng-click="item.callback(selectValue)" href="">{{item.name}}</a>' +
            '                <div class="chose-evaluate"><input ng-repeat="e in questionData.checked" checked type="checkbox" ng-model="e.isAvailableChecked" ng-click="e.chanceChecked()">' +
            '                    <span>{{i18n("匿名提问")}}</span>' +
            '                </div>' +
            '            </div>' +
            '        </div>' +
            '    </div>' +
            '</div>',
        scope: {
            questionData: "=",
            sendRequest:"@"
        },
        link: function (scope, element, attrs) {
            scope.i18n = function (key) {
                return $window.i18n ? $window.i18n(key) : key;
            };
            scope.closeQuestion = function () {
                scope.questionData.bombShow = false;
            };
            if(scope.sendRequest){
                var url = '/api/social/consultAppAction/getConsultTypeList.do';
                var params = {
                    currentPage: 1,
                    itemsPerPage: 10
                }
                $rootScope.ajax.postJson(url, params).then(function (res) {
                    if (res.code == 0 && res.data.listObj){
                        scope.ConsultationText = res.data.listObj;
                    }
                });
            }
            scope.selectedChange = function (v) {
                scope.questionData.typeId = v;
            }
        }
    }
}])
.directive("tipsPopup", [function () {
    return {
        template: '<div class="tips-popup">' +
            '    <div class="tips-title">' +
            '        <span class="tips-text">{{title}}</span>' +
            '        <span class="close-img"></span>' +
            '    </div>' +
            '    <div class="tips-main">' +
            '        <div class="tips-top">' +
            '            <span>{{mainText}}</span>' +
            '        </div>' +
            '        <div class="tips-button">' +
            '            <a ng-if="buttonOne" href="" class="button-one">{{buttonOne}}</a>' +
            '            <a ng-if="buttonTwo" href="" class="button-two">{{buttonTwo}}</a>' +
            '        </div>' +
            '    </div>' +
            '</div>',
        scope: {
            title: "@",
            mainText: "@",
            buttonOne: "@",
            buttonTwo: "@"
        }
    }
}])
.directive('ngEnter', [function () {
    return {
        require: '?ngModel',
        link: function ($scope, element, attrs, controller) {
            element.bind("keydown keypress", function (event) {
                if(event.which === 13) {
                    $scope.$apply(function (){
                        $scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
                }
            });
        }
    }
}])
//上传图片
.directive('pcUploadImage', ['Upload', function (Upload) {
    return {
        scope: {
            imageWidth: '@',
            imageHeight: '@',
            imageBorder: '@',
            defaultImage: '@',
            maxSize: '@', //通过属性值进行绑定，但是单向的，即外界控制器可以把值传进来供内部使用，但内部对这个属性值进行修改时不会影响到外部的；
            imageUrl: '=', //通过属性进行双向数据绑定，内外变化会保持一致；&： 调用父级作用域中的方法（function）；
            imagePattern: '@',
            isShowDelete: '@'
        },
        template: '<img width="{{imageWidth}}" height="{{imageHeight}}" border="{{imageBorder}}" ng-src="{{imageUrl?imageUrl: defaultImage}}" ngf-select="uploadImage()" ngf-max-size="maxSize" ngf-pattern="imagePattern" accept="{{imagePattern}}" ng-model="uploadImageUrl">' +
            '<span class="delete-image" ng-show="isShowDelete && imageUrl" ng-click="deleteImage()"></span>',
        link: function (scope, element, attrs) {
            scope.uploadImageUrl = '';
            //为了显示删除按钮添加样式
            if (scope.isShowDelete) {
                element.parent().attr('style','position: relative;');
            }

            //上传图片
            scope.uploadImage = function () {
                if (!this.uploadImageUrl) {
                    return;
                }
                Upload.upload({
                    url: "/api/fileUpload/putObjectWithForm", //图片上传接口的url
                    data: {
                        file: this.uploadImageUrl
                    }
                }).success(function (res) {
                    if (res.code == 0) {
                        scope.imageUrl = res.data.filePath;
                    }
                }).error(function (res) {
                });
            },
            //删除图片
            scope.deleteImage = function(){
                scope.imageUrl = '';
                scope.uploadImageUrl = '';
            }
        }
    }
}])
//多图片上传图片， 限制长度
.directive('pcUploadMoreImage', ['Upload','$window','$rootScope', function (Upload,$window,$rootScope) {
    return {
        scope: {
            imageWidth: '@',
            imageHeight: '@',
            maxSize: '@',
            imageUrlList: '=',
            imageMaxLength: '=',
            imagePattern: '@',
            isShowDelete: '@',
            isShowTip: '@',
            isShowSmallTip: '@',
            addClass: '@'
        },
        template: '<div class="item-img-box pull-left {{addClass}}" ng-repeat="img in imageUrlList track by $index">' +
            '    <img width="{{imageWidth}}" height="{{imageHeight}}" ng-src="{{img}}">' +
            '    <span class="delete-image" ng-if="isShowDelete" ng-click="deleteImage($index)"></span>' +
            '</div>' +
            '<div class="pull-left {{addClass}}" ng-if="imageUrlList.length < imageMaxLength" ngf-select="uploadMoreImage($file,$invalidFiles)" ngf-max-size="5MB" ngf-pattern="imagePattern" accept="{{imagePattern}}" ng-model="uploadImageUrl">' +
            '    <img src="../images/photo.png" width="{{imageWidth}}" height="{{imageHeight}}">' +
            '</div>' +
            '<div class="camear-text pull-left mgL10" ng-if="isShowTip">' +
            '    <span class="tip" ng-style="{lineHeight: imageHeight + \'px\'}">{{i18n("共")}}<b class="colorA">{{imageUrlList.length}}</b>{{i18n("张")}},{{i18n("还能上传")}}<b class="colorC">{{imageMaxLength-imageUrlList.length}}</b>{{i18n("张")}}</span>' +
            '</div>' +
            '<div class="camear-text pull-left mgL10" ng-if="isShowSmallTip">' +
            '    <span class="tip" ng-style="{lineHeight: imageHeight + \'px\'}">{{imageUrlList.length}}/{{imageMaxLength}}</span>' +
            '</div>',
        link: function (scope, element, attrs) {
            scope.i18n = function (key) {
                return $window.i18n ? $window.i18n(key) : key;
            };
            scope.uploadImageUrl = '';
            if (!scope.imageUrlList) {
                scope.imageUrlList = [];
            }
            //上传图片
            scope.uploadMoreImage = function (file,invalidFiles) {
                if (invalidFiles && invalidFiles.length && invalidFiles[0].$error == 'maxSize') {
                    $rootScope.error.checkCode(scope.i18n('提示'),scope.i18n('该图片超出最大尺寸限制，请重新上传'))
                    return
                }
                if (!this.uploadImageUrl) {
                    return;
                }
                Upload.upload({
                    url: "/api/fileUpload/putObjectWithForm", //图片上传接口的url
                    data: {
                        file: this.uploadImageUrl
                    }
                }).success(function (res) {
                    if (res.code == 0) {
                        scope.imageUrlList.push(res.data.filePath);
                    }
                }).error(function () {
                });
            },
            //删除图片
            scope.deleteImage = function(idx){
                scope.imageUrlList.splice(idx, 1);
            }
        }
    }
}])
//多图片上传图片， 限制长度
.directive('checkCodeTip', [function () {
    return {
        scope: {
            errorMessageTip: '=',
            error: '=',
            isIE: '=',
            btnClass: '@',
            errorInfo: '='
        },
        template: '<div class="modal" ng-style="{display:errorMessageTip.config.display?\'block\':\'none\',\'z-index\':9999}">' +
            '    <div class="dialog {{errorMessageTip.config.size||\'sm\'}}" name="delConfirmDialog" ng-class="{\'notie\':!isIE}" ng-style="{display:errorMessageTip.config.display?\'block\':\'none\'}">' +
            '        <a href="javascript:void(0);" target="_self" class="dialog-close" ng-class="{\'dialog-close-ie\':isIE,\'dialog-close-notie\':!isIE}"' +
            '            ng-show="errorMessageTip.config.close&&!errorMessageTip.config.btnGoBack" ng-click="error.closeTip()">&times;</a>' +
            '        <div class="dialog-content">' +
            '            <div class="dialog-header" ng-class="{\'dialog-header-notie\':!isIE}">' +
            '                <h5 class="dialog-title">{{errorMessageTip.config.title}}</h5>' +
            '            </div>' +
            '            <div class="dialog-body" ng-show="!errorMessageTip.config.isHtml">' +
            '                {{errorMessageTip.config.message}}' +
            '            </div>' +
            '            <div class="dialog-body" ng-include="errorMessageTip.config.message" ng-if="errorMessageTip.config.isHtml"></div>' +
            '            <div class="dialog-footer">' +
            '                <button type="button" class="{{btnClass}} ok" ng-show="errorMessageTip.config.btnOK" ng-click="errorMessageTip.config.ok()">{{errorMessageTip.config.btnOKText}}' +
            '                </button>' +
            '                <button type="button" class="{{btnClass}} cancel" ng-show="errorMessageTip.config.btnCancel" ng-click="errorMessageTip.config.cancel()">{{errorMessageTip.config.btnCancelText}}' +
            '                </button>' +
            '                <button type="button" class="{{btnClass}} ok" ng-show="errorMessageTip.config.btnGoBack" ng-click="errorMessageTip.config.goBack(errorMessageTip.config.btnGoBackUrl)">' +
            '                    {{errorMessageTip.config.btnGoBackText}}' +
            '                </button>' +
            '            </div>' +
            '        </div>' +
            '    </div>' +
            '</div>',
        link: function (scope, element, attrs) {
        }
    }
}])
.directive('cartCheckCodeTip', [function () {
    return {
        scope: {
            errorMessageTip: '=',
            error: '=',
            isIE: '=',
            btnClass: '@',
            errorInfo: '='
        },
        template: '<div class="modal" ng-style="{display:errorMessageTip.config.display?\'block\':\'none\'}">' +
            '    <div id="cart-dialog" class="dialog" name="delConfirmDialog" ng-class="{\'notie\':!isIE}" ng-style="{display:errorMessageTip.config.display?\'block\':\'none\'}">' +
            '        <a href="javascript:void(0);" target="_self" class="dialog-close" ng-class="{\'dialog-close-ie\':isIE,\'dialog-close-notie\':!isIE}" ' +
            '            ng-show="errorMessageTip.config.close&&!errorMessageTip.config.btnGoBack" ng-click="error.closeTip()">&times;</a>' +
            '        <div class="dialog-content">' +
            '            <div class="dialog-header" ng-class="{\'dialog-header-notie\':!isIE}">' +
            '                <h5 class="dialog-title">{{errorMessageTip.config.title}}</h5>' +
            '            </div>' +
            '            <div class="dialog-body" ng-if="!errorMessageTip.config.htmlMsg">' +
            '                {{errorMessageTip.config.message}}' +
            '            </div>' +
            '            <div class="dialog-body" ng-bind-html="errorMessageTip.config.message" ng-if="errorMessageTip.config.htmlMsg"></div>' +
            '            <div class="dialog-footer">' +
            '                <button type="button" class="{{btnClass}} cancel" ng-show="errorMessageTip.config.btnCancel" ng-click="errorMessageTip.config.cancel()">' +
            '                {{errorMessageTip.config.btnCancelText}}' +
            '                </button>' +
            '                <button type="button" class="{{btnClass}} ok" ng-show="errorMessageTip.config.btnOK" ng-click="errorMessageTip.config.ok()">{{errorMessageTip.config.btnOKText}}' +
            '                </button>' +
            '                <button type="button" class="{{btnClass}} ok" ng-show="errorMessageTip.config.btnGoBack" ng-click="errorMessageTip.config.goBack(errorMessageTip.config.btnGoBackUrl)">' +
            '                {{errorMessageTip.config.btnGoBackText}}' +
            '                </button>' +
            '            </div>' +
            '        </div>' +
            '    </div>' +
            '</div>',
        link: function (scope, element, attrs) {
        }
    }
}])
.directive('pcPlaceholder', ['$window',function ($window) {
    return {
        require: '?^ngModel',
        link: function (scope, element, attr) {
            var scope = scope && scope.$new();
            scope.i18n = function (key) {
                return $window.i18n ? $window.i18n(key) : key;
            };
            var validateClass = attr['validateClass'];
            if ('placeholder' in document.createElement('input')) {
                return;
            }
            var _class = element.attr('class');
            var _id = element.attr('id');
            var _style = element.attr('style');
            var elName = element[0].tagName;
            var tip;
            var copyElement, classFlag;
            element.attr('placeholder', '');
            function load() {
                if (elName === 'INPUT') {
                    classFlag = 'copy' + Math.floor(Math.random() * 1000000);
                    element.after("<input class='copy " + classFlag + " " + validateClass + " " + _class + "' id='" + _id + "' style='color:#999;" + _style + "' value='" + tip + "' />");
                    copyElement = $("." + classFlag);
                    scope.init();
                } else if (elName === 'TEXTAREA') {
                    classFlag = 'copy' + Math.floor(Math.random() * 1000000);
                    element.after("<textarea rows=" + attr.rows + " class='copy " + classFlag + " " + _class + "' id='" + _id + "' style='color:#999;" + _style + "' /></textarea>");
                    copyElement = $("." + classFlag);
                    copyElement.val(tip);
                    //指令兼容活动页面,此处select无法监听
                    if (CommonFun.getUrlPara() === 'create') {
                        if (scope.ngModel && (scope.ngModel.type === scope.i18n('单行文本') || scope.ngModel.type === scope.i18n('多行文本'))) {
                            element.hide();
                            copyElement.hide();
                        }
                        $('select').change(function () {
                            if ($(this).val() === 0 || $(this).val() === 1) {
                                // element.hide();
                                copyElement.hide();
                            } else {
                                copyElement.show();
                                element.hide();
                                copyElement.focus(function () {
                                    copyElement.hide();
                                    element.show();
                                    element.trigger('focus');
                                });
                                element.blur(function () {
                                    if (element.val() === "") {
                                        copyElement.show();
                                        element.hide();
                                    }
                                });
                            }
                        });
                    } else {
                        scope.init();
                    }
                }
            }

            //指令兼容活动页面
            if (scope.ngModel && scope.ngModel.tip !== undefined && scope.ngModel.tip !== null && scope.ngModel.tip !== '' && CommonFun.getUrlPara() !== 'create') {
                tip = scope.ngModel.tip;
            } else if (scope.ngModel && scope.ngModel.tip === '') {
                tip = '';
            } else {
                attr.$observe('placeholder', function (newV) {
                    tip = newV;
                    load();
                });
            }

            scope.init = function () {
                copyElement.show();
                element.hide();
                //监听input值状态
                scope.$watch(function () { return element.val(); }, function (newV) {
                    if (newV !== null && newV !== undefined && newV.trim() !== "") {
                        copyElement.hide();
                        element.show();
                    } else {
                        copyElement.show();
                        element.hide();
                    }
                });
                copyElement && copyElement.focus(function () {
                    copyElement.hide();
                    element.show();
                    element.trigger('focus');
                });
                element.blur(function () {
                    if (element.val() === "") {
                        copyElement.show();
                        element.hide();
                    }
                });

            };
        }
    };
}])
.directive('headMenu', ['$rootScope','$window', function ($rootScope,$window) {
    return {
        // href="{{head.linkUrl}}"
        template: '<li class="pdL20"><a target="_blank"  href="/index.html">{{i18n("首页")}}</a><i class="op-icons op-icons-new"></i></li>' +
            // 取cms配置的广告位
            // '<li class="pdL20"><a target="_blank"  href="/consumableProducts.html">{{i18n("耗材查找")}}</a></li>'+
            // '<li class="pdL20"><a target="_blank"  href="/home.html#/advanceOrder">{{i18n("预置订单")}}</a></li>'+
            // '<li class="pdL20"><a target="_blank"  href="/help.html">{{i18n("帮助中心")}}</a></li>'+
            '<li ng-repeat="head in headList track by $index" ng-class="{isshowGuide:head.name==isshowGuide}"><a target="_blank" ng-click="goUrl(head)">{{head.title}}</a>'+
            ' <ul class="major-guide-tab" style="position:absolute;left:-116px;top:44px" ng-if="head.name==isshowGuide"><li class="tab" style="margin:0;box-sizing:border-box" ng-class="{active:$index>=5}" ng-click="goToGuide($index)" ng-repeat="item in majorGuideList track by $index" ng-show="$index<=9">'+
            '<div><p class="guide_name">{{item.title}}</p><img ng-src="{{item.imageUrl}}" style="width:162px;height:56px"></div>'
            +'</li></ul>'
            +'</li>'+
            '<li class="pdL20" ng-if="isAdmin == 1" ><a target="_blank"  href="/costCenter.html">{{i18n("成本中心")}}</a></li>',
        scope: {
            moduleName: "@",
            pageCode: "@"
        },
        link: function (scope, element, attrs) {
            $rootScope.currentHeadName = $rootScope.util.cookie.getCookie('currentHeadName')
            scope.isshowGuide = '专业导购'
            scope.i18n = function (key) {
                return $window.i18n ? $window.i18n(key) : key;
            };
            if (!scope.pageCode) {
                scope.pageCode = 'HOME';
            }
            var url = '/ad-whale-web/dolphin/getAdSource',
                params = {
                    pageCode:scope.pageCode,
                    adCode:scope.moduleName,
                    platform:1,
                    companyId:$rootScope.companyId
                };
            $rootScope.ajax.get(url, params).then(function (res) {
                scope.headList = [];
                if (res.data) {
                    scope.headList = res.data[scope.moduleName];
                }
            })

            //是否是管理员，如果是显示‘成本中心’
            scope.isAdmin = 0
            scope.getIsAdmin = function() {
                const url = "/custom-sbd-web/user/getUserDetail.do";
                $rootScope.ajax.postJson(url).then(res => {
                    if(res.code == 0){
                        scope.isAdmin = res.data.isAdmin
                    }
                })
            }
            scope.getIsAdmin()

            // 跳转工业品
            scope.goUrl = function(head) {
                // if (head.name == $rootScope.currentHeadName) {
                //     return
                // }
                if (head.name == '工业品') {
                    if (location.pathname == '/industrialProducts.html') {
                        return
                    }
                    $rootScope.showIndustrialModel2 = true
                    $rootScope.IndustrialAuthCode.ownerIndustrialAuthCode = null
                } else if (head.name == '专业导购') {
                    return
                } else if (head.name == '耗材查找') {
                    if (location.pathname == '/consumableProducts.html') {
                        return
                    }
                    location.href = head.linkUrl
                } else {
                    // $rootScope.util.cookie.setCookie('currentHeadName',head.name);
                    location.href = head.linkUrl
                }
            }
            // 跳转专业导购
            scope.goToGuide = function(index) {
                location.href = '/major-guide.html?tab=' + index
            }
            // var params2 = {
            //     pageCode: 'HOME',
            //     adCode: 'index_major_guide',
            //     platform:1,
            //     companyId:$rootScope.companyId
            // }
            // $rootScope.ajax.get(url,params2).then(function(res) {
            //     scope.majorGuideList = []
            //     if (res.code ==0) {
            //         scope.majorGuideList = res.data.index_major_guide || []
            //     }
            // })
        }
    }
}])
.directive("datetimepicker", ['$compile','$filter', function ($compile,$filter) {
    return {
        restrict: "A",   //指令作用范围是element或attribute
        require: "ngModel",  //控制器是指令标签对应的ngModel
        scope: {
            close: '&',
            minDate:'=',
            maxDate:'=',
            options:"=",
            id:'@forId'
        },

        link: function (scope, element, attrs, ctrl) {
            if(!ctrl) return;
            var ready=false;
            var idSelector="#"+scope.id;
            var topH = 0, topM = 0, topS = 0;
            //var history='';
            var title = $("<div>").addClass("prev-btns title").append($("<div class='xdsoft_prev'>h</div><div class='xdsoft_prev'>m</div><div class='xdsoft_prev'>s</div>"));
            var prevs = $("<div>").addClass("prev-btns").append($("<div class='xdsoft_prev p1'></div><div class='xdsoft_prev p2'></div><div class='xdsoft_prev p3'></div>"))
            var nexts = $("<div>").addClass("next-btns").append($("<div class='xdsoft_next n1'></div><div class='xdsoft_next n2'></div><div class='xdsoft_next n3'></div>"))
            var times = $('<div class="xdsoft_time_box xdsoft_scroller_box"></div>')
            var hour = $('<div class="xdsoft_time_variant hour"></div>').css({
                "width": '18px',
                "float": "left"
            });
            var minute = $('<div class="xdsoft_time_variant minute"></div>').css({
                "width": '18px',
                "float": "left"
            });
            var second = $('<div class="xdsoft_time_variant second"></div>').css({
                "width": '18px',
                "float": "left"
            });
            for (var i = 0; i < 60; i++) {
                if (i < 24) hour.append('<div class="xdsoft_time">' + (i < 10 ? ('0' + i) : i) + '</div>');
                minute.append('<div class="xdsoft_time">' + (i < 10 ? ('0' + i) : i) + '</div>');
                second.append('<div class="xdsoft_time">' + (i < 10 ? ('0' + i) : i) + '</div>');
            }
            times.append(hour, minute, second);
            function getHeight(selector){
                return Math.abs(parseInt(selector.css('height'),10))
            }
            function n(selector,top,that){
                var height=getHeight($(selector));
                var parentHeight=getHeight($(selector).parent())-1
                top = top||Math.abs(parseInt($(that).css('marginTop'), 10));
                $(selector).css('margin-top', top=top>parentHeight-height?top-parentHeight:parentHeight-height);
                return top;
            }
            function p(selector,top,that){
                var height=getHeight($(selector));
                var parentHeight=getHeight($(selector).parent())-1
                top = top||Math.abs(parseInt($(that).css('marginTop'), 10));
                $(selector).css('margin-top', top=top>-parentHeight?0:top+parentHeight);
                return top;
            }
            function bindEvent(id) {
                $(id + ' .n1').on('click', function () {
                    topH = n(id + ' .hour', topH, this);
                })
                $(id + ' .p1').on('click', function () {
                    topH = p(id + ' .hour', topH, this);
                })

                $(id + ' .n2').on('click', function () {
                    topM = n(id + ' .minute', topM, this);
                })
                $(id + ' .p2').on('click', function () {
                    topM = p(id + ' .minute', topM, this);
                })

                $(id + ' .n3').on('click', function () {
                    topS = n(id + ' .second', topS, this);
                })
                $(id + ' .p3').on('click', function () {
                    topS = p(id + ' .second', topS, this);
                })
                //时分秒选择
                $(id + ' .hour').off('click').on("click", function (event) {
                    selectTime(event, /\s\d{2}:/, ' ' + $(event.target).text() + ':')
                })
                $(id + ' .minute').off('click').on("click", function (event) {
                    selectTime(event, /:\d{2}:/, ':' + $(event.target).text() + ':')
                })
                $(id + ' .second').off('click').on("click", function (event) {
                    selectTime(event, /:\d{2}$/, ':' + $(event.target).text());
                })
            }
            //时间选择
            var selectTime=function(event,o,r){
                if(!ctrl.$modelValue) {
                    $(element).val($filter('date')(new Date(),'yyyy/MM/dd hh:mm:ss'))
                }
                $(event.target).siblings().removeClass('xdsoft_current');
                $(event.target).addClass('xdsoft_current');
                $(element).val($(element).val().replace(o,r));
                $(element).change();
            }
            var execute=function(type){
                if(scope.minDate) scope.options.minDate=scope.minDate;
                if(scope.maxDate) scope.options.maxDate=scope.maxDate;
                if (type == 'start' && !scope.minDate) {
                    scope.options.minDate = false
                }
                if (type == 'end' && !scope.maxDate) {
                    scope.options.maxDate = false
                }
                scope.options.onGenerate = function () {
                    if(!ready) {
                        $('.xdsoft_datetimepicker:visible').attr('id', scope.id);
                        $(idSelector+' .xdsoft_timepicker>*').remove();
                        $(idSelector+' .xdsoft_timepicker').prepend(prevs).prepend(title).append(times).append(nexts);
                        ready = true;
                        //绑定事件
                        bindEvent(idSelector);
                    }
                }
                $(element).datetimepicker(scope.options);
            }
            $(element).on('change', function () {          //注册onChange事件，设置viewValue
                scope.$apply(function () {
                    ctrl.$setViewValue($(element).val());
                });
            });
            $(element).on('click', execute);

            scope.$watch(ctrl.$modelValue, function (n, o) {
                if (n && n != o) ctrl.$setViewValue(n);
            });
            scope.$watch('minDate',function(){
                execute('start');
            })

            scope.$watch('maxDate',function(){
                execute('end');
            })
        }
    }
}])
//意见反馈
.directive("feedbackBomb", ['$rootScope', '$window',function ($rootScope, $window) {
    return {
        template: '<div class="consultation-bigBomb" ng-if="feedbackData.bombShow">' +
            '    <div class="consultation-Bomb">' +
            '        <div class="bomb-title clearfix">' +
            '            <span class="title-text">{{feedbackData.bombName}}</span>' +
            '            <span ng-click="closeQuestion()" class="close-img"></span>' +
            '        </div>' +
            '        <div class="bomb-main">' +
            '            <div ng-if="feedbackData.textDiv" class="top-text">' +
            '                <span>{{feedbackData.textDiv}}</span>' +
            '            </div>' +
            '            <div class="textarea-box" ng-repeat="itemData in feedbackData.modelData">' +
            '               <span class="title">{{itemData.label}}</span>' +
            '               <div ng-if="itemData.type==\'textarea\' || itemData.type==\'input\'">' +
            '                   <div class="textarea-box">' +
            '                       <textarea ng-model="itemData.content" placeholder="{{itemData.placeholder}}" pc-placeholder="{{itemData.placeholder}}" maxlength="{{itemData.maxLength}}" ng-if="itemData.type==\'textarea\'"></textarea>' +
            '                       <input ng-model="itemData.content" placeholder="{{itemData.placeholder}}" pc-placeholder="{{itemData.placeholder}}" maxlength="{{itemData.maxLength}}" ng-if="itemData.type==\'input\'">' +
            '                       <span class="text-num">{{itemData.content.length}}/{{itemData.maxLength}}</span>' +
            '                   </div>' +
            '                   <span class="error-num" ng-if="itemData.errorTip">{{itemData.errorTip}}</span>' +
            '               </div>' +
            '               <div ng-if="itemData.type==\'imgCaptcha\' && itemData.checkImage">' +
            '                   <div class="textarea-box clearfix">' +
            '                       <input ng-model="itemData.content" placeholder="{{itemData.placeholder}}" pc-placeholder="{{itemData.placeholder}}" maxlength="{{itemData.maxLength}}" class="enter-aptcha">' +
            '                       <div class="phone-code">' +
            '                          <img width="100" height="40" class="img-captcha" id="img-captcha" ng-src="{{itemData.checkImage}}" ng-click="itemData.callbackFun()">' +
            '                          <a href="javascript:void(0)" class="change" ng-click="itemData.callbackFun()">{{i18n(\'看不清换一张\')}}</a>' +
            '                       </div>' +
            '                   </div>' +
            '                   <span class="error-num" ng-if="itemData.errorTip">{{itemData.errorTip}}</span>' +
            '               </div>' +
            '            </div>' +
            '            <div ng-if="feedbackData.buttons.length >0" class="main-bottom">' +
            '                <a ng-repeat="item in feedbackData.buttons" class="{{item.className}}" ng-click="item.callback()" href="">{{item.name}}</a>' +
            '            </div>' +
            '        </div>' +
            '    </div>' +
            '</div>',
        scope: {
            feedbackData: "=",
            sendRequest:"@"
        },
        link: function (scope, element, attrs) {
            scope.i18n = function (key) {
                return $window.i18n ? $window.i18n(key) : key;
            };
            scope.closeQuestion = function () {
                scope.feedbackData.bombShow = false;
            };
        }
    }
}])
//添加至预置订单弹框
.directive('addAdvanceOrder',['$rootScope', '$window',function ($rootScope,$window) {
    return{
        template:`<div class="arrival-main" ng-show="prod.advanceShow && totalCount > 0">
        <div class="arrival-bomb" style="width: 555px;">
            <div class="arrival-title clearfix">
                <div class="title-left">
                    <span>{{i18n('加入预置订单')}}</span>
                </div>
                <div class="title-right">
                    <span ng-click="advanceOrder.closeAdvance()" class="close-img"></span>
                </div>
            </div>
            <div class="arrival-main mgT20 mgL10 mgR20" id="advanceOrder">
                <div>
                    <ul class="input datetimepicker" style="margin-right: 0;">
                        <li>
                            <span>{{i18n('预置订单编号')}}</span>
                            <input type="text" name="" ng-model="advanceOrder.id">
                        </li>
                        <li>
                            <span>{{i18n('预置订单名称')}}</span>
                            <input type="text" name="" ng-model="advanceOrder.name">
                        </li>
                        <li class="mgT20">
                            <div class="datetimepicker">
                                <span class="date-title">{{i18n('创建时间')}}</span>
                                <div class="disIB datetimepicker-content" style="margin-left: 4px;">
                                    <div class="input-group">
                                        <input type="text" value="" class="timeiconbg date-time-picker-input" datetimepicker for-id="logListModalFrom" options="options1" close="close(from)" max-date="advanceOrder.createTimeEnd"
                                                ng-model="advanceOrder.createTimeStart">
                                        <span class="input-group-addon">至</span>
                                        <input type="text" value="" class="timeiconbg date-time-picker-input" datetimepicker for-id="logListModalTo" options="options2" close="close(to)" min-date="advanceOrder.createTimeStart"
                                                ng-model="advanceOrder.createTimeEnd">
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <p class="operation mgT20 bb pdB20">
                        <button class="search mgR5" ng-click="advanceOrder.getOrderList()">{{i18n('查询')}}</button>
                    </p>
                    <div class="evaluate-list mgT20">
                        <a class="car-color mgB10 my-advance disIB" href="javascript:void(0)" ng-click="advanceOrder.goto()">+{{i18n('创建预置订单')}}</a>
                        <div class="list-title list-titleColor">
                            <span class="w10"><input type="checkbox" ng-click="advanceOrder.allCheckbox()" ng-model="advanceOrder.allCheck"></span>
                            <span class="w30">{{i18n('预置订单编号')}}</span>
                            <span class="w30">{{i18n('预置订单名称')}}</span>
                            <span class="w30">{{i18n('创建日期')}}</span>
                        </div>
                        <div class="order-group">
                            <div ng-if="advanceOrder.advanceList.length>0">
                                <table class="order-list all-table-color w100">
                                    <tr ng-repeat="item in advanceOrder.advanceList track by $index">
                                        <td align="center" class="bb bl w10">
                                            <input type="checkbox" ng-model="item.checked" ng-change="advanceOrder.change(item)">
                                        </td>
                                        <td align="center" class="bb w30">
                                            <!-- #/advanceDetailOrder?id={{item.id}} -->
                                            <div class="c0066c">{{item.id}}</div>
                                        </td>
                                        <td align="center" class="bb w30">
                                            <div class="w160 ui-nowrap">{{item.name}}</div>
                                        </td>
                                        <td valign="top" align="center" class="bb br w30">
                                            {{item.createTime.time | date : 'yyyy-MM-dd'}}
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <div class="none-order align-center" ng-if="advanceOrder.advanceList.length == 0">
                                <div class="none-right">
                                    <span>{{i18n('暂无数据')}}</span>
                                </div>
                            </div>
                        </div>
                        <!-- 页码 -->
                        <div advance-pagination page-size="pageSize" page-no="advancePageNo" total-count="totalCount"
                            total-page="totalPage"></div>
                    </div>
                    <div class="clear"></div>
                    <div class="button-sure">
                        <a ng-click="advanceOrder.addAdvance()" href="">{{i18n('加入')}}</a>
                        <a class="my-cancel mgL5" ng-click="advanceOrder.closeAdvance()" href="">{{i18n('取消')}}</a>
                    </div>
                </div>
            </div>
        </div>
    </div>`,
        scope: {
            prod: '=',
            prodList: '='
        },
        link:function (scope) {

            scope.i18n = function (key) {
                return $window.i18n ? $window.i18n(key) : key;
            };
            // scope.advanceShow = false;

            //初始化翻页, 切换tab的时候也会初始化分页
            scope.initPagination = function () {
                scope.advancePageNo = 1;
                scope.pageSize = 10;
                scope.totalCount = 0;
            };
            scope.initPagination();
            //翻页广播接收
            scope.$on('advanceChangePageNo', function (event, data) {
                "use strict";
                scope.advancePageNo = data;
                scope.advanceOrder.getOrderList();
            })
            // 时间组件
            scope.options1= {
                format:'Y-m-d',
                lang:'zh',
                timepickerScrollbar:false,
                timepicker:false,
                scrollInput:false,
                scrollMonth:false,
                scrollTime:false
            }
            scope.options2= {
                format:'Y-m-d',
                lang:'zh',
                timepickerScrollbar:false,
                timepicker:false,
                scrollInput:false,
                scrollMonth:false,
                scrollTime:false
            };
            scope.advanceOrder = {
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
                    location.href = '/home.html#/advanceCreateOrder?code=' + ($rootScope.addNewprodList && $rootScope.addNewprodList.code || scope.prod.code || '') + '&num=' + ($rootScope.addNewprodList && $rootScope.addNewprodList.amount || 1);
                },
                getOrderList: function(data){
                    "use strict";
                    var that = this;
                    var url = '/custom-sbd-web/sbdOrder/queryOrderTemplateList.do';
                    var params = {
                        offset: scope.advancePageNo -1 ,
                        limit: scope.pageSize,
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
                            scope.totalCount = res.result.total;

                            if (!!scope.prod.code) {
                                $rootScope.addNewprodList = scope.prod
                            }else {
                                $rootScope.addNewprodList = null
                            }

                            if (scope.totalCount == 0) {

                                if ($rootScope.addNewprodList) {
                                    location.href = '/home.html#/advanceCreateOrder?code=' + $rootScope.addNewprodList.code + '&num=' + $rootScope.addNewprodList.amount;
                                }else{
                                    location.href = '/home.html#/advanceCreateOrder'
                                }

                            }
                            scope.totalPage = scope.totalCount % scope.pageSize == 0 ? ((scope.totalCount / scope.pageSize) || 1) : parseInt(scope.totalCount / scope.pageSize) + 1;
                        }else{
                            $rootScope.error.checkCode(scope.i18n('提示'),scope.i18n(res.result));
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
                closeAdvance: function(prod){
                    scope.prod.advanceShow = false;
                    scope.initPagination();
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
                        $rootScope.error.checkCode(scope.i18n('提示'),scope.i18n('请先选择预置订单编号'));
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

                    var items2 = [];

                    if ($rootScope.addNewprodList) {
                        items2.push({ "mpCode": $rootScope.addNewprodList.code, "num": $rootScope.addNewprodList.amount});
                    }else{
                        angular.forEach(scope.prodList,function(ele){
                            items2.push({"mpCode": ele.mpCode,"num":ele.num})
                        })
                    }

                    var params2 = {
                        soTemplateIds: list,
                        items: items2
                    };
/**
                    if (scope.prodList.length >0) {
                        var items = []
                        angular.forEach(scope.prodList,function(ele){
                            items.push({"mpCode": ele.mpCode,"num":ele.num})
                        })
                        var params = {
                            soTemplateIds :list,
                            items :items
                        }
                    } else {
                        var params = {
                            soTemplateIds :list,
                            items :[{"mpCode": scope.prod.code,"num":1}],
                        }
                    }
 **/
                    $rootScope.ajax.postJson(url, params2).then(function (res) {
                        if (res.code == 0) {
                            $rootScope.error.checkCode(scope.i18n('提示'),scope.i18n('添加成功'));
                            that.closeAdvance();
                        }else{
                            $rootScope.error.checkCode(scope.i18n('提示'),scope.i18n(res.result));
                        }
                    });
                }
            };
            scope.$watch('prod.advanceShow',function(val){
                val && scope.advanceOrder.getOrderList()
            })
        }
    }

}])
.directive('selectTree', function() {
    return {
        template: `<div class="select-tree">
                    <input readonly="readonly" ng-model="treeInput" ng-click="expandTree()" class="select-tree-input" style="width:160px">
                    <div ng-hide="!showSelectTree" class="select-tree-div" ng-style="treeStyle">
                        <ul class="ztree"></ul>
                    </div>
                    </div>`,
        scope: {
            keyName: '=',
            data: '='
        },
        link: function(scope, elems, attrs) {
            scope.root = elems
            scope.showSelectTree = false
            scope.treeInput = ""

            scope.$watch('data', (newValue, oldValue) => {
                if(!scope.ztreeObj) {
                    return
                }
                newValue.forEach(d => {
                    let node = scope.ztreeObj.getNodeByParam('id', d.id)
                    scope.ztreeObj.checkNode(node, d.checked)
                })
                scope.updateInput()
            }, true)

            scope.updateInput = function() {
                let checkedNodes = scope.ztreeObj.getNodesByParam('checked', true)
                let checkedNodesStr = checkedNodes.map(node => node.costName).join(',')
                scope.treeInput = checkedNodesStr
            }

            scope.onCheck = function(event, treeId, treeNode) {
                scope.$apply(() => {
                    scope.data.find(d => d.id == treeNode.id).checked = treeNode.checked
                    scope.updateInput()
                })
            }

            scope.init = function() {
                if(scope.ztreeObj || !scope.data) {
                    return
                }
                scope.data.forEach(d => {
                    d.checked = false
                })
                let options = {
                    view: {
                        showIcon:false,
                        dblClickExpand: false,
                        showLine: false,
                        selectedMulti: false,
                        nameIsHTML: true,
                    },
                    check: {
                        enable: true,
                        chkStyle: "checkbox",
                        chkboxType: { "Y": "s", "N": "ps" },
                        autoCheckTrigger: true,
                    },
                    data: {
                        simpleData:{
                            enable: true,
                            idKey: "id",
                            pIdKey: "parentId",
                            rootPId: 0,
                        },
                        key:{
                            name: scope.keyName
                        },
                    },
                    callback:{
                        onCheck: scope.onCheck,
                    }
                }
                let el = scope.root.find('.ztree')
                scope.ztreeObj = $.fn.zTree.init(el, options, scope.data)
                $(document).bind('click', scope.hideTree)
            }

            scope.$on('$destroy', function() {
                scope.ztreeObj.destory()
                $(document).unbind('click', scope.hideTree)
            })

            scope.expandTree = function() {
                scope.init()
                let inputEl = scope.root.find('.select-tree-input')
                scope.treeStyle = {
                    left: inputEl.offsetLeft,
                    top: inputEl.offsetTop + inputEl.offsetHeight,
                }
                scope.showSelectTree = true
                scope.updateInput()
            }

            scope.hideTree = function(e) {
                let target = $(e.target)
                if(target.closest('.select-tree').length == 0) {
                    scope.$apply(()=>{
                        scope.showSelectTree = false
                    })
                }
            }

        }
    }
})
