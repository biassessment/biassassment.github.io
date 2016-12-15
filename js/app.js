var app = angular.module('bi-assessment', [
    'bi-assessment.filters',
    'bi-assessment.services',
    'bi-assessment.surveyCtrl',
    'bi-assessment.resultsCtrl',
    'ui.router',
    'ngMaterial',
    'mwFormBuilder',
    'mwFormViewer',
    'mwFormUtils',
    'pascalprecht.translate',
    'monospaced.elastic',
    'ngCsv',
    'ngCsvImport']);

app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: '../html/home.html'
    }).state('survey', {
        url: '/survey',
        controller: 'surveyCtrl',
        templateUrl: '../html/survey.html'
    }).state('results', {
        url: '/results',
        controller: 'resultsCtrl',
        templateUrl: '../html/results.html'
    }).state('decisionTypeSurvey', {
        url: '/decisionTypeSurvey',
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
  }])

  .controller('mainCtrl', ['$scope', '$q', '$http', '$state', '$translate', 'mwFormResponseUtils', 'databaseService', 'csvService', function ($scope, $q, $http, $state, $translate, mwFormResponseUtils, databaseService, csvService) {
      console.log("mainCtrl running!");
      $state.go('home');

      $scope.showPersonalResult = false;
      //var fakeResponse = surveyModel.fakeResponse;
      var features = ["AdvancedVisualization", "BusinessQuery", "Calculations", "Collaboration", "Dashboards", "Drilling", "ETL", "InMemoryAnalysis", "InteractiveReports", "MobileBI", "PredictiveAnalysis", "ScheduledReporting", "Spreadsheet", "StatisticalMethods", "VisualDataDiscovery"];
      var businessProcesses = ["Regular Financial and Tax Reporting (External Reporting)", "Assurance and Special Compliance Support (e.g. SOX)", "Cost Analysis", "Group Consolidation", "Operational Planning and Budgeting", "Other Internal Financial Reporting", "Strategic Planning", "Market and Sales Planning and Analysis", "Campaign Management", "Production Planning and Control", "Supply-Chain-Analysis", "Supplier Analysis", "HR Analysis"];
      var surveyFeatures = ["Advanced Visualization", "Business Query", "Calculations", "Collaboration", "Dashboards", "Drill-Down", "ETL", "In-Memory-Analysis", "Interactive Reports", "Mobile BI", "Predictive Analysis", "Scheduled Reporting", "Spreadsheet", "Statistical Methods", "Visual Data Discovery"];

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
      //####Variablen für Drop-Down Liste auf Result Page#####
      $scope.charts = [];
      $scope.categories = ['Overall', 'Usefulness', 'Ease Of Use', 'Net Benefits', 'Intention to Use'];
      $scope.myCategory = $scope.categories[0];
      $scope.changeDropDown = function () {
          $scope.calcAndShowResults();
      };

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
              console.log("DB cleared!");
              $scope.calcAndShowResults();
          })
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



      // VERARBEITEN DER ERGEBNISSE (Berechnungen)
      function calculateToolScores(results) {
          var scores = {};
          results.forEach(function (res) {
              if (res.tool !== "") {
                  var usageKey = res.tool + " Usage";
                  if (!scores[res.tool]) {
                      scores[res.tool] = {
                          "toolName": res.tool,
                          "average": res.overall,
                          "benefits": res.benefit,
                          "easeOfUse": res.easeOfuse,
                          "usageIntention": res.usage,
                          "usefulness": res.usefulness,
                          "AdvancedVisualization": res.AdvancedVisualization,
                          "BusinessQuery": res.BusinessQuery,
                          "Calculations": res.Calculations,
                          "Collaboration": res.Collaboration,
                          "Dashboards": res.Dashboards,
                          "Drilling": res.Drilling,
                          "ETL": res.ETL,
                          "InMemoryAnalysis": res.InMemoryAnalysis,
                          "InteractiveReports": res.InteractiveReports,
                          "MobileBI": res.MobileBI,
                          "PredictiveAnalysis": res.PredictiveAnalysis,
                          "ScheduledReporting": res.ScheduledReporting,
                          "Spreadsheet": res.Spreadsheet,
                          "StatisticalMethods": res.StatisticalMethods,
                          "VisualDataDiscovery": res.VisualDataDiscovery,
                          "count": 1
                      };
                  } else {
                      var sum = scores[res.tool]["average"] * scores[res.tool]["count"];
                      var benefits = scores[res.tool]["benefits"] * scores[res.tool]["count"];
                      var easeOfUse = scores[res.tool]["easeOfUse"] * scores[res.tool]["count"];
                      var usefulness = scores[res.tool]["usefulness"] * scores[res.tool]["count"];
                      var usageIntention = scores[res.tool]["usageIntention"] * scores[res.tool]["count"];
                      var BusinessQuery = scores[res.tool]["BusinessQuery"] * scores[res.tool]["count"];
                      var Calculations = scores[res.tool]["Calculations"] * scores[res.tool]["count"];
                      var Collaboration = scores[res.tool]["Collaboration"] * scores[res.tool]["count"];
                      var Dashboards = scores[res.tool]["Dashboards"] * scores[res.tool]["count"];
                      var Drilling = scores[res.tool]["Drilling"] * scores[res.tool]["count"];
                      var ETL = scores[res.tool]["ETL"] * scores[res.tool]["count"];
                      var InMemoryAnalysis = scores[res.tool]["InMemoryAnalysis"] * scores[res.tool]["count"];
                      var InteractiveReports = scores[res.tool]["InteractiveReports"] * scores[res.tool]["count"];
                      var MobileBI = scores[res.tool]["MobileBI"] * scores[res.tool]["count"];
                      var PredictiveAnalysis = scores[res.tool]["PredictiveAnalysis"] * scores[res.tool]["count"];
                      var Spreadsheet = scores[res.tool]["Spreadsheet"] * scores[res.tool]["count"];
                      var VisualDataDiscovery = scores[res.tool]["VisualDataDiscovery"] * scores[res.tool]["count"];
                      var ScheduledReporting = scores[res.tool]["ScheduledReporting"] * scores[res.tool]["count"];
                      var StatisticalMethods = scores[res.tool]["StatisticalMethods"] * scores[res.tool]["count"];

                      var newSum = sum + res.overall;
                      var newBenefits = benefits + res.benefit;
                      var newEaseOfUse = easeOfUse + res.easeOfuse;
                      var newUsefulness = usefulness + res.usefulness;
                      var newUsageIntention = usageIntention + res.usage;
                      var newBusinessQuery = BusinessQuery + res.BusinessQuery;
                      var newCalculations = Calculations + res.Calculations;
                      var newCollaboration = Collaboration + res.Collaboration;
                      var newDashboards = Dashboards + res.Dashboards;
                      var newDrilling = Drilling + res.Drilling;
                      var newETL = ETL + res.ETL;
                      var newInMemoryAnalysis = InMemoryAnalysis + res.InMemoryAnalysis;
                      var newInteractiveReports = InteractiveReports + res.InteractiveReports;
                      var newMobileBI = MobileBI + res.MobileBI;
                      var newPredictiveAnalysis = PredictiveAnalysis + res.PredictiveAnalysis;
                      var newSpreadsheet = Spreadsheet + res.Spreadsheet;
                      var newVisualDataDiscovery = VisualDataDiscovery + res.VisualDataDiscovery;
                      var newStatisticalMethods = VisualDataDiscovery + res.StatisticalMethods;
                      var newScheduledReporting = VisualDataDiscovery + res.ScheduledReporting;


                      scores[res.tool]["count"] += 1;
                      scores[res.tool]["average"] = (newSum / (scores[res.tool]["count"]));
                      scores[res.tool]["benefits"] = (newBenefits / (scores[res.tool]["count"]));
                      scores[res.tool]["easeOfUse"] = (newEaseOfUse / (scores[res.tool]["count"]));
                      scores[res.tool]["usefulness"] = (newUsefulness / (scores[res.tool]["count"]));
                      scores[res.tool]["usageIntention"] = (newUsageIntention / (scores[res.tool]["count"]));
                      scores[res.tool]["BusinessQuery"] = (newBusinessQuery / (scores[res.tool]["count"]));
                      scores[res.tool]["Calculations"] = (newCalculations / (scores[res.tool]["count"]));
                      scores[res.tool]["Dashboards"] = (newDashboards / (scores[res.tool]["count"]));
                      scores[res.tool]["Drilling"] = (newDrilling / (scores[res.tool]["count"]));
                      scores[res.tool]["Collaboration"] = (newCollaboration / (scores[res.tool]["count"]));
                      scores[res.tool]["ETL"] = (newETL / (scores[res.tool]["count"]));
                      scores[res.tool]["InMemoryAnalysis"] = (newInMemoryAnalysis / (scores[res.tool]["count"]));
                      scores[res.tool]["InteractiveReports"] = (newInteractiveReports / (scores[res.tool]["count"]));
                      scores[res.tool]["MobileBI"] = (newMobileBI / (scores[res.tool]["count"]));
                      scores[res.tool]["PredictiveAnalysis"] = (newPredictiveAnalysis / (scores[res.tool]["count"]));
                      scores[res.tool]["Spreadsheet"] = (newSpreadsheet / (scores[res.tool]["count"]));
                      scores[res.tool]["VisualDataDiscovery"] = (newVisualDataDiscovery / (scores[res.tool]["count"]));
                      scores[res.tool]["ScheduledReporting"] = (newScheduledReporting / (scores[res.tool]["count"]));
                      scores[res.tool]["StatisticalMethods"] = (newStatisticalMethods / (scores[res.tool]["count"]));

                  }
              }
          });
          return scores;
      }

      //Funktion zu Berechnung der Gesamtdurchscnitte fürs Gesamtergebnis
      $scope.averages = function () {

          //Berechnen des AVG über alle Tools OVERALL
          $scope.overallAverage = 0;

          for (var key in $scope.allResults) {
              $scope.overallAverage += $scope.allResults[key].overall;
          }
          $scope.overallAverage = $scope.overallAverage / ($scope.allResults.length - 1)
          //console.log($scope.overallAverage);

          //Berechnen des AVG über alle Tools USEFULNESS


          $scope.usefulnessAverage = 0;

          for (var key in $scope.allResults) {
              $scope.usefulnessAverage += $scope.allResults[key].overall;
          }
          $scope.usefulnessAverage = $scope.usefulnessAverage / ($scope.allResults.length - 1)
          //console.log($scope.usefulnessAverage);

          //Berechnen des AVG über alle Tools EASEOFUSE

          $scope.easeOfUseAverage = 0;

          for (var key in $scope.allResults) {
              $scope.easeOfUseAverage += $scope.allResults[key].overall;
          }
          $scope.easeOfUseAverage = $scope.easeOfUseAverage / ($scope.allResults.length - 1)
          //console.log($scope.easeOfUseAverage);

          $scope.benefitsAverage = 0;

          for (var key in $scope.allResults) {
              $scope.benefitsAverage += $scope.allResults[key].overall;
          }
          $scope.benefitsAverage = $scope.benefitsAverage / ($scope.allResults.length - 1)
          //console.log($scope.easeOfUseAverage);

          $scope.usageAverage = 0;

          for (var key in $scope.allResults) {
              $scope.usageAverage += $scope.allResults[key].overall;
          }
          $scope.usageAverage = $scope.usageAverage / ($scope.allResults.length - 1)
          //console.log($scope.easeOfUseAverage);


      }
      // Funtkion zu Berechnung der Gesamtdurchscnitte fürs persönliche Ergebnis
      $scope.personalAverages = function () {

          $scope.personaloverallAverage = 0;

          for (var key in $scope.conditionalResultsByDecisionType) {
              $scope.personaloverallAverage += $scope.conditionalResultsByDecisionType[key].overall;
          }
          $scope.personaloverallAverage = $scope.personaloverallAverage / ($scope.conditionalResultsByDecisionType.length - 1)
          console.log('Test');
          console.log($scope.personaloverallAverage);


          //Berechnen des AVG über alle Tools USEFULNESS


          $scope.personalUsefulnessAverage = 0;

          for (var key in $scope.conditionalResultsByDecisionType) {
              $scope.personalUsefulnessAverage += $scope.conditionalResultsByDecisionType[key].overall;
          }
          $scope.personalUsefulnessAverage = $scope.personalUsefulnessAverage / ($scope.conditionalResultsByDecisionType.length - 1)
          //console.log($scope.personalUsefulnessAverage);

          //Berechnen des AVG über alle Tools EASEOFUSE

          $scope.personalEaseOfUseAverage = 0;

          for (var key in $scope.conditionalResultsByDecisionType) {
              $scope.personalEaseOfUseAverage += $scope.conditionalResultsByDecisionType[key].overall;
          }
          $scope.personalEaseOfUseAverage = $scope.personalEaseOfUseAverage / ($scope.conditionalResultsByDecisionType.length - 1)
          //console.log($scope.easeOfUseAverage);

          $scope.personalBenefitsAverage = 0;

          for (var key in $scope.conditionalResultsByDecisionType) {
              $scope.personalBenefitsAverage += $scope.conditionalResultsByDecisionType[key].overall;
          }
          $scope.personalBenefitsAverage = $scope.personalBenefitsAverage / ($scope.conditionalResultsByDecisionType.length - 1)
          //console.log($scope.easeOfUseAverage);

          $scope.personalUsageAverage = 0;

          for (var key in $scope.conditionalResultsByDecisionType) {
              $scope.personalUsageAverage += $scope.conditionalResultsByDecisionType[key].overall;
          }
          $scope.personalUsageAverage = $scope.personalUsageAverage / ($scope.conditionalResultsByDecisionType.length - 1)
          //console.log($scope.easeOfUseAverage);
      };

      // ALLE ERGEBNISSE
      $scope.calcAndShowResults = function () {
          databaseService.getAllResponses().then(function (res) {
              $scope.allResults = res.data;
              //$scope.allResults.answers = JSON.parse($scope.allResults.answers);
              console.log("all Results so far", $scope.allResults);
              $scope.toolScores = calculateToolScores($scope.allResults);

              $scope.averages();

              //Erstellen eines Arrays zum Sortieren mit allen Metriken
              var sortable = [];
              for (var key in $scope.toolScores) {
                  sortable.push([$scope.toolScores[key].toolName, $scope.toolScores[key].usefulness, $scope.toolScores[key].easeOfUse,
                      $scope.toolScores[key].benefits, $scope.toolScores[key].usageIntention, $scope.toolScores[key].average,
                      $scope.toolScores[key].count]);
              }

              //Variable für Bar Chart mit Tools nach Overall Score
              var overallBarChartData = [
                  ['Tool', 'Overall Rating', {role: "style"}]
              ];

              //sortieren das Array nach Average
              sortable.sort(function (a, b) {
                  return b[5] - a[5]
              });

              //Beste 5 Tools in das Array fürs Chart pushen
              for (var i = 0; i <= Math.min(1000, sortable.length - 1); i++) {
                  overallBarChartData.push([sortable[i][0], parseFloat((sortable[i][5] * 100).toFixed(1)), "#2F9682"]);
              }

              overallBarChartData.push(['Average', parseFloat(($scope.overallAverage * 100).toFixed(1)), "#ff0000"]);

              overallBarChartData.sort(function (a, b) {
                  return b[1] - a[1]
              });
              console.log(overallBarChartData);

              //#####Bar Chart OVERALL######
              google.charts.load('current', {packages: ['corechart', 'bar']});
              google.charts.load('current', {packages: ['bar']});
              google.charts.setOnLoadCallback(drawStuff);

              function drawStuff() {
                  var data = google.visualization.arrayToDataTable(overallBarChartData);

                  var view = new google.visualization.DataView(data);
                  view.setColumns([0, 1,
                      {
                          calc: "stringify",
                          sourceColumn: 1,
                          type: "string",
                          role: "annotation"
                      },
                      2]);

                  var options = {
                      title: 'Top 10 BI Tools',
                      width: '100%',
                      chartArea: {width: '50%', height: '100%'},
                      height: 250 / 10 * Math.min(1000, sortable.length - 1),
                      bar: {groupWidth: "80%"},
                      legend: {position: "none"},
                      hAxis: {
                          title: 'Overall Rating',
                          gridlines: {color: 'white', count: 5},
                          viewWindow: {
                              min: Math.min([Math.min(9, sortable.length - 1)][5], $scope.overallAverage) * 100 - 5,
                              max: 'auto'
                          }
                      },
                      haxis: {}

                  };
                  var chart = new google.visualization.BarChart(document.getElementById("overallBarChart"));
                  chart.draw(view, options);
                  //create trigger to resizeEnd event
              }

              //Usefulness Bar Chart
              //sortieren das Array nach Usefulness
              var usefulBarChartData = [
                  ['Tool', 'Usefulness', {role: "style"}]
              ];
              sortable.sort(function (a, b) {
                  return b[1] - a[1]
              });

              //Beste 5 Tools in das Array fürs Chart pushen
              for (var i = 0; i <= Math.min(1000, sortable.length - 1); i++) {
                  usefulBarChartData.push([sortable[i][0], parseFloat((sortable[i][1] * 100).toFixed(1)), "#2F9682"]);
              }
              usefulBarChartData.push(['Average', parseFloat(($scope.usefulnessAverage * 100).toFixed(1)), "#ff0000"]);

              usefulBarChartData.sort(function (a, b) {
                  return b[1] - a[1]
              });

              google.charts.load('current', {packages: ['corechart', 'bar']});
              google.charts.load('current', {packages: ['bar']});
              google.charts.setOnLoadCallback(drawUsefulStuff);

              function drawUsefulStuff() {
                  var data = google.visualization.arrayToDataTable(usefulBarChartData);

                  var view = new google.visualization.DataView(data);
                  view.setColumns([0, 1,
                      {
                          calc: "stringify",
                          sourceColumn: 1,
                          type: "string",
                          role: "annotation"
                      },
                      2]);

                  var options = {
                      title: 'Top 10 BI Tools',
                      width: '100%',
                      chartArea: {width: '40%', height: '100%'},
                      height: 250 * Math.min(1000, sortable.length) / 10,
                      bar: {groupWidth: "80%"},
                      legend: {position: "none"},
                      hAxis: {
                          title: 'Overall Rating',
                          gridlines: {color: 'white', count: 5},
                          viewWindow: {
                              min: sortable[Math.min(1000, sortable.length - 1)][1] * 100 - 5,
                              max: 'auto'
                          }
                      },
                      haxis: {}

                  };
                  var chart = new google.visualization.BarChart(document.getElementById("usefulBarChart"));
                  chart.draw(view, options);
              }


              //Ease of Use Bar Chart
              //sortieren das Array nach Usefulness
              var easyBarChartData = [
                  ['Tool', 'Ease of Use', {role: "style"}]
              ];
              sortable.sort(function (a, b) {
                  return b[2] - a[2]
              });

              //Beste 5 Tools in das Array fürs Chart pushen
              for (var i = 0; i <= Math.min(1000, sortable.length - 1); i++) {
                  easyBarChartData.push([sortable[i][0], parseFloat((sortable[i][2] * 100).toFixed(1)), "#2F9682"]);
              }

              easyBarChartData.push(['Average', parseFloat(($scope.easeOfUseAverage * 100).toFixed(1)), "#ff0000"]);
              easyBarChartData.sort(function (a, b) {
                  return b[1] - a[1]
              });

              google.charts.load('current', {packages: ['corechart', 'bar']});
              google.charts.load('current', {packages: ['bar']});
              google.charts.setOnLoadCallback(drawEasyStuff);

              function drawEasyStuff() {
                  var data = google.visualization.arrayToDataTable(easyBarChartData);

                  var view = new google.visualization.DataView(data);
                  view.setColumns([0, 1,
                      {
                          calc: "stringify",
                          sourceColumn: 1,
                          type: "string",
                          role: "annotation"
                      },
                      2]);

                  var options = {
                      title: 'Top 10 BI Tools',
                      width: '100%',
                      chartArea: {width: '40%', height: '100%'},
                      height: 250 * Math.min(1000, sortable.length) / 10,
                      bar: {groupWidth: "80%"},
                      legend: {position: "none"},
                      hAxis: {
                          title: 'Overall Rating',
                          gridlines: {color: 'white', count: 5},
                          viewWindow: {
                              min: sortable[Math.min(1000, sortable.length - 1)][2] * 100 - 5,
                              max: 'auto'
                          }
                      },
                      haxis: {}
                  };
                  var chart = new google.visualization.BarChart(document.getElementById("easyBarChart"));
                  chart.draw(view, options);
              }


              //Net Benefits Bar Chart
              //sortieren das Array nach Net Benefits
              var beneficialBarChartData = [
                  ['Tool', 'Net Benefits', {role: "style"}]
              ];
              sortable.sort(function (a, b) {
                  return b[3] - a[3]
              });

              //Beste 5 Tools in das Array fürs Chart pushen
              for (var i = 0; i <= Math.min(1000, sortable.length - 1); i++) {
                  beneficialBarChartData.push([sortable[i][0], parseFloat((sortable[i][3] * 100).toFixed(1)), "#2F9682"]);
              }

              beneficialBarChartData.push(['Average', parseFloat(($scope.benefitsAverage * 100).toFixed(1)), "#ff0000"]);

              beneficialBarChartData.sort(function (a, b) {
                  return b[1] - a[1]
              });

              google.charts.load('current', {packages: ['corechart', 'bar']});
              google.charts.load('current', {packages: ['bar']});
              google.charts.setOnLoadCallback(drawBeneficialStuff);

              function drawBeneficialStuff() {
                  var data = google.visualization.arrayToDataTable(beneficialBarChartData);

                  var view = new google.visualization.DataView(data);
                  view.setColumns([0, 1,
                      {
                          calc: "stringify",
                          sourceColumn: 1,
                          type: "string",
                          role: "annotation"
                      },
                      2]);

                  var options = {
                      title: 'Top 10 BI Tools',
                      width: '100%',
                      chartArea: {width: '40%', height: '100%'},
                      height: 250 * Math.min(100, sortable.length) / 10,
                      bar: {groupWidth: "80%"},
                      legend: {position: "none"},
                      hAxis: {
                          title: 'Overall Rating',
                          gridlines: {color: 'white', count: 5},
                          viewWindow: {
                              min: sortable[Math.min(1000, sortable.length - 1)][3] * 100 - 5,
                              max: 'auto'
                          }
                      },
                      haxis: {}

                  };
                  var chart = new google.visualization.BarChart(document.getElementById("beneficialBarChart"));
                  chart.draw(view, options);
              }

              //Usage Bar Chart
              //sortieren das Array nach Intention to Use
              var intentionalBarChartData = [
                  ['Tool', 'Intention to Use', {role: "style"}]
              ];
              sortable.sort(function (a, b) {
                  return b[4] - a[4]
              });

              //Beste 5 Tools in das Array fürs Chart pushen
              for (var i = 0; i <= Math.min(1000, sortable.length - 1); i++) {
                  intentionalBarChartData.push([sortable[i][0], parseFloat((sortable[i][4] * 100).toFixed(1)), "#2F9682"]);
              }

              intentionalBarChartData.push(['Average', parseFloat(($scope.usageAverage * 100).toFixed(1)), "#ff0000"]);
              intentionalBarChartData.sort(function (a, b) {
                  return b[1] - a[1]
              });
              //console.log(intentionalBarChartData);

              google.charts.load('current', {packages: ['corechart', 'bar']});
              google.charts.load('current', {packages: ['bar']});
              google.charts.setOnLoadCallback(drawIntentionalStuff);

              function drawIntentionalStuff() {
                  var data = google.visualization.arrayToDataTable(intentionalBarChartData);

                  var view = new google.visualization.DataView(data);
                  view.setColumns([0, 1,
                      {
                          calc: "stringify",
                          sourceColumn: 1,
                          type: "string",
                          role: "annotation"
                      },
                      2]);

                  var options = {
                      title: 'Top 10 BI Tools',
                      width: '100%',
                      chartArea: {width: '40%', height: '100%'},
                      height: 250 * Math.min(1000, sortable.length) / 10,
                      bar: {groupWidth: "80%"},
                      legend: {position: "none"},
                      hAxis: {
                          title: 'Overall Rating',
                          gridlines: {color: 'white', count: 5},
                          viewWindow: {
                              min: sortable[Math.min(1000, sortable.length - 1)][4] * 100 - 5,
                              max: 'auto'
                          }
                      },
                      haxis: {}

                  };
                  var chart = new google.visualization.BarChart(document.getElementById("intentionalBarChart"));
                  chart.draw(view, options);
              }


              //Neues Bar Chart mit allen Metriken

              //Variable für Bar Chart mit allen Erfolgsmetriken
              var allMetricsBarChartData = [
                  ['Tool', 'Perceived Usefulness', 'Perceived Ease of Use',
                      'Perceived Net Benefits', 'Intention to Use', 'Overall Rating']
              ];
              sortable.sort(function (a, b) {
                  return b[5] - a[5]
              });

              for (var i = 0; i <= Math.min(9, sortable.length - 1); i++) {
                  allMetricsBarChartData.push([sortable[i][0], sortable[i][1], sortable[i][2], sortable[i][3], sortable[i][4], sortable[i][5]]);
              }
              /*var sortable = []
               for (var key in $scope.toolScores) {
               sortable.push([$scope.toolScores[key].toolName, $scope.toolScores[key].usefulness, $scope.toolScores[key].easeOfUse,
               $scope.toolScores[key].benefits, $scope.toolScores[key].usageIntention, $scope.toolScores[key].average]);
               }*/
              google.charts.load('current', {packages: ['corechart', 'bar']});
              google.charts.load('current', {packages: ['bar']});
              google.charts.setOnLoadCallback(drawColumnChart);
              function drawColumnChart() {
                  var data = google.visualization.arrayToDataTable(allMetricsBarChartData);

                  var options = {
                      chart: {
                          title: 'Tool Success by Measure'
                      },
                      colors: ['#2F9682', '#008dda'],
                      width: '60%',
                      height: 200
                  };

                  var chart = new google.charts.Bar(document.getElementById('allMetricsBarChart'));

                  //chart.draw(data, options);
              }

              //#######Bubble Chart########

              sortable.sort(function (a, b) {
                  return b[1] - a[1]
              });


              var bubbleXMin = sortable[sortable.length - 1][1];
              var bubbleXMax = sortable[0][1];

              sortable.sort(function (a, b) {
                  return b[2] - a[2]
              });

              var bubbleYMin = sortable[sortable.length - 1][2];
              var bubbleYMax = sortable[0][2];

              var bubbleChartData = [
                  ['ID', 'Usefulness', 'Ease of Use', 'Tool', 'n']
              ];
              for (var key in $scope.toolScores) {
                  bubbleChartData.push(['', $scope.toolScores[key].usefulness * 100, $scope.toolScores[key].easeOfUse * 100,
                      $scope.toolScores[key].toolName, $scope.toolScores[key].count]);
              }
              google.charts.load('current', {'packages': ['corechart']});
              google.charts.setOnLoadCallback(drawSeriesChart);

              function drawSeriesChart() {

                  var data = google.visualization.arrayToDataTable(bubbleChartData);

                  var options = {
                      hAxis: {
                          title: 'Usefulness',
                          viewWindow: {
                              min: bubbleXMin * 100 - 5,
                              max: bubbleXMax * 100 + 5
                          }
                      },
                      vAxis: {
                          title: 'Ease of Use',
                          viewWindow: {
                              min: bubbleYMin * 100 - 5,
                              max: bubbleYMax * 100 + 5
                          }
                      },
                      bubble: {textStyle: {fontSize: 11}},
                      chartArea: {left: '8%', top: '0%', bottom: '8%', width: '60%'},
                      width: '100%',
                      //explorer:{},
                      height: 400
                  };

                  var chart = new google.visualization.BubbleChart(document.getElementById('bubble'));
                  chart.draw(data, options);
              }

              // #########Donut Chart Example##############
              sortable.sort(function (a, b) {
                  return b[6] - a[6]
              });

              var overviewChartData = [
                  ['Tool Name', 'n']
              ];
              for (var key in sortable) {
                  overviewChartData.push([sortable[key][0], sortable[key][6]]);
              }
              google.charts.load("current", {packages: ["corechart"]});
              google.charts.setOnLoadCallback(drawChart);
              function drawChart() {
                  var data = google.visualization.arrayToDataTable(overviewChartData);
                  var options = {
                      title: 'Tool Usage Distribution',
                      chartArea: {width: '80%', height: '100%'},
                      pieHole: 0.8,
                      sliceVisibilityThreshold: .045,
                      is3D: true
                  };
                  var chart = new google.visualization.PieChart(document.getElementById('overview'));

                  function resizeChart() {
                      chart.draw(data, options);
                  }

                  if (document.addEventListener) {
                      window.addEventListener('resize', resizeChart);
                  }
                  else if (document.attachEvent) {
                      window.attachEvent('onresize', resizeChart);
                  }
                  else {
                      window.resize = resizeChart;
                  }
                  chart.draw(data, options);
              }


              //#############    Berechnen der Feature Nutzung über alle Tools    ##############


              var featureAverageData = [['Feature', 'Average', {role: "style"}]];
              var featureAverage = [];
              features.forEach(function (feature) {
                  var avg = 0;
                  for (var key in $scope.toolScores) {
                      avg += $scope.toolScores[key][feature] * $scope.toolScores[key].count;
                  }
                  avg = avg / $scope.allResults.length;
                  featureAverage.push([feature, parseFloat(avg.toFixed(3) * 100), "#2F9682"]);
              });
              //console.log(featureAverage);


              featureAverage.sort(function (a, b) {
                  return b[1] - a[1]
              });
              featureAverage.forEach(function (el) {
                  featureAverageData.push(el);
              });

              google.charts.load('current', {packages: ['corechart', 'bar']});
              google.charts.load('current', {packages: ['bar']});
              google.charts.setOnLoadCallback(drawOverallFeature);

              function drawOverallFeature() {
                  var data = new google.visualization.arrayToDataTable(featureAverageData);
                  var view = new google.visualization.DataView(data);
                  view.setColumns([0, 1,
                      {
                          calc: "stringify",
                          sourceColumn: 1,
                          type: "string",
                          role: "annotation"
                      },
                      2]);

                  var options = {
                      title: 'Top 10 BI Tools',
                      width: '60%',
                      chartArea: {width: '60%', height: '100%'},
                      height: 350,
                      bar: {groupWidth: "80%"},
                      legend: {position: "none"},
                      hAxis: {
                          title: 'Overall Rating',
                          gridlines: {color: 'white', count: 5},
                          viewWindow: {
                              min: sortable[Math.min(9, sortable.length - 1)][5] * 100 - 5,
                              max: 'auto'
                          }
                      },
                      haxis: {}
                  };
                  var chart = new google.visualization.BarChart(document.getElementById('overallFeatureChart'));
                  chart.draw(view, options);
              }
          });
      };

      // PERSONALISIERTE ERGEBNISSE

      $scope.getPersonalResult = function (alias) {
          $scope.showPersonalResult = true;
          $scope.personalResult = $scope.allResults.filter(function (res) {
              return res.alias === alias;
          })[0];
          $scope.conditionalResultsByDecisionType = $scope.allResults.filter(function (res) {
              return res.decisionType === $scope.personalResult.decisionType;
          });
          $scope.conditionalResultsByDecisionTypeAndTool = $scope.allResults.filter(function (res) {
              return (res.decisionType === $scope.personalResult.decisionType && res.tool === $scope.personalResult.tool);
          });
          $scope.conditionalToolScores = calculateToolScores($scope.conditionalResultsByDecisionType);
          $scope.conditionalResultsByDecisionTypeAndTool = calculateToolScores($scope.conditionalResultsByDecisionTypeAndTool);
          //console.log($scope.conditionalResultsByDecisionTypeAndTool[$scope.personalResult.tool].average);

          //Aufruf der Methode damit die Gesamtdurchschnitte für das personal Result berechnet werden.
          $scope.personalAverages();

          var prozesse = ["Assurance", "CampaignManagement", "CostAnalysis", "HRAnalysis", "StrategicPlanning", "MarketAnalysis", "GroupConsolidation", "OperationalPlanning", "OtherReporting", "ProductionPlanning", "RegularReporting", "SupplierAnalysis", "SupplyChain"];
          $scope.personalProcesses = [];
          $scope.processToolResults = [];
          $scope.processToolScores = [];
          prozesse.forEach(function (process) {
              if ($scope.personalResult[process] === 1) {
                  $scope.personalProcesses.push(process);
                  //console.log(process);
                  $scope.processToolResults[process] = $scope.allResults.filter(function (res) {
                      return res[process] === 1;
                  });
                  $scope.processToolScores[process] = calculateToolScores($scope.processToolResults[process]);
              }
          });

          var sortablePersonal = [];
          for (var key in $scope.conditionalToolScores) {
              sortablePersonal.push([$scope.conditionalToolScores[key].toolName, $scope.conditionalToolScores[key].usefulness, $scope.conditionalToolScores[key].easeOfUse,
                  $scope.conditionalToolScores[key].benefits, $scope.conditionalToolScores[key].usageIntention, $scope.conditionalToolScores[key].average,
                  $scope.conditionalToolScores[key].count]);
          }

          //#########Top 5 Tool Bar Chart ##########

          //sortieren das Array nach Average
          sortablePersonal.sort(function (a, b) {
              return b[5] - a[5]
          });

          var personalOverallBarChartData = [
              ['Tool', 'Overall Rating', {role: "style"}]
          ];

          //Beste 5 Tools in das Array fürs Chart pushen
          for (var i = 0; i <= Math.min(1000, sortablePersonal.length - 1); i++) {
              personalOverallBarChartData.push([sortablePersonal[i][0], parseFloat((sortablePersonal[i][5] * 100).toFixed(1)), "#2F9682"]);
          }

          personalOverallBarChartData.push(['Average', parseFloat(($scope.personaloverallAverage * 100).toFixed(1)), "#ff0000"]);
          personalOverallBarChartData.sort(function (a, b) {
              return b[1] - a[1]
          });


          //#####Bar Chart OVERALL######
          google.charts.load('current', {packages: ['corechart', 'bar']});
          google.charts.load('current', {packages: ['bar']});
          google.charts.setOnLoadCallback(drawStuff);

          function drawStuff() {
              var data = google.visualization.arrayToDataTable(personalOverallBarChartData);

              var view = new google.visualization.DataView(data);
              view.setColumns([0, 1,
                  {
                      calc: "stringify",
                      sourceColumn: 1,
                      type: "string",
                      role: "annotation"
                  },
                  2]);

              var options = {
                  title: 'Top 10 BI Tools',
                  width: '100%',
                  chartArea: {width: '50%', height: '100%'},
                  height: 250 * Math.min(1000, sortablePersonal.length) / 10,
                  bar: {groupWidth: "80%"},
                  legend: {position: "none"},
                  hAxis: {
                      title: 'Overall Rating',
                      gridlines: {color: 'white', count: 5},
                      viewWindow: {
                          min: sortablePersonal[Math.min(1000, sortablePersonal.length - 1)][5] * 100 - 5,
                          max: 'auto'
                      }
                  },
                  haxis: {}

              };
              var chart = new google.visualization.BarChart(document.getElementById("personalOverallBarChart"));
              $scope.charts.push({chart: chart, options: options, data: view});
              chart.draw(view, options);
          }


          //Usefulness Bar Chart

          sortablePersonal.sort(function (a, b) {
              return b[1] - a[1]
          });


          var usefulPersonalOverallBarChartData = [
              ['Tool', 'Overall Rating', {role: "style"}]
          ];

          //Beste 5 Tools in das Array fürs Chart pushen
          for (var i = 0; i <= Math.min(1000, sortablePersonal.length - 1); i++) {
              usefulPersonalOverallBarChartData.push([sortablePersonal[i][0], parseFloat((sortablePersonal[i][1] * 100).toFixed(1)), "#2F9682"]);
          }
          usefulPersonalOverallBarChartData.push(['Average', parseFloat(($scope.personalUsefulnessAverage * 100).toFixed(1)), "#ff0000"]);
          usefulPersonalOverallBarChartData.sort(function (a, b) {
              return b[1] - a[1]
          });

          //#####Bar Chart Usefulness######
          google.charts.load('current', {packages: ['corechart', 'bar']});
          google.charts.load('current', {packages: ['bar']});
          google.charts.setOnLoadCallback(drawUsefulStuff);

          function drawUsefulStuff() {
              var data = google.visualization.arrayToDataTable(usefulPersonalOverallBarChartData);

              var view = new google.visualization.DataView(data);
              view.setColumns([0, 1,
                  {
                      calc: "stringify",
                      sourceColumn: 1,
                      type: "string",
                      role: "annotation"
                  },
                  2]);

              var options = {
                  title: 'Top 10 BI Tools',
                  width: 800,
                  chartArea: {width: '60%', height: '100%'},
                  height: 250 * Math.min(100, sortablePersonal.length) / 10,
                  bar: {groupWidth: "80%"},
                  legend: {position: "none"},
                  hAxis: {
                      title: 'Overall Rating',
                      gridlines: {color: 'white', count: 5},
                      viewWindow: {
                          min: sortablePersonal[Math.min(1000, sortablePersonal.length - 1)][1] * 100 - 5,
                          max: 'auto'
                      }
                  },
                  haxis: {}

              };
              var chart = new google.visualization.BarChart(document.getElementById("usefulPersonalOverallBarChart"));
              $scope.charts.push({chart: chart, options: options, data: view});
              chart.draw(view, options);
          }


          sortablePersonal.sort(function (a, b) {
              return b[2] - a[2]
          });


          var easyPersonalOverallBarChartData = [
              ['Tool', 'Overall Rating', {role: "style"}]
          ];

          //Beste 5 Tools in das Array fürs Chart pushen
          for (var i = 0; i <= Math.min(1000, sortablePersonal.length - 1); i++) {
              easyPersonalOverallBarChartData.push([sortablePersonal[i][0], parseFloat((sortablePersonal[i][2] * 100).toFixed(1)), "#2F9682"]);
          }

          easyPersonalOverallBarChartData.push(['Average', parseFloat(($scope.personalEaseOfUseAverage * 100).toFixed(1)), "#ff0000"]);
          easyPersonalOverallBarChartData.sort(function (a, b) {
              return b[1] - a[1]
          });


          //console.log(overallBarChartData);

          //#####Bar Chart OVERALL######
          google.charts.load('current', {packages: ['corechart', 'bar']});
          google.charts.load('current', {packages: ['bar']});
          google.charts.setOnLoadCallback(drawEasyStuff);

          function drawEasyStuff() {
              var data = google.visualization.arrayToDataTable(easyPersonalOverallBarChartData);

              var view = new google.visualization.DataView(data);
              view.setColumns([0, 1,
                  {
                      calc: "stringify",
                      sourceColumn: 1,
                      type: "string",
                      role: "annotation"
                  },
                  2]);

              var options = {
                  title: 'Top 10 BI Tools',
                  width: 800,
                  chartArea: {width: '60%', height: '100%'},
                  height: 250 * Math.min(1000, sortablePersonal.length) / 10,
                  bar: {groupWidth: "80%"},
                  legend: {position: "none"},
                  hAxis: {
                      title: 'Overall Rating',
                      gridlines: {color: 'white', count: 5},
                      viewWindow: {
                          min: sortablePersonal[Math.min(1000, sortablePersonal.length - 1)][2] * 100 - 5,
                          max: 'auto'
                      }
                  },
                  haxis: {}

              };
              var chart = new google.visualization.BarChart(document.getElementById("easyPersonalOverallBarChart"));
              $scope.charts.push({chart: chart, options: options, data: view});
              chart.draw(view, options);
          }


          sortablePersonal.sort(function (a, b) {
              return b[3] - a[3]
          });

          var beneficialPersonalOverallBarChartData = [
              ['Tool', 'Overall Rating', {role: "style"}]
          ];

          //Beste 5 Tools in das Array fürs Chart pushen
          for (var i = 0; i <= Math.min(1000, sortablePersonal.length - 1); i++) {
              beneficialPersonalOverallBarChartData.push([sortablePersonal[i][0], parseFloat((sortablePersonal[i][3] * 100).toFixed(1)), "#2F9682"]);
          }
          beneficialPersonalOverallBarChartData.push(['Average', parseFloat(($scope.personalBenefitsAverage * 100).toFixed(1)), "#ff0000"]);
          beneficialPersonalOverallBarChartData.sort(function (a, b) {
              return b[1] - a[1]
          });


          //console.log(overallBarChartData);

          //#####Bar Chart OVERALL######
          google.charts.load('current', {packages: ['corechart', 'bar']});
          google.charts.load('current', {packages: ['bar']});
          google.charts.setOnLoadCallback(drawBeneficialStuff);

          function drawBeneficialStuff() {
              var data = google.visualization.arrayToDataTable(beneficialPersonalOverallBarChartData);

              var view = new google.visualization.DataView(data);
              view.setColumns([0, 1,
                  {
                      calc: "stringify",
                      sourceColumn: 1,
                      type: "string",
                      role: "annotation"
                  },
                  2]);

              var options = {
                  title: 'Top 10 BI Tools',
                  width: 800,
                  chartArea: {width: '60%', height: '100%'},
                  height: 250 * Math.min(1000, sortablePersonal.length) / 10,
                  bar: {groupWidth: "80%"},
                  legend: {position: "none"},
                  hAxis: {
                      title: 'Overall Rating',
                      gridlines: {color: 'white', count: 5},
                      viewWindow: {
                          min: sortablePersonal[Math.min(1000, sortablePersonal.length - 1)][3] * 100 - 5,
                          max: 'auto'
                      }
                  },
                  haxis: {}

              };
              var chart = new google.visualization.BarChart(document.getElementById("beneficialPersonalOverallBarChart"));
              $scope.charts.push({chart: chart, options: options, data: view});
              chart.draw(view, options);
          }

          sortablePersonal.sort(function (a, b) {
              return b[4] - a[4]
          });

          var usablePersonalOverallBarChartData = [
              ['Tool', 'Overall Rating', {role: "style"}]
          ];

          //Beste 5 Tools in das Array fürs Chart pushen
          for (var i = 0; i <= Math.min(1000, sortablePersonal.length - 1); i++) {
              usablePersonalOverallBarChartData.push([sortablePersonal[i][0], parseFloat((sortablePersonal[i][4] * 100).toFixed(1)), "#2F9682"]);
          }

          usablePersonalOverallBarChartData.push(['Average', parseFloat(($scope.personalUsageAverage * 100).toFixed(1)), "#ff0000"]);
          usablePersonalOverallBarChartData.sort(function (a, b) {
              return b[1] - a[1]
          });

          //#####Bar Chart OVERALL######
          google.charts.load('current', {packages: ['corechart', 'bar']});
          google.charts.load('current', {packages: ['bar']});
          google.charts.setOnLoadCallback(drawUsableStuff);

          function drawUsableStuff() {
              var data = google.visualization.arrayToDataTable(usablePersonalOverallBarChartData);

              var view = new google.visualization.DataView(data);
              view.setColumns([0, 1,
                  {
                      calc: "stringify",
                      sourceColumn: 1,
                      type: "string",
                      role: "annotation"
                  },
                  2]);

              var options = {
                  title: 'Top 10 BI Tools',
                  width: 800,
                  chartArea: {width: '60%', height: '100%'},
                  height: 250 * Math.min(1000, sortablePersonal.length) / 10,
                  bar: {groupWidth: "80%"},
                  legend: {position: "none"},
                  hAxis: {
                      title: 'Overall Rating',
                      gridlines: {color: 'white', count: 5},
                      viewWindow: {
                          min: sortablePersonal[Math.min(1000, sortablePersonal.length - 1)][4] * 100 - 5,
                          max: 'auto'
                      }
                  },
                  haxis: {}

              };
              var chart = new google.visualization.BarChart(document.getElementById("usablePersonalOverallBarChart"));
              $scope.charts.push({chart: chart, options: options, data: view});
              chart.draw(view, options);
          }

          //####Feature Chart for personal Results#####
          var featureData = [];
          var featureChartData = [
              ['Feature', 'Average', {role: "style"}]
          ];

          features.forEach(function (feature) {
              var avg = 0;
              for (var key in $scope.conditionalToolScores) {
                  avg += $scope.conditionalToolScores[key][feature] * $scope.conditionalToolScores[key].count;
              }
              avg = avg / $scope.conditionalResultsByDecisionType.length;
              featureData.push([feature, parseFloat(avg.toFixed(3) * 100), "#2F9682"]);

          });


          featureData.sort(function (a, b) {
              return b[1] - a[1]
          });

          featureData.forEach(function (el) {
              featureChartData.push(el);
          });

          google.charts.load('current', {packages: ['corechart', 'bar']});
          google.charts.load('current', {packages: ['bar']});
          google.charts.setOnLoadCallback(drawFeature);

          function drawFeature() {
              var data = new google.visualization.arrayToDataTable(featureChartData);

              var view = new google.visualization.DataView(data);
              view.setColumns([0, 1,
                  {
                      calc: "stringify",
                      sourceColumn: 1,
                      type: "string",
                      role: "annotation"
                  }, 2]);

              var options = {
                  title: 'Top 10 BI Tools',
                  width: 800,
                  chartArea: {width: '60%', height: '100%'},
                  height: 320,
                  bar: {groupWidth: "80%"},
                  legend: {position: "none"},
                  hAxis: {
                      title: 'Overall Rating',
                      gridlines: {color: 'white', count: 5},
                      viewWindow: {
                          min: featureChartData[featureChartData.length - 1][1] - 15,
                          max: featureChartData[1][1]
                      }
                  },
                  haxis: {}
              };

              var chart = new google.visualization.BarChart(document.getElementById('featureChart'));
              $scope.charts.push({chart: chart, options: options, data: view});
              chart.draw(view, options);
          }


          //########GAUGE########
          var gaugeData = [['Label', 'Value'],
              ['Overall', $scope.conditionalResultsByDecisionTypeAndTool[$scope.personalResult.tool].average],
              ['Usefulness', $scope.conditionalResultsByDecisionTypeAndTool[$scope.personalResult.tool].usefulness],
              ['Ease of Use', $scope.conditionalResultsByDecisionTypeAndTool[$scope.personalResult.tool].easeOfUse],
              ['Benefits', $scope.conditionalResultsByDecisionTypeAndTool[$scope.personalResult.tool].benefits],
              ['Usage', $scope.conditionalResultsByDecisionTypeAndTool[$scope.personalResult.tool].usageIntention]];

          google.charts.load('current', {'packages': ['gauge']});
          google.charts.setOnLoadCallback(drawGauge);
          function drawGauge() {

              var data = google.visualization.arrayToDataTable(gaugeData);

              var options = {
                  width: '60%', height: 100,
                  redFrom: 0, redTo: 0.2,
                  yellowFrom: 0.2, yellowTo: 0.4,
                  minorTicks: 5,
                  max: 1
              };

              var chart = new google.visualization.Gauge(document.getElementById('gauge'));
              $scope.charts.push({chart: chart, options: options, data: data});
              chart.draw(data, options);
          }


          // Scatter Chart//BubbleChart (personal)
          var scatterChartData = [
              ['ID', 'n', 'Rating', 'Tool', 'Size']
          ];
          for (var key in $scope.conditionalToolScores) {
              scatterChartData.push(['', $scope.conditionalToolScores[key].count, $scope.conditionalToolScores[key].average, $scope.conditionalToolScores[key].toolName, 0]);
          }
          google.charts.load('current', {'packages': ['corechart']});
          google.charts.setOnLoadCallback(drawChart);
          function drawChart() {
              var data = google.visualization.arrayToDataTable(scatterChartData);
              var options = {
                  title: 'Usefulness vs Ease of Use by BI Tool',
                  hAxis: {title: 'Rating'},
                  vAxis: {title: 'Times Used'},
                  bubble: {textStyle: {fontSize: 11}},
                  width: '60%',
                  height: 150,
                  sizeAxis: {maxSize: 5}
              };
              var chart = new google.visualization.BubbleChart(document.getElementById('scatterChart'));
              $scope.charts.push({chart: chart, options: options, data: view});
              chart.draw(data, options);
          }
      };

      $scope.startSurvey = function () {
          $scope.start = true;
      };

      // initialisierung
      $scope.calcAndShowResults();

      $scope.redrawAll = function () {
          $scope.charts.forEach(function (el) {
              console.log("redraw call", el);
              el.chart.draw(el.data, el.options);
          });
      };
  }])

;