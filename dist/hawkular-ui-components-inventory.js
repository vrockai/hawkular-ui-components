/// Copyright 2014-2015 Red Hat, Inc. and/or its affiliates
/// and other contributors as indicated by the @author tags.
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///   http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.


var Inventory;
(function (Inventory) {
    Inventory.pluginName = "inventory";
    Inventory.log = Logger.get(Inventory.pluginName);
    Inventory.templatePath = "plugins/inventory/html";
})(Inventory || (Inventory = {}));

var Inventory;
(function (Inventory) {
    Inventory._module = angular.module(Inventory.pluginName, ['ngResource', 'hawkular.services', 'hawkularCharts']);
    var tab = undefined;
    Inventory._module.config(['$locationProvider', '$routeProvider', 'HawtioNavBuilderProvider', 'HawkularInventoryProvider', function ($locationProvider, $routeProvider, builder, HawkularInventoryProvider) {
        tab = builder.create().id(Inventory.pluginName).title(function () { return "Inventory"; }).href(function () { return "/inventory"; }).subPath("Inventory List", "Inventory", builder.join(Inventory.templatePath, 'inventory.html')).build();
        builder.configureRouting($routeProvider, tab);
        $locationProvider.html5Mode(true);
    }]);
    Inventory._module.run(['HawtioNav', function (HawtioNav) {
        HawtioNav.add(tab);
    }]);
    hawtioPluginLoader.addModule(Inventory.pluginName);
})(Inventory || (Inventory = {}));

var Inventory;
(function (Inventory) {
    Inventory.InventoryController = Inventory._module.controller("Inventory.InventoryController", ['$scope', '$rootScope', 'HawkularInventory', 'HawkularMetric', function ($scope, $rootScope, hkInventory, hkMetric) {
        $scope.queryResources = function () {
            if (this.tenantId) {
                this.resources = hkInventory.Resource.query({ tenantId: this.tenantId, type: 'URL' }, function (data) {
                    angular.forEach(data, function (value) {
                        value.metrics = hkInventory.Metric.query({ tenantId: $scope.tenantId, resourceId: value.id });
                    });
                });
            }
        };
        $scope.queryMetrics = function () {
            if (this.tenantId && this.resourceId) {
                this.metrics = hkInventory.Metric.query({ tenantId: this.tenantId, resourceId: this.resourceId });
            }
        };
        $scope.showMetric = function (tenantId, resourceId, metricId) {
            var _tenantId = tenantId || this.tenantId;
            var _resourceId = resourceId || this.resourceId;
            var _metricId = metricId || this.metricId;
            if (_tenantId && _resourceId && _metricId) {
                hkMetric.NumericMetricData.get({ tenantId: _tenantId, numericId: _metricId, buckets: 60 }, function (data) {
                    $rootScope.metricData = data;
                });
            }
        };
        $scope.closeChart = function () {
            delete $rootScope.metricData;
        };
    }]);
})(Inventory || (Inventory = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluY2x1ZGVzLmpzIiwiL1VzZXJzL2FtbWVuZG9uY2EvRHJvcGJveC93b3JrL3dvcmtzcGFjZS9yZWRoYXQvaGF3a3VsYXItdWktY29tcG9uZW50cy9pbnZlbnRvcnkvdHMvaW52ZW50b3J5R2xvYmFscy50cyIsIi9Vc2Vycy9hbW1lbmRvbmNhL0Ryb3Bib3gvd29yay93b3Jrc3BhY2UvcmVkaGF0L2hhd2t1bGFyLXVpLWNvbXBvbmVudHMvaW52ZW50b3J5L3RzL2ludmVudG9yeVBsdWdpbi50cyIsIi9Vc2Vycy9hbW1lbmRvbmNhL0Ryb3Bib3gvd29yay93b3Jrc3BhY2UvcmVkaGF0L2hhd2t1bGFyLXVpLWNvbXBvbmVudHMvaW52ZW50b3J5L3RzL2ludmVudG9yeS50cyJdLCJuYW1lcyI6WyJJbnZlbnRvcnkiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUNlQSxJQUFPLFNBQVMsQ0FRZjtBQVJELFdBQU8sU0FBUyxFQUFDLENBQUM7SUFFTEEsb0JBQVVBLEdBQUdBLFdBQVdBLENBQUNBO0lBRXpCQSxhQUFHQSxHQUFrQkEsTUFBTUEsQ0FBQ0EsR0FBR0EsQ0FBQ0Esb0JBQVVBLENBQUNBLENBQUNBO0lBRTVDQSxzQkFBWUEsR0FBR0Esd0JBQXdCQSxDQUFDQTtBQUVyREEsQ0FBQ0EsRUFSTSxTQUFTLEtBQVQsU0FBUyxRQVFmOztBQ1BELElBQU8sU0FBUyxDQXVCZjtBQXZCRCxXQUFPLFNBQVMsRUFBQyxDQUFDO0lBRUhBLGlCQUFPQSxHQUFHQSxPQUFPQSxDQUFDQSxNQUFNQSxDQUFDQSxTQUFTQSxDQUFDQSxVQUFVQSxFQUFFQSxDQUFDQSxZQUFZQSxFQUFDQSxtQkFBbUJBLEVBQUNBLGdCQUFnQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFFL0dBLElBQUlBLEdBQUdBLEdBQUdBLFNBQVNBLENBQUNBO0lBRXBCQSxpQkFBT0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsbUJBQW1CQSxFQUFFQSxnQkFBZ0JBLEVBQUVBLDBCQUEwQkEsRUFBRUEsMkJBQTJC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LElBQUksQ0FBQyxRQUFRLENBQUM7WUFDMUMsSUFBSSxXQUFXLEdBQUcsVUFBVSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDaEQsSUFBSSxTQUFTLEdBQUcsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUM7WUFDMUMsRUFBRSxDQUFBLENBQUMsU0FBUyxJQUFJLFdBQVcsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUN6QyxRQUFRLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEVBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUMsRUFBRSxVQUFVLElBQUk7b0JBQ3JHLFVBQVUsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO2dCQUMvQixDQUFDLENBQUMsQ0FBQztZQUNMLENBQUM7UUFDSCxDQUFDLENBQUNBO1FBRUZBLE1BQU1BLENBQUNBLFVBQVVBLEdBQUdBO1lBQ2xCLE9BQU8sVUFBVSxDQUFDLFVBQVUsQ0FBQztRQUMvQixDQUFDLENBQUNBO0lBRU5BLENBQUNBLENBQUNBLENBQUNBLENBQUNBO0FBRU5BLENBQUNBLEVBckNNLFNBQVMsS0FBVCxTQUFTLFFBcUNmIiwiZmlsZSI6ImNvbXBpbGVkLmpzIiwic291cmNlc0NvbnRlbnQiOltudWxsLCIvLy8gQ29weXJpZ2h0IDIwMTQtMjAxNSBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlc1xuLy8vIGFuZCBvdGhlciBjb250cmlidXRvcnMgYXMgaW5kaWNhdGVkIGJ5IHRoZSBAYXV0aG9yIHRhZ3MuXG4vLy9cbi8vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vL1xuLy8vICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vLy9cbi8vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2luY2x1ZGVzLnRzXCIvPlxubW9kdWxlIEludmVudG9yeSB7XG5cbiAgZXhwb3J0IHZhciBwbHVnaW5OYW1lID0gXCJpbnZlbnRvcnlcIjtcblxuICBleHBvcnQgdmFyIGxvZzpMb2dnaW5nLkxvZ2dlciA9IExvZ2dlci5nZXQocGx1Z2luTmFtZSk7XG5cbiAgZXhwb3J0IHZhciB0ZW1wbGF0ZVBhdGggPSBcInBsdWdpbnMvaW52ZW50b3J5L2h0bWxcIjtcbiAgXG59XG4iLCIvLy8gQ29weXJpZ2h0IDIwMTQtMjAxNSBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlc1xuLy8vIGFuZCBvdGhlciBjb250cmlidXRvcnMgYXMgaW5kaWNhdGVkIGJ5IHRoZSBAYXV0aG9yIHRhZ3MuXG4vLy9cbi8vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vL1xuLy8vICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vLy9cbi8vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2luY2x1ZGVzLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImludmVudG9yeUdsb2JhbHMudHNcIi8+XG5tb2R1bGUgSW52ZW50b3J5IHtcblxuICAgIGV4cG9ydCB2YXIgX21vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKEludmVudG9yeS5wbHVnaW5OYW1lLCBbJ25nUmVzb3VyY2UnLCdoYXdrdWxhci5zZXJ2aWNlcycsJ2hhd2t1bGFyQ2hhcnRzJ10pO1xuXG4gICAgdmFyIHRhYiA9IHVuZGVmaW5lZDtcblxuICAgIF9tb2R1bGUuY29uZmlnKFsnJGxvY2F0aW9uUHJvdmlkZXInLCAnJHJvdXRlUHJvdmlkZXInLCAnSGF3dGlvTmF2QnVpbGRlclByb3ZpZGVyJywgJ0hhd2t1bGFySW52ZW50b3J5UHJvdmlkZXInLCAoJGxvY2F0aW9uUHJvdmlkZXIsICRyb3V0ZVByb3ZpZGVyOm5nLnJvdXRlLklSb3V0ZVByb3ZpZGVyLCBidWlsZGVyOkhhd3Rpb01haW5OYXYuQnVpbGRlckZhY3RvcnksIEhhd2t1bGFySW52ZW50b3J5UHJvdmlkZXIpID0+IHtcbiAgICAgICAgdGFiID0gYnVpbGRlci5jcmVhdGUoKVxuICAgICAgICAgICAgLmlkKEludmVudG9yeS5wbHVnaW5OYW1lKVxuICAgICAgICAgICAgLnRpdGxlKCgpID0+IFwiSW52ZW50b3J5XCIpXG4gICAgICAgICAgICAuaHJlZigoKSA9PiBcIi9pbnZlbnRvcnlcIilcbiAgICAgICAgICAgIC5zdWJQYXRoKFwiSW52ZW50b3J5IExpc3RcIiwgXCJJbnZlbnRvcnlcIiwgYnVpbGRlci5qb2luKEludmVudG9yeS50ZW1wbGF0ZVBhdGgsICdpbnZlbnRvcnkuaHRtbCcpKVxuICAgICAgICAgICAgLmJ1aWxkKCk7XG4gICAgICAgIGJ1aWxkZXIuY29uZmlndXJlUm91dGluZygkcm91dGVQcm92aWRlciwgdGFiKTtcbiAgICAgICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuICAgIH1dKTtcblxuICAgIF9tb2R1bGUucnVuKFsnSGF3dGlvTmF2JywgKEhhd3Rpb05hdjpIYXd0aW9NYWluTmF2LlJlZ2lzdHJ5KSA9PiB7XG4gICAgICAgIEhhd3Rpb05hdi5hZGQodGFiKTtcbiAgICB9XSk7XG5cblxuICAgIGhhd3Rpb1BsdWdpbkxvYWRlci5hZGRNb2R1bGUoSW52ZW50b3J5LnBsdWdpbk5hbWUpO1xufVxuIiwiLy8vIENvcHlyaWdodCAyMDE0LTIwMTUgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXNcbi8vLyBhbmQgb3RoZXIgY29udHJpYnV0b3JzIGFzIGluZGljYXRlZCBieSB0aGUgQGF1dGhvciB0YWdzLlxuLy8vXG4vLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vLy9cbi8vLyAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy8vXG4vLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJpbnZlbnRvcnlQbHVnaW4udHNcIi8+XG5tb2R1bGUgSW52ZW50b3J5IHtcblxuICBleHBvcnQgdmFyIEludmVudG9yeUNvbnRyb2xsZXIgPSBfbW9kdWxlLmNvbnRyb2xsZXIoXCJJbnZlbnRvcnkuSW52ZW50b3J5Q29udHJvbGxlclwiLCBbJyRzY29wZScsICckcm9vdFNjb3BlJywgJ0hhd2t1bGFySW52ZW50b3J5JywgJ0hhd2t1bGFyTWV0cmljJyAsKCRzY29wZSwgJHJvb3RTY29wZSwgaGtJbnZlbnRvcnksIGhrTWV0cmljKSA9PiB7XG5cbiAgICAgICRzY29wZS5xdWVyeVJlc291cmNlcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZih0aGlzLnRlbmFudElkKSB7XG4gICAgICAgICAgICB0aGlzLnJlc291cmNlcyA9IGhrSW52ZW50b3J5LlJlc291cmNlLnF1ZXJ5KHt0ZW5hbnRJZDogdGhpcy50ZW5hbnRJZCwgdHlwZTogJ1VSTCd9LCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGRhdGEsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLm1ldHJpY3MgPSBoa0ludmVudG9yeS5NZXRyaWMucXVlcnkoe3RlbmFudElkOiAkc2NvcGUudGVuYW50SWQsIHJlc291cmNlSWQ6IHZhbHVlLmlkfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgJHNjb3BlLnF1ZXJ5TWV0cmljcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZih0aGlzLnRlbmFudElkICYmIHRoaXMucmVzb3VyY2VJZCkge1xuICAgICAgICAgICAgdGhpcy5tZXRyaWNzID0gaGtJbnZlbnRvcnkuTWV0cmljLnF1ZXJ5KHt0ZW5hbnRJZDogdGhpcy50ZW5hbnRJZCwgcmVzb3VyY2VJZDogdGhpcy5yZXNvdXJjZUlkfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5zaG93TWV0cmljID0gZnVuY3Rpb24odGVuYW50SWQsIHJlc291cmNlSWQsIG1ldHJpY0lkKSB7XG4gICAgICAgIHZhciBfdGVuYW50SWQgPSB0ZW5hbnRJZCB8fCB0aGlzLnRlbmFudElkO1xuICAgICAgICB2YXIgX3Jlc291cmNlSWQgPSByZXNvdXJjZUlkIHx8IHRoaXMucmVzb3VyY2VJZDtcbiAgICAgICAgdmFyIF9tZXRyaWNJZCA9IG1ldHJpY0lkIHx8IHRoaXMubWV0cmljSWQ7XG4gICAgICAgIGlmKF90ZW5hbnRJZCAmJiBfcmVzb3VyY2VJZCAmJiBfbWV0cmljSWQpIHtcbiAgICAgICAgICBoa01ldHJpYy5OdW1lcmljTWV0cmljRGF0YS5nZXQoe3RlbmFudElkOiBfdGVuYW50SWQsIG51bWVyaWNJZDogX21ldHJpY0lkLCBidWNrZXRzOiA2MH0sIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLm1ldHJpY0RhdGEgPSBkYXRhO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUuY2xvc2VDaGFydCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBkZWxldGUgJHJvb3RTY29wZS5tZXRyaWNEYXRhO1xuICAgICAgfTtcblxuICB9XSk7XG5cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
angular.module("hawkular-ui-components-inventory-templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("plugins/inventory/html/inventory.html","<div ng-controller=\"Inventory.InventoryController\">\n\n    <hr>\n\n    <!-- Dropdown View -->\n    <div class=\"row\">\n        <div class=\" col-md-4\">\n            <div class=\"panel panel-default\">\n                <div class=\"panel-heading\">\n                    <h3 class=\"panel-title\"><i class=\"fa fa-user\"></i> Tenant</h3>\n                </div>\n                <div class=\"panel-body\">\n                    <form role=\"form\" class=\"search-pf has-button\">\n                        <div class=\"form-group has-clear\">\n                            <div class=\"search-pf-input-group\">\n                                <label for=\"tenantId\" class=\"sr-only\">Tenant</label>\n                                <input id=\"tenantId\" type=\"search\" class=\"form-control\" placeholder=\"Tenant ID\" ng-model=\"tenantId\" autofocus>\n                                <button type=\"button\" class=\"clear\" aria-hidden=\"true\" ng-click=\"tenantId = \'\'\"><span class=\"pficon pficon-close\"></span></button>\n                            </div>\n                        </div>\n                        <div class=\"form-group\">\n                            <button class=\"btn btn-default\" type=\"button\" ng-click=\"queryResources()\"><span class=\"fa fa-search\"></span></button>\n                        </div>\n                    </form>\n                </div>\n            </div>\n        </div>\n        <div class=\" col-md-4\">\n            <div class=\"panel panel-default\">\n                <div class=\"panel-heading\">\n                    <h3 class=\"panel-title\"><i class=\"fa fa-cube\"></i> Resource <span class=\"pull-right\" ng-show=\"tenantId && resources\"><a href=\"#\" ng-click=\"showTable = !showTable\"><span ng-hide=\"showTable\">Show</span><span ng-show=\"showTable\">Hide</span> all</a></span></h3>\n                </div>\n                <div class=\"panel-body\">\n                    <select class=\"form-control\" ng-options=\"resource.id as resource.parameters.url + \' (\' +resource.id + \')\' for resource in resources\" ng-model=\"resourceId\" ng-disabled=\"!tenantId || !resources\" ng-hide=\"resources.length === 0\" ng-change=\"queryMetrics()\"></select>\n                    <span ng-show=\"resources.length === 0\"><i class=\"fa fa-warning\"></i> No Resources Available</span>\n                </div>\n            </div>\n        </div>\n        <div class=\" col-md-4\">\n            <div class=\"panel panel-default\">\n                <div class=\"panel-heading\">\n                    <h3 class=\"panel-title\"><i class=\"fa fa-line-chart\"></i> Metric</h3>\n                </div>\n                <div class=\"panel-body\">\n                    <select class=\"form-control\" ng-options=\"metric.name as metric.name for metric in metrics\" ng-model=\"metricId\" ng-disabled=\"!tenantId || !resourceId\" ng-hide=\"metrics.length === 0\"></select>\n                    <span ng-show=\"metrics.length === 0\"><i class=\"fa fa-warning\"></i> No Metrics Available</span>\n                </div>\n            </div>\n        </div>\n    </div>\n    <div class=\"row\">\n        <div class=\"col-md-offset-10\">\n            <a href=\"\" class=\"btn btn-primary btn-lg\" ng-click=\"showMetric()\"><i class=\"fa fa-line-chart\" ng-disabled=\"!metricId\"></i> Show Metric</a>\n        </div>\n    </div>\n\n    <!-- Table View -->\n    <div class=\"row\" ng-show=\"tenantId && showTable\">\n        <div class=\"col-md-12\">\n            <h1>Resources</h1>\n            <table class=\"table table-condensed\">\n                <thead>\n                    <th>Resource ID</th>\n                    <th>Resource Type</th>\n                    <th>Parameters</th>\n                    <th>Metrics</th>\n                </thead>\n                <tr ng-repeat=\"resource in resources\">\n                    <td>{{resource.id}}</td>\n                    <td>{{resource.type}}</td>\n                    <td>\n                        <dl class=\"dl-horizontal\" ng-repeat=\"(name, value) in resource.parameters\">\n                          <dt>{{name}}</dt>\n                          <dd>{{value}}</dd>\n                        </dl>\n                    </td>\n                    <td >\n                        <table>\n                            <tr ng-repeat=\"metric in resource.metrics\">\n                                <td>{{metric.name}} <button class=\"btn btn-primary btn-xs\" ng-click=\"showMetric(tenantId, resource.id, metric.name)\"> <i class=\"fa fa-area-chart\"></i> </button></td>\n                            </tr>\n                        </table>\n                    </td>\n                </tr>\n            </table>\n        </div>\n    </div>\n\n    <!-- Chart View -->\n    <div class=\"row\" ng-show=\"metricData\">\n        <hr>\n        <div class=\"col-md-12\">\n            <div class=\"panel panel-default\">\n                <div class=\"panel-heading\">\n                    <h3 class=\"panel-title\">{{metricData.tenantId}} / {{metricData.name}} <span class=\"pull-right\" ng-click=\"closeChart()\"><i class=\"pficon pficon-close\"></i></span></h3>\n                </div>\n                <div class=\"panel-body\" style=\"height: 280px;\">\n                  <hawkular-chart data=\"{{metricData.data}}\" chart-type=\"bar\" chart-height=\"250\" chart-width=\"1000px\"></hawkular-chart>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n");}]); hawtioPluginLoader.addModule("hawkular-ui-components-inventory-templates");