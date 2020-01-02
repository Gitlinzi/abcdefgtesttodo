/**
 * Created by Roy on 17/6/27.
 */
/**
 * 此js用于定义一些常量,_sys一般用于
 */
'use strict';
angular.module("appControllers")
.constant('_proj',{})
.constant('_sys', {
    debugFlag:false,//debug开关, true:打开debug, false:关闭debug
    openSeckill:false, //秒杀功能开关
    cartListVersion:'1.4',//购物车列表接口版本号
})
.constant('_api', {})
.constant('_conf', {})
.constant('config',{
    debugFlag:false,//debug开关, true:打开debug, false:关闭debug
    openSeckill:false, //秒杀功能开关
    cartListVersion:'1.2'//购物车列表接口版本号
})
.constant('allUrlApi', {
    //订单列表
    orderList: "/oms-api/order/query/list",
    orderDetail: "/oms-api/order/so/getOrderDetailByCode",
    validateWarehouseStock: "/oms-api/order/so/validateWarehouseStock",
    orderCancel: "/custom-sbd-web/order/cancelOrder.do ",
    //订单各状态数量
    orderSummary: "/oms-api/order/so/my/summary",
    newOrderMessage: "/oms-api/order/so/newOrderMessage",
    deleteOrder: "/oms-api/order/so/delete",
    confirmReceived: "/oms-api/order/so/confirmReceived"
})
//菜单不走继承
.factory('switchConfigMenu', ['$rootScope','$window', function ($rootScope,$window) {
var menuConfig = config.menuListConfig;
var switchConfigMenu = {
    //个人中心菜单栏
    menuList: {
        //订单中心
        indexHome: [
            {
                title: '订单中心',
                items: [
                    {
                        //之前是我的订单
                        name: '我的订单',
                        state: 'index_orderList({status:0})',
                        show: menuConfig.showOrderList
                    },
                    {
                        name: '审批订单',
                        state: 'index_authorization',
                        show: menuConfig.showAuthorization
                    },
                    {
                        name: '预置订单',
                        state: 'index_advanceOrder',
                        show: menuConfig.showAdvanceOrder
                    },
                    {
                        name: '快速订单',
                        state: 'index_quickOrder2',
                        show: menuConfig.showQuickOrder2
                    },
                    {
                        //之前是常购清单
                        name: '积分兑换记录',
                        state: 'index_favoriteGoods',
                        show: menuConfig.showFavoriteGoods
                    },
                    {
                        name: '渠道会员下单',
                        state:'index_memberChannel',
                        role:[1004],
                        show: menuConfig.showMemberChannel
                    }
                ]
            },
            {
                //我的关注
                title: '关注中心',
                items: [
                    {
                        name: '我的收藏',
                        state: 'index_frequence',
                        show: menuConfig.showFrequenceList
                    },
                    // {
                    //     //之前是售后服务
                    //     name: '评价晒单',
                    //     state: 'index_comment',
                    //     show: menuConfig.showCommentList
                    // },
                    {
                        name: '售后服务',
                        state: 'index_afterSaleStateList',
                        show: menuConfig.showAfterSaleList
                    },
                    {
                        name: '浏览历史',
                        state: 'index_favoriteStore',
                        show: menuConfig.showFavoriteStore
                    }
                ]
            },
            // {   //我的资产
            //     title: '资产中心',
            //     items: [
            //         {
            //             name: '优惠券',
            //             state: 'index_coupons',
            //             show: menuConfig.showCouponsList
            //         },
            //         {
            //             name: '积分',
            //             state: 'index_points',
            //             show: menuConfig.showPointList
            //         },
            //         {
            //             name: '礼品卡',
            //             state:'index_prisentCards',
            //             show: menuConfig.showCommissionList
            //         },
            //         {
            //             name: '奖品',
            //             state: 'index_award',
            //             show: menuConfig.showAwardList
            //         },
            //         {
            //             name: '优惠码',
            //             state: 'index_voucher',
            //             show: menuConfig.showVoucherList
            //         }
            //     ]
            // },
            {
                title: '账户设置',
                items: [
                    {
                        name: '成本中心',
                        href: '/costCenter.html',
                        // state: 'index', //TODO 缺少路由和配置
                        show: menuConfig.showStatement
                    },
                    {
                        name: '个人信息',
                        state: 'account_base_info',
                        show: menuConfig.showAccountBaseInfo
                    },
                    {
                        name: '账户安全',
                        state:'account_modify',
                        show: menuConfig.showAccountModify
                    },
                    {
                        name:'账号绑定',
                        state:'account_bind',
                        show: menuConfig.showAccountBind
                    },
                    {
                        name: '我的会员',
                        state:'account_member',
                        show: menuConfig.showAccountMember
                    },
                    {
                        name: '收货人信息',
                        state: 'account_consignee', 
                        show: menuConfig.showAccountConsignee
                    },
                    {
                        name: '收货地址',
                        state: 'account_address',
                        show: menuConfig.showAccountAddress
                    },{
                        name: '发票信息',
                        state:'account_invoice',
                        show: menuConfig.showAccountInvoiceMessage
                    },
                    {
                        name: '增票资质',
                        state: 'account_invoice',
                        show: menuConfig.showAccountInvoice
                    },
                    {
                        name: '实名认证',
                        state: 'account_authentication',
                        show: menuConfig.showAccountAuthentication
                    },
                    {
                        name: '我的发票',
                        state:'index_bill',
                        show: menuConfig.showBillList
                    },
                    {
                        name: '公告栏',
                        state:'account_noticeBoard',
                        show: menuConfig.showStatement
                    }
                ]
            },
            {
                title: '报表中心',
                items: [
                    {
                        name: '按商品统计',
                        state:'index_statement',
                        show: menuConfig.showStateMent
                    },
                    {
                        name: '按商品分类统计',
                        state:'index_statementCategory',
                        show: menuConfig.showStateMentCategory
                    },
                    {
                        name: '采购数据-按目录',
                        state:'index_statementPurchaseCategory',
                        show: menuConfig.showStatementPurchaseCategory
                    },
                    {
                        name: '采购数据-按商品',
                        state:'index_statementPurchaseProduct',
                        show: menuConfig.showStatementPurchaseProduct
                    },
                    {
                        name: '搜索失败词统计',
                        state:'index_statementFailWord',
                        show: menuConfig.showStatementFailWord
                    },
                    {
                        name: '采购额天表',
                        state:'index_statementPurchaseDay',
                        show: menuConfig.showStatementPurchaseDay
                    },
                    {
                        name: '采购额月表',
                        state:'index_statementPurchaseMonth',
                        show: menuConfig.showStatementPurchaseMonth
                    },
                    {
                        name: '采购额成本中心报表',
                        state:'index_statementPurchaseCost',
                        show: menuConfig.showStatementPurchaseCost
                    },
                    {
                        name: '账号订单明细表',
                        state:'index_statementOrderDetail',
                        show: menuConfig.showStatementOrderDetail
                    },
                    {
                        name: '账号剩余额度表',
                        state:'index_statementAccountPoint',
                        show: menuConfig.showStatementAccountPoint
                    },
                ]
            },
            // {   //我的评价
            //     title: '客户服务',
            //     items: [
            //         {
            //             name: '售后服务',
            //             state: 'index_afterSaleStateList',
            //             show: menuConfig.showAfterSaleList
            //         },
            //         {
            //             name: '维修服务',
            //             state: 'index_saleRepair',
            //             show: menuConfig.showSaleRepairList
            //         },
            //         {
            //             name: '我的问答',
            //             state:'index_questionList',
            //             show: menuConfig.showQuestionList
            //         },
            //         {
            //             name: '购买咨询',
            //             state:'index_consultList',
            //             show: menuConfig.showConsultList
            //         }
            //     ]
            // }
        ],
        //个人资料
        accountInfo: [
            {
                title: '账户设置',
                items: [
                    {
                        name: '个人信息',
                        state: 'account_base_info',
                        show: menuConfig.showAccountBaseInfo
                    },
                    {
                        name: '账户安全',
                        state:'account_modify',
                        show: menuConfig.showAccountModify
                    },
                    {
                        name:'账号绑定',
                        state:'account_bind',
                        show: menuConfig.showAccountBind
                    },
                    {
                        name: '我的会员',
                        state:'account_member',
                        show: menuConfig.showAccountMember
                    },
                    {
                        name: '收货地址',
                        state: 'account_address',
                        show: menuConfig.showAccountAddress
                    },
                    {
                        name: '收货人信息',
                        state: 'account_consignee',
                        show: menuConfig.showAccountConsignee
                    },{
                        name: '发票信息',
                        state:'account_invoice',
                        show: menuConfig.showAccountInvoiceMessage
                    },
                    {
                        name: '实名认证',
                        state: 'account_authentication',
                        show: menuConfig.showAccountAuthentication
                    },
                    {
                        name: '公告栏',
                        state:'account_noticeBoard',
                        show: menuConfig.showNoticeBoard
                    }
                ]
            }
        ],
        //消息
        messageInfo: [
            {
                title: '消息中心',
                items: [
                    {
                        name: '消息',
                        state: 'message',
                        show: menuConfig.showMessageList
                    },
                    {
                        name: '活动消息',
                        state: 'message_act',
                        show: menuConfig.showActMessageList
                    },
                    {
                        name: '系统消息',
                        state: 'message_sys',
                        show: menuConfig.showSysMessageList
                    }
                ]
            }
        ]
    }
};
return switchConfigMenu;
}])
