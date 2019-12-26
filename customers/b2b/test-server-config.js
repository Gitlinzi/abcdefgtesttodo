var _path = (__dirname.split('customers')[0]);
module.exports = {
    hostname: "0.0.0.0",
    port: "80",
    logLevel: "debug",
    webPath: _path + "dist/b2b/pc_b2b",
    mockPath: _path + "mockdata",
    proxies: {
        "/cms": {
            prefixPath: "/cms",
            host: "192.168.9.230",
            headers: {
                host: "pc.test.op.com"
            }
        },
        "/rest": {
            prefixPath: "/rest",
            host: "192.168.9.230",
            headers: {
                host: "pc.test.op.com"
            }
        },
        "/api": {
            prefixPath: "/api",
            host: "192.168.9.230",
            headers: {
                host: "pc.test.op.com"
            }
        },
        "/ouser-web": {
            prefixPath: "/ouser-web",
            host: "192.168.9.230",
            headers: {
                host: "pc.test.op.com"
            }
        },
        "/ouser-center": {
            prefixPath: "/ouser-center",
            host: "192.168.9.230",
            headers: {
                host: "pc.test.op.com"
            }
        },
        "/opay-web": {
            prefixPath: "/opay-web",
            host: "192.168.9.230",
            headers: {
                host: "pc.test.op.com"
            }
        },
        "/osc-api": {
            prefixPath: "/osc-api",
            host: "192.168.9.230",
            headers: {
                host: "pc.test.op.com"
            }
        },
        "/back-product-web": {
            prefixPath: "/back-product-web",
            host: "192.168.9.230",
            headers: {
                host: "pc.test.op.com"
            }
        },
        "/back-finance-web": {
            prefixPath: "/back-finance-web",
            host: "192.168.9.230",
            headers: {
                host: "pc.test.op.com"
            }
        },

        "/search-backend-web": {
            prefixPath: "/search-backend-web",
            host: "192.168.9.230",
            headers: {
                host: "pc.test.op.com"
            }
        },
        "/back-cms-web": {
            prefixPath: "/back-cms-web",
            host: "192.168.9.230",
            headers: {
                host: "pc.test.op.com"
            }
        },
        "/back-order-web": {
            prefixPath: "/back-order-web",
            host: "192.168.9.230",
            headers: {
                host: "pc.test.op.com"
            }
        },
    },
    mocks: {
        // '/api/my/foot/list': 'footList.json',
        // '/api/my/favorite/goods': 'favoriteGoods.json',
        // '/api/my/favorite/clear': 'clear.json',
        // '/api/my/order/list': {
        //     'post': 'orderList.json'
        // },
        // '/api/my/orderAfterSale/afterSaleList': {
        //     'post': 'afterSaleList.json'
        // },
        // '/api/my/orderAfterSale/initReturnProduct': {
        //     'post': 'initReturnProduct.json'
        // },
        // '/api/read/product/recommendProductList':'recommendProductList.json',
        // '/api/my/coupon': {
        //     'post': 'coupon.json'
        // },
        // '/api/my/point/list': {
        //     'post': 'pointList.json'
        // },
        // '/api/my/point/account': {
        //     'post': 'pointAccount.json'
        // },
        // '/api/promotion/lottery/winningRecords': 'winningRecords.json',
        //
        // '/ouser-web/address/getAllAddressForm':{
        //     'post': 'allAddres.json'
        // },
        // '/api/my/order/summary':{
        //     'post':'orderSummary.json'
        // },
        // '/api/my/order/detail':{
        //     'post':'orderDetail.json'
        // },
        // '/api/promotion/referralCode/receive':{
        //   'post':'result.json'
        // },
        // '/api/my/orderAfterSale/afterSaleType':{
        //   'post':'afterSaleType.json'
        // },
        // '/api/my/orderAfterSale/afterSaleCauseList':{
        //     'post':'afterSaleCauseList.json'
        // },
        // '/api/my/orderAfterSale/afterSaleProduct':{
        //     'post':'afterSaleProduct.json'
        // },
        // '/back-product-web/consultAppAction/getMerchantProductList':{
        //     'post':'serviceGoods.json'
        // },
        // '/back-finance-web/api/commission/queryCommissionIncomeDetail.do':{
        //     'post':'edouList.json'
        // },
        // '/back-finance-web/api/commission/queryCommissionAccount.do':{
        //   'post':'edouAccount.json'
        // },
        // '/realTime/getPriceStockList':'priceStock.json',
        // '/api/product/spec':'productSpec.json',
        // '/api/product/groupsInfo':'productGroupsInfo.json',
        // '/api/product/promotionInfo':'productPromotionInfo.json',
        // '/api/payment/list':'paymentList.json',
        // '/api/social/mpComment/get':'mpCommentGet.json',
        // '/api/my/favorite/checkFavorite':'checkFavorite.json',
        // '/api/read/product/recommendProductList':'recommendProductList.json',
        // '/api/product/serialProducts':'productSerialProducts.json'
        //'/api/search/searchList':"searchList.json"
        // '/api/social/my/comment/init':'evaluateGoods.json',
        // '/api/my/orderAfterSale/afterSaleDetails':{
        //     'post':'afterSaleDetails.json'
        // }
        // '/back-order-web/restful/afterSales/queryReturnReason.do': {
        //     'post': 'repairReason.json'
        // },
        // '/back-order-web/restful/afterSales/queryApplyMaintainGoodsInfo.do': {
        //     'post': 'repairOrderInit.json'
        // },
        // '/back-order-web/restful/afterSales/queryMaintainOrderInfo.do':{
        //     'post': 'repairOrderDetail.json'
        // }
        '/social-web/trialActivity/trialActivityMpList.do':'trialActivityMpList.json',
        '/social-back-web/trialReportRead/trialReportList.do':{
            'post':'trialReportList.json'
        },
        '/social-back-web/trialApplicedRead/queryTrialApplicedList.do':{
            'post':'myTrialApplicedList.json'
        },
        '/social-web/trialActivityRead/trialMpInfo.do':'trialMpInfo.json',
        '/social-back-web/trialReportRead/trialReportInfo.do':'trialReportInfo.json'
    }
};
