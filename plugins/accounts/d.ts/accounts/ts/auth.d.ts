/// <reference path="accountsPlugin.d.ts" />
/**
 * Attention: this class will probably be replaced by the proper hawt.io Keycloak integration.
 * While it's not done, we are doing the integration by ourselves.
 */
declare module HawkularAccounts {
    class AuthService {
        private $rootScope;
        private $window;
        static $inject: string[];
        constructor($rootScope: ng.IRootScopeService, $window: ng.IWindowService);
        private keycloak();
        onReady(callback: any): any;
        realm(realm?: string): string;
        logout(): void;
        updateToken(periodicity: number): any;
        token(): string;
        isAuthenticated(): boolean;
    }
}
