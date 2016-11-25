var app = angular.module('bi-assessment', ['ngMaterial', 'mwFormBuilder', 'mwFormViewer', 'mwFormUtils', 'pascalprecht.translate', 'monospaced.elastic']);

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
        "name": "form name",
        "description": "description",
        "pages": [
            {
                "id": "b8107c034ded6bf430488ca30d524bed",
                "number": 1,
                "name": null,
                "description": null,
                "pageFlow": {
                    "nextPage": true,
                    "label": "mwForm.pageFlow.goToNextPage"
                },
                "elements": [
                    {
                        "id": "7180d9e3d0c341bb99c91c73d5b97351",
                        "orderNo": 1,
                        "type": "question",
                        "question": {
                            "id": "ed9a53e5ebc4fd4cdf84686743c0b939",
                            "text": "short text",
                            "type": "text",
                            "required": true,
                            "pageFlowModifier": false
                        }
                    },
                    {
                        "id": "3f215923f068d5355ce9dcc61aa340c7",
                        "orderNo": 2,
                        "type": "question",
                        "question": {
                            "id": "46d605c6b29161e49918733ea2c21b10",
                            "text": "long text",
                            "type": "textarea",
                            "required": true,
                            "pageFlowModifier": false
                        }
                    },
                    {
                        "id": "2da74f344ce74b0c9c501f05dd27b94a",
                        "orderNo": 3,
                        "type": "question",
                        "question": {
                            "id": "16a37f04b1f2c4ed9ccad0f90c202f3e",
                            "text": "radio question",
                            "type": "radio",
                            "required": true,
                            "offeredAnswers": [
                                {
                                    "id": "c1860469d05cb0be1ef6c254809c207e",
                                    "orderNo": 2,
                                    "value": "bbbb",
                                    "pageFlow": {
                                        "nextPage": true,
                                        "label": "mwForm.pageFlow.goToNextPage"
                                    }
                                }
                            ],
                            "otherAnswer": true
                        }
                    },
                    {
                        "id": "a720b9734f64a7fd728df4cd5d995117",
                        "orderNo": 4,
                        "type": "question",
                        "question": {
                            "id": "3ba201eb2562dca36a5257ef3ff2be2d",
                            "text": "checkbox",
                            "type": "checkbox",
                            "required": true,
                            "offeredAnswers": [
                                {
                                    "id": "16eddc288f7e58b5c3407de778f933a1",
                                    "orderNo": 1,
                                    "value": "aaaa",
                                    "pageFlow": {
                                        "nextPage": true,
                                        "label": "mwForm.pageFlow.goToNextPage"
                                    }
                                },
                                {
                                    "id": "567678e87b794541a9e6f7e1376b562c",
                                    "orderNo": 2,
                                    "value": "bbb",
                                    "pageFlow": {
                                        "nextPage": true,
                                        "label": "mwForm.pageFlow.goToNextPage"
                                    }
                                },
                                {
                                    "id": "1e27b677f96d2d08ce0fb0d5723607da",
                                    "orderNo": 3,
                                    "value": "cccc",
                                    "pageFlow": {
                                        "nextPage": true,
                                        "label": "mwForm.pageFlow.goToNextPage"
                                    }
                                }
                            ],
                            "pageFlowModifier": false,
                            "otherAnswer": true
                        }
                    },
                    {
                        "id": "24490cf9c495cb33d4c8d2a0f813b817",
                        "orderNo": 5,
                        "type": "question",
                        "question": {
                            "id": "edb85ee7c9da14ffeb15bb9f8cfaffd3",
                            "text": "Is {{price}} a fair price?",
                            "type": "radio",
                            "required": true,
                            "offeredAnswers": [
                                {
                                    "id": "68a49a4f13203098f0fc6a744c1fe704",
                                    "orderNo": 1,
                                    "value": "yes",
                                    "pageFlow": {
                                        "nextPage": true,
                                        "label": "mwForm.pageFlow.goToNextPage"
                                    }
                                },
                                {
                                    "id": "53e006974790df5099ab26e9f2ce9c06",
                                    "orderNo": 2,
                                    "value": "{{noAnswer}}",
                                    "pageFlow": {
                                        "nextPage": true,
                                        "label": "mwForm.pageFlow.goToNextPage"
                                    }
                                }
                            ]
                        }
                    },
                    {
                        "id": "ee297f58ceec1470c9db35559409755c",
                        "orderNo": 6,
                        "type": "question",
                        "question": {
                            "id": "a7106ec0fba810a84899b8579f5fd924",
                            "text": "Is {{person.name}} age {{person.age}}?",
                            "type": "radio",
                            "required": true,
                            "offeredAnswers": [
                                {
                                    "id": "ae38733fc632753099f430b1c1ffcefc",
                                    "orderNo": 1,
                                    "value": "yes",
                                    "pageFlow": {
                                        "nextPage": true,
                                        "label": "mwForm.pageFlow.goToNextPage"
                                    }
                                },
                                {
                                    "id": "61a226f242d86522a49b786c654c4165",
                                    "orderNo": 2,
                                    "value": "no",
                                    "pageFlow": {
                                        "nextPage": true,
                                        "label": "mwForm.pageFlow.goToNextPage"
                                    }
                                }
                            ]
                        }
                    },
                    {
                        "id": "d3c87dfb2945a84ad79e9c4b888d7df3",
                        "orderNo": 7,
                        "type": "question",
                        "question": {
                            "id": "f9c1586e1f1f40705e1eefbd00224218",
                            "text": "range",
                            "type": "range",
                            "required": true,
                            "pageFlowModifier": false,
                            "min": 1,
                            "max": 10
                        }
                    },
                    {
                        "id": "1b183679857291f8ad46c03c3173e64d",
                        "orderNo": 8,
                        "type": "question",
                        "question": {
                            "id": "10b08afca4dff80e975f4910ee85ef3f",
                            "text": "grid question",
                            "type": "grid",
                            "required": true,
                            "grid": {
                                "cellInputType": "radio",
                                "rows": [
                                    {
                                        "id": "48b09d72e6fb0d2a63985eef4018346e",
                                        "orderNo": 1,
                                        "label": "row 1"
                                    },
                                    {
                                        "id": "f35a6e5d1ce9407b5ece224198032cb6",
                                        "orderNo": 2,
                                        "label": "row 2"
                                    }
                                ],
                                "cols": [
                                    {
                                        "id": "ace63d4001112c28e97b00ff67ceeeca",
                                        "orderNo": 1,
                                        "label": "col 1"
                                    },
                                    {
                                        "id": "24062ae1fc97dead41d337ede7f2e55e",
                                        "orderNo": 2,
                                        "label": "col2"
                                    }
                                ]
                            },
                            "pageFlowModifier": false
                        }
                    }
                ],
                "namedPage": false,
                "isFirst": true,
                "isLast": false
            },
            {
                "id": "d7b158cc2aff4c00b3d452006d79368d",
                "number": 2,
                "name": null,
                "description": null,
                "pageFlow": {
                    "nextPage": true,
                    "label": "mwForm.pageFlow.goToNextPage"
                },
                "elements": [
                    {
                        "id": "82332304478a82ee69f2d60157930e0a",
                        "orderNo": 1,
                        "type": "question",
                        "question": {
                            "id": "dc640ed493ba5a00d4a44f3a216cfa34",
                            "text": "priority list",
                            "type": "priority",
                            "required": true,
                            "priorityList": [
                                {
                                    "id": "c389bfb386b59483c7592719d9968d35",
                                    "orderNo": 1,
                                    "value": "aaaaaaaaaaaa"
                                },
                                {
                                    "id": "66a28c757482c280b30db318b5922201",
                                    "orderNo": 2,
                                    "value": "bbbbbbbbbb"
                                },
                                {
                                    "id": "14629777a4bda0e1d40044429aaf63f9",
                                    "orderNo": 3,
                                    "value": "cccccccccccccc"
                                }
                            ],
                            "pageFlowModifier": false
                        }
                    },
                    {
                        "id": "358c65a9f3590235b3b9d019722f2372",
                        "orderNo": 2,
                        "type": "question",
                        "question": {
                            "id": "8666ad943291900f0e5b34bc14bb18dc",
                            "text": "division",
                            "type": "division",
                            "required": true,
                            "divisionList": [
                                {
                                    "id": "dc3c109e947b736c49415faf0b595091",
                                    "orderNo": 1,
                                    "value": "aaaaaa"
                                },
                                {
                                    "id": "476d950019a69252524ac00d2a39ef54",
                                    "orderNo": 2,
                                    "value": "bbbbb"
                                },
                                {
                                    "id": "d9b54b9da75bdfe78d4cbc41d0cdf9e0",
                                    "orderNo": 3,
                                    "value": "cccccccc"
                                }
                            ],
                            "pageFlowModifier": false,
                            "quantity": 100,
                            "unit": "%"
                        }
                    }
                ],
                "namedPage": false,
                "isFirst": false,
                "isLast": false
            },
            {
                "id": "5d9fc08eaac5739f574db0e5b86a6a36",
                "number": 3,
                "name": "Page name",
                "description": null,
                "pageFlow": {
                    "nextPage": true,
                    "label": "mwForm.pageFlow.goToNextPage"
                },
                "elements": [
                    {
                        "id": "99f0e2587c29cde3abb2ab2076fc375c",
                        "orderNo": 1,
                        "type": "paragraph",
                        "paragraph": {
                            "id": "12448073a8702376af0b427b63022926",
                            "html": "Lorem {{templateData}} ipsum dolor sit amet, consectetur adipiscing elit. Nullam quis nunc quis nisi lacinia commodo quis in urna. Maecenas dictum urna eget fringilla vehicula. Morbi congue id dolor vel volutpat. Aenean suscipit lectus velit, eget eleifend massa pretium quis. Cras quis pharetra nulla. Proin porttitor fermentum est, eu aliquam velit porttitor quis. Sed non bibendum odio, a pellentesque neque. Donec eu lectus vitae nisl ornare aliquet. Donec ornare felis non elit malesuada tincidunt. Praesent ipsum augue, venenatis in auctor vel, aliquet et augue. Ut efficitur elit eu elit fringilla, imperdiet suscipit libero consequat. Ut in metus libero. Nullam vestibulum, augue nec varius elementum, erat orci iaculis neque, quis varius ante leo eu lectus. Vestibulum eget ante enim. Nulla lobortis, felis sed mattis posuere, urna leo pharetra mi, ut elementum augue erat sed odio. In mattis, orci nec maximus fermentum, tellus lacus porta purus, sed scelerisque massa justo id nunc."
                        }
                    },
                    {
                        "id": "2d9145a0b749ca85959268737c90029c",
                        "orderNo": 2,
                        "type": "image",
                        "image": {
                            "id": "e94d4dcdbc45d90d0561116518e13b77",
                            "align": "center",
                            "src": "lena.gif",
                            "caption": "Image caption"
                        }
                    },
                    {
                        "id": "1dfa4dc8242f7b98b5449d380fee1785",
                        "orderNo": 3,
                        "type": "question",
                        "question": {
                            "id": "7d8826e84a398532fbe78be646214eab",
                            "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit?",
                            "type": "textarea",
                            "required": true,
                            "pageFlowModifier": false
                        }
                    }
                ],
                "namedPage": true,
                "isFirst": false,
                "isLast": true
            }
        ]
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