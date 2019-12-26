/*
*变量配置
*这边加了变量， 如果custumer跟这边加的变量不一样， 需要在custumer对应的项目里面的env/config.js里面添加
*菜单在app.constant.js下面配置， 根据下面配置的menuListConfig控制是否显示，如果客户要求改菜单位置之类的， 需要在custumer重新写一个app.constant.js, 如果客户只是想加一个菜单， 则在core下面的app.constant.js添加一个菜单名， 在core/app.home.js里面添加路由， 再在本文件中添加变量控制显示或不显示，每个custumer的项目与本文件显示的变量不一致， 需要在自己的config.js配置
****修改已经存在的变量需慎重****
*/
var superConfig = {
    "analysis":{
      "baiduHm":true, //百度统计
      "heimdall":true //跟踪云
    },
    common: {
        //mall,o2o,b2b...
        companyProjectType: 'mall',
        allCartBtnName: '购物车',
        companyName: '史泰博',
        bulletinName: '欧普热点',
        companyId: 259,
        defaultIdentityTypeCode: 4,
        //searchbar是不是显示商品和店铺搜索, 搜索页是不是显示自营按钮
        showSearchCommodityTypes: false,
        //是否显示扫码支付, 要引入生成二维码的js
        showScanLogin: false,
        //添加地址的时候要不要显示身份证
        showIDCardWhenEditAddress: false,
        //全局的搜索显示icon还是文字的问题
        showSearchIcon: true,
        //是不是显示小能客服
        customerServiceType: 1,
        //上传图片的格式
        uploadingPicFormat: ".jpg,.bmp,.png,.jpeg,",
        //上传图片的大小
        uploadingPicSize: "5MB",
        //购物车结算页是否支持多商家的分组
        multipleMerchants:true,
        //是否显示地址选择， 比如商品详情页和头部的地址选择
        showUpdateDistributionAddress: true,
        //加入购物车的时候是不是显示包装方式的选择
        showChoosePackingMethod: false,
        //是不是显示所有的页面显示菜单栏
        showAllGlobalNav: false,
        //是否限制库存
        productRestrictedStock: true,
        // 晨光是否跳转到加盟店铺审核状态
        jumpJoinProcessStep: false,
        // 获取未登录的商家信息
        obtionMerchantInfoWhenNoLogin: false,
        //登录后才显示价格, 不登录隐藏价格
        hidePriceWhenNoLogin: false,
        //隐藏价格时显示的文字
        showTextWhenHidePrice: '价格登录显示',
        showMinTextWhenHidePrice: '登录显示',
        //是否显示中英文切换
        switchoverLanguage:true,
        //底部是否读取接口
        footerReadPort:true
    },
    index : {
        // 首页
        showBottomImg : false, //晨光服务保障广告图
        showCreditData : false, //晨光头部信用额度数据
        showIndexBottomMes : false,//晨光底部公司链接信息
        showIndexBottomImg : false//晨光底部工商局商标信息
    },
    user: {
        // 注册页
        regist : {
            // 晨光跳转到加盟店铺页面
            cgJumpMerchant : false,
            //晨光 是否显示底部logo开关
            showBottomImg : false,
            projectTitle:'表示您同意'
        },
        //登录框
        login: {
            //是否显示工号
            showJobNumber: false,
            //是否显示联合登录
            showUnionLogin: true,
            //账号登录输入框描述
            showAccountLoginDesc:'手机号'
        },
    },
    trade: {
        //收银台的提示信息
        showCashierTheme: '欧普照明',
        settle: {
            //是否显示发票
            showInvoice: true,
            //是否显示佣金
            showUsageAmount: true,
            // 晨光确认订单按钮
            showSureOrder : false,
            // 是否要获取优惠码
            isConcession : true
        },
        complete : {
            //支付完成页面是否显示底部图片
            showBottomImage : true
        }
    },
    center: {
        //晨光头部信息展示
        showCgMyHeadMes : false,
        //是否显示手机证验证
        showPhoneVerification: true,
        //收货地址是否显示提示语
        showReceivingAddressTip: true,
        //个人中心首页
        userIndex: {
            //是否显示会员等级，成长值，佣金等等
            showUserRank: true,
            showUserGrowUp: true,
            showUserEdou: true
        },
        //个人中心头部下拉功能列表配置
        myAccountFunction:{
            accountModify:true,//账户安全
            accountBind:false,//绑定账号
            accountInvoice:true,// 发票信息
            accountBaseInfo:true,//个人基本信息
            accountConsignee:true,//收货人信息
            accountAddress:true,//收货地址
            accountMember:false,//我的会员
            accountAuthentication:true//实名认证
        },
        //个人中心账号绑定配置
        accountBindFunction:{
            supportQQ:true,//是否支持QQ绑定
            supportWeiXin:true,//是否支持微信绑定
            supportWeiBo:true,//是否支持微博绑定
            supportZhiFuBao:true//是否支持支付宝绑定
        },
        //订单列表
        order: {
            //判断订单来源,订单类型，订单渠道是否显示
            orderType: true,
            orderSysSource: true,
            merchantName:false,//是否展示商家名称
            showLogistics:true,//是否展示物流跟踪
            showCanBuyAgain:true,//是否展示再次购买按钮
            afterSales:true,//是否展示售后按钮
            confirmGoods:true,//是否展示确认收货按钮
            showConfirmTab:false,//是否展示待确认tab
            noPayShowCancelBtn:true,//未付款状态是否展示取消按钮
            noDeliverShowCancelBtn:true//未发货状态是否展示取消按钮
        },
         //订单详情页面
         orderDetail: {
            //订单详情页面是否显示发票 与结算页面是否显示发票一致
            showInvoice: true,
            //是否显示付款方式
            showPayMethod: true,
            //是否显示商品总额
            showProductSum: true,
            //是否显示促销优惠
            showPromotion: true,
            //是否显示优惠码
            showPromotionCode: true,
            //是否显示运费
            showFreight: true,
            //是否显示优惠券
            showCoupon: true,
            //是否显示积分
            showIntegral: true,
            //是否显示佣金
            showUsageAmount: true,
            //是否显示实付款：
            showRealPayment: true,
             //是否展示电子发票跳转链接
             showInvoiceLink:true
        },
        //评价页面
        comment: {
            showChaseComment: true
        },
        //用户个人信息
        accountNews: {
            //是否显示头像
            showHeadPortrait: true,
            //是否显示昵称
            showNickName: true,
            //是否显示手机
            showPhoneNumber: true,
            //是否显示性别
            showSex: true,
            //是否显示生日
            showBirth: true,
            // 个人中心晨光JS控制开关
            cgJsController : false,
            //是否展示客户名称
            showCustomerName : false,
            // 是否展示店主名称
            showMerchantName : false,
            // 是否展示联系电话
            showOtherTelephone : false,
            // 是否展示邮箱
            showEmailNumber : false,
            // 是否展示三级地址
            showThreeAddess : false
        },
        //发票
        bill: {
            //是否显示电子发票图片
            showInvoiceImage:true
        },
    },
    guide: {
        //列表页
        search: {
            //评论排序
            showCommodityComment: true,
            //商品列表的每个商品是不是显示评分, 和评分排序
            showCommodityScore: false,
            //是不是显示加入购物车的插件
            showMiniCartBtn: true,
            //商品列表的每个商品是不是显示商家名称
            showMerchantName: false,
            //商品列表的每个商品是不是销量, ***********与评分互斥， 只显示一个*************
            showCommoditySales: true,
            //是不是支持显示自营的按钮搜索
            showSelfSupport: true,
            //显示促销商品的提示
            showPromotionTip: true,
            //搜索页显示推荐商品
            searchShowRecommendGood: true,
            //搜索页显示推荐商品
            recommendGoodSearchOptions: {
                pageSize:16,
                showIndex: false,        //显示标签型的index
                showSalesVolume: false,  //显示热销多少件
                showName: true,          //显示商品名
                showPromotion: true,      //显示促销标签,
                type: 'lookandsee',
                size: 4,                 //每次显示几个， 与showHeight有关
                showHeight: 1095,          //因为看了又看显示的标签不一样， 所以设置不同的高度size: 3,showHeight: 696
                addHeight: 50,
                domName: 'look-and-see-dom'
            },
            //搜索页显示猜你喜欢
            showGuessYouLike: false,
            guessYouLikeOptions: {
                top: 145,                  //左右按钮位置
                pageSize: 5,
                pageWidth: 1200,
                paddingWidth: 20,
                showPromotion: true
            }
        },
        //商品详情
        item: {
            //是不是显示右侧推荐
            showRightRecommend: false,
            //商品详情页显示右侧推荐
            recommendGoodRightOptions: {
                pageSize:12,
                showIndex: false,        //显示标签型的index
                showSalesVolume: false,  //显示热销多少件
                showName: true,          //显示商品名
                showPromotion: true,      //显示促销标签,
                type: 'lookandsee',
                size: 2,                 //每次显示几个， 与showHeight有关 size: 3,showHeight: 696,
                showHeight: 477,          //因为看了又看显示的标签不一样， 所以设置不同的高度
                addHeight: 90,
                domName: 'look-and-see-dom'
            },
            //商品详情页显示推荐商品
            recommendGoodCrumbOptions: {
                pageSize:16,
                showIndex: false,        //显示标签型的index
                showSalesVolume: false,  //显示热销多少件
                showName: true,          //显示商品名
                showPromotion: true,      //显示促销标签
                type: 'crumb',
                size: 4,                 //每次显示几个， 与showHeight有关 size: 3,showHeight: 696,
                showHeight: 959,          //因为看了又看显示的标签不一样， 所以设置不同的高度
                addHeight: 50,
                domName: 'crumb-look-and-see-dom'
            },
            //商品详情导航
            goodNavigation:{
                goodIntroduce:true,//商品介绍
                goodParameter:true,//商品参数
                goodAfterSales:true,//售后服务
                goodEvaluation:true,//商品评价
                goodConsulting:true,//商品咨询
                goodQuestionAnswer:true//商品问答
            },
            //商品详情页面评价
            comment: {
                //评价按钮的显示0"全部",1"好评",2"中评",3"差评",5"有图",
                labelflag: "0,1,2,3,5"
            },
           //商品详情页面是否追加评价
           addComment: true,
           //商品详情页面是否显示服务商品
           showServiceGoods: true
        },
    },
    //个人中心的菜单配置， 默认值不要轻易更改
    menuListConfig: {
        //订单列表
        showOrderList : true,
        //评价列表
        showCommentList : true,
        //预置订单
        showAdvanceOrder : true,
        //审批单
        showAuthorization : true,
        //快速订单
        showQuickOrder2 : true,
        //积分兑换记录
        showFavoriteGoods : false,
        //渠道会员下单(除了欧普都没有)
        showMemberChannel : false,
        //我的收藏
        showFrequenceList : true,
        //浏览历史
        showFavoriteStore : false,
        //优惠券列表
        showCouponsList : false,
        //积分列表
        showPointList: false,
        //佣金列表
        showCommissionList: false,
        showAwardList: false,
        //奖品列表
        showVoucherList: false,
        //售后服务列表
        showAfterSaleList: true,
        //维修服务列表
        showSaleRepairList: false,
        //我的问答
        showQuestionList: false,
        //购买咨询
        showConsultList: false,
        //我的发票
        showBillList: false,
        // 报表中心
        showStateMent: true,
        // 分类报表中心
        showStateMentCategory: true,
        // 采购数据-按目录
        showStatementPurchaseCategory: true,
        // 采购数据-按商品
        showStatementPurchaseProduct: true,
        // 搜索失败词统计
        showStatementFailWord: false,
        // 采购额天表
        showStatementPurchaseDay: true,
        // 采购额月表
        showStatementPurchaseMonth: true,
        // 采购额成本中心报表
        showStatementPurchaseCost: true,
        // 账号订单明细表
        showStatementOrderDetail: true,
        // 账号剩余额度表
        showStatementAccountPoint: true,
        //个人信息
        showAccountBaseInfo: true,
        //收货地址
        showAccountAddress: true,
        //收货人信息
        showAccountConsignee: true,
        //账户安全,修改密码等
        showAccountModify: true,
        //账户绑定， 目前没有使用
        showAccountBind: false,
        //我的会员
        showAccountMember: false,
        //增票资质
        showAccountInvoice: false,
        //发票信息
        showAccountInvoiceMessage: true,
        //实名认证
        showAccountAuthentication: false,
        //所有消息列表
        showMessageList: true,
        //活动消息列表
        showActMessageList: false,
        //系统消息列表
        showSysMessageList: false,
        //晨光b2b的， 产品化现在不用,  配置可以不加
        //批发业务单
        showBusinessList: false,
        //批发收款单
        showReceivableList: false,
        //欠量统计
        showStatisticsList: false,
        //快速下单
        showQuickOrder: false,
        //信用额度
        showCreditList: false,
        //我的反馈
        showFeedbackList: false,
        //公告栏
        showNoticeBoard: true,
    },
    //头部右侧展示配置
    headerRight:{
        myOrder:true,//我的订单
        myCenter:{//个人中心
            show:true,//是否展示
            pendingOrder:true,//待处理订单
            message:true,//消息
            myFavorite:true,//我的收藏
            myQA:true,//我的问答
            myCoupon:true,//我的优惠券
            afterSalesService:true,//售后服务
        },
        mobileService:true//手机服务
    },
    //以下不需要进config.do, 只是为了后期改方便
    //订单状态
    "orderStatus": {
        'toPay': 1010, //待支付 config.orderStatus.toPay
        'paid': 1020, //已支付 config.orderStatus.paid
        'confirm': 1030, //待确认 config.orderStatus.confirm
        'confirmed': 1031, //已确认 config.orderStatus.confirmed
        'audit': 1040, //待审核 config.orderStatus.audit
        'delivery': 1050, //待发货 config.orderStatus.delivery
        'delivered': 1060, //已发货，待收货 config.orderStatus.delivered
        'received': 1070, //已签收，待评价 config.orderStatus.received
        'completed': 1999, //已完成 config.orderStatus.completed
        'closed': 9000 //已关闭，已取消 config.orderStatus.closed
    },
    //4000待审核,4010审核通过,4020审核不通过,4030待验货,4040验货通过,4041验货不通过,4099已完成,9000已关闭
    "returnStatus": {
        'verify': 4000, //待审核 config.returnStatus.verify
        'verified': 4010, //审核通过 config.returnStatus.verified
        'noPassed': 4020, //审核不通过 config.returnStatus.noPassed
        'inspect': 4030, //待验货 config.returnStatus.inspect
        'passed': 4040, //验货通过 config.returnStatus.passed
        'notApproved': 4041, //验货不通过 config.returnStatus.notApproved
        'completed': 4099, //已完成 config.returnStatus.completed
        'closed': 9000 //已关闭，已取消 config.returnStatus.closed
    },
    //订单类型
    "orderSource": {
        'ordinary': 0, //普通 config.orderSource.ordinary
        'group': 1, //团购 config.orderSource.group
        'inquiry': 2, //询价 config.orderSource.inquiry
        'rental': 3, //租赁 config.orderSource.rental
        'collage': 4, //拼单 config.orderSource.collage
        'trial': 5, //试用 config.orderSource.trial
        'points': 6, //积分 config.orderSource.points
        'scan': 7, //扫码购 config.orderSource.scan
        'collageGroup': 8, //拼团 config.orderSource.collageGroup
        'presell': 9, //预售 config.orderSource.presell
        'gifts': 10, //赠品 config.orderSource.gifts
        'bargains': 11, //砍价 config.orderSource.bargains
        'prizeDraw': 12 //拼团抽奖 config.orderSource.prizeDraw
    },
    //订单大的类型
    "orderType": {
        'general': 0, //普通 config.orderType.general
        'service': 2, //服务订单 config.orderType.service
        'virtualCard': 3, //虚拟卡 config.orderType.virtualCard
        'virtualVouchers': 5 //虚拟券 config.orderType.virtualVouchers
    },
    "promotionChannel": {
        'bank': -99, //银行转账 config.promotionChannel.bank
        'commission': 1000, //佣金 config.promotionChannel.commission
        'giftCard': 1001, //礼金卡 config.promotionChannel.giftCard
        'points': 1002 //积分 config.promotionChannel.points
    }
};
export {superConfig};
