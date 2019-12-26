#公共的
    1. 确保创建的是一个utf8文件
        问题: 有的编译器创建新的文件不是utf-8, 导致火狐之类的浏览器不识别该页面
        解决方法:  对于不确定自己编译器的, copy一个项目已有的文件重命名
    2. 每行最长150个字符; 缩进4个空格; 到时候代码缩放规范(一般规定是80/120)
    3. Tab键使用
        问题: 项目中不允许出现tab是-> ; tab用四个空格(....)代替; 行的末尾不要有空格。
        解决方法: 编译器可以设置, 将一个tab替换为四个空格代替
    4.  项目命名: 下划线, 比如:project_a
        目录命名: 加s, 比如:menu_a
        文件命名: 下划线, 比如:file_a
        变量(css, js)命名: 驼峰命名, 比如: codingStyle; 注意局部变量不要命名成全局的; 注意块状元素的变量, 变量外层是可以用的; 注意不要使用关键字
        常量命名: 全部大写, 比如: CONSTENTA
        html类名: 中划线, 比如: class-a
        html ID: 驼峰命名, 比如: domId;
    5. 要有结束符(html有开有闭; js,css有分号); 否则浏览器要多处理;
    6. 'use strict';用在自己的方法内, 不要用在外部影响其他的代码
    7. 有封装的方法要用封装的方法, 没有封装的方法, 觉得代码很核心抽成封装的方法
    8. 为了兼容ie浏览器, angular的directive不写restrict默认A
    9. 做到一块代码超过两个地方公用就要抽
    10. 注释一定要写好
    11. 有必要的空行做代码分离, 比如function之间;变量声明后;注释前
    12. 注意大小写

#Html
    1. 注释:
        <!-- Not recommended -->
    2. &mdash;, &rdquo;, or &#x263a之类的特殊符号不要用； 有些浏览器不支持
    3. 对于以下ie样式的引入要加判断, 比如[if !IE]
    4. 内容用“”双引号包起来, 不要使用‘’单引号
    5. 为了样式不覆盖, 每个html定义自己的class名字
    6. 属性书写顺序, 以保证易读性；
        class, id, name, (src, for, type, href, value , max-length, max, min, pattern),placeholder, title, alt, required, readonly, disabled
        class是为高可复用组件设计的，所以应处在第一位；
        id更加具体且应该尽量少使用，所以将它放在第二位。
    7. 能用一个标签写的样式不要用多个标签实现功能

#javascript
    1. log, debugger
        问题: 项目中有多余的log, 原则上这是不可以的,
        解决方法: 提交时删除, 使用时再加
    2. 对于一行的if最好也写{}, 多行一定要写{}; 对于一行代码的可以用三目运算, 连if都不一样写
        比如:
        if (x<0) {
            x++;
        }
    3. 请使用 K&R bracing 样式: 在第一行后添加左大括号
        if (...) {
        } else if (...) {
        } else {
        }
    4. 注释:
        单行注释:  //
        多行注释:
            /*
             * one space after '*'
             */
        文档注释:
            /**
             * Home controller.
             * @param {!angular.Scope}
             * @constructor
             * @ngInject
             * @export
             */
    5. 内容用''单引号包起来
    6. 变量声明: 一个函数作用域中所有的变量声明尽量提到函数首部，用一个var声明，不允许出现两个连续的var声明。
    7. 代码级别
        1) 不要使用  x == true 或 x == false 进行比较。而是使用 (x) 或 (!x)。 x == true 实际上是与 (x) 有区别的! 对于对象而言,会和  null 相比较,数字会和  0 相比,字符串会和 "" 相比,因此可能会产生混淆。
           区分==与===
        2) 请确保您的代码不会产生 strict JavaScript 警告,如:
            重复的变量定义
            混合使用 return 和  return value;
            未声明的变量或成员。如果您不能保证数组中有值存在, 请使用 array's length 判断。如果您不能保证对象成员存在, 请使用  "name" in aObject, 或者如果您希望使用一个特殊的类型,可以使用 typeof(aObject.name) == "function" (或者是任意您所期望的类型).
        3) 用[value1, value2] 去创建数组而不是用 new Array(value1, value2)
        4) 用{ member: value, ... } 去创建对象而不是用 new Object(); 它可以创建初始化的属性以及扩展 JavaScript 语法来定义 getters 和 setters。
        5) 对于三个以上的if, 使用switch case
        6) 对于定时器要有清理事件
            var inter = setInterval(autoPlay, 5000);
            clearInterval(inter);
        7) 注意for in, for of是用于对象; for-in里一定要有hasOwnProperty的判断; for(var i = 0; i<a.length; i++)用于数组; 如果不能区分用angular.foreach, 但是angular.foreach不能使用continue和break,只能使用flag
        8) 注意异步请求
        9) 统一代码块中的变量不可以重复
        10) js最好不要生成标签
        11) null
            适用场景：
                初始化一个将来可能被赋值为对象的变量
                与已经初始化的变量做比较
                作为一个参数为对象的函数的调用传参
                作为一个返回对象的函数的返回值
            不适用场景：
                不要用null来判断函数调用时有无传参
                不要与未初始化的变量做比较
        12) undefined
            永远不要直接使用undefined进行变量判断；
            使用typeof和字符串'undefined'对变量进行判断。
    8. controller要加[], 支持压缩打包
#CSS
    1. 注释:
        单行注释:  //
        多行注释:
            /*
             * one space after '*'
             */
        文档注释:
            /**
             * Home controller.
             *
             * @param {!angular.Scope} $scope
             * @constructor
             * @ngInject
             * @export
             */
    2. 清0:  用.8px 代替 0.8px; 用 0px 代替 0; 用 border: 0; 代替 border: none;；
    3. name与{之间有空格, 逗号后面要回车
        h1,
        h2,
        h3 {
          font-weight: normal;
          line-height: 1.2;
        }
    4.内容用""双引号包起来
    5.样式要适应多种浏览器
        appearance:none;
        -moz-appearance:none;
        -webkit-appearance:none;
        -ms-appearance:none;
        -o-appearance:none;
    6. 颜色用16进制小写字母, 尽量用简写; 颜色变量语义化
    7. 嵌套不要超过6层
    8. `
        去掉不必要的父级引用符号'&'; 嵌套写样式已经可以了， 没有必要再使用&
        `
    9. 公共的样式一定要提出
    10. 自己的样式要有一个唯一的类名包起来, 命名规则: 项目名-模块名-文件名

#JSON
    1. 数据都要用"", 如果包含特殊字符要用\

#学习文档
    通过分析github代码库总结出来的工程师代码书写习惯, 比较完善
    http://alloyteam.github.io/CodeGuide/

    https://google.github.io/styleguide/htmlcssguide.html
    https://github.com/bengourley/js-style-guide

    一些规范要引入jshint/eshint做规范扫描，必须通过才能提交
    http://blog.csdn.net/devil2119971/article/details/52191323
    这个规范可以对ui提出组件重用的反向要求
    https://www.zhihu.com/question/21935157
    这个规范更完整
    http://nec.netease.com/standard/css-sort.html
    ......
