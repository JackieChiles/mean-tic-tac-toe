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
        $scope.size = 3;
        $scope.positions = (function () {
            var row = 0;
            var col = 0;
            var positions = [];
            
            for (row = 0; row < $scope.size; row++) {
                positions.push([]);
                
                for(col = 0; col < $scope.size; col++) {
                    positions[row].push({
                        row: row,
                        col: col,
                        value: row * $scope.size + col
                    });
                }
            }
            
            return positions;
        })();
        console.log($scope.positions);
        $scope.currentPlayer = 'X';
        $scope.winner = function (row, col) {
            var player = $scope.positions[row][col].value;
            
            //Check row
            var rWinner = $scope.positions[row].filter(function (cell) {
                return cell.value === player;
            }).length === $scope.size;
            
            //TODO: Check column
            
            //TODO: Check diagonals
            
            return rWinner ? player : null;
        };
        $scope.play = function (cell) {
            var winner = null;
            var row = cell.row;
            var col = cell.col;
            
            //Make the play at the selected position
            $scope.positions[row][col].value = $scope.currentPlayer;
            
            //Check for a win
            winner = $scope.winner(row, col);
            
            if(winner) {
                alert(winner + " wins!!!");
                //TODO: reset board
            }
            
            //Change players
            $scope.currentPlayer = $scope.currentPlayer === 'X' ? 'O' : 'X';
        };
    });
}());