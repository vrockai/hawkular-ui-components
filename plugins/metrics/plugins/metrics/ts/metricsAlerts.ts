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

/// <reference path="metricsPlugin.ts"/>
/// <reference path="../../includes.ts"/>

module HawkularMetrics {

  export interface IMetricsAlertController {

  }

  export class MetricsAlertController implements IMetricsAlertController {
    public static  $inject = ['$scope', 'HawkularAlert', 'HawkularAlertsManager', '$log', '$q', '$rootScope', '$routeParams'];

    private metricId: string;

    constructor(private $scope:any,
                private HawkularAlert:any,
                private HawkularAlertsManager: HawkularMetrics.IHawkularAlertsManager,
                private $log: ng.ILogService,
                private $q: ng.IQService,
                private $rootScope: any,
                private $routeParams: any,
                private alertList: any) {

      this.$log.debug('querying data');
      this.$log.debug('$routeParams',$routeParams.resourceId);

      this.metricId = $routeParams.resourceId;

      this.alertList = [];

      this.HawkularAlert.Alert.query({tags:this.metricId+'.status.duration'}).$promise.then((data) => {
        this.$log.debug('querying data finished');
        this.alertList = data;
      }, (error) => {
        this.$log.debug('querying data error', error);
      });
    }
  }

  _module.controller('MetricsAlertController', MetricsAlertController);

  export class MetricsAlertSetupController {
    public static  $inject = ['$scope', 'HawkularAlert', 'HawkularAlertsManager', '$log', '$q', '$rootScope', '$routeParams'];

    private metricId: string;
    private trigger_thres: any;
    private trigger_thres_damp: any;
    private trigger_thres_cond: any;
    private trigger_avail: any;
    private trigger_avail_damp: any;

    constructor(private $scope:any,
                private HawkularAlert:any,
                private HawkularAlertsManager: HawkularMetrics.IHawkularAlertsManager,
                private $log: ng.ILogService,
                private $q: ng.IQService,
                private $rootScope: any,
                private $routeParams: any) {

      this.$log.debug('querying data');
      this.$log.debug('$routeParams',$routeParams.resourceId);

      HawkularAlertsManager.getTrigger($routeParams.resourceId + '_trigger_thres').then((data)=> {
        this.trigger_thres = data;
        this.$log.debug('this.trigger_thres', this.trigger_thres);
        return data;
      }).then(()=> {
        return HawkularAlert.Dampening.query({triggerId: $routeParams.resourceId + '_trigger_thres'}).$promise;
      }).then((data)=> {
        this.trigger_thres_damp = data;
        this.$log.debug('this.trigger_thres_damp', this.trigger_thres_damp);
      }).then(()=> {
        return HawkularAlert.Condition.query({triggerId: $routeParams.resourceId + '_trigger_thres'}).$promise;
      }).then((data)=> {
        this.trigger_thres_cond = data;
        this.$log.debug('this.trigger_thres_cond', this.trigger_thres_cond);
      });

      HawkularAlertsManager.getTrigger($routeParams.resourceId + '_trigger_avail').then((data)=> {
        this.trigger_avail = data;
        this.$log.debug('this.trigger_avail', this.trigger_avail);
      }).then(()=> {
        return HawkularAlert.Dampening.query({triggerId: $routeParams.resourceId + '_trigger_avail'}).$promise;
      }).then((data)=> {
        this.trigger_avail_damp = data;
        this.$log.debug('this.trigger_avail_damp', this.trigger_avail_damp);
      });

      this.metricId = $routeParams.resourceId;
      this.$log.debug('this.metricId', this.metricId);
    }

    public save(): void {
      this.$log.debug('Saving Alert Settings');

      // Check if email action exists
      this.HawkularAlertsManager.addEmailAction(this.trigger_thres.actions[0]).then(()=> {
        return this.HawkularAlertsManager.updateTrigger(this.trigger_thres.id, this.trigger_thres);
      }).then(() => {
        this.trigger_avail.actions = this.trigger_thres.actions;
        return this.HawkularAlertsManager.updateTrigger(this.trigger_avail.id, this.trigger_avail);
      }).then(()=> {
        return this.HawkularAlertsManager.updateDampening(this.trigger_thres.id, this.trigger_thres_damp[0].dampeningId, this.trigger_thres_damp[0]);
      }).then(()=> {
        return this.HawkularAlertsManager.updateDampening(this.trigger_avail.id, this.trigger_avail_damp[0].dampeningId, this.trigger_avail_damp[0]);
      }).then(()=> {
        return this.HawkularAlertsManager.updateCondition(this.trigger_thres.id, this.trigger_thres_cond[0].conditionId, this.trigger_thres_cond[0]);
      });
    }
  }

  _module.controller('MetricsAlertSetupController', MetricsAlertSetupController);
}

