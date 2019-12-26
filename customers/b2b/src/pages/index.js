/**
 * Created by Roy on 15/10/20.
 */

//var appControllers=angular.module("appControllers",['ngCookies','ngFileUpload','directives','filters','services']);

appControllers.controller("indexCtrl", ['$log', '$rootScope', '$scope', 'commonService', 'categoryService', "$cmsData", function ($log, $rootScope, $scope, commonService, categoryService, $cmsData) {
    'use strict';
    $scope.searched = false;
    $scope.isIndex = true;
    $scope.bgColor = $cmsData.pageInfo ? ($cmsData.pageInfo.bgColor ? $cmsData.pageInfo.bgColor : '#f8f8f8') : '#f8f8f8';
    var _ut = $rootScope.util.getUserToken(),
        _fnP = $rootScope.ajax.post,
        _fnG = $rootScope.ajax.get,
        _fnE = $rootScope.error.checkCode,
        _host = $rootScope.host,
        _cid = $rootScope.companyId;
    $scope._ut = _ut;
    //获取弹出框信息
    var shareCodeMessage = JSON.parse($rootScope.util.cookie.getCookie('shareCodeMessage'))
    if (shareCodeMessage) {
        $rootScope.error.checkCode('提示', shareCodeMessage);
        $rootScope.util.cookie.setCookie('shareCodeMessage', "", -1);
    }
    if(!$rootScope.util.getCookies('indexImg')) {
        $rootScope.util.setCookie('indexImg',{
            'isShow' : true
        },1);
    }
    if($rootScope.util.getCookies('indexImg')) {
        var imgData = JSON.parse($rootScope.util.getCookies('indexImg'));
        $scope.isShowIndexImg = imgData.isShow;
    }
    $scope.closeIndexImg = function() {
        $scope.isShowIndexImg = false;
        $rootScope.util.setCookie('indexImg',{
            'isShow' : false
        },1);
    }
    //默认省份与迷你购物车
    $rootScope.execute(true);
    //首页热门商品
    $scope.hotlistId = 246;
    $scope.pageIndex = 0;
    $scope.hotlist = [];
    $scope.refresh = true;
    $scope.news = [];
    $scope.searchHistory = true;
    $scope.getHotList = function () {
        var url = $rootScope.host + '/product/hotlist',
            params = {
                categoryId: $scope.hotlistId,
                pageSize: 18,
                pageNo: 1,
                areaCode: ($rootScope.localProvince.province.provinceCode || '')
            };
        // var url = $rootScope.host + '/dolphin/list?pageCode=PC_HOME&adCode=top_navigate&platform=1&companyId=' + $rootScope.companyId;
        $rootScope.ajax.get(url, params).then(function (res) {
            if (typeof res.data !== 'undefined') {
                if (res.data.length < 6) {
                    $scope.refresh = false;
                }
                $scope.hotAll = res.data;
                for (var i = 0; i < 6; i++) {
                    if (res.data[i]) {
                        $scope.hotlist.push(res.data[i]);
                        $scope.pageIndex = i;
                    }
                }
            } else {
                $scope.hotAll = null;
            }
        })
    }();
    $scope.refreshHotList = function () {
        var arr = [];
        if ($scope.pageIndex == $scope.hotAll.length - 1) {
            $scope.pageIndex = -1;
        } else if (($scope.hotAll.length - 1 - 6) < $scope.pageIndex) {
            $scope.pageIndex = $scope.hotAll.length - 1 - 6;
        }
        var index = 0;
        for (var i = $scope.pageIndex + 1; i < $scope.pageIndex + 7; i++) {
            if ($scope.hotAll[i]) {
                arr.push($scope.hotAll[i]);
                index = i;
            }
        }
        $scope.pageIndex = index;
        $scope.hotlist = arr;
    };

    //顶部图
    $scope.topRecommendation = [];
    $scope.showTopRecommendation = true;
    $scope.hideTopRecommendation = function() {
        $scope.showTopRecommendation = false;
    };

    //当在首页的时候让公告区域显示
    var indexUrl = window.location.href;
    if( indexUrl.indexOf( 'index.html' ) > 0 ) {
        $scope.noticeIsShow = true;
    }
    // 获取首页运营公告信息
    $scope.getNotice = function() {
        var url = '/cms/view/pc/headlinesList';
        var params = {
            categoryType: 2,
            currentPage: 1,
            itemsPerPage: 8,
            code: 'headlines'
        }
        $rootScope.ajax.get(url,params).then(function (res) {
            if( res.code == 0 ) {
                $scope.noticeData = res.data.pageResult.listObj
            }
        })
    }
    $scope.getNotice();
    $scope.getTopRecommendation = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'top_recommendation',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.get(url, params).then(function (res) {
            if (res.data && res.data.top_recommendation) {
                $scope.topRecommendation = res.data.top_recommendation[0];
            }
        })
    };
    $scope.getTopRecommendation();
    // 底部小图
    $scope.showBottomRecommendation = true;
    $scope.hideBottomRecommendation = function() {
        $scope.showBottomRecommendation = false;
    }
    $scope.getBottomImg = function() {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'bottom_recommendation',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.get(url, params).then(function (res) {
            if (res.data && res.data.bottom_recommendation) {
                $scope.bottomRecommendation = res.data.bottom_recommendation;
            }
        })
    }
    $scope.getBottomImg();
    //场景标题
    $scope.sceneTitle = [];
    $scope.getSceneTitle = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'scene_title',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.get(url, params).then(function (res) {
            if (res.data && res.data.scene_title) {
                $scope.sceneTitle = res.data.scene_title[0];
            }
        })
    };
    $scope.getSceneTitle();
    //获取首页灯箱广告
    $scope.getLightBox = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'light_box',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.get(url, params).then(function (res) {
            if (res.data && res.data.light_box) {
                $scope.lightBox = res.data.light_box[0];
            }
        })
    };
    $scope.getLightBox();
    //首页分类
    $scope.sceneClassification = [];
    $scope.getSceneClassification = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'scene_classification',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.get(url, params).then(function (res) {
            if (res.data && res.data.scene_classification) {
                $scope.sceneClassification = res.data.scene_classification;
            }
        })
    };
    $scope.getSceneClassification();
    // 首页底部友情链接
    $scope.bottomTarget = function() {
        var url = $rootScope.host + '/dolphin/list';
        var params = {
            pageCode: 'PC_HOME_PAGE',
            adCode : 'blogroll',
            platform: 1,
            companyId: $rootScope.companyId
        }
        $rootScope.ajax.get(url,params).then(function(res) {
            if( res.data && res.data.blogroll ) {
                $scope.blogroll = res.data.blogroll;
            }
        })
    }
    $scope.bottomTarget();
    // 首页顶部图片获取
    $scope.topBanner = function() {
        var url = $rootScope.host + '/dolphin/list';
        var params = {
            pageCode: 'PC_HOME_PAGE',
            adCode : 'top_recommendation',
            platform: 1,
            companyId: $rootScope.companyId
        }
        $rootScope.ajax.get(url,params).then(function(res) {
            if( res.data && res.data.top_recommendation ) {
                $scope.topRecommendation = res.data.top_recommendation;
            }
        });
    };
    $scope.topBanner();
    // 顶部大图鼠标进入
    $scope.indexEnter = function() {

    };
    // 顶部大图鼠标离开
    $scope.indexLeave = function() {

    };
    //首页秒杀
    $scope.purchaseTimeList = [];
    $scope.getTimeList = function () {
        $rootScope.ajax.get('/api/promotion/secondkill/timeList?nocache = ' + new Date().getTime()).then(function (res) {
            if (res.code == 0 && res.data != null && res.data.timeList != null) {
                angular.forEach(res.data.timeList[0].times, function (val) {
                    //过滤掉过期的
                    if (val.status != 3 && val.timeStr != "00:00") {
                        $scope.purchaseTimeList.push(val);
                    }
                });
                var promotionId = $scope.promotionIdNum = $scope.purchaseTimeList[0] ? $scope.purchaseTimeList[0].promotionId : 0;
                $scope.purchaseBuy(promotionId);
            }
        })
    };
    $scope.getTimeList();
    $scope.purchaseBuyList = [];
    $scope.pageSize = 12;
    $scope.pageNo = 1;
    $scope.purchaseBuy = function (promotionId) {
        $scope.promotionIdNum = promotionId;
        $scope.stateNum = promotionId;
        var url = "/api/promotion/secondkill/killList",
            params = {
                promotionId: promotionId,
                pageSize: $scope.pageSize,
                pageNo: $scope.pageNo
            };
        $rootScope.ajax.post(url, params).then(function (res) {
            $scope.purchaseBuyList = [];
            if (res.code == 0) {
                $scope.purchaseBuyList = res.data.listObj ? res.data.listObj[0] : [];
            }
        }, function () {

        })
    };
    //首页众筹
    $scope.crowdfundList = [];
    $scope.getCrowdfundList = function () {
        var url = _host + '/promotion/promotionProduct/list',
            that = this,
            params = {
                isNeedTotal: 1,
                status: 4,
                promotionType: 17,//众筹
                itemsPerPage: $scope.pageSize,
                currentPage: $scope.pageNo,
                isNeedRule: 1,
            }
        ;
        _fnP(url, params).then(function (res) {
            $scope.crowdfundList = [];
            if (res.code == 0 && res.data.listObj != null && res.data.listObj.length > 0) {
                $scope.crowdfundList = $scope.crowdfundList.concat(res.data.listObj);
            }
        }, function (res) {

        });
    };
    $scope.getCrowdfundList();

    //首页热门end

    //首页轮播
    $scope.getLunboAndRightAd = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'banner',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.get(url, params).then(function (res) {
            if (res.data && res.data.banner) {
                $scope.lunbo = res.data.banner;
            }
        })
    };
    $scope.getLunboAndRightAd();

    //楼层广告位
    $scope.textData1 = {};
    $scope.floor1ShowLunbo = true;
    $scope.textData2 = {};
    $scope.floor2ShowLunbo = true;
    $scope.textData3 = {};
    $scope.floor3ShowLunbo = true;
    $scope.textData4 = {};
    $scope.floor4ShowLunbo = true;
    $scope.textData5 = {};
    $scope.floor5ShowLunbo = true;
    $scope.textData6 = {};
    $scope.floor6ShowLunbo = true;
    $scope.textData7 = {};
    $scope.floor7ShowLunbo = true;
    $scope.textData8 = {};
    $scope.floor8ShowLunbo = true;
    $scope.textData9 = {};
    $scope.floor9ShowLunbo = true;
    $scope.textData10 = {};
    $scope.floor10ShowLunbo = true;
    $scope.textData11 = {};
    $scope.floor11ShowLunbo = true;
    $scope.textData12 = {};
    $scope.floor12ShowLunbo = true;
    $scope.textData13 = {};
    $scope.floor13ShowLunbo = true;
    $scope.textData14 = {};
    $scope.floor14ShowLunbo = true;
    $scope.textData15 = {};
    $scope.floor15ShowLunbo = true;
    $scope.textData16 = {};
    $scope.floor16ShowLunbo = true;
    $scope.textData17 = {};
    $scope.floor17ShowLunbo = true;
    $scope.textData18 = {};
    $scope.floor18ShowLunbo = true;
    $scope.textData19 = {};
    $scope.floor19ShowLunbo = true;
    $scope.textData20 = {};
    $scope.floor20ShowLunbo = true;

    //楼层一,分类先配图片，后配分类code
    $scope.firstFloor = {};
    $scope.firstFloorClassification = {};
    $scope.firstFloorTab = {};
    $scope.firstCategory = {};
    $scope.f1nextBtn = true;
    $scope.f1upBtn = true;
    $scope.floor1callback = function (textData, floorShowLunbo) {
        $scope.textData1 = textData;
        var f1mpId = [];
        angular.forEach($scope.textData1.num1,function (val) {
            if(val.refObject != null){
                f1mpId.push(val.refObject.id);
            }
        });
        if(f1mpId.length > 0){
            $rootScope.ajax.get(_host + '/realTime/getPriceStockList', {mpIds: f1mpId}).then(function (res) {
                if (res.code == 0) {
                    angular.forEach($scope.textData1.num1,function (val) {
                        if(val.refObject != null){
                            angular.forEach(res.data.plist,function (val2) {
                                if(val.refObject.id == val2.mpId){
                                    val.refObject.realPrice = val2.availablePrice;
                                }
                            })
                        }
                    });
                }
            })
        }
        $scope.floor1ShowLunbo = floorShowLunbo;
        $scope.f1upBtn = false;
        $scope.f1nextBtn = false;
        if (!$scope.floor1ShowLunbo) {
            $scope.f1sevenBlocks = [];
            $scope.f1PageNo = 1;
            $scope.f1PageSize = 7;
            $scope.f1TotalPage =
                $scope.textData1.num1.length % $scope.f1PageSize == 0 ? (($scope.textData1.num1.length / $scope.f1PageSize) || 1) : parseInt($scope.textData1.num1.length / $scope.f1PageSize) + 1;
            $scope.f1sevenBlocks = $scope.textData1.num1.slice($scope.f1PageNo - 1, $scope.f1PageSize);
            if ($scope.f1PageNo < $scope.f1TotalPage) {
                $scope.f1nextBtn = true;
            }
        }
    };
    $scope.getFirstFloor = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'f1,f1_classification,f1_tab',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.get(url, params).then(function (res) {
            if (res.code == 0) {
                if (res.data.f1 !=null && res.data.f1.length > 0) {
                    $scope.firstFloor = res.data.f1[0];
                    if (res.data.f1_classification) {
                        $scope.firstFloorClassification = res.data.f1_classification;
                        if ($scope.firstFloorClassification[1]) {
                            var url = '/api/category/list?parentId='+$scope.firstFloorClassification[1].content+'&level=3&companyId='+$rootScope.companyId;
                            $rootScope.ajax.getDolphinByMerchantId(url, {}).then(function (res) {
                                if (res.code == 0) {
                                    $scope.firstCategory = res.data.categorys;
                                }
                            })
                        }
                    }
                    if (res.data.f1_tab) {
                        $scope.firstFloorTab = res.data.f1_tab;
                        angular.forEach($scope.firstFloorTab, function (val) {
                            val.select = false;
                            if (val.content.indexOf('f1_1_tab_banner') >= 0) {
                                $scope.getDataByAdCode(val, $scope.textData1, $scope.floor1ShowLunbo, $scope.floor1callback);
                            }
                        });
                        $scope.firstFloorTab[0]?($scope.firstFloorTab[0].select = true):($scope.firstFloorTab[0].select = false);
                    }
                    $scope.getBannerOne();
                }
            }
        })
    };
    $scope.getFirstFloor();
    // 楼层推荐一
    $scope.getBannerOne = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'f1_recommendation',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.get(url, params).then(function (res) {
            if (res.data && res.data.f1_recommendation) {
                $scope.f1Recommendation = res.data.f1_recommendation[0];
            }
        })
    };

    //第二后tab后翻页，下一页
    $scope.firstTurnNextPage = function () {
        if ($scope.f1PageNo >= $scope.f1TotalPage) {
            return;
        }
        $scope.f1PageNo++;
        if ($scope.f1PageNo == $scope.f1TotalPage) {
            $scope.f1nextBtn = false;
        }
        $scope.f1sevenBlocks = [];
        $scope.f1sevenBlocks = $scope.textData1.num1.slice(($scope.f1PageNo - 1) * $scope.f1PageSize, $scope.f1PageNo * $scope.f1PageSize);
        $scope.f1upBtn = true;
    };
    //第二后tab后翻页，上一页
    $scope.firstTurnUpPage = function () {
        if ($scope.f1PageNo <= 1) {
            return
        }
        $scope.f1PageNo--;
        if ($scope.f1PageNo == 1) {
            $scope.f1upBtn = false;
        }
        $scope.f1sevenBlocks = [];
        $scope.f1sevenBlocks = $scope.textData1.num1.slice(($scope.f1PageNo - 1) * $scope.f1PageSize, $scope.f1PageNo * $scope.f1PageSize);
        $scope.f1nextBtn = true;
    };


    //楼层二,分类先配图片，后配分类code
    $scope.secondFloor = {};
    $scope.secondFloorClassification = {};
    $scope.secondFloorTab = {};
    $scope.secondCategory = {};
    $scope.f2nextBtn = true;
    $scope.f2upBtn = true;
    $scope.floor2callback = function (textData, floorShowLunbo) {
        $scope.textData2 = textData;
        var f2mpId = [];
        angular.forEach($scope.textData2.num1,function (val) {
            if(val.refObject != null){
                f2mpId.push(val.refObject.id);
            }
        });
        if(f2mpId.length > 0){
            $rootScope.ajax.get(_host + '/realTime/getPriceStockList', {mpIds: f2mpId}).then(function (res) {
                if (res.code == 0) {
                    angular.forEach($scope.textData2.num1,function (val) {
                        if(val.refObject != null){
                            angular.forEach(res.data.plist,function (val2) {
                                if(val.refObject.id == val2.mpId){
                                    val.refObject.realPrice = val2.availablePrice;
                                }
                            })
                        }
                    });
                }
            })
        }
        $scope.floor2ShowLunbo = floorShowLunbo;
        $scope.f2upBtn = false;
        $scope.f2nextBtn = false;
        if (!$scope.floor2ShowLunbo) {
            $scope.f2sevenBlocks = [];
            $scope.f2PageNo = 1;
            $scope.f2PageSize = 7;
            $scope.f2TotalPage =
                $scope.textData2.num1.length % $scope.f2PageSize == 0 ? (($scope.textData2.num1.length / $scope.f2PageSize) || 1) : parseInt($scope.textData2.num1.length / $scope.f2PageSize) + 1;
            $scope.f2sevenBlocks = $scope.textData2.num1.slice($scope.f2PageNo - 1, $scope.f2PageSize);
            if ($scope.f2PageNo < $scope.f2TotalPage) {
                $scope.f2nextBtn = true;
            }
        }
    };
    $scope.getSecondFloor = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'f2,f2_classification,f2_tab',
                platform: 1,
                companyId: $rootScope.companyId,
                merchantId:1289052100000011
            };
        $rootScope.ajax.getDolphinByMerchantId(url, params).then(function (res) {
            if (res.code == 0) {
                if (res.data.f2 != null && res.data.f2.length >0) {
                    $scope.secondFloor = res.data.f2[0];
                    if (res.data.f2_classification) {
                        $scope.secondFloorClassification = res.data.f2_classification;
                        if ($scope.secondFloorClassification[1]) {
                            var url = '/api/category/list?parentId='+$scope.secondFloorClassification[1].content+'&level=3&companyId='+$rootScope.companyId;
                            $rootScope.ajax.getDolphinByMerchantId(url, {}).then(function (res) {
                                if (res.code == 0) {
                                    $scope.secondCategory = res.data.categorys;
                                }
                            })
                        }
                    }
                    if (res.data.f2_tab) {
                        $scope.secondFloorTab = res.data.f2_tab;
                        angular.forEach($scope.secondFloorTab, function (val) {
                            val.select = false;
                            if (val.content.indexOf('f2_1_tab_banner') >= 0) {
                                $scope.getDataByAdCode(val, $scope.textData2, $scope.floor2ShowLunbo, $scope.floor2callback);
                            }
                        });
                        $scope.secondFloorTab[0]?($scope.secondFloorTab[0].select = true):($scope.secondFloorTab[0].select=false);
                    }
                    $scope.getBannerTwo();
                }
            }
        })
    };
    $scope.getSecondFloor();
    // 楼层推荐二
    $scope.getBannerTwo = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'f2_recommendation',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.get(url, params).then(function (res) {
            if (res.data && res.data.f2_recommendation) {
                $scope.f2Recommendation = res.data.f2_recommendation[0];
            }
        })
    };

    //第二后tab后翻页，下一页
    $scope.secondTurnNextPage = function () {
        if ($scope.f2PageNo >= $scope.f2TotalPage) {
            return;
        }
        $scope.f2PageNo++;
        if ($scope.f2PageNo == $scope.f2TotalPage) {
            $scope.f2nextBtn = false;
        }
        $scope.f2sevenBlocks = [];
        $scope.f2sevenBlocks = $scope.textData2.num1.slice(($scope.f2PageNo - 1) * $scope.f2PageSize, $scope.f2PageNo * $scope.f2PageSize);
        $scope.f2upBtn = true;
    };
    //第二后tab后翻页，上一页
    $scope.secondTurnUpPage = function () {
        if ($scope.f2PageNo <= 1) {
            return
        }
        $scope.f2PageNo--;
        if ($scope.f2PageNo == 1) {
            $scope.f2upBtn = false;
        }
        $scope.f2sevenBlocks = [];
        $scope.f2sevenBlocks = $scope.textData2.num1.slice(($scope.f2PageNo - 1) * $scope.f2PageSize, $scope.f2PageNo * $scope.f2PageSize);
        $scope.f2nextBtn = true;
    };


    //楼层三,分类先配图片，后配分类code
    $scope.thirdFloor = {};
    $scope.thirdFloorClassification = {};
    $scope.thirdFloorTab = {};
    $scope.thirdCategory = {};
    $scope.f3nextBtn = true;
    $scope.f3upBtn = true;
    $scope.floor3callback = function (textData, floorShowLunbo) {
        $scope.textData3 = textData;
        var f3mpId = [];
        angular.forEach($scope.textData3.num1,function (val) {
            if(val.refObject != null){
                f3mpId.push(val.refObject.id);
            }
        });
        if(f3mpId.length > 0){
            $rootScope.ajax.get(_host + '/realTime/getPriceStockList', {mpIds: f3mpId}).then(function (res) {
                if (res.code == 0) {
                    angular.forEach($scope.textData3.num1,function (val) {
                        if(val.refObject != null){
                            angular.forEach(res.data.plist,function (val2) {
                                if(val.refObject.id == val2.mpId){
                                    val.refObject.realPrice = val2.availablePrice;
                                }
                            })
                        }
                    });
                }
            })
        }
        $scope.floor3ShowLunbo = floorShowLunbo;
        $scope.f3upBtn = false;
        $scope.f3nextBtn = false;
        if (!$scope.floor3ShowLunbo) {
            $scope.f3sevenBlocks = [];
            $scope.f3PageNo = 1;
            $scope.f3PageSize = 7;
            $scope.f3TotalPage =
                $scope.textData3.num1.length % $scope.f3PageSize == 0 ? (($scope.textData3.num1.length / $scope.f3PageSize) || 1) : parseInt($scope.textData3.num1.length / $scope.f3PageSize) + 1;
            $scope.f3sevenBlocks = $scope.textData3.num1.slice($scope.f3PageNo - 1, $scope.f3PageSize);
            if ($scope.f3PageNo < $scope.f3TotalPage) {
                $scope.f3nextBtn = true;
            }
        }
    };
    $scope.getThirdFloor = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'f3,f3_classification,f3_tab',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.getDolphinByMerchantId(url, params).then(function (res) {
            if (res.code == 0) {
                if (res.data.f3 != null && res.data.f3.length > 0) {
                    $scope.thirdFloor = res.data.f3[0];
                    if (res.data.f3_classification) {
                        $scope.thirdFloorClassification = res.data.f3_classification;
                        if ($scope.thirdFloorClassification[1]) {
                            var url = '/api/category/list?parentId='+$scope.thirdFloorClassification[1].content+'&level=3&companyId='+$rootScope.companyId;
                            $rootScope.ajax.getNoKey(url, {}).then(function (res) {
                                if (res.code == 0) {
                                    $scope.thirdCategory = res.data.categorys;
                                }
                            })
                        }
                    }
                    if (res.data.f3_tab) {
                        $scope.thirdFloorTab = res.data.f3_tab;
                        angular.forEach($scope.thirdFloorTab, function (val) {
                            val.select = false;
                            if (val.content.indexOf('f3_1_tab_banner') >= 0) {
                                $scope.getDataByAdCode(val, $scope.textData3, $scope.floor3ShowLunbo, $scope.floor3callback);
                            }
                        });
                        $scope.thirdFloorTab[0]?($scope.thirdFloorTab[0].select = true):($scope.thirdFloorTab[0].select = false);
                    }
                    $scope.getBannerThree();
                }
            }
        })
    };
    $scope.getThirdFloor();
    // 楼层推荐三
    $scope.getBannerThree = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'f3_recommendation',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.get(url, params).then(function (res) {
            if (res.data && res.data.f3_recommendation) {
                $scope.f3Recommendation = res.data.f3_recommendation[0];
            }
        })
    };

    //第二后tab后翻页，下一页
    $scope.thirdTurnNextPage = function () {
        if ($scope.f3PageNo >= $scope.f3TotalPage) {
            return;
        }
        $scope.f3PageNo++;
        if ($scope.f3PageNo == $scope.f3TotalPage) {
            $scope.f3nextBtn = false;
        }
        $scope.f3sevenBlocks = [];
        $scope.f3sevenBlocks = $scope.textData3.num1.slice(($scope.f3PageNo - 1) * $scope.f3PageSize, $scope.f3PageNo * $scope.f3PageSize);
        $scope.f3upBtn = true;
    };
    //第二后tab后翻页，上一页
    $scope.thirdTurnUpPage = function () {
        if ($scope.f3PageNo <= 1) {
            return
        }
        $scope.f3PageNo--;
        if ($scope.f3PageNo == 1) {
            $scope.f3upBtn = false;
        }
        $scope.f3sevenBlocks = [];
        $scope.f3sevenBlocks = $scope.textData3.num1.slice(($scope.f3PageNo - 1) * $scope.f3PageSize, $scope.f3PageNo * $scope.f3PageSize);
        $scope.f3nextBtn = true;
    };


    //楼层四,分类先配图片，后配分类code
    $scope.fourthFloor = {};
    $scope.fourthFloorClassification = {};
    $scope.fourthFloorTab = {};
    $scope.fourthCategory = {};
    $scope.f4nextBtn = true;
    $scope.f4upBtn = true;
    $scope.floor4callback = function (textData, floorShowLunbo) {
        $scope.textData4 = textData;
        var f4mpId = [];
        angular.forEach($scope.textData4.num1,function (val) {
            if(val.refObject != null){
                f4mpId.push(val.refObject.id);
            }
        });
        if(f4mpId.length > 0){
            $rootScope.ajax.get(_host + '/realTime/getPriceStockList', {mpIds: f4mpId}).then(function (res) {
                if (res.code == 0) {
                    angular.forEach($scope.textData4.num1,function (val) {
                        if(val.refObject != null){
                            angular.forEach(res.data.plist,function (val2) {
                                if(val.refObject.id == val2.mpId){
                                    val.refObject.realPrice = val2.availablePrice;
                                }
                            })
                        }
                    });
                }
            })
        }
        $scope.floor4ShowLunbo = floorShowLunbo;
        $scope.f4upBtn = false;
        $scope.f4nextBtn = false;
        if (!$scope.floor4ShowLunbo) {
            $scope.f4sevenBlocks = [];
            $scope.f4PageNo = 1;
            $scope.f4PageSize = 7;
            $scope.f4TotalPage =
                $scope.textData4.num1.length % $scope.f4PageSize == 0 ? (($scope.textData4.num1.length / $scope.f4PageSize) || 1) : parseInt($scope.textData4.num1.length / $scope.f4PageSize) + 1;
            $scope.f4sevenBlocks = $scope.textData4.num1.slice($scope.f4PageNo - 1, $scope.f4PageSize);
            if ($scope.f4PageNo < $scope.f4TotalPage) {
                $scope.f4nextBtn = true;
            }
        }
    };
    $scope.getFourthFloor = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'f4,f4_classification,f4_tab',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.getDolphinByMerchantId(url, params).then(function (res) {
            if (res.code == 0) {
                if (res.data.f4 != null && res.data.f4.length > 0) {
                    $scope.fourthFloor = res.data.f4[0];
                    if (res.data.f4_classification) {
                        $scope.fourthFloorClassification = res.data.f4_classification;
                        if ($scope.fourthFloorClassification[1]) {
                            var url = '/api/category/list?parentId='+$scope.fourthFloorClassification[1].content+'&level=3&companyId='+$rootScope.companyId;
                            $rootScope.ajax.getNoKey(url, {}).then(function (res) {
                                if (res.code == 0) {
                                    $scope.fourthCategory = res.data.categorys;
                                }
                            })
                        }
                    }
                    if (res.data.f4_tab) {
                        $scope.fourthFloorTab = res.data.f4_tab;
                        angular.forEach($scope.fourthFloorTab, function (val) {
                            val.select = false;
                            if (val.content.indexOf('f4_1_tab_banner') >= 0) {
                                $scope.getDataByAdCode(val, $scope.textData4, $scope.floor4ShowLunbo, $scope.floor4callback);
                            }
                        });
                        $scope.fourthFloorTab[0]?($scope.fourthFloorTab[0].select = true):($scope.fourthFloorTab[0].select = false);
                    }
                    $scope.getBannerFore();
                }
            }
        })
    };
    $scope.getFourthFloor();
    // 楼层推荐四
    $scope.getBannerFore = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'f4_recommendation',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.get(url, params).then(function (res) {
            if (res.data && res.data.f4_recommendation) {
                $scope.f4Recommendation = res.data.f4_recommendation[0];
            }
        })
    };

    //第二后tab后翻页，下一页
    $scope.fourthTurnNextPage = function () {
        if ($scope.f4PageNo >= $scope.f4TotalPage) {
            return;
        }
        $scope.f4PageNo++;
        if ($scope.f4PageNo == $scope.f4TotalPage) {
            $scope.f4nextBtn = false;
        }
        $scope.f4sevenBlocks = [];
        $scope.f4sevenBlocks = $scope.textData4.num1.slice(($scope.f4PageNo - 1) * $scope.f4PageSize, $scope.f4PageNo * $scope.f4PageSize);
        $scope.f4upBtn = true;
    };
    //第二后tab后翻页，上一页
    $scope.fourthTurnUpPage = function () {
        if ($scope.f4PageNo <= 1) {
            return
        }
        $scope.f4PageNo--;
        if ($scope.f4PageNo == 1) {
            $scope.f4upBtn = false;
        }
        $scope.f4sevenBlocks = [];
        $scope.f4sevenBlocks = $scope.textData4.num1.slice(($scope.f4PageNo - 1) * $scope.f4PageSize, $scope.f4PageNo * $scope.f4PageSize);
        $scope.f4nextBtn = true;
    };


    //楼层五,分类先配图片，后配分类code
    $scope.fifthFloor = {};
    $scope.fifthFloorClassification = {};
    $scope.fifthFloorTab = {};
    $scope.fifthCategory = {};
    $scope.f5nextBtn = true;
    $scope.f5upBtn = true;
    $scope.floor5callback = function (textData, floorShowLunbo) {
        $scope.textData5 = textData;
        var f5mpId = [];
        angular.forEach($scope.textData5.num1,function (val) {
            if(val.refObject != null){
                f5mpId.push(val.refObject.id);
            }
        });
        if(f5mpId.length > 0){
            $rootScope.ajax.get(_host + '/realTime/getPriceStockList', {mpIds: f5mpId}).then(function (res) {
                if (res.code == 0) {
                    angular.forEach($scope.textData5.num1,function (val) {
                        if(val.refObject != null){
                            angular.forEach(res.data.plist,function (val2) {
                                if(val.refObject.id == val2.mpId){
                                    val.refObject.realPrice = val2.availablePrice;
                                }
                            })
                        }
                    });
                }
            })
        }
        $scope.floor5ShowLunbo = floorShowLunbo;
        $scope.f5upBtn = false;
        $scope.f5nextBtn = false;
        if (!$scope.floor5ShowLunbo) {
            $scope.f5sevenBlocks = [];
            $scope.f5PageNo = 1;
            $scope.f5PageSize = 7;
            $scope.f5TotalPage =
                $scope.textData5.num1.length % $scope.f5PageSize == 0 ? (($scope.textData5.num1.length / $scope.f5PageSize) || 1) : parseInt($scope.textData5.num1.length / $scope.f5PageSize) + 1;
            $scope.f5sevenBlocks = $scope.textData5.num1.slice($scope.f5PageNo - 1, $scope.f5PageSize);
            if ($scope.f5PageNo < $scope.f5TotalPage) {
                $scope.f5nextBtn = true;
            }
        }
    };
    $scope.getFifthFloor = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'f5,f5_classification,f5_tab',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.getDolphinByMerchantId(url, params).then(function (res) {
            if (res.code == 0) {
                if (res.data.f5 !=null && res.data.f5.length > 0) {
                    $scope.fifthFloor = res.data.f5[0];
                    if (res.data.f5_classification) {
                        $scope.fifthFloorClassification = res.data.f5_classification;
                        if ($scope.fifthFloorClassification[1]) {
                            var url = '/api/category/list?parentId='+$scope.fifthFloorClassification[1].content+'&level=3&companyId='+$rootScope.companyId;
                            $rootScope.ajax.getNoKey(url, {}).then(function (res) {
                                if (res.code == 0) {
                                    $scope.fifthCategory = res.data.categorys;
                                }
                            })
                        }
                    }
                    if (res.data.f5_tab) {
                        $scope.fifthFloorTab = res.data.f5_tab;
                        angular.forEach($scope.fifthFloorTab, function (val) {
                            val.select = false;
                            if (val.content.indexOf('f5_1_tab_banner') >= 0) {
                                $scope.getDataByAdCode(val, $scope.textData5, $scope.floor5ShowLunbo, $scope.floor5callback);
                            }
                        });
                        $scope.fifthFloorTab[0]?($scope.fifthFloorTab[0].select = true):($scope.fifthFloorTab[0].select = false);
                    }
                    $scope.getBannerFive();
                }
            }
        })
    };
    $scope.getFifthFloor();
    // 楼层推荐五
    $scope.getBannerFive = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'f5_recommendation',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.get(url, params).then(function (res) {
            if (res.data && res.data.f5_recommendation) {
                $scope.f5Recommendation = res.data.f5_recommendation[0];
            }
        })
    };

    //第二后tab后翻页，下一页
    $scope.fifthTurnNextPage = function () {
        if ($scope.f5PageNo >= $scope.f5TotalPage) {
            return;
        }
        $scope.f5PageNo++;
        if ($scope.f5PageNo == $scope.f5TotalPage) {
            $scope.f5nextBtn = false;
        }
        $scope.f5sevenBlocks = [];
        $scope.f5sevenBlocks = $scope.textData5.num1.slice(($scope.f5PageNo - 1) * $scope.f5PageSize, $scope.f5PageNo * $scope.f5PageSize);
        $scope.f5upBtn = true;
    };
    //第二后tab后翻页，上一页
    $scope.fifthTurnUpPage = function () {
        if ($scope.f5PageNo <= 1) {
            return
        }
        $scope.f5PageNo--;
        if ($scope.f5PageNo == 1) {
            $scope.f5upBtn = false;
        }
        $scope.f5sevenBlocks = [];
        $scope.f5sevenBlocks = $scope.textData5.num1.slice(($scope.f5PageNo - 1) * $scope.f5PageSize, $scope.f5PageNo * $scope.f5PageSize);
        $scope.f5nextBtn = true;
    };

    //楼层六,分类先配图片，后配分类code
    $scope.sixthFloor = {};
    $scope.sixthFloorClassification = {};
    $scope.sixthFloorTab = {};
    $scope.sixthCategory = {};
    $scope.f6nextBtn = true;
    $scope.f6upBtn = true;
    $scope.floor6callback = function (textData, floorShowLunbo) {
        $scope.textData6 = textData;
        var f6mpId = [];
        angular.forEach($scope.textData6.num1,function (val) {
            if(val.refObject != null){
                f6mpId.push(val.refObject.id);
            }
        });
        if(f6mpId.length > 0){
            $rootScope.ajax.get(_host + '/realTime/getPriceStockList', {mpIds: f6mpId}).then(function (res) {
                if (res.code == 0) {
                    angular.forEach($scope.textData6.num1,function (val) {
                        if(val.refObject != null){
                            angular.forEach(res.data.plist,function (val2) {
                                if(val.refObject.id == val2.mpId){
                                    val.refObject.realPrice = val2.availablePrice;
                                }
                            })
                        }
                    });
                }
            })
        }
        $scope.floor6ShowLunbo = floorShowLunbo;
        $scope.f6upBtn = false;
        $scope.f6nextBtn = false;
        if (!$scope.floor6ShowLunbo) {
            $scope.f6sevenBlocks = [];
            $scope.f6PageNo = 1;
            $scope.f6PageSize = 7;
            $scope.f6TotalPage =
                $scope.textData6.num1.length % $scope.f6PageSize == 0 ? (($scope.textData6.num1.length / $scope.f6PageSize) || 1) : parseInt($scope.textData6.num1.length / $scope.f6PageSize) + 1;
            $scope.f6sevenBlocks = $scope.textData6.num1.slice($scope.f6PageNo - 1, $scope.f6PageSize);
            if ($scope.f6PageNo < $scope.f6TotalPage) {
                $scope.f6nextBtn = true;
            }
        }
    };
    $scope.getSixthFloor = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'f6,f6_classification,f6_tab',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.getDolphinByMerchantId(url, params).then(function (res) {
            if (res.code == 0) {
                if (res.data.f6 != null && res.data.f6.length > 0) {
                    $scope.sixthFloor = res.data.f6[0];
                    if (res.data.f6_classification) {
                        $scope.sixthFloorClassification = res.data.f6_classification;
                        if ($scope.sixthFloorClassification[1]) {
                            var url = '/api/category/list?parentId='+$scope.sixthFloorClassification[1].content+'&level=3&companyId='+$rootScope.companyId;
                            $rootScope.ajax.getNoKey(url, {}).then(function (res) {
                                if (res.code == 0) {
                                    $scope.sixthCategory = res.data.categorys;
                                }
                            })
                        }
                    }
                    if (res.data.f6_tab) {
                        $scope.sixthFloorTab = res.data.f6_tab;
                        angular.forEach($scope.sixthFloorTab, function (val) {
                            val.select = false;
                            if (val.content.indexOf('f6_1_tab_banner') >= 0) {
                                $scope.getDataByAdCode(val, $scope.textData6, $scope.floor6ShowLunbo, $scope.floor6callback);
                            }
                        });
                        $scope.sixthFloorTab[0]?($scope.sixthFloorTab[0].select = true):($scope.sixthFloorTab[0].select = false);
                    }
                    $scope.getBannersix();
                }
            }
        })
    };
    $scope.getSixthFloor();
    // 楼层推荐六
    $scope.getBannersix = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'f6_recommendation',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.get(url, params).then(function (res) {
            if (res.data && res.data.f6_recommendation) {
                $scope.f6Recommendation = res.data.f6_recommendation[0];
            }
        })
    };

    //第二后tab后翻页，下一页
    $scope.sixthTurnNextPage = function () {
        if ($scope.f6PageNo >= $scope.f6TotalPage) {
            return;
        }
        $scope.f6PageNo++;
        if ($scope.f6PageNo == $scope.f6TotalPage) {
            $scope.f6nextBtn = false;
        }
        $scope.f6sevenBlocks = [];
        $scope.f6sevenBlocks = $scope.textData6.num1.slice(($scope.f6PageNo - 1) * $scope.f6PageSize, $scope.f6PageNo * $scope.f6PageSize);
        $scope.f6upBtn = true;
    };
    //第二后tab后翻页，上一页
    $scope.sixthTurnUpPage = function () {
        if ($scope.f6PageNo <= 1) {
            return
        }
        $scope.f6PageNo--;
        if ($scope.f6PageNo == 1) {
            $scope.f6upBtn = false;
        }
        $scope.f6sevenBlocks = [];
        $scope.f6sevenBlocks = $scope.textData6.num1.slice(($scope.f6PageNo - 1) * $scope.f6PageSize, $scope.f6PageNo * $scope.f6PageSize);
        $scope.f6nextBtn = true;
    };


    //楼层七,分类先配图片，后配分类code
    $scope.seventhFloor = {};
    $scope.seventhFloorClassification = {};
    $scope.seventhFloorTab = {};
    $scope.seventhCategory = {};
    $scope.f7nextBtn = true;
    $scope.f7upBtn = true;
    $scope.floor7callback = function (textData, floorShowLunbo) {
        $scope.textData7 = textData;
        var f7mpId = [];
        angular.forEach($scope.textData7.num1,function (val) {
            if(val.refObject != null){
                f7mpId.push(val.refObject.id);
            }
        });
        if(f7mpId.length > 0){
            $rootScope.ajax.get(_host + '/realTime/getPriceStockList', {mpIds: f7mpId}).then(function (res) {
                if (res.code == 0) {
                    angular.forEach($scope.textData7.num1,function (val) {
                        if(val.refObject != null){
                            angular.forEach(res.data.plist,function (val2) {
                                if(val.refObject.id == val2.mpId){
                                    val.refObject.realPrice = val2.availablePrice;
                                }
                            })
                        }
                    });
                }
            })
        }
        $scope.floor7ShowLunbo = floorShowLunbo;
        $scope.f7upBtn = false;
        $scope.f7nextBtn = false;
        if (!$scope.floor7ShowLunbo) {
            $scope.f7sevenBlocks = [];
            $scope.f7PageNo = 1;
            $scope.f7PageSize = 7;
            $scope.f7TotalPage =
                $scope.textData7.num1.length % $scope.f7PageSize == 0 ? (($scope.textData7.num1.length / $scope.f7PageSize) || 1) : parseInt($scope.textData7.num1.length / $scope.f7PageSize) + 1;
            $scope.f7sevenBlocks = $scope.textData7.num1.slice($scope.f7PageNo - 1, $scope.f7PageSize);
            if ($scope.f7PageNo < $scope.f7TotalPage) {
                $scope.f7nextBtn = true;
            }
        }
    };
    $scope.getSeventhFloor = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'f7,f7_classification,f7_tab',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.getDolphinByMerchantId(url, params).then(function (res) {
            if (res.code == 0) {
                if (res.data.f7 != null && res.data.f7.length >0) {
                    $scope.seventhFloor = res.data.f7[0];
                    if (res.data.f7_classification) {
                        $scope.seventhFloorClassification = res.data.f7_classification;
                        if ($scope.seventhFloorClassification[1]) {
                            var url = '/api/category/list?parentId='+$scope.seventhFloorClassification[1].content+'&level=3&companyId='+$rootScope.companyId;
                            $rootScope.ajax.getNoKey(url, {}).then(function (res) {
                                if (res.code == 0) {
                                    $scope.seventhCategory = res.data.categorys;
                                }
                            })
                        }
                    }
                    if (res.data.f7_tab) {
                        $scope.seventhFloorTab = res.data.f7_tab;
                        angular.forEach($scope.seventhFloorTab, function (val) {
                            val.select = false;
                            if (val.content.indexOf('f7_1_tab_banner') >= 0) {
                                $scope.getDataByAdCode(val, $scope.textData7, $scope.floor7ShowLunbo, $scope.floor7callback);
                            }
                        });
                        $scope.seventhFloorTab[0]?($scope.seventhFloorTab[0].select = true):($scope.seventhFloorTab[0].select = false);
                    }
                    $scope.getBannerseven();
                }
            }
        })
    };
    $scope.getSeventhFloor();
    // 楼层推荐七
    $scope.getBannerseven = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'f7_recommendation',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.get(url, params).then(function (res) {
            if (res.data && res.data.f7_recommendation) {
                $scope.f7Recommendation = res.data.f7_recommendation[0];
            }
        })
    };

    //第二后tab后翻页，下一页
    $scope.seventhTurnNextPage = function () {
        if ($scope.f7PageNo >= $scope.f7TotalPage) {
            return;
        }
        $scope.f7PageNo++;
        if ($scope.f7PageNo == $scope.f7TotalPage) {
            $scope.f7nextBtn = false;
        }
        $scope.f7sevenBlocks = [];
        $scope.f7sevenBlocks = $scope.textData7.num1.slice(($scope.f7PageNo - 1) * $scope.f7PageSize, $scope.f7PageNo * $scope.f7PageSize);
        $scope.f7upBtn = true;
    };
    //第二后tab后翻页，上一页
    $scope.seventhTurnUpPage = function () {
        if ($scope.f7PageNo <= 1) {
            return
        }
        $scope.f7PageNo--;
        if ($scope.f7PageNo == 1) {
            $scope.f7upBtn = false;
        }
        $scope.f7sevenBlocks = [];
        $scope.f7sevenBlocks = $scope.textData7.num1.slice(($scope.f7PageNo - 1) * $scope.f7PageSize, $scope.f7PageNo * $scope.f7PageSize);
        $scope.f7nextBtn = true;
    };

    //楼层八,分类先配图片，后配分类code
    $scope.eighthFloor = {};
    $scope.eighthFloorClassification = {};
    $scope.eighthFloorTab = {};
    $scope.eighthCategory = {};
    $scope.f8nextBtn = true;
    $scope.f8upBtn = true;
    $scope.floor8callback = function (textData, floorShowLunbo) {
        $scope.textData8 = textData;
        var f8mpId = [];
        angular.forEach($scope.textData8.num1,function (val) {
            if(val.refObject != null){
                f8mpId.push(val.refObject.id);
            }
        });
        if(f8mpId.length > 0){
            $rootScope.ajax.get(_host + '/realTime/getPriceStockList', {mpIds: f8mpId}).then(function (res) {
                if (res.code == 0) {
                    angular.forEach($scope.textData8.num1,function (val) {
                        if(val.refObject != null){
                            angular.forEach(res.data.plist,function (val2) {
                                if(val.refObject.id == val2.mpId){
                                    val.refObject.realPrice = val2.availablePrice;
                                }
                            })
                        }
                    });
                }
            })
        }
        $scope.floor8ShowLunbo = floorShowLunbo;
        $scope.f8upBtn = false;
        $scope.f8nextBtn = false;
        if (!$scope.floor8ShowLunbo) {
            $scope.f8sevenBlocks = [];
            $scope.f8PageNo = 1;
            $scope.f8PageSize = 7;
            $scope.f8TotalPage =
                $scope.textData8.num1.length % $scope.f8PageSize == 0 ? (($scope.textData8.num1.length / $scope.f8PageSize) || 1) : parseInt($scope.textData8.num1.length / $scope.f8PageSize) + 1;
            $scope.f8sevenBlocks = $scope.textData8.num1.slice($scope.f8PageNo - 1, $scope.f8PageSize);
            if ($scope.f8PageNo < $scope.f8TotalPage) {
                $scope.f8nextBtn = true;
            }
        }
    };
    $scope.getEighthFloor = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'f8,f8_classification,f8_tab',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.getDolphinByMerchantId(url, params).then(function (res) {
            if (res.code == 0) {
                if (res.data.f8 != null && res.data.f8.length > 0) {
                    $scope.eighthFloor = res.data.f8[0];
                    if (res.data.f8_classification) {
                        $scope.eighthFloorClassification = res.data.f8_classification;
                        if ($scope.eighthFloorClassification[1]) {
                            var url = '/api/category/list?parentId='+$scope.eighthFloorClassification[1].content+'&level=3&companyId='+$rootScope.companyId;
                            $rootScope.ajax.getNoKey(url, {}).then(function (res) {
                                if (res.code == 0) {
                                    $scope.eighthCategory = res.data.categorys;
                                }
                            })
                        }
                    }
                    if (res.data.f8_tab) {
                        $scope.eighthFloorTab = res.data.f8_tab;
                        angular.forEach($scope.eighthFloorTab, function (val) {
                            val.select = false;
                            if (val.content.indexOf('f8_1_tab_banner') >= 0) {
                                $scope.getDataByAdCode(val, $scope.textData8, $scope.floor8ShowLunbo, $scope.floor8callback);
                            }
                        });
                        $scope.eighthFloorTab[0]?($scope.eighthFloorTab[0].select = true):($scope.eighthFloorTab[0].select = false);
                    }
                    $scope.getBannerEight();
                }
            }
        })
    };
    $scope.getEighthFloor();
    // 楼层推荐八
    $scope.getBannerEight = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'f8_recommendation',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.get(url, params).then(function (res) {
            if (res.data && res.data.f8_recommendation) {
                $scope.f8Recommendation = res.data.f8_recommendation[0];
            }
        })
    };

    //第二后tab后翻页，下一页
    $scope.eighthTurnNextPage = function () {
        if ($scope.f8PageNo >= $scope.f8TotalPage) {
            return;
        }
        $scope.f8PageNo++;
        if ($scope.f8PageNo == $scope.f8TotalPage) {
            $scope.f8nextBtn = false;
        }
        $scope.f8sevenBlocks = [];
        $scope.f8sevenBlocks = $scope.textData8.num1.slice(($scope.f8PageNo - 1) * $scope.f8PageSize, $scope.f8PageNo * $scope.f8PageSize);
        $scope.f8upBtn = true;
    };
    //第二后tab后翻页，上一页
    $scope.eighthTurnUpPage = function () {
        if ($scope.f8PageNo <= 1) {
            return
        }
        $scope.f8PageNo--;
        if ($scope.f8PageNo == 1) {
            $scope.f8upBtn = false;
        }
        $scope.f8sevenBlocks = [];
        $scope.f8sevenBlocks = $scope.textData8.num1.slice(($scope.f8PageNo - 1) * $scope.f8PageSize, $scope.f8PageNo * $scope.f8PageSize);
        $scope.f8nextBtn = true;
    };


    //楼层九,分类先配图片，后配分类code
    $scope.ninthFloor = {};
    $scope.ninthFloorClassification = {};
    $scope.ninthFloorTab = {};
    $scope.ninthCategory = {};
    $scope.f9nextBtn = true;
    $scope.f9upBtn = true;
    $scope.floor9callback = function (textData, floorShowLunbo) {
        $scope.textData9 = textData;
        var f9mpId = [];
        angular.forEach($scope.textData9.num1,function (val) {
            if(val.refObject != null){
                f9mpId.push(val.refObject.id);
            }
        });
        if(f9mpId.length > 0){
            $rootScope.ajax.get(_host + '/realTime/getPriceStockList', {mpIds: f9mpId}).then(function (res) {
                if (res.code == 0) {
                    angular.forEach($scope.textData9.num1,function (val) {
                        if(val.refObject != null){
                            angular.forEach(res.data.plist,function (val2) {
                                if(val.refObject.id == val2.mpId){
                                    val.refObject.realPrice = val2.availablePrice;
                                }
                            })
                        }
                    });
                }
            })
        }
        $scope.floor9ShowLunbo = floorShowLunbo;
        $scope.f9upBtn = false;
        $scope.f9nextBtn = false;
        if (!$scope.floor9ShowLunbo) {
            $scope.f9sevenBlocks = [];
            $scope.f9PageNo = 1;
            $scope.f9PageSize = 7;
            $scope.f9TotalPage =
                $scope.textData9.num1.length % $scope.f9PageSize == 0 ? (($scope.textData9.num1.length / $scope.f9PageSize) || 1) : parseInt($scope.textData9.num1.length / $scope.f9PageSize) + 1;
            $scope.f9sevenBlocks = $scope.textData9.num1.slice($scope.f9PageNo - 1, $scope.f9PageSize);
            if ($scope.f9PageNo < $scope.f9TotalPage) {
                $scope.f9nextBtn = true;
            }
        }
    };
    $scope.getninthFloor = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'f9,f9_classification,f9_tab',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.getDolphinByMerchantId(url, params).then(function (res) {
            if (res.code == 0) {
                if (res.data.f9 != null && res.data.f9.length>0) {
                    $scope.ninthFloor = res.data.f9[0];
                    if (res.data.f9_classification) {
                        $scope.ninthFloorClassification = res.data.f9_classification;
                        if ($scope.ninthFloorClassification[1]) {
                            var url = '/api/category/list?parentId='+$scope.ninthFloorClassification[1].content+'&level=3&companyId='+$rootScope.companyId;
                            $rootScope.ajax.getNoKey(url, {}).then(function (res) {
                                if (res.code == 0) {
                                    $scope.ninthCategory = res.data.categorys;
                                }
                            })
                        }
                    }
                    if (res.data.f9_tab) {
                        $scope.ninthFloorTab = res.data.f9_tab;
                        angular.forEach($scope.ninthFloorTab, function (val) {
                            val.select = false;
                            if (val.content.indexOf('f9_1_tab_banner') >= 0) {
                                $scope.getDataByAdCode(val, $scope.textData9, $scope.floor9ShowLunbo, $scope.floor9callback);
                            }
                        });
                        $scope.ninthFloorTab[0]?($scope.ninthFloorTab[0].select = true):($scope.ninthFloorTab[0].select = false);
                    }
                    $scope.getBannerNight();
                }

            }
        })
    };
    $scope.getninthFloor();
    // 楼层推荐九
    $scope.getBannerNight = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'f9_recommendation',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.get(url, params).then(function (res) {
            if (res.data && res.data.f9_recommendation) {
                $scope.f9Recommendation = res.data.f9_recommendation[0];
            }
        })
    };

    //第二后tab后翻页，下一页
    $scope.ninthTurnNextPage = function () {
        if ($scope.f9PageNo >= $scope.f9TotalPage) {
            return;
        }
        $scope.f9PageNo++;
        if ($scope.f9PageNo == $scope.f9TotalPage) {
            $scope.f9nextBtn = false;
        }
        $scope.f9sevenBlocks = [];
        $scope.f9sevenBlocks = $scope.textData9.num1.slice(($scope.f9PageNo - 1) * $scope.f9PageSize, $scope.f9PageNo * $scope.f9PageSize);
        $scope.f9upBtn = true;
    };
    //第二后tab后翻页，上一页
    $scope.ninthTurnUpPage = function () {
        if ($scope.f9PageNo <= 1) {
            return
        }
        $scope.f9PageNo--;
        if ($scope.f9PageNo == 1) {
            $scope.f9upBtn = false;
        }
        $scope.f9sevenBlocks = [];
        $scope.f9sevenBlocks = $scope.textData9.num1.slice(($scope.f9PageNo - 1) * $scope.f9PageSize, $scope.f9PageNo * $scope.f9PageSize);
        $scope.f9nextBtn = true;
    };

    //楼层十,分类先配图片，后配分类code
    $scope.tenthFloor = {};
    $scope.tenthFloorClassification = {};
    $scope.tenthFloorTab = {};
    $scope.tenthCategory = {};
    $scope.f10nextBtn = true;
    $scope.f10upBtn = true;
    $scope.floor10callback = function (textData, floorShowLunbo) {
        $scope.textData10 = textData;
        var f10mpId = [];
        angular.forEach($scope.textData10.num1,function (val) {
            if(val.refObject != null){
                f10mpId.push(val.refObject.id);
            }
        });
        if(f10mpId.length > 0){
            $rootScope.ajax.get(_host + '/realTime/getPriceStockList', {mpIds: f10mpId}).then(function (res) {
                if (res.code == 0) {
                    angular.forEach($scope.textData10.num1,function (val) {
                        if(val.refObject != null){
                            angular.forEach(res.data.plist,function (val2) {
                                if(val.refObject.id == val2.mpId){
                                    val.refObject.realPrice = val2.availablePrice;
                                }
                            })
                        }
                    });
                }
            })
        }
        $scope.floor10ShowLunbo = floorShowLunbo;
        $scope.f10upBtn = false;
        $scope.f10nextBtn = false;
        if (!$scope.floor10ShowLunbo) {
            $scope.f10sevenBlocks = [];
            $scope.f10PageNo = 1;
            $scope.f10PageSize = 7;
            $scope.f10TotalPage =
                $scope.textData10.num1.length % $scope.f10PageSize == 0 ? (($scope.textData10.num1.length / $scope.f10PageSize) || 1) : parseInt($scope.textData10.num1.length / $scope.f10PageSize) + 1;
            $scope.f10sevenBlocks = $scope.textData10.num1.slice($scope.f10PageNo - 1, $scope.f10PageSize);
            if ($scope.f10PageNo < $scope.f10TotalPage) {
                $scope.f10nextBtn = true;
            }
        }
    };
    $scope.getTenthFloor = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'f10,f10_classification,f10_tab',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.getDolphinByMerchantId(url, params).then(function (res) {
            if (res.code == 0) {
                if (res.data.f10 != null && res.data.f10.length>0) {
                    $scope.tenthFloor = res.data.f10[0];
                    if (res.data.f10_classification) {
                        $scope.tenthFloorClassification = res.data.f10_classification;
                        if ($scope.tenthFloorClassification[1]) {
                            var url = '/api/category/list?parentId='+$scope.tenthFloorClassification[1].content+'&level=3&companyId='+$rootScope.companyId;
                            $rootScope.ajax.getNoKey(url, {}).then(function (res) {
                                if (res.code == 0) {
                                    $scope.tenthCategory = res.data.categorys;
                                }
                            })
                        }
                    }
                    if (res.data.f10_tab) {
                        $scope.tenthFloorTab = res.data.f10_tab;
                        angular.forEach($scope.tenthFloorTab, function (val) {
                            val.select = false;
                            if (val.content.indexOf('f10_1_tab_banner') >= 0) {
                                $scope.getDataByAdCode(val, $scope.textData10, $scope.floor10ShowLunbo, $scope.floor10callback);
                            }
                        });
                        $scope.tenthFloorTab[0]?($scope.tenthFloorTab[0].select = true):($scope.tenthFloorTab[0].select = false);
                    }
                    $scope.getBannerTen();
                }
            }
        })
    };
    $scope.getTenthFloor();
    // 楼层推荐十
    $scope.getBannerTen = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'f10_recommendation',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.get(url, params).then(function (res) {
            if (res.data && res.data.f10_recommendation) {
                $scope.f10Recommendation = res.data.f10_recommendation[0];
            }
        })
    };

    //第二后tab后翻页，下一页
    $scope.tenthTurnNextPage = function () {
        if ($scope.f10PageNo >= $scope.f10TotalPage) {
            return;
        }
        $scope.f10PageNo++;
        if ($scope.f10PageNo == $scope.f10TotalPage) {
            $scope.f10nextBtn = false;
        }
        $scope.f10sevenBlocks = [];
        $scope.f10sevenBlocks = $scope.textData10.num1.slice(($scope.f10PageNo - 1) * $scope.f10PageSize, $scope.f10PageNo * $scope.f10PageSize);
        $scope.f10upBtn = true;
    };
    //第二后tab后翻页，上一页
    $scope.tenthTurnUpPage = function () {
        if ($scope.f10PageNo <= 1) {
            return
        }
        $scope.f10PageNo--;
        if ($scope.f10PageNo == 1) {
            $scope.f10upBtn = false;
        }
        $scope.f10sevenBlocks = [];
        $scope.f10sevenBlocks = $scope.textData10.num1.slice(($scope.f10PageNo - 1) * $scope.f10PageSize, $scope.f10PageNo * $scope.f10PageSize);
        $scope.f10nextBtn = true;
    };

    //楼层十一,分类先配图片，后配分类code
    $scope.eleventhFloor = {};
    $scope.eleventhFloorClassification = {};
    $scope.eleventhFloorTab = {};
    $scope.eleventhCategory = {};
    $scope.f11nextBtn = true;
    $scope.f11upBtn = true;
    $scope.floor11callback = function (textData, floorShowLunbo) {
        $scope.textData11 = textData;
        var f11mpId = [];
        angular.forEach($scope.textData11.num1,function (val) {
            if(val.refObject != null){
                f11mpId.push(val.refObject.id);
            }
        });
        if(f11mpId.length > 0){
            $rootScope.ajax.get(_host + '/realTime/getPriceStockList', {mpIds: f11mpId}).then(function (res) {
                if (res.code == 0) {
                    angular.forEach($scope.textData11.num1,function (val) {
                        if(val.refObject != null){
                            angular.forEach(res.data.plist,function (val2) {
                                if(val.refObject.id == val2.mpId){
                                    val.refObject.realPrice = val2.availablePrice;
                                }
                            })
                        }
                    });
                }
            })
        }
        $scope.floor11ShowLunbo = floorShowLunbo;
        $scope.f11upBtn = false;
        $scope.f11nextBtn = false;
        if (!$scope.floor11ShowLunbo) {
            $scope.f11sevenBlocks = [];
            $scope.f11PageNo = 1;
            $scope.f11PageSize = 7;
            $scope.f11TotalPage =
                $scope.textData11.num1.length % $scope.f11PageSize == 0 ? (($scope.textData11.num1.length / $scope.f11PageSize) || 1) : parseInt($scope.textData11.num1.length / $scope.f11PageSize) + 1;
            $scope.f11sevenBlocks = $scope.textData11.num1.slice($scope.f11PageNo - 1, $scope.f11PageSize);
            if ($scope.f11PageNo < $scope.f11TotalPage) {
                $scope.f11nextBtn = true;
            }
        }
    };
    $scope.getEleventhFloor = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'f11,f11_classification,f11_tab',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.getDolphinByMerchantId(url, params).then(function (res) {
            if (res.code == 0) {
                if (res.data.f11 != null && res.data.f11.length>0) {
                    $scope.eleventhFloor = res.data.f11[0];
                    if (res.data.f11_classification) {
                        $scope.eleventhFloorClassification = res.data.f11_classification;
                        if ($scope.eleventhFloorClassification[1]) {
                            var url = '/api/category/list?parentId='+$scope.eleventhFloorClassification[1].content+'&level=3&companyId='+$rootScope.companyId;
                            $rootScope.ajax.getNoKey(url, {}).then(function (res) {
                                if (res.code == 0) {
                                    $scope.eleventhCategory = res.data.categorys;
                                }
                            })
                        }
                    }
                    if (res.data.f11_tab) {
                        $scope.eleventhFloorTab = res.data.f11_tab;
                        angular.forEach($scope.eleventhFloorTab, function (val) {
                            val.select = false;
                            if (val.content.indexOf('f11_1_tab_banner') >= 0) {
                                $scope.getDataByAdCode(val, $scope.textData11, $scope.floor11ShowLunbo, $scope.floor11callback);
                            }
                        });
                        $scope.eleventhFloorTab[0]?($scope.eleventhFloorTab[0].select = true):($scope.eleventhFloorTab[0].select = false);
                    }
                    $scope.getBannerTenOne();
                }
            }
        })
    };
    $scope.getEleventhFloor();
    // 楼层推荐十一
    $scope.getBannerTenOne = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'f11_recommendation',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.get(url, params).then(function (res) {
            if (res.data && res.data.f11_recommendation) {
                $scope.f11Recommendation = res.data.f11_recommendation[0];
            }
        })
    };

    //第二后tab后翻页，下一页
    $scope.eleventhTurnNextPage = function () {
        if ($scope.f11PageNo >= $scope.f11TotalPage) {
            return;
        }
        $scope.f11PageNo++;
        if ($scope.f11PageNo == $scope.f11TotalPage) {
            $scope.f11nextBtn = false;
        }
        $scope.f11sevenBlocks = [];
        $scope.f11sevenBlocks = $scope.textData11.num1.slice(($scope.f11PageNo - 1) * $scope.f11PageSize, $scope.f11PageNo * $scope.f11PageSize);
        $scope.f11upBtn = true;
    };
    //第二后tab后翻页，上一页
    $scope.eleventhTurnUpPage = function () {
        if ($scope.f11PageNo <= 1) {
            return
        }
        $scope.f11PageNo--;
        if ($scope.f11PageNo == 1) {
            $scope.f11upBtn = false;
        }
        $scope.f11sevenBlocks = [];
        $scope.f11sevenBlocks = $scope.textData11.num1.slice(($scope.f11PageNo - 1) * $scope.f11PageSize, $scope.f11PageNo * $scope.f11PageSize);
        $scope.f11nextBtn = true;
    };

//楼层十二,分类先配图片，后配分类code
    $scope.twelfthFloor = {};
    $scope.twelfthFloorClassification = {};
    $scope.twelfthFloorTab = {};
    $scope.twelfthCategory = {};
    $scope.f12nextBtn = true;
    $scope.f12upBtn = true;
    $scope.floor12callback = function (textData, floorShowLunbo) {
        $scope.textData12 = textData;
        var f12mpId = [];
        angular.forEach($scope.textData12.num1,function (val) {
            if(val.refObject != null){
                f12mpId.push(val.refObject.id);
            }
        });
        if(f12mpId.length > 0){
            $rootScope.ajax.get(_host + '/realTime/getPriceStockList', {mpIds: f12mpId}).then(function (res) {
                if (res.code == 0) {
                    angular.forEach($scope.textData12.num1,function (val) {
                        if(val.refObject != null){
                            angular.forEach(res.data.plist,function (val2) {
                                if(val.refObject.id == val2.mpId){
                                    val.refObject.realPrice = val2.availablePrice;
                                }
                            })
                        }
                    });
                }
            })
        }
        $scope.floor12ShowLunbo = floorShowLunbo;
        $scope.f12upBtn = false;
        $scope.f12nextBtn = false;
        if (!$scope.floor12ShowLunbo) {
            $scope.f12sevenBlocks = [];
            $scope.f12PageNo = 1;
            $scope.f12PageSize = 7;
            $scope.f12TotalPage =
                $scope.textData12.num1.length % $scope.f12PageSize == 0 ? (($scope.textData12.num1.length / $scope.f12PageSize) || 1) : parseInt($scope.textData12.num1.length / $scope.f12PageSize) + 1;
            $scope.f12sevenBlocks = $scope.textData12.num1.slice($scope.f12PageNo - 1, $scope.f12PageSize);
            if ($scope.f12PageNo < $scope.f12TotalPage) {
                $scope.f12nextBtn = true;
            }
        }
    };
    $scope.getTwelfthFloor = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'f12,f12_classification,f12_tab',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.getDolphinByMerchantId(url, params).then(function (res) {
            if (res.code == 0) {
                if (res.data.f12 != null && res.data.f12.length>0) {
                    $scope.twelfthFloor = res.data.f12[0];
                    if (res.data.f12_classification) {
                        $scope.twelfthFloorClassification = res.data.f12_classification;
                        if ($scope.twelfthFloorClassification[1]) {
                            var url = '/api/category/list?parentId='+$scope.twelfthFloorClassification[1].content+'&level=3&companyId='+$rootScope.companyId;
                            $rootScope.ajax.getNoKey(url, {}).then(function (res) {
                                if (res.code == 0) {
                                    $scope.twelfthCategory = res.data.categorys;
                                }
                            })
                        }
                    }
                    if (res.data.f12_tab) {
                        $scope.twelfthFloorTab = res.data.f12_tab;
                        angular.forEach($scope.twelfthFloorTab, function (val) {
                            val.select = false;
                            if (val.content.indexOf('f12_1_tab_banner') >= 0) {
                                $scope.getDataByAdCode(val, $scope.textData12, $scope.floor12ShowLunbo, $scope.floor12callback);
                            }
                        });
                        $scope.twelfthFloorTab[0]?($scope.twelfthFloorTab[0].select = true):($scope.twelfthFloorTab[0].select = false);
                    }
                    $scope.getBannerTenTwo();
                }
            }
        })
    };
    $scope.getTwelfthFloor();
    // 楼层推荐十二
    $scope.getBannerTenTwo = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'f12_recommendation',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.get(url, params).then(function (res) {
            if (res.data && res.data.f12_recommendation) {
                $scope.f12Recommendation = res.data.f12_recommendation[0];
            }
        })
    };

//第二后tab后翻页，下一页
    $scope.twelfthTurnNextPage = function () {
        if ($scope.f12PageNo >= $scope.f12TotalPage) {
            return;
        }
        $scope.f12PageNo++;
        if ($scope.f12PageNo == $scope.f12TotalPage) {
            $scope.f12nextBtn = false;
        }
        $scope.f12sevenBlocks = [];
        $scope.f12sevenBlocks = $scope.textData12.num1.slice(($scope.f12PageNo - 1) * $scope.f12PageSize, $scope.f12PageNo * $scope.f12PageSize);
        $scope.f12upBtn = true;
    };
//第二后tab后翻页，上一页
    $scope.twelfthTurnUpPage = function () {
        if ($scope.f12PageNo <= 1) {
            return
        }
        $scope.f12PageNo--;
        if ($scope.f12PageNo == 1) {
            $scope.f12upBtn = false;
        }
        $scope.f12sevenBlocks = [];
        $scope.f12sevenBlocks = $scope.textData12.num1.slice(($scope.f12PageNo - 1) * $scope.f12PageSize, $scope.f12PageNo * $scope.f12PageSize);
        $scope.f12nextBtn = true;
    };

//楼层十三,分类先配图片，后配分类code
    $scope.thirteenthFloor = {};
    $scope.thirteenthFloorClassification = {};
    $scope.thirteenthFloorTab = {};
    $scope.thirteenthCategory = {};
    $scope.f13nextBtn = true;
    $scope.f13upBtn = true;
    $scope.floor13callback = function (textData, floorShowLunbo) {
        $scope.textData13 = textData;
        var f13mpId = [];
        angular.forEach($scope.textData3.num13,function (val) {
            if(val.refObject != null){
                f13mpId.push(val.refObject.id);
            }
        });
        if(f13mpId.length > 0){
            $rootScope.ajax.get(_host + '/realTime/getPriceStockList', {mpIds: f13mpId}).then(function (res) {
                if (res.code == 0) {
                    angular.forEach($scope.textData13.num1,function (val) {
                        if(val.refObject != null){
                            angular.forEach(res.data.plist,function (val2) {
                                if(val.refObject.id == val2.mpId){
                                    val.refObject.realPrice = val2.availablePrice;
                                }
                            })
                        }
                    });
                }
            })
        }
        $scope.floor13ShowLunbo = floorShowLunbo;
        $scope.f13upBtn = false;
        $scope.f13nextBtn = false;
        if (!$scope.floor13ShowLunbo) {
            $scope.f13sevenBlocks = [];
            $scope.f13PageNo = 1;
            $scope.f13PageSize = 7;
            $scope.f13TotalPage =
                $scope.textData13.num1.length % $scope.f13PageSize == 0 ? (($scope.textData13.num1.length / $scope.f13PageSize) || 1) : parseInt($scope.textData13.num1.length / $scope.f13PageSize) + 1;
            $scope.f13sevenBlocks = $scope.textData13.num1.slice($scope.f13PageNo - 1, $scope.f13PageSize);
            if ($scope.f13PageNo < $scope.f13TotalPage) {
                $scope.f13nextBtn = true;
            }
        }
    };
    $scope.getThirteenthFloor = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'f13,f13_classification,f13_tab',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.getDolphinByMerchantId(url, params).then(function (res) {
            if (res.code == 0) {
                if (res.data.f13 != null && res.data.f13.length>0) {
                    $scope.thirteenthFloor = res.data.f13[0];
                    if (res.data.f13_classification) {
                        $scope.thirteenthFloorClassification = res.data.f13_classification;
                        if ($scope.thirteenthFloorClassification[1]) {
                            var url = '/api/category/list?parentId='+$scope.thirteenthFloorClassification[1].content+'&level=3&companyId='+$rootScope.companyId;
                            $rootScope.ajax.getNoKey(url, {}).then(function (res) {
                                if (res.code == 0) {
                                    $scope.thirteenthCategory = res.data.categorys;
                                }
                            })
                        }
                    }
                    if (res.data.f13_tab) {
                        $scope.thirteenthFloorTab = res.data.f13_tab;
                        angular.forEach($scope.thirteenthFloorTab, function (val) {
                            val.select = false;
                            if (val.content.indexOf('f13_1_tab_banner') >= 0) {
                                $scope.getDataByAdCode(val, $scope.textData13, $scope.floor13ShowLunbo, $scope.floor13callback);
                            }
                        });
                        $scope.thirteenthFloorTab[0]?( $scope.thirteenthFloorTab[0].select = true):( $scope.thirteenthFloorTab[0].select = false);
                    }
                    $scope.getBannerTenThree();
                }
            }
        })
    };
    $scope.getThirteenthFloor();
    // 楼层推荐十三
    $scope.getBannerTenThree = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'f13_recommendation',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.get(url, params).then(function (res) {
            if (res.data && res.data.f13_recommendation) {
                $scope.f13Recommendation = res.data.f13_recommendation[0];
            }
        })
    };

    //第二后tab后翻页，下一页
    $scope.thirteenthTurnNextPage = function () {
        if ($scope.f13PageNo >= $scope.f13TotalPage) {
            return;
        }
        $scope.f13PageNo++;
        if ($scope.f13PageNo == $scope.f13TotalPage) {
            $scope.f13nextBtn = false;
        }
        $scope.f13sevenBlocks = [];
        $scope.f13sevenBlocks = $scope.textData13.num1.slice(($scope.f13PageNo - 1) * $scope.f13PageSize, $scope.f13PageNo * $scope.f13PageSize);
        $scope.f13upBtn = true;
    };
    //第二后tab后翻页，上一页
    $scope.thirteenthTurnUpPage = function () {
        if ($scope.f13PageNo <= 1) {
            return
        }
        $scope.f13PageNo--;
        if ($scope.f13PageNo == 1) {
            $scope.f13upBtn = false;
        }
        $scope.f13sevenBlocks = [];
        $scope.f13sevenBlocks = $scope.textData13.num1.slice(($scope.f13PageNo - 1) * $scope.f13PageSize, $scope.f13PageNo * $scope.f13PageSize);
        $scope.f13nextBtn = true;
    };

    //楼层十四,分类先配图片，后配分类code
    $scope.fourteenthFloor = {};
    $scope.fourteenthFloorClassification = {};
    $scope.fourteenthFloorTab = {};
    $scope.fourteenthCategory = {};
    $scope.f14nextBtn = true;
    $scope.f14upBtn = true;
    $scope.floor14callback = function (textData, floorShowLunbo) {
        $scope.textData14 = textData;
        var f14mpId = [];
        angular.forEach($scope.textData14.num1,function (val) {
            if(val.refObject != null){
                f14mpId.push(val.refObject.id);
            }
        });
        if(f14mpId.length > 0){
            $rootScope.ajax.get(_host + '/realTime/getPriceStockList', {mpIds: f14mpId}).then(function (res) {
                if (res.code == 0) {
                    angular.forEach($scope.textData14.num1,function (val) {
                        if(val.refObject != null){
                            angular.forEach(res.data.plist,function (val2) {
                                if(val.refObject.id == val2.mpId){
                                    val.refObject.realPrice = val2.availablePrice;
                                }
                            })
                        }
                    });
                }
            })
        }
        $scope.floor14ShowLunbo = floorShowLunbo;
        $scope.f14upBtn = false;
        $scope.f14nextBtn = false;
        if (!$scope.floor14ShowLunbo) {
            $scope.f14sevenBlocks = [];
            $scope.f14PageNo = 1;
            $scope.f14PageSize = 7;
            $scope.f14TotalPage =
                $scope.textData14.num1.length % $scope.f14PageSize == 0 ? (($scope.textData14.num1.length / $scope.f14PageSize) || 1) : parseInt($scope.textData14.num1.length / $scope.f14PageSize) + 1;
            $scope.f14sevenBlocks = $scope.textData14.num1.slice($scope.f14PageNo - 1, $scope.f14PageSize);
            if ($scope.f14PageNo < $scope.f14TotalPage) {
                $scope.f14nextBtn = true;
            }
        }
    };
    $scope.getFourteenthFloor = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'f14,f14_classification,f14_tab',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.getDolphinByMerchantId(url, params).then(function (res) {
            if (res.code == 0) {
                if (res.data.f14 != null && res.data.f14.length>0) {
                    $scope.fourteenthFloor = res.data.f14[0];
                    if (res.data.f14_classification) {
                        $scope.fourteenthFloorClassification = res.data.f14_classification;
                        if ($scope.fourteenthFloorClassification[1]) {
                            var url = '/api/category/list?parentId='+$scope.fourteenthFloorClassification[1].content+'&level=3&companyId='+$rootScope.companyId;
                            $rootScope.ajax.getNoKey(url, {}).then(function (res) {
                                if (res.code == 0) {
                                    $scope.fourteenthCategory = res.data.categorys;
                                }
                            })
                        }
                    }
                    if (res.data.f14_tab) {
                        $scope.fourteenthFloorTab = res.data.f14_tab;
                        angular.forEach($scope.fourteenthFloorTab, function (val) {
                            val.select = false;
                            if (val.content.indexOf('f14_1_tab_banner') >= 0) {
                                $scope.getDataByAdCode(val, $scope.textData14, $scope.floor14ShowLunbo, $scope.floor14callback);
                            }
                        });
                        $scope.fourteenthFloorTab[0]?($scope.fourteenthFloorTab[0].select = true):($scope.fourteenthFloorTab[0].select = false);
                    }
                    $scope.getBannerTenFore();
                }
            }
        })
    };
    $scope.getFourteenthFloor();
    // 楼层推荐十四
    $scope.getBannerTenFore = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'f14_recommendation',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.get(url, params).then(function (res) {
            if (res.data && res.data.f14_recommendation) {
                $scope.f14Recommendation = res.data.f14_recommendation[0];
            }
        })
    };

    //第二后tab后翻页，下一页
    $scope.fourteenthTurnNextPage = function () {
        if ($scope.f14PageNo >= $scope.f14TotalPage) {
            return;
        }
        $scope.f14PageNo++;
        if ($scope.f14PageNo == $scope.f14TotalPage) {
            $scope.f14nextBtn = false;
        }
        $scope.f14sevenBlocks = [];
        $scope.f14sevenBlocks = $scope.textData14.num1.slice(($scope.f14PageNo - 1) * $scope.f14PageSize, $scope.f14PageNo * $scope.f14PageSize);
        $scope.f14upBtn = true;
    };
    //第二后tab后翻页，上一页
    $scope.fourteenthTurnUpPage = function () {
        if ($scope.f14PageNo <= 1) {
            return
        }
        $scope.f14PageNo--;
        if ($scope.f14PageNo == 1) {
            $scope.f14upBtn = false;
        }
        $scope.f14sevenBlocks = [];
        $scope.f14sevenBlocks = $scope.textData14.num1.slice(($scope.f14PageNo - 1) * $scope.f14PageSize, $scope.f14PageNo * $scope.f14PageSize);
        $scope.f14nextBtn = true;
    };


    //楼层十五,分类先配图片，后配分类code
    $scope.fifteenthFloor = {};
    $scope.fifteenthFloorClassification = {};
    $scope.fifteenthFloorTab = {};
    $scope.fifteenthCategory = {};
    $scope.f15nextBtn = true;
    $scope.f15upBtn = true;
    $scope.floor15callback = function (textData, floorShowLunbo) {
        $scope.textData15 = textData;
        var f15mpId = [];
        angular.forEach($scope.textData15.num1,function (val) {
            if(val.refObject != null){
                f15mpId.push(val.refObject.id);
            }
        });
        if(f15mpId.length > 0){
            $rootScope.ajax.get(_host + '/realTime/getPriceStockList', {mpIds: f15mpId}).then(function (res) {
                if (res.code == 0) {
                    angular.forEach($scope.textData15.num1,function (val) {
                        if(val.refObject != null){
                            angular.forEach(res.data.plist,function (val2) {
                                if(val.refObject.id == val2.mpId){
                                    val.refObject.realPrice = val2.availablePrice;
                                }
                            })
                        }
                    });
                }
            })
        }
        $scope.floor15ShowLunbo = floorShowLunbo;
        $scope.f15upBtn = false;
        $scope.f15nextBtn = false;
        if (!$scope.floor15ShowLunbo) {
            $scope.f15sevenBlocks = [];
            $scope.f15PageNo = 1;
            $scope.f15PageSize = 7;
            $scope.f15TotalPage =
                $scope.textData15.num1.length % $scope.f15PageSize == 0 ? (($scope.textData15.num1.length / $scope.f15PageSize) || 1) : parseInt($scope.textData15.num1.length / $scope.f15PageSize) + 1;
            $scope.f15sevenBlocks = $scope.textData15.num1.slice($scope.f15PageNo - 1, $scope.f15PageSize);
            if ($scope.f15PageNo < $scope.f15TotalPage) {
                $scope.f15nextBtn = true;
            }
        }
    };
    $scope.getFifteenthFloor = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'f15,f15_classification,f15_tab',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.getDolphinByMerchantId(url, params).then(function (res) {
            if (res.code == 0) {
                if (res.data.f15 != null && res.data.f15.length>0) {
                    $scope.fifteenthFloor = res.data.f15[0];
                    if (res.data.f15_classification) {
                        $scope.fifteenthFloorClassification = res.data.f15_classification;
                        if ($scope.fifteenthFloorClassification[1]) {
                            var url = '/api/category/list?parentId='+$scope.fifteenthFloorClassification[1].content+'&level=3&companyId='+$rootScope.companyId;
                            $rootScope.ajax.getNoKey(url, {}).then(function (res) {
                                if (res.code == 0) {
                                    $scope.fifteenthCategory = res.data.categorys;
                                }
                            })
                        }
                    }
                    if (res.data.f15_tab) {
                        $scope.fifteenthFloorTab = res.data.f15_tab;
                        angular.forEach($scope.fifteenthFloorTab, function (val) {
                            val.select = false;
                            if (val.content.indexOf('f15_1_tab_banner') >= 0) {
                                $scope.getDataByAdCode(val, $scope.textData15, $scope.floor15ShowLunbo, $scope.floor15callback);
                            }
                        });
                        $scope.fifteenthFloorTab[0]?($scope.fifteenthFloorTab[0].select = true):($scope.fifteenthFloorTab[0].select = false);
                    }
                    $scope.getBannerTenFive();
                }
            }
        })
    };
    $scope.getFifteenthFloor();
    // 楼层推荐十五
    $scope.getBannerTenFive = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'f15_recommendation',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.get(url, params).then(function (res) {
            if (res.data && res.data.f15_recommendation) {
                $scope.f15Recommendation = res.data.f15_recommendation[0];
            }
        })
    };

    //第二后tab后翻页，下一页
    $scope.fifteenthTurnNextPage = function () {
        if ($scope.f15PageNo >= $scope.f15TotalPage) {
            return;
        }
        $scope.f15PageNo++;
        if ($scope.f15PageNo == $scope.f15TotalPage) {
            $scope.f15nextBtn = false;
        }
        $scope.f15sevenBlocks = [];
        $scope.f15sevenBlocks = $scope.textData15.num1.slice(($scope.f15PageNo - 1) * $scope.f15PageSize, $scope.f15PageNo * $scope.f15PageSize);
        $scope.f15upBtn = true;
    };
    //第二后tab后翻页，上一页
    $scope.fifteenthTurnUpPage = function () {
        if ($scope.f15PageNo <= 1) {
            return
        }
        $scope.f15PageNo--;
        if ($scope.f15PageNo == 1) {
            $scope.f15upBtn = false;
        }
        $scope.f15sevenBlocks = [];
        $scope.f15sevenBlocks = $scope.textData15.num1.slice(($scope.f15PageNo - 1) * $scope.f15PageSize, $scope.f15PageNo * $scope.f15PageSize);
        $scope.f15nextBtn = true;
    };


    //楼层十六,分类先配图片，后配分类code
    $scope.sixteenthFloor = {};
    $scope.sixteenthFloorClassification = {};
    $scope.sixteenthFloorTab = {};
    $scope.sixteenthCategory = {};
    $scope.f16nextBtn = true;
    $scope.f16upBtn = true;
    $scope.floor16callback = function (textData, floorShowLunbo) {
        $scope.textData16 = textData;
        var f16mpId = [];
        angular.forEach($scope.textData16.num1,function (val) {
            if(val.refObject != null){
                f16mpId.push(val.refObject.id);
            }
        });
        if(f16mpId.length > 0){
            $rootScope.ajax.get(_host + '/realTime/getPriceStockList', {mpIds: f16mpId}).then(function (res) {
                if (res.code == 0) {
                    angular.forEach($scope.textData16.num1,function (val) {
                        if(val.refObject != null){
                            angular.forEach(res.data.plist,function (val2) {
                                if(val.refObject.id == val2.mpId){
                                    val.refObject.realPrice = val2.availablePrice;
                                }
                            })
                        }
                    });
                }
            })
        }
        $scope.floor16ShowLunbo = floorShowLunbo;
        $scope.f16upBtn = false;
        $scope.f16nextBtn = false;
        if (!$scope.floor16ShowLunbo) {
            $scope.f16sevenBlocks = [];
            $scope.f16PageNo = 1;
            $scope.f16PageSize = 7;
            $scope.f16TotalPage =
                $scope.textData16.num1.length % $scope.f16PageSize == 0 ? (($scope.textData16.num1.length / $scope.f16PageSize) || 1) : parseInt($scope.textData16.num1.length / $scope.f16PageSize) + 1;
            $scope.f16sevenBlocks = $scope.textData16.num1.slice($scope.f16PageNo - 1, $scope.f16PageSize);
            if ($scope.f16PageNo < $scope.f16TotalPage) {
                $scope.f16nextBtn = true;
            }
        }
    };
    $scope.getSixteenthFloor = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'f16,f16_classification,f16_tab',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.getDolphinByMerchantId(url, params).then(function (res) {
            if (res.code == 0) {
                if (res.data.f16 != null && res.data.f16.length>0) {
                    $scope.sixteenthFloor = res.data.f16[0];
                    if (res.data.f16_classification) {
                        $scope.sixteenthFloorClassification = res.data.f16_classification;
                        if ($scope.sixteenthFloorClassification[1]) {
                            var url = '/api/category/list?parentId='+$scope.sixteenthFloorClassification[1].content+'&level=3&companyId='+$rootScope.companyId;
                            $rootScope.ajax.getNoKey(url, {}).then(function (res) {
                                if (res.code == 0) {
                                    $scope.sixteenthCategory = res.data.categorys;
                                }
                            })
                        }
                    }
                    if (res.data.f16_tab) {
                        $scope.sixteenthFloorTab = res.data.f16_tab;
                        angular.forEach($scope.sixteenthFloorTab, function (val) {
                            val.select = false;
                            if (val.content.indexOf('f16_1_tab_banner') >= 0) {
                                $scope.getDataByAdCode(val, $scope.textData16, $scope.floor16ShowLunbo, $scope.floor16callback);
                            }
                        });
                        $scope.sixteenthFloorTab[0]?($scope.sixteenthFloorTab[0].select = true):($scope.sixteenthFloorTab[0].select = false);
                    }
                    $scope.getBannerTenSix();
                }
            }
        })
    };
    $scope.getSixteenthFloor();
    // 楼层推荐十六
    $scope.getBannerTenSix = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'f16_recommendation',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.get(url, params).then(function (res) {
            if (res.data && res.data.f16_recommendation) {
                $scope.f16Recommendation = res.data.f16_recommendation[0];
            }
        })
    };

    //第二后tab后翻页，下一页
    $scope.sixteenthTurnNextPage = function () {
        if ($scope.f16PageNo >= $scope.f16TotalPage) {
            return;
        }
        $scope.f16PageNo++;
        if ($scope.f16PageNo == $scope.f16TotalPage) {
            $scope.f16nextBtn = false;
        }
        $scope.f16sevenBlocks = [];
        $scope.f16sevenBlocks = $scope.textData16.num1.slice(($scope.f16PageNo - 1) * $scope.f16PageSize, $scope.f16PageNo * $scope.f16PageSize);
        $scope.f16upBtn = true;
    };
    //第二后tab后翻页，上一页
    $scope.sixteenthTurnUpPage = function () {
        if ($scope.f16PageNo <= 1) {
            return
        }
        $scope.f16PageNo--;
        if ($scope.f16PageNo == 1) {
            $scope.f16upBtn = false;
        }
        $scope.f16sevenBlocks = [];
        $scope.f16sevenBlocks = $scope.textData16.num1.slice(($scope.f16PageNo - 1) * $scope.f16PageSize, $scope.f16PageNo * $scope.f16PageSize);
        $scope.f16nextBtn = true;
    };


    //楼层十七,分类先配图片，后配分类code
    $scope.seventeenthFloor = {};
    $scope.seventeenthFloorClassification = {};
    $scope.seventeenthFloorTab = {};
    $scope.seventeenthCategory = {};
    $scope.f17nextBtn = true;
    $scope.f17upBtn = true;
    $scope.floor17callback = function (textData, floorShowLunbo) {
        $scope.textData17 = textData;
        var f17mpId = [];
        angular.forEach($scope.textData17.num1,function (val) {
            if(val.refObject != null){
                f17mpId.push(val.refObject.id);
            }
        });
        if(f17mpId.length > 0){
            $rootScope.ajax.get(_host + '/realTime/getPriceStockList', {mpIds: f17mpId}).then(function (res) {
                if (res.code == 0) {
                    angular.forEach($scope.textData17.num1,function (val) {
                        if(val.refObject != null){
                            angular.forEach(res.data.plist,function (val2) {
                                if(val.refObject.id == val2.mpId){
                                    val.refObject.realPrice = val2.availablePrice;
                                }
                            })
                        }
                    });
                }
            })
        }
        $scope.floor17ShowLunbo = floorShowLunbo;
        $scope.f17upBtn = false;
        $scope.f17nextBtn = false;
        if (!$scope.floor17ShowLunbo) {
            $scope.f17sevenBlocks = [];
            $scope.f17PageNo = 1;
            $scope.f17PageSize = 7;
            $scope.f17TotalPage =
                $scope.textData17.num1.length % $scope.f17PageSize == 0 ? (($scope.textData17.num1.length / $scope.f17PageSize) || 1) : parseInt($scope.textData17.num1.length / $scope.f17PageSize) + 1;
            $scope.f17sevenBlocks = $scope.textData17.num1.slice($scope.f17PageNo - 1, $scope.f17PageSize);
            if ($scope.f17PageNo < $scope.f17TotalPage) {
                $scope.f17nextBtn = true;
            }
        }
    };
    $scope.getSeventeenthFloor = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'f17,f17_classification,f17_tab',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.getDolphinByMerchantId(url, params).then(function (res) {
            if (res.code == 0) {
                if (res.data.f17 != null && res.data.f17.length>0) {
                    $scope.seventeenthFloor = res.data.f17[0];
                    if (res.data.f17_classification) {
                        $scope.seventeenthFloorClassification = res.data.f17_classification;
                        if ($scope.seventeenthFloorClassification[1]) {
                            var url = '/api/category/list?parentId='+ $scope.seventeenthFloorClassification[1].content+'&level=3&companyId='+$rootScope.companyId;
                            $rootScope.ajax.getNoKey(url, {}).then(function (res) {
                                if (res.code == 0) {
                                    $scope.seventeenthCategory = res.data.categorys;
                                }
                            })
                        }
                    }
                    if (res.data.f17_tab) {
                        $scope.seventeenthFloorTab = res.data.f17_tab;
                        angular.forEach($scope.seventeenthFloorTab, function (val) {
                            val.select = false;
                            if (val.content.indexOf('f17_1_tab_banner') >= 0) {
                                $scope.getDataByAdCode(val, $scope.textData17, $scope.floor17ShowLunbo, $scope.floor17callback);
                            }
                        });
                        $scope.seventeenthFloorTab[0]?($scope.seventeenthFloorTab[0].select = true):($scope.seventeenthFloorTab[0].select = false);
                    }
                    $scope.getBannerTenSenven();
                }
            }
        })
    };
    $scope.getSeventeenthFloor();
    // 楼层推荐十七
    $scope.getBannerTenSenven = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'f17_recommendation',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.get(url, params).then(function (res) {
            if (res.data && res.data.f17_recommendation) {
                $scope.f17Recommendation = res.data.f17_recommendation[0];
            }
        })
    };

    //第二后tab后翻页，下一页
    $scope.seventeenthTurnNextPage = function () {
        if ($scope.f17PageNo >= $scope.f17TotalPage) {
            return;
        }
        $scope.f17PageNo++;
        if ($scope.f17PageNo == $scope.f17TotalPage) {
            $scope.f17nextBtn = false;
        }
        $scope.f17sevenBlocks = [];
        $scope.f17sevenBlocks = $scope.textData17.num1.slice(($scope.f17PageNo - 1) * $scope.f17PageSize, $scope.f17PageNo * $scope.f17PageSize);
        $scope.f17upBtn = true;
    };
    //第二后tab后翻页，上一页
    $scope.seventeenthTurnUpPage = function () {
        if ($scope.f17PageNo <= 1) {
            return
        }
        $scope.f17PageNo--;
        if ($scope.f17PageNo == 1) {
            $scope.f17upBtn = false;
        }
        $scope.f17sevenBlocks = [];
        $scope.f17sevenBlocks = $scope.textData17.num1.slice(($scope.f17PageNo - 1) * $scope.f17PageSize, $scope.f17PageNo * $scope.f17PageSize);
        $scope.f17nextBtn = true;
    };


    //楼层十八,分类先配图片，后配分类code
    $scope.eighteenthFloor = {};
    $scope.eighteenthFloorClassification = {};
    $scope.eighteenthFloorTab = {};
    $scope.eighteenthCategory = {};
    $scope.f18nextBtn = true;
    $scope.f18upBtn = true;
    $scope.floor18callback = function (textData, floorShowLunbo) {
        $scope.textData18 = textData;
        var f18mpId = [];
        angular.forEach($scope.textData18.num1,function (val) {
            if(val.refObject != null){
                f18mpId.push(val.refObject.id);
            }
        });
        if(f18mpId.length > 0){
            $rootScope.ajax.get(_host + '/realTime/getPriceStockList', {mpIds: f18mpId}).then(function (res) {
                if (res.code == 0) {
                    angular.forEach($scope.textData18.num1,function (val) {
                        if(val.refObject != null){
                            angular.forEach(res.data.plist,function (val2) {
                                if(val.refObject.id == val2.mpId){
                                    val.refObject.realPrice = val2.availablePrice;
                                }
                            })
                        }
                    });
                }
            })
        }
        $scope.floor18ShowLunbo = floorShowLunbo;
        $scope.f18upBtn = false;
        $scope.f18nextBtn = false;
        if (!$scope.floor18ShowLunbo) {
            $scope.f18sevenBlocks = [];
            $scope.f18PageNo = 1;
            $scope.f18PageSize = 7;
            $scope.f18TotalPage =
                $scope.textData18.num1.length % $scope.f18PageSize == 0 ? (($scope.textData18.num1.length / $scope.f18PageSize) || 1) : parseInt($scope.textData18.num1.length / $scope.f18PageSize) + 1;
            $scope.f18sevenBlocks = $scope.textData18.num1.slice($scope.f18PageNo - 1, $scope.f18PageSize);
            if ($scope.f18PageNo < $scope.f18TotalPage) {
                $scope.f18nextBtn = true;
            }
        }
    };
    $scope.getEighteenthFloor = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'f18,f18_classification,f18_tab',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.getDolphinByMerchantId(url, params).then(function (res) {
            if (res.code == 0) {
                if (res.data.f18 != null && res.data.f18.length>0) {
                    $scope.eighteenthFloor = res.data.f18[0];
                    if (res.data.f18_classification) {
                        $scope.eighteenthFloorClassification = res.data.f18_classification;
                        if ($scope.eighteenthFloorClassification[1]) {
                            var url = '/api/category/list?parentId='+$scope.eighteenthFloorClassification[1].content+'&level=3&companyId='+$rootScope.companyId;
                            $rootScope.ajax.getNoKey(url, {}).then(function (res) {
                                if (res.code == 0) {
                                    $scope.eighteenthCategory = res.data.categorys;
                                }
                            })
                        }
                    }
                    if (res.data.f18_tab) {
                        $scope.eighteenthFloorTab = res.data.f18_tab;
                        angular.forEach($scope.eighteenthFloorTab, function (val) {
                            val.select = false;
                            if (val.content.indexOf('f18_1_tab_banner') >= 0) {
                                $scope.getDataByAdCode(val, $scope.textData18, $scope.floor18ShowLunbo, $scope.floor18callback);
                            }
                        });
                        $scope.eighteenthFloorTab[0]?($scope.eighteenthFloorTab[0].select = true):($scope.eighteenthFloorTab[0].select = false);
                    }
                    $scope.getBannerTenEight();
                }
            }
        })
    };
    $scope.getEighteenthFloor();
    // 楼层推荐十八
    $scope.getBannerTenEight = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'f18_recommendation',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.get(url, params).then(function (res) {
            if (res.data && res.data.f18_recommendation) {
                $scope.f18Recommendation = res.data.f18_recommendation[0];
            }
        })
    };

    //第二后tab后翻页，下一页
    $scope.eighteenthTurnNextPage = function () {
        if ($scope.f18PageNo >= $scope.f18TotalPage) {
            return;
        }
        $scope.f18PageNo++;
        if ($scope.f18PageNo == $scope.f18TotalPage) {
            $scope.f18nextBtn = false;
        }
        $scope.f18sevenBlocks = [];
        $scope.f18sevenBlocks = $scope.textData18.num1.slice(($scope.f18PageNo - 1) * $scope.f18PageSize, $scope.f18PageNo * $scope.f18PageSize);
        $scope.f18upBtn = true;
    };
    //第二后tab后翻页，上一页
    $scope.eighteenthTurnUpPage = function () {
        if ($scope.f18PageNo <= 1) {
            return
        }
        $scope.f18PageNo--;
        if ($scope.f18PageNo == 1) {
            $scope.f18upBtn = false;
        }
        $scope.f18sevenBlocks = [];
        $scope.f18sevenBlocks = $scope.textData18.num1.slice(($scope.f18PageNo - 1) * $scope.f18PageSize, $scope.f18PageNo * $scope.f18PageSize);
        $scope.f18nextBtn = true;
    };


    //楼层十九,分类先配图片，后配分类code
    $scope.nineteenthFloor = {};
    $scope.nineteenthFloorClassification = {};
    $scope.nineteenthFloorTab = {};
    $scope.nineteenthCategory = {};
    $scope.f19nextBtn = true;
    $scope.f19upBtn = true;
    $scope.floor19callback = function (textData, floorShowLunbo) {
        $scope.textData19 = textData;
        var f19mpId = [];
        angular.forEach($scope.textData19.num1,function (val) {
            if(val.refObject != null){
                f19mpId.push(val.refObject.id);
            }
        });
        if(f19mpId.length > 0){
            $rootScope.ajax.get(_host + '/realTime/getPriceStockList', {mpIds: f19mpId}).then(function (res) {
                if (res.code == 0) {
                    angular.forEach($scope.textData19.num1,function (val) {
                        if(val.refObject != null){
                            angular.forEach(res.data.plist,function (val2) {
                                if(val.refObject.id == val2.mpId){
                                    val.refObject.realPrice = val2.availablePrice;
                                }
                            })
                        }
                    });
                }
            })
        }
        $scope.floor19ShowLunbo = floorShowLunbo;
        $scope.f19upBtn = false;
        $scope.f19nextBtn = false;
        if (!$scope.floor19ShowLunbo) {
            $scope.f19sevenBlocks = [];
            $scope.f19PageNo = 1;
            $scope.f19PageSize = 7;
            $scope.f19TotalPage =
                $scope.textData19.num1.length % $scope.f19PageSize == 0 ? (($scope.textData19.num1.length / $scope.f19PageSize) || 1) : parseInt($scope.textData19.num1.length / $scope.f19PageSize) + 1;
            $scope.f19sevenBlocks = $scope.textData19.num1.slice($scope.f19PageNo - 1, $scope.f19PageSize);
            if ($scope.f19PageNo < $scope.f19TotalPage) {
                $scope.f19nextBtn = true;
            }
        }
    };
    $scope.getNineteenthFloor = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'f19,f19_classification,f19_tab',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.getDolphinByMerchantId(url, params).then(function (res) {
            if (res.code == 0) {
                if (res.data.f19 != null && res.data.f19.length>0) {
                    $scope.nineteenthFloor = res.data.f19[0];
                    if (res.data.f19_classification) {
                        $scope.nineteenthFloorClassification = res.data.f19_classification;
                        if ($scope.nineteenthFloorClassification[1]) {
                            var url = '/api/category/list?parentId='+$scope.nineteenthFloorClassification[1].content+'&level=3&companyId='+$rootScope.companyId;
                            $rootScope.ajax.getNoKey(url, {}).then(function (res) {
                                if (res.code == 0) {
                                    $scope.nineteenthCategory = res.data.categorys;
                                }
                            })
                        }
                    }
                    if (res.data.f19_tab) {
                        $scope.nineteenthFloorTab = res.data.f19_tab;
                        angular.forEach($scope.nineteenthFloorTab, function (val) {
                            val.select = false;
                            if (val.content.indexOf('f19_1_tab_banner') >= 0) {
                                $scope.getDataByAdCode(val, $scope.textData19, $scope.floor19ShowLunbo, $scope.floor19callback);
                            }
                        });
                        $scope.nineteenthFloorTab[0]?($scope.nineteenthFloorTab[0].select = true):($scope.nineteenthFloorTab[0].select = false);
                    }
                    $scope.getBannerTenNight();
                }
            }
        })
    };
    $scope.getNineteenthFloor();
    // 楼层推荐十九
    $scope.getBannerTenNight = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'f19_recommendation',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.get(url, params).then(function (res) {
            if (res.data && res.data.f19_recommendation) {
                $scope.f19Recommendation = res.data.f19_recommendation[0];
            }
        })
    };

    //第二后tab后翻页，下一页
    $scope.nineteenthTurnNextPage = function () {
        if ($scope.f19PageNo >= $scope.f19TotalPage) {
            return;
        }
        $scope.f19PageNo++;
        if ($scope.f19PageNo == $scope.f19TotalPage) {
            $scope.f19nextBtn = false;
        }
        $scope.f19sevenBlocks = [];
        $scope.f19sevenBlocks = $scope.textData19.num1.slice(($scope.f19PageNo - 1) * $scope.f19PageSize, $scope.f19PageNo * $scope.f19PageSize);
        $scope.f19upBtn = true;
    };
    //第二后tab后翻页，上一页
    $scope.nineteenthTurnUpPage = function () {
        if ($scope.f19PageNo <= 1) {
            return
        }
        $scope.f19PageNo--;
        if ($scope.f19PageNo == 1) {
            $scope.f19upBtn = false;
        }
        $scope.f19sevenBlocks = [];
        $scope.f19sevenBlocks = $scope.textData19.num1.slice(($scope.f19PageNo - 1) * $scope.f19PageSize, $scope.f19PageNo * $scope.f19PageSize);
        $scope.f19nextBtn = true;
    };

//楼层二十,分类先配图片，后配分类code
    $scope.twentiethFloor = {};
    $scope.twentiethFloorClassification = {};
    $scope.twentiethFloorTab = {};
    $scope.twentiethCategory = {};
    $scope.f20nextBtn = true;
    $scope.f20upBtn = true;
    $scope.floor20callback = function (textData, floorShowLunbo) {
        $scope.textData20 = textData;
        var f20mpId = [];
        angular.forEach($scope.textData20.num1,function (val) {
            if(val.refObject != null){
                f20mpId.push(val.refObject.id);
            }
        });
        if(f20mpId.length > 0){
            $rootScope.ajax.get(_host + '/realTime/getPriceStockList', {mpIds: f20mpId}).then(function (res) {
                if (res.code == 0) {
                    angular.forEach($scope.textData20.num1,function (val) {
                        if(val.refObject != null){
                            angular.forEach(res.data.plist,function (val2) {
                                if(val.refObject.id == val2.mpId){
                                    val.refObject.realPrice = val2.availablePrice;
                                }
                            })
                        }
                    });
                }
            })
        }
        $scope.floor20ShowLunbo = floorShowLunbo;
        $scope.f20upBtn = false;
        $scope.f20nextBtn = false;
        if (!$scope.floor20ShowLunbo) {
            $scope.f20sevenBlocks = [];
            $scope.f20PageNo = 1;
            $scope.f20PageSize = 7;
            $scope.f20TotalPage =
                $scope.textData20.num1.length % $scope.f20PageSize == 0 ? (($scope.textData20.num1.length / $scope.f20PageSize) || 1) : parseInt($scope.textData20.num1.length / $scope.f20PageSize) + 1;
            $scope.f20sevenBlocks = $scope.textData20.num1.slice($scope.f20PageNo - 1, $scope.f20PageSize);
            if ($scope.f20PageNo < $scope.f20TotalPage) {
                $scope.f20nextBtn = true;
            }
        }
    };
    $scope.getTwentiethFloor = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'f20,f20_classification,f20_tab',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.getDolphinByMerchantId(url, params).then(function (res) {
            if (res.code == 0) {
                if (res.data.f20 != null && res.data.f20.length>0) {
                    $scope.twentiethFloor = res.data.f20[0];
                    if (res.data.f20_classification) {
                        $scope.twentiethFloorClassification = res.data.f20_classification;
                        if ($scope.twentiethFloorClassification[1]) {
                            var url = '/api/category/list?parentId='+$scope.twentiethFloorClassification[1].content+'&level=3&companyId='+$rootScope.companyId;
                            $rootScope.ajax.getNoKey(url, {}).then(function (res) {
                                if (res.code == 0) {
                                    $scope.twentiethCategory = res.data.categorys;
                                }
                            })
                        }
                    }
                    if (res.data.f20_tab) {
                        $scope.twentiethFloorTab = res.data.f20_tab;
                        angular.forEach($scope.twentiethFloorTab, function (val) {
                            val.select = false;
                            if (val.content.indexOf('f20_1_tab_banner') >= 0) {
                                $scope.getDataByAdCode(val, $scope.textData20, $scope.floor20ShowLunbo, $scope.floor20callback);
                            }
                        });
                        $scope.twentiethFloorTab[0]?($scope.twentiethFloorTab[0].select = true):($scope.twentiethFloorTab[0].select = false);
                    }
                    $scope.getBannerTenTen();
                }
            }
        })
    };
    $scope.getTwentiethFloor();
    // 楼层推荐二十
    $scope.getBannerTenTen = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'f20_recommendation',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.get(url, params).then(function (res) {
            if (res.data && res.data.f20_recommendation) {
                $scope.f20Recommendation = res.data.f20_recommendation[0];
            }
        })
    };

    // 获取首页推荐服务
    $scope.getIndexService = function() {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: 'reconmend_service',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.get(url, params).then(function (res) {
            if (res.data && res.data.reconmend_service) {
                $scope.reconmendService = res.data.reconmend_service;
            }
        })
    }
    $scope.getIndexService();
    //第二后tab后翻页，下一页
    $scope.twentiethTurnNextPage = function () {
        if ($scope.f20PageNo >= $scope.f20TotalPage) {
            return;
        }
        $scope.f20PageNo++;
        if ($scope.f20PageNo == $scope.f20TotalPage) {
            $scope.f20nextBtn = false;
        }
        $scope.f20sevenBlocks = [];
        $scope.f20sevenBlocks = $scope.textData20.num1.slice(($scope.f20PageNo - 1) * $scope.f20PageSize, $scope.f20PageNo * $scope.f20PageSize);
        $scope.f20upBtn = true;
    };
    //第二后tab后翻页，上一页
    $scope.twentiethTurnUpPage = function () {
        if ($scope.f20PageNo <= 1) {
            return
        }
        $scope.f20PageNo--;
        if ($scope.f20PageNo == 1) {
            $scope.f20upBtn = false;
        }
        $scope.f20sevenBlocks = [];
        $scope.f20sevenBlocks = $scope.textData20.num1.slice(($scope.f20PageNo - 1) * $scope.f20PageSize, $scope.f20PageNo * $scope.f20PageSize);
        $scope.f20nextBtn = true;
    };

    //根据adCode查
    $scope.floorOnecurrentTab = true;
    $scope.getDataByAdCode = function (tab, textData, floorShowLunbo, floorcallback,data) {
        tab.select = true;
        angular.forEach( data,function(a) {
            if( tab.id != a.id ) {
                a.select = false;
            }
        } )
        $scope.currentTab = tab;
        var adCode = tab.content;
        textData = {};
        if (adCode.indexOf('f1_1_tab_banner') >= 0 || adCode.indexOf('f2_1_tab_banner') >= 0 || adCode.indexOf('f3_1_tab_banner') >= 0
            || adCode.indexOf('f4_1_tab_banner') >= 0 || adCode.indexOf('f5_1_tab_banner') >= 0 || adCode.indexOf('f6_1_tab_banner') >= 0
            || adCode.indexOf('f7_1_tab_banner') >= 0 || adCode.indexOf('f8_1_tab_banner') >= 0 || adCode.indexOf('f9_1_tab_banner') >= 0
            || adCode.indexOf('f10_1_tab_banner') >= 0 || adCode.indexOf('f11_1_tab_banner') >= 0 || adCode.indexOf('f12_1_tab_banner') >= 0
            || adCode.indexOf('f13_1_tab_banner') >= 0 || adCode.indexOf('f14_1_tab_banner') >= 0 || adCode.indexOf('f15_1_tab_banner') >= 0
            || adCode.indexOf('f16_1_tab_banner') >= 0 || adCode.indexOf('f17_1_tab_banner') >= 0 || adCode.indexOf('f18_1_tab_banner') >= 0
            || adCode.indexOf('f19_1_tab_banner') >= 0 || adCode.indexOf('f20_1_tab_banner') >= 0) {
            floorShowLunbo = true;
        } else {
            floorShowLunbo = false;
        }

        adCode = adCode.replace(/，/ig, ',');
        var codesList = adCode.split(",");
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_HOME_PAGE',
                adCode: adCode,
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.getDolphinByMerchantId(url, params).then(function (res) {
            if (res.data) {
                angular.forEach(codesList, function (val, index) {
                    textData['num' + (index + 1)] = res.data[val];
                });
                floorcallback(textData, floorShowLunbo);
            }
        })

    };

    // var flagPageY = true;
    // angular.element($(window)).on("scroll", function () {
    //     var floor8PageY;
    //     if ($(".floor8-pageY").offset()) {
    //         floor8PageY = $(".floor8-pageY").offset().top;
    //     }
    //     if (floor8PageY && $(window).scrollTop() > floor8PageY && flagPageY) {
    //         $scope.getFloor10();
    //         $scope.getFloor11();
    //         $scope.getFloor12();
    //         $scope.getFloor13();
    //         $scope.getFloor14();
    //         $scope.getFloor15();
    //         flagPageY = false;
    //     }
    // });

}]);
$(function () {
    'use strict'
    //置顶
    $('.top-box').click(function () {
        $("html,body").animate({
                                   scrollTop: 0
                               }, 500);
    })
    var bannnerHeight = $('.h-banner-box').offset().top;
    $(window).scroll( function( event ) {
        if( $(window).scrollTop() > bannnerHeight ) {
            $("#h-banner").css({
                'height' : '70px'
            })
            $('.h-banner-box').css({
                'position' : 'fixed' ,
                'top' : '0px',
                'z-index' : '1000',
            })
            $(".top-right").css({
                'display' : 'none'
            })
            $(".hotword").css({
                'display' : 'none'
            })
            $(".logo").css({
                'margin' : '12px 0px 0px 0px'
            })
            $(".search").css({
                'height' : 'auto'
            })
        } else {
            $('.h-banner-box').css({
                'position' : 'static',
            })
            $("#h-banner").css({
                'height' : '110px'
            })
            $(".top-right").css({
                'display' : 'block'
            })
            $(".hotword").css({
                'display' : 'block'
            })
            $(".logo").css({
                'margin' : '19px 0px 0px 0px'
            })
            $(".search").css({
                'height' : '96px'
            })
        }
    } )
})
$(function() {
    var a = {};
    a.lamuShow = function() {
        var c = $(".top-big-banner")
          , f = $(".top-small-banner")
          , e = $(".mod_topbanner_wrap");
        var b, d;
        e.hover(function() {
            clearTimeout(d);
            b = setTimeout(function() {
                if (!c.is(":animated") && !f.is(":animated") && c.length > 0) {
                    f.slideUp();
                    c.slideDown();
                    if (/^#[a-fA-F0-9]{1,6}$/.test(c.attr("data-bgColor"))) {
                        e.css("background-color", c.attr("data-bgColor"))
                    }
                }
            }, 300)
        }, function() {
            clearTimeout(b);
            d = setTimeout(function() {
                if (!c.is(":animated") && !f.is(":animated") && c.length > 0) {
                    f.slideDown();
                    c.slideUp();
                    if (/^#[a-fA-F0-9]{1,6}$/.test(f.attr("data-bgColor"))) {
                        e.css("background-color", f.attr("data-bgColor"))
                    }
                }
            }, 300)
        });
        e.on("click", ".close_btn", function() {
            e.slideUp()
        })
    }
    ;
    a.lamuShow();
});
