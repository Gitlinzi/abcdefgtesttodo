

appControllers.controller("compareBoxCtrl", ['$log', '$rootScope', '$scope', 'commonService', 'categoryService', "$cmsData","$window",function ($log, $rootScope, $scope, commonService,categoryService,$cmsData,$window) {
    'use strict';
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
                $scope.getLabelList()
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

    //查询商品属性
    $scope.getSpec = function () {
        let url = '/custom-sbd-web/product/getCurrentUserComparisonBoxFields.do';
        $rootScope.ajax.postJson(url,{}).then(res=>{
            if (res.code == 0  && res.data) {
                $scope.proProptyList = res.data
                var arr = []
                var arr2 = []
                for(var pl in res.data) {
                    if(res.data.hasOwnProperty(pl)) {
                        arr.push(pl)
                        arr2.push(res.data[pl])
                    }
                }
                $scope.spesList = arr
                $scope.proProptyList = arr2
            }
            
            
        },function (result) {
            $rootScope.error.checkCode($scope.i18n('系统异常'),$scope.i18n('系统异常'),{
                type:'info'
            });
        })
    };
    $scope.getSpec();

    //查单个商品规格
    $scope.getItemSpec= function (item) {//商品规格
        var url = '/back-product-web2/extra/merchantProduct/listMerchantProductAttributeByMpId.do',
            params = {
                mpId:item.mpId,
            };
        $rootScope.ajax.postJson(url, params).then(function (response) {
            if (response.data) {
                // $scope.itemAttrSpec = response.data;
            }
        })
    }
    // 查所有商品规格
    $scope.getAllItemSpec = function (compareBoxList) {
        angular.forEach(compareBoxList,function (item) {
            $scope.getItemSpec(item)
        })
    }

    //获取比较盒详情列表
    $scope.getCompareBox = function () {
        
        var url = $rootScope.home +  '/custom-sbd-web/product/getCurrentUserComparisonBox.do';
        $rootScope.ajax.postJson(url,{}).then(res=>{
            if (res.code == 0 && res.data) {
                var boxList = angular.copy(res.data) || [];
                for (let i = 0; i < 5-res.data.length; i++){
                    boxList.push({})
                }
                $scope.compareBoxList = boxList;
                if ( $scope.compareBoxList && $scope.compareBoxList.length > 0) {
                    $scope.getAllItemSpec($scope .compareBoxList)
                }
            }
            
        },function (result) {
            $rootScope.error.checkCode($scope.i18n('系统异常'),$scope.i18n('系统异常'),{
                type:'info'
            });
        })
    };
    $scope.getCompareBox();

    $scope.goSearch = function () {
        window.history.go(-1)
    };

    //删除比较盒
    $scope.delCompareBox = function (merchantProductId) {

        var url = $rootScope.home + '/custom-sbd-web/product/deleteComparisonBox.do';
        $rootScope.ajax.postJson(url,{merchantProductId}).then(res=>{
            if (res.code == 0) {
                $scope.getCompareBox();
            }else{
                $rootScope.error.checkCode($scope.i18n('删除失败'),$scope.i18n('删除失败'),{
                    type:'info'
                });
            }
            
        },function (result) {
            $rootScope.error.checkCode($scope.i18n('系统异常'),$scope.i18n('系统异常'),{
                type:'info'
            });
        })
    };
    $scope.buy = function (item) {
        // console.log(1);
        
        // console.log(item);
        
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
    },
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
    },
    //加入收藏
    $scope.addFavorite = function (event, product){
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
    //点击添加至预置订单
    $scope.addAdvance = function(item,prodList){
        angular.forEach(prodList,function (item) {
            if (item.advanceShow) {
                item.advanceShow = false;
            }
        })
        item.advanceShow = true;
    };
    //如果列表页可以加入购物车， 监听子控制器的事件
    $rootScope.$on('updateMiniCartToParent',function () {
        //监听到事件后再广播出去
        $scope.$broadcast('updateMiniCart');
    });
}]);
$(function () {
    'use strict'
    //置顶
    $('.top-box').click(function () {
        $("html,body").animate({
            scrollTop: 0
        }, 500);
    })
})
