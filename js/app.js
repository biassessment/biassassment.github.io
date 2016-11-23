var app = angular.module('bi-assessment', ['ui.bootstrap', 'mwFormBuilder', 'mwFormViewer', 'mwFormUtils', 'pascalprecht.translate', 'monospaced.elastic']);

app.config(function($translateProvider){
    $translateProvider.useStaticFilesLoader({
        prefix: './lang/',
        suffix: '/angular-surveys.json'
    });
    $translateProvider.preferredLanguage('en');
})
  .controller('MainCtrl', ['$scope', '$q', '$http', '$translate', 'mwFormResponseUtils',  function ($scope, $q, $http, $translate, mwFormResponseUtils) {
    console.log("bi-assessment tool running");
    var umfrage = {
        "pages": [
            {
                "id": "be7b62971129807fade6df22e562e2ee",
                "number": 1,
                "name": "Erster Versuch",
                "description": null,
                "pageFlow": {
                    "nextPage": true,
                    "label": "mwForm.pageFlow.goToNextPage"
                },
                "elements": [
                    {
                        "id": "4e709d5f3fef5d6869d9fed83a62b391",
                        "orderNo": 1,
                        "type": "question",
                        "question": {
                            "id": "6f96cba23e2c8eab2c7f30e29a90d24a",
                            "text": "Wähle deine Wahl",
                            "type": "radio",
                            "required": true,
                            "offeredAnswers": [
                                {
                                    "id": "5a50b61d44eab46685aa5c81d4d3e866",
                                    "orderNo": 1,
                                    "value": "Wahl1",
                                    "pageFlow": {
                                        "nextPage": true,
                                        "label": "mwForm.pageFlow.goToNextPage"
                                    }
                                },
                                {
                                    "id": "1a4c30987f3a0f8d9f04931df2e2b027",
                                    "orderNo": 2,
                                    "value": "Wahl2",
                                    "pageFlow": {
                                        "nextPage": true,
                                        "label": "mwForm.pageFlow.goToNextPage"
                                    }
                                },
                                {
                                    "id": "e0c514f3b7c62f470cc0c7c45f2c2bac",
                                    "orderNo": 3,
                                    "value": "Wahl3",
                                    "pageFlow": {
                                        "nextPage": true,
                                        "label": "mwForm.pageFlow.goToNextPage"
                                    }
                                }
                            ]
                        }
                    }
                ],
                "namedPage": true
            }
        ],
        "name": "Super-Umfrage",
        "description": "Erster Test"
    };
    var antworten = {
        "6f96cba23e2c8eab2c7f30e29a90d24a": {
            "selectedAnswer": "e0c514f3b7c62f470cc0c7c45f2c2bac"
        }
    };

    var ctrl = this;
    ctrl.mergeFormWithResponse = true;
    ctrl.cgetQuestionWithResponseList = true;
    ctrl.cgetResponseSheetHeaders = true;
    ctrl.cgetResponseSheetRow = true;
    ctrl.cgetResponseSheet = true;
    ctrl.headersWithQuestionNumber = true;
    ctrl.builderReadOnly = false;
    ctrl.viewerReadOnly = false;
    ctrl.languages = ['en', 'de'];

    ctrl.formData = umfrage;
    ctrl.formBuilder={};
    ctrl.formViewer = {};
    ctrl.formOptions = { autoStart: false };
    ctrl.optionsBuilder ={
        /*elementButtons:   [{title: 'My title tooltip', icon: 'fa fa-database', text: '', callback: ctrl.callback, filter: ctrl.filter, showInOpen: true}],
         customQuestionSelects:  [
         {key:"category", label: 'Category', options: [{key:"1", label:"Uno"},{key:"2", label:"dos"},{key:"3", label:"tres"},{key:"4", label:"4"}], required: false},
         {key:"category2", label: 'Category2', options: [{key:"1", label:"Uno"},{key:"2", label:"dos"},{key:"3", label:"tres"},{key:"4", label:"4"}]}
         ],
         elementTypes: ['question', 'image']*/
    };
    ctrl.formStatus = {};
    ctrl.responseData = antworten;
    ctrl.showResponseRata = false;

    ctrl.saveResponse = function(){
        var d = $q.defer();
        var res = confirm("Response save success?");
        if(res){
            d.resolve(true);
        }else{
            d.reject();
        }
        return d.promise;
    };

    /*
    ctrl.onImageSelection = function (){
        var d = $q.defer();
        var src = prompt("Please enter image src");
        if(src !=null){
            d.resolve(src);
        }else{
            d.reject();
        }
        return d.promise;
    };
    */

    ctrl.resetViewer = function(){
        if(ctrl.formViewer.reset){
            ctrl.formViewer.reset();
        }
    };

    ctrl.resetBuilder= function(){
        if(ctrl.formBuilder.reset){
            ctrl.formBuilder.reset();
        }
    };

    ctrl.changeLanguage = function (languageKey) {
        $translate.use(languageKey);
    };

    ctrl.getMerged=function(){
        return mwFormResponseUtils.mergeFormWithResponse(ctrl.formData, ctrl.responseData);
    };

    ctrl.getQuestionWithResponseList=function(){
        return mwFormResponseUtils.getQuestionWithResponseList(ctrl.formData, ctrl.responseData);
    };
    ctrl.getResponseSheetRow=function(){
        return mwFormResponseUtils.getResponseSheetRow(ctrl.formData, ctrl.responseData);
    };
    ctrl.getResponseSheetHeaders=function(){
        return mwFormResponseUtils.getResponseSheetHeaders(ctrl.formData, ctrl.headersWithQuestionNumber);
    };

    ctrl.getResponseSheet=function(){
        return mwFormResponseUtils.getResponseSheet(ctrl.formData, ctrl.responseData, ctrl.headersWithQuestionNumber);
    };


}]);