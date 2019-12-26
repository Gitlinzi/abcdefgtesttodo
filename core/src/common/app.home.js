angular.module("appControllers")
.constant('routers', [
    { //首页
        state: 'index',
        url: "/",
        templateUrl: "index.template.html",
        controller: "homeIndexCtrl",
        controllerAs:'ind',
        menu: 'indexHome',
        isShowMenu: true
    }, { //账户
        state: 'account',
        url: "/account",
        templateUrl: "account.template.html",
        controller: "accountCtrl",
        controllerAs:'act',
        menu: 'accountInfo',
        isShowMenu: true
    }, {  //订单列表
        state: 'index_orderList',
        url: "/orderList?activeNum",
        templateUrl: "index-order-list.template.html",
        controller: "orderCtrl",
        controllerAs:'orl',
        menu: 'indexHome',
        isShowMenu: true
    }, { //订单详情, code是订单号
        state: 'index_orderDetail',
        url: "/orderDetail?code",
        templateUrl: "index-order-detail.template.html",
        controller: "orderDetailCtrl",
        controllerAs:'orl',
        menu: 'indexHome',
        isShowMenu: false
    }, { //交货单列表页面
        state: 'index_deliveryOrderDetail',
        url: "/deliveryOrderList?code",
        templateUrl: "index-delivery-order-list.template.html",
        controller: "deliveryOrderCtrl",
        controllerAs:'cmt',
        menu: 'indexHome',
        isShowMenu: true
    },{ //常购清单
        state: 'index_oftenBuy',
        url: "/oftenBuy",
        templateUrl: "often-buy.template.html",
        controller: "oftenBuyCtrl",
        controllerAs:'orl',
        menu: 'indexHome',
        isShowMenu: true
    }, { // 补购订单 code是订单号
        state: 'index_orderSubsidy',
        url: "/orderSusidy?code",
        templateUrl:"index-order-subsidy.template.html",
        controller:"orderSubsidyCtrl",
        controllerAs:"orl",
        menu: 'indexHome',
        isShowMenu: true
    }, { // 补购配件 code是订单号
        state: 'index_orderSubparts',
        url: "/orderSubparts?code",
        templateUrl: "index-order-subparts.template.html",
        controller: "orderSubpartsCtrl",
        controllerAs: "orl",
        menu: 'indexHome',
        isShowMenu: true
    }, { //渠道会员下单
        state: "index_memberChannel",
        url: "/memeberChannel",
        templateUrl: "index-member-channel.template.html",
        controller: "memeberCtrl",
        controllerAs:'orl',
        menu: 'indexHome',
        isShowMenu: true
    }, { //售后记录
        state: "index_afterSaleStateList",
        url: "/afterSaleStateList",
        templateUrl: "index-after-sale-prog-list.template.html",
        controller: "afterSaleCtrl",
        controllerAs:'orl',
        params:{afterSaleProgList : 1},
        menu: 'indexHome',
        isShowMenu: true
    }, { //售后申请
        state: "index_afterSaleApply",
        url: "/afterSaleApply?applyAfterSale&code&orderAfterSalesId&mpId&length",
        templateUrl: "index-after-sale-apply.template.html",
        controller: "afterSaleCtrl",
        controllerAs:'orl',
        menu: 'indexHome',
        isShowMenu: false
    },{ //售后申请
        state: "index_afterSaleApply_new",
        url: "/afterSaleApplyNew?applyAfterSale&code&orderAfterSalesId&mpId&length",
        templateUrl: "index-after-sale-apply-new.template.html",
        controller: "afterSaleNewCtrl",
        controllerAs:'orl',
        menu: 'indexHome',
        isShowMenu: false
    }, { //修改售后申请
        state: "index_afterSaleApply_new_modify",
        url: "/afterSaleApplyNewModify?applyAfterSale&code&orderAfterSalesId&mpId",
        templateUrl: "index-after-sale-apply-new-modify.template.html",
        controller: "afterSaleCtrl",
        controllerAs:'orl',
        menu: 'indexHome',
        isShowMenu: false
    }, { //售后详情
        state: "index_afterSaleDetail",
        url: "/afterSaleDetail?afterSaleDetail&id",
        templateUrl: "index-after-sale-detail.template.html",
        controller: "afterSaleCtrl",
        controllerAs:'orl',
        menu: 'indexHome',
        isShowMenu: false
    }, { //售后咨询,意见建议
        state: "index_afterSaleConsult",
        url: "/afterSaleConsult?afterSaleConsult&id",
        templateUrl: "index-after-sale-consult.template.html",
        controller: "afterSaleConsultCtrl",
        controllerAs:'orl',
        menu: 'indexHome',
        isShowMenu: false
    }, { //维修服务
        state: "index_saleRepair",
        url: "/saleRepair",
        templateUrl: "sale-repair.template.html",
        controller: "saleRepairCtrl",
        controllerAs:'sre',
        menu: 'indexHome',
        isShowMenu: true
    }, { //维修进度
        state: "index_saleRepairProgList",
        url: "/saleRepairProgList",
        templateUrl: "sale-repair-prog.template.html",
        controller: "saleRepairProgCtrl",
        controllerAs:'sre',
        menu: 'indexHome',
        isShowMenu: true
    }, { //维修服务-申请维修
        state: "index_applyRepair",
        url: "/applyRepair?code",
        templateUrl: "apply-repair.template.html",
        controller: "applyRepairCtrl",
        controllerAs:'sre',
        menu: 'indexHome',
        isShowMenu: false
    }, { //维修服务-详情
        state: "index_applyRepairDetail",
        url: "/applyRepairDetail?returnId",
        templateUrl: "apply-repair-detail.template.html",
        controller: "applyRepairDetailCtrl",
        controllerAs:'sre',
        menu: 'indexHome',
        isShowMenu: false
    }, { //维修服务-修改
        state: "index_applyRepairUpdate",
        url: "/applyRepairUpdate?returnId",
        templateUrl: "apply-repair-update.template.html",
        controller: "applyRepairCtrl",
        controllerAs:'sre',
        menu: 'indexHome',
        isShowMenu: true
    }, { //购买咨询
        state: "index_consultList",
        url: "/consultList",
        templateUrl: "index-consult-list.template.html",
        controller: "consultCtrl",
        controllerAs:'orl',
        menu: 'indexHome',
        isShowMenu: true
    }, { //我的问答
        state: "index_questionList",
        url: "/questionList",
        templateUrl: "index-question-list.template.html",
        controller: "questionCtrl",
        controllerAs:'orl',
        menu: 'indexHome',
        isShowMenu: true
    }, { //查看回答
        state: "index_questionDetail",
        url: "/questionDetail",
        templateUrl: "index-question-detail.template.html",
        controller: "questionDetailCtrl",
        controllerAs:'orl',
        menu: 'indexHome',
        isShowMenu: true
    }, { //问答
        state: "index_questionAnswer",
        url: "/questionAnswer?consultItemId&flag",
        templateUrl: "index-question-answer.template.html",
        controller: "questionAnswerCtrl",
        controllerAs:'orl',
        menu: 'indexHome',
        isShowMenu: false
    }, { //我的发票
        state: "index_bill",
        url: "/bill",
        templateUrl: "index-bill.template.html",
        controller: "billCtrl",
        controllerAs:'orl',
        menu: 'indexHome',
        isShowMenu: true
    },{ //报表中心
        state: "index_statement",
        url: "/statementGoods",
        templateUrl: "index-statement-goods.template.html",
        controller: "indexStatementGoodsCtrl",
        controllerAs:'orl',
        menu: 'indexHome',
        isShowMenu: true
    },{ //报表中心(分类)
        state: "index_statementCategory",
        url: "/statementCategory",
        templateUrl: "index-statement-category.template.html",
        controller: "indexStatementCategoryCtrl",
        controllerAs:'orl',
        menu: 'indexHome',
        isShowMenu: true
    }, { //发票详情
        state: "index_billList",
        url: "/billList?orderCode",
        templateUrl: "index-bill-detail.template.html",
        controller: "billDetailCtrl",
        controllerAs:'orl',
        menu: 'indexHome',
        isShowMenu: true
    }, { //我的收藏
        state: "index_frequence",
        url: "/frequence",
        templateUrl: "index-order-frequence.template.html",
        controller: "frequenceCtrl",
        controllerAs:'fre',
        menu: 'indexHome',
        isShowMenu: true
    }, { //关注的商品
        state: "index_favoriteGoods",
        url: "/favoriteGoods",
        templateUrl: "index-favorite-goods.template.html",
        controller: "favoriteGoodsCtrl",
        controllerAs:'fgd',
        menu: 'indexHome',
        isShowMenu: true
    }, { //浏览历史
        state: "index_favoriteStore",
        url: "/favoriteStore",
        templateUrl: "index-favorite-store.template.html",
        controller: "favoriteStoreCtrl",
        controllerAs:'fst',
        menu: 'indexHome',
        isShowMenu: true
    }, { //我的足迹
        state: "index_track",
        url: "/track",
        templateUrl: "orderList.template.html",
        controller: "orderListCtrl",
        controllerAs:'orl',
        menu: 'indexHome',
        isShowMenu: true
    }, { //悠点卡
        state: "index_UCart",
        url: "/UCart",
        templateUrl: "UCart.template.html",
        controller: "uCartCtrl",
        controllerAs:'urk',
        menu: 'indexHome',
        isShowMenu: true
    }, { //伊点卡
        state: "index_ECart",
        url: "/ECart",
        templateUrl: "ECart.template.html",
        controller: "eCartCtrl",
        controllerAs:'ect',
        menu: 'indexHome',
        isShowMenu: true
    }, { //优惠券
        state: "index_coupons",
        url: "/coupons",
        templateUrl: "index-property-coupons.template.html",
        controller: "couponsCtrl",
        controllerAs:'cpn',
        menu: 'indexHome',
        isShowMenu: true
    }, { //提货券
        state: "index_voucher",
        url: "/voucher",
        templateUrl: "voucher.template.html",
        controller: "voucherCtrl",
        controllerAs:'vch',
        menu: 'indexHome',
        isShowMenu: true
    }, { //积分
        state: "index_points",
        url: "/points",
        templateUrl: "index-property-points.template.html",
        controller: "pointsCtrl",
        controllerAs:'pnt',
        menu: 'indexHome',
        isShowMenu: true
    }, {
        state: "index_prisentCards",
        url: "/prisentCards",
        templateUrl: "index-pricent-cards.template.html",
        controller: "pricentCardsCtrl",
        controllerAs:'pnt',
        menu: 'indexHome',
        isShowMenu: true
    },
    { //伊豆
        state: "index_commission",
        url: "/commission",
        templateUrl: "index_commission.template.html",
        controller: "commissionCtrl",
        controllerAs:'commission',
        menu: 'indexHome',
        isShowMenu: true
    }, { //奖品
        state: "index_award",
        url: "/award",
        templateUrl: "award.template.html",
        controller: "awardCtrl",
        controllerAs:'awd',
        menu: 'indexHome',
        isShowMenu: true
    }, { //领取奖品
        state: "index_receiveAward",
        url:"/receiveAward?picUrl&awardsName&recordId",
        templateUrl: "receive-award.template.html",
        controller: "receiveAwardCtrl",
        controllerAs:"awd",
        params:{"picUrl" : null,"awardsName" : null , "recordId" : null},
        menu: 'indexHome',
        isShowMenu: true
    }, { //我的评价
        state: "index_comment",
        url: "/comment",
        templateUrl: "index-comment.template.html",
        controller: "commentCtrl",
        controllerAs:'cmt',
        menu: 'indexHome',
        isShowMenu: true
    }, {//评价
        state: "index_go_comment",
        url:"/goComment?code",
        templateUrl:"index-go-comment.template.html",
        controller:"goCommentCtrl",
        cotrollerAs:"cmt",
        menu: 'indexHome',
        isShowMenu: false
    }, {//追评
        state: "index_chase_comment",
        url:"/chaseComment?code&mpId&soItemId",
        templateUrl:"index-chase-comment.template.html",
        controller:"chaseCommentCtrl",
        controllerAs:"cmt",
        menu: 'indexHome',
        isShowMenu: false
    }, {//查看评价详情
        state: "index_look_comment",
        url:"/lookComment?code&mpId&isOrder",
        templateUrl:"index-look-comment.template.html",
        controller:"lookCommentCtrl",
        controllerAs:"cmt",
        menu: 'indexHome',
        isShowMenu: false
    }, { //基本信息
        state: "account_base_info",
        url: "/baseInfo",
        templateUrl: "account-baseinfo.template.html",
        controller: "baseInfoCtrl",
        controllerAs:'bif',
        menu: 'accountInfo',
        isShowMenu: true
    }, { //收货地址管理
        state: "account_address",
        url: "/address",
        templateUrl: "account-address.template.html",
        controller: "addressCtrl",
        controllerAs:'ads',
        menu: 'accountInfo',
        isShowMenu: true
    }, { //收货人信息管理
        state: "account_consignee",
        url: "/consignee",
        templateUrl: "account-consignee.template.html",
        controller: "consigneeCtrl",
        controllerAs:'csi',
        menu: 'accountInfo',
        isShowMenu: true
    }, { //发票信息
        state: "account_invoice",
        url: "/invoice",
        templateUrl: "account-invoice.template.html",
        controller: "invoiceCtrl",
        controllerAs:'inv',
        menu: 'accountInfo',
        isShowMenu: true
    }, { //我的会员
        state: "account_member",
        url: "/member",
        templateUrl: "account-member.template.html",
        controller: "memberCtrl",
        controllerAs:'member',
        menu: 'accountInfo',
        isShowMenu: true
    }, { //实名认证
        state: "account_authentication",
        url: "/authentication",
        templateUrl: "account-authentication.template.html",
        controller: "authenticationCtrl",
        controllerAs:'aut',
        menu: 'accountInfo',
        isShowMenu: true
    }, { //修改登录密码
        state: "account_modify",
        url: "/modify",
        templateUrl: "account-modify.template.html",
        controller: "modifyCtrl",
        controllerAs:'orl',
        menu: 'accountInfo',
        isShowMenu: true
    }, { //绑定账号
        state: "account_bind",
        url: "/bind",
        templateUrl: "account-bind.template.html",
        controller: "bindCtrl",
        controllerAs:'bnd',
        menu: 'accountInfo',
        isShowMenu: true
    }, {  //消息
        state: 'message',
        url: "/message",
        templateUrl: "message.template.html",
        controller: "messageCtrl",
        controllerAs:'msg',
        menu: 'messageInfo',
        isShowMenu: true
    }, { //系统消息
        state: "message_sys",
        url: "/sysMsg",
        templateUrl: "systeamMessage.template.html",
        controller: "systeamMessageCtrl",
        controllerAs:'sys',
        menu: 'messageInfo',
        isShowMenu: true
    }, { //活动消息
        state: "message_act",
        url: "/actMsg",
        templateUrl: "activeMessage.template.html",
        controller: "activeMessageCtrl",
        controllerAs:'orl',
        menu: 'messageInfo',
        isShowMenu: true
    }, { //批发业务单
        state: "index_businessList",
        url: "/businessList",
        templateUrl: "businessList.template.html",
        controller: "businessListCtrl",
        controllerAs:'orl',
        menu: 'indexHome',
        isShowMenu: true
    }, { //批发业务单详情
        state: "index_businessDetail",
        url: "/businessDetail?pfBillNo",
        templateUrl: "businessDetail.template.html",
        controller: "businessDetailCtrl",
        controllerAs:'orl',
        menu: 'indexHome',
        isShowMenu: true
    }, { //批发收款单
        state: "index_receivables",
        url: "/receivables",
        templateUrl: "receivables.template.html",
        controller: "receivablesCtrl",
        controllerAs:'orl',
        menu: 'indexHome',
        isShowMenu: true
    }, { //批发收款单详情
        state: "index_receivablesDetail",
        url: "/receivableDetail?pfBillNo",
        templateUrl: "receivableDetail.template.html",
        controller: "receivableDetailCtrl",
        controllerAs:'orl',
        menu: 'indexHome',
        isShowMenu: true
    }, { //欠量统计
        state: "index_statistics",
        url: "/indexStatistics",
        templateUrl: "indexStatistics.template.html",
        controller: "indexStatisticsCtrl",
        controllerAs:'orl',
        menu: 'indexHome',
        isShowMenu: true
    }, { //信用额度
        state: "index_credit",
        url: "/indexCredit",
        templateUrl: "indexCredit.template.html",
        controller: "indexCreditCtrl",
        controllerAs:'orl',
        menu: 'indexHome',
        isShowMenu: true
    }, { //商品意见反馈
        state: "index_messageRecord",
        url: "/messageRecord",
        templateUrl: "messageRecord.template.html",
        controller: "messageRecordCtrl",
        controllerAs:'orl',
        menu: 'indexHome',
        isShowMenu: true
    }, { //意见反馈
        state: "index_feedback",
        url: "/feedback",
        templateUrl: "feedback.template.html",
        controller: "feedbackCtrl",
        controllerAs:'orl',
        menu: 'indexHome',
        isShowMenu: true
    }, { //快速下单
        state: "index_quickOrder",
        url: "/quickOrder",
        templateUrl: "quickOrder.template.html",
        controller: "quickOrderCtrl",
        controllerAs:'qo',
        menu: 'indexHome',
        isShowMenu: true
    },{  //预置订单
        state: 'index_advanceOrder',
        url: "/advanceOrder",
        templateUrl: "index-order-advance.template.html",
        controller: "advanceOrderCtrl",
        controllerAs:'orl',
        menu: 'indexHome',
        isShowMenu: true
    },{ //快速订单
        state: "index_quickOrder2",
        url: "/quickOrder2",
        templateUrl: "index-order-quick2.template.html",
        controller: "quickOrder2Ctrl",
        controllerAs:'orl',
        menu: 'indexHome',
        isShowMenu: true
    },{ //预置订单创建
        state: 'index_advanceCreateOrder',
        url: "/advanceCreateOrder",
        templateUrl: "index-order-advanceCreate.template.html",
        controller: "advanceCreateOrderCtrl",
        controllerAs:'orl',
        menu: 'indexHome',
        isShowMenu: true
    },{ //预置订单详情
        state: 'index_advanceDetailOrder',
        url: "/advanceDetailOrder?id",
        templateUrl: "index-order-advanceDetail.template.html",
        controller: "advanceDetailOrderCtrl",
        controllerAs:'orl',
        menu: 'indexHome',
        isShowMenu: true
    },{ //公告栏
        state: "account_noticeBoard",
        url: "/noticeBoard",
        templateUrl: "account-noticeBoard.template.html",
        controller: "noticeBoardCtrl",
        controllerAs:'nob',
        menu: 'indexHome',
        isShowMenu: true
    },{ //审批单
        state: "index_authorization",
        url: "/authorization",
        templateUrl: "index_authorization.template.html",
        controller: "authorizationCtrl",
        controllerAs:'orl',
        menu: 'indexHome',
        isShowMenu: true
    },{ //采购报表-按类目
        state: "index_statementPurchaseCategory",
        url: "/statementPurchaseCategory",
        templateUrl: "index-statement-purchase-category.template.html",
        controller: "indexStatementPurchaseCategoryCtrl",
        controllerAs:'orl',
        menu: 'indexHome',
        isShowMenu: true
    },{ //采购报表-按商品
        state: "index_statementPurchaseProduct",
        url: "/statementPurchaseProduct",
        templateUrl: "index-statement-purchase-product.template.html",
        controller: "indexStatementPurchaseProductCtrl",
        controllerAs:'orl',
        menu: 'indexHome',
        isShowMenu: true
    },{ //搜索失败词统计
        state: "index_statementFailWord",
        url: "/statementFailWord",
        templateUrl: "index-statement-fail-word.template.html",
        controller: "indexStatementFailWordCtrl",
        controllerAs:'orl',
        menu: 'indexHome',
        isShowMenu: true
    },{ //采购额天表
        state: "index_statementPurchaseDay",
        url: "/statementPurchaseDay",
        templateUrl: "index-statement-purchase-day.template.html",
        controller: "indexStatementPurchaseDayCtrl",
        controllerAs:'orl',
        menu: 'indexHome',
        isShowMenu: true
    },{ //采购额月表
        state: "index_statementPurchaseMonth",
        url: "/statementPurchaseMonth",
        templateUrl: "index-statement-purchase-month.template.html",
        controller: "indexStatementPurchaseMonthCtrl",
        controllerAs:'orl',
        menu: 'indexHome',
        isShowMenu: true
    },{ //采购额成本中心报表
        state: "index_statementPurchaseCost",
        url: "/index_statementPurchaseCost",
        templateUrl: "index-statement-purchase-cost.template.html",
        controller: "indexStatementPurchaseCostCtrl",
        controllerAs:'orl',
        menu: 'indexHome',
        isShowMenu: true
    },{ //账号订单明细表
        state: "index_statementOrderDetail",
        url: "/index_statementOrderDetail",
        templateUrl: "index-statement-order-detail.template.html",
        controller: "indexStatementOrderDetailCtrl",
        controllerAs:'orl',
        menu: 'indexHome',
        isShowMenu: true
    },{ //账号剩余额度表
        state: "index_statementAccountPoint",
        url: "/index_statementAccountPoint",
        templateUrl: "index-statement-account-point.template.html",
        controller: "indexStatementAccountPointCtrl",
        controllerAs:'orl',
        menu: 'indexHome',
        isShowMenu: true
    }


]);
