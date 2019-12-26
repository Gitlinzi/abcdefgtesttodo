var _path=(__dirname.split('customers')[0]);
module.exports = {
    hostname: "0.0.0.0",
    port: "82",
    logLevel: "debug",
    webPath: _path + "dist/b2c/pc_mall",
    mockPath: _path + "mockdata",
    proxies: {
        "/cms": {
            prefixPath: "/cms",
            host: "www.stbvip.cn:80",
            headers: {
                host: "www.stbvip.cn"
            }
        },
        "/rest": {
            prefixPath: "/rest",
            host: "www.stbvip.cn:80",
            headers: {
                host: "www.stbvip.cn"
            }
        },
        "/api": {
            prefixPath: "/api",
            host: "www.stbvip.cn:80",
            headers: {
                host: "www.stbvip.cn"
            }
        },
        "/ouser-web": {
            prefixPath: "/ouser-web",
            host: "www.stbvip.cn:80",
            headers: {
                host: "www.stbvip.cn"
            }
        },
        "/osc-web": {
            prefixPath: "/osc-web",
            host: "www.stbvip.cn:80",
            headers: {
                host: "www.stbvip.cn"
            }
        },
        "/ouser-center": {
            prefixPath: "/ouser-center",
            host: "www.stbvip.cn:80",
            headers: {
                host: "www.stbvip.cn"
            }
        },
        "/opay-web": {
            prefixPath: "/opay-web",
            host: "www.stbvip.cn:80",
            headers: {
                host: "www.stbvip.cn"
            }
        },
        "/osc-api": {
            prefixPath: "/osc-api",
            host: "www.stbvip.cn:80",
            headers: {
                host: "www.stbvip.cn"
            }
        },
        "/back-product-web": {
            prefixPath: "/back-product-web",
            host: "www.stbvip.cn:80",
            headers: {
                host: "www.stbvip.cn"
            }
        },
        "/back-finance-web": {
            prefixPath: "/back-finance-web",
            host: "www.stbvip.cn:80",
            headers: {
                host: "www.stbvip.cn"
            }
        },

        "/search-backend-web": {
            prefixPath: "/search-backend-web",
            host: "www.stbvip.cn:80",
            headers: {
                host: "www.stbvip.cn"
            }
        },
        "/back-cms-web": {
            prefixPath: "/back-cms-web",
            host: "www.stbvip.cn:80",
            headers: {
                host: "www.stbvip.cn"
            }
        },
        "/back-order-web": {
            prefixPath: "/back-order-web",
            host: "www.stbvip.cn:80",
            headers: {
                host: "www.stbvip.cn"
            }
        },
        "/osc-web": {
            prefixPath: "/osc-web",
            host: "www.stbvip.cn:80",
            headers: {
                host: "www.stbvip.cn"
            }
        },
        "/horse-core": {
            prefixPath: "/horse-core",
            host: "www.stbvip.cn:80",
            headers: {
                host: "www.stbvip.cn"
            }
        },
        "/oms-api": {
            prefixPath: "/oms-api",
            host: "www.stbvip.cn:80",
            headers: {
                host: "www.stbvip.cn"
            }
        },
        "/search": {
            prefixPath: "/search",
            host: "www.stbvip.cn:80",
            headers: {
                host: "www.stbvip.cn"
            }
        },
        "/view": {
            prefixPath: "/view",
            host: "www.stbvip.cn:80",
            headers: {
                host: "www.stbvip.cn"
            }
        },
        "/ad-whale-web": {
            prefixPath: "/ad-whale-web",
            host: "www.stbvip.cn:80",
            headers: {
                host: "www.stbvip.cn"
            }
        },
        "/custom-sbd-web": {
            prefixPath: "/custom-sbd-web",
            host: "www.stbvip.cn:80",
            headers: {
                host: "www.stbvip.cn"
            }
        }
    },
    mocks: {
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
