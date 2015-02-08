'use strict';

var app = angular.module('tttApp', []);

app.controller('BoardController', function ($scope, socket, modelFactory) {
    //Socket setup
    socket.on('play', function (msg) {
        $scope.game.play(msg);
    });
    
    $scope.room = ROOM_NUM;
    
    //Functions
    $scope.play = function (cell) {
        //Don't submit play if board is not enabled
        if ($scope.isBoardEnabled()) {
            socket.emit('play', {
                row: cell.row,
                col: cell.col,
                player: $scope.myPlayer
            });
        }
    };
    
    $scope.reset = function () {
        //Data
        $scope.game = modelFactory.newGame();
        $scope.myPlayer = null;
        
        //Join the game
        socket.emit('join', {
            room: $scope.room
        }, function (msg) {
            $scope.myPlayer = msg.player;
        });
    };
    
    $scope.getMyPlayerMessage = function () {
        return $scope.myPlayer ? 'You are playing as: ' + $scope.myPlayer :
            'You are currently observing the game.';
    };
    
    $scope.getCurrentMessage = function () {
        var winner = $scope.game.winner;

        if (winner) {
            return winner + ' wins!!!';
        }
        else if ($scope.game.isBoardFull()) {
            return "Cat's game!!!";
        }
        else {
            return null;
        }
    };
    
    $scope.getCurrentPlayerMessage = function () {
        return 'Current player: ' + $scope.game.currentPlayer;
    };
    
    $scope.isBoardEnabled = function () {
        return $scope.myPlayer === $scope.game.currentPlayer && !$scope.game.isBoardFull();
    };
    
    //Initialize controller
    $scope.reset();
});