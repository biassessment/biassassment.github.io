var app = angular.module('bi-assessment.filters', [])

  .filter('object2Array', function () {
      return function (input) {
          var out = [];
          for (i in input) {
              out.push(input[i]);
          }
          return out;
      }
  });