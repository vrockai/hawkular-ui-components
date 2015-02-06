/// <reference path="../../includes.ts"/>
/// <reference path="accountsGlobals.ts"/>
module HawkularAccounts {
    export var _module = angular.module(HawkularAccounts.pluginName, []);
    var accountsTab:any = undefined;

    _module.config(['$locationProvider', '$routeProvider', 'HawtioNavBuilderProvider', ($locationProvider, $routeProvider:ng.route.IRouteProvider, builder:HawtioMainNav.BuilderFactory) => {
        accountsTab = builder.create()
            .id(HawkularAccounts.pluginName)
            .title(() => "Accounts")
            .href(() => "/accounts")
            .subPath("My account", "accounts", builder.join(HawkularAccounts.templatePath, 'accounts.html'))
            .subPath("Organizations", "organizations", builder.join(HawkularAccounts.templatePath, 'organizations.html'))
            .build();
        builder.configureRouting($routeProvider, accountsTab);

        $locationProvider.html5Mode(true);
    }]);

    _module.run(['HawtioNav', (HawtioNav:HawtioMainNav.Registry) => {
        HawtioNav.add(accountsTab);
    }]);

    hawtioPluginLoader.addModule(HawkularAccounts.pluginName);
}
