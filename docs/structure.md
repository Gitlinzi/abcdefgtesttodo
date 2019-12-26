#pc开发注意事项
    1. 公共的方法提到commonService中, 文档见 docs.md
    2. 开发注意兼容ie, 文档见 compatibleIE.md
    3. 颜色使用 i-var.less定义的, 没有的找相近, 再没有自己添加, 比如像#3a3a3a这样的样式不要再用， 要用#333代替
    4. 请求api使用 $rootScope.ajax.post、$rootScope.ajax.get， $rootScope.ajax.put, 为了后期加loading
    5. 多个页面公共的可以提成指令或者ng-include
    6. 不同项目同一个页面一点都不相同的地方， 抽成ng-include页面， 方便以后覆盖    **** 不同的地方需要在项目结构中加备注****
    7. 新添的页面在这边同步一下， 加备注
    8. less中不要使用标签定义样式,比如给span加样式， 不要span{}; 要给span加class
    9. i-mixin.less提供了兼容浏览器的function
    10.要求带公司商标的图片放到一个文件夹， 到时候可以统一替换
    11.全局的配置文件，在common下的app.constant.js
    12.对于修改了dom的html抽成ng-include方便以后覆盖
    13. angular for循环解决跳出循环
        var keepGoing = true;
        angular.forEach([0,1,2], function(count){
            if(keepGoing) {
                if(count == 1){
                     keepGoing = false;
                }
             }
        });
# 项目结构
有不一样页面加备注
```
    env:                            全局配置文件
        config.js                   存放公共的配置 ***每个项目的配置都不一样***
        dev.properties
        online.properties
        stg.properties
        test.properties
    mockdata                        用于本地测试， 但需要使用花瓶
        cmsDirective.js             本地测试cms的指令
        hotword.json                热搜
        templateJS.json
    src:
        common
            css: 主样式(想用哪个样式可以include引入)
                i-base.less                                      项目主样式
                i-breadcrumb.less                                面包屑样式
                i-directives.less                                指令样式
                i-dropdown.less                                  下拉菜单样式
                i-footer.less                                    底部样式
                i-form.less                                      form, input样式
                i-globel-nav.less                                右侧固定导航
                i-header-nav.less                                头部导航
                i-header.less                                    头部样式
                i-icon.less                                      图片样式
                i-location.less                                  地址样式
                i-mixin.less                                     提供公共的function
                i-paging.less                                    分页样式
                i-sctollbar.less                                 筛选工具条
                i-tabs.less                                      tab样式
                i-var.less                                       全局的颜色样式,                             ***每个项目不一样***
            cmsDirective.js         cms的指令(为了兼容ie， 以后都以A属性的方式调用),    ***使用方法见 docs.md***
            commonService.js        公共代码数据绑到$rootscope,                         ***使用方法见 docs.md***
            directive.js            写自己的指令(为了兼容ie， 以后都以A属性的方式调用), ***使用方法见 docs.md***
                1. sideLayout                                    登录成功的左边菜单栏,dataList会根据权限过滤
                2. goodsItem                                     商品列表,                                   ***配置是不是显示加入购物车***
                3. odyCarousel                                   首页/服务中心图片显示/轮翻,serveLunBo图片对象集合数组
                4. pwCheck                                       比较两个值是否一致
                5. pagination                                    分页
                6. addCart                                       商品列表页添加到购物车
                   miniAddCart                                   商品列表页添加到购物车
                7. addToCart                                     商品详情,列表， 渠道会员下单添加到购物车
                8. searchProperty                                品牌,导购属性与商品类目搜索的选择指令， 支持多选和单选， 一旦选择刷新页面
                9. crumb                                         搜索页的面包屑
                10. recommendGoods                               商品详情页的推荐商品|猜你喜欢               ***配置显示不同信息***
                11. searchBar                                    顶部大的搜索框
                12. miniCart                                     顶部的迷你购物车
                13. countDown                                    秒杀倒计时
                14. bombBox                                      弹框组件调用
                15. settleTips                                   订单支付页没有地址弹框
                16. goodDetailBomb                               我要提问弹框， 目前商品咨询/问大家 使用
                17. loginBomb                                    ut没有时显示登录弹框                        ***配置显示不同页面***
                18. tipsPopup
                19. ngEnter                                      回车事件， 用于登录页面的回车登录
                20. pcUploadImage                                上传单个图片， 比如增票资质， 注册成为渠道会员
                21. opUploadMoreImage                            上传多个个图片
                22. checkCodeTip                                 调用checkCode的弹框
                23. cartCheckCodeTip                             购物车页面调用checkCode的弹框
        images: ***要求带公司商标的图片放到一个文件夹， 到时候可以统一替换***
        includes：ng-include引入的文件， 不同的模块不同的文件夹 (后期会把不用的删掉)
            member:                                              目前没有文件， 以后会模块化
                info
                order
            _address.html                                        地址列表   ***配置显示不同页面***
            _addressEdit.html                                    创建地址，修改地址  ***html和样式不同，直接覆盖***
            _bindMobile.html                                     绑定手机   ***来伊份有，欧普没有***
            _footnav.html                                        底部样式(未使用)
            _haedernav.html                                      顶部样式(未使用)
            _invoice.html                                        增票资质页面(未使用)
            _location.html                                       选择地址的弹框
            _modify.html                                         修改密码   ***html和样式不同，直接覆盖***
            _regisagmt.html                                      注册协议, 暂时没有用
            _searchlist.html                                     搜索页使用  ***html和样式不同，直接覆盖***
            _signboard.html                                      店铺分类(目前未使用)
            _storeIndex.html                                     热门产品列表(目前未使用)
            _storeinfo.html                                      店铺的客服中心(目前未使用)
            _unbindMobile.html                                   解绑手机   ***来伊份有，欧普没有***
            cart-footer.html                                     购物车，支付页的底部文件   ***html和样式不同，直接覆盖***
            footer.html                                          除了购物车,支付页的底部文件     ***html和样式不同，直接覆盖***
            global-nav.html                                      右侧项目导航     ***html和样式不同，直接覆盖***
            header.html                                          除了注册之类的,订单,个人中心,购物车,支付页的头部文件   ***html和样式不同，直接覆盖***
            member-side.html                                     会员中心菜单栏(未使用)
            my-header.html                                       订单,个人中心的头部文件         ***个人中心下拉一点都不一样， 需要覆盖***
            script.html                                          引js    ***来伊份有，欧普没有***
            side-left-nav.html                                   导购     ***来伊份有，欧普没有***
            trace.html                                           联系在线客服(未使用)
            trade-header.html                                    购物车,支付页的头部文件   ***html和样式不同，直接覆盖***
            userheader.html                                      注册之类的头部文件
        pages: 不同的url不同的文件夹
            error
                404     ***来伊份有，欧普没有***
                500     ***来伊份有，欧普没有***
            guide: 商品详情和search页面 (不同的地方在指令中控制了)
                item.html                                        商品详情页      ***图片大小，左右箭头，手机支付购买的样式有些不一样***
                item.js
                item.less
                search.html                                      搜索页        ***来伊份搜索条件多了一个自营，列表多了剑术增减和加入购物车按钮***
                search.js
                search.less
            help: 帮助中心
                help.html                                        帮助中心       ***目前是一样，来伊份没有帮助中心的UI***
                help.js
                heml.less
                helpDetail.html
                helpDetail.js
                helpDetail.less
                helpList.html
                helpList.js
                helpList.less
            my: home页面，个人中心， 订单信息等， 使用的路由， 对于这个模块一定会走home.js
                account
                    account-add-password.controller.js           添加密码(目前未使用)
                    account-add-password.template.html
                    account-address.controller.js                收货地址页      ***样式有点不一样，添加新地址的按钮放的位置不一样***
                    account-address.template.html
                    account-authentication.controller.js         我的会员        ***欧普有，来伊份没有***
                    account-authentication.template.html
                    account-baseinfo.controller.js               个人信息        ***一样，就是来伊份没有邮编的会员成长值***
                    account-baseinfo.template.html
                    account-bind.controller.js                   账号绑定        ***来伊份有用，欧普没有用***
                    account-bind.template.html
                    account-bind-mob.controller.js               绑定手机(目前未使用)
                    account-bind-mob.template.html
                    account-invoice.controller.js                增票资质        ***基本一样，有点颜色样式不一样***
                    account-invoice.less
                    account-invoice.template.html
                    account-modify.controller.js                 账户安全       ***欧普多了手机验证***
                    account-modify.template.html
                after-sale: (目前无用)
                    afterSaleDetail.html
                    afterSaleList.html
                    afterSaleList.less
                    afterSaleProgList.html
                    applyAfterSale.html
                    member-afterSale.js
                index-after-sale
                    index-after-sale.controller.js                售后详情      ***布局，字段有点变化，来伊份是重新切得页面***
                    index-after-sale.less
                    index-after-sale-apply.template.html          售后申请      ***页面是重新切得，功能一样，少了维修说明***
                    index-after-sale-consult.controller.js
                    index-after-sale-consult.less                 售后咨询      ***来伊份没这个功能，欧普有***
                    index-after-sale-consult.template.html
                    index-after-sale-detail.template.html
                    index-after-sale-list.controller.js           售后列表      ***布局，字段有点变化，来伊份是重新切得页面***
                    index-after-sale-list.less
                    index-after-sale-list.template.html
                    index-after-sale-prog-list.template.html
                index-bill
                    index-bill.controller.js                      我的发票      ***欧普有，来伊份没有***
                    index-bill.less
                    index-bill.template.html
                    index-bill-list.less                          发票列表      ***欧普有，来伊份没有***
                    index-bill-list.template.html
                index-comment
                    index-chase-comment.controller.js             追加商品评价    ***欧普有，来伊份没有***
                    index-chase-comment.less
                    index-chase-comment.template.html
                    index-comment.controller.js                   评价晒单列表    ***html和样式不同，直接覆盖***
                    index-comment.less
                    index-comment.template.html
                    index-go-comment.controller.js                商品评价          ***欧普有，来伊份没有***
                    index-go-comment.less
                    index-go-comment.template.html
                    index-look-comment.controller.js              查看商品评价        ***欧普有，来伊份没有***
                    index-look-comment.less
                    index-look-comment.template.html
                index-consult
                    index-consult-list.controller.js              购买咨询          ***欧普有，来伊份没有***
                    index-consult-list.less
                    index-consult-list.template.html
                index-favorite
                    index-favorite-goods.controller.js            关注的商品         ***html和样式不同，直接覆盖***
                    index-favorite-goods.less
                    index-favorite-goods.template.html
                    index-favorite-store.controller.js            浏览的商品         ***html和样式不同，直接覆盖***
                    index-favorite-store.less
                    index-favorite-store.template.html
                    index-track.controller.js                     未实现
                    index-track.template.html
                index-member
                    index-member-channel.controller.js            渠道会员下单        ***好像没用到***
                    index-member-channel.less
                    index-member-channel.template.html
                index-order
                    index-order.controller.js                     订单列表              ***来伊份div样式重新切了***
                    index-order-detail.less
                    index-order-detail.template.html              订单详情              ***来伊份div样式重新切了***
                    index-order-frequence.controller.js           收藏的商品         ***html和样式不同，直接覆盖***
                    index-order-frequence.less
                    index-order-frequence.template.html
                    index-order-list.less
                    index-order-list.template.html                订单列表          ***来伊份div样式重新切了***
                    index-order-subsidy.controller.js             补购订单          ***来伊份没这个功能，欧普有***
                    index-order-subsidy.less
                    index-order-subsidy.template.html
                    often-buy.controller.js                       常购清单          ***来伊份有，欧普没有***
                    often-buy.less
                    often-buy.template.html
                index-property
                    award.controller.js                           奖品                ***功能一样，外面框div重新写了***
                    award.less
                    award.template.html
                    ECart.controller.js                           伊点卡           ***来伊份有，欧普没有***
                    ECart.less
                    ECart.template.html
                    edou.controller.js                            伊豆            ***来伊份有，欧普没有***
                    edou.less
                    edou.template.html
                    index-property-coupons.controller.js          优惠券           ***功能一样，外面框div重新写了***
                    index-property-coupons.less
                    index-property-coupons.template.html
                    index-property-points.controller.js           积分            ***功能一样，外面框div重新写了***
                    index-property-points.less
                    index-property-points.template.html
                    receive-award.controller.js                   领取奖品          ***功能一样，来伊份div样式重新切了***
                    receive-award.less
                    receive-award.template.html
                    UCart.controller.js                           悠点卡           ***来伊份有，欧普没有***
                    UCart.less
                    UCart.template.html
                    voucher.controller.js                         提货券           ***来伊份有，欧普没有***
                    voucher.less
                    voucher.template.html
                index-question
                    index-question-answer.controller.js           回答问题          ***欧普有，来伊份没有***
                    index-question-answer.less
                    index-question-answer.template.html
                    index-question-detail.controller.js           查看回答          ***欧普有，来伊份没有***
                    index-question-detail.less
                    index-question-detail.template.html
                    index-question-list.controller.js             我的问答          ***欧普有，来伊份没有***
                    index-question-list.less
                    index-question-list.template.html
                message
                    message.controller.js                         消息中心
                    message.less
                    message.template.html
                sale-repair
                    apply-repair.controller.js                    申请维修          ***欧普有，来伊份没有***
                    apply-repair.template.html
                    apply-repair-detail.controller.js             维修详情          ***欧普有，来伊份没有***
                    apply-repair-detail.template.html
                    sale-repair.controller.js                     维修列表          ***欧普有，来伊份没有***
                    sale-repair.less
                    sale-repair.template.html
                    sale-repair-prog.controller.js                维修进度          ***欧普有，来伊份没有***
                    sale-repair-prog.template.html
                home.html                    主页, 使用的路由                                ***左侧菜单栏不一样，配置显示不同页面***
                home.js                      主页js  ***每个项目的配置都不一样***
                home.less                    主页css 包含个人中心及订单的css
                index-side.template.html
                index.controller.js
                index.template.html
            nav: 积分商城
                integral.html                                     积分商城首页        ***欧普有，来伊份没有***
                integral.js
                integral.less
                integralList.html                                 积分商城商品列表    ***欧普有，来伊份没有***
                integralList.js
                integralList.less
                integralSearch.html                               积分搜索页           ***欧普有，来伊份没有***
                integralSearch.js
                integralSearch.less
                serve.html                                        上门服务              ***欧普有，来伊份没有***
                serve.js
                serve.less
                trial.html                                        试用中心              ***欧普有，来伊份没有***
                trial.js
                trial.less
                trialApply.html                                   试用申请          ***欧普有，来伊份没有***
                trialApply.js
                trialApply.less
                trialDetail.html                                  试用详情          ***欧普有，来伊份没有***
                trialDetail.js
                trialDetail.less
                trialReport.html                                  试用报告          ***欧普有，来伊份没有***
                trialReport.js
                trialReport.less
                trialReportFill.html                              填写试用报告        ***欧普有，来伊份没有***
                trialReportFill.js
                trialReportFill.less
            store: 门店
                store.html                                        门店列表
                store.js
                store.less
            trade: 购物车， 结算页， 支付页，支付成功页
                cart.html                                       购物车                 ***html和样式不同，直接覆盖***
                cart.js
                cart.less
                complete.html                                     支付成功              ***html和样式稍微有点不同***
                complete.js
                complete.less
                payment.html                                      支付页           ***地址一点都不一样， 修改覆盖***
                payment.js
                payment.less
                settlement.html                                   结算页           ***html和样式不同，直接覆盖***
                settlement.js
                settlement.less
            user: 登录，注册，修改密码
                binding.html                                      绑定账号          ***来伊份有，欧普没有***
                binding.js
                binding.less
                cregis.html                                       注册页
                enterprise.html                                   企业注册
                enterprise.js
                enterprise.less
                forgot.html                                       忘记密码
                forgot.js
                login.html                                        登录
                login.js
                login.less
                personalRegister.js                               个人注册
                regis.less
                success.html                                      成功页
                unionlogin.html                                   联合登录
                union-login.js
            index.html                                            首页
            index.js
            index.less

            bulletin.js                                           公告
            bulletin.less
            bulletin01.html
            joining.html                                          商家入驻
            joining.js
            maintenance.html
            preview.html
            preview.js
            security-content.html
            support.js
        app.js                      入口配置文件
    compatibleIE.md                 ie使用文档
    structure.md                    项目文档， 及开发pc的注意事项
    docs.md                         使用文档
    online-server-config.js         项目配置文件
    oupu-server-config.js           项目配置文件
```
