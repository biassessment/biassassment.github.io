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
        var businessProcesses = ["Regular financial & tax reporting (external reporting)", "Assurance & special compliance support (e.g. SOX)", "Cost Analysis", "Group Consolidation", "Operational Planning & Budgeting", "Other internal financial reporting", "Strategic Planning", "Market & Sales planning & analysis", "Campaign Management", "Production Planning & Control", "Supply-Chain-Analysis", "Supplier Analysis", "HR Analysis"];

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

        //  calculate Score
        $scope.calculateScores = function (response) {
            var fragen = response[0][0];
            var antworten = response[0][1];

            // Do SKILLS-Calculation
            $scope.skillScore = 0;
            var skillsMapping = {
                "disagree": -2,
                "somewhat disagree": -1,
                "neutral": 0,
                "somewhat agree": 1,
                "agree": 2
            };
            fragen.forEach(function (frage, index) {
                if (frage.indexOf("skills") !== -1) {
                    $scope.skillScore += skillsMapping[antworten[index]];
                    //console.log("skillsMapping: ", skillsMapping[antworten[index]], "current Score: ", $scope.score);
                }
            });

            //  Do decisionType calculation
            $scope.decisionTypeScore = 0;
            var decisionInformationMapping = {
                "disagree": -2,
                "somewhat disagree": -1,
                "neutral": 0,
                "somewhat agree": 1,
                "agree": 2
            };
            // Teil I
            var decision = 0;
            fragen.forEach(function (frage, index) {
                if (frage.indexOf("The decisions I make...") !== -1) {
                    decision += decisionInformationMapping[antworten[index]];
                    //console.log("answer: ", [antworten[index]], "decisionMapping: ", decisionTypeMapping[antworten[index]], "decision Score: ", decision);
                }
            });
            var structuredness = "";
            if (decision < -2) {
                structuredness = "unstructered";
            } else if (decision < 2) {
                structuredness = "semi-structured";
            } else {
                structuredness = "structured";
            }
            // Teil II
            var information = 0;
            fragen.forEach(function (frage, index) {
                if (frage.indexOf("The information that I use for decision-making") !== -1) {
                    information += decisionInformationMapping[antworten[index]];
                    //console.log("answer: ", [antworten[index]], "informationMapping: ", decisionTypeMapping[antworten[index]], "information Score: ", information);
                }
            });
            var managementActivity = "";
            if (information < -3) {
                managementActivity = "Operational Control";
            } else if (information < 3) {
                managementActivity = "Management Control";
            } else {
                managementActivity = "Strategic Planning";
            }
            var decisionTypeMapping = {
                "Operational Control" : {
                    "unstructered": 1,
                    "semi-structured": 4,
                    "structured": 7
                },
                "Management Control" : {
                    "unstructered": 2,
                    "semi-structured": 5,
                    "structured": 8
                },
                "Strategic Planning": {
                    "unstructered": 3,
                    "semi-structured": 6,
                    "structured": 9
                }
            };
            $scope.decisionTypeScore = (decisionTypeMapping[managementActivity][structuredness]);
            //console.log("DecisionType:Score ", $scope.decisionTypeScore);

            // Do OverallScore calculation
            $scope.score = 0;
            var evaluationMapping = {
                "disagree": 0,
                "somewhat disagree": 1,
                "neutral": 2,
                "somewhat agree": 3,
                "agree": 4
            };
            var specialMapping = {
                "disagree": 4,
                "somewhat disagree": 3,
                "neutral": 2,
                "somewhat agree": 1,
                "agree": 0
            };
            $scope.usageScore = 0;
            fragen.forEach(function (frage, index) {
                if (frage.indexOf("information provided by the BI tool") !== -1) {
                    $scope.usageScore += evaluationMapping[antworten[index]];
                    //console.log("answer: ", [antworten[index]], "evaluationMapping: ", evaluationMapping[antworten[index]], "usage Score: ", $scope.usageScore);
                }
            });
            $scope.usageScore = ($scope.usageScore / 12);
            // Benefit Score
            $scope.benefitScore = 0;
            fragen.forEach(function (frage, index) {
                if (frage.indexOf("The BI Tool... […has") !== -1) {
                    $scope.benefitScore += evaluationMapping[antworten[index]];
                    //console.log("answer: ", [antworten[index]], "evaluationMapping: ", evaluationMapping[antworten[index]], "benefit Score: ", $scope.benefitScore);
                }
            });
            $scope.benefitScore = ($scope.benefitScore / 12);
            // UsefulnessScore
            $scope.usefulnessScore = 0;
            fragen.forEach(function (frage, index) {
                if (frage.indexOf("Using the BI Tool...") !== -1) {
                    $scope.usefulnessScore += evaluationMapping[antworten[index]];
                    //console.log("answer: ", [antworten[index]], "evaluationMapping: ", evaluationMapping[antworten[index]], "usefulness Score: ", $scope.usefulnessScore);
                }
            });
            $scope.usefulnessScore = ($scope.usefulnessScore / 20);
            // EaseOfuseScore
            $scope.easeOfUseScore = 0;
            fragen.forEach(function (frage, index) {
                if (frage.indexOf("easy") !== -1) {
                    $scope.easeOfUseScore += evaluationMapping[antworten[index]];
                    //console.log("answer: ", [antworten[index]], "evaluationMapping: ", evaluationMapping[antworten[index]], "easeOfUse Score: ", $scope.easeOfUseScore);
                }
                if (frage.indexOf("The BI Tool often behaves in unexpected ways") !== -1) {
                    $scope.easeOfUseScore += specialMapping[antworten[index]];
                    //console.log("answer: ", index, [antworten[index]], "evaluationMapping: ", specialMapping[antworten[index]], "easeOfUse Score: ", $scope.easeOfUseScore);
                }
            });
            $scope.easeOfUseScore = ($scope.easeOfUseScore / 16);
            $scope.score = ($scope.usageScore + $scope.benefitScore + $scope.usefulnessScore + $scope.easeOfUseScore)/4;

            return {
                "decisionType": $scope.decisionTypeScore,
                "skill": $scope.skillScore,
                "usage": $scope.usageScore,
                "benefit": $scope.benefitScore,
                "usefulness": $scope.usefulnessScore,
                "easeOfUse": $scope.easeOfUseScore,
                "overall": $scope.score
            };
        };

        // Save Response to Database
        ctrl.saveResponse = function () {
            //var response = ctrl.getResponseSheet();
            var response = surveyModel.fakeResponse;
            console.log("Erhaltene Antworten: ", response);
            var fragen = response[0][0];
            var antworten = response[0][1];

            var adjustedResponse = {};
            adjustedResponse["alias"] = antworten[antworten.length - 1];
            adjustedResponse["answers"] = JSON.stringify(response, null, 2);
            adjustedResponse["tool"] = antworten[6];
            var scores = $scope.calculateScores(response);
            for (var score in scores) {
                adjustedResponse[score] = scores[score];
            }
            businessProcesses.forEach(function (businessProcess) {
                if (adjustedResponse["answers"].indexOf(businessProcess) !== -1) {
                    console.log("Treffer! ", businessProcess);
                    adjustedResponse[businessProcess] = 1;
                } else {
                    adjustedResponse[businessProcess] = 0;
                }
            });
            console.log("Ergebnisse ", adjustedResponse);



            //save survey response to database
            databaseService.saveResponse(adjustedResponse).then(function (res) {
                console.log("Antwort gespeichert!", res);
            });
        };

        // Get all Answers
        $scope.calcAndShowResults = function () {
            $scope.showResults = true;
            databaseService.getAllResponses().then(function (res) {
                $scope.allResults = res.data;
                $scope.allResults.answers = JSON.parse($scope.allResults.answers);
                console.log("all Results so far", res);

                // TODO Further calculation with all Responses and creation of figures
                /*
                 *
                 *
                 *
                 */

            })
        };

        $scope.getPersonalResult = function (alias) {
            $scope.personalResult = $scope.allResults.filter(function (res) {
                return res.alias === alias;
            })
        };

        // Empty DB
        $scope.emptyDB = function () {
            databaseService.emptyDB().then(function () {
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