

var app = angular.module("app")
    .service("dataService", ['$http', '$q', 'ENV', function ($http, $q, ENV) {

        var service =  {};

        /**
         * This function gets all of the data required for the parce overview page
         * Todo update the endpoint to hit the actual server rather than local
         * @returns {*}
         */
        service.overviewGet = function(){

            var deferred = $q.defer();

            $http.get(ENV.apiRoot + '/project_overview/1?returnGeometry=true', { cache: false }).
                then(function(response) {
                  deferred.resolve(response.data);
                }, function(response) {
                  deferred.reject(response);
                });

            return deferred.promise;
        };


        service.parcelsGet = function(){

            var deferred = $q.defer();

            $http.get('../src/temp-data/parcels.json', { cache: true }).
                then(function(response) {
                    deferred.resolve(response.data);
                }, function(response) {
                    deferred.reject(response);
                });

            return deferred.promise;
        };

        service.parcelGet = function(id){

            var deferred = $q.defer();

            $http.get('../src/temp-data/parcel.json', { cache: true }).
                then(function(response) {
                    deferred.resolve(response.data);
                }, function(response) {
                    deferred.reject(response);
                });

            return deferred.promise;
        };

        return service;
  }])

