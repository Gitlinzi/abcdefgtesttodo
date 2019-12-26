var gulp = require('gulp');
var args = require("args");
var del = require("del");
var path = require("path");
var fs = require("fs");

//命令行参数
args
    .option("minify", "minify html css js files (default is false, do not minify code.)", false)
    .option("env", "env properties file path (default is env/dev.properties)", "env/dev.properties")
    .option("output", "the output directory of building (default is dist)", "dist")
    .option("customer","the customers which would be built","saas")
    .option("template","the template which would be built","example")
    .option("directory","the customers which would be built",".temp");

var coreCustomer = args.parse(process.argv).customer; //customer name
var tmpDirectory = args.parse(process.argv).directory; //directory name
var coreTemplate = args.parse(process.argv).template; //template name
var coreBPath='';//root dir
var customerPaths= {
    core: [
        coreBPath + 'core/**/*',
        coreBPath + 'libs**/**/*',
        coreBPath + 'plugins**/**/*'
    ],
    cust: [
        coreBPath + 'customers/' + coreCustomer + '/!(*-config.js)/**/*'
    ],
    //模板路径
    temp: [
        coreBPath + 'templateList/' + coreTemplate + '/!(*-config.js)/**/*'
    ],
    dest: path.join(tmpDirectory, coreCustomer)
}
gulp.task('clean-temp',function () {
    del.sync(customerPaths.dest);
})
gulp.task('copy-core',['clean-temp'],function () {
    return gulp.src(customerPaths.core)
        .pipe(gulp.dest(customerPaths.dest));
})
gulp.task('merge-template',['copy-core'],function () {
    return gulp.src(customerPaths.temp)
        .pipe(gulp.dest(customerPaths.dest));
})
gulp.task('merge-customer',['merge-template'],function () {
    return gulp.src(customerPaths.cust)
        .pipe(gulp.dest(customerPaths.dest));
})
gulp.task('merge-temp',['merge-customer']);
