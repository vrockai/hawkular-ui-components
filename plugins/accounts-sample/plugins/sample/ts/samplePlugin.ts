/// <reference path="../../includes.ts"/>
/// <reference path="sampleGlobals.ts"/>
module Sample {

    export var _module = angular.module(Sample.pluginName, []);

    var tab = undefined;

    _module.config(['$locationProvider', '$routeProvider', 'HawtioNavBuilderProvider', ($locationProvider, $routeProvider:ng.route.IRouteProvider, builder:HawtioMainNav.BuilderFactory) => {
        tab = builder.create()
            .id(Sample.pluginName)
            .title(() => "Sample")
            .href(() => "/samples")
            .subPath("Samples", "/", builder.join(Sample.templatePath, 'samples.html'))
            .build();
        builder.configureRouting($routeProvider, tab);
        $routeProvider.when('/samples/new', {templateUrl: builder.join(Sample.templatePath, 'sample_new.html')});
        $locationProvider.html5Mode(true);
    }]);

    _module.run(['HawtioNav', (HawtioNav:HawtioMainNav.Registry) => {
        HawtioNav.add(tab);
        log.debug("loaded");
    }]);


    hawtioPluginLoader.addModule(Sample.pluginName);
}
