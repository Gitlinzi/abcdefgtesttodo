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
//菜单不走继承
.factory('switchConfigMenu', ['$rootScope', '$http', function ($rootScope, $http) {
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
                        name: '批发业务单',
                        state: 'index_businessList',
                        show: menuConfig.showBusinessList
                    },
                    {
                        name: '批发收款单',
                        state: 'index_receivables',
                        show: menuConfig.showReceivableList
                    },
                    {
                        name: '欠量统计',
                        state: 'index_statistics',
                        show: menuConfig.showStatisticsList
                    },
                    {
                        name: '快速下单',
                        state: 'index_quickOrder',
                        show: menuConfig.showQuickOrder
                    },
                    {
                        name: '评价晒单',
                        state: 'index_comment',
                        show: menuConfig.showCommentList
                    }
                ]
            },
            {   //我的资产
                title: '资产中心',
                items: [
                    {
                        name: '信用额度',
                        state: 'index_credit',
                        show: menuConfig.showCreditList
                    },
                    {
                        name: '我的优惠券',
                        state: 'index_coupons',
                        show: menuConfig.showCouponsList
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
                    {
                        name: '浏览历史',
                        state: 'index_favoriteStore',
                        show: menuConfig.showFavoriteStore
                    },
                    // {
                    //     name: '意见反馈',
                    //     state: 'index_messageRecord',
                    //     show: true
                    // },
                    {
                        name: '我的反馈',
                        state: 'index_feedback',
                        show: menuConfig.showFeedbackList
                    }
                ]
            },
            {   //我的评价
                title: '客户服务',
                items: [
                    {
                        name:'我的发票',
                        state:'index_bill',
                        show: menuConfig.showBillList
                    }
                ]
            },
            {
                title:'账户设置',
                items:[
                    {
                        name:'个人信息',
                        state:'account_base_info',
                        show: menuConfig.showAccountBaseInfo
                    },
                    {
                        name:'账户安全',
                        state:'account_modify',
                        show: menuConfig.showAccountModify
                    },
                    {
                        name:'收货地址',
                        state:'account_address',
                        show: menuConfig.showAccountAddress
                    },
                    {
                        name: '发票信息',
                        state: 'account_invoice',
                        show: menuConfig.showAccountInvoice
                    },
                ]
            }
        ],
        //个人资料
        accountInfo: [
            {
                title: '账户设置',
                items: [
                    {
                        name:'个人信息',
                        state:'account_base_info',
                        show: menuConfig.showAccountBaseInfo
                    },
                    {
                        name:'账户安全',
                        state:'account_modify',
                        show: menuConfig.showAccountModify
                    },
                    {
                        name:'收货地址',
                        state:'account_address',
                        show: menuConfig.showAccountAddress
                    },
                    {
                        name: '发票信息',
                        state: 'account_invoice',
                        show: menuConfig.showAccountInvoice
                    },
                    {
                        name: '收货人信息',
                        state: 'account_consignee',
                        show: menuConfig.showAccountConsignee
                    },
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
                    }
                ]
            }
        ]
    },
};
return switchConfigMenu;
}])
