var app = angular.module('bi-assessment.mainCtrl', [])

  .controller('mainCtrl', ['$scope', '$q', '$http', '$state', '$translate', 'mwFormResponseUtils', 'databaseService', 'csvService', function ($scope, $q, $http, $state, $translate, mwFormResponseUtils, databaseService, csvService) {
      console.log("mainCtrl running!");
      $state.go('home');

      // CSV Import/Export
      $scope.csvResult = null; // csv-Import Variable
      $scope.config = surveyModel; // Kopfzeilen Variable
      $scope.csv = {
          content: null,
          header: true,
          headerVisible: true,
          separator: ';',
          separatorVisible: false,
          accept: ".csv",
          encoding: 'ISO-8859-1',
          encodingVisible: false,
          uploadButtonLabel: "upload a csv file"
      };

      // CSV-Export
      $scope.csvExport = function () {
          return csvService.csvExport();
      };
      // CSV-Import
      $scope.$watch("csvResult", function (res) {
          if (!res) {
              return;
          }
          csvService.csvImport(res).then(function () {
              $scope.csvResult = null;
              $scope.calcAndShowResults();
          });
      });

      // Delete Empty Entries DB
      $scope.deleteEmptyEntries = function () {
          $scope.allResults.forEach(function (result) {
              if (result.easeOfUse === null) {
                  databaseService.deleteById(result.id).then(function () {
                      alert("Empty element deleted!");
                  })
              }
          });
      };
      // Empty DB
      $scope.emptyDB = function () {
          databaseService.emptyDB().then(function () {
              window.alert("DB cleared!");
          })
      };


  }]);