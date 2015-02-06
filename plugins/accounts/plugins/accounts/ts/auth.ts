/// <reference path="accountsPlugin.ts"/>
/**
 * Attention: this class will probably be replaced by the proper hawt.io Keycloak integration.
 * While it's not done, we are doing the integration by ourselves.
 */
module HawkularAccounts {

    export class AuthService {
        public static $inject = ['$rootScope', '$window'];
        constructor(private $rootScope:ng.IRootScopeService, private $window:ng.IWindowService) {
            var keycloak = $window['keycloak'];
            if (keycloak) {
                if (!keycloak.hasResourceRole('user', 'metrics-console')) {
                    alert('There\'s something wrong with your credentials. Contact support.');
                    keycloak.logout();
                }
                $rootScope['username'] = keycloak.idToken.name;
            }
        }

        private keycloak():any {
            return this.$window['keycloak'];
        }

        realm(realm?:string):string {
            if (realm === undefined) {
                return localStorage['realm'];
            }
            localStorage.setItem('realm', realm);
            window.location.reload();
        }

        logout():void {
            if (!this.keycloak()) return;
            localStorage.removeItem('realm');
            return this.keycloak().logout();
        }

        updateToken(periodicity:number):any {
            if (!this.keycloak()) return;
            return this.keycloak().updateToken(periodicity);
        }

        token():string {
            if (!this.keycloak()) return '';
            return this.keycloak().token;
        }

        isAuthenticated():boolean {
            if (!this.keycloak()) return false;
            return this.keycloak() && this.keycloak().authenticated;
        }
    }

    _module.service('Auth', AuthService);
}
