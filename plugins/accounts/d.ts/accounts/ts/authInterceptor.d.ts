/// <reference path="accountsPlugin.d.ts" />
/**
 * Attention: this class will probably be replaced by the proper hawt.io Keycloak integration.
 * While it's not done, we are doing the integration by ourselves.
 */
declare module HawkularAccounts {
    class AuthInterceptorService {
        private $q;
        private Auth;
        static $inject: string[];
        static Factory($q: ng.IQService, Auth: HawkularAccounts.AuthService): AuthInterceptorService;
        constructor($q: ng.IQService, Auth: HawkularAccounts.AuthService);
        request: (request: any) => any;
        responseError: (rejection: any) => ng.IPromise<void>;
    }
}
