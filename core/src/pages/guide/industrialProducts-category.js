/**
 * Created by Roy on 15/10/20.
 */
appControllers.controller("industrialProductsCtrl", ['$log', '$rootScope', '$scope', '$location', 'commonService', 'categoryService', '$anchorScroll','$window', function ($log, $rootScope, $scope, $location, commonService, categoryService, $anchorScroll,$window) {  
    var util = $rootScope.util
    var urlParams = util.paramsFormat(location.search);
    // 获取广告轮播
    $scope.getLunboAndRightAd = function () {
        var url = '/ad-whale-web/dolphin/getAdSource',
            params = {
                pageCode:'HOME',
                adCode:'gyp_banner',
                platform:1,
                companyId:$rootScope.companyId
            };
        $rootScope.ajax.get(url,params).then(function (res) {
            if (res.data && res.data.gyp_banner) {
                $scope.lunbo = res.data.gyp_banner;
            }
        })
    };
    $scope.endLoading = false
    $scope.getLunboAndRightAd();
    // 获取广告图标
    $scope.getIcomImg = function() {
        var url = '/ad-whale-web/dolphin/getAdSource'
        var params = {
            pageCode:'HOME',
            adCode:'gyp_brand',
            platform:1,
            companyId:$rootScope.companyId
        }
        $rootScope.ajax.get(url,params).then(function(res) {
            if (res.code ==0) {
                // debugger
                $scope.gyp_brand = res.data.gyp_brand || []
            }
        })
    }
    $scope.getIcomImg()
    // 获取商品总数
    $scope.getAllProNum = function() {
        var url = '/custom-sbd-web/industrialProduct/getIndustrialProductCount.do '
        var params = {
            // merchantId: -99,
            type: 99
        }
        $rootScope.ajax.postJson(url,params).then(function(res) {
            if (res.code ==0 && res.data) {
                $scope.totalNum = res.data.total
            }           
        })
    },
    $scope.getAllProNum()
    // 类目初始值
    $scope.listChildrenCategory = []
    $scope.totalCategory = 0
    // 初始化一级类目商品数量统计
    $scope.firstCategoryNum = null
    // 获取工业品类目
    $scope.listChildrenCategoryWithNologin = function() {
        var url = '/back-product-web2/extra/category/listChildrenCategoryWithNologin.do'
        var params = {
            parentId: 100000000,
            treeHigh: 1
        }     
        $rootScope.ajax.postJson(url,params).then(function(res) {
            if (res.code ==0 ) {
                $scope.listChildrenCategory = res.data || []
                $scope.totalCategory = $scope.listChildrenCategory.length
                var arr = []
                angular.forEach($scope.listChildrenCategory,function(item) {
                    arr.push(item.id)
                })
                var url = '/custom-sbd-web/industrialProduct/getFirstCategoryProductCount.do'
                var params = {
                    navCategoryIds: arr.join()
                }
                $rootScope.ajax.get(url,params).then(function(res) {
                    if (res.code ==0 && res.data) {
                        $scope.firstCategoryNum = res.data
                        angular.forEach($scope.listChildrenCategory,function(item) {
                            item.firstCategoryNum = $scope.firstCategoryNum[item.id]
                        })
                        $scope.listChildrenCategoryWithNologin2($scope.listChildrenCategory)
                    }
                })
            }           
        })    
    }
    // 获取二级类目
    $scope.listChildrenCategoryWithNologin2 = function(list) {
        // 遍历一级类目，添加二级和三级类目
        angular.forEach(list,function(item,index) {
            // if (index <=4) {
                var url = '/back-product-web2/extra/category/listChildrenCategoryWithNologin.do'
                var params = {
                    parentId: item.id,
                    treeHigh: 2
                }
                var allTotal = 0
                $rootScope.ajax.postJson(url,params).then(function(res) {
                    if (res.code == 0) {
                        allTotal = res.data.length
                        item.allTotal = allTotal
                        item.secondCategory = []
                        var flag = false
                        angular.forEach(res.data,function(secondItem,secondIndex) {
                            if (secondItem.level == 3) {
                                item.secondCategory.push(secondItem)
                            }
                            if (secondIndex >= res.data.length-1) {
                                flag = true
                            }
                        })
                        var flag2 = false 
                        if (flag) {
                            angular.forEach(item.secondCategory,function(itemss,index){
                                item.secondCategory[index].thirdCategory = []
                                if (index == item.secondCategory.length-1) {
                                    flag2 = true
                                }
                            })
                        }                       
                        if (flag && flag2) {
                            angular.forEach(res.data,function(items,idx) {
                                angular.forEach(item.secondCategory,function(thirdItem,thirdIndex) {
                                    if (items.parentId == thirdItem.id) {
                                        item.secondCategory[thirdIndex].thirdCategory.push(items)
                                    }
                                })
                            })
                        }                        
                        if (index == list.length - 1) {
                            $scope.endLoading = true
                            // 锚点跳转
                            if (urlParams.id) {
                                var num = Number(urlParams.id)                               
                                // setTimeout(function(){
                                //     var eleHeight = document.getElementsByClassName('goToJump')[num].offsetTop
                                //     document.body.scollTop = eleHeight;
                                //     document.documentElement.scrollTop = eleHeight;
                                // },200)
                                var timer = setInterval(function(){
                                    var flag = false
                                    var ele = document.getElementsByClassName('goToJump')
                                    if (ele && ele.length) {
                                        flag = true
                                        var eleHeight = document.getElementsByClassName('goToJump')[num].offsetTop
                                        document.body.scollTop = eleHeight;
                                        document.documentElement.scrollTop = eleHeight;
                                    }
                                    if (flag) {
                                        clearInterval(timer)
                                    }
                                },50)
                                
                            }
                        }
                    }
                })
            // }
        })
        // console.log(list)
    }
    $scope.totalCategory = 0
    $scope.listChildrenCategoryWithNologin()
    // 根據类目查找商品
    $scope.chooseCategory = function(item,index) {
        // if (index ==0) {
        //     return
        // }
        location.href = 'agreegation-search.html?navCategoryIds=' + item.id + '&categoryTreeNodeId=' + item.id + '&pageSize=40&pageNo=1#?pageNo=1'
    }
}]);
