var app = angular.module('bi-assessment.controller', [])

  .controller('surveyCtrl', ['$scope', '$q', '$http', '$state', '$translate', 'mwFormResponseUtils', 'databaseService', function ($scope, $q, $http, $state, $translate, mwFormResponseUtils, databaseService) {
      console.log("surveyCtrl running!");
      $scope.start = false;

      // Umfrage-Design
      var umfrage = surveyModel.model;
      //var fakeResponse = surveyModel.fakeResponse;

      // Header-Arrays
      var features = ["AdvancedVisualization", "BusinessQuery", "Calculations", "Collaboration", "Dashboards", "Drilling", "ETL", "InMemoryAnalysis", "InteractiveReports", "MobileBI", "PredictiveAnalysis", "ScheduledReporting", "Spreadsheet", "StatisticalMethods", "VisualDataDiscovery"];
      var businessProcesses = ["Regular Financial and Tax Reporting (External Reporting)", "Assurance and Special Compliance Support (e.g. SOX)", "Cost Analysis", "Group Consolidation", "Operational Planning and Budgeting", "Other Internal Financial Reporting", "Strategic Planning", "Market and Sales Planning and Analysis", "Campaign Management", "Production Planning and Control", "Supply-Chain-Analysis", "Supplier Analysis", "HR Analysis"];
      var surveyFeatures = ["Advanced Visualization", "Business Query", "Calculations", "Collaboration", "Dashboards", "Drill-Down", "ETL", "In-Memory-Analysis", "Interactive Reports", "Mobile BI", "Predictive Analysis", "Scheduled Reporting", "Spreadsheet", "Statistical Methods", "Visual Data Discovery"];

      // Settings for Survey
      var ctrl = this;
      $scope.ctrl = ctrl;
      ctrl.cmergeFormWithResponse = false;
      ctrl.cgetQuestionWithResponseList = false;
      ctrl.cgetResponseSheetHeaders = false;
      ctrl.cgetResponseSheetRow = false;
      ctrl.cgetResponseSheet = false;
      ctrl.headersWithQuestionNumber = true;

      ctrl.formData = umfrage;
      ctrl.templateData = {};
      ctrl.formStatus = {};
      ctrl.formOptions = {autoStart: true};
      ctrl.formViewer = {};
      ctrl.responseData = {};
      ctrl.viewerReadOnly = false;

      //How to use mwFormResponseUtils
      ctrl.getMerged = function () {
          return mwFormResponseUtils.mergeFormWithResponse(ctrl.formData, ctrl.responseData);
      };
      ctrl.getQuestionWithResponseList = function () {
          return mwFormResponseUtils.getQuestionWithResponseList(ctrl.formData, ctrl.responseData);
      };
      ctrl.getResponseSheetRow = function () {
          return mwFormResponseUtils.getResponseSheetRow(ctrl.formData, ctrl.responseData);
      };
      ctrl.getResponseSheetHeaders = function () {
          return mwFormResponseUtils.getResponseSheetHeaders(ctrl.formData, ctrl.headersWithQuestionNumber);
      };
      ctrl.getResponseSheet = function () {
          return mwFormResponseUtils.getResponseSheet(ctrl.formData, ctrl.responseData, ctrl.headersWithQuestionNumber);
      };

      $scope.startSurvey = function () {
          $scope.start = true;
      };

      // Save Response to Database
      ctrl.saveResponse = function () {
          var response = ctrl.getResponseSheet();
          //var response = surveyModel.fakeResponse[0]; // Response-Mock
          console.log("Erhaltene Antworten: ", response);
          var fragen = response[0];
          var antworten = response[1];

          var adjustedResponse = {};
          adjustedResponse["alias"] = antworten[antworten.length - 1];
          adjustedResponse["answers"] = JSON.stringify(response, null, 2);
          adjustedResponse["tool"] = antworten[6];
          var scores = $scope.calculateScores(response);
          for (var score in scores) {
              adjustedResponse[score] = scores[score];
          }
          //Neues Mapping für Features
          var featureMapping = {
              "never": 0,
              "rarely": 1,
              "sometimes": 2,
              "frequently": 3,
              "all the time": 4
          };
          //Calculate Features
          surveyFeatures.forEach(function (feature) {
              fragen.forEach(function (frage, index) {
                  if (frage.indexOf(feature) !== -1) {
                      adjustedResponse[feature] = featureMapping[antworten[index]] / 4;
                      // console.log("answer: ", [antworten[index]], "featuremapping: ", featureMapping[antworten[index]], feature, $scope.feature);
                  }
              });

          });
          // Calculate Business Processes
          businessProcesses.forEach(function (businessProcess) {
              if (adjustedResponse["answers"].indexOf(businessProcess) !== -1) {
                  //console.log("Treffer! ", businessProcess);
                  adjustedResponse[businessProcess] = 1;
              } else {
                  adjustedResponse[businessProcess] = 0;
              }
          });

          console.log("Ergebnisse ", adjustedResponse);

          //save survey response to database
          databaseService.saveResponse(adjustedResponse).then(function (res) {
              console.log("Antwort gespeichert!", res);
              $state.go('results');
          });
      };

  }]);


