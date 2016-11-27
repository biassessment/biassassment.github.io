var app = angular.module('bi-assessment', ['ngMaterial', 'mwFormBuilder', 'mwFormViewer', 'mwFormUtils', 'pascalprecht.translate', 'monospaced.elastic']);

app.config(function ($translateProvider) {
  // diff languages not used yet
  $translateProvider.useStaticFilesLoader({
    prefix: './lang/',
    suffix: '/angular-surveys.json'
  });
  $translateProvider.preferredLanguage('en');
})
  .controller('MainCtrl', ['$scope', '$q', '$http', '$translate', 'mwFormResponseUtils', 'databaseService', function ($scope, $q, $http, $translate, mwFormResponseUtils, databaseService) {
    console.log("bi-assessment tool running");
    $scope.showResults = false;
    var umfrage = surveyModel.model;
    var fakeResponse = surveyModel.fakeResponse;

    // Settings for Survey
    var ctrl = this;
    ctrl.cmergeFormWithResponse = false;
    ctrl.cgetQuestionWithResponseList = false;
    ctrl.cgetResponseSheetHeaders = false;
    ctrl.cgetResponseSheetRow = false;
    ctrl.cgetResponseSheet = false;
    ctrl.headersWithQuestionNumber = true;

    ctrl.formData = umfrage;
    ctrl.templateData = {};
    ctrl.formStatus = {};
    ctrl.formOptions = {autoStart: false};
    ctrl.formViewer = {};
    ctrl.responseData = fakeResponse; //{};
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

    // Save Response to Database
    ctrl.saveResponse = function () {
      var response = ctrl.getResponseSheet();
      console.log("Erhaltene Antworten: ", response);

      var adjustedResponse = {};
      adjustedResponse["alias"] = response[1][response[1].length - 1];
      adjustedResponse["answers"] = JSON.stringify(response, null, 2);

      // Do SKILLS-Calculation
        var skillsMapping = {
            "disagree": -2,
            "somewhat disagree": -1,
            "neutral": 0,
            "somewhat agree": 1,
            "agree": 2
        };

        response[0].forEach(function(question) {
           if (question.contains("Please select the answer that best describes your skills.")) {

           }
        });



      //save survey response to database
      databaseService.saveResponse(adjustedResponse).then(function(res) {
        console.log("Antwort gespeichert!", res);
      });
    };

    // Get all Answers
    $scope.calcAndShowResults = function () {
      $scope.showResults = true;
      databaseService.getAllResponses().then(function(res) {
        console.log("all Results so far", res);
        $scope.allResults = res.data;

        // TODO Further calculation with all Responses and creation of figures
        /*
         *
         *
         *
         */

      })
    };

    $scope.getPersonalResult = function (alias) {
      $scope.personalResult = $scope.allResults.filter(function(res) {
        return res.alias === alias;
      })
    };

    // Empty DB
    $scope.emptyDB = function () {
      databaseService.emptyDB().then(function() {
        console.log("DB cleared!");
      })
    };
  }])

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
      }).success(function (data) {
        console.log("GET Answers", data);
        deferred.resolve({'data': data});
      }).error(function () {
        window.alert("GetAnswers GET failure!");
      });
      return deferred.promise;
    };


    this.emptyDB = function () {
      console.log("dbservice empty db");
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/emptyDB'
      }).success(function (data) {
        deferred.resolve({'data': data});
      }).error(function () {
        window.alert("EmptyDB GET failure!");
      });
      return deferred.promise;
    };
  });