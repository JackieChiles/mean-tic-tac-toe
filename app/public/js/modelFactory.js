'use strict';

var modelFactory = function () {
    var Game = function () {
        var self = this;
        
        //Functions
        self.getFreshBoard = function () {
            var row = 0;
            var col = 0;
            var positions = [];

            for (row = 0; row < self.size; row++) {
                positions.push([]);

                for (col = 0; col < self.size; col++) {
                    positions[row].push({
                        row: row,
                        col: col,
                        player: null
                    });
                }
            }

            return positions;
        };
        
        self.getNextPlayer = function (lastPlayer) {
            return lastPlayer === 'X' ? 'O' : 'X';
        };
        
        self.play = function (cell) {
            self.positions[cell.row][cell.col].player = cell.player;
            self.currentPlayer = self.getNextPlayer(cell.player);
            
            //If winner has not been declared, check for winner on this play
            self.winner || (self.winner = self.getWinner(cell.row, cell.col));
        };
        
        self.isBoardFull = function () {
            //Filter down to rows with empty cells: board full if there are none
            return self.positions.filter(function (row) {
                //Filter down to empty cells
                return row.filter(function (cell) {
                    return !cell.player;
                }).length > 0;
            }).length === 0;
        };

        self.isPlayLegal = function (cell) {
            return cell.player === self.currentPlayer && !self.positions[cell.row][cell.col].player && !self.isGameOver();
        };
        
        //Returns winner if the given cell leads to a row-win, null otherwise
        self.getRowWinner = function (row, col) {
            var player = self.positions[row][col].player;

            return self.positions[row].filter(function (cell) {
                return cell.player === player;
            }).length === self.size ? player : null;
        };

        //Returns winner if the given cell leads to a column-win, null otherwise
        self.getColumnWinner = function (row, col) {
            var player = self.positions[row][col].player;
            var isWinner = true;
            var i = 0;

            //Look for the first play not made by this player in the column and exit
            for (i = 0; i < self.size; i++) {
                if (self.positions[i][col].player !== player) {
                    isWinner = false;
                    break;
                }
            }

            return isWinner ? player : null;
        };

        //Returns winner if the given cell leads to a diagonal-win, null otherwise
        self.getDiagonalWinner = function (row, col) {
            var player = self.positions[row][col].player;
            var isTopLeftDiagWinner = true;
            var isBottomLeftDiagWinner = true;
            var i = 0;

            //If the play was not on a diagonal, it's not a diagonal-win
            if (row !== col && row !== self.size - 1 - col) {
                return null;
            }

            //Examine both diagonals in each row for values not matching the current player
            for (i = 0; i < self.size; i++) {
                row = self.positions[i];

                isTopLeftDiagWinner = isTopLeftDiagWinner && row[i].player === player;
                isBottomLeftDiagWinner = isBottomLeftDiagWinner && row[self.size - 1 - i].player === player;

                //Stop looking if neither diagonal is a winner
                if (!isTopLeftDiagWinner && !isBottomLeftDiagWinner) {
                    break;
                }
            }

            return isTopLeftDiagWinner || isBottomLeftDiagWinner ? player : null;
        };
        
        self.getWinner = function (row, col) {
            return self.getColumnWinner(row, col) ||
                self.getRowWinner(row, col) ||
                self.getDiagonalWinner(row, col);
        };
        
        self.isGameOver = function () {
            return self.winner || self.isBoardFull();
        };
        
        //Data
        self.size = 3;
        self.positions = self.getFreshBoard();
        self.currentPlayer = 'X';
        self.gameOver = false;
        self.winner = null;
    };
    
    return {
        newGame: function () {
            return new Game();
        }
    };
};

//Expose the module to Node if available.
if(typeof module !== 'undefined') {
    module.exports = modelFactory();
}