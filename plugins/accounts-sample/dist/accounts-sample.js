/// <reference path="../libs/hawtio-utilities/defs.d.ts"/>

/// <reference path="../../includes.ts"/>
var Sample;
(function (Sample) {
    Sample.pluginName = "hawkular-sample";
    Sample.log = Logger.get(Sample.pluginName);
    Sample.templatePath = "plugins/sample/html";
})(Sample || (Sample = {}));

/// <reference path="../../includes.ts"/>
/// <reference path="sampleGlobals.ts"/>
var Sample;
(function (Sample) {
    Sample._module = angular.module(Sample.pluginName, []);
    var tab = undefined;
    Sample._module.config(['$locationProvider', '$routeProvider', 'HawtioNavBuilderProvider', function ($locationProvider, $routeProvider, builder) {
        tab = builder.create().id(Sample.pluginName).title(function () { return "Sample"; }).href(function () { return "/samples"; }).subPath("Samples", "/", builder.join(Sample.templatePath, 'samples.html')).build();
        builder.configureRouting($routeProvider, tab);
        $routeProvider.when('/samples/new', { templateUrl: builder.join(Sample.templatePath, 'sample_new.html') });
        $locationProvider.html5Mode(true);
    }]);
    Sample._module.run(['HawtioNav', function (HawtioNav) {
        HawtioNav.add(tab);
        Sample.log.debug("loaded");
    }]);
    hawtioPluginLoader.addModule(Sample.pluginName);
})(Sample || (Sample = {}));

/// <reference path="samplePlugin.ts"/>
/**
 * Attention: this class will probably be replaced by the proper hawt.io Keycloak integration.
 * While it's not done, we are doing the integration by ourselves.
 */
var Sample;
(function (Sample) {
    var AuthService = (function () {
        function AuthService($rootScope, $window) {
            this.$rootScope = $rootScope;
            this.$window = $window;
            var keycloak = $window['keycloak'];
            if (keycloak) {
                if (!keycloak.hasResourceRole('user', 'metrics-console')) {
                    alert('There\'s something wrong with your credentials. Contact support.');
                    keycloak.logout();
                }
                $rootScope['username'] = keycloak.idToken.name;
            }
            else {
                console.log("keycloak is not loaded");
            }
        }
        AuthService.prototype.keycloak = function () {
            return this.$window['keycloak'];
        };
        AuthService.prototype.onReady = function (callback) {
            var _this = this;
            if (this.$window['keycloakReady']) {
                callback();
            }
            else {
                this.keycloak().onReady = function () {
                    _this.$window['keycloakReady'] = true;
                    callback();
                };
            }
        };
        AuthService.prototype.realm = function (realm) {
            if (realm === undefined) {
                return localStorage['realm'];
            }
            localStorage.setItem('realm', realm);
            window.location.reload();
        };
        AuthService.prototype.logout = function () {
            if (!this.keycloak())
                return;
            localStorage.removeItem('realm');
            return this.keycloak().logout();
        };
        AuthService.prototype.updateToken = function (periodicity) {
            if (!this.keycloak())
                return;
            return this.keycloak().updateToken(periodicity);
        };
        AuthService.prototype.token = function () {
            if (!this.keycloak())
                return '';
            return this.keycloak().token;
        };
        AuthService.prototype.isAuthenticated = function () {
            if (!this.keycloak())
                return false;
            return this.keycloak() && this.keycloak().authenticated;
        };
        AuthService.$inject = ['$rootScope', '$window'];
        return AuthService;
    })();
    Sample.AuthService = AuthService;
    Sample._module.service('Auth', AuthService);
})(Sample || (Sample = {}));

/// <reference path="samplePlugin.ts"/>
/**
 * Attention: this class will probably be replaced by the proper hawt.io Keycloak integration.
 * While it's not done, we are doing the integration by ourselves.
 */
var Sample;
(function (Sample) {
    var AuthInterceptorService = (function () {
        function AuthInterceptorService($q, Auth) {
            var _this = this;
            this.$q = $q;
            this.Auth = Auth;
            this.request = function (request) {
                console.debug('Intercepting request');
                var BASE_URL = "http://localhost:8080/hawkular-";
                var addBearer, deferred;
                if (request.url.indexOf(BASE_URL) === -1) {
                    console.debug('The requested URL is not part of the base URL. Base URL: ' + BASE_URL + ', requested URL: ' + request.url);
                    return request;
                }
                addBearer = function () {
                    return _this.Auth.updateToken(5).success(function () {
                        var token = _this.Auth.token();
                        console.debug('Adding bearer token to the request: ' + token);
                        request.headers.Authorization = 'Bearer ' + token;
                        request.headers['X-RHQ-Realm'] = _this.Auth.realm();
                        deferred.notify();
                        return deferred.resolve(request);
                    }).error(function () {
                        console.log("Couldn't update token");
                    });
                };
                deferred = _this.$q.defer();
                _this.Auth.onReady(addBearer);
                return _this.$q.when(deferred.promise);
            };
            this.responseError = function (rejection) {
                console.debug('Intercepting error response');
                if (rejection.status === 401) {
                    // TODO: notify the user that the session is expired
                    _this.Auth.logout();
                }
                return _this.$q.reject(rejection);
            };
        }
        AuthInterceptorService.Factory = function ($q, Auth) {
            return new AuthInterceptorService($q, Auth);
        };
        AuthInterceptorService.$inject = ['$q', 'Auth'];
        return AuthInterceptorService;
    })();
    Sample.AuthInterceptorService = AuthInterceptorService;
    Sample._module.config(function ($httpProvider) {
        console.debug('Adding AuthInterceptor');
        return $httpProvider.interceptors.push(Sample.AuthInterceptorService.Factory);
    });
})(Sample || (Sample = {}));

/// <reference path="samplePlugin.ts"/>
var Sample;
(function (Sample) {
    Sample.SampleController = Sample._module.controller("Sample.SamplesController", [
        '$scope',
        'Sample.SampleService',
        '$log',
        '$location',
        function ($scope, SampleService, $log, $location) {
            $scope.samples = [];
            $scope.loading = true;
            $scope.load = function () {
                $log.debug("Trying to load the samples for this user.");
                $scope.samples = SampleService.query({}, function () {
                    $log.debug("List of samples retrieved.");
                    $scope.loading = false;
                }, function () {
                    $log.warn("List of samples could NOT be retrieved.");
                    $scope.loading = false;
                });
            };
            $scope.showCreateForm = function () {
                $location.path('/samples/new');
            };
            $scope.remove = function (sample) {
                sample.$remove().then(function () {
                    // removed!
                    $log.debug("Sample removed");
                    $scope.samples.splice($scope.samples.indexOf(sample), 1);
                });
            };
            $scope.load();
        }
    ]);
    Sample.SampleNewController = Sample._module.controller("Sample.SampleNewController", [
        '$scope',
        'Sample.SampleService',
        '$log',
        '$location',
        function ($scope, SampleService, $log, $location) {
            $scope.sampleNew = new SampleService({});
            $scope.persist = function () {
                $scope.sampleNew.$save({}, function () {
                    // success
                    $log.debug("Sample added.");
                    $location.path('/samples');
                }, function () {
                    // error
                    $log.debug("Sample could NOT be added.");
                });
                $log.debug("Trying to persist the sample");
            };
        }
    ]);
    Sample.SampleService = Sample._module.service("Sample.SampleService", ["$resource", function ($resource) {
        return $resource('http://localhost:8080/hawkular-accounts-sample/samples/:id', { id: '@id' });
    }]);
    Sample._module.requires.push("ngResource");
})(Sample || (Sample = {}));

angular.module("accounts-sample-templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("plugins/sample/html/sample_new.html","<div class=\"row\">\n    <div class=\"col-md-12\" data-ng-controller=\"Sample.SampleNewController\">\n        <ol class=\"breadcrumb\">\n            <li><a data-ng-href=\"/\">Hawkular</a></li>\n            <li><a data-ng-href=\"/\">Accounts</a></li>\n            <li><a data-ng-href=\"/samples\">Sample</a></li>\n        </ol>\n        <h1>\n            Add Sample\n        </h1>\n\n        <form role=\"form\" class=\"form-horizontal\">\n            <div class=\"form-group\">\n                <label for=\"name\" class=\"col-md-2 control-label\">Name <span class=\"required\">*</span> </label>\n                <div class=\"col-md-6\">\n                    <input type=\"text\" class=\"form-control\" id=\"name\" placeholder=\"Name\"\n                           data-ng-model=\"sampleNew.name\">\n                </div>\n            </div>\n\n            <div class=\"col-md-8\">\n                <div class=\"pull-right\">\n                    <a data-ng-href=\"/samples\" class=\"btn btn-default btn-lg\">Cancel</a>\n                    <button data-ng-click=\"persist()\" type=\"submit\" class=\"btn btn-primary btn-lg\">Save</button>\n                </div>\n            </div>\n\n        </form>\n    </div><!-- /col -->\n</div><!-- /row -->\n");
$templateCache.put("plugins/sample/html/samples.html","<div class=\"row\">\n    <div class=\"col-md-12\" data-ng-controller=\"Sample.SamplesController\">\n        <ol class=\"breadcrumb\">\n            <li><a data-ng-href=\"/\">Hawkular</a></li>\n            <li><a data-ng-href=\"/\">Accounts</a></li>\n            <li><a data-ng-href=\"/samples\">Sample</a></li>\n        </ol>\n        <div class=\"pull-right\">\n            <button class=\"btn btn-primary\" type=\"button\" role=\"button\" data-ng-click=\"showCreateForm()\">Create</button>\n        </div>\n\n        <h1>Samples</h1>\n        <div class=\"progress-description\" data-ng-show=\"loading\">\n            <div class=\"spinner spinner-xs spinner-inline\"></div> <strong>Loading:</strong> Samples\n        </div>\n        <div class=\"row\" data-ng-show=\"!samples.length && !loading\">\n            <div class=\"col-sm-6\">\n                No samples yet. How about creating one?\n            </div>\n        </div>\n\n        <div data-ng-show=\"samples.length && !loading\">\n            <table class=\"table table-striped table-bordered\">\n                <thead>\n                <tr>\n                    <th>Name</th>\n                    <th>&nbsp;</th>\n                </tr>\n                </thead>\n                <tbody>\n                <tr data-ng-repeat=\"sample in samples\">\n                    <td>{{sample.name}}</td>\n                    <td>\n                        <button type=\"button\" class=\"btn btn-default\" aria-label=\"Remove\" data-ng-click=\"remove(sample)\">\n                            <span class=\"pficon pficon-delete\" aria-hidden=\"true\"></span>\n                        </button>\n                    </td>\n                </tr>\n                </tbody>\n            </table>\n        </div>\n    </div><!-- /col -->\n\n</div>\n</div>\n");}]); hawtioPluginLoader.addModule("accounts-sample-templates");