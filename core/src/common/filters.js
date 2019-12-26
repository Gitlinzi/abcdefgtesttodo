angular.module('filters')
/*
    *format长度
    *value: 值
    *max： 最大多少个
    *tail： 超过多少后面拼的符号
    *使用方法： {{text | textLengthFormat : 20 : '...'}}
*/
.filter('textLengthFormat', [function() {
    return function(value, max, tail) {
        if (!value) return '';
        //化为整数
        max = parseInt(max, 10);

        if (!max) return value;

        if (value.length <= max) return value;
        //截取长度
        value = value.substr(0, max);
        //默认拼接...
        return value + (tail || '...');//'...'可以换成其它文字
    };
}])
/*
    *format长度
    *value: 值
    *max： 最大小数点
    *tail： 超过多少后面拼的符号
    *使用方法： {{text | discountFormat : 2}}
*/
.filter('discountFormat', [function() {
    return function(value, max) {
        if (!value) return '';
        //化为整数
        max = Math.round(max) || 1;
        value = Number(value * 10);
        var num = Number(Math.pow(10,max));
        //去除小数点最后的0
        return Math.round(value * num) / num;
    };
}])
//截取长度6, 不建议使用， 使用textLengthFormat
.filter('itemFormat',[function(){
    "use strict";
    return function(input,long){
        if(typeof input !=='string' || typeof input ==='string' && input.length<=6)
            return input;
        else{
            return input.substr(0,6) + '...';
        }
    };
}])
//格式化数字， 去除多余的逗号, 目前未使用
//{{num |formatNum: true}}
.filter('formatNum',[function(){
    "use strict";
    return function(input,format){
        if(typeof input==='undefined') return 0;
        else if(typeof input==='string') {
            if (format) {
                return parseInt(input.replace(',', ''));
            } else {
                return parseInt(input);
            }
        }
        return input;
    };
}])
//格式化为标准时间: 01天01小时01分01秒
//{{time |timeFormat}}
.filter('timeFormat',['$window','$rootScope',function($window,$rootScope){
    "use strict";
    //国际化
    $rootScope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
    return function(surplusTime){
        surplusTime=parseInt(surplusTime);
        if(!surplusTime || surplusTime <= 0) {
            return '0' + $rootScope.i18n('秒');
        }
        var s = surplusTime>=60?surplusTime%60:surplusTime;
        var m = parseInt((surplusTime>=3600?surplusTime%3600:surplusTime)/60);
        var h = parseInt((surplusTime>=86400?surplusTime%86400:surplusTime)/3600);
        var d = parseInt(surplusTime/86400);
        d=d==0?'':d+$rootScope.i18n('天');
        h=h==0&&d==''?'':h+$rootScope.i18n('小时');
        m=m==0&&h==''?'':m+$rootScope.i18n('分');
        s=s==0&&m==''?'':s+$rootScope.i18n('秒');
        return d+h+m+s;
    };
}])
//格式手机号， 显示为186****3147
//{{mobile| hidePhone}}
.filter('hidePhone',[function(){
    "use strict";
    return function(input,index,length){
        var input = input||''+'',
            index = index||3,
            length= length||4;
        if(input.length==0) return input;
        input=input.toString().split('');
        for(var i in input){
            if(i>=index&&i<index+length) input[i]='*';
        }
        return input.join('');
    }
}])
//格式身份证， 显示为1*******7
//{{mobile| hideCertificateNo}}
.filter('hideCertificateNo',[function(){
    "use strict";
    return function(input,index,length){
        var name = input;
        if (!name) {
            return;
        }
        var nameArr=name.toString().split('');
        var nameLength = nameArr.length;
        if (nameLength > 2) {
            var _name = '';
            var nameLength = nameLength - 2;
            while (nameLength > 0) {
                _name += "*";
                nameLength--;
            }
            name = name.toString().substr(0, 1) + _name + name.toString().substr(nameArr.length - 1, nameArr.length);
        }
        return name;
    }
}])
//格式银行卡， 显示为**********2327
//{{mobile| hideBankCardNo}}
.filter('hideBankCardNo',[function(){
    "use strict";
    return function(input,index,length){
        var name = input;
        if (!name) {
            return;
        }
        var nameArr=name.toString().split('');
        var nameLength = nameArr.length;
        if (nameLength > 4) {
            var _name = '';
            var nameLength = nameLength - 4;
            while (nameLength > 0) {
                _name += "*";
                nameLength--;
            }
            name = _name + name.toString().substr(nameArr.length - 4, nameArr.length);
        }
        return name;
    }
}])
//格式手机号， 显示为186****3147
//{{mobile| phoneDate}}
.filter("phoneDate",[function(){
    return function(mobile){
        if(!mobile){
            return;
        }
        var text = mobile.substring(0,3);
        var textT = mobile.substring(7,11);
        var textW = text + '****' + textT;
        return textW;
    }
}])
    //格式化用户名
.filter('hideUserName',[function(){
    "use strict";
    return function(input){
        if(!input) return '***';
        input=input.toString().split('');
        for(var i in input){
            if(i>=1&&i<input.length-1) input[i]='*';
        }
        return input.join('');
    }
}])
//格式化日期
//$filter('timeTransferDate')(startTime)
//不知为何使用这个， angular提供了$filter('date')(dateT,'yyyy-MM-dd HH:mm:ss'); {{now | date : 'yyyy-MM-dd HH:mm:ss'}}
.filter('timeTransferDate',[function(){
    return function(input){
        function add0(m){return m<10?'0'+m:m };
        input = parseInt(input);
        var time = new Date(input);
        var   year = time.getFullYear();
        var   month = time.getMonth()+1;
        var   date = time.getDate();
        var   hour = time.getHours();
        var   minute = time.getMinutes();
        var   second = time.getSeconds();
        return   year+"-"+add0(month)+"-"+add0(date)+" "+add0(hour)+":"+add0(minute)+":"+add0(second);
    }
}])
//格式化日期
//{{mobile| formatTime: true/false}}  根据传true或false显示显示今天， 昨天， 前天， 具体时间；  或者显示具体时间
.filter("formatTime", ['$window','$rootScope',function ($window,$rootScope) {
    //国际化
    $rootScope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
    return function (time, isTitleText) {
        var now = new Date();
        var month = now.getMonth() + 1,
            month = (month < 10 ? "0" + month : month);
        var today = now.getFullYear() + "-" + month + "-" + (now.getDate()<10?"0"+now.getDate():now.getDate());
        //昨天
        var now1 = new Date();
        now1.setDate(now1.getDate() - 1);
        var month1 = now1.getMonth() + 1,
            month1 = (month1 < 10 ? "0" + month1 : month1);
        var yesterday = now1.getFullYear() + "-" + month1 + "-" + (now1.getDate()<10?"0"+now1.getDate():now1.getDate());
        //前天
        var now2 = new Date()
        now2.setDate(now2.getDate() - 2);
        var month2 = now2.getMonth() + 1,
            month2 = (month2 < 10 ? "0" + month2 : month2);
        var anteayer = now2.getFullYear() + "-" + month2 + "-" +(now2.getDate()<10?"0"+now2.getDate():now2.getDate());

        if (today.indexOf(time) > 0) {
            if (isTitleText) {
                return $rootScope.i18n('今天');
            } else {
                return time;
            }
        }
        if (yesterday.indexOf(time) > 0) {
            if (isTitleText) {
                return $rootScope.i18n('昨天');
            } else {
                return time;
            }
        }
        if (anteayer.indexOf(time) > 0) {
            if (isTitleText) {
                return $rootScope.i18n('前天');
            } else {
                return time;
            }
        }
        else {
            if(isTitleText){
                return time;
            }else{
                return '';
            }
        }
    }
}])
//格式化订单状态， 显示不同的汉语
//{{status |toOrderStatusContext}}
.filter("toOrderStatusContext", ['$window','$rootScope',function ($window,$rootScope) {
    //国际化
    $rootScope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
    return function (orderStatus) {
        if (orderStatus == 1) {
            return $rootScope.i18n('待付款');
        } else if (orderStatus == 2) {
            return $rootScope.i18n('待发货');
        } else if (orderStatus == 3) {
            return $rootScope.i18n('待收货');
        } else if (orderStatus == 4) {
            return $rootScope.i18n('待评价');
        }else if (orderStatus == 5) {
            return $rootScope.i18n('待确认');
        } else if (orderStatus == 8) {
            return $rootScope.i18n('已完成');
        } else if (orderStatus == 10) {
            return $rootScope.i18n('已取消');
        } else if (orderStatus == 13) {
            return $rootScope.i18n('已支付')
        }
    }
}])
//根据订单类型显示不同的汉语
//{{type|toOrderTypeContext}}
.filter("toOrderTypeContext", ['$window','$rootScope',function ($window,$rootScope) {
    //国际化
    $rootScope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
    return function (orderType2) {
        if(orderType2 == 0){
            return $rootScope.i18n('普通订单');
        }else if(orderType2 ==1){
            return $rootScope.i18n('生鲜订单');
        }else if(orderType2 ==2){
            return $rootScope.i18n('服务订单');
        }else if(orderType2 ==3){
            return $rootScope.i18n('虚拟订单');
        }else if(orderType2 ==4){
            return $rootScope.i18n('礼金卡');
        }
    }
}])
//格式化订单付款方式， 显示不同的汉语
//{{status|toOrderStatusContext}}
.filter("toOrderPaymentTypeContext", ['$window','$rootScope',function ($window,$rootScope) {
    //国际化
    $rootScope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
    return function (toOrderPaymentTypeContext) {
        if (toOrderPaymentTypeContext == 0) {
            return $rootScope.i18n('账户支付');
        } else if (toOrderPaymentTypeContext == 1) {
            return $rootScope.i18n('网上支付');
        } else if (toOrderPaymentTypeContext == 2||toOrderPaymentTypeContext == 3||toOrderPaymentTypeContext == 4
        ||toOrderPaymentTypeContext == 5||toOrderPaymentTypeContext == 6) {
            return $rootScope.i18n('货到付款');
        } else if (toOrderPaymentTypeContext == 21) {
            return $rootScope.i18n('邮局汇款');
        } else if (toOrderPaymentTypeContext == 22) {
            return $rootScope.i18n('银行转账');
        }else if (toOrderPaymentTypeContext == 31) {
            return $rootScope.i18n('分期付款');
        }else if (toOrderPaymentTypeContext == 32) {
            return $rootScope.i18n('合同到期');
        }
    }
}])
//使用ng-bind-html时， 需将代码转化为安全模式
//{{html |toTrusted}}
.filter("toTrusted",["$sce",function($sce){
    return function(text) {
        return $sce.trustAsHtml(text);
    }
}])
//判断是否过期
//{{(repairDetail.detail.orderLogisticsTime+24*60*60*1000*pro.guaranteeDays) | isOverdue}} 出库时间 + 保修天数*天毫秒
.filter("isOverdue", ['$window','$rootScope',function ($window,$rootScope) {
    //国际化
    $rootScope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
    return function (defectsLiabilityPeriod) {//保修期到期日的毫秒值
        var time = defectsLiabilityPeriod - new Date().getTime();
        if(time <= 0){
            return $rootScope.i18n('已超过售后保修期');
        }else {
            return $rootScope.i18n('保修期内');
        }
    }
}])
//来伊份售后服务需要的字段过滤器
.filter("afterOrderStatusContext", ['$window','$rootScope',function ($window,$rootScope) {
    //国际化
    $rootScope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
    return function (orderStatus) {
        if (orderStatus == 1) {
            return $rootScope.i18n('待付款');
        } else if (orderStatus == 2) {
            return $rootScope.i18n('待发货');
        } else if (orderStatus == 3) {
            return $rootScope.i18n('等待收货');
        } else if (orderStatus == 4) {
            return $rootScope.i18n('待评价');
        } else if (orderStatus == 8) {
            return $rootScope.i18n('交易完成');
        } else if (orderStatus == 10) {
            return $rootScope.i18n('已取消');
        } else if (orderStatus == 13) {
            return $rootScope.i18n('已支付')
        }
    }
}])
    //将html输出到页面
.filter('trustHtml', function ($sce) {
    return function (input) {
        return $sce.trustAsHtml(input);
    };
})
//优惠券大于10000显示万
.filter('couponMoney',['$window','$rootScope',function($window,$rootScope) {
    //国际化
    $rootScope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
    return function(val){
        if (val >= 10000) {
            val = String(val).substr(0, 1) + '.' + String(val).substr(1, 1) + $rootScope.i18n('万');
        }
        return val;
    }
}])
//优惠券小数转换成折扣
.filter('couponDiscount',['$rootScope',function($rootScope) {
    return function(val){
        if(!val) return '0';
        if(val < 1){
            var moneyStr = String(val);
            if(moneyStr.length == 3){
                moneyStr = String(val * 10);
            }else if(moneyStr.length >= 4){
                moneyStr = String(String(moneyStr).slice(0,4)*1 * 10);
            }
            return moneyStr.slice(0,3);
        }
    }
}])
.filter('uniqueText', ['$rootScope',function ($rootScope) {
    return function (collection, keyname) {
        if (!$rootScope.switchConfig.guide.item.comment.labelflag) {
            return;
        }
        var showArr = $rootScope.switchConfig.guide.item.comment.labelflag.split(',');
        var output = [],
            outputKey = [];
        angular.forEach(collection, function (item) {
            var key = String(item[keyname]);
            if (outputKey.indexOf(key) === -1 && showArr.indexOf(key) > -1) {
                outputKey.push(key);
                output.push(item);
            }
        });
        return output;
    }
}])
//格式化金钱带负号的
.filter('currencySymbol', ['$filter',function ($filter) {
    return function(amount, currencySymbol){
        var currency = $filter('currency');
        if(amount < 0){
            return currency(amount, currencySymbol).replace("(", "-").replace(")", "");
        }
        return currency(amount, currencySymbol);
    };
}])
//累计销量以倍数去显示
/*
    *format长度
    *value: 值
    *multiple 最大多少个
    *tail： 超过多少后面拼的符号
    *使用方法： {{text | numMultipleFormat : 10000 : '+'}}
*/
.filter('numMultipleFormat', [function() {
    return function(value, multiple, tail) {
        if (!value) {
            value = multiple;
        } else {
            var num = parseInt(value/multiple);
            if (num<1) {
                value = multiple;
            } else {
                value = (num+1)*multiple;
            }
        }
        //默认拼接...
        return value + (tail || '+');//'...'可以换成其它文字
    };
}])
//原生的parseInt转化成整数
/*
 *使用方法： {{text | parseIntToNum}}
 */
.filter('parseIntToNum', [function() {
    return function(val){
        if(!val){
            return;
        }
        val = parseFloat(val);
        return val;
    }
}])
.filter('breakListFormate',function () {
    return function(numList, line, lineNum){
        if (!numList) {
            return;
        }
        if (!line) {
            line = 4;
        }
        if (!lineNum) {
            lineNum = 0;
        }
        var formatList = [];
        for (var i = 0; i < numList.length; i++) {
            if (i % line == lineNum) {
                formatList.push(numList[i]);
            }
        }
        return formatList;
    };
});
