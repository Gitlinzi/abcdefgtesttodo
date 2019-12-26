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
            host: "192.168.20.176",
            headers: {
                host: "mall.dev.cg.com"
            }
        },
        "/rest": {
            prefixPath: "/rest",
            host: "192.168.20.176",
            headers: {
                host: "mall.dev.cg.com"
            }
        },
        "/api": {
            prefixPath: "/api",
            host: "192.168.20.176",
            headers: {
                host: "mall.dev.cg.com"
            }
        },
        "/ouser-web": {
            prefixPath: "/ouser-web",
            host: "192.168.20.176",
            headers: {
                host: "mall.dev.cg.com"
            }
        },
        "/osc-web": {
            prefixPath: "/osc-web",
            host: "192.168.20.176",
            headers: {
                host: "mall.dev.cg.com"
            }
        },
        "/ouser-center": {
            prefixPath: "/ouser-center",
            host: "192.168.20.176",
            headers: {
                host: "mall.dev.cg.com"
            }
        },
        "/opay-web": {
            prefixPath: "/opay-web",
            host: "192.168.20.176",
            headers: {
                host: "mall.dev.cg.com"
            }
        },
        "/osc-api": {
            prefixPath: "/osc-api",
            host: "192.168.20.176",
            headers: {
                host: "mall.dev.cg.com"
            }
        },
        "/back-product-web": {
            prefixPath: "/back-product-web",
            host: "192.168.20.176",
            headers: {
                host: "mall.dev.cg.com"
            }
        },
        "/back-product-web2": {
            prefixPath: "/back-product-web2",
            host: "192.168.20.176",
            headers: {
                host: "mall.dev.cg.com"
            }
        },
        "/back-finance-web": {
            prefixPath: "/back-finance-web",
            host: "192.168.20.176",
            headers: {
                host: "mall.dev.cg.com"
            }
        },
        "/finance-plugin-web": {
            prefixPath: "/back-finance-web",
            host: "192.168.20.176",
            headers: {
                host: "mall.dev.cg.com"
            }
        },
        "/search-backend-web": {
            prefixPath: "/search-backend-web",
            host: "192.168.20.176",
            headers: {
                host: "mall.dev.cg.com"
            }
        },
        "/back-merchant-web": {
            prefixPath: "/back-merchant-web",
            host: "192.168.20.176",
            headers: {
                host: "mall.dev.cg.com"
            }
        },
        "/back-cms-web": {
            prefixPath: "/back-cms-web",
            host: "192.168.20.176",
            headers: {
                host: "mall.dev.cg.com"
            }
        },
        "/back-order-web": {
            prefixPath: "/back-order-web",
            host: "192.168.20.176",
            headers: {
                host: "mall.dev.cg.com"
            }
        },
    },
    mocks: {}
};
