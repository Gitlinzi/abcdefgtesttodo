/**
 * Created by Roy on 17/6/29.
 */
'use strict';
angular.module('appControllers').controller('memeberCtrl', ["$scope", "$rootScope", "$cookieStore", "commonService", 'categoryService', "validateService", "Upload", "$state", "$stateParams", "$q","$window",
    function ($scope, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload, $state, $stateParams, $q,$window) {
        //国际化
        $scope.i18n = function (key) {
            return $window.i18n ? $window.i18n(key) : key;
        };
        //公共参数
        var _host = $rootScope.host,
            _ut = $rootScope.util.getUserToken(),
            _cid = $rootScope.companyId;

        if(!_ut){
            $rootScope.showLoginBox = true;
            return;
        };

        if( $rootScope.util.getCookies("areasCode") ) {
            $rootScope.areasCode = JSON.parse($rootScope.util.getCookies("areasCode"));
            $scope.areasCodeOneCode = $rootScope.areasCode.oneCode;
        }

        //类目树
        $scope.categoryContent = {};
        $scope.categoryContent.addborder = false;
        $scope.categoryTreeShow = function () {
            var zCategoryTree = $.fn.zTree.getZTreeObj("categoryTree");
            if (isEmpty(zCategoryTree)) {
                $scope.initCategoryTree();
            } else {
                $scope.categoryContent.addborder = true;
            }

        };
        //初始化类目树
        $scope.initCategoryTree = function () {
            var url = '/api/category/list',
                params = {
                    parentId:0,
                    pageType:1,
                    level:3,
                    levelLimit:10
                };
            $rootScope.ajax.get(url,params).then(function (result) {
                var setting = {
                    view: {
                        showIcon: true,
                        selectedMulti: true,
                        showLine: false,
                        fontCss: getFontCss
                    },
                    check: {
                        enable: true,
                        chkboxType: {"Y": "ps", "N": "ps"}
                    },
                    data: {
                        simpleData: {
                            enable: true,
                            idKey: "categoryTreeNodeId",
                            pIdKey: "categoryId",
                            rootPId: null
                        },
                        key: {
                            name: 'categoryName'
                        }
                    },
                    callback: {
                        onCheck: onCheck
                    }
                };
                $.fn.zTree.init($("#categoryTree"), setting, result.data.categorys);
                $scope.categoryContent.addborder = true;
            });
        }

        function isEmpty(e) {//判断是否为空
            if (e != 0 && !e) {
                return true;
            } else if (e.length == 0) {
                return true;
            }
            return false;
        }

        function onCheck(e, treeId, treeNode) {
            var zTree = $.fn.zTree.getZTreeObj("categoryTree"),
                nodes = zTree.getCheckedNodes(true),
                v = "";
            var categorySel = $("#categorySel");
            if (isEmpty(nodes)) {
                categorySel.val(v);
                return;
            } else {
                angular.forEach(nodes, function (data) {
                    //只添加叶子节点
                    if (!data.isParent) {
                        v += data.categoryName + ",";
                    }
                });
            }
            if (v.length > 0) {
                v = v.substring(0, v.length - 1);
            }
            categorySel.val(v);
        }

        function getFontCss(treeId, treeNode) {
            return (!!treeNode.highlight) ? {color: "#A60000", "font-weight": "bold"} : {
                color: "#333",
                "font-weight": "normal"
            };
        }

        //初始化翻页
        $scope.initPagination = function () {
            //翻页广播接收
            $scope.pageNo = 1;
            $scope.pageSize = 10;
            $scope.totalCount = 0;
        };

        $scope.$on('changePageNo', function (event, data) {
            "use strict";
            $scope.pageNo = data;
            $scope.channelMember.getProduct();
        })

        //初始化搜索参数
        $scope.searchObj = {
            keyword: '*****',
            platformId: $rootScope.platformId,
            companyId: _cid,
            isSubProduct: 1//查子品
        };


        $scope.channelMember = {
            isShowPage: false,
            list: null,
            mpIds: null,
            productName: '',
            tempProduct: [],//选中的商品
            //获取商品

            putTempProduct: function () {
                var that = this;
                if (that.list) {
                    angular.forEach(that.list, function (val) {
                        if (val.isChecked) {
                            if (that.tempProduct.length > 0) {
                                _.pull(that.tempProduct, val.mpId)
                            }
                            that.tempProduct.push(val.mpId)
                        } else if ($.inArray(val.mpId, that.tempProduct) >= 0) {
                            _.pull(that.tempProduct, val.mpId)
                        }
                    })
                }
            },
           

            getProduct: function () {
                var that = this,
                    url = '/search/rest/searchList.do';
                that.putTempProduct();
                $.extend($scope.searchObj, {
                    pageNo: $scope.pageNo,
                    pageSize: $scope.pageSize,
                    sortType:12, //最新发布排序
                    areaCode:$scope.areasCodeOneCode, //区域code
                    isSubProduct:1,//查询子品
                    v:2//接口版本 v=2 不返回价格、库存、促销
                });
                $rootScope.ajax.get(url, $scope.searchObj).then(function (res) {
                    that.list = [];
                    that.mpIds = [];
                    if (res.code == 0) {
                        if (res.data.productList != null && res.data.productList.length > 0) {
                            that.list = res.data.productList;
                            $scope.totalCount = res.data.totalCount;
                            $scope.totalPage = $scope.totalCount % $scope.searchObj.pageSize == 0 ? (($scope.totalCount / $scope.searchObj.pageSize) || 1) : parseInt($scope.totalCount / $scope.searchObj.pageSize) + 1;
                            angular.forEach(that.list, function (val) {
                                that.mpIds.push(val.mpId)
                                val.isChecked = false;
                                if (that.tempProduct.length > 0) {
                                    angular.forEach(that.tempProduct, function (val2) {
                                        if (val2 == val.mpId) {
                                            val.isChecked = true;
                                        }
                                    })
                                }
                            })
                            that.getPriceStockList();
                            that.isShowPage = true;
                            $scope.checkAll = false;

                        } else {
                            that.isShowPage = false;
                        }
                    }
                })
            },

            searchProduct: function () {
                var that = this;
                $scope.searchObj.keyword = '*****';
                $scope.searchObj.navCategoryIds = [];
                if (that.productName != null && that.productName != '') {
                    $scope.searchObj.keyword = that.productName;
                }
                if ($scope.searchObj.code != null && $scope.searchObj.code != '') {
                    $scope.searchObj.keyword = $scope.searchObj.keyword + ' ' + $scope.searchObj.code;
                }
                //类目
                var categoryIds = [];
                var zCategoryTree = $.fn.zTree.getZTreeObj("categoryTree");
                if (!isEmpty(zCategoryTree)) {
                    var categoryNodes = zCategoryTree.getCheckedNodes(true);

                    if (!isEmpty(categoryNodes)) {
                        angular.forEach(categoryNodes, function (data) {
                            //只添加叶子节点
                            if (!data.isParent) {
                                categoryIds.push(data.categoryTreeNodeId);
                            }
                        });
                    }
                }
                if (categoryIds.length > 0) {
                    $scope.searchObj.navCategoryIds = categoryIds;
                }

                $scope.channelMember.getProduct();
            },


            //重置
            resetSearch: function () {
                $('#categorySel').val('');
                var zCategoryTree = $.fn.zTree.getZTreeObj("categoryTree");
                if (zCategoryTree != null) {
                    zCategoryTree.checkAllNodes();
                }
                var that = this;
                that.productName = '';
                $scope.searchObj.code = '';
            },


            //初始化操作, 这个方法在页面的ng-init里调用
            init: function (orderStatus) {
                "use strict";
                var that = this;
                $scope.isOrders = true;
                that.isShowPage = false;
                that.isShowIcon = false;
                $scope.orderStatus = orderStatus;
                //初始化翻页
                $scope.initPagination();//初始化翻页
                //如果是个人中心页,需要调用个人信息相关的接口
                that.getProduct();//获取所商品
            },
            //获取实时价格库存
            getPriceStockList: function () {
                var that = this,
                    mpIds = that.mpIds.join(',');
                var url = $rootScope.host + '/realTime/getPriceStockList',
                    params = {
                        mpIds:mpIds,
                        areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode: $rootScope.defaultAreasCode
                    };
                $rootScope.ajax.get(url,params).then(function (res) {
                    var plistMap = {};
                    angular.forEach(res.data.plist, function (pl) {
                        plistMap[pl.mpId] = pl;
                    })
                    angular.forEach(that.list, function (pl) {
                        if (plistMap[pl.mpId]) {
                            $.extend(pl, plistMap[pl.mpId])
                        }
                    })
                })
            }
        };

        //全选/全部选

        $scope.checkAll = false;
        $scope.checkAllBtn = function () {
            if ($scope.checkAll) {
                angular.forEach($scope.channelMember.list, function (val) {
                    val.isChecked = true;
                })
            } else {
                angular.forEach($scope.channelMember.list, function (val) {
                    val.isChecked = false;
                })
            }
        };
        $scope.checkAllBtn2 = function () {
            var temp = [];
            angular.forEach($scope.channelMember.list, function (val) {
                if (val.isChecked) {
                    temp.push(val.isChecked);
                }
            })
            if (temp.length == $scope.channelMember.list.length) {
                $scope.checkAll = true;
            }
            else {
                $scope.checkAll = false;
            }
        };


        //立即购买
        $scope.oneBuy = function (mpId) {

            var params = {
                platformId: $rootScope.platformId,
                skus: JSON.stringify([{'mpId': mpId, 'num': 1}]),
                businessType: 7,
                areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
            }
            if ($rootScope.util.getUserToken() == undefined || $rootScope.util.getUserToken() == null) {
                $rootScope.showLoginBox = true;
                return;
            } else if (mpId == null || mpId == undefined) {
                return;
            } else {
                $rootScope.ajax.post($rootScope.host + '/checkout/initOrder', params).then(function (res) {
                    if (res.code == 0) {
                        localStorage.setItem('quickBuy', JSON.stringify(params));
                        location.href = 'settlement.html?q=1';
                    } else {
                        $rootScope.error.checkCode(res.data.error.type, res.data.error.message);
                    }
                },function (error) {
                $rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('一键购买异常') + '！');
                })
            }
        };

        //批量加入购物车
        $scope.batchToCart = function () {
            var skus = [];
            if ($scope.channelMember.tempProduct.length > 0) {
                angular.forEach($scope.channelMember.tempProduct, function (mpId) {
                    var pro = {};
                    pro.mpId = mpId;
                    pro.num = 1;
                    skus.push(pro);
                })
            }
            var config = {
                method: "POST",
                url: $rootScope.host + "/cart/addItem",
                data: {
                    skus:JSON.stringify(skus),
                    areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
                }
            };
            $rootScope.ajax.postFrom($rootScope.host + "/cart/addItem",{
                skus:JSON.stringify(skus),
                areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode:$rootScope.defaultAreasCode
            }).then(function (res) {
                if (res.code == 0) {
                    $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('加入') + $scope.i18n($rootScope.switchConfig.common.allCartBtnName) + $scope.i18n('成功'), {
                        type: 'confirm',
                        ok: function () {
                            location.href = '/cart.html';
                        },
                        btnOKText: $scope.i18n('去结算')
                    });
                    $rootScope.$emit('updateMiniCartToParent');
                } else {
                    $rootScope.error.checkCode(res.code, res.message);
                }
            }, function (res) {
                $rootScope.error.checkCode(res.code, res.message);
            });
        }

        $scope.$watch('areasCode', function (val) {
            if(!$.isEmptyObject(val)||val){
                $scope.areasCodeOneCode = val.oneCode||val;
                $scope.channelMember.init();
            }else {
                $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n('请选择区域'));
            }
        });

    }]);
