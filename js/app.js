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
    var umfrage = {
      "name": "Bastis Umfrage",
      "description": "Dear Participant,\n\nthe survey is divided into four sections: In the first part, you are asked to give general information about yourself and your company (optional), the second part will capture your usage of BI Tools and their capabilities, and the third part will categorize the decisions and processes that you support with the tool. The last section will then assess your satisfaction. \n\n\nYour honest response to each question is extremely important to the outcome of this project. You can be assured of complete confidentiality. The survey is completely anonymous, and only aggregate results will be published.\n\nIf you like, you will receive a feedback report after completing the survey. Therefore, please don't forget to enter your email address on the last page of the survey.\n\n\nThank you for your consideration and support,\n\nSincerely,\n\nSebastian Classen",
      "pages": [
      {
        "id": "4625fd3a9bea5374555253cb009623f8",
        "number": 1,
        "name": "Section 1. Questions about yourself and your Organization",
        "description": null,
        "pageFlow": {
          "nextPage": true,
          "label": "mwForm.pageFlow.goToNextPage"
        },
        "elements": [
          {
            "id": "31acc8c3b845edc2771142642ab23dd8",
            "orderNo": 1,
            "type": "question",
            "question": {
              "id": "3cd1b9c393efb559c4a0cd25d1ce28f7",
              "text": "Please specify your age",
              "type": "radio",
              "required": true,
              "offeredAnswers": [
                {
                  "id": "f65af8dbbeaa2e41062bc53b5d83f817",
                  "orderNo": 1,
                  "value": "<30",
                  "pageFlow": {
                    "nextPage": true,
                    "label": "mwForm.pageFlow.goToNextPage"
                  }
                },
                {
                  "id": "d4cdd4c3e22e78af537e046aa80a9501",
                  "orderNo": 2,
                  "value": "30-40",
                  "pageFlow": {
                    "nextPage": true,
                    "label": "mwForm.pageFlow.goToNextPage"
                  }
                },
                {
                  "id": "4de454bc366df70c571c9934081ede71",
                  "orderNo": 3,
                  "value": "41-50",
                  "pageFlow": {
                    "nextPage": true,
                    "label": "mwForm.pageFlow.goToNextPage"
                  }
                },
                {
                  "id": "707c3a4733ed60d09f73731bf6cbca18",
                  "orderNo": 4,
                  "value": ">50",
                  "pageFlow": {
                    "nextPage": true,
                    "label": "mwForm.pageFlow.goToNextPage"
                  }
                }
              ]
            }
          },
          {
            "id": "417b79c393b5860008702230891fa767",
            "orderNo": 2,
            "type": "question",
            "question": {
              "id": "e2be555c04c1e649021670f0482ae3a8",
              "text": "What industry does your organization belong to?",
              "type": "radio",
              "required": true,
              "offeredAnswers": [
                {
                  "id": "a6e633790105676882bf52e8793ea8e9",
                  "orderNo": 1,
                  "value": "Manufacturing",
                  "pageFlow": {
                    "nextPage": true,
                    "label": "mwForm.pageFlow.goToNextPage"
                  }
                },
                {
                  "id": "323ccbaac8502124b9f9374c58f09de7",
                  "orderNo": 2,
                  "value": "Healthcare",
                  "pageFlow": {
                    "nextPage": true,
                    "label": "mwForm.pageFlow.goToNextPage"
                  }
                },
                {
                  "id": "e3896cd91c97c7978e3172f322f051a4",
                  "orderNo": 3,
                  "value": "Retail / Wholesale",
                  "pageFlow": {
                    "nextPage": true,
                    "label": "mwForm.pageFlow.goToNextPage"
                  }
                },
                {
                  "id": "80b65c5235441fdc014be6ca582a641e",
                  "orderNo": 4,
                  "value": "Telecommunications",
                  "pageFlow": {
                    "nextPage": true,
                    "label": "mwForm.pageFlow.goToNextPage"
                  }
                },
                {
                  "id": "c85bf6ad06adff67f3126295a6a6edfa",
                  "orderNo": 5,
                  "value": "Financial Services / Banking",
                  "pageFlow": {
                    "nextPage": true,
                    "label": "mwForm.pageFlow.goToNextPage"
                  }
                },
                {
                  "id": "e5ce80f43baf2a67058b62b3701e65bd",
                  "orderNo": 6,
                  "value": "Insurance",
                  "pageFlow": {
                    "nextPage": true,
                    "label": "mwForm.pageFlow.goToNextPage"
                  }
                },
                {
                  "id": "fa6c93d48c3316db33e15bcfcf7dcec9",
                  "orderNo": 7,
                  "value": "Utilities",
                  "pageFlow": {
                    "nextPage": true,
                    "label": "mwForm.pageFlow.goToNextPage"
                  }
                },
                {
                  "id": "0bf66de9135207c920cd4e900d339ea7",
                  "orderNo": 8,
                  "value": "Education / Publishing",
                  "pageFlow": {
                    "nextPage": true,
                    "label": "mwForm.pageFlow.goToNextPage"
                  }
                }
              ],
              "otherAnswer": true
            }
          }
        ],
        "namedPage": true
      },
      {
        "id": "4ab49ae24c6e3db7ab7ce8603fc2622c",
        "number": 2,
        "name": "Section 2. BI Tool and Capabilities (1/2)",
        "description": null,
        "pageFlow": {
          "nextPage": true,
          "label": "mwForm.pageFlow.goToNextPage"
        },
        "elements": [
          {
            "id": "7f440b5f330ea1ea5b9615fd3d20b893",
            "orderNo": 1,
            "type": "question",
            "question": {
              "id": "1605e2bb313158d4c38cc48b870207ce",
              "text": "Please select the BI Tool that is most important to you",
              "type": "select",
              "required": true,
              "offeredAnswers": [
                {
                  "id": "75d9b392364e3c642fe51a5f32f64e8c",
                  "orderNo": 1,
                  "value": "1001Data",
                  "pageFlow": {
                    "nextPage": true,
                    "label": "mwForm.pageFlow.goToNextPage"
                  }
                },
                {
                  "id": "033ab927b2bb557c136a740da42d5f3b",
                  "orderNo": 2,
                  "value": "acplanEdge",
                  "pageFlow": {
                    "nextPage": true,
                    "label": "mwForm.pageFlow.goToNextPage"
                  }
                },
                {
                  "id": "57f4160c1ee7fc9c6a70c3be88441a4a",
                  "orderNo": 3,
                  "value": "arcplanEngage",
                  "pageFlow": {
                    "nextPage": true,
                    "label": "mwForm.pageFlow.goToNextPage"
                  }
                }
              ],
              "pageFlowModifier": false
            }
          },
          {
            "id": "c002e7298fba22684c6bb0ceeb8874b5",
            "orderNo": 2,
            "type": "question",
            "question": {
              "id": "7ce52357561014e3362874ab095c94b9",
              "text": "Please select the answer that best describes your skills.",
              "type": "grid",
              "required": true,
              "grid": {
                "rows": [
                  {
                    "id": "4f8ebd0e9549803b65179f395e902b6d",
                    "orderNo": 1,
                    "label": "I have the necessary skills for using the tool"
                  },
                  {
                    "id": "75d94f58c1a071254595b31ce0734415",
                    "orderNo": 2,
                    "label": "I would rate my computer proficiency as high"
                  },
                  {
                    "id": "9604541e147b79c38a1e65804e658a76",
                    "orderNo": 3,
                    "label": "I frequently show others how to use the tool"
                  },
                  {
                    "id": "df7b26a935142bc73e33b3f8a7ea37d5",
                    "orderNo": 4,
                    "label": "I have very good analytical capabilities"
                  }
                ],
                "cols": [
                  {
                    "id": "52b500063e0b103c1316bae81c6e9a46",
                    "orderNo": 1,
                    "label": "disagree"
                  },
                  {
                    "id": "79307448a9109ca49f58ea36da41a272",
                    "orderNo": 2,
                    "label": "somewhat disagree"
                  },
                  {
                    "id": "17f097d2a119f9ffec0d65a78b0dd996",
                    "orderNo": 3,
                    "label": "neutral"
                  },
                  {
                    "id": "23241ac2d6c70c5284c94d604cee5d95",
                    "orderNo": 4,
                    "label": "somewhat agree"
                  },
                  {
                    "id": "319e3c7c0d6b3b402ba790adefc42114",
                    "orderNo": 5,
                    "label": "agree"
                  }
                ],
                "cellInputType": "radio"
              },
              "pageFlowModifier": false
            }
          }
        ],
        "namedPage": true
      },
      {
        "id": "0f169f90a8ea799d172fc7483c7e71a3",
        "number": 3,
        "name": null,
        "description": null,
        "pageFlow": {
          "nextPage": true,
          "label": "mwForm.pageFlow.goToNextPage"
        },
        "elements": [
          {
            "id": "3987b068793c4c2a079fd7aa91860076",
            "orderNo": 1,
            "type": "question",
            "question": {
              "id": "a3176530787e137be5fd7903ec3f0844",
              "text": "Enter you Mail-Adress to look up your results later",
              "type": "text",
              "required": true,
              "pageFlowModifier": false
            }
          }
        ],
        "namedPage": false
      }
    ],
      "confirmationMessage": "Sehen Sie hier ihre Ergebnisse ein: Link zu Ergebnissen"
    };

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

    // Save Response to Database
    ctrl.saveResponse = function () {
      var response = ctrl.getResponseSheet();
      console.log("Erhaltene Antworten: ", response);

      var adjustedResponse = {};
      adjustedResponse["alias"] = response[1][response[1].length - 1];
      adjustedResponse["answers"] = JSON.stringify(response, null, 2);

      // TODO Further calculation with single Response
      /*
       *
       *
       *
       */

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