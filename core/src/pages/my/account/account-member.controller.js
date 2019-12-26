/**
 * Created by Roy on 17/6/29.
 */
'use strict';

angular.module('appControllers').controller('memberCtrl', ['$scope', '$rootScope', 'Upload', '$location',function ($scope, $rootScope, Upload,$location) {
    $scope.needChangeEnterprise = false;
    $scope.apply = $scope.i18n('申请');
    $scope.neiStatus = false;
    $scope.filePath = '';
    $scope.authentication = {
        enterpriseSecret: '', //企业密令
        realName: '', //员工姓名
        employeeNo: '', //员工工号
        identityCardNo: '', //员工身份证
    }
    $scope.isInviteUser = false;
    $scope.msg = '';

    $scope.shareName=""
    var _ut = $rootScope.util.getUserToken();
    if(!_ut){
        $rootScope.showLoginBox = true;
        return;
    } else {
        //重新获取个人信息
        $rootScope._getUserInfo().then(function(res){
            if(res.code==0){
                $scope.shareName=res.data.memberInfo.realName;
                $scope.inviteInfo = res.data.inviteInfo;
            }
            if ($rootScope.memberInfo.memberType == 1002){
                if ($rootScope.memberInfo.memberType == 1002 && $rootScope.userInfo.identityTypeCode == $rootScope.switchConfig.common.defaultIdentityTypeCode){
                    $scope.isInviteUser = true;
                }
                $rootScope.userInfo.identityTypeCode = 41;

            }

            if ($rootScope.userInfo.identityTypeCode == $rootScope.switchConfig.common.defaultIdentityTypeCode) {
                $scope.activeNum=1;
            } else if ($rootScope.userInfo.identityTypeCode == 43) {
                $scope.activeNum=4;
            } else if ($rootScope.userInfo.identityTypeCode == 41) {
                $scope.activeNum=2;
                if($scope.isInviteUser==false){
                    $scope.astrictPeopleNum();
                    $scope.getShareCode();
                }
                $scope.maxQuota();
            } else if ($rootScope.userInfo.identityTypeCode == 42) {
                $scope.activeNum=3
            }
            if ($rootScope.memberInfo.businessLicencePhoto) {
                $scope.businessLicencePhoto = $rootScope.memberInfo.businessLicencePhoto; //营业执照照片

                $scope.taxRegistrationPhoto = $rootScope.memberInfo.taxRegistrationPhoto; //税务登记证照片

                $scope.accountOpeningPhoto = $rootScope.memberInfo.accountOpeningPhoto; //开户许可证照片
            }
        })
    }
    $scope.changeTab = function (value) {
        $scope.activeNum = value;
        $scope.msg = '';
        if ($rootScope.userInfo.identityTypeCode == $rootScope.switchConfig.common.defaultIdentityTypeCode) {
            $scope.authentication = {
                enterpriseSecret: '', //企业密令
                realName: '', //员工姓名
                employeeNo: '', //员工工号
                identityCardNo: '', //员工身份证
            }
            $scope.businessLicencePhoto = ''; //营业执照照片
            $scope.taxRegistrationPhoto = ''; //税务登记证照片
            $scope.accountOpeningPhoto = ''; //开户许可证照片
        }
    };
    $scope.changeUrl = function(url){
        //判断link是否以http:开头以及是否在小程序环境中
      if (window.__wxjs_environment === "miniprogram") {
        return "https:" + url;
      } else {
        if (!/^http\:/gi.test(url)) {
            return "http:" + url;
        } else {
            return url;
        }
      }
    }
    //亲友号开始
    $scope.getShareCode=function(){
        var url="/api/share/shareInfo";
        var params={
            type:8,
            platformId:2,
        }
        return $rootScope.ajax.post(url, params).then(function (res) {
            if (res.code == 0) {
                $scope.userInfo.invitationLink = res.data.linkUrl + "&shareName=" + $scope.shareName;
            }
        }, function (res) {
        })
    }

    //会员限购规则说明
    $scope.restrictBuy="";
    $scope.maxQuota=function(){
        var url="/api/purchaseRule/memberLimitDetail";
        var params={
        }
        return $rootScope.ajax.post(url, params).then(function (res) {
            if(res.code==0){
                $scope.restrictBuy=res.data
            }
        }, function (res) {
        })
    }

    //人数的限制
    $scope.astrictPeopleNum=function(){
       var url="/ouser-web/api/user/getInviteMemberCountInfo.do";
       var params={
       }
        return $rootScope.ajax.post(url, params).then(function (res) {
            if (res.code == 0) {
                $scope.userInfo.invitedPersonsNum = res.invitedUserCount;
                $scope.userInfo.invitedPersonsTotalNum = res.inviteUserLimit;
                $scope.getShareInformation=res.data
            }
        }, function (res) {
        })
    }

    //企业会员
    $scope.company = function () {
        var enterpriseSecret = $scope.authentication.enterpriseSecret;
        if (!enterpriseSecret) {
            return false;
        }
        $scope.updateUsercode(42);
    }

    //内购会员
    $scope.appUser = function () {       //申请按钮

        $scope.msg = '';
        var realName = $scope.authentication.realName;
        var employeeNo = $scope.authentication.employeeNo;
        var identityCardNo = $scope.authentication.identityCardNo;
        if (!realName || !employeeNo || !identityCardNo) {
            return false;
        }
        /*if (!/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(identityCardNo)) {
         return false;
         }*/
        //验证身份证后4位
        if (!/^\d{3}[0-9X]$/.test(identityCardNo)) {
            $scope.msg = $scope.i18n('身份证输入有误');
            return false;
        }
        $scope.updateUsercode(41);
    }

    //渠道会员
    $scope.channel = function () {
        var businessLicencePhoto = $scope.businessLicencePhoto;
        var taxRegistrationPhoto = $scope.taxRegistrationPhoto;
        var accountOpeningPhoto = $scope.accountOpeningPhoto;
        if (!businessLicencePhoto || !taxRegistrationPhoto || !accountOpeningPhoto) {
            return false;
        }
        $scope.updateUsercode(43);
    }
    $scope.updateUsercode = function (typeCode) {
        var params = {};
        if (typeCode == 41) {           //内购会员
            var realName = $scope.authentication.realName;
            var employeeNo = $scope.authentication.employeeNo;
            var identityCardNo = $scope.authentication.identityCardNo;
            params = {
                identityTypeCode: typeCode,
                realName: realName,
                employeeNo: employeeNo,
                identityCardNo: identityCardNo
            }
        }
        if (typeCode == 42) { //企业会员
            var enterpriseSecret = $scope.authentication.enterpriseSecret;
            params = {
                identityTypeCode: typeCode,
                enterpriseSecret: enterpriseSecret
            }
        }
        if (typeCode == 43) { //渠道会员
            var businessLicencePhoto = $scope.businessLicencePhoto;
            var taxRegistrationPhoto = $scope.taxRegistrationPhoto;
            var accountOpeningPhoto = $scope.accountOpeningPhoto;
            params = {
                identityTypeCode: typeCode,
                businessLicencePhoto: businessLicencePhoto,
                taxRegistrationPhoto: taxRegistrationPhoto,
                accountOpeningPhoto: accountOpeningPhoto
            }
            /* $rootScope.userInfo.licenseAuditStatus = 0;
             return;*/
        }
        $scope.apply = $scope.i18n('审核中') + '...';
        $scope.applyStatus = true;
        var url = '/ouser-center/api/user/member/applyMemberIdentity.do';

        $rootScope.ajax.post(url, params).then(function (res) {
            if (res.code == 0) {
                $scope.apply = $scope.i18n('申请成功');
                $scope.applyStatus = false;
                if (typeCode == 41) {
                    $rootScope._getUserInfo().then(function(res){
                        $scope.astrictPeopleNum();
                        $scope.getShareCode();
                        $scope.maxQuota();
                    })
                } else if(typeCode == 43){
                    //重新获取数据
                    $rootScope._getUserInfo().then(function(res){
                        if (typeCode == 42) {
                            $scope.needChangeEnterprise = false;
                        }
                        //（-1：未提交；0：审核中；1：审核通过；2：审核不通过）
                        if ($rootScope.userInfo.licenseAuditStatus == -1) {
                            $scope.msg = $scope.i18n('重新提交');
                        }
                        if ($rootScope.userInfo.licenseAuditStatus==0){
                            $scope.apply = $scope.i18n('审核中');
                            $scope.applyStatus = true;
                        }
                        if ($rootScope.userInfo.licenseAuditStatus==2){
                            $scope.msg = $scope.i18n('审核未通过') + ',' +$scope.i18n('重新申请');
                        }
                    })
                } else {
                    $rootScope._getUserInfo();
                }
            } else {
                $scope.msg = res.message;
                // $scope.msgUser = res.message;
                $scope.apply = $scope.i18n('申请');
                $scope.applyStatus = false;
            }
        }, function (res) {
        })
    }
    $scope.getUserInfoDetail = function () {
        var params = {
            identityTypeCode: $rootScope.switchConfig.common.defaultIdentityTypeCode,
            cashe: Date.parse(new Date()),
        };
        return  $rootScope.ajax.post('/ouser-center/api/user/info/detail.do', params).then(function (res) {
            if (res.code == 0) {
                $rootScope.logonInfo = res.data;
                $scope.invitationName=res.data.inviteInfo.inviteUserName?res.data.inviteInfo.inviteUserName:res.data.inviteInfo.inviteUserMobile;
                //  会员信息
                $rootScope.memberInfo = $rootScope.logonInfo.memberInfo;
                //  用户信息
                $rootScope.userInfo = $rootScope.logonInfo.userInfo;
            } else {
                $rootScope.util.deleteUserToken();
            }
        }, function (res) {
        })
    }
    $scope.neiCode = function () {
        $scope.neiStatus = !$scope.neiStatus;
    }
    $scope.changeEnterprise = function () {
        $scope.needChangeEnterprise = true;
    }
}])
