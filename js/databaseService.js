var app = angular.module('bi-assessment.databaseService', [])
  .service('databaseService', function ($http, $q) {
      this.saveResponse = function (response) {
          var deferred = $q.defer();
          $http({
              url: '/saveResponse',
              method: "POST",
              data: response
          })
            .then(function (res) {
                  deferred.resolve(res);
              },
              function (res) { // optional
                  console.log("Answer save failure! ", res);
              });
          return deferred.promise;
      };
      this.getAllResponses = function () {
          var deferred = $q.defer();
          $http({
              method: 'GET',
              url: '/getAllResponses'
          }).then(function (data) {
              console.log("GET Answers", data);
              deferred.resolve(data);
          });
          return deferred.promise;
      };
      // Delete all Responses in DB
      this.emptyDB = function () {
          console.log("dbservice empty db");
          var deferred = $q.defer();
          $http({
              method: 'GET',
              url: '/emptyDB'
          }).then(function (data) {
              deferred.resolve(data);
          });
          return deferred.promise;
      };

      // delete by ID
      this.deleteById = function (id) {
          var deferred = $q.defer();
          $http({
              url: '/deleteResponseById',
              method: "POST",
              data: {"id": id}
          })
            .then(function (res) {
                  deferred.resolve(res);
              },
              function (res) { // optional
                  console.log("DeleteByID failure! ", res);
              });
          return deferred.promise;
      };

      // Get JSON Export
      this.getResponsesJson = function () {
          var deferred = $q.defer();
          $http({
              method: 'GET',
              url: '/getJson'
          }).success(function (data) {
              console.log("GET JSON", data);
              deferred.resolve(data);
          }).error(function () {
              window.alert("JSON GET failure!");
          });
          return deferred.promise;
      };
  });