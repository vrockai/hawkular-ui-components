/// <reference path="accountsPlugin.ts"/>
module HawkularAccounts {

    export var OrganizationsController = _module.controller("HawkularAccounts.OrganizationsController", [
        '$scope', 'HawkularAccounts.OrganizationService', '$log',
        ($scope, OrganizationService, $log) => {

            $scope.organizations = [];
            $scope.loading = true;
            $scope.load = () => {
                $log.debug("Trying to load the organizations for this user.");
                $scope.loading = false;
                $scope.organizations = OrganizationService.query({"key":"value"},
                    ()=> {
                        $log.debug("Success called back.");
                        $scope.loading = false
                    },
                    () => {
                        $log.debug("Error called back.");
                        $scope.loading = false
                    }
                )
            };
            $scope.load();
        }]);

    export var OrganizationService = _module.service("HawkularAccounts.OrganizationService", ["$resource", ($resource) => {
        return $resource('http://localhost:8080/hawkular-accounts/organizations', {id:'@id'})
    }]);

    _module.requires.push("ngResource")
}
