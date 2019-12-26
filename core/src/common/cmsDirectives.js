angular.module('directives')
//魔方
.directive('pcCube', ["$cmsData", "$log", function ($cmsData, $log) {
    return {
        template: '<div class="w1200 cube-wrapper clearfix" id="module{{moduleId}}">' +
            '    <div class="cube-case" ng-style="{ width: data.width}">' +
            '        <div class="cube-item clearfix" ng-repeat="item in data.children" ng-style="{ float:item.float,width:item.width,height:item.height,\'margin-right\':item.marginRight,\'margin-bottom\':item.marginBottom}">' +
            '            <div ng-if="item.imgUrl" class="cube-img" ng-style="{float:item.float}" style="width: 100%;height: 100%">' +
            '                <a target="_blank" ng-href={{item.link.data}}>' +
            '                <img ng-src={{item.imgUrl}} alt="" >' +
            '                </a>' +
            '            </div>' +
            '            <div class=""  ng-if="item.children" >' +
            '                <div ng-repeat="itemc in item.children" class="cube-itemc" ng-style="{ float:itemc.float,width:itemc.width,height:itemc.height,\'margin-bottom\':itemc.marginBottom,\'margin-right\':itemc.marginRight}" style="overflow: hidden;">                                      ' +
            '                    <a target="_blank" ng-href={{itemc.link.data}}>' +
            '                        <img  ng-src={{itemc.imgUrl}} alt="">' +
            '                    </a>' +
            '                </div>' +
            '            </div>' +
            '        </div>' +
            '    </div>' +
            '</div>',
        scope: {
            moduleId: '@'
        },
        link: function ($scope) {
            if ($scope.moduleId) {
                var module = $cmsData[$scope.moduleId];
                if (module && module.vData) {
                    $scope.data = module.vData.cdata;
                }
            }
        }
    }
}])
//图片模板
.directive('pcMultipic', ["$cmsData", function ($cmsData) {
    return {
        template: '<div id="module{{moduleId}}" ng-class="{\'module-full\':vData.column==\'0\',\'module-nofull\':vData.column==\'1\'}">' +
            '    <a target="_blank" ng-href="{{vData.images.link.data}}">' +
            '        <img ng-src="{{vData.images.src}}" title="{{vData.images.desc}}"/>' +
            '    </a>' +
            '</div>',
        scope: {
            moduleId: '@'
        },
        link: function ($scope) {
            if ($scope.moduleId) {
                var module = $cmsData[$scope.moduleId];
                if (module && module.vData) {
                    $scope.vData = module.vData;
                }
            }
        }
    }
}])
//商品
.directive('pcGoods', ["$cmsData","$rootScope","$window",function ($cmsData, $rootScope,$window) {
    return {
        template: '<div class="w1200 pc-goods" id="module{{moduleId}}">' +
            '    <div class="mc-goods mc-activity" clearfix" ng-if="vData.col&&vData.col!=2&&vData.col!=6">' +
            '        <a href="item.html?itemId={{prod.mpId}}" class="hot h-border" ng-class="{first:$first}" ng-repeat="prod in dData.moduleDataList" title="{{prod.name}}">' +
            '            <div class="pic" style="width:{{1200/vData.col-41}}px;height:{{1200/vData.col-41}}px"><img width="{{1200/vData.col-41}}" height="{{1200/vData.col-41}}" ng-src="{{prod.picUrl || defaultImg}}"   alt="{{prod.name}}"></div>' +
            '            <p class="money" ng-if="prod.isBargain != 3">' +
            '                <span>{{prod.availablePrice | currency:\'￥\'}}</span>' +
            '            </p>' +
            '            <div class="s-price">' +
            // '               <img class="pro-icon" ng-repeat="proIcon in prod.promotionIconUrls track by $index" ng-src="{{proIcon}}" ng-if="$index <= 2"/>' +
            '                 <span class="pro-simulation-icon" ng-style="{background:\'#\'+ (proText.bgColor?proText.bgColor:\'f23030\'),\'color\' : \'#\'+ (proText.fontColor?proText.fontColor:\'fff\')}" ng-repeat="proText in prod.promotionIcon track by $index" ng-if="$index <=2">{{proText.iconText}}</span>' +
            '            </div>' +
            '            <h5 class="goods-name" ng-style="{\'width\':(1200/vData.col-41)}">{{prod.mpName}}</h5>' +
            '        </a>' +
            '    </div>' +
            '    <div class="mc-goods clearfix" id="module_{{moduleId}}" ng-if="vData.col==2" >' +
            '        <a href="item.html?itemId={{prod.mpId}}" class="hot hot-two" ng-class="{first:$first}" ng-repeat="prod in dData.moduleDataList" title="{{prod.mpName}}">' +
            '         <div class="pic"><img width="280" height="280" ng-src="{{prod.picUrl || defaultImg}}" alt="{{prod.mpName}}"></div>' +
            '            <div class="con-two">' +
            '                <h5 class="name-two">{{prod.mpName}}</h5>' +
            '                <div class="s-price">' +
            // '                <img class="pro-icon" ng-repeat="proIcon in prod.promotionIconUrls track by $index" ng-src="{{proIcon}}" ng-if="$index <= 2"/>' +
            '                 <span class="pro-simulation-icon" ng-style="{background:\'#\'+ (proText.bgColor?proText.bgColor:\'f23030\'),\'color\' : \'#\'+ (proText.fontColor?proText.fontColor:\'fff\')}" ng-repeat="proText in prod.promotionIcon track by $index" ng-if="$index <=2">{{proText.iconText}}</span>' +
            '                 </div>' +
            '                <p class="money" ng-if="prod.isBargain != 3">' +
            '                     <span class="price">{{prod.availablePrice | currency:\'￥\'}}</span>' +
            '                     <span class="sn">{{i18n("立即抢购")}}</span>' +
            '                </p>' +
            '            </div>' +
            '        </a>' +
            '    </div>' +
            '    <div class="mc-goods clearfix" id="module_{{moduleId}}" ng-if="vData.col==6">' +
            '        <a href="item.html?itemId={{prod.mpId}}" class="hot h-border hot-six" ng-class="{first:$first}" ng-repeat="prod in dData.moduleDataList" title="{{prod.name}}">' +
            '            <div class="pic" style="width:{{1200/vData.col-41}}px;height:{{1200/vData.col-41}}px"><img width="{{1200/vData.col-41}}" height="{{1200/vData.col-41}}" ng-src="{{prod.picUrl || defaultImg}}" alt="{{prod.mpName}}"></div>' +
            '            <h5>{{prod.mpName}}</h5>' +
            '            <div class="s-price">' +
            // '              <img class="pro-icon" ng-repeat="proIcon in prod.promotionIconUrls track by $index" ng-src="{{proIcon}}" ng-if="$index <= 2"/>' +
            '                 <span class="pro-simulation-icon" ng-style="{background:\'#\'+ (proText.bgColor?proText.bgColor:\'f23030\'),\'color\' : \'#\'+ (proText.fontColor?proText.fontColor:\'fff\')}" ng-repeat="proText in prod.promotionIcon track by $index" ng-if="$index <=2">{{proText.iconText}}</span>' +
            '            </div>' +
            '            <p class="money" ng-if="prod.isBargain != 3">' +
            '                <span>{{prod.availablePrice | currency:\'￥\'}}</span>' +
            '            </p>' +
            '        </a>' +
            '    </div>' +
            '</div>',
        scope: {
            moduleId: '@'
        },
        link: function ($scope, element, attr, ctrl, linker) {
            $scope.i18n = function (key) {
                return $window.i18n ? $window.i18n(key) : key;
            };
            if ($scope.moduleId) {
                $scope.isBusy = false;
                $scope.offset = 100;
                $scope.windowH = $(window).height();
                $scope.nomore = false;
                // $scope.defaultImg = "http://cdn.oudianyun.com/opple/prod/back-cms/1504859996965_500_83.png@base@tag=imgScale&q=80";
                $scope.pagination = {
                    totalPage: 1,
                    pageNo: 1,
                    pageSize: 10
                }

                var module = $cmsData[$scope.moduleId];
                if (module && module.vData) {
                    $scope.vData = module.vData;
                    $scope.dData = {
                        moduleDataList: [],
                        categoryList: []
                    }
                }
                goodsToView();
                function scrollInit() {
                    $(window).scroll(function () {
                        if ($scope.isBusy) {
                            return
                        }
                        var flag = false;
                        //TODO:一定要清除浮动,否则计算边界值不准确
                        var boundRectObj = $(element).get(0).getBoundingClientRect();
                        if (boundRectObj.bottom >= (0 - $scope.offset) && boundRectObj.bottom <= $scope.windowH + ($scope.offset)) { //栏目尾部出现在可是区域内
                            $scope.isBusy = true;
                            //这是一次加载一页即10条数据
                            if ($scope.pagination.pageNo < $scope.pagination.totalPage) {
                                $scope.pagination.pageNo += 1;
                                //$scope.pagination.pageSize+=5;这是一次加载5条数据 但条件要换成$scope.pagination.pageSize < $scope.pagination.total
                                goodsToView(function () {
                                    //20180102注释
                                    // $scope.$apply();
                                });
                            } else {
                                $scope.nomore = true;
                                $scope.isBusy = false;
                            }
                            //这是一次加载5条数据
                            // if ($scope.pagination.pageSize < $scope.pagination.total) {
                            //     $scope.pagination.pageSize+=5;
                            //     goodsToView(function () {
                            //         $scope.$apply();
                            //     });
                            // } else {
                            //     $scope.nomore = true;
                            //     $scope.isBusy = false;
                            // }
                        }
                    });
                }
                scrollInit()
                function getMpIds(goodsArr) {
                    if (!goodsArr || goodsArr.length == 0) {
                        return [];
                    }
                    var mpIds = $.map(goodsArr, function (item, idx) {
                        return item.mpId;
                    });
                    return mpIds;
                }
                function goodsToView(cb) {
                    var mpIds = [],
                        goodsList;
                    if ($scope.pagination.totalPage != 0 && $scope.pagination.pageNo > $scope.pagination.totalPage) {
                        return;
                    }
                    //获取分页商品数据
                    getGoods().then(function (res) {
                        if (res.data && res.data.listObj && res.data.listObj.length > 0) {
                            $scope.pagination.totalPage = res.data.totalPage;
                            mpIds = getMpIds(res.data.listObj);
                            if (!mpIds) {
                                $scope.isBusy = false;
                                return;
                            }
                            //获取分页刷新商品数据
                            getGoodsRefresh(mpIds.join(',')).then(function (result) {
                                $scope.isBusy = false;
                                if (result.data.plist.length == 0) { //10个商品全部下架了，自动请求下一页数据
                                    if ($scope.pagination.pageNo < $scope.pagination.totalPage) {
                                        $scope.pagination.pageNo += 1;
                                        $scope.isBusy = true;
                                        goodsToView(cb);
                                        return;
                                    }
                                }
                                //刷新界面展示
                                goodsList = refreshGoods(res.data.listObj, result.data.plist);
                                $scope.dData.moduleDataList = $scope.dData.moduleDataList.concat(goodsList);
                                // angular.forEach($scope.dData.moduleDataList,function(val,key){
                                //     val.imgUrl1 = "http://cdn.oudianyun.com/opple/prod/back-cms/1504859996965_500_83.png@base@tag=imgScale&q=80";
                                // });
                                if (typeof cb === 'function') {
                                    cb();
                                }
                            });
                        } else {
                            $scope.isBusy = false;
                        }
                    });
                }
                function refreshGoods(ori, dest) {
                    var temp = [];
                    var dMpIds = $.map(dest, function (item, idx) {
                        return item.mpId;
                    });
                    //1.先过滤下架商品
                    var goods = $.grep(ori, function (item, idx) {
                        return $.inArray(item.mpId, dMpIds) >= 0
                    });
                    //TODO:改用reduce节省代码
                    //2.更新未下架商品
                    $.each(goods, function (g, gItem) {
                        $.each(dest, function (d, dItem) {
                            if (gItem.mpId === dItem.mpId) {
                                temp.push($.extend(true, gItem, dItem));
                            }
                        });
                    });
                    return temp;
                    //$scope.$apply();
                }
                function handler() {
                    var boundRectObj;
                    if ($scope.isBusy) {
                        return
                    }
                    boundRectObj = $(element).get(0).getBoundingClientRect();
                    if (boundRectObj.bottom >= (0 - $scope.offset) && boundRectObj.bottom <= $scope.windowH + ($scope.offset)) {//栏目尾部出现在可是区域内
                        $scope.isBusy = true;
                        if ($scope.moduleProdList.length < $scope.totalCount) {
                            $scope.pagination.pageNo += 1;
                            getGoods(false);
                        } else {
                            $scope.nomore = true;
                            $scope.isBusy = false;
                        }
                    }
                }
                function getGoods() {
                    return $rootScope.ajax.get('/cms/page/module/getModuleData', {
                        categoryId: -1,
                        pageNo: $scope.pagination.pageNo,
                        pageSize: $scope.pagination.pageSize,
                        moduleId: $scope.moduleId
                    })
                }

                function getGoodsRefresh(mpIds) {
                    return $rootScope.ajax.get('/api/realTime/getPriceStockList', {
                        mpIds: mpIds,
                        areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode: $rootScope.defaultAreasCode
                    });
                }
            }
        }
    }
}])
//商品
.directive('pcGoodsBig', ["$cmsData","$rootScope","$window",function ($cmsData, $rootScope,$window) {
    return {
        template: `
<div class="w1200 pc-goods-big clearfix" id="module{{moduleId}}">
  <div class="clearfix">
    <div class="left">
      <a ng-href={{vData.img.link.data}}>
        <img ng-src="{{vData.img.imgUrl}}" />
      </a>
    </div>
    <div class="right">
      <div class="clearfix">
        <a href="item.html?itemId={{item.mpId}}"
          class="goods-r1c4" 
          ng-repeat="item in dData.moduleDataList.slice(0, 8) track by $index"
          ng-class="{'goods-padno':($index+1) % 4 == 0}">
          <div class="pic"><img ng-src="{{item.picUrl || defaultImg}}"></div>
          <div class="txt">
            <p class="name">{{item.mpName}}</p>
            <p ng-if="item.availablePrice" class="price">{{item.availablePrice | currency:'￥'}}</p>
            <p ng-if="!item.availablePrice" class="price">{{$t('暂无价格')}}</p>
          </div>
        </a>
      </div>
    </div>
  </div>
</div>
        `,
        scope: {
            moduleId: '@'
        },
        link: function ($scope, element, attr, ctrl, linker) {
            $scope.i18n = function (key) {
                return $window.i18n ? $window.i18n(key) : key;
            };
            if ($scope.moduleId) {
                $scope.isBusy = false;
                $scope.offset = 100;
                $scope.windowH = $(window).height();
                $scope.nomore = false;
                // $scope.defaultImg = "http://cdn.oudianyun.com/opple/prod/back-cms/1504859996965_500_83.png@base@tag=imgScale&q=80";
                $scope.pagination = {
                    totalPage: 1,
                    pageNo: 1,
                    pageSize: 8
                }

                var module = $cmsData[$scope.moduleId];
                if (module && module.vData) {
                    $scope.vData = module.vData;
                    $scope.dData = {
                        moduleDataList: [],
                        categoryList: []
                    }
                }
                goodsToView();
                
                function getMpIds(goodsArr) {
                    if (!goodsArr || goodsArr.length == 0) {
                        return [];
                    }
                    var mpIds = $.map(goodsArr, function (item, idx) {
                        return item.mpId;
                    });
                    return mpIds;
                }
                function goodsToView(cb) {
                    var mpIds = [],
                        goodsList;
                    if ($scope.pagination.totalPage != 0 && $scope.pagination.pageNo > $scope.pagination.totalPage) {
                        return;
                    }
                    //获取分页商品数据
                    getGoods().then(function (res) {
                        if (res.data && res.data.listObj && res.data.listObj.length > 0) {
                            $scope.pagination.totalPage = res.data.totalPage;
                            mpIds = getMpIds(res.data.listObj);
                            if (!mpIds) {
                                $scope.isBusy = false;
                                return;
                            }
                            //获取分页刷新商品数据
                            getGoodsRefresh(mpIds.join(',')).then(function (result) {
                                $scope.isBusy = false;
                                if (result.data.plist.length == 0) { //10个商品全部下架了，自动请求下一页数据
                                    if ($scope.pagination.pageNo < $scope.pagination.totalPage) {
                                        $scope.pagination.pageNo += 1;
                                        $scope.isBusy = true;
                                        goodsToView(cb);
                                        return;
                                    }
                                }
                                //刷新界面展示
                                goodsList = refreshGoods(res.data.listObj, result.data.plist);
                                $scope.dData.moduleDataList = $scope.dData.moduleDataList.concat(goodsList);
                                // angular.forEach($scope.dData.moduleDataList,function(val,key){
                                //     val.imgUrl1 = "http://cdn.oudianyun.com/opple/prod/back-cms/1504859996965_500_83.png@base@tag=imgScale&q=80";
                                // });
                                if (typeof cb === 'function') {
                                    cb();
                                }
                            });
                        } else {
                            $scope.isBusy = false;
                        }
                    });
                }
                function refreshGoods(ori, dest) {
                    var temp = [];
                    var dMpIds = $.map(dest, function (item, idx) {
                        return item.mpId;
                    });
                    //1.先过滤下架商品
                    var goods = $.grep(ori, function (item, idx) {
                        return $.inArray(item.mpId, dMpIds) >= 0
                    });
                    //TODO:改用reduce节省代码
                    //2.更新未下架商品
                    $.each(goods, function (g, gItem) {
                        $.each(dest, function (d, dItem) {
                            if (gItem.mpId === dItem.mpId) {
                                temp.push($.extend(true, gItem, dItem));
                            }
                        });
                    });
                    return temp;
                    //$scope.$apply();
                }
                function getGoods() {
                    return $rootScope.ajax.get('/cms/page/module/getModuleData', {
                        categoryId: -1,
                        pageNo: $scope.pagination.pageNo,
                        pageSize: $scope.pagination.pageSize,
                        moduleId: $scope.moduleId
                    })
                }

                function getGoodsRefresh(mpIds) {
                    return $rootScope.ajax.get('/api/realTime/getPriceStockList', {
                        mpIds: mpIds,
                        areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode: $rootScope.defaultAreasCode
                    });
                }
            }
        }
    }
}])
//标题
.directive('pcTitle', ["$cmsData","$window", function ($cmsData,$window) {
    return {
        template: '<div class="w1200 pc-title clearfix" id="module{{moduleId}}">' +
            '    <div class="titlte-head"><img class="pc-icon" ng-if="vData.iconSrc" ng-src="{{vData.iconSrc}}" style="width:30px;height:30px"><span class="head-con" ng-style="{color:vData.color}">{{vData.titleName}}</span></div>' +
            '    <div class="hotterm" ng-if="vData.titleType==0" >' +
            '        <a target="_blank" ng-repeat="pro in vData.keyword" ng-href={{pro.link.data}}>{{pro.text}}</a>' +
            '    </div>' +
            '    <div class="hotterm" ng-if="vData.titleType==1">' +
            '        <a ng-href={{vData.more.data}} target="_blank">{{i18n("更多")}}<i class="op-icons op-icons-right"></i></a>' +
            '    </div>' +
            '</div>',
        scope: {
            moduleId: '@'
        },
        link: function ($scope) {
            $scope.i18n = function (key) {
                return $window.i18n ? $window.i18n(key) : key;
            };
            if ($scope.moduleId) {
                var module = $cmsData[$scope.moduleId];
                if (module && module.vData) {
                    $scope.vData = module.vData;
                }
            }

        }
    }
}])
.directive('pcRichText',['$cmsData',function($cmsData){
    return {
        template:'<div class="w1200" ng-bind-html="pcRichTextHtml"></div>',
        scope:{
            moduleId:'@'
        },
        controller: ['$scope','$sce', function ($scope,$sce) {
            if ($scope.moduleId) {
                var module = $cmsData[$scope.moduleId];
                if (module && module.vData) {
                    $scope.vData = module.vData;
                    $scope.pcRichTextHtml = $sce.trustAsHtml($scope.vData.content);
                }
            }
        }]
    }
}])
//导航， 未完成
.directive('pcSidenav', ["$cmsData", function ($cmsData) {
    return {
        template: '<div class="w1200 sales" ng-style="styleObj" id="module{{moduleId}}">' +
            '    <div class="sales-title">' +
            '        <img ng-src={{vData.topNavPic}} alt="">' +
            '    </div>' +
            '    <div class="text nav-title" ng-if="vData.topNavType==\'text\'" ng-style="{\'color\':vData.topNavColor,\'background-color\':vData.topNavBgColor}">' +
            '        {{vData.topNavTitle}}' +
            '    </div>' +
            '    <ul class="text sales-content" ng-style="{\'background-color\':vData.conNavBgColor}" ng-repeat="list in vData.navList">' +
            '        <li ng-class="{last:$last}"><a ng-href={{list.link.data}} ng-style="{\'color\':vData.conNavColor}">{{list.conNavTitle}}</a></li>' +
            '    </ul>' +
            '    <div class="sales-top"><img ng-src={{vData.btmNavPic}} alt=""></div>' +
            '    <div class="text btm-top" ng-if="vData.btmNavType==\'text\'" ng-style="{\'color\':vData.btmNavColor,\'background-color\':vData.btmNavBgColor}">' +
            '        {{vData.btmNavTitle}}' +
            '    </div>' +
            '</div>',
        scope: {
            moduleId: '@'
        },
        // link:function(scope,elem,attr){
        //      scope.data = scope.module.vData;
        //      scope.styleObj = {
        //          'position':'fixed',
        //          'left':scope.module.vData.position == 'left' ? '170px' : null,
        //          'right':'170px',
        //          'top':'50%'
        //      }
        // },
        link: function ($scope) {
            if ($scope.moduleId) {
                var module = $cmsData[$scope.moduleId];
                if (module && module.vData) {
                    $scope.vData = module.vData;
                }
            }
            $scope.styleObj = {
                'position': 'fixed',
                'left': $cmsData[$scope.moduleId].vData.position == 'left' ? '170px' : null,
                'right': '170px',
                'top': '50%'
            }
        }
    }
}])
//热区
.directive('pcMap', ["$cmsData", "$log", function ($cmsData, $log) {
    return {
        template: '<div id="module{{moduleId}}" ng-class="{\'module-full\':vData.column == \'0\',\'module-nofull\':vData.column==\'1\'}">' +
            '    <img ng-src={{vData.src}} border="0" usemap="#cms{{moduleId}}" alt=""/>' +
            '    <map name="cms{{moduleId}}" id="cms{{moduleId}}">' +
            '        <area shape="poly" coords="{{area.area.join(\',\')}}"  style="outline:none;"  ng-href={{area.link.data}} alt="" ng-repeat="area in areas"/>' +
            '    </map>' +
            '</div>',
        scope: {
            moduleId: '@'
        },
        link: function (scope, element, attr, ctrl, linker) {
            if (scope.moduleId) {
                var module = $cmsData[scope.moduleId];
                if (module && module.vData) {
                    scope.vData = module.vData;
                }
            }
            function imgLoad (){
                var img = angular.element(element).find('img')[0];
                var displayWidth = img.width, vData = scope.vData, oriWidth = vData.bkWidth;
                //用宽度计算比例（假设高度也是等比放大)
                var ratio = (displayWidth / oriWidth) || 1;
                scope.areas = $.map(vData.data, function (item, index) {
                    var transFormCoords = $.map(item.area, function (ite, idx) {
                        return ite = ite * ratio;
                    });
                    $log.info("item.link is ", item.link);
                    return { area: transFormCoords, link: item.link };
                });
                scope.$apply();
            }
            if (typeof window['onload'] === 'function'){
                var oldOnLoad = window.onload;
                window.onload = function(){
                    imgLoad();
                    oldOnLoad();
                }
            }else{
                window.onload = function(){
                    imgLoad();
                }
            }
            //scope:指令所在的作用域
            //element：指令元素的封装，可以调用angular封装的简装jq方法和属性
            //attr：指令元素的属性的集合
            //ctrl：用于调用其他指令的方法,指令之间的互相通信使用，需要配合require
            //linker:用于transClude里面嵌入的内容
        }
    }
}]);
