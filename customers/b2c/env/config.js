
//#########
//#与company相关的业务相关配置
//##########

import {superConfig} from "../../../core/env/config.base.js";

var config = {
    common: {
        companyName: '史泰博',
        bulletinName: '史泰博热点',
    },
    trade: {
        //收银台的提示信息
        showCashierTheme: '史泰博',
    },
};
config = $.extend(true,superConfig, config);
global.config = config;
export {config};
