/// <reference path="accountsPlugin.ts"/>
module HawkularAccounts {

    export var OrganizationsController = _module.controller("HawkularAccounts.OrganizationsController", [
        '$scope', 'HawkularAccounts.OrganizationService', '$log', '$location',
        ($scope, OrganizationService, $log, $location) => {

            $scope.organizations = [];
            $scope.loading = true;
            $scope.load = () => {
                $log.debug("Trying to load the organizations for this user.");
                $scope.organizations = OrganizationService.query({},
                    ()=> {
                        $log.debug("List of organizations retrieved.");
                        $scope.loading = false
                    },
                    () => {
                        $log.warn("List of organizations could NOT be retrieved.");
                        $scope.loading = false
                    }
                )
            };
            $scope.showCreateForm = () => {
                $location.path('/accounts/organizations/new');
            };
            $scope.remove = (organization) => {
                organization.$remove().then(
                    () => {
                        // removed!
                        $log.debug("Organization removed");
                        $scope.organizations.splice($scope.organizations.indexOf(organization), 1);
                    }
                );
            }

            $scope.load();
        }]);

    export var OrganizationNewController = _module.controller("HawkularAccounts.OrganizationNewController", [
        '$scope', 'HawkularAccounts.OrganizationService', '$log', '$location',
        ($scope, OrganizationService, $log, $location) => {

            $scope.organizationNew = new OrganizationService({});
            $scope.persist = () => {
                $scope.organizationNew.$save({},
                    () => {
                        // success
                        $log.debug("Organization added.");
                        $location.path('/accounts/organizations');
                    },
                    () => {
                        // error
                        $log.debug("Organization could NOT be added.");
                    }
                )
                $log.debug("Trying to persist the organization");
            };
        }]);

    export var OrganizationService = _module.service("HawkularAccounts.OrganizationService", ["$resource", ($resource) => {
        return $resource('http://localhost:8080/hawkular-accounts/organizations/:id', {id:'@id'})
    }]);

    _module.requires.push("ngResource")
}
