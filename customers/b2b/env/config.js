
//#########
//#与company相关的业务相关配置
//##########

import {superConfig} from "../../../core/env/config.base.js";

var config = {
    common: {
        companyProjectType: 'b2b',
        allCartBtnName: '进货单',
        companyName: '晨光',
        bulletinName: '晨光热点',
        companyId: 58,
        defaultIdentityTypeCode: 7,
        //全局的搜索显示icon还是文字的问题
        showSearchIcon: false,
        //是不是显示小能客服
        customerServiceType: 2,
        //上传图片的格式
        uploadingPicFormat:".jpg,.bmp,.png,.jpeg,.gif",
        showUpdateDistributionAddress: false,
        //加入购物车的时候是不是显示包装方式的选择
        showChoosePackingMethod: true,
        //是不是显示所有的页面显示菜单栏
        showAllGlobalNav: true,
        //是否限制库存
        productRestrictedStock: false,
        // 晨光是否跳转到加盟店铺审核状态
        jumpJoinProcessStep : true,
        // 获取未登录的商家信息
        obtionMerchantInfoWhenNoLogin: true,
        //登录后才显示价格, 不登录隐藏价格
        hidePriceWhenNoLogin: true,
        //是否显示中英文切换
        switchoverLanguage:false,
    },
    index : {
        // 首页
        showBottomImg : true, //晨光服务保障广告图
        showCreditData : true, //晨光头部信用额度数据
        showIndexBottomMes : true,//晨光底部公司链接信息
        showIndexBottomImg : true//晨光底部工商局商标信息
    },
    user: {
        // 注册页
        regist : {
            // 晨光跳转到加盟店铺页面
            cgJumpMerchant : true,
            //晨光 是否显示底部logo开关
            showBottomImg : true,
        },
        //登录框
        login: {
            //是否显示工号
            showJobNumber: false,
            //是否显示联合登录
            showUnionLogin: false,
        },
    },
    trade: {
        //收银台的提示信息
        showCashierTheme: '晨光商城',
        settle: {
            // 是否要获取优惠码
            isConcession : false,
            // 晨光确认订单按钮
            showSureOrder : true,
        },
        complete : {
            //支付完成页面是否显示底部图片
            showBottomImage : false
        }
    },
    center: {
        //晨光头部信息展示
        showCgMyHeadMes : true,
        //是否显示手机证验证
        showPhoneVerification: true,
         //收货地址是否显示提示语
        showReceivingAddressTip: true,
        //个人中心首页
        userIndex: {
            //是否显示会员等级，成长值，佣金等等
            showUserGrowUp: false,
        },
        //个人中心头部下拉功能列表配置
        myAccountFunction:{
            accountBind:false,//绑定账号
            accountAuthentication:false//实名认证
        },
        //订单列表
        order: {
            //判断订单来源,订单类型，订单渠道是否显示
            orderType: false,
            orderSysSource: false,
            merchantName:true,//是否展示商家名称
            showLogistics:false,//是否展示物流跟踪
            afterSales:false,//是否展示售后按钮
            confirmGoods:false,//是否展示确认收货按钮
            showConfirmTab:true,//是否展示待确认tab
            noPayShowCancelBtn:false,//未付款状态是否展示取消按钮
            noDeliverShowCancelBtn:false//未发货状态是否展示取消按钮
        },
        //订单详情页面
        orderDetail: {
            //是否显示优惠码
            showPromotionCode: false,
            //是否显示积分
            showIntegral: false,
            //是否显示佣金
            showUsageAmount: false,
            //是否展示电子发票跳转链接
            showInvoiceLink:false
        },
        //用户个人信息
        accountNews: {
            // 个人中心晨光JS控制开关
            cgJsController : true,
            //是否展示客户名称
            showCustomerName : true,
            // 是否展示店主名称
            showMerchantName : true,
            // 是否展示联系电话
            showOtherTelephone : true,
            // 是否展示邮箱
            showEmailNumber : true,
            // 是否展示三级地址
            showThreeAddess : true
        },
        //发票
        bill: {
            //是否显示电子发票图片
            showInvoiceImage:false
        },
    },
    guide: {
        //列表页
        search: {
            //是不是支持显示自营的按钮搜索
            showSelfSupport: false,
            //搜索页显示推荐商品
            searchShowRecommendGood: false,
            //显示促销商品的提示
            showPromotionTip: false,
            //搜索页显示推荐商品
            recommendGoodSearchOptions: {
                pageSize:16,
                showIndex: false,        //显示标签型的index
                showSalesVolume: false,  //显示热销多少件
                showName: true,          //显示商品名
                showPromotion: true,      //显示促销标签,
                type: 'lookandsee',
                size: 4,                 //每次显示几个， 与showHeight有关
                showHeight: 1095,          //因为看了又看显示的标签不一样， 所以设置不同的高度
                addHeight: 50,
                // size: 2,                 //每次显示几个， 与showHeight有关 size: 3,showHeight: 696,
                // showHeight: 464,          //因为看了又看显示的标签不一样， 所以设置不同的高度
                // addHeight: 80,
                domName: 'look-and-see-dom'
            },
        },
        //商品详情
        item: {
            //商品详情导航
            goodNavigation:{
                goodAfterSales:false,//售后服务
                goodConsulting:false,//商品咨询
                goodQuestionAnswer:false//商品问答
            },
            //商品详情页面评价
            comment: {
                //评价按钮的显示
                labelflag: "0,5"
            },
            //商品详情页面是否显示服务商品
            showServiceGoods: false
        },
    },
    menuListConfig: {
        showFavoriteGoods: false,
        showVoucherList: true,
        //账户绑定， 目前没有使用
        showAccountBind: false,
        showBusinessList: true,
        showReceivableList: true,
        showStatisticsList: true,
        showCreditList: true,
        showFeedbackList: true,
    }
};
config = $.extend(true,superConfig, config);
global.config = config;
export {config};
