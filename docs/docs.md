#commonService的公共方法
    1. 跳转到登录页面
        $rootScope.toLogin()
    2. 登录弹框
        $rootScope.toLoginModal()
    3. 退出登录
        $rootScope.userExit()
    4. home.js获取左边菜单栏使用, 根据返回的memberType显示不同的菜单
        $rootScope._getUserInfoFromCache(function a() {}, function b() {})
    5. 获取用户信息的两种使用
        $rootScope._getUserInfo()
        $rootScope._getUserInfo().then(function(res){})
    6. 添加到购物车
        $rootScope.addCart(scope.prod, scope.num, opts.checked, function (boo) {});
    7. 确定sessionId,如果没有sessionId则新生成一个, (未登录时加入购物车的商品,登陆后可根据sessionId添加到当前用户)
        $rootScope.checkSessionId()
    8. $rootScope.execute() 存放sessionId和获取地址
    9. 公共弹框
        ```
        $rootScope.error.checkCode('提示', '商品限购10件, 超出部分将以原价购买', {
            type: 'confirm',
            btnOKText: '继续购买',
            ok: function () {
                that.tipPop = false;
            },
            cancel: function () {
                that.itemAmount = $scope.itemlist[0].individualLimitNum;
            }
        });
        $rootScope.error.checkCode("系统异常",rest.message);
        ```
    10. 工具类
        $rootScope.util.getCurrentDomain(); 获取domain
        $rootScope.util.paramsFormat();  将url？后面的值弄成对象， 比如{navCategoryIds: "1288039401000115", categoryTreeNodeId: "1288039401000115"}
        $rootScope.util.urlFormat(); 将值拼接为url, 比如navCategoryIds=1288039401000115&categoryTreeNodeId=1288039401000115&attrValueIds=1187037506000011:1288039309000046
        $rootScope.util.getCookies();
        $rootScope.util.setCookie();
        $rootScope.util.delCookie();
        $rootScope.util.isEmptyObj(); 是不是对象， 原理能进for in 循环的一定是对象
        $rootScope.util.loadedTemplate(); (不知道干什么的)
        $rootScope.util.randomString(); 生成给定位数的十六进制形式随机数
        $rootScope.util.getCookies();
        $rootScope.util.cookie.setCookie();
        $rootScope.util.cookie.getCookie();
        $rootScope.util.cookie.delCookie();
        $rootScope.util.getUserToken() 获取ut cookies
        $rootScope.util.setUserToken() 设置ut cookies
        $rootScope.util.deleteUserToken() 删除ut cookies
        $rootScope.util.loggedIn() 获取ut cookies
    11. 全局的变量
        $rootScope.outScale=true; 超出配送范围
        $rootScope.isVirtual=true; 是否是虚品
        $rootScope.beforeChoseAdd = false; // 清了cookie之后第一次进入页面选择地址
        var utName='ut';
        //接口host
        var frontTemplate = window['template'] || window['frontTemplate'];
        frontTemplate={
            'rootScope_cookie_domain':'',
            'companyId':51,'platform':[1]
        };
        $rootScope.home='';
        $rootScope.host='/api';
        $rootScope.gw='/gw';
        $rootScope.host_ouser='/ouser-web';
        $rootScope.cookieDomain=frontTemplate.rootScope_cookie_domain;
        $rootScope.companyId=frontTemplate.companyId; //代表瓦特这个公司的类型，在基础数据中维护
        $rootScope.platformId=2; //pc
        $rootScope.personalUserType=4,//个人用户的用户类型
        $rootScope.companyUserType=5,//企业用户的用户类型
        $rootScope.singlePromotions=[1,7,8];//单一促销种类,1:单一特价,7:单一折扣,8:单一直降
        $rootScope.PackagePromotions = [1025];  // 套餐促销
        $rootScope.promotionType_gift = [1005]; //赠品促销
        $rootScope.localProvince //地区信息
    12. 全局的loading(注意多个api同时请求的只加一个，否则多个loading)
        $rootScope.isShowProjectLoading =true; 开启
        $rootScope.isShowProjectLoading =false; 关闭
#directives.js
    1. sideLayout
        解释: 登录成功的左边菜单栏,dataList会根据权限过滤
        传值: sideList
        使用:
            ```
            <div side-layout side-list="dataList"></div>

            $scope.dataList = [
                {
                    title: "订单中心",
                    items:[
                        {name: "我的订单", state: "index_orderList({status:0})"},
                        {name: "评价晒单", state: "index_comment"},
                        {name: "积分兑换记录", state: "index_favoriteGoods"},
                        {name: "渠道会员下单", state: "index_memberChannel", role:[1004]}
                    ]
                }
            ];
            ```
    2. goodsItem
        传值: prod,options
        解释: 商品列表， 用于search页面, prod商品对象数组, options对于一些特别商品的配置
        使用:
            ```
            <div goods-item class="goods-item" prod="prod" options="{showComment:true}" ></div>
            ```
    3. odyCarousel
        解释: 首页/服务中心图片显示/轮翻,serveLunBo图片对象集合数组
        传值: lunbo:图片对象集合数组
        使用:
            ```
            <div ody-carousel lunbo="serveLunBo" imgwidth="1010" imgheight="376"></div>
            ```
    4. pwCheck
        解释: 比较两个值是否一致
        传值: pwCheck:跟当前target比较的值
        使用:
            ```
            <input class="input md phone-pwd" placeholder="确认密码" type="password" ng-model="modify.password2" pw-check="password1" name="password2" required>
            ```
    5. pagination
        解释: 分页
        传值: pageSize:每页大小,pageNo:当前页码,totalPage:总页数,totalCount:总数（未使用）
        使用:
            ```
            <div pagination page-size="searchObj.pageSize" page-no="searchObj.pageNo" total-count="searchObj.totalCount" total-page="totalPage" ></div>
            ```
    6. addCart 目前未使用
        解释: 商品列表页添加到购物车
        传值: prod:当前商品,包含库存之类的值
        使用:
            ```
            <add-cart prod="prod">
                <a href="javascript:void(0)"
                   prod="prod" options="{index:$index}" handle="addCart"
                   class="addCart" ng-click="prod.amount=prod.amount>0?prod.amount:1;"
                   ng-if="prod.stockNum>0"
                   add-to-cart>加入购物车</a>
            </add-cart>
            ```
    7. addToCart
        解释: 商品详情， 渠道会员下单添加到购物车
        传值: prod:当前商品,handle:点击按钮的回调方法,opts:配置项（opts.isV==true，提示选择属性...）,num:数量
        使用:
            ```
            <a add-to-cart href="javascript:void(0)" class="btn addCart mgL0 btn-none" ng-if="item.stockNum>0 && item.isBargain != 3 && item.managementState&&item.isAreaSale" prod="item" handle="addCart" num="pcIteminfo.itemAmount" options="{isV:item.isSeries,isPresell:item.isPresell}">
                <i class="cart-icon mgR10"></i>加入购物车
            </a>

            $rootScope.addCart(scope.prod, scope.num, opts.checked, function (boo) {});
            ```

    8. searchProperty
        解释: 品牌,导购属性与商品类目搜索的选择指令， 支持多选和单选， 一旦选择刷新页面
        传值: title:类型名称, 如品牌,尺寸, datas:选择的属性的数组,options:配置项,callback:(未使用)
        使用:
            ```
            <div search-property callback="getProduct()" datas="attrs.attributeValues" title="attrs.name" options="{dataType:'list'}" ng-repeat="attrs in searchedObj.attributeResult|limitTo:ngMin"></div>
            ```
    9. crumb
        解释: 搜索页的面包屑(显示所选类目属性或者搜索框)
        传值: crumbList:所选类目数组, activeAttr:所选属性数组, isList: 显示属性还是显示搜索框, keyword: 搜索框显示时使用
        使用:
            ```
            <div crumb crumb-list="crumbList" active-attr="activeAttr" keyword="noResultKeyword1" is-list="isList">
                <div id="resultcount">
                    共 <span>{{searchedObj.totalCount || 0}}</span> 条
                </div>
            </div>
            ```
    10. recommendGoods
        解释: 商品详情页的推荐商品|猜你喜欢
        传值: title:名称, sceneNo:商品场景(0:首页;1:详情页;2:购物车;3:订单页;4:搜索无结果)(未使用), options:配置项(限制取几条...),onInit:(未使用),side: 位置在左或右, prodItemId: 当前商品ID(未使用), crumbList: 面包屑值
        注意： crumbList 与 onInit互斥， 一个是按照类目搜索一个是按照销售搜索
        使用:
            ```
            <div recommend-goods crumb-list="crumbList" prod-item-id="itemId" class="recommend-goods" side="left" title="热销商品" on-init="true" scene-no="1" options="{pageSize:12}"></div>
            ```
    11. searchBar
        解释: 顶部大的搜索框(支持自动加载历史记录, 删除历史记录...)
        传值: shelper: 是否展示热词(默认false), keyword:搜索值
        使用:
            ```
            <div class="search" search-bar shelper="searchHistory" keyword="noResultKeyword" ><i></i></div>
            ```
    12. miniCart
        解释: 顶部的迷你购物车(自己获取购物车数据), 可以动态监听值是否改变
        使用:
            ```
            <div class="shopCar" mini-cart></div>
            ```
    13. countDown
        解释: 秒杀倒计时
        传值: showCountDown: 是否显示(不确定),endTime: 结束时间,currentTime: 当前时间,callback: (未使用),noFont: 是不是显示秒字,
        使用:
            ```
            <div count-down show-count-down="startCountDown" current-time="getData" end-time="promotionInfo.promotions[0].endTime"></div>
            ```
    14. bombBox
        解释: 弹框组件调用
        传值: cartData:配置项(title,callback...)
        使用:
            ```
            <div bomb-box cart-data="favoriteData"></div>
            $scope.favoriteData = {
                bombShow:true,
                rightText: "移到收藏",
                title:'收藏',
                state:'error',
                position:'top',
                choesText:'移动后选中商品将不在购物车中显示',
                buttons: [
                    {
                        name:'确定',
                        className: 'one-button',
                        callback: function() {
                            $scope.favoriteConfirm();
                        }
                    },
                    {
                        name:'取消',
                        className: 'two-button',
                        callback: function() {
                            $scope.favoriteData.bombShow = false;
                        }
                    }
                ]
            }
            ```
    15. settleTips
        解释: 订单支付页没有地址弹框
        传值: settleData:配置项(title,callback...)
        使用:
            ```
            <div settle-tips settle-data="receiverNullData"></div>
            $scope.receiverNullData = {
                settleShow:true,
                settleTips:'您还没有收货地址,请新增收货地址',
                buttons:[
                    {
                        name:'知道了',
                        callback:function(){
                            $scope.receiverNullData.settleShow = false;
                        }
                    }
                ]
            }
            ```
    16. goodDetailBomb
        解释: 我要提问弹框， 目前商品咨询/问大家 使用
        传值: questionData:配置项(title,callback...),sendRequest:是否显示咨询类型
        使用:
            ```
            <div good-detail-bomb  question-data="busData" take-data="ConsultationText" send-request="true" ></div>
            $scope.busData = {
                bombShow : true,
                choseText : "",
                selectDiv:true,
                checkedNum : 1,
                typeId:$scope.selectValue,
                checked:[
                    {
                        isAvailableChecked:true,
                        chanceChecked:function() {
                            $scope.busData.checked[0].isAvailableChecked = !$scope.busData.checked[0].isAvailableChecked;
                            if($scope.busData.checked[0].isAvailableChecked){
                                $scope.busData.checkedNum = 1;
                            } else{
                                $scope.busData.checkedNum = 0;
                            }
                        }
                    }
                ],
                buttons:[
                    {
                        name:"确定",
                        className:"one-button",
                        callback:function() {
                        }
                    },
                    {
                        name:"取消",
                        className:"two-button",
                        callback:function() {
                        }
                    }
                ]
            }
            ```
    17. loginBomb
        解释: ut没有时显示登录
        使用:
            ```
            <div login-bomb show-login-box="$parent.showLoginBox"></div>
            $rootScope.showLoginBox = true;
            ```
    18. tipsPopup
    19. ngEnter
        解释: 回车事件， 用于登录页面的回车登录
        使用:
            ```
            <input class="input big icon-user-box-padL" placeholder="密码" type="password" ng-model="loginInfo.password" name="password" ng-enter="login()">
            ```
    20. opUploadImage
        解释: 上传单个图片， 比如增票资质， 注册成为渠道会员
        传值: imageWidth: 图片宽度, imageHeight: 图片高度, imageBorder: 图片边框, defaultImage: 默认图片, maxSize: 上传最大值, imageUrl: 上传后的url , imagePattern: 可以上传的图片格式, isShowDelete: 是不是显示删除按钮
        使用:
            ```
            <div op-upload-image image-width="100" image-height="100" image-border="0" default-image="../../../images/photo.png" max-size="5MB" image-url="$parent.businessLicencePhoto" image-pattern=".jpg,.bmp,.png,.jpeg,.gif" is-show-delete="true"></div>
            ```

    21. opUploadMoreImage
        解释: 上传单个图片， 比如增票资质， 注册成为渠道会员
        传值: imageWidth: 图片宽度, imageHeight: 图片高度, maxSize: 上传最大值, imageUrlList: 上传后的url数组 , imagePattern: 可以上传的图片格式, isShowDelete: 是不是显示删除按钮, imageMaxLength: 可以上传的最大个数, addClass: 自己页面独有的样式
        使用:
            ```
            <div op-upload-more-image image-width="100" image-height="100" max-size="5MB" image-url-list="applyAftersale.picUrl" image-pattern=".jpg,.bmp,.png,.jpeg,.gif" is-show-delete="true" image-max-length="3" add-class="disIB text-center fl posR mgR20"></div>
           ```
    22. checkCodeTip
        解释: 调用checkCode的弹框
        传值: errorMessageTip: 弹框基本信息及callback, error: 关闭窗口按钮, isIE: 根据浏览器使用不同的值, errorInfo: 一些需要特殊处理的error信息(结算页)
        使用:
            ```
            <div check-code-tip error-message-tip="errorMessageTip" error="error" is-ie="isIE" error-info="errorInfo"></div>
           ```
    23. cartCheckCodeTip
        解释: 购物车页面调用checkCode的弹框
        传值: errorMessageTip: 弹框基本信息及callback, error: 关闭窗口按钮, isIE: 根据浏览器使用不同的值, errorInfo: 一些需要特殊处理的error信息(结算页)
        使用:
            ```
            <div cart-check-code-tip error-message-tip="errorMessageTip" error="error" is-ie="isIE" error-info="errorInfo"></div>
           ```
    24. pcPlaceholder
        注意： 目前使用ng-blur等事件的input会有问题， 为了解决ie8,9不支持placeholder
        <input class="input big phone-user" pc-placeholder="图片验证码" placeholder="图片验证码"  type="text" ng-model="loginInfo.vicode" name="vicode">
    25. addressBox
        解释: 修改添加地址的弹框
        传值：addressBoxData： 属性值及callback函数
        使用：
            ```
            <div address-box address-box-data="addressBoxData"></div>
            添加
            $scope.addressBoxData = {
                invalidSubmit: false,
                newAddress: {},
                toAddNewAddress: true,
                callbackFun: function(thisID, id, data) {
                    $scope.address._getAllAddress(id);
                }
            }
            编辑
            $scope.addressBoxData = {
                invalidSubmit: false,
                newAddress: {
                    id: address.id,
                    userName: address.userName,
                    provinceCode: address.provinceCode,
                    cityId: address.cityId,
                    regionId: address.regionId,
                    detailAddress: address.detailAddress,
                    mobile: address.mobile,
                    defaultIs: address.defaultIs == 1 ? true : false,
                    selectedId: address.selectedId
                },
                toAddNewAddress: true,
                callbackFun: function(thisID, id, data) {
                    if (id && data.provinceCode.indexOf(_pid) < 0) $scope.address.selectedId = 0;
                    $scope.address._getAllAddress(thisID);
                    //$scope.address._saveReceiver(id);
                }
            }
            ```
    26. guessYouLike
        解释: 猜你喜欢， 关注的商品， 关注的店铺， 横向的
        传值：title,onInit,options{top,pageSize,pageWidth,paddingWidth, showPromotion},
        使用:
            guessYouLikeOptions = {
                top: 125,
                pageSize: 5,
                pageWidth: 1200,
                paddingWidth: 20,
                showPromotion: false
            };
            <div guess-you-like class="guessyoulike-goods mgT20" title="猜你喜欢" on-init="true" options="guessYouLikeOptions" ng-if="$parent.globalVariableRules.showGuessYouLike"></div>
    27. datetimepicker
        解释：时间插件
        使用：less引入 i-datepicker.less， 个人中心已引其他的页面自己引
              html
                <div class="datetimepicker">
                    <span class="date-title f14">业务日期：</span>
                    <div class="dis datetimepicker-content">
                        <div class="input-group">
                            <input type="text"  value="" class="timeiconbg date-time-picker-input"  datetimepicker for-id="logListModalFrom" options="options1" close="close(from)" max-date="endDateStr" ng-model="startDateStr">
                            <span class="input-group-addon" style="padding: 0">-</span>
                            <input type="text"  value="" class="timeiconbg date-time-picker-input" datetimepicker for-id="logListModalTo" options="options2" close="close(to)" min-date="startDateStr" ng-model="endDateStr">
                        </div>
                    </div>
                </div>
              js
                $scope.options1= {
                    format:'Y-m-d',
                    lang:'zh',
                    timepickerScrollbar:false,
                    timepicker:false,
                    scrollInput:false,
                    scrollMonth:false,
                    scrollTime:false
                }
                $scope.options2= {
                    format:'Y-m-d',
                    lang:'zh',
                    timepickerScrollbar:false,
                    timepicker:false,
                    scrollInput:false,
                    scrollMonth:false,
                    scrollTime:false
                }
#cmsDirectives.js
    1. pcCube
        解释: 魔方模板
        传值: moduleId
        使用:
            ```
            document.write("<div pc-cube module-id=\"1285045201000000\"></div>");
                ;(function(global){
                    var namespace=global['_cms']||(global['_cms']={}),
                    data=namespace['data']||(namespace['data']={});
                    data['1285045201000000']= {
                    moduleId:1285045201000000,
                    tCode:'pc-cube',
                    vData:{"cdata":{"width":"1200px","children":[{"imgUrl":"http://cdn.oudianyun.com/prod1.0/dev/back-cms/1508987962362_8615_59.jpg@base@tag=imgScale&q=80","marginBottom":"0","height":"590px","sort":"1","desc":"1","width":"280px","marginRight":"20px","link":{"status":true,"data":"/index.html","type":"自定义|/index.html"},"sug":"280x590","float":"left"},{"width":"620px","children":[{"imgUrl":"http://cdn.oudianyun.com/prod1.0/dev/back-cms/1508988240697_4305_31.jpg@base@tag=imgScale&q=80","marginBottom":"20px","height":"280px","sort":"2","desc":"2","width":"600px","marginRight":"20px","link":{"status":true,"data":"/index","type":"自定义|/index"},"sug":"600x280","float":"left"},{"imgUrl":"http://cdn.oudianyun.com/prod1.0/dev/back-cms/1508988273687_1254_37.png@base@tag=imgScale&q=80","marginBottom":"0","height":"290px","sort":"3","desc":"3","width":"290px","marginRight":"20px","link":{"status":true,"data":"/index.html","type":"自定义|/index.html"},"sug":"290x290","float":"left"},{"imgUrl":"http://cdn.oudianyun.com/prod1.0/dev/back-cms/1508988555276_4744_34.png@base@tag=imgScale&q=80","marginBottom":"0","height":"290px","sort":"4","desc":"4","width":"290px","marginRight":"20px","link":{"status":true,"data":"index.html","type":"自定义|index.html"},"sug":"290x290","float":"left"}],"float":"left"},{"imgUrl":"http://cdn.oudianyun.com/prod1.0/dev/back-cms/1508988574022_7611_33.jpg@base@tag=imgScale&q=80","marginBottom":"0","height":"590px","sort":"5","desc":"5","width":"280px","marginRight":"0","link":{"status":true,"data":"index.html","type":"自定义|index.html"},"sug":"280x590","float":"left"}]},"layout":1},
                    dData:{}
                    };
                })(window);
           ```
    2. pcMultipic
        解释: 图片模板
        传值: moduleId
        使用:
            ```
            document.write("<div pc-multipic module-id=\"1285045201000009\"></div>");
            ;(function(global){
                var namespace=global['_cms']||(global['_cms']={}),
                data=namespace['data']||(namespace['data']={});
                data['1285045201000009']= {
                moduleId:1285045201000009,
                tCode:'pc-multipic',
                vData:{"column":"1","images":{"oriHeight":"","desc":"图2","link":{"status":true,"data":"/index.html","type":"自定义|/index.html"},"src":"http://cdn.oudianyun.com/prod1.0/dev/back-cms/1508986564354_2022_58.jpg@base@tag=imgScale&q=80","url":"","oriWidth":""}},
                dData:{}
                };
            })(window);
           ```
    3. pcGoods
        解释: 商品模板
        传值: moduleId, 根据vData返回的col可以显示2,3,4,5,6列不同样式
        使用:
            ```
            document.write("<div pc-goods module-id=\"1285044902000079\"></div>");
            ;(function(global){
                var namespace=global['_cms']||(global['_cms']={}),
                data=namespace['data']||(namespace['data']={});
                data['1285044902000079']= {
                moduleId:1285044902000079,
                tCode:'pc-goods',
                vData:{"sortRule":0,"displayNav":0,"col":5,"displayNum":100,"displayBuyBtn":0,"useBuyConditions":false,"useNav":true,"useBuyBtn":true,"goodsType":1},
                dData:{}
            };
            })(window);
           ```
    4. pcTitle
        解释: 标题模板
        传值: moduleId
        使用:
            ```
            document.write("<div pc-title module-id=\"1285045201000003\"></div>");
            ;(function(global){
                var namespace=global['_cms']||(global['_cms']={}),
                data=namespace['data']||(namespace['data']={});
                data['1285045201000003']= {
                moduleId:1285045201000003,
                tCode:'pc-title',
                vData:{"more":"","iconSrc":"http://cdn.oudianyun.com/prod1.0/dev/back-cms/1508986262527_4788_58.png@base@tag=imgScale&q=80","color":"#2F2CF4","titleName":"这是默认标题","keyword":[{"text":"哈哈哈","link":{"status":true,"data":"/index.html","type":"自定义|/index.html"}},{"text":"hello","link":{"status":true,"data":"index.html","type":"自定义|index.html"}},{"text":"商品","link":{"status":true,"data":"http://mall.dev.op.com/item.html?itemId=1288040101000038","type":"商品|系列商品测试"}}],"titleType":"0"},
                dData:{}
                };
            })(window);
           ```
    5. pcSidenav
        解释: 辅导导航条， 没有模板， 目前不使用
        传值: moduleId
    6. pcMap
        解释: 热区模板(在图片的各个位置点击可以调到不同的页面)
        传值: moduleId
        使用:
            ```
            document.write("<div pc-map module-id=\"1285045201000012\"></div>");
            ;(function(global){
                var namespace=global['_cms']||(global['_cms']={}),
                data=namespace['data']||(namespace['data']={});
                data['1285045201000012']= {
                moduleId:1285045201000012,
                tCode:'pc-map',
                vData:{"bkWidth":450,"data":[{"area":[50,10,10,10,11,116,443,113,443,8],"link":{"status":true,"data":"/index.html","type":"自定义|/index.html"}},{"area":[51,124,11,124,11,218,443,216,442,124],"link":{"status":true,"data":"home.html","type":"自定义|home.html"}}],"column":"1","src":"http://cdn.oudianyun.com/prod1.0/dev/back-cms/1508986473372_5058_33.jpg@base@tag=imgScale&q=80"},
                dData:{}
            };
            })(window);
           ```

#filters.js
    1. textLengthFormat
        解释: format长度
        使用: {{text | setTextLength : 20 : '...'}}       filter: 长度: 达到长度后拼接的符号， 默认...
    2. itemFormat
        解释: 截取长度6, 不建议使用, 使用textLengthFormat
    3. formatNum
        解释: 格式化数字， 去除多余的逗号, 目前未使用
        使用: {{num |timeFormat: true}}       filter: true/false; 如果true会去除逗号
    4. timeFormat
        解释: 格式化为标准时间: 01天01小时01分01秒
        使用: {{time |timeFormat}}
    5. hidePhone
        解释: 格式手机号， 显示为186****3147
        使用: {{mobile| hidePhone}}
    6. phoneDate
        解释: 格式手机号， 显示为186****3147
        使用: {{mobile| phoneDate}}
    7. timeTransferDate
        解释: 格式化日期
        使用: $filter('timeTransferDate')(startTime)
        ```
        *****************不建议使用因为angular已经提供了$filter('date')(dateT,'yyyy-MM-dd HH:mm:ss'); {{now | date : 'yyyy-MM-dd HH:mm:ss'}}****************
        ```
    8. formatTime
        解释: 格式化日期
        使用: {{mobile| formatTime: true}}  如果是true显示今天， 昨天， 前天， 具体时间； false显示具体时间
    9. toOrderStatusContext
        解释: 格式化订单状
        使用: {{status |toOrderStatusContext}}
    10. toOrderTypeContext
        解释: 格式化订单类型
        使用: {{type|toOrderTypeContext}}
    11. toOrderPaymentTypeContext
        解释: 格式化订单付款方式
        使用: {{status|toOrderStatusContext}}
    12. toTrusted
        解释: 使用ng-bind-html时， 需将代码转化为安全模式
        使用: {{html |toTrusted}}
    13. isOverdue
        解释: 判断是否过期
        使用: {{(repairDetail.detail.orderLogisticsTime+24*60*60*1000*pro.guaranteeDays) | isOverdue}} 出库时间 + 保修天数*天毫秒 ， 传时间戳
    14. hideCertificateNo
        解释： 格式身份证， 1*******************7
    15. hideBankCardNo
        解释：格式银行卡，****************2347
