appControllers.controller("indexCtrl", ['$log', '$rootScope', '$scope', 'commonService', 'categoryService', "$cmsData", "$window", "$compile", "Upload", function ($log, $rootScope, $scope, commonService, categoryService, $cmsData, $window, $compile, Upload) {
  'use strict';
  function loadNodeFromRemoteTo(zTreeObj, parentNode) {

    var parentBeforeNodes = parentNode.children

    if (parentBeforeNodes && parentBeforeNodes.length) {
      parentBeforeNodes = parentBeforeNodes.filter((item) => {
        return !item.chkDisabled
      })
    }

    if (parentNode.isLoaded || (parentBeforeNodes && parentBeforeNodes.length > 0)) {
      return false;
    }
    parentNode.isLoaded = true;

    var url = "/custom-sbd-web/advCostCenter/getCostCenterUsers";

    $rootScope.ajax.postJson(url, {
      "costCenterId": parentNode.id,
      "currentPage": 1,
      "itemsPerPage": 100
    }).then(res => {
      if (res.code == 0 && res.data && res.data.listObj && res.data.listObj.length > 0) {
        var data = res.data.listObj;

        if (angular.isArray(data)) {
          //加载父节点下的子节点
          angular.forEach(data, function (v) {
            v.isParent = false
            v.costName = v.username
            zTreeObj.addNodes(parentNode, v);
          });
        }

      }

      parentNode.isLoaded = false
    })
  };
  $scope.i18n = function (key) {
    return $window.i18n ? $window.i18n(key) : key;
  };
  $scope.bgColor = $cmsData.pageInfo ? ($cmsData.pageInfo.bgColor ? $cmsData.pageInfo.bgColor : '#f8f8f8') : '#f8f8f8';
  //国际化
  $scope.i18n = function (key) {
    return $window.i18n ? $window.i18n(key) : key;
  };
  $scope.$on('changePageNo', function (event, data) {
    "use strict";
    $scope.pageNo = data;
    // var url = "/custom-sbd-web/advCostCenter/getAllChildCostCenterUsers.do";
    var url = "/custom-sbd-web/front/costCenter/getAllChildUsersByCostCenterId.do";
    var params = {
      'costCenterId': $scope.currentid,
      'currentPage': $scope.pageNo,
      'itemsPerPage': $scope.pageSize,
      'costCenterIds': $scope.costCenterIds
    }
    $rootScope.ajax.postJson(url, params).then(res => {
      if (res.code == 0 && res.data && res.data.listObj && res.data.listObj.length > 0) {
        $scope.employerList = res.data.listObj;
        $scope.totalCount = res.data.total;
        $scope.totalPage = $scope.totalCount % $scope.pageSize == 0 ? (($scope.totalCount / $scope.pageSize) || 1) : parseInt($scope.totalCount / $scope.pageSize) + 1;
        $scope.isShowPage = true;
      } else {
        $scope.isShowPage = false;
        $rootScope.error.checkCode(res.code, res.message);
      }
    })
  })
  $scope.step = 1;//1为详情  2为编辑部门页面   3为编辑员工页面
  $scope.pageNo = 1;
  $scope.pageSize = 10;
  $scope.totalCount = 0;
  $scope.totalPage = 0;
  $scope.isShowPage = false;
  $scope.relationType = 1//1集团  2企业  3部门  4人员
  $scope.relationId = ''//集团或者企业id
  $scope.idshow = true;//成本中心id是否展示
  // $scope.approvalWay = 2;//编辑成本中心审批  1按订单 2不审批
  $scope.bumenradio = {
    costName: '',
    id: '',
  }
  $scope.isradio = false;//是否是单选框
  $scope.info = { approvalAmount: '', approvalWay: 2, editName: '' }; //审批金额
  $scope.advApprovalRelationList = []; //选择的审批人数组
  // 编辑显示，新增同级和新增下级不显示，表单为空
  $scope.isShowStep2 = true
  $scope.editsection = function () {
    //$scope.realList1 = $scope.tempRealList1
    $scope.isShowStep2 = true
    $scope.idshow = true;
    $scope.pdz = true;
    $scope.showeditdig = false;
    $scope.step = 2;
  }

  $scope.hidedig = function () {
    $scope.showeditdig = false;
  }

  //获取全路径
  $scope.getallroad = function () {
    var url2 = '/custom-sbd-web/advCostCenter/getCostCenterFullPathProById.do'
    var params2 = $scope.currentid;
    $rootScope.ajax.postJson(url2, params2).then(res => {
      if (res.code == 0) {
        $scope.realList1 = res.data.advApprovalRelationList;
        $scope.allroad = []
        $scope.allroad.push(res.data.costName)
        if (res.data.childAdvCostCenterVoList && res.data.childAdvCostCenterVoList.length > 0) {
          $scope.allroad.push(res.data.childAdvCostCenterVoList[0].costName);
          if (res.data.childAdvCostCenterVoList[0].childAdvCostCenterVoList && res.data.childAdvCostCenterVoList[0].childAdvCostCenterVoList.length > 0) {
            $scope.allroad.push(res.data.childAdvCostCenterVoList[0].childAdvCostCenterVoList[0].costName)
            if (res.data.childAdvCostCenterVoList[0].childAdvCostCenterVoList[0].childAdvCostCenterVoList && res.data.childAdvCostCenterVoList[0].childAdvCostCenterVoList[0].childAdvCostCenterVoList.length > 0) {
              $scope.allroad.push(res.data.childAdvCostCenterVoList[0].childAdvCostCenterVoList[0].childAdvCostCenterVoList[0].costName)
            }
          }
        }
      }
    })
  }
  $scope.goback = function () {
    $scope.step = 1;
    $scope.info.approvalWay = 2;
    $scope.info.approvalAmount = '';
    $scope.advApprovalRelationList = [];
    $scope.info.editName = '';
    $scope.realList1 = ''
  }
  $scope.toedit = function (id) {
    $scope.userId = id;
    $scope.step = 3;
    $scope.employDetail(id)
    $scope.getCateid();
    $scope.getcostList()
    $scope.getapprowList(id)
  }
  //获取该用户下的审批人
  $scope.getapprowList = function (id) {
    var url = '/custom-sbd-web/advCostCenter/getApprovalRelationByUserId.do';
    var params = id;
    $rootScope.ajax.postJson(url, params).then(res => {
      if (res && res.length > 0) {
        angular.forEach(res, item => {
          item.id = item.userId;
        })
        $scope.realList = res;
      }

    })
  }
  //获取useid对应下的成本中心
  $scope.getcostList = function () {
    var url = '/custom-sbd-web/advCostCenter/getCostCenterByUserId.do';
    //    var params = '19031208230459'
    var params = $scope.userId;
    $rootScope.ajax.postJson(url, params).then(res => {
      if (res.code == 0) {
        $scope.realListb = res.data;
      } else {
        $rootScope.error.checkCode(res.code, res.message);
      }
    })
  }
  $scope.showedit = false;//编辑按钮

  //判断新增的是同级 还是下一级
  $scope.pdz = true; // true 为同级  false为下级
  //tab的切换
  $scope.currentstep = 1;
  //当前点击的数据
  $scope.currentdata = {};
  //当前部门的id（用于增加，删除。。）
  $scope.currentid = '';
  $scope.showeditdig = false;
  $scope.showdig = function (e) {
    e.stopPropagation()
    e.preventDefault()
    $scope.showeditdig = true;
    $('#edit-dig-box').css({"top": e.clientY+"px","left":e.clientX+"px"})
  }
  //搜索关键字
  $scope.keyword = '';
  //上层节点的数据
  $scope.prevnode = {};
  $scope.allroad = [];//全路径
  $scope.disabed = true;
  //树状图初始化
  $scope.ztreeInit = function () {
    $scope.employerList = [];//员工数据
    $scope.setting = {
      view: {
        showIcon: false,
        dblClickExpand: false,
        showLine: false,
        selectedMulti: false,
        nameIsHTML: true,
      },
      data: {
        simpleData: {
          enable: true,
          idKey: "id",
          pIdKey: "parentId",
          rootPId: 0,
        },
        key: {
          name: 'costName'
        },
      },
      callback: {
        onClick: zTreeOnCheck
      }
    };
    var treeObj = $.fn.zTree.init($("#tree"), $scope.setting, $scope.ztreedata);
    treeObj.expandAll(true);

    $(function () {
      $("a[title^='tit-']").parent().hide()

      setTimeout(function () {
        $("a[title^='tit-']").parent().parent().each(function (index, item) {
          if ($(item).height() <= 1) {
            $(item).siblings('span').addClass("noline_none")
          }
        });

        treeObj.expandAll(false);

      }, 100)

    })



    fuzzySearch('tree', '#key', true, true, function () {
      $scope.integrationUserList();
    }, zTreeOnCheck);
    //查询成本中心信息
    // var alldata = $scope.ztreedata;
    // 一进入页面不展示编辑按钮，点击成本中心才展示
    $scope.isShowEidtDetail = false
    function zTreeOnCheck(event, treeId, alldata) {
      // 集团和企业的需要进行限制
      $scope.isShowEidtDetail = true
      $scope.showeditdig = false;
      $scope.step = 1;
      // 获取到父节点的数据
      var treeObj = $.fn.zTree.getZTreeObj("tree");


      if (alldata) {
        treeObj.selectNode(alldata);
      }

      var sNodes = treeObj.getSelectedNodes();
      if (sNodes.length > 0) {
        var node = sNodes[0].getParentNode();
      }
      $scope.prevnode = node;
      if (node) {
        $scope.bumenradio.costName = node.costName;
        $scope.bumenradio.id = node.id
      }


      if (alldata && alldata.parentId == 0 || (node && node.parentId == 0)) {
        $scope.disabed = false;
      } else {
        $scope.disabed = true;
      }
      // console.log(node)
      $scope.showedit = true;
      $('.curSelectedNode').css('position', 'relative')
      // console.log($('.xltree'))
      if ($('.curSelectedNode .xltree').length == 0) {
        $('.xltree').remove()
        $('.xltreei').remove()
        var html = "<div class='xltree'></div><div class='xltreei' ng-click='showdig($event)'><img src='../images/more.png' ></div>";
        var htmlCon = $compile(html)($scope);
        $('.curSelectedNode').append(htmlCon)

      }
      alldata && $scope.getCost(alldata)
    }

    $scope.getCost = function (data) {
      $scope.idshow = true;
      $scope.pageNo = 1;
      $scope.pageSize = 10;
      $scope.pdz = true;
      $scope.currentdata = data;
      $scope.tempRealList1 = data.advApprovalRelationList;
      $scope.employerList = [];
      $scope.currentstep = 1;
      $scope.currentid = data.id;
      console.log($scope.currentdata)
      //先查询到该节点所有的成本中心
      // var url = "/custom-sbd-web/advCostCenter/getAllChildCostCenterUsers.do";
      var url = "/custom-sbd-web/front/costCenter/getAllChildUsersByCostCenterId.do";

      var params = {
        'keyWords': $scope.keyword,
        'costCenterId': data.id,
        'currentPage': $scope.pageNo,
        'itemsPerPage': $scope.pageSize,
        'costCenterIds': $scope.costCenterIds
      }
      $rootScope.ajax.postJson(url, params).then(res => {
        if (res.code == 0 && res.data && res.data.listObj && res.data.listObj.length > 0) {
          $scope.employerList = res.data.listObj;
          $scope.totalCount = res.data.total;
          $scope.totalPage = $scope.totalCount % $scope.pageSize == 0 ? (($scope.totalCount / $scope.pageSize) || 1) : parseInt($scope.totalCount / $scope.pageSize) + 1;
          $scope.isShowPage = true;
        } else {
          $scope.isShowPage = false;
          $rootScope.error.checkCode(res.code, res.message);
        }
      })
      $scope.getallroad()
    }

  }
  //初始化的树状图搜索
  $scope.search = function () {
    var treeObj = $.fn.zTree.getZTreeObj("tree");
    var nodes = treeObj.getNodesByParamFuzzy("costName", $scope.keyword, null);
    // $scope.ztreeInit(nodes)
  }
  $scope.haschose = [];//选择部门的id
  $scope.haschosep = [];//选择审批人的数组;
  $scope.haschoseb = [];//选中部门的数组;
  $scope.realListb = [];//选中的部门(多选框)
  $scope.realListbr = {};//选中的部门(单选框)
  //删除选择的成本中心
  $scope.deleRealb = function (id) {
    $scope.realListb = $scope.realListb.filter(item => {
      return item.id != id
    })
  }
  // $scope.haschosepr = [];
  $scope.userId = '';//此id为用户id
  //选择部门树状图(多选框)
  $scope.ztreeInitb = function () {
    $scope.setting = {
      view: {
        showIcon: false,
        // dblClickExpand: false,
        showLine: false,
        // selectedMulti: false
      },
      check: {
        enable: true,
        chkboxType: { "Y": "", "N": "" }
      },
      data: {
        simpleData: {
          enable: true,
          idKey: "id",
          pIdKey: "parentId",
          rootPId: 0,
        },
        key: {
          name: 'costName'
        },
      },
      callback: {
        onCheck: zTreeOnCheck
      }

    };
    $.fn.zTree.init($("#tree1"), $scope.setting, $scope.ztreedata1);
    fuzzySearch('tree1', '#key1', null, true);
    function zTreeOnCheck(event, treeId, alldata) {

      $scope.$apply(function () {
        var index = $scope.haschose.indexOf(alldata.id);
        if (index > -1) {
          $scope.haschose.splice(index, 1)
        } else {
          $scope.haschose.push(alldata.id)
        }
        var zs = { 'costName': alldata.costName, 'id': alldata.id };
        if ($scope.haschoseb.length == 0) {
          $scope.haschoseb.push(zs)
        } else {
          var flag = true;
          angular.forEach($scope.haschoseb, function (m, index) {
            if (m.id == zs.id) {
              flag = false;
              $scope.haschoseb.splice(index, 1)
            }
          })
          if (flag) {
            $scope.haschoseb.push(zs)
          }
        }

      })
    }
  }
  //选择部门树状图（单选框）
  $scope.ztreeInitbr = function () {
    $scope.setting = {
      view: {
        showIcon: false,
        // dblClickExpand: false,
        showLine: false,
        // selectedMulti: false
      },
      check: {
        enable: true,
        // chkboxType: { "Y": "", "N": "" }
        chkStyle: "radio",
        radioType: "all"
      },
      data: {
        simpleData: {
          enable: true,
          idKey: "id",
          pIdKey: "parentId",
          rootPId: 0,
        },
        key: {
          name: 'costName'
        },
      },
      callback: {
        onCheck: zTreeOnCheck
      }

    };
    $scope.ztreedata1.find(cost => !cost.parentId).chkDisabled = true
    $.fn.zTree.init($("#tree4"), $scope.setting, $scope.ztreedata1);
    fuzzySearch('tree4', '#key1', null, true);
    function zTreeOnCheck(event, treeId, alldata) {
      $scope.radioList = { 'id': alldata.id, 'costName': alldata.costName }
    }
  }
  //选择审批人(编辑员工页面得审批人)
  $scope.realList = [];
  //选择审批人(编辑部门得审批人)
  $scope.realList1 = [];
  $scope.choseshenpi = function () {
    $scope.realList = $scope.haschosep;
    $scope.haschosep = [];
    $scope.showshenpi = false;

  }
  //删除选中的审批人(编辑部门里的)
  $scope.deleReal = function (id) {
    $scope.realList1 = $scope.realList1.filter(item => {
      return item.userId != id
    })
    // console.log($scope.realList1)
  }
  //删除选中的审批人(编辑员工的)
  $scope.deleReal1 = function (id) {
    $scope.realList = $scope.realList.filter(item => {
      return item.id != id
    })
  }
  $scope.choseshenpi1 = function () {
    $scope.realList1 = $scope.haschosep;
    $scope.haschosep = [];
    $scope.showshenpi = false;

  }
  //选择审批人树状图
  $scope.ztreeInitp = function () {
    $scope.setting = {
      view: {
        showIcon: false,
        // dblClickExpand: false,
        showLine: false,
        // selectedMulti: false
      },
      check: {
        enable: true,
        chkboxType: { "Y": "", "N": "" }
      },
      data: {
        simpleData: {
          enable: true,
          idKey: "id",
          pIdKey: "parentId",
          rootPId: 0,
        },
        key: {
          name: 'costName'
        },
      },
      callback: {
        onCheck: zTreeOnCheck,
        onExpand: function (event, treeId, treeNode) {
          var zTreeObj = $.fn.zTree.getZTreeObj(treeId);
          loadNodeFromRemoteTo(zTreeObj, treeNode);
        }
      }

    };
    $.fn.zTree.init($("#tree2"), $scope.setting, $scope.ztreedata2);
    fuzzySearch('tree2', '#key2', null, true);
    function zTreeOnCheck(event, treeId, alldata) {
      $scope.$apply(function () {
        var zs = { 'id': alldata.userId, 'username': alldata.costName, 'money': 0, 'money1': null, 'userId': alldata.userId };
        if ($scope.haschosep.length == 0) {
          $scope.haschosep.push(zs)
        } else {
          var flag = true;
          angular.forEach($scope.haschosep, function (m, index) {
            if (m.id == zs.id) {
              flag = false;
              $scope.haschosep.splice(index, 1)
            }
          })
          if (flag) {
            $scope.haschosep.push(zs)
          }
        }
      })

    }
  }

  $scope.integrationUserList = function () {
    $(function () {
      $("a[title^='tit-']").parent().hide()
      setTimeout(function () {
        $("a[title^='tit-']").parent().parent().each(function (index, item) {

          if ($(item).height() <= 1) {
            $(item).siblings('span').addClass("noline_none");
          } else {
            $(item).siblings('span').addClass("noline_open").removeClass("noline_close").removeClass("noline_none");
          }

        });
      }, 0)

    })
  }

  //初始化树状图数据
  $scope.ztreedataInit = function () {
    // var url = "/custom-sbd-web/advCostCenter/getCostCenterList.do";
    var url = "/custom-sbd-web/front/costCenter/getCostCenterList.do";
    $rootScope.ajax.post(url, {}).then(res => {
      if (res.code == 0 && res.data && res.data.listObj.length > 0) {

        res.data.userList = res.data.userList.map(item => {
          item.parentId = item.costCenterId
          item.costName = 'tit- ' + item.username
          return item
        })

        $scope.ztreedata = res.data.listObj.concat(res.data.userList);
        $scope.costCenterIds = res.data.costCenterIds;
        let treeObj = $.fn.zTree.getZTreeObj('tree')
        if (treeObj) {
          let oldTreeData = treeObj.getNodesByParam('open', true)
          oldTreeData.forEach(item => {
            $scope.ztreedata.find(cost => cost.id == item.id).open = true
          })

          let selectedNode = treeObj.getSelectedNodes()[0]

          if (selectedNode && selectedNode.check_Child_State == -1) {
            let costitem = $scope.ztreedata.find(cost => cost.id == selectedNode.id)
            if (costitem)
              costitem.open = true
          }

        }
        $scope.ztreedata.forEach(item => {
          if (!item.parentId) {
            $scope.currentid = item.id;
            $scope.getall()
            $scope.getallroad()
          }
        })

        $scope.ztreeInit()

      }
    })
  }
  $scope.ztreedataInit();
  $scope.showdepart = false;//选择部门弹框
  $scope.showshenpi = false;//选择审批人弹框
  $scope.tochosedepart = function (id) {
    if (id) {
      $scope.userId = id
    }
    $scope.isradio = false;
    $scope.showdepart = true;

    $scope.ztreechoseb()
  }
  $scope.tochosedepart1 = function () {
    $scope.isradio = true;
    $scope.showdepart = true;

    $scope.ztreechosebr()
  }
  $scope.closedepart = function () {
    $scope.haschose = [];
    $scope.haschoseb = [];
    $scope.showdepart = false;
  }
  $scope.closedepart1 = function () {
    $scope.radioList = {};
    $scope.showdepart = false;
  }
  $scope.openshenpi = function () {
    $scope.showshenpi = true;
    $scope.ztreechosep()
  }
  $scope.closeshenpi = function () {
    $scope.haschosep = [];
    $scope.showshenpi = false;
  }
  //选择部门的树状图(多选框)
  $scope.ztreechoseb = function () {
    //var url = "/custom-sbd-web/advCostCenter/getCostCenterList.do";
    var url = "/custom-sbd-web/front/costCenter/getCostCenterList.do";
    $rootScope.ajax.post(url, {}).then(res => {
      if (res.code == 0 && res.data && res.data.listObj.length > 0) {
        $scope.ztreedata1 = res.data.listObj;
        $scope.ztreeInitb()
      }
    })
  }
  //选择部门的树状图（单选框）
  $scope.ztreechosebr = function () {
    //var url = "/custom-sbd-web/advCostCenter/getCostCenterList.do";
    var url = "/custom-sbd-web/front/costCenter/getCostCenterList.do";
    $rootScope.ajax.post(url, {}).then(res => {
      if (res.code == 0 && res.data && res.data.listObj.length > 0) {
        $scope.ztreedata1 = res.data.listObj;
        $scope.ztreeInitbr()
      }
    })
  }
  //选择审批人的树状图
  $scope.ztreechosep = function () {
    // var url = "/custom-sbd-web/advCostCenter/getCostCenterList.do";
    var url = "/custom-sbd-web/front/costCenter/getCostCenterList.do";
    $rootScope.ajax.post(url, {}).then(res => {
      if (res.code == 0 && res.data && res.data.listObj && res.data.listObj.length > 0) {
        angular.forEach(res.data.listObj, function (item, index) {
          item.chkDisabled = true;
          item.isParent = true;
        })
        // 实现数组深拷贝
        $scope.ztreedataList2 = JSON.parse(JSON.stringify(res.data.listObj))

        // debugger

        angular.forEach(res.data.listObj, function (item, index) {
          if (item.advEmployeeRelationVoList && item.advEmployeeRelationVoList.length > 0) {
            angular.forEach(item.advEmployeeRelationVoList, function (k, i) {
              $scope.ztreedataList2.unshift({ 'parentId': k.costCenterId, 'costName': k.username, 'chkDisabled': false, 'userId': k.userId })
            })
          }
        })
        //拿到所有得审批人
        $scope.ztreedata2 = $scope.ztreedataList2
        $scope.ztreeInitp()
      }
    })
  }

  //选择部门保存接口(userid去掉)
  $scope.chosdepart = function () {
    if ($scope.step == 1) {
      //调整部门的（部门详情）
      var url = '/custom-sbd-web/advCostCenter/changeAdvEmployeeRelation.do';
      var params = []
      angular.forEach($scope.haschose, function (item, index) {
        params.push({ 'userId': $scope.userId, 'costCenterId': item })
      })
      // var params = [
      //     {'userId':2427101801000018,'costCenterId':12}

      // ]
      $rootScope.ajax.postJson(url, params).then(res => {
        if (res.code == 0) {
          $scope.haschose = [];
          $scope.haschoseb = [];
          $scope.showdepart = false;
          $rootScope.error.checkCode(res.code, res.result);
        } else {
          $scope.haschose = [];
          $scope.haschoseb = [];
          $rootScope.error.checkCode(res.code, res.message);
        }
      })
    }
    if ($scope.step == 3) {
      // alert(1)
      //编辑员工的选中部门
      $scope.realListb = $scope.haschoseb;
      $scope.showdepart = false;
      $scope.haschoseb = [];
      $scope.haschose = [];
    }

  }
  //单选框的确定按钮
  $scope.chosdepart1 = function () {
    $scope.bumenradio.costName = $scope.radioList.costName;
    $scope.bumenradio.id = $scope.radioList.id;
    $scope.radioList = {};
    $scope.showdepart = false;
  }
  //查询当前用户
  $scope.getcurrent = function () {
    $scope.pageNo = 1;
    $scope.pageSize = 10;
    $scope.employerList = [];
    $scope.currentstep = 2;
    var url = "/custom-sbd-web/advCostCenter/getCostCenterUsers";
    var params = {
      costCenterId: $scope.currentid,
      currentPage: $scope.pageNo,
      itemsPerPage: $scope.pageSize,
    }
    $rootScope.ajax.postJson(url, params).then(res => {
      if (res.code == 0 && res.data && res.data.listObj && res.data.listObj.length > 0) {
        $scope.employerList = res.data.listObj;
        $scope.totalCount = res.data.total;
        $scope.totalPage = $scope.totalCount % $scope.pageSize == 0 ? (($scope.totalCount / $scope.pageSize) || 1) : parseInt($scope.totalCount / $scope.pageSize) + 1;
        $scope.isShowPage = true;
      } else {
        $scope.isShowPage = false;
        $rootScope.error.checkCode(res.code, res.message);
      }
    })
  }
  //查询所有用户
  $scope.getall = function () {
    $scope.pageNo = 1;
    $scope.pageSize = 10;
    $scope.employerList = [];
    $scope.currentstep = 1;
    //先查询到该节点所有的成本中心
    // var url = "/custom-sbd-web/advCostCenter/getAllChildCostCenterUsers.do";
    var url = "/custom-sbd-web/front/costCenter/getAllChildUsersByCostCenterId.do";
    var params = {
      'costCenterId': $scope.currentid,
      'currentPage': $scope.pageNo,
      'itemsPerPage': $scope.pageSize,
      'costCenterIds': $scope.costCenterIds
    }
    $rootScope.ajax.postJson(url, params).then(res => {
      if (res.code == 0 && res.data && res.data.listObj && res.data.listObj.length > 0) {
        $scope.employerList = res.data.listObj;
        $scope.totalCount = res.data.total;
        $scope.totalPage = $scope.totalCount % $scope.pageSize == 0 ? (($scope.totalCount / $scope.pageSize) || 1) : parseInt($scope.totalCount / $scope.pageSize) + 1;
        $scope.isShowPage = true;
      } else {
        $scope.isShowPage = false;
        $rootScope.error.checkCode(res.code, res.message);
      }
    })
  }

  // 删除成本中心
  $scope.delcost = function () {
    var url = '/custom-sbd-web/advCostCenter/delCostCenter.do';
    var params = {
      'id': $scope.currentid,
    }
    $rootScope.ajax.postJson(url, params).then(res => {
      if (res.code == 0) {
        $scope.huifu()
      } else {
        $rootScope.error.checkCode(res.code, res.message);
      }
    })
  }
  //新增同级成本中心
  $scope.addsame = function () {
    $scope.realList1 = []
    $scope.isShowStep2 = false
    $scope.idshow = false;
    $scope.pdz = true;
    $scope.showeditdig = false;
    $scope.step = 2;
  }
  //新增下级成本中心
  $scope.addsamex = function () {
    $scope.realList1 = []
    $scope.isShowStep2 = false
    $scope.idshow = false;
    $scope.pdz = false;
    $scope.showeditdig = false;
    $scope.step = 2;
  }
  // 成本中心新增同级和下级新增的一些字段
  $scope.addEquative = {
    desc: '', //描述
    approvalWay: 2,
    approvalAmount: ''//审批金额
  }
  // $scope.editName = '';//新增时的成本中心名称
  //保存新增部门接口
  $scope.saveb = function () {
    if ($scope.idshow) {
      if ($scope.currentdata.approvalWay == 1) {
        // $scope.advApprovalRelationList
        var zslist = [];
        var zsobj = {}
        angular.forEach($scope.realList1, item => {

          zsobj = { 'userId': item.userId, 'approvedType': 1 };
          zslist.push(zsobj)
        })
        $scope.advApprovalRelationList = zslist;
      } else {
        $scope.advApprovalRelationList = [];
        $scope.currentdata.approvalAmount = '';
      }
      if ($scope.currentdata.approvalWay == 1) {
        if ($scope.advApprovalRelationList && $scope.advApprovalRelationList.length == 0) {
          $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('请选择审批人'));
          return;
        }
        if (!$scope.currentdata.approvalAmount) {
          $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('请选择审批金额'));
          return;
        }
      }
      if ($scope.currentdata.parentId == 0) {
        $scope.relationType = 1;
        $scope.relationId = $scope.currentdata.id
      } else if ($scope.prevnode.parentId == 0) {
        $scope.relationType = 2;
        $scope.relationId = $scope.currentdata.id
      } else {
        $scope.relationType = 3;
        $scope.relationId = ''
      }

      var url = "/custom-sbd-web/advCostCenter/editCostCenter.do"
      //暂时缺少参数
      params = {
        id: $scope.currentdata.id,
        // parentId:$scope.bumenradio.id,
        parentId: $scope.currentdata.parentId,
        costName: $scope.currentdata.costName,
        relationType: $scope.relationType,
        relationId: $scope.relationId,
        merchantId: $scope.currentdata.merchantId,
        approvalWay: $scope.currentdata.approvalWay,
        approvalAmount: $scope.currentdata.approvalAmount,
        advApprovalRelationList: $scope.advApprovalRelationList,
        desc: $scope.currentdata.desc,
      }
      $rootScope.ajax.postJson(url, params).then(res => {
        if (res.code == 0) {
          $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('修改成功'));
          $scope.huifu_add()
          $scope.goback()
        } else {
          $rootScope.error.checkCode(res.code, res.message);
        }
      })
    } else {
      if ($scope.addEquative.approvalWay == 1) {
        // $scope.advApprovalRelationList
        var zslist = [];
        var zsobj = {}
        angular.forEach($scope.realList1, item => {

          zsobj = { 'userId': item.id, 'approvedType': 1 };
          zslist.push(zsobj)
        })
        $scope.advApprovalRelationList = zslist;
      } else {
        $scope.advApprovalRelationList = [];
        $scope.info.approvalAmount = '';
      }
      if (!$scope.info.editName) {
        $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('请填写成本中心名称'));
        return;
      }
      if ($scope.addEquative.approvalWay == 1) {
        if ($scope.advApprovalRelationList && $scope.advApprovalRelationList.length == 0) {
          $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('请选择审批人'));
          return;
        }
        if (!$scope.addEquative.approvalAmount) {
          $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('请输入审批金额'));
          return;
        }
      }
      //新增保存成本中心
      var url = "/custom-sbd-web/advCostCenter/addCostCenter.do";
      //需要分为 新增同级和下级
      if ($scope.pdz) {
        //新增同级
        $scope.pdzid = $scope.prevnode.id;
      } else {
        //新增下级
        $scope.pdzid = $scope.currentdata.id
      }
      if ($scope.currentdata.parentId == 0) {
        $scope.relationType = 1;
        $scope.relationId = $scope.currentdata.id
      } else if ($scope.prevnode.parentId == 0) {
        $scope.relationType = 2;
        $scope.relationId = $scope.currentdata.id
      } else {
        $scope.relationType = 3;
        $scope.relationId = ''
      }
      var params = {
        // id:$scope.currentdata.id,
        parentId: $scope.pdzid,
        costName: $scope.info.editName,
        relationType: $scope.relationType,
        relationId: $scope.relationId,
        approvalWay: $scope.addEquative.approvalWay,
        approvalAmount: $scope.addEquative.approvalAmount,
        advApprovalRelationList: $scope.advApprovalRelationList,
        desc: $scope.addEquative.desc,
      }
      $rootScope.ajax.postJson(url, params).then(res => {
        if (res.code == 0) {
          $scope.huifu_add()
          $scope.goback()
        } else {
          $rootScope.error.checkCode(res.code, res.message);
          $scope.addEquative.approvalWay = 2;
          $scope.addEquative.approvalAmount = '';
          $scope.advApprovalRelationList = [];
          $scope.info.editName = '';
          $scope.realList1 = [];
        }
      })
    }
  }

  $scope.huifu = function () {
    $scope.ztreedataInit()
  }

  //添加成本中心，刷新左侧ztree
  $scope.huifu_add = function () {
    $scope.ztreedataInit()
  }
  //上传文件
  $scope.upload = function () {
    if (!$scope.fileUrl) {
      return;
    }
    var url = '/custom-sbd-web/advCostCenter/importCostCenter.do';
    Upload.upload({
      url: url,
      data: {
        file: $scope.fileUrl,
      }
    }).success(function (data) {
      if (data.code == 0) {
        location.reload()
      } else {
        $rootScope.error.checkCode($scope.i18n('提示'), data.data);
        return;
      }
    })
  }
  //编辑部门
  $scope.editbumen = function () {
    $scope.showeditdig = false;
    $scope.step = 2;
    $scope.idshow = true;
    $scope.pdz = true;
  }
  //上移一层
  $scope.moveup = function () {
    var url = "/custom-sbd-web/advCostCenter/changeCostCenterSequence/" + $scope.currentid + "/UP.do";
    $rootScope.ajax.post(url, {}).then(res => {
      if (res.code == 0) {
        $scope.ztreedataInit();
        $scope.showeditdig = false;
      } else {
        $rootScope.error.checkCode(res.code, res.message);
      }
    })

  }
  //下移一层
  $scope.movedown = function () {
    var url = "/custom-sbd-web/advCostCenter/changeCostCenterSequence/" + $scope.currentid + "/DOWN.do";
    $rootScope.ajax.post(url, {}).then(res => {
      if (res.code == 0) {
        $scope.ztreedataInit();
        $scope.showeditdig = false;
      } else {
        $rootScope.error.checkCode(res.code, res.message);
      }
    })
  }
  //置顶
  $scope.movetop = function () {
    var url = "/custom-sbd-web/advCostCenter/changeCostCenterSequence/" + $scope.currentid + "/TOP.do";
    $rootScope.ajax.post(url, {}).then(res => {
      if (res.code == 0) {
        $scope.ztreedataInit();
        $scope.showeditdig = false;
      } else {
        $rootScope.error.checkCode(res.code, res.message);
      }
    })
  }
  //置底
  $scope.movebottom = function () {
    var url = "/custom-sbd-web/advCostCenter/changeCostCenterSequence/" + $scope.currentid + "/BOTTOM.do";
    $rootScope.ajax.post(url, {}).then(res => {
      if (res.code == 0) {
        $scope.ztreedataInit();
        $scope.showeditdig = false;
      } else {
        $rootScope.error.checkCode(res.code, res.message);
      }
    })
  }
  $scope.userInfo = {

  }
  //编辑员工  （详情）
  $scope.employDetail = function (id) {
    var url = "/custom-sbd-web/user/getUserDetail.do";
    var params = id
    $rootScope.ajax.postJson(url, params).then(res => {
      if (res.code == 0) {
        $scope.userInfo = res.data;
        $scope.custominfo = res.data;
        if ($scope.custominfo.finStart.indexOf('-') != -1) {
          $scope.userEdit.month = $scope.custominfo.finStart.split('-')[0];
          $scope.userEdit.day = $scope.custominfo.finStart.split('-')[1];
        }

      }
    })
  }
  $scope.cateList = [];
  //编辑用户的一级类目
  $scope.getCateid = function () {
    var url = '/back-product-web2/extraLogin/category2/listCategoryByUserId.do';
    var params = {
      'treeHigh': 1,
      'parentId': 7,
      'userId': $scope.userId
    }
    $rootScope.ajax.postJson(url, params).then(res => {
      if (res.code == 0 && res.data) {
        angular.forEach(res.data, item => {
          if (item.productVisitType == null) {
            item.productVisitType = 3;
          }
        })
        $scope.cateList = res.data;
      }
    })
  }
  //返回部门详情
  $scope.back1 = function () {
    $scope.custominfo.approveType = 3
    $scope.custominfo.soAmountLimitIs = 0
    $scope.custominfo.soAmountLimit = null
    $scope.custominfo.itemAmountLimitIs = 0
    $scope.custominfo.itemAmountLimit = null
    $scope.custominfo.monthAmountLimitIs = 0
    $scope.custominfo.monthAmountLimit = null
    $scope.custominfo.seasonAmountLimitIs = 0
    $scope.custominfo.yearAmountLimitIs = 0
    $scope.custominfo.yearAmountLimit = null
    $scope.custominfo.seasonAmountLimitQ1 = null
    $scope.custominfo.seasonAmountLimitQ2 = null
    $scope.custominfo.seasonAmountLimitQ3 = null
    $scope.custominfo.seasonAmountLimitQ4 = null
    $scope.custominfo.monthOverIs = 0
    $scope.custominfo.seasonOverIs = 0
    $scope.custominfo.newAddressIs = 0
    $scope.custominfo.showReportIs = 0
    $scope.custominfo.advEmployeeRelationList = []
    $scope.custominfo.advApprovalRelationList = []
    $scope.custominfo.advProductCreditList = []
    $scope.custominfo.approvalAmountLimit = null
    $scope.realListb = [];
    $scope.realList = [];
    $scope.step = 1;
    $scope.getCateid()
  }
  //自定义信息
  $scope.custominfo = {
    approveType: 3,//审批方式
    finStart: null,//其起始月份
    soAmountLimitIs: 0,//单笔限额
    soAmountLimit: null,
    itemAmountLimitIs: 0,//商品限额
    itemAmountLimit: null,
    monthAmountLimitIs: 0,//月限额
    monthAmountLimit: null,
    seasonAmountLimitIs: 0,//季度限额
    seasonAmountLimitQ1: null,
    seasonAmountLimitQ2: null,
    seasonAmountLimitQ3: null,
    seasonAmountLimitQ4: null,
    yearAmountLimitIs: 0,//年限购
    yearAmountLimit: null,
    monthOverIs: 0,//月累计
    seasonOverIs: 0,//季度累计
    newAddressIs: 0,//新建收货地址
    showReportIs: 0,//显示报表
    approvalAmountLimit: null,//审批金额

  }
  $scope.userInfochose = {
    advEmployeeRelationList: [],//选择的部门
    advApprovalRelationList: [],//选择的员工
    advProductCreditList: [],//一级类目,
  }
  //关于月份与日期
  $scope.infos = {
    months: [],
    days: [],
  }
  $scope.userEdit = {
    month: '',
    day: '',
  }

  $scope.getOptions = function () {
    "use strict";
    var i = -1;
    //添加月份
    for (i = 1; i <= 12; i++) {
      $scope.infos.months.push(i);
    }
    //添加天份
    for (i = 1; i <= 31; i++) {
      $scope.infos.days.push(i);
    }
  }

  $scope.setDays = function () {
    var monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var mon = $scope.userEdit.month;
    var num = monthDays[mon - 1];
    for (var i = $scope.infos.days.length; i >= num; i--) {
      var index = $.inArray(i, $scope.infos.days);
      if (index !== -1) {
        $scope.infos.days.splice(index, 1);
      }
      ;
    }
    for (var i = 1; i <= num; i++) {
      if ($.inArray(i, $scope.infos.days) === -1) {
        $scope.infos.days.push(i);
      }
    }
  }
  $scope.getOptions()
  //$scope.authorizeSum=0;
  //保存编辑员工
  $scope.saveEmploy = function () {
    $scope.authorizeSum = 0;
    $scope.userInfochose.advEmployeeRelationList = [];
    angular.forEach($scope.realListb, function (item, index) {
      $scope.userInfochose.advEmployeeRelationList.push({ 'userId': $scope.userId, 'costCenterId': item.id })
    })
    $scope.userInfochose.advApprovalRelationList = [];
    angular.forEach($scope.realList, function (item, index) {
      $scope.userInfochose.advApprovalRelationList.push({ 'approvedType': 2, 'approveAmount': item.approveAmount, 'approvedId': $scope.userId, 'userId': item.userId, "approvalSequence": index })
    })
    $scope.userInfochose.advProductCreditList = [];
    angular.forEach($scope.cateList, function (item, index) {
      $scope.userInfochose.advProductCreditList.push({ 'category': item.id, 'userId': $scope.userId, 'productVisitType': item.productVisitType })
    })


    //计算审批人金额
    angular.forEach($scope.realList, function (item, index) {
      if (index == 0 || Number($scope.authorizeSum) > Number(item.approveAmount))
        $scope.authorizeSum = item.approveAmount;
    })

    if ($scope.custominfo.approveType == 2)
      if (+$scope.authorizeSum < +$scope.custominfo.approvalAmountLimit) {
        $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('审批人金额小于审批金额，请重新填写'));
        console.log("cuowu")
        return;
      }
    //拿到月日
    var finStart = $scope.userEdit.month + '-' + $scope.userEdit.day

    if (!$scope.userInfo.username) {
      $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('请填写用户账号'));
      return;
    }
    // if(!$scope.userInfo.password){
    //     $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n('请填写密码'));
    //     return;
    // }
    // if(!$scope.userInfo.password2){
    //     $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n('请填写确认密码'));
    //     return;
    // }
    if ($scope.userInfo.password2 != $scope.userInfo.password) {
      $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('两次密码不一致'));
      return;
    }
    if (!$scope.userInfo.nickname) {
      $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('请填写姓名'));
      return;
    }
    if (!$scope.userInfo.linkTel || !$scope.userInfo.linkTelExt) {
      $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('请填写联系电话'));
      return;
    }
    /*      if(!$scope.userInfo.faxTel||!$scope.userInfo.faxTelExt){
              $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n('请填写传真'));
              return; 
          }*/
    if (!$scope.userInfo.email) {
      $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('请填写邮箱'));
      return;
    }
    if ($scope.realListb.length == 0) {
      $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('请选择成本中心'));
      return;
    }
    if ($scope.custominfo.approveType == 2) {
      if ($scope.realList.length == 0) {
        $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('请选择审批人'));
        return;
      }
      if ($scope.realList.length > 0) {
        for (var i = 1; i < $scope.realList.length; i++) {
          // if(Number($scope.realList[i-1].money)>Number($scope.realList[i].money)){
          //     $rootScope.error.checkCode($scope.i18n('提示'),$scope.i18n('审批人金额请从小到大排序'));
          //     return;
          // }
          if (Number($scope.realList[i - 1].approveAmount) > Number($scope.realList[i].approveAmount)) {
            $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('审批人金额请从小到大排序'));
            return;
          }
        }
      }
      if (!$scope.custominfo.approvalAmountLimit) {
        $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('请填写审批金额'));
        return;
      }
    } else {
      $scope.custominfo.advApprovalRelationList = [];
      $scope.realList = [];
    }
    if ($scope.custominfo.soAmountLimitIs === 1 && !$scope.custominfo.soAmountLimit) {
      $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('请填写单笔订单采购限额'));
      return;
    }
    if ($scope.custominfo.itemAmountLimitIs == 1 && !$scope.custominfo.itemAmountLimit) {
      $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('请填写单笔订单单一商品限额'));
      return;
    }
    if ($scope.custominfo.monthAmountLimitIs == 1 && !$scope.custominfo.monthAmountLimit) {
      $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('请填写月采购限额'));
      return;
    }
    if ($scope.custominfo.seasonAmountLimitIs == 1 && (!$scope.custominfo.seasonAmountLimitQ1 || !$scope.custominfo.seasonAmountLimitQ2 || !$scope.custominfo.seasonAmountLimitQ3 || !$scope.custominfo.seasonAmountLimitQ4)) {
      $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('请填写季度采购限额'));
      return;
    }
    if ($scope.custominfo.yearAmountLimitIs == 1 && !$scope.custominfo.yearAmountLimit) {
      $rootScope.error.checkCode($scope.i18n('提示'), $scope.i18n('请填写年采购限额'));
      return;
    }
    if ($scope.editpassword) {
      $scope.userInfo.password = $scope.userInfo.password
    } else {
      $scope.userInfo.password = ''
    }
    //缺一个一级类目数组
    var params = {
      id: $scope.userInfo.id,
      sex: $scope.userInfo.sex,
      username: $scope.userInfo.username,
      nickname: $scope.userInfo.nickname,
      mobile: $scope.userInfo.mobile,
      linkTel: $scope.userInfo.linkTel,
      linkTelExt: $scope.userInfo.linkTelExt,
      linkTel2: $scope.userInfo.linkTel2,
      linkTelExt2: $scope.userInfo.linkTelExt2,
      faxTel: $scope.userInfo.faxTel,
      faxTelExt: $scope.userInfo.faxTelExt,
      email: $scope.userInfo.email,
      jobNumber: $scope.userInfo.jobNumber,
      approveType: $scope.custominfo.approveType,
      // finStart:$scope.custominfo.finStart,
      soAmountLimitIs: $scope.custominfo.soAmountLimitIs,
      soAmountLimit: $scope.custominfo.soAmountLimit,
      itemAmountLimitIs: $scope.custominfo.itemAmountLimitIs,
      itemAmountLimit: $scope.custominfo.itemAmountLimit,
      monthAmountLimitIs: $scope.custominfo.monthAmountLimitIs,
      monthAmountLimit: $scope.custominfo.monthAmountLimit,
      seasonAmountLimitIs: $scope.custominfo.seasonAmountLimitIs,
      seasonAmountLimitQ1: $scope.custominfo.seasonAmountLimitQ1,
      seasonAmountLimitQ2: $scope.custominfo.seasonAmountLimitQ2,
      seasonAmountLimitQ3: $scope.custominfo.seasonAmountLimitQ3,
      seasonAmountLimitQ4: $scope.custominfo.seasonAmountLimitQ4,
      yearAmountLimitIs: $scope.custominfo.yearAmountLimitIs,
      yearAmountLimit: $scope.custominfo.yearAmountLimit,
      monthOverIs: $scope.custominfo.monthOverIs,
      seasonOverIs: $scope.custominfo.seasonOverIs,
      newAddressIs: $scope.custominfo.newAddressIs,
      showReportIs: $scope.custominfo.showReportIs,
      advEmployeeRelationList: $scope.userInfochose.advEmployeeRelationList,
      advApprovalRelationList: $scope.userInfochose.advApprovalRelationList,
      advProductCreditList: $scope.userInfochose.advProductCreditList,
      finStart: finStart,
      password: $scope.userInfo.password,
      password2: $scope.userInfo.password2,
      approvalAmountLimit: $scope.custominfo.approvalAmountLimit
    }
    var url = '/custom-sbd-web/user/updateUserInfo.do';
    $rootScope.ajax.postJson(url, params).then(res => {
      if (res.code == 0) {
        location.reload()
      } else {
        $rootScope.error.checkCode(res.code, res.message);
      }
    })
  }
  $scope.editpassword = false;
  //修改密码
  $scope.editpas = function () {
    $scope.editpassword = true;
  }

  $scope.moneyid = null;
  $scope.needsmoney = '';

  //修改审批人金额
  $scope.showeditm = function (index) {
    $scope.moneyid = index + 1;
    // $('.edit-person').addClass('show')
  }

  $scope.editconfirm = function (k) {
    $scope.moneyid = '';
    angular.forEach(k, (item, index) => {
      k.approveAmount = k.money1;
    })
  }

  $scope.editcancel = function (k) {
    $scope.moneyid = '';
    angular.forEach(k, (item, index) => {
      k.money1 = null;
    })

  }
}]);
$(function () {
  'use strict'
  //置顶
  $('.top-box').click(function () {
    $("html,body").animate({
      scrollTop: 0
    }, 500);
  })
})