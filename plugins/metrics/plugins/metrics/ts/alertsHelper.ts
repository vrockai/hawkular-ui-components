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

module HawkularMetrics {

  export interface IHawkularAlertsManager {
    createAction(email: string): ng.IPromise<void>
    createTrigger(triggerName: string, enabled: boolean, conditionType: string, email: string): ng.IPromise<void>
    createCondition(triggerId: string, condition: any): ng.IPromise<void>
    createDampening(triggerId: string, duration: number): ng.IPromise<void>
    getAction(email: string): ng.IPromise<void>
    getActions(triggerId: string): ng.IPromise<void>
    getTrigger(triggerId: string): ng.IPromise<void>
    setEmail(triggerId: string, email: string): ng.IPromise<void>
    setResponseTime(triggerId: string, treshold: number, duration: number, enabled: boolean): ng.IPromise<void>
    setDowntime(triggerId: string, duration: number, enabled: boolean): ng.IPromise<void>
  }

  export class HawkularAlertsManager implements IHawkularAlertsManager{

    public static $inject = ['HawkularAlert'];

    constructor(private HawkularAlert:any) {
    }

    public createTrigger(triggerName: string, enabled: boolean, conditionType: string, email: string): ng.IPromise<void> {
      // Create a trigger
      var triggerId: string;

      return this.HawkularAlert.Trigger.save({
        name: triggerName,
        id: triggerName,
        description: 'Created on ' + Date(),
        firingMatch: 'ALL',
        safetyMatch: 'ALL',
        enabled: enabled,
        safetyEnabled: false,
        actions: [email]
      }).$promise.then((trigger)=> {

          triggerId = trigger.id;
          console.log('trigger...Id',trigger);

          // Parse metrics id from the trigger name
          var dataId: string = trigger.name.slice(0,-14) + '.status.duration';
          console.log('dataId',dataId);

          // Create a conditions for that trigger
          if (conditionType === 'THRESHOLD') {
            return this.createCondition(triggerId,{
              type: conditionType,
              triggerId: triggerId,
              threshold: 1000,
              dataId: dataId,
              operator: 'GT'
            });
          } else if (conditionType === 'AVAILABILITY') {
            return this.createCondition(triggerId, {
              type: conditionType,
              triggerId: triggerId,
              dataId: dataId,
              operator: 'DOWN'
            });
          }
        }).then((condition) => {
          console.log('c triggerId', condition[0]);

          // Create dampening for that trigger
          if (conditionType === 'THRESHOLD') {
            return this.createDampening(triggerId, 7000);
          }
        });
    }

    getAction(email: string): ng.IPromise<void> {
      return this.HawkularAlert.Action.get({
        actionId: email
      }).$promise;
    }

    createAction(email: string): ng.IPromise<void> {
      return this.HawkularAlert.Action.save({
        actionPlugin: 'email',
        actionId: email,
        description: 'Created on ' + Date(),
        to: email
      }).$promise;
    }

    createCondition(triggerId: string, condition: any): ng.IPromise<void> {
      return this.HawkularAlert.Condition.save({triggerId: triggerId}, condition).$promise;
    }

    createDampening(triggerId: string, duration: number): ng.IPromise<void> {
      return this.HawkularAlert.Dampening.save({ triggerId: triggerId }, {
        triggerId: triggerId,
        evalTimeSetting: duration
      }).$promise;
    }

    getActions(triggerId:string): ng.IPromise<void> {
      return undefined;
    }

    getTrigger(triggerId: string): ng.IPromise<void> {
      return this.HawkularAlert.Trigger.get({ triggerId: triggerId }).$promise;
    }

    setEmail(triggerId:string, email:string):ng.IPromise<void> {
      var actions = this.getActions(triggerId);
      return actions.then((actions)=> {

        if (!actions) {
          // If action for this email does not exist, create one
          return this.HawkularAlert.Action.save({

          }).$promise;

        } else {
          // If it exists, just use it
          return this.HawkularAlert.Action.put({
            actionId: ''
          }, {

          }).$promise;
        }

      });
    }

    private updateCondition(triggerId:string, conditionId: string, treshold:number):ng.IPromise<void> {
      return this.HawkularAlert.Condition.put({
          triggerId: triggerId,
          conditionId: conditionId
        }, {
        treshold: treshold
      }).$promise;
    }

    private updateDampening(triggerId: string, dampeningId: string, duration:number):ng.IPromise<void> {
      return this.HawkularAlert.Dampening.put({
          triggerId: triggerId,
          dampeningId: dampeningId
        }, {
          duration: duration
        }
      ).$promise;
    }

    setResponseTime(triggerId:string, treshold:number, duration:number, enabled:boolean):ng.IPromise<void> {
      return undefined;
    }

    setDowntime(triggerId:string, duration:number, enabled:boolean):ng.IPromise<void> {
      return undefined;
    }

  }

  _module.service('HawkularAlertsManager', HawkularAlertsManager);
}
