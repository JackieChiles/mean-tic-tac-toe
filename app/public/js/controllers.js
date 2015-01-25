(function () {
    'use strict';

    var app = angular.module('tttApp', []);
    
    //Custom 'range' filter for doing ng-repeat n times
    app.filter('range', function () {
        return function (val, range) {
            var i = 0;
            
            range = parseInt(range, 10);
            
            for (i = 0; i < range; i++) {
                val.push(i);
            }
            
            return val;
        };
    });

    app.controller('BoardController', function ($scope) {
        $scope.boardSize = 3;
    });
}());