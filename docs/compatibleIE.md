# 项目结构
```
    html: 有开有合, 使用click事件就不要用a标签......
    js: event.srcElement || event.target, for in, indexOf, angular的方法, Object.defineProperty, Object.keys, Array.prototype.filter, ......
    css: line-height, select, rgba, flex, ......
```
参考：
https://zhuanlan.zhihu.com/p/20904140
http://www.cnblogs.com/jiuyuehe/p/5238622.html
https://msdn.microsoft.com/zh-cn/library/cc288325(v=vs.85).aspx

#html
    1. Html拼写必须完全正确，
    2. 标签有开有关, 不能少结尾标签或多写, ie8的容错性不好
    3. 用click事件的就不要用a标签, 可以用span之类的
    4. 1) a 标签 要加target,
            比如target="_self"， target="_blank"
        原因在于三款浏览器，对三个a属性的处理顺序不同。
            Chrome顺序：onclick -> href -> target
            IE和Firefox顺序：onclick -> target -> href
       2) <base target="_blank"/> 没有试,自己测试， 用于页面的统一跳转规则， 对于没有加target会有影响， 建议单加
    5. 添加 <meta http-equiv="X-UA-Compatible" content="IE=edge">支持ie
    6. html判断ie
        !    [if !IE]                   The NOT operator. This is placed immediately in front of the feature, operator, or subexpression to reverse the Boolean meaning of the expression.
        lt   [if lt IE 5.5]             The less-than operator. Returns true if the first argument is less than the second argument.
        lte  [if lte IE 6]              The less-than or equal operator. Returns true if the first argument is less than or equal to the second argument.
        gt   [if gt IE 5]               The greater-than operator. Returns true if the first argument is greater than the second argument.
        gte  [if gte IE 7]              The greater-than or equal operator. Returns true if the first argument is greater than or equal to the second argument.
        ( )  [if !(IE 7)]               Subexpression operators. Used in conjunction with boolean operators to create more complex expressions.
        &    [if (gt IE 5)&(lt IE 7)]   The AND operator. Returns true if all subexpressions evaluate to true
        |    [if (IE 6)|(IE 7)]         The OR operator. Returns true if any of the subexpressions evaluates to true.
#js
    一、 原生js
        1. 不要使用l1.forEach((v)=>{}) 与 for of
            用angular.forEach(proms, function (prom) {})代替
        2. js统一事件兼容ie
            1) event.srcElement || event.target; window.addEventListener || window.attachEvent
            2) e.preventDefault 与 window.event.returnValue = false; event.stopPropagation || event.cancleBubble = true;
            3) Object.getOwnPropertyNames使用Object.keys代替
            4) Object.keys重写判断
                ```
                Object.myKeys = function (params) {
                    var ary = [];
                    if (Object.keys) {
                        ary = this.keys(params);
                    } else {
                        for(var key in params ) if(hasOwn.call(params,key)){
                            ary.push(key) ;
                        }
                        var DONT_ENUM =  "propertyIsEnumerable,isPrototypeOf,hasOwnProperty,toLocaleString,toString,valueOf,constructor".split(","),
                            hasOwn = ({}).hasOwnProperty;
                        for (var i in {
                            toString: 1
                        }){
                            DONT_ENUM = false;
                        }
                        if(DONT_ENUM && params){
                            for(var i = 0 ;key = DONT_ENUM[i++]; ){
                                if(hasOwn.call(params,key)){
                                    ary.push(key);
                                }
                            }
                        }
                    }
                    return ary;
                }
                ```
            5) Array.prototype.filter, Array.prototype.map, Array.prototype.reduce
                ```
                Array.prototype.myFilter = function (fn) {
                    var ary = [];
                    if (Array.prototype.filter) {
                        ary = this.filter(fn);
                    } else {
                        if (this === void 0 || this === null) {
                            throw new TypeError();
                        }
                        var t = Object(this);
                        var len = t.length >>> 0;
                        if (typeof fn !== "function")
                          throw new TypeError();
                        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
                        for (var i = 0; i < len; i++)
                        {
                          if (i in t)
                          {
                            var val = t[i];
                            if (fn.call(thisArg, val, i, t))
                              ary.push(val);
                          }
                        }
                    }
                    return ary;
                }
                ```
            6) Object.defineProperty
                引入引es5-shim.js 与 es5-sham.js
            7) 统一使用 [] 获取集合类对象。
            8) 统一通过 getAttribute() 获取自定义属性
            9) 统一使用var关键字来定义常量。
            10) 使用 window.location 来代替 window.location.href。当然也可以考虑使用 location.replace()方法。
            11) 直接使用 window.open(pageURL,name,parameters) 方式打开新窗口。
            12) 统一使用obj.parentNode 来访问obj的父结点
        3. append, appendChild, innerHtml, innerText, ......
            ie对动态append的内容有要求，需要将一个具有完整意义的html一起append到代码中
            问题说明：ie、firefox以及其它浏览器对于 table 标签的操作都各不相同，在ie中不允许对table和tr的innerHTML赋值，使用js增加一个tr时，使用appendChild方法也不管用。document.appendChild在往表里插入行时FIREFOX支持，IE不支持
            解决办法：把行插入到TBODY中，不要直接插入到表
            解决方法：
            //向table追加一个空行：
            ```
            var cell = document.createElement("td");
            cell.innerHTML = "";
            cell.className = "XXXX";
            row.appendChild(cell);
            ```
            [注] 建议使用JS框架集来操作table，如JQuery。
            ```
            if(navigator.appName.indexOf("Explorer") >-1){
                document.getElementById('element').innerText = "my text";
            } else{
                document.getElementById('element').textContent = ";my text";
            }
            ```
        4. 数组方法法人使用
            1) 不要使用indexOf
                用 $.inArray(item.mpId, dMpIds)；
            2) 不要用for in
                用for或者angular.forEach
            3) IE8 不会忽略数组直接量的末尾空元素，如[1,2,]这个数组长度为3
        5. split使用前确认是string类型， 可以使用toString().split(',')
        6. slice(开始位置, 结束位置), substring(开始位置, 结束位置), substr(开始位置, 长度)
            1) 在传递正值参数情况下，slice() 和 substring () 行为是一致的，substr()方法在第二个参数上会容易混淆
            2) 在传递负值参数情况下，slice() 方法是通过字符串长度相加，符合一般思维，substring()第二个参数转换为0会容易出问题，起始位置会容易变更，substr() 方法负值情况下会出现IE兼容性问题。
            3) 综上，一般推荐使用slice()方法。
            ```
            'hello'.slice(0,3)               => "hel"
            'hello'.substring (0,3)          => "hel"
            'hello'.substr (0,3)             => "hel"
            'hello'.slice(1,3)               => "el"
            'hello'.substring (1,3)          => "el"
            'hello'.substr (1,3)             => "ell"
            ```
        7. 缓存的问题
            1) js改变img标签的src属性在IE下没反应，路径后加个Date()时间戳即可
            2) ajax请求缓存的问题
                get请求：$httpProvider.defaults.headers.get['If-Modified-Since'] = new Date().getTime();
                         加一个时间戳变量
        8. ie8/9 可能不支持console, 删除console
        9. js判断ie
            var isIE = /*@cc_on!@*/false
            在其他浏览器中，false 前的被视为注释，而在 IE 中，/*@cc_on .... @*/ 之间的部分可以被 IE 识别并作为程序执行，同时启用 IE 的条件编译。
    二、 angular
        1. ie8不兼容angular的, restrict: 'EA', 指令里面不用写， 统一使用A调用, 比如<div directive></div>
        2. angular-ui-rooter使用低版本的, 否则不支持
#css
    1. ie中line-height不可以当高度要加height
    2. border在非chrome浏览器占位置宽度和高度， 对于宽度写死的要注意
    3. 重写select标签的样式：不要忘记ie
        只能兼容到IE10。其他解决方法就是使用插件。
        select::-ms-expand { display: none; }
        select{
            appearance:none;
            -moz-appearance:none;
            -webkit-appearance:none;
            -ms-appearance:none;
            -o-appearance:none;
        }
    4.  rgba透明值：  0.1　　0.2　　0.3　　0.4　　0.5　　0.6　　0.7　　0.8　　0.9
        IE下filter值：19　　 33　　 4c　　 66　　  7f　　 99　　 b2　　 c8　　  e5
        ***************#b2333333计算方法: 0.7=>0.7, rgb(51, 51, 51) => #333333;**************
        支持ie的写法
        background: rgb(51, 51, 51);    /*不支持rgba的浏览器*/
        background: rgba(51, 51, 51, 0.7);  /*支持rgba的浏览器*/
        filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#b2333333,endColorstr=#b2b2333333);
        background: none\9;
    5. 颜色用数字不要用单词, 能用3个不要用6个

    6.  ie8不支持flex， 能不用就不用
        display: box;              /* OLD - Android 4.4- */
        display: -webkit-box;      /* OLD - iOS 6-, Safari 3.1-6 */
        display: -webkit-inline-box;
        display: -moz-box;         /* OLD - Firefox 19- (buggy but mostly works) */
        display: -ms-flexbox;      /* TWEENER - IE 10 */
        display: -webkit-flex;     /* NEW - Chrome */
        display: inline-flex;
        display: flex;
    7. css3 transform不支持, 而且各个浏览器中， 如果使用的框的width*transform不是整数， 弹框会失去分辨率， 变模糊

