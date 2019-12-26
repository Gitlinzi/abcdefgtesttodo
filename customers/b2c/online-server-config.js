var _path=(__dirname.split('customers')[0]);
module.exports = {
    hostname: "0.0.0.0",
    port: "80",
    logLevel: "debug",
    webPath: _path + "dist/b2c/pc_mall",
    mockPath: _path + "mockdata",
    proxies: {
        "/cms": {
            prefixPath: "/cms",
            host: "106.14.53.98",
            headers: {
                host: "m.laiyifen.com"
            }
        },
        "/api": {
            prefixPath: "/api",
            host: "106.14.53.98",
            headers: {
                host: "m.laiyifen.com"
            }
        },
        "/ouser-web": {
            prefixPath: "/ouser-web",
            host: "106.14.53.98",
            headers: {
                host: "m.laiyifen.com"
            }
        },
        "/opay-web": {
            prefixPath: "/opay-web",
            host: "106.14.53.98",
            headers: {
                host: "m.laiyifen.com"
            }
        },
        "/osc-api": {
            prefixPath: "/osc-api",
            host: "106.14.53.98",
            headers: {
                host: "m.laiyifen.com"
            }
        },
        // "/cms": {
        //     prefixPath: "/cms",
        //     host: "106.14.53.98",
        //     headers: {
        //         host: "m.laiyifen.com"
        //     }
        // },
        // "/admin-web": {
        //     prefixPath: "/admin-web",
        //     host: "106.14.53.98",
        //     headers: {
        //         host: "m.laiyifen.com"
        //     }
        // }
        "/search-backend-web": {
            prefixPath: "/search-backend-web",
            host: "106.14.53.98",
            headers: {
                host: "m.laiyifen.com"
            }
        }
    },
    mocks: {
    }
};
