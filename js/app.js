var app = angular.module('bi-assessment', [
    'bi-assessment.filters',
    'bi-assessment.databaseService',
    'bi-assessment.csvService',
    'bi-assessment.surveyCtrl',
    'bi-assessment.decisionTypeSurveyCtrl',
    'bi-assessment.resultsCtrl',
    'bi-assessment.personalCtrl',
    'bi-assessment.mainCtrl',
    'ui.router',
    'ngMaterial',
    'mwFormBuilder',
    'mwFormViewer',
    'mwFormUtils',
    'pascalprecht.translate',
    'monospaced.elastic',
    'ngCsv',
    'ngCsvImport'])


  .config(function ($stateProvider) {
      $stateProvider
        .state('home', {
            url: '/',
            templateUrl: '../html/home.html'
        })
        .state('survey', {
            url: '/survey',
            controller: 'surveyCtrl',
            templateUrl: '../html/survey.html'
        })
        .state('results', {
            url: '/results',
            controller: 'resultsCtrl',
            templateUrl: '../html/results.html'
        })
        .state('results.personal', {
            url: '/:alias',
            controller: 'personalCtrl',
            templateUrl: '../html/personal.html'
        })
        .state('decisionTypeSurvey', {
            url: '/decisionTypeSurvey',
            controller:'decisionTypeSurveyCtrl',
            templateUrl: '../html/decisionTypeSurvey.html'
        });
  })

  .config(function ($translateProvider) {
      // diff languages not used yet
      $translateProvider.useStaticFilesLoader({
          prefix: './lang/',
          suffix: '/angular-surveys.json'
      });
      $translateProvider.preferredLanguage('en');
  })

  .config(['$mdAriaProvider', function ($mdAriaProvider) {
      $mdAriaProvider.disableWarnings();
  }]);