以后加变量的步骤：
1. 在core/env/config.base.js 添加一个全局的变量globalA赋值为true/false, 比如：globalA: true;
   custumer下项目的custumer/***/env/config.js值，
        A. 需要的值与该值相反， 已oupu为例， 在custumer/oupu/env/config.js, 在与config.base.js相同的对象下边添加globalA赋值为false/true, 比如：globalA: false;
        B. 需要的值与该值相同， 不添加
2. 修改已经存在的变量
    修改core/env/config.base.js的变量globalB， 由true变为false，
    check custumer的各个项目config.js的该变量
        如果没有该变量， 确认该项目是否需要跟修改后的边框一致， 一致， 同1->B; 不一致， 同1->A
3. 路由的添加， 都在core/src/common/app.home.js添加，只需要跟以前的路由名字不一样即可
4. 个人中心菜单的修改
    core/src/common/app.constant.js有一份公共的菜单
    A. 对于位置跟产品化一样的项目， 只需要在这个添加菜单， 在core/env/config.base.js和custumer/***/env/config.js修改 menuListConfig对象变量即可
    B. 对于跟产品化菜单不一样的， 将core/src/common/app.constant.js 复制到custumer/***/src/common/app.constant.js, 写属于自己的菜单；
      C. 新加菜单要加menuListConfig对象变量
