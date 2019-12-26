function heimdallPageLoad(params){
    var vds,s = document.getElementsByTagName('script')[0];
    window._heimdall.appKey ='${heimdall_appKey}';
    window._heimdall.appSecret = '${heimdall_appSecret}';
    window._heimdall.productLine = '${heimdall_productLine}'; //产品线id
    window._heimdall_config_serverhost = '';
    window._heimdall.fs = '';
    window._heimdall.ut = (document.cookie.match(/;\s*ut=(\w+);/i) && document.cookie.match(/;\s*ut=(\w+);/i)[1])||null;;
    if(params){
        Object.assign(window._heimdall,params);
    }
    vds = document.createElement('script');
    vds.type='text/javascript';
    vds.async = true;
    vds.src = "${heimdall_path}/${heimdall_js}.js";
    //TODO:script为啥放第一个
    s.parentNode.insertBefore(vds, s);
    vds.onload = function(){
        // console.log('loaded vds');
    }
}

function heimdall(){
    // debugger;
    /**
     * 发送基本事件 ev取以下值
     * viewHomePage:0 首页
     * viewDetailPage:2 商品详情页
     * viewActivePage:10 活动页【CMS营销页】
     * pageLoad:13:其他页面
     * meta name="heimdall"
     */
    try{
        var pageType,pageName,pageTypeToName;
        //事件对象不存在就抛异常
        if(!window.eventSupport){
            throw 'eventSupport is not defined, eventSupport.js is required';
        }
        //pageLoad事件自动执行
        //取系统平台 1：pc 2：h5 3：app
        //从打包env中获取
        window.sysPlatform = "${heimdall_systemtype}";
        //从页面templateJSON.js中获取
        window.sysPlatform = window.sysPlatform || (window['frontTemplate'] && window['frontTemplate'].platform[0]) || 1
        //取pageName，h5从header中取，pc从title中取
        pageName = $("meta[name='heimdall']").attr("content");
        if(window.sysPlatform == 1){
            pageName = pageName || document.title;
        }else if(window.sysPlatform == 2){
            pageName = pageName || $(".ui-header h1.bold").text() || '';
        }else{
            pageName = window.i18n ? window.i18n('其它') : '其它';
        }
        //cms中获取pageName方式
        pageTypeToName = {
            "1":window.i18n ? window.i18n('首页') : '首页',
            "3":window.i18n ? window.i18n('活动页') : '活动页',
            "11":window.i18n ? window.i18n('店铺') : '店铺'
        }
        pageType = $("meta[name='pageType']").attr("content");
        if(pageType){
            pageName = pageTypeToName[pageType];
        }
        window._heimdall = window._heimdall || {};
        window._heimdall.pageName = pageName;
        //商品详情页的pageLoad事件需要特殊处理，增加商品参数
        if(pageName != (window.i18n ? window.i18n('商品详情页') : '商品详情页')){
            heimdallPageLoad();
        }
        //商品详情页的pageLoad事件监听
        window.eventSupport.on('productHeimdallTrack',function(params){
            //微信平台，默认pc不在微信中打开
            params.fs = '';
            heimdallPageLoad(params);
        });
        //其他事件通过emit触发
        window.eventSupport.on('heimdallTrack',function(params){
            //heimdall.js已加载
            var ut,
                st,
                par;
            //设置延迟，等待heimdall.js加载
            function isHeimdallLoaded(){
                if(window.heimdall_track && typeof window.heimdall_track === 'function'){
                    clearTimeout(st);
                    ut = (document.cookie.match(/;\s*ut=(\w+);/i) && document.cookie.match(/;\s*ut=(\w+);/i)[1])||null;;
                    par = Object.assign({ut:ut},params);
                    heimdall_track(par);
                    return;
                }
                st = setTimeout(isHeimdallLoaded,200);
            }
            isHeimdallLoaded();
        });
    }catch(err){
        //console.log('Error: ' + err + '.');
    }
};

export {heimdall}
