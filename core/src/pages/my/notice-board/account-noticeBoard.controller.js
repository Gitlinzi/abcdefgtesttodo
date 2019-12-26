import { throws } from "assert";

/**
 * Created by Deng on 19/5/31.
 */
angular.module('appControllers').controller('noticeBoardCtrl',["$scope", "$rootScope","$window",
    function ($scope, $rootScope,$window){
    'use strict';
    //国际化
    $scope.i18n = function (key) {
        return $window.i18n ? $window.i18n(key) : key;
    };
    var _ut = $rootScope.util.getUserToken();
    var _fnP = $rootScope.ajax.post,
        _fnG = $rootScope.ajax.get,
        _fnE = $rootScope.error.checkCode,
        _host = $rootScope.host,
        _home = $rootScope.home,
        _cid = $rootScope.companyId;

    //初始化翻页, 切换tab的时候也会初始化分页
    $scope.initPagination = function () {
        $scope.pageNo = 1;
        $scope.pageSize = 10;
        $scope.totalCount = 0;
        
    };
    //翻页广播接收
    $scope.$on('changePageNo', function (event, data) {
        "use strict";
        $scope.pageNo = data;
        $scope.noticeBoard.getNoticeList();
    })
    $scope.initPagination();
    // 时间组件
    $scope.options1= {
        format:'Y-m-d',
        lang:'zh',
        timepickerScrollbar:false,
        timepicker:false,
        scrollInput:false,
        scrollMonth:false,
        scrollTime:false
    }
    $scope.options2= {
        format:'Y-m-d',
        lang:'zh',
        timepickerScrollbar:false,
        timepicker:false,
        scrollInput:false,
        scrollMonth:false,
        scrollTime:false
    };
    $scope.noticeBoard = {
        id: '',
        title :'',
        terminal:'', // 终端 
        createTimeStart :'',
        createTimeEnd: '',
        advanceList:{},
        // 初始化
        init:function(){
            var that = this;
            that.getNoticeList();
        },
        getNoticeList: function(data){
            "use strict";
            var that = this;
            var url = '/cms/view/queryMerchantCmsArticleList.do';
            var params = {};
            if(!data){
                params = {
                    currentPage: $scope.pageNo ,
                    itemsPerPage: $scope.pageSize,
                }
            }else{
                $scope.pageNo = 1;
                params = {
                    currentPage: $scope.pageNo,
                    itemsPerPage: $scope.pageSize,
                }
            } 
            if(that.title){
                params.displayTitle = that.title; 
            }
            if(that.terminal){
                params.platformIds = that.terminal; // 1-pc 2-H5
            }
            if(that.createTimeStart){
             
                params.createTimeStart = that.createTimeStart; 
            }
            if(that.createTimeEnd){
                params.createTimeEnd = that.createTimeEnd; 
            }
            $rootScope.ajax.postJson(url, params).then(function (res) {
                if (res.code == 0) {
                    if(res.data.listObj){
                        that.advanceList = res.data.listObj;

                        $scope.totalCount = res.data.total;
                        $scope.totalPage = $scope.totalCount % $scope.pageSize == 0 ? (($scope.totalCount / $scope.pageSize) || 1) : parseInt($scope.totalCount / $scope.pageSize) + 1;
                    }else {
                        that.advanceList = [];
                    }
                    
                }else{
                    _fnE($scope.i18n('提示'),$scope.i18n(res.errMsg));
                }
            });
        },
        // 条件查询
        selectByCondition:function(){
            var that = this;
            if(!that.title && !that.terminal && !that.createTimeStart && !that.createTimeEnd){
                _fnE($scope.i18n('提示'),$scope.i18n('请输入查询条件！'));
                return;
            }
            that.getNoticeList(1);

          
        },
        resetInfo: function(){
            "use strict";
            var that = this;
            that.id =  '';
            that.title = '';
            that.terminal = '';
            that.createTimeStart =' ';
            that.createTimeEnd = '';
        },
    }
    $scope.getTerminal = function(data){
        
    }
    $scope.notice = {

        noticeShow:false, // true -显示编辑/新增公告
        terminalList:[
            {code:1,name:"pc",checked:false},
            {code:2,name:"H5",checked:false}
        ], // 支持终端 
        ContentPromt:"",
        title:'',
        type:1, // 1-新增 2-修改    
  
        /**
         *  新增公告
         */
        _editAddNotice:function(){
            var that = this;
            that.noticeShow = true;
            that.type = 1;
            that._wangFu();
        },
        /**
         * 富文本编辑
         */
        _wangFu:function(){
            var E, editor;
            E = $window.wangEditor;
            editor = new E('#noticeEditor');
            editor.customConfig.menus = [
                'head',  // 标题
                'bold',  // 粗体
                'fontSize',  // 字号
                'fontName',  // 字体
                'italic',  // 斜体
                'underline',  // 下划线
                'foreColor',  // 文字颜色
                'backColor',  // 背景颜色
                'link',  // 插入链接
                'list',  // 列表
                'justify',  // 对齐方式
                'image',  // 插入图片
                'table',  // 表格
  //             'video',  // 插入视频
//                'code',  // 插入代码
                'undo'  // 撤销
            ];
            editor.customConfig.uploadImgShowBase64 = true;
            editor.customConfig.uploadImgMaxSize = 0.3 * 1024 * 1024;


            editor.customConfig.uploadImgServer = '/back-cms-web/file/uploadFileUeditor.do'; // 上传图片到服务器
            editor.customConfig.uploadFileName = 'file';
            editor.customConfig.uploadImgTimeout = 5000;

            editor.customConfig.uploadImgHooks = {
                customInsert: function (insertImg, result, editor) {
                    // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
                    // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

                    // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
                    if(result.state == 'SUCCESS'){
                        var url =result.url;
                        insertImg(url);
                    }
                    // result 必须是一个 JSON 格式字符串！！！否则报错
                }
            }
            editor.create();
            // 获取内容
            $scope.getContent = function(){
                $scope.notice.ContentPromt = editor.txt.html();
            }
            // 设置内容
            $scope.setContent = function(data){
                $scope.notice.ContentPromt = editor.txt.html(data);
            }
        },
        wangFuEditcancel(){
            this.title ="";
            angular.forEach($scope.notice.terminalList,function(temp){
                temp.checked = false;
            })
            $('#noticeEditor').empty();                      
            this.noticeShow = false; 
        },
    }
    /**
     * 验证提示
     */
    $scope.validateStatus = {
        nameTipShow:false,
    }
    // 编辑点击
    $scope.getAdvanceDetail = function(id){
        var url = '/back-cms-web/cmsArticleRead/queryCmsArticles.do';
        var params = {
            id:id
        };
        $rootScope.ajax.postJson(url, params).then(function (res) {
            if (res.code == 0 && res.data) {
                $('#noticeEditor').empty();
                $scope.notice.noticeShow = true;
                $scope.notice._wangFu();
                $scope.notice.type = 2;
                $scope.notice.id = id;
                $scope.notice.title = res.data.name;
                angular.forEach(res.data.cmsPlatformList,function(plat){
                    angular.forEach($scope.notice.terminalList,function(temp){
                        if(plat.platform == temp.code){
                            temp.checked = true;
                        }
                    })
                })
                $scope.setContent(res.data.articleContent);
                $scope.notice.noticeShow = true;
            }else{
                _fnE($scope.i18n('提示'),$scope.i18n(res.message));
            }
        });
    },
    // 保存
    $scope.SaveOpra = function(){
        var chooseTerminal = false;
        var TerminalIds = ''; // 选中终端
        angular.forEach($scope.notice.terminalList,function(temp){
            if(temp.checked){
                chooseTerminal = true;
                if(TerminalIds == ''){
                    TerminalIds = temp.code ;
                }else {
                    TerminalIds = TerminalIds + ',' + temp.code
                };
            }
        })
        $scope.getContent();
        if($scope.notice.title.length <= 0){
            _fnE($scope.i18n('提示'),$scope.i18n('请输入标题！')); 
            return;
        }else if(!chooseTerminal){
            _fnE($scope.i18n('提示'),$scope.i18n('请选择支持终端！')); 
            return;
        }else if($scope.notice.ContentPromt == "<p><br></p>"){
            _fnE($scope.i18n('提示'),$scope.i18n('请输入公告内容！')); 
            return;
        }else if($scope.notice.ContentPromt == ""){
            _fnE($scope.i18n('提示'),$scope.i18n('请确认公告内容！')); 
            return;
        }else if($scope.notice.ContentPromt >= 60000){
            _fnE($scope.i18n('提示'),$scope.i18n('内容超出限制！')); 
            return; 
        }

        $scope.AddOrUpdate(TerminalIds);

    }
    /**
     *  添加/修改公告
     *  @param TerminalIds 终端号
     *  @param id 修改 必须
     *  @param type- 1-新增 2-修改
     *  */ 
    $scope.AddOrUpdate = function(TerminalIds){
        var url = '/cms/view/saveMerchantCmsArticles.do';
        var params = {
            articleContent:$scope.notice.ContentPromt,
            displayTitle:$scope.notice.title,
            platformStr:TerminalIds,
        };
        if($scope.notice.type == 2){
            params.id = $scope.notice.id;
        }
        $rootScope.ajax.postJson(url, params).then(function (res) {
            if (res.code == 0) {
                _fnE($scope.i18n('提示'),$scope.i18n(res.message));
                $scope.noticeBoard.getNoticeList();
                $scope.notice.wangFuEditcancel();
            }else{
                _fnE($scope.i18n('提示'),$scope.i18n(res.message));
            }
        });
    }


    //单选或多选操作
    $scope.checked = []; //定义一个数组 存入id或者想要用来交互的参数
    $scope.select_all = false;
    $scope.selectAll = function () {
        if ($scope.select_all) {
            $scope.checked = [];
            angular.forEach($scope.noticeBoard.advanceList, function (i) { 
                i.checked = true; //全选即将所有的复选框变为选中
                $scope.checked.push(i.id);//将选中的内容放到数组里             
            })
        } else {//判断全不选
            angular.forEach($scope.noticeBoard.advanceList, function (i) {
                i.checked = false; //所有复选框为不选中
                $scope.checked = [];//将数组清空             
            })
        }
    };
    $scope.selectOne = function () {//下面的复选框单独点击
        angular.forEach($scope.noticeBoard.advanceList, function (i) {
            var index = $scope.checked.indexOf(i.id);//检索checked中是否有i.id 如果没有则会返回-1
            if (i.checked && index === -1) { 
                 $scope.checked.push(i.id);
            } else if (!i.checked && index !== -1) {
                $scope.checked.splice(index, 1);
            }
        })
        if ($scope.noticeBoard.advanceList.length === $scope.checked.length) {//判断checked数组的长度是否与原来请求的后台数组的长度是否相等 即是否给全选框加上选中
            $scope.select_all = true;
        } else {
            $scope.select_all = false;
        }
    }

    // 批量/单个删除
    $scope.deleteMore=function(id){
        if(id){
            $scope.delete(id,true);
        }else if($scope.checked.length > 0){
            var ids = "";
            angular.forEach($scope.checked,function(id){
                if(ids == ""){
                    ids = id;
                } else {
                    ids = ids +","+id;
                }
            })
            $scope.delete(ids,true);
        }else {
            _fnE($scope.i18n('提示'),$scope.i18n('您还未选中需要操作的数据！'));
        }
    }
    $scope.delete = function(data,query){
        if(query){
            $scope.deleteData = {
                bombShow:true,
                rightText: $scope.i18n('是否删除公告') + '？',
                title:$scope.i18n('删除'),
                state:'error',
                position:'top',
                buttons: [
                    {
                        name:$scope.i18n('确定'),
                        className: 'one-button',
                        callback: function() {
                            $scope.deleteData.bombShow = false;
                            $scope.delete(data,false);
                        }
                    },
                    {
                        name:$scope.i18n('取消'),
                        className: 'two-button',
                        callback: function() {
                            $scope.deleteData.bombShow = false;
                        }
                    }
                ]
            }
            return;
        }
        var url = '/cms/view/deleteMerchantCmsArticles.do';
        var params = {
            ids:data
        };
        $rootScope.ajax.postJson(url, params).then(function (res) {
            if (res.code == 0) {
                $scope.noticeBoard.getNoticeList();
                _fnE($scope.i18n('提示'),$scope.i18n(res.message));
            }else{
                _fnE($scope.i18n('提示'),$scope.i18n(res.message));
            }
        });
    }

    

 
}])