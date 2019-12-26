angular.module('services').service('commonService',['$cookieStore','$rootScope','$sce','$log','$compile','$interval','$q','$window',"allUrlApi",function($cookieStore,$rootScope,$sce,$log,$compile,$interval, $q,$window,allUrlApi){
    "use strict";
    //国际化
    $rootScope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
    //如果是ie10.0版本以下， 展示弹框
    var DEFAULT_VERSION = 10;
    var showMessage = function(message) {
        var $messageBox, messageBox;
        if ($rootScope.lastMessage && message === $rootScope.lastMessage) {
            return;
        }
        $rootScope.lastMessage = message;
        messageBox = '<div><div class="message"><span class="text"></span><i class="close-btn">×</i></div></div>';
        $messageBox = $(messageBox);
        $('.notification').prepend($messageBox);
        $messageBox.slideDown('fast');
        $messageBox.children('.message').addClass('message-warning');
        $messageBox.find('span.text').html(message);
        $messageBox.find('.close-btn').click(function() {
            $messageBox.fadeOut(function() {
                $messageBox.remove();
                return delete $rootScope.lastMessage;
            });
        });
        if ($('.notification').children().length > 4) {
            return $('.message:last').fadeOut(function() {
                return $('.message:last').remove();
            });
        }
    };

    var ua = navigator.userAgent.toLowerCase();
    var isIE = ua.indexOf("msie")>-1;
    var safariVersion;
    $rootScope.isIE8 = false;
    if(isIE){
        safariVersion =  ua.match(/msie ([\d.]+)/)[1];
        //console.log('currentVersion' + safariVersion);
        if(safariVersion < DEFAULT_VERSION ){
            showMessage($rootScope.i18n('当前版本不支持') + '，' + $rootScope.i18n('可以下载') + '360，Chrome，' + $rootScope.i18n('火狐等打开查看'));
        }
        if(safariVersion < 9 ){
            $rootScope.isIE8 = true;
        }
    }
    //showMessage('当前版本不支持，可以下载360，Chrome，火狐等打开查看');
    $rootScope.IndustrialAuthCode = {
        ownerIndustrialAuthCode: null
    }
    // 工业品弹框显示
    $rootScope.showIndustrialModel2 = false
    // 显示工业品弹框
    $rootScope.$watch('showIndustrialModel2',function(newValue) {
        $rootScope.showIndustrialModel2 = newValue
    }) 
        // 确认验证码
    $rootScope.confirmIndustrialAuthCode = function () {
        if ($rootScope.IndustrialAuthCode.ownerIndustrialAuthCode == 123456) {
            $rootScope.util.cookie.setCookie('currentHeadName','工业品');            
            location.href = '/industrialProducts.html'
        } else {
            $rootScope.showIndustrialModel2 = false
        }
    },
    $rootScope.cancelIndustrialAuthCode = function () {
        $rootScope.showIndustrialModel2 = false
    }
    $rootScope.closeIndustrialAuthCode = function () {
        $rootScope.showIndustrialModel2 = false
    }
    //loading flag
    $rootScope.outScale=true;//超出配送范围
    $rootScope.isVirtual=true;//是否是虚品
    $rootScope.beforeChoseAdd = false; // 清了cookie之后第一次进入页面选择地址
    var
        utName='ut';
    //接口host
    var frontTemplate = window['template'] || window['frontTemplate'];
    frontTemplate={
        // 'h5_cms_hostStatic':'http://static.m.lyf.dev.laiyifen.com/cms/front',
        // 'h5_cms_host':'http://admin.m.lyf.dev.laiyifen.com/cms',
        // 'h5_cms_host_ouser':'http://admin.m.lyf.dev.laiyifen.com/ouser-web',
        // 'h5_cms_hostFront':'http://m.lyf.dev.laiyifen.com/cms',
        // 'rootScope_host':'http://m.lyf.dev.laiyifen.com/api',
        // 'rootScope_host_ouser':'http://m.lyf.dev.laiyifen.com/ouser-web',
        // 'rootScope_shangjia_url':'http://admin.mediaplat.com.cn/shangjia',
        // 'rootScope_categoryTreeId':1,
        // 'pc_home_host':'http://m.lyf.dev.laiyifen.com',
        // 'cms_whether_audio':0,
        'rootScope_cookie_domain':'',
        // 'guide_category':'http://m.lyf.dev.laiyifen.com/search.html?navCategoryIds=${categoryId}',
        'companyId':$rootScope.switchConfig.common.companyId,'platform':[1]
    };

    var hostUrl = location.protocol + '//' + location.host;
    // if (location.port) {
    //     hostUrl +=  ':' +  location.port;
    // }
    angular.extend($rootScope, {
        home: hostUrl,
        host: hostUrl + '/api',
        gw: hostUrl + '/gw',
        host_ouser: hostUrl + '/ouser-web',
        // shangjia_url: frontTemplate.rootScope_shangjia_url,
        // categoryTreeId: frontTemplate.rootScope_categoryTreeId,
        cookieDomain: frontTemplate.rootScope_cookie_domain,
        companyId: frontTemplate.companyId,//代表瓦特这个公司的类型，在基础数据中维护
        platformId: 2, //pc
        personalUserType: 4,//个人用户的用户类型
        companyUserType: 5,//企业用户的用户类型
        errorMessageTip: {},//错误信息提示
        templateJson:window['template'] || window['frontTemplate'],
    });
    $rootScope.singlePromotions=[1,7,8];//单一促销种类,1:单一特价,7:单一折扣,8:单一直降
    $rootScope.PackagePromotions = [1,7,8,1022,1025];  // 单一促销+ 预售 + 套餐促销
    $rootScope.promotionType_gift = [1005]; //赠品促销
    $rootScope.promotionTypePackage = [1025] //套餐促销

         /**
     * *********公用函数定义区***********
     * 共通函数
     * @type {{paramsFormat: Function, timeOut}}
     */
    $rootScope.util= {
        //获得网站的完整域名
        //如：http://saas.test.odianyun.com
        getCurrentDomain: function () {
            return location.protocol + "//" + location.host;
        },
        //以json数据格式发送post请求
        postJsonData: function (url, data) {
            var config = {
                headers: {"Content-Type": "application/json;charset=UTF-8"}, transformRequest: function (value) {
                    return angular.toJson(value);
                }
            };
            return $rootScope.ajax.postConfig(url, data, config);
        },

        //存储数据
        setLocalItem: function(key, value) {
            window.localStorage[key] = JSON.stringify(value);
        },
        //检查是否有指定key的数据
        containsLocal: function(key) {
            return window.localStorage.hasOwnProperty(key);
        },
        //获取指定key的数据
        getLocalItem: function(key) {
            if ($rootScope.util.containsLocal(key)) {
                return JSON.parse(window.localStorage[key]);
            }

            return null;
        },
        //删除指定key的数据
        removeLocalItem: function(key) {
            if (!key) {
                return;
            }

            window.localStorage.removeItem(key);
        },


        paramsFormat: function (url) {
            var url = url || location.href;
            var qInd = url.indexOf('?');
            var sharpInd = url.indexOf('#');
            var search = "";
            var paramsList = [];
            var paramsObj = {};
            if (qInd >= 0) {
                if (sharpInd > 0) {
                    search = url.substring(qInd + 1, sharpInd);
                }
                else {
                    search = url.substring(qInd + 1);
                }

                paramsList = search.toString().split('&');
                for (var ind in paramsList) {
                    var vk = paramsList[ind].toString().split('=');
                    if(vk.length>1){
                        if (vk[0].length > 0 && vk[1].length > 0)
                            paramsObj[vk[0]] = vk[1];
                    }
                }
            }
            return paramsObj;
        },
        urlFormat:function (params) {
            if(angular.isObject(params)) {
                var paramList=[];
                angular.forEach(params,function (v,k) {
                    paramList.push([k,v].join('='));
                })
                return paramList.join('&');
            }
            return '';
        },
        getCookies: function (key) {
            if (!document.cookie == '') {
                var arrCookie = document.cookie.toString().split('; ');
                var arrLength = arrCookie.length;
                for (var i = 0; i < arrLength; i++) {
                    var k, v;
                    try {
                        k = decodeURI(arrCookie[i].toString().split('=')[0]);
                        v = decodeURI(arrCookie[i].toString().split('=')[1]);
                        if (key == k) return v;
                    } catch (e) {
                    }
                }
            }
            return;
        },
        setCookie: function (name, value, expiredays, domain) {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + expiredays);
            document.cookie = name + '=' + encodeURI(angular.toJson(value)) +
                ';path=/' +
                ((expiredays === null) ? '' : ';expires=' + exdate) +
                (domain ? ';domain=' + domain : '');
        },
        delCookie: function (name, path, domain) {
            if (name) {
                var c = escape(name) + "=" +
                    (path ? ";path=" + path : "/") +
                    (domain ? ";domain=" + domain : "") +
                    ";expires=Thu, 01 Jan 1970 00:00:00 GMT";
                document.cookie = c;
            }
        },
        isEmptyObj: function (obj) {
            for (var k in obj) {
                return false;
            }
            return true;
        },
        isEmptyStr : function(e){//判断字符串是否为空
            if (e != 0 && !e) {
                return true;
            } else if (e.length == 0) {
                return true;
            }
            return false;
        },
        loadedTemplate: function (templateName) {
            $rootScope.template = $rootScope.template || {};
            $rootScope.template[templateName] = templateName;
            $rootScope.template.aaa = 'xxxx';
        },
        //生成给定位数的十六进制形式随机数
        randomString: function (len) {
            len = len || 32;
            var $chars = 'abcdef1234567890';
            var maxPos = $chars.length;
            var pwd = '';
            for (var i = 0; i < len; i++) {
                pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return pwd;
        },
        timeOut: function (scope) {
            //临时的暴露方法
            var exp = scope._utils = {};
            //空方法
            var NOPE = function () {
            };

            /**
             * delayMs 延迟的毫秒信息
             * callback 延迟执行的方法
             *
             */
            var delay = function (delayMs, callback) {
                //这里是延迟的上下文
                var timeOut;
                var delay = parseInt(delayMs) || 100;
                var cb = callback || NOPE;


                return function () {
                    //传入的参数
                    var args = arguments;
                    //清理上次的延迟
                    if (timeOut) {
                        clearTimeout(timeOut);
                    }
                    //延迟执行
                    timeOut = setTimeout(function () {
                        cb.apply(scope, args);
                    }, delayMs);
                };
            };
            //暴露方法
            exp.delay = delay;
        }($rootScope),
        cookie: {
            setCookie: function setCookie(name, value, exdays) {
                if (!exdays) {
                    exdays = 365;
                }
                var exp = new Date();
                exp.setTime(exp.getTime() + exdays * 24 * 60 * 60 * 1000);
                document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + "; path=/; domain=" + location.hostname;
            },
            getCookie: function getCookie(name) {
                var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
                if (arr = document.cookie.match(reg))
                    return unescape(arr[2]);
                else
                    return null;
            },
            delCookie: function delCookie(name) {
                var exp = new Date();
                exp.setTime(exp.getTime() - 1 * 24 * 60 * 60 * 1000);
                var cval = this.getCookie(name);
                if (cval !== null) {
                    document.cookie = name + "=" + escape('') + ";expires=" + exp.toGMTString() + "; path=/; domain=" + location.hostname;
                    document.cookie = name + "=" + escape('') + ";expires=" + exp.toGMTString() + "; path=/; domain=" + $rootScope.cookieDomain;
                }
            },
        },

        //获取UT
        getUserToken: function () {
            var _utName = this.cookie.getCookie(utName);
            if (!_utName || _utName == undefined || _utName == 'undefined') {
                return;
            } else {
                return _utName;
            }

        },
        // getBindToken: function (but) {
        //     return  this.cookie.getCookie(but);
        // },
        //设置UT
        setUserToken: function (ut) {
            this.cookie.setCookie(utName, ut);
        },

        //清空用户登录UT
        //因为在iphone6 se版本的微信里无法删除cookie，所以只能通过设置为空来标识用户退出登录状态。
        deleteUserToken: function () {
            this.cookie.setCookie(utName, "", -1);
        },
        //判断用户是否已登录
        loggedIn: function () {
            var ut = this.cookie.getCookie(utName);
            return ut && ut.length > 0;
        },
        //判断是否是积分页面,cb为判断成功的回调函数
        isPointPage:function (cb) {
            var pointPage = ['/integral.html','/intergralList.html','/integralSearch.html'];
            if($.inArray(location.pathname, pointPage) > -1){
                if(typeof cb == 'function'){
                    cb();
                } else{
                    return true;
                }
            } else{
                return false;
            }
        },
        /**
         * 积分商品，获取实时价格库存公用方法
         *
         */
        getPointProPriceAndStock:function (mpIds,obj,promotionId,callback) {
            if((mpIds||'').length==0) return;
            var url = $rootScope.host + '/pointMallProduct/getPriceLimitList';
            var params = {
                mpIds: mpIds,//商品ids
            };
            $rootScope.ajax.post(url, params).then(function (res) {
                if(res.code == 0 || res.code === '0') {
                    var plistMap={};
                    angular.forEach(res.data.plist||[], function (pl) {
                        pl.volume4sale = pl.totalExchanged;
                        plistMap[pl.mpId]=pl;
                    })
                    angular.forEach(obj||[], function (pl) {
                        if(plistMap[pl.mpId]){
                            $.extend(pl,plistMap[pl.mpId]);
                        }
                    })
                    if(callback){
                        callback(obj);
                    }
                }else {
                    $rootScope.error.checkCode(res.code, res.message);
                }
            })
        }
    };
    //登录跳转
    $rootScope.toLogin = function () {
        $cookieStore.put('backUrl', location.href);
        $rootScope.util.cookie.delCookie('ut');
        location.href = $rootScope.home + '/login.html';
    };
    //判断用户是否登录（需要登录的页面调用此方法）
    $rootScope.checkUser = function () {
        var ut=$rootScope.util.getUserToken();
        if(!ut && location.pathname.indexOf('login.html') <= -1 && location.pathname.indexOf('forgot.html') <= -1) {
            $rootScope.toLogin();
        }
    };
    $rootScope.checkUser();


    //显示body, 如果有cms设计的头部尾部也显示
    $rootScope._getHeaderFooter=function(){
        var pathname = location.pathname;
        //首页头尾是cms输出，不需要在读取接口
        if (pathname == "/" || pathname == "/index.html") {
            $("body").show();
            return;
        }    
        //页面类型
        var pageType; // 4: 搜索页, 5: 详情页, 6: 其他页
        if (pathname.indexOf("/search.html")>=0) {
            pageType = 4;
        } else if (pathname.indexOf("/item.html")>=0) {
            pageType = 5
        } else {
            pageType = 6;
        }

        var url = "/cms/page/getPageSectionsByType?callback=angular.callbacks._0&pageType=" + pageType;
        $rootScope.ajax.jsonP(url).then(function(res){
            var data = res.data || {};
            var headerSection = data.pageSectionsHeader || {};
            var footerSection = data.pageSectionsTail || {};
            var headerHtml = headerSection.sectionHtml ? $compile(headerSection.sectionHtml)($rootScope) : "";
            var headerCss = headerSection.sectionCss || "";
            var footerHtml = footerSection.sectionHtml ? $compile(footerSection.sectionHtml)($rootScope) : "";
            //如果没有自定义的头尾默认看做已添加到页面
            var addHeader = !headerHtml && !headerCss;
            var addFooter = !footerHtml;

            //meta附加信息
            if (headerSection.addContent) {
                // $("head meta:last").after(headerSection.addContent);
            }
            //头部自定义样式
            if (headerCss) {
                $("#customHeaderCss").append(headerCss);
            }

            //在cms的样式生效后在显示页面，从而避免样式跳跃变化。
            $("body").show();

            //头部自定义html
            if (headerHtml) {
                $("#customHeaderHtml").append(headerHtml);
                $rootScope.util.loadedTemplate("deliverAddress");
            }

            //添加自定义底部
            if (footerHtml) {
                $("#customFooterHtml").append(footerHtml);
            }

        },function () {
            //就算是接口出错也要显示默认主题样式的页面
            $("body").show();
        });
    };
    $rootScope._getHeaderFooter();

    //页面尾部导航
    //查询分类文章列表
    $rootScope.initQuerySubCategory = function () {
        var url = '/back-cms-web/cmsCategoryRead/querySubCategory',
            param = {
                categoryCode:'help',
                platformIds:'1',
                itemsPerPage:5
            };
        $rootScope.ajax.postJson(url, param).then(function (rest) {
            if (rest.code == 0){
                $rootScope.category = rest.data;
            }
        },function (rest) {
            $rootScope.error.checkCode($rootScope.i18n('系统异常'),rest.message);
        });

    };
    $rootScope.initQuerySubCategory();

    $rootScope.basicSetting = false;
    //获取商家的系统配置信息
    $rootScope.initQueryFrontBasicSetting = function () {
        var url = '/osc-web/frontBasicSetting/getFrontBasicSetting.do';

            $rootScope.ajax.get(url, {}).then(function (rest) {
            if (rest.code == 0){
                $rootScope.basicSetting = true;
                $rootScope.frontBasicSetting = rest.resultData;
               //document.write('<link rel="shortcut icon" href="/images/favicon1.ico"><link rel="bookmark" href="/images/favicon1.ico" />');
               //网站的favicon
                var link = document.createElement('link');
                link.rel="icon";
                var url = angular.copy($rootScope.frontBasicSetting.websiteFavicon);

                if(url) {
                    var index = url.lastIndexOf("\.");
                    url = url.substring(index + 1, url.length);
                    if (url == 'ico') {
                        link.rel="shortcut icon";
                        link.type="image/x-icon"
                    }
                    link.href = $rootScope.frontBasicSetting.websiteFavicon;
                    document.head.appendChild(link);

                    //添加网站的标题
                    var title = document.createElement('title');
                    title.text = $rootScope.frontBasicSetting.websiteTitle;
                    document.head.appendChild(title);
                }
            }
        },function (rest) {
            $rootScope.error.checkCode("系统异常",rest.message);
        });

    };
    $rootScope.initQueryFrontBasicSetting();
    // 获取当前用户是否是管理员
    $rootScope.isAdmin = 0
    $rootScope.isShowStatement = 0
    $rootScope.getUserIsAdmin = function() {
        let url = '/custom-sbd-web/user/getUserDetail.do'
        let params = null
        $rootScope.ajax.postJson(url,params).then(function(res){
            if (res.code == 0 && res.data) {
                $rootScope.isAdmin = res.data.isAdmin
                $rootScope.currentUserId = res.data.id
                $rootScope.monthBalance = res.data.monthBalance
                $rootScope.isShowStatement = res.data.showReportIs
                $rootScope.defReceiveAddressId = res.data.defReceiveAddressId
                $rootScope.canOwe = +res.data.canOwe
            }
        })
    }
    $rootScope.getUserIsAdmin()
    // 史泰博ADV获取关联账号
    $rootScope.relevanceAccount = []
    $rootScope.getRelevanceAccount = function() {
        let lastRelevanceAccount = $rootScope.util.cookie.getCookie('relevanceAccount')
        lastRelevanceAccount = JSON.parse(lastRelevanceAccount) || []
        let url = '/custom-sbd-web/front/user/queryAccountGroup2.do'
        let params = {}
        $rootScope.ajax.postJson(url,params).then(function(res){
            if (res.code ==0 && res.data) {
                let arr = [...lastRelevanceAccount,...res.data]
                let hash = {};
                arr = arr.reduce(function(item, next) {
                    if(next.nickname){
                        hash[next.nickname] ? '' : hash[next.nickname] = true && item.push(next);
                        return item
                    }else{
                        return item
                    }
                   
                }, [])
                $rootScope.relevanceAccount = arr
            }
        })
    }
    $rootScope.getRelevanceAccount()
    // 切换关联账号
    $rootScope.switchAcount = function(item) {
        let url = '/custom-sbd-web/front/user/queryAccountGroup2.do'
        let params = {}
        $rootScope.ajax.postJson(url,params).then(function(res){
            if (res.code == 0 && res.data) {
                $rootScope.shortTimeobj = {}
                var accountArr = []
                angular.forEach(accountArr,function(item){
                    // 切换下一个账号时需要将主账号的数据存贮起来
                    if (item.isCurrent == 1) {
                        $rootScope.shortTimeobj.isCurrent = '0'
                        $rootScope.shortTimeobj.mobile = item.mobile
                        $rootScope.shortTimeobj.nickname = item.nickname
                        $rootScope.shortTimeobj.userId = item.userId
                        $rootScope.shortTimeobj.userName = item.userName
                    }

                })
                if ($rootScope.shortTimeobj) {
                    accountArr.push($rootScope.shortTimeobj)
                }
                console.log(accountArr)
                // 更新关联账号
                $rootScope.util.cookie.setCookie('relevanceAccount',JSON.stringify(accountArr),30)
                let url = '/custom-sbd-web/front/user/changeCurrentLoginUser.do'
                let params = item.userId
                $rootScope.ajax.postJson(url,params).then(function(res) {
                    if (res.code == 0) {
                        location.reload()
                    } else {
                        $rootScope.error.checkCode($rootScope.i18n('系统异常'),res.message);
                    }
                },function(err){
                    $rootScope.error.checkCode($rootScope.i18n('系统异常'),err.message);
                })
            }
        })
        
    }
    // 史泰博ADV设置企业logo
    $rootScope.getCompanyLogo = function() {
        let url = '/custom-sbd-web/advEntInfo/getAdvEntInfo.do'
        let params = {}
        $rootScope.ajax.get(url,params).then(function(res) {
            if(res.code == 0 && res.data) {
                $rootScope.companyLogoUrl = res.data.entLogoUrl;
                $rootScope.mpItemStandardPriceDisplay = res.data.mpItemStandardPriceDisplay;
                $rootScope.currentBalance = res.data.currentBalance;
            }
        })
    }
    $rootScope.getCompanyLogo()
    // 晨光首页底部导航广告位信息
    $rootScope.bottomNav = function() {
        var url = '/ad-whale-web/dolphin/getAdSource';
        var params = {
            pageCode: 'HOME_PAGE',
            adCode : 'website_recommendation',
            platform: 1,
            companyId: $rootScope.companyId
        }
        $rootScope.ajax.get(url,params).then(function(res){
            if( res.data && res.data.website_recommendation ) {
                $rootScope.websiteRecommendation = res.data.website_recommendation;
            }
        })
    }
    if( $rootScope.switchConfig.index.showIndexBottomMes ) {
        $rootScope.bottomNav();
    }
    // 晨光首页底部商标信息
    $rootScope.bottomCompanyMes = function() {
        var url = '/ad-whale-web/dolphin/getAdSource';
        var params = {
            pageCode: 'HOME_PAGE',
            adCode : 'record_information',
            platform: 1,
            companyId: $rootScope.companyId
        }
        $rootScope.ajax.get( url,params ).then(function(res) {
            if( res.data && res.data.record_information ) {
                $rootScope.recordInformation = res.data.record_information;
            }
        })
    }
    if( $rootScope.switchConfig.index.showIndexBottomImg ) {
        $rootScope.bottomCompanyMes();
    }
    //尾部的版权信息
    $rootScope.initQueryWebsiteRight = function () {
        var url = '/osc-web/frontBasicSetting/getWebsiteRight.do';
            $rootScope.ajax.get(url, {}).then(function (rest) {
            if (rest.code == 0){
                $rootScope.copyRight = rest.resultData;
            }
        },function (rest) {
            $rootScope.error.checkCode($rootScope.i18n('系统异常'),rest.message);
        });

    };
    $rootScope.initQueryWebsiteRight();

    //页尾配置
    $rootScope.initQueryPageFooterSetting = function () {
        var url = '/osc-web/frontBasicSetting/getPageFooterSetting.do';
            $rootScope.ajax.get(url, {}).then(function (rest) {
            if (rest.code == 0){
                $rootScope.footerSetting = rest.resultData;
            }
        },function (rest) {
            $rootScope.error.checkCode($rootScope.i18n('系统异常'),rest.message);
        });

    };
    $rootScope.initQueryPageFooterSetting();


    //目前不知道是实现什么功能
    setTimeout(function(){
        $rootScope.util.loadedTemplate("deliverAddress");
        $rootScope.$apply();
    },200);

    
   
    //登录弹框
    $rootScope.toLoginModal = function () {
        $rootScope.showLoginBox = true;
    };

    //判断是否为IE8, 并自调一下
    $rootScope.isIE=function(){
        if(navigator.userAgent.indexOf("MSIE 8.0")>=0){
            return true;
        }
        return false;
    }();

    //home.js获取
    //左边菜单栏使用, 根据返回的memberType显示不同的菜单(不知道为什么放到$rootScope上)
    $rootScope._getUserInfoFromCache=function(success,error){
       if( !angular.isFunction(success)){
           return;
       }
        if($rootScope.logonInfo){
            success($rootScope.logonInfo);
        }else{
            $rootScope._getUserInfo().then(function(res){
                if(res&&res.code=='0'&&res.data){
                    success(res.data);
                }else{
                    error(res);
                }
            })
        }
    }
    $rootScope.hideProductPrice = false;
    //获取用户信息(全信息, 会员信息, 用户信息)
    $rootScope._getUserInfo = function () {
        var locationUrl = window.location.href;
        if( locationUrl.indexOf('binding.html') > -1 ) {
            return;
        }
        var getUt = $rootScope.util.cookie.getCookie(utName);
        var params = {
            identityTypeCode: $rootScope.switchConfig.common.defaultIdentityTypeCode,
            cashe:Date.parse(new Date()),
        };

        var delay = $q.defer();
        $rootScope.ajax.post('/ouser-center/api/user/info/detail.do',params).then(function (res) {
            delay.resolve(res);
            if(res.code == 0 || res.code === '0'){
                $rootScope.logonInfo = res.data;
                if ($rootScope.switchConfig.common.JumpJoinProcessStep) {
                    if ($rootScope.logonInfo.storeInfo.auditStatus === 0 || $rootScope.logonInfo.storeInfo.auditStatus == 2) {
                        location.href="/joinProcessStep.html?type=" + $rootScope.logonInfo.storeInfo.auditStatus;
                    } else if ($rootScope.logonInfo.storeInfo.auditStatus === 1 && locationUrl.indexOf('joinProcessStep.html') > -1 ) {
                        location.href="index.html";
                    }
                }
                // 会员信息
                $rootScope.memberInfo = $rootScope.logonInfo.memberInfo;
                // 用户信息
                $rootScope.userInfo = $rootScope.logonInfo.userInfo;
                //计算滚动条的颜色显示
                // 门店信息
                $rootScope.merchantInfo = $rootScope.logonInfo.storeInfo;
                if ($rootScope.merchantInfo && $rootScope.merchantInfo.merchantQQ) {
                    $rootScope.merchantInfo.merchantQQ = $rootScope.merchantInfo.merchantQQ.split("|");
                }
                if ($rootScope.merchantInfo && $rootScope.merchantInfo.merchantTel) {
                    $rootScope.merchantInfo.merchantTel = $rootScope.merchantInfo.merchantTel.split("|");
                }
                if (!getUt && $rootScope.switchConfig.common.hidePriceWhenNoLogin) {
                    $rootScope.hideProductPrice = true;
                }
                //会员审核状态（-1；未提交；0：审核中；1：审核通过；2：审核不通过）
                if (getUt && $rootScope.switchConfig.common.hidePriceWhenNoLogin && ($rootScope.merchantInfo.auditStatus == -1 || $rootScope.merchantInfo.auditStatus == 0 || $rootScope.merchantInfo.auditStatus == 2)) {
                    $rootScope.hideProductPrice = true;
                }
                if (!$rootScope.switchConfig.common.showUpdateDistributionAddress) {
                    $rootScope.localProvince.provinceFlag = true;
                    $rootScope.util.setCookie("addrDetail",{
                        "detail":$rootScope.i18n( + $rootScope.merchantInfo.merchantRegisterProvinceName + $rootScope.merchantInfo.merchantRegisterCityName + $rootScope.merchantInfo.merchantRegisterRegionName),
                        "detailId":$rootScope.merchantInfo.merchantRegisterProvinceId + '_' + $rootScope.merchantInfo.merchantRegisterCityId + '_' + $rootScope.merchantInfo.merchantRegisterRegionId,
                        "detailCode":$rootScope.merchantInfo.merchantRegisterProvinceCode + '_' + $rootScope.merchantInfo.merchantRegisterCityCode + '_' + $rootScope.merchantInfo.merchantRegisterRegionCode,
                    },90);
                    $rootScope.util.setCookie( "areasCode" , {
                        'oneCode' :$rootScope.merchantInfo.merchantRegisterRegionCode
                    },90);
                    $rootScope.util.setCookie("province",{
                        "provinceId":$rootScope.merchantInfo.merchantRegisterProvinceId,
                        "provinceName":$rootScope.i18n($rootScope.merchantInfo.merchantRegisterProvinceName),
                        "provinceCode":$rootScope.merchantInfo.merchantRegisterProvinceCode,
                        "cityId":$rootScope.merchantInfo.merchantRegisterCityId,
                        "cityName":$rootScope.i18n($rootScope.merchantInfo.merchantRegisterCityName),
                        "cityCode":$rootScope.merchantInfo.merchantRegisterCityCode,
                        "regionId":$rootScope.merchantInfo.merchantRegisterRegionId,
                        "regionName":$rootScope.i18n($rootScope.merchantInfo.merchantRegisterRegionName),
                        "regionCode":$rootScope.merchantInfo.merchantRegisterRegionCode
                    },90, $rootScope.cookieDomain);
                    $rootScope.util.setCookie("isAutoArea","no", 90);
                }
                if ($rootScope.switchConfig.common.jumpJoinProcessStep) {
                    //只有登录才去check是不是审核通过
                    if (getUt) {
                        if ($rootScope.logonInfo.storeInfo.auditStatus == 2 && locationUrl.indexOf('joinProcessStep.html') <= -1 && locationUrl.indexOf('joinProcess.html') <= -1) {
                            location.href="/joinProcessStep.html?type=" + $rootScope.logonInfo.storeInfo.auditStatus;
                        } else if ($rootScope.logonInfo.storeInfo.auditStatus === 1 && locationUrl.indexOf('joinProcessStep.html') > -1 ) {
                            location.href="index.html";
                        } else if (($rootScope.logonInfo.storeInfo.auditStatus === -1) && locationUrl.indexOf('joinProcess.html') <= -1) {
                            location.href="/joinProcess.html";
                        } else if( $rootScope.logonInfo.storeInfo.auditStatus == 0 && locationUrl.indexOf('joinProcessStep.html') <= -1 ) {
                            location.href="/joinProcessStep.html?type=" + $rootScope.logonInfo.storeInfo.auditStatus;
                        }
                    }
                }

                var dataSize = (($rootScope.memberInfo ? $rootScope.memberInfo.growthBalence: 0) * 160) / ($rootScope.memberInfo?$rootScope.memberInfo.growthReach: 0);
                setTimeout(function(){
                    $('.experience-bgc').css({
                        width: dataSize + 'px'
                    })
                },10)
            } else if(res.code == "99"){
                if ($rootScope.switchConfig.common.hidePriceWhenNoLogin) {
                    $rootScope.hideProductPrice = true;
                }
                $rootScope.util.deleteUserToken();
            } else{
                if ($rootScope.switchConfig.common.hidePriceWhenNoLogin) {
                    $rootScope.hideProductPrice = true;
                }
                $rootScope.error.checkCode(res.code,res.message);
            }
        }, function(res) {
            if (!$rootScope.switchConfig.common.showUpdateDistributionAddress) {
                $rootScope.util.setCookie("addrDetail",{
                    "detail":$rootScope.i18n('上海上海市黄浦区'),
                    "detailId":'10_110_1129',
                    "detailCode":'310000_310100_310101'
                },90);
                $rootScope.util.setCookie( "areasCode" , {
                    'oneCode' : $rootScope.defaultAreasCode
                },90);
                $rootScope.util.setCookie("province",{
                    "provinceId":10,
                    "provinceName":$rootScope.i18n('上海'),
                    "provinceCode":310000,
                    "cityId":110,
                    "cityName":$rootScope.i18n('上海市'),
                    "cityCode":310100,
                    "regionId":1129,
                    "regionName":$rootScope.i18n('黄浦区'),
                    "regionCode":310101
                },90, $rootScope.cookieDomain);
                $rootScope.util.setCookie("isAutoArea","no", 90);
            }
            if ($rootScope.switchConfig.common.hidePriceWhenNoLogin) {
                $rootScope.hideProductPrice = true;
            }
            delay.resolve(res);
        });
        return delay.promise;
    };

    //退出登录
    $rootScope.userExit = function (noJump) {
        var url = $rootScope.host_ouser + "/mobileLogin/exit.do";
        var _ut = $rootScope.util.getUserToken();
        $rootScope.ajax.post(url, {}).then(function (res) {
            if(res.code ==0) {
                // $cookieStore.remove('lyfpcut');
                // $rootScope.util.delCookie("lyfpcut",  "/", $rootScope.cookieDomain);
                // $rootScope.util.deleteUserToken();
                $rootScope.util.cookie.delCookie('ut');
                $rootScope.util.cookie.delCookie('ticket');
                $rootScope.removeTicket();
                if (!$rootScope.switchConfig.common.showUpdateDistributionAddress) {
                    $rootScope.util.cookie.delCookie('addrDetail');
                    $rootScope.util.cookie.delCookie('areasCode');
                    $rootScope.util.cookie.delCookie('province');
                }
                if (res.data) {
                    location.href = res.data
                    return;
                }
                if(noJump){
                    return;
                } else {
                    location.href = $rootScope.home + '/login.html';
                }
            }else{
                $rootScope.error.checkCode(res.code,res.message);
            }
        },function(res){
            $rootScope.util.cookie.delCookie('ut');
            $rootScope.util.cookie.delCookie('ticket');
            location.href = $rootScope.home + "/login.html";
        });
    };  

    //省份相关功能
    $rootScope.localProvince={
        //弹出遮罩选择框
        provinceFlag:false,
        //头部选择区
        headProvince:false,
        //当前省份
        province:{},
        //所有省份
        provinceList:{},
        //省份字母数量
        provinceLetter:0,
        //获得的省市区
        gotAreas:{
            province:{},
            city:{},
            area:{}
        },
        //级联选择省市区变量集合
        lvAreaObj:{
            areaShow:false,
            areaTab:1
        },
        //运费描述
        //deliveryFeeDesc:[],
        wareHose: '', // 获取发货仓名称

        distributionMode: false,
        //同步页首省份与其他页面选择的省份
        //inverse如果为true,则从页中向页首同步
        _syncArea:function(inverse, item){
            if(inverse){
                this._setProvince(this.gotAreas.province.id,this.gotAreas.province.name,this.gotAreas.province.code,[$rootScope.getCartTotal,$rootScope.getMiniCart]);
            }else if(this.province) {
                this.gotAreas={
                    province : {
                        id: this.province.provinceId,
                        name: this.province.provinceName
                    }
                };
            }
            this._getcangku(item)
        },
        //获取仓库
        _getcangku:function(item){
            if (!item) {
                return
            }

            var url = '/custom-sbd-web/warehouse/getWarehouseInfoByAreaCode.do';
            var params = item
            $rootScope.ajax.postJson(url,params).then(function(res){
                if(res.code == 0 && res.data){
                    $rootScope.localProvince.wareHose = res.data.name;
                } else {
                    $rootScope.localProvince.wareHose = null;
                }
            })

        },
        /**
         * 获得省份后回调需要初始化的函数，否则先设置省份
         * @param funArray
         * @private
         */
        _checkProvince:function(funArray){
            if (typeof $rootScope.util.getCookies("province") === 'undefined' || typeof $rootScope.util.getCookies("province") === 'null') {
                this.provinceFlag = false;
            } else {
                var popFlag= $rootScope.util.getCookies( "isAutoArea");
                if (popFlag && JSON.parse(popFlag) == "yes") {
                    this.provinceFlag = false;
                } else {
                    this.provinceFlag = true;
                }

                this.province = JSON.parse($rootScope.util.getCookies("province"));
                //$log.debug('province_coockie',this.province);
                if(typeof $rootScope.util.getCookies("addrDetail") === 'undefined'){
                    this._syncArea();
                }else{
                    var detail=JSON.parse($rootScope.util.getCookies("addrDetail"));
                    this.lvAreaObj.detail=detail.detail;
                    this.lvAreaObj.detailId=detail.detailId;
                    this.lvAreaObj.detailCode=detail.detailCode;
                    if(this.lvAreaObj.detailId) {
                        var di=this.lvAreaObj.detailId.toString().split('_');
                        $rootScope.localProvince.gotAreas.province.id=di[0];
                        $rootScope.localProvince.gotAreas.city.id=di[1];
                        $rootScope.localProvince.gotAreas.area.id=di[2];
                        //如果页首的省份id与详细地址的id不同，详细地址更新为页首的省份
                        if($rootScope.localProvince.gotAreas.province.id!=this.province.provinceId){
                            this.lvAreaObj.detail=this.province.provinceName;
                            this.lvAreaObj.detailId=this.province.provinceId;
                            this.lvAreaObj.detailCode=this.province.provinceCode;
                            $rootScope.util.setCookie("addrDetail",{
                                "detail":this.lvAreaObj.detail,
                                "detailId":this.lvAreaObj.detailId,
                                "detailCode":this.lvAreaObj.detailCode
                            },90);
                            this._syncArea();
                            this._getLevelsArea(100000,1);
                        }
                    }
                    if(this.lvAreaObj.detailCode)
                        var dc=this.lvAreaObj.detailCode.toString().split('_');
                        angular.forEach(dc, function (code,index) {
                            if(index<dc.length-1)
                                $rootScope.localProvince._getLevelsArea(code,index+2);
                        });

                }
                if(funArray && angular.isArray(funArray)){
                    angular.forEach(funArray, function (fun) {
                        fun();
                    });
                }
            }
            this._getProvince();
        },
        //格式化取回的省份数据
        _formatProvince:function(hot,all){
            if(angular.isArray(hot) && angular.isArray(all)){
                var mapAll={};
                var num=0;
                angular.forEach(all,function(one){
                    angular.forEach(hot,function(h){
                        if(one.provinceId=== h.provinceId){
                            one.isHot=true;
                        }
                    });
                    if(mapAll[one.letter]){
                        mapAll[one.letter].push(one);
                    }else{
                        mapAll[one.letter]=[];
                        mapAll[one.letter].push(one);
                        num++;
                    }
                });
                this.provinceList=mapAll;
                this.provinceLetter=num;
            }
        },
        //页面上选择省份
        _setProvince:function(provinceId,provinceName,provinceCode,funArray){
            // 清cookie后第一次
            $rootScope.beforeChoseAdd = true;
            //为了获取三级地址暂时存取初始数据
            this.provinceData={
                "code":provinceCode,
                "id":provinceId,
                "name":provinceName
            };
            this.province={
                "provinceId":provinceId,
                "provinceName":provinceName,
                "provinceCode":provinceCode
            };
            $rootScope.util.setCookie("isAutoArea","no", 90);
            $rootScope.util.setCookie("province",this.province,90, $rootScope.cookieDomain);
            this.provinceFlag=true;
            if(this.headProvince) this.headProvince=false;

            //如果页首的省份id与详细地址的id不同，详细地址更新为页首的省份
            if($rootScope.localProvince.gotAreas.province.id!=this.province.provinceId){
                this.lvAreaObj.detail=this.province.provinceName;
                this.lvAreaObj.detailId=this.province.provinceId;
                this.lvAreaObj.detailCode=this.province.provinceCode;
                $rootScope.util.setCookie("addrDetail",{
                    "detail":this.lvAreaObj.detail,
                    "detailId":this.lvAreaObj.detailId,
                    "detailCode":this.lvAreaObj.detailCode
                },90);
                $rootScope.util.setCookie( "areasCode" , {
                    'oneCode' :$rootScope.areasCode.oneCode
                },90);
                this._syncArea();
                this._getLevelsArea(100000,1,1);
            }

            //设置省份后重新获取mini购物车和件数
            if(funArray && angular.isArray(funArray)){
                angular.forEach(funArray, function (fun) {
                    if(fun){
                        fun();
                    }
                });
            }
        },
        //获取省份数据
        _getProvince:function(){
            var url=$rootScope.host+'/location/provinces';
            var that=this;
            $rootScope.ajax.get(url, {}).then(function(res){
                if(res.code==0) {
                    //$log.debug('province',res);
                    $rootScope.showProvinceTip=true;
                    $rootScope.localProvince._formatProvince(res.data.hot,res.data.all);
                    $rootScope.localProvince.gotProvince=true;
                }else{
                    $rootScope.localProvince.gotProvince=false;
                    $rootScope.error.checkCode(res.code,res.message,{
                        type:'info'
                    });
                }
            }, function(res){
                $rootScope.localProvince.gotProvince=false;
                $rootScope.error.checkCode($rootScope.i18n('系统异常'),$rootScope.i18n('获取省份异常'));
            })
        },
        // _goodService : function() {
        //     var url = '/back-product-web/consultAppAction/getMerchantProductList.do';
        //     var arrId = [$rootScope.util.paramsFormat(location.search).itemId];
        //     var params = arrId;
        //     var serviceId = [];
        //     var serviceData = null;
        //     $rootScope.ajax.postJson(url, params).then(function(res){
        //         if(res.data) {
        //             angular.forEach(res.data,function(data,index){
        //                 angular.forEach(data,function(value,k){
        //                     serviceId.push(value.id);
        //                     serviceData = data;
        //                 })
        //             })
        //             // console.log(serviceData);
        //             var url = $rootScope.host + '/realTime/getPriceStockList'
        //             params = {
        //                 mpIds : serviceId
        //             };
        //             $rootScope.ajax.get(url,params).then(function (res) {
        //                 if( res.code == 0 || res.code === '0' ) {
        //                     if( res.data.plist != null && res.data.plist.length > 0 ) {
        //                         angular.forEach(res.data.plist , function(val) {
        //                             angular.forEach(serviceData , function(k) {
        //                                 if(val.mpId == k.id) {
        //                                     k.stockNum = val.stockNum;
        //                                     k.price = val.price;
        //                                 }
        //                             })
        //                         })
        //                     }

        //                 }
        //             })
        //             $rootScope.serviceList = serviceData;
        //         }
        //     });
        // },
        _changeAddr:function(input,tab, type){
            // this._getLevelsArea(100000,2,1);
            // this._getLevelsArea(100000,3,1);
            if(tab===0){
                this.gotAreas.area= {
                    id: input.id,
                    name: input.name,
                    code:input.code
                };
                var param1 = {
                    provinceCode:this.gotAreas.province.code,
                    cityCode:this.gotAreas.city.code,
                    districtCode:this.gotAreas.area.code
                }
                $rootScope.areasCode = {oneCode:this.gotAreas.area.code};
                //$rootScope.areasCode.oneCode = this.gotAreas.area.code;
                $rootScope.util.setCookie( "areasCode" , {
                    'oneCode' :$rootScope.areasCode.oneCode
                },90);
                if($rootScope.serviceList && $rootScope.serviceList.length > 0) {
                    var url = '/search/rest/checkMpSaleArea.do';
                    var arrId = [];
                        angular.forEach( $rootScope.serviceList,function(val) {
                            arrId.push(val.id);
                        } )
                        var newArrId = arrId.join(',');
                        var params = {
                            mpIds : newArrId,
                            areaCode : this.gotAreas.area.code
                        }

                    var that = this;
                    $rootScope.ajax.post(url,params).then(function(res){
                        if( res.code == 0 || res.code === '0' ) {
                            that.lvAreaObj.serviceJundel = res.data;
                            angular.forEach($rootScope.serviceList,function(val) {
                                for( var k in that.lvAreaObj.serviceJundel ) {
                                    if( k == val.id ) {
                                        val.choseAdd = that.lvAreaObj.serviceJundel[k]
                                    }
                                }
                            })
                        }
                    })
                } else {
                    var currenyUrl = window.location.href;
                    if( currenyUrl.indexOf('item.html') == 28 ) {
                        $rootScope.goodService();
                    }
                }
                if( $rootScope.serviceGoodMesage ) {
                    var url = '/search/rest/checkMpSaleArea.do';
                    var params = {
                        mpIds : $rootScope.serviceGoodMesage.mpId,
                        areaCode : this.gotAreas.area.code
                    }
                    $rootScope.ajax.post(url,params).then(function(res){
                        if( res.code == 0 || res.code === '0' ) {
                            angular.forEach( res.data,function(q,index) {
                                if( index == $rootScope.serviceGoodMesage.mpId ) {
                                    $rootScope.serviceGoodMesage.isAreaSale = res.data[index];
                                }
                            } )
                        }
                    })
                }
                this.lvAreaObj.areaTab=1;
                this.lvAreaObj.areaShow=false;
                this.lvAreaObj.detail=this.gotAreas.province.name+this.gotAreas.city.name+this.gotAreas.area.name;
                this.lvAreaObj.detailId=[this.gotAreas.province.id,this.gotAreas.city.id,this.gotAreas.area.id].join('_');
                this.lvAreaObj.detailCode=[this.gotAreas.province.code,this.gotAreas.city.code,this.gotAreas.area.code].join('_');
                $rootScope.util.setCookie("addrDetail",{
                    "detail":this.lvAreaObj.detail,
                    "detailId":this.lvAreaObj.detailId,
                    "detailCode":this.lvAreaObj.detailCode,
                },90);
                this._syncArea(true,param1);
            }else if(tab===2) {
                this.gotAreas.province = {
                    id: input.id,
                    name: input.name,
                    code:input.code
                };
                this.gotAreas.city=null;
                this.gotAreas.cities={};
                this.lvAreaObj.areaTab = tab;
                if(type == 1){
                    this._getLevelsArea(input.code,2,1);
                }else{
                    this._getLevelsArea(input.code,tab);
                }
            }else if(tab===3){
                this.gotAreas.city= {
                    id: input.id,
                    name: input.name,
                    code:input.code
                };
                this.gotAreas.area=null;
                this.gotAreas.areas={};
                this.lvAreaObj.areaTab = tab;
                if(type == 1){
                    this._getLevelsArea(input.code,3,1);
                }else{
                    this._getLevelsArea(input.code, tab);
                }
            }
        },
        //获取层级省份
        _getLevelsArea:function(code,layer,bool){
            var that = this;
            if(typeof code!=='undefined' && code!==null ) {
                var url=$rootScope.host + '/location/list/' + code;
                $rootScope.ajax.get(url, {}).then(function(res){
                    if(res.code!=0){
                        $rootScope.error.checkCode(res.code,res.message);
                    }else if(res.data!=null){
                        //$log.debug('levelArea',res);
                        switch (layer){
                            case 1:{
                                $rootScope.localProvince.gotAreas.provinces=res.data;
                                if(bool == 1)
                                    that._changeAddr(that.provinceData,2,1);
                                break;
                            }
                            case 2:{
                                $rootScope.localProvince.gotAreas.cities=res.data;
                                if(bool == 1)
                                    that._changeAddr($rootScope.localProvince.gotAreas.cities[0],3,1);
                                break;
                            }
                            case 3:{
                                $rootScope.localProvince.gotAreas.areas=res.data;
                                if(bool == 1)
                                    that._changeAddr($rootScope.localProvince.gotAreas.areas[0],0,1);
                                break;
                            }
                            default :break;
                        }
                    }
                }, function(res){
                    $rootScope.error.checkCode($rootScope.i18n('系统异常'),$rootScope.i18n('获取省市区异常'));
                })
            }
        },
        _changedistributions:function(ty,pri){
            $rootScope.initdistributions = ty;
            $rootScope.initFright =pri;
        },
        //已注释调用的地方，html没有展示此接口返回的值，注释此接口 产品化1.2
        _computeDeliveryFee:function(mpId,quantity){
            if(this.province.provinceCode){
                var url=$rootScope.host+'/product/distributions';
                var proCityReg = $rootScope.localProvince.lvAreaObj.detailCode;
                var proCityRegArr,provinceCode,cityCode,regionCode;
                if(typeof proCityReg == "string" &&proCityReg.indexOf("_")){
                    proCityRegArr = proCityReg.toString().split("_");
                    provinceCode = proCityRegArr[0];
                    cityCode = proCityRegArr[1];
                    regionCode = proCityRegArr[2];
                }else{
                    provinceCode = proCityReg;
                }
                var config={
                    mpId:mpId,
                    companyId:$rootScope.companyId,
                    //merchantId:$scope.merchantId||"",
                    provinceCode:provinceCode,
                    cityCode:cityCode||"",
                    regionCode:regionCode||"",
                    quantity:quantity
                };
                $rootScope.ajax.get(url,config).then(function(res){
                    if(res.code==0){
                        $rootScope.localProvince.deliveryFeeDesc=[];
                        angular.forEach(res.data, function (v,k) {
                            if(v!=null&&v.distributionMode!=null){
                                $rootScope.localProvince.deliveryFeeDesc.push(v);
                            }
                        })
                        if($rootScope.localProvince.deliveryFeeDesc.length>0){
                            $rootScope.initFright = res.data[0].freight;
                            $rootScope.initdistributions = res.data[0].distributionMode;
                        }else{
                            $rootScope.initFright = 0;
                            $rootScope.initdistributions =$rootScope.i18n('暂无配送服务');
                            $rootScope.outScale=false;
                        }

                    }else{
                        $rootScope.error.checkCode(res.code,res.message);
                    }
                }, function(res){
                    $rootScope.error.checkCode($rootScope.i18n('系统异常'),$rootScope.i18n('获取运费异常'));
                })
            }
        },
        //初始化省份功能
        _init:function(funArray){
            this._checkProvince(funArray);
            this._getLevelsArea(100000,1);
            // this._getProvince();
            //如果用户不设置地址, 默认使用上海

            $rootScope.$watch('localProvince.provinceFlag',function(n,o){
                if ($rootScope.switchConfig.common.showUpdateDistributionAddress) {
                    if(!o&&n&&(!$rootScope.util.getCookies('province')||!$rootScope.util.getCookies("addrDetail")||!$rootScope.util.getCookies("areasCode"))){
                        $rootScope.beforeChoseAdd = true;
                        $rootScope.util.setCookie("addrDetail",{
                            "detail":"上海上海市黄浦区",
                            "detailId":'10_110_1129',
                            "detailCode":'310000_310100_310101'
                        },90);
                        $rootScope.util.setCookie( "areasCode" , {
                            'oneCode' : $rootScope.defaultAreasCode
                        },90);
                        $rootScope.util.setCookie("province",{
                            "provinceId":10,
                            "provinceName":'上海',
                            "provinceCode":310000,
                            "cityId":110,
                            "cityName":'上海市',
                            "cityCode":310100,
                            "regionId":1129,
                            "regionName":'黄浦区',
                            "regionCode":310101
                        },90, $rootScope.cookieDomain);
                        $rootScope.util.setCookie("isAutoArea","no", 90);
                        $rootScope.localProvince._checkProvince();
                    } else {
                        $rootScope.util.setCookie("isAutoArea","no", 90);
                    }
                } else {
                    $rootScope.localProvince.provinceFlag = true;
                }
            })
        }
    };
    //全局添加到购物车
    $rootScope.addCart=function(item,amount,flag,callback){
        //跟踪云埋点 点击就记录
        try{
            window.eventSupport.emit('heimdallTrack',{
                ev: "4",
                pri: item.mpId,
                pvi: item.mpId,
                prm: amount,
                prn: item.name,
                pt: item.categoryName,
                pti: item.categoryId,
                bn: item.brandName,
                bni: item.brandId,
                prp: item.availablePrice
            });
        }catch(err){
            //console.log(err);
        }
        if(typeof flag != 'undefined' && !flag) {
            $rootScope.willchoose = true;
            return false;
        }else if(typeof flag != 'undefined' && flag) {
            $rootScope.willchoose = false;
        }
        var serviceGod = JSON.stringify([{"mpId":$rootScope.serviceGoodId,'num':1}])
        if($rootScope.serviceGoodId===null||$rootScope.serviceGoodId===undefined) {
            serviceGod = null;
        }
        $rootScope.addCartRes={};
        var data = {
            companyId:$rootScope.companyId,
            provinceId: $rootScope.localProvince.province.provinceId,
            sessionId: $rootScope.sessionId,
            mpId: item.mpId,
            num: parseInt(amount),
            additionalItems:serviceGod,
            areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode: $rootScope.defaultAreasCode
        }
        if ($rootScope.switchConfig.common.showChoosePackingMethod) {
            data.productPackageId = item.productPackageId;
        }
        $rootScope.ajax.postFrom($rootScope.host + "/cart/addItem",data).then(function (res) {
            if(res.code==0) {
                if(callback)
                    callback(true);
                $rootScope.addCartRes = res;
                if ($rootScope.switchConfig.guide.search.showPromotionTip) {
                    $rootScope.getCartExt($rootScope.util.paramsFormat(location.href).promotionId);
                }

                $rootScope.$emit('updateMiniCartToParent');//把成功事件传递到父控制器          
            }else{
                $rootScope.error.checkCode(res.code,res.message);
            }
        }, function(res){
            //$log.debug(res);
            $rootScope.error.checkCode($rootScope.i18n('系统异常'),$rootScope.i18n('加入') + $rootScope.i18n($rootScope.switchConfig.common.allCartBtnName) + $rootScope.i18n('异常') + '！');
        });
    };

    //购物车活动促销信息
    $rootScope.getCartExt = function(promotionId) {
        if (!promotionId) {
            return;
        }
        var params = {
            sessionId: $rootScope.sessionId,
            companyId: $rootScope.companyId,
            platformId: $rootScope.platformId,
            promotionId: promotionId,
            areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode: $rootScope.defaultAreasCode,
        };
        $rootScope.ajax.get("/api/cart/ext", params).then(function(res) {
            $rootScope.promotionCartExt = res.data;
        }, function(res) {
            $rootScope.promotionCartExt = {};
        })
    },

    //确定sessionId,如果cookie没有sessionId则生成一个, 未登录时加入购物车的商品， 登陆后根据sessionId添加到当前用户
    $rootScope.checkSessionId=function(){
        if($cookieStore.get('sessionId')){
            // $rootScope.addXiaoNeng($cookieStore.get('sessionId'));
            return $rootScope.sessionId=$cookieStore.get('sessionId');
        }else{
            $rootScope.sessionId=$rootScope.util.randomString(16);
            $rootScope.util.setCookie('sessionId',$rootScope.sessionId,90);
            // $rootScope.addXiaoNeng($rootScope.sessionId);
        }
    };

    //各个页面的共通方法
    $rootScope.execute=function(hasCart){
        //先获取sessionId
        $rootScope.checkSessionId();
        $rootScope.localProvince._init();
    };

    //$rootScope.localProvince._init([$rootScope.getCartTotal,$rootScope.getMiniCart]);

    /**
     * *********Error函数区**********
     * @type {{validateCode: Function, closeTip: Function}}
     * Type类型：info:信息提示，confirm:动作确认，warm:异常警告，error:系统错误
     */
    $rootScope.error={
        defaultConfig:{
            display:false,
            size:'sm',
            btn:false,
            btnCancel:false,
            btnCancelText:$rootScope.i18n('取消'),
            cancel:null,
            btnOK:false,
            btnOKText:$rootScope.i18n('确定'),
            ok:'',
            btnGoBack:false,
            btnGoBackText:$rootScope.i18n('返回'),
            goBack:'',
            btnGoBackUrl:"/index.html",
            message:"",
            isHtml:false,
            title:$rootScope.i18n('提示'),
            close:true,
            data:null
        },
        closeTip:function(){
            $rootScope.errorMessageTip.config.display=false;
        },
        directTo:function(url){
            $rootScope.errorMessageTip.config.display=false;
            location.href=url;
        },
        checkCode:function(code,message,config){
            if(code!=='0' && typeof message!=='undefined'){
                var _config=$rootScope.errorMessageTip.config=angular.copy($rootScope.error.defaultConfig);
                if(_config.display) return;
                _config.display=true;
                config=config||{};
                config.type=config.type||'info';
                _config.size=config.size||_config.size;
                if(typeof config!=='undefined' && typeof config.type!=='undefined'){
                    _config=angular.extend(_config, {
                        message: message || _config.message,
                        btn: true,
                        btnOK: true,
                        btnOKText: config.btnOKText || _config.btnOKText,
                        title: config.title || _config.title,
                        close: config.close || _config.close,
                        ok: config.ok ? function () {
                            config.ok();
                            $rootScope.error.closeTip();
                        } : $rootScope.error.closeTip,
                        isHtml: config.isHtml || _config.isHtml,
                        data:config.data
                    })
                    switch(config.type){
                        case 'info':break;
                        case 'confirm':{
                            _config=angular.extend(_config, {
                                btnCancel: true,
                                btnCancelText: config.btnCancelText || _config.btnCancelText,
                                cancel: config.cancel ? function () {
                                    config.cancel();
                                    $rootScope.error.closeTip();
                                } : $rootScope.error.closeTip
                            })
                            break;
                        };
                        case 'warn':
                        case 'error':
                        {
                            _config=angular.extend(_config, {
                                btnOK: config.btnOK||false,
                                btnGoBack: config.btnGoBack||true,
                                btnGoBackText: config.btnGoBackText || _config.btnGoBackText,
                                btnGoBackUrl: config.btnGoBackUrl || _config.btnGoBackUrl,
                                goBack: config.goBack?function(){config.goBack();$rootScope.error.closeTip();}:$rootScope.error.directTo
                            })
                            break;
                        }
                    }
                }else{
                    _config={
                        type:'info'
                    };
                }
            }
        }
    };

   

    if (!$rootScope.switchConfig.common.showUpdateDistributionAddress) {
        $rootScope.localProvince.provinceFlag = true;
    } else {
        if(!$rootScope.util.getCookies('province')||!$rootScope.util.getCookies("addrDetail")||!$rootScope.util.getCookies("areasCode")){
            // $rootScope.localProvince.provinceFlag = false;
            $rootScope.util.setCookie("addrDetail",{
                "detail":"上海上海市黄浦区",
                "detailId":'10_110_1129',
                "detailCode":'310000_310100_310101'
            },90);
            $rootScope.util.setCookie( "areasCode" , {
                'oneCode': $rootScope.defaultAreasCode
            },90);
            $rootScope.util.setCookie("province",{
                "provinceId":10,
                "provinceName":'上海',
                "provinceCode":310000,
                "cityId":110,
                "cityName":'上海市',
                "cityCode":310100,
                "regionId":1129,
                "regionName":'黄浦区',
                "regionCode":310101
            },90, $rootScope.cookieDomain);
            $rootScope.util.setCookie( "isAutoArea" ,"yes",90);
            $rootScope.localProvince._checkProvince();
        }
    }

    //判断是不是Retina屏
    $rootScope.isRetina = function () {
        var a = "(-webkit-min-device-pixel-ratio: 1.5),(min--moz-device-pixel-ratio: 1.5),(-o-min-device-pixel-ratio: 3/2),(min-resolution: 1.5dppx)";
        if(window.devicePixelRatio > 1){
            return true;
        }
        if(window.matchMedia && window.matchMedia(a).matches) {
            return true;
        }
        return false;
    };
    $rootScope.loadRetinaImg = function () {
        if($rootScope.isRetina()) {
            $rootScope.g_logo = 'logo_2x.png';
            $rootScope.fwbzimg = 'guarantee_2x.png';
            $rootScope.sctelimg = 'service_tel_2x.png';
        }else {
            $rootScope.g_logo = 'logo.png';
            $rootScope.fwbzimg = 'guarantee.png';
            $rootScope.sctelimg = 'service_tel.png';
        }
    }();
    // 晨光中注册登录等页面不展示底部logo图
    if( $rootScope.switchConfig.user.regist.showBottomImg ) {
        let nowCurrentUrl = window.location.href;
        if( nowCurrentUrl.indexOf('login.html') > -1 || nowCurrentUrl.indexOf('cregis.html') > -1 || nowCurrentUrl.indexOf('forgot.html') > -1 || nowCurrentUrl.indexOf('joinProcess.html') > -1 || nowCurrentUrl.indexOf('joinProcessStep.html') > -1) {
            $rootScope.showCgUserHtml = false;
        } else {
            $rootScope.showCgUserHtml = true;
        }
    }
    //在页面中添加小能客服
    // $rootScope.addXiaoNeng = function (sessionId,orderPrice,orderId) {
    //     if ($rootScope.switchConfig.common.customerServiceType == 1) {
    //         var currenyUrl = window.location.href;
    //         var _ut = $rootScope.util.getUserToken();
    //         if( currenyUrl.indexOf('complete.html') > -1 && !orderId ) {
    //             return;
    //         }
    //         var params = {
    //             merchantId: -99,
    //             platformId: 2,
    //             sessionId: sessionId,
    //             pageCode : 4,
    //             companyId:$rootScope.companyId
    //         }
    //         if( currenyUrl.indexOf('item.html') > -1 ) {
    //             var itemId = $rootScope.util.paramsFormat(location.search).itemId
    //         }
    //         $rootScope.ajax.get('/api/social/getCustomerSiteInfo.json', params).then(function (result) {
    //             window.NTKF_PARAM = {
    //                 "siteid": result.data?result.data.siteId: '' /*网站siteid*/,
    //                 "settingid": result.data?result.data.settingId:'' /*代码ID*/,
    //                 "uname": ""/*会员名*/,
    //                 "erpparam": _ut || "" /*会员ID*/,
    //                 "itemid": itemId,
    //                 "itemparam": $rootScope.platformId,
    //                 "orderid": orderId,
    //                 "orderprice": orderPrice
    //             }
    //             if (result.data && result.code == 0) {
    //                 var script = document.createElement('script');
    //                 script.type = 'text/javascript';
    //                 // script.src = 'http://dl.ntalker.com/js/xn6/ntkfstat.js?siteid='+result.data.siteId;
    //                 script.src = 'https://bj-v2-st1000-visitor.ntalker.com/visitor/js/xiaoneng.js?siteid=' + result.data.siteId;
    //                 script.id="xiaonengjs"
    //                 document.body.appendChild(script);
    //                 $rootScope.xiaonengIdtwo = result.data.siteId;
    //                 $rootScope.xiaoNengId = result.data.settingId;
    //                 // $rootScope.xiaoNengAdd();
    //             }
    //             $rootScope.openXiaoNeng = function() {
    //                 NTKF.im_openInPageChat(''+ $rootScope.xiaoNengId +  '')
    //             }
    //          })
    //     }

    // };

    if ($rootScope.util.cookie.getCookie(utName) || $rootScope.switchConfig.common.obtionMerchantInfoWhenNoLogin) {
        $rootScope._getUserInfo();
    }

    // 认证中心跳转福利商城url
    $rootScope.ticket = $rootScope.util.cookie.getCookie('ticket') || '';
    if (window.location.href.match("pcb2c2d5d12d5d1staplesdev.oudianyun.com")) {
        $rootScope.url='http://pcb2cstb.oudianyun.com';
    } else if (window.location.href.match("pcb2c2d5d12d5d1staplestest.oudianyun.com")) {
        $rootScope.url='http://pcb2cstptest.oudianyun.com/lfh';
    }else if (window.location.href.match("pcb2c2d5d12d5d1staplesprod.oudianyun.com")) {
        $rootScope.url='http://www.lfhui.com';
    }
    // SBD暂无线上环境  福利商城线上www.lfhui.com
    if($rootScope.ticket){
        $rootScope.linkUrl = $rootScope.url + '/index.html#?ticket='+$rootScope.ticket;
    }else if(!$rootScope.util.getUserToken()){
        $rootScope.linkUrl = $rootScope.url + '/login.html';
    }else{
        $rootScope.linkUrl = $rootScope.url + '/index.html';
    }
    // 根据 ticket创建ut的接口
    $rootScope.getTicketUT = function(ticket) {
        "use strict";
        $rootScope.ajax.post('/ouser-service/mobileLogin/loginByTicket.do',{ticket:ticket}).then(function(res){
            if(res.code==0 && res.data.ut){
                // $rootScope.util.cookie.setCookie('ut',res.data.ut);
            }else{
                $rootScope.error.checkCode($rootScope.i18n('系统异常'),$rootScope.i18n('系统异常'));
            }
        })
    }

    // 认证中心登录接口
    $rootScope.getTicket = function() {
        var _ut = $rootScope.util.getUserToken();
        if(!_ut) {
            return;
        } else {
            var url = "/ouser-service/userSSO/getTicket.do",
                params = {
                    ut: _ut,
                };
            $rootScope.ajax.postJson(url,params).then(function(res){
                if(res.data){
                    $rootScope.util.cookie.setCookie('ticket',res.data);
                    if($rootScope.util.cookie.getCookie('getTicket')==2){
                        // $rootScope.getTicketUT(res.data);
                        $rootScope.util.cookie.delCookie('getTicket');
                    }
                }else{
                    $rootScope.util.cookie.delCookie('ticket')
                    location.href = '/login.html';
                }
            })
        }
    }
    if($rootScope.util.cookie.getCookie('getTicket')==1){
        // $rootScope.getTicket();
        $rootScope.util.cookie.setCookie('getTicket',2);
    }
    // 调用认证中心退出接口
    $rootScope.removeTicket = function() {
        "use strict";
        $rootScope.ajax.postJson('/ouser-service/userSSO/removeTicket.do',{}).then(function(res){
            if(res.code==0){
                // $rootScope.userExit();
            }else{
                $rootScope.error.checkCode($rootScope.i18n('系统异常'),$rootScope.i18n('系统异常'));
            }
        })
    }
    // 登录状态，每隔一分钟执行一次认证中心ticket接口
    // if($rootScope.util.getUserToken()){
    //     var inter = setInterval(function () {
    //         $rootScope.getTicket();
    //         if(!$rootScope.util.cookie.getCookie('ticket')){
    //             $rootScope.userExit();
    //             clearInterval(inter);
    //         }
    //     }, 60000);
    // }
    //首页点击我的订单, 未登录弹框登录， 已登录跳转订单页
    $rootScope.myOrder = function() {
        var _ut = $rootScope.util.getUserToken();
        if(!_ut) {
            $rootScope.showLoginBox = true;
        } else {
            location.href = "/home.html#/orderList";
        }
    }
    //首页点击我的收藏, 未登录弹框登录， 已登录跳转我的收藏页面
    $rootScope.myFrequence = function() {
        var _ut = $rootScope.util.getUserToken();
        if(!_ut) {
            $rootScope.showLoginBox = true;
        } else {
            location.href = "/home.html#/frequence";
        }
    }
    //首页点击个人信息, 未登录弹框登录， 已登录跳转个人信息
    $rootScope.myDetails = function() {
        var _ut = $rootScope.util.getUserToken();
        if(!_ut) {
            $rootScope.showLoginBox = true;
        } else {
            location.href = "/home.html#/baseInfo";
        }
    }
    //首页点击我的积分，为登录弹框登录，已登录积分页
    $rootScope.myPoints = function() {
        var _ut = $rootScope.util.getUserToken();
        if(!_ut) {
            $rootScope.showLoginBox = true;
        } else {
            location.href = "/home.html#/points";
        }
    }
    //首页点击信用额度，为登录弹框登录，已登录信用额度页
    $rootScope.myIndexCredit = function() {
        var _ut = $rootScope.util.getUserToken();
        if(!_ut) {
            $rootScope.showLoginBox = true;
        } else {
            location.href = "/home.html#/indexCredit";
        }
    }
    //晨光首页点击快速下单，未登录弹框登录，已登录
    $rootScope.quickOrder = function() {
        var _ut = $rootScope.util.getUserToken();
        if(!_ut) {
            $rootScope.showLoginBox = true;
        } else {
            location.href = "/home.html#/quickOrder";
        }
    }
    //首页点击我的礼券，为登录弹框登录，已登录优惠券
    $rootScope.myCouponPage = function() {
        var _ut = $rootScope.util.getUserToken();
        if(!_ut) {
            $rootScope.showLoginBox = true;
        } else {
            location.href = "/home.html#/coupons";
        }
    }
    // 首页点击个人中心, 未登录弹框登录， 已登录跳转首页
    $rootScope.PersonalCenter = function() {
        var _ut = $rootScope.util.getUserToken();
        if(!_ut) {
            $rootScope.showLoginBox = true;
        } else {
            location.href = "/home.html";
        }
    }

    //默认是中文
    $rootScope.locale = $rootScope.util.cookie.getCookie('locale');
    if(!$rootScope.locale){
        $rootScope.util.cookie.setCookie('locale', "", -1);
        $rootScope.util.cookie.setCookie('locale','zh_CN');
        $rootScope.localeName=$rootScope.i18n("切换到国际版");
        $rootScope.locale = 'zh_CN';
     }
     if($rootScope.locale!="zh_CN"&&$rootScope.locale!="en_US"){
        $rootScope.util.cookie.setCookie('locale', "", -1);
        $rootScope.util.cookie.setCookie('locale','zh_CN');
        $rootScope.localeName=$rootScope.i18n("切换到国际版");
        $rootScope.locale = 'zh_CN';
     }
     if($rootScope.locale=="zh_CN"){
        $rootScope.localeName=$rootScope.i18n("切换到国际版");
     }
     if($rootScope.locale=="en_US"){
        $rootScope.localeName=$rootScope.i18n("切换到中文版");
     }
    $rootScope.changLanguage=function(){
        if($rootScope.locale!=""&&$rootScope.locale=="zh_CN"){
            $rootScope.util.cookie.setCookie('locale','en_US');
        }
        if($rootScope.locale!=""&&$rootScope.locale=="en_US"){
            $rootScope.util.cookie.setCookie('locale','zh_CN');
        }
        $rootScope.locale = $rootScope.util.cookie.getCookie('locale');
        $window.location.reload();
    }

    $rootScope.commonFeedbackDataFun = function() {
        $rootScope.obtionImgCaptcha = function() {
            /**
             * 验证码
             */
            var url =  $rootScope.host_ouser + '/mobileRegister/checkImageForm.do';
            var params = {
                width:100,
                height:40,
                codeCount: 4
            }
            $rootScope.ajax.postFrom( url , params ).then( function(res) {
                if( res.code == 0) {
                    $rootScope.commonFeedbackData.bombShow = true;
                    $rootScope.commonFeedbackData.needImgCaptcha = true;
                    var checkImage = 'data:image/png;base64,' + res.image;
                    $rootScope.commonFeedbackData.modelData[1].checkImage = checkImage;
                    $rootScope.commonFeedbackData.modelData[1].errorTip = '';
                    $rootScope.commonFeedbackData.modelData[1].checkImageKey = res.imageKey;
                } else {
                    $rootScope.commonFeedbackData.needImgCaptcha = false;
                    $rootScope.commonFeedbackData.modelData[1].checkImage = '';
                    $rootScope.commonFeedbackData.modelData[1].errorTip = '';
                    $rootScope.commonFeedbackData.modelData[1].checkImageKey = '';
                    $rootScope.commonFeedbackData.bombShow = false;
                    $rootScope.error.checkCode('提示','获取图片验证码异常',{
                        type: 'info'
                    });
                }
            }, function() {
                $rootScope.commonFeedbackData.bombShow = false;
                $rootScope.error.checkCode('提示','获取图片验证码异常',{
                    type: 'info'
                });
            })
        }
        $rootScope.commonFeedbackData = {
            bombShow : true,
            bombName: "意见反馈",
            modelData: [
                {
                    label: "意见内容",
                    content:"",
                    type: 'textarea',
                    maxLength: 200,
                    errorTip: '',
                    placeholder: '请输入',
                },
                {
                    label: "图片验证码",
                    content:"",
                    type: 'imgCaptcha',
                    checkImage: '',
                    checkImageKey: '',
                    maxLength: 4,
                    errorTip: '',
                    placeholder: '请输入',
                    callbackFun: function() {
                        $rootScope.obtionImgCaptcha();
                    }
                }
            ],
            needImgCaptcha: true,
            textDiv: '您的意见将推送给平台客服，他们会帮您解答',
            buttons:[
                {
                    name:"确定",
                    className:"one-button",
                    callback:function(){
                        var content = $rootScope.commonFeedbackData.modelData[0].content;
                        if(!content){
                            $rootScope.commonFeedbackData.modelData[0].errorTip = '请输入要提问的内容';
                            return;
                        }
                        $rootScope.commonFeedbackData.modelData[0].errorTip = '';
                        if (!$rootScope.commonFeedbackData.modelData[1].content) {
                            $rootScope.commonFeedbackData.modelData[1].errorTip = '请输入图片验证码';
                            return;
                        }
                        if (content.length > $rootScope.commonFeedbackData.modelData[0].maxLength) {
                            $rootScope.commonFeedbackData.modelData[0].errorTip = '您输入的内容过长';
                            return;
                        }
                        $rootScope.commonFeedbackData.modelData[0].errorTip = '';
                        var params = {
                            imageKey: $rootScope.commonFeedbackData.modelData[1].checkImageKey,
                            checkImageCode: $rootScope.commonFeedbackData.modelData[1].content,
                        }
                        $rootScope.ajax.postFrom($rootScope.host_ouser + '/api/user/checkImageCaptcha.do' , params ).then( function(res) {
                            if( res.code == 0 ) {
                                $rootScope.commonFeedbackData.modelData[1].errorTip = '';
                                var params = {
                                    content:content,
                                    imageKey: $rootScope.commonFeedbackData.modelData[1].checkImageKey,
                                    checkImageCode: $rootScope.commonFeedbackData.modelData[1].content,
                                };
                                $rootScope.ajax.postFrom("/api/social/live/complain/create", params).then(function(res){
                                    if( res.code == 0 ) {
                                        $rootScope.error.checkCode('提示','意见反馈成功',{
                                            type: 'info'
                                        })
                                        $rootScope.commonFeedbackData.bombShow = false;
                                        if (location.hash == "#/feedback") {
                                            location.reload();
                                        }
                                    } else {
                                        $rootScope.error.checkCode('提示','意见反馈失败,请重试',{
                                            type: 'info'
                                        })
                                    }
                                });
                            } else {
                                $rootScope.commonFeedbackData.modelData[1].errorTip = res.message;
                            }
                        } )
                    }
                },
                {
                    name:"取消",
                    className:"two-button",
                    callback:function(){
                        $rootScope.commonFeedbackData.bombShow = false;
                    }
                }
            ]
        }
        $rootScope.obtionImgCaptcha();
    }
    // 首页点击我的消息, 未登录弹框登录， 已登录我的消息页面
    $rootScope.myMessage = function() {
        var _ut = $rootScope.util.getUserToken();
        if(!_ut) {
            $rootScope.showLoginBox = true;
        } else {
            location.href = "/home.html#/message";
        }
    }
    // 首页头部 待处理订单状态的数值
    $rootScope.pendingOrder = function() {
        var _ut = $rootScope.util.getUserToken();
        if(!_ut) {
            return;
        } else {
            var url = $rootScope.home + allUrlApi.orderSummary,
                params = {
                  orderStatus: "",
                  orderType: "",
                  sysSource: ""
                };
            $rootScope.ajax.postJson(url, params).then(function(res) {
                if( res.code == 0 || res.code === '0' ) {
                    $rootScope.pendingOrderNum = res.data;
                    $rootScope.pendingOrderTotal = $rootScope.pendingOrderNum.unPay + $rootScope.pendingOrderNum.unReceive + $rootScope.pendingOrderNum.unEvaluate;
                }
            })
        }
    }
    $rootScope.pendingOrder();
    //首页头部 未处理消息的数值
    $rootScope.untreatedMes = function() {
        var _ut = $rootScope.util.getUserToken();
        if(!_ut) {
            return;
        } else {
            var url = $rootScope.host + '/social/vl/message/getMsgSummary',
                params = {
                };
            $rootScope.ajax.get(url,params).then(function(res){
                if( res.code == 0 ) {
                    $rootScope.untreatedMesNum = res.data.unReadMsgCount;
                }
            })
        }
    }
    $rootScope.untreatedMes();
    // 晨光首页头部信用额度
    $rootScope.getCgCreditData = function() {
        var url = '/finance-plugin-web/api/cg/queryUserAccount.do';
        var params = {
            ut : $rootScope.util.getUserToken()
        }
        $rootScope.ajax.post( url , params ).then( function( res ) {
            if( res.code == 0 ) {
                $rootScope.cgCommentMyHeadData = res.data;
            }
        } )
    };
    if( $rootScope.switchConfig.index.showCreditData ) {
        $rootScope.getCgCreditData();
    }
    //首页头部 我的收藏数值显示
    $rootScope.myCollection = function() {
        var _ut = $rootScope.util.getUserToken();
        if(!_ut) {
            return;
        } else {
            var url = "/ouser-center/api/favorite/queryFavoriteDetailPage.do",
                params = {
                    currentPage:1,
                    entityType :  1
                };
            $rootScope.ajax.post(url,params).then(function(res){
                if( res.code == 0 ) {
                    $rootScope.myCollectionNum = res.data.total;
                }
            })
        }
    }
    $rootScope.myCollection();
    // 首页头部 我的优惠券数值显示
    $rootScope.validCoupon = function() {
        var _ut = $rootScope.util.getUserToken();
        if(!_ut) {
            return;
        } else {
            var url = $rootScope.host + '/my/coupon/count';
            var params = {
                ut : $rootScope.util.getUserToken()
            }
            $rootScope.ajax.post(url, params).then(function(res) {
                if( res.code == 0 ) {
                    $rootScope.validCouponNum = res.data.canUserCount;
                }
            })
        }
    }
    $rootScope.validCoupon();
    // 晨光底部服务广告广告图片
    $rootScope.getCgBottomImg = function() {
        var url = '/ad-whale-web/dolphin/getAdSource',
            params = {
                pageCode: 'HOME_PAGE',
                adCode: 'service_guarantee',
                platform: 1,
                companyId: $rootScope.companyId
            };
        $rootScope.ajax.get(url, params).then(function (res) {
            if (res.data && res.data.service_guarantee) {
                $rootScope.serviceGuarantee = res.data.service_guarantee[0];
            }
        })
    }
    if( $rootScope.switchConfig.index.showBottomImg ) {
        $rootScope.getCgBottomImg();
    }
    // 首页头部 我的问答数值显示
    $rootScope.getOwnerQaList=function () {
        var _ut = $rootScope.util.getUserToken();
        if(!_ut) {
            return;
        } else {
            var url = "/api/social/consultAppAction/getToAnswerlist.do";
            var params = {
                currentPage: 1,   //当前页码
                itemsPerPage: 10, //每页显示数量
                headerType: 1,   // 0=咨询，1=问答
                userIsAnsweredFlag:0,     //0 待回答列表，1 已回答列表,默认是待回答列表
            }, that = this;
            $rootScope.ajax.postJson(url, params).then(function (res) {
                if (res.code == 0) {
                    $rootScope.myQa = res.data.total;
                }else {
                    $rootScope.myQa = 0;
                }
            }, function (res) {
                $rootScope.myQa = 0;
            });
        }
    };
    $rootScope.getOwnerQaList();

    //滚动加载数据的封装
    $rootScope.scrollLoading = function(options) {
        //只有回调函数，其他参数默认。
        if (typeof options == "function") {
            let cb = options;
            options = {callback: cb};
        }

        let delay = options.delay || 200;
        let triggerHeight = options.triggerHeight || 1000;
        let callback = options.callback;
        let parentEl = options.parentEl || window;  //父容器，用于局部滚动加载
        let childEl = options.childEl || document;  //子容器，用于局部滚动加载
        let busy = false;

        $(parentEl).scroll(function() {
            if (busy) {
                return;
            }

            //检查是否已到触发加载的高度
            if ($(parentEl).scrollTop() + $(parentEl).height() + triggerHeight > $(childEl).height() ) {
                busy = true;

                setTimeout(function() {
                    busy = false;
                    callback();
                }, delay);

            }
        });

    };
    $rootScope.obtionFilterBtns = function(defaultBtn,orderStatus,orderSource,presellStatus) {
        //pc的物流不属于按钮
        var orderBtnList = [];
        switch(orderStatus) {
            case $rootScope.switchConfig.orderStatus.toPay: //待支付 => 去支付、取消订单、再次购买 or 支付定金、支付尾款、取消订单、再次购买
                var sortKey = ['canPay','canRecart'];
                if (orderSource==$rootScope.switchConfig.orderSource.presell) {
                    if (presellStatus == 10) {
                        sortKey = ['canPayBooking','canRecart'];
                    }
                    if (presellStatus == 20 || presellStatus == 30 || presellStatus == 25) {
                        sortKey = ['canPayRemaining','canRecart'];
                    }
                }
                orderBtnList = $rootScope.sortAndFilterArr(sortKey, defaultBtn, 'ody-btn-xs-theme');
                break;
            case $rootScope.switchConfig.orderStatus.paid:
            case $rootScope.switchConfig.orderStatus.confirm:
            case $rootScope.switchConfig.orderStatus.confirmed:
            case $rootScope.switchConfig.orderStatus.audit:
            case $rootScope.switchConfig.orderStatus.delivery: //已支付,待确认,已确认,待审核,待发货 => 申请售后、批量售后、再次购买
                var sortKey = ['canBatchAfterSafe','canRecart'];
                orderBtnList = $rootScope.sortAndFilterArr(sortKey, defaultBtn);
                break;
            case $rootScope.switchConfig.orderStatus.delivered: //已发货,待收货 => 确认收货、查看物流、申请售后、批量售后、再次购买
                var sortKey = ['canConfirmReceive','canBatchAfterSafe','canRecart'];
                orderBtnList = $rootScope.sortAndFilterArr(sortKey, defaultBtn);
                break;
            case $rootScope.switchConfig.orderStatus.received: //已签收，待评价 => 去评价、查看物流、申请售后、再次购买、批量售后
                var sortKey = ['canReview','canRecart','canBatchAfterSafe'];
                orderBtnList = $rootScope.sortAndFilterArr(sortKey, defaultBtn);
                break;
            case $rootScope.switchConfig.orderStatus.completed: //已完成 => 查看物流、申请售后、删除订单、再次购买、批量售后
                var sortKey = ['canDelete','canRecart','canBatchAfterSafe'];
                orderBtnList = $rootScope.sortAndFilterArr(sortKey, defaultBtn);
                break;
            case $rootScope.switchConfig.orderStatus.closed: //已关闭，已取消 => 删除订单、再次购买
                var sortKey = ['canDelete','canRecart'];
                orderBtnList = $rootScope.sortAndFilterArr(sortKey, defaultBtn);
                break;
            default:
                orderBtnList = defaultBtn;
                break;
        }
        return orderBtnList;
    };
    $rootScope.sortAndFilterArr = function(sortKey, defaultBtn, btnClass) {
        var btnList = [];
        for (var i = 0; i < sortKey.length; i++) {
            for (var j = 0; j < defaultBtn.length; j++) {
                if (defaultBtn[j].key == sortKey[i]) {
                    if (i==0) {
                        if (!btnClass) {
                            defaultBtn[j].className = 'ody-btn-xs-theme-plain1';
                        } else {
                            defaultBtn[j].className = btnClass;
                        }
                    }
                    if (defaultBtn[j].key=='canDelete' || defaultBtn[j].key=='canCancel') {
                        defaultBtn[j].className = 'ody-btn-xs-default-plain1 notBright';
                    }
                    btnList.push(defaultBtn[j]);
                    defaultBtn.splice(j, 1);
                    j--;
                }
            }
        }
        // 优先显示按钮跟剩余按钮合并， 然后将false的过滤
        return btnList.concat(defaultBtn).filter(item => item.show);
    };
    //获取总数, 最多显示99,多余99显示99+
    $rootScope.getCartTotal = function() {
        $rootScope.ajax.postFrom($rootScope.host + "/cart/count",{
            companyId: $rootScope.companyId,
            sessionId: $rootScope.sessionId,
            areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode: $rootScope.defaultAreasCode
        }).then(function (res) {
            if (res.code == 0) {
                $rootScope.cartTotal = res.data;
                if ($rootScope.cartTotal > 99) {
                    $rootScope.cartTotal = '99+';
                }
            } else {
                $rootScope.cartTotal = 0;
            }
        });
    };

    /**
     * 获取订单字典数据
     * @param code 字典code
     * @param callback 回调方法
     */
    $rootScope.getOrderDictionary = function(code,callback){
        var url = '/oms-api/public/order/code/listByCategory/' + code;
        $rootScope.ajax.get(url,{}).then(function (res) {
            if (res.code == 0 && res.data) {
                if (callback){
                    callback(res.data);
                }
            }
        })
    };

    // 获取商品系列品数据
    $rootScope.getSerialProductsData = function (mpId,callback) {
        var url = "/back-product-web2/extra/merchantProduct/getSerialProductByParam.do";
        var params = {
            mpId : mpId,
            canSale:1
        }
        $rootScope.ajax.postJson( url , params ).then( function ( res ) {
            $rootScope.serialProducts = res.data;
            let serialProductData = {
                attributes : [],
                serialProducts : []
            };
            // 声明一个空数组，用来存放系列品id
            let serialProductsId = [];
            // 申明一个空数组 用来存放系列属性标题
            let attrNameArr = [];
            // 判断数据中是否返回系列属性
            if( res.data[0].serialAttrList && res.data[0].serialAttrList.length > 0 ) {
                // 因为系列品标题都是一样的，所以取第一个系列品属性标题即可
                for ( let w = 0 ; w < res.data[0].serialAttrList.length ; w++ ) {
                    // 将系列品属性标题放入 attrNameArr中
                    attrNameArr.push( res.data[0].serialAttrList[w].attrName );
                }
                //  判断 attrNameArr中是否有值
                if( attrNameArr && attrNameArr.length > 0 ) {
                    for( let o = 0 ; o < attrNameArr.length > 0 ; o ++ ) {
                        // 循环 attrName把里面的系列品属性标题存放在 事先定义好的数组中
                        serialProductData.attributes.push( { "name" : attrNameArr[o] } );
                    }
                    //  判断 serialProductData.attributes中是否有值
                    if( serialProductData.attributes && serialProductData.attributes.length > 0 ) {
                        for( let k = 0 ; k < serialProductData.attributes.length > 0 ; k++ ) {
                            // 循环serialProductData.attributes给每个serialProductData.attributes里面添加一个values数组属性
                            serialProductData.attributes[k].values = [];
                        }
                    }
                }
            }
            for( let i = 0 ; i < res.data.length; i++ ) {
                if( res.data[i].serialAttrList && res.data[i].serialAttrList.length > 0 ) {
                    // 事先声明一个空数组 用来装系列品组合出来所对应的id
                    let keyArr = [];
                    for( let j = 0 ; j < res.data[i].serialAttrList.length ; j++ ) {
                        // 存放在 serialProductData.serialProducts[x]中字段key属性里
                        keyArr.push( res.data[i].serialAttrList[j].valueId );

                        // 判断 serialProductData.attributes中是否有值
                        if( serialProductData.attributes && serialProductData.attributes.length > 0 ) {
                            for( let k = 0 ; k < serialProductData.attributes.length > 0 ; k++ ) {
                                // 将每一个系列品属性存放在 与系列品属性标题同级的字段values中
                                if( serialProductData.attributes && serialProductData.attributes.length > 0 ) {
                                    if( serialProductData.attributes[k].name == res.data[i].serialAttrList[j].attrName ) {
                                        if (serialProductData.attributes[k].values.filter(item=>item.id == res.data[i].serialAttrList[j].valueId).length > 0){
                                            continue;
                                        } else {
                                            serialProductData.attributes[k].values.push( { "value" : res.data[i].serialAttrList[j].valueName , "id" : res.data[i].serialAttrList[j].valueId } )
                                        }
                                    }
                                }
                            }
                        }
                    }
                    serialProductsId.push(res.data[i].mpid );
                    serialProductData.serialProducts.push( { "key" :'_' + keyArr.join(',').replace(/\,/g,'_') + '_', "product" : { "mpId" : res.data[i].mpid , "name" : res.data[i].chineseName , "typeOfProduct" : 0 } } );
                }
            }
            if( serialProductData.serialProducts && serialProductData.serialProducts.length > 0 ) {
                for( let i = 0 ; i < serialProductData.serialProducts.length ; i++ ) {
                    serialProductData.serialProducts[i].product.securityVOList = [];
                    serialProductData.serialProducts[i].product.pictureUrlList = [];
                }
            }
            // 检查所有系列品在一定区域是否可售
            function checkSerialProducts() {
                var areasCodeOneCode;
                if( $rootScope.areasCode ) {
                    areasCodeOneCode = $rootScope.areasCode.oneCode;
                } else if ( $rootScope.util.getCookies("areasCode") ) {
                    $rootScope.areasCode = JSON.parse($rootScope.util.getCookies("areasCode"));
                    areasCodeOneCode = $rootScope.areasCode.oneCode;
                }
                return new Promise( ( resolve , reject ) => {
                    $rootScope.ajax.get( "/search/rest/checkMpSaleArea.do" , {mpIds : serialProductsId.join(','),areaCode : areasCodeOneCode}).then( function(result) {
                        if( result.code == 0 && result.data ) {
                            if( serialProductData.serialProducts && serialProductData.serialProducts.length > 0 ) {
                                for ( let o = 0 ; o < serialProductData.serialProducts.length ; o++ ) {
                                    for ( let k in result.data ) {
                                        if ( serialProductData.serialProducts[o].product.mpId == k ) {
                                            serialProductData.serialProducts[o].product.isAreaSale = result.data[k];
                                        }
                                    }
                                }
                                resolve();
                            }
                        } else {
                            resolve();
                        }
                    } , function (result) {
                        resolve();
                    } )
                } )
            };
            // 获取商品保障方式接口
            function getSecurities() {
                return new Promise( ( resolve , reject ) => {
                    $rootScope.ajax.postJson( "/back-product-web2/extra/merchantProduct/listMerchantProductSecuritiesByMpIds.do" , { mpIds : serialProductsId}).then( function ( result ) {
                        if( result.code == 0 && result.data && result.data.length > 0 ) {
                            if( serialProductData && serialProductData.serialProducts && serialProductData.serialProducts.length > 0 ) {
                                for( let i = 0 ; i < serialProductData.serialProducts.length ; i++ ) {
                                    for ( let j = 0 ; j < result.data.length ; j++ ) {
                                        if( serialProductData.serialProducts[i] && serialProductData.serialProducts[i].product ) {
                                            if( serialProductData.serialProducts[i].product.mpId == result.data[j].merchantProductId ) {
                                                serialProductData.serialProducts[i].product.securityVOList.push( result.data[j] );
                                            }
                                        }
                                    }
                                }
                            }
                            resolve();
                        } else {
                            resolve();
                        }
                    } , function( result ) {
                        resolve();
                    } )
                } )
            };
            // 获取商品图片接口
            function getItemPics() {
                return new Promise( ( resolve , reject ) => {
                    $rootScope.ajax.postJson( "/back-product-web2/extra/merchantProduct/getMerchantProductMediaByParam.do" , { mpIds : serialProductsId }).then( function ( result ) {
                        if( result.code == 0 && result.data && result.data.length > 0 ) {
                            if( serialProductData && serialProductData.serialProducts && serialProductData.serialProducts.length > 0 ) {
                                for( let i = 0 ; i < serialProductData.serialProducts.length ; i++ ) {
                                    for( let k = 0 ; k < result.data.length ; k++ ) {
                                        if( serialProductData.serialProducts[i] && serialProductData.serialProducts[i].product ) {
                                            if( serialProductData.serialProducts[i].product.mpId == result.data[k].merchantProductId ) {
                                                serialProductData.serialProducts[i].product.pictureUrlList.push( result.data[k] );
                                            }
                                        }
                                    }
                                }
                            }
                            resolve();
                        } else {
                            resolve();
                        }
                    }, function( result ) {
                        resolve();
                    } )
                } )
            };
            // 获取商品是否上下架接口
            function getItemCansaleType () {
                return new Promise( ( resolve , reject ) => {
                    $rootScope.ajax.post( "/search/rest/queryMpCanSale" , { mpIds : serialProductsId.join(',') } ).then( function( res ) {
                        if( res.code == 0 && res.data && res.data.dataList && res.data.dataList.length > 0 ) {
                            if( serialProductData && serialProductData.serialProducts && serialProductData.serialProducts.length > 0 ) {
                                for( let i = 0 ; i < serialProductData.serialProducts.length ; i++ ) {
                                    for( let k = 0 ; k < res.data.dataList.length ; k++ ) {
                                        if( serialProductData.serialProducts[i] && serialProductData.serialProducts[i].product ) {
                                            if( serialProductData.serialProducts[i].product.mpId == res.data.dataList[k].mpId  ) {
                                                serialProductData.serialProducts[i].product.managementState = res.data.dataList[k].canSale;
                                            }
                                        }
                                    }
                                }
                            }
                            resolve();
                        } else {
                            resolve();
                        }
                    } , ( res ) => {
                        resolve();
                    } )
                } )
            };
            Promise.all( [ checkSerialProducts(), getSecurities(), getItemPics(), getItemCansaleType() ] ).then( ( result ) => {
                if( callback ) {
                    callback(serialProductData)
                }
            } )
        } )
    }

    //返回顶部
    $rootScope.backToTop = function () {
        $("html,body").animate({
            scrollTop: 0
        }, 500);
    }
    $(window).scroll(function (e) {
        // console.log($(window).scrollTop());
        if($(window).scrollTop() > $(window).height()) {
            $('.global-bg .back-to-top').show()
        } else {
            $('.global-bg .back-to-top').hide()
        }
    })
    /**
     * animateCss扩展方法
     * @param {Node} element dom节点
     * @param {String} animationName animateCss动画名称
     * @param {Function} callback 动画完成后回调函数
     * */
    $rootScope.animateCss = function animateCSS(element, animationName, callback) {
        const node = document.querySelector(element)
        node.classList.add('animated', animationName)

        function handleAnimationEnd() {
            node.classList.remove('animated', animationName)
            node.removeEventListener('animationend', handleAnimationEnd)

            if (typeof callback === 'function') callback()
        }

        node.addEventListener('animationend', handleAnimationEnd)
    }
    /**
    * 获取商品价格
    * @param {Array} itemArray 查询的商品数组
    * @return {Array} resultArray  带价格的返回结果
    * */
    $rootScope.getPrice = function (itemArray) {
        var mpIds = itemArray.map(v => v.mpId).join(',');
        return new Promise((resolve, reject) => {
            $rootScope.ajax.get('/api/realTime/getPriceStockList',
                {mpIds, areaCode:$rootScope.util.getCookies("areasCode")?JSON.parse($rootScope.util.getCookies("areasCode")).oneCode: $rootScope.defaultAreasCode})
                .then(res => {
                    if  (res.code == 0) {
                        var resultArray = itemArray.map( v => {
                            v = $.extend(v,res.data.plist.find(pv => pv.mpId === v.mpId))
                            return v
                        });
                        resolve(resultArray)
                    } else {
                        reject(res)
                    }
                }).catch(e => {
                    console.log(e)
            })
        })
    }
}]);
$(function(){
    //置顶
    $('.top-box').click(function(){
        $("html,body").animate({scrollTop:0}, 500);
    })
});