/**
 * Created by Roy on 15/10/23.
 * Edit by Sindy 15/11/7
 */
appControllers.controller("storeCtrl",['$log','$rootScope','$scope','commonService','categoryService','$window', function($log,$rootScope, $scope, commonService,categoryService,$window){
	"use strict";
	if ($rootScope.switchConfig.common.showAllGlobalNav) {
	    $rootScope.execute();
	}
    //国际化
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
	//变量定义
	$scope.storelogo = [];
	$scope.storeslide = [];
	$scope.storesnav = [];
	$scope.storecategory = [];
	$scope.storehotprod = [];
	$scope.storeleftinfo = [];
	$scope.shopId="";
	$scope.merchantId="";
	$scope.merchantmerchantmerchantCategoryIds="";
	$scope.merchantCateTreeId = "25";
	$scope.shopFlag = true;

	//默认省份与小能
	$rootScope.execute(true);
	$scope._getParams=function(){
		var search=location.search;
		if(search.length>0) {
			var urlParams = $rootScope.util.paramsFormat(location.search);
			if (typeof urlParams.shopId !== 'undefined' && typeof urlParams.merchantId !== 'undefined') {
				$scope.shopId = urlParams.shopId;
				$scope.merchantId = urlParams.merchantId;
				$scope.searchObj = {
					shopId: urlParams.shopId,
					merchantId:urlParams.merchantId,
					categoryTreeNodeId:urlParams.categoryTreeNodeId,
					pageNo:parseInt(urlParams.pageNo || $rootScope.searchObj.pageNo),
					pageSize:parseInt(urlParams.pageSize || $rootScope.searchObj.pageSize),
					companyId:$scope.companyId
				}
				if(location.search.indexOf('keyword')>=0){
					$scope.isSearch=true;
					$scope.searchObj.keyword = decodeURIComponent(urlParams.keyword||$rootScope.searchObj.keyword);
				}else if(location.search.indexOf('merchantCategoryIds')>=0){
					$scope.isList=true;
					$scope.searchObj.merchantCategoryIds=urlParams.merchantCategoryIds||'';
				}
				return true;
			}
		}
		return false;
	};

	$scope.storeIndex={

		//店铺logo
		_getStoreLogo : function () {
			var url = $rootScope.host + '/shop/baseInfo',
				params = {
                    shopId: $scope.shopId,
                    merchantId:$scope.merchantId,
                    companyId:$scope.companyId
				}
			$rootScope.ajax.get(url,params).then(function (res) {
				if (res.code == 0) {
					if (res.data) {
						$scope.storelogo = res.data;
						//$log.debug("店铺logo", $scope.storelogo)
					}
				// } else {
				// 	$rootScope.error.checkCode(res.code, res.message, {
				// 		type: 'info'

				// 	})
				}
			}, function () {
				$rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('店铺') + 'logo' + $scope.i18n('没有设置哦'), {
					type: 'info'
				})

			})
		},
		//店铺轮播(首页)
		_getStoreSlide : function () {
		var url = $rootScope.host + '/shop/lunbo',
			params = {
                shopId:$scope.shopId,
                merchantId:$scope.merchantId,
                companyId:$scope.companyId
			};
		$rootScope.ajax.get(url,params).then(function (res) {
			if(res.code == 0){
				if(res.data) {
					$scope.storeslide = res.data;
					//$log.debug("店铺轮播",$scope.storeslide)
				}
			}else {
				$rootScope.error.checkCode(res.code, res.message, {
					type: 'info'

				})
			};
		}, function () {
			$rootScope.error.checkCode($scope.i18n('系统异常'),$scope.i18n('店铺轮播没有设置哦'), {
				type: 'info'
			})

		})
	},
		//轮播效果初始化(首页)
		carouselInit : function () {
		var jqinner = angular.element('.carousel-inner'),
			jqbtn = angular.element('.carousel-btn'),
			inter;

		function aniRunning() {
			return angular.element('.carousel-inner a').filter(':animated').length;
		}

		function switchPic(curr, next) {
			if (aniRunning() === 0) {
				angular.element('.carousel-inner a').eq(next).fadeIn(500, function() {
					angular.element(this).addClass('active');
					angular.element('.carousel-paging li').eq(next).addClass('active');
				});
				angular.element('.carousel-inner a').eq(curr).fadeOut(500, function() {
					angular.element(this).removeClass('active');
					angular.element('.carousel-paging li').eq(curr).removeClass('active');
				});
			}
		}

		function autoPlay() {
			var liIndex = angular.element('.carousel-paging li').filter('.active').index();
			liIndex++;
			if (liIndex === angular.element('.carousel-paging li').length) {
				liIndex = 0;
			}
			angular.element('.carousel-paging li').eq(liIndex).click();
		}

		jqinner.mouseover(function() {
			jqbtn.show();
		}).mouseout(function() {
			jqbtn.hide();
		});
		jqbtn.mouseover(function() {
			jqbtn.show();
		}).mouseout(function() {
			jqbtn.hide();
		}).click(function() {
			var curr = angular.element('.carousel-inner a').filter('.active').index();
			var next = 0;
			if (angular.element(this).hasClass('prev')) {
				if (curr === 0) {
					next = angular.element('.carousel-inner a').length - 1;
				} else {
					next = curr - 1;
				}
			} else if (angular.element(this).hasClass('next')) {
				if (curr === (angular.element('.carousel-inner a').length - 1)) {
					next = 0;
				} else {
					next = curr + 1;
				}
			}
			switchPic(curr, next);
			clearInterval(inter);
			inter = setInterval(autoPlay, 5000);
		});
		angular.element(document).on('click', '.carousel-paging li', function (e) {
			var event = e || window.event;
			var acLi = angular.element('.carousel-paging li').filter('.active');
			if (event.originalEvent) {
				clearInterval(inter);
				inter = setInterval(autoPlay, 5000);
			}
			if (acLi[0] === this) {
				return false;
			}
			var activeIndex = acLi.index();
			var currIndex = angular.element(this).index();
			switchPic(activeIndex, currIndex);
		});
		inter = setInterval(autoPlay, 5000);
	},
		//店铺导航
		_getStoreNav : function () {
		var url = $rootScope.host +'/shop/navigaList',
			params = {
                shopId:$scope.shopId,
                merchantId:$scope.merchantId,
                companyId:$scope.companyId
			};
		$rootScope.ajax.get(url,params).then(function (res) {
			if(res.code == 0){
				if(res.data) {
					$scope.storesnav = res.data;
					//$log.debug("店铺导航",$scope.storesnav)
				}
			}else {
				$rootScope.error.checkCode(res.code, res.message, {
					type: 'info'

				})
			};
		}, function () {
			$rootScope.error.checkCode($scope.i18n('系统异常'),$scope.i18n('店铺导航没有设置哦'), {
				type: 'info'
			})

		})
	},
		//店铺类目树
		_getStoreCategory : function () {
			var url = $rootScope.host + '/shop/categoryTree',
				params = {
                    shopId: $scope.shopId,
                    merchantId:$scope.merchantId,
                    companyId:$scope.companyId,
                    merchantCateTreeId:$scope.merchantCateTreeId,
                    timer:new Date().getTime()
				};
			$rootScope.ajax.get(url,params).then(function (res) {
				if (res.code == 0) {
					if (res.data) {
						$scope.storecategory = res.data;
						//$log.debug("店铺类目树", $scope.storecategory)

					}
				} else {
					$rootScope.error.checkCode(res.code, res.message, {
						type: 'info'

					})
				}
			}, function () {
				$rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('店铺类目树没有设置哦'), {
					type: 'info'
				})

			})
		},
		//店铺热门商品(首页)
		_getStoreHot : function () {
			var url = $rootScope.host + '/shop/search',
//				'&filterType=IS_NEW';
				params = {
                    shopId:$scope.shopId,
                    merchantId:$scope.merchantId,
                    companyId:$scope.companyId,
                    merchantCateTreeId:$scope.merchantCateTreeId,
                    sortType:'volume4sale_desc,create_time_desc',
					pageNo:1,
					pageSize:2000
				};
			$rootScope.ajax.get(url,params).then(function (res) {
				if (res.code == 0) {
					if (res.data && res.data.productList) {
						$scope.storehotprod = res.data.productList;
						//$log.debug("热门商品", $scope.storehotprod)
					}
				} else {
					$rootScope.error.checkCode(res.code, res.message, {
						type: 'info'

					})
				}
				;
			}, function () {
				$rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('店铺热门商品没有设置哦'), {
					type: 'info'
				})

			})
		},
		//店铺左侧信息
		_getShopInfo : function () {
			var url = $rootScope.host + '/shop/getShopLeftInfo',
				params = {
                    companyId:$scope.companyId,
                    shopId:$scope.shopId,
                    merchantId:$scope.merchantId
				};
			$rootScope.ajax.get(url,params).then(function (res) {
				if (res.code == 0) {
					if (res.data) {
						$scope.storeleftinfo = res.data;
						//$log.debug("店铺左侧信息", $scope.storeleftinfo)
					}
				} else {
					$rootScope.error.checkCode(res.code, res.message, {
						type: 'info'

					})
				}
				;
			}, function () {
				$rootScope.error.checkCode($scope.i18n('系统异常'), $scope.i18n('店铺左侧信息没有设置哦'), {
					type: 'info'
				})
			})
		},
		//初始化
		_initCommon:function(){
			this._getStoreLogo();
			this._getStoreNav();
			this._getStoreCategory();
			this._getShopInfo();
		},
		_initIndex:function(){
			//轮播功能
			this._getStoreSlide();
			this.carouselInit();
			this._getStoreHot();

		}
	};

	$scope.store = {
		//获取类目面包屑
		_getCrumbList:function(){
			$rootScope.getShopCrumbList($scope.searchObj.categoryTreeNodeId, function (result) {
				//$log.debug('shopCrumbList', result);
				if (result && result != null && typeof result.data !== 'undefined' && result.data != null) {
					$scope.crumbList = result.data;
				}
			});
		},
		_initSearchList: function () {
			this.searchResult={};
			if($scope.isList)
				//this._getCrumbList();
			$scope.getProduct();
		}
	};
	/**
	 * 验证(如果商品价格为null，则不显示)
	 * @param productList
	 */
	$scope.prodValidate=function(productList){
		var validatedList=[];
		if(typeof productList!=='undefined' && angular.isArray(productList)) {
			angular.forEach(productList, function (product) {
				if (typeof product.price !== 'undefined' && product.price !== null)
					validatedList.push(product);
			});
		}
		$scope.searchedObj.productList=validatedList;
	}
	//搜索商品
	$scope.getProduct=function(options) {
		$scope.noResultFlag=false;
		if(options){
			$scope.searchObj.sortType=options.sortType||'';
			$scope.searchObj.filterType=options.filterType||'';
		}
		var url = $rootScope.host + '/shop/search';
		$scope.searchObj.timer=new Date().getTime();
		$rootScope.ajax.get(url, $scope.searchObj).then(function (res) {
			//$log.debug('searchedResult',res);
			if(res.code==0) {
				//The message displaying no-result section.
				$scope.noResultKeyword = $scope.searchObj.keyword;
				if (typeof res.data !== 'undefined'){
					$scope.searchedObj = angular.copy(res.data);
					//数据筛选
					$scope.prodValidate($scope.searchedObj.productList);

					if($scope.searchedObj.totalCount===0) {
						$scope.noResultFlag = true;
						$scope.noResultKeyword = $scope.searchObj.keyword;
					}
					if(typeof res.data.productList !== 'undefined')
						$scope.pageTotal = Math.ceil($scope.searchedObj.totalCount / $scope.searchObj.pageSize);
				} else {
					$scope.searchedObj = {};
					$scope.noResultFlag = true;
				}
				$scope.pageList=$scope._pagination($scope.pageTotal,$scope.searchObj.pageNo);
			}else{
				$rootScope.error.checkCode(res.code,res.message);
			}
		}, function () {
			$rootScope.error.checkCode($scope.i18n('异常'),$scope.i18n('搜索系统异常'));
		})
	};
	//排列与过滤相关
	$scope.selectOptions= {
		//排列选项
		sortOptions:{},
		//过滤选项
		filterOptions:{},

		/**
		 * 准备排序与过滤:如果index=0,sort默认为综合排序，filter默认为不过滤
		 * @param index
		 * @param type
		 * @param isSort
		 */
		toSortAndFilter:function(index,type,isSort){
			if(arguments.length==0){
				this.initSortProduct();
			}else {
				//点击排序
				if (isSort) {
					this.sortOptions.sortActive=[];
					this.sortOptions.sortActive[index]=true;
					//非第一次排序
					if(this.sortOptions.sort&&this.sortOptions.sort[index]&&type=='price') {
						var sort=this.sortOptions.sort[index];
						this.sortOptions.sort=[];
						this.sortOptions.sort[index]=!sort;
						//第一次排序
					}else {
						this.sortOptions.sort=[];
						this.sortOptions.sort[index] = true;
					}
					this.sortOptions.sortType=this.sortOptions.sortType||'';
					this.sortOptions.sortType = type + '_' + (this.sortOptions.sort[index] ? 'asc' : 'desc');
					//点击过滤
				} else {
					this.filterOptions.filterActive=this.filterOptions.filterActive||[];
					this.filterOptions.filterActive[index]=true;
					//非第一次过滤
					if(this.filterOptions.filter&&this.filterOptions.filter[index]){
						this.filterOptions.filter[index]=!this.filterOptions.filter[index];
						//第一次过滤
					}else{
						this.filterOptions.filter=this.filterOptions.filter||[];
						this.filterOptions.filter[index]=true;
					}
					this.filterOptions.filterType=this.filterOptions.filterType||[];
					this.filterOptions.filterType[index]=this.filterOptions.filter[index]?type:null;
				}
			}
			//整理出有效的过滤条件
			var filterType=[];
			if(angular.isArray(this.filterOptions.filterType)){
				angular.forEach(this.filterOptions.filterType,function(t){
					if(t) filterType.push(t);
				});
			}

			//带着排序和过滤条件查询
			$scope.getProduct({
				'sortType': this.sortOptions.sortType || '',
				'filterType': filterType.join(',')
			})
		},

		initSortProduct : function () {
			this.sortOptions={
				//排序项的索引
				sortIndex:0,
				//排序项的选中
				sortActive:[],
				//排序条件
				sortType:''
			};
			//默认综合
			this.sortOptions.sortActive[0]=true;
		},
		initFilterProduct:function(){
			this.filterOptions={
				//过滤项的索引
				filterIndex:0,
				//过滤项的选中
				filterActive:[],
				//过滤条件
				filterType:[]
			}
		},
		_init:function(){
			this.initFilterProduct();
			this.initSortProduct();
		}
	};
	$scope.selectOptions._init();
	//翻页功能区＝＝＝start====
	//Previous page
	$scope.prev = function () {
		if ($scope.searchObj.pageNo > 1) {
			$scope.searchObj.pageNo--;
			$scope._pagination($scope.pageTotal, $scope.searchObj.pageNo);
			$scope.getProduct();
		}
	}
	//Next page
	$scope.next = function () {
		if ($scope.searchObj.pageNo < $scope.pageTotal) {
			$scope.searchObj.pageNo++;
			$scope._pagination($scope.pageTotal, $scope.searchObj.pageNo);
			$scope.getProduct();
		}
	}
	//Locating page
	$scope.locate = function ($event, num) {
		$scope.searchObj.pageNo = num;
		$scope._pagination($scope.pageTotal, num);
		$scope.getProduct();
	}
	//pagination logic
	$scope.isShow = [];
	$scope._pagination = function (totalPage, currentPage) {
		var pageList = [];
		currentPage = currentPage || 1;
		for (var i = 2; i < totalPage; i++) {
			pageList.push(i);
			if (i > currentPage && i - currentPage < 4 || i < currentPage && currentPage - i < 4 || i == currentPage)
				$scope.isShow[i - 2] = true;
			else
				$scope.isShow[i - 2] = false;
		}
		return pageList;
	}
	//翻页功能区＝＝＝end====


	//execute
	if($scope._getParams()){
		$scope.storeIndex._initCommon();
		if($scope.isSearch || $scope.isList) {
			//初始化搜索列表页
			$scope.store._initSearchList();
		}else {
			//初始化店铺首页
			$scope.storeIndex._initIndex();
		}
	}
}])
