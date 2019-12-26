/**
 * Created by Roy on 16/12/7.
 */
angular.module('appControllers').controller('afterSaleCtrl', ["$scope", "$rootScope", "$cookieStore", "commonService", 'categoryService', "validateService", "Upload", "$stateParams","$window",
    function ($scope, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload, $stateParams,$window) {
        //国际化
        $scope.i18n = function (key) {
            return $window.i18n ? $window.i18n(key) : key;
        };
        $scope.baseConfig = {
            returnStatus: $rootScope.switchConfig.returnStatus,
        }
        var urlParams = $stateParams,
            _ut = $rootScope.util.getUserToken(),
            _host = $rootScope.host,
            _fnE = $rootScope.error.checkCode;
        if (!_ut) {
            $rootScope.showLoginBox = true;
            return;
        }
        //初始化翻页
        $scope.initPagination = function () {
            $scope.pageNo = 1;
            $scope.pageSize = 10;
            $scope.totalCount = 0;
        };
        //售后列表,用于展示进度
        $scope.aftersaleList = {
            //pageNo:1,
            //pageSize:10,
            isShowIcon:false,
            isShowPage:false,
            list: [],
            getAfterSaleList: function () {
                var url = "/oms-api/order/soReturn/list";
                var params = {
                    page: $scope.pageNo,
                    limit: 10
                };
                var that = this;
                $rootScope.ajax.postJson(url, params).then(function (result) {
                    if (result.data) {
                        that.list = result.data;
                        $scope.totalCount = result.total;
                        $scope.totalPage = result.totalPages;
                        that.isShowPage = true;
                        that.isShowIcon = false;
                    } else {
                        that.isShowIcon = true
                        that.isShowPage = false;
                    }
                },function (res) {
                    that.isShowIcon = true
                    that.isShowPage = false;
                    _fnE($scope.i18n('提示'),$scope.i18n('系统异常'));
                });
            },
            init: function () {
                $scope.initPagination();
                this.getAfterSaleList();
                this.isShowIcon = true;
                this.isShowPage = false;
                //翻页广播接收
                var that = this;
                $scope.$on('changePageNo', function (event, data) {
                    "use strict";
                    $scope.pageNo = data;
                    that.getAfterSaleList();
                })
            }
        }
        //申请售后
        $scope.applyAftersale = {
            type: urlParams.type || 0,//选中类型
            types: [], //所有退货类型
            orderCode: urlParams.code, //订单号
            returnCode: null,
            orderAfterSalesId: urlParams.orderAfterSalesId || null,//退货id
            products: [], //退货订单的所有商品列表
            causes: [], //退货原因列表
            selectedCauses: {},//选中的退货原因
            remark: '', //退货说明
            returnSoItemList: [],//要退换的商品
            changeProduct: [], //供换货的商品
            //修改订单
            isModify: (urlParams.orderAfterSalesId || '').length > 0, //订单详情
            //图片上传相关
            file: null, //选择文件
            picUrl: [], //上传文件返回的图片地址列表
            afterOrder: {},//申请售后的订单
            afterConfirm: {},
            sysSource : '',
            aftersaleTypeShow : false,
            //售后详情
            getAfterSaleDetails: function () {
                var url = "/oms-api/order/soReturn/detail";
                var params = {
                    id: this.orderAfterSalesId
                };
                var that = this;
                var arr = ['', '', $scope.i18n('退货'), '', $scope.i18n('换货'), $scope.i18n('仅退款')];
                $rootScope.ajax.postJson(url, params).then(function (result) {
                    if ( result.code == 0 && result.data) {
                        that.selectedGoods = result.data.returnProduct;
                        that.sysSource = result.data.sysSource
                        angular.forEach(that.selectedGoods,function (val) {
                            val.checked = true;
                            val.maxreturnProductItemNum = val.returnProductItemNum;
                        })
                        that.changeProduct = result.data.targetProductList;
                        that.afterOrder = {orderCode: that.orderCode};
                        that.type = result.data.type;
                        that.types.push( { name : result.data.typeStr , type : result.data.type } )
                        that.getcauses();
                        that.picUrl = result.data.picUrlList;
                        that.returnCode = result.data.returnCode;
                        that.remark = result.data.returnRemark;
                        that.selectedCauses = {
                            code: result.data.returnReasonId
                        }
                        if( result.data && result.data.type == 1 ) {
                            that.aftersaleTypeShow = true;
                        } else {
                            that.aftersaleTypeShow = false;
                        }
                    } else {
                        _fnE($scope.i18n('提示'),result.message);
                    }
                })
            },
            //售后类型
            getAfterSaleType: function () {
                var url = "/api/my/orderAfterSale/afterSaleType";
                var params = {
                    orderCode: this.orderCode,
                    companyId: $rootScope.companyId,
                }
                var that = this;
                $rootScope.ajax.post(url, params).then(function (result) {
                    if (result.data) {
                        that.types = result.data;
                        //过滤掉上门服务
                        angular.forEach(that.types,function (val,index) {
                           if(val.operateType == 11){
                               that.types.splice(index,1)
                           }
                        });
                        if (that.type == '' && that.types.length > 0) {
                            that.type = that.types[0].operateType;
                        }
                        if (that.type.toString().length > 0) {
                            that.returnSoItemList = [];
                            if (!that.isModify)
                                that.initReturnProduct();
                            // that.getcauses();
                        }
                    }
                });
            },
            //售后商品
            initReturnProduct: function () {
                var url = "/api/my/orderAfterSale/initReturnProduct";
                var params = {
                    orderCode: this.orderCode,
                    companyId: $rootScope.companyId,
                    type: this.type
                }
                var that = this;
                $rootScope.ajax.post(url, params).then(function (result) {
                    if (result.code == 0) {
                        if (result.data && result.data.afterSalesProductVOs) {
                            that.afterOrder = result.data;
                            that.getcauses();
                            that.products = result.data.afterSalesProductVOs;
                            angular.forEach(that.products,function (val) {
                                val.returnNum = val.mayReturnProductItemNum;
                            })
                        }
                        that.returnSoItemList= []
                    }
                });
            },
            //数目输入值格式判断
            checkNum: function (num, max) {
                if (num.match(/^[0-9]{1,3}$/)) {
                    if (parseInt(num) < 1)
                        return 1;
                    if (parseInt(num) > max)
                        return max;
                    return parseInt(num);
                } else {
                    return 1;
                }
            },
            //更新相应的换货商品数目
            updateChange: function (prod) {
                if (this.type == 4) {
                    angular.forEach(this.changeProduct, function (cp) {
                        if (cp.soItemId == prod.id) {
                            cp.num = prod.returnNum;
                        }
                    })
                } else
                    return;
            },
            //售后原因
            getcauses: function () {
                var that = this;
                $rootScope.getOrderDictionary('RETURN_REASON_' + this.type, function(data) {
                    if (data&&data.length) {
                        that.causes = data;
                        if (that.isModify) {
                            angular.forEach(that.causes, function (cause) {
                                if (that.selectedCauses.code == cause.code) {
                                    that.selectedCauses = cause;
                                }
                            })
                        } else {
                            that.selectedCauses = that.causes[0];
                        }
                    }
                });
            },
            //换购商品
            getAfterSaleProduct: function (checked, returnMpId, soItemId, index) {
                //选中的商品
                if (checked) {
                    this.returnSoItemList.push(this.products[index])
                } else {
                    this.returnSoItemList.splice(index, 1);
                }
                //如果不是换货, 不需要请求换货商品
                if (this.type == 1 || this.type == 2 || this.type == 5) return;
                if (!checked) {
                    var dropIndex = this.changeProduct.findIndex(function (e) {
                        return e.soItemId == soItemId
                    })
                    if (dropIndex >= 0) {
                        this.changeProduct.splice(dropIndex, 1);
                    }
                    return;
                }
                var url = "/api/my/orderAfterSale/afterSaleProduct";
                var params = {
                    orderCode: this.orderCode,
                    returnMpId: returnMpId,
                    soItemId: soItemId,
                    platformId: $rootScope.platformId,
                    companyId: $rootScope.companyId
                }
                var that = this;
                $rootScope.ajax.post(url, params).then(function (result) {
                    if (result.data) {
                        result.data.num = that.products[index].returnNum;
                        that.changeProduct.push(result.data);
                    }
                });
            },
            //获取默认属性
            getSelectedItemInfo: function (serialAttributes) {
                var arr = [];
                if (serialAttributes) {
                    serialAttributes.forEach(function (sa) {
                        if (sa.values) {
                            sa.values.forEach(function (v) {
                                if (v.checked) {
                                    arr.push(sa.name + "：" + v.value);
                                }
                            })
                        }
                    });
                }

                return arr;
            },
            //上传文件
            upload: function () {
                if (!this.file || this.picUrl.length >= 3) {
                    return;
                }
                var url = "/api/fileUpload/putObjectWithForm";  //params是model传的参数，图片上传接口的url
                var that = this;
                Upload.upload({
                    url: url,
                    data: {
                        file: this.file
                    }
                }).success(function (data) {
                    that.picUrl.push(data.data.filePath);
                }).error(function () {
                    //logger.log('error');
                });
            },
            //获取图片
            picUrlData:function(){
                var picList=[];
                this.picUrl.forEach(function(v,i){
                    picList.push({'url':v})
                })
                return JSON.stringify(picList)
            },
            //删除图片
            deletePicByIndex: function (ind) {
                this.picUrl.splice(ind, 1);
            },
            //获取退货的跟踪云数据
            getHeimdallParams: function(items) {
                let idArr = [];
                let numArr = [];
                let prod;

                for (let i = 0; i < items.length; i++) {
                    prod = items[i];
                    idArr.push(prod.mpId);
                    numArr.push(prod.returnNum);
                }
                var heimdallParam = {
                    ev: "9",
                    oid: this.orderCode,
                    pri: idArr.join(','),
                    prm: numArr.join(',')
                }

                return heimdallParam;
                // $('#heimdall_el').attr('heimdall_productid', idArr.join(','));
                // $('#heimdall_el').attr('heimdall_productnum', numArr.join(','));
                // $('#heimdall_el').click();
            },
            //提交申请退换货
            applyReturnProduct: function () {
                var that = this;
                var url = "/oms-api/order/soReturn/updateReturn";
                var params = {
                    goodsReturnType : 0,
                    id : that.orderAfterSalesId,
                    orderCode: this.orderCode,
                    returnReason : this.selectedCauses.code,
                    returnRemark: this.remark,
                    picList: this.picUrl,
                    sysSource : that.sysSource,
                    type: this.type,
                    itemList : []
                }
                for( let i = 0 ; i < that.selectedGoods.length ; i++ ) {
                    params.itemList.push(
                        {   applyReturnAmount : (that.selectedGoods[i].applyReturnAmount/that.selectedGoods[i].maxreturnProductItemNum * that.selectedGoods[i].returnProductItemNum).toFixed(2),
                            returnProductItemNum : that.selectedGoods[i].returnProductItemNum,
                            id : that.selectedGoods[i].id,
                            returnId : that.selectedGoods[i].returnId,
                            soItemId : that.selectedGoods[i].soItemId
                        }
                    )
                }
                //换货的时候才需要传换货商品相关信息
                if (this.type == 4)
                    params.swapProducts = swapProducts;
                $rootScope.ajax.postJson(url, params).then(function (result) {
                    //跟踪云埋点
                    var heimdallParam = that.getHeimdallParams(that.returnSoItemList);
                    try {
                        window.eventSupport.emit('heimdallTrack', heimdallParam);
                    } catch (err) {
                        //console.log(err);
                    }
                    if(result.code == 0){
                        location.href = "#/afterSaleStateList?afterSaleProgList=1"
                    } else {
                        _fnE($scope.i18n('提示'),result.message);
                    }
                },function(result){
                    _fnE($scope.i18n('提示'),result.message);
                })
            },
            //修改售后申请
            updateReturnProduct: function () {
                var that = this;
                var returnSoItemList = (function () {
                    var returnSoItem = [];
                    angular.forEach(that.products || [], function (prod) {
                        returnSoItem.push({soItemId:prod.soItemId,productNum:prod.returnProductItemNum})
                    })
                    return JSON.stringify(returnSoItem);
                })();
                var url = '/back-order-web/restful/afterSales/updateSoReturn.do';
                var params = {
                    companyId: $rootScope.companyId,
                    returnCode: this.returnCode,
                    returnReasonId: this.selectedCauses.code,
                    returnReason: this.selectedCauses.name,
                    returnProductListStr:returnSoItemList,
                    returnRemark: this.remark,
                    type : this.type,
                    picListStr: this.picUrlData()
                }
                var that = this;
                $rootScope.ajax.post(url, params).then(function (result) {
                    if( result.code == 0 ) {
                        location.href = '#/afterSaleDetail?afterSaleDetail=1&id=' + that.orderAfterSalesId;
                    } else {
                        _fnE($scope.i18n('提示'),result.message);
                        return;
                    }
                });
            },
            //系列属性相关
            sp: {
                attributes: [],  //系列属性
                serialProducts: [], //系列商品
                mpId_attrId: {},  //商品映射属性
                attrId_mpId: {},  //属性映射商品
                allValidAttrId: [],  //所有可用的属性
                selectedAttr: {}, //选中的属性
                selectedProd: {}, //选中的系列商品
                canSubmit: false, //是否可以确认属性选择
                //取两个数组的交集
                getIntersection: function (lists) {
                    var result = [];
                    if (angular.isArray(lists) && lists.length > 0) {
                        Array.prototype._intersect = Array.prototype._intersect || function (b) {
                                var flip = {};
                                var res = [];
                                for (var i = 0; i < b.length; i++) flip[b[i]] = i;
                                for (i = 0; i < this.length; i++)
                                    if (flip[this[i]] != undefined) res.push(this[i]);
                                return res;
                            }
                        var result = lists[0];
                        angular.forEach(lists, function (l) {
                            result = result._intersect(l);
                        })
                    }
                    return result;
                },
                //获取有效的属性
                getValidAttrId: function (noSelected) {
                    var selectedAttrList = [];
                    for (var item in this.selectedAttr) {
                        selectedAttrList.push(this.attrId_mpId[this.selectedAttr[item].id]);
                    }
                    //当前选中的属性可组合出的所有商品
                    var interSectionMpIds = this.getIntersection(selectedAttrList);

                    var validAttrIdList = [];
                    var that = this;
                    //如果没有选中任何属性, 把所有可以组合的属性都展示成可选
                    if (noSelected) {
                        validAttrIdList.push(this.allValidAttrId);
                    } else {
                        angular.forEach(interSectionMpIds || [], function (id) {
                            validAttrIdList.push(that.mpId_attrId[id]);
                        });
                    }
                    //组合出的商品对应的所有属性
                    var validAttrId = [];
                    angular.forEach(validAttrIdList, function (l) {
                        validAttrId = validAttrId.concat(l);
                    })
                    //var validAttrId=this.getIntersection(validAttrIdList);


                    //把无效属性设为无效
                    angular.forEach(this.attributes, function (a) {
                        angular.forEach(a.values, function (v) {
                            if ($.inArray(v.id.toString(), validAttrId) >= 0) {
                                v.disabled = false;
                            } else {
                                v.disabled = true;
                            }
                        })
                    })
                },
                //选中/取消属性
                selectSerialAttr: function (value, values) {
                    if (value.disabled) return;
                    value.checked = !value.checked;
                    //如果选中, 加入选中列表中
                    if (value.checked) this.selectedAttr[value.id] = value;
                    else delete this.selectedAttr[value.id];

                    var that = this;
                    //把同级的其他属性置为不选中
                    angular.forEach(values || [], function (v) {
                        if (v.id != value.id) {
                            v.checked = false;
                            //如果不选中的属性存在选中列表中, 删除
                            if (that.selectedAttr[v.id]) {
                                delete that.selectedAttr[v.id];
                            }
                        }
                    });
                    //如果选中的属性个数与属性类别相同, 表示可以提交
                    Object.myKeys = function (params) {
                        var ary = [];
                        if (Object.keys) {
                            ary = this.keys(params);
                        } else {
                            for(var key in params ) if(hasOwn.call(params,key)){
                                ary.push(key) ;
                            }
                            var DONT_ENUM =  "propertyIsEnumerable,isPrototypeOf,hasOwnProperty,toLocaleString,toString,valueOf,constructor".split(","),
                                hasOwn = ({}).hasOwnProperty;
                            for (var i in {
                                toString: 1
                            }){
                                DONT_ENUM = false;
                            }
                            if(DONT_ENUM && params){
                                for(var i = 0 ;key = DONT_ENUM[i++]; ){
                                    if(hasOwn.call(params,key)){
                                        ary.push(key);
                                    }
                                }
                            }
                        }
                        return ary;
                    }
                    if (Object.myKeys(this.selectedAttr).length == this.attributes.length) {
                        this.canSubmit = true;
                    } else {
                        this.canSubmit = false;
                    }
                    this.getValidAttrId(Object.myKeys(this.selectedAttr).length == 0);

                },
                getSerialProducts: function (map) {
                    this.attributes = angular.copy(map.attributes || []);
                    this.serialProducts = angular.copy(map.serialProducts || []);
                    var that = this;
                    //获取商品对属性的映射关系
                    angular.forEach(this.serialProducts, function (p) {
                        that.mpId_attrId[p.product.mpId] = p.key.replace(/(^_|_$)/g, '').split('_');
                        that.allValidAttrId = that.allValidAttrId.concat(that.mpId_attrId[p.product.mpId]);
                    })
                    //获取属性对商品的映射关系
                    angular.forEach(this.attributes, function (a) {
                        angular.forEach(a.values, function (v) {
                            that.attrId_mpId[v.id] = v.mpId;
                        })
                    })
                    //按默认选中的属性选择
                    angular.forEach(this.attributes, function (a) {
                        angular.forEach(a.values, function (v) {
                            if (v.checked) {
                                v.checked = !v.checked;
                                that.selectSerialAttr(v, a.values)
                            }
                        })
                    })
                },
                rollback: function (prod) {
                    //还原
                    this.attributes = [];  //系列属性
                    this.serialProducts = []; //系列商品
                    this.mpId_attrId = {};  //商品映射属性
                    this.attrId_mpId = {};  //属性映射商品
                    this.allValidAttrId = [];  //所有可用的属性
                    this.selectedAttr = {}; //选中的属性
                    this.selectedProd = {}; //选中的系列商品
                    this.canSubmit = false; //是否可以确认属性选择
                    prod.edit = false;
                },
                updateSerialProduct: function (prod) {
                    if (!this.canSubmit) {
                        $rootScope.error.checkCode($scope.i18n('警告'), $scope.i18n('请选择想要换货的商品') + '!');
                        return;
                    }
                    prod.map.attributes = this.attributes;
                    //获取对应商品id
                    this.selectedProd = {};
                    var keys = [], that = this;
                    angular.forEach(this.selectedAttr, function (a) {
                        keys.push(a.id);
                    })
                    keys = keys.sort().join('_');
                    angular.forEach(this.serialProducts, function (p) {
                        var tKey = p.key.replace(/(^_|_$)/g, '').split('_').sort().join('_');
                        if (tKey == keys) {
                            that.selectedProd = p;
                        }
                    })
                    if (this.selectedProd.product)
                        angular.extend(prod, {
                            chineseName: this.selectedProd.product.name,
                            mpId: this.selectedProd.product.mpId,
                            productUrl: this.selectedProd.product.picUrl
                        })
                    //还原
                    this.rollback(prod);
                }
            },
            //初始化
            init: function () {
                if (this.isModify)
                    this.getAfterSaleDetails();
                else
                    this.getAfterSaleType();
                var that = this;
                if (!that.isModify) {
                    $scope.$watch("applyAftersale.type", function (n, o) {
                        if (o > 0) {
                            that.initReturnProduct();
                            that.changeProduct = [];
                        }
                    });
                }
            }
        }
        //售后详情
        $scope.aftersaleDetail = {
            returnCode: '',
            detail: {},
            isAfterSale: false, //是否可申请售后
            orderAfterSalesId: urlParams.id,
            orderCode: '',
            //物流相关
            courierNumber: '',//物流单号
            logisticsCompany: '', //输入物流公司名称
            deliveryCompanyId: '',
            logisticsId: '',//选中物流公司ID
            logisticsList: [],//查找返回的所有物流公司
            showLogisticsList: false,//展示物流公司列表
            selectedLogistics: {},//选中的物流公司
            logistics:false,//是否有物流
            showOther: true,
            //是否已输入运单号
            hasCourierNumber: false,
            //售后详情
            getAfterSaleDetails: function () {
                var url = "/oms-api/order/soReturn/detail";
                var params = {
                    id: this.orderAfterSalesId
                };
                var that = this;
                $rootScope.ajax.postJson(url, params).then(function (result) {
                    if (result.code == 0) {
                        that.detail = result.data || {};
                        that.orderCode = result.data.orderCode;
                        that.returnCode = result.data.returnCode;
                        if (that.detail.type ==3 && (that.detail.returnStatus==$scope.baseConfig.returnStatus.verified || that.detail.returnStatus==$scope.baseConfig.returnStatus.inspect)) {
                            that.getLogisticsList();
                        }
                        if (that.detail.logisticsCompany && that.detail.courierNumber){
                            $scope.aftersaleDetail.courierNumber = that.detail.courierNumber;
                            $scope.aftersaleDetail.logisticsCompany = that.detail.logisticsCompany;
                        }
                    } else {
                        _fnE($scope.i18n('提示'),result.message);
                    }
                });
            },
            //录入退货的运单号
            saveCourierNo: function () {
                if (!this.showOther&&this.logisticsList&& this.logisticsList.length) {
                    this.logisticsCompany = this.selectedLogistics.name;
                    if (this.selectedLogistics.code){
                        this.deliveryCompanyId = this.selectedLogistics.code;
                    }
                }
                if (!this.logisticsCompany){
                    _fnE($scope.i18n('提示'),$scope.i18n('请输入物流公司'));
                    return;
                }
                if (!this.courierNumber){
                    _fnE($scope.i18n('提示'),$scope.i18n('请输入物流单号'));
                    return;
                }
                var url = "/oms-api/order/soReturn/editLogistics";
                var params = {
                    courierNumber: this.courierNumber, //运单号
                    returnCode: this.returnCode, //退货单ID
                    deliveryCompanyName: this.logisticsCompany, //物流公司名称
                    deliveryCompanyId:this.deliveryCompanyId,
                };
                var that = this;
                $rootScope.ajax.postFrom(url, params).then(function (res) {
                    if(res.code==0){
                        that.hasCourierNumber = true;
                        _fnE($scope.i18n('提示'),$scope.i18n('保存成功'));
                        that.getAfterSaleDetails();
                    }else{
                        $rootScope.error.checkCode(res.code, res.message);
                    }
                })
            },
            //取消退货申请
            cancelReturnProduct: function () {
                var that = this;
                $rootScope.error.checkCode($scope.i18n('警告'), $scope.i18n('您确定取消退换货申请吗') + '？', {
                    type: 'confirm',
                    ok: function () {
                        var url = "/oms-api/soReturn/cancel?id="+that.orderAfterSalesId;
                        $rootScope.ajax.post(url, {}).then(function (result) {
                            that.getAfterSaleDetails();
                        });
                    }
                });
            },
            //换货确认收货
            confirmComplete: function () {
                var url = "/api/my/orderAfterSale/confirm";
                var params = {
                    returnId: this.orderAfterSalesId
                }
                var that = this;
                $rootScope.ajax.post(url, params).then(function (result) {
                    that.getAfterSaleDetails();
                });
            },
            chaneOther: function() {
                this.showOther = !this.showOther;
            },
            getLogisticsList: function () {
                var that = this;
                $rootScope.getOrderDictionary('EXPRESS_CONFIG', function(data) {
                    if (data&&data.length) {
                        that.showOther = false;
                        that.logisticsList = data;
                        if (that.detail && that.detail.logisticsCompany && that.detail.courierNumber){
                            for (var i = 0;i<that.logisticsList.length;i++){
                                if (that.logisticsList[i].name.indexOf(that.detail.logisticsCompany) > -1){
                                    that.showOther = false;
                                    that.selectedLogistics = that.logisticsList[i];
                                    break;
                                }else {
                                    that.showOther = true;
                                }
                            }
                        }else {
                            that.selectedLogistics = that.logisticsList[0];
                        }
                    } else {
                        that.selectedLogistics = {};
                    }
                }, function(res) {
                    that.selectedLogistics = {};
                });
            },
            toEdite:function (orderCode,orderAfterSalesId) {
                window.location.href="#/afterSaleApplyNewModify?applyAfterSale=1&code="+orderCode+"&orderAfterSalesId="+orderAfterSalesId;
            },
            //初始化
            init: function () {
                this.getAfterSaleDetails();
                var that = this;
                angular.element('body').on('click', function () {
                    $scope.$apply(function () {
                        that.showLogisticsList = false;
                    })
                })
            }
        };

        (function () {
            //售后进度列表
            if (urlParams.afterSaleProgList == 1) {
                $scope.aftersaleList.init();
                //售后详情
            } else if (urlParams.afterSaleDetail == 1) {
                $scope.aftersaleDetail.init();
                //售后申请
            } else if (urlParams.applyAfterSale == 1) {
                $scope.applyAftersale.init();
            }
        })();
    }])
