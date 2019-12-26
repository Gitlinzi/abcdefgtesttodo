angular.module('services').service('categoryService', ['$rootScope','$sce','$compile', function($rootScope,$sce,$compile) {
    "use strict";
    var vm = $rootScope;
    var crumbURL = vm.host + "/category/crumbList.do";
    var shopCrumbURL = vm.host + "/shop/shopCrumbList.do";
    $rootScope.searchCategoryParams = {};
    $rootScope.integralFlag = false;
    $rootScope.util.isPointPage(function () {
        $rootScope.integralFlag = true;
    })
    $rootScope.promotionId = false;
    $rootScope.searchObj={
        pageNo:1,
        pageSize:40,
        totalCount:0,
        checkAll:false
    };
    $rootScope.navCategory = {};
    angular.extend(vm, {
        categorylist: [],
        categorylistnextlevel: [],
        categoryIDlist: [],
        categoryindex: 0,
        getCrumbList: getCrumbList,
        //getShopCrumbList: getShopCrumbList,
        _getCategoryList: _getCategoryList,
        _getHTML: _getHTML,
        _getCategorynextlevel: _getCategorynextlevel,

        showOrHide:{},
        showLevel2Box:{},
        hideOrShowMoreCate:_hideOrShowMoreCate,
        toggleShowMoreLevel2:_toggleShowMoreLevel2
    })
    /**
     * http://www.stbvip.cn/api/category/crumbList.do?categoryTreeNodeId=2457097600000007&companyId=259  暂没用到，暂且注释
     * @param pid
     * @private
     */
    //获取面包屑，succCallback是成功的回调函数，errorCallback是异常的回调函数
    function getCrumbList(categoryTreeNodeId, succCallback, errorCallback) {
        // $rootScope.ajax.getFrom(crumbURL, {
        //     categoryTreeNodeId: categoryTreeNodeId,
        //     companyId: vm.companyId
        // }).then(function (result) {
        //     succCallback(result);
        // }, function (result) {
        //     errorCallback(result);
        // });
    };
    //获取店铺类目面包屑，succCallback是成功的回调函数，errorCallback是异常的回调函数
    // function getShopCrumbList(shopCategoryTreeNodeId, succCallback, errorCallback) {
    //     $rootScope.ajax.getFrom(shopCrumbURL, {
    //         categoryTreeNodeId: shopCategoryTreeNodeId,
    //         companyId: vm.companyId
    //     }).then(function (result) {
    //         succCallback(result);
    //     }, function (result) {
    //         errorCallback(result);
    //     });
    // };

    //类目导航
    function _getCategoryList(pid) {
        //var url = vm.host + '/category/list?parentId=0&level=1&companyId=' + vm.companyId;
        // var url = '/back-product-web2/extra/category/listChildrenCategoryWithNologin.do';
        let url = '/back-product-web2/extraLogin/category2/listCategoryByMerchant.do'
        if (vm.templateJson && vm.templateJson.categoryId){
            var param = {parentId: vm.templateJson.categoryId, treeHigh: 1};
            //TODO 积分商城需要区分不同的categoryId
            $rootScope.util.isPointPage(function () {
                //url += '&pageType=5';
                param.pageType = 5;
            })
            if ($rootScope.searchCategoryParams.categoryCode) {
                //url += '&categoryCode=' + $rootScope.searchCategoryParams.categoryCode;
                param.categoryCode = $rootScope.searchCategoryParams.categoryCode;
            }
            //console.log(url);
            $rootScope.ajax.postJson(url, param).then(function (response) {
                if (typeof response.data !== 'undefined') {
                    $rootScope.navCategory = response.data;
                    getProduct();
                    // $rootScope.navCategoryLength = response.data.length;
                    // angular.forEach(response.data, function (category, i) {
                    //     //
                    //     if (i <$rootScope.navCategoryLength) vm.categorylist[i] = category;
                    //     vm.categoryIDlist[category.id] = false;
                    // });
                    // console.log('categoryNav', $rootScope.categorylist)
                }
            });
           
        }
    };
    function getProduct(flag,flag2) {
        let that = this;
        $rootScope.noResultFlag=false;
        var url = '/search/rest/searchList.do';
        $rootScope.searchObj.timer=new Date().getTime();
        $rootScope.searchObj.platformId = $rootScope.platformId;
        $rootScope.searchObj.ut = $rootScope.util.getUserToken() || false;
        $rootScope.searchObj.companyId=$rootScope.companyId;
        $rootScope.searchObj.attrValueIds = ''
        $rootScope.searchObj.sortType = 10;
        $rootScope.searchObj.v =2;//接口版本 v=2 不返回价格、库存、促销
        let guid = localStorage.getItem("heimdall_GU")
        guid = guid.replace(/\^/g,'')
        guid = guid.replace(/\`/g,'')
        $rootScope.searchObj.guid = guid;
        if (!flag) {
            var areaCode = $rootScope.localProvince.province.provinceCode;
            if (areaCode) {
                $rootScope.searchObj.areaCode = flag2?areaCode:'';
            }
        }
        if($rootScope.navCategory && $rootScope.navCategory.length > 0) {
            $rootScope.searchObj.navCategoryIds = $rootScope.navCategory;
        }
        var itemIds = [];
        $rootScope.ajax.get(url, $rootScope.searchObj).then(function (res) {
            if(res.code==0) {
                $rootScope.searchObj.totalCount = res.data.totalCount;

                $rootScope.navCategoryLength = res.data.navCategoryTreeResult[0].children.length;
                angular.forEach(res.data.navCategoryTreeResult[0].children, function (category, i) {
                    if (i <$rootScope.navCategoryLength) vm.categorylist[i] = category;
                    vm.categoryIDlist[category.id] = false;
                })

            }else{
                $rootScope.error.checkCode(res.code,res.message);
            }
        }, function () {
            $rootScope.error.checkCode($rootScope.i18n('异常'),$rootScope.i18n('系统异常'));
        })
    };

    function _getHTML(cate_arry, cateid) {
        if (cate_arry != null && cate_arry.length > 0) {
            var categoryHtml = "";
            var chidlren_arry = angular.copy(cate_arry);
            var parant_arr = []
            for (var i = 0; i < cate_arry.length; i++) {
                if (cate_arry[i].level == 3) {
                    parant_arr.push(cate_arry[i]);
                }
            }
            var half = parant_arr.length % 2 == 0 ? parant_arr.length / 2 : (parant_arr.length + 1) / 2;
            var searchPath = vm.home + '/search.html';

            $rootScope.util.isPointPage(function () {
                searchPath = '/integralSearch.html';
                $rootScope.integralFlag = true;
            })
            for (var i = 0; i < parant_arr.length; i++) {
                if (i == 0) {
                    categoryHtml = '<div class="nav-left">';
                }
                if (i == half) {
                    categoryHtml += '</div><div class="nav-right">';
                }
                categoryHtml += `<div ng-if="showLevel2Box[${parant_arr[i].parentId}][${i}]" class="nav-type"><h5><a href="${searchPath}?navCategoryIds=${parant_arr[i].id}&categoryTreeNodeId=${parant_arr[i].id}`
                if (i===0) {
                    vm.showLevel2Box[parant_arr[i].parentId] = []
                }
                vm.showLevel2Box[parant_arr[i].parentId][i] = i < 10;
                if ($rootScope.searchCategoryParams.categoryCode && $rootScope.searchCategoryParams.types) {
                    categoryHtml += '&types=6&categoryCode=' + $rootScope.searchCategoryParams.categoryCode;
                }
                categoryHtml += '&pageSize=40&pageNo=1"' + '>' + parant_arr[i].name + '</a></h5>';
                categoryHtml = categoryHtml + '<ul>';
                var limit = 0;
                for (var j = 0; j < chidlren_arry.length; j++) {
                    if (chidlren_arry[j].parentId == parant_arr[i].id) {
                        if(limit < 7 || (parant_arr[i].thirdCode && parant_arr[i].thirdCode.includes('showMore')) ){
                            var  href = ''
                            href = searchPath + '?navCategoryIds=' + chidlren_arry[j].id + '&categoryTreeNodeId=' + chidlren_arry[j].id
                            categoryHtml += '<li ng-if="true"><a href="' + href;
                        }else {
                            categoryHtml += '<li ng-show="showOrHide['+chidlren_arry[j].parentId+']"><a href="' + searchPath + '?navCategoryIds=' + chidlren_arry[j].id + '&categoryTreeNodeId=' + chidlren_arry[j].id;
                            vm.showOrHide[chidlren_arry[j].parentId] = false;
                        }
                        if ($rootScope.searchCategoryParams.categoryCode && $rootScope.searchCategoryParams.types) {
                            categoryHtml += '&types=6&categoryCode=' + $rootScope.searchCategoryParams.categoryCode;
                        }
                        categoryHtml += '&pageSize=40&pageNo=1"';
                        if (chidlren_arry[j].isHighlight) {
                            categoryHtml += ' class="highlight"';
                        }
                        categoryHtml += '>' + chidlren_arry[j].name + '</a></li>';
                        limit++;
                    }
                }
                categoryHtml = categoryHtml + '</ul>';
                if(limit > 7 && !(parant_arr[i].thirdCode && parant_arr[i].thirdCode.includes('showMore'))){
                    categoryHtml += `<span class="showmore-btn">
                                        <a style="color: #999" href="#" ng-click="hideOrShowMoreCate(${parant_arr[i].id},$event)">
                                            {{showOrHide[${parant_arr[i].id}]?"收起":"更多"}}
                                       </a>
                                     </span>`;
                }
                categoryHtml = categoryHtml + '</div>';
                if (i == parant_arr.length - 1 && parant_arr.length>10) {
                    categoryHtml += `<span class="showMoreLevel2" ng-click="toggleShowMoreLevel2(${parant_arr[i].parentId},$event)"></span></div>`;
                } else {
                    categoryHtml += `</div>`
                }
            }
            //console.log('html',categoryHtml);
            var cid = "#c" + cateid;
            $rootScope.categorylist.forEach(function(item){
                if(item.id==cateid){
                    item.tosafeHtml = $sce.trustAsHtml(categoryHtml);
                }
            });

            $(cid).append(categoryHtml);
            $(cid).removeClass("hide");
            $(cid).addClass("show");
        }
    }
    function _getCategorynextlevel(pid, index) {
        if (!vm.categoryIDlist[pid]) {
            // var url = vm.host + '/category/list?parentId=' + pid + '&level=3&companyId=' + vm.companyId;
            var url = '/back-product-web2/extra/category/listChildrenCategoryWithNologin.do';
            var param = {parentId: pid, treeHigh: 2};
            if ($rootScope.searchCategoryParams.categoryCode) {
                // url += '&categoryCode=' + $rootScope.searchCategoryParams.categoryCode;
                param.categoryCode = $rootScope.searchCategoryParams.categoryCode;
            }
            var _levelchildelist = [];
            $rootScope.ajax.postJson(url,param).then(function (res) {
                if (typeof res.data !== 'undefined') {
                    //console.log('nav', res.data.categorys)
                    _levelchildelist = res.data;
                    vm._getHTML(_levelchildelist, pid);
                    //如果index参数非空，则视为页面触发，前后三个类目将同时请求
                    if (angular.isDefined(index)) {
                        for (var start = index - 3; start <= index + 3; start++) {
                            if (start >= 0 && start < vm.categorylist.length && start != index) {
                                vm._getCategorynextlevel(vm.categorylist[start].id);
                            }
                        }
                    }
                }
            });
            vm.categoryIDlist[pid] = true;
            //如果鼠标放在已经请求过的类目上，则去检查该类目前后三个有没有未请求过的
        } else {
            if (angular.isDefined(index)) {
                for (var start = index - 3; start <= index + 3; start++) {
                    if (start >= 0 && start < vm.categorylist.length) {
                        vm._getCategorynextlevel(vm.categorylist[start].id);
                    }
                }
            }
        }

    };
    function _hideOrShowMoreCate(cid,e) {
        $(e.currentTarget).parents('.showmore-btn').siblings('ul').toggleClass('show-more-cate')
        vm.showOrHide[cid] = !vm.showOrHide[cid];
    }
    function _toggleShowMoreLevel2(pid,e) {
        $(e.currentTarget).toggleClass('rotation');
        vm.showLevel2Box[pid].forEach((v,i)=>{
            if (i>9) {
                vm.showLevel2Box[pid][i] = !vm.showLevel2Box[pid][i]
            }
        })
    }
    // function goSearch(categoryId,categoryTreeNodeId) {
    //     if($rootScope.util.isPointPage()){
    //         location.href = '/integralSearch.html?navCategoryIds='+ categoryId +'&categoryTreeNodeId=' + categoryTreeNodeId;
    //     } else{
    //         location.href = '/search.html?navCategoryIds='+ categoryId +'&categoryTreeNodeId=' + categoryTreeNodeId;
    //     }
    // }

    //导航效果
    ~function () {
        $rootScope.searchCategoryParams = $rootScope.util.paramsFormat(location.href);
        _getCategoryList(0);
        angular.element(document).on({
            mouseenter: function () {
                $(this).addClass('active');
                $(this).find('.nav-items').show();
            },
            mouseleave: function () {
                $(this).removeClass('active');
                $(this).find('.nav-items').hide();
            }
        }, '.side-ul>li');
    }();

    //导航结束

}]);
