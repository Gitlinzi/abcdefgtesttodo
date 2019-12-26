/**
 * Created by Roy on 17/6/29.
 */
'use strict';
angular.module('appControllers').controller('frequenceCtrl', ["$scope", "$rootScope", "$cookieStore", "commonService", 'categoryService', "validateService", "Upload", "$state", "$stateParams","$window", function ($scope, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload, $state, $stateParams,$window) {
        
    //国际化
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    }

    var _host = $rootScope.host,
        _ut = $rootScope.util.getUserToken(),
        _fnP = $rootScope.ajax.post,
        _fnG = $rootScope.ajax.get,
        _fnE = $rootScope.error.checkCode,
        _companyId = $rootScope.companyId;

    if (_ut == undefined || _ut == null || _ut == '') {
        $rootScope.showLoginBox = true
        return
    }
    //公共参数
    $scope.favoriteGoods = null;
    $scope.mpIds = [];
    $scope.isShowIcon = false;//是否展示icon
    $scope.isShowPage = false;

    $scope.createTagModal = false //显示创建标签弹窗
    $scope.deleteTagModal = false //显示删除标签弹窗
    $scope.showMoreTags = false //显示'更多'（标签）

    $scope.currentTagId = -1 //根据标签id查询收藏商品 -1为全部

    $scope.getIsAdmin = function() {
        const url = "/custom-sbd-web/advFavoritesTag/queryIsAdmin.do"
        $rootScope.ajax.post(url).then(function(res) {
            if(res.code == 0) {
                $scope.isSuperAdmin = res.result.isAdmin == 1
            }else {
                $rootScope.error.checkCode(res.code, res.message);
            }
        })
    }

    $scope.showCreateTagModal = function() {
        $scope.newTagName = ""
        $scope.createTagModal = true
    }

    $scope.hideCreateTagModal = function() {
        $scope.createTagModal = false
    }

    $scope.createTag = function(newTagName) {
        const url = "/custom-sbd-web/advFavoritesTag/addAdvFavoritesTag.do"
        const params = {tagName: newTagName}
        $rootScope.ajax.postJson(url, params).then(function(res) {
            if(newTagName.length > 10 || newTagName.length < 1) {
                $rootScope.error.checkCode($scope.i18n('标签字符限制1-10个字符'), $scope.i18n('标签字符限制1-10个字符'))
                return
            }
            if(res.code == 0 && res.result.isExist == 1) {
                res.code = -1
                res.message = "已存在相同标签名"
            }
            if(res.code == 0) {
                $scope.hideCreateTagModal()
                if($scope.taglist.length>1){
                    $scope.getMyTaglist()
                    return
                } else {
                    $scope.newTagName = ""
                    $rootScope.error.checkCode($scope.i18n('添加标签成功'), $scope.i18n('添加标签成功'))
                    $scope.changeTag('myTag')
                }
            }else {
                $rootScope.error.checkCode(res.code, res.message)
            }
        })
    }

    $scope.changeTag = function(newTag) {
        $scope.favoriteGoods = []
        if($scope.activeTag != newTag) { //如果当前标签页不同，隐藏'显示更多标签'
            $scope.showMoreTags = false
        }
        if(newTag == 'myTag') {//我的收藏标签
            $scope.activeTag = 'myTag'
            $scope.getMyTaglist()
        }else {//共享标签
            $scope.activeTag = 'sharedTag'
            $scope.getSharedTaglist()
        }
    }

    $scope.getMyTaglist = function() {
        $scope.taglist = []
        const url = '/custom-sbd-web/advFavoritesTag/queryAdvFavoritesTag.do'
        const params = {collectOrShare: 0} //0 我的收藏标签
        $rootScope.ajax.postJson(url, params).then(function(res) {
            if(res.code == 0) {
               /* if(res.result && res.result.length > 1) {
                   // $rootScope.error.checkCode($scope.i18n('仅支持创建一个收藏标签'), $scope.i18n('仅支持创建一个收藏标签'))
                    //$scope.deleteTag(res.result[1])
                    $scope.getFavoriteGoods()
                } else {*/
                    $scope.taglist = res.result;
                    //$scope.totalEntityCount = $scope.taglist[0].entityCount;
                    $scope.totalEntityCount = $scope.taglist.reduce((a,b)=>a+b.entityCount, 0);
                    $scope.taglist.forEach(tag => tag.isChecked = tag.isShare == 1)
                    $scope.clickTag(-1)
               // }
            }else {
                $rootScope.error.checkCode(res.code, res.message);
            }
        })
    }

    $scope.getSharedTaglist = function() {
        $scope.taglist = []
        $scope.totalEntityCount = ''
        const url = '/custom-sbd-web/advFavoritesTag/queryAdvFavoritesTag.do'
        const params = {collectOrShare: 1} //1 共享标签
        $rootScope.ajax.postJson(url, params).then(function(res) {
            if(res.code == 0) {
               /* if(res.result && res.result.length > 1) {
                    $rootScope.error.checkCode($scope.i18n('仅支持创建一个共享标签'), $scope.i18n('仅支持创建一个共享标签'))
                    $scope.deleteTag(res.result[1])
                } else {*/
                    $scope.taglist = res.result
                    $scope.totalEntityCount = $scope.taglist.reduce((a,b)=>a+b.entityCount, 0);
                    //$scope.totalEntityCount = $scope.taglist[0].entityCount
                    console.log("$scope.taglist[0].entityCount",$scope.taglist[0].entityCount)
/*
                }
*/
                $scope.clickTag(-1)
            }else {
                $rootScope.error.checkCode(res.code, res.message);
            }
        })
    }

    $scope.editTag = function(tag) {
        $scope.taglist.forEach(tag => {
            tag.edit = false
        })
        tag.edit = true
        tag.editName = tag.tagName
    }

    $scope.editTagConfirm = function(tag) {
        
        if(tag.editName.length > 10 || tag.editName.length < 1) {
            $rootScope.error.checkCode($scope.i18n('标签字符限制1-10个字符'), $scope.i18n('标签字符限制1-10个字符'))
            return
        }

        const url = "/custom-sbd-web/advFavoritesTag/modifyAdvFavoritesTag.do"
        const params = {id: tag.id, tagName: tag.editName}
        $rootScope.ajax.postJson(url, params).then(function(res) {
            
            if(res.code == 0 && res.result.isExist == 1) {
                res.code = -1
                res.message = "已存在相同标签名"
            }
            if(res.code == 0) {
                tag.tagName = tag.editName
                tag.edit = false
                $scope.getFavoriteGoods()
            }else {
                $rootScope.error.checkCode(res.code, res.message);
            }
        })
    }

    $scope.deleteTag = function(tag) {
        $scope.deleteTagName = tag.tagName
        $scope.deleteTagId = tag.id
        $scope.deleteTagModal = true
    }

    $scope.deleteTagConfirm = function() {
        const url = "/custom-sbd-web/advFavoritesTag/delAdvFavoritesTag.do"
        const params = {id: $scope.deleteTagId}
        $rootScope.ajax.postJson(url, params).then(function(res) {
            if(res.code == 0) {
                $scope.changeTag('myTag')
                $scope.hideDeleteTagModal()
            }else {
                $rootScope.error.checkCode(res.code, res.message);
            }
        })
    }

    $scope.clickTag = function(tagId) {
        $scope.pageNo = 1
        $scope.currentTagId = tagId
        $scope.getFavoriteGoods()
    }

    //@param shareFlag 0分享 1取消
    $scope.shareTags = function(shareFlag) {
        let tagIdList = $scope.taglist.filter(tag => tag.isChecked).map(tag => tag.id)
        if(tagIdList.length == 0) {
            return
        }
        const url = "/custom-sbd-web/advFavoritesTag/shareOrCancelAdvFavoritesTag.do"
        const params = {ids: tagIdList, shareFlag: shareFlag}
        $rootScope.ajax.postJson(url, params).then(function(res) {
            if(res.code == 0) {
                if(shareFlag == 0) {
                    $rootScope.error.checkCode($scope.i18n('分享成功'), $scope.i18n('分享成功'));
                }else if(shareFlag == 1) {
                    $rootScope.error.checkCode($scope.i18n('取消分享成功'), $scope.i18n('取消分享成功'));
                }
                $scope.changeTag($scope.activeTag)
            }else {
                $rootScope.error.checkCode(res.code, res.message);
            }
        })
    }

    $scope.clickShowMoreTags = function() {
        $scope.showMoreTags = true
    }

    $scope.hideDeleteTagModal = function() {
        $scope.deleteTagModal = false
    }

    $scope.editFavGoodTag = function(item) {
        $scope.favoriteGoods.forEach(fg => {
            $scope.cancelEditFavGoodTag(fg)
        })
        item.editTagId = item.favoriteTagId
        item.editTag = true
    }

    $scope.cancelEditFavGoodTag = function(item) {
        item.editTag = false
    }

    $scope.confirmEditFavGoodTag = function(item) {
        //编辑新标签与原标签相同
        if(item.favoriteTagId == item.editTagId) {
            return
        }
        const url = "/custom-sbd-web/advFavoritesTag/modifyItemAdvFavoritesTag.do"
        const params = {
            id: item.favoriteTagId,
            entityId: item.mpId,
            modifyId: item.editTagId
        }
        $rootScope.ajax.postJson(url, params).then(function(res) {
            if(res.code == 0) {
                item.editTag = false
                $scope.getFavoriteGoods()
                $scope.changeTag($scope.activeTag)
            }else {
                $rootScope.error.checkCode(res.code, res.message);
            }
        })
    }

    //初始化
    $scope.init = function () {
        "use strict";
        $scope.initPagination();
        $scope.changeTag('myTag');
        $scope.getIsAdmin();
    }

    //点击全选
    $scope.clickCheckAll = function () {
        $scope.favoriteGoods.forEach(fg => {
            fg.isChecked = $scope.ckAll
        })
    }

    //初始化翻页
    $scope.initPagination = function () {
        $scope.pageNo = 1;
        $scope.pageSize = 12;
        $scope.totalCount = 0;
    };

    //翻页广播接收
    $scope.$on('changePageNo', function (event, data) {
        "use strict";
        $scope.pageNo = data;
        $scope.getFavoriteGoods();
    })

    //获取收藏商品
    $scope.getFavoriteGoods = function () {
        $scope.favoriteGoods = []
        $scope.ckAll = false
        const url = "/ouser-center/api/favorite/queryFavoriteDetailPage.do"
        const params = {
            currentPage: $scope.pageNo,
            itemsPerPage: $scope.pageSize,
            entityType : 1,
            accessPathType:100
        }
        if($scope.activeTag == 'sharedTag') {
            params.collectOrMutual = 1
        }
        if($scope.currentTagId != -1) {
            params.favoriteTagId = $scope.currentTagId
        }
        if($scope.currentTagId == -1 && $scope.activeTag == 'sharedTag') {
            params.favoriteTagIds = $scope.taglist.map(tag => tag.id)
            if(params.favoriteTagIds.length == 0) {
                return
            }
        }
        $rootScope.ajax.post(url,params).then(function (res) {
            if (res.code == 0) {
                $scope.totalCount = res.data.total
                $scope.totalPage = Math.ceil(res.data.total / $scope.pageSize)
                $scope.favoriteGoods = []
                if(res.data.listObj) {
                    $scope.favoriteGoods = res.data.listObj || []
                    $scope.favoriteGoods.forEach(item => {
                        item.isChecked = false
                    })
                    $scope.getStockList()
                }
            }else {
                $rootScope.error.checkCode(res.code, res.message);
            }
        },function(){
            $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('获取收藏异常'));
        })
    }

    //获取实时库存
    $scope.getStockList = function() {
        const url = $rootScope.host + "/realTime/getPriceStockList"
        let mpIds = $scope.favoriteGoods.map(item => item.mpId)
        let areaCode = ''
        if($rootScope.util.getCookies("areasCode")) {
            areaCode = JSON.parse($rootScope.util.getCookies("areasCode")).oneCode
        }else {
            areaCode = $rootScope.defaultAreasCode
        }
        const params = {mpIds, areaCode}
        $rootScope.ajax.get(url, params).then(res => {
            if (res.code == 0) {
                res.data.plist.forEach(stock => {
                    let favItem = $scope.favoriteGoods.find(item => item.mpId == stock.mpId)
                    favItem.realPrice = stock.availablePrice
                    favItem.realNum = stock.stockNum
                    favItem.realNumText = stock.stockText
                    favItem.stockNum = stock.stockNum
                })
            } else {
                $rootScope.error.checkCode(res.code, res.message);
            }
        },function(){
            $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('获取实时库存价格异常'));
        })
    }

    //收藏商品点击选择
    $scope.toggleCheck = function(item) {
        item.isChecked = !item.isChecked
        let arr = $scope.favoriteGoods.filter(vv => vv.isChecked)
        $scope.ckAll = arr.length == $scope.favoriteGoods.length
    }

    //取消收藏
    $scope.deleteFavorite = function (ids) {
        const url = "/ouser-center/api/favorite/delete.do";
        const params = {
            entityIds: ids,
            entityType : 1
        }
        $rootScope.ajax.post(url, params).then(function (res) {
            if (res.code == 0) {
                $scope.init();
            } else {
                $rootScope.error.checkCode(res.code, res.message);
            }
        })
    }

    //批量执行删除
    $scope.batchDeleteFavorite = function () {
        let ids = [];
        $scope.favoriteGoods.forEach(fg => {
            if(fg.isChecked) {
                ids.push(fg.mpId)
            }
        })
        ids = ids.join();
        if (ids.length > 0) {
            $scope.deleteFavorite(ids);
        } else {
            $rootScope.error.checkCode($scope.i18n('确定'), $scope.i18n('请选择商品'));
        }
    }


}]);
