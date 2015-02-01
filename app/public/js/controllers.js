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
        
        //Returns winner if the given cell leads to a row-win, null otherwise
        var rowWinner = function (row, col) {
            var player = $scope.positions[row][col].value;
            
            return $scope.positions[row].filter(function (cell) {
                return cell.value === player;
            }).length === $scope.size ? player : null;
        };
        
        //Returns winner if the given cell leads to a column-win, null otherwise
        var columnWinner = function (row, col) {
            var player = $scope.positions[row][col].value;
            var isWinner = true;
            var i = 0;
            
            //Look for the first play not made by this player in the column and exit
            for (i = 0; i < $scope.size; i++) {
                if ($scope.positions[i][col].value !== player) {
                    isWinner = false;
                    break;
                }
            }
            
            return isWinner ? player : null;
        };
        
        //Returns winner if the given cell leads to a diagonal-win, null otherwise
        var diagonalWinner = function (row, col) {
            var player = $scope.positions[row][col].value;
            var isTopLeftDiagWinner = true;
            var isBottomLeftDiagWinner = true;
            var i = 0;
            var row;
            
            //If the play was not on a diagonal, it's not a diagonal-win
            if (row !== col && row !== $scope.size - 1 - col) {
                return null;
            }
            
            //Examine both diagonals in each row for values not matching the current player
            for (i = 0; i < $scope.size; i++) {
                row = $scope.positions[i];
                
                isTopLeftDiagWinner = isTopLeftDiagWinner && row[i].value === player;
                isBottomLeftDiagWinner = isBottomLeftDiagWinner && row[$scope.size - 1 - i].value === player;
                
                //Stop looking if neither diagonal is a winner
                if (!isTopLeftDiagWinner && !isBottomLeftDiagWinner) {
                    break;
                }
            }
            
            return isTopLeftDiagWinner || isBottomLeftDiagWinner ? player : null;
        };
        
        //Scope data
        $scope.size = 3;
        $scope.positions = getFreshBoard();
        $scope.currentPlayer = 'X';
        $scope.currentPlayerMessage = function () {
            return 'Current player: ' + $scope.currentPlayer;
        };
        $scope.currentMessage = '';
        $scope.showResetButton = false;
        $scope.winner = function (row, col) {
            return columnWinner(row, col) || rowWinner(row, col) || diagonalWinner(row, col);
        };
        $scope.play = function (cell) {
            var winner = null;
            var row = cell.row;
            var col = cell.col;
            
            if (!isPlayLegal(cell)) {
                $scope.currentMessage = 'Illegal play!!!';
                return;
            }
            
            //Make the play at the selected position
            $scope.positions[row][col].value = $scope.currentPlayer;
            
            //Check for a win
            winner = $scope.winner(row, col);
            
            if (winner) {
                $scope.currentMessage = winner + ' wins!!!';
                $scope.showResetButton = true;
            }
            else if (isBoardFull()) {
                //If there is no winner, it's a cat's game
                $scope.currentMessage = "Cat's game!!!";
                $scope.showResetButton = true;
            }
            
            //Change players
            $scope.currentPlayer = $scope.currentPlayer === 'X' ? 'O' : 'X';
        };
        $scope.resetBoard = function () {
            $scope.showResetButton = false;
            $scope.positions = getFreshBoard();
            $scope.currentMessage = '';
        };
    });
}());