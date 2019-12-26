//import {config} from "../env/config.js";

var appControllers=angular.module("appControllers",['ngCookies','ngFileUpload','directives','ngSanitize','filters','services','cms','ngBindCompile']);
window['appControllers']=appControllers;
appControllers.config(['$httpProvider','$sceDelegateProvider','$locationProvider',function($httpProvider,$sceDelegateProvider,$locationProvider) {
    "use strict";
    $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        'self',
        // Allow loading from our assets domain.  Notice the difference between * and **.
        'http://zscms.odianyun.com/**'
    ]);

    // Initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    // Disable IE ajax request caching
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    var ua = navigator.userAgent.toLowerCase();
    var isIE = ua.indexOf("msie")>-1;
    if(isIE){
        $httpProvider.defaults.headers.get['If-Modified-Since'] = new Date().getTime();
    }
    //$httpProvider.defaults.headers.get['If-Modified-Since'] = new Date().getTime();
    $httpProvider.defaults.headers.Pragma = 'no-cache';
    //$httpProvider.defaults.headers.post['x-requested-with'] = 'XMLHttpRequest';

    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function(data) {
        //
        var param = function(obj) {
            var query = '';
            var name, value, fullSubName, subName, subValue, innerObj, i;

            for (name in obj) {
                value = obj[name];

                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value !== undefined && value !== null) {
                    query += encodeURIComponent(name) + '=' +
                        encodeURIComponent(value) + '&';
                }
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        };

        return angular.isObject(data) && String(data) !== '[object File]'? param(data) : data;
    }];
}]).config(['$provide','$logProvider','config',function($provide,$logProvider,config){
    //true: 打开调试模式; false: 关闭调试模式,在debug时使用$log.debug()
    $logProvider.debugEnabled(config.debugFlag);

    $provide.decorator('$log', ['$delegate',function($delegate){
        return $delegate;
    }]);
}])
.run(["$q","$http","$rootScope", "switchConfigMenu",function($q,$http,$rootScope, switchConfigMenu){
    $rootScope.switchConfig = $.extend(true, config, switchConfigMenu);
    if (window['superConfig']) {
        $rootScope.switchConfig = $.extend(true,$rootScope.switchConfig, window['superConfig']);
    }
    $rootScope.switchConfig.common.defaultIdentityTypeCode = 4;
    if ($rootScope.switchConfig.common.companyProjectType == 'b2b') {
        $rootScope.switchConfig.common.defaultIdentityTypeCode = 7;
    }

   /* $rootScope.switchConfig = $.extend(true, config, switchConfigMenu);
    if (window['switchConfig1']) {
        $rootScope.switchConfig = $.extend(true,$rootScope.switchConfig, window['switchConfig1']);
    }
    if (window['switchConfig2']) {
        $rootScope.switchConfig = $.extend(true,$rootScope.switchConfig, window['switchConfig2']);
    }
    if (window['switchConfig3']) {
        $rootScope.switchConfig = $.extend(true,$rootScope.switchConfig, window['switchConfig3']);
    }*/

    $rootScope.defaultAreasCode = '78'

    $rootScope.ajax= {
        post: function (url, data,flag,header) {
            //$rootScope.isShowProjectLoading = true;
            var deferred = $q.defer();
            $http.post(url, data).success(function (data) {
                $rootScope.isShowProjectLoading = false;
                if(data.code==0) {
                    deferred.resolve(data);
                } else if(data.code==99) {
                    if(flag){
                        deferred.resolve(data);
                    }
                    // $rootScope.util.cookie.delCookie('ut');
                    // location.href='login.html';
                } else {
                    deferred.resolve(data);
                }
            }).error(function (error) {
                $rootScope.isShowProjectLoading = false;
                //系统异常时的回调，如果
                deferred.reject(error);
            });
            return deferred.promise;
        },
        postJson: function (url, data, header) {
            //$rootScope.isShowProjectLoading = true;
            var deferred = $q.defer();
            if (header) {
                header = $.extend({}, {'Content-Type': 'application/json'}, header);
                // Authorization.put("Authorization", "BASIC bXktdHJ1c3RlZC1jbGllbnQtd2l0aC1zZWNyZXQ6c29tZXNlY3JldA==");
            } else {
                header =  {'Content-Type': 'application/json'}
            }
            $http({
                method:"POST",
                url:url,
                data:angular.toJson(data),
                headers: header
            }).success(function(res){
                if( res.code == 0 ) {
                    deferred.resolve(res);
                } else if(res.code==99) {
                    // $rootScope.util.cookie.delCookie('ut');
                    // location.href='login.html';
                } else {
                    deferred.resolve(res);
                }
            }).error(function (error) {
                $rootScope.isShowProjectLoading = false;
                //系统异常时的回调，如果
                deferred.reject(error);
            });
            return deferred.promise;
        },
        postFrom: function (url, data , header) {
            //$rootScope.isShowProjectLoading = true;
            var deferred = $q.defer();
            var config = {
                method: "POST",
                url: url,
                data: data,
            };
            if (header) {
               config.headers = header;
            }
            $http(config).success(function (res) {
                if( res.code == 0 ) {
                    deferred.resolve(res);
                } else if(data.code==99) {
                    // $rootScope.util.cookie.delCookie('ut');
                    // location.href='login.html';
                } else {
                    deferred.resolve(res);
                }
            }).error(function (error) {
                $rootScope.isShowProjectLoading = false;
                //系统异常时的回调，如果
                deferred.reject(error);
            });
            return deferred.promise;
        },
        postConfig: function (url, data, config) {
            //$rootScope.isShowProjectLoading = true;
            var deferred = $q.defer();
            $http.post(url, data, config).success(function (data) {
                $rootScope.isShowProjectLoading = false;
                if(data.code==0) {
                    deferred.resolve(data);
                } else if(data.code==99) {
                    // $rootScope.util.cookie.delCookie('ut');
                    // location.href='login.html';
                } else {
                    deferred.resolve(data);
                }
            }).error(function (error) {
                $rootScope.isShowProjectLoading = false;
                //系统异常时的回调，如果
                deferred.reject(error);
            });
            return deferred.promise;
        },
        put: function (url, data) {
            //$rootScope.isShowProjectLoading = true;
            var deferred = $q.defer();
            $http.put(url, data).success(function (data) {
                $rootScope.isShowProjectLoading = false;
                if(data.code==0) {
                    deferred.resolve(data);
                } else if(data.code==99) {
                    // $rootScope.util.cookie.delCookie('ut');
                    // location.href='login.html';
                } else {
                    deferred.resolve(data);
                }
            }).error(function (error) {
                $rootScope.isShowProjectLoading = false;
                //系统异常时的回调，如果
                deferred.reject(error);
            });
            return deferred.promise;
        },
        _delete: function (url, data) {
            //$rootScope.isShowProjectLoading = true;
            var deferred = $q.defer();
            $http.post(url, data).success(function (data) {
                $rootScope.isShowProjectLoading = false;
                if(data.code==0) {
                    deferred.resolve(data);
                } else if(data.code==99) {
                    // $rootScope.util.cookie.delCookie('ut');
                    // location.href='login.html';
                } else {
                     deferred.resolve(data);
                }
            }).error(function (error) {
                $rootScope.isShowProjectLoading = false;
                //系统异常时的回调，如果
                deferred.reject(error);
            });
            return deferred.promise;
        },
        get: function (url, data) {
            //$rootScope.isShowProjectLoading = true;
            var deferred = $q.defer();
            //var promise = deferred.promise;
            $http.get(url, {params:data||{}}).success(function (data) {
                $rootScope.isShowProjectLoading = false;
                if(data.code==0) {
                    deferred.resolve(data);
                } else if(data.code==99){
                    // $rootScope.util.cookie.delCookie('ut');
                    // location.href='login.html';
                } else{
                    deferred.resolve(data);
                }
            }).error(function (error) {
                $rootScope.isShowProjectLoading = false;
                //系统异常时的回调，如果
                deferred.reject(error);

            });
            return deferred.promise;
        },
        getFrom: function (url, data) {
            //$rootScope.isShowProjectLoading = true;
            var deferred = $q.defer();

            $http({
                method:"GET",
                url:url,
                params:data
            }).success(function(data){
                if( data.code == 0 ) {
                    deferred.resolve(data);
                } else if(data.code==99) {
                    // $rootScope.util.cookie.delCookie('ut');
                    // location.href='login.html';
                } else {
                    deferred.resolve(data);
                }
            }).error(function (error) {
                $rootScope.isShowProjectLoading = false;
                //系统异常时的回调，如果
                deferred.reject(error);
            });
            return deferred.promise;
        },
        jsonP: function (url) {
            //$rootScope.isShowProjectLoading = true;
            var deferred = $q.defer();
            //var promise = deferred.promise;
            $http.jsonp(url).success(function (data) {
                $rootScope.isShowProjectLoading = false;
                if(data.code==0) {
                    deferred.resolve(data);
                } else if(data.code==99){
                    // $rootScope.util.cookie.delCookie('ut');
                    // location.href='login.html';
                } else{
                    deferred.resolve(data);
                }
            }).error(function (error) {
                $rootScope.isShowProjectLoading = false;
                //系统异常时的回调，如果
                deferred.reject(error);
            });
            return deferred.promise;
        },
        getNoKey: function (url, data) {
            //$rootScope.isShowProjectLoading = true;
            var deferred = $q.defer();
            //var promise = deferred.promise;
            $http.get(url, {params:data||{}}).success(function (data) {
                $rootScope.isShowProjectLoading = false;
                if(data.code==0) {
                    deferred.resolve(data);
                } else if(data.code==99){
                    // $rootScope.util.cookie.delCookie('ut');
                    // location.href='login.html';
                } else{
                    deferred.resolve(data);
                }
            }).error(function (error) {
                $rootScope.isShowProjectLoading = false;
                //系统异常时的回调，如果
                deferred.reject(error);

            });
            return deferred.promise;
        },
        getDolphinByMerchantId: function (url, data) {
            var deferred = $q.defer();
            //var promise = deferred.promise;

            //data.merchantId = 1289052100000011;
            $http.get(url, {params:data||{}}).success(function (data) {
                $rootScope.isShowProjectLoading = false;
                if(data.code==0) {
                    deferred.resolve(data);
                } else if(data.code==99){
                    // $rootScope.util.cookie.delCookie('ut');
                    // location.href='login.html';
                } else{
                    deferred.resolve(data);
                }
            }).error(function (error) {
                $rootScope.isShowProjectLoading = false;
                //系统异常时的回调，如果
                deferred.reject(error);

            });
            return deferred.promise;
        }
    };
    $rootScope.getSysTimePromise=function(){
        return $rootScope.ajax.get($rootScope.host + '/realTime/getTimestamp', {nocache:new Date().getTime()});
    }
    //$rootScope.getSysTime=function(cb){
    //    "use strict";
    //    var url = $rootScope.host + '/realTime/getTimestamp?nocache=' + (new Date().getTime());
    //    $rootScope.ajax.get(url, null).then(function(res){
    //        if(cb){
    //            cb(res);
    //        }
    //    })
    //}
}]);

//子模块定义
angular.module('services', []);
angular.module('filters', []);
angular.module('directives',[]);
angular.module('cms',[]).factory("$cmsData",function(){
    if (window['_cms']) {
        return window['_cms']['data'];
    } else {
        return [];
    }
});
angular.module('ngBindCompile', [])
    .directive('ngBindCompile', ['$sce', '$compile', function($sce, $compile) {
        return {
            restrict: 'A',
            compile: function (tElement, tAttrs) {
                return function (scope, element, attrs) {
                    scope.$watch(function() {
                        return $sce.getTrustedHtml(scope.$eval(attrs.ngBindCompile));
                    }, function (value) {
                        element.html(value);
                        $compile(element.contents())(scope);
                    });
                };
            }
        };
    }]);

