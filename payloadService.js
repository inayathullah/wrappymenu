(function(){

    'use strict'

    angular
        .module('wrappydemo')
        .factory('payloadService',payloadService);

    payloadService.$injector=['$q','$http'];

    function payloadService ($q,$http) {

        return {

            loadData: function () {

                var defered=$q.defer();

                $http
                    .get('payload.js')
                    .success(function(response){
                        defered.resolve(response);
                    }).error(function(response,error,e){
                        defered.reject(response);
                    });
                return defered.promise;
            }
        };
    }

}())
