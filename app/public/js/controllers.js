(function () {
    'use strict';

    var app = angular.module('tttApp', []);

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
        };
        
        //Board full check function
        var isBoardFull = function () {
            //Filter down to rows with empty cells: board full if there are none
            return $scope.positions.filter(function (row) {
                //Filter down to empty cells
                return row.filter(function (cell) {
                    return cell.value !== 'X' && cell.value !== 'O';
                }).length > 0;
            }).length === 0;
        };
        
        var isPlayLegal = function(cell) {
            return cell.value !== 'X' && cell.value !== 'O';
        };
        
        //Scope data
        $scope.size = 3;
        $scope.positions = getFreshBoard();
        $scope.currentPlayer = 'X';
        $scope.currentPlayerMessage = function () {
            return 'Current player: ' + $scope.currentPlayer;
        };
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
            
            if (!isPlayLegal(cell)) {
                alert('Illegal play!!!');
                return;
            }
            
            //Make the play at the selected position
            $scope.positions[row][col].value = $scope.currentPlayer;
            
            //Check for a win
            winner = $scope.winner(row, col);
            
            if (winner) {
                setTimeout(function () {
                    alert(winner + " wins!!! Resetting board...");
                    $scope.$apply(function() {
                        $scope.positions = getFreshBoard();
                    });
                }, 100);
            }
            else if (isBoardFull()) {
                //If there is no winner, it's a cat's game
                setTimeout(function () {
                    alert("Cat's game!!! Resetting board...");
                    $scope.$apply(function() {
                        $scope.positions = getFreshBoard();
                    });
                }, 100);
            }
            
            //Change players
            $scope.currentPlayer = $scope.currentPlayer === 'X' ? 'O' : 'X';
        };
    });
}());