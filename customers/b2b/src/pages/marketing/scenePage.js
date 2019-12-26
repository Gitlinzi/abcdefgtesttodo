/**
 * Created by Roy on 15/10/20.
 */

//var appControllers=angular.module("appControllers",['ngCookies','ngFileUpload','directives','filters','services']);

appControllers.controller("scenePageCtrl", ['$log', '$rootScope', '$scope', 'commonService', 'categoryService', '$timeout',function ($log, $rootScope, $scope, commonService, categoryService,$timeout) {
    'use strict';
    var ut = $rootScope.util.getUserToken(),
        _host = $rootScope.host,
        _fnP = $rootScope.ajax.post,
        _fnE = $rootScope.error.checkCode;
    $rootScope.execute();
    //轮播
    $scope.lunbo = [];
    $scope.getBanner = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_SCENE_PAGE',
                adCode: 'banner',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.get(url, params).then(function (res) {
            if (res.code == 0) {
                if (res.data.banner) {
                    $scope.lunbo = res.data.banner;
                }
            }
        })
    };
    $scope.getBanner();
    //推荐分类
    $scope.spreadClassification = [];
    $scope.getSpreadClassification = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_SCENE_PAGE',
                adCode: 'spread_classification',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.get(url, params).then(function (res) {
            if (res.code == 0) {
                if (res.data.spread_classification) {
                    $scope.spreadClassification = res.data.spread_classification;
                }
            }
        })
    };
    $scope.getSpreadClassification();

    $scope.textData1 = {};
    $scope.scene1ShowLunbo = true;
    $scope.textData2 = {};
    $scope.scene2ShowLunbo = true;
    $scope.textData3 = {};
    $scope.scene3ShowLunbo = true;
    $scope.textData4 = {};
    $scope.scene4ShowLunbo = true;
    $scope.textData5 = {};
    $scope.scene5ShowLunbo = true;
    $scope.textData6 = {};
    $scope.scene6ShowLunbo = true;
    $scope.textData7 = {};
    $scope.scene7ShowLunbo = true;
    $scope.textData8 = {};
    $scope.scene8ShowLunbo = true;

    //第一个场景
    $scope.firstScene = {};
    $scope.firstSceneTab = {};
    $scope.s1upBtn = true;
    $scope.s1nextBtn = true;
    $scope.scene1callback = function (textData, sceneShowLunbo) {
        $scope.textData1 = textData;
        var s1mpId = [];
        angular.forEach($scope.textData1.num2,function (val) {
            if(val.refObject != null){
                s1mpId.push(val.refObject.id);
            }
        });
        if(s1mpId.length > 0){
            $rootScope.ajax.get(_host + '/realTime/getPriceStockList', {mpIds: s1mpId}).then(function (res) {
                if (res.code == 0) {
                    angular.forEach($scope.textData1.num2,function (val) {
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
        $scope.scene1ShowLunbo = sceneShowLunbo;
        $scope.s1upBtn = false;
        $scope.s1nextBtn = false;
        if (!$scope.scene1ShowLunbo) {
            $scope.s1sevenBlocks = [];
            $scope.s1PageNo = 1;
            $scope.s1PageSize = 7;
            $scope.s1TotalPage =
                $scope.textData1.num2.length % $scope.s1PageSize == 0 ? (($scope.textData1.num2.length / $scope.s1PageSize) || 1) : parseInt($scope.textData1.num2.length / $scope.s1PageSize) + 1;
            $scope.s1sevenBlocks = $scope.textData1.num2.slice($scope.s1PageNo - 1, $scope.s1PageSize);
            if ($scope.s1PageNo < $scope.s1TotalPage) {
                $scope.s1nextBtn = true;
            }
        }
    };
    $scope.getFirstScene = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_SCENE_PAGE',
                adCode: 's1,s1_tab',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.get(url, params).then(function (res) {
            if (res.code == 0) {
                if (res.data.s1 != null && res.data.s1.length>0) {
                    $scope.firstScene = res.data.s1[0];
                    if (res.data.s1_tab) {
                        $scope.firstSceneTab = res.data.s1_tab;
                        angular.forEach($scope.firstSceneTab, function (val) {
                            val.select = false;
                            if (val.content.indexOf('s1_1_tab_banner') >= 0) {
                                $scope.getDataByAdCode(val.content, $scope.textData1, $scope.scene1ShowLunbo, $scope.scene1callback);
                            }
                        });
                        $scope.firstSceneTab[0]?($scope.firstSceneTab[0].select = true):($scope.firstSceneTab[0].select = false);
                    }
                }
            }
        })
    };
    $scope.getFirstScene();
    //第二后tab后翻页，下一页
    $scope.firstTurnNextPage = function () {
        if ($scope.s1PageNo >= $scope.s1TotalPage) {
            return;
        }
        $scope.s1PageNo++;
        if ($scope.s1PageNo == $scope.s1TotalPage) {
            $scope.s1nextBtn = false;
        }
        $scope.s1sevenBlocks = [];
        $scope.s1sevenBlocks = $scope.textData1.num2.slice(($scope.s1PageNo - 1) * $scope.s1PageSize, $scope.s1PageNo * $scope.s1PageSize);
        $scope.s1upBtn = true;
    };
    //第二后tab后翻页，上一页
    $scope.firstTurnUpPage = function () {
        if ($scope.s1PageNo <= 1) {
            return
        }
        $scope.s1PageNo--;
        if ($scope.s1PageNo == 1) {
            $scope.s1upBtn = false;
        }
        $scope.s1sevenBlocks = [];
        $scope.s1sevenBlocks = $scope.textData1.num2.slice(($scope.s1PageNo - 1) * $scope.s1PageSize, $scope.s1PageNo * $scope.s1PageSize);
        $scope.s1nextBtn = true;
    };

    //第二个场景
    $scope.secondScene = {};
    $scope.secondSceneTab = {};
    $scope.s2upBtn = true;
    $scope.s2nextBtn = true;
    $scope.scene2callback = function (textData, sceneShowLunbo) {
        $scope.textData2 = textData;
        var s2mpId = [];
        angular.forEach($scope.textData2.num2,function (val) {
            if(val.refObject != null){
                s2mpId.push(val.refObject.id);
            }
        });
        if(s2mpId.length > 0){
            $rootScope.ajax.get(_host + '/realTime/getPriceStockList', {mpIds: s2mpId}).then(function (res) {
                if (res.code == 0) {
                    angular.forEach($scope.textData2.num2,function (val) {
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
        $scope.scene2ShowLunbo = sceneShowLunbo;
        $scope.s2upBtn = false;
        $scope.s2nextBtn = false;
        if (!$scope.scene2ShowLunbo) {
            $scope.s2sevenBlocks = [];
            $scope.s2PageNo = 1;
            $scope.s2PageSize = 7;
            $scope.s2TotalPage =
                $scope.textData2.num2.length % $scope.s2PageSize == 0 ? (($scope.textData2.num2.length / $scope.s2PageSize) || 1) : parseInt($scope.textData2.num2.length / $scope.s2PageSize) + 1;
            $scope.s2sevenBlocks = $scope.textData2.num2.slice($scope.s2PageNo - 1, $scope.s2PageSize);
            if ($scope.s2PageNo < $scope.s2TotalPage) {
                $scope.s2nextBtn = true;
            }
        }
    };
    $scope.getSecondScene = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_SCENE_PAGE',
                adCode: 's2,s2_tab',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.get(url, params).then(function (res) {
            if (res.code == 0) {
                if (res.data.s2 != null && res.data.s2.length>0) {
                    $scope.secondScene = res.data.s2[0];
                    if (res.data.s2_tab) {
                        $scope.secondSceneTab = res.data.s2_tab;
                        angular.forEach($scope.secondSceneTab, function (val) {
                            val.select = false;
                            if (val.content.indexOf('s2_1_tab_banner') >= 0) {
                                $scope.getDataByAdCode(val.content, $scope.textData2, $scope.scene2ShowLunbo, $scope.scene2callback);
                            }
                        });
                        $scope.secondSceneTab[0]?($scope.secondSceneTab[0].select = true):($scope.secondSceneTab[0].select = false);
                    }
                }
            }
        })
    };
    $scope.getSecondScene();
    //第二后tab后翻页，下一页
    $scope.secondTurnNextPage = function () {
        if ($scope.s2PageNo >= $scope.s2TotalPage) {
            return;
        }
        $scope.s2PageNo++;
        if ($scope.s2PageNo == $scope.s2TotalPage) {
            $scope.s2nextBtn = false;
        }
        $scope.s2sevenBlocks = [];
        $scope.s2sevenBlocks = $scope.textData2.num2.slice(($scope.s2PageNo - 1) * $scope.s2PageSize, $scope.s2PageNo * $scope.s2PageSize);
        $scope.s2upBtn = true;
    };
    //第二后tab后翻页，上一页
    $scope.secondTurnUpPage = function () {
        if ($scope.s2PageNo <= 1) {
            return
        }
        $scope.s2PageNo--;
        if ($scope.s2PageNo == 1) {
            $scope.s2upBtn = false;
        }
        $scope.s2sevenBlocks = [];
        $scope.s2sevenBlocks = $scope.textData2.num2.slice(($scope.s2PageNo - 1) * $scope.s2PageSize, $scope.s2PageNo * $scope.s2PageSize);
        $scope.s2nextBtn = true;
    };


    //第三个场景
    $scope.thirdScene = {};
    $scope.thirdSceneTab = {};
    $scope.s3upBtn = true;
    $scope.s3nextBtn = true;
    $scope.scene3callback = function (textData, sceneShowLunbo) {
        $scope.textData3 = textData;
        var s3mpId = [];
        angular.forEach($scope.textData3.num2,function (val) {
            if(val.refObject != null){
                s3mpId.push(val.refObject.id);
            }
        });
        if(s3mpId.length > 0){
            $rootScope.ajax.get(_host + '/realTime/getPriceStockList', {mpIds: s3mpId}).then(function (res) {
                if (res.code == 0) {
                    angular.forEach($scope.textData3.num2,function (val) {
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
        $scope.scene3ShowLunbo = sceneShowLunbo;
        $scope.s3upBtn = false;
        $scope.s3nextBtn = false;
        if (!$scope.scene3ShowLunbo) {
            $scope.s3sevenBlocks = [];
            $scope.s3PageNo = 1;
            $scope.s3PageSize = 7;
            $scope.s3TotalPage =
                $scope.textData3.num2.length % $scope.s3PageSize == 0 ? (($scope.textData3.num2.length / $scope.s3PageSize) || 1) : parseInt($scope.textData3.num2.length / $scope.s3PageSize) + 1;
            $scope.s3sevenBlocks = $scope.textData3.num2.slice($scope.s3PageNo - 1, $scope.s3PageSize);
            if ($scope.s3PageNo < $scope.s3TotalPage) {
                $scope.s3nextBtn = true;
            }
        }
    };
    $scope.getThirdScene = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_SCENE_PAGE',
                adCode: 's3,s3_tab',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.get(url, params).then(function (res) {
            if (res.code == 0) {
                if (res.data.s3 != null && res.data.s3.length>0) {
                    $scope.thirdScene = res.data.s3[0];
                    if (res.data.s3_tab) {
                        $scope.thirdSceneTab = res.data.s3_tab;
                        angular.forEach($scope.thirdSceneTab, function (val) {
                            val.select = false;
                            if (val.content.indexOf('s3_1_tab_banner') >= 0) {
                                $scope.getDataByAdCode(val.content, $scope.textData3, $scope.scene3ShowLunbo, $scope.scene3callback);
                            }
                        });
                        $scope.thirdSceneTab[0]?($scope.thirdSceneTab[0].select = true):($scope.thirdSceneTab[0].select = false);
                    }
                }

            }
        })
    };
    $scope.getThirdScene();
    //第二后tab后翻页，下一页
    $scope.thirdTurnNextPage = function () {
        if ($scope.s3PageNo >= $scope.s3TotalPage) {
            return;
        }
        $scope.s3PageNo++;
        if ($scope.s3PageNo == $scope.s3TotalPage) {
            $scope.s3nextBtn = false;
        }
        $scope.s3sevenBlocks = [];
        $scope.s3sevenBlocks = $scope.textData3.num2.slice(($scope.s3PageNo - 1) * $scope.s3PageSize, $scope.s3PageNo * $scope.s3PageSize);
        $scope.s3upBtn = true;
    };
    //第二后tab后翻页，上一页
    $scope.thirdTurnUpPage = function () {
        if ($scope.s3PageNo <= 1) {
            return
        }
        $scope.s3PageNo--;
        if ($scope.s3PageNo == 1) {
            $scope.s3upBtn = false;
        }
        $scope.s3sevenBlocks = [];
        $scope.s3sevenBlocks = $scope.textData3.num2.slice(($scope.s3PageNo - 1) * $scope.s3PageSize, $scope.s3PageNo * $scope.s3PageSize);
        $scope.s3nextBtn = true;
    };


    //第四个场景
    $scope.fourthScene = {};
    $scope.fourthSceneTab = {};
    $scope.s4upBtn = true;
    $scope.s4nextBtn = true;
    $scope.scene4callback = function(textData, sceneShowLunbo) {
        $scope.textData4 = textData;
        var s4mpId = [];
        angular.forEach($scope.textData4.num2,function (val) {
            if(val.refObject != null){
                s4mpId.push(val.refObject.id);
            }
        });
        if(s4mpId.length > 0){
            $rootScope.ajax.get(_host + '/realTime/getPriceStockList', {mpIds: s4mpId}).then(function (res) {
                if (res.code == 0) {
                    angular.forEach($scope.textData4.num2,function (val) {
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
        $scope.scene4ShowLunbo = sceneShowLunbo;
        $scope.s4upBtn = false;
        $scope.s4nextBtn = false;
        if (!$scope.scene4ShowLunbo) {
            $scope.s4sevenBlocks = [];
            $scope.s4PageNo = 1;
            $scope.s4PageSize = 7;
            $scope.s4TotalPage = $scope.textData4.num2.length % $scope.s4PageSize == 0 ? (($scope.textData4.num2.length / $scope.s4PageSize) || 1) : parseInt($scope.textData4.num2.length / $scope.s4PageSize) + 1;
            $scope.s4sevenBlocks = $scope.textData4.num2.slice($scope.s4PageNo - 1, $scope.s4PageSize);
            if ($scope.s4PageNo < $scope.s4TotalPage) {
                $scope.s4nextBtn = true;
            }
        }
    };
    $scope.getfourthScene = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_SCENE_PAGE',
                adCode: 's4,s4_tab',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.get(url, params).then(function (res) {
            if(res.code == 0){
                if(res.data.s4 != null && res.data.s4.length>0){
                    $scope.fourthScene = res.data.s4[0];
                    if(res.data.s4_tab){
                        $scope.fourthSceneTab = res.data.s4_tab;
                        angular.forEach($scope.fourthSceneTab,function (val) {
                            val.select = false;
                            if(val.content.indexOf('s4_1_tab_banner') >=0) {
                                $scope.getDataByAdCode(val.content, $scope.textData4, $scope.scene4ShowLunbo, $scope.scene4callback);
                            }
                        });
                        $scope.fourthSceneTab[0]?($scope.fourthSceneTab[0].select = true):($scope.fourthSceneTab[0].select = false);
                    }
                }
            }
        })
    };
    $scope.getfourthScene();
    //第二后tab后翻页，下一页
    $scope.fourthTurnNextPage = function () {
        if ($scope.s4PageNo >= $scope.s4TotalPage) {
            return;
        }
        $scope.s4PageNo++;
        if ($scope.s4PageNo == $scope.s4TotalPage) {
            $scope.s4nextBtn = false;
        }
        $scope.s4sevenBlocks = [];
        $scope.s4sevenBlocks = $scope.textData4.num2.slice(($scope.s4PageNo - 1) * $scope.s4PageSize, $scope.s4PageNo * $scope.s4PageSize);
        $scope.s4upBtn = true;
    };
    //第二后tab后翻页，上一页
    $scope.fourthTurnUpPage = function () {
        if ($scope.s4PageNo <= 1) {
            return
        }
        $scope.s4PageNo--;
        if ($scope.s4PageNo == 1) {
            $scope.s4upBtn = false;
        }
        $scope.s4sevenBlocks = [];
        $scope.s4sevenBlocks = $scope.textData4.num2.slice(($scope.s4PageNo - 1) * $scope.s4PageSize, $scope.s4PageNo * $scope.s4PageSize);
        $scope.s4nextBtn = true;
    };


    //第五个场景
    $scope.fifthScene = {};
    $scope.fifthSceneTab = {};
    $scope.s5upBtn = true;
    $scope.s5nextBtn = true;
    $scope.scene5callback = function(textData, sceneShowLunbo) {
        $scope.textData5 = textData;
        var s5mpId = [];
        angular.forEach($scope.textData5.num2,function (val) {
            if(val.refObject != null){
                s5mpId.push(val.refObject.id);
            }
        });
        if(s5mpId.length > 0){
            $rootScope.ajax.get(_host + '/realTime/getPriceStockList', {mpIds: s5mpId}).then(function (res) {
                if (res.code == 0) {
                    angular.forEach($scope.textData5.num2,function (val) {
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
        $scope.scene5ShowLunbo = sceneShowLunbo;
        $scope.s5upBtn = false;
        $scope.s5nextBtn = false;
        if (!$scope.scene5ShowLunbo) {
            $scope.s5sevenBlocks = [];
            $scope.s5PageNo = 1;
            $scope.s5PageSize = 7;
            $scope.s5TotalPage = $scope.textData5.num2.length % $scope.s5PageSize == 0 ? (($scope.textData5.num2.length / $scope.s5PageSize) || 1) : parseInt($scope.textData5.num2.length / $scope.s5PageSize) + 1;
            $scope.s5sevenBlocks = $scope.textData5.num2.slice($scope.s5PageNo - 1, $scope.s5PageSize);
            if ($scope.s5PageNo < $scope.s5TotalPage) {
                $scope.s5nextBtn = true;
            }
        }
    };
    $scope.getFifthScene = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_SCENE_PAGE',
                adCode: 's5,s5_tab',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.get(url, params).then(function (res) {
            if(res.code == 0){
                if(res.data.s5 != null && res.data.s5.length>0){
                    $scope.fifthScene = res.data.s5[0];
                    if(res.data.s5_tab){
                        $scope.fifthSceneTab = res.data.s5_tab;
                        angular.forEach($scope.fifthSceneTab,function (val) {
                            val.select = false;
                            if(val.content.indexOf('s5_1_tab_banner') >=0) {
                                $scope.getDataByAdCode(val.content, $scope.textData5, $scope.scene5ShowLunbo, $scope.scene5callback);
                            }
                        });
                        $scope.fifthSceneTab[0]?($scope.fifthSceneTab[0].select = true):($scope.fifthSceneTab[0].select = false);
                    }
                }
            }
        })
    };
    $scope.getFifthScene();
    //第二后tab后翻页，下一页
    $scope.fifthTurnNextPage = function () {
        if ($scope.s5PageNo >= $scope.s5TotalPage) {
            return;
        }
        $scope.s5PageNo++;
        if ($scope.s5PageNo == $scope.s5TotalPage) {
            $scope.s5nextBtn = false;
        }
        $scope.s5sevenBlocks = [];
        $scope.s5sevenBlocks = $scope.textData5.num2.slice(($scope.s5PageNo - 1) * $scope.s5PageSize, $scope.s5PageNo * $scope.s5PageSize);
        $scope.s5upBtn = true;
    };
    //第二后tab后翻页，上一页
    $scope.fifthTurnUpPage = function () {
        if ($scope.s5PageNo <= 1) {
            return
        }
        $scope.s5PageNo--;
        if ($scope.s5PageNo == 1) {
            $scope.s5upBtn = false;
        }
        $scope.s5sevenBlocks = [];
        $scope.s5sevenBlocks = $scope.textData5.num2.slice(($scope.s5PageNo - 1) * $scope.s5PageSize, $scope.s5PageNo * $scope.s5PageSize);
        $scope.s5nextBtn = true;
    };


    //第六个场景
    $scope.sixthScene = {};
    $scope.sixthSceneTab = {};
    $scope.s6upBtn = true;
    $scope.s6nextBtn = true;
    $scope.scene6callback = function(textData, sceneShowLunbo) {
        $scope.textData6 = textData;
        var s6mpId = [];
        angular.forEach($scope.textData6.num2,function (val) {
            if(val.refObject != null){
                s6mpId.push(val.refObject.id);
            }
        });
        if(s6mpId.length > 0){
            $rootScope.ajax.get(_host + '/realTime/getPriceStockList', {mpIds: s6mpId}).then(function (res) {
                if (res.code == 0) {
                    angular.forEach($scope.textData6.num2,function (val) {
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
        $scope.scene6ShowLunbo = sceneShowLunbo;
        $scope.s6upBtn = false;
        $scope.s6nextBtn = false;
        if (!$scope.scene6ShowLunbo) {
            $scope.s6sevenBlocks = [];
            $scope.s6PageNo = 1;
            $scope.s6PageSize = 7;
            $scope.s6TotalPage = $scope.textData6.num2.length % $scope.s6PageSize == 0 ? (($scope.textData6.num2.length / $scope.s6PageSize) || 1) : parseInt($scope.textData6.num2.length / $scope.s6PageSize) + 1;
            $scope.s6sevenBlocks = $scope.textData6.num2.slice($scope.s6PageNo - 1, $scope.s6PageSize);
            if ($scope.s6PageNo < $scope.s6TotalPage) {
                $scope.s6nextBtn = true;
            }
        }
    };
    $scope.getSixthScene = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_SCENE_PAGE',
                adCode: 's6,s6_tab',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.get(url, params).then(function (res) {
            if(res.code == 0){
                if(res.data.s6 != null && res.data.s6.length>0){
                    $scope.sixthScene = res.data.s6[0];
                    if(res.data.s6_tab){
                        $scope.sixthSceneTab = res.data.s6_tab;
                        angular.forEach($scope.sixthSceneTab,function (val) {
                            val.select = false;
                            if(val.content.indexOf('s6_1_tab_banner') >=0) {
                                $scope.getDataByAdCode(val.content, $scope.textData6, $scope.scene6ShowLunbo, $scope.scene6callback);
                            }
                        });
                        $scope.sixthSceneTab[0]?($scope.sixthSceneTab[0].select = true):($scope.sixthSceneTab[0].select = false);
                    }
                }
            }
        })
    };
    $scope.getSixthScene();
    //第二后tab后翻页，下一页
    $scope.sixthTurnNextPage = function () {
        if ($scope.s6PageNo >= $scope.s6TotalPage) {
            return;
        }
        $scope.s6PageNo++;
        if ($scope.s6PageNo == $scope.s6TotalPage) {
            $scope.s6nextBtn = false;
        }
        $scope.s6sevenBlocks = [];
        $scope.s6sevenBlocks = $scope.textData6.num2.slice(($scope.s6PageNo - 1) * $scope.s6PageSize, $scope.s6PageNo * $scope.s6PageSize);
        $scope.s6upBtn = true;
    };
    //第二后tab后翻页，上一页
    $scope.sixthTurnUpPage = function () {
        if ($scope.s6PageNo <= 1) {
            return
        }
        $scope.s6PageNo--;
        if ($scope.s6PageNo == 1) {
            $scope.s6upBtn = false;
        }
        $scope.s6sevenBlocks = [];
        $scope.s6sevenBlocks = $scope.textData6.num2.slice(($scope.s6PageNo - 1) * $scope.s6PageSize, $scope.s6PageNo * $scope.s6PageSize);
        $scope.s6nextBtn = true;
    };



    //第七个场景
    $scope.seventhScene = {};
    $scope.seventhSceneTab = {};
    $scope.s7upBtn = true;
    $scope.s7nextBtn = true;
    $scope.scene7callback = function(textData, sceneShowLunbo) {
        $scope.textData7 = textData;
        var s7mpId = [];
        angular.forEach($scope.textData7.num2,function (val) {
            if(val.refObject != null){
                s7mpId.push(val.refObject.id);
            }
        });
        if(s7mpId.length > 0){
            $rootScope.ajax.get(_host + '/realTime/getPriceStockList', {mpIds: s7mpId}).then(function (res) {
                if (res.code == 0) {
                    angular.forEach($scope.textData7.num2,function (val) {
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
        $scope.scene7ShowLunbo = sceneShowLunbo;
        $scope.s7upBtn = false;
        $scope.s7nextBtn = false;
        if (!$scope.scene7ShowLunbo) {
            $scope.s7sevenBlocks = [];
            $scope.s7PageNo = 1;
            $scope.s7PageSize = 7;
            $scope.s7TotalPage = $scope.textData7.num2.length % $scope.s7PageSize == 0 ? (($scope.textData7.num2.length / $scope.s7PageSize) || 1) : parseInt($scope.textData7.num2.length / $scope.s7PageSize) + 1;
            $scope.s7sevenBlocks = $scope.textData7.num2.slice($scope.s7PageNo - 1, $scope.s7PageSize);
            if ($scope.s7PageNo < $scope.s7TotalPage) {
                $scope.s7nextBtn = true;
            }
        }
    };
    $scope.getSeventhScene = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_SCENE_PAGE',
                adCode: 's7,s7_tab',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.get(url, params).then(function (res) {
            if(res.code == 0){
                if(res.data.s7 != null && res.data.s7.length>0){
                    $scope.seventhScene = res.data.s7[0];
                    if(res.data.s7_tab){
                        $scope.seventhSceneTab = res.data.s7_tab;
                        angular.forEach($scope.seventhSceneTab,function (val) {
                            val.select = false;
                            if(val.content.indexOf('s7_1_tab_banner') >=0) {
                                $scope.getDataByAdCode(val.content, $scope.textData7, $scope.scene7ShowLunbo, $scope.scene7callback);
                            }
                        });
                        $scope.seventhSceneTab[0]?($scope.seventhSceneTab[0].select = true):($scope.seventhSceneTab[0].select = false);
                    }
                }
            }
        })
    };
    $scope.getSeventhScene();
    //第二后tab后翻页，下一页
    $scope.seventhTurnNextPage = function () {
        if ($scope.s7PageNo >= $scope.s7TotalPage) {
            return;
        }
        $scope.s7PageNo++;
        if ($scope.s7PageNo == $scope.s7TotalPage) {
            $scope.s7nextBtn = false;
        }
        $scope.s7sevenBlocks = [];
        $scope.s7sevenBlocks = $scope.textData7.num2.slice(($scope.s7PageNo - 1) * $scope.s7PageSize, $scope.s7PageNo * $scope.s7PageSize);
        $scope.s7upBtn = true;
    };
    //第二后tab后翻页，上一页
    $scope.seventhTurnUpPage = function () {
        if ($scope.s7PageNo <= 1) {
            return
        }
        $scope.s7PageNo--;
        if ($scope.s7PageNo == 1) {
            $scope.s7upBtn = false;
        }
        $scope.s7sevenBlocks = [];
        $scope.s7sevenBlocks = $scope.textData7.num2.slice(($scope.s7PageNo - 1) * $scope.s7PageSize, $scope.s7PageNo * $scope.s7PageSize);
        $scope.s7nextBtn = true;
    };


    //第八个场景
    $scope.eighthScene = {};
    $scope.eighthSceneTab = {};
    $scope.s8upBtn = true;
    $scope.s8nextBtn = true;
    $scope.scene8callback = function(textData, sceneShowLunbo) {
        $scope.textData8 = textData;
        var s8mpId = [];
        angular.forEach($scope.textData8.num2,function (val) {
            if(val.refObject != null){
                s8mpId.push(val.refObject.id);
            }
        });
        if(s8mpId.length > 0){
            $rootScope.ajax.get(_host + '/realTime/getPriceStockList', {mpIds: s8mpId}).then(function (res) {
                if (res.code == 0) {
                    angular.forEach($scope.textData8.num2,function (val) {
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
        $scope.scene8ShowLunbo = sceneShowLunbo;
        $scope.s8upBtn = false;
        $scope.s8nextBtn = false;
        if (!$scope.scene8ShowLunbo) {
            $scope.s8sevenBlocks = [];
            $scope.s8PageNo = 1;
            $scope.s8PageSize = 7;
            $scope.s8TotalPage = $scope.textData8.num2.length % $scope.s8PageSize == 0 ? (($scope.textData8.num2.length / $scope.s8PageSize) || 1) : parseInt($scope.textData8.num2.length / $scope.s8PageSize) + 1;
            $scope.s8sevenBlocks = $scope.textData8.num2.slice($scope.s8PageNo - 1, $scope.s8PageSize);
            if ($scope.s8PageNo < $scope.s8TotalPage) {
                $scope.s8nextBtn = true;
            }
        }
    };
    $scope.getEighthScene = function () {
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_SCENE_PAGE',
                adCode: 's8,s8_tab',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.get(url, params).then(function (res) {
            if(res.code == 0){
                if(res.data.s8 != null && res.data.s8.length>0){
                    $scope.eighthScene = res.data.s8[0];
                    if(res.data.s8_tab){
                        $scope.eighthSceneTab = res.data.s8_tab;
                        angular.forEach($scope.eighthSceneTab,function (val) {
                            val.select = false;
                            if(val.content.indexOf('s8_1_tab_banner') >=0) {
                                $scope.getDataByAdCode(val.content, $scope.textData8, $scope.scene8ShowLunbo, $scope.scene8callback);
                            }
                        });
                        $scope.eighthSceneTab[0]?($scope.eighthSceneTab[0].select = true):($scope.eighthSceneTab[0].select = false);
                    }
                }
            }
        })
    };
    $scope.getEighthScene();
    //第二后tab后翻页，下一页
    $scope.eighthTurnNextPage = function () {
        if ($scope.s8PageNo >= $scope.s8TotalPage) {
            return;
        }
        $scope.s8PageNo++;
        if ($scope.s8PageNo == $scope.s8TotalPage) {
            $scope.s8nextBtn = false;
        }
        $scope.s8sevenBlocks = [];
        $scope.s8sevenBlocks = $scope.textData8.num2.slice(($scope.s8PageNo - 1) * $scope.s8PageSize, $scope.s8PageNo * $scope.s8PageSize);
        $scope.s8upBtn = true;
    };
    //第二后tab后翻页，上一页
    $scope.eighthTurnUpPage = function () {
        if ($scope.s8PageNo <= 1) {
            return
        }
        $scope.s8PageNo--;
        if ($scope.s8PageNo == 1) {
            $scope.s8upBtn = false;
        }
        $scope.s8sevenBlocks = [];
        $scope.s8sevenBlocks = $scope.textData8.num2.slice(($scope.s8PageNo - 1) * $scope.s8PageSize, $scope.s8PageNo * $scope.s8PageSize);
        $scope.s8nextBtn = true;
    };



    //根据adCode查
    $scope.getDataByAdCode = function (adCode, textData, sceneShowLunbo, scenecallback,tab,data,type) {
        if(type==true) {
            tab.select = true;
            angular.forEach( data,function(a) {
                if( tab.id != a.id ) {
                    a.select = false;
                }
            } )
        }
        textData = {};
        if (adCode.indexOf('s1_1_tab_banner') >= 0 || adCode.indexOf('s2_1_tab_banner') >= 0 ||
            adCode.indexOf('s3_1_tab_banner') >= 0 || adCode.indexOf('s4_1_tab_banner') >= 0 ||
            adCode.indexOf('s5_1_tab_banner') >= 0 || adCode.indexOf('s6_1_tab_banner') >= 0 ||
            adCode.indexOf('s7_1_tab_banner') >= 0 || adCode.indexOf('s8_1_tab_banner') >= 0) {
            sceneShowLunbo = true;
        } else {
            sceneShowLunbo = false;
        }

        adCode = adCode.replace(/，/ig, ',');
        var codesList = adCode.split(",");
        var url = $rootScope.host + '/dolphin/list',
            params = {
                pageCode: 'PC_SCENE_PAGE',
                adCode: adCode,
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.get(url, params).then(function (res) {
            if (res.data) {
                angular.forEach(codesList, function (val, index) {
                    textData['num' + (index + 1)] = res.data[val];
                });
                scenecallback(textData, sceneShowLunbo);
            }
        })

    };

    $scope.anchorJump = function (sceneId) {
        var choosedId= $('body #' + sceneId);
        if (!choosedId[0]) {
            return;
        }
        var scrollHeight = choosedId.offset().top - 30;

        $("html,body").animate({
            scrollTop: scrollHeight
        });

    };
    $timeout(function(){
        var urlParamsId = $rootScope.util.paramsFormat().anchor;
        // var sceneId = 'scene1';
        // if(urlParamsId){
        //     var sceneId = urlParamsId;
        //     //document.getElementById(urlParamsId).scrollIntoView(true);return false;
        // }
        $scope.anchorJump(urlParamsId);
    },1000)

    // $scope.getDataByAdCode('first_floor');
}]);
$(function(){
    //置顶
    $('.goTopImg-box').click(function(){
        $("html,body").animate({scrollTop:0}, 500);
    })
    //页面滚动到一定程度让左侧锚点栏悬浮
    $(window).scroll(function(event) {
        "use strict";
        if( $(window).scrollTop() >= 650 ) {
            $('.left-target-box').css({
                'position' : 'fixed',
                'left' : '15%',
                'top' : '253px'
            })
        } else {
            $('.left-target-box').css({
                'position' : 'absolute',
                'top' : '265px',
                'left' : '-67px',
            })
        }
    })
});
