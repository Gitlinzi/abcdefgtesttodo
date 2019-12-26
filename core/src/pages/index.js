/**
 * Created by Roy on 15/10/20.
 */

//var appControllers=angular.module("appControllers",['ngCookies','ngFileUpload','directives','filters','services']);

appControllers.controller("indexCtrl", ['$log', '$rootScope', '$scope', 'commonService', 'categoryService', "$cmsData","$window",function ($log, $rootScope, $scope, commonService,categoryService,$cmsData,$window) {
    'use strict';
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };

    $scope.showFixHeader = true;

    $scope.searchObj={
        pageNo:1,
        pageSize:6,
        totalCount:0,
        checkAll:false,
        sortType: '10',
        keyword: '*****',
        filterType: 'AGREEMENT_PRODUCT'
    };
   
    // $scope.authCode = null,
    $scope.searched = false;
    $scope.isIndex = true;
    $scope.bgColor = $cmsData.pageInfo ? ($cmsData.pageInfo.bgColor? $cmsData.pageInfo.bgColor: '#f8f8f8') : '#f8f8f8';



    //国际化
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
     //获取弹出框信息
     var shareCodeMessage=$rootScope.util.cookie.getCookie('shareCodeMessage')? JSON.parse($rootScope.util.cookie.getCookie('shareCodeMessage')): '';
     if(shareCodeMessage){
        $rootScope.error.checkCode($scope.i18n('提示'), shareCodeMessage);
        $rootScope.util.cookie.setCookie('shareCodeMessage', "", -1);
     }

    //默认省份与迷你购物车
    $rootScope.execute(true);
    //首页热门商品
    $scope.refresh = true;
    $scope.news = [];
    $scope.searchHistory = true;
    $scope.noticeData = [];
    $scope.articleType = '';
    $scope.regionList = [];
    $scope.reconciliationList = [];
    $scope.saleafterList = [];
    
    //首页热门end

    //首页轮播

    $scope.getLunboAndRightAd = function () {
        var url = '/ad-whale-web/dolphin/getAdSource',
            params = {
                pageCode:'HOME',
                adCode:'ad_banner',
                platform:1,
                companyId:$rootScope.companyId
            };
        $rootScope.ajax.get(url,params).then(function (res) {
            if (res.data && res.data.ad_banner) {
                $scope.lunbo = res.data.ad_banner;
            }
        })
    };
    $scope.getLunboAndRightAd();

    $scope.getCustomerDelegateList = function () {
        var url = '/custom-sbd-web/customerDelegate/getCustomerDelegateList.do'
        $rootScope.ajax.postJson(url, {}).then(function (res) {
            if (res.code == 0 && res.data) {
                $scope.regionList = res.data.region
                $scope.reconciliationList = res.data.reconciliation
                $scope.saleafterList = res.data.saleafter
            } 
        })
    };
    $scope.getCustomerDelegateList();



    var flagPageY = true;
    angular.element($(window)).on("scroll", function () {
        var floor8PageY;
        if ($(".floor8-pageY").offset()) {
            floor8PageY = $(".floor8-pageY").offset().top;
        }
        if (floor8PageY && $(window).scrollTop() > floor8PageY && flagPageY) {
            $scope.getFloor10();
            $scope.getFloor11();
            $scope.getFloor12();
            $scope.getFloor13();
            $scope.getFloor14();
            $scope.getFloor15();
            flagPageY = false;
        }
    });
    //当在首页的时候让公告区域显示
    var indexUrl = window.location.href;
    if( indexUrl.indexOf( 'index.html' ) > 0 ) {
        $scope.noticeIsShow = true;
    }
    // 获取首页公告信息
    $scope.getNotice = function() {
        var url = '/cms/view/pc/headlinesList';
        var params = {
            categoryType: 2,
            currentPage: 1,
            itemsPerPage: 8,
            code: 'headlines'
        }
        $rootScope.ajax.get(url,params).then(function (res) {
            if( res.code == 0 && res.data && res.data.pageResult) {
                $scope.noticeData = res.data.pageResult.listObj
                if ($scope.noticeData != null && $scope.noticeData.length > 0) {
                    $scope.isShowPage = true;
                    for (let i = 0; i < $scope.noticeData.length; i++) {
                        $scope.articleType = $scope.noticeData[i].articleType
                    }
                }
            }
        })
    }
    $scope.getNotice();
    // 客户代表
    $scope.getNotice2 = function() {
        var url = '/cms/view/pc/headlinesList';
        var params = {
            categoryType: 2,
            currentPage: 1,
            itemsPerPage: 8,
            code: 'headlines'
        }
        $rootScope.ajax.get(url,params).then(function (res) {
            if( res.code == 0 && res.data && res.data.pageResult) {
                $scope.noticeData = res.data.pageResult.listObj
                if ($scope.noticeData != null && $scope.noticeData.length > 0) {
                    $scope.isShowPage = true;
                    for (let i = 0; i < $scope.noticeData.length; i++) {
                        $scope.articleType = $scope.noticeData[i].articleType
                    }
                }
            }
        })
    }
    $scope.getNotice2();
    // 获取首页企业公告信息
    $scope.getCompanyNotice = function() {
        var url = '/cms/view/pc/headlinesList';
        var params = {
            categoryType: 2,
            currentPage: 1,
            itemsPerPage: 8,
            code: 'headlines',
            isMerchant:1
        }
        $rootScope.ajax.get(url,params).then(function (res) {
            if( res.code == 0 ) {
                $scope.companyNotice = res.data.pageResult.listObj
            }
        })
    }
    $scope.getCompanyNotice()
    //首页公告信息
    $scope.proclamationMsg = function () {
        var url = '/ad-whale-web/dolphin/getAdSource',
            params = {
                pageCode: 'HOME',
                adCode: 'index_guarantee',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.get(url, params).then(function (res) {
            if (res.data && res.data.index_guarantee) {
                $scope.proclamationList = res.data.index_guarantee;
            }
        })
    }
    //$scope.proclamationMsg()
    // 跳转详情页 
    $scope.goToDetail = function(id) {
        location.href = '/item.html?itemId=' + id
    }
    $scope.favoriteGoods = []
    $scope.favoriteObj = {
        pageNo:1,
        maxPage:1
    }
    $scope.mpIds = []
    $scope.changeFavoritePage = function (key) {
        if (key === 'prev') {
            if ($scope.favoriteObj.pageNo<=1) {
                return false
            }
            $scope.favoriteObj.pageNo--
            console.log( $scope.favoriteObj.pageNo)
        }
        if (key === 'next') {
            if ($scope.favoriteObj.pageNo >= $scope.favoriteObj.maxPage ) {
                return false
            }
            $scope.favoriteObj.pageNo++
            console.log( $scope.favoriteObj.pageNo)

        }
    }
    $scope.getFavoriteGoods = function () {
        var that = this;
        var url = "/ouser-center/api/favorite/queryFavoriteDetailPage.do",
            params = {
                currentPage: $scope.favoriteObj.pageNo,
                itemsPerPage:50,
                entityType : 1,
            };
        $rootScope.ajax.post(url,params).then(function (res) {
            that.favoriteGoods = [];
            if (res.code == 0) {
                    if ( res.data.listObj && res.data.listObj.length > 0) {
                        // console.log(res.data.data);
                        angular.forEach(res.data.listObj, function (val) {
                            $scope.favoriteGoods.push(val);
                            $scope.mpIds.push(val.mpId);
                        })
                        $scope.favoriteObj.maxPage =  Math.ceil(res.data.listObj.length/5)
                    }
                    if (!$scope.mpIds || !$scope.mpIds.length) {
                        return;
                    }
                    $rootScope.ajax.get($rootScope.host + '/realTime/getPriceStockList', {mpIds: $scope.mpIds,
                        areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode: $rootScope.defaultAreasCode}).then(function (res) {
                        if (res.code == 0) {
                            if (res.data) {
                                angular.forEach(res.data.plist, function (val2) {
                                    angular.forEach($scope.favoriteGoods, function (val3) {
                                        if (val2.mpId == val3.mpId) {
                                            val3.realPrice = val2.availablePrice;
                                            val3.realNum = val2.stockNum;
                                            val3.realNumText = val2.stockText;
                                            val3.stockNum = val2.stockNum;
                                        }
                                    })
                                })
                            }
                        } else {
                            $rootScope.error.checkCode(res.code, res.message);
                        }
                    },function(){
                        $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('获取实时库存价格异常'));
                    })

            } else {
                $rootScope.error.checkCode(res.code, res.message);
            }
        },function(){
            $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('获取收藏异常'));
        })
    }
    $scope.getFavoriteGoods()
    // 获取热销商品
    $scope.hotGoods = []
    $scope.getHotGoods = function() {
        let url ='/custom-sbd-web/product/getHotSaleProductList.do'
        let params = {
            currentPage: 1,
            itemsPerPage: 6
        }
        $rootScope.ajax.postJson(url,params).then(res => {
            if (res.code ==0 && res.data) {
                $scope.hotGoods = res.data.listObj || []
            }
        })
    }
    $scope.getHotGoods()
    // 获取协议商品
    $scope.agreementGoods = []
    $scope.mpIdList = []
    var params = $rootScope.util.paramsFormat(location.href);
    $scope.searchObj.timer=new Date().getTime();
    $scope.searchObj.areaCode = $rootScope.localProvince.province.provinceCode;
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
    $scope.getAgreementProductList = function() {
        // let url = '/custom-sbd-web/product/getAgreementProductList.do'
        // let params = {
        //     currentPage: 1,
        //     itemsPerPage: 6
        // }
        let url = '/search/rest/searchList.do';
        $rootScope.ajax.get(url,$scope.searchObj).then(res => {
            if (res.code ==0 && res.data) {
                $scope.searchObj.totalCount = res.data.totalCount;
                $scope.agreementGoods = res.data.productList || []
                if(res.data.productList && res.data.productList.length > 0) {
                    angular.forEach(res.data.productList, function (val) {
                        $scope.mpIdList.push(val.mpId);
                    })
                }
                
            }
            if (!$scope.mpIdList || !$scope.mpIdList.length) {
                return;
            }
            $rootScope.ajax.get($rootScope.host + '/realTime/getPriceStockList', {mpIds: $scope.mpIdList,
                areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode: $rootScope.defaultAreasCode}).then(function (res) {
                if (res.code == 0) {
                    if (res.data) {
                        angular.forEach(res.data.plist, function (val2) {
                            angular.forEach($scope.agreementGoods, function (val3) {
                                if (val2.mpId == val3.mpId) {
                                    val3.realPrice = val2.availablePrice;
                                    val3.realNum = val2.stockNum;
                                    val3.realNumText = val2.stockText;
                                    val3.stockNum = val2.stockNum;
                                }
                            })
                        })
                    }
                } else {
                    $rootScope.error.checkCode(res.code, res.message);
                }
            },function(){
                $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('获取实时库存价格异常'));
            })
        })
    }
    $scope.getAgreementProductList()
    // 获取未审核订单数量
    $scope.unreviewedNum = null
    $scope.getUnreviewedNum = function() {
        let url = '/custom-sbd-web/approval/queryPendingApprSoNum.do'
        let params = {}
        $rootScope.ajax.postJson(url,params).then(res => {
            if (res.code ==0 ) {
                $scope.unreviewedNum = res.data
            }  
        })
    }
    $scope.getUnreviewedNum()
    //如果列表页可以加入购物车， 监听子控制器的事件
    $rootScope.$on('updateMiniCartToParent',function () {
        //监听到事件后再广播出去
        $scope.$broadcast('updateMiniCart');
    });
}]);
$(function () {
    'use strict'
    var showHeaderHeight = $('#jumbotron').height() + $('.custom-header').height()
    $(window).scroll(function (e) {
        // console.log($(window).scrollTop());
        if( $(window).scrollTop() > showHeaderHeight) {
            $('.fix-header-box').show()
        } else {
            $('.fix-header-box').fadeOut(200)
        }
    })
    //置顶
    $('.top-box').click(function () {
        $("html,body").animate({
            scrollTop: 0
        }, 500);
    })
})
 