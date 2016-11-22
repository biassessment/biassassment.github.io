var app = angular.module('bi-assessment', []);

app.controller('MainCtrl', ['$scope', function ($scope) {
    console.log("bi-assessment tool running");
    $scope.model = {};
}]);


/*
 .config(function($translateProvider){
 $translateProvider.useStaticFilesLoader({
 prefix: '../dist/i18n/',
 suffix: '/angular-surveys.json'
 });
 $translateProvider.preferredLanguage('en');
 })*/