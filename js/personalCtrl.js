var app = angular.module('bi-assessment.personalCtrl', [])

  .controller('personalCtrl', ['$scope', '$q', '$http', '$state', '$stateParams', 'databaseService', function ($scope, $q, $http, $state, $stateParams, databaseService) {
      console.log("personalCtrl running!");
      console.log("Results for: ", $stateParams);

      $scope.alias = $stateParams.alias;
      $scope.businessProcesses = ["Regular Financial and Tax Reporting (External Reporting)", "Assurance and Special Compliance Support (e.g. SOX)", "Cost Analysis", "Group Consolidation", "Operational Planning and Budgeting", "Other Internal Financial Reporting", "Strategic Planning", "Market and Sales Planning and Analysis", "Campaign Management", "Production Planning and Control", "Supply-Chain-Analysis", "Supplier Analysis", "HR Analysis"];
      $scope.surveyFeatures = ["Advanced Visualization", "Business Query", "Calculations", "Collaboration", "Dashboards", "Drill-Down", "ETL", "In-Memory-Analysis", "Interactive Reports", "Mobile BI", "Predictive Analysis", "Scheduled Reporting", "Spreadsheet", "Statistical Methods", "Visual Data Discovery"];
      $scope.categories = ['Overall', 'Usefulness', 'Ease Of Use', 'Net Benefits', 'Intention to Use'];
      $scope.myPersonalCategory = $scope.categories[0];

      // Funktion zu Berechnung der Gesamtdurchscnitte fürs persönliche Ergebnis
      $scope.personalAverages = function () {

          $scope.personaloverallAverage = 0;
          var length = 0;
          for (var key in $scope.conditionalToolScores) {
              length+=$scope.conditionalToolScores[key].count;
          }

          for (var key in $scope.conditionalResultsByDecisionType) {
              $scope.personaloverallAverage += $scope.conditionalResultsByDecisionType[key].overall;
          }
          $scope.personaloverallAverage = $scope.personaloverallAverage / length;
          console.log('Test');
          console.log($scope.personaloverallAverage);


          //Berechnen des AVG über alle Tools USEFULNESS


          $scope.personalUsefulnessAverage = 0;

          for (var key in $scope.conditionalResultsByDecisionType) {
              $scope.personalUsefulnessAverage += $scope.conditionalResultsByDecisionType[key].usefulness;
          }
          $scope.personalUsefulnessAverage = $scope.personalUsefulnessAverage / length;
          //console.log($scope.personalUsefulnessAverage);

          //Berechnen des AVG über alle Tools EASEOFUSE

          $scope.personalEaseOfUseAverage = 0;

          for (var key in $scope.conditionalResultsByDecisionType) {
              $scope.personalEaseOfUseAverage += $scope.conditionalResultsByDecisionType[key].easeOfuse;
          }
          $scope.personalEaseOfUseAverage = $scope.personalEaseOfUseAverage / length;
          //console.log($scope.easeOfUseAverage);

          $scope.personalBenefitsAverage = 0;

          for (var key in $scope.conditionalResultsByDecisionType) {
              $scope.personalBenefitsAverage += $scope.conditionalResultsByDecisionType[key].benefit;
          }
          $scope.personalBenefitsAverage = $scope.personalBenefitsAverage / length;
          //console.log($scope.easeOfUseAverage);

          $scope.personalUsageAverage = 0;

          for (var key in $scope.conditionalResultsByDecisionType) {
              $scope.personalUsageAverage += $scope.conditionalResultsByDecisionType[key].usage;
          }
          $scope.personalUsageAverage = $scope.personalUsageAverage / length;
          //console.log($scope.easeOfUseAverage);
      };

      // Personalisierte Ergebnisse
      $scope.getPersonalResult = function () {
          $scope.showPersonalResult = true;
          $scope.personalResult = $scope.allResults.filter(function (res) {
              return res.alias === $scope.alias;
          })[0];
          $scope.conditionalResultsByDecisionType = $scope.allResults.filter(function (res) {
              return res.decisionType === $scope.personalResult.decisionType;
          });
          $scope.conditionalResultsByDecisionTypeAndTool = $scope.allResults.filter(function (res) {
              return (res.decisionType === $scope.personalResult.decisionType && res.tool === $scope.personalResult.tool);
          });
          $scope.conditionalToolScores = $scope.calculateToolScores($scope.conditionalResultsByDecisionType);
          $scope.conditionalResultsByDecisionTypeAndTool = $scope.calculateToolScores($scope.conditionalResultsByDecisionTypeAndTool);
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
                  $scope.processToolScores[process] = $scope.calculateToolScores($scope.processToolResults[process]);
              }
          });

          var sortablePersonal = [];
          for (var key in $scope.conditionalToolScores) {
              sortablePersonal.push([$scope.conditionalToolScores[key].toolName, $scope.conditionalToolScores[key].usefulness, $scope.conditionalToolScores[key].easeOfUse,
                  $scope.conditionalToolScores[key].benefits, $scope.conditionalToolScores[key].usageIntention, $scope.conditionalToolScores[key].average,
                  $scope.conditionalToolScores[key].count]);
          }

          var personalOverallBarChartData = [
              ['Tool', 'Overall Rating', {role: "style"}]
          ];

          //#########Top 5 Tool Bar Chart ##########
          var typenumber = 5;
          var selectedAverage = $scope.personaloverallAverage;
          switch ($scope.myPersonalCategory) {
              case 'Overall': {
                  typenumber = 5;
                  selectedAverage = $scope.personaloverallAverage;
              } break;
              case 'Usefulness': {
                  typenumber = 1;
                  selectedAverage = $scope.personalUsefulnessAverage;
              } break;
              case 'Ease Of Use': {
                  typenumber = 2;
                  selectedAverage = $scope.personalEaseOfUseAverage;
              } break;
              case'Net Benefits': {
                  typenumber = 3;
                  selectedAverage = $scope.personalBenefitsAverage;
              }break;
              case 'Intention to Use': {
                  typenumber = 4;
                  selectedAverage = $scope.personalUsageAverage;
              }
          }

          //sortieren das Array nach Average
          sortablePersonal.sort(function (a, b) {
              return b[typenumber] - a[typenumber];
          });



          //Beste 5 Tools in das Array fürs Chart pushen
          for (var i = 0; i <= Math.min(1000, sortablePersonal.length - 1); i++) {
              if (sortablePersonal[i][0] !== $scope.personalResult.tool) {
                  personalOverallBarChartData.push([sortablePersonal[i][0], parseFloat((sortablePersonal[i][typenumber] * 100).toFixed(1)), "#2F9682"]);
              }
              else {
                  personalOverallBarChartData.push([sortablePersonal[i][0], parseFloat((sortablePersonal[i][typenumber] * 100).toFixed(1)), "#FF6600"]);
              }

          }

          personalOverallBarChartData.push(['Average', parseFloat((selectedAverage * 100).toFixed(1)), "#0080FF"]);
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
                          min: sortablePersonal[Math.min(1000, sortablePersonal.length - 1)][typenumber] * 100 - 5,
                          max: 'auto'
                      }
                  },
                  haxis: {}

              };
              var chart = new google.visualization.BarChart(document.getElementById("personalOverallBarChart"));
              chart.draw(view, options);
          }


          sortablePersonal.sort(function (a, b) {
              return b[6] - a[6]
          });

          var personalOverviewChartData = [
              ['Tool Name', 'n']
          ];
          for (var key in sortablePersonal) {
              personalOverviewChartData.push([sortablePersonal[key][0], sortablePersonal[key][6]]);
          }
          google.charts.load("current", {packages: ["corechart"]});
          google.charts.setOnLoadCallback(drawOverviewChart);
          function drawOverviewChart() {
              var data = google.visualization.arrayToDataTable(personalOverviewChartData);
              var options = {
                  title: 'Tool Usage Distribution',
                  chartArea: {width: '80%', height: '100%'},
                  pieHole: 0.8,
                  sliceVisibilityThreshold: .045,
                  is3D: true,
                  height: 350
              };
              var chart = new google.visualization.PieChart(document.getElementById('personalOverviewChart'));

              chart.draw(data, options);
          }


          //Ease of Use vs Usefulness


          sortablePersonal.sort(function (a, b) {
              return b[1] - a[1]
          });


          var bubbleXMin = sortablePersonal[sortablePersonal.length - 1][1];
          var bubbleXMax = sortablePersonal[0][1];

          sortablePersonal.sort(function (a, b) {
              return b[2] - a[2]
          });

          var bubbleYMin = sortablePersonal[sortablePersonal.length - 1][2];
          var bubbleYMax = sortablePersonal[0][2];

          var bubbleChartData = [
              ['ID', 'Usefulness', 'Ease of Use', 'Tool', 'n']
          ];
          for (var key in $scope.conditionalToolScores) {
              bubbleChartData.push(['', $scope.conditionalToolScores[key].usefulness * 100, $scope.conditionalToolScores[key].easeOfUse * 100,
                  $scope.conditionalToolScores[key].toolName, $scope.conditionalToolScores[key].count]);
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
                  chartArea: {left: '8%', top: '0%', bottom: '10%', width: '60%'},
                  width: '100%',
                  explorer:{},
                  height: 400
              };

              var chart = new google.visualization.BubbleChart(document.getElementById('easy'));
              chart.draw(data, options);
          }






          //####Feature Chart for personal Results#####
          var featureData = [];
          var featureChartData = [
              ['Feature', 'Average', {role: "style"}]
          ];

          $scope.features.forEach(function (feature) {
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
              chart.draw(view, options);
          }


          //########GAUGE########
          if ($scope.personalResult.tool !=="") {
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
                  chart.draw(data, options);
              }
          }











      };






      //initialisieren
      $scope.getPersonalResult();
  }]);
