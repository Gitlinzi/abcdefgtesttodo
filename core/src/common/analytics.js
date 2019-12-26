/**
 * 这个js中全部放跟业务不相关的代码
 * 比如百度客服，跟踪云，百度统计等
 * 其中defer是指异步加载，不阻塞页面加载，但是要等到其他（之前的）js脚本执行完完才执行
 * async也是异步加载，不阻塞页面加载，但是是乱序的，自己加载完就执行
 * 无依赖的代码推荐使用async
 * env中config添加开关配置
 */


import {config} from "../../env/config.js";

import {heimdall} from "./heimdall.js";
try{
    if(config && config.analysis){
        for(var an in config.analysis){
            if(config.analysis.hasOwnProperty(an)){
                if(config.analysis[an]){
                    //TODOS: 这里不应该有兼容heimdall的分支
                    if(an == 'heimdall'){
                        heimdall();
                    }else{
                        eval('('+an+'())');
                    }
                }
            }
        }
    }
}catch(err){
    //console.log(err);
}


//百度推广
function baiduHm(){
    var _hmt = _hmt || [];
    (function() {
      var hm = document.createElement("script");
      hm.async = true;
      hm.src = "https://hm.baidu.com/hm.js?d65484c68f2560904c38f4202eb05568";
      var s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(hm, s);
    })();
}

