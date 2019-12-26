// Import gulp & plugins
var fs = require("fs");
var path = require("path");
var gulp = require("gulp");
var babel = require("gulp-babel");
var browserify = require("browserify");
var del = require("del");
var cleancss = require("gulp-clean-css");
var less = require("gulp-less");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var htmlmin = require("gulp-htmlmin");
var gulpif = require("gulp-if");
var args = require("args");
var filterProperties = require("gulp-filter-java-properties2");
var fileinclude = require("gulp-file-include");
var replace=require("gulp-replace");
var requireDir = require('require-dir');
var browserify = require("browserify");
var stream = require("vinyl-source-stream");
var streamify = require("gulp-streamify");
var buffer = require("vinyl-buffer");
var globby = require("globby");
var stream = require("vinyl-source-stream");
var streamify = require("gulp-streamify");
var buffer = require("vinyl-buffer");

//命令行参数
args
    .option("minify", "minify html css js files (default is false, do not minify code.)", false)
    .option("env", "env properties file path (default is env/dev.properties)", "env/dev.properties")
    .option("output", "the output directory of building (default is dist)", "dist")
    .option("template","the template which would be built","example")
    .option("customer","the customers which would be built","saas");



var options = args.parse(process.argv);
var productName="pc_mall";
var productB2B="pc_b2b";

/**
 * 定制的companyId
 * @type {{oupu: number}}
 */
var outputPath={
    b2b:"b2b/"+productB2B,
    b2c:"b2c/"+productName,
    oupu:"51/"+productName,
    laiyifen:"30/"+productName,
    yh:"1/"+productName,
    chenguang:"58/"+productB2B,
    ody:"51/"+productName,
    qytb:"59/"+productName,
    prodb2c:"77/"+productName
}
var errorMsg=null;

var customerUrl = "./customers/"+options.c;
var customerUrlForWatch = "customers/"+options.c;

requireDir('./gulps');
console.log("==== command options ====");
console.log(options);

//if true, minify resources, used in production.
//if false, no minify reources, used in development.
var minify = options.minify;
//env file path
var envFile = "./.temp/"+options.c+'/'+options.env;
//output directory
var outputDir = options.output+"/"+outputPath[options.c]||options.c;

//gulp-filter-java-properties config
var filterDelimiters = ["${*}"] ;
//dynamic properties
var extraProperties = {version: new Date().getTime()};

/*
 理论上只有本地环境会用watch 命令，所以tricky做法是判断命令中包含watch则认为是本地环境
 */
var isLocal = false;
console.log("argv: " + JSON.stringify(process.argv));
if(process.argv.indexOf('watch')>-1){
    isLocal = true;
}
//本地开发
console.log("isLocal: "+isLocal);

if(isLocal){
    filterDelimiters.push('#((*))');
    extraProperties.skin = '';
}

//paths
var paths = {
    //source  path
    src: "./.temp/"+options.c+"/src",
    temp:"./.temp/"+options.c,
    // the base directory of including flle
    includePath: "./.temp/"+options.c+"/src/includes",
    //less source path
    lessPath: "./.temp/"+options.c+"/src/pages/**/*.less",
    //build target directory
    dist: outputDir
};

//source files
var thirdCssFiles = [
    paths.src + "/common/css/*.css"
];
//less文件
var lessFiles = [
    paths.src + "/**/*.less"
];
//图片文件
var imageFiles = [
    paths.src + "/images/**"
];
//第三方文件
var pluginFiles = [
    paths.temp + "/plugins/**/*"
];
//共通文件(合并成app.js)
var commonJsFiles=[
    paths.src+"/common/**/eventSupport.js",
    paths.src+"/common/**/heimdall.js",
    paths.src+"/common/**/analytics.js",
    paths.src+"/**/app.js",
    paths.src+"/common/*.js"
]

//页面js(不包含个人中心)
var pageJsFiles=[
    paths.src+"/pages/!(my)**/*.js",
    paths.src+"/pages/*.js",
    paths.src+"/pages/**/*.js",
]
//个人中心js
var myJsFiles=[
    paths.src+"/pages/my/home.js",
    paths.src+"/pages/my/**/*.js"
]
//页面html
var htmlFiles = [
    paths.src + "/pages/*.html",
    paths.src + "/pages/**/*.html"
];

//include模板页
var includeHtmlFile=[
    paths.src + "/includes/**/*.html"
];


// default task
gulp.task("default", ["watch"]);
//start build after merged
gulp.task("build",['merge-temp'],function(){
    gulp.start(["main"]);
});
//build all resources
gulp.task("main", ["images","third-css", "less", "plugins", "js","commonJs","home-js", "html"]);

//note: only watch the files maybe changed frequently
gulp.task("watch", ["clean","build"], function() {
    console.log("watching file changes ... ");
    //temp目录的监听
    var moduleCustomer = args.parse(process.argv).customer;
    var moduleTemplate = args.parse(process.argv).template;
    var modulePaths={
        srcCore:'core/src/**/*',
        srcCust:path.join('customers',moduleCustomer,'src/**/*'),
        srcTemp:path.join('templateList',moduleTemplate,'src/**/*'),
        dest:path.join('.temp',moduleCustomer,'src')
    }
    //修改customer与core目录文件
    function deleteCustCore(custOrCore,file) {
        //删除文件的主路径(区分core与customers)
        // var mainPath = custOrCore == 'core' ? custOrCore : path.join(custOrCore, moduleCustomer),
        var mainPath = custOrCore == 'core' ? custOrCore : (custOrCore == 'customers' ? path.join(custOrCore, moduleCustomer):path.join(custOrCore, moduleTemplate)),
            //取得变化文件的相对路径(去除core与customers的部分)
            relPath = path.relative(mainPath, file.path),
            //取得相对路径的文件夹(不带文件名)
            relDir = path.dirname(relPath),
            //core或customers里面相应的文件路径
            fromPath = custOrCore == 'core' ? path.join('customers', moduleCustomer, relPath):path.join('core', relPath) ;
        //判断core或customers里没有没相应文件
        // fs.exists(fromPath, function (isExist) {
        //     if (isExist) { //如果core或customers里存在此文件, 用customers或core里的文件替换
        //         console.log('overwrite with: ', fromPath);
        //         return gulp.src(fromPath) //core或customers目录下的对应文件
        //             .pipe(gulp.dest(path.join('.temp', moduleCustomer, relDir))); //temp目录下的对应文件夹
        //     } else { //如果不存在,直接删除
        //         console.log(file.type + ' files:', file.path);
        //         del.sync(path.join('.temp', moduleCustomer, relPath)); //temp目录下的对应文件
        //     }
        // });
        //三个文件目录
        var path1 = path.join('core', relPath);
        var path2 = path.join('templateList', moduleTemplate, relPath);
        var path3 = path.join('customers', moduleCustomer, relPath);

        var fromPath1 = '', fromPath2 = '';

        // 判断第一、第二优先级目录
        if(custOrCore == 'core'){
            fromPath1 = path3;
            fromPath2 = path2;
        } else if(custOrCore == 'templateList'){
            fromPath1 = path3;
            fromPath2 = path1;
        } else if(custOrCore == 'customers'){
            fromPath1 = path2;
            fromPath2 = path1;
        }
        //检测第一优先级目录是否存在文件
        fs.exists(fromPath1, function (isExist) {
            console.log('isExist!',isExist)
            if (isExist) { //如果存在
                console.log('overwrite with: ', fromPath1);
                return gulp.src(fromPath1) //第一优先级目录目录下的对应文件
                    .pipe(gulp.dest(path.join('.temp', moduleCustomer, relDir))); //temp目录下的对应文件夹
            } else { //如果不存在,检测第二优先级目录是否存在
                fs.exists(fromPath2, function (isExist) {
                    console.log('isExist!2',isExist)
                    if (isExist) { //如果存在
                        console.log('overwrite with: ', fromPath2);
                        return gulp.src(fromPath2) //第二优先级目录目录下的对应文件
                            .pipe(gulp.dest(path.join('.temp', moduleCustomer, relDir))); //temp目录下的对应文件夹
                    } else { //如果不存在,直接删除
                        console.log(file.type + ' files:', file.path);
                        del.sync(path.join('.temp', moduleCustomer, relPath)); //temp目录下的对应文件
                    }
                });
            }
        });
    }
    gulp.watch([modulePaths.srcCore, modulePaths.srcTemp, modulePaths.srcCust], function (file) {
        if (file.type == 'deleted') {
            // //删除操作
            // deleteCustCore(file.path.indexOf('customers') >= 0?'customers':'core',file);

            // 先判断出文件改变的路径
            var iv = file.path.indexOf('customers') >= 0?'customers':(file.path.indexOf('templateList') >= 0?'templateList':'core');
            //删除操作
            deleteCustCore(iv,file);
        } else {
            var mainPath, relPath, relDir;
            //主目录的名称判断(判断是core还是customers的文件)还是templateList的文件)
            if (file.path.indexOf('templateList') >= 0) {
                mainPath = path.join('templateList', moduleTemplate);
            } else if (file.path.indexOf('customers') >= 0) {
                mainPath = path.join('customers', moduleCustomer);
            } else if (file.path.indexOf('core') >= 0) {
                mainPath = 'core';
            }
            relPath = path.relative(mainPath, file.path); //取得变化文件的相对路径(去除core与customers的部分)
            relDir = path.dirname(relPath); //取得相对路径的文件夹(不带文件名)
            console.log(file.type + ' files:', file.path);
            return gulp.src(path.join(mainPath, relPath))
                .pipe(gulp.dest(path.join('.temp', moduleCustomer, relDir)));
        }
    });

    gulp.watch(commonJsFiles,["commonJs"]);
    gulp.watch(imageFiles, ["images"]);
    gulp.watch(lessFiles, ["less"]);
    gulp.watch(pluginFiles, ["plugins"]);
    gulp.watch(pageJsFiles, ["js"]);
    gulp.watch(myJsFiles,["home-js"]);
    //compile changed html file
    gulp.watch(htmlFiles, function (event) {
        //skip process delete file event
        if (event.type == "deleted") {
            return;
        }
        var file = event.path;
        console.log("compile html:" + file);
        compileHtml(file, paths.dist, path.basename(file), minify);
    });
    gulp.watch(includeHtmlFile,['html']);

});

gulp.task("clean", function() {
    del.sync(paths.dist);
});

//copy images
gulp.task("images", function() {
    gulp.src(imageFiles)
        .pipe(gulp.dest(paths.dist + "/images"));
});

//第三方css(格式化css与插件css)
gulp.task("third-css", function() {
    return gulp.src(thirdCssFiles)
        .pipe(concat('common.css'))
        .pipe(gulpif(minify, cleancss()))
        .pipe(gulp.dest(paths.dist));
});

//普通页面less编译
gulp.task("less", function () {
    var baseLessFiles = [
        "./.temp/"+options.c+"/src/pages/**/*.less",
        "!./.temp/"+options.c+"/src/pages/**/i-var_*.less",
        //paths.lessPath
    ];
    var destCssPath = paths.dist;

    globby(baseLessFiles).then(function (entries) {
        entries.forEach(function (file) {
            // compileLess(file, destCssPath, path.basename(file, ".less") + ".css", minify);
            compileLessAllSkin(file, destCssPath, path.basename(file, ".less") + ".css", minify);
        });
    });

});

//copy thridparty js files
gulp.task("plugins", function() {
    return gulp.src(pluginFiles)
        .pipe(gulp.dest(paths.dist + '/plugins'));
});

//普通页面js编译
gulp.task("js", function() {
    globby(pageJsFiles).then(function (entries) {
        entries.forEach(function (file) {
            compileJs(file, paths.dist, path.basename(file), minify);
        });
    });
});

//个人中心为单页应用,合并为单一文件
gulp.task("home-js", function() {

    compileConcatJs(myJsFiles,"home.js",minify);
});

gulp.task('commonJs',function(){
    compileConcatJs(commonJsFiles,"app.js", minify);
    // compileConcatJs(memberJsFiles,"member.js", minify,paths.dist+"/js/controllers");
})

//build html pages
gulp.task('html',['includes'], function() {
    globby(htmlFiles).then(function (entries) {
        entries.forEach(function (file) {
            compileHtml(file, paths.dist, path.basename(file), minify);
        });
    });
});

//build html pages
gulp.task('includes', function() {
    globby(includeHtmlFile).then(function (entries) {
        entries.forEach(function (file) {
            compileHtml(file, paths.dist+'/includes', path.basename(file), minify);
        });
    });
});

function getFileDistPath(filePath) {
    if (!path.isAbsolute(filePath)) {
        filePath = path.join(__dirname, filePath);
    }
    var pagePath = path.join(__dirname, paths.src);
    var relatedPath = path.dirname(filePath.substr(pagePath.length+1));
    return path.join(paths.dist+relatedPath);
}

//Some special file or directory not need process
function excludeFile(file) {
    var c = file.charAt(0);
    return c === ".";
}

//common functions
function compileHtml(source, destination, concatName, minify) {
    return gulp.src(source)
        .pipe(fileinclude({
            prefix: '@@',
            basepath: paths.includePath
        }))
        .pipe(filterProperties({
            propertiesPath: envFile,
            extraProperties: extraProperties,
            delimiters: filterDelimiters
        }))
        .pipe(gulpif(minify, htmlmin({ collapseWhitespace: true }).on('error', function(e){
            console.error("Error when compile html: " + e.fileName);
            console.error(e.message)
        })))
        .pipe(concat(concatName))
        .pipe(gulp.dest(destination));
}

function compileLessAllSkin(source, destination, concatName, minify){
    var skins = ['','blue','red','orange'];
    skins.forEach(function(s){
        compileLess(source, destination, concatName, minify, s)
    });
}

function compileLess(source, destination, concatName, minify,skin) {
    var lessc = less();
    var extras = Object.assign({},extraProperties);//copy 一份，防止对象引用
    lessc.on("error", function (e) {
        console.log('less:',e);
        // lessc.end();
    });
    extras.skin = skin;
    if(skin){
        concatName = concatName.replace(/(.*)\.css/i,'$1_'+skin+'.css');
    }
    // console.log(extras);
    // console.log(concatName);
    return gulp.src(source)
        .pipe(filterProperties({
            propertiesPath: envFile,
            extraProperties: extras,
            delimiters: filterDelimiters
        }))
        .pipe(lessc)
        .pipe(gulpif(minify, cleancss()))
        .pipe(concat(concatName))
        .pipe(gulp.dest(destination));
}

function compileJs(source, destination, concatName, minify) {

    return gulp.src(source)
        .pipe(babel())
        .pipe(filterProperties({
            propertiesPath: envFile,
            extraProperties: extraProperties,
            delimiters: filterDelimiters
        }))
        .pipe(gulpif(minify, uglify().on('error', function(e){
            console.error(e.message)
        })))
        .pipe(concat(concatName))
        .pipe(gulp.dest(destination));
}

function compileConcatJs(source,concatName,minify,dest) {
    console.log("complieing %s",source);
    return globby(source).then(function(entries){
        var b = browserify({
            entries: entries,
            debug: false
        });
        b.bundle()
        // .pipe(babel())
            .pipe(stream(concatName))
            .pipe(buffer())
            .pipe(replace('"@isDebug"',!minify))
            .pipe(filterProperties({
                propertiesPath: envFile,
                extraProperties: extraProperties,
                delimiters: filterDelimiters
            }))
            .pipe(gulpif(minify, uglify().on('error', function(e){
                console.error(e.message);
            })))
            .pipe(gulp.dest(dest||paths.dist));
    })

}
