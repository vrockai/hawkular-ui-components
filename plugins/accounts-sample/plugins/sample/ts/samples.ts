/// <reference path="samplePlugin.ts"/>
module Sample {

    export var SampleController = _module.controller("Sample.SamplesController", [
        '$scope', 'Sample.SampleService', '$log', '$location',
        ($scope, SampleService, $log, $location) => {

            $scope.samples = [];
            $scope.loading = true;
            $scope.load = () => {
                $log.debug("Trying to load the samples for this user.");
                $scope.samples = SampleService.query({},
                    ()=> {
                        $log.debug("List of samples retrieved.");
                        $scope.loading = false
                    },
                    () => {
                        $log.warn("List of samples could NOT be retrieved.");
                        $scope.loading = false
                    }
                )
            };
            $scope.showCreateForm = () => {
                $location.path('/samples/new');
            };
            $scope.remove = (sample) => {
                sample.$remove().then(
                    () => {
                        // removed!
                        $log.debug("Sample removed");
                        $scope.samples.splice($scope.samples.indexOf(sample), 1);
                    }
                );
            }

            $scope.load();
        }]);

    export var SampleNewController = _module.controller("Sample.SampleNewController", [
        '$scope', 'Sample.SampleService', '$log', '$location',
        ($scope, SampleService, $log, $location) => {

            $scope.sampleNew = new SampleService({});
            $scope.persist = () => {
                $scope.sampleNew.$save({},
                    () => {
                        // success
                        $log.debug("Sample added.");
                        $location.path('/samples');
                    },
                    () => {
                        // error
                        $log.debug("Sample could NOT be added.");
                    }
                )
                $log.debug("Trying to persist the sample");
            };
        }]);

    export var SampleService = _module.service("Sample.SampleService", ["$resource", ($resource) => {
        return $resource('http://localhost:8080/hawkular-accounts-sample/samples/:id', {id:'@id'})
    }]);

    _module.requires.push("ngResource")
}
