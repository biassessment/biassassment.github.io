var app = angular.module('bi-assessment.resultsCtrl', [])

  .controller('resultsCtrl', ['$scope', '$q', '$http', '$state', 'databaseService', function ($scope, $q, $http, $state, databaseService) {
      console.log("resultsCtrl running!");

      //####Variablen für Drop-Down Liste auf Result Page#####
      $scope.features = ["AdvancedVisualization", "BusinessQuery", "Calculations", "Collaboration", "Dashboards", "Drilling", "ETL", "InMemoryAnalysis", "InteractiveReports", "MobileBI", "PredictiveAnalysis", "ScheduledReporting", "Spreadsheet", "StatisticalMethods", "VisualDataDiscovery"];
      $scope.categories = ['Overall', 'Usefulness', 'Ease Of Use', 'Net Benefits', 'Intention to Use'];

      $scope.myCategory = $scope.categories[0];
      $scope.changeDropDown = function () {
          $scope.calcAndShowResults();
      };

      // Berechnungen, auch Gültig für Child-state personalResults
      $scope.calculateToolScores = function(results) {
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

      // ALLE ERGEBNISSE
      $scope.calcAndShowResults = function () {
          databaseService.getAllResponses().then(function (res) {
              $scope.allResults = res.data;
              //$scope.allResults.answers = JSON.parse($scope.allResults.answers);
              console.log("all Results so far", $scope.allResults);
              $scope.toolScores = $scope.calculateToolScores($scope.allResults);

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
              var typenumber = 5;
              var selectedAverage = $scope.overallAverage;
              switch ($scope.myCategory) {
                  case 'Overall': {
                      typenumber = 5;
                      selectedAverage = $scope.overallAverage;
                  } break;
                  case 'Usefulness': {
                      typenumber = 1;
                      selectedAverage = $scope.usefulnessAverage;
                  } break;
                  case 'Ease Of Use': {
                      typenumber = 2;
                      selectedAverage = $scope.easeOfUseAverage;
                  } break;
                  case'Net Benefits': {
                      typenumber = 3;
                      selectedAverage = $scope.benefitsAverage;
                  }break;
                  case 'Intention to Use': {
                      typenumber = 4;
                      selectedAverage = $scope.usageAverage;
                  }
              }

              var minWindow = Math.min([Math.min(9, sortable.length - 1)][typenumber], selectedAverage) * 100 - 5;


              //sortieren das Array nach Average
              sortable.sort(function (a, b) {
                  return b[typenumber] - a[typenumber]
              });

              //Beste 5 Tools in das Array fürs Chart pushen
              for (var i = 0; i <= Math.min(1000, sortable.length - 1); i++) {
                  overallBarChartData.push([sortable[i][0], parseFloat((sortable[i][typenumber] * 100).toFixed(1)), "#2F9682"]);
              }

              overallBarChartData.push(['Average', parseFloat((selectedAverage * 100).toFixed(1)), "#ff0000"]);

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
                              min: minWindow,
                              max: 'auto'
                          }
                      },
                      haxis: {}

                  };
                  var chart = new google.visualization.BarChart(document.getElementById("overallBarChart"));
                  chart.draw(view, options);
                  //create trigger to resizeEnd event
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
                      is3D: true,
                      height:350
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
              $scope.features.forEach(function (feature) {
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

      // Show personal results
      $scope.showPersonalResultFor = function(alias) {
          $state.go("results.personal", { "alias": alias});
          $scope.calcAndShowResults();
      };

      // initialisierung
      $scope.calcAndShowResults();
  }]);