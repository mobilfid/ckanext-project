
var app = angular.module("app",
    [ 'ct.ui.router.extras', 'params.manager', 'app.config', 'env.config', 'app.filters','ngMaterial', 'angularFileUpload', 'agGrid', 'ngAnimate', 'ui.bootstrap']);

  var dsrCb = function ($dsr$, paramService) {

    var stateParams = paramService.getState($dsr$.redirect.state);

    angular.forEach($dsr$.redirect.params, function(value, key){

      $dsr$.redirect.params[key] = stateParams[key];
    });

    var toStateParamsAllUndefined = true, redirectStateParamsAllUndefined = true;
    Object.keys($dsr$.to.params).forEach(function(par){

      if($dsr$.to.params[par]) {
        toStateParamsAllUndefined = false
      }

      if($dsr$.redirect.params[par]) {
        redirectStateParamsAllUndefined = false;
      }

    });

    return toStateParamsAllUndefined && !redirectStateParamsAllUndefined;
  };


  app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    var states = [];

    // Parent State
    states.push({
      name: 'tabs',
      url: '/',
      views: {
        'breadcrumbs@': { controller:'breadcrumbsCtrl', templateUrl: '/project-dashboard/src/partials/breadcrumbs.html' },
        'projectHeader@': { controller:'headerCtrl', templateUrl: '/project-dashboard/src/partials/projectHeader.html' },
        'tabs@': {  controller:'tabsCtrl', templateUrl: '/project-dashboard/src/partials/tabs.html' }
      },
      deepStateRedirect: { default: "tabs.overview" },
      resolve: {
        ckanId: function ($window) {

          return $window.location.pathname.split('/')[2];
        },
        cadastaProject: function ($q, $window, dataService) {

          var ckanId = $window.location.pathname.split('/')[2];

          var deferred = $q.defer();

          var promise = dataService.getCadastaProject(ckanId);

          promise.then(function(response){
            deferred.resolve(response);
          },function(err){
            console.error(err);
            deferred.reject(err);

          });

          return deferred.promise;

        },

        // Get the current user's role on currently view project
        userRole: function($q, $window, userService){

          // Get CKAN project name from URL
          var ckanName = $window.location.pathname.split('/')[2];

          var deferred = $q.defer();

          //  Query the CKAN API to get all organizations (and child projects) that this user is a member to
          var promise = userService.getUserRole();

          promise.then(function(response){

            var role = "public";

            //  Loop thru orgs
            angular.forEach(response, function(org){

              // Loop thru org's projects
              angular.forEach(org.organization.packages, function(project) {

                //  If the project names match, grab the role this user plays in the current org.
                if(project.name === ckanName) {
                  role = org.role;
                }
              });
            });

            deferred.resolve(role);
          },function(err){
            console.error(err);
            deferred.reject(err);

          });

          return deferred.promise;
        }
      }});


    // Child State
    states.push({
      name: 'tabs.overview',
      url: 'overview',
      views: {
        'overviewtab': {  templateUrl: '/project-dashboard/src/partials/overview-base.html' }
      },
      deepStateRedirect: { default: "tabs.overview.project-overview" },
      sticky: true
    });

    // Grandchild State
    states.push({
      name: 'tabs.overview.project-overview',
      url: '/',
      views: {
        'projectOverviewTab': {
          controller: 'overviewCtrl',
          templateUrl: '/project-dashboard/src/partials/overview.html' }
      },
        paramsMap:[{key:'map', defaultValue: '(0,0,1)'}],

        onEnter: function($state, $stateParams, mapUtilityService){

          $stateParams.map = mapUtilityService.validateMapParam($stateParams.map);
        },
        reloadOnSearch: false,
        deepStateRedirect: dsrCb,
        sticky: true
    });



    // Grandchild State
    states.push({
      name: 'tabs.overview.fieldData',
      url: '/fieldData',
      views: {
        'fieldDatatab': {templateUrl: '/project-dashboard/src/partials/fieldData.html' }
      },
      deepStateRedirect: { default: "tabs.overview.fieldData.fieldDataList" },
      sticky: true
    });


    // Great-grandchild State
    states.push({
      name: 'tabs.overview.fieldData.fieldDataList',
      url: '/list',
      views: {
        'fieldDataList': {
          controller: 'fieldDataCtrl'}
      },
      sticky:true,
      deepStateRedirect: true
    });


    // Great-grandchild State
    states.push({
      name: 'tabs.overview.fieldData.fieldDatum',
      url: '/:id',
      views: {
        'fieldDatum': {
          controller: 'fieldDatumCtrl'}
      },
      sticky:true,
      deepStateRedirect: true
    });



    // Child State
    states.push({
      name: 'tabs.parcels',
      url: 'parcels',
      views: {
        'parcelstab': {  templateUrl: '/project-dashboard/src/partials/parcels.html' }
      },
      deepStateRedirect: { default: "tabs.parcels.parcellist" },
      sticky: true
    });

    // Grandchild State
    states.push({
      name: 'tabs.parcels.parcellist',
      url: '/list',
      views: {
        'parcelslist': {
          controller: 'parcelsCtrl',
          templateUrl: '/project-dashboard/src/partials/parcelList.html' }
      },
      sticky:true,
      deepStateRedirect: true
    });

    // Grandchild State
    states.push({
      name: 'tabs.parcels.parcel',
      url: '/:id?map',
      views: {
        'parcel': {
          controller: 'parcelCtrl',
          templateUrl: '/project-dashboard/src/partials/parcel.html' }
      },
      onEnter: function($state, $stateParams, mapUtilityService){

        $stateParams.map = mapUtilityService.validateMapParam($stateParams.map);
      },
      reloadOnSearch: false,
      deepStateRedirect: dsrCb,
      paramsMap:[{key:'id'}, {key:'map', defaultValue: '(0,0,1)'}],
      sticky:true
    });

    // Child State
    states.push({
      name: 'tabs.map',
      url: 'map?map',
      views: {
          'maptab': { controller: 'projectMapCtrl', templateUrl: '/project-dashboard/src/partials/map.html' }
      },
      paramsMap:[{key:'map', defaultValue: '(0,0,2)'}],
      onEnter: function($state, $stateParams, mapUtilityService, paramService){

        var state;

        if($stateParams.map === undefined) {
          state = paramService.getState('tabs.map');
          $stateParams.map = state.map;
        }
        $stateParams.map = mapUtilityService.validateMapParam($stateParams.map);

      },
      reloadOnSearch: false,
      deepStateRedirect: dsrCb,
      sticky: true
    });


    // Child State
    states.push({
      name: 'tabs.relationships',
      url: 'relationships',
      views: {
        'relationshipstab': {  templateUrl: '/project-dashboard/src/partials/relationships.html' }
      },
      deepStateRedirect: { default: "tabs.relationships.relationshiplist" },
      sticky: true
    });

    // Grandchild State
    states.push({
      name: 'tabs.relationships.relationshiplist',
      url: '/list',
      views: {
        'relationshiplist': {
          controller: 'relationshipsCtrl',
          templateUrl: '/project-dashboard/src/partials/relationshipList.html'}
      },
      sticky:true,
      deepStateRedirect: true
    });

    // Grandchild State
    states.push({
      name: 'tabs.relationships.relationship',
      url: '/:id?map',
      views: {
        'relationship': {
          controller: 'relationshipCtrl',
          templateUrl: '/project-dashboard/src/partials/relationship.html' }
      },
      onEnter: function($state, $stateParams, mapUtilityService){

        $stateParams.map = mapUtilityService.validateMapParam($stateParams.map);
      },
      reloadOnSearch: false,
      deepStateRedirect: dsrCb,
      paramsMap:[{key:'id'}, {key:'map', defaultValue: '(0,0,1)'}],
      sticky:true

    });



    // Child State
    states.push({
      name: 'tabs.parties',
      url: 'parties',
      views: {
        'partiestab': {  templateUrl: '/project-dashboard/src/partials/parties.html' }
      },
      deepStateRedirect: { default: "tabs.parties.partylist" },
      sticky: true
    });

    // Grandchild State
    states.push({
      name: 'tabs.parties.partylist',
      url: '/list',
      views: {
        'partylist': {
          controller: 'partiesCtrl',
          templateUrl: '/project-dashboard/src/partials/partyList.html'}
      },
      sticky:true,
      deepStateRedirect: true
    });

    // Grandchild State
    states.push({
      name: 'tabs.parties.party',
      url: '/:id?map',
      views: {
        'parcel': {
          controller: 'partyCtrl',
          templateUrl: '/project-dashboard/src/partials/party.html' }
      },
      onEnter: function($state, $stateParams, mapUtilityService){

        $stateParams.map = mapUtilityService.validateMapParam($stateParams.map);
      },
      reloadOnSearch: false,
      deepStateRedirect: dsrCb,
      paramsMap:[{key:'id'}, {key:'map', defaultValue: '(0,0,1)'}],
      sticky:true

    });



    // Child State for activity list
    states.push({
      name: 'tabs.activity',
      url: 'activity',
      views: {
        'activitytab': {  controller:'activityCtrl', templateUrl: '/project-dashboard/src/partials/project_activity.html' }
      },
      deepStateRedirect: dsrCb,
      sticky: true
    });


    // Child State for resource list
    states.push({
      name: 'tabs.resources',
      url: 'resources',
      views: {
        'resourcetab': { controller:'resourceCtrl', templateUrl: '/project-dashboard/src/partials/project_resources.html' }
      },
      deepStateRedirect: dsrCb,
      sticky: true
    });



    // Add the states
    angular.forEach(states, function(state) {
      $stateProvider.state(state);

    });

    $urlRouterProvider.otherwise('/overview?map=(0,0,1)');

  });

  app.run(function($state, paramService){

    var states = $state.get();

    states.forEach(function(state){

      if(!state.abstract && state.hasOwnProperty('paramsMap')) {
        paramService.setState(state);
      }
    });

  });



