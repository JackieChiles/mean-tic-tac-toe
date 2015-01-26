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
        //Board reset function
        var getFreshBoard = function () {
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
        }
        
        //Scope data
        $scope.size = 3;
        $scope.positions = getFreshBoard();
        $scope.currentPlayer = 'X';
        $scope.winner = function (row, col) {
            var player = $scope.positions[row][col].value;
            
            //Check row
            var rWinner = $scope.positions[row].filter(function (cell) {
                return cell.value === player;
            }).length === $scope.size;
            
            //Check column
            var cWinner = true;
            var i = 0;
            
            for (i = 0; i < $scope.size; i++) {
                if ($scope.positions[i][col].value !== player) {
                    cWinner = false;
                    break;
                }
            }
            
            //TODO: Check diagonals
            
            return rWinner || cWinner ? player : null;
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
                alert(winner + " wins!!! Resetting board...");
                $scope.positions = getFreshBoard();
            }
            
            //TODO: check for cat
            
            //Change players
            $scope.currentPlayer = $scope.currentPlayer === 'X' ? 'O' : 'X';
        };
    });
}());