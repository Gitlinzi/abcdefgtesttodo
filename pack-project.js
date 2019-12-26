// Import gulp & plugins
var fs = require("fs");
var path = require("path");
var args = require("args");
var gulp = require("gulp");
var mkdirp = require('mkdirp');
var md5 = require("md5");
var pack = require("tar-pack").pack;
var write = require('fs').createWriteStream;

//usage: node pack-project.js

args
  .option("output", "the build output directory (default is dist)", "dist")
  .option("target", "target directory that store package (default is '.')", ".")
  .option("name", "the package base name (default is project nmae)");
 
var options = args.parse(process.argv)

//package base name
var name = options.name || require("./package.json").name;
var output = options.output || "dist";
var packName = name + ".tgz"
var target = path.join(options.target || ".", getPackTime());
var targetFile = path.join(target, packName);
var md5File = path.join(target, packName + ".md5");


//make sure the target folder exists
mkdirp(target, function (err) {
    if (err) {
         console.error(err);
    } else {
        tarFolder();
    }
});


//tar folder
function tarFolder() {
    pack(output, {fromBase: true})
        .pipe(write(targetFile))
        .on('error', function (err) {
            console.error(err.stack)
        })
        .on('close', function () {
            console.log("=================================");
            console.log('package: ' + targetFile);
            console.log("=================================");
            createMd5File();
        });
}

//生成指定文件的md5文件
function createMd5File() {
    fs.readFile(targetFile, function(err, buf) {
        var value = md5(buf) + "  " + packName;
        fs.writeFileSync(md5File, value)
        console.log("create md5 file: " + md5File);
        console.log(value);
    });
}

//2016-10-08
function getPackTime() {
    var now = new Date();
    var arr = [];
    //year
    arr.push(now.getFullYear());
    //month
    arr.push(fmtTime(now.getMonth() + 1));
    //date
    arr.push(fmtTime(now.getDate()));

    return arr.join("-");
}

function fmtTime(t) {
    return t > 9 ? t : ('0' + t);
}