/**
 * Created by Roy on 16/12/7.
 */
angular.module('appControllers').controller('afterSaleNewCtrl', ["$scope", "$rootScope", "$cookieStore", "commonService", 'categoryService', "validateService", "Upload", "$stateParams","$window","allUrlApi",
    function ($scope, $rootScope, $cookieStore, commonService, categoryService, validateService, Upload, $stateParams,$window,allUrlApi) {
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
        if( urlParams.mpId && urlParams.mpId.length > 0  ) {
            var mpIdArr = urlParams.mpId.split(",");
        }
        //申请售后
        $scope.applyAftersale = {
            type: urlParams.type || 0,//选中类型
            types: [], //所有退货类型
            orderCode: urlParams.code, //订单号
            mpIdArr : mpIdArr, // 商品mpId数据
            returnCode: null,
            aftersaleLength : urlParams.length,
            orderAfterSalesId: urlParams.orderAfterSalesId || null,//退货id
            selectedGoods: [], //退货订单的所有商品列表
            causes: [], //退货原因列表
            selectedCauses: {},//选中的退货原因
            remark: '', //退货说明
            returnSoItemList: [],//要退换的商品
            changeProduct: [], //供换货的商品
            maxRefundTotal : 0 , // 退款总金额备份
            activeTab : 1 , // 默认tab为1
            //修改订单
            isModify: (urlParams.orderAfterSalesId || '').length > 0, //订单详情
            //图片上传相关
            file: null, //选择文件
            picUrl: [], //上传文件返回的图片地址列表
            afterOrder: {},//申请售后的订单
            afterConfirm: {},
            selectedArr : [],
            allSelectButton : false,
            aftersaleTypeShow : false,
            sysSource : '',
            switchTab : function ( num ) {
                if( num == 1 ) {
                    this.activeTab = 1;
                    this.aftersaleGoods = this.alreadyShipped
                    for( let i = 0 ; i < this.aftersaleGoods.length ; i++ ) {
                        this.aftersaleGoods[i].checked = false;
                    }
                } else if ( num == 0) {
                    this.activeTab = 0;
                    this.aftersaleGoods = this.unshippedDelivery
                    for( let i = 0 ; i < this.aftersaleGoods.length ; i++ ) {
                        this.aftersaleGoods[i].checked = false;
                    }
                }
                this.selectedArr = [];
                this.allSelectButton = false;
            },
            //售后商品
            initReturnProduct: function () {
                var url = allUrlApi.orderDetail;
                var params = {
                    orderCode: this.orderCode
                }
                var that = this;
                $rootScope.ajax.get( url , params ).then( function ( res ) {
                    if( res.code == 0  && res.data ) {
                        if( urlParams.mpId ) {
                            if( res.code == 0 && res.data && res.data.orders && res.data.orders.length > 0 ) {
                                that.sysSource = res.data.sysSource;
                                if(  res.data.orders && res.data.orders.length > 0 ) {
                                    for( let i = 0 ; i < res.data.orders.length ; i++ ) {
                                        if( res.data.orders[i].items && res.data.orders[i].items.length > 0 ) {
                                            for( let k = 0 ; k < res.data.orders[i].items.length ; k++ ) {
                                                for( let j = 0 ; j < that.mpIdArr.length ; j++ ) {
                                                    if( that.mpIdArr[j] == res.data.orders[i].items[k].storeMpId ) {
                                                        that.selectedGoods.push( res.data.orders[i].items[k] );
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                if( that.selectedGoods  && that.selectedGoods.length > 0) {
                                    let total = 0;
                                    for( let h = 0 ; h < that.selectedGoods.length; h++ ) {
                                        that.selectedGoods[h].maxProductItemNum = that.selectedGoods[h].productItemNum;
                                        total += that.selectedGoods[h].productItemAmount;
                                    }
                                    that.types = that.selectedGoods[0].supportedReturnTypes;
                                    that.type = that.types[0].type;
                                    if( that.types[0].type == 1 ) {
                                        that.aftersaleTypeShow = true;
                                    } else {
                                        that.aftersaleTypeShow = false;
                                    }
                                }
                                that.getcauses();
                            }
                        }
                    } else {
                        _fnE($scope.i18n('提示'),res.message);
                    }
                } )
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
            //售后原因
            getcauses: function () {
                var url = "/oms-api/public/order/code/listByCategory" + '/' + 'RETURN_REASON' + '_' + this.type;
                var that = this;
                $rootScope.getOrderDictionary('RETURN_REASON_' + this.type, function(data) {
                    if (data&&data.length) {
                        that.causes = data;
                        if (that.isModify) {
                            angular.forEach(that.causes, function (cause) {
                                if (that.selectedCauses.key == cause.key) {
                                    that.selectedCauses = cause;
                                }
                            })
                        } else {
                            that.selectedCauses = that.causes[0];
                        }
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
                    picList.push(v)
                })
                return picList
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
                    idArr.push(prod.storeMpId);
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
                var url = "/oms-api/order/soReturn/addReturn";
                var params = {
                    goodsReturnType : 0,
                    orderCode: this.orderCode,
                    returnReason : this.selectedCauses.code,
                    returnRemark: this.remark,
                    picList: this.picUrlData(),
                    sysSource : that.sysSource,
                    type: this.type,
                    itemList : []
                }
                for( let i = 0 ; i < that.selectedGoods.length ; i++ ) {
                    params.itemList.push(
                        {   applyReturnAmount : (that.selectedGoods[i].productItemAmount/that.selectedGoods[i].maxProductItemNum * that.selectedGoods[i].productItemNum).toFixed(2),
                            returnProductItemNum : that.selectedGoods[i].productItemNum,
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
                    }
                },function(result){
                    _fnE($scope.i18n('提示'),result.message);
                })
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
                        that.mpId_attrId[p.product.storeMpId] = p.key.replace(/(^_|_$)/g, '').split('_');
                        that.allValidAttrId = that.allValidAttrId.concat(that.mpId_attrId[p.product.storeMpId]);
                    })
                    //获取属性对商品的映射关系
                    angular.forEach(this.attributes, function (a) {
                        angular.forEach(a.values, function (v) {
                            that.attrId_mpId[v.id] = v.storeMpId;
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
                            storeMpId: this.selectedProd.product.storeMpId,
                            productUrl: this.selectedProd.product.picUrl
                        })
                    //还原
                    this.rollback(prod);
                }
            },
            //初始化
            init: function () {
                this.initReturnProduct();
            }
        }
        $scope.applyAftersale.init();
    }])
