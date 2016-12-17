var app = angular.module('bi-assessment.decisionTypeSurveyController', [])

    .controller('decisionTypeSurveyController', ['$scope', '$q', '$http', '$state', '$translate', 'mwFormResponseUtils', 'databaseService', function ($scope, $q, $http, $state, $translate, mwFormResponseUtils, databaseService) {
        console.log("decisionTypeSurveyController running!");
        $scope.start = false;

        // Umfrage-Design
        var decisionTypeSurvey = decisionTypeSurveyModel.model;
        console.log (decisionTypeSurvey);
        //var fakeResponse = surveyModel.fakeResponse;

        // Header-Arrays
        var features = ["AdvancedVisualization", "BusinessQuery", "Calculations", "Collaboration", "Dashboards", "Drilling", "ETL", "InMemoryAnalysis", "InteractiveReports", "MobileBI", "PredictiveAnalysis", "ScheduledReporting", "Spreadsheet", "StatisticalMethods", "VisualDataDiscovery"];
        var businessProcesses = ["Regular Financial and Tax Reporting (External Reporting)", "Assurance and Special Compliance Support (e.g. SOX)", "Cost Analysis", "Group Consolidation", "Operational Planning and Budgeting", "Other Internal Financial Reporting", "Strategic Planning", "Market and Sales Planning and Analysis", "Campaign Management", "Production Planning and Control", "Supply-Chain-Analysis", "Supplier Analysis", "HR Analysis"];
        var surveyFeatures = ["Advanced Visualization", "Business Query", "Calculations", "Collaboration", "Dashboards", "Drill-Down", "ETL", "In-Memory-Analysis", "Interactive Reports", "Mobile BI", "Predictive Analysis", "Scheduled Reporting", "Spreadsheet", "Statistical Methods", "Visual Data Discovery"];

        // Settings for Survey
        var ctrl2 = this;
        $scope.ctrl2 = ctrl2;
        ctrl2.cmergeFormWithResponse = false;
        ctrl2.cgetQuestionWithResponseList = false;
        ctrl2.cgetResponseSheetHeaders = false;
        ctrl2.cgetResponseSheetRow = false;
        ctrl2.cgetResponseSheet = false;
        ctrl2.headersWithQuestionNumber = true;

        ctrl2.formData = decisionTypeSurvey;
        ctrl2.templateData = {};
        ctrl2.formStatus = {};
        ctrl2.formOptions = {autoStart: true};
        ctrl2.formViewer = {};
        ctrl2.responseData = {};
        ctrl2.viewerReadOnly = false;

        //How to use mwFormResponseUtils
        ctrl2.getMerged = function () {
            return mwFormResponseUtils.mergeFormWithResponse(ctrl2.formData, ctrl2.responseData);
        };
        ctrl2.getQuestionWithResponseList = function () {
            return mwFormResponseUtils.getQuestionWithResponseList(ctrl2.formData, ctrl2.responseData);
        };
        ctrl2.getResponseSheetRow = function () {
            return mwFormResponseUtils.getResponseSheetRow(ctrl2.formData, ctrl2.responseData);
        };
        ctrl2.getResponseSheetHeaders = function () {
            return mwFormResponseUtils.getResponseSheetHeaders(ctrl2.formData, ctrl2.headersWithQuestionNumber);
        };
        ctrl2.getResponseSheet = function () {
            return mwFormResponseUtils.getResponseSheet(ctrl2.formData, ctrl2.responseData, ctrl2.headersWithQuestionNumber);
        };

        $scope.startSurvey = function () {
            $scope.start = true;
        };

        // AUSFÜLLEN DER UMFRAGE (vor dem Speichern in DB)

        //  calculate Scores
        $scope.calculateScores = function (response) {
            var fragen = response[0];
            var antworten = response[1];

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
                "Operational Control": {
                    "unstructered": 1,
                    "semi-structured": 4,
                    "structured": 7
                },
                "Management Control": {
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
            $scope.score = ($scope.usageScore + $scope.benefitScore + $scope.usefulnessScore + $scope.easeOfUseScore) / 4;

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
        ctrl2.saveResponse = function () {
            var response = ctrl2.getResponseSheet();
            //var response = surveyModel.fakeResponse[0]; // Response-Mock
            console.log("Erhaltene Antwort: ", response);
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


