/**
 * Created by Roy on 15/10/20.
 */
appControllers.controller("industrialProductsCtrl", ['$log', '$rootScope', '$scope', '$location', 'commonService', 'categoryService', '$anchorScroll','$window', function ($log, $rootScope, $scope, $location, commonService, categoryService, $anchorScroll,$window) {  
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
        var url = '/industrialProduct/getIndustrialProductCount.do '
        var params = {
            merchantId: -99,
            type: 99
        }
        $rootScope.ajax.postJson(url,params).then(function(res) {
            if (res.code ==0 && res.data) {
                $scope.totalNum = res.data.total
            }           
        })
    },
    // $scope.getAllProNum()
    // 类目初始值
    $scope.listChildrenCategory = []
    $scope.totalCategory = 0
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
                $scope.listChildrenCategoryWithNologin2($scope.listChildrenCategory)
            }           
        })    
    }
    // 获取二级类目
    $scope.listChildrenCategoryWithNologin2 = function(list) {
        // 遍历一级类目，添加二级和三级类目
        angular.forEach(list,function(item,index) {
            if (index <=4) {
                var url = '/back-product-web2/extra/category/listChildrenCategoryWithNologin.do'
                var params = {
                    parentId: item.id,
                    treeHigh: 2
                }
                $rootScope.ajax.postJson(url,params).then(function(res) {
                    if (res.code == 0) {
                        item.secondCategory = []
                        var flag = false
                        angular.forEach(res.data,function(secondItem,secondIndex) {
                            if (secondItem.level == 3) {
                                item.secondCategory.push(secondItem)
                            }                           
                        })                     
                        if (index == list.length - 1 || index==4) {
                                $scope.endLoading = true
                        }
                    }
                })
            }
        })
    }
    $scope.totalCategory = 0
    $scope.listChildrenCategoryWithNologin()
    // 根據类目查找商品
    $scope.chooseCategory = function(item,index) {
        location.href = 'agreegation-search.html?navCategoryIds=' + item.id + '&categoryTreeNodeId=' + item.id + '&pageSize=40&pageNo=1#?pageNo=1'
    }
    $scope.goToUrl = function(item,index) {
        if (!item) {
            location.href = '/industrialProducts-category.html'
        } else {
            location.href = '/industrialProducts-category.html?id=' + index
        }
    }
    
    

    //   function downloadFileByPost(url, params = {}) {
    //     // 定义一个form表单,通过form表单来发送请求
    //     var form = $('<form>')
    //       .attr('style', 'display:none')
    //       .attr('method', 'post')
    //       .attr('action', url)
      
    //     // 在表单中添加input标签来传递参数
    //     // 如有多个参数可添加多个input标签
      
    //     $.each(params, (key, val) => {
    //       $('<input>').attr('type', 'hidden').attr('name', key).attr('value', val).appendTo(form)
    //     })
      
    //     form.appendTo('body').submit()// 表单提交
    //   }
}]);
