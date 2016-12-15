var app = angular.module('bi-assessment.csvService', [])

  .service('csvService', ['databaseService', '$q', function (databaseService, $q) {
      //CSV export
      this.csvExport = function () {
          return databaseService.getResponsesJson();
      };
      //CSV import
      this.csvImport = function (csv) {
          var importFinished = $q.defer();
          var databasePromises = [];
          csv.forEach(function (response) {
              console.log("Import Response: ", response);
              var deferred = $q.defer();
              databaseService.saveResponse(response).then(function () {
                  console.log("saved Response", response);
                  deferred.resolve();
              });
              databasePromises.push(deferred);
          });
          $q.all(databasePromises).then(function () {
              importFinished.resolve();
          });
          return importFinished.promise;
      }
  }]);